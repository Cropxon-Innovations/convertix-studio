import { useState, useEffect } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Trash2, RotateCw, Download, X, Save, GripVertical,
  ChevronLeft, ZoomIn, ZoomOut, Loader2
} from "lucide-react";
import { toast } from "sonner";

// Set up pdf.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface PDFPage {
  index: number;
  rotation: number;
  thumbnail?: string;
  deleted: boolean;
}

interface PDFPageOrganizerProps {
  pdfFile: File;
  onSave: (pdfBlob: Blob) => void;
  onClose: () => void;
}

export const PDFPageOrganizer = ({ pdfFile, onSave, onClose }: PDFPageOrganizerProps) => {
  const [pages, setPages] = useState<PDFPage[]>([]);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [thumbnailsLoading, setThumbnailsLoading] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [thumbnailScale, setThumbnailScale] = useState(1);

  // Load PDF and generate thumbnails with pdf.js
  useEffect(() => {
    const loadPDF = async () => {
      try {
        const arrayBuffer = await pdfFile.arrayBuffer();
        
        // Load with pdf-lib for manipulation
        const doc = await PDFDocument.load(arrayBuffer);
        setPdfDoc(doc);

        const pageCount = doc.getPageCount();
        const newPages: PDFPage[] = [];

        for (let i = 0; i < pageCount; i++) {
          newPages.push({
            index: i,
            rotation: 0,
            deleted: false,
          });
        }

        setPages(newPages);
        setLoading(false);

        // Generate real thumbnails using pdf.js
        await generateRealThumbnails(arrayBuffer, pageCount);
      } catch (err) {
        console.error("Error loading PDF:", err);
        toast.error("Failed to load PDF");
        setLoading(false);
        setThumbnailsLoading(false);
      }
    };

    loadPDF();
  }, [pdfFile]);

  const generateRealThumbnails = async (arrayBuffer: ArrayBuffer, pageCount: number) => {
    try {
      // Load PDF with pdf.js
      const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      const thumbnails: string[] = [];
      
      for (let i = 1; i <= pageCount; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 0.3 }); // Small scale for thumbnails
        
        // Create canvas for rendering
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        
        if (!context) continue;
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        // Render page to canvas
        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;
        
        // Convert to data URL
        const thumbnail = canvas.toDataURL("image/jpeg", 0.7);
        thumbnails.push(thumbnail);
        
        // Update pages with thumbnail as we go
        setPages(prev => prev.map((p, idx) => 
          idx === i - 1 ? { ...p, thumbnail } : p
        ));
      }
      
      setThumbnailsLoading(false);
    } catch (err) {
      console.error("Error generating thumbnails:", err);
      setThumbnailsLoading(false);
      // Fall back to placeholder thumbnails
      setPages(prev => prev.map((page, i) => ({
        ...page,
        thumbnail: `data:image/svg+xml,${encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="150" height="200" viewBox="0 0 150 200">
            <rect width="150" height="200" fill="#f3f4f6" stroke="#e5e7eb" stroke-width="1"/>
            <text x="75" y="100" text-anchor="middle" fill="#9ca3af" font-size="24" font-family="Arial">
              ${i + 1}
            </text>
          </svg>
        `)}`,
      })));
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    setPages(prev => {
      const newPages = [...prev];
      const [draggedPage] = newPages.splice(draggedIndex, 1);
      newPages.splice(dropIndex, 0, draggedPage);
      return newPages;
    });

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const rotatePage = (index: number) => {
    setPages(prev => prev.map((page, i) => 
      i === index ? { ...page, rotation: (page.rotation + 90) % 360 } : page
    ));
  };

  const deletePage = (index: number) => {
    setPages(prev => prev.map((page, i) =>
      i === index ? { ...page, deleted: !page.deleted } : page
    ));
  };

  const toggleSelectPage = (index: number) => {
    setSelectedPages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const deleteSelected = () => {
    setPages(prev => prev.map((page, i) =>
      selectedPages.has(i) ? { ...page, deleted: true } : page
    ));
    setSelectedPages(new Set());
  };

  const rotateSelected = () => {
    setPages(prev => prev.map((page, i) =>
      selectedPages.has(i) ? { ...page, rotation: (page.rotation + 90) % 360 } : page
    ));
  };

  const handleSave = async () => {
    if (!pdfDoc) return;

    try {
      // Create new PDF with reordered pages
      const newDoc = await PDFDocument.create();
      const arrayBuffer = await pdfFile.arrayBuffer();
      const srcDoc = await PDFDocument.load(arrayBuffer);

      for (const page of pages) {
        if (page.deleted) continue;

        const [copiedPage] = await newDoc.copyPages(srcDoc, [page.index]);
        
        if (page.rotation !== 0) {
          copiedPage.setRotation(degrees(page.rotation));
        }
        
        newDoc.addPage(copiedPage);
      }

      const pdfBytes = await newDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      onSave(blob);
      toast.success("PDF saved successfully!");
    } catch (err) {
      console.error("Error saving PDF:", err);
      toast.error("Failed to save PDF");
    }
  };

  const handleDownload = async () => {
    if (!pdfDoc) return;

    try {
      const newDoc = await PDFDocument.create();
      const arrayBuffer = await pdfFile.arrayBuffer();
      const srcDoc = await PDFDocument.load(arrayBuffer);

      for (const page of pages) {
        if (page.deleted) continue;

        const [copiedPage] = await newDoc.copyPages(srcDoc, [page.index]);
        
        if (page.rotation !== 0) {
          copiedPage.setRotation(degrees(page.rotation));
        }
        
        newDoc.addPage(copiedPage);
      }

      const pdfBytes = await newDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `organized_${pdfFile.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      
      toast.success("PDF downloaded!");
    } catch (err) {
      console.error("Error downloading PDF:", err);
      toast.error("Failed to download PDF");
    }
  };

  const activePages = pages.filter(p => !p.deleted);
  const deletedPages = pages.filter(p => p.deleted);

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h2 className="text-lg font-semibold text-foreground">PDF Page Organizer</h2>
          <p className="text-sm text-muted-foreground">
            {activePages.length} pages • Drag to reorder
            {thumbnailsLoading && " • Loading thumbnails..."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setThumbnailScale(s => Math.max(0.5, s - 0.25))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setThumbnailScale(s => Math.min(2, s + 0.25))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          {selectedPages.size > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={rotateSelected}>
                <RotateCw className="h-4 w-4 mr-2" />
                Rotate ({selectedPages.size})
              </Button>
              <Button variant="outline" size="sm" onClick={deleteSelected}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete ({selectedPages.size})
              </Button>
            </>
          )}
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

      {/* Pages Grid */}
      <ScrollArea className="flex-1 p-6">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading PDF pages...</p>
            </div>
          </div>
        ) : (
          <div 
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(auto-fill, minmax(${150 * thumbnailScale}px, 1fr))`,
            }}
          >
            {pages.map((page, index) => (
              <div
                key={`${page.index}-${index}`}
                draggable={!page.deleted}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                onClick={() => toggleSelectPage(index)}
                className={`
                  relative group cursor-pointer rounded-lg border-2 transition-all
                  ${page.deleted ? "opacity-40 grayscale" : ""}
                  ${draggedIndex === index ? "opacity-50 scale-95" : ""}
                  ${dragOverIndex === index ? "border-primary border-dashed" : "border-border"}
                  ${selectedPages.has(index) ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}
                  hover:border-primary/50
                `}
                style={{ aspectRatio: "3/4" }}
              >
                {/* Drag Handle */}
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>

                {/* Page Number Badge */}
                <div className="absolute top-2 right-2 bg-background/90 rounded px-2 py-0.5 text-xs font-medium z-10">
                  {index + 1}
                </div>

                {/* Thumbnail */}
                <div 
                  className="w-full h-full flex items-center justify-center bg-muted rounded-lg overflow-hidden"
                  style={{ transform: `rotate(${page.rotation}deg)` }}
                >
                  {page.thumbnail ? (
                    <img 
                      src={page.thumbnail} 
                      alt={`Page ${page.index + 1}`}
                      className="max-w-full max-h-full object-contain"
                      draggable={false}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
                      <span className="text-sm text-muted-foreground">Loading...</span>
                    </div>
                  )}
                </div>

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      rotatePage(index);
                    }}
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={page.deleted ? "default" : "destructive"}
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePage(index);
                    }}
                  >
                    {page.deleted ? <ChevronLeft className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                  </Button>
                </div>

                {/* Deleted Overlay */}
                {page.deleted && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-medium text-destructive">Deleted</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Original: {pages.length} pages • Active: {activePages.length} pages
            {deletedPages.length > 0 && ` • Deleted: ${deletedPages.length} pages`}
          </p>
          <p className="text-sm text-muted-foreground">
            Drag pages to reorder • Click to select • Shift+Click for multiple
          </p>
        </div>
      </div>
    </div>
  );
};
