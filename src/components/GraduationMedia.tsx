"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useDropzone } from "react-dropzone";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
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
  Folder,
  Upload,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit3,
  X,
  Loader2,
  ListFilter,
  ArrowUpDown,
} from "lucide-react";

// --- Types & Constants (API Integrity) ---
type MediaFile = {
  id: string;
  file_name: string;
  file_path: string;
  category: string;
  file_type: string;
  uploaded_at: string;
  folder?: string | null;
  file_size?: number | null;
  uploaded_by?: string | null;
};

type ApiListResponse = {
  files: MediaFile[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalFiles: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

const BACKEND_URL = ""; // use relative paths (/api, /uploads) so proxy/production base handles requests
const DEFAULT_PAGE_LIMIT = 20;

const fileTypeMap: Record<string, string> = {
  image: "Images",
  video: "Videos",
  document: "Documents",
};

// --- Main Component ---
export default function GraduationMedia() {
  const { toast } = useToast();

  // --- State Hooks ---
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  
  const [loading, setLoading] = useState(false); // Global Loading for upload
  const [fetching, setFetching] = useState(false); // Loading for fetch
  
  const [search, setSearch] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("uploaded_at");
  const [sortOrder, setSortOrder] = useState<"DESC" | "ASC">("DESC");
  
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);
  const [renameFileId, setRenameFileId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const renameInputRef = useRef<HTMLInputElement | null>(null);
  
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  
  const [pagination, setPagination] = useState<{
    currentPage: number;
    totalPages: number;
    totalFiles: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null>(null);

  // --- Dropzone Logic ---
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Prevent duplicate files being selected
    const newFiles = acceptedFiles.filter(
      (f) => !filesToUpload.some((ef) => ef.name === f.name && ef.size === f.size)
    );
    setFilesToUpload((prev) => [...prev, ...newFiles]);
  }, [filesToUpload]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "video/*": [],
      "application/pdf": [".pdf"],
      "application/msword": [".doc", ".docx"],
    },
    multiple: true,
  });

  // --- API Functions (API Integrity Maintained) ---
  
  // helper: normalize file path
  const buildFileUrl = (path: string) => {
    if (!path) return "";
    return path.startsWith("http") ? path : (path.startsWith("/") ? path : `/${path}`);
  };

  const fetchFolders = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/media/folders/graduation`);
      if (!res.ok) throw new Error("Failed to fetch folders");
      const data = await res.json();
      // Ensure "All" or "None" folder is always an option in the UI
      setFolders(Array.isArray(data) ? data.sort() : []);
    } catch (err) {
      console.error("Folder fetch error:", err);
    }
  }, []);

  const fetchFiles = useCallback(
    async (page = 1) => {
      setFetching(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(DEFAULT_PAGE_LIMIT),
          sortBy,
          sortOrder,
          ...(selectedFolder ? { folder: selectedFolder } : {}),
          ...(search ? { search } : {}),
          ...(fileTypeFilter ? { fileType: fileTypeFilter } : {}),
        });
        
        const res = await fetch(
          `${BACKEND_URL}/api/media/category/graduation?${params.toString()}`
        );
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed fetching files");
        }
        const data: ApiListResponse = await res.json();
        
        setMediaFiles(data.files || []);
        if (data.pagination) setPagination(data.pagination);
        else setPagination(prev => prev ? {...prev, currentPage: page, totalFiles: data.files.length} : { currentPage: page, totalPages: 1, totalFiles: data.files.length, hasNext: false, hasPrev: false });
        
      } catch (err) {
        console.error("File fetch error:", err);
        toast({
          title: "Unable to load files",
          description: err instanceof Error ? err.message : String(err),
          variant: "destructive",
        });
      } finally {
        setFetching(false);
      }
    },
    [selectedFolder, search, fileTypeFilter, sortBy, sortOrder, toast]
  );

  useEffect(() => {
    fetchFolders();
    fetchFiles(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced refetch when filters change
  useEffect(() => {
    const t = setTimeout(() => fetchFiles(1), 300);
    return () => clearTimeout(t);
  }, [selectedFolder, search, fileTypeFilter, sortBy, sortOrder]); // Added missing dependencies to useEffect dependency array

  // Upload handler (supports multiple files)
  const handleUpload = async () => {
    if (filesToUpload.length === 0) {
      toast({ title: "No files selected", variant: "destructive" });
      return;
    }
    setLoading(true);
    let successfulUploads = 0;
    
    try {
      for (const f of filesToUpload) {
        const form = new FormData();
        form.append("file", f);
        form.append("category", "graduation");
        if (selectedFolder) form.append("folder", selectedFolder);

        const res = await fetch(`${BACKEND_URL}/api/media/upload`, {
          method: "POST",
          body: form,
        });

        if (res.ok) {
          successfulUploads++;
        } else {
          // Log failed uploads but continue with others
          const txt = await res.text();
          console.error(`Failed to upload ${f.name}: ${txt}`);
        }
      }
      
      if (successfulUploads > 0) {
        toast({ title: `${successfulUploads} file(s) uploaded successfully` });
      } else {
        throw new Error("All files failed to upload.");
      }

      setFilesToUpload([]);
      fetchFolders();
      // Refetch current page after upload
      fetchFiles(pagination?.currentPage || 1); 
    } catch (err) {
      console.error(err);
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "An error occurred during upload",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create folder
  const handleCreateFolder = async () => {
    const name = newFolderName.trim();
    if (!name) {
      toast({ title: "Enter folder name", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/media/folders/graduation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: name }),
      });
      if (!res.ok) throw new Error("Failed to create folder");
      
      setNewFolderName("");
      setNewFolderDialogOpen(false);
      fetchFolders();
      toast({ title: "Folder created", description: `Folder '${name}' is now available.` });
      setSelectedFolder(name); // Auto-select the newly created folder
    } catch (err) {
      toast({
        title: "Create folder failed",
        description: err instanceof Error ? err.message : "Failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this file permanently?")) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/media/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      
      toast({ title: "File deleted" });
      // Optimistic update
      setMediaFiles(prev => prev.filter(f => f.id !== id)); 
      // Refresh to account for pagination gaps
      fetchFiles(pagination?.currentPage || 1);
    } catch (err) {
      toast({
        title: "Delete failed",
        description: err instanceof Error ? err.message : "Failed to delete",
        variant: "destructive",
      });
    }
  };

  // Rename
  const openRename = (file: MediaFile) => {
    setRenameFileId(file.id);
    setRenameValue(file.file_name);
    setTimeout(() => renameInputRef.current?.focus(), 50);
  };

  const handleRename = async () => {
    if (!renameFileId) return;
    const trimmed = renameValue.trim();
    if (!trimmed) {
      toast({ title: "Enter a valid name", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/media/rename/${renameFileId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newName: trimmed }),
      });
      if (!res.ok) throw new Error("Rename failed");
      
      toast({ title: "Renamed successfully" });
      setRenameFileId(null);
      // Refresh the list to reflect the new name
      fetchFiles(pagination?.currentPage || 1);
    } catch (err) {
      toast({
        title: "Rename failed",
        description: err instanceof Error ? err.message : "Failed to rename",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Preview helper
  const iconForType = (type?: string) => {
    if (!type) return <FileText className="w-8 h-8 text-gray-500" />;
    if (type.startsWith("image")) return <ImageIcon className="w-8 h-8 text-indigo-600" />;
    if (type.startsWith("video")) return <VideoIcon className="w-8 h-8 text-red-600" />;
    return <FileText className="w-8 h-8 text-blue-600" />;
  };

  // Pagination controls
  const goToPage = (page: number) => {
    if (!pagination) return;
    const p = Math.max(1, Math.min(pagination.totalPages, page));
    if (p !== pagination.currentPage) {
      fetchFiles(p);
    }
  };

  // --- Render Components ---
  const EmptyState = () => (
    <div className="text-center py-20 bg-white border border-dashed rounded-lg text-muted-foreground col-span-full">
      <Folder className="w-10 h-10 mx-auto mb-4 text-gray-400" />
      <p className="text-lg font-semibold">
        {search || fileTypeFilter || selectedFolder ? "No matching files found" : "Your media library is empty"}
      </p>
      <p className="mt-2 text-sm">
        {search || fileTypeFilter || selectedFolder ? "Try clearing the search or filters." : "Start by uploading a file using the card above."}
      </p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-8 px-4 sm:px-6 lg:px-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🎓 Graduation Media Library</h1>
          <p className="text-sm text-gray-500 mt-1">
            Central repository for all Graduation photos, videos, and documents.
          </p>
        </div>
      </div>
      
      {/* UPLOAD CARD (Prominent and clear) */}
      <Card className="shadow-lg border-t-4 border-blue-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl"><Upload className="w-5 h-5 text-blue-600"/> Upload Files</CardTitle>
          <CardDescription>
            Select a folder, drag & drop files, or click to browse. Supports multiple files.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            
            {/* Folder Selection */}
            <div className="space-y-1">
                <p className="text-sm font-medium">Target Folder</p>
                <div className="flex gap-2">
                    <Select value={selectedFolder || "none"} onValueChange={(v) => setSelectedFolder(v === "none" ? "" : v)} disabled={loading}>
                        <SelectTrigger className="flex-1">
                            <SelectValue placeholder="No folder" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Root Directory</SelectItem>
                            {folders.map((f) => (
                                <SelectItem key={f} value={f}>{f}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={() => setNewFolderDialogOpen(true)} variant="outline" size="icon" disabled={loading}>
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Dropzone Area */}
            <div {...getRootProps()} className={`md:col-span-2 border-2 rounded-lg p-3 text-center cursor-pointer transition 
              ${isDragActive ? "border-green-500 bg-green-50" : "border-dashed border-gray-300 hover:border-gray-500"}`}
            >
              <input {...getInputProps()} />
              <p className="text-sm text-gray-600">
                {isDragActive ? "Drop here!" : "Drag & drop files or click to browse"}
              </p>
            </div>
            
            {/* Upload Button */}
            <Button 
                onClick={handleUpload} 
                disabled={loading || filesToUpload.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 min-h-[40px] transition-colors"
            >
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading ({filesToUpload.length})...</> : `Upload ${filesToUpload.length || ''} File${filesToUpload.length !== 1 ? 's' : ''}`}
            </Button>
          </div>
          
          {/* File Queue (Compact) */}
          {filesToUpload.length > 0 && (
            <div className="mt-3 border-t pt-3 flex items-center justify-between">
              <div className="flex gap-2 flex-wrap max-w-full overflow-hidden">
                <span className="text-sm font-medium text-gray-700">{filesToUpload.length} file(s) ready:</span>
                {filesToUpload.slice(0, 3).map((f, i) => (
                  <Badge key={i} variant="secondary" className="truncate max-w-[150px]">{f.name}</Badge>
                ))}
                {filesToUpload.length > 3 && (
                    <Badge variant="outline" className="text-gray-500">+{filesToUpload.length - 3} more</Badge>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setFilesToUpload([])} className="text-red-500 hover:text-red-600">
                <X className="w-4 h-4 mr-1" /> Clear Queue
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* FILTER & FOLDER BAR (Improved Scannability) */}
      <div className="flex flex-col gap-3 sticky top-0 bg-white/95 backdrop-blur-sm z-10 py-4 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-t shadow-sm">
        
        {/* Current Folder / Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
            <Folder className="w-4 h-4 text-blue-600"/>
            <span className="font-semibold">Viewing:</span>
            <Badge 
                variant={selectedFolder ? "default" : "secondary"} 
                className="cursor-pointer"
                onClick={() => setSelectedFolder("")}
            >
                {selectedFolder || "Root Directory"}
            </Badge>
        </div>

        {/* Search, Filter, Sort Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search */}
          <div className="flex items-center gap-2 w-full md:w-80">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input 
                placeholder={`Search ${pagination?.totalFiles || ''} files...`} 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="min-w-0" 
            />
          </div>

          <div className="flex gap-2 items-center flex-wrap">
            
            {/* File Type Filter */}
            <Select value={fileTypeFilter || "all"} onValueChange={(v) => setFileTypeFilter(v === "all" ? "" : v)}>
              <SelectTrigger className="w-40">
                <ListFilter className="w-4 h-4 mr-2 text-gray-500"/>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {Object.keys(fileTypeMap).map(key => (
                    <SelectItem key={key} value={key}>{fileTypeMap[key]}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={`${sortBy}:${sortOrder}`} onValueChange={(v) => {
              const [s, o] = v.split(":");
              setSortBy(s);
              setSortOrder(o as "ASC"|"DESC");
            }}>
              <SelectTrigger className="w-44">
                <ArrowUpDown className="w-4 h-4 mr-2 text-gray-500"/>
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uploaded_at:DESC">Latest upload</SelectItem>
                <SelectItem value="uploaded_at:ASC">Oldest upload</SelectItem>
                <SelectItem value="file_name:ASC">Name (A → Z)</SelectItem>
                <SelectItem value="file_name:DESC">Name (Z → A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* FILES GRID & LOADING/EMPTY STATE */}
      <section>
        {fetching ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: DEFAULT_PAGE_LIMIT }).map((_, i) => (
              <div key={i} className="h-56 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : mediaFiles.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {mediaFiles.map((m) => {
              const url = buildFileUrl(m.file_path);
              const isImage = m.file_type?.startsWith("image");
              const isVideo = m.file_type?.startsWith("video");
              
              const isRenaming = renameFileId === m.id;
              
              return (
                <Card key={m.id} className="group overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                  
                  {/* Visual Area (Preview Trigger) */}
                  <div className="relative cursor-pointer" onClick={() => setPreviewFile(m)}>
                    <div className="h-44 w-full bg-gray-100 flex items-center justify-center">
                      {isImage ? (
                        <img src={url} alt={m.file_name} className="w-full h-44 object-cover object-center group-hover:scale-105 transition-transform duration-300" />
                      ) : isVideo ? (
                        <video src={url} className="w-full h-44 object-cover" />
                      ) : (
                        <div className="flex flex-col items-center">
                            {iconForType(m.file_type)}
                            <span className="text-sm mt-2 font-medium text-gray-700 px-2 text-center">{m.file_name.split('.').pop()?.toUpperCase() || 'FILE'}</span>
                        </div>
                      )}
                    </div>
                    {/* Hover Overlay for Preview */}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                        <Eye className="w-8 h-8 text-white"/>
                    </div>
                  </div>

                  {/* Content Area (Details & Actions) */}
                  <CardContent className="p-3 space-y-2">
                    {/* File Name / Rename Input */}
                    {isRenaming ? (
                        <div className="space-y-2">
                            <Input 
                                ref={renameInputRef} 
                                value={renameValue} 
                                onChange={(e) => setRenameValue(e.target.value)} 
                                onKeyDown={(e) => { if (e.key === 'Enter') handleRename(); }}
                                placeholder="New file name" 
                                className="h-8"
                            />
                            <div className="flex justify-end gap-1">
                                <Button size="sm" variant="secondary" onClick={() => setRenameFileId(null)}>Cancel</Button>
                                <Button size="sm" onClick={handleRename} disabled={loading}>Save</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="font-medium truncate text-gray-800" title={m.file_name}>
                            {m.file_name}
                        </div>
                    )}

                    {/* Meta Info */}
                    <div className="text-xs text-muted-foreground space-y-0.5">
                        <div className="flex items-center gap-1">
                            <Folder className="w-3 h-3 text-gray-500" /> 
                            <span>Folder: {m.folder || "Root"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <CalendarDays className="w-3 h-3 text-gray-500" />
                            <span>{new Date(m.uploaded_at).toLocaleDateString()}</span>
                            <Clock className="w-3 h-3 ml-2 text-gray-500" />
                            <span>{new Date(m.uploaded_at).toLocaleTimeString().replace(/:\d{2}\s/, ' ')}</span>
                        </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex justify-between pt-2 border-t mt-2">
                        <a href={url} target="_blank" rel="noreferrer" download={m.file_name}>
                            <Button size="sm" variant="outline" className="flex items-center gap-1">
                                <Download className="w-4 h-4" /> Download
                            </Button>
                        </a>
                        <div className="flex gap-1">
                            <Button size="icon" variant="secondary" onClick={() => openRename(m)} disabled={isRenaming}>
                                <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="destructive" onClick={() => handleDelete(m.id)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 p-3 bg-gray-50 rounded-lg border">
          <div className="text-sm text-muted-foreground">
            Showing Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalFiles} files total)
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => goToPage(pagination.currentPage - 1)} disabled={!pagination.hasPrev}><ChevronLeft className="w-4 h-4"/></Button>
            <div className="text-sm font-medium">Page {pagination.currentPage}</div>
            <Button variant="outline" size="sm" onClick={() => goToPage(pagination.currentPage + 1)} disabled={!pagination.hasNext}><ChevronRight className="w-4 h-4"/></Button>
          </div>
        </div>
      )}

      {/* MODALS (Preview, Rename, New Folder) */}
      
      {/* Preview dialog */}
      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="max-w-4xl p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="text-lg font-semibold">{previewFile?.file_name}</DialogTitle>
          </DialogHeader>

          <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto flex flex-col items-center justify-center bg-gray-100">
            {previewFile && previewFile.file_type.startsWith("image") ? (
              <img src={buildFileUrl(previewFile.file_path)} alt={previewFile.file_name} className="w-full max-h-[60vh] object-contain rounded" />
            ) : previewFile && previewFile.file_type.startsWith("video") ? (
              <video src={buildFileUrl(previewFile.file_path)} controls className="w-full max-h-[60vh] rounded" />
            ) : previewFile ? (
              <iframe src={buildFileUrl(previewFile.file_path)} className="w-full h-[60vh] border rounded" title={previewFile.file_name} />
            ) : null}
          </div>
          
          <DialogFooter className="p-4 border-t flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              Folder: **{previewFile?.folder || "Root"}** | Uploaded: **{previewFile ? new Date(previewFile.uploaded_at).toLocaleString() : ""}**
            </div>
            <div className="flex gap-2">
              <a href={previewFile ? buildFileUrl(previewFile.file_path) : "#"} target="_blank" rel="noreferrer" download>
                <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Download</Button>
              </a>
              <Button onClick={() => setPreviewFile(null)}>Close</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* New folder dialog */}
      <Dialog open={newFolderDialogOpen} onOpenChange={setNewFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input 
                placeholder="e.g., 'Ceremony Photos 2024'" 
                value={newFolderName} 
                onChange={(e) => setNewFolderName(e.target.value)} 
                disabled={loading}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setNewFolderDialogOpen(false)} disabled={loading}>Cancel</Button>
              <Button onClick={handleCreateFolder} disabled={loading || !newFolderName.trim()}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}