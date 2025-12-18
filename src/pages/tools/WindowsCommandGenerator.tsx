
import React from 'react';
import GenericCommandTool from "@/components/GenericCommandTool";
import { Terminal, Shield, Zap, FileText, Server, Wifi, User, HardDrive, List } from 'lucide-react';

const WindowsCommandGenerator = () => {
    return (
        <GenericCommandTool
            title="Windows PowerShell & CMD Generator"
            description="The ultimate cheat sheet for Windows Terminal. Generate PowerShell scripts and learn CMD commands."
            osName="Windows PowerShell 7+"
            icon={Terminal}
            keywords="windows cmd commands, powershell cheatsheet, cls, dir, ipconfig, systeminfo, net user, diskpart"
        >
            <div className="space-y-12">

                {/* Intro */}
                <div>
                    <h2 className="text-3xl font-bold mb-6">Master Windows Terminal</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Whether you are using the classic <strong>Command Prompt (CMD)</strong> or the modern <strong>PowerShell</strong>, master the command line to control your PC like a pro.
                        Below is a comprehensive categorized list of essential commands.
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* Basic & Files */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 border-b pb-2">
                            <FileText className="text-blue-500" />
                            <h3 className="text-2xl font-bold m-0">Basic & File Commands</h3>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-muted-foreground border-b"><th className="pb-2">Command</th><th className="pb-2">Function</th></tr>
                            </thead>
                            <tbody className="divide-y">
                                <tr><td className="py-2 font-mono text-blue-600">help</td><td>List all commands</td></tr>
                                <tr><td className="py-2 font-mono text-blue-600">cls</td><td>Clear screen</td></tr>
                                <tr><td className="py-2 font-mono text-blue-600">ver</td><td>Show Windows version</td></tr>
                                <tr><td className="py-2 font-mono text-blue-600">dir</td><td>List files & folders</td></tr>
                                <tr><td className="py-2 font-mono text-blue-600">cd [folder]</td><td>Change directory</td></tr>
                                <tr><td className="py-2 font-mono text-blue-600">cd..</td><td>Go back one step</td></tr>
                                <tr><td className="py-2 font-mono text-blue-600">mkdir / md</td><td>Create new folder</td></tr>
                                <tr><td className="py-2 font-mono text-blue-600">copy [file]</td><td>Copy file</td></tr>
                                <tr><td className="py-2 font-mono text-blue-600">move [file]</td><td>Move file</td></tr>
                                <tr><td className="py-2 font-mono text-blue-600">del [file]</td><td>Delete file</td></tr>
                                <tr><td className="py-2 font-mono text-blue-600">ren [old] [new]</td><td>Rename file</td></tr>
                            </tbody>
                        </table>
                    </div>

                    {/* System Info */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 border-b pb-2">
                            <Server className="text-purple-500" />
                            <h3 className="text-2xl font-bold m-0">System & Hardware</h3>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-muted-foreground border-b"><th className="pb-2">Command</th><th className="pb-2">Function</th></tr>
                            </thead>
                            <tbody className="divide-y">
                                <tr><td className="py-2 font-mono text-purple-600">systeminfo</td><td>Detailed system specs</td></tr>
                                <tr><td className="py-2 font-mono text-purple-600">tasklist</td><td>Show running apps</td></tr>
                                <tr><td className="py-2 font-mono text-purple-600">taskkill /IM [name]</td><td>Force close app</td></tr>
                                <tr><td className="py-2 font-mono text-purple-600">hostname</td><td>Show computer name</td></tr>
                                <tr><td className="py-2 font-mono text-purple-600">wmic cpu get name</td><td>Show CPU specific model</td></tr>
                                <tr><td className="py-2 font-mono text-purple-600">sfc /scannow</td><td>Repair corrupt system files</td></tr>
                                <tr><td className="py-2 font-mono text-purple-600">shutdown /s</td><td>Shutdown PC</td></tr>
                                <tr><td className="py-2 font-mono text-purple-600">shutdown /r</td><td>Restart PC</td></tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Network */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 border-b pb-2">
                            <Wifi className="text-green-500" />
                            <h3 className="text-2xl font-bold m-0">Network Commands</h3>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-muted-foreground border-b"><th className="pb-2">Command</th><th className="pb-2">Function</th></tr>
                            </thead>
                            <tbody className="divide-y">
                                <tr><td className="py-2 font-mono text-green-600">ipconfig</td><td>Show IP address</td></tr>
                                <tr><td className="py-2 font-mono text-green-600">ping google.com</td><td>Check internet connection</td></tr>
                                <tr><td className="py-2 font-mono text-green-600">tracert [site]</td><td>Trace connection route</td></tr>
                                <tr><td className="py-2 font-mono text-green-600">netstat -an</td><td>Show active ports</td></tr>
                                <tr><td className="py-2 font-mono text-green-600">nslookup [site]</td><td>Check DNS records</td></tr>
                                <tr><td className="py-2 font-mono text-green-600">getmac</td><td>Show Physical MAC address</td></tr>
                                <tr><td className="py-2 font-mono text-green-600">netsh wlan show profiles</td><td>Show saved Wi-Fi networks</td></tr>
                            </tbody>
                        </table>
                    </div>

                    {/* User & Disk */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 border-b pb-2">
                            <User className="text-orange-500" />
                            <h3 className="text-2xl font-bold m-0">User & Disk Mgmt</h3>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-muted-foreground border-b"><th className="pb-2">Command</th><th className="pb-2">Function</th></tr>
                            </thead>
                            <tbody className="divide-y">
                                <tr><td className="py-2 font-mono text-orange-600">whoami</td><td>Current user name</td></tr>
                                <tr><td className="py-2 font-mono text-orange-600">net user</td><td>List all users</td></tr>
                                <tr><td className="py-2 font-mono text-orange-600">net user [name] *</td><td>Change password</td></tr>
                                <tr><td className="py-2 font-mono text-orange-600">diskpart</td><td>Advanced disk partition tool</td></tr>
                                <tr><td className="py-2 font-mono text-orange-600">chkdsk /f</td><td>Check & fix disk errors</td></tr>
                                <tr><td className="py-2 font-mono text-orange-600">format [drive]:</td><td>Format a drive (Warning!)</td></tr>
                                <tr><td className="py-2 font-mono text-orange-600">vol</td><td>Volume label/serial number</td></tr>
                            </tbody>
                        </table>
                    </div>

                </div>

                {/* PowerShell Special */}
                <div className="bg-slate-900 text-slate-100 p-8 rounded-2xl border border-slate-700">
                    <div className="flex items-center gap-3 mb-6">
                        <Terminal className="w-8 h-8 text-blue-400" />
                        <h2 className="text-2xl font-bold m-0">PowerShell Power-User</h2>
                    </div>

                    <p className="text-slate-400 mb-6">
                        PowerShell has over 1000+ cmdlets. It creates "Aliases" so standard commands work too.
                        But for real power, use the Verb-Noun syntax.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-800 p-4 rounded-xl">
                            <code className="text-blue-400 font-bold block mb-2">Get-Command</code>
                            <p className="text-sm text-slate-300">Find any command. <br />Example: <code>Get-Command *service*</code> finds all service related tools.</p>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl">
                            <code className="text-blue-400 font-bold block mb-2">Get-Help</code>
                            <p className="text-sm text-slate-300">The manual. <br />Example: <code>Get-Help Get-Process -Examples</code> showing you how to use it.</p>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl">
                            <code className="text-blue-400 font-bold block mb-2">Get-Service | Where Status -eq 'Stopped'</code>
                            <p className="text-sm text-slate-300">Filters data logically. Lists only services that are currently stopped.</p>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl">
                            <code className="text-blue-400 font-bold block mb-2">Stop-Process -Name chrome</code>
                            <p className="text-sm text-slate-300">Kill command. Instantly closes all Chrome windows.</p>
                        </div>
                    </div>
                </div>

            </div>
        </GenericCommandTool>
    );
};

export default WindowsCommandGenerator;
