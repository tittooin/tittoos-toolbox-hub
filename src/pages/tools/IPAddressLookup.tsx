import { useState, useEffect } from "react";
import { Globe, MapPin, Network, Shield, Server, Info, Wifi, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

interface IPData {
    ip: string;
    city: string;
    region: string;
    country_name: string;
    org: string; // ISP
    asn: string;
    postal: string;
    latitude: number;
    longitude: number;
    timezone: string;
}

const IPAddressLookup = () => {
    useEffect(() => {
        document.title = "Free IP Address Lookup – Check My IP & Location";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Instantly check your public IP address, location, ISP, and network details with our free IP Address Lookup tool.');
        }
    }, []);

    const [ipData, setIpData] = useState<IPData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchIPData = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch("https://ipapi.co/json/");
            if (!response.ok) {
                throw new Error("Failed to fetch IP data");
            }
            const data = await response.json();
            if (data.error) {
                throw new Error(data.reason || "Failed to fetch IP data");
            }
            setIpData(data);
            toast.success("IP details updated successfully!");
        } catch (err) {
            console.error(err);
            setError("Could not retrieve IP details. Please try again later or disable ad blockers.");
            toast.error("Failed to fetch IP details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIPData();
    }, []);

    const features = [
        "Instant IP address detection",
        "Geolocation (City, Region, Country)",
        "ISP and Organization details",
        "Timezone and coordinates",
        "Completely free and secure"
    ];

    return (
        <ToolTemplate
            title="IP Address Lookup"
            description="Instantly find your public IP address, location, and network provider details"
            icon={Globe}
            features={features}
        >
            <div className="space-y-8">
                {/* Main Result Card */}
                <Card className="border-2 border-primary/10 shadow-lg">
                    <CardHeader className="bg-muted/30 pb-8">
                        <CardTitle className="text-center">
                            <span className="text-muted-foreground text-sm font-medium uppercase tracking-wider block mb-2">Your Public IP Address</span>
                            {loading ? (
                                <div className="h-12 w-48 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mx-auto"></div>
                            ) : error ? (
                                <span className="text-red-500 text-xl">Unavailable</span>
                            ) : (
                                <span className="text-4xl md:text-6xl font-black text-primary tracking-tight">{ipData?.ip}</span>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="-mt-4">
                        <div className="bg-card rounded-xl border shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                                        <MapPin className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground font-medium">Location</p>
                                        {loading ? (
                                            <div className="h-6 w-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded mt-1"></div>
                                        ) : ipData ? (
                                            <p className="text-lg font-semibold">{ipData.city}, {ipData.region}, {ipData.country_name}</p>
                                        ) : (
                                            <p className="text-gray-500">-</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                                        <Network className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground font-medium">ISP / Organization</p>
                                        {loading ? (
                                            <div className="h-6 w-40 bg-gray-100 dark:bg-gray-800 animate-pulse rounded mt-1"></div>
                                        ) : ipData ? (
                                            <p className="text-lg font-semibold">{ipData.org}</p>
                                        ) : (
                                            <p className="text-gray-500">-</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                                        <Activity className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground font-medium">Coordinates</p>
                                        {loading ? (
                                            <div className="h-6 w-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded mt-1"></div>
                                        ) : ipData ? (
                                            <p className="text-lg font-semibold">{ipData.latitude}, {ipData.longitude}</p>
                                        ) : (
                                            <p className="text-gray-500">-</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">
                                        <Server className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground font-medium">ASN</p>
                                        {loading ? (
                                            <div className="h-6 w-24 bg-gray-100 dark:bg-gray-800 animate-pulse rounded mt-1"></div>
                                        ) : ipData ? (
                                            <p className="text-lg font-semibold">{ipData.asn}</p>
                                        ) : (
                                            <p className="text-gray-500">-</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <Button onClick={fetchIPData} disabled={loading} size="lg" className="min-w-[200px]">
                                {loading ? "Detecting..." : "Refresh Details"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Article Section */}
                <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">Understanding IP Addresses</h1>

                    <div className="my-10 flex justify-center">
                        {/* Custom SVG Illustration for IP Address Lookup */}
                        <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 border border-blue-100 dark:border-gray-700">
                            <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

                            {/* World Map Background (Abstract) */}
                            <path d="M50 200 Q 150 100 250 200 T 450 200 T 550 150" fill="none" stroke="#e2e8f0" strokeWidth="2" className="dark:stroke-gray-700" />
                            <path d="M50 250 Q 150 150 250 250 T 450 250" fill="none" stroke="#e2e8f0" strokeWidth="2" className="dark:stroke-gray-700" />

                            {/* Central Server/Node */}
                            <g transform="translate(300, 200)">
                                <circle cx="0" cy="0" r="40" fill="#3b82f6" opacity="0.1" />
                                <circle cx="0" cy="0" r="30" fill="#3b82f6" opacity="0.2" />
                                <circle cx="0" cy="0" r="20" fill="#3b82f6" />
                                <Globe className="h-8 w-8 text-white" x="-16" y="-16" />
                            </g>

                            {/* Connected Devices */}
                            <g transform="translate(150, 150)">
                                <line x1="0" y1="0" x2="130" y2="35" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
                                <circle cx="0" cy="0" r="15" fill="white" stroke="#64748b" strokeWidth="2" className="dark:fill-gray-800" />
                                <rect x="-8" y="-8" width="16" height="12" rx="2" fill="#64748b" />
                            </g>

                            <g transform="translate(450, 150)">
                                <line x1="0" y1="0" x2="-130" y2="35" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
                                <circle cx="0" cy="0" r="15" fill="white" stroke="#64748b" strokeWidth="2" className="dark:fill-gray-800" />
                                <rect x="-6" y="-10" width="12" height="20" rx="2" fill="#64748b" />
                            </g>

                            <g transform="translate(300, 320)">
                                <line x1="0" y1="0" x2="0" y2="-100" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
                                <rect x="-40" y="-15" width="80" height="30" rx="4" fill="white" stroke="#3b82f6" strokeWidth="2" className="dark:fill-gray-800" />
                                <text x="0" y="5" textAnchor="middle" fill="#3b82f6" fontSize="12" fontWeight="bold">192.168.1.1</text>
                            </g>

                            <text x="300" y="370" textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="500">Global Connectivity</text>
                        </svg>
                    </div>

                    <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
                        Every device connected to the internet has a unique identifier called an <strong>IP (Internet Protocol) address</strong>. It acts like a digital home address, allowing data to find its way to and from your device across the vast network of the web.
                    </p>

                    <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
                        <span className="bg-blue-100 text-blue-800 p-2 rounded-md mr-4 text-2xl">🌐</span>
                        What Does Your IP Reveal?
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-red-500" />
                                Approximate Location
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Your IP address maps to a geographic region, usually identifying your city, state, and country. It's not exact enough to pinpoint your house, but accurate enough for regional targeting.</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                <Network className="h-5 w-5 text-purple-500" />
                                Internet Service Provider (ISP)
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">The company providing your internet connection (e.g., Comcast, AT&T, Verizon) owns the block of IP addresses you use.</p>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">IPv4 vs. IPv6</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="py-4 px-4 font-bold text-gray-900 dark:text-gray-100">Feature</th>
                                    <th className="py-4 px-4 font-bold text-blue-600">IPv4 (Legacy)</th>
                                    <th className="py-4 px-4 font-bold text-green-600">IPv6 (Modern)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-100 dark:border-gray-800">
                                    <td className="py-4 px-4 font-medium">Format</td>
                                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400">32-bit numeric (e.g., 192.168.1.1)</td>
                                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400">128-bit alphanumeric (e.g., 2001:0db8...)</td>
                                </tr>
                                <tr className="border-b border-gray-100 dark:border-gray-800">
                                    <td className="py-4 px-4 font-medium">Address Space</td>
                                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400">~4.3 billion addresses (Exhausted)</td>
                                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400">Undecillion addresses (Infinite)</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-medium">Security</td>
                                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400">Security was an afterthought</td>
                                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400">IPSec built-in for better security</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Privacy Tips</h2>
                    <div className="bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-400 p-6 rounded-r-xl">
                        <h3 className="font-bold text-lg mb-2 text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            How to Hide Your IP
                        </h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                            <li><strong>Use a VPN (Virtual Private Network):</strong> Encrypts your traffic and routes it through a server in a different location.</li>
                            <li><strong>Use a Proxy:</strong> Acts as an intermediary, masking your IP but often without encryption.</li>
                            <li><strong>Use Tor Browser:</strong> Routes your traffic through multiple volunteer nodes for high anonymity.</li>
                        </ul>
                    </div>
                </article>
            </div>
        </ToolTemplate>
    );
};

export default IPAddressLookup;
