"use client";

import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
// Import shadcn/ui components for better styling and accessibility
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

import {
  FileText,
  Image as ImageIcon,
  Video as VideoIcon,
  Download,
  Trash2,
  Eye,
  Search,
  CalendarDays,
  Clock,
  Filter,
  Edit3,
  Upload,
  Loader2,
  ChevronDown,
} from "lucide-react";

/**
 * ExamsMediaDashboard
 * API ROUTES (UNCHANGED):
 * GET    /api/media/category/exams
 * POST   /api/media/upload
 * DELETE /api/media/:id
 * PUT    /api/media/rename/:id
 */

type MediaFile = {
  id: string;
  file_name: string;
  file_path: string;
  category: string;
  file_type: string;
  uploaded_at: string;
  uploaded_by?: string;
};

// =========================================================================
// CUSTOM COMPONENT: FileCard for Rename Functionality (UX Improvement)
// =========================================================================

const FileCard = ({
  file,
  CATEGORIES,
  typeIcon,
  buildFileUrl,
  openRename,
  handleDelete,
  setPreviewFile,
  renameFileId,
  renameValue,
  renameExt,
  setRenameValue,
  handleRename,
  setRenameFileId,
  renameInputRef
}: any) => {
  const isImage = file.file_type.startsWith("image");
  const isVideo = file.file_type.startsWith("video");
  const url = buildFileUrl(file.file_path);
  const isRenaming = renameFileId === file.id;

  return (
    <Card
      key={file.id}
      className="overflow-hidden bg-white/70 backdrop-blur-sm hover:shadow-xl transition rounded-xl flex flex-col"
    >
      <div
        className="h-40 cursor-pointer bg-slate-100 flex items-center justify-center overflow-hidden relative"
        onClick={() => setPreviewFile(file)}
      >
        {isImage ? (
          //  - Strategic Image Tag
          <img
            src={url}
            alt={file.file_name}
            className="object-cover w-full h-full"
          />
        ) : isVideo ? (
          <video src={url} className="w-full h-full object-cover pointer-events-none" />
        ) : (
          <div className="text-center p-4">
            {typeIcon(file.file_type)}
            <p className="text-sm text-slate-500 mt-2 truncate">{file.file_name.split('.').pop()?.toUpperCase()} File</p>
          </div>
        )}
        <div className="absolute top-2 right-2 p-1 bg-white/80 rounded-full shadow-md">
            <Eye className="w-4 h-4 text-slate-600" />
        </div>
      </div>

      <CardContent className="p-3 flex flex-col flex-grow">
        {isRenaming ? (
            <div className="space-y-2">
                <Label htmlFor="rename-input" className="text-xs font-semibold">Renaming...</Label>
                <Input
                    id="rename-input"
                    ref={renameInputRef}
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                    className="h-8 pr-12 text-sm"
                />
                <div className="flex justify-end gap-2 text-xs">
                    <span className="text-slate-500 self-center">.{renameExt}</span>
                    <Button size="xs" variant="ghost" onClick={() => setRenameFileId(null)} className="h-6">Cancel</Button>
                    <Button size="xs" onClick={handleRename} className="h-6">Save</Button>
                </div>
            </div>
        ) : (
            <>
                <div className="text-sm font-medium truncate mb-1" title={file.file_name}>
                    {file.file_name}
                </div>

                <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                    <CalendarDays className="w-3 h-3" />
                    {new Date(file.uploaded_at).toLocaleDateString()}
                    <Clock className="w-3 h-3 ml-2" />
                    {new Date(file.uploaded_at).toLocaleTimeString().replace(/:\d{2}\s/, ' ')}
                </div>

                <div className="text-xs text-indigo-700 font-medium mt-2 mb-3 bg-indigo-50 px-2 py-0.5 rounded w-fit">
                    {CATEGORIES.find((c: any) => c.key === file.category)?.label || file.category}
                </div>

                <div className="flex justify-between items-center mt-auto border-t pt-2">
                    <Button size="icon" variant="outline" className="w-8 h-8 hover:bg-green-500/10" title="Download">
                        <a href={url} target="_blank" rel="noreferrer" download={file.file_name}>
                            <Download className="w-4 h-4 text-green-600" />
                        </a>
                    </Button>

                    <Button
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8 hover:bg-blue-500/10"
                        onClick={() => openRename(file)}
                        title="Rename"
                    >
                        <Edit3 className="w-4 h-4 text-blue-600" />
                    </Button>

                    <Button
                        size="icon"
                        variant="destructive"
                        className="w-8 h-8"
                        onClick={() => handleDelete(file.id)}
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </>
        )}
      </CardContent>
    </Card>
  );
};

// =========================================================================
// MAIN COMPONENT
// =========================================================================

export default function ExamsMediaDashboard() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // --- State Hooks ---
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState("exams");
  const [isDragOver, setIsDragOver] = useState(false); // New state for D&D UX

  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [fetching, setFetching] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"latest" | "oldest" | "az" | "za">("latest");
  const [filterCategory, setFilterCategory] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null); // Uses Dialog now

  const [renameFileId, setRenameFileId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [renameExt, setRenameExt] = useState("");
  const renameInputRef = useRef<HTMLInputElement | null>(null);

  const CATEGORIES = useMemo(() => [
    { key: "exams", label: "Exams (General)" },
    { key: "upgrade-1-exams", label: "Upgrade 1 Exams" },
    { key: "upgrade-2-exams", label: "Upgrade 2 Exams" },
    { key: "upgrade-3-exams", label: "Upgrade 3 Exams" },
    { key: "assignments", label: "Assignments" },
    { key: "revision", label: "Revision" },
  ], []);

  const buildFileUrl = (path: string) => {
    // Assuming backend serves files from /uploads
    const base = 'http://localhost:5000'; // Replace with actual backend base URL if needed
    if (!path) return "";
    return path.startsWith(base) ? path : `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  // ============================
  // UPLOAD HANDLERS (Drag & Drop UX)
  // ============================

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
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] ?? null);
  };

  const handleUpload = async () => {
    if (!selectedFile)
      return toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });

    setLoadingUpload(true);
    try {
      const fd = new FormData();
      fd.append("file", selectedFile);
      fd.append("category", uploadCategory);

      const res = await fetch(`/api/media/upload`, { method: "POST", body: fd });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Upload failed");
      }

      toast({ title: "Uploaded successfully", description: `${selectedFile.name} is now available.` });
      await fetchExams(); // Re-fetch to update the list
      
      // Reset upload state
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = ""; 
    } catch (err: any) {
      toast({ 
        title: "Upload failed", 
        description: err.message || "An unknown error occurred during upload.", 
        variant: "destructive" 
      });
    } finally {
      setLoadingUpload(false);
    }
  };

  // ============================
  // FETCH EXAMS (API INTEGRITY)
  // ============================

  const fetchExams = async () => {
    setFetching(true);
    try {
      // API Route: GET /api/media/category/exams
      const res = await fetch(`/api/media/category/exams`); 
      if (!res.ok) throw new Error("Failed to fetch media.");
      const data = await res.json();

      const list = Array.isArray(data) ? data : data.files ?? [];
      setMediaFiles(list);
    } catch (err) {
      toast({
        title: "Fetch Error",
        description: "Unable to load exam files from the server.",
        variant: "destructive",
      });
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  // ============================
  // DELETE FILE (API INTEGRITY)
  // ============================

  const handleDelete = async (id: string) => {
    if (!window.confirm("⚠️ Are you sure you want to permanently delete this file? This action cannot be undone.")) return;

    try {
      // API Route: DELETE /api/media/:id
      const res = await fetch(`/api/media/${id}`, { method: "DELETE" });

      if (!res.ok) throw new Error("Delete failed");

      setMediaFiles((prev) => prev.filter((f) => f.id !== id));
      toast({ title: "Deleted successfully", description: "The file was removed." });
    } catch (err) {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  // ============================
  // RENAME FILE (In-Card UX + API INTEGRITY)
  // ============================

  const openRename = (f: MediaFile) => {
    const parts = f.file_name.split('.');
    const ext = parts.length > 1 ? parts.pop() : '';
    const name = parts.join('.');
    
    setRenameExt(ext ? `.${ext}` : '');
    setRenameValue(name);
    setRenameFileId(f.id);

    // Focus is delayed slightly to ensure the input is rendered
    setTimeout(() => renameInputRef.current?.focus(), 50);
  };

  const handleRename = async () => {
    if (!renameValue.trim()) {
        toast({ title: "Validation Error", description: "File name cannot be empty.", variant: "destructive" });
        return;
    }

    const newFullName = renameValue + renameExt;
    
    try {
      // API Route: PUT /api/media/rename/:id
      const res = await fetch(`/api/media/rename/${renameFileId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newName: newFullName }),
      });

      if (!res.ok) throw new Error("Rename failed");

      // Optimistic UI update for immediate feedback
      setMediaFiles(prev => 
          prev.map(f => f.id === renameFileId ? { ...f, file_name: newFullName } : f)
      );
      
      toast({ title: "Renamed successfully", description: `File renamed to: ${newFullName}` });
      setRenameFileId(null);
    } catch (err: any) {
      toast({ 
        title: "Rename failed", 
        description: err.message || "An error occurred during renaming.", 
        variant: "destructive" 
      });
    }
  };

  // ============================
  // FILTER + SORT LOGIC
  // ============================

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    let list = mediaFiles
      .filter((f) => (filterCategory === "all" ? true : f.category === filterCategory))
      .filter((f) =>
        typeFilter === "image"
          ? f.file_type.startsWith("image")
          : typeFilter === "video"
          ? f.file_type.startsWith("video")
          : typeFilter === "document"
          ? !f.file_type.startsWith("image") && !f.file_type.startsWith("video")
          : true
      )
      .filter((f) => f.file_name.toLowerCase().includes(q))
      .sort((a, b) => {
        if (sort === "latest") return +new Date(b.uploaded_at) - +new Date(a.uploaded_at);
        if (sort === "oldest") return +new Date(a.uploaded_at) - +new Date(b.uploaded_at);
        if (sort === "az") return a.file_name.localeCompare(b.file_name);
        if (sort === "za") return b.file_name.localeCompare(a.file_name);
        return 0;
      });
      
      return list;
  }, [mediaFiles, search, filterCategory, typeFilter, sort]);

  const typeIcon = useCallback((t: string) =>
    t.startsWith("image") ? (
      <ImageIcon className="w-7 h-7 text-green-600" />
    ) : t.startsWith("video") ? (
      <VideoIcon className="w-7 h-7 text-red-600" />
    ) : (
      <FileText className="w-7 h-7 text-blue-600" />
    ), []);

  // ============================
  // RENDER
  // ============================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER AND UPLOAD AREA (Improved UX) */}
        <Card className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/80">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-3xl font-extrabold text-gray-800">📚 Exam Media Storage</CardTitle>
            <p className="text-slate-600 mt-1">
              Central hub for storing and managing all exam-related files.
            </p>
          </CardHeader>
          
          <div 
            className={`border-2 border-dashed rounded-lg p-6 transition-all ${
                isDragOver ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-indigo-400"
            } mt-4`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                
                {/* File Picker and Drag & Drop Info */}
                <div className="flex-1 flex flex-col items-center md:items-start space-y-2">
                    <Label htmlFor="fileUploader" className="cursor-pointer">
                        <Button 
                            variant="default" 
                            onClick={() => fileInputRef.current?.click()} 
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
                            disabled={loadingUpload}
                        >
                            <Upload className="w-4 h-4" /> 
                            {selectedFile ? "Change File" : "Select File"}
                        </Button>
                    </Label>
                    <input
                        id="fileUploader"
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={onFileChange}
                    />
                    <p className="text-sm text-center md:text-left text-slate-500">
                        {selectedFile 
                            ? `Selected: ${selectedFile.name}` 
                            : isDragOver ? "Drop file here to upload!" : "or Drag & Drop a file here."
                        }
                    </p>
                </div>
                
                {/* Category and Upload Action */}
                <div className="flex items-center gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-500">Category</Label>
                        <Select 
                            value={uploadCategory} 
                            onValueChange={setUploadCategory}
                            disabled={loadingUpload}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map((c) => (
                                    <SelectItem key={c.key} value={c.key}>
                                        {c.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button 
                        onClick={handleUpload} 
                        disabled={loadingUpload || !selectedFile}
                        className="self-end h-10 bg-green-600 hover:bg-green-700 min-w-[120px]"
                    >
                        {loadingUpload ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</> : "Upload File"}
                    </Button>
                </div>
            </div>
          </div>
        </Card>

        {/* TOOLBAR: Search, Filter, Sort (Consolidated UX) */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-white/90 rounded-xl shadow border border-white/80">
          
          {/* Search */}
          <div className="flex items-center gap-2 w-full md:w-1/3">
            <Search className="w-4 h-4 text-slate-500" />
            <Input
              placeholder={`Search ${filtered.length} files...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9"
            />
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-wrap gap-3">
            {/* Category Filter */}
            <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[150px] h-9 text-slate-600">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map((c) => (
                        <SelectItem key={c.key} value={c.key}>
                            {c.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[120px] h-9 text-slate-600">
                    <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="document">Documents</SelectItem>
                    <SelectItem value="image">Images</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sort} onValueChange={(v) => setSort(v as any)}>
                <SelectTrigger className="w-[120px] h-9 text-slate-600">
                    <ChevronDown className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="latest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="az">Name (A → Z)</SelectItem>
                    <SelectItem value="za">Name (Z → A)</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </div>

        {/* FILE GRID */}
        {fetching ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="h-48 bg-slate-200/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-slate-600 border border-gray-200 bg-white rounded-xl">
            <p className="text-xl font-medium">🤷‍♀️ No files found.</p>
            <p className="mt-2 text-sm">Adjust your filters or try uploading a new file.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filtered.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                CATEGORIES={CATEGORIES}
                typeIcon={typeIcon}
                buildFileUrl={buildFileUrl}
                openRename={openRename}
                handleDelete={handleDelete}
                setPreviewFile={setPreviewFile}
                renameFileId={renameFileId}
                renameValue={renameValue}
                renameExt={renameExt}
                setRenameValue={setRenameValue}
                handleRename={handleRename}
                setRenameFileId={setRenameFileId}
                renameInputRef={renameInputRef}
              />
            ))}
          </div>
        )}

        {/* PREVIEW DIALOG (Improved UX and Accessibility) */}
        <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
          <DialogContent className="max-w-4xl w-full p-0">
            <DialogHeader className="p-4 border-b">
              <DialogTitle className="text-lg font-semibold">{previewFile?.file_name}</DialogTitle>
              <DialogDescription className="text-sm">
                Uploaded: {new Date(previewFile?.uploaded_at ?? '').toLocaleString()}
              </DialogDescription>
            </DialogHeader>

            <div className="max-h-[80vh] overflow-y-auto p-4 flex items-center justify-center bg-gray-100">
              {previewFile && (
                <>
                  {previewFile.file_type.startsWith("image") ? (
                    <img
                      src={buildFileUrl(previewFile.file_path)}
                      className="max-h-[70vh] object-contain"
                      alt="Preview"
                    />
                  ) : previewFile.file_type.startsWith("video") ? (
                    <video
                      src={buildFileUrl(previewFile.file_path)}
                      controls
                      className="max-h-[70vh] w-full"
                    />
                  ) : (
                    // Use embed for non-image/video types like PDF. Add error fallback.
                    <iframe
                      src={buildFileUrl(previewFile.file_path)}
                      className="w-full h-[70vh] border-0"
                      title="File Preview"
                      onError={(e) => {
                          console.error("Iframe load error:", e);
                          toast({
                              title: "Preview Unavailable",
                              description: "Cannot render this file type directly in the browser.",
                              variant: "destructive"
                          });
                      }}
                    />
                  )}
                </>
              )}
            </div>
            <DialogFooter className="p-4">
                <Button variant="outline" onClick={() => setPreviewFile(null)}>Close</Button>
                <a href={buildFileUrl(previewFile?.file_path ?? "")} target="_blank" rel="noreferrer" download={previewFile?.file_name}>
                    <Button className="bg-green-600 hover:bg-green-700">
                        <Download className="w-4 h-4 mr-2" /> Download
                    </Button>
                </a>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}