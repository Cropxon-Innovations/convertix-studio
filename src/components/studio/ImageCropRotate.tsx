import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  RotateCw, RotateCcw, FlipHorizontal, FlipVertical, 
  Download, X, Save, Crop, Square, Monitor, Smartphone
} from "lucide-react";
import { toast } from "sonner";

interface ImageCropRotateProps {
  imageUrl: string;
  onSave: (dataUrl: string) => void;
  onClose: () => void;
}

const aspectRatioPresets = [
  { id: "free", label: "Free", ratio: null, icon: Crop },
  { id: "1:1", label: "1:1", ratio: 1, icon: Square },
  { id: "4:3", label: "4:3", ratio: 4/3, icon: Monitor },
  { id: "16:9", label: "16:9", ratio: 16/9, icon: Monitor },
  { id: "9:16", label: "9:16", ratio: 9/16, icon: Smartphone },
  { id: "3:2", label: "3:2", ratio: 3/2, icon: Monitor },
  { id: "2:3", label: "2:3", ratio: 2/3, icon: Smartphone },
];

export const ImageCropRotate = ({ imageUrl, onSave, onClose }: ImageCropRotateProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [customAngle, setCustomAngle] = useState(0);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragType, setDragType] = useState<"move" | "resize" | null>(null);

  // Load image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageRef.current = img;
      setCropArea({ x: 0, y: 0, width: img.width, height: img.height });
      setImageLoaded(true);
      drawCanvas();
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const maxSize = 600;
    const scale = Math.min(maxSize / img.width, maxSize / img.height);
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    // Clear canvas
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save context state
    ctx.save();

    // Apply transformations
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation + customAngle) * Math.PI / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Draw image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Restore context state
    ctx.restore();

    // Draw crop overlay
    if (aspectRatio !== null || isDragging) {
      const cropX = (cropArea.x / img.width) * canvas.width;
      const cropY = (cropArea.y / img.height) * canvas.height;
      const cropW = (cropArea.width / img.width) * canvas.width;
      const cropH = (cropArea.height / img.height) * canvas.height;

      // Dim outside crop area
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, canvas.width, cropY);
      ctx.fillRect(0, cropY + cropH, canvas.width, canvas.height - cropY - cropH);
      ctx.fillRect(0, cropY, cropX, cropH);
      ctx.fillRect(cropX + cropW, cropY, canvas.width - cropX - cropW, cropH);

      // Draw crop border
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.strokeRect(cropX, cropY, cropW, cropH);

      // Draw grid lines (rule of thirds)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 1;
      for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(cropX + (cropW / 3) * i, cropY);
        ctx.lineTo(cropX + (cropW / 3) * i, cropY + cropH);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cropX, cropY + (cropH / 3) * i);
        ctx.lineTo(cropX + cropW, cropY + (cropH / 3) * i);
        ctx.stroke();
      }
    }
  }, [rotation, customAngle, flipH, flipV, cropArea, aspectRatio, isDragging]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const rotate90 = (direction: "cw" | "ccw") => {
    setRotation(prev => prev + (direction === "cw" ? 90 : -90));
  };

  const toggleFlipH = () => setFlipH(prev => !prev);
  const toggleFlipV = () => setFlipV(prev => !prev);

  const setAspectRatioPreset = (ratio: number | null) => {
    setAspectRatio(ratio);
    if (ratio && imageRef.current) {
      const img = imageRef.current;
      let newWidth = img.width;
      let newHeight = img.height;

      if (img.width / img.height > ratio) {
        newWidth = img.height * ratio;
      } else {
        newHeight = img.width / ratio;
      }

      setCropArea({
        x: (img.width - newWidth) / 2,
        y: (img.height - newHeight) / 2,
        width: newWidth,
        height: newHeight,
      });
    }
  };

  const handleSave = () => {
    const img = imageRef.current;
    if (!img) return;

    // Create output canvas
    const outputCanvas = document.createElement("canvas");
    const ctx = outputCanvas.getContext("2d");
    if (!ctx) return;

    // Calculate final dimensions
    let finalWidth = cropArea.width;
    let finalHeight = cropArea.height;

    // Handle rotation for odd angles
    const totalRotation = (rotation + customAngle) % 360;
    if (Math.abs(totalRotation % 180) === 90) {
      [finalWidth, finalHeight] = [finalHeight, finalWidth];
    }

    outputCanvas.width = finalWidth;
    outputCanvas.height = finalHeight;

    // Apply transformations
    ctx.translate(outputCanvas.width / 2, outputCanvas.height / 2);
    ctx.rotate(totalRotation * Math.PI / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

    const drawWidth = Math.abs(totalRotation % 180) === 90 ? finalHeight : finalWidth;
    const drawHeight = Math.abs(totalRotation % 180) === 90 ? finalWidth : finalHeight;

    ctx.drawImage(
      img,
      cropArea.x, cropArea.y, cropArea.width, cropArea.height,
      -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight
    );

    const dataUrl = outputCanvas.toDataURL("image/png", 1);
    onSave(dataUrl);
    toast("Image saved!");
  };

  const handleDownload = () => {
    const img = imageRef.current;
    if (!img) return;

    const outputCanvas = document.createElement("canvas");
    const ctx = outputCanvas.getContext("2d");
    if (!ctx) return;

    let finalWidth = cropArea.width;
    let finalHeight = cropArea.height;

    const totalRotation = (rotation + customAngle) % 360;
    if (Math.abs(totalRotation % 180) === 90) {
      [finalWidth, finalHeight] = [finalHeight, finalWidth];
    }

    outputCanvas.width = finalWidth;
    outputCanvas.height = finalHeight;

    ctx.translate(outputCanvas.width / 2, outputCanvas.height / 2);
    ctx.rotate(totalRotation * Math.PI / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

    const drawWidth = Math.abs(totalRotation % 180) === 90 ? finalHeight : finalWidth;
    const drawHeight = Math.abs(totalRotation % 180) === 90 ? finalWidth : finalHeight;

    ctx.drawImage(
      img,
      cropArea.x, cropArea.y, cropArea.width, cropArea.height,
      -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight
    );

    const dataUrl = outputCanvas.toDataURL("image/png", 1);
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast("Image downloaded!");
  };

  const resetAll = () => {
    setRotation(0);
    setCustomAngle(0);
    setFlipH(false);
    setFlipV(false);
    setAspectRatio(null);
    if (imageRef.current) {
      setCropArea({ x: 0, y: 0, width: imageRef.current.width, height: imageRef.current.height });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Crop & Rotate</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={resetAll}>
            Reset
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
          {imageLoaded ? (
            <canvas ref={canvasRef} className="border border-border rounded-lg shadow-xl max-w-full" />
          ) : (
            <div className="text-muted-foreground">Loading image...</div>
          )}
        </div>

        {/* Tools Sidebar */}
        <aside className="w-80 border-l border-border bg-card p-4 overflow-y-auto">
          <Tabs defaultValue="rotate" className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-4">
              <TabsTrigger value="rotate">Rotate</TabsTrigger>
              <TabsTrigger value="crop">Crop</TabsTrigger>
            </TabsList>

            <TabsContent value="rotate" className="space-y-6">
              {/* Quick Rotate */}
              <div>
                <Label className="mb-3 block">Quick Rotate</Label>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => rotate90("ccw")} className="flex-1">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    90° Left
                  </Button>
                  <Button variant="outline" onClick={() => rotate90("cw")} className="flex-1">
                    <RotateCw className="h-4 w-4 mr-2" />
                    90° Right
                  </Button>
                </div>
              </div>

              {/* Custom Angle */}
              <div>
                <Label className="mb-3 block">Custom Angle: {customAngle}°</Label>
                <Slider
                  value={[customAngle]}
                  onValueChange={([v]) => setCustomAngle(v)}
                  min={-180}
                  max={180}
                  step={1}
                />
                <div className="flex gap-2 mt-2">
                  <Input
                    type="number"
                    value={customAngle}
                    onChange={(e) => setCustomAngle(Number(e.target.value))}
                    min={-180}
                    max={180}
                    className="w-24"
                  />
                  <span className="text-muted-foreground self-center">degrees</span>
                </div>
              </div>

              {/* Flip */}
              <div>
                <Label className="mb-3 block">Flip</Label>
                <div className="flex gap-2">
                  <Button 
                    variant={flipH ? "default" : "outline"} 
                    onClick={toggleFlipH}
                    className="flex-1"
                  >
                    <FlipHorizontal className="h-4 w-4 mr-2" />
                    Horizontal
                  </Button>
                  <Button 
                    variant={flipV ? "default" : "outline"} 
                    onClick={toggleFlipV}
                    className="flex-1"
                  >
                    <FlipVertical className="h-4 w-4 mr-2" />
                    Vertical
                  </Button>
                </div>
              </div>

              {/* Current rotation info */}
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Total rotation: {(rotation + customAngle) % 360}°
                </p>
                <p className="text-sm text-muted-foreground">
                  Flip: {flipH ? "H" : ""}{flipV ? "V" : ""}{!flipH && !flipV ? "None" : ""}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="crop" className="space-y-6">
              {/* Aspect Ratio Presets */}
              <div>
                <Label className="mb-3 block">Aspect Ratio</Label>
                <div className="grid grid-cols-3 gap-2">
                  {aspectRatioPresets.map((preset) => (
                    <Button
                      key={preset.id}
                      variant={aspectRatio === preset.ratio ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAspectRatioPreset(preset.ratio)}
                      className="flex flex-col h-auto py-2"
                    >
                      <preset.icon className="h-4 w-4 mb-1" />
                      <span className="text-xs">{preset.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Crop dimensions */}
              <div>
                <Label className="mb-3 block">Crop Area</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Width</Label>
                    <Input
                      type="number"
                      value={Math.round(cropArea.width)}
                      onChange={(e) => setCropArea(prev => ({ ...prev, width: Number(e.target.value) }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Height</Label>
                    <Input
                      type="number"
                      value={Math.round(cropArea.height)}
                      onChange={(e) => setCropArea(prev => ({ ...prev, height: Number(e.target.value) }))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Output info */}
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Output: {Math.round(cropArea.width)} × {Math.round(cropArea.height)} px
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </aside>
      </div>
    </div>
  );
};
