
import React from 'react';
import GenericCommandTool from "@/components/GenericCommandTool";
import { Terminal, Server, Lock, Database, List } from 'lucide-react';

const LinuxCommandGenerator = () => {
    return (
        <GenericCommandTool
            title="Linux Terminal Generator"
            description="Generate Bash commands for Ubuntu, Debian, CentOS, and more."
            osName="Linux Bash"
            icon={Terminal}
            keywords="linux command generator, bash script generator, ubuntu terminal helper, linux cli"
        >
            <div className="space-y-12">

                {/* Intro */}
                <div>
                    <h2 className="text-3xl font-bold mb-6">The Language of the Cloud</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Linux powers 90% of the public cloud, the world's top 500 supercomputers, and most of the internet's infrastructure.
                        Mastering the <strong>Bash (Bourne Again SHell)</strong> is the single most valuable skill for any developer or sysadmin.
                    </p>
                </div>

                {/* Concepts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-card border rounded-2xl p-6 shadow-sm">
                        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mb-4">
                            <Server className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Everything is a File</h3>
                        <p className="text-muted-foreground">
                            In Linux, hardware devices, network sockets, and processes are all represented as files.
                            This means you can read data from a hard drive (<code>/dev/sda</code>) or a random number generator (<code>/dev/urandom</code>) using the same commands you use to read a text file.
                        </p>
                    </div>

                    <div className="bg-card border rounded-2xl p-6 shadow-sm">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                            <Lock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Permissions (rwx)</h3>
                        <p className="text-muted-foreground">
                            Linux security is built on file ownership. Every file belongs to a <strong>User</strong> and a <strong>Group</strong>.
                            Permissions are defined as Read (4), Write (2), and Execute (1).
                        </p>
                    </div>
                </div>

                {/* Reference Table */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b pb-4">
                        <List className="w-8 h-8 text-primary" />
                        <h2 className="text-3xl font-bold m-0">Essential Linux Commands</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-4 font-bold text-lg w-1/4">Command</th>
                                    <th className="p-4 font-bold text-lg">Use Case</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                <tr>
                                    <td className="p-4 font-mono text-amber-600 dark:text-amber-400">ls -lah</td>
                                    <td className="p-4">List all files including hidden ones, with details and human-readable sizes.</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-mono text-amber-600 dark:text-amber-400">cd /path/to</td>
                                    <td className="p-4">Change Directory. Use <code>cd ..</code> to go back comfortably.</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-mono text-amber-600 dark:text-amber-400">grep -r "text" .</td>
                                    <td className="p-4">Search for "text" recursively inside all files in the current folder.</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-mono text-amber-600 dark:text-amber-400">chmod +x file</td>
                                    <td className="p-4">Make a file executable (usually a script).</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-mono text-amber-600 dark:text-amber-400">chown user:group file</td>
                                    <td className="p-4">Change the owner and group of a file.</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-mono text-amber-600 dark:text-amber-400">top / htop</td>
                                    <td className="p-4">Display real-time system resource usage (CPU, RAM).</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-mono text-amber-600 dark:text-amber-400">curl -O url</td>
                                    <td className="p-4">Download a file from the internet via the terminal.</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-mono text-amber-600 dark:text-amber-400">tar -czvf name.tar.gz folder</td>
                                    <td className="p-4">Compress a folder into a .tar.gz archive.</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-mono text-amber-600 dark:text-amber-400">ssh user@host</td>
                                    <td className="p-4">Secure Shell. Connect to a remote server securely.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Deep Dive */}
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold">Key Command Patterns</h2>

                    <div className="prose dark:prose-invert max-w-none">
                        <h3>1. The Sudo Command</h3>
                        <p>
                            <code>sudo</code> stands for "SuperUser DO". It grants you administrative privileges for a single command.
                            You should never log in as the root user directly; instead, use <code>sudo</code> only when necessary.
                        </p>

                        <h3>2. Package Management</h3>
                        <p>
                            Unlike Windows, you don't download .exe installers from websites. You use a repository.
                        </p>
                        <ul>
                            <li><strong>Debian/Ubuntu:</strong> <code>apt update && apt install package-name</code></li>
                            <li><strong>Fedora/CentOS:</strong> <code>dnf install package-name</code></li>
                            <li><strong>Arch Linux:</strong> <code>pacman -S package-name</code></li>
                        </ul>

                        <h3>3. IO Redirection</h3>
                        <p>
                            The power of Linux comes from streams.
                        </p>
                        <ul>
                            <li><code>{`>`}</code> : Redirect output to a file (overwrite). Example: <code>ls {`>`} file.txt</code></li>
                            <li><code>{`>>`}</code> : Append output to a file.</li>
                            <li><code>|</code> (Pipe): Send the output of Command A into the input of Command B. Example: <code>cat logs.txt | grep "Error"</code></li>
                        </ul>
                    </div>
                </div>

            </div>
        </GenericCommandTool>
    );
};

export default LinuxCommandGenerator;
