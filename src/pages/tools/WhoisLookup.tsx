import { useState, useEffect } from "react";
import { Search, Globe, Server, Shield, FileText, Database, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

interface DNSRecord {
    name: string;
    type: number;
    TTL: number;
    data: string;
}

const WhoisLookup = () => {
    useEffect(() => {
        document.title = "Free Whois & DNS Lookup – Check Domain Info";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Check domain DNS records and registration details with our free Whois & DNS Lookup tool. View A, MX, NS, and TXT records instantly.');
        }
    }, []);

    const [domain, setDomain] = useState("");
    const [loading, setLoading] = useState(false);
    const [records, setRecords] = useState<DNSRecord[]>([]);
    const [searchedDomain, setSearchedDomain] = useState("");

    const lookupDNS = async () => {
        if (!domain.trim()) {
            toast.error("Please enter a domain name");
            return;
        }

        // Basic domain validation
        const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
        if (!domainRegex.test(domain.trim())) {
            toast.error("Please enter a valid domain name (e.g., google.com)");
            return;
        }

        setLoading(true);
        setRecords([]);
        setSearchedDomain(domain);

        try {
            // We'll query Google's Public DNS API for different record types
            const recordTypes = ['A', 'MX', 'NS', 'TXT', 'AAAA'];
            const allRecords: DNSRecord[] = [];

            for (const type of recordTypes) {
                const response = await fetch(`https://dns.google/resolve?name=${domain}&type=${type}`);
                const data = await response.json();

                if (data.Answer) {
                    allRecords.push(...data.Answer);
                }
            }

            if (allRecords.length === 0) {
                toast.warning("No records found for this domain");
            } else {
                setRecords(allRecords);
                toast.success("DNS records retrieved successfully!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch DNS records. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getRecordTypeName = (type: number) => {
        switch (type) {
            case 1: return 'A';
            case 2: return 'NS';
            case 5: return 'CNAME';
            case 15: return 'MX';
            case 16: return 'TXT';
            case 28: return 'AAAA';
            default: return `Type ${type}`;
        }
    };

    const features = [
        "Check A, AAAA, MX, NS, and TXT records",
        "Verify domain propagation",
        "Debug email configuration",
        "Analyze domain security records",
        "Fast and reliable lookup"
    ];

    return (
        <ToolTemplate
            title="Whois & DNS Lookup"
            description="Instantly check domain DNS records and registration details"
            icon={Search}
            features={features}
        >
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Domain Lookup</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <Input
                                placeholder="Enter domain name (e.g., google.com)"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && lookupDNS()}
                                className="flex-1"
                            />
                            <Button onClick={lookupDNS} disabled={loading} className="min-w-[120px]">
                                {loading ? "Searching..." : "Lookup"}
                            </Button>
                        </div>

                        {searchedDomain && (
                            <div className="mt-8 space-y-6">
                                <div className="flex items-center justify-between border-b pb-4">
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <Globe className="h-5 w-5 text-primary" />
                                        Results for {searchedDomain}
                                    </h3>
                                    <span className="text-sm text-muted-foreground">{records.length} records found</span>
                                </div>

                                {records.length > 0 ? (
                                    <div className="grid gap-4">
                                        {records.map((record, index) => (
                                            <div key={index} className="bg-muted/30 p-4 rounded-lg border flex flex-col md:flex-row md:items-center gap-4 hover:bg-muted/50 transition-colors">
                                                <div className="min-w-[80px]">
                                                    <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold w-16 text-center
                            ${getRecordTypeName(record.type) === 'A' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : ''}
                            ${getRecordTypeName(record.type) === 'AAAA' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' : ''}
                            ${getRecordTypeName(record.type) === 'MX' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' : ''}
                            ${getRecordTypeName(record.type) === 'NS' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : ''}
                            ${getRecordTypeName(record.type) === 'TXT' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : ''}
                          `}>
                                                        {getRecordTypeName(record.type)}
                                                    </span>
                                                </div>
                                                <div className="flex-1 font-mono text-sm break-all">
                                                    {record.data}
                                                </div>
                                                <div className="text-xs text-muted-foreground whitespace-nowrap">
                                                    TTL: {record.TTL}s
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg">
                                        <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>No records found. Please check the domain name and try again.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">Demystifying DNS & Whois</h1>

                    <div className="my-10 flex justify-center">
                        {/* Custom SVG Illustration for Whois/DNS Lookup */}
                        <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border border-purple-100 dark:border-gray-700">
                            <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

                            {/* Browser/Client */}
                            <g transform="translate(50, 180)">
                                <rect width="100" height="70" rx="4" fill="white" stroke="#94a3b8" strokeWidth="2" className="dark:fill-gray-800 dark:stroke-gray-600" />
                                <rect x="10" y="10" width="80" height="40" rx="2" fill="#f1f5f9" className="dark:fill-gray-700" />
                                <circle cx="50" cy="85" r="5" fill="#94a3b8" />
                                <path d="M30 90 L70 90 L80 100 L20 100 Z" fill="#cbd5e1" className="dark:fill-gray-600" />
                                <text x="50" y="-15" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="bold">You</text>
                            </g>

                            {/* DNS Server */}
                            <g transform="translate(250, 150)">
                                <rect width="100" height="120" rx="4" fill="white" stroke="#8b5cf6" strokeWidth="2" className="dark:fill-gray-800" />
                                <line x1="10" y1="30" x2="90" y2="30" stroke="#e2e8f0" />
                                <line x1="10" y1="60" x2="90" y2="60" stroke="#e2e8f0" />
                                <line x1="10" y1="90" x2="90" y2="90" stroke="#e2e8f0" />
                                <circle cx="80" cy="15" r="3" fill="#22c55e" />
                                <circle cx="65" cy="15" r="3" fill="#e2e8f0" />
                                <text x="50" y="-15" textAnchor="middle" fill="#8b5cf6" fontSize="12" fontWeight="bold">DNS Server</text>
                            </g>

                            {/* Web Server */}
                            <g transform="translate(450, 180)">
                                <rect width="80" height="100" rx="4" fill="white" stroke="#94a3b8" strokeWidth="2" className="dark:fill-gray-800 dark:stroke-gray-600" />
                                <line x1="10" y1="20" x2="70" y2="20" stroke="#e2e8f0" />
                                <line x1="10" y1="40" x2="70" y2="40" stroke="#e2e8f0" />
                                <line x1="10" y1="60" x2="70" y2="60" stroke="#e2e8f0" />
                                <circle cx="60" cy="85" r="2" fill="#22c55e" />
                                <text x="40" y="-15" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="bold">Website</text>
                            </g>

                            {/* Arrows */}
                            <g>
                                <path d="M160 200 L240 200" stroke="#8b5cf6" strokeWidth="2" markerEnd="url(#arrow)" />
                                <text x="200" y="190" textAnchor="middle" fill="#8b5cf6" fontSize="10">"google.com?"</text>

                                <path d="M360 200 L440 200" stroke="#8b5cf6" strokeWidth="2" markerEnd="url(#arrow)" strokeDasharray="4 4" />
                                <text x="400" y="190" textAnchor="middle" fill="#8b5cf6" fontSize="10">142.250...</text>
                            </g>

                            <defs>
                                <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                                    <path d="M0,0 L0,6 L9,3 z" fill="#8b5cf6" />
                                </marker>
                            </defs>

                            <text x="300" y="370" textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="500">How DNS Resolution Works</text>
                        </svg>
                    </div>

                    <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
                        The Domain Name System (DNS) is the phonebook of the internet. Humans access information online through domain names, like google.com or nytimes.com. Web browsers interact through Internet Protocol (IP) addresses. DNS translates domain names to IP addresses so browsers can load Internet resources.
                    </p>

                    <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
                        <span className="bg-purple-100 text-purple-800 p-2 rounded-md mr-4 text-2xl">📝</span>
                        Common DNS Record Types
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                            <h3 className="font-bold text-lg mb-2 text-blue-600">A Record</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">The most basic type of record. It points a domain or subdomain to an IPv4 address (e.g., 192.168.1.1).</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                            <h3 className="font-bold text-lg mb-2 text-indigo-600">AAAA Record</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Similar to the A record, but it points to an IPv6 address (e.g., 2001:0db8...).</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                            <h3 className="font-bold text-lg mb-2 text-orange-600">MX Record</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Mail Exchange records direct email to a mail server. They indicate how email messages should be routed.</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                            <h3 className="font-bold text-lg mb-2 text-green-600">TXT Record</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Used to store text-based information. Often used for email security (SPF, DKIM) and domain verification.</p>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Why Check DNS Records?</h2>
                    <div className="space-y-4 mb-8">
                        <div className="flex items-start gap-3">
                            <div className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">1</div>
                            <div>
                                <h3 className="font-bold text-lg">Troubleshoot Website Downtime</h3>
                                <p className="text-gray-600 dark:text-gray-400">If your site isn't loading, checking the A record ensures your domain is pointing to the correct server IP.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">2</div>
                            <div>
                                <h3 className="font-bold text-lg">Verify Email Configuration</h3>
                                <p className="text-gray-600 dark:text-gray-400">Incorrect MX records will prevent you from receiving emails. SPF/DKIM TXT records are crucial for preventing your emails from going to spam.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">3</div>
                            <div>
                                <h3 className="font-bold text-lg">Confirm Propagation</h3>
                                <p className="text-gray-600 dark:text-gray-400">After moving to a new host, DNS changes can take up to 48 hours to propagate globally. This tool helps you see if the changes have taken effect.</p>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </ToolTemplate>
    );
};

export default WhoisLookup;
