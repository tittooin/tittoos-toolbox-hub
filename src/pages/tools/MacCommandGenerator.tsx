
import React from 'react';
import GenericCommandTool from "@/components/GenericCommandTool";
import { Command, Laptop, Package, Wifi, Search, List } from 'lucide-react';

const MacCommandGenerator = () => {
    return (
        <GenericCommandTool
            title="MacOS Terminal Cheatsheet & Generator"
            description="Unlock the full potential of your Mac. Zsh commands, Homebrew, and hidden settings."
            osName="MacOS Zsh"
            icon={Command}
            keywords="mac terminal commands, zsh cheatsheet, macos cli, brew install, pbcopy, spotlight"
        >
            <div className="space-y-12">

                {/* Intro */}
                <div>
                    <h2 className="text-3xl font-bold mb-6">MacOS Power User Guide</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        MacOS combines the power of Unix with Apple's ecosystem. The <strong>Terminal</strong> (now running Zsh by default) allows deep control over the operating system,
                        far beyond what System Preferences allows.
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* Mac Essentials */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 border-b pb-2">
                            <Laptop className="text-gray-600 dark:text-gray-300" />
                            <h3 className="text-2xl font-bold m-0">Mac Essentials</h3>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-muted-foreground border-b"><th className="pb-2">Command</th><th className="pb-2">Function</th></tr>
                            </thead>
                            <tbody className="divide-y">
                                <tr><td className="py-2 font-mono text-pink-600">open .</td><td>Open current folder in Finder</td></tr>
                                <tr><td className="py-2 font-mono text-pink-600">open [file]</td><td>Open file in default app</td></tr>
                                <tr><td className="py-2 font-mono text-pink-600">pbcopy</td><td>Copy to clipboard</td></tr>
                                <tr><td className="py-2 font-mono text-pink-600">pbpaste</td><td>Paste from clipboard</td></tr>
                                <tr><td className="py-2 font-mono text-pink-600">say "text"</td><td>Text-to-Speech</td></tr>
                                <tr><td className="py-2 font-mono text-pink-600">mdfind "text"</td><td>Spotlight Search (Fast)</td></tr>
                                <tr><td className="py-2 font-mono text-pink-600">caffeinate</td><td>Prevent Sleep Mode</td></tr>
                                <tr><td className="py-2 font-mono text-pink-600">screencapture x.png</td><td>Take Screenshot</td></tr>
                            </tbody>
                        </table>
                    </div>

                    {/* System Management */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 border-b pb-2">
                            <Command className="text-purple-500" />
                            <h3 className="text-2xl font-bold m-0">System Control</h3>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-muted-foreground border-b"><th className="pb-2">Command</th><th className="pb-2">Function</th></tr>
                            </thead>
                            <tbody className="divide-y">
                                <tr><td className="py-2 font-mono text-purple-600">sw_vers</td><td>Show MacOS version</td></tr>
                                <tr><td className="py-2 font-mono text-purple-600">system_profiler</td><td>Full Hardware Specs</td></tr>
                                <tr><td className="py-2 font-mono text-purple-600">top -o cpu</td><td>Task Manager (Sort by CPU)</td></tr>
                                <tr><td className="py-2 font-mono text-purple-600">pmset -g</td><td>Power Management Settings</td></tr>
                                <tr><td className="py-2 font-mono text-purple-600">softwareupdate -l</td><td>Check for updates</td></tr>
                                <tr><td className="py-2 font-mono text-purple-600">killall Finder</td><td>Restart Finder</td></tr>
                                <tr><td className="py-2 font-mono text-purple-600">killall Dock</td><td>Restart Dock</td></tr>
                                <tr><td className="py-2 font-mono text-purple-600">sudo shutdown -r now</td><td>Restart Mac</td></tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Network */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 border-b pb-2">
                            <Wifi className="text-blue-500" />
                            <h3 className="text-2xl font-bold m-0">Network Tools</h3>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-muted-foreground border-b"><th className="pb-2">Command</th><th className="pb-2">Function</th></tr>
                            </thead>
                            <tbody className="divide-y">
                                <tr><td className="py-2 font-mono text-blue-600">networkQuality</td><td>Speed Internet Test</td></tr>
                                <tr><td className="py-2 font-mono text-blue-600">ipconfig getifaddr en0</td><td>Show Wi-Fi IP</td></tr>
                                <tr><td className="py-2 font-mono text-blue-600">ping 8.8.8.8</td><td>Test Connectivity</td></tr>
                                <tr><td className="py-2 font-mono text-blue-600">lsof -i :port</td><td>Show app using port</td></tr>
                                <tr><td className="py-2 font-mono text-blue-600">netstat -nr</td><td>Routing Table</td></tr>
                                <tr><td className="py-2 font-mono text-blue-600">curl -I [url]</td><td>Get HTTP Headers</td></tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Homebrew & Dev */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 border-b pb-2">
                            <Package className="text-orange-500" />
                            <h3 className="text-2xl font-bold m-0">Homebrew (Dev)</h3>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-muted-foreground border-b"><th className="pb-2">Command</th><th className="pb-2">Function</th></tr>
                            </thead>
                            <tbody className="divide-y">
                                <tr><td className="py-2 font-mono text-orange-600">brew install [app]</td><td>Install CLI tool (e.g., node)</td></tr>
                                <tr><td className="py-2 font-mono text-orange-600">brew install --cask [app]</td><td>Install Mac App (e.g., chrome)</td></tr>
                                <tr><td className="py-2 font-mono text-orange-600">brew search [text]</td><td>Find packages</td></tr>
                                <tr><td className="py-2 font-mono text-orange-600">brew update</td><td>Update Homebrew</td></tr>
                                <tr><td className="py-2 font-mono text-orange-600">brew upgrade</td><td>Upgrade installed apps</td></tr>
                                <tr><td className="py-2 font-mono text-orange-600">brew doctor</td><td>Check for issues</td></tr>
                                <tr><td className="py-2 font-mono text-orange-600">xcode-select --install</td><td>Install Dev Tools</td></tr>
                            </tbody>
                        </table>
                    </div>

                </div>

            </div>
        </GenericCommandTool>
    );
};

export default MacCommandGenerator;
