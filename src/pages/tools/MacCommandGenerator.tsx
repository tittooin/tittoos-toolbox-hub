
import React from 'react';
import GenericCommandTool from "@/components/GenericCommandTool";
import { Command, Laptop, Package, Terminal, List } from 'lucide-react';

const MacCommandGenerator = () => {
    return (
        <GenericCommandTool
            title="MacOS Terminal Generator"
            description="Master your Mac. Generate Zsh commands for macOS workflows."
            osName="MacOS Zsh (Terminal)"
            icon={Command}
            keywords="mac terminal commands, zsh generator, macos cli helper, apple terminal"
        >
            <div className="space-y-12">

                {/* Intro */}
                <div>
                    <h2 className="text-3xl font-bold mb-6">Unix Power with Apple Polish</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        MacOS isn't just a pretty face; it's built on <strong>Darwin</strong>, a Unix-like operating system.
                        This gives Mac users the best of both worlds: widespread software support and a powerful native terminal environment.
                    </p>
                </div>

                {/* Feature Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-card border rounded-2xl p-6 shadow-sm">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                            <Laptop className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">MacOS Specific Utilities</h3>
                        <p className="text-muted-foreground">
                            Apple provides unique CLI tools not found on standard Linux.
                            Examples include <code>pbcopy</code> (paste to clipboard) and <code>open .</code> (open current folder in Finder).
                        </p>
                    </div>

                    <div className="bg-card border rounded-2xl p-6 shadow-sm">
                        <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center mb-4">
                            <Package className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Homebrew</h3>
                        <p className="text-muted-foreground">
                            The "missing package manager for macOS." While not pre-installed, it's essential.
                            Install it once, and you can run <code>brew install node</code> to get developer tools.
                        </p>
                    </div>
                </div>

                {/* Reference Table */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b pb-4">
                        <List className="w-8 h-8 text-primary" />
                        <h2 className="text-3xl font-bold m-0">Mac-Specific Commands</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-4 font-bold text-lg w-1/3">Command</th>
                                    <th className="p-4 font-bold text-lg">Description</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                <tr>
                                    <td className="p-4 font-mono text-pink-600 dark:text-pink-400">open .</td>
                                    <td className="p-4">Opens the current terminal directory in a Finder window.</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-mono text-pink-600 dark:text-pink-400">pbcopy</td>
                                    <td className="p-4">Redirect output to system clipboard. <br /><code className="text-xs bg-muted p-1">cat file.txt | pbcopy</code></td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-mono text-pink-600 dark:text-pink-400">pbpaste</td>
                                    <td className="p-4">Paste text from system clipboard into the terminal.</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-mono text-pink-600 dark:text-pink-400">caffeinate</td>
                                    <td className="p-4">Prevents the Mac from sleeping. <br /><code className="text-xs bg-muted p-1">caffeinate -u -t 3600</code> (Stay awake for 1 hour)</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-mono text-pink-600 dark:text-pink-400">mdfind "text"</td>
                                    <td className="p-4">Uses Spotlight index to search for files instantly.</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-mono text-pink-600 dark:text-pink-400">say "Hello"</td>
                                    <td className="p-4">Uses the system Text-to-Speech engine to speak out loud.</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-mono text-pink-600 dark:text-pink-400">networkQuality</td>
                                    <td className="p-4">Runs a built-in internet speed test (macOS Monterey+).</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-mono text-pink-600 dark:text-pink-400">softwareupdate -l</td>
                                    <td className="p-4">Checks for MacOS system updates from the command line.</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-mono text-pink-600 dark:text-pink-400">brew install [app]</td>
                                    <td className="p-4">Installs an application using Homebrew. <br /><code className="text-xs bg-muted p-1">brew install --cask google-chrome</code></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Deep Dive */}
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold">Navigating the Apple Terminal</h2>

                    <div className="prose dark:prose-invert max-w-none">
                        <h3>1. The Z Shell (Zsh) vs Bash</h3>
                        <p>
                            Zsh is highly compatible with Bash (99% of scripts work), but it's more interactive.
                            It supports fuzzy file finding and massive plugin ecosystems.
                        </p>

                        <h3>2. Controlling System Settings</h3>
                        <p>
                            You can modify hidden system preferences using the <code>defaults</code> command.
                        </p>
                        <div className="bg-muted p-4 rounded-lg font-mono text-sm not-prose mb-4">
                            # Show hidden files in Finder<br />
                            defaults write com.apple.finder AppleShowAllFiles -bool true<br />
                            killall Finder
                        </div>
                    </div>
                </div>

            </div>
        </GenericCommandTool>
    );
};

export default MacCommandGenerator;
