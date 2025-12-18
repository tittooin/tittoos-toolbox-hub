
import React from 'react';
import GenericCommandTool from "@/components/GenericCommandTool";
import { Command, Laptop, Package, Terminal } from 'lucide-react';

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
                        Since MacOS Catalina, <strong>Zsh (Z Shell)</strong> has replaced Bash as the default login shell, offering modern features like improved tab completion and theme support.
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
                            Examples include <code>pbcopy</code> (paste to clipboard), <code>open .</code> (open current folder in Finder),
                            and <code>mdfind</code> (Spotlight search from the terminal).
                        </p>
                    </div>

                    <div className="bg-card border rounded-2xl p-6 shadow-sm">
                        <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center mb-4">
                            <Package className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Homebrew</h3>
                        <p className="text-muted-foreground">
                            The "missing package manager for macOS." While not pre-installed, it's essential.
                            Install it once, and you can run <code>brew install node</code>, <code>brew install git</code>, or even
                            <code>brew install --cask google-chrome</code> to install GUI apps.
                        </p>
                    </div>
                </div>

                {/* Deep Dive */}
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold">Navigating the Apple Terminal</h2>

                    <div className="prose dark:prose-invert max-w-none">
                        <h3>1. The Z Shell (Zsh) vs Bash</h3>
                        <p>
                            Zsh is highly compatible with Bash (99% of scripts work), but it's more interactive.
                            It supports fuzzy file finding (you can type `cd doc/proj` and it finds `Documents/Projects`) and massive plugin ecosystems like <strong>Oh My Zsh</strong>.
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

                        <h3>3. Managing Software Updates</h3>
                        <p>
                            Don't want to open System Preferences?
                            Run <code>softwareupdate -l</code> to list available updates, and <code>softwareupdate -i -a</code> to install them all, including macOS upgrades.
                        </p>
                    </div>
                </div>

                {/* Tips Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 p-8 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                    <h2 className="text-2xl font-bold mb-4">Pro Tips for Mac Developers</h2>
                    <ul className="space-y-3 list-disc pl-5">
                        <li><strong>Keep Your Mac Awake:</strong> Type <code>caffeinate</code> in the terminal to prevent your Mac from sleeping while a long task runs.</li>
                        <li><strong>Text to Speech:</strong> Use the <code>say</code> command. Try <code>say "Task completed"</code> after a long script.</li>
                        <li><strong>Network Quality:</strong> Check your internet quality quickly with <code>networkQuality</code> (macOS Monterey+).</li>
                    </ul>
                </div>

            </div>
        </GenericCommandTool>
    );
};

export default MacCommandGenerator;
