
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
            keywords="linux cli commands, bash cheatsheet, ubuntu terminal, chmod, grep, tar, ssh, top"
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

            </div>
        </GenericCommandTool>
    );
};

export default LinuxCommandGenerator;
