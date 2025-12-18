
import React from 'react';
import GenericCommandTool from "@/components/GenericCommandTool";
import { Terminal, Shield, Zap, FileText, AlertTriangle } from 'lucide-react';

const WindowsCommandGenerator = () => {
    return (
        <GenericCommandTool
            title="Windows PowerShell Generator"
            description="Translate plain English into advanced PowerShell commands instantly."
            osName="Windows PowerShell 7+"
            icon={Terminal}
            keywords="powershell generator, windows terminal commands, ps1 script generator, windows cli helper"
        >
            <div className="space-y-12">

                {/* Intro */}
                <div>
                    <h2 className="text-3xl font-bold mb-6">Mastering Windows PowerShell</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        PowerShell is not just a command-line shell; it's a powerful configuration management framework derived from the .NET Common Language Runtime (CLR).
                        Unlike traditional shells that accept and return text, PowerShell accepts and returns <strong>.NET objects</strong>. This fundamental difference allows you to pipe data
                        between commands (called "cmdlets") in incredibly robust ways, manipulating properties rather than parsing raw text strings.
                    </p>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-card border rounded-2xl p-6 shadow-sm">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                            <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Cmdlets (Command-Lets)</h3>
                        <p className="text-muted-foreground">
                            PowerShell commands follow a rigid <code>Verb-Noun</code> naming convention (e.g., <code>Get-Service</code>, <code>Start-Process</code>).
                            This makes commands easy to guess and remember. If you want to get something, start with <code>Get-</code>. If you want to stop something, try <code>Stop-</code>.
                        </p>
                    </div>

                    <div className="bg-card border rounded-2xl p-6 shadow-sm">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                            <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">The Pipeline |</h3>
                        <p className="text-muted-foreground">
                            In Linux Bash, piping passes text. In PowerShell, piping passes <strong>entire live objects</strong>.
                            Running <code>Get-Service | Stop-Service</code> doesn't match text; it passes the actual ServiceController object to the stop command.
                        </p>
                    </div>
                </div>

                {/* Core Concepts */}
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold">Essential PowerShell Concepts</h2>

                    <div className="prose dark:prose-invert max-w-none">
                        <h3>1. Execution Policies</h3>
                        <p>
                            By default, Windows prevents the execution of scripts for security reasons. This is controlled by the Execution Policy.
                            Common policies include:
                        </p>
                        <ul>
                            <li><code>Restricted</code>: No scripts can run. (Default on many systems)</li>
                            <li><code>RemoteSigned</code>: Scripts created locally can run; downloaded scripts must be signed by a trusted publisher.</li>
                            <li><code>Unrestricted</code>: Any script can run, but you might be warned.</li>
                        </ul>
                        <p>
                            To change your policy (requires Admin): <code>Set-ExecutionPolicy RemoteSigned</code>
                        </p>

                        <h3>2. Aliases</h3>
                        <p>
                            PowerShell includes aliases to make Linux users feel at home.
                        </p>
                        <ul>
                            <li><code>ls</code> → <code>Get-ChildItem</code></li>
                            <li><code>cp</code> → <code>Copy-Item</code></li>
                            <li><code>mv</code> → <code>Move-Item</code></li>
                            <li><code>cat</code> → <code>Get-Content</code></li>
                        </ul>
                    </div>
                </div>

                {/* Security Alert */}
                <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-2xl border border-red-100 dark:border-red-900/30">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
                        <h2 className="text-2xl font-bold text-red-900 dark:text-red-300 m-0">Security Best Practices</h2>
                    </div>
                    <div className="space-y-4 text-red-800 dark:text-red-300">
                        <p>
                            <strong>Never Run Obfuscated Code:</strong> PowerShell is a favorite tool for malware due to its deep system access.
                            If you see a command that looks like random string formatting (e.g., <code>iex $env:x</code>), do not run it.
                        </p>
                        <p>
                            <strong>Understand "Run as Administrator":</strong> Many commands generated by this tool (like changing system settings or installing software via Winget/Chocolatey)
                            require elevated privileges. If a command fails with "Access Denied", try opening your terminal as Administrator.
                        </p>
                    </div>
                </div>

                {/* FAQ */}
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
                    <div className="grid gap-4">
                        <div className="border rounded-lg p-4">
                            <h4 className="font-bold mb-2">What is the difference between PowerShell and CMD?</h4>
                            <p className="text-muted-foreground">CMD (Command Prompt) is a legacy shell from the DOS days, primarily for basic file batch operations. PowerShell is a modern, object-oriented scripting environment capable of managing complex Azure cloud infrastructures, Exchange servers, and Windows internals.</p>
                        </div>
                        <div className="border rounded-lg p-4">
                            <h4 className="font-bold mb-2">Can I run Linux commands in PowerShell?</h4>
                            <p className="text-muted-foreground">Yes! Through WSL (Windows Subsystem for Linux), you can run a full Linux kernel alongside Windows. Type <code>wsl ls -la</code> to run a Linux command from PowerShell.</p>
                        </div>
                    </div>
                </div>

            </div>
        </GenericCommandTool>
    );
};

export default WindowsCommandGenerator;
