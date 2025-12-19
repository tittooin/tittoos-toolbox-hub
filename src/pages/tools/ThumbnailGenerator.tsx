import { useState, useRef, useEffect } from "react";
import { Download, Sparkles, Type, Wand2, Youtube, Palette, RefreshCcw, Move, MousePointer2, Sticker, Plus, Trash2, Layers, Image as ImageIcon, Upload, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";
// import removeBackground from "@imgly/background-removal";

// Simple UUID generator fallback
const generateId = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const THEMES = {
    MODERN: { id: 'MODERN', label: "Modern & Clean", font: "Inter, sans-serif", promptMod: "high quality, ultra realistic, 8k, modern studio, sharp focus", color: "#FFFFFF", shadow: "#000000" },
    GAMING: { id: 'GAMING', label: "Gaming (High Energy)", font: "'Bangers', cursive", promptMod: "gaming style, vibrant, neon, fortnite style, minecraft style, high contrast, action packed, glowing", color: "#FFD700", shadow: "#000000" },
    CINEMATIC: { id: 'CINEMATIC', label: "Cinematic (Movie)", font: "'Cinzel', serif", promptMod: "cinematic lighting, movie scene, dramatic, 4k, film grain, anamorphic lens flare", color: "#E0E0E0", shadow: "rgba(0,0,0,0.9)" },
    VLOG: { id: 'VLOG', label: "Vlog / Lifestyle", font: "'Permanent Marker', cursive", promptMod: "lifestyle vlog, bright, airy, cozy, youtube personality style, canon m50 photography", color: "#FF69B4", shadow: "#333333" },
    NEWS: { id: 'NEWS', label: "News / Serious", font: "'Roboto Condensed', sans-serif", promptMod: "news broadcast style, breaking news, serious tone, cnn style, professional studio", color: "#FF0000", shadow: "#FFFFFF" },
};

const FONTS = [
    { label: "Modern (Inter)", value: "Inter, sans-serif" },
    { label: "Gaming (Bangers)", value: "'Bangers', cursive" },
    { label: "Cinematic (Cinzel)", value: "'Cinzel', serif" },
    { label: "Handwritten (Permanent Marker)", value: "'Permanent Marker', cursive" },
    { label: "Bold Condensed (Roboto)", value: "'Roboto Condensed', sans-serif" },
    { label: "Standard Serif", value: "serif" },
    { label: "Standard Sans", value: "sans-serif" },
];

const STICKER_PRESETS = {
    EMOJI: ["🔥", "😱", "🔴", "⭐", "💯", "🚀", "💀", "🤡", "💰", "🎮"],
    ARROWS: ["←", "→", "↑", "↓", "↖", "↗", "↘", "↙"],
    BADGES: ["4K", "HD", "LIVE", "NEW", "1 VS 1", "WTF?", "OMG", "VS"],
    SOCIAL: ["SUBSCRIBE", "LIKE", "FOLLOW", "SHARE", "COMMENT"],
    SHAPES: ["⭕", "➡️", "⬅️", "⬆️", "⬇️", "❌", "✅", "🔥", "✨"]
};

// --- HELPERS ---
const rotatePoint = (x: number, y: number, cx: number, cy: number, angle: number) => {
    const rad = (Math.PI / 180) * angle;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
    const ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return { x: nx, y: ny };
};

const isPointInRotatedRect = (px: number, py: number, x: number, y: number, w: number, h: number, angle: number) => {
    // Rotate point back to 0 (relative to center)
    const rad = -(Math.PI / 180) * angle;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const dx = px - x;
    const dy = py - y;
    const nx = (cos * dx) - (sin * dy);
    const ny = (cos * dy) + (sin * dx);
    return nx >= -w / 2 && nx <= w / 2 && ny >= -h / 2 && ny <= h / 2;
};

// --- DATA STRUCTURES ---

interface CanvasElement {
    id: string;
    type: 'text' | 'sticker' | 'badge' | 'image' | 'shape';
    content: string; // If image, this is the Object URL
    x: number;
    y: number;
    rotation: number;
    scale: number;

    // Style Props
    fontSize: number;
    fontFamily: string;
    color: string;
    backgroundColor?: string; // For badges
    shadowColor?: string; // For Text Shadow OR Image Glow

    // Image Specific
    width?: number;
    height?: number;
    aspectRatio?: number;

    // Filters (Images only)
    brightness?: number; // 100 is default
    contrast?: number;   // 100 is default
    saturation?: number; // 100 is default

    // Advanced Text/Shape Styling
    strokeColor?: string;
    strokeWidth?: number;
    shadowBlur?: number;
    opacity?: number;

    // Shapes
    shapeType?: 'rectangle' | 'circle'; // for type='shape'
    borderRadius?: number;
}

const ThumbnailGenerator = () => {
    // Basic Input State
    const [videoTitle, setVideoTitle] = useState("");
    const [selectedTheme, setSelectedTheme] = useState<keyof typeof THEMES>("MODERN");

    // Canvas Object State
    const [elements, setElements] = useState<CanvasElement[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Image State
    const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
    const [visualPrompt, setVisualPrompt] = useState("");
    const [isGeneratingMeta, setIsGeneratingMeta] = useState(false);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [isremovingBg, setIsRemovingBg] = useState(false);

    // Refs
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const loadedImageRef = useRef<HTMLImageElement | null>(null);
    const draggingRef = useRef<{ id: string, startX: number, startY: number, elemX: number, elemY: number, handle?: string, startW?: number, startH?: number, startRot?: number, originalFontSize?: number } | null>(null);
    const elementImagesRef = useRef<{ [key: string]: HTMLImageElement }>({}); // Cache for user uploads

    // --- HELPERS ---

    const addTextElement = (text: string, isTitle = false) => {
        const theme = THEMES[selectedTheme];
        const newEl: CanvasElement = {
            id: generateId(),
            type: 'text',
            content: text,
            x: 640,
            y: isTitle ? 360 : 500,
            rotation: 0,
            scale: 1,
            fontSize: isTitle ? 100 : 60,
            fontFamily: theme.font,
            color: theme.color,
            shadowColor: theme.shadow
        };
        setElements(prev => [...prev, newEl]);
        setSelectedId(newEl.id);
    };

    const addStickerElement = (content: string, type: 'sticker' | 'badge' = 'sticker') => {
        const newEl: CanvasElement = {
            id: generateId(),
            type: type,
            content: content,
            x: 640,
            y: 360,
            rotation: 0,
            scale: 1,
            fontSize: type === 'badge' ? 50 : 80,
            fontFamily: 'Inter, sans-serif',
            color: '#FFFFFF',
            backgroundColor: '#FF0000',
            shadowColor: 'black'
        };
        setElements(prev => [...prev, newEl]);
        setSelectedId(newEl.id);
    };

    const addShapeElement = (shapeType: 'rectangle' | 'circle') => {
        const newEl: CanvasElement = {
            id: generateId(),
            type: 'shape',
            shapeType: shapeType,
            content: '', // No text content
            x: 640,
            y: 360,
            rotation: 0,
            scale: 1,
            width: 200,
            height: 200,
            fontSize: 0,
            fontFamily: '',
            color: shapeType === 'circle' ? '#3B82F6' : '#EF4444', // Blue circle, Red rect default
            strokeColor: '#FFFFFF',
            strokeWidth: 0,
            shadowColor: 'rgba(0,0,0,0.5)',
            shadowBlur: 0,
            opacity: 100,
            borderRadius: 0
        };
        setElements(prev => [...prev, newEl]);
        setSelectedId(newEl.id);
    };

    const addImageElement = (url: string) => {
        const id = generateId();
        // Pre-load to get dimensions
        const img = new window.Image();
        img.src = url;
        img.onload = () => {
            elementImagesRef.current[id] = img; // Cache it
            const aspectRatio = img.width / img.height;
            const baseHeight = 400; // Default height

            const newEl: CanvasElement = {
                id: id,
                type: 'image',
                content: url,
                x: 640,
                y: 360,
                rotation: 0,
                scale: 1,
                fontSize: 0, // Not used
                fontFamily: '',
                color: '',
                shadowColor: '#FFFFFF', // Default Glow Color
                width: baseHeight * aspectRatio,
                height: baseHeight,
                aspectRatio: aspectRatio
            };
            setElements(prev => [...prev, newEl]);
            setSelectedId(newEl.id);
        };
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsRemovingBg(true);
        toast.info("Removing background... This might take a moment.");

        try {
            // 1. Remove BG
            // const blob = await removeBackground(file);
            // const url = URL.createObjectURL(blob);

            // 2. Add to Canvas
            const url = URL.createObjectURL(file);
            addImageElement(url);
            toast.success("Selfie added!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to remove background. Try a simpler image.");
            // Fallback: Add original
            const url = URL.createObjectURL(file);
            addImageElement(url);
        } finally {
            setIsRemovingBg(false);
        }
    };


    const updateSelectedElement = (updates: Partial<CanvasElement>) => {
        if (!selectedId) return;
        setElements(prev => prev.map(el => el.id === selectedId ? { ...el, ...updates } : el));
    };

    const deleteSelectedElement = () => {
        if (!selectedId) return;
        setElements(prev => prev.filter(el => el.id !== selectedId));
        setSelectedId(null);
    };

    const moveLayer = (direction: 'up' | 'down') => {
        if (!selectedId) return;
        const index = elements.findIndex(el => el.id === selectedId);
        if (index === -1) return;

        setElements(prev => {
            const newArr = [...prev];
            if (direction === 'up' && index < newArr.length - 1) {
                [newArr[index], newArr[index + 1]] = [newArr[index + 1], newArr[index]];
            } else if (direction === 'down' && index > 0) {
                [newArr[index], newArr[index - 1]] = [newArr[index - 1], newArr[index]];
            }
            return newArr;
        });
    };

    // --- AI GENERATION ---

    const generateMetadata = async () => {
        if (!videoTitle.trim()) {
            toast.error("Please enter a video title first!");
            return;
        }

        setIsGeneratingMeta(true);
        setElements([]);

        try {
            const themeContext = THEMES[selectedTheme].promptMod;
            const prompt = `
        Act as a YouTube Expert. I have a video titled "${videoTitle}". 
        The style/theme is "${selectedTheme}" (${themeContext}).
        Create a JSON object with 3 fields:
        1. "visualPrompt": A highly detailed visual description for an AI image generator background matching the theme. No text in the image.
        2. "thumbnailText": Catchy, short text (max 4-5 words) to overlay.
        3. "cta": A 1-2 word CTA sticker text (e.g., "SHOCKING", "MUST SEE").
        
        Return ONLY the raw JSON.
      `;

            const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`);
            const text = await response.text();
            const jsonStr = text.replace(/```json|```/g, '').trim();
            const data = JSON.parse(jsonStr);

            setVisualPrompt(data.visualPrompt || `Dramatic background for ${videoTitle}`);

            // Add Elements
            const titleText = data.thumbnailText || videoTitle.toUpperCase();
            addTextElement(titleText, true);

            const ctaText = data.cta || "WATCH NOW";
            const ctaEl: CanvasElement = {
                id: generateId(),
                type: 'badge',
                content: ctaText,
                x: 1050,
                y: 100,
                rotation: 5,
                scale: 1,
                fontSize: 60,
                fontFamily: THEMES[selectedTheme].font,
                color: '#FFFFFF',
                backgroundColor: '#FF0000',
                shadowColor: 'white'
            };
            setElements(prev => [...prev, ctaEl]);

            generateImage(data.visualPrompt);

        } catch (error) {
            console.error("Meta Gen Error:", error);
            toast.error("AI Brain freeze! Generating generic metadata...");
            addTextElement(videoTitle.toUpperCase(), true);
            generateImage(`${THEMES[selectedTheme].promptMod} background for "${videoTitle}"`);
        } finally {
            setIsGeneratingMeta(false);
        }
    };

    const generateImage = async (promptToUse: string) => {
        setIsGeneratingImage(true);
        try {
            const width = 1280;
            const height = 720;
            const seed = Math.floor(Math.random() * 1000000);
            const themeMod = THEMES[selectedTheme].promptMod;
            const enhancedPrompt = encodeURIComponent(`${promptToUse}, ${themeMod}, no text, 8k`);
            const url = `https://image.pollinations.ai/prompt/${enhancedPrompt}?width=${width}&height=${height}&nologo=true&seed=${seed}`;

            const img = new window.Image();
            img.crossOrigin = "anonymous";
            img.src = url;
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });

            setBackgroundUrl(url);
            toast.success("Thumbnail background generated!");
        } catch (error) {
            console.error("Image Gen Error:", error);
            toast.error("Failed to generate background image.");
        } finally {
            setIsGeneratingImage(false);
        }
    };

    useEffect(() => {
        if (!backgroundUrl) return;
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.src = backgroundUrl;
        img.onload = () => {
            loadedImageRef.current = img;
            renderCanvas();
        };
    }, [backgroundUrl]);


    // --- RENDERING ---

    const getWrappedLines = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
        const paragraphs = text.split('\n');
        const finalLines: string[] = [];
        paragraphs.forEach(paragraph => {
            const words = paragraph.split(' ');
            let currentLine = words[0];
            for (let i = 1; i < words.length; i++) {
                const word = words[i];
                const width = ctx.measureText(currentLine + " " + word).width;
                if (width < maxWidth) {
                    currentLine += " " + word;
                } else {
                    finalLines.push(currentLine);
                    currentLine = word;
                }
            }
            finalLines.push(currentLine);
        });
        return finalLines;
    };

    const renderCanvas = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 1. Draw Background
        if (loadedImageRef.current) {
            ctx.drawImage(loadedImageRef.current, 0, 0, 1280, 720);
            const gradient = ctx.createLinearGradient(0, 0, 0, 720);
            gradient.addColorStop(0, "rgba(0,0,0,0.1)");
            gradient.addColorStop(1, "rgba(0,0,0,0.5)");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 1280, 720);
        } else {
            ctx.fillStyle = "#1a1a1a";
            ctx.fillRect(0, 0, 1280, 720);
        }

        // 2. Draw Elements (Sorted by type? Images should probably be behind text?)
        // Let's rely on array order (user added order).
        // Maybe we need a layer system later. 

        elements.forEach(el => {
            ctx.save();
            ctx.translate(el.x, el.y);
            ctx.rotate(el.rotation * Math.PI / 180);
            ctx.scale(el.scale, el.scale);

            if (el.type === 'image') {
                const img = elementImagesRef.current[el.id];
                if (img) {
                    const w = el.width || 400;
                    const h = el.height || 400;

                    // Apply Filters
                    const brightness = el.brightness || 100;
                    const contrast = el.contrast || 100;
                    const saturate = el.saturation || 100;
                    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%)`;

                    // Draw Shadow/Glow first
                    if (el.shadowColor) {
                        ctx.shadowColor = el.shadowColor;
                        ctx.shadowBlur = 20;
                        ctx.shadowOffsetX = 0;
                        ctx.shadowOffsetY = 0;
                        // Draw multiple times for intensity?
                        ctx.drawImage(img, -w / 2, -h / 2, w, h);
                        ctx.shadowBlur = 0; // Reset
                    }

                    // Draw Image
                    ctx.drawImage(img, -w / 2, -h / 2, w, h);

                    // Optional: White Stroke Logic (Complex in canvas without SVG path)
                    // For now, glow/shadow is the "YouTuber Effect".
                }
            }
            else if (el.type === 'badge') {
                ctx.font = `bold ${el.fontSize}px ${el.fontFamily}`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                const metrics = ctx.measureText(el.content);
                const p = 20;
                const w = metrics.width + p * 2;
                const h = el.fontSize * 1.4;

                ctx.fillStyle = el.backgroundColor || 'red';
                ctx.beginPath();
                ctx.roundRect(-w / 2, -h / 2, w, h, 10);
                ctx.fill();

                if (el.shadowColor) {
                    ctx.strokeStyle = el.shadowColor;
                    ctx.lineWidth = 4;
                    ctx.stroke();
                }

                ctx.fillStyle = el.color;
                ctx.fillText(el.content, 0, 5);
            }
            else if (el.type === 'sticker') {
                ctx.font = `${el.fontSize}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(el.content, 0, 0);
            }
            else if (el.type === 'shape') {
                const w = (el.width || 100);
                const h = (el.height || 100);

                ctx.fillStyle = el.color;
                ctx.strokeStyle = el.strokeColor || 'transparent';
                ctx.lineWidth = el.strokeWidth || 0;

                // Shadow / Neon
                if (el.shadowColor && el.shadowBlur) {
                    ctx.shadowColor = el.shadowColor;
                    ctx.shadowBlur = el.shadowBlur;
                }

                ctx.globalAlpha = (el.opacity || 100) / 100;

                ctx.beginPath();
                if (el.shapeType === 'circle') {
                    ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, 2 * Math.PI);
                } else {
                    // Rectangle with rounded corners?
                    if (ctx.roundRect) {
                        ctx.roundRect(-w / 2, -h / 2, w, h, el.borderRadius || 0);
                    } else {
                        ctx.rect(-w / 2, -h / 2, w, h);
                    }
                }

                ctx.fill();
                if (el.strokeWidth) ctx.stroke();

                ctx.shadowBlur = 0; // Reset
                ctx.globalAlpha = 1.0;
            }
            else {
                // TEXT
                ctx.font = `900 ${el.fontSize}px ${el.fontFamily}`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                let lines = [el.content];
                lines = getWrappedLines(ctx, el.content, 1000);

                ctx.fillStyle = el.color;

                // Shadow / Glow
                if (el.shadowColor && el.shadowBlur) {
                    ctx.shadowColor = el.shadowColor;
                    ctx.shadowBlur = el.shadowBlur;
                } else {
                    ctx.shadowColor = 'transparent';
                    ctx.shadowBlur = 0;
                }

                const lineHeight = el.fontSize * 1.1;
                const totalHeight = lines.length * lineHeight;

                lines.forEach((line, i) => {
                    const yOffset = (i * lineHeight) - (totalHeight / 2) + (lineHeight / 2);

                    // Stroke (Outline)
                    if (el.strokeWidth && el.strokeWidth > 0) {
                        ctx.strokeStyle = el.strokeColor || 'black';
                        ctx.lineWidth = el.strokeWidth;
                        ctx.lineJoin = 'round';
                        ctx.strokeText(line, 0, yOffset);
                    }

                    ctx.fillText(line, 0, yOffset);
                });

                ctx.shadowBlur = 0; // Reset
            }

            // Selection Indicator
            if (el.id === selectedId) {
                const w = el.width || (el.type === 'text' ? el.fontSize * el.content.length * 0.6 : 100);
                const h = el.height || (el.type === 'text' ? el.fontSize : 100);
                const halfW = w / 2;
                const halfH = h / 2;

                // Selection Border
                ctx.save();
                // Already translated/rotated by parent block

                ctx.strokeStyle = '#3B82F6';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.strokeRect(-halfW - 5, -halfH - 5, w + 10, h + 10);

                // Resize Handles (Corners)
                ctx.fillStyle = '#FFFFFF';
                ctx.strokeStyle = '#3B82F6';
                ctx.setLineDash([]);
                ctx.lineWidth = 1;

                const handles = [
                    { x: -halfW, y: -halfH }, // TL
                    { x: halfW, y: -halfH },  // TR
                    { x: -halfW, y: halfH },  // BL
                    { x: halfW, y: halfH }    // BR
                ];

                handles.forEach(handle => {
                    ctx.beginPath();
                    ctx.arc(handle.x, handle.y, 6, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.stroke();
                });

                ctx.restore();
            }
            ctx.restore();
            // Reset filter
            ctx.filter = 'none';
        });
    };

    useEffect(() => {
        renderCanvas();
    }, [elements, selectedId, backgroundUrl]);


    // --- INTERACTIONS ---

    const getMousePos = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        const { x, y } = getMousePos(e);

        // 1. Check Handles first (if selected)
        if (selectedId) {
            const el = elements.find(e => e.id === selectedId);
            if (el) {
                const w = el.width || (el.type === 'text' ? el.fontSize * el.content.length * 0.6 : 100);
                const h = el.height || el.fontSize || 100;
                const halfW = w / 2;
                const halfH = h / 2;

                // Rotated corners
                const corners = [
                    { h: 'tl', cx: -halfW, cy: -halfH },
                    { h: 'tr', cx: halfW, cy: -halfH },
                    { h: 'bl', cx: -halfW, cy: halfH },
                    { h: 'br', cx: halfW, cy: halfH },
                ];

                for (let c of corners) {
                    const p = rotatePoint(el.x + c.cx, el.y + c.cy, el.x, el.y, el.rotation);
                    // Simple circle check for handle
                    if (Math.hypot(x - p.x, y - p.y) < 15) {
                        draggingRef.current = {
                            id: selectedId,
                            startX: x,
                            startY: y,
                            elemX: el.x,
                            elemY: el.y,
                            handle: c.h,
                            startW: w,
                            startH: h,
                            startRot: el.rotation,
                            originalFontSize: el.fontSize // Store for text scaling
                        };
                        return;
                    }
                }
            }
        }

        // 2. Check Elements (Reverse order for Z-index)
        let clickedId: string | null = null;
        for (let i = elements.length - 1; i >= 0; i--) {
            const el = elements[i];
            const w = el.width || (el.type === 'text' ? el.fontSize * el.content.length * 0.5 : 100); // approx text width
            const h = el.height || (el.type === 'text' ? el.fontSize : 100);

            if (isPointInRotatedRect(x, y, el.x, el.y, w, h, el.rotation)) {
                clickedId = el.id;
                break;
            }
        }

        if (clickedId) {
            setSelectedId(clickedId);
            const el = elements.find(e => e.id === clickedId)!;
            draggingRef.current = {
                id: clickedId,
                startX: x,
                startY: y,
                elemX: el.x,
                elemY: el.y
            };
        } else {
            setSelectedId(null);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!draggingRef.current) return;
        const { x, y } = getMousePos(e);
        const { id, startX, startY, elemX, elemY, handle, startW, startH } = draggingRef.current;
        const dx = x - startX;
        const dy = y - startY;

        if (handle && startW && startH) {
            // RESIZING LOGIC
            // This is tricky with rotation. For MVP, we'll do simple scaling based on distance or project dx/dy onto axes.
            // Simplest: use 'br' (Bottom Right) to scale.
            // Ideal: Project mouse delta onto element's local axes.

            // Let's assume unrotated for calculation simplicity first to prove concept, OR enable free transform
            // Actually, correctly:
            const el = elements.find(e => e.id === id)!;
            const rad = (Math.PI / 180) * el.rotation;
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);

            // Rotate delta into local space
            const localDx = (dx * cos) + (dy * sin);
            const localDy = (dy * cos) - (dx * sin);

            let newW = startW;
            let newH = startH;

            if (handle === 'br') { newW += localDx; newH += localDy; }
            if (handle === 'bl') { newW -= localDx; newH += localDy; }
            if (handle === 'tr') { newW += localDx; newH -= localDy; }
            if (handle === 'tl') { newW -= localDx; newH -= localDy; }

            if (el.type === 'text') {
                // For text, we scale fontSize based on the change in width/height (approx diagonal)
                // Or simpler: just use height change to drive font size
                const scaleFactor = newH / startH;
                const newFontSize = (draggingRef.current.originalFontSize || 100) * scaleFactor;
                updateSelectedElement({ fontSize: Math.max(10, newFontSize) });
            } else {
                // Shapes/Images
                updateSelectedElement({ width: Math.max(20, newW), height: Math.max(20, newH) });
            }

        } else {
            // MOVING logic
            updateSelectedElement({ x: elemX + dx, y: elemY + dy });
        }
    };

    const handleMouseUp = () => { draggingRef.current = null; };

    // --- TOUCH EVENTS FOR MOBILE ---
    const getTouchPos = (e: React.TouchEvent, touchIndex: number = 0) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        const scaleX = canvasRef.current!.width / rect.width;
        const scaleY = canvasRef.current!.height / rect.height;
        const touch = e.touches[touchIndex];
        return {
            x: (touch.clientX - rect.left) * scaleX,
            y: (touch.clientY - rect.top) * scaleY
        };
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        // Prevent default scrolling to ensure smooth dragging
        // e.preventDefault(); // Sometimes this is too aggressive, let's see. Browsers might complain about passive listeners.

        if (!canvasRef.current) return;
        const { x, y } = getTouchPos(e);

        // Reuse Logic from MouseDown
        // 1. Check Handles
        if (selectedId) {
            const el = elements.find(e => e.id === selectedId);
            if (el) {
                const w = el.width || (el.type === 'text' ? el.fontSize * el.content.length * 0.6 : 100);
                const h = el.height || (el.type === 'text' ? el.fontSize : 100);
                const halfW = w / 2;
                const halfH = h / 2;

                const corners = [
                    { h: 'tl', cx: -halfW, cy: -halfH },
                    { h: 'tr', cx: halfW, cy: -halfH },
                    { h: 'bl', cx: -halfW, cy: halfH },
                    { h: 'br', cx: halfW, cy: halfH },
                ];

                for (let c of corners) {
                    const p = rotatePoint(el.x + c.cx, el.y + c.cy, el.x, el.y, el.rotation);
                    if (Math.hypot(x - p.x, y - p.y) < 25) { // Slightly larger hit area for touch (25 vs 15)
                        draggingRef.current = {
                            id: selectedId,
                            startX: x,
                            startY: y,
                            elemX: el.x,
                            elemY: el.y,
                            handle: c.h,
                            startW: w,
                            startH: h,
                            startRot: el.rotation,
                            originalFontSize: el.fontSize
                        };
                        return;
                    }
                }
            }
        }

        // 2. Check Elements
        let clickedId: string | null = null;
        for (let i = elements.length - 1; i >= 0; i--) {
            const el = elements[i];
            const w = el.width || (el.type === 'text' ? el.fontSize * el.content.length * 0.5 : 100);
            const h = el.height || (el.type === 'text' ? el.fontSize : 100);

            if (isPointInRotatedRect(x, y, el.x, el.y, w, h, el.rotation)) {
                clickedId = el.id;
                break;
            }
        }

        if (clickedId) {
            setSelectedId(clickedId);
            const el = elements.find(e => e.id === clickedId)!;
            draggingRef.current = {
                id: clickedId,
                startX: x,
                startY: y,
                elemX: el.x,
                elemY: el.y
            };
        } else {
            setSelectedId(null);
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!draggingRef.current) return;
        // e.preventDefault(); // Prevent scrolling while dragging

        const { x, y } = getTouchPos(e);
        const { id, startX, startY, elemX, elemY, handle, startW, startH } = draggingRef.current;
        const dx = x - startX;
        const dy = y - startY;

        if (handle && startW && startH) {
            // RESIZING LOGIC
            const el = elements.find(e => e.id === id)!;
            const rad = (Math.PI / 180) * el.rotation;
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);

            const localDx = (dx * cos) + (dy * sin);
            const localDy = (dy * cos) - (dx * sin);

            let newW = startW;
            let newH = startH;

            if (handle === 'br') { newW += localDx; newH += localDy; }
            if (handle === 'bl') { newW -= localDx; newH += localDy; }
            if (handle === 'tr') { newW += localDx; newH -= localDy; }
            if (handle === 'tl') { newW -= localDx; newH -= localDy; }

            if (el.type === 'text') {
                const scaleFactor = newH / startH;
                const newFontSize = (draggingRef.current.originalFontSize || 100) * scaleFactor;
                updateSelectedElement({ fontSize: Math.max(10, newFontSize) });
            } else {
                updateSelectedElement({ width: Math.max(20, newW), height: Math.max(20, newH) });
            }

        } else {
            // MOVING logic
            updateSelectedElement({ x: elemX + dx, y: elemY + dy });
        }
    };

    const handleTouchEnd = () => { draggingRef.current = null; };

    const downloadThumbnail = () => {
        if (!canvasRef.current) return;
        const link = document.createElement('a');
        link.download = `thumbnail-${Date.now()}.png`;
        link.href = canvasRef.current.toDataURL("image/png");
        link.click();
    };

    const selectedElement = elements.find(e => e.id === selectedId);


    return (
        <ToolTemplate
            title="AI Thumbnail Editor (Pro)"
            description="The Ultimate Thumbnail Studio. AI Backgrounds, Magic Selfie Removal, and Pro Text Effects."
            icon={Youtube}
            features={["Magic Selfie Integration (Auto BG Removal)", "Multi-Layer Support", "Sticker Gallery", "MrBeast Style Glow"]}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

                {/* --- SIDEBAR --- */}
                <div className="lg:col-span-1 space-y-6">

                    {/* CONTEXTUAL EDITOR */}
                    <Card className={`border-l-4 ${selectedElement ? 'border-l-primary' : 'border-l-muted'}`}>
                        <CardHeader className="py-4">
                            <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground flex justify-between items-center">
                                {selectedElement ? `Edit ${selectedElement.type}` : "Global Settings"}
                                {selectedElement && (
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveLayer('down')} title="Send Backward">
                                            <Layers className="w-4 h-4 rotate-180" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveLayer('up')} title="Bring Forward">
                                            <Layers className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={deleteSelectedElement}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {selectedElement ? (
                                <>
                                    {selectedElement.type !== 'image' && (
                                        <div className="space-y-2">
                                            <Label>Content</Label>
                                            <Textarea
                                                value={selectedElement.content}
                                                onChange={(e) => updateSelectedElement({ content: e.target.value })}
                                                className="font-bold text-lg"
                                            />
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Size ({Math.round(selectedElement.type === 'image' ? selectedElement.scale * 100 : selectedElement.fontSize)}%)</Label>
                                            <Slider
                                                value={[selectedElement.type === 'image' ? selectedElement.scale * 100 : selectedElement.fontSize]}
                                                min={10} max={300}
                                                onValueChange={(v) => {
                                                    if (selectedElement.type === 'image') updateSelectedElement({ scale: v[0] / 100 });
                                                    else updateSelectedElement({ fontSize: v[0] });
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Rotation ({Math.round(selectedElement.rotation)}°)</Label>
                                            <Slider
                                                value={[selectedElement.rotation]}
                                                min={-180} max={180}
                                                onValueChange={(v) => updateSelectedElement({ rotation: v[0] })}
                                            />
                                        </div>
                                    </div>

                                    {selectedElement.type === 'text' && (
                                        <div className="space-y-4 pt-4 border-t">
                                            <Label className="text-xs font-bold text-muted-foreground uppercase">Pro Text Effects</Label>
                                            <div className="space-y-2">
                                                <Label>Font Family</Label>
                                                <Select value={selectedElement.fontFamily} onValueChange={(v) => updateSelectedElement({ fontFamily: v })}>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        {FONTS.map(f => (
                                                            <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Outline Width ({selectedElement.strokeWidth || 0})</Label>
                                                    <Slider value={[selectedElement.strokeWidth || 0]} min={0} max={20} step={1} onValueChange={(v) => updateSelectedElement({ strokeWidth: v[0] })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Shadow/Glow Blur ({selectedElement.shadowBlur || 0})</Label>
                                                    <Slider value={[selectedElement.shadowBlur || 0]} min={0} max={50} step={1} onValueChange={(v) => updateSelectedElement({ shadowBlur: v[0] })} />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Outline Color</Label>
                                                <Input type="color" className="h-8 p-0 border-0" value={selectedElement.strokeColor || '#000000'} onChange={(e) => updateSelectedElement({ strokeColor: e.target.value })} />
                                            </div>
                                        </div>
                                    )}

                                    {selectedElement.type === 'shape' && (
                                        <div className="space-y-4 pt-4 border-t">
                                            <Label className="text-xs font-bold text-muted-foreground uppercase">Free Transform</Label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Width ({selectedElement.width})</Label>
                                                    <Slider value={[selectedElement.width || 100]} min={10} max={1000} onValueChange={(v) => updateSelectedElement({ width: v[0] })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Height ({selectedElement.height})</Label>
                                                    <Slider value={[selectedElement.height || 100]} min={10} max={1000} onValueChange={(v) => updateSelectedElement({ height: v[0] })} />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Opacity ({selectedElement.opacity || 100}%)</Label>
                                                <Slider value={[selectedElement.opacity || 100]} min={0} max={100} onValueChange={(v) => updateSelectedElement({ opacity: v[0] })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Color</Label>
                                                <Input type="color" className="h-8 p-0 border-0" value={selectedElement.color} onChange={(e) => updateSelectedElement({ color: e.target.value })} />
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        {selectedElement.type !== 'image' && (
                                            <div className="space-y-2">
                                                <Label>Color</Label>
                                                <Input
                                                    type="color"
                                                    className="h-8 p-0 border-0"
                                                    value={selectedElement.color}
                                                    onChange={(e) => updateSelectedElement({ color: e.target.value })}
                                                />
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <Label>{selectedElement.type === 'image' ? "Glow Color" : "Shadow/Stroke"}</Label>
                                            <Input
                                                type="color"
                                                className="h-8 p-0 border-0"
                                                value={selectedElement.shadowColor || '#000000'}
                                                onChange={(e) => updateSelectedElement({ shadowColor: e.target.value })}
                                            />
                                        </div>

                                        {selectedElement.type === 'badge' && (
                                            <div className="space-y-2">
                                                <Label>Background</Label>
                                                <Input
                                                    type="color"
                                                    className="h-8 p-0 border-0"
                                                    value={selectedElement.backgroundColor}
                                                    onChange={(e) => updateSelectedElement({ backgroundColor: e.target.value })}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Image Filters */}
                                    {selectedElement.type === 'image' && (
                                        <div className="space-y-4 pt-4 border-t mt-4">
                                            <Label className="text-xs font-bold text-muted-foreground uppercase">Image Filters</Label>

                                            <div className="space-y-2">
                                                <div className="flex justify-between"><Label>Brightness</Label> <span className="text-xs text-muted-foreground">{selectedElement.brightness || 100}%</span></div>
                                                <Slider defaultValue={[100]} value={[selectedElement.brightness || 100]} min={0} max={200} step={5} onValueChange={(v) => updateSelectedElement({ brightness: v[0] })} />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between"><Label>Contrast</Label> <span className="text-xs text-muted-foreground">{selectedElement.contrast || 100}%</span></div>
                                                <Slider defaultValue={[100]} value={[selectedElement.contrast || 100]} min={0} max={200} step={5} onValueChange={(v) => updateSelectedElement({ contrast: v[0] })} />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between"><Label>Saturation</Label> <span className="text-xs text-muted-foreground">{selectedElement.saturation || 100}%</span></div>
                                                <Slider defaultValue={[100]} value={[selectedElement.saturation || 100]} min={0} max={200} step={5} onValueChange={(v) => updateSelectedElement({ saturation: v[0] })} />
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="space-y-4 text-center py-6 text-muted-foreground">
                                    <MousePointer2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p>Select an element on the canvas to edit it.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* TABS */}
                    <Tabs defaultValue="generate" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="add">Add</TabsTrigger>
                            <TabsTrigger value="uploads">Uploads</TabsTrigger>
                            <TabsTrigger value="generate">AI</TabsTrigger>
                        </TabsList>

                        <TabsContent value="add" className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" onClick={() => addTextElement("New Text")}>
                                    <Type className="w-4 h-4 mr-2" /> Text
                                </Button>
                                <Button variant="outline" onClick={() => addStickerElement("SUBSCRIBE", 'badge')}>
                                    <Sticker className="w-4 h-4 mr-2" /> Badge
                                </Button>
                                <Button variant="outline" onClick={() => addShapeElement('rectangle')}>
                                    <div className="w-4 h-3 border-2 border-current mr-2 rounded-[1px]" /> Rectangle
                                </Button>
                                <Button variant="outline" onClick={() => addShapeElement('circle')}>
                                    <div className="w-4 h-4 border-2 border-current mr-2 rounded-full" /> Circle
                                </Button>
                            </div>
                            <Card>
                                <CardHeader className="py-3 px-4">
                                    <CardTitle className="text-sm text-muted-foreground">Sticker Gallery</CardTitle>
                                </CardHeader>
                                <CardContent className="px-4 pb-4 space-y-4 max-h-[300px] overflow-y-auto">
                                    <div>
                                        <Label className="text-xs mb-2 block">Emojis</Label>
                                        <div className="grid grid-cols-5 gap-1">
                                            {STICKER_PRESETS.EMOJI.map(s => (
                                                <button key={s} onClick={() => addStickerElement(s, 'sticker')} className="text-2xl hover:scale-125 transition-transform">{s}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-xs mb-2 block">Badges</Label>
                                        <div className="grid grid-cols-3 gap-1">
                                            {STICKER_PRESETS.BADGES.map(s => (
                                                <Button size="sm" variant="secondary" key={s} onClick={() => addStickerElement(s, 'badge')} className="text-xs h-6">{s}</Button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-xs mb-2 block">Shapes & Icons</Label>
                                        <div className="grid grid-cols-5 gap-1">
                                            {STICKER_PRESETS.SHAPES.map(s => (
                                                <button key={s} onClick={() => addStickerElement(s, 'sticker')} className="text-2xl hover:scale-125 transition-transform">{s}</button>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="uploads" className="space-y-4 pt-4">
                            <Card className="border-dashed border-2">
                                <CardContent className="pt-6 flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="p-4 rounded-full bg-muted">
                                        <User className="w-8 h-8 opacity-50" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Magic Selfie</h3>
                                        <p className="text-xs text-muted-foreground">Auto-Remove Background</p>
                                    </div>
                                    <Button variant="secondary" className="relative cursor-pointer w-full" disabled={isremovingBg}>
                                        {isremovingBg ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                                        {isremovingBg ? "Removing BG..." : "Upload Photo"}
                                        <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" disabled={isremovingBg} />
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="generate" className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>Theme</Label>
                                <Select value={selectedTheme} onValueChange={(val: any) => setSelectedTheme(val)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(THEMES).map(([key, theme]) => (
                                            <SelectItem key={key} value={key}>{theme.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Video Title</Label>
                                <Input value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} placeholder="Enter title..." />
                            </div>
                            <Button className="w-full" onClick={generateMetadata} disabled={isGeneratingMeta}>
                                <Sparkles className="w-4 h-4 mr-2" /> Generate Concept
                            </Button>
                            <div className="pt-4 border-t">
                                <Label>Background Prompt</Label>
                                <div className="flex gap-2 mt-2">
                                    <Input value={visualPrompt} onChange={(e) => setVisualPrompt(e.target.value)} className="text-xs" />
                                    <Button size="icon" onClick={() => generateImage(visualPrompt)}><RefreshCcw className="w-4 h-4" /></Button>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* --- CANVAS --- */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="relative aspect-video bg-muted rounded-xl border-2 border-border shadow-2xl overflow-hidden group select-none">
                        {!backgroundUrl && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-muted/50">
                                <Youtube className="w-16 h-16 w-16 mb-4 opacity-20" />
                                <p>Start by Generating a Concept or Uploading a Selfie!</p>
                            </div>
                        )}
                        <canvas
                            ref={canvasRef}
                            width={1280}
                            height={720}
                            className="w-full h-full object-contain cursor-move touch-none"
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        />
                        {isGeneratingImage && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-10 text-white">
                                <div className="text-center">
                                    <RefreshCcw className="w-10 h-10 animate-spin mx-auto mb-4" />
                                    <p>Generating Background...</p>
                                </div>
                            </div>
                        )}
                        {isremovingBg && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-10 text-white">
                                <div className="text-center">
                                    <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" />
                                    <p>Removing Background...</p>
                                    <p className="text-xs opacity-70">This happens locally in your browser!</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <Button onClick={downloadThumbnail} size="lg" className="w-full text-lg h-14" disabled={!backgroundUrl && elements.length === 0}>
                        <Download className="w-5 h-5 mr-2" /> Download 1280x720 PNG
                    </Button>
                </div>

            </div>
        </ToolTemplate>
    );
};

export default ThumbnailGenerator;
