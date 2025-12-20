"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  Plus, Clock, Users, DollarSign, BookOpen, AlertTriangle,
  X, Loader2, ArrowLeft, Search, Filter, Calendar, GraduationCap,
  Edit, Trash2, Eye, ChevronDown, BarChart, TrendingUp,
  Star, CheckCircle, MoreVertical, Download, Upload, RefreshCw,
  Home, Settings, Shield, UserCheck, Layers, Target, Zap,
  Printer, List, LayoutGrid, MapPin, User as UserIcon, Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

// --- 1. TypeScript Interfaces ---

interface Department {
  id: number;
  name: string;
  fee_charge?: number;
}

interface Course {
  id: number;
  name: string;
  department: string;
  description: string;
  duration: string;
  fee: number | string;
  capacity: number | string;
  instructor: string;
  startDate: string;
  status: 'Active' | 'Upcoming' | 'Completed' | 'Full';
  department_id: number;
  enrolled: number;
  rating?: number;
  category?: string;
  location?: string;
  endDate?: string;
}

interface CourseFormState {
  name: string;
  department: string;
  description: string;
  duration: string;
  fee: string;
  capacity: string;
  instructor: string;
  startDate: string;
  status: 'Active' | 'Upcoming' | 'Completed';
  department_id: number;
  category: string;
  location: string;
}

interface Stats {
  total: number;
  active: number;
  upcoming: number;
  completed: number;
  totalRevenue: number;
  averageEnrollment: number;
  capacityUtilization: number;
}

// --- 2. Constants and Utilities ---

const initialFormState: CourseFormState = {
  name: "",
  department: "",
  description: "",
  duration: "",
  fee: "",
  capacity: "",
  instructor: "",
  startDate: "",
  status: "Upcoming",
  department_id: 0,
  category: "",
  location: "Online",
};

// UPDATED: Enhanced color branding with consistent palette
const STATUS_CONFIG = {
  Active: {
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle,
    label: "Active",
    iconColor: "text-emerald-600"
  },
  Upcoming: {
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: Calendar,
    label: "Upcoming",
    iconColor: "text-indigo-600"
  },
  Completed: {
    color: "bg-slate-100 text-slate-700 border-slate-200",
    icon: GraduationCap,
    label: "Completed",
    iconColor: "text-slate-600"
  },
  Full: {
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Users,
    label: "Full",
    iconColor: "text-amber-600"
  }
} as const;

// UPDATED: More professional and consistent category colors
const CATEGORY_COLORS = {
  "Marketing": "bg-rose-50 text-rose-700 border-rose-200",
  "Web Development": "bg-violet-50 text-violet-700 border-violet-200",
  "Data Science": "bg-blue-50 text-blue-700 border-blue-200",
  "Business": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Design": "bg-pink-50 text-pink-700 border-pink-200",
  "ICT": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Engineering": "bg-amber-50 text-amber-700 border-amber-200",
  "General": "bg-slate-100 text-slate-700 border-slate-200"
};

// UPDATED: Primary color theme - using indigo as primary brand color
const PRIMARY_COLOR = "indigo";
const PRIMARY_BG = `bg-${PRIMARY_COLOR}-600`;
const PRIMARY_HOVER = `hover:bg-${PRIMARY_COLOR}-700`;
const PRIMARY_LIGHT = `bg-${PRIMARY_COLOR}-50`;
const PRIMARY_TEXT = `text-${PRIMARY_COLOR}-600`;
const PRIMARY_BORDER = `border-${PRIMARY_COLOR}-200`;

// --- 3. Enhanced Components ---

const StatusBadge: React.FC<{ status: 'Active' | 'Upcoming' | 'Completed' | 'Full' }> = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Active;
  const Icon = config.icon;
  
  return (
    <Badge variant="outline" className={`text-xs font-medium px-3 py-1.5 ${config.color}`}>
      <Icon className={`w-3 h-3 mr-1.5 ${config.iconColor}`} />
      {config.label}
    </Badge>
  );
};

const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
  const colorClass = CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.General;
  
  return (
    <Badge variant="outline" className={`text-xs font-medium px-2.5 py-1 ${colorClass}`}>
      <Tag className="w-3 h-3 mr-1.5" />
      {category || "General"}
    </Badge>
  );
};

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= Math.round(rating) 
              ? "fill-amber-400 text-amber-500" 
              : "fill-slate-200 text-slate-200"
          }`}
        />
      ))}
      <span className="text-xs font-medium text-slate-700 ml-1.5">{rating.toFixed(1)}</span>
    </div>
  );
};

// --- 4. Validation Function ---

const validateCourseForm = (course: CourseFormState) => {
  const errors: Record<string, string> = {};

  if (!course.name.trim()) errors.name = "Course Name is required.";
  if (!course.department_id) errors.department_id = "Department is required.";
  if (!course.description.trim() || course.description.trim().length < 10) 
    errors.description = "Description must be at least 10 characters.";
  if (!course.duration.trim()) errors.duration = "Duration is required.";
  
  const fee = Number(course.fee);
  if (isNaN(fee) || fee < 0) errors.fee = "Fee must be a valid non-negative number.";
  
  const capacity = Number(course.capacity);
  if (isNaN(capacity) || !Number.isInteger(capacity) || capacity <= 0) 
    errors.capacity = "Capacity must be a positive whole number.";
  
  if (!course.instructor.trim()) errors.instructor = "Instructor is required.";
  if (!course.startDate) errors.startDate = "Start Date is required.";

  return errors;
};

// --- 5. Main Component ---

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    active: 0,
    upcoming: 0,
    completed: 0,
    totalRevenue: 0,
    averageEnrollment: 0,
    capacityUtilization: 0,
  });
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [newCourse, setNewCourse] = useState<CourseFormState>(initialFormState);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  // Filter State
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const navigate = useNavigate();
  const API_BASE_URL = "http://localhost:5000/api";

  // --- API Fetching ---

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/courses`);
      if (!response.ok) throw new Error("Failed to fetch courses.");
      const data: Course[] = await response.json();
      
      // Process real data from API
      const processedData = data.map(c => ({
        ...c,
        enrolled: c.enrolled ?? 0,
        rating: (Math.random() * 2 + 3), // Random rating 3-5
        category: c.department || "General",
        location: ["Online", "On-campus", "Hybrid"][Math.floor(Math.random() * 3)],
        startDate: c.startDate || new Date().toISOString(),
      }));
      
      setCourses(processedData);
      calculateStats(processedData);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setApiError("Failed to load courses. Check if API server is running.");
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/departments`);
      if (!response.ok) throw new Error("Failed to fetch departments.");
      const data: Department[] = await response.json();
      setDepartments(data);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  }, [API_BASE_URL]);

  const calculateStats = (courseData: Course[]) => {
    const total = courseData.length;
    const active = courseData.filter(c => c.status === 'Active').length;
    const upcoming = courseData.filter(c => c.status === 'Upcoming').length;
    const completed = courseData.filter(c => c.status === 'Completed').length;
    
    const totalRevenue = courseData.reduce((sum, c) => {
      const fee = typeof c.fee === 'string' ? parseFloat(c.fee) : c.fee;
      const enrolled = c.enrolled || 0;
      return sum + (fee * enrolled);
    }, 0);
    
    const totalEnrolled = courseData.reduce((sum, c) => sum + (c.enrolled || 0), 0);
    const totalCapacity = courseData.reduce((sum, c) => {
      const capacity = typeof c.capacity === 'string' ? parseInt(c.capacity) : c.capacity;
      return sum + capacity;
    }, 0);
    
    const averageEnrollment = total > 0 ? totalEnrolled / total : 0;
    const capacityUtilization = totalCapacity > 0 ? (totalEnrolled / totalCapacity) * 100 : 0;
    
    setStats({
      total,
      active,
      upcoming,
      completed,
      totalRevenue,
      averageEnrollment: Math.round(averageEnrollment),
      capacityUtilization: Math.round(capacityUtilization),
    });
  };

  useEffect(() => {
    fetchCourses();
    fetchDepartments();
  }, [fetchCourses, fetchDepartments]);

  // --- Data Filtering ---

  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchesDepartment = 
      selectedDepartment === "all" || course.department_id.toString() === selectedDepartment;

    const matchesStatus = 
      selectedStatus === "all" || course.status === selectedStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // --- CRUD Operations ---

  const handleDeleteCourse = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete course");

      setCourses(courses.filter(c => c.id !== id));
    } catch (err) {
      console.error("❌ Error deleting course:", err);
      setApiError("Failed to delete course. Please try again.");
      fetchCourses();
    }
  };

  const handleSaveCourse = async () => {
    const errors = validateCourseForm(newCourse);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors({});
    setIsSaving(true);
    setApiError(null);

    const payload = {
      ...newCourse,
      fee: Number(newCourse.fee),
      capacity: Number(newCourse.capacity),
      startDate: new Date(newCourse.startDate).toISOString(),
    };

    try {
      const endpoint = editingCourse
        ? `${API_BASE_URL}/courses/${editingCourse.id}`
        : `${API_BASE_URL}/courses`;
      const method = editingCourse ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Failed to ${editingCourse ? 'update' : 'save'} course.`);

      const savedOrUpdatedCourse: Course = await res.json();

      setCourses(prev =>
        editingCourse
          ? prev.map(c => (c.id === savedOrUpdatedCourse.id ? savedOrUpdatedCourse : c))
          : [...prev, savedOrUpdatedCourse]
      );

      setIsModalOpen(false);
      setNewCourse(initialFormState);
      setEditingCourse(null);
    } catch (err) {
      console.error("❌ Error saving course:", err);
      setApiError(`Failed to save course: ${editingCourse ? 'Update' : 'Creation'} error. Ensure all fields are correct and API is running.`);
    } finally {
      setIsSaving(false);
    }
  };

  // --- Modal Management Functions ---

  const handleOpenModal = (courseToEdit: Course | null = null) => {
    setEditingCourse(courseToEdit);
    setValidationErrors({});
    if (courseToEdit) {
      setNewCourse({
        name: courseToEdit.name,
        department: courseToEdit.department,
        description: courseToEdit.description,
        duration: courseToEdit.duration,
        fee: courseToEdit.fee.toString(),
        capacity: courseToEdit.capacity.toString(),
        instructor: courseToEdit.instructor,
        startDate: courseToEdit.startDate ? new Date(courseToEdit.startDate).toISOString().split('T')[0] : "",
        status: courseToEdit.status,
        department_id: courseToEdit.department_id,
        category: courseToEdit.category || "",
        location: courseToEdit.location || "Online",
      });
    } else {
      setNewCourse(initialFormState);
    }
    setIsModalOpen(true);
  };
  
  const handleDepartmentChange = (deptIdString: string) => {
    const deptId = Number(deptIdString);
    const selectedDept = departments.find((d) => d.id === deptId);

    setNewCourse(prev => ({
      ...prev,
      department_id: deptId,
      department: selectedDept?.name || "",
      fee: selectedDept?.fee_charge ? selectedDept.fee_charge.toString() : prev.fee,
    }));
    setValidationErrors(prev => ({ ...prev, department_id: '' }));
  };

  // --- Export Function ---
  const exportCourses = () => {
    const csvContent = [
      ['Name', 'Department', 'Instructor', 'Fee', 'Capacity', 'Enrolled', 'Status', 'Start Date'],
      ...filteredCourses.map(c => [
        c.name,
        c.department,
        c.instructor,
        c.fee,
        c.capacity,
        c.enrolled,
        c.status,
        c.startDate,
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `courses-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  // --- Format Date Function ---
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  // --- Render Functions ---

  const LoadingState = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array(6).fill(0).map((_, i) => (
        <Card key={i} className="overflow-hidden border border-slate-200">
          <CardContent className="p-6">
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-3" />
            <Skeleton className="h-4 w-full mb-3" />
            <div className="flex gap-3 mt-6">
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="h-9 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-16 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/50">
      <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-6" />
      <h3 className="text-xl font-semibold text-slate-900 mb-3">No Courses Found</h3>
      <p className="text-slate-600 mb-8 max-w-md mx-auto">
        {searchTerm ? `No courses match "${searchTerm}". Try adjusting your search.` : 'Get started by adding your first course to build your curriculum.'}
      </p>
      <Button 
        onClick={() => handleOpenModal()} 
        className={`${PRIMARY_BG} ${PRIMARY_HOVER} text-white px-6`}
      >
        <Plus className="h-4 w-4 mr-2" /> Add Course
      </Button>
    </div>
  );

  // --- Course Card Component ---
  const CourseCard = ({ course }: { course: Course }) => {
    const enrollmentPercentage = ((course.enrolled || 0) / Number(course.capacity)) * 100;
    
    return (
      <Card className="group hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-indigo-300 overflow-hidden">
        <CardContent className="p-6">
          {/* Header with badges */}
          <div className="flex justify-between items-start mb-4">
            <CategoryBadge category={course.department || "General"} />
            <StatusBadge status={course.status} />
          </div>

          {/* Course Title */}
          <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 min-h-[56px]">
            {course.name}
          </h3>

          {/* Course Description */}
          <p className="text-sm text-slate-600 mb-4 line-clamp-3 min-h-[60px]">
            {course.description}
          </p>

          {/* Instructor & Duration */}
          <div className="flex items-center justify-between text-sm mb-4">
            <div className="flex items-center text-slate-700">
              <UserIcon className="w-4 h-4 mr-2 text-slate-400" />
              <span className="font-medium truncate max-w-[140px]">{course.instructor}</span>
            </div>
            <div className="flex items-center text-slate-700">
              <Clock className="w-4 h-4 mr-2 text-slate-400" />
              <span>{course.duration}</span>
            </div>
          </div>

          {/* Fee and Location */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <div className="text-xs text-slate-500">Fee</div>
              <div className="font-bold text-emerald-700">
                Ksh {Number(course.fee).toLocaleString()}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-slate-500">Location</div>
              <div className="flex items-center font-medium text-slate-900">
                <MapPin className="w-4 h-4 mr-1.5 text-slate-400" />
                {course.location || "Online"}
              </div>
            </div>
          </div>

          {/* Enrollment Progress */}
          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700">Enrollment</span>
              <span className="text-sm font-bold text-slate-900">
                {course.enrolled}/{course.capacity}
              </span>
            </div>
            <div className="space-y-2">
              <Progress
                value={enrollmentPercentage}
                className="h-2 bg-slate-100"
              />
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">
                  {Math.round(enrollmentPercentage)}% full
                </span>
                {course.rating && <RatingStars rating={course.rating} />}
              </div>
            </div>
          </div>

          {/* Start Date */}
          <div className="flex items-center justify-between text-sm mb-6">
            <div className="flex items-center text-slate-700">
              <Calendar className="w-4 h-4 mr-2 text-slate-400" />
              <span>Starts</span>
            </div>
            <span className="font-medium text-slate-900">
              {formatDate(course.startDate)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-slate-300 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
              onClick={() => {/* Add view details */}}
            >
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-slate-300 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
              onClick={() => handleOpenModal(course)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="px-3 border-slate-300 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
              onClick={() => handleDeleteCourse(course.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Course Catalog</h1>
              <p className="text-slate-600 mt-2">
                Manage all course offerings, schedules, and enrollment capacities
              </p>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate("/departments/management")}
                className="border-slate-300 hover:bg-slate-100 text-slate-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Departments
              </Button>
              
              <Button
                onClick={() => handleOpenModal()}
                className={`${PRIMARY_BG} ${PRIMARY_HOVER} text-white`}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Course
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="border border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Courses</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{stats.total}</p>
                  </div>
                  <div className="p-3 bg-indigo-100 rounded-xl">
                    <BookOpen className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Active Courses</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{stats.active}</p>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-xl">
                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">
                      Ksh {stats.totalRevenue.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-xl">
                    <DollarSign className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Avg. Enrollment</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{stats.averageEnrollment}</p>
                  </div>
                  <div className="p-3 bg-violet-100 rounded-xl">
                    <Users className="h-6 w-6 text-violet-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="border border-slate-200 mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search courses by name, department, or instructor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-slate-300 focus:border-indigo-300"
                  />
                </div>

                {/* Filters and Controls */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* View Toggle */}
                  <div className="flex items-center bg-slate-100 rounded-lg p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className={`h-8 px-3 rounded ${viewMode === "list" ? "bg-white shadow-sm text-slate-900" : "text-slate-600 hover:text-slate-900"}`}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className={`h-8 px-3 rounded ${viewMode === "grid" ? "bg-white shadow-sm text-slate-900" : "text-slate-600 hover:text-slate-900"}`}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Department Filter */}
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-[180px] border-slate-300 focus:border-indigo-300">
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map(dept => (
                        <SelectItem key={dept.id} value={dept.id.toString()}>{dept.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Status Filter */}
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[140px] border-slate-300 focus:border-indigo-300">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Upcoming">Upcoming</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Clear Filters */}
                  {(searchTerm || selectedDepartment !== "all" || selectedStatus !== "all") && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedDepartment("all");
                        setSelectedStatus("all");
                      }}
                      className="border-slate-300 hover:bg-slate-100 text-slate-700"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Course Directory</h2>
            <p className="text-slate-600">
              Showing {filteredCourses.length} of {courses.length} courses
            </p>
          </div>
          <div className="flex items-center gap-4">
            {apiError && (
              <div className="flex items-center text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <span>{apiError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content - Dynamic Views */}
        {loading ? (
          <LoadingState />
        ) : filteredCourses.length === 0 ? (
          <EmptyState />
        ) : viewMode === "grid" ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          /* List View */
          <Card className="border border-slate-200">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr className="border-b border-slate-200">
                      <th className="text-left font-semibold text-slate-700 py-3 pl-6">Course</th>
                      <th className="text-left font-semibold text-slate-700 py-3">Department</th>
                      <th className="text-left font-semibold text-slate-700 py-3">Instructor</th>
                      <th className="text-left font-semibold text-slate-700 py-3">Fee</th>
                      <th className="text-left font-semibold text-slate-700 py-3">Enrollment</th>
                      <th className="text-left font-semibold text-slate-700 py-3">Status</th>
                      <th className="text-left font-semibold text-slate-700 py-3 pr-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.map((course) => (
                      <tr key={course.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-4 pl-6">
                          <div>
                            <div className="font-semibold text-slate-900">{course.name}</div>
                            <div className="text-sm text-slate-500 mt-1">{course.duration}</div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="font-medium text-slate-900">{course.department}</div>
                        </td>
                        <td className="py-4">
                          <div className="font-medium text-slate-900">{course.instructor}</div>
                        </td>
                        <td className="py-4">
                          <div className="font-bold text-emerald-700">
                            Ksh {Number(course.fee).toLocaleString()}
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-700">{course.enrolled}/{course.capacity}</span>
                              <span className="font-medium text-slate-900">
                                {Math.round(((course.enrolled || 0) / Number(course.capacity)) * 100)}%
                              </span>
                            </div>
                            <Progress
                              value={((course.enrolled || 0) / Number(course.capacity)) * 100}
                              className="h-2 bg-slate-100"
                            />
                          </div>
                        </td>
                        <td className="py-4">
                          <StatusBadge status={course.status} />
                        </td>
                        <td className="py-4 pr-6">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenModal(course)}
                              className="h-8 w-8 p-0 hover:bg-emerald-100 hover:text-emerald-700"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCourse(course.id)}
                              className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Course Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">
              {editingCourse ? "Edit Course" : "Create New Course"}
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              {editingCourse ? "Update the course details below." : "Fill in the details to create a new course."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Department Select */}
            <div className="space-y-2">
              <Label htmlFor="department_id" className="text-slate-700">Department *</Label>
              <Select 
                value={newCourse.department_id.toString()}
                onValueChange={handleDepartmentChange}
                disabled={isSaving}
              >
                <SelectTrigger 
                  id="department_id" 
                  className={`border-slate-300 focus:border-indigo-300 ${validationErrors.department_id ? 'border-red-500' : ''}`}
                >
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.department_id && <p className="text-sm text-red-500">{validationErrors.department_id}</p>}
            </div>

            {/* Course Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700">Course Name *</Label>
              <Input
                id="name"
                value={newCourse.name}
                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                className={`border-slate-300 focus:border-indigo-300 ${validationErrors.name ? 'border-red-500' : ''}`}
                disabled={isSaving}
                placeholder="Enter course name"
              />
              {validationErrors.name && <p className="text-sm text-red-500">{validationErrors.name}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-700">Description *</Label>
              <Textarea
                id="description"
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                className={`border-slate-300 focus:border-indigo-300 ${validationErrors.description ? 'border-red-500' : ''}`}
                rows={4}
                placeholder="Provide a detailed description of the course..."
                disabled={isSaving}
              />
              {validationErrors.description && <p className="text-sm text-red-500">{validationErrors.description}</p>}
            </div>

            {/* Grid: Instructor, Duration, Fee, Capacity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instructor" className="text-slate-700">Instructor *</Label>
                <Input
                  id="instructor"
                  value={newCourse.instructor}
                  onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                  className={`border-slate-300 focus:border-indigo-300 ${validationErrors.instructor ? 'border-red-500' : ''}`}
                  disabled={isSaving}
                  placeholder="Instructor name"
                />
                {validationErrors.instructor && <p className="text-sm text-red-500">{validationErrors.instructor}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="text-slate-700">Duration *</Label>
                <Input
                  id="duration"
                  value={newCourse.duration}
                  onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                  className={`border-slate-300 focus:border-indigo-300 ${validationErrors.duration ? 'border-red-500' : ''}`}
                  disabled={isSaving}
                  placeholder="e.g., 3 months"
                />
                {validationErrors.duration && <p className="text-sm text-red-500">{validationErrors.duration}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fee" className="text-slate-700">Fee (Ksh) *</Label>
                <Input
                  id="fee"
                  type="number"
                  value={newCourse.fee}
                  onChange={(e) => setNewCourse({ ...newCourse, fee: e.target.value })}
                  className={`border-slate-300 focus:border-indigo-300 ${validationErrors.fee ? 'border-red-500' : ''}`}
                  disabled={isSaving}
                  placeholder="Course fee"
                />
                {validationErrors.fee && <p className="text-sm text-red-500">{validationErrors.fee}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity" className="text-slate-700">Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={newCourse.capacity}
                  onChange={(e) => setNewCourse({ ...newCourse, capacity: e.target.value })}
                  className={`border-slate-300 focus:border-indigo-300 ${validationErrors.capacity ? 'border-red-500' : ''}`}
                  disabled={isSaving}
                  placeholder="Maximum students"
                />
                {validationErrors.capacity && <p className="text-sm text-red-500">{validationErrors.capacity}</p>}
              </div>
            </div>

            {/* Grid: Start Date, Status, Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-slate-700">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newCourse.startDate}
                  onChange={(e) => setNewCourse({ ...newCourse, startDate: e.target.value })}
                  className={`border-slate-300 focus:border-indigo-300 ${validationErrors.startDate ? 'border-red-500' : ''}`}
                  disabled={isSaving}
                />
                {validationErrors.startDate && <p className="text-sm text-red-500">{validationErrors.startDate}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-slate-700">Status</Label>
                <Select
                  value={newCourse.status}
                  onValueChange={(value: 'Active' | 'Upcoming' | 'Completed') => 
                    setNewCourse({ ...newCourse, status: value })
                  }
                  disabled={isSaving}
                >
                  <SelectTrigger id="status" className="border-slate-300 focus:border-indigo-300">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Upcoming">Upcoming</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-slate-700">Location</Label>
                <Select
                  value={newCourse.location}
                  onValueChange={(value) => setNewCourse({ ...newCourse, location: value })}
                  disabled={isSaving}
                >
                  <SelectTrigger id="location" className="border-slate-300 focus:border-indigo-300">
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="On-campus">On-campus</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsModalOpen(false)} 
              disabled={isSaving}
              className="border-slate-300 hover:bg-slate-100 text-slate-700"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveCourse} 
              disabled={isSaving}
              className={`${PRIMARY_BG} ${PRIMARY_HOVER} text-white`}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingCourse ? "Update Course" : "Create Course"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}