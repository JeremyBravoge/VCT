import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileText, Image, Video, Download, Trash2 } from "lucide-react";

type MediaFile = {
  id: string;
  file_name: string;
  file_path: string;
  category: string;
  file_type: string;
  uploaded_at: string;
};

const categories = ["exams", "graduation", "videos", "documents", "general"];

const MediaDashboard: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<string>("general");
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  const { toast } = useToast();

  // Fetch media files
  const fetchMedia = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/media");
      const data = await res.json();
      setMediaFiles(data);
    } catch (err) {
      console.error("Error fetching media:", err);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  // Upload handler
  const handleUpload = async () => {
    if (!file) return toast({ title: "Please select a file", variant: "destructive" });
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);

      const res = await fetch("http://localhost:5000/api/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      toast({ title: "File uploaded successfully!" });
      setFile(null);
      setCategory("general");
      fetchMedia();
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Delete file
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/media/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast({ title: "File deleted" });
      fetchMedia();
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    }
  };

  // Filtered files
  const filteredFiles = filter === "all" ? mediaFiles : mediaFiles.filter(f => f.category === filter);

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">School Media Dashboard</h1>
        <p className="text-muted-foreground">Manage all your school files, photos, and videos</p>
      </div>

      {/* Upload Card */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Upload Media</CardTitle>
          <CardDescription>Select a file and categorize it</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <Select onValueChange={setCategory} value={category}>
            <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleUpload} disabled={loading} className="w-full bg-blue-600 text-white">
            {loading ? "Uploading..." : "Upload File"}
          </Button>
        </CardContent>
      </Card>

      {/* Filter */}
      <div className="flex items-center space-x-4">
        <span className="font-medium">Filter by category:</span>
        <Select onValueChange={setFilter} value={filter}>
          <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {categories.map(c => <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Media Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredFiles.map((file) => (
          <Card key={file.id} className="overflow-hidden relative">
            <CardContent className="flex flex-col items-center space-y-2">
              {file.file_type.startsWith("image") ? (
                <img src={file.file_path} alt={file.file_name} className="w-full h-40 object-cover rounded" />
              ) : file.file_type.startsWith("video") ? (
                <video src={file.file_path} className="w-full h-40 object-cover rounded" controls />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-40 border border-dashed rounded">
                  <FileText className="h-12 w-12 text-gray-400" />
                  <span className="text-sm mt-2 text-center">{file.file_name}</span>
                </div>
              )}
              <div className="flex justify-between w-full mt-2">
                <a href={file.file_path} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" /> Download</Button>
                </a>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(file.id)}>
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MediaDashboard;
