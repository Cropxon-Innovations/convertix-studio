import { useState, useEffect, useRef, useCallback } from "react";
import { Canvas as FabricCanvas, Circle, Rect, IText, FabricImage } from "fabric";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Type, Square, Circle as CircleIcon,
  Smile, Download, Undo2, Redo2, Trash2, 
  Sun, Contrast, Droplets, X, Save,
  Droplet, Eye, Focus
} from "lucide-react";
import { toast } from "sonner";

interface PhotoEditorProps {
  imageUrl: string;
  onSave: (dataUrl: string) => void;
  onClose: () => void;
}

const stickers = [
  { id: "star", emoji: "⭐" },
  { id: "heart", emoji: "❤️" },
  { id: "fire", emoji: "🔥" },
  { id: "smile", emoji: "😊" },
  { id: "thumbsup", emoji: "👍" },
  { id: "party", emoji: "🎉" },
  { id: "rocket", emoji: "🚀" },
  { id: "check", emoji: "✅" },
  { id: "eyes", emoji: "👀" },
  { id: "100", emoji: "💯" },
  { id: "sparkles", emoji: "✨" },
  { id: "sun", emoji: "☀️" },
];

const shapes = [
  { id: "rect", label: "Rectangle", icon: Square },
  { id: "circle", label: "Circle", icon: CircleIcon },
];

// Preset filter combinations
const filterPresets = [
  { id: "none", label: "None", brightness: 0, contrast: 0, saturation: 0, blur: 0, grayscale: false, sepia: false },
  { id: "vivid", label: "Vivid", brightness: 10, contrast: 20, saturation: 30, blur: 0, grayscale: false, sepia: false },
  { id: "moody", label: "Moody", brightness: -10, contrast: 30, saturation: -20, blur: 0, grayscale: false, sepia: false },
  { id: "bw", label: "B&W", brightness: 0, contrast: 20, saturation: 0, blur: 0, grayscale: true, sepia: false },
  { id: "sepia", label: "Sepia", brightness: 10, contrast: 0, saturation: 0, blur: 0, grayscale: false, sepia: true },
  { id: "soft", label: "Soft", brightness: 15, contrast: -10, saturation: 10, blur: 0.5, grayscale: false, sepia: false },
  { id: "dramatic", label: "Dramatic", brightness: -5, contrast: 40, saturation: 10, blur: 0, grayscale: false, sepia: false },
  { id: "vintage", label: "Vintage", brightness: 5, contrast: 10, saturation: -30, blur: 0, grayscale: false, sepia: true },
];

export const PhotoEditor = ({ imageUrl, onSave, onClose }: PhotoEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeColor, setActiveColor] = useState("#ffffff");
  const [textValue, setTextValue] = useState("Your Text");
  const [fontSize, setFontSize] = useState(32);
  
  // Basic filters
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  
  // Advanced filters
  const [blur, setBlur] = useState(0);
  const [grayscale, setGrayscale] = useState(false);
  const [sepia, setSepia] = useState(false);
  const [sharpen, setSharpen] = useState(0);
  const [vignette, setVignette] = useState(0);
  
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#1a1a1a",
    });

    // Load the image
    FabricImage.fromURL(imageUrl, { crossOrigin: "anonymous" }).then((img) => {
      // Scale image to fit canvas
      const scale = Math.min(
        canvas.width! / (img.width || 1),
        canvas.height! / (img.height || 1)
      );
      img.scale(scale);
      img.set({
        left: (canvas.width! - (img.width || 0) * scale) / 2,
        top: (canvas.height! - (img.height || 0) * scale) / 2,
        selectable: false,
        evented: false,
      });
      canvas.add(img);
      canvas.sendObjectToBack(img);
      canvas.renderAll();
      saveToHistory(canvas);
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [imageUrl]);

  const saveToHistory = (canvas: FabricCanvas) => {
    const json = JSON.stringify(canvas.toJSON());
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(json);
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  };

  const undo = () => {
    if (historyIndex > 0 && fabricCanvas) {
      const newIndex = historyIndex - 1;
      fabricCanvas.loadFromJSON(JSON.parse(history[newIndex])).then(() => {
        fabricCanvas.renderAll();
        setHistoryIndex(newIndex);
      });
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1 && fabricCanvas) {
      const newIndex = historyIndex + 1;
      fabricCanvas.loadFromJSON(JSON.parse(history[newIndex])).then(() => {
        fabricCanvas.renderAll();
        setHistoryIndex(newIndex);
      });
    }
  };

  const addText = () => {
    if (!fabricCanvas) return;
    const text = new IText(textValue, {
      left: 100,
      top: 100,
      fill: activeColor,
      fontSize: fontSize,
      fontFamily: "Arial",
    });
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.renderAll();
    saveToHistory(fabricCanvas);
    toast("Text added! Click to edit.");
  };

  const addShape = (shapeType: string) => {
    if (!fabricCanvas) return;
    
    let shape;
    if (shapeType === "rect") {
      shape = new Rect({
        left: 100,
        top: 100,
        fill: activeColor,
        width: 100,
        height: 100,
        opacity: 0.8,
      });
    } else if (shapeType === "circle") {
      shape = new Circle({
        left: 100,
        top: 100,
        fill: activeColor,
        radius: 50,
        opacity: 0.8,
      });
    }
    
    if (shape) {
      fabricCanvas.add(shape);
      fabricCanvas.setActiveObject(shape);
      fabricCanvas.renderAll();
      saveToHistory(fabricCanvas);
    }
  };

  const addSticker = (emoji: string) => {
    if (!fabricCanvas) return;
    const text = new IText(emoji, {
      left: 150,
      top: 150,
      fontSize: 64,
    });
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.renderAll();
    saveToHistory(fabricCanvas);
  };

  const deleteSelected = () => {
    if (!fabricCanvas) return;
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject && activeObject.selectable !== false) {
      fabricCanvas.remove(activeObject);
      fabricCanvas.renderAll();
      saveToHistory(fabricCanvas);
    }
  };

  const applyPreset = (preset: typeof filterPresets[0]) => {
    setBrightness(preset.brightness);
    setContrast(preset.contrast);
    setSaturation(preset.saturation);
    setBlur(preset.blur);
    setGrayscale(preset.grayscale);
    setSepia(preset.sepia);
  };

  const applyFilters = useCallback(() => {
    if (!fabricCanvas) return;
    
    const objects = fabricCanvas.getObjects();
    const bgImage = objects.find(obj => obj.type === "image");
    
    if (bgImage && bgImage instanceof FabricImage) {
      bgImage.filters = [];
      
      // Import filters dynamically
      const fabric = require("fabric");
      
      if (brightness !== 0) {
        bgImage.filters.push(new fabric.Brightness({ brightness: brightness / 100 }));
      }
      if (contrast !== 0) {
        bgImage.filters.push(new fabric.Contrast({ contrast: contrast / 100 }));
      }
      if (saturation !== 0) {
        bgImage.filters.push(new fabric.Saturation({ saturation: saturation / 100 }));
      }
      if (blur > 0) {
        bgImage.filters.push(new fabric.Blur({ blur: blur / 10 }));
      }
      if (grayscale) {
        bgImage.filters.push(new fabric.Grayscale());
      }
      if (sepia) {
        bgImage.filters.push(new fabric.Sepia());
      }
      if (sharpen > 0) {
        // Sharpen using convolute filter
        bgImage.filters.push(new fabric.Convolute({
          matrix: [
            0, -sharpen / 100, 0,
            -sharpen / 100, 1 + 4 * (sharpen / 100), -sharpen / 100,
            0, -sharpen / 100, 0
          ]
        }));
      }
      
      bgImage.applyFilters();
      fabricCanvas.renderAll();
    }
  }, [fabricCanvas, brightness, contrast, saturation, blur, grayscale, sepia, sharpen]);

  useEffect(() => {
    applyFilters();
  }, [brightness, contrast, saturation, blur, grayscale, sepia, sharpen, applyFilters]);

  const resetFilters = () => {
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setBlur(0);
    setGrayscale(false);
    setSepia(false);
    setSharpen(0);
    setVignette(0);
  };

  const handleSave = () => {
    if (!fabricCanvas) return;
    fabricCanvas.discardActiveObject();
    fabricCanvas.renderAll();
    const dataUrl = fabricCanvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2,
    });
    onSave(dataUrl);
    toast("Image saved!");
  };

  const handleDownload = () => {
    if (!fabricCanvas) return;
    fabricCanvas.discardActiveObject();
    fabricCanvas.renderAll();
    const dataUrl = fabricCanvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2,
    });
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast("Image downloaded!");
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Photo Editor</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={undo} disabled={historyIndex <= 0}>
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={redo} disabled={historyIndex >= history.length - 1}>
            <Redo2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={deleteSelected}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center bg-muted/30 p-4 overflow-auto">
          <canvas ref={canvasRef} className="border border-border rounded-lg shadow-xl" />
        </div>

        {/* Tools Sidebar */}
        <aside className="w-80 border-l border-border bg-card p-4 overflow-y-auto">
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="w-full grid grid-cols-4 mb-4">
              <TabsTrigger value="text"><Type className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="shapes"><Square className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="stickers"><Smile className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="filters"><Sun className="h-4 w-4" /></TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4">
              <div>
                <Label>Text</Label>
                <Input
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  placeholder="Enter text"
                />
              </div>
              <div>
                <Label>Font Size: {fontSize}px</Label>
                <Slider
                  value={[fontSize]}
                  onValueChange={([v]) => setFontSize(v)}
                  min={12}
                  max={120}
                  step={1}
                />
              </div>
              <div>
                <Label>Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={activeColor}
                    onChange={(e) => setActiveColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <Input
                    value={activeColor}
                    onChange={(e) => setActiveColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <Button onClick={addText} className="w-full">
                <Type className="h-4 w-4 mr-2" />
                Add Text
              </Button>
            </TabsContent>

            <TabsContent value="shapes" className="space-y-4">
              <div>
                <Label>Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={activeColor}
                    onChange={(e) => setActiveColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <Input
                    value={activeColor}
                    onChange={(e) => setActiveColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {shapes.map((shape) => (
                  <Button
                    key={shape.id}
                    variant="outline"
                    onClick={() => addShape(shape.id)}
                    className="h-20 flex flex-col gap-2"
                  >
                    <shape.icon className="h-6 w-6" />
                    <span className="text-xs">{shape.label}</span>
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="stickers" className="space-y-4">
              <Label>Stickers & Emoji</Label>
              <div className="grid grid-cols-4 gap-2">
                {stickers.map((sticker) => (
                  <Button
                    key={sticker.id}
                    variant="outline"
                    onClick={() => addSticker(sticker.emoji)}
                    className="h-12 text-2xl"
                  >
                    {sticker.emoji}
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="filters" className="space-y-4">
              {/* Filter Presets */}
              <div>
                <Label className="mb-2 block">Presets</Label>
                <div className="grid grid-cols-4 gap-1">
                  {filterPresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => applyPreset(preset)}
                      className="p-2 text-xs rounded border border-border hover:border-primary hover:bg-primary/10 transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <Label className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  Brightness: {brightness}
                </Label>
                <Slider
                  value={[brightness]}
                  onValueChange={([v]) => setBrightness(v)}
                  min={-100}
                  max={100}
                  step={1}
                />
              </div>
              
              <div>
                <Label className="flex items-center gap-2">
                  <Contrast className="h-4 w-4" />
                  Contrast: {contrast}
                </Label>
                <Slider
                  value={[contrast]}
                  onValueChange={([v]) => setContrast(v)}
                  min={-100}
                  max={100}
                  step={1}
                />
              </div>
              
              <div>
                <Label className="flex items-center gap-2">
                  <Droplets className="h-4 w-4" />
                  Saturation: {saturation}
                </Label>
                <Slider
                  value={[saturation]}
                  onValueChange={([v]) => setSaturation(v)}
                  min={-100}
                  max={100}
                  step={1}
                />
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <Droplet className="h-4 w-4" />
                  Blur: {blur}
                </Label>
                <Slider
                  value={[blur]}
                  onValueChange={([v]) => setBlur(v)}
                  min={0}
                  max={10}
                  step={0.1}
                />
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <Focus className="h-4 w-4" />
                  Sharpen: {sharpen}
                </Label>
                <Slider
                  value={[sharpen]}
                  onValueChange={([v]) => setSharpen(v)}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>

              {/* Toggle Filters */}
              <div className="flex gap-2">
                <Button
                  variant={grayscale ? "default" : "outline"}
                  size="sm"
                  onClick={() => setGrayscale(!grayscale)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  B&W
                </Button>
                <Button
                  variant={sepia ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSepia(!sepia)}
                  className="flex-1"
                >
                  Sepia
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={resetFilters}
                className="w-full"
              >
                Reset Filters
              </Button>
            </TabsContent>
          </Tabs>
        </aside>
      </div>
    </div>
  );
};
