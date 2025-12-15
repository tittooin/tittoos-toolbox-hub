import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Download, PenTool, Eraser, Type } from 'lucide-react';
import { toast } from "sonner";
import ToolTemplate from '@/components/ToolTemplate';

const TextToHandwriting = () => {
    const [text, setText] = useState("This is what digital handwriting looks like. Start typing to see the magic happen! Use this tool to create realistic handwritten notes for your assignments or projects.");
    const [font, setFont] = useState("Caveat");
    const [fontSize, setFontSize] = useState(24);
    const [lineHeight, setLineHeight] = useState(30);
    const [inkColor, setInkColor] = useState("#000000"); // Black
    const [paperType, setPaperType] = useState("lined"); // lined, white, ruled
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // List of handwriting-style fonts available from Google Fonts
    // Note: These must be imported in index.css or loaded dynamically
    const fonts = [
        { name: "Caveat", label: "Casual Flow" },
        { name: "Indie Flower", label: "Playful" },
        { name: "Shadows Into Light", label: "Neat Print" },
        { name: "Dancing Script", label: "Elegant" },
        { name: "Permanent Marker", label: "Bold Marker" },
    ];

    useEffect(() => {
        drawCanvas();
    }, [text, font, fontSize, lineHeight, inkColor, paperType]);

    // Load fonts dynamically
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Caveat&family=Dancing+Script&family=Indie+Flower&family=Permanent+Marker&family=Shadows+Into+Light&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        // Redraw after fonts might have loaded
        setTimeout(drawCanvas, 500);
        setTimeout(drawCanvas, 1000);

        return () => {
            document.head.removeChild(link);
        };
    }, []);

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Constants
        const width = 800;
        const height = 1000;
        const padding = 50;

        canvas.width = width;
        canvas.height = height;

        // 1. Draw Paper Background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);

        if (paperType === 'lined' || paperType === 'ruled') {
            ctx.beginPath();
            ctx.strokeStyle = paperType === 'lined' ? '#e5e7eb' : '#94a3b8'; // Light gray or darker blueish
            ctx.lineWidth = 1;

            // Draw margin line
            if (paperType === 'ruled') {
                ctx.beginPath();
                ctx.moveTo(padding + 20, 0);
                ctx.lineTo(padding + 20, height);
                ctx.strokeStyle = '#ef4444'; // Red margin
                ctx.stroke();
            }

            // Draw horizontal lines
            ctx.strokeStyle = '#cbd5e1';
            for (let y = padding + lineHeight; y < height - padding; y += lineHeight) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }
        }

        // 2. Draw Text
        ctx.font = `${fontSize}px "${font}", cursive`;
        ctx.fillStyle = inkColor;
        ctx.textBaseline = 'bottom';

        const words = text.split(' ');
        let x = padding + (paperType === 'ruled' ? 40 : 0);
        let y = padding + lineHeight - 5; // Align with lines

        words.forEach(word => {
            const wordWidth = ctx.measureText(word + ' ').width;
            if (x + wordWidth > width - padding) {
                x = padding + (paperType === 'ruled' ? 40 : 0);
                y += lineHeight;
            }
            // Add slight randomness to x/y for realism
            const randomY = (Math.random() - 0.5) * 2;
            const randomX = (Math.random() - 0.5) * 2;

            ctx.fillText(word, x + randomX, y + randomY);
            x += wordWidth;
        });
    };

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = 'handwritten-note.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        toast.success("Note downloaded!");
    };

    const features = [
        "Multiple Handwriting Styles",
        "Realistic Paper Backgrounds",
        "Customizable Ink Color",
        "Adjustable Size & Spacing",
        "Free PNG Download"
    ];

    return (
        <ToolTemplate
            title="Text to Handwriting Converter"
            description="Turn digital text into realistic handwritten notes. Choose from different fonts, ink colors, and paper styles."
            icon={PenTool}
            features={features}
        >
            <div className="grid lg:grid-cols-12 gap-8">
                {/* Controls */}
                <div className="lg:col-span-4 space-y-6">
                    <Card>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2">
                                <Label>Select Handwriting Style</Label>
                                <Select value={font} onValueChange={(val) => { setFont(val); drawCanvas(); }}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {fonts.map(f => (
                                            <SelectItem key={f.name} value={f.name} style={{ fontFamily: f.name }}>
                                                {f.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-4">
                                <Label>Font Size: {fontSize}px</Label>
                                <Slider value={[fontSize]} onValueChange={(val) => setFontSize(val[0])} min={12} max={48} step={1} />
                            </div>

                            <div className="space-y-4">
                                <Label>Line Height: {lineHeight}px</Label>
                                <Slider value={[lineHeight]} onValueChange={(val) => setLineHeight(val[0])} min={20} max={60} step={1} />
                            </div>

                            <div className="space-y-2">
                                <Label>Ink Color</Label>
                                <div className="flex gap-2">
                                    {['#000000', '#1e40af', '#e11d48', '#166534'].map(color => (
                                        <button
                                            key={color}
                                            className={`w-8 h-8 rounded-full border-2 ${inkColor === color ? 'border-primary scale-110' : 'border-transparent'}`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => setInkColor(color)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Paper Type</Label>
                                <Select value={paperType} onValueChange={setPaperType}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="white">Plain White</SelectItem>
                                        <SelectItem value="lined">Lined Paper</SelectItem>
                                        <SelectItem value="ruled">Ruled with Margin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button onClick={handleDownload} className="w-full">
                                <Download className="w-4 h-4 mr-2" /> Download Note
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="space-y-2">
                        <Label>Type your text here</Label>
                        <Textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="min-h-[200px]"
                            placeholder="Start typing..."
                        />
                    </div>
                </div>

                {/* Preview */}
                <div className="lg:col-span-8 bg-muted/20 rounded-xl overflow-hidden border p-4 flex items-start justify-center">
                    <div className="shadow-2xl overflow-hidden bg-white max-w-full">
                        <canvas
                            ref={canvasRef}
                            className="max-w-full h-auto"
                            style={{ maxHeight: '800px' }}
                        />
                    </div>
                </div>
            </div>

            {/* SEO Content */}
            <article className="prose dark:prose-invert max-w-none mt-16 pt-8 border-t">
                <h2 className="text-3xl font-bold mb-6">AI Text to Handwriting Converter</h2>
                <p className="lead text-xl text-muted-foreground mb-8">
                    Create realistic handwritten documents without picking up a pen. Perfect for generating study notes, letters, or mockups.
                </p>

                <h3>How to use?</h3>
                <p>
                    Simply type your text into the box on the left. The tool automatically converts your digital font into a cursive or print handwriting style.
                </p>
                <div className="bg-yellow-50 dark:bg-yellow-900/10 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800 my-6">
                    <h4 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">💡 Pro Tip for Realism</h4>
                    <p className="text-sm">
                        Use the "Ruled with Margin" paper setting and Blue Ink to make it look exactly like a student's notebook page!
                    </p>
                </div>
            </article>
        </ToolTemplate>
    );
};

export default TextToHandwriting;
