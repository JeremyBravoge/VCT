"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Plus,
  Search,
  Edit,
  Eye,
  Trash2,
  User,
  Phone,
  Mail,
  MapPin,
  Download,
  Camera,
  X,
  CheckCircle,
  ChevronDown,
  Users,
  BookOpen,
  GraduationCap,
  BarChart3,
  Filter,
  Calendar,
  Tag,
  Shield,
  Upload,
  RefreshCw,
  MoreVertical,
  Grid3x3 as GridIcon,
  LayoutGrid,
  List,
  Settings,
  Star,
  TrendingUp,
  FileText,
  MessageSquare,
  Award,
  Bell,
  Clock,
  UserPlus,
  FileEdit,
  ExternalLink,
  Printer,
  Share2,
  Copy,
  QrCode,
  CreditCard,
  ShieldCheck,
  Lock,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface Student {
  student_id: string;
  name?: string;
  image_url?: string;
  course?: string;
  admission_date?: string;
  status?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  age?: string;
  address?: string;
  id_number?: string;
  nationality?: string;
  guardian_name?: string;
  guardian_contact?: string;
  course_id?: string;
  branch_id?: string;
  performance?: string;
  enrollment_status?: string;
  created_at?: string;
  attendance?: number;
  grade?: string;
  fees_paid?: boolean;
}

interface Course {
  id: string;
  name: string;
  department_id?: string;
  duration?: string;
  fee?: number;
}

interface Stats {
  total: number;
  active: number;
  newThisMonth: number;
  totalCourses: number;
  attendanceRate: number;
  graduationRate: number;
}

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid" | "compact">("list");
  const [stats, setStats] = useState<Stats>({
    total: 0,
    active: 0,
    newThisMonth: 0,
    totalCourses: 0,
    attendanceRate: 0,
    graduationRate: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  // Enhanced Grid3x3 Icon Component
  const Grid3x3 = ({ className = "", variant = "default", isActive = false, onClick }: { 
    className?: string, 
    variant?: "default" | "minimal" | "bold",
    isActive?: boolean,
    onClick?: () => void 
  }) => {
    const baseClasses = "transition-all duration-300 ease-out cursor-pointer w-5 h-5";
    
    const variantStyles = {
      default: `stroke-current ${isActive ? 'stroke-blue-600' : 'stroke-gray-500 hover:stroke-blue-500'}`,
      minimal: `stroke-current ${isActive ? 'stroke-gray-900 stroke-1.5' : 'stroke-gray-400 hover:stroke-gray-600'}`,
      bold: `stroke-current ${isActive ? 'stroke-blue-700 stroke-2' : 'stroke-gray-500 hover:stroke-blue-600'}`
    };

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`${baseClasses} ${variantStyles[variant]} ${className}`}
              onClick={onClick}
            >
              <rect 
                width="18" 
                height="18" 
                x="3" 
                y="3" 
                rx="2"
                className={isActive ? "transition-all duration-300" : ""}
              />
              <path d="M3 9h18" className="transition-all duration-200" />
              <path d="M3 15h18" className="transition-all duration-200" />
              <path d="M9 3v18" className="transition-all duration-200" />
              <path d="M15 3v18" className="transition-all duration-200" />
            </svg>
          </TooltipTrigger>
          <TooltipContent>
            <p>Grid View</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // Fetch students and data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentsRes, coursesRes] = await Promise.all([
        axios.get("http://localhost:5000/api/students"),
        axios.get("http://localhost:5000/api/courses")
      ]);

      const studentsData = studentsRes.data.map((student: Student) => ({
        ...student,
        name: `${student.first_name || ''} ${student.last_name || ''}`.trim()
      }));

      setStudents(studentsData);
      setCourses(coursesRes.data || []);
      
      // Calculate statistics
      const activeCount = studentsData.filter((s: Student) => s.status === 'Active').length;
      const newThisMonth = studentsData.filter((s: Student) => {
        const admissionDate = new Date(s.admission_date || '');
        const now = new Date();
        return admissionDate.getMonth() === now.getMonth() && 
               admissionDate.getFullYear() === now.getFullYear();
      }).length;
      const uniqueCourses = new Set(studentsData.map((s: Student) => s.course)).size;
      
      setStats({
        total: studentsData.length,
        active: activeCount,
        newThisMonth,
        totalCourses: uniqueCourses,
        attendanceRate: 87,
        graduationRate: 92
      });
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle delete student
  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm("Are you sure you want to delete this student? This action cannot be undone.")) return;
    try {
      await axios.delete(`http://localhost:5000/api/students/${studentId}`);
      setStudents(prev => prev.filter(s => s.student_id !== studentId));
      if (selectedStudent?.student_id === studentId) {
        setSelectedStudent(null);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Fetch single student data
  const fetchStudentData = async (studentId: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/students/${studentId}`);
      const studentData = {
        ...response.data,
        name: `${response.data.first_name || ''} ${response.data.last_name || ''}`.trim()
      };
      return studentData;
    } catch (error) {
      console.error("Failed to fetch student data:", error);
      return null;
    }
  };

  // Update student
  const handleUpdateStudent = async () => {
    if (!editingStudent) return;

    try {
      let imageUrl = editingStudent.image_url;
      
      // Upload new image if exists
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        
        const uploadRes = await axios.post(
          'http://localhost:5000/api/upload/student',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        
        imageUrl = uploadRes.data.imageUrl;
      }

      const payload = {
        first_name: editingStudent.first_name,
        last_name: editingStudent.last_name,
        email: editingStudent.email,
        phone: editingStudent.phone,
        gender: editingStudent.gender,
        age: editingStudent.age,
        address: editingStudent.address,
        id_number: editingStudent.id_number,
        nationality: editingStudent.nationality,
        guardian_name: editingStudent.guardian_name,
        guardian_contact: editingStudent.guardian_contact,
        course_id: editingStudent.course_id,
        branch_id: editingStudent.branch_id,
        status: editingStudent.status,
        image_url: imageUrl
      };

      await axios.put(
        `http://localhost:5000/api/students/${editingStudent.student_id}`,
        payload
      );

      // Update local state
      setStudents(prev => prev.map(s =>
        s.student_id === editingStudent.student_id
          ? { ...s, ...payload, image_url: imageUrl, name: `${editingStudent.first_name} ${editingStudent.last_name}` }
          : s
      ));

      // Refresh data
      await fetchData();

      setEditingStudent(null);
      setImagePreview(null);
      setImageFile(null);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch =
      (student.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (student.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (student.phone?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (student.id_number?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    const matchesCourse =
      !selectedCourse || selectedCourse === "all" || student.course_id === selectedCourse;

    const matchesStatus =
      !selectedStatus || selectedStatus === "all" || student.status === selectedStatus;

    return matchesSearch && matchesCourse && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  // Get status badge with enhanced styling
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return (
          <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1.5 rounded-full shadow-sm">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-xs font-medium">Active</span>
            </div>
          </Badge>
        );
      case 'inactive':
        return (
          <Badge className="bg-gradient-to-r from-slate-500 to-slate-600 text-white px-3 py-1.5 rounded-full">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-xs font-medium">Inactive</span>
            </div>
          </Badge>
        );
      case 'graduated':
        return (
          <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1.5 rounded-full">
            <div className="flex items-center gap-1.5">
              <Award className="w-3 h-3" />
              <span className="text-xs font-medium">Graduated</span>
            </div>
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-3 py-1.5 rounded-full">
            <span className="text-xs font-medium">{status || 'Unknown'}</span>
          </Badge>
        );
    }
  };

  // Get performance indicator with enhanced styling
  const getPerformanceIndicator = (performance: string) => {
    const getColor = (level: string) => {
      switch (level) {
        case 'excellent': return 'from-emerald-500 to-emerald-600';
        case 'good': return 'from-blue-500 to-blue-600';
        case 'average': return 'from-amber-500 to-amber-600';
        default: return 'from-slate-500 to-slate-600';
      }
    };

    const getLabel = (level: string) => {
      switch (level) {
        case 'excellent': return 'Excellent';
        case 'good': return 'Good';
        case 'average': return 'Average';
        default: return 'No Data';
      }
    };

    return (
      <div className="flex items-center gap-3">
        <div className={`h-3 w-20 bg-gradient-to-r ${getColor(performance?.toLowerCase() || '')} rounded-full overflow-hidden`}>
          <div className="h-full bg-gradient-to-r from-white/30 to-transparent animate-shimmer"></div>
        </div>
        <span className="text-xs font-medium text-slate-700">{getLabel(performance?.toLowerCase() || '')}</span>
      </div>
    );
  };

  // Export students to CSV
  const exportStudents = () => {
    const headers = ['Student ID', 'Name', 'Email', 'Phone', 'Course', 'Admission Date', 'Status'];
    const csvData = filteredStudents.map(student => [
      student.student_id,
      student.name,
      student.email,
      student.phone,
      student.course,
      student.admission_date,
      student.status
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `students-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-6 w-96" />
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                    <Skeleton className="h-12 w-12 rounded-xl" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search Bar Skeleton */}
          <Card className="mb-6 border-slate-200">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Skeleton className="h-12 flex-1" />
                <Skeleton className="h-12 w-48" />
                <Skeleton className="h-12 w-48" />
              </div>
            </CardContent>
          </Card>

          {/* Table Skeleton */}
          <Card className="border-slate-200">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Student Management
                  </h1>
                  <p className="text-slate-600 mt-2 flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span className="font-medium text-slate-900">{stats.total}</span> total students
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="font-medium text-emerald-700">{stats.active}</span> active
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative h-11 w-11 border-slate-300 hover:bg-slate-100 rounded-xl"
                    >
                      <Bell className="h-5 w-5 text-slate-600" />
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                        3
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications (3 new)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={fetchData}
                      className="h-11 w-11 border-slate-300 hover:bg-slate-100 rounded-xl"
                    >
                      <RefreshCw className={`h-5 w-5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh data</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-11 border-slate-300 hover:bg-slate-100 px-4 rounded-xl"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    <span>Export</span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 border-slate-200 shadow-xl">
                  <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                  <DropdownMenuItem onClick={exportStudents} className="cursor-pointer">
                    <FileText className="h-4 w-4 mr-2" />
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Printer className="h-4 w-4 mr-2" />
                    Print List
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                onClick={() => navigate("/admissionsPage")}
                className="h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                <span>Add Student</span>
              </Button>
            </div>
          </div>

          {/* Enhanced Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            <Card className="lg:col-span-2 bg-gradient-to-br from-white to-blue-50 border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
              <CardContent className="p-6 relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full -translate-y-8 translate-x-8"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total Students</p>
                      <p className="text-3xl font-bold text-slate-900 mt-1">{stats.total}</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                      <Users className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    <span className="text-emerald-600 font-medium">+12%</span>
                    <span className="text-slate-500">from last month</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-emerald-50 border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Active Students</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{stats.active}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {Math.round((stats.active / stats.total) * 100)}% of total
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg">
                    <CheckCircle className="h-7 w-7 text-white" />
                  </div>
                </div>
                <Progress value={Math.round((stats.active / stats.total) * 100)} className="h-2" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-violet-50 border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Active Courses</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalCourses}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg">
                    <BookOpen className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-amber-500" />
                    Most popular: Computer Science
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-amber-50 border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-600">New This Month</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{stats.newThisMonth}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
                    <BarChart3 className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span className="text-slate-500">Updated just now</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Search and Filters */}
          <Card className="bg-white border-slate-200 shadow-sm mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Bar */}
                <div className="relative flex-1 group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  <Input
                    placeholder="Search students by name, email, phone, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl text-base transition-all duration-300"
                  />
                </div>

                {/* Filters and Controls */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* View Toggle */}
                  <div className="flex items-center bg-slate-100 rounded-xl p-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewMode("list")}
                            className={`h-9 px-3 rounded-lg ${viewMode === "list" ? "bg-white shadow-sm text-blue-600" : "text-slate-600 hover:text-slate-900"}`}
                          >
                            <List className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>List View</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewMode("grid")}
                            className={`h-9 px-3 rounded-lg ${viewMode === "grid" ? "bg-white shadow-sm text-blue-600" : "text-slate-600 hover:text-slate-900"}`}
                          >
                            <LayoutGrid className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Grid View</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {/* Course Filter */}
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger className="w-[180px] h-12 border-slate-300 rounded-xl">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-slate-400" />
                        <SelectValue placeholder="All Courses" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="border-slate-200 shadow-xl">
                      <SelectItem value="all">All Courses</SelectItem>
                      {courses.map(course => (
                        <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Status Filter */}
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[140px] h-12 border-slate-300 rounded-xl">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-slate-400" />
                        <SelectValue placeholder="All Status" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="border-slate-200 shadow-xl">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Graduated">Graduated</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Advanced Filters Toggle */}
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="h-12 border-slate-300 hover:bg-slate-100 rounded-xl"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {showFilters ? (
                      <ChevronDown className="h-4 w-4 ml-2 rotate-180 transition-transform" />
                    ) : (
                      <ChevronDown className="h-4 w-4 ml-2 transition-transform" />
                    )}
                  </Button>

                  {/* Clear Filters */}
                  {(searchTerm || selectedCourse !== "" || selectedStatus !== "") && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCourse("");
                        setSelectedStatus("");
                      }}
                      className="h-12 border-slate-300 hover:bg-slate-100 rounded-xl"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              {/* Advanced Filters Panel */}
              {showFilters && (
                <div className="mt-6 pt-6 border-t border-slate-200 animate-in slide-in-from-top-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-slate-700 mb-2">Performance Level</Label>
                      <Select>
                        <SelectTrigger className="border-slate-300 rounded-lg">
                          <SelectValue placeholder="All levels" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Levels</SelectItem>
                          <SelectItem value="excellent">Excellent</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="average">Average</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-700 mb-2">Admission Date Range</Label>
                      <div className="flex items-center gap-2">
                        <Input type="date" className="border-slate-300 rounded-lg" />
                        <span className="text-slate-400">to</span>
                        <Input type="date" className="border-slate-300 rounded-lg" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-700 mb-2">Additional Filters</Label>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch id="fees-paid" />
                          <Label htmlFor="fees-paid" className="text-sm">Fees Paid</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch id="attendance" />
                          <Label htmlFor="attendance" className="text-sm">High Attendance</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Student Directory
            </h2>
            <p className="text-slate-600 mt-1">
              Showing <span className="font-medium text-slate-900">{filteredStudents.length}</span> of{" "}
              <span className="font-medium text-slate-900">{students.length}</span> students
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(parseInt(value))}>
              <SelectTrigger className="w-[120px] border-slate-300 rounded-lg">
                <SelectValue placeholder="Items per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
                <SelectItem value="100">100 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Content - Dynamic Views */}
        {viewMode === "list" ? (
          /* Enhanced List View */
          <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-slate-50 to-blue-50/30">
                    <TableRow className="border-b border-slate-200">
                      <TableHead className="font-semibold text-slate-700 py-4 pl-6">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Student
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700 py-4">Contact</TableHead>
                      <TableHead className="font-semibold text-slate-700 py-4">Course</TableHead>
                      <TableHead className="font-semibold text-slate-700 py-4">Admission</TableHead>
                      <TableHead className="font-semibold text-slate-700 py-4">Status</TableHead>
                      <TableHead className="font-semibold text-slate-700 py-4">Performance</TableHead>
                      <TableHead className="font-semibold text-slate-700 py-4 pr-6 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-16">
                          <div className="flex flex-col items-center justify-center text-slate-500">
                            <Users className="h-16 w-16 mb-4 opacity-30" />
                            <p className="text-lg font-medium text-slate-700 mb-2">No students found</p>
                            <p className="text-sm text-slate-500 mb-6">Try adjusting your search criteria or filters</p>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSearchTerm("");
                                setSelectedCourse("");
                                setSelectedStatus("");
                              }}
                              className="border-slate-300 hover:bg-slate-100"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Clear all filters
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedStudents.map((student) => (
                        <TableRow 
                          key={student.student_id} 
                          className="border-b border-slate-100 hover:bg-blue-50/20 transition-colors group"
                        >
                          <TableCell className="py-4 pl-6">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <Avatar className="h-12 w-12 ring-2 ring-white shadow-sm group-hover:ring-blue-100 transition-all">
                                  <AvatarImage 
                                    src={student.image_url ? 
                                      (student.image_url.startsWith('http') 
                                        ? student.image_url 
                                        : `http://localhost:5000/${student.image_url}`) 
                                      : ''} 
                                  />
                                  <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 font-semibold">
                                    {student.name?.split(' ').map(n => n[0]).join('') || '??'}
                                  </AvatarFallback>
                                </Avatar>
                                {student.status === 'Active' && (
                                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                  {student.name}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <p className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                    ID: {student.student_id}
                                  </p>
                                  {student.fees_paid ? (
                                    <Badge className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5">
                                      <CreditCard className="h-3 w-3 mr-1" />
                                      Paid
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5">
                                      <AlertCircle className="h-3 w-3 mr-1" />
                                      Pending
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-slate-400" />
                                <span className="text-slate-700 truncate max-w-[180px]">{student.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-slate-400" />
                                <span className="text-slate-700">{student.phone}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="font-medium text-slate-900">{student.course}</div>
                            <div className="text-xs text-slate-500 mt-1">Course ID: {student.course_id}</div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex flex-col gap-1">
                              <div className="text-sm font-medium text-slate-900">
                                {student.admission_date 
                                  ? new Date(student.admission_date).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })
                                  : 'Not set'
                                }
                              </div>
                              {student.admission_date && (
                                <div className="text-xs text-slate-500">
                                  {Math.floor((new Date().getTime() - new Date(student.admission_date).getTime()) / (1000 * 60 * 60 * 24 * 30))} months ago
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            {getStatusBadge(student.status || '')}
                          </TableCell>
                          <TableCell className="py-4">
                            {getPerformanceIndicator(student.performance || '')}
                            {student.attendance && (
                              <div className="text-xs text-slate-500 mt-2">
                                Attendance: <span className="font-medium">{student.attendance}%</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="py-4 pr-6">
                            <div className="flex items-center justify-end gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={async () => {
                                        const freshData = await fetchStudentData(student.student_id);
                                        if (freshData) {
                                          setSelectedStudent(freshData);
                                        } else {
                                          setSelectedStudent(student);
                                        }
                                      }}
                                      className="h-9 w-9 p-0 hover:bg-blue-100 hover:text-blue-600"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>View Profile</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={async () => {
                                        const freshData = await fetchStudentData(student.student_id);
                                        if (freshData) {
                                          setEditingStudent(freshData);
                                          setImagePreview(freshData.image_url || null);
                                        } else {
                                          setEditingStudent(student);
                                          setImagePreview(student.image_url || null);
                                        }
                                      }}
                                      className="h-9 w-9 p-0 hover:bg-emerald-100 hover:text-emerald-600"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Edit Student</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="h-9 w-9 p-0 hover:bg-slate-100"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 border-slate-200 shadow-xl">
                                  <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                                  <DropdownMenuItem 
                                    onClick={async () => {
                                      const freshData = await fetchStudentData(student.student_id);
                                      if (freshData) {
                                        setSelectedStudent(freshData);
                                      } else {
                                        setSelectedStudent(student);
                                      }
                                    }}
                                    className="cursor-pointer"
                                  >
                                    <Eye className="h-4 w-4 mr-2 text-slate-500" />
                                    View Full Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={async () => {
                                      const freshData = await fetchStudentData(student.student_id);
                                      if (freshData) {
                                        setEditingStudent(freshData);
                                        setImagePreview(freshData.image_url || null);
                                      } else {
                                        setEditingStudent(student);
                                        setImagePreview(student.image_url || null);
                                      }
                                    }}
                                    className="cursor-pointer"
                                  >
                                    <Edit className="h-4 w-4 mr-2 text-slate-500" />
                                    Edit Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer">
                                    <MessageSquare className="h-4 w-4 mr-2 text-slate-500" />
                                    Send Message
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer">
                                    <QrCode className="h-4 w-4 mr-2 text-slate-500" />
                                    Generate ID Card
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer">
                                    <Copy className="h-4 w-4 mr-2 text-slate-500" />
                                    Copy Student ID
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600 cursor-pointer"
                                    onClick={() => handleDeleteStudent(student.student_id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Student
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            
            {/* Pagination */}
            {paginatedStudents.length > 0 && (
              <CardFooter className="px-6 py-4 border-t border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between w-full">
                  <div className="text-sm text-slate-600">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredStudents.length)} of {filteredStudents.length} results
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        const pageNumber = i + 1;
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              isActive={currentPage === pageNumber}
                              onClick={() => setCurrentPage(pageNumber)}
                              className="cursor-pointer"
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      {totalPages > 5 && (
                        <>
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink
                              isActive={currentPage === totalPages}
                              onClick={() => setCurrentPage(totalPages)}
                              className="cursor-pointer"
                            >
                              {totalPages}
                            </PaginationLink>
                          </PaginationItem>
                        </>
                      )}
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </CardFooter>
            )}
          </Card>
        ) : (
          /* Enhanced Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedStudents.map((student) => (
              <Card 
                key={student.student_id} 
                className="bg-white border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1"
              >
                <div className="relative">
                  {/* Header Background */}
                  <div className="h-24 bg-gradient-to-r from-blue-500/10 to-indigo-600/10" />
                  
                  {/* Profile Section */}
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
                    <div className="relative">
                      <Avatar className="h-24 w-24 ring-4 ring-white shadow-xl">
                        <AvatarImage 
                          src={student.image_url ? 
                            (student.image_url.startsWith('http') 
                              ? student.image_url 
                              : `http://localhost:5000/${student.image_url}`) 
                            : ''} 
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 text-2xl font-bold">
                          {student.name?.split(' ').map(n => n[0]).join('') || '??'}
                        </AvatarFallback>
                      </Avatar>
                      {student.status === 'Active' && (
                        <div className="absolute bottom-0 right-0 w-7 h-7 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <CardContent className="pt-16 pb-6">
                  {/* Student Info */}
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{student.name}</h3>
                    <p className="text-sm text-slate-500 mb-3">ID: {student.student_id}</p>
                    <div className="mb-4">{getStatusBadge(student.status || '')}</div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="text-center">
                        <div className="text-xs text-slate-500">Course</div>
                        <div className="font-medium text-slate-900 text-sm truncate">{student.course}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-slate-500">Admitted</div>
                        <div className="font-medium text-slate-900 text-sm">
                          {student.admission_date 
                            ? new Date(student.admission_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                            : 'N/A'
                          }
                        </div>
                      </div>
                    </div>

                    {/* Performance */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-700">Performance</span>
                        <span className="text-xs font-medium text-blue-600">
                          {student.performance === 'excellent' ? 'A+' : 
                           student.performance === 'good' ? 'B+' : 
                           student.performance === 'average' ? 'C+' : 'N/A'}
                        </span>
                      </div>
                      {getPerformanceIndicator(student.performance || '')}
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Quick Actions */}
                  <div className="grid grid-cols-3 gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 w-full border-slate-300 hover:border-blue-300 hover:bg-blue-50"
                            onClick={async () => {
                              const freshData = await fetchStudentData(student.student_id);
                              if (freshData) {
                                setSelectedStudent(freshData);
                              } else {
                                setSelectedStudent(student);
                              }
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View Profile</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 w-full border-slate-300 hover:border-emerald-300 hover:bg-emerald-50"
                            onClick={async () => {
                              const freshData = await fetchStudentData(student.student_id);
                              if (freshData) {
                                setEditingStudent(freshData);
                                setImagePreview(freshData.image_url || null);
                              } else {
                                setEditingStudent(student);
                                setImagePreview(student.image_url || null);
                              }
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 w-full border-slate-300 hover:border-red-300 hover:bg-red-50"
                            onClick={() => handleDeleteStudent(student.student_id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State for Grid View */}
        {viewMode === "grid" && paginatedStudents.length === 0 && (
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="py-16 text-center">
              <div className="flex flex-col items-center justify-center">
                <Users className="h-20 w-20 text-slate-300 mb-6" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No students found</h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                  Try adjusting your search filters or add new students to get started.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCourse("");
                      setSelectedStatus("");
                    }}
                    className="border-slate-300 hover:bg-slate-100"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear filters
                  </Button>
                  <Button
                    onClick={() => navigate("/admissions")}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add New Student
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pagination for Grid View */}
        {viewMode === "grid" && paginatedStudents.length > 0 && totalPages > 1 && (
          <Card className="mt-6 bg-white border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredStudents.length)} of {filteredStudents.length} results
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="border-slate-300 hover:bg-slate-100"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <Button
                          key={pageNumber}
                          variant={currentPage === pageNumber ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNumber)}
                          className={currentPage === pageNumber 
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600" 
                            : "border-slate-300 hover:bg-slate-100"
                          }
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                    {totalPages > 3 && (
                      <>
                        <span className="text-slate-400 mx-1">...</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(totalPages)}
                          className={currentPage === totalPages 
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600" 
                            : "border-slate-300 hover:bg-slate-100"
                          }
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="border-slate-300 hover:bg-slate-100"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Student Modal */}
      {editingStudent && (
        <Dialog open={!!editingStudent} onOpenChange={() => {
          setEditingStudent(null);
          setImagePreview(null);
          setImageFile(null);
        }}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-slate-200 shadow-2xl">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-slate-900">Edit Student Profile</DialogTitle>
                  <DialogDescription className="text-slate-600">
                    Update student details and profile information
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="academic">Academic</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="guardian">Guardian</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Profile Picture */}
                  <div className="lg:col-span-1">
                    <Card className="border-slate-200">
                      <CardContent className="p-6 flex flex-col items-center">
                        <div className="relative mb-5">
                          <Avatar className="h-40 w-40 ring-4 ring-blue-50 shadow-lg">
                            {imagePreview ? (
                              <AvatarImage src={imagePreview} />
                            ) : editingStudent.image_url ? (
                              <AvatarImage 
                                src={editingStudent.image_url.startsWith('http') 
                                  ? editingStudent.image_url 
                                  : `http://localhost:5000/${editingStudent.image_url}`} 
                              />
                            ) : null}
                            <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 text-3xl font-bold">
                              {editingStudent.name?.split(' ').map(n => n[0]).join('') || '??'}
                            </AvatarFallback>
                          </Avatar>
                          <Label
                            htmlFor="image-upload"
                            className="absolute bottom-2 right-2 p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full cursor-pointer shadow-lg transition-all duration-300 hover:scale-110"
                            title="Upload new photo"
                          >
                            <Camera className="h-4 w-4" />
                          </Label>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </div>
                        
                        <div className="text-center">
                          <h3 className="font-bold text-lg text-slate-900">{editingStudent.name}</h3>
                          <p className="text-sm text-slate-500 mt-1">ID: {editingStudent.student_id}</p>
                          {imageFile && (
                            <div className="mt-3 p-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                              <p className="text-xs text-emerald-700 flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                New image selected
                              </p>
                            </div>
                          )}
                        </div>

                        {imagePreview && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-4 w-full border-slate-300 hover:bg-slate-100"
                            onClick={() => {
                              setImagePreview(null);
                              setImageFile(null);
                            }}
                          >
                            <X className="h-3.5 w-3.5 mr-2" />
                            Remove New Image
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Personal Information Form */}
                  <div className="lg:col-span-2">
                    <Card className="border-slate-200">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5 text-blue-600" />
                          Personal Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="first_name" className="text-slate-700">First Name</Label>
                            <Input
                              id="first_name"
                              value={editingStudent.first_name || ''}
                              onChange={(e) => setEditingStudent({...editingStudent, first_name: e.target.value})}
                              className="border-slate-300 focus:border-blue-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="last_name" className="text-slate-700">Last Name</Label>
                            <Input
                              id="last_name"
                              value={editingStudent.last_name || ''}
                              onChange={(e) => setEditingStudent({...editingStudent, last_name: e.target.value})}
                              className="border-slate-300 focus:border-blue-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="id_number" className="text-slate-700">ID Number</Label>
                            <Input
                              id="id_number"
                              value={editingStudent.id_number || ''}
                              onChange={(e) => setEditingStudent({...editingStudent, id_number: e.target.value})}
                              className="border-slate-300 focus:border-blue-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="nationality" className="text-slate-700">Nationality</Label>
                            <Input
                              id="nationality"
                              value={editingStudent.nationality || ''}
                              onChange={(e) => setEditingStudent({...editingStudent, nationality: e.target.value})}
                              className="border-slate-300 focus:border-blue-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="gender" className="text-slate-700">Gender</Label>
                            <Select
                              value={editingStudent.gender || ''}
                              onValueChange={(value) => setEditingStudent({...editingStudent, gender: value})}
                            >
                              <SelectTrigger className="border-slate-300 focus:border-blue-500">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="age" className="text-slate-700">Age</Label>
                            <Input
                              id="age"
                              type="number"
                              value={editingStudent.age || ''}
                              onChange={(e) => setEditingStudent({...editingStudent, age: e.target.value})}
                              className="border-slate-300 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="academic" className="mt-6">
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      Academic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="course" className="text-slate-700">Course</Label>
                        <Select
                          value={editingStudent.course_id || ''}
                          onValueChange={(value) => setEditingStudent({...editingStudent, course_id: value})}
                        >
                          <SelectTrigger className="border-slate-300 focus:border-blue-500">
                            <SelectValue placeholder="Select course" />
                          </SelectTrigger>
                          <SelectContent>
                            {courses.map(course => (
                              <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status" className="text-slate-700">Status</Label>
                        <Select
                          value={editingStudent.status || ''}
                          onValueChange={(value) => setEditingStudent({...editingStudent, status: value})}
                        >
                          <SelectTrigger className="border-slate-300 focus:border-blue-500">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                            <SelectItem value="Graduated">Graduated</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contact" className="mt-6">
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-blue-600" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-700">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editingStudent.email || ''}
                          onChange={(e) => setEditingStudent({...editingStudent, email: e.target.value})}
                          className="border-slate-300 focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-slate-700">Phone Number</Label>
                        <Input
                          id="phone"
                          value={editingStudent.phone || ''}
                          onChange={(e) => setEditingStudent({...editingStudent, phone: e.target.value})}
                          className="border-slate-300 focus:border-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="address" className="text-slate-700">Address</Label>
                        <Textarea
                          id="address"
                          value={editingStudent.address || ''}
                          onChange={(e) => setEditingStudent({...editingStudent, address: e.target.value})}
                          rows={3}
                          className="border-slate-300 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="guardian" className="mt-6">
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      Guardian Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="guardian_name" className="text-slate-700">Guardian Name</Label>
                        <Input
                          id="guardian_name"
                          value={editingStudent.guardian_name || ''}
                          onChange={(e) => setEditingStudent({...editingStudent, guardian_name: e.target.value})}
                          className="border-slate-300 focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guardian_contact" className="text-slate-700">Guardian Contact</Label>
                        <Input
                          id="guardian_contact"
                          value={editingStudent.guardian_contact || ''}
                          onChange={(e) => setEditingStudent({...editingStudent, guardian_contact: e.target.value})}
                          className="border-slate-300 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <DialogFooter className="gap-2 sm:gap-3 pt-4 border-t border-slate-200">
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditingStudent(null);
                  setImagePreview(null);
                  setImageFile(null);
                }}
                className="border-slate-300 hover:bg-slate-100"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateStudent}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Student Profile Modal */}
      {selectedStudent && (
        <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-slate-200 shadow-2xl">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-slate-900">Student Profile</DialogTitle>
                  <DialogDescription className="text-slate-600">
                    Complete student information and academic details
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              {/* Profile Header */}
              <Card className="border-slate-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/30">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <Avatar className="h-32 w-32 ring-4 ring-white shadow-xl">
                      <AvatarImage 
                        src={selectedStudent.image_url ? 
                          (selectedStudent.image_url.startsWith('http') 
                            ? selectedStudent.image_url 
                            : `http://localhost:5000/${selectedStudent.image_url}`) 
                          : ''} 
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 text-3xl font-bold">
                        {selectedStudent.name?.split(' ').map(n => n[0]).join('') || '??'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-2xl font-bold text-slate-900">{selectedStudent.name}</h3>
                      <p className="text-slate-600 mt-1">Student ID: {selectedStudent.student_id}</p>
                      <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                        {getStatusBadge(selectedStudent.status || '')}
                        <Badge variant="outline" className="text-sm border-slate-300 text-slate-700 bg-white">
                          <BookOpen className="h-3 w-3 mr-1.5" />
                          {selectedStudent.course}
                        </Badge>
                        {selectedStudent.fees_paid ? (
                          <Badge className="bg-emerald-100 text-emerald-700">
                            <CreditCard className="h-3 w-3 mr-1.5" />
                            Fees Paid
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-700">
                            <AlertCircle className="h-3 w-3 mr-1.5" />
                            Fees Pending
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Student Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-600" />
                      Personal Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-slate-500">Gender</p>
                        <p className="text-sm font-medium text-slate-900">{selectedStudent.gender || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500">Age</p>
                        <p className="text-sm font-medium text-slate-900">{selectedStudent.age || 'N/A'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">Nationality</p>
                      <p className="text-sm font-medium text-slate-900">{selectedStudent.nationality || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">ID Number</p>
                      <p className="text-sm font-medium text-slate-900">{selectedStudent.id_number || 'N/A'}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-blue-600" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Mail className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500">Email</p>
                        <p className="text-sm font-medium text-slate-900">{selectedStudent.email || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Phone className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500">Phone</p>
                        <p className="text-sm font-medium text-slate-900">{selectedStudent.phone || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <MapPin className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500">Address</p>
                        <p className="text-sm font-medium text-slate-900">{selectedStudent.address || 'N/A'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      Academic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-slate-500">Course</p>
                      <p className="text-sm font-medium text-slate-900">{selectedStudent.course || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">Admission Date</p>
                      <p className="text-sm font-medium text-slate-900">
                        {selectedStudent.admission_date 
                          ? new Date(selectedStudent.admission_date).toLocaleDateString()
                          : 'N/A'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-2">Performance</p>
                      {getPerformanceIndicator(selectedStudent.performance || '')}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      Guardian Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-slate-500">Guardian Name</p>
                      <p className="text-sm font-medium text-slate-900">{selectedStudent.guardian_name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">Guardian Contact</p>
                      <p className="text-sm font-medium text-slate-900">{selectedStudent.guardian_contact || 'N/A'}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-300 hover:bg-slate-100"
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-300 hover:bg-slate-100"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedStudent(null)}
                    className="border-slate-300 hover:bg-slate-100"
                  >
                    Close
                  </Button>
                  <Button 
                    onClick={() => {
                      setEditingStudent(selectedStudent);
                      setSelectedStudent(null);
                    }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}