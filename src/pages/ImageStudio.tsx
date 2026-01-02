import { useState, useCallback, useRef } from "react";
import { StudioLayout } from "@/components/layout/StudioLayout";
import { Button } from "@/components/ui/button";
import { 
  Image, Upload, Download, Clock, Tag, 
  Maximize, Minimize, Palette, Wand2, Trash2,
  Lock, ChevronRight, Grid3X3, Crop, RotateCw,
  Eraser, Droplet, Type, Smile, ArrowUpRight,
  FileImage, Code, Eye, Loader2, CheckCircle,
  AlertCircle, Play, Pause, ListOrdered, Mail
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useConversions } from "@/hooks/useConversions";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Tool categories matching iLoveIMG
const toolCategories = [
  { id: "all", label: "All" },
  { id: "optimize", label: "Optimize" },
  { id: "edit", label: "Edit" },
  { id: "convert", label: "Convert" },
  { id: "create", label: "Create" },
];

const tools = [
  // Optimize
  { id: "compress", label: "Compress Image", icon: Minimize, description: "Reduce file size while maintaining quality", outputFormat: "optimized", conversionType: "compress-image", category: "optimize" },
  { id: "resize", label: "Resize Image", icon: Maximize, description: "Change dimensions by percent or pixels", outputFormat: "resized", conversionType: "resize-image", category: "optimize" },
  { id: "upscale", label: "Upscale Image", icon: ArrowUpRight, description: "AI-powered image enlargement", outputFormat: "upscaled", conversionType: "upscale-image", category: "optimize" },
  
  // Edit
  { id: "crop", label: "Crop Image", icon: Crop, description: "Crop to custom dimensions", outputFormat: "cropped", conversionType: "crop-image", category: "edit" },
  { id: "rotate", label: "Rotate Image", icon: RotateCw, description: "Rotate images at any angle", outputFormat: "rotated", conversionType: "rotate-image", category: "edit" },
  { id: "remove-bg", label: "Remove Background", icon: Eraser, description: "AI-powered background removal", outputFormat: "png", conversionType: "remove-background", category: "edit" },
  { id: "watermark", label: "Add Watermark", icon: Droplet, description: "Add text or image watermark", outputFormat: "watermarked", conversionType: "watermark-image", category: "edit" },
  { id: "blur-face", label: "Blur Faces", icon: Eye, description: "Automatically blur faces for privacy", outputFormat: "blurred", conversionType: "blur-faces", category: "edit" },
  { id: "photo-editor", label: "Photo Editor", icon: Wand2, description: "Add text, effects, frames, stickers", outputFormat: "edited", conversionType: "photo-editor", category: "edit" },
  
  // Convert
  { id: "to-jpg", label: "Convert to JPG", icon: FileImage, description: "PNG, GIF, TIF, PSD, SVG to JPG", outputFormat: "jpg", conversionType: "convert-to-jpg", category: "convert" },
  { id: "from-jpg", label: "Convert from JPG", icon: FileImage, description: "JPG to PNG, GIF, or animated GIF", outputFormat: "png", conversionType: "convert-from-jpg", category: "convert" },
  { id: "to-png", label: "Convert to PNG", icon: FileImage, description: "Convert images to PNG format", outputFormat: "png", conversionType: "convert-to-png", category: "convert" },
  { id: "to-webp", label: "Convert to WebP", icon: FileImage, description: "Convert images to WebP format", outputFormat: "webp", conversionType: "convert-to-webp", category: "convert" },
  { id: "html-to-image", label: "HTML to Image", icon: Code, description: "Screenshot webpage as image", outputFormat: "png", conversionType: "html-to-image", category: "convert" },
  
  // Create
  { id: "meme", label: "Meme Generator", icon: Smile, description: "Create memes with captions", outputFormat: "jpg", conversionType: "create-meme", category: "create" },
  { id: "batch", label: "Batch Process", icon: Grid3X3, description: "Process multiple images at once", outputFormat: "batch", conversionType: "batch-process", category: "create" },
];

interface ProcessingFile {
  file: File;
  preview: string;
  progress: number;
  status: "queued" | "pending" | "processing" | "completed" | "failed";
  outputUrl?: string;
  outputSize?: number;
}

const ImageStudio = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [activeTool, setActiveTool] = useState("compress");
  const [activeCategory, setActiveCategory] = useState("all");
  const [previews, setPreviews] = useState<string[]>([]);
  const [processingFiles, setProcessingFiles] = useState<Map<string, ProcessingFile>>(new Map());
  const [isProcessing, setIsProcessing] = useState(false);
  const [sendEmailNotification, setSendEmailNotification] = useState(false);
  const { user } = useAuth();
  const { addConversion, updateConversion } = useConversions();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Filter tools by category
  const filteredTools = activeCategory === "all" 
    ? tools 
    : tools.filter(t => t.category === activeCategory);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f => 
      f.type.startsWith('image/')
    );
    setFiles(prev => [...prev, ...droppedFiles]);
    
    droppedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(f => 
        f.type.startsWith('image/')
      );
      setFiles(prev => [...prev, ...selectedFiles]);
      
      selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviews(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  }, []);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  const uploadFileToStorage = async (file: File): Promise<string> => {
    const fileName = `uploads/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from("convertix")
      .upload(fileName, file, { upsert: true });
    
    if (error) throw new Error(`Upload failed: ${error.message}`);
    
    const { data: urlData } = supabase.storage
      .from("convertix")
      .getPublicUrl(fileName);
    
    return urlData.publicUrl;
  };

  const processImages = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    const tool = tools.find(t => t.id === activeTool);
    if (!tool) return;

    // Initialize processing state
    const newProcessingFiles = new Map<string, ProcessingFile>();
    files.forEach((file, index) => {
      newProcessingFiles.set(file.name, { 
        file, 
        preview: previews[index] || '',
        progress: 0, 
        status: "queued",
      });
    });
    setProcessingFiles(newProcessingFiles);

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Update status to processing
      setProcessingFiles(prev => {
        const updated = new Map(prev);
        updated.set(file.name, { ...updated.get(file.name)!, status: "processing", progress: 10 });
        return updated;
      });

      // Track conversion if logged in
      let conversionId: string | null = null;
      if (user) {
        const conversion = await addConversion({
          original_filename: file.name,
          original_format: getFileExtension(file.name),
          output_format: tool.outputFormat,
          file_size: file.size,
          output_size: null,
          status: "processing",
          tool_used: tool.id,
        });
        if (conversion) conversionId = conversion.id;
      }

      try {
        // Upload file
        setProcessingFiles(prev => {
          const updated = new Map(prev);
          updated.set(file.name, { ...updated.get(file.name)!, progress: 30 });
          return updated;
        });

        const fileUrl = await uploadFileToStorage(file);

        setProcessingFiles(prev => {
          const updated = new Map(prev);
          updated.set(file.name, { ...updated.get(file.name)!, progress: 50 });
          return updated;
        });

        // Call edge function
        const { data, error } = await supabase.functions.invoke("convert-file", {
          body: {
            fileUrl,
            fileName: file.name,
            conversionType: tool.conversionType,
            userEmail: sendEmailNotification && user?.email ? user.email : undefined,
            sendNotification: sendEmailNotification && !!user?.email,
          },
        });

        setProcessingFiles(prev => {
          const updated = new Map(prev);
          updated.set(file.name, { ...updated.get(file.name)!, progress: 80 });
          return updated;
        });

        if (error) throw error;
        
        if (!data.success) {
          throw new Error(data.error || "Processing failed");
        }

        // Mark as completed
        setProcessingFiles(prev => {
          const updated = new Map(prev);
          updated.set(file.name, { 
            ...updated.get(file.name)!, 
            status: "completed", 
            progress: 100,
            outputUrl: data.outputUrl,
            outputSize: data.outputSize,
          });
          return updated;
        });

        // Update conversion record
        if (conversionId) {
          await updateConversion(conversionId, {
            status: "completed",
            output_size: data.outputSize,
            completed_at: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error("Processing error:", err);
        
        setProcessingFiles(prev => {
          const updated = new Map(prev);
          updated.set(file.name, { 
            ...updated.get(file.name)!, 
            status: "failed", 
            progress: 0,
          });
          return updated;
        });

        if (conversionId) {
          await updateConversion(conversionId, { status: "failed" });
        }

        toast({
          title: "Processing Failed",
          description: err instanceof Error ? err.message : "Unknown error occurred",
          variant: "destructive",
        });
      }
    }

    setIsProcessing(false);
    const successCount = Array.from(processingFiles.values()).filter(f => f.status === "completed").length;
    if (successCount > 0) {
      toast({
        title: "Processing Complete",
        description: `${successCount} image(s) processed successfully`,
      });
    }
  };

  const downloadFile = (pf: ProcessingFile) => {
    if (!pf.outputUrl) return;
    const a = document.createElement('a');
    a.href = pf.outputUrl;
    a.download = `${pf.file.name.split('.')[0]}_${activeTool}.${tools.find(t => t.id === activeTool)?.outputFormat || 'png'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAll = () => {
    processingFiles.forEach((pf) => {
      if (pf.status === "completed") {
        downloadFile(pf);
      }
    });
  };

  const completedCount = Array.from(processingFiles.values()).filter(f => f.status === "completed").length;

  return (
    <StudioLayout>
      <div className="h-[calc(100vh-7rem)] flex flex-col">
        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Workspace */}
          <aside className="w-64 border-r border-border/50 bg-card/50 p-4 hidden lg:flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-foreground">Images</h3>
              <span className="text-xs text-muted-foreground">
                {files.length} file{files.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Image Thumbnails */}
            <div className="flex-1 overflow-auto">
              {files.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8">
                  No images yet
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {files.map((file, index) => {
                    const pf = processingFiles.get(file.name);
                    return (
                      <div
                        key={index}
                        className="group relative aspect-square rounded-lg overflow-hidden bg-accent"
                      >
                        <img
                          src={previews[index]}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                        {pf?.status === "processing" && (
                          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                            <Loader2 className="h-6 w-6 text-primary animate-spin" />
                          </div>
                        )}
                        {pf?.status === "completed" && (
                          <div className="absolute top-1 left-1">
                            <CheckCircle className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        {pf?.status === "failed" && (
                          <div className="absolute top-1 left-1">
                            <AlertCircle className="h-4 w-4 text-destructive" />
                          </div>
                        )}
                        <button
                          onClick={() => removeFile(index)}
                          className="absolute top-1 right-1 p-1 bg-background/80 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/80 to-transparent p-1">
                          <p className="text-[10px] text-foreground truncate">{file.name}</p>
                          <p className="text-[9px] text-muted-foreground">{formatFileSize(file.size)}</p>
                        </div>
                        {pf?.status === "processing" && (
                          <div className="absolute bottom-0 left-0 right-0">
                            <Progress value={pf.progress} className="h-1 rounded-none" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Session Info */}
            <div className="pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-2">Session</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{user ? 'Auto-saving enabled' : 'Temporary (not saved)'}</span>
              </div>
            </div>
          </aside>

          {/* Center - Canvas */}
          <main className="flex-1 flex flex-col p-4 md:p-6 overflow-auto">
            {/* Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="flex-1 rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors flex items-center justify-center bg-card/30"
            >
              {files.length === 0 ? (
                <div className="text-center max-w-md px-6">
                  <div className="w-16 md:w-20 h-16 md:h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <Upload className="h-8 md:h-10 w-8 md:w-10 text-primary" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                    Drop images here
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
                    PNG, JPG, WebP, GIF, SVG, HEIC, and more
                  </p>
                  <label>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileInput}
                      className="hidden"
                      accept="image/*"
                    />
                    <Button variant="outline" className="cursor-pointer" asChild>
                      <span>Browse Files</span>
                    </Button>
                  </label>
                </div>
              ) : isProcessing ? (
                <div className="text-center max-w-md px-6">
                  <div className="w-16 md:w-20 h-16 md:h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 md:mb-6 relative">
                    <Loader2 className="h-8 md:h-10 w-8 md:w-10 text-primary animate-spin" />
                    <div className="absolute inset-0 rounded-2xl border-2 border-primary/30 animate-ping" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                    Processing {files.length} image{files.length !== 1 ? 's' : ''}...
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-4">
                    {completedCount} of {files.length} completed
                  </p>
                  <Progress value={(completedCount / files.length) * 100} className="h-2 max-w-xs mx-auto" />
                </div>
              ) : completedCount > 0 ? (
                <div className="text-center max-w-md px-6">
                  <div className="w-16 md:w-20 h-16 md:h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <CheckCircle className="h-8 md:h-10 w-8 md:w-10 text-primary" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                    {completedCount} image{completedCount !== 1 ? 's' : ''} ready!
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
                    Download from the sidebar or download all below
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={downloadAll}>
                      <Download className="mr-2 h-4 w-4" />
                      Download All
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setFiles([]);
                      setPreviews([]);
                      setProcessingFiles(new Map());
                    }}>
                      Start New
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full p-4 flex items-center justify-center">
                  {previews.length > 0 && (
                    <div className="relative max-w-full max-h-full">
                      <img
                        src={previews[0]}
                        alt="Preview"
                        className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg"
                      />
                      {files.length > 1 && (
                        <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-background/90 rounded-full text-sm">
                          +{files.length - 1} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>

          {/* Right Sidebar - Tools */}
          <aside className="w-72 md:w-80 border-l border-border/50 bg-card/50 p-4 hidden md:flex flex-col">
            <h3 className="text-sm font-medium text-foreground mb-3">Tools</h3>

            {/* Category Tabs */}
            <div className="mb-4 overflow-x-auto pb-2">
              <div className="flex gap-1 min-w-max">
                {toolCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-all ${
                      activeCategory === cat.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-accent/50 text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tool List */}
            <div className="flex-1 overflow-y-auto space-y-1 mb-4 max-h-[40vh]">
              {filteredTools.map((tool) => {
                const Icon = tool.icon;
                const isActive = activeTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    disabled={isProcessing}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left group ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-lg scale-[1.02]'
                        : 'hover:bg-accent text-foreground hover:scale-[1.01]'
                    } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{tool.label}</p>
                      <p className={`text-xs truncate ${isActive ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {tool.description}
                      </p>
                    </div>
                    <ChevronRight className={`h-4 w-4 shrink-0 transition-all ${isActive ? 'translate-x-1' : 'opacity-0 group-hover:opacity-50'}`} />
                  </button>
                );
              })}
            </div>

            {/* Process Button */}
            <Button 
              disabled={files.length === 0 || isProcessing} 
              className="w-full mb-4 transition-all duration-200 hover:scale-[1.02]"
              onClick={processImages}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Process Images
                </>
              )}
            </Button>

            {/* Email Notification Toggle */}
            {user && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/30 mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="email-notify-img" className="text-sm text-foreground cursor-pointer">
                    Email on complete
                  </Label>
                </div>
                <Switch
                  id="email-notify-img"
                  checked={sendEmailNotification}
                  onCheckedChange={setSendEmailNotification}
                />
              </div>
            )}

            {/* Download Section */}
            <div className="flex-1" />
            
            <div className="pt-4 border-t border-border/50">
              {user ? (
                <Button 
                  variant="outline" 
                  className="w-full transition-all duration-200 hover:scale-[1.02]" 
                  disabled={completedCount === 0}
                  onClick={downloadAll}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download All ({completedCount})
                </Button>
              ) : (
                <div className="p-4 rounded-lg bg-accent/50 text-center">
                  <Lock className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">
                    Sign in to download and save your work
                  </p>
                  <Button size="sm" className="w-full" onClick={() => navigate('/signin')}>
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Timeline Bar */}
        <div className="h-12 md:h-14 border-t border-border/50 bg-card/50 flex items-center px-4 md:px-6 gap-4">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs md:text-sm text-muted-foreground hidden sm:inline">Progress</span>
          <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500" 
              style={{ width: isProcessing ? `${(completedCount / Math.max(files.length, 1)) * 100}%` : completedCount > 0 ? '100%' : '0%' }}
            />
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs md:text-sm text-muted-foreground">
              {user ? 'Auto-saving' : 'Not saved'}
            </span>
          </div>
        </div>
      </div>
    </StudioLayout>
  );
};

export default ImageStudio;
