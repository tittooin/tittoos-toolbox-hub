
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
}
