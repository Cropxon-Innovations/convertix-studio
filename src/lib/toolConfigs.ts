import { 
  Upload, Download, Sparkles, Settings, FileOutput,
  Layers, SplitSquareHorizontal, FileX, FileSearch, Minimize2, FileCheck, Type,
  FileImage, FileText, Presentation, FileSpreadsheet, Code,
  RotateCw, Hash, Droplet, Crop, PenTool, Unlock, Shield, Eye, GitCompare,
  Maximize2, ArrowUpCircle, Wand2, ImagePlus, Clapperboard
} from "lucide-react";

// Document tool configurations
export const documentToolConfigs: Record<string, {
  title: string;
  description: string;
  icon: typeof Layers;
  iconColor: string;
  bgColor: string;
  features: string[];
  acceptedFormats: string;
}> = {
  merge: {
    title: "Merge PDF Files",
    description: "Combine multiple PDF documents into a single file. Drag and drop to reorder pages and create your perfect document.",
    icon: Layers,
    iconColor: "text-orange-500",
    bgColor: "bg-orange-500/10",
    features: [
      "Combine unlimited PDF files",
      "Drag and drop to reorder",
      "Preview pages before merging",
      "Keep original formatting",
      "No file size limits",
      "Secure processing"
    ],
    acceptedFormats: "PDF files"
  },
  split: {
    title: "Split PDF Documents",
    description: "Separate your PDF into individual pages or extract specific page ranges into new files.",
    icon: SplitSquareHorizontal,
    iconColor: "text-orange-500",
    bgColor: "bg-orange-500/10",
    features: [
      "Split by page ranges",
      "Extract specific pages",
      "Create multiple PDFs",
      "Visual page selection",
      "Batch splitting",
      "Download as ZIP"
    ],
    acceptedFormats: "PDF files"
  },
  "remove-pages": {
    title: "Remove PDF Pages",
    description: "Delete unwanted pages from your PDF document with just a few clicks.",
    icon: FileX,
    iconColor: "text-orange-500",
    bgColor: "bg-orange-500/10",
    features: [
      "Select pages to remove",
      "Visual page preview",
      "Bulk page deletion",
      "Undo before saving",
      "Keep document quality",
      "Fast processing"
    ],
    acceptedFormats: "PDF files"
  },
  "extract-pages": {
    title: "Extract PDF Pages",
    description: "Extract specific pages from your PDF and save them as a new document.",
    icon: FileSearch,
    iconColor: "text-orange-500",
    bgColor: "bg-orange-500/10",
    features: [
      "Select any pages",
      "Create new PDF",
      "Visual selection",
      "Page range support",
      "Maintains quality",
      "Quick export"
    ],
    acceptedFormats: "PDF files"
  },
  organize: {
    title: "Organize PDF Pages",
    description: "Reorder, rotate, and organize pages in your PDF document with an intuitive drag-and-drop interface.",
    icon: Layers,
    iconColor: "text-orange-500",
    bgColor: "bg-orange-500/10",
    features: [
      "Drag to reorder pages",
      "Rotate any page",
      "Visual page thumbnails",
      "Delete unwanted pages",
      "Add new pages",
      "Undo/Redo support"
    ],
    acceptedFormats: "PDF files"
  },
  compress: {
    title: "Compress PDF",
    description: "Reduce your PDF file size while maintaining the best possible quality for sharing or uploading.",
    icon: Minimize2,
    iconColor: "text-red-500",
    bgColor: "bg-red-500/10",
    features: [
      "Reduce file size up to 90%",
      "Three compression levels",
      "Preserve text quality",
      "Optimize images",
      "Batch compression",
      "Compare before/after"
    ],
    acceptedFormats: "PDF files"
  },
  repair: {
    title: "Repair PDF",
    description: "Fix corrupted or damaged PDF files and recover your important documents.",
    icon: FileCheck,
    iconColor: "text-red-500",
    bgColor: "bg-red-500/10",
    features: [
      "Fix corrupted files",
      "Recover content",
      "Repair structure",
      "Validate PDF",
      "Multiple recovery modes",
      "High success rate"
    ],
    acceptedFormats: "PDF files"
  },
  ocr: {
    title: "OCR PDF",
    description: "Make scanned documents searchable by extracting text using Optical Character Recognition.",
    icon: Type,
    iconColor: "text-red-500",
    bgColor: "bg-red-500/10",
    features: [
      "Extract text from images",
      "Multiple language support",
      "Preserve layout",
      "Searchable output",
      "Copy-paste text",
      "High accuracy"
    ],
    acceptedFormats: "PDF files, scanned documents"
  },
  "jpg-to-pdf": {
    title: "JPG to PDF",
    description: "Convert your images to PDF format. Combine multiple images into a single PDF document.",
    icon: FileImage,
    iconColor: "text-amber-500",
    bgColor: "bg-amber-500/10",
    features: [
      "Convert any image",
      "Multiple images at once",
      "Custom page size",
      "Adjust margins",
      "Portrait/Landscape",
      "High quality output"
    ],
    acceptedFormats: "JPG, JPEG, PNG, GIF, BMP, TIFF, WebP"
  },
  "word-to-pdf": {
    title: "Word to PDF",
    description: "Convert Microsoft Word documents to PDF format while preserving formatting and layout.",
    icon: FileText,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-500/10",
    features: [
      "Preserve formatting",
      "Keep fonts & styles",
      "Maintain images",
      "Table support",
      "Headers & footers",
      "Fast conversion"
    ],
    acceptedFormats: "DOC, DOCX files"
  },
  "ppt-to-pdf": {
    title: "PowerPoint to PDF",
    description: "Convert presentations to PDF format with all slides, animations, and transitions preserved.",
    icon: Presentation,
    iconColor: "text-orange-600",
    bgColor: "bg-orange-600/10",
    features: [
      "All slides converted",
      "Animations preserved",
      "Speaker notes option",
      "Multiple per page",
      "High resolution",
      "Fast processing"
    ],
    acceptedFormats: "PPT, PPTX files"
  },
  "excel-to-pdf": {
    title: "Excel to PDF",
    description: "Convert spreadsheets to PDF format with proper formatting, formulas, and charts.",
    icon: FileSpreadsheet,
    iconColor: "text-green-600",
    bgColor: "bg-green-600/10",
    features: [
      "All sheets converted",
      "Charts preserved",
      "Formulas calculated",
      "Page breaks",
      "Print area support",
      "Column fit options"
    ],
    acceptedFormats: "XLS, XLSX files"
  },
  "html-to-pdf": {
    title: "HTML to PDF",
    description: "Convert web pages to PDF documents. Save any webpage as a PDF file.",
    icon: Code,
    iconColor: "text-purple-500",
    bgColor: "bg-purple-500/10",
    features: [
      "Full page capture",
      "CSS rendering",
      "Images included",
      "Custom page size",
      "Header/Footer",
      "Background option"
    ],
    acceptedFormats: "URL or HTML files"
  },
  "pdf-to-jpg": {
    title: "PDF to JPG",
    description: "Convert PDF pages to high-quality JPG images for easy sharing and editing.",
    icon: FileImage,
    iconColor: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    features: [
      "All pages to images",
      "Choose resolution",
      "Batch download",
      "ZIP export",
      "High quality output",
      "Fast conversion"
    ],
    acceptedFormats: "PDF files"
  },
  "pdf-to-word": {
    title: "PDF to Word",
    description: "Convert PDF documents to editable Word files while preserving formatting.",
    icon: FileText,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-500/10",
    features: [
      "Editable output",
      "Preserve formatting",
      "Extract tables",
      "Keep images",
      "Text recognition",
      "Layout retention"
    ],
    acceptedFormats: "PDF files"
  },
  "pdf-to-ppt": {
    title: "PDF to PowerPoint",
    description: "Convert PDF files to editable PowerPoint presentations.",
    icon: Presentation,
    iconColor: "text-orange-600",
    bgColor: "bg-orange-600/10",
    features: [
      "Each page as slide",
      "Editable text",
      "Preserve images",
      "Layout detection",
      "Fast conversion",
      "PPTX format"
    ],
    acceptedFormats: "PDF files"
  },
  "pdf-to-excel": {
    title: "PDF to Excel",
    description: "Extract tables from PDF and convert them to editable Excel spreadsheets.",
    icon: FileSpreadsheet,
    iconColor: "text-green-600",
    bgColor: "bg-green-600/10",
    features: [
      "Extract tables",
      "Preserve data",
      "Multiple sheets",
      "Column detection",
      "Cell formatting",
      "Fast processing"
    ],
    acceptedFormats: "PDF files"
  },
  rotate: {
    title: "Rotate PDF Pages",
    description: "Rotate pages in your PDF document. Rotate all pages or select specific pages to rotate.",
    icon: RotateCw,
    iconColor: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    features: [
      "Rotate 90°, 180°, 270°",
      "Select specific pages",
      "Rotate all pages",
      "Visual preview",
      "Quick rotation",
      "Undo support"
    ],
    acceptedFormats: "PDF files"
  },
  "add-page-numbers": {
    title: "Add Page Numbers",
    description: "Add page numbers to your PDF document with customizable position and format.",
    icon: Hash,
    iconColor: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    features: [
      "Custom position",
      "Choose format",
      "Start number option",
      "Font customization",
      "Skip pages option",
      "Preview before save"
    ],
    acceptedFormats: "PDF files"
  },
  "add-watermark": {
    title: "Add Watermark",
    description: "Add text or image watermarks to your PDF documents for protection or branding.",
    icon: Droplet,
    iconColor: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    features: [
      "Text watermarks",
      "Image watermarks",
      "Custom opacity",
      "Position control",
      "Rotation angle",
      "All pages or select"
    ],
    acceptedFormats: "PDF files"
  },
  crop: {
    title: "Crop PDF",
    description: "Crop margins and adjust the visible area of your PDF pages.",
    icon: Crop,
    iconColor: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    features: [
      "Visual crop tool",
      "Custom margins",
      "Preset sizes",
      "Apply to all pages",
      "Remove whitespace",
      "Preview changes"
    ],
    acceptedFormats: "PDF files"
  },
  "edit-pdf": {
    title: "Edit PDF",
    description: "Edit text and images directly in your PDF document with our visual editor.",
    icon: PenTool,
    iconColor: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    features: [
      "Edit text",
      "Add images",
      "Draw shapes",
      "Add annotations",
      "Highlight text",
      "Add signatures"
    ],
    acceptedFormats: "PDF files"
  },
  unlock: {
    title: "Unlock PDF",
    description: "Remove password protection from PDF files so you can edit, copy, and print freely.",
    icon: Unlock,
    iconColor: "text-violet-500",
    bgColor: "bg-violet-500/10",
    features: [
      "Remove restrictions",
      "Enable editing",
      "Enable printing",
      "Enable copying",
      "Fast processing",
      "Safe & secure"
    ],
    acceptedFormats: "Password-protected PDF files"
  },
  protect: {
    title: "Protect PDF",
    description: "Add password protection to your PDF files to control access and permissions.",
    icon: Shield,
    iconColor: "text-violet-500",
    bgColor: "bg-violet-500/10",
    features: [
      "Set open password",
      "Set edit password",
      "Restrict printing",
      "Restrict copying",
      "Encryption options",
      "Permission control"
    ],
    acceptedFormats: "PDF files"
  },
  sign: {
    title: "Sign PDF",
    description: "Add your digital signature to PDF documents quickly and easily.",
    icon: PenTool,
    iconColor: "text-violet-500",
    bgColor: "bg-violet-500/10",
    features: [
      "Draw signature",
      "Upload signature",
      "Type signature",
      "Position anywhere",
      "Multiple signatures",
      "Save for reuse"
    ],
    acceptedFormats: "PDF files"
  },
  redact: {
    title: "Redact PDF",
    description: "Permanently remove sensitive information from your PDF documents.",
    icon: Eye,
    iconColor: "text-violet-500",
    bgColor: "bg-violet-500/10",
    features: [
      "Black out text",
      "Remove images",
      "Permanent removal",
      "Search & redact",
      "Visual tool",
      "Irreversible"
    ],
    acceptedFormats: "PDF files"
  },
  compare: {
    title: "Compare PDF",
    description: "Compare two PDF documents side by side and highlight the differences.",
    icon: GitCompare,
    iconColor: "text-violet-500",
    bgColor: "bg-violet-500/10",
    features: [
      "Side by side view",
      "Highlight changes",
      "Text comparison",
      "Visual diff",
      "Export report",
      "Easy navigation"
    ],
    acceptedFormats: "PDF files"
  },
};

// Image tool configurations
export const imageToolConfigs: Record<string, {
  title: string;
  description: string;
  icon: typeof Minimize2;
  iconColor: string;
  bgColor: string;
  features: string[];
  acceptedFormats: string;
}> = {
  compress: {
    title: "Compress Images",
    description: "Reduce image file size while maintaining quality. Perfect for web and email.",
    icon: Minimize2,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-500/10",
    features: [
      "Up to 90% size reduction",
      "Quality preservation",
      "Batch compression",
      "Multiple formats",
      "Smart optimization",
      "Fast processing"
    ],
    acceptedFormats: "JPG, PNG, GIF, WebP"
  },
  resize: {
    title: "Resize Images",
    description: "Change image dimensions by percentage or exact pixels while maintaining aspect ratio.",
    icon: Maximize2,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-500/10",
    features: [
      "Resize by percentage",
      "Exact pixel dimensions",
      "Maintain aspect ratio",
      "Batch resizing",
      "Multiple presets",
      "High quality output"
    ],
    acceptedFormats: "JPG, PNG, GIF, WebP, BMP"
  },
  upscale: {
    title: "AI Image Upscaler",
    description: "Enlarge images up to 4x using AI technology while enhancing quality and details.",
    icon: ArrowUpCircle,
    iconColor: "text-purple-500",
    bgColor: "bg-purple-500/10",
    features: [
      "2x, 4x upscaling",
      "AI enhancement",
      "Detail preservation",
      "Noise reduction",
      "Face enhancement",
      "Fast processing"
    ],
    acceptedFormats: "JPG, PNG, WebP"
  },
  crop: {
    title: "Crop Images",
    description: "Crop images to custom dimensions or use preset aspect ratios for social media.",
    icon: Crop,
    iconColor: "text-teal-500",
    bgColor: "bg-teal-500/10",
    features: [
      "Freeform crop",
      "Aspect ratio presets",
      "Social media sizes",
      "Visual editor",
      "Batch cropping",
      "Precise control"
    ],
    acceptedFormats: "JPG, PNG, GIF, WebP, BMP"
  },
  rotate: {
    title: "Rotate Images",
    description: "Rotate images at any angle. Flip horizontally or vertically with one click.",
    icon: RotateCw,
    iconColor: "text-teal-500",
    bgColor: "bg-teal-500/10",
    features: [
      "Rotate any angle",
      "90° quick rotate",
      "Flip horizontal",
      "Flip vertical",
      "Batch rotation",
      "Visual preview"
    ],
    acceptedFormats: "JPG, PNG, GIF, WebP, BMP"
  },
  "remove-bg": {
    title: "Remove Background",
    description: "Automatically remove image backgrounds using AI. Get transparent PNGs in seconds.",
    icon: Wand2,
    iconColor: "text-pink-500",
    bgColor: "bg-pink-500/10",
    features: [
      "AI-powered removal",
      "Automatic detection",
      "Transparent output",
      "Edge refinement",
      "Batch processing",
      "High accuracy"
    ],
    acceptedFormats: "JPG, PNG, WebP"
  },
  watermark: {
    title: "Add Watermark",
    description: "Add text or image watermarks to protect your images or add branding.",
    icon: Droplet,
    iconColor: "text-teal-500",
    bgColor: "bg-teal-500/10",
    features: [
      "Text watermarks",
      "Image watermarks",
      "Custom position",
      "Opacity control",
      "Batch apply",
      "Font options"
    ],
    acceptedFormats: "JPG, PNG, GIF, WebP, BMP"
  },
  "blur-face": {
    title: "Blur Faces",
    description: "Automatically detect and blur faces in images for privacy protection.",
    icon: Eye,
    iconColor: "text-teal-500",
    bgColor: "bg-teal-500/10",
    features: [
      "Auto face detection",
      "Adjustable blur",
      "Select faces",
      "Batch processing",
      "Privacy protection",
      "Fast processing"
    ],
    acceptedFormats: "JPG, PNG, WebP"
  },
  "photo-editor": {
    title: "Photo Editor",
    description: "Full-featured photo editor with filters, effects, text, stickers, and frames.",
    icon: Sparkles,
    iconColor: "text-purple-500",
    bgColor: "bg-purple-500/10",
    features: [
      "Filters & effects",
      "Text overlay",
      "Stickers & shapes",
      "Frames & borders",
      "Adjust colors",
      "Draw & paint"
    ],
    acceptedFormats: "JPG, PNG, GIF, WebP, BMP"
  },
  "to-jpg": {
    title: "Convert to JPG",
    description: "Convert any image format to JPG. Perfect for compatibility and smaller file sizes.",
    icon: FileImage,
    iconColor: "text-amber-500",
    bgColor: "bg-amber-500/10",
    features: [
      "Any format to JPG",
      "Quality control",
      "Batch conversion",
      "Fast processing",
      "Small file size",
      "Wide compatibility"
    ],
    acceptedFormats: "PNG, GIF, BMP, TIFF, WebP, SVG"
  },
  "from-jpg": {
    title: "Convert from JPG",
    description: "Convert JPG images to other formats like PNG, GIF, or WebP.",
    icon: FileImage,
    iconColor: "text-amber-500",
    bgColor: "bg-amber-500/10",
    features: [
      "JPG to PNG",
      "JPG to WebP",
      "JPG to GIF",
      "Batch conversion",
      "Quality options",
      "Fast processing"
    ],
    acceptedFormats: "JPG, JPEG files"
  },
  "to-png": {
    title: "Convert to PNG",
    description: "Convert images to PNG format with transparency support.",
    icon: FileImage,
    iconColor: "text-blue-400",
    bgColor: "bg-blue-400/10",
    features: [
      "Transparency support",
      "Lossless quality",
      "Any format to PNG",
      "Batch conversion",
      "Alpha channel",
      "Fast processing"
    ],
    acceptedFormats: "JPG, GIF, BMP, TIFF, WebP, SVG"
  },
  "to-webp": {
    title: "Convert to WebP",
    description: "Convert images to WebP format for optimized web performance.",
    icon: FileImage,
    iconColor: "text-green-500",
    bgColor: "bg-green-500/10",
    features: [
      "Best web format",
      "Smaller file size",
      "Quality control",
      "Transparency support",
      "Batch conversion",
      "Fast loading"
    ],
    acceptedFormats: "JPG, PNG, GIF, BMP, TIFF"
  },
  "html-to-image": {
    title: "HTML to Image",
    description: "Capture screenshots of web pages and save them as images.",
    icon: Code,
    iconColor: "text-purple-500",
    bgColor: "bg-purple-500/10",
    features: [
      "Full page capture",
      "Custom viewport",
      "PNG/JPG output",
      "High resolution",
      "CSS rendering",
      "Fast capture"
    ],
    acceptedFormats: "URL or HTML"
  },
  meme: {
    title: "Meme Generator",
    description: "Create funny memes with custom text and popular templates.",
    icon: ImagePlus,
    iconColor: "text-orange-500",
    bgColor: "bg-orange-500/10",
    features: [
      "Popular templates",
      "Custom images",
      "Top/bottom text",
      "Font options",
      "Easy sharing",
      "High quality"
    ],
    acceptedFormats: "JPG, PNG, GIF, WebP"
  },
  batch: {
    title: "Batch Process",
    description: "Apply the same edits to multiple images at once. Save time with batch processing.",
    icon: Clapperboard,
    iconColor: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    features: [
      "Process multiple images",
      "Same settings for all",
      "Progress tracking",
      "Resize all",
      "Convert all",
      "Download as ZIP"
    ],
    acceptedFormats: "JPG, PNG, GIF, WebP, BMP"
  },
};

// Common steps for all tools
export const getDefaultSteps = (toolType: "document" | "image") => [
  {
    number: 1,
    title: "Upload Files",
    description: toolType === "document" 
      ? "Drag and drop your PDF files or click to browse"
      : "Drag and drop your images or click to browse",
    icon: Upload,
  },
  {
    number: 2,
    title: "Choose Options",
    description: "Select your preferred settings and options for processing",
    icon: Settings,
  },
  {
    number: 3,
    title: "Download",
    description: "Get your processed files instantly. No registration required.",
    icon: Download,
  },
];
