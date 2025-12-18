
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
            keywords="mac terminal commands, zsh cheatsheet, macos cli, brew install, pbcopy, spotlight"
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

            </div>
        </GenericCommandTool>
    );
};

export default MacCommandGenerator;
