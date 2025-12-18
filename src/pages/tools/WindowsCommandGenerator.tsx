
import React from 'react';
import GenericCommandTool from "@/components/GenericCommandTool";
import CommandCheatsheet from "@/components/CommandCheatsheet";
import { Terminal, Shield, Zap, FileText, Server, Wifi, User, HardDrive } from 'lucide-react';

const WindowsCommandGenerator = () => {

    const categories = [
        {
            title: "Basic & File Operations",
            icon: FileText,
            colorClass: "text-blue-500",
            commands: [
                { cmd: "help", desc: "List all available commands" },
                { cmd: "cls", desc: "Clear the terminal screen" },
                { cmd: "dir", desc: "List files and folders in current directory" },
                { cmd: "cd directory_name", desc: "Change directory (Folder)" },
                { cmd: "cd ..", desc: "Go back one directory level" },
                { cmd: "mkdir new_folder", desc: "Create a new directory" },
                { cmd: "copy source.txt dest.txt", desc: "Copy a file" },
                { cmd: "move source.txt dest/", desc: "Move a file" },
                { cmd: "del file.txt", desc: "Delete a file" },
                { cmd: "ren old.txt new.txt", desc: "Rename a file" },
                { cmd: "type file.txt", desc: "Display file contents" },
                { cmd: "explorer .", desc: "Open current folder in File Explorer" },
            ]
        },
        {
            title: "System & Hardware",
            icon: Server,
            colorClass: "text-purple-500",
            commands: [
                { cmd: "systeminfo", desc: "Show detailed system specifications" },
                { cmd: "tasklist", desc: "List all running processes" },
                { cmd: "taskkill /IM notepad.exe", desc: "Force close a program by name" },
                { cmd: "hostname", desc: "Show computer name" },
                { cmd: "wmic cpu get name", desc: "Show exact CPU model" },
                { cmd: "sfc /scannow", desc: "Scan and repair system files (Admin)" },
                { cmd: "shutdown /s /t 0", desc: "Shutdown computer immediately" },
                { cmd: "shutdown /r /t 0", desc: "Restart computer immediately" },
                { cmd: "ver", desc: "Show Windows version" },
            ]
        },
        {
            title: "Network & Internet",
            icon: Wifi,
            colorClass: "text-green-500",
            commands: [
                { cmd: "ipconfig", desc: "Show IP address information" },
                { cmd: "ipconfig /flushdns", desc: "Clear DNS resolver cache" },
                { cmd: "ping google.com", desc: "Test internet connectivity" },
                { cmd: "tracert google.com", desc: "Trace path to destination" },
                { cmd: "netstat -an", desc: "Show all active connections/ports" },
                { cmd: "nslookup domain.com", desc: "Check DNS records for a domain" },
                { cmd: "getmac", desc: "Show physical MAC address" },
                { cmd: "netsh wlan show profiles", desc: "List saved Wi-Fi networks" },
            ]
        },
        {
            title: "User & Disk Management",
            icon: User,
            colorClass: "text-orange-500",
            commands: [
                { cmd: "whoami", desc: "Display current user name" },
                { cmd: "net user", desc: "List all user accounts" },
                { cmd: "net user username *", desc: "Change user password (Admin)" },
                { cmd: "chkdsk C: /f", desc: "Check and fix disk errors (Admin)" },
                { cmd: "format D: /fs:ntfs", desc: "Format a drive to NTFS (Warning)" },
                { cmd: "diskpart", desc: "Open Disk Partition Manager" },
                { cmd: "vol", desc: "Show disk volume label" },
            ]
        },
        {
            title: "PowerShell Power-User",
            icon: Terminal,
            colorClass: "text-blue-400",
            commands: [
                { cmd: "Get-Command *service*", desc: "Find commands related to 'service'" },
                { cmd: "Get-Help Get-Process -Examples", desc: "Show practical examples for a command" },
                { cmd: "Get-Service | Where-Object Status -eq 'Stopped'", desc: "List only stopped services" },
                { cmd: "Get-Process | Sort-Object CPU -Descending", desc: "Show processes using most CPU" },
                { cmd: "Stop-Process -Name chrome", desc: "Kill all Chrome processes instantly" },
                { cmd: "Test-NetConnection google.com -Port 443", desc: "Test specific port connectivity" },
                { cmd: "Set-ExecutionPolicy RemoteSigned", desc: "Allow local scripts to run" },
                { cmd: "$env:Path", desc: "Show Environment Variables" },
            ]
        }
    ];

    return (
        <GenericCommandTool
            title="Windows PowerShell & CMD Generator"
            description="The ultimate interactive cheat sheet for Windows Terminal. Generate scripts and find commands instantly."
            osName="Windows PowerShell 7+"
            icon={Terminal}
            keywords="windows cmd commands, powershell cheatsheet, cls, dir, ipconfig, systeminfo, net user, diskpart"
        >
            <div className="space-y-12">

                {/* Intro */}
                <div>
                    <h2 className="text-3xl font-bold mb-6">Master Windows Terminal</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                        Stop memorizing all 1000+ commands. Use our interactive cheat sheet below to find exactly what you need.
                        Search by keyword (e.g., "network", "delete", "user") and copy instantly.
                    </p>

                    <div className="bg-muted/50 p-6 rounded-xl border border-border">
                        <CommandCheatsheet categories={categories} />
                    </div>
                </div>

                {/* Deep Dive Section */}
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold">Why Powershell?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-card border rounded-2xl p-6 shadow-sm">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Object-Oriented</h3>
                            <p className="text-muted-foreground">
                                Cmdlets return .NET objects, not text. Use <code>| Select-Object Name,ID</code> to get exactly what you want structured data.
                            </p>
                        </div>
                        <div className="bg-card border rounded-2xl p-6 shadow-sm">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Scripting Power</h3>
                            <p className="text-muted-foreground">
                                Automate everything. From creating 100 folders to managing Azure Cloud resources, PowerShell is the industry standard for Windows automation.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </GenericCommandTool>
    );
};

export default WindowsCommandGenerator;
