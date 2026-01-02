import { useState, useCallback } from "react";
import { StudioLayout } from "@/components/layout/StudioLayout";
import { Button } from "@/components/ui/button";
import { 
  FileText, Upload, Download, Clock, Tag, 
  FileOutput, Minimize2, Type, Layers, Trash2,
  Lock, ChevronRight, CheckCircle, AlertCircle, Loader2, History
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useConversions } from "@/hooks/useConversions";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const tools = [
  { id: "convert", label: "Convert", icon: FileOutput, description: "PDF, DOCX, TXT, and more", outputFormat: "docx" },
  { id: "compress", label: "Compress", icon: Minimize2, description: "Reduce file size", outputFormat: "compressed" },
  { id: "ocr", label: "OCR", icon: Type, description: "Extract text from images", outputFormat: "txt" },
  { id: "merge", label: "Merge", icon: Layers, description: "Combine multiple files", outputFormat: "pdf" },
];

interface ProcessingFile {
  file: File;
  progress: number;
  status: "pending" | "processing" | "completed" | "failed";
  outputUrl?: string;
}

const DocumentStudio = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [activeTool, setActiveTool] = useState("convert");
  const [isDragging, setIsDragging] = useState(false);
  const [processingFiles, setProcessingFiles] = useState<Map<string, ProcessingFile>>(new Map());
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { user } = useAuth();
  const { conversions, addConversion, updateConversion } = useConversions();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  }, []);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
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

  const processFiles = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    
    const tool = tools.find(t => t.id === activeTool);
    if (!tool) return;

    // Initialize processing state for all files
    const newProcessingFiles = new Map<string, ProcessingFile>();
    files.forEach(file => {
      newProcessingFiles.set(file.name, { file, progress: 0, status: "pending" });
    });
    setProcessingFiles(newProcessingFiles);

    // Process each file
    for (const file of files) {
      // Update status to processing
      setProcessingFiles(prev => {
        const updated = new Map(prev);
        updated.set(file.name, { ...updated.get(file.name)!, status: "processing" });
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

      // Simulate processing with progress updates
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 150));
        setProcessingFiles(prev => {
          const updated = new Map(prev);
          const current = updated.get(file.name)!;
          updated.set(file.name, { ...current, progress });
          return updated;
        });
      }

      // Mark as completed
      const outputSize = Math.floor(file.size * (Math.random() * 0.3 + 0.5)); // Simulated output size
      setProcessingFiles(prev => {
        const updated = new Map(prev);
        updated.set(file.name, { 
          ...updated.get(file.name)!, 
          status: "completed", 
          progress: 100,
          outputUrl: URL.createObjectURL(file) // In real app, this would be the converted file
        });
        return updated;
      });

      // Update conversion record
      if (conversionId) {
        await updateConversion(conversionId, {
          status: "completed",
          output_size: outputSize,
          completed_at: new Date().toISOString(),
        });
      }
    }

    setIsProcessing(false);
    toast({
      title: "Processing Complete",
      description: `${files.length} file(s) processed successfully`,
    });
  };

  const downloadFile = (processingFile: ProcessingFile) => {
    if (!processingFile.outputUrl) return;
    
    const tool = tools.find(t => t.id === activeTool);
    const a = document.createElement('a');
    a.href = processingFile.outputUrl;
    a.download = `${processingFile.file.name.split('.')[0]}_${tool?.id || 'converted'}.${tool?.outputFormat || 'pdf'}`;
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

  const getStatusIcon = (status: ProcessingFile["status"]) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-primary" />;
      case "failed": return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "processing": return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const completedCount = Array.from(processingFiles.values()).filter(f => f.status === "completed").length;

  return (
    <StudioLayout>
      <div className="h-[calc(100vh-7rem)] flex flex-col">
        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Workspace & History */}
          <aside className="w-64 border-r border-border/50 bg-card/50 p-4 hidden lg:flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-foreground">Workspace</h3>
              <span className="text-xs text-muted-foreground">
                {files.length} file{files.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* File List */}
            <div className="flex-1 overflow-auto space-y-1">
              {files.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8">
                  No files yet
                </p>
              ) : (
                files.map((file, index) => {
                  const pf = processingFiles.get(file.name);
                  return (
                    <div
                      key={index}
                      className="group flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/50 hover:bg-accent transition-all duration-200 animate-fade-in"
                    >
                      {pf ? getStatusIcon(pf.status) : <FileText className="h-4 w-4 text-primary shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-foreground truncate block">
                          {file.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </span>
                          {pf?.status === "processing" && (
                            <span className="text-xs text-primary">{pf.progress}%</span>
                          )}
                        </div>
                        {pf?.status === "processing" && (
                          <Progress value={pf.progress} className="h-1 mt-1" />
                        )}
                      </div>
                      {!isProcessing && (
                        <button
                          onClick={() => removeFile(index)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-opacity"
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </button>
                      )}
                      {pf?.status === "completed" && (
                        <button
                          onClick={() => downloadFile(pf)}
                          className="p-1 hover:bg-primary/10 rounded transition-colors"
                        >
                          <Download className="h-3 w-3 text-primary" />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Recent History Toggle */}
            {user && (
              <div className="pt-4 border-t border-border/50">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm text-muted-foreground hover:text-foreground"
                >
                  <History className="h-4 w-4" />
                  <span>Recent History</span>
                  <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${showHistory ? 'rotate-90' : ''}`} />
                </button>
                
                {showHistory && (
                  <div className="mt-2 space-y-1 max-h-40 overflow-auto">
                    {conversions.slice(0, 5).map((conv) => (
                      <div key={conv.id} className="px-3 py-2 rounded-lg bg-accent/30 text-xs">
                        <p className="text-foreground truncate">{conv.original_filename}</p>
                        <p className="text-muted-foreground">
                          {conv.original_format} → {conv.output_format}
                        </p>
                      </div>
                    ))}
                    {conversions.length === 0 && (
                      <p className="px-3 py-2 text-xs text-muted-foreground">No history yet</p>
                    )}
                  </div>
                )}
              </div>
            )}

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
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`flex-1 rounded-xl border-2 border-dashed transition-all duration-300 flex items-center justify-center bg-card/30 ${
                isDragging 
                  ? 'border-primary bg-primary/5 scale-[1.02]' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {files.length === 0 ? (
                <div className="text-center max-w-md px-6">
                  <div className={`w-16 md:w-20 h-16 md:h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 md:mb-6 transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`}>
                    <Upload className={`h-8 md:h-10 w-8 md:w-10 text-primary transition-transform duration-300 ${isDragging ? 'animate-bounce' : ''}`} />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                    {isDragging ? 'Drop your files here' : 'Drop documents here'}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
                    PDF, Word, Excel, PowerPoint, and more
                  </p>
                  <label>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileInput}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf"
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
                    Processing {files.length} file{files.length !== 1 ? 's' : ''}...
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
                    {completedCount} file{completedCount !== 1 ? 's' : ''} ready!
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
                      setProcessingFiles(new Map());
                    }}>
                      Start New
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center max-w-md px-6">
                  <div className="w-16 md:w-20 h-16 md:h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <FileText className="h-8 md:h-10 w-8 md:w-10 text-primary" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                    {files.length} document{files.length !== 1 ? 's' : ''} ready
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
                    Select a tool and click "Process Files"
                  </p>
                  <label>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileInput}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf"
                    />
                    <Button variant="outline" className="cursor-pointer" asChild>
                      <span>Add More Files</span>
                    </Button>
                  </label>
                </div>
              )}
            </div>
          </main>

          {/* Right Sidebar - Tools */}
          <aside className="w-64 md:w-72 border-l border-border/50 bg-card/50 p-4 hidden md:flex flex-col">
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
                    disabled={isProcessing}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-left group ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-lg scale-[1.02]'
                        : 'hover:bg-accent text-foreground hover:scale-[1.01]'
                    } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Icon className={`h-5 w-5 shrink-0 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
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
              onClick={processFiles}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Process Files"
              )}
            </Button>

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
                    Sign in to track history and save your work
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
          <span className="text-xs md:text-sm text-muted-foreground hidden sm:inline">Timeline</span>
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

export default DocumentStudio;