
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
    </ToolTemplate>
  );
};

export default ColorPicker;
