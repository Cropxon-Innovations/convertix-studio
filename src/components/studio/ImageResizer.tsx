import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Download, X, Save, Link, Unlink, RotateCw
} from "lucide-react";
import { toast } from "sonner";

interface ImageResizerProps {
  imageUrl: string;
  originalWidth: number;
  originalHeight: number;
  onSave: (dataUrl: string, width: number, height: number) => void;
  onClose: () => void;
}

type ResizeMode = "pixels" | "percentage";

export const ImageResizer = ({ 
  imageUrl, 
  originalWidth, 
  originalHeight, 
  onSave, 
  onClose 
}: ImageResizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<ResizeMode>("pixels");
  const [width, setWidth] = useState(originalWidth);
  const [height, setHeight] = useState(originalHeight);
  const [percentage, setPercentage] = useState(100);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(imageUrl);
  
  const aspectRatio = originalWidth / originalHeight;

  // Update dimensions based on mode
  useEffect(() => {
    if (mode === "percentage") {
      setWidth(Math.round(originalWidth * (percentage / 100)));
      setHeight(Math.round(originalHeight * (percentage / 100)));
    }
  }, [percentage, mode, originalWidth, originalHeight]);

  // Update preview
  useEffect(() => {
    updatePreview();
  }, [width, height]);

  const handleWidthChange = (newWidth: number) => {
    if (isNaN(newWidth) || newWidth < 1) return;
    
    setWidth(newWidth);
    if (lockAspectRatio) {
      setHeight(Math.round(newWidth / aspectRatio));
    }
    
    if (mode === "percentage") {
      setPercentage(Math.round((newWidth / originalWidth) * 100));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    if (isNaN(newHeight) || newHeight < 1) return;
    
    setHeight(newHeight);
    if (lockAspectRatio) {
      setWidth(Math.round(newHeight * aspectRatio));
    }
    
    if (mode === "percentage") {
      setPercentage(Math.round((newHeight / originalHeight) * 100));
    }
  };

  const handlePercentageChange = (newPercentage: number) => {
    if (isNaN(newPercentage) || newPercentage < 1) return;
    setPercentage(newPercentage);
  };

  const presetSizes = [
    { label: "25%", value: 25 },
    { label: "50%", value: 50 },
    { label: "75%", value: 75 },
    { label: "100%", value: 100 },
    { label: "150%", value: 150 },
    { label: "200%", value: 200 },
  ];

  const commonDimensions = [
    { label: "HD (1280×720)", width: 1280, height: 720 },
    { label: "Full HD (1920×1080)", width: 1920, height: 1080 },
    { label: "4K (3840×2160)", width: 3840, height: 2160 },
    { label: "Instagram Square (1080×1080)", width: 1080, height: 1080 },
    { label: "Instagram Story (1080×1920)", width: 1080, height: 1920 },
    { label: "Twitter Header (1500×500)", width: 1500, height: 500 },
    { label: "Facebook Cover (820×312)", width: 820, height: 312 },
  ];

  const updatePreview = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      setPreviewUrl(canvas.toDataURL("image/png"));
    };
    img.src = imageUrl;
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/png");
      onSave(dataUrl, width, height);
      toast.success(`Image resized to ${width}×${height}`);
    };
    img.src = imageUrl;
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      const link = document.createElement("a");
      link.download = `resized_${width}x${height}.png`;
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Image downloaded!");
    };
    img.src = imageUrl;
  };

  const resetToOriginal = () => {
    setWidth(originalWidth);
    setHeight(originalHeight);
    setPercentage(100);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Resize Image</h2>
          <p className="text-sm text-muted-foreground">
            Original: {originalWidth} × {originalHeight}px
          </p>
        </div>
        <div className="flex items-center gap-2">
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
        {/* Preview Area */}
        <div className="flex-1 flex items-center justify-center bg-muted/30 p-8 overflow-auto">
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-full max-h-[60vh] object-contain border border-border rounded-lg shadow-lg"
            />
            <div className="absolute bottom-2 right-2 bg-background/90 rounded px-2 py-1 text-xs font-medium">
              {width} × {height}px
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Settings Sidebar */}
        <aside className="w-80 border-l border-border bg-card p-4 overflow-y-auto">
          <div className="space-y-6">
            {/* Mode Selection */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Resize Mode</Label>
              <RadioGroup value={mode} onValueChange={(v) => setMode(v as ResizeMode)} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pixels" id="pixels" />
                  <Label htmlFor="pixels" className="cursor-pointer">Pixels</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="percentage" id="percentage" />
                  <Label htmlFor="percentage" className="cursor-pointer">Percentage</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Aspect Ratio Lock */}
            <div className="flex items-center justify-between">
              <Label className="text-sm">Lock Aspect Ratio</Label>
              <div className="flex items-center gap-2">
                <Switch
                  checked={lockAspectRatio}
                  onCheckedChange={setLockAspectRatio}
                />
                {lockAspectRatio ? (
                  <Link className="h-4 w-4 text-primary" />
                ) : (
                  <Unlink className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>

            {mode === "pixels" ? (
              <>
                {/* Pixel Dimensions */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Width (px)</Label>
                    <Input
                      type="number"
                      value={width}
                      onChange={(e) => handleWidthChange(parseInt(e.target.value))}
                      min={1}
                      max={10000}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Height (px)</Label>
                    <Input
                      type="number"
                      value={height}
                      onChange={(e) => handleHeightChange(parseInt(e.target.value))}
                      min={1}
                      max={10000}
                    />
                  </div>
                </div>

                {/* Common Dimensions */}
                <div>
                  <Label className="text-sm mb-2 block">Presets</Label>
                  <div className="space-y-2">
                    {commonDimensions.map((dim) => (
                      <Button
                        key={dim.label}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => {
                          setWidth(dim.width);
                          setHeight(dim.height);
                          setLockAspectRatio(false);
                        }}
                      >
                        {dim.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Percentage Input */}
                <div>
                  <Label className="text-sm">Scale (%)</Label>
                  <Input
                    type="number"
                    value={percentage}
                    onChange={(e) => handlePercentageChange(parseInt(e.target.value))}
                    min={1}
                    max={1000}
                  />
                </div>

                {/* Preset Percentages */}
                <div>
                  <Label className="text-sm mb-2 block">Quick Scale</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {presetSizes.map((preset) => (
                      <Button
                        key={preset.value}
                        variant={percentage === preset.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPercentage(preset.value)}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Result Size */}
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Result Size</p>
                  <p className="text-lg font-medium">
                    {width} × {height}px
                  </p>
                </div>
              </>
            )}

            {/* Reset Button */}
            <Button variant="outline" onClick={resetToOriginal} className="w-full">
              <RotateCw className="h-4 w-4 mr-2" />
              Reset to Original
            </Button>

            {/* Size Info */}
            <div className="p-3 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Original</span>
                <span>{originalWidth} × {originalHeight}px</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">New Size</span>
                <span className="font-medium">{width} × {height}px</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Scale</span>
                <span>{Math.round((width / originalWidth) * 100)}%</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};