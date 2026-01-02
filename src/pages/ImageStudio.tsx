import { useState, useCallback } from "react";
import { StudioLayout } from "@/components/layout/StudioLayout";
import { Button } from "@/components/ui/button";
import { 
  Image, Upload, Download, Clock, Tag, 
  Maximize, Minimize, Palette, Wand2, Trash2,
  Lock, ChevronRight, Grid3X3
} from "lucide-react";

const tools = [
  { id: "resize", label: "Resize", icon: Maximize, description: "Change dimensions" },
  { id: "compress", label: "Compress", icon: Minimize, description: "Reduce file size" },
  { id: "convert", label: "Convert", icon: Palette, description: "PNG, JPG, WebP, etc." },
  { id: "batch", label: "Batch Process", icon: Grid3X3, description: "Process multiple images" },
  { id: "enhance", label: "Enhance", icon: Wand2, description: "AI-powered improvements" },
];

const ImageStudio = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoggedIn] = useState(false);
  const [activeTool, setActiveTool] = useState("resize");
  const [previews, setPreviews] = useState<string[]>([]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f => 
      f.type.startsWith('image/')
    );
    setFiles(prev => [...prev, ...droppedFiles]);
    
    // Create previews
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
                  {previews.map((preview, index) => (
                    <div
                      key={index}
                      className="group relative aspect-square rounded-lg overflow-hidden bg-accent"
                    >
                      <img
                        src={preview}
                        alt={files[index]?.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 p-1 bg-background/80 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Session Info */}
            <div className="pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-2">Session</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Temporary (not saved)</span>
              </div>
            </div>
          </aside>

          {/* Center - Canvas */}
          <main className="flex-1 flex flex-col p-6 overflow-auto">
            {/* Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="flex-1 rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors flex items-center justify-center bg-card/30"
            >
              {files.length === 0 ? (
                <div className="text-center max-w-md px-6">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Upload className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Drop images here
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    PNG, JPG, WebP, GIF, SVG, and more
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
          <aside className="w-72 border-l border-border/50 bg-card/50 p-4 hidden md:flex flex-col">
            <h3 className="text-sm font-medium text-foreground mb-4">Tools</h3>

            {/* Tool List */}
            <div className="space-y-2 mb-6">
              {tools.map((tool) => {
                const Icon = tool.icon;
                const isActive = activeTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-left ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent text-foreground'
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{tool.label}</p>
                      <p className={`text-xs truncate ${isActive ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {tool.description}
                      </p>
                    </div>
                    <ChevronRight className={`h-4 w-4 shrink-0 ${isActive ? '' : 'opacity-0'}`} />
                  </button>
                );
              })}
            </div>

            {/* Process Button */}
            <Button 
              disabled={files.length === 0} 
              className="w-full mb-4"
            >
              Process Images
            </Button>

            {/* Download Section */}
            <div className="flex-1" />
            
            <div className="pt-4 border-t border-border/50">
              {isLoggedIn ? (
                <Button variant="outline" className="w-full" disabled={files.length === 0}>
                  <Download className="mr-2 h-4 w-4" />
                  Download All
                </Button>
              ) : (
                <div className="p-4 rounded-lg bg-accent/50 text-center">
                  <Lock className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">
                    Sign in to download and save your work
                  </p>
                  <Button size="sm" className="w-full">
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Timeline Bar */}
        <div className="h-14 border-t border-border/50 bg-card/50 flex items-center px-6 gap-4">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Timeline</span>
          <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
            <div className="h-full w-0 bg-primary rounded-full transition-all" />
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {isLoggedIn ? 'Auto-saving' : 'Not saved'}
            </span>
          </div>
        </div>
      </div>
    </StudioLayout>
  );
};

export default ImageStudio;
