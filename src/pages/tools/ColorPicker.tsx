
import { useState } from "react";
import { Palette, Copy, Pipette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ToolTemplate from "@/components/ToolTemplate";
import { useToast } from "@/hooks/use-toast";

const ColorPicker = () => {
  const [color, setColor] = useState("#3b82f6");
  const { toast } = useToast();

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const hexToHsl = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;

    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const copyToClipboard = (value: string, format: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: `${format} copied!`,
      description: `Color value ${value} has been copied to your clipboard.`,
    });
  };

  const rgb = hexToRgb(color);
  const hsl = hexToHsl(color);

  const predefinedColors = [
    "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16",
    "#22c55e", "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9",
    "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
    "#ec4899", "#f43f5e", "#64748b", "#6b7280", "#374151"
  ];

  return (
    <ToolTemplate
      title="Color Picker"
      description="Pick colors from images or use the color wheel to find perfect colors"
      icon={Palette}
      features={[
        "Interactive color picker",
        "HEX, RGB, and HSL formats",
        "Predefined color palette",
        "One-click copy to clipboard",
        "Real-time color preview"
      ]}
    >
      <div className="space-y-6">
        {/* Color Picker */}
        <Card>
          <CardContent className="p-6">
            <Label className="text-lg font-semibold mb-4 block">Color Picker</Label>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-32 rounded-lg border-2 border-gray-200 cursor-pointer"
                />
              </div>

              <div className="flex-1 space-y-4">
                <div className="w-full h-32 rounded-lg border-2 border-gray-200" style={{ backgroundColor: color }}></div>

                <div>
                  <Label htmlFor="hex-input">HEX Color</Label>
                  <Input
                    id="hex-input"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="mt-1 font-mono"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Color Values */}
        <Card>
          <CardContent className="p-6">
            <Label className="text-lg font-semibold mb-4 block">Color Values</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>HEX</Label>
                <div className="flex items-center space-x-2">
                  <Input value={color} readOnly className="font-mono" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(color, "HEX")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>RGB</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : ''}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => rgb && copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, "RGB")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>HSL</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : ''}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => hsl && copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, "HSL")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Predefined Colors */}
        <Card>
          <CardContent className="p-6">
            <Label className="text-lg font-semibold mb-4 block">Predefined Colors</Label>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {predefinedColors.map((presetColor) => (
                <button
                  key={presetColor}
                  className="w-12 h-12 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors"
                  style={{ backgroundColor: presetColor }}
                  onClick={() => setColor(presetColor)}
                  title={presetColor}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Color Shades */}
        <Card>
          <CardContent className="p-6">
            <Label className="text-lg font-semibold mb-4 block">Color Shades</Label>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {Array.from({ length: 10 }, (_, i) => {
                const factor = (i + 1) * 0.1;
                const rgb = hexToRgb(color);
                if (!rgb) return null;

                const lighterR = Math.round(rgb.r + (255 - rgb.r) * factor);
                const lighterG = Math.round(rgb.g + (255 - rgb.g) * factor);
                const lighterB = Math.round(rgb.b + (255 - rgb.b) * factor);

                const lighterHex = `#${lighterR.toString(16).padStart(2, '0')}${lighterG.toString(16).padStart(2, '0')}${lighterB.toString(16).padStart(2, '0')}`;

                return (
                  <button
                    key={i}
                    className="w-12 h-12 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: lighterHex }}
                    onClick={() => setColor(lighterHex)}
                    title={lighterHex}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Free Color Picker – HEX, RGB, HSL & Palette Generator</h1>

        <div className="my-10 flex justify-center">
          {/* Custom SVG Illustration for Color Picker */}
          <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 border border-purple-100 dark:border-gray-700">
            <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

            {/* Color Wheel Abstract */}
            <g transform="translate(300, 200)">
              <circle cx="0" cy="0" r="120" fill="none" stroke="#e5e7eb" strokeWidth="40" />
              <path d="M0 -120 A120 120 0 0 1 104 -60" stroke="#ef4444" strokeWidth="40" fill="none" />
              <path d="M104 -60 A120 120 0 0 1 104 60" stroke="#f59e0b" strokeWidth="40" fill="none" />
              <path d="M104 60 A120 120 0 0 1 0 120" stroke="#22c55e" strokeWidth="40" fill="none" />
              <path d="M0 120 A120 120 0 0 1 -104 60" stroke="#3b82f6" strokeWidth="40" fill="none" />
              <path d="M-104 60 A120 120 0 0 1 -104 -60" stroke="#8b5cf6" strokeWidth="40" fill="none" />
              <path d="M-104 -60 A120 120 0 0 1 0 -120" stroke="#ec4899" strokeWidth="40" fill="none" />
            </g>

            {/* Central Selected Color */}
            <circle cx="300" cy="200" r="60" fill="#8b5cf6" stroke="white" strokeWidth="4" />
            <text x="300" y="205" textAnchor="middle" fill="white" fontSize="14" fontFamily="monospace" fontWeight="bold">#8B5CF6</text>

            {/* Eyedropper Icon */}
            <g transform="translate(420, 100) rotate(45)">
              <path d="M0 0 L20 0 L20 60 L10 70 L0 60 Z" fill="#1e293b" className="dark:fill-gray-200" />
              <path d="M5 65 L15 65" stroke="white" strokeWidth="2" />
              <circle cx="10" cy="75" r="3" fill="#8b5cf6">
                <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
              </circle>
            </g>

            {/* Palette Swatches */}
            <g transform="translate(100, 320)">
              <rect x="0" y="0" width="40" height="40" rx="8" fill="#ef4444" />
              <rect x="50" y="0" width="40" height="40" rx="8" fill="#f59e0b" />
              <rect x="100" y="0" width="40" height="40" rx="8" fill="#22c55e" />
              <rect x="150" y="0" width="40" height="40" rx="8" fill="#3b82f6" />
              <rect x="200" y="0" width="40" height="40" rx="8" fill="#8b5cf6" transform="scale(1.1) translate(-2, -2)" stroke="white" strokeWidth="2" />
              <rect x="250" y="0" width="40" height="40" rx="8" fill="#ec4899" />
              <rect x="300" y="0" width="40" height="40" rx="8" fill="#64748b" />
              <rect x="350" y="0" width="40" height="40" rx="8" fill="#000000" />
            </g>

            <text x="300" y="380" textAnchor="middle" fill="#64748b" fontSize="14" fontWeight="500">Find your perfect shade</text>
          </svg>
        </div>

        <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
          Color is the most powerful tool in a designer's arsenal. It evokes emotion, guides attention, and defines brand identity. Our <strong>Advanced Color Picker</strong> helps you navigate the infinite spectrum of digital colors. Whether you need to match a brand's exact shade or explore complementary harmonies, this tool provides the precision you need in HEX, RGB, and HSL formats.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
          <span className="bg-purple-100 text-purple-800 p-2 rounded-md mr-4 text-2xl">🌈</span>
          Color Theory 101
        </h2>
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold text-lg mb-2 text-purple-600">Hue, Saturation, Lightness (HSL)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Hue</strong> is the color itself (0-360°).<br />
              <strong>Saturation</strong> is the intensity (0% is gray, 100% is vivid).<br />
              <strong>Lightness</strong> is how bright it is (0% is black, 100% is white).<br />
              <em>HSL is often easier for humans to understand than HEX codes.</em>
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold text-lg mb-2 text-pink-600">RGB vs CMYK</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>RGB</strong> (Red, Green, Blue) is for screens. It's additive (adding all colors makes white).<br />
              <strong>CMYK</strong> (Cyan, Magenta, Yellow, Key/Black) is for print. It's subtractive (adding all colors makes black).<br />
              <em>Always use RGB/HEX for web design.</em>
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Understanding Color Codes</h2>
        <ul className="list-disc pl-6 space-y-4 mb-8 text-gray-700 dark:text-gray-300">
          <li><strong>HEX (#RRGGBB):</strong> A hexadecimal representation of Red, Green, and Blue values. It's the standard for HTML/CSS. Example: <code>#FF5733</code>.</li>
          <li><strong>RGB (r, g, b):</strong> Defines the intensity of red, green, and blue light from 0 to 255. Example: <code>rgb(255, 87, 51)</code>.</li>
          <li><strong>Alpha Channel (a):</strong> Represents opacity. <code>rgba(255, 0, 0, 0.5)</code> is semi-transparent red.</li>
        </ul>

        <div className="mt-12 bg-purple-50 dark:bg-purple-900/20 p-8 rounded-2xl border border-purple-100 dark:border-purple-800/30">
          <h3 className="text-2xl font-bold mb-4 text-purple-900 dark:text-purple-100">Need to analyze an image?</h3>
          <p className="text-purple-800 dark:text-purple-200 mb-4">
            Extract the dominant color palette from any photo using our AI-powered analyzer.
          </p>
          <a href="/tools/image-analyzer" className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full transition-colors">
            Go to Image Analyzer
          </a>
        </div>
      </article>
    </ToolTemplate>
  );
};

export default ColorPicker;
