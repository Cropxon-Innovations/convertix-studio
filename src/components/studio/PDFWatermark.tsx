import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  X, Download, Type, Image, RotateCw, 
  Move, Eye, Upload, Loader2, Check
} from "lucide-react";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PDFWatermarkProps {
  pdfFile: File;
  onSave: (pdfBlob: Blob) => void;
  onClose: () => void;
}

type WatermarkType = "text" | "image";
type Position = "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "tile";

export const PDFWatermark = ({ pdfFile, onSave, onClose }: PDFWatermarkProps) => {
  const [watermarkType, setWatermarkType] = useState<WatermarkType>("text");
  const [text, setText] = useState("CONFIDENTIAL");
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(30);
  const [rotation, setRotation] = useState(-45);
  const [position, setPosition] = useState<Position>("center");
  const [color, setColor] = useState("#ff0000");
  const [watermarkImage, setWatermarkImage] = useState<string | null>(null);
  const [imageScale, setImageScale] = useState(30);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate preview
  useEffect(() => {
    const generatePreview = async () => {
      try {
        const arrayBuffer = await pdfFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        setTotalPages(pdf.numPages);
        
        const page = await pdf.getPage(currentPage);
        const scale = 1.5;
        const viewport = page.getViewport({ scale });
        
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        
        await page.render({ canvasContext: ctx, viewport }).promise;
        
        // Draw watermark preview
        ctx.save();
        ctx.globalAlpha = opacity / 100;
        
        if (watermarkType === "text") {
          ctx.font = `${fontSize * scale}px Helvetica`;
          ctx.fillStyle = color;
          
          const textWidth = ctx.measureText(text).width;
          const textHeight = fontSize * scale;
          
          if (position === "tile") {
            // Draw tiled watermark
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
            
            for (let y = -canvas.height; y < canvas.height * 2; y += textHeight * 3) {
              for (let x = -canvas.width; x < canvas.width * 2; x += textWidth + 100) {
                ctx.fillText(text, x, y);
              }
            }
          } else {
            let x = canvas.width / 2;
            let y = canvas.height / 2;
            
            switch (position) {
              case "top-left": x = 50; y = 50 + textHeight; break;
              case "top-right": x = canvas.width - textWidth - 50; y = 50 + textHeight; break;
              case "bottom-left": x = 50; y = canvas.height - 50; break;
              case "bottom-right": x = canvas.width - textWidth - 50; y = canvas.height - 50; break;
              default: x = (canvas.width - textWidth) / 2; y = canvas.height / 2;
            }
            
            ctx.translate(x + textWidth / 2, y - textHeight / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.translate(-(x + textWidth / 2), -(y - textHeight / 2));
            ctx.fillText(text, x, y);
          }
        } else if (watermarkType === "image" && watermarkImage) {
          const img = new window.Image();
          img.src = watermarkImage;
          await new Promise((resolve) => { img.onload = resolve; });
          
          const imgWidth = (img.width * imageScale) / 100 * scale;
          const imgHeight = (img.height * imageScale) / 100 * scale;
          
          let x = (canvas.width - imgWidth) / 2;
          let y = (canvas.height - imgHeight) / 2;
          
          switch (position) {
            case "top-left": x = 20; y = 20; break;
            case "top-right": x = canvas.width - imgWidth - 20; y = 20; break;
            case "bottom-left": x = 20; y = canvas.height - imgHeight - 20; break;
            case "bottom-right": x = canvas.width - imgWidth - 20; y = canvas.height - imgHeight - 20; break;
          }
          
          ctx.translate(x + imgWidth / 2, y + imgHeight / 2);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.translate(-(x + imgWidth / 2), -(y + imgHeight / 2));
          ctx.drawImage(img, x, y, imgWidth, imgHeight);
        }
        
        ctx.restore();
        setPreviewUrl(canvas.toDataURL());
      } catch (error) {
        console.error("Preview generation error:", error);
      }
    };
    
    generatePreview();
  }, [pdfFile, currentPage, watermarkType, text, fontSize, opacity, rotation, position, color, watermarkImage, imageScale]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setWatermarkImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255,
    } : { r: 1, g: 0, b: 0 };
  };

  const applyWatermark = async () => {
    setIsProcessing(true);
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      for (const page of pages) {
        const { width, height } = page.getSize();
        const rgbColor = hexToRgb(color);
        
        if (watermarkType === "text") {
          const textWidth = font.widthOfTextAtSize(text, fontSize);
          const textHeight = fontSize;
          
          if (position === "tile") {
            // Tiled watermark
            for (let y = 0; y < height + textHeight * 2; y += textHeight * 3) {
              for (let x = 0; x < width + textWidth; x += textWidth + 100) {
                page.drawText(text, {
                  x,
                  y,
                  size: fontSize,
                  font,
                  color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
                  opacity: opacity / 100,
                  rotate: degrees(rotation),
                });
              }
            }
          } else {
            let x = (width - textWidth) / 2;
            let y = height / 2;
            
            switch (position) {
              case "top-left": x = 50; y = height - 50 - textHeight; break;
              case "top-right": x = width - textWidth - 50; y = height - 50 - textHeight; break;
              case "bottom-left": x = 50; y = 50; break;
              case "bottom-right": x = width - textWidth - 50; y = 50; break;
            }
            
            page.drawText(text, {
              x,
              y,
              size: fontSize,
              font,
              color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
              opacity: opacity / 100,
              rotate: degrees(rotation),
            });
          }
        } else if (watermarkType === "image" && watermarkImage) {
          // Embed image watermark
          const imageBytes = await fetch(watermarkImage).then(res => res.arrayBuffer());
          let image;
          
          if (watermarkImage.includes("image/png")) {
            image = await pdfDoc.embedPng(imageBytes);
          } else {
            image = await pdfDoc.embedJpg(imageBytes);
          }
          
          const imgWidth = (image.width * imageScale) / 100;
          const imgHeight = (image.height * imageScale) / 100;
          
          let x = (width - imgWidth) / 2;
          let y = (height - imgHeight) / 2;
          
          switch (position) {
            case "top-left": x = 20; y = height - imgHeight - 20; break;
            case "top-right": x = width - imgWidth - 20; y = height - imgHeight - 20; break;
            case "bottom-left": x = 20; y = 20; break;
            case "bottom-right": x = width - imgWidth - 20; y = 20; break;
          }
          
          page.drawImage(image, {
            x,
            y,
            width: imgWidth,
            height: imgHeight,
            opacity: opacity / 100,
            rotate: degrees(rotation),
          });
        }
      }
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      onSave(blob);
    } catch (error) {
      console.error("Watermark error:", error);
    }
    setIsProcessing(false);
  };

  const positions: { id: Position; label: string }[] = [
    { id: "center", label: "Center" },
    { id: "top-left", label: "Top Left" },
    { id: "top-right", label: "Top Right" },
    { id: "bottom-left", label: "Bottom Left" },
    { id: "bottom-right", label: "Bottom Right" },
    { id: "tile", label: "Tiled" },
  ];

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="h-14 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-semibold">Add Watermark</h2>
          <span className="text-sm text-muted-foreground">{pdfFile.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={applyWatermark} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Apply Watermark
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Settings Panel */}
        <div className="w-80 border-r border-border p-4 overflow-y-auto">
          <Tabs value={watermarkType} onValueChange={(v) => setWatermarkType(v as WatermarkType)}>
            <TabsList className="w-full mb-4">
              <TabsTrigger value="text" className="flex-1 gap-2">
                <Type className="h-4 w-4" />
                Text
              </TabsTrigger>
              <TabsTrigger value="image" className="flex-1 gap-2">
                <Image className="h-4 w-4" />
                Image
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4">
              <div>
                <Label>Watermark Text</Label>
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter watermark text"
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
                <div className="flex gap-2 mt-1">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <Input
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="image" className="space-y-4">
              <div>
                <Label>Upload Image</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  className="w-full mt-1"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {watermarkImage ? "Change Image" : "Select Image"}
                </Button>
                {watermarkImage && (
                  <div className="mt-2 p-2 bg-muted rounded-lg">
                    <img
                      src={watermarkImage}
                      alt="Watermark"
                      className="max-h-24 mx-auto object-contain"
                    />
                  </div>
                )}
              </div>
              <div>
                <Label>Image Scale: {imageScale}%</Label>
                <Slider
                  value={[imageScale]}
                  onValueChange={([v]) => setImageScale(v)}
                  min={5}
                  max={100}
                  step={1}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 space-y-4">
            <div>
              <Label>Opacity: {opacity}%</Label>
              <Slider
                value={[opacity]}
                onValueChange={([v]) => setOpacity(v)}
                min={5}
                max={100}
                step={1}
              />
            </div>

            <div>
              <Label>Rotation: {rotation}°</Label>
              <Slider
                value={[rotation]}
                onValueChange={([v]) => setRotation(v)}
                min={-180}
                max={180}
                step={1}
              />
            </div>

            <div>
              <Label>Position</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {positions.map((pos) => (
                  <Button
                    key={pos.id}
                    variant={position === pos.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPosition(pos.id)}
                    className="text-xs"
                  >
                    {pos.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 flex flex-col bg-muted/30">
          <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
            <div className="relative bg-white shadow-lg rounded-lg overflow-hidden">
              <canvas ref={canvasRef} className="max-w-full max-h-[calc(100vh-200px)] w-auto h-auto" />
            </div>
          </div>
          
          {/* Page Navigation */}
          {totalPages > 1 && (
            <div className="h-14 border-t border-border flex items-center justify-center gap-4 bg-card">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
