
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Search, Check, Terminal } from 'lucide-react';
import { toast } from "sonner";

interface CommandItem {
    cmd: string;
    desc: string;
}

interface CommandCategory {
    title: string;
    icon: React.ElementType;
    colorClass: string; // e.g. "text-blue-500"
    commands: CommandItem[];
}

interface CommandCheatsheetProps {
    categories: CommandCategory[];
}

const CommandCheatsheet: React.FC<CommandCheatsheetProps> = ({ categories }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

    const handleCopy = (cmd: string) => {
        navigator.clipboard.writeText(cmd);
        setCopiedCmd(cmd);
        toast.success("Command copied!");
        setTimeout(() => setCopiedCmd(null), 2000);
    };

    // Filter logic
    const filteredCategories = categories.map(cat => ({
        ...cat,
        commands: cat.commands.filter(c =>
            c.cmd.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.desc.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(cat => cat.commands.length > 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                    type="text"
                    placeholder="Search commands (e.g., 'ip', 'delete', 'network')..."
                    className="pl-10 h-12 text-lg border-2 border-primary/20 focus-visible:ring-primary/50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Grid */}
            <div className={`grid grid-cols-1 ${searchTerm ? 'md:grid-cols-1' : 'md:grid-cols-2'} gap-6`}>
                {filteredCategories.map((cat, idx) => (
                    <Card key={idx} className="border-l-4 border-l-primary/50 shadow-sm hover:shadow-md transition-shadow dark:bg-slate-950/50">
                        <CardHeader className="pb-2 border-b bg-muted/20">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg bg-background shadow-sm ${cat.colorClass}`}>
                                    <cat.icon className="w-5 h-5" />
                                </div>
                                <CardTitle className="text-xl">{cat.title}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-border/50">
                                {cat.commands.map((item, cIdx) => (
                                    <div key={cIdx} className="group flex items-center justify-between p-3 hover:bg-muted/50 transition-colors">
                                        <div className="flex-1 min-w-0 pr-4">
                                            <code className="text-sm font-mono font-bold text-primary block truncate" title={item.cmd}>
                                                {item.cmd}
                                            </code>
                                            <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.desc}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
                                            onClick={() => handleCopy(item.cmd)}
                                        >
                                            {copiedCmd === item.cmd ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {filteredCategories.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        <Terminal className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No commands found matching "{searchTerm}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommandCheatsheet;
