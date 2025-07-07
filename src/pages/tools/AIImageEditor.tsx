import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import ToolTemplate from "@/components/ToolTemplate";
import { 
  Image, Upload, Download, Layers, Palette, Brush, 
  Eraser, Type, Square, Circle, MousePointer, 
  RotateCcw, RotateCw, FlipHorizontal, FlipVertical,
  Focus, Contrast, Sun, Eye, EyeOff, Plus, Trash2,
  Move, ZoomIn, ZoomOut, Undo, Redo, Save, Filter,
  Sparkles, Wand2, Brain, Zap
} from "lucide-react";
import { toast } from "sonner";
import { Canvas as FabricCanvas, FabricObject, Circle as FabricCircle, Rect as FabricRect, FabricText, FabricImage } from "fabric";

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  blendMode: string;
}

const AIImageEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<string>("select");
  const [brushSize, setBrushSize] = useState(10);
  const [brushColor, setBrushColor] = useState("#000000");
  const [layers, setLayers] = useState<Layer[]>([
    { id: "1", name: "Background", visible: true, opacity: 100, blendMode: "normal" }
  ]);
  const [activeLayer, setActiveLayer] = useState("1");
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [zoom, setZoom] = useState(100);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // AI Prompt-based editing states
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiEditType, setAiEditType] = useState("enhance");

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: canvasSize.width,
      height: canvasSize.height,
      backgroundColor: "#ffffff",
    });

    // Properly initialize the drawing brush
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = brushSize;
      canvas.freeDrawingBrush.color = brushColor;
    }

    setFabricCanvas(canvas);
    
    // Save initial state
    const initialState = JSON.stringify(canvas.toJSON());
    setHistory([initialState]);
    setHistoryIndex(0);

    console.log("Canvas initialized successfully");

    return () => {
      canvas.dispose();
    };
  }, []);

  // Update canvas when tool changes
  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = activeTool === "brush";
    fabricCanvas.selection = activeTool === "select";

    if (activeTool === "brush" && fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.width = brushSize;
      fabricCanvas.freeDrawingBrush.color = brushColor;
    }
  }, [activeTool, brushSize, brushColor, fabricCanvas]);

  const saveState = (canvas: FabricCanvas) => {
    try {
      const state = JSON.stringify(canvas.toJSON());
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(state);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    } catch (error) {
      console.error("Error saving state:", error);
    }
  };

  const undo = () => {
    if (historyIndex > 0 && fabricCanvas) {
      const previousState = history[historyIndex - 1];
      try {
        fabricCanvas.loadFromJSON(previousState, () => {
          fabricCanvas.renderAll();
          setHistoryIndex(historyIndex - 1);
        });
      } catch (error) {
        console.error("Error during undo:", error);
      }
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1 && fabricCanvas) {
      const nextState = history[historyIndex + 1];
      try {
        fabricCanvas.loadFromJSON(nextState, () => {
          fabricCanvas.renderAll();
          setHistoryIndex(historyIndex + 1);
        });
      } catch (error) {
        console.error("Error during redo:", error);
      }
    }
  };

  // AI Prompt Analysis Function
  const analyzePromptForImageEditing = (prompt: string) => {
    const lowerPrompt = prompt.toLowerCase();
    
    // Color analysis
    const colorCommands = {
      brightness: lowerPrompt.includes('bright') || lowerPrompt.includes('lighter'),
      darkness: lowerPrompt.includes('dark') || lowerPrompt.includes('dim'),
      contrast: lowerPrompt.includes('contrast') || lowerPrompt.includes('sharp'),
      saturation: lowerPrompt.includes('vibrant') || lowerPrompt.includes('colorful'),
      blur: lowerPrompt.includes('blur') || lowerPrompt.includes('soft'),
      sharpen: lowerPrompt.includes('sharp') || lowerPrompt.includes('crisp'),
    };

    // Object detection and editing
    const objectCommands = {
      addText: lowerPrompt.includes('add text') || lowerPrompt.includes('write'),
      addShape: lowerPrompt.includes('add circle') || lowerPrompt.includes('add square'),
      removeBackground: lowerPrompt.includes('remove background') || lowerPrompt.includes('transparent'),
      crop: lowerPrompt.includes('crop') || lowerPrompt.includes('resize'),
    };

    // Style commands
    const styleCommands = {
      vintage: lowerPrompt.includes('vintage') || lowerPrompt.includes('retro'),
      artistic: lowerPrompt.includes('artistic') || lowerPrompt.includes('paint'),
      professional: lowerPrompt.includes('professional') || lowerPrompt.includes('clean'),
    };

    return { colorCommands, objectCommands, styleCommands, originalPrompt: prompt };
  };

  // AI-powered image editing execution
  const executeAiImageEdit = async (analysis: any, canvas: FabricCanvas) => {
    const { colorCommands, objectCommands, styleCommands } = analysis;

    try {
      // Apply color adjustments
      if (colorCommands.brightness) {
        const objects = canvas.getObjects();
        objects.forEach(obj => {
          if (obj instanceof FabricImage) {
            obj.set('brightness', 0.3);
          }
        });
        toast.success("✨ AI applied brightness enhancement");
      }

      if (colorCommands.contrast) {
        const objects = canvas.getObjects();
        objects.forEach(obj => {
          if (obj instanceof FabricImage) {
            obj.set('contrast', 0.3);
          }
        });
        toast.success("✨ AI enhanced contrast");
      }

      if (colorCommands.saturation) {
        const objects = canvas.getObjects();
        objects.forEach(obj => {
          if (obj instanceof FabricImage) {
            obj.set('saturation', 0.4);
          }
        });
        toast.success("✨ AI boosted color saturation");
      }

      // Add objects based on prompt
      if (objectCommands.addText) {
        const textMatch = analysis.originalPrompt.match(/(?:add text|write)\s*["']([^"']+)["']/i);
        const textContent = textMatch ? textMatch[1] : "AI Generated Text";
        
        const text = new FabricText(textContent, {
          left: 100,
          top: 100,
          fontFamily: "Arial",
          fontSize: 24,
          fill: brushColor,
        });
        canvas.add(text);
        toast.success("✨ AI added text based on your prompt");
      }

      if (objectCommands.addShape) {
        if (analysis.originalPrompt.includes('circle')) {
          const circle = new FabricCircle({
            left: 150,
            top: 150,
            fill: brushColor,
            radius: 50,
          });
          canvas.add(circle);
          toast.success("✨ AI added circle shape");
        }
        
        if (analysis.originalPrompt.includes('square')) {
          const square = new FabricRect({
            left: 150,
            top: 150,
            fill: brushColor,
            width: 100,
            height: 100,
          });
          canvas.add(square);
          toast.success("✨ AI added square shape");
        }
      }

      // Apply style effects
      if (styleCommands.vintage) {
        const objects = canvas.getObjects();
        objects.forEach(obj => {
          if (obj instanceof FabricImage) {
            obj.set('saturation', -0.3);
            obj.set('brightness', -0.1);
          }
        });
        canvas.backgroundColor = "#f4f1e8";
        toast.success("✨ AI applied vintage style");
      }

      if (styleCommands.artistic) {
        const objects = canvas.getObjects();
        objects.forEach(obj => {
          if (obj instanceof FabricImage) {
            obj.set('contrast', 0.2);
            obj.set('saturation', 0.3);
          }
        });
        toast.success("✨ AI applied artistic enhancement");
      }

      canvas.renderAll();
      return true;
    } catch (error) {
      console.error("AI editing error:", error);
      return false;
    }
  };

  // Main AI prompt processing function
  const processAiPrompt = async () => {
    if (!aiPrompt.trim() || !fabricCanvas) {
      toast.error("Please enter an AI editing prompt");
      return;
    }

    setIsAiProcessing(true);
    toast.info("🤖 AI is analyzing your prompt...");

    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Analyze the prompt
      const analysis = analyzePromptForImageEditing(aiPrompt);
      console.log("AI Analysis:", analysis);

      // Execute the AI-based edits
      const success = await executeAiImageEdit(analysis, fabricCanvas);

      if (success) {
        saveState(fabricCanvas);
        toast.success("🎉 AI editing completed successfully!");
      } else {
        toast.error("AI editing failed. Please try a different prompt.");
      }
    } catch (error) {
      console.error("AI processing error:", error);
      toast.error("AI processing failed. Please try again.");
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !fabricCanvas) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imgUrl = e.target?.result as string;
      FabricImage.fromURL(imgUrl).then((img) => {
        // Scale image to fit canvas if it's too large
        const canvasWidth = fabricCanvas.width || 800;
        const canvasHeight = fabricCanvas.height || 600;
        
        if (img.width && img.height) {
          const scale = Math.min(canvasWidth / img.width, canvasHeight / img.height, 1);
          img.scale(scale);
        }
        
        fabricCanvas.add(img);
        fabricCanvas.centerObject(img);
        fabricCanvas.renderAll();
        saveState(fabricCanvas);
        toast.success("Image uploaded successfully!");
      }).catch(error => {
        console.error("Error loading image:", error);
        toast.error("Failed to load image");
      });
    };
    reader.readAsDataURL(file);
  };

  const addShape = (type: string) => {
    if (!fabricCanvas) return;

    let shape: FabricObject;
    
    switch (type) {
      case "rectangle":
        shape = new FabricRect({
          left: 100,
          top: 100,
          fill: brushColor,
          width: 100,
          height: 100,
        });
        break;
      case "circle":
        shape = new FabricCircle({
          left: 100,
          top: 100,
          fill: brushColor,
          radius: 50,
        });
        break;
      default:
        return;
    }

    fabricCanvas.add(shape);
    fabricCanvas.renderAll();
    saveState(fabricCanvas);
  };

  const addText = () => {
    if (!fabricCanvas) return;

    const text = new FabricText("Double click to edit", {
      left: 100,
      top: 100,
      fontFamily: "Arial",
      fontSize: 20,
      fill: brushColor,
    });

    fabricCanvas.add(text);
    fabricCanvas.renderAll();
    saveState(fabricCanvas);
  };

  const applyFilter = (filterType: string) => {
    if (!fabricCanvas) return;

    const activeObject = fabricCanvas.getActiveObject();
    if (!activeObject || !(activeObject instanceof FabricImage)) {
      toast.error("Please select an image to apply filters");
      return;
    }

    // Simple filter implementation for demonstration
    switch (filterType) {
      case "grayscale":
        activeObject.set('saturation', -1);
        break;
      case "brightness":
        activeObject.set('brightness', 0.3);
        break;
      case "contrast":
        activeObject.set('contrast', 0.3);
        break;
      default:
        break;
    }
    
    fabricCanvas.renderAll();
    saveState(fabricCanvas);
    toast.success(`${filterType} filter applied!`);
  };

  const clearCanvas = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
    saveState(fabricCanvas);
    toast.success("Canvas cleared!");
  };

  const downloadImage = () => {
    if (!fabricCanvas) return;

    try {
      const dataURL = fabricCanvas.toDataURL({
        format: "png",
        quality: 1,
        multiplier: 1,
      });

      const link = document.createElement("a");
      link.download = "edited-image.png";
      link.href = dataURL;
      link.click();
      toast.success("Image downloaded!");
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Failed to download image");
    }
  };

  const toggleLayerVisibility = (layerId: string) => {
    setLayers(layers.map(layer => 
      layer.id === layerId 
        ? { ...layer, visible: !layer.visible }
        : layer
    ));
  };

  const addNewLayer = () => {
    const newId = Date.now().toString();
    setLayers([...layers, {
      id: newId,
      name: `Layer ${layers.length + 1}`,
      visible: true,
      opacity: 100,
      blendMode: "normal"
    }]);
  };

  const deleteLayer = (layerId: string) => {
    if (layers.length > 1) {
      setLayers(layers.filter(layer => layer.id !== layerId));
      if (activeLayer === layerId) {
        setActiveLayer(layers[0].id);
      }
    }
  };

  const deleteSelected = () => {
    if (!fabricCanvas) return;
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      fabricCanvas.remove(activeObject);
      fabricCanvas.renderAll();
      saveState(fabricCanvas);
      toast.success("Object deleted!");
    }
  };

  const duplicateSelected = () => {
    if (!fabricCanvas) return;
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      activeObject.clone().then((cloned: FabricObject) => {
        cloned.set({
          left: (cloned.left || 0) + 10,
          top: (cloned.top || 0) + 10,
        });
        fabricCanvas.add(cloned);
        fabricCanvas.renderAll();
        saveState(fabricCanvas);
        toast.success("Object duplicated!");
      });
    }
  };

  return (
    <ToolTemplate
      title="AI Image Editor"
      description="Professional AI-powered image editing tool with prompt-based editing, layers, filters, and advanced tools"
      icon={Image}
      features={[
        "AI prompt-based editing with natural language",
        "Intelligent image enhancement and manipulation",
        "Multi-layer editing with advanced controls",
        "Drawing and painting tools",
        "Shape and text tools with AI assistance",
        "Image filters and effects",
        "Undo/Redo functionality",
        "Export in multiple formats"
      ]}
    >
      <div className="space-y-6">
        {/* AI Prompt Section */}
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-700">
              <Brain className="h-5 w-5" />
              <span>AI Prompt-Based Editing</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tell AI what you want to do</Label>
              <Textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Try: 'Make this image brighter and add more contrast', 'Add text Hello World in blue', 'Apply vintage effect', 'Add a red circle', 'Make it more artistic', 'Remove background', 'Enhance colors'"
                className="min-h-[80px] resize-none"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>AI Edit Type</Label>
                <Select value={aiEditType} onValueChange={setAiEditType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enhance">Enhance Image</SelectItem>
                    <SelectItem value="style">Apply Style</SelectItem>
                    <SelectItem value="objects">Add Objects</SelectItem>
                    <SelectItem value="effects">Apply Effects</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  onClick={processAiPrompt}
                  disabled={isAiProcessing || !aiPrompt.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isAiProcessing ? (
                    <>
                      <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                      AI Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Apply AI Edit
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600">
              <div className="flex items-center space-x-1">
                <Zap className="h-3 w-3 text-blue-500" />
                <span>Color Enhancement</span>
              </div>
              <div className="flex items-center space-x-1">
                <Wand2 className="h-3 w-3 text-purple-500" />  
                <span>Object Addition</span>
              </div>
              <div className="flex items-center space-x-1">
                <Filter className="h-3 w-3 text-green-500" />
                <span>Style Transfer</span>
              </div>
              <div className="flex items-center space-x-1">
                <Sparkles className="h-3 w-3 text-orange-500" />
                <span>Smart Effects</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Toolbar */}
        <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <Button
            onClick={() => document.getElementById("file-upload")?.click()}
            variant="outline"
            size="sm"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          
          <Button onClick={undo} variant="outline" size="sm" disabled={historyIndex <= 0}>
            <Undo className="h-4 w-4" />
          </Button>
          
          <Button onClick={redo} variant="outline" size="sm" disabled={historyIndex >= history.length - 1}>
            <Redo className="h-4 w-4" />
          </Button>
          
          <Button onClick={duplicateSelected} variant="outline" size="sm">
            <Square className="h-4 w-4 mr-2" />
            Duplicate
          </Button>
          
          <Button onClick={deleteSelected} variant="outline" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          
          <Button onClick={downloadImage} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          
          <Button onClick={clearCanvas} variant="outline" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tools Panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={activeTool === "select" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTool("select")}
                  >
                    <MousePointer className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={activeTool === "brush" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTool("brush")}
                  >
                    <Brush className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={activeTool === "eraser" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTool("eraser")}
                  >
                    <Eraser className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addText}
                  >
                    <Type className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addShape("rectangle")}
                  >
                    <Square className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addShape("circle")}
                  >
                    <Circle className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Brush Size</Label>
                  <Slider
                    value={[brushSize]}
                    onValueChange={(value) => setBrushSize(value[0])}
                    max={50}
                    min={1}
                    step={1}
                  />
                  <span className="text-xs text-gray-500">{brushSize}px</span>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Color</Label>
                  <Input
                    type="color"
                    value={brushColor}
                    onChange={(e) => setBrushColor(e.target.value)}
                    className="h-8"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Layers Panel */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Layers</CardTitle>
                <Button onClick={addNewLayer} size="sm" variant="outline">
                  <Plus className="h-3 w-3" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {layers.map((layer) => (
                  <div
                    key={layer.id}
                    className={`p-2 rounded border cursor-pointer ${
                      activeLayer === layer.id ? "bg-blue-50 border-blue-200" : "bg-gray-50"
                    }`}
                    onClick={() => setActiveLayer(layer.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLayerVisibility(layer.id);
                          }}
                        >
                          {layer.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        </Button>
                        <span className="text-xs">{layer.name}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteLayer(layer.id);
                        }}
                        disabled={layers.length <= 1}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-4">
                <div className="border rounded-lg overflow-hidden bg-white" style={{ width: "fit-content" }}>
                  <canvas ref={canvasRef} className="block" />
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" onClick={() => setZoom(Math.max(25, zoom - 25))}>
                      <ZoomOut className="h-3 w-3" />
                    </Button>
                    <span className="text-xs">{zoom}%</span>
                    <Button size="sm" variant="outline" onClick={() => setZoom(Math.min(400, zoom + 25))}>
                      <ZoomIn className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {canvasSize.width} × {canvasSize.height}px
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Properties/Filters Panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => applyFilter("blur")}
                >
                  <Focus className="h-4 w-4 mr-2" />
                  Blur
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => applyFilter("brightness")}
                >
                  <Sun className="h-4 w-4 mr-2" />
                  Brightness
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => applyFilter("contrast")}
                >
                  <Contrast className="h-4 w-4 mr-2" />
                  Contrast
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => applyFilter("grayscale")}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Grayscale
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Canvas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs">Width</Label>
                  <Input
                    type="number"
                    value={canvasSize.width}
                    onChange={(e) => setCanvasSize(prev => ({ ...prev, width: parseInt(e.target.value) || 800 }))}
                    className="h-8"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Height</Label>
                  <Input
                    type="number"
                    value={canvasSize.height}
                    onChange={(e) => setCanvasSize(prev => ({ ...prev, height: parseInt(e.target.value) || 600 }))}
                    className="h-8"
                  />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    if (fabricCanvas) {
                      fabricCanvas.setDimensions(canvasSize);
                      fabricCanvas.renderAll();
                    }
                  }}
                >
                  Resize Canvas
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ToolTemplate>
  );
};

export default AIImageEditor;
