"use client";

import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
// Import enhanced shadcn/ui components for better styling and accessibility
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"; // Added Dialog
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

import {
  FileText,
  Image as ImageIcon,
  Video as VideoIcon,
  Download,
  Trash2,
  Search,
  Folder,
  Clock,
  CalendarDays,
  Eye,
  Upload,
  Loader2,
  X,
  File,
} from "lucide-react";

type MediaFile = {
  id: string;
  file_name: string;
  file_path: string;
  category: string;
  file_type: string;
  uploaded_at: string;
};

const categories = ["exams", "graduation", "videos", "documents", "general"];
const BACKEND_URL = "http://localhost:5000";

const MediaDashboard: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // --- State Hooks ---
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<string>("general");
  const [isDragOver, setIsDragOver] = useState(false); // For Drag & Drop UX
  
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null); // Uses Dialog now

  const { toast } = useToast();

  // --- API INTEGRITY ---
  
  const buildFileUrl = (path: string) => {
    // Ensure the path is correctly prepended with the base URL
    if (!path) return "";
    return path.startsWith(BACKEND_URL) ? path : `${BACKEND_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/media`);
      if (!res.ok) throw new Error("Failed to fetch media.");
      const data = await res.json();
      setMediaFiles(data);
    } catch (err: any) {
      console.error("Error fetching media:", err);
      toast({
        title: "Fetch Error",
        description: err.message || "Unable to load media files.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async () => {
    if (!file)
      return toast({
        title: "No File Selected",
        description: "Please choose a file before uploading",
        variant: "destructive",
      });

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      // API INTEGRITY: Ensure the category field is correctly named and sent.
      formData.append("category", category); 

      const res = await fetch(`${BACKEND_URL}/api/media/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Upload failed: ${errorText}`);
      }

      toast({ title: "Upload Successful!", description: `${file.name} uploaded.` });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchMedia();
    } catch (err: any) {
      toast({
        title: "Upload failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this file permanently? This cannot be undone.")) return;

    try {
      // API INTEGRITY: Ensure the correct route and method are used.
      const res = await fetch(`${BACKEND_URL}/api/media/${id}`, { 
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete file on server.");

      toast({ title: "File deleted", description: "The file was successfully removed." });
      // Optimistic update for faster feedback
      setMediaFiles(prev => prev.filter(f => f.id !== id));
    } catch (err: any) {
      toast({
        title: "Delete failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  // --- Filtering & Sorting Logic (useMemo for performance) ---
  const filtered = useMemo(() => {
    return mediaFiles
      .filter((f) =>
        filter === "all" ? true : f.category.toLowerCase() === filter
      )
      .filter((f) => f.file_name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        const dateA = new Date(a.uploaded_at).getTime();
        const dateB = new Date(b.uploaded_at).getTime();
        
        if (sort === "latest") return dateB - dateA;
        if (sort === "oldest") return dateA - dateB;
        return 0; // Fallback
      });
  }, [mediaFiles, filter, search, sort]);

  // --- Utility for Visuals ---
  const iconForType = (type: string) => {
    if (type.startsWith("image")) return <ImageIcon className="w-8 h-8 text-indigo-600" />;
    if (type.startsWith("video")) return <VideoIcon className="w-8 h-8 text-red-600" />;
    if (type.includes("pdf")) return <FileText className="w-8 h-8 text-blue-600" />;
    return <File className="w-8 h-8 text-gray-600" />;
  };
  
  // --- Drag & Drop Handlers (Improved UX) ---
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const uploadedFile = e.dataTransfer.files?.[0];
    if (uploadedFile) {
        setFile(uploadedFile);
    }
  }, []);


  // --- Render ---
  return (
    <div className="max-w-7xl mx-auto py-10 space-y-10 px-4 sm:px-6 lg:px-8">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold text-gray-900">🗃️ COHAT Media Library</h1>
        <p className="text-gray-500 text-lg">
          Organize, store, preview, download, and manage all college digital assets.
        </p>
      </div>

      {/* Upload Section (Improved UX with Dropzone) */}
      <Card className="p-6 shadow-xl border-t-4 border-blue-600">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-600"/> Upload New File
          </CardTitle>
          <CardDescription>Select a file or use the drag-and-drop zone below.</CardDescription>
        </CardHeader>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
            
            {/* File Dropzone / Selector */}
            <div 
                className={`col-span-1 lg:col-span-2 border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer 
                    ${isDragOver ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-blue-400 bg-gray-50"}
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={(e) => setFile(e.target.files?.[0] || null)} 
                    className="hidden"
                    disabled={loading}
                />
                
                {file ? (
                    <div className="flex items-center justify-center space-x-2 text-green-700 font-medium">
                        <File className="w-5 h-5" />
                        <span>{file.name}</span>
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                ) : (
                    <p className="text-gray-500">
                        {isDragOver ? "Drop the file here!" : "Click or Drag & Drop file here"}
                    </p>
                )}
            </div>

            {/* Category Selector */}
            <div className="space-y-1">
                <Label htmlFor="category-select" className="text-sm">Category</Label>
                <Select onValueChange={setCategory} value={category} disabled={loading || !file}>
                    <SelectTrigger id="category-select" className="w-full">
                        <SelectValue placeholder="Choose category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((c) => (
                            <SelectItem key={c} value={c}>
                                {c.charAt(0).toUpperCase() + c.slice(1)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            
            {/* Upload Button */}
            <div className="space-y-1 self-end">
                <Button
                    onClick={handleUpload}
                    disabled={loading || !file}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white min-h-[40px] shadow-md"
                >
                    {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</> : "Upload File"}
                </Button>
            </div>
        </div>
      </Card>

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row justify-between gap-4 p-4 rounded-xl bg-gray-50 border">
        
        {/* Search */}
        <div className="flex gap-3 items-center w-full md:w-auto">
          <Search className="w-4 h-4 text-gray-500" />
          <Input
            placeholder={`Search ${filtered.length} files...`}
            className="w-full md:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters/Sort Group */}
        <div className="flex flex-wrap gap-3">
          <Select onValueChange={setFilter} value={filter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Filter Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setSort} value={sort}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest Upload</SelectItem>
              <SelectItem value="oldest">Oldest Upload</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Media Library Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading && filtered.length === 0 ? (
             <>
                {Array.from({ length: 8 }).map((_, i) => (
                    <Card key={i} className="h-48 bg-gray-200/50 rounded-xl animate-pulse shadow-sm" />
                ))}
             </>
        ) : filtered.length === 0 ? (
            <div className="col-span-full text-center py-10 border border-gray-200 rounded-lg bg-white">
                <p className="text-xl font-medium text-gray-700">No files found.</p>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or uploading a file.</p>
            </div>
        ) : (
          filtered.map((file) => (
            <Card
              key={file.id}
              className="shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
            >
              <CardContent className="p-0 flex flex-col h-full">
                
                {/* Visual Preview Area */}
                <div
                  className="relative h-40 flex flex-col justify-center items-center bg-gray-100/70 overflow-hidden cursor-pointer"
                  onClick={() => setPreviewFile(file)}
                >
                  {file.file_type.startsWith("image") ? (
                    // 
                    <img
                      src={buildFileUrl(file.file_path)}
                      alt={file.file_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="text-center p-4 space-y-2">
                        {iconForType(file.file_type)}
                        <span className="text-xs text-gray-500 block truncate w-24 mx-auto">{file.file_name.split('.').pop()?.toUpperCase()}</span>
                    </div>
                  )}

                  <div className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="w-4 h-4 text-blue-600" />
                  </div>
                </div>

                {/* Meta Info and Actions */}
                <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                  <p className="font-medium truncate text-gray-800" title={file.file_name}>{file.file_name}</p>

                  <div className="space-y-1">
                    <div className="text-xs text-blue-600 font-medium flex gap-1 items-center bg-blue-50 w-fit px-2 py-0.5 rounded">
                      <Folder className="w-3 h-3" /> {file.category.charAt(0).toUpperCase() + file.category.slice(1)}
                    </div>
                    <div className="text-xs text-gray-500 flex gap-1 items-center">
                      <CalendarDays className="w-3 h-3" /> {new Date(file.uploaded_at).toLocaleDateString()}
                      <Clock className="w-3 h-3 ml-2" /> {new Date(file.uploaded_at).toLocaleTimeString().replace(/:\d{2}\s/, ' ')}
                    </div>
                  </div>

                  <div className="flex justify-between pt-2 border-t mt-3">
                    <a href={buildFileUrl(file.file_path)} download target="_blank">
                      <Button variant="outline" size="sm" className="flex items-center gap-1 text-green-600 border-green-300 hover:bg-green-50/50">
                        <Download className="w-4 h-4" /> Download
                      </Button>
                    </a>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(file.id)}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Preview Dialog (Improved UX and Accessibility) */}
      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="max-w-4xl w-full p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="text-xl font-bold">{previewFile?.file_name}</DialogTitle>
          </DialogHeader>

          <div className="max-h-[80vh] overflow-y-auto p-4 flex items-center justify-center bg-gray-100">
            {previewFile && (
              <>
                {previewFile.file_type.startsWith("image") ? (
                  <img
                    src={buildFileUrl(previewFile.file_path)}
                    className="max-h-[70vh] object-contain"
                    alt="File Preview"
                  />
                ) : previewFile.file_type.startsWith("video") ? (
                  <video
                    src={buildFileUrl(previewFile.file_path)}
                    controls
                    className="max-h-[70vh] w-full"
                  />
                ) : (
                  // Using an iframe for document previews (like PDF)
                  <iframe
                    src={buildFileUrl(previewFile.file_path)}
                    className="w-full h-[70vh] border-0"
                    title="Document Preview"
                  />
                )}
              </>
            )}
          </div>
          <DialogFooter className="p-4 border-t">
              <Button onClick={() => setPreviewFile(null)} variant="outline">Close</Button>
              <a 
                href={buildFileUrl(previewFile?.file_path ?? "")} 
                download={previewFile?.file_name}
                target="_blank" 
                rel="noopener noreferrer"
              >
                  <Button className="bg-blue-600 hover:bg-blue-700">
                      <Download className="w-4 h-4 mr-2" /> Download File
                  </Button>
              </a>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaDashboard;