
import React from 'react';
import GenericCommandTool from "@/components/GenericCommandTool";
import CommandCheatsheet from "@/components/CommandCheatsheet";
import { Command, Laptop, Package, Wifi } from 'lucide-react';

const MacCommandGenerator = () => {

    const categories = [
        {
            title: "Mac Essentials",
            icon: Laptop,
            colorClass: "text-gray-600 dark:text-gray-300",
            commands: [
                { cmd: "open .", desc: "Open current folder in Finder Window" },
                { cmd: "open file.txt", desc: "Open file in default app" },
                { cmd: "pbcopy < file.txt", desc: "Copy file content to Clipboard" },
                { cmd: "pbpaste > file.txt", desc: "Paste Clipboard to file" },
                { cmd: "say 'Job Done'", desc: "Text-to-Speech (Voice)" },
                { cmd: "mdfind 'invoice'", desc: "Spotlight Search via CLI" },
                { cmd: "caffeinate -u -t 3600", desc: "Prevent Sleep for 1 hour" },
                { cmd: "screencapture -c", desc: "Take screenshot to clipboard" },
            ]
        },
        {
            title: "System Control",
            icon: Command,
            colorClass: "text-purple-500",
            commands: [
                { cmd: "sw_vers", desc: "Show macOS version" },
                { cmd: "system_profiler SPPowerDataType", desc: "Show Battery/Power info" },
                { cmd: "top -o cpu", desc: "Task Manager (CPU sorted)" },
                { cmd: "softwareupdate -l", desc: "Check for macOS updates" },
                { cmd: "killall Finder", desc: "Restart Finder (Fix glitches)" },
                { cmd: "killall Dock", desc: "Restart Dock" },
                { cmd: "pmset sleep now", desc: "Sleep immediately" },
                { cmd: "sudo shutdown -r now", desc: "Restart immediately" },
            ]
        },
        {
            title: "Network & Web",
            icon: Wifi,
            colorClass: "text-blue-500",
            commands: [
                { cmd: "networkQuality", desc: "Built-in speed test (Monterey+)" },
                { cmd: "ipconfig getifaddr en0", desc: "Show Wi-Fi IP address" },
                { cmd: "lsof -i :3000", desc: "See what's running on port 3000" },
                { cmd: "ping 1.1.1.1", desc: "Check connectivity" },
                { cmd: "flush_dns_cache", desc: "Clear DNS (custom alias often used)" },
                { cmd: "scutil --dns", desc: "Show DNS configuration" },
            ]
        },
        {
            title: "Homebrew (Dev)",
            icon: Package,
            colorClass: "text-orange-500",
            commands: [
                { cmd: "brew install node", desc: "Install a package (Node.js)" },
                { cmd: "brew install --cask google-chrome", desc: "Install a GUI App" },
                { cmd: "brew search python", desc: "Search for packages" },
                { cmd: "brew update && brew upgrade", desc: "Update all packages" },
                { cmd: "brew cleanup", desc: "Remove old versions/cache" },
                { cmd: "brew services list", desc: "Show background services" },
            ]
        }
    ];

    return (
        <GenericCommandTool
            title="MacOS Terminal Cheatsheet & Generator"
            description="Unlock the full potential of your Mac. Zsh commands, Homebrew, and hidden settings."
            osName="MacOS Zsh"
            icon={Command}
            keywords="mac terminal commands, zsh cheatsheet, homebrew, brew install, sudo, open, pbcopy"
            path="/tools/mac-cmd-gen"
        >
            <div className="space-y-12">

                {/* Intro */}
                <div>
                    <h2 className="text-3xl font-bold mb-6">MacOS Power User Guide</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                        MacOS combines Unix power with Apple polish. Use the interactive list below to find Mac-specific commands like <code>pbcopy</code> and <code>open</code>.
                    </p>
                    <div className="bg-muted/50 p-6 rounded-xl border border-border">
                        <CommandCheatsheet categories={categories} />
                    </div>
                </div>

                {/* Extra Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-card border rounded-2xl p-6 shadow-sm">
                        <h3 className="text-xl font-bold mb-2">Homebrew</h3>
                        <p className="text-muted-foreground">The "missing package manager". Install it once, then install everything else with <code>brew install</code>. It keeps your development environment clean.</p>
                    </div>
                    <div className="bg-card border rounded-2xl p-6 shadow-sm">
                        <h3 className="text-xl font-bold mb-2">Zsh vs Bash</h3>
                        <p className="text-muted-foreground">Modern Macs use Zsh. It's mostly compatible with Bash but adds features like smarter tab-completion and plugin support (Oh My Zsh).</p>
                    </div>
                </div>

                {/* SEO Blog Article */}
                <article className="prose dark:prose-invert max-w-none pt-12 border-t mt-12">
                    <h1>Unlock Your Mac: The Guide to Terminal & Zsh</h1>

                    <p className="lead text-xl text-muted-foreground">
                        Your Mac is a Unix workstation with a beautiful interface. Most users never touch the Terminal, but for developers, it is home.
                        Since macOS Catalina, Apple switched the default shell to <strong>Zsh (Z Shell)</strong>. Let's see how to use it.
                    </p>

                    <h2>Why is Zsh better than Bash?</h2>
                    <p>
                        Zsh is essentially "Bash 2.0". It does everything Bash does but adds quality-of-life improvements:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Spelling Correction:</strong> If you type <code>cd dekstop</code>, Zsh will ask if you meant "Desktop".</li>
                        <li><strong>Better Tab Completion:</strong> Pressing Tab shows a selectable menu of files, not just a text list.</li>
                        <li><strong>Plugin Support:</strong> Frameworks like "Oh My Zsh" allow you to add themes, git status powerlines, and auto-suggestions.</li>
                    </ul>

                    <h2>Must-Have Tool: Homebrew</h2>
                    <p>
                        If you open Terminal and type <code>wget</code> or <code>python</code>, you might find they are missing or outdated.
                        <strong>Homebrew</strong> solves this. It is a package manager for macOS.
                    </p>
                    <p>
                        To install it, you run one command from their website. Once installed, you can download thousands of free, open-source tools:
                    </p>
                    <div className="bg-muted p-4 rounded-lg my-4 font-mono text-sm">
                        brew install node          # Installs Node.js<br />
                        brew install git           # Installs latest Git<br />
                        brew install --cask vlc    # Installs the VLC Video Player app
                    </div>

                    <h2>Hidden MacOS Commands</h2>
                    <p>
                        Did you know you can control the GUI from the CLI?
                    </p>
                    <div className="space-y-4 not-prose mt-4">
                        <div className="flex gap-4 items-start">
                            <div className="min-w-[120px] font-bold font-mono text-primary">caffeinate</div>
                            <p className="text-sm">Stops your screen from dimming or sleeping. Essential for long downloads or presentations.</p>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="min-w-[120px] font-bold font-mono text-primary">pbcopy</div>
                            <p className="text-sm">"Pasteboard Copy". Pipe command output directly to your clipboard. <code>cat secret.txt | pbcopy</code>.</p>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="min-w-[120px] font-bold font-mono text-primary">say</div>
                            <p className="text-sm">Uses the built-in TTS engine. Great for notifying you when a long script finishes: <code>sleep 10 && say "Process Done"</code>.</p>
                        </div>
                    </div>

                    <h2>Troubleshooting: "Command Not Found"</h2>
                    <p>
                        If you install something but the terminal says "command not found", it's usually a <strong>PATH</strong> issue.
                        The system doesn't know where to look for the file.
                        In Zsh, you fix this by editing the <code>~/.zshrc</code> file and adding the folder path.
                    </p>

                </article>

            </div>
        </GenericCommandTool>
    );
};

export default MacCommandGenerator;
