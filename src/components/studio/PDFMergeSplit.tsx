import { useState, useEffect, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Layers, Scissors, Download, X, Save, 
  GripVertical, Trash2, Plus, FileText, Loader2, Upload
} from "lucide-react";
import { toast } from "sonner";

interface PDFMergeSplitProps {
  files: File[];
  mode: "merge" | "split";
  onSave: (blobs: { blob: Blob; name: string }[]) => void;
  onClose: () => void;
}

interface PDFFileItem {
  file: File;
  pageCount: number;
  thumbnails: string[];
}

export const PDFMergeSplit = ({ files, mode: initialMode, onSave, onClose }: PDFMergeSplitProps) => {
  const [mode, setMode] = useState<"merge" | "split">(initialMode);
  const [pdfFiles, setPdfFiles] = useState<PDFFileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Split options
  const [splitMode, setSplitMode] = useState<"all" | "range" | "extract">("all");
  const [pageRange, setPageRange] = useState("");
  const [extractPages, setExtractPages] = useState("");
  
  // Merge order
  const [mergeOrder, setMergeOrder] = useState<number[]>([]);

  // Load PDF files and get page counts
  useEffect(() => {
    const loadPDFs = async () => {
      setLoading(true);
      const loadedFiles: PDFFileItem[] = [];

      for (const file of files) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(arrayBuffer);
          const pageCount = pdfDoc.getPageCount();
          
          // Generate thumbnails using dynamic pdf.js import
          const thumbnails: string[] = [];
          try {
            const pdfjsLib = await import("pdfjs-dist");
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
            
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            
            // Get first page thumbnail only for performance
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 0.2 });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            
            if (context) {
              canvas.width = viewport.width;
              canvas.height = viewport.height;
              await page.render({ canvasContext: context, viewport }).promise;
              thumbnails.push(canvas.toDataURL("image/jpeg", 0.5));
            }
          } catch (e) {
            // Use placeholder if pdf.js fails
            thumbnails.push(`data:image/svg+xml,${encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="100" height="140" viewBox="0 0 100 140">
                <rect width="100" height="140" fill="#f3f4f6"/>
                <text x="50" y="70" text-anchor="middle" fill="#9ca3af" font-size="12">PDF</text>
              </svg>
            `)}`);
          }
          
          loadedFiles.push({ file, pageCount, thumbnails });
        } catch (err) {
          console.error("Error loading PDF:", file.name, err);
          toast.error(`Failed to load ${file.name}`);
        }
      }

      setPdfFiles(loadedFiles);
      setMergeOrder(loadedFiles.map((_, i) => i));
      setLoading(false);
    };

    loadPDFs();
  }, [files]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));
    
    if (dragIndex === dropIndex) return;
    
    setMergeOrder(prev => {
      const newOrder = [...prev];
      const [removed] = newOrder.splice(dragIndex, 1);
      newOrder.splice(dropIndex, 0, removed);
      return newOrder;
    });
  };

  const removeFile = (index: number) => {
    setPdfFiles(prev => prev.filter((_, i) => i !== index));
    setMergeOrder(prev => prev.filter(i => i !== index).map(i => i > index ? i - 1 : i));
  };

  // Add more files handler
  const handleAddFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const newFiles = Array.from(e.target.files).filter(f => f.name.toLowerCase().endsWith('.pdf'));
    if (newFiles.length === 0) {
      toast.error("Please select PDF files");
      return;
    }

    setLoading(true);
    const newLoadedFiles: PDFFileItem[] = [];

    for (const file of newFiles) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pageCount = pdfDoc.getPageCount();
        
        // Generate thumbnail
        const thumbnails: string[] = [];
        try {
          const pdfjsLib = await import("pdfjs-dist");
          pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
          
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: 0.2 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          
          if (context) {
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            await page.render({ canvasContext: context, viewport }).promise;
            thumbnails.push(canvas.toDataURL("image/jpeg", 0.5));
          }
        } catch {
          thumbnails.push(`data:image/svg+xml,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="140" viewBox="0 0 100 140">
              <rect width="100" height="140" fill="#f3f4f6"/>
              <text x="50" y="70" text-anchor="middle" fill="#9ca3af" font-size="12">PDF</text>
            </svg>
          `)}`);
        }
        
        newLoadedFiles.push({ file, pageCount, thumbnails });
      } catch (err) {
        console.error("Error loading PDF:", file.name, err);
        toast.error(`Failed to load ${file.name}`);
      }
    }

    setPdfFiles(prev => [...prev, ...newLoadedFiles]);
    setMergeOrder(prev => [...prev, ...newLoadedFiles.map((_, i) => prev.length + i)]);
    setLoading(false);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleMerge = async () => {
    if (pdfFiles.length < 2) {
      toast.error("Need at least 2 PDFs to merge");
      return;
    }

    setProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const orderIndex of mergeOrder) {
        const { file } = pdfFiles[orderIndex];
        const arrayBuffer = await file.arrayBuffer();
        const srcDoc = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      
      onSave([{ blob, name: "merged.pdf" }]);
      toast.success("PDFs merged successfully!");
    } catch (err) {
      console.error("Merge error:", err);
      toast.error("Failed to merge PDFs");
    } finally {
      setProcessing(false);
    }
  };

  const handleSplit = async () => {
    if (pdfFiles.length === 0) {
      toast.error("No PDF to split");
      return;
    }

    setProcessing(true);
    try {
      const { file, pageCount } = pdfFiles[0];
      const arrayBuffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(arrayBuffer);
      const results: { blob: Blob; name: string }[] = [];
      const baseName = file.name.replace(".pdf", "");

      if (splitMode === "all") {
        // Split into individual pages
        for (let i = 0; i < pageCount; i++) {
          const newDoc = await PDFDocument.create();
          const [copiedPage] = await newDoc.copyPages(srcDoc, [i]);
          newDoc.addPage(copiedPage);
          const pdfBytes = await newDoc.save();
          results.push({
            blob: new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }),
            name: `${baseName}_page_${i + 1}.pdf`,
          });
        }
      } else if (splitMode === "range") {
        // Split by page ranges (e.g., "1-3, 4-6, 7-10")
        const ranges = pageRange.split(",").map(r => r.trim());
        
        for (let rangeIdx = 0; rangeIdx < ranges.length; rangeIdx++) {
          const range = ranges[rangeIdx];
          const [startStr, endStr] = range.split("-");
          const start = parseInt(startStr) - 1;
          const end = endStr ? parseInt(endStr) - 1 : start;
          
          if (start < 0 || end >= pageCount || start > end) {
            toast.error(`Invalid range: ${range}`);
            continue;
          }

          const newDoc = await PDFDocument.create();
          const pageIndices = [];
          for (let i = start; i <= end; i++) {
            pageIndices.push(i);
          }
          const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
          copiedPages.forEach(page => newDoc.addPage(page));
          
          const pdfBytes = await newDoc.save();
          results.push({
            blob: new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }),
            name: `${baseName}_${range.replace("-", "_to_")}.pdf`,
          });
        }
      } else if (splitMode === "extract") {
        // Extract specific pages (e.g., "1, 3, 5, 7")
        const pageNumbers = extractPages.split(",").map(p => parseInt(p.trim()) - 1);
        const validPages = pageNumbers.filter(p => p >= 0 && p < pageCount);
        
        if (validPages.length === 0) {
          toast.error("No valid pages to extract");
          setProcessing(false);
          return;
        }

        const newDoc = await PDFDocument.create();
        const copiedPages = await newDoc.copyPages(srcDoc, validPages);
        copiedPages.forEach(page => newDoc.addPage(page));
        
        const pdfBytes = await newDoc.save();
        results.push({
          blob: new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }),
          name: `${baseName}_extracted.pdf`,
        });
      }

      if (results.length > 0) {
        onSave(results);
        toast.success(`Split into ${results.length} file(s)!`);
      }
    } catch (err) {
      console.error("Split error:", err);
      toast.error("Failed to split PDF");
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (mode === "merge") {
      await handleMerge();
    } else {
      await handleSplit();
    }
  };

  const totalPages = pdfFiles.reduce((sum, f) => sum + f.pageCount, 0);

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-foreground">
            {mode === "merge" ? "Merge PDFs" : "Split PDF"}
          </h2>
          <Tabs value={mode} onValueChange={(v) => setMode(v as "merge" | "split")}>
            <TabsList>
              <TabsTrigger value="merge" className="gap-2">
                <Layers className="h-4 w-4" />
                Merge
              </TabsTrigger>
              <TabsTrigger value="split" className="gap-2">
                <Scissors className="h-4 w-4" />
                Split
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleDownload} disabled={processing || loading}>
            {processing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            {mode === "merge" ? "Merge & Download" : "Split & Download"}
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Files List */}
        <div className="flex-1 p-6 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading PDF files...</p>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-full">
              {mode === "merge" ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-muted-foreground">
                      Drag to reorder. Files will be merged in this order.
                    </p>
                    <label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf"
                        onChange={handleAddFiles}
                        className="hidden"
                      />
                      <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                        <span>
                          <Plus className="h-4 w-4 mr-2" />
                          Add PDFs
                        </span>
                      </Button>
                    </label>
                  </div>
                  {mergeOrder.map((orderIdx, displayIdx) => {
                    const pdfFile = pdfFiles[orderIdx];
                    if (!pdfFile) return null;
                    
                    return (
                      <div
                        key={pdfFile.file.name + orderIdx}
                        draggable
                        onDragStart={(e) => handleDragStart(e, displayIdx)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, displayIdx)}
                        className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg cursor-move hover:border-primary/50"
                      >
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-shrink-0 w-16 h-20 bg-muted rounded overflow-hidden">
                          {pdfFile.thumbnails[0] && (
                            <img 
                              src={pdfFile.thumbnails[0]} 
                              alt="PDF preview"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{pdfFile.file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {pdfFile.pageCount} page{pdfFile.pageCount !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(orderIdx)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  {pdfFiles.length > 0 && (
                    <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg">
                      <FileText className="h-8 w-8 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">{pdfFiles[0].file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {pdfFiles[0].pageCount} page{pdfFiles[0].pageCount !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          )}
        </div>

        {/* Options Sidebar */}
        <aside className="w-80 border-l border-border bg-card p-6 overflow-y-auto">
          {mode === "merge" ? (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Merge Summary</h3>
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Files:</span>{" "}
                    <span className="font-medium">{pdfFiles.length}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Total pages:</span>{" "}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Instructions</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Drag files to reorder</li>
                  <li>• Click the trash icon to remove</li>
                  <li>• Files will be merged top to bottom</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Split Options</h3>
                <RadioGroup value={splitMode} onValueChange={(v) => setSplitMode(v as typeof splitMode)}>
                  <div className="flex items-center space-x-2 p-3 border border-border rounded-lg">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all" className="flex-1 cursor-pointer">
                      <span className="font-medium">Split all pages</span>
                      <p className="text-xs text-muted-foreground">Each page becomes a separate PDF</p>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 border border-border rounded-lg mt-2">
                    <RadioGroupItem value="range" id="range" />
                    <Label htmlFor="range" className="flex-1 cursor-pointer">
                      <span className="font-medium">Split by range</span>
                      <p className="text-xs text-muted-foreground">e.g., 1-3, 4-6, 7-10</p>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 border border-border rounded-lg mt-2">
                    <RadioGroupItem value="extract" id="extract" />
                    <Label htmlFor="extract" className="flex-1 cursor-pointer">
                      <span className="font-medium">Extract pages</span>
                      <p className="text-xs text-muted-foreground">e.g., 1, 3, 5, 7</p>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {splitMode === "range" && (
                <div>
                  <Label htmlFor="pageRange">Page Ranges</Label>
                  <Input
                    id="pageRange"
                    value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)}
                    placeholder="1-3, 4-6, 7-10"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Separate ranges with commas
                  </p>
                </div>
              )}

              {splitMode === "extract" && (
                <div>
                  <Label htmlFor="extractPages">Pages to Extract</Label>
                  <Input
                    id="extractPages"
                    value={extractPages}
                    onChange={(e) => setExtractPages(e.target.value)}
                    placeholder="1, 3, 5, 7"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Separate page numbers with commas
                  </p>
                </div>
              )}

              {pdfFiles.length > 0 && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Total pages:</span>{" "}
                    <span className="font-medium">{pdfFiles[0].pageCount}</span>
                  </p>
                </div>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
