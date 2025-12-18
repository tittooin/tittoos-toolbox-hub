
import React from 'react';
import GenericCommandTool from "@/components/GenericCommandTool";
import { Terminal, Lock, Server, Wifi, FolderOpen, Package, List } from 'lucide-react';

const LinuxCommandGenerator = () => {
    return (
        <GenericCommandTool
            title="Linux Bash Cheat Sheet & Generator"
            description="The definitive guide for Linux Terminal. Ubuntu, Debian, CentOS commands categorized."
            osName="Linux Bash"
            icon={Terminal}
            keywords="linux cli commands, bash cheatsheet, ubuntu terminal, chmod, grep, tar, ssh, top"
        >
            <div className="space-y-12">

                {/* Intro */}
                <div>
                    <h2 className="text-3xl font-bold mb-6">Master the Linux Shell</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Linux powers the internet. Whether you are managing a server or just learning Ubuntu, these commands are your daily drivers.
                        Below is a categorized list of essential Bash commands.
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* File & Directory */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 border-b pb-2">
                            <FolderOpen className="text-amber-500" />
                            <h3 className="text-2xl font-bold m-0">Files & Navigation</h3>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-muted-foreground border-b"><th className="pb-2">Command</th><th className="pb-2">Usage</th></tr>
                            </thead>
                            <tbody className="divide-y">
                                <tr><td className="py-2 font-mono text-amber-600">ls -lah</td><td>List all files + hidden + sizes</td></tr>
                                <tr><td className="py-2 font-mono text-amber-600">cd /home</td><td>Change directory</td></tr>
                                <tr><td className="py-2 font-mono text-amber-600">pwd</td><td>Show current path</td></tr>
                                <tr><td className="py-2 font-mono text-amber-600">mkdir [name]</td><td>Create folder</td></tr>
                                <tr><td className="py-2 font-mono text-amber-600">rm -rf [folder]</td><td>Delete folder (Force)</td></tr>
                                <tr><td className="py-2 font-mono text-amber-600">cp -r [src] [dst]</td><td>Copy folder</td></tr>
                                <tr><td className="py-2 font-mono text-amber-600">mv [old] [new]</td><td>Move or Rename</td></tr>
                                <tr><td className="py-2 font-mono text-amber-600">cat [file]</td><td>Read file content</td></tr>
                                <tr><td className="py-2 font-mono text-amber-600">nano [file]</td><td>Edit file text</td></tr>
                                <tr><td className="py-2 font-mono text-amber-600">find . -name "x"</td><td>Find file by name</td></tr>
                                <tr><td className="py-2 font-mono text-amber-600">grep -r "txt" .</td><td>Search text inside files</td></tr>
                            </tbody>
                        </table>
                    </div>

                    {/* System Info */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 border-b pb-2">
                            <Server className="text-purple-500" />
                            <h3 className="text-2xl font-bold m-0">System & Ops</h3>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-muted-foreground border-b"><th className="pb-2">Command</th><th className="pb-2">Usage</th></tr>
                            </thead>
                            <tbody className="divide-y">
                                <tr><td className="py-2 font-mono text-purple-600">sudo [cmd]</td><td>Run as Admin (Root)</td></tr>
                                <tr><td className="py-2 font-mono text-purple-600">htop / top</td><td>Task manager (CPU/RAM)</td></tr>
                                <tr><td className="py-2 font-mono text-purple-600">df -h</td><td>Disk space usage</td></tr>
                                <tr><td className="py-2 font-mono text-purple-600">free -m</td><td>Check RAM usage</td></tr>
                                <tr><td className="py-2 font-mono text-purple-600">uname -a</td><td>Kernel version info</td></tr>
                                <tr><td className="py-2 font-mono text-purple-600">ps aux</td><td>List running processes</td></tr>
                                <tr><td className="py-2 font-mono text-purple-600">kill [pid]</td><td>Stop specific process</td></tr>
                                <tr><td className="py-2 font-mono text-purple-600">history</td><td>Show recent commands</td></tr>
                                <tr><td className="py-2 font-mono text-purple-600">reboot</td><td>Restart server</td></tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Network */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 border-b pb-2">
                            <Wifi className="text-blue-500" />
                            <h3 className="text-2xl font-bold m-0">Network & Web</h3>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-muted-foreground border-b"><th className="pb-2">Command</th><th className="pb-2">Usage</th></tr>
                            </thead>
                            <tbody className="divide-y">
                                <tr><td className="py-2 font-mono text-blue-600">ip a</td><td>Show IP info (Modern)</td></tr>
                                <tr><td className="py-2 font-mono text-blue-600">ifconfig</td><td>Show IP (Legacy)</td></tr>
                                <tr><td className="py-2 font-mono text-blue-600">ping google.com</td><td>Test connection</td></tr>
                                <tr><td className="py-2 font-mono text-blue-600">curl [url]</td><td>Fetch web page source</td></tr>
                                <tr><td className="py-2 font-mono text-blue-600">wget [url]</td><td>Download file</td></tr>
                                <tr><td className="py-2 font-mono text-blue-600">ssh user@ip</td><td>Remote login</td></tr>
                                <tr><td className="py-2 font-mono text-blue-600">netstat -tulpn</td><td>Show listening ports</td></tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Permissions & Packages */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 border-b pb-2">
                            <Lock className="text-red-500" />
                            <h3 className="text-2xl font-bold m-0">Permissions & Apps</h3>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-muted-foreground border-b"><th className="pb-2">Command</th><th className="pb-2">Usage</th></tr>
                            </thead>
                            <tbody className="divide-y">
                                <tr><td className="py-2 font-mono text-red-600">chmod +x [file]</td><td>Make executable</td></tr>
                                <tr><td className="py-2 font-mono text-red-600">chmod 777 [file]</td><td>Give Full Permissions</td></tr>
                                <tr><td className="py-2 font-mono text-red-600">chown user:group</td><td>Change ownership</td></tr>
                                <tr><td className="py-2 font-mono text-red-600">apt update</td><td>Update app list (Ubuntu)</td></tr>
                                <tr><td className="py-2 font-mono text-red-600">apt install [app]</td><td>Install app (Ubuntu)</td></tr>
                                <tr><td className="py-2 font-mono text-red-600">dnf install [app]</td><td>Install app (Fedora)</td></tr>
                                <tr><td className="py-2 font-mono text-red-600">tar -czvf x.tar.gz</td><td>Compress Archive</td></tr>
                                <tr><td className="py-2 font-mono text-red-600">tar -xzvf x.tar.gz</td><td>Extract Archive</td></tr>
                            </tbody>
                        </table>
                    </div>

                </div>

            </div>
        </GenericCommandTool>
    );
};

export default LinuxCommandGenerator;
