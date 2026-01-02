import { Button } from "@/components/ui/button";
import { 
  X, GripVertical, ArrowUp, ArrowDown, Play, Pause, Trash2, 
  FileText, Image, Loader2, CheckCircle, Clock
} from "lucide-react";

interface QueueItem {
  id: string;
  file: File;
  toolId: string;
  status: "queued" | "processing" | "completed" | "failed";
}

interface QueuePanelProps {
  queue: QueueItem[];
  isProcessing: boolean;
  isPaused: boolean;
  onRemove: (id: string) => void;
  onClear: () => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onProcess: () => void;
  onTogglePause: () => void;
  onClose: () => void;
}

const getToolLabel = (toolId: string) => {
  const labels: Record<string, string> = {
    convert: "Convert",
    compress: "Compress",
    ocr: "OCR",
    merge: "Merge",
  };
  return labels[toolId] || toolId;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export const QueuePanel = ({
  queue,
  isProcessing,
  isPaused,
  onRemove,
  onClear,
  onReorder,
  onProcess,
  onTogglePause,
  onClose,
}: QueuePanelProps) => {
  const queuedCount = queue.filter(q => q.status === "queued").length;
  const completedCount = queue.filter(q => q.status === "completed").length;
  const processingItem = queue.find(q => q.status === "processing");

  const moveUp = (index: number) => {
    if (index > 0) {
      onReorder(index, index - 1);
    }
  };

  const moveDown = (index: number) => {
    if (index < queue.length - 1) {
      onReorder(index, index + 1);
    }
  };

  const getStatusIcon = (status: QueueItem["status"]) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-primary" />;
      case "processing": return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
      case "failed": return <X className="h-4 w-4 text-destructive" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) {
      return <Image className="h-4 w-4 text-primary" />;
    }
    return <FileText className="h-4 w-4 text-primary" />;
  };

  return (
    <div className="fixed inset-y-0 right-0 w-80 md:w-96 bg-card border-l border-border shadow-2xl z-50 flex flex-col animate-slide-in-right">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">Processing Queue</h3>
          <p className="text-xs text-muted-foreground">
            {queuedCount} pending • {completedCount} completed
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Queue List */}
      <div className="flex-1 overflow-auto p-4 space-y-2">
        {queue.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Queue is empty</p>
            <p className="text-xs mt-1">Add files to start processing</p>
          </div>
        ) : (
          queue.map((item, index) => (
            <div
              key={item.id}
              className={`group flex items-center gap-2 p-3 rounded-lg border transition-all duration-200 ${
                item.status === "processing" 
                  ? "bg-primary/5 border-primary/30" 
                  : item.status === "completed"
                    ? "bg-primary/5 border-primary/20"
                    : "bg-card border-border hover:border-primary/30"
              }`}
            >
              {/* Drag Handle */}
              <div className="cursor-move opacity-50 hover:opacity-100 transition-opacity">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>

              {/* File Icon */}
              {getFileIcon(item.file.name)}

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {item.file.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatFileSize(item.file.size)}</span>
                  <span>•</span>
                  <span className="text-primary">{getToolLabel(item.toolId)}</span>
                </div>
              </div>

              {/* Status Icon */}
              {getStatusIcon(item.status)}

              {/* Priority Controls */}
              {item.status === "queued" && !isProcessing && (
                <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-0.5 hover:bg-accent rounded disabled:opacity-30"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === queue.length - 1}
                    className="p-0.5 hover:bg-accent rounded disabled:opacity-30"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </button>
                </div>
              )}

              {/* Remove Button */}
              {item.status === "queued" && !isProcessing && (
                <button
                  onClick={() => onRemove(item.id)}
                  className="p-1.5 hover:bg-destructive/10 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border space-y-3">
        {/* Progress Summary */}
        {isProcessing && processingItem && (
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 text-primary animate-spin" />
              <span className="text-foreground">Processing: </span>
              <span className="text-primary truncate">{processingItem.file.name}</span>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {isProcessing ? (
            <Button
              variant="outline"
              className="flex-1"
              onClick={onTogglePause}
            >
              {isPaused ? (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </>
              )}
            </Button>
          ) : (
            <Button
              className="flex-1"
              onClick={onProcess}
              disabled={queuedCount === 0}
            >
              <Play className="mr-2 h-4 w-4" />
              Process Queue ({queuedCount})
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={onClear}
            disabled={queue.length === 0 || isProcessing}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
