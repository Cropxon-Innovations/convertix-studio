import { useState, useCallback, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { StudioLayout } from "@/components/layout/StudioLayout";
import { Button } from "@/components/ui/button";
import { 
  FileText, Upload, Download, Clock, Tag, 
  FileOutput, Minimize2, Type, Layers, Trash2,
  Lock, ChevronRight, CheckCircle, AlertCircle, Loader2, History,
  Play, Pause, ListOrdered, X, Mail, Scissors, RotateCw,
  FileImage, FileSpreadsheet, Presentation, Code, Shield, 
  Unlock, PenTool, Hash, Droplet, Crop, Eye, GitCompare, FileCheck,
  SplitSquareHorizontal, FileX, FileSearch, LogIn, CloudUpload
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useConversions } from "@/hooks/useConversions";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { QueuePanel } from "@/components/studio/QueuePanel";
import { PDFPageOrganizer } from "@/components/studio/PDFPageOrganizer";
import { PDFMergeSplit } from "@/components/studio/PDFMergeSplit";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Tool categories matching iLovePDF
const toolCategories = [
  { id: "all", label: "All Tools" },
  { id: "organize", label: "Organize" },
  { id: "optimize", label: "Optimize" },
  { id: "convert-to", label: "Convert to PDF" },
  { id: "convert-from", label: "Convert from PDF" },
  { id: "edit", label: "Edit" },
  { id: "security", label: "Security" },
];

const tools = [
  // Organize PDF
  { id: "merge", label: "Merge PDF", icon: Layers, description: "Combine multiple PDFs into one", outputFormat: "pdf", conversionType: "merge", category: "organize" },
  { id: "split", label: "Split PDF", icon: SplitSquareHorizontal, description: "Separate PDF into multiple files", outputFormat: "pdf", conversionType: "split", category: "organize" },
  { id: "remove-pages", label: "Remove Pages", icon: FileX, description: "Delete specific pages from PDF", outputFormat: "pdf", conversionType: "remove-pages", category: "organize" },
  { id: "extract-pages", label: "Extract Pages", icon: FileSearch, description: "Extract specific pages as new PDF", outputFormat: "pdf", conversionType: "extract-pages", category: "organize" },
  { id: "organize", label: "Organize PDF", icon: Layers, description: "Reorder, rotate, delete pages", outputFormat: "pdf", conversionType: "organize", category: "organize", hasEditor: true },
  
  // Optimize PDF
  { id: "compress", label: "Compress PDF", icon: Minimize2, description: "Reduce PDF file size", outputFormat: "pdf", conversionType: "compress-pdf", category: "optimize" },
  { id: "repair", label: "Repair PDF", icon: FileCheck, description: "Fix corrupted PDF files", outputFormat: "pdf", conversionType: "repair", category: "optimize" },
  { id: "ocr", label: "OCR PDF", icon: Type, description: "Make scanned PDFs searchable", outputFormat: "pdf", conversionType: "ocr", category: "optimize" },
  
  // Convert to PDF
  { id: "jpg-to-pdf", label: "JPG to PDF", icon: FileImage, description: "Convert images to PDF", outputFormat: "pdf", conversionType: "jpg-to-pdf", category: "convert-to" },
  { id: "word-to-pdf", label: "Word to PDF", icon: FileText, description: "Convert DOCX to PDF", outputFormat: "pdf", conversionType: "word-to-pdf", category: "convert-to" },
  { id: "ppt-to-pdf", label: "PowerPoint to PDF", icon: Presentation, description: "Convert PPTX to PDF", outputFormat: "pdf", conversionType: "ppt-to-pdf", category: "convert-to" },
  { id: "excel-to-pdf", label: "Excel to PDF", icon: FileSpreadsheet, description: "Convert XLSX to PDF", outputFormat: "pdf", conversionType: "excel-to-pdf", category: "convert-to" },
  { id: "html-to-pdf", label: "HTML to PDF", icon: Code, description: "Convert webpage to PDF", outputFormat: "pdf", conversionType: "html-to-pdf", category: "convert-to" },
  
  // Convert from PDF
  { id: "pdf-to-jpg", label: "PDF to JPG", icon: FileImage, description: "Convert PDF to images", outputFormat: "jpg", conversionType: "pdf-to-jpg", category: "convert-from" },
  { id: "pdf-to-word", label: "PDF to Word", icon: FileText, description: "Convert PDF to DOCX", outputFormat: "docx", conversionType: "pdf-to-docx", category: "convert-from" },
  { id: "pdf-to-ppt", label: "PDF to PowerPoint", icon: Presentation, description: "Convert PDF to PPTX", outputFormat: "pptx", conversionType: "pdf-to-ppt", category: "convert-from" },
  { id: "pdf-to-excel", label: "PDF to Excel", icon: FileSpreadsheet, description: "Convert PDF to XLSX", outputFormat: "xlsx", conversionType: "pdf-to-excel", category: "convert-from" },
  
  // Edit PDF
  { id: "rotate", label: "Rotate PDF", icon: RotateCw, description: "Rotate PDF pages", outputFormat: "pdf", conversionType: "rotate", category: "edit" },
  { id: "add-page-numbers", label: "Add Page Numbers", icon: Hash, description: "Add page numbers to PDF", outputFormat: "pdf", conversionType: "add-page-numbers", category: "edit" },
  { id: "add-watermark", label: "Add Watermark", icon: Droplet, description: "Add text/image watermark", outputFormat: "pdf", conversionType: "add-watermark", category: "edit" },
  { id: "crop", label: "Crop PDF", icon: Crop, description: "Crop PDF page margins", outputFormat: "pdf", conversionType: "crop-pdf", category: "edit" },
  { id: "edit-pdf", label: "Edit PDF", icon: PenTool, description: "Edit text and images in PDF", outputFormat: "pdf", conversionType: "edit-pdf", category: "edit" },
  
  // PDF Security
  { id: "unlock", label: "Unlock PDF", icon: Unlock, description: "Remove PDF password", outputFormat: "pdf", conversionType: "unlock", category: "security" },
  { id: "protect", label: "Protect PDF", icon: Shield, description: "Add password protection", outputFormat: "pdf", conversionType: "protect", category: "security" },
  { id: "sign", label: "Sign PDF", icon: PenTool, description: "Add digital signature", outputFormat: "pdf", conversionType: "sign", category: "security" },
  { id: "redact", label: "Redact PDF", icon: Eye, description: "Black out sensitive info", outputFormat: "pdf", conversionType: "redact", category: "security" },
  { id: "compare", label: "Compare PDF", icon: GitCompare, description: "Compare two PDF files", outputFormat: "pdf", conversionType: "compare", category: "security" },
];

interface ProcessingFile {
  file: File;
  progress: number;
  status: "queued" | "pending" | "processing" | "completed" | "failed" | "paused";
  outputUrl?: string;
  queuePosition?: number;
  outputSize?: number;
}

interface BatchQueueItem {
  id: string;
  file: File;
  toolId: string;
  status: "queued" | "processing" | "completed" | "failed";
}

const DocumentStudio = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [activeTool, setActiveTool] = useState(searchParams.get("tool") || "merge");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isDragging, setIsDragging] = useState(false);
  const [processingFiles, setProcessingFiles] = useState<Map<string, ProcessingFile>>(new Map());
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [batchQueue, setBatchQueue] = useState<BatchQueueItem[]>([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);
  const [sendEmailNotification, setSendEmailNotification] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showPDFOrganizer, setShowPDFOrganizer] = useState(false);
  const [showMergeSplit, setShowMergeSplit] = useState(false);
  const [mergeSplitMode, setMergeSplitMode] = useState<"merge" | "split">("merge");
  const [selectedPDFFile, setSelectedPDFFile] = useState<File | null>(null);
  const pauseRef = useRef(false);
  const { user } = useAuth();
  const { conversions, addConversion, updateConversion } = useConversions();
  const { toast } = useToast();

  // Update active tool from URL
  useEffect(() => {
    const toolFromUrl = searchParams.get("tool");
    if (toolFromUrl && tools.some(t => t.id === toolFromUrl)) {
      setActiveTool(toolFromUrl);
      // Set category based on tool
      const tool = tools.find(t => t.id === toolFromUrl);
      if (tool) {
        setActiveCategory(tool.category);
      }
    }
  }, [searchParams]);
  
  // Filter tools by category
  const filteredTools = activeCategory === "all" 
    ? tools 
    : tools.filter(t => t.category === activeCategory);

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

  // Handle tool selection - open editor for special tools
  const handleToolSelect = (toolId: string) => {
    setActiveTool(toolId);
    const tool = tools.find(t => t.id === toolId);
    
    // Handle merge/split tools
    if ((toolId === "merge" || toolId === "split") && files.length > 0) {
      const pdfFiles = files.filter(f => f.name.toLowerCase().endsWith('.pdf'));
      if (pdfFiles.length > 0) {
        setMergeSplitMode(toolId as "merge" | "split");
        setShowMergeSplit(true);
        return;
      }
    }
    
    // Handle organize tool
    if (tool?.hasEditor && files.length > 0) {
      const pdfFile = files.find(f => f.name.toLowerCase().endsWith('.pdf'));
      if (pdfFile) {
        setSelectedPDFFile(pdfFile);
        setShowPDFOrganizer(true);
      }
    }
  };

  // Add files to batch queue
  const addToQueue = () => {
    if (files.length === 0) return;
    
    const newQueueItems: BatchQueueItem[] = files.map((file, index) => ({
      id: `${file.name}-${Date.now()}-${index}`,
      file,
      toolId: activeTool,
      status: "queued" as const,
    }));
    
    setBatchQueue(prev => [...prev, ...newQueueItems]);
    setFiles([]);
    setShowQueue(true);
    
    toast({
      title: "Added to Queue",
      description: `${newQueueItems.length} file(s) added to processing queue`,
    });
  };

  const reorderQueue = (fromIndex: number, toIndex: number) => {
    setBatchQueue(prev => {
      const newQueue = [...prev];
      const [removed] = newQueue.splice(fromIndex, 1);
      newQueue.splice(toIndex, 0, removed);
      return newQueue;
    });
  };

  const removeFromQueue = (id: string) => {
    setBatchQueue(prev => prev.filter(item => item.id !== id));
  };

  const clearQueue = () => {
    setBatchQueue([]);
    setCurrentQueueIndex(0);
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

  const processFiles = async () => {
    if (files.length === 0 && batchQueue.length === 0) return;
    
    // If there are files not in queue, add them first
    if (files.length > 0) {
      addToQueue();
      return;
    }
    
    setIsProcessing(true);
    setIsPaused(false);
    pauseRef.current = false;
    
    const tool = tools.find(t => t.id === activeTool);
    if (!tool) return;

    // Initialize processing state for all queued files
    const newProcessingFiles = new Map<string, ProcessingFile>();
    batchQueue.forEach((item, index) => {
      newProcessingFiles.set(item.id, { 
        file: item.file, 
        progress: 0, 
        status: "queued",
        queuePosition: index + 1
      });
    });
    setProcessingFiles(newProcessingFiles);

    // Process queue
    for (let i = currentQueueIndex; i < batchQueue.length; i++) {
      if (pauseRef.current) {
        setCurrentQueueIndex(i);
        break;
      }
      
      const item = batchQueue[i];
      const itemTool = tools.find(t => t.id === item.toolId) || tool;
      
      // Update status to processing
      setProcessingFiles(prev => {
        const updated = new Map(prev);
        updated.set(item.id, { ...updated.get(item.id)!, status: "processing", progress: 10 });
        return updated;
      });
      
      setBatchQueue(prev => prev.map(q => 
        q.id === item.id ? { ...q, status: "processing" as const } : q
      ));

      // Track conversion if logged in
      let conversionId: string | null = null;
      if (user) {
        const conversion = await addConversion({
          original_filename: item.file.name,
          original_format: getFileExtension(item.file.name),
          output_format: itemTool.outputFormat,
          file_size: item.file.size,
          output_size: null,
          status: "processing",
          tool_used: itemTool.id,
        });
        if (conversion) conversionId = conversion.id;
      }

      try {
        // Upload file to storage
        setProcessingFiles(prev => {
          const updated = new Map(prev);
          updated.set(item.id, { ...updated.get(item.id)!, progress: 20 });
          return updated;
        });

        const fileUrl = await uploadFileToStorage(item.file);
        
        setProcessingFiles(prev => {
          const updated = new Map(prev);
          updated.set(item.id, { ...updated.get(item.id)!, progress: 40 });
          return updated;
        });

        // Call the edge function for actual conversion
        const { data, error } = await supabase.functions.invoke("convert-file", {
          body: {
            fileUrl,
            fileName: item.file.name,
            conversionType: itemTool.conversionType,
            userEmail: sendEmailNotification && user?.email ? user.email : undefined,
            sendNotification: sendEmailNotification && !!user?.email,
          },
        });

        setProcessingFiles(prev => {
          const updated = new Map(prev);
          updated.set(item.id, { ...updated.get(item.id)!, progress: 80 });
          return updated;
        });

        if (error) throw error;
        
        if (!data.success) {
          throw new Error(data.error || "Conversion failed");
        }

        // Mark as completed with real output URL
        setProcessingFiles(prev => {
          const updated = new Map(prev);
          updated.set(item.id, { 
            ...updated.get(item.id)!, 
            status: "completed", 
            progress: 100,
            outputUrl: data.outputUrl,
            outputSize: data.outputSize,
          });
          return updated;
        });
        
        setBatchQueue(prev => prev.map(q => 
          q.id === item.id ? { ...q, status: "completed" as const } : q
        ));

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
        
        // Mark as failed
        setProcessingFiles(prev => {
          const updated = new Map(prev);
          updated.set(item.id, { 
            ...updated.get(item.id)!, 
            status: "failed", 
            progress: 0,
          });
          return updated;
        });
        
        setBatchQueue(prev => prev.map(q => 
          q.id === item.id ? { ...q, status: "failed" as const } : q
        ));

        // Update conversion record as failed
        if (conversionId) {
          await updateConversion(conversionId, {
            status: "failed",
          });
        }

        toast({
          title: "Conversion Failed",
          description: err instanceof Error ? err.message : "Unknown error occurred",
          variant: "destructive",
        });
      }
    }

    if (!pauseRef.current) {
      setIsProcessing(false);
      setCurrentQueueIndex(0);
      const successCount = Array.from(processingFiles.values()).filter(f => f.status === "completed").length;
      if (successCount > 0) {
        toast({
          title: "Processing Complete",
          description: `${successCount} file(s) processed successfully`,
        });
      }
    }
  };

  const togglePause = () => {
    pauseRef.current = !pauseRef.current;
    setIsPaused(!isPaused);
    if (pauseRef.current === false && isPaused) {
      // Resume processing
      processFiles();
    }
  };

  const downloadFile = (processingFile: ProcessingFile) => {
    if (!user) {
      setShowLoginDialog(true);
      return;
    }
    
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
    if (!user) {
      setShowLoginDialog(true);
      return;
    }
    
    processingFiles.forEach((pf) => {
      if (pf.status === "completed") {
        downloadFile(pf);
      }
    });
  };

  const handlePDFOrganizerSave = (blob: Blob) => {
    // Convert blob to file and add to processed files
    const file = new File([blob], `organized_${selectedPDFFile?.name || 'document.pdf'}`, { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    setProcessingFiles(prev => {
      const updated = new Map(prev);
      updated.set(file.name, {
        file,
        progress: 100,
        status: "completed",
        outputUrl: url,
        outputSize: blob.size,
      });
      return updated;
    });
    
    setShowPDFOrganizer(false);
    setSelectedPDFFile(null);
  };

  const handleMergeSplitSave = (results: { blob: Blob; name: string }[]) => {
    results.forEach(({ blob, name }) => {
      const url = URL.createObjectURL(blob);
      const file = new File([blob], name, { type: 'application/pdf' });
      
      setProcessingFiles(prev => {
        const updated = new Map(prev);
        updated.set(name, {
          file,
          progress: 100,
          status: "completed",
          outputUrl: url,
          outputSize: blob.size,
        });
        return updated;
      });
    });
    
    setShowMergeSplit(false);
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
            <div className="flex-1 overflow-auto">
              {files.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8">
                  No files yet
                </p>
              ) : (
                <div className="space-y-2">
                  {files.map((file, index) => {
                    const pf = processingFiles.get(file.name);
                    return (
                      <div
                        key={index}
                        className="group flex items-center gap-2 p-2 rounded-lg bg-background border border-border/50 hover:border-primary/30 transition-colors"
                      >
                        <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">{file.name}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-[10px] text-muted-foreground">{formatFileSize(file.size)}</p>
                            {pf && getStatusIcon(pf.status)}
                          </div>
                          {pf?.status === "processing" && (
                            <Progress value={pf.progress} className="h-1 mt-1" />
                          )}
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-opacity"
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Queue Button */}
            {batchQueue.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowQueue(!showQueue)}
                className="mt-4"
              >
                <ListOrdered className="h-4 w-4 mr-2" />
                Queue ({batchQueue.length})
              </Button>
            )}

            {/* Session Info */}
            <div className="pt-4 border-t border-border/50 mt-4">
              <p className="text-xs text-muted-foreground mb-2">Session</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{user ? 'Auto-saving enabled' : 'Temporary (sign in to save)'}</span>
              </div>
              {!user && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2 w-full justify-start text-xs"
                  onClick={() => navigate('/signin')}
                >
                  <LogIn className="h-3 w-3 mr-2" />
                  Sign in to save history
                </Button>
              )}
            </div>
          </aside>

          {/* Center - Canvas */}
          <main className="flex-1 flex flex-col p-4 md:p-6 overflow-auto">
            {/* Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`flex-1 rounded-xl border-2 border-dashed transition-all flex items-center justify-center bg-card/30 ${
                isDragging 
                  ? 'border-primary bg-primary/10 scale-[1.02]' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {isDragging ? (
                <div className="text-center max-w-md px-6 animate-fade-in">
                  <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6 animate-scale-in">
                    <CloudUpload className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-2">
                    Drop to upload
                  </h3>
                  <p className="text-muted-foreground">
                    Release to add files
                  </p>
                </div>
              ) : files.length === 0 ? (
                <div className="text-center max-w-md px-6">
                  <div className="w-16 md:w-20 h-16 md:h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <Upload className="h-8 md:h-10 w-8 md:w-10 text-primary" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                    Drop your PDF here
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
                    PDF, Word, Excel, PowerPoint, and images supported
                  </p>
                  <label>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileInput}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
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
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                    Processing...
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-4">
                    {completedCount} of {batchQueue.length} files completed
                  </p>
                  <Button variant="outline" onClick={togglePause}>
                    {isPaused ? <Play className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}
                    {isPaused ? 'Resume' : 'Pause'}
                  </Button>
                </div>
              ) : completedCount > 0 ? (
                <div className="text-center max-w-md px-6">
                  <div className="w-16 md:w-20 h-16 md:h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <CheckCircle className="h-8 md:h-10 w-8 md:w-10 text-primary" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                    Processing Complete!
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
                    {completedCount} file(s) ready for download
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={downloadAll}>
                      <Download className="h-4 w-4 mr-2" />
                      {user ? 'Download All' : 'Sign in to Download'}
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setProcessingFiles(new Map());
                      setBatchQueue([]);
                    }}>
                      Process More
                    </Button>
                  </div>
                  {!user && (
                    <p className="text-xs text-muted-foreground mt-4">
                      Sign in to download your converted files
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center max-w-md px-6">
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                    {files.length} file{files.length !== 1 ? 's' : ''} ready
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
                    Select a tool and start processing
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={processFiles} disabled={files.length === 0}>
                      <Play className="h-4 w-4 mr-2" />
                      Start Processing
                    </Button>
                    <label>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileInput}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                      />
                      <Button variant="outline" className="cursor-pointer" asChild>
                        <span>Add More Files</span>
                      </Button>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Email Notification Toggle */}
            {user && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <Switch
                  id="email-notification"
                  checked={sendEmailNotification}
                  onCheckedChange={setSendEmailNotification}
                />
                <Label htmlFor="email-notification" className="text-sm text-muted-foreground cursor-pointer">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email me when complete
                </Label>
              </div>
            )}
          </main>

          {/* Right Sidebar - Tools */}
          <aside className="w-72 border-l border-border/50 bg-card/50 p-4 hidden md:flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-foreground">PDF Tools</h3>
            </div>

            {/* Category Tabs */}
            <div className="mb-4 overflow-x-auto">
              <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                <TabsList className="flex flex-wrap h-auto gap-1 bg-transparent p-0">
                  {toolCategories.map(cat => (
                    <TabsTrigger 
                      key={cat.id} 
                      value={cat.id}
                      className="text-xs px-2 py-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      {cat.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Tool List */}
            <div className="flex-1 overflow-y-auto space-y-1">
              {filteredTools.map((tool) => {
                const Icon = tool.icon;
                const isActive = activeTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => handleToolSelect(tool.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent text-foreground"
                    }`}
                  >
                    <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? '' : 'text-muted-foreground'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{tool.label}</p>
                      <p className={`text-xs truncate ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {tool.description}
                      </p>
                    </div>
                    <ChevronRight className={`h-4 w-4 flex-shrink-0 ${isActive ? '' : 'text-muted-foreground'}`} />
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      </div>

      {/* Queue Panel */}
      {showQueue && (
        <QueuePanel
          queue={batchQueue}
          onReorder={reorderQueue}
          onRemove={removeFromQueue}
          onClear={clearQueue}
          onClose={() => setShowQueue(false)}
          onProcess={processFiles}
          isProcessing={isProcessing}
          isPaused={isPaused}
          onTogglePause={togglePause}
        />
      )}

      {/* PDF Page Organizer */}
      {showPDFOrganizer && selectedPDFFile && (
        <PDFPageOrganizer
          pdfFile={selectedPDFFile}
          onSave={handlePDFOrganizerSave}
          onClose={() => {
            setShowPDFOrganizer(false);
            setSelectedPDFFile(null);
          }}
        />
      )}

      {/* PDF Merge/Split */}
      {showMergeSplit && files.length > 0 && (
        <PDFMergeSplit
          files={files.filter(f => f.name.toLowerCase().endsWith('.pdf'))}
          mode={mergeSplitMode}
          onSave={handleMergeSplitSave}
          onClose={() => setShowMergeSplit(false)}
        />
      )}

      {/* Login Dialog for Download */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in to Download</DialogTitle>
            <DialogDescription>
              Create a free account or sign in to download your converted files and access your full conversion history.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button onClick={() => navigate('/signin')}>
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
            <Button variant="outline" onClick={() => setShowLoginDialog(false)}>
              Continue Editing
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </StudioLayout>
  );
};

export default DocumentStudio;
