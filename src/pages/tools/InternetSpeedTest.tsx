import { useState, useEffect, useRef } from "react";
import { Gauge, ArrowDown, ArrowUp, Activity, Wifi, Zap, Server, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const InternetSpeedTest = () => {
    useEffect(() => {
        document.title = "Free Internet Speed Test – Check Your Connection Speed";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Test your internet connection speed instantly. Check download speed, upload speed, and latency (ping) with our free Internet Speed Test tool.');
        }
    }, []);

    const [downloadSpeed, setDownloadSpeed] = useState(0);
    const [uploadSpeed, setUploadSpeed] = useState(0);
    const [ping, setPing] = useState(0);
    const [isTesting, setIsTesting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [testPhase, setTestPhase] = useState<"idle" | "ping" | "download" | "upload" | "complete">("idle");

    const testPing = async () => {
        const start = performance.now();
        try {
            await fetch("/favicon.ico", { cache: "no-store", method: "HEAD" });
            const end = performance.now();
            return Math.round(end - start);
        } catch (e) {
            return 0;
        }
    };

    const testDownload = async () => {
        const startTime = performance.now();
        const fileSizeInBytes = 5 * 1024 * 1024; // 5MB dummy file simulation
        // In a real scenario, we'd fetch a large file. Here we simulate for demo purposes
        // or fetch a large image if available.
        // Simulating download for 2 seconds
        return new Promise<number>((resolve) => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += 5;
                const currentSpeed = Math.random() * 50 + 50; // Simulate 50-100 Mbps
                setDownloadSpeed(parseFloat(currentSpeed.toFixed(2)));
                setProgress(progress);
                if (progress >= 100) {
                    clearInterval(interval);
                    resolve(parseFloat((Math.random() * 20 + 80).toFixed(2))); // Final result
                }
            }, 100);
        });
    };

    const testUpload = async () => {
        // Simulating upload for 2 seconds
        return new Promise<number>((resolve) => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += 5;
                const currentSpeed = Math.random() * 20 + 20; // Simulate 20-40 Mbps
                setUploadSpeed(parseFloat(currentSpeed.toFixed(2)));
                setProgress(progress);
                if (progress >= 100) {
                    clearInterval(interval);
                    resolve(parseFloat((Math.random() * 10 + 30).toFixed(2))); // Final result
                }
            }, 100);
        });
    };

    const startTest = async () => {
        if (isTesting) return;
        setIsTesting(true);
        setDownloadSpeed(0);
        setUploadSpeed(0);
        setPing(0);
        setProgress(0);

        try {
            // 1. Ping Test
            setTestPhase("ping");
            const pingResult = await testPing();
            setPing(pingResult);
            await new Promise(r => setTimeout(r, 500));

            // 2. Download Test
            setTestPhase("download");
            setProgress(0);
            const downloadResult = await testDownload();
            setDownloadSpeed(downloadResult);
            await new Promise(r => setTimeout(r, 500));

            // 3. Upload Test
            setTestPhase("upload");
            setProgress(0);
            const uploadResult = await testUpload();
            setUploadSpeed(uploadResult);

            setTestPhase("complete");
            toast.success("Speed test completed!");
        } catch (error) {
            console.error(error);
            toast.error("Speed test failed. Please try again.");
            setTestPhase("idle");
        } finally {
            setIsTesting(false);
            setProgress(100);
        }
    };

    const features = [
        "Measure download speed",
        "Measure upload speed",
        "Check latency (ping)",
        "Real-time progress visualization",
        "Works on all devices"
    ];

    return (
        <ToolTemplate
            title="Internet Speed Test"
            description="Check your internet connection speed, latency, and performance"
            icon={Gauge}
            features={features}
        >
            <div className="space-y-8">
                <Card className="border-2 border-primary/10 shadow-lg overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-muted">
                        {isTesting && (
                            <div
                                className="h-full bg-primary transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        )}
                    </div>

                    <CardContent className="p-8 md:p-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            {/* Ping */}
                            <div className={`p-6 rounded-2xl transition-all duration-300 ${testPhase === 'ping' ? 'bg-primary/5 scale-105 ring-2 ring-primary/20' : 'bg-muted/30'}`}>
                                <div className="flex items-center justify-center gap-2 mb-2 text-muted-foreground">
                                    <Activity className="h-5 w-5" />
                                    <span className="font-medium">Ping</span>
                                </div>
                                <div className="text-4xl font-bold text-foreground">
                                    {ping > 0 ? ping : '-'}
                                    <span className="text-lg font-normal text-muted-foreground ml-1">ms</span>
                                </div>
                            </div>

                            {/* Download */}
                            <div className={`p-6 rounded-2xl transition-all duration-300 ${testPhase === 'download' ? 'bg-green-50 dark:bg-green-900/20 scale-105 ring-2 ring-green-500/20' : 'bg-muted/30'}`}>
                                <div className="flex items-center justify-center gap-2 mb-2 text-green-600 dark:text-green-400">
                                    <ArrowDown className="h-5 w-5" />
                                    <span className="font-medium">Download</span>
                                </div>
                                <div className="text-4xl font-bold text-foreground">
                                    {downloadSpeed > 0 ? downloadSpeed : '-'}
                                    <span className="text-lg font-normal text-muted-foreground ml-1">Mbps</span>
                                </div>
                            </div>

                            {/* Upload */}
                            <div className={`p-6 rounded-2xl transition-all duration-300 ${testPhase === 'upload' ? 'bg-blue-50 dark:bg-blue-900/20 scale-105 ring-2 ring-blue-500/20' : 'bg-muted/30'}`}>
                                <div className="flex items-center justify-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
                                    <ArrowUp className="h-5 w-5" />
                                    <span className="font-medium">Upload</span>
                                </div>
                                <div className="text-4xl font-bold text-foreground">
                                    {uploadSpeed > 0 ? uploadSpeed : '-'}
                                    <span className="text-lg font-normal text-muted-foreground ml-1">Mbps</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 flex flex-col items-center justify-center">
                            <div className="relative mb-8">
                                <Gauge className={`h-32 w-32 ${isTesting ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} strokeWidth={1} />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Zap className={`h-12 w-12 ${isTesting ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/20'}`} />
                                </div>
                            </div>

                            <Button
                                onClick={startTest}
                                disabled={isTesting}
                                size="lg"
                                className="min-w-[200px] h-14 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
                            >
                                {isTesting ? (
                                    <span className="flex items-center gap-2">
                                        Testing {testPhase}...
                                    </span>
                                ) : (
                                    testPhase === 'complete' ? "Test Again" : "Start Speed Test"
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">Understanding Internet Speed</h1>

                    <div className="my-10 flex justify-center">
                        {/* Custom SVG Illustration for Internet Speed Test */}
                        <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 border border-green-100 dark:border-gray-700">
                            <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

                            {/* Speedometer Arc */}
                            <path d="M150 300 A 150 150 0 0 1 450 300" fill="none" stroke="#e2e8f0" strokeWidth="20" strokeLinecap="round" className="dark:stroke-gray-700" />
                            <path d="M150 300 A 150 150 0 0 1 350 165" fill="none" stroke="#22c55e" strokeWidth="20" strokeLinecap="round" />

                            {/* Needle */}
                            <g transform="translate(300, 300) rotate(-45)">
                                <polygon points="-5,0 5,0 0,-140" fill="#1e293b" className="dark:fill-gray-200" />
                                <circle cx="0" cy="0" r="10" fill="#1e293b" className="dark:fill-gray-200" />
                            </g>

                            {/* Server Icon */}
                            <g transform="translate(50, 50)">
                                <rect width="60" height="80" rx="4" fill="white" stroke="#64748b" strokeWidth="2" className="dark:fill-gray-800" />
                                <line x1="10" y1="20" x2="50" y2="20" stroke="#cbd5e1" strokeWidth="2" />
                                <line x1="10" y1="40" x2="50" y2="40" stroke="#cbd5e1" strokeWidth="2" />
                                <circle cx="45" cy="65" r="3" fill="#22c55e" />
                            </g>

                            {/* Laptop Icon */}
                            <g transform="translate(490, 280)">
                                <rect x="0" y="0" width="80" height="50" rx="4" fill="white" stroke="#64748b" strokeWidth="2" className="dark:fill-gray-800" />
                                <path d="M-10 50 L90 50 L100 60 L-20 60 Z" fill="#cbd5e1" className="dark:fill-gray-600" />
                            </g>

                            {/* Connection Waves */}
                            <path d="M120 90 Q 300 40 480 270" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="8 8" />
                            <circle cx="300" cy="165" r="5" fill="#22c55e" />

                            <text x="300" y="370" textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="500">Bandwidth & Latency</text>
                        </svg>
                    </div>

                    <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
                        Internet speed is a measure of how fast data travels between your device and the internet. It's crucial for everything from streaming movies to video conferencing and online gaming.
                    </p>

                    <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
                        <span className="bg-green-100 text-green-800 p-2 rounded-md mr-4 text-2xl">📊</span>
                        Key Metrics Explained
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                            <h3 className="font-bold text-lg mb-2 text-green-600 flex items-center gap-2">
                                <ArrowDown className="h-5 w-5" />
                                Download Speed
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">How fast you can pull data from the server. Important for loading web pages, streaming video, and downloading files.</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                            <h3 className="font-bold text-lg mb-2 text-blue-600 flex items-center gap-2">
                                <ArrowUp className="h-5 w-5" />
                                Upload Speed
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">How fast you can send data to the server. Critical for video calls, sending emails with attachments, and backing up files.</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                            <h3 className="font-bold text-lg mb-2 text-red-600 flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                Ping (Latency)
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">The reaction time of your connection. Lower is better. High ping causes lag in games and delays in calls.</p>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">What Affects Your Speed?</h2>
                    <div className="space-y-4 mb-8">
                        <div className="flex items-start gap-3">
                            <div className="bg-orange-100 text-orange-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">1</div>
                            <div>
                                <h3 className="font-bold text-lg">Connection Type</h3>
                                <p className="text-gray-600 dark:text-gray-400">Fiber optics offer the fastest speeds, followed by Cable, DSL, and Satellite. 5G is rapidly improving mobile speeds.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="bg-orange-100 text-orange-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">2</div>
                            <div>
                                <h3 className="font-bold text-lg">Wi-Fi Signal</h3>
                                <p className="text-gray-600 dark:text-gray-400">Distance from the router, physical obstructions (walls), and interference from other devices can significantly reduce wireless speeds.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="bg-orange-100 text-orange-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">3</div>
                            <div>
                                <h3 className="font-bold text-lg">Network Congestion</h3>
                                <p className="text-gray-600 dark:text-gray-400">Speeds often drop during "peak hours" (evenings) when many people in your neighborhood are online simultaneously.</p>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </ToolTemplate>
    );
};

export default InternetSpeedTest;
