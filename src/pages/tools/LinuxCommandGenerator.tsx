
import React from 'react';
import GenericCommandTool from "@/components/GenericCommandTool";
import CommandCheatsheet from "@/components/CommandCheatsheet";
import { Terminal, Lock, Server, Wifi, FolderOpen, Package } from 'lucide-react';

const LinuxCommandGenerator = () => {

    const categories = [
        {
            title: "File Operations",
            icon: FolderOpen,
            colorClass: "text-amber-500",
            commands: [
                { cmd: "ls -lah", desc: "List all files (detailed, hidden, human-readable)" },
                { cmd: "cd /path/to/dir", desc: "Change directory" },
                { cmd: "pwd", desc: "Print Working Directory" },
                { cmd: "mkdir folder_name", desc: "Create new folder" },
                { cmd: "rm -rf folder_name", desc: "Delete folder recursively (Force)" },
                { cmd: "cp -r source dest", desc: "Copy folder recursively" },
                { cmd: "mv old.txt new.txt", desc: "Move or Rename file" },
                { cmd: "cat file.txt", desc: "Display file content" },
                { cmd: "tail -f log.txt", desc: "Watch file changes in real-time" },
                { cmd: "grep -r 'text' .", desc: "Search text in all files" },
                { cmd: "find . -name '*.js'", desc: "Find files by extension" },
            ]
        },
        {
            title: "System & Ops",
            icon: Server,
            colorClass: "text-purple-500",
            commands: [
                { cmd: "sudo command", desc: "Run command as SuperUser (Root)" },
                { cmd: "htop", desc: "Interactive process viewer (CPU/RAM)" },
                { cmd: "df -h", desc: "Show disk space usage" },
                { cmd: "free -m", desc: "Show RAM usage in MB" },
                { cmd: "uname -a", desc: "Show kernel version info" },
                { cmd: "ps aux | grep node", desc: "Find a running process" },
                { cmd: "kill -9 PID", desc: "Force kill a process by ID" },
                { cmd: "history", desc: "Show command history" },
                { cmd: "shutdown -h now", desc: "Shutdown immediately" },
                { cmd: "reboot", desc: "Restart immediately" },
            ]
        },
        {
            title: "Networking",
            icon: Wifi,
            colorClass: "text-blue-500",
            commands: [
                { cmd: "ip a", desc: "Show network interfaces & IP" },
                { cmd: "ping 1.1.1.1", desc: "Test connectivity" },
                { cmd: "curl -I https://google.com", desc: "Check website headers" },
                { cmd: "wget file_url", desc: "Download file from URL" },
                { cmd: "ssh user@host", desc: "Remote login via SSH" },
                { cmd: "netstat -tulpn", desc: "Show ports listening" },
                { cmd: "dig domain.com", desc: "DNS lookup" },
            ]
        },
        {
            title: "Permissions & Packages",
            icon: Lock,
            colorClass: "text-red-500",
            commands: [
                { cmd: "chmod +x script.sh", desc: "Make file executable" },
                { cmd: "chmod 755 file", desc: "Standard permission (Read/Exec)" },
                { cmd: "chown user:group file", desc: "Change file owner" },
                { cmd: "sudo apt update && sudo apt upgrade", desc: "Update System (Debian/Ubuntu)" },
                { cmd: "sudo apt install package", desc: "Install App (Debian/Ubuntu)" },
                { cmd: "tar -czvf archive.tar.gz folder", desc: "Compress folder" },
                { cmd: "unzip file.zip", desc: "Extract zip file" },
            ]
        }
    ];

    return (
        <GenericCommandTool
            title="Linux Bash Cheat Sheet & Generator"
            description="The definitive interactive guide for Linux Terminal. Ubuntu, Debian, CentOS commands categorized."
            osName="Linux Bash"
            icon={Terminal}
            keywords="linux commands, bash cheatsheet, ls, grep, chmod, chown, tar, ssh, systemctl"
            path="/tools/linux-cmd-gen"
        >
            <div className="space-y-12">

                {/* Intro */}
                <div>
                    <h2 className="text-3xl font-bold mb-6">Master the Linux Shell</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                        Linux powers the web. Use this interactive cheat sheet to quickly find and copy essential Bash commands.
                    </p>

                    <div className="bg-muted/50 p-6 rounded-xl border border-border">
                        <CommandCheatsheet categories={categories} />
                    </div>
                </div>

                {/* Deep Dive */}
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold">Key Concepts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-card border rounded-2xl p-6 shadow-sm">
                            <h3 className="text-xl font-bold mb-2">Everything is a File</h3>
                            <p className="text-muted-foreground">In Linux, hard drives, processes, and even network connections are treated as files. This means <code>cat</code> or <code>echo</code> works on almost anything.</p>
                        </div>
                        <div className="bg-card border rounded-2xl p-6 shadow-sm">
                            <h3 className="text-xl font-bold mb-2">IO Redirection</h3>
                            <p className="text-muted-foreground">
                                Use <code>|</code> (Pipe) to verify logs: <code>cat logs.txt | grep "Error"</code>. <br />
                                Use <code>{`>`}</code> to write to files: <code>echo "Hello" {`>`} hello.txt</code>.
                            </p>
                        </div>
                    </div>
                </div>

                {/* SEO Blog Article */}
                <article className="prose dark:prose-invert max-w-none pt-12 border-t mt-12">
                    <h1>The Ultimate Guide to Linux Bash for Beginners</h1>

                    <p className="lead text-xl text-muted-foreground">
                        Linux is the operating system of the internet. From the Android phone in your pocket to the servers running Google and Facebook, Linux is everywhere.
                        At its heart is the <strong>Bash Shell</strong>. Mastering it is the first step to becoming a DevOps engineer or advanced developer.
                    </p>

                    <h2>Understanding the Linux File System</h2>
                    <p>
                        Unlike Windows, which uses drive letters like <code>C:\</code> and <code>D:\</code>, Linux uses a <strong>Single Hierarchical Tree</strong>.
                        Everything starts at the Root (<code>/</code>).
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><code>/bin</code>: Essential binaries (commands like ls, cp).</li>
                        <li><code>/home</code>: Where user documents and data live (like C:\Users).</li>
                        <li><code>/etc</code>: System configuration files.</li>
                        <li><code>/var</code>: Variable files like logs (<code>/var/log</code>) and websites (<code>/var/www</code>).</li>
                    </ul>

                    <h2>The Power of permissions: chmod and chown</h2>
                    <p>
                        Linux was built as a multi-user system from day one. Security is enforced through permissions.
                        If you ever get an "Access Denied" error, it's a permission issue.
                    </p>
                    <div className="bg-muted p-4 rounded-lg my-4 font-mono text-sm">
                        -rwxr-xr-- 1 user group 4096 Jan 1 12:00 script.sh
                    </div>
                    <p>
                        The weird string <code>rwxr-xr--</code> tells you exactly who can do what.
                        <strong>r</strong> = Read, <strong>w</strong> = Write, <strong>x</strong> = Execute.
                        Use the <code>chmod</code> command to change these.
                    </p>

                    <h3>Common `chmod` Patterns</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose">
                        <li className="border p-4 rounded bg-background">
                            <strong className="block text-primary">777</strong>
                            <span className="text-sm text-muted-foreground">Everyone can read, write, and execute. (Dangerous!)</span>
                        </li>
                        <li className="border p-4 rounded bg-background">
                            <strong className="block text-primary">755</strong>
                            <span className="text-sm text-muted-foreground">Owner can do everything; others can only read/execute. (Standard for scripts)</span>
                        </li>
                        <li className="border p-4 rounded bg-background">
                            <strong className="block text-primary">600</strong>
                            <span className="text-sm text-muted-foreground">Only the owner can read/write. No one else. (Standard for SSH keys)</span>
                        </li>
                    </ul>

                    <h2>Why use the Command Line instead of GUI?</h2>
                    <p>
                        1. <strong>Speed:</strong> Typing <code>mv *.jpg photos/</code> moves 10,000 files instantly. Dragging them would crash Finder/Explorer.<br />
                        2. <strong>Automation:</strong> You can save commands in a file (a script) and run it daily (cron job).<br />
                        3. <strong>Standard In/Out:</strong> You can pipe the output of one program into another.
                    </p>

                    <h2>Conclusion</h2>
                    <p>
                        Don't be afraid of the black screen. Use the <strong>Generator Tool</strong> above to safely build and understand commands before you run them.
                        With practice, the terminal becomes faster and easier than any mouse-based interface.
                    </p>
                </article>
            </div>
        </GenericCommandTool>
    );
};

export default LinuxCommandGenerator;
