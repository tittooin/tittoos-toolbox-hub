
interface GitHubFileResponse {
    sha: string;
    content: string;
}

export class GitHubClient {
    private token: string;
    private owner: string;
    private repo: string;
    private branch: string;

    constructor(token: string, owner: string = 'tittooin', repo: string = 'tittoos-toolbox-hub', branch: string = 'main') {
        this.token = token;
        this.owner = owner;
        this.repo = repo;
        this.branch = branch;
    }

    async getFile(path: string): Promise<GitHubFileResponse | null> {
        try {
            const response = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}?ref=${this.branch}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
            });

            if (response.status === 404) return null;
            if (!response.ok) throw new Error(`GitHub API Error: ${response.statusText}`);

            return await response.json();
        } catch (error) {
            console.error("Error fetching file from GitHub:", error);
            throw error;
        }
    }

    async updateFile(path: string, content: string, message: string, sha?: string): Promise<void> {
        // Base64 encode the content (handle Unicode strings correctly)
        const encodedContent = btoa(unescape(encodeURIComponent(content)));

        const body: any = {
            message,
            content: encodedContent,
            branch: this.branch,
        };

        if (sha) {
            body.sha = sha;
        }

        console.log(`[GitHubClient] ${sha ? 'Updating' : 'Creating'} file at ${path}...`);

        const response = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            // Specific help for 404
            if (response.status === 404) {
                throw new Error(`GitHub 404 Error: Repo '${this.owner}/${this.repo}' not found. Check your GitHub Token (needs 'repo' scope) and Repo Name.`);
            }
            throw new Error(`Failed to update file: ${errorData.message}`);
        }
    }

    async commitMultipleFiles(files: { path: string; content: string }[], message: string): Promise<void> {
        try {
            console.log(`[GitHubClient] Starting atomic commit for ${files.length} files...`);

            // 1. Get the SHA of the latest commit on the branch
            const refResponse = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/git/ref/heads/${this.branch}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
            });

            if (!refResponse.ok) {
                throw new Error(`Failed to get branch ref: ${refResponse.statusText}`);
            }

            const refData = await refResponse.json();
            const parentCommitSha = refData.object.sha;

            // 2. Get the tree SHA associated with the parent commit
            const commitResponse = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/git/commits/${parentCommitSha}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
            });

            if (!commitResponse.ok) {
                throw new Error(`Failed to get parent commit: ${commitResponse.statusText}`);
            }

            const commitData = await commitResponse.json();
            const baseTreeSha = commitData.tree.sha;

            // 3. Create the tree object
            const treeItems = files.map(file => ({
                path: file.path,
                mode: '100644',
                type: 'blob',
                content: file.content
            }));

            const treeResponse = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/git/trees`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json',
                },
                body: JSON.stringify({
                    base_tree: baseTreeSha,
                    tree: treeItems
                })
            });

            if (!treeResponse.ok) {
                const errData = await treeResponse.json().catch(() => ({ message: treeResponse.statusText }));
                throw new Error(`Failed to create tree: ${errData.message}`);
            }

            const treeData = await treeResponse.json();
            const newTreeSha = treeData.sha;

            // 4. Create the commit object
            const createCommitResponse = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/git/commits`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json',
                },
                body: JSON.stringify({
                    message,
                    tree: newTreeSha,
                    parents: [parentCommitSha]
                })
            });

            if (!createCommitResponse.ok) {
                const errData = await createCommitResponse.json().catch(() => ({ message: createCommitResponse.statusText }));
                throw new Error(`Failed to create commit: ${errData.message}`);
            }

            const createdCommitData = await createCommitResponse.json();
            const newCommitSha = createdCommitData.sha;

            // 5. Update the reference to point to the new commit
            const updateRefResponse = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/git/refs/heads/${this.branch}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json',
                },
                body: JSON.stringify({
                    sha: newCommitSha,
                    force: false
                })
            });

            if (!updateRefResponse.ok) {
                const errData = await updateRefResponse.json().catch(() => ({ message: updateRefResponse.statusText }));
                throw new Error(`Failed to update reference: ${errData.message}`);
            }

            console.log(`[GitHubClient] Successfully pushed atomic commit: ${newCommitSha}`);
        } catch (error) {
            console.error("Error in atomic multi-file commit:", error);
            throw error;
        }
    }
}
