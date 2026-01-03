import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Upload, X, Image as ImageIcon, Download, Trash2, Play, 
  Pause, CheckCircle2, AlertCircle, Loader2, Settings,
  Minimize2, Maximize2, RotateCw, Crop, Wand2
} from "lucide-react";
import { toast } from "sonner";

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  result?: string;
  error?: string;
}

interface BatchSettings {
  operation: 'compress' | 'resize' | 'convert' | 'watermark';
  quality: number;
  width: number;
  height: number;
  maintainAspectRatio: boolean;
  outputFormat: 'jpg' | 'png' | 'webp';
  watermarkText: string;
}

export const BatchImageProcessor = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(true);
  const [settings, setSettings] = useState<BatchSettings>({
    operation: 'compress',
    quality: 80,
    width: 1920,
    height: 1080,
    maintainAspectRatio: true,
    outputFormat: 'jpg',
    watermarkText: ''
  });

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages: ImageFile[] = files
      .filter(file => file.type.startsWith('image/'))
      .map(file => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        status: 'pending' as const,
        progress: 0
      }));
    
    setImages(prev => [...prev, ...newImages]);
    toast.success(`${newImages.length} images added to queue`);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const newImages: ImageFile[] = files
      .filter(file => file.type.startsWith('image/'))
      .map(file => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        status: 'pending' as const,
        progress: 0
      }));
    
    setImages(prev => [...prev, ...newImages]);
    if (newImages.length > 0) {
      toast.success(`${newImages.length} images added to queue`);
    }
  }, []);

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const clearAll = () => {
    images.forEach(img => URL.revokeObjectURL(img.preview));
    setImages([]);
    setCurrentIndex(0);
    setIsProcessing(false);
    setIsPaused(false);
  };

  // Simulated processing - in real app this would use canvas/server
  const processImage = async (image: ImageFile): Promise<string> => {
    return new Promise((resolve, reject) => {
      const steps = 10;
      let step = 0;
      
      const interval = setInterval(() => {
        step++;
        const progress = (step / steps) * 100;
        
        setImages(prev => prev.map(img => 
          img.id === image.id ? { ...img, progress } : img
        ));
        
        if (step >= steps) {
          clearInterval(interval);
          // Simulate success/error (95% success rate)
          if (Math.random() > 0.05) {
            resolve(image.preview); // In real app, would return processed image URL
          } else {
            reject(new Error('Processing failed'));
          }
        }
      }, 200);
    });
  };

  const startProcessing = async () => {
    if (images.length === 0) {
      toast.error("Please add images first");
      return;
    }

    setIsProcessing(true);
    setIsPaused(false);
    
    for (let i = currentIndex; i < images.length; i++) {
      if (isPaused) break;
      
      const image = images[i];
      if (image.status === 'completed') continue;
      
      setCurrentIndex(i);
      setImages(prev => prev.map(img => 
        img.id === image.id ? { ...img, status: 'processing' } : img
      ));
      
      try {
        const result = await processImage(image);
        setImages(prev => prev.map(img => 
          img.id === image.id ? { ...img, status: 'completed', result, progress: 100 } : img
        ));
      } catch {
        setImages(prev => prev.map(img => 
          img.id === image.id ? { ...img, status: 'error', error: 'Processing failed' } : img
        ));
      }
    }
    
    setIsProcessing(false);
    if (!isPaused) {
      toast.success("Batch processing complete!");
    }
  };

  const pauseProcessing = () => {
    setIsPaused(true);
    toast.info("Processing paused");
  };

  const resumeProcessing = () => {
    setIsPaused(false);
    startProcessing();
  };

  const downloadAll = () => {
    const completed = images.filter(img => img.status === 'completed');
    toast.success(`Downloading ${completed.length} processed images...`);
    // In real app, would create a zip or download individual files
  };

  const completedCount = images.filter(img => img.status === 'completed').length;
  const errorCount = images.filter(img => img.status === 'error').length;
  const pendingCount = images.filter(img => img.status === 'pending').length;
  const overallProgress = images.length > 0 
    ? Math.round((completedCount / images.length) * 100) 
    : 0;

  const getOperationIcon = (op: string) => {
    switch (op) {
      case 'compress': return Minimize2;
      case 'resize': return Maximize2;
      case 'convert': return RotateCw;
      case 'watermark': return Wand2;
      default: return Crop;
    }
  };

  const OperationIcon = getOperationIcon(settings.operation);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <ImageIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Batch Image Processor</h2>
              <p className="text-sm text-muted-foreground">Process multiple images with the same settings</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4 mr-2" />
              {showSettings ? 'Hide' : 'Show'} Settings
            </Button>
            {images.length > 0 && completedCount > 0 && (
              <Button size="sm" onClick={downloadAll}>
                <Download className="h-4 w-4 mr-2" />
                Download All ({completedCount})
              </Button>
            )}
          </div>
        </div>

        {/* Progress Overview */}
        {images.length > 0 && (
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">Total: <span className="font-medium text-foreground">{images.length}</span></span>
                <span className="text-emerald-500">Completed: {completedCount}</span>
                <span className="text-amber-500">Pending: {pendingCount}</span>
                {errorCount > 0 && <span className="text-destructive">Errors: {errorCount}</span>}
              </div>
              <span className="text-sm font-medium">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Settings Panel */}
        {showSettings && (
          <div className="w-72 border-r border-border bg-muted/20 p-4 overflow-y-auto">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <OperationIcon className="h-4 w-4 text-primary" />
              Processing Settings
            </h3>
            
            <div className="space-y-5">
              {/* Operation Type */}
              <div className="space-y-2">
                <Label>Operation</Label>
                <Select 
                  value={settings.operation} 
                  onValueChange={(v) => setSettings({...settings, operation: v as BatchSettings['operation']})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compress">Compress Images</SelectItem>
                    <SelectItem value="resize">Resize Images</SelectItem>
                    <SelectItem value="convert">Convert Format</SelectItem>
                    <SelectItem value="watermark">Add Watermark</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quality Slider */}
              {(settings.operation === 'compress' || settings.operation === 'convert') && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Quality</Label>
                    <span className="text-sm text-muted-foreground">{settings.quality}%</span>
                  </div>
                  <Slider
                    value={[settings.quality]}
                    onValueChange={([v]) => setSettings({...settings, quality: v})}
                    min={10}
                    max={100}
                    step={5}
                  />
                </div>
              )}

              {/* Resize Settings */}
              {settings.operation === 'resize' && (
                <>
                  <div className="space-y-2">
                    <Label>Width (px)</Label>
                    <input
                      type="number"
                      value={settings.width}
                      onChange={(e) => setSettings({...settings, width: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Height (px)</Label>
                    <input
                      type="number"
                      value={settings.height}
                      onChange={(e) => setSettings({...settings, height: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={settings.maintainAspectRatio}
                      onCheckedChange={(v) => setSettings({...settings, maintainAspectRatio: v})}
                    />
                    <Label className="text-sm">Maintain aspect ratio</Label>
                  </div>
                </>
              )}

              {/* Output Format */}
              {settings.operation === 'convert' && (
                <div className="space-y-2">
                  <Label>Output Format</Label>
                  <Select 
                    value={settings.outputFormat} 
                    onValueChange={(v) => setSettings({...settings, outputFormat: v as BatchSettings['outputFormat']})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jpg">JPEG</SelectItem>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="webp">WebP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Watermark Text */}
              {settings.operation === 'watermark' && (
                <div className="space-y-2">
                  <Label>Watermark Text</Label>
                  <input
                    type="text"
                    value={settings.watermarkText}
                    onChange={(e) => setSettings({...settings, watermarkText: e.target.value})}
                    placeholder="Enter watermark text..."
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-2">
              {!isProcessing ? (
                <Button className="w-full" onClick={startProcessing} disabled={images.length === 0}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Processing
                </Button>
              ) : isPaused ? (
                <Button className="w-full" onClick={resumeProcessing}>
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </Button>
              ) : (
                <Button className="w-full" variant="secondary" onClick={pauseProcessing}>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              )}
              <Button variant="outline" className="w-full" onClick={clearAll} disabled={isProcessing && !isPaused}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 p-4 overflow-y-auto">
          {images.length === 0 ? (
            /* Drop Zone */
            <label
              className="flex flex-col items-center justify-center h-full border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Drop images here</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  or click to browse • JPG, PNG, WebP, GIF
                </p>
                <Button variant="secondary" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Select Images
                </Button>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          ) : (
            /* Image Grid */
            <div className="space-y-4">
              {/* Add More Button */}
              <div className="flex items-center justify-between">
                <label className="cursor-pointer">
                  <Button variant="outline" size="sm" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Add More Images
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Image Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {images.map((image) => (
                  <Card key={image.id} className="overflow-hidden group">
                    <div className="relative aspect-square">
                      <img
                        src={image.preview}
                        alt={image.file.name}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Status Overlay */}
                      {image.status === 'processing' && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                          <div className="text-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                            <span className="text-sm font-medium">{Math.round(image.progress)}%</span>
                          </div>
                        </div>
                      )}
                      
                      {image.status === 'completed' && (
                        <div className="absolute top-2 right-2">
                          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                            <CheckCircle2 className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}
                      
                      {image.status === 'error' && (
                        <div className="absolute inset-0 bg-destructive/20 flex items-center justify-center">
                          <div className="text-center">
                            <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-1" />
                            <span className="text-xs text-destructive">Failed</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => removeImage(image.id)}
                        className="absolute top-2 left-2 w-6 h-6 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                        disabled={image.status === 'processing'}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                    
                    <CardContent className="p-2">
                      <p className="text-xs text-muted-foreground truncate" title={image.file.name}>
                        {image.file.name}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">
                          {(image.file.size / 1024).toFixed(0)} KB
                        </span>
                        <Badge 
                          variant={
                            image.status === 'completed' ? 'default' :
                            image.status === 'error' ? 'destructive' :
                            image.status === 'processing' ? 'secondary' : 'outline'
                          }
                          className="text-[10px] h-5"
                        >
                          {image.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
