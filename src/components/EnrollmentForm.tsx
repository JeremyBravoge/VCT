"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox"; // Assuming a Checkbox component for UI
import { Loader2, User, BookOpen, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast"; // Assuming availability of useToast

// --- Interfaces for Type Safety ---
interface DropdownItem {
  id: string | number;
  name?: string;
  title?: string;
  intake_name?: string;
  year?: number;
}

interface Student {
  student_id: string;
  first_name: string;
  last_name: string;
  branch_id: string;
}

interface FormData {
  student_id: string;
  first_name: string;
  last_name: string;
  course_id: string;
  level_id: string;
  module_ids: (string | number)[];
  intake_id: string;
  branch_id: string;
}

export default function EnrollmentForm() {
  const { toast } = useToast();
  
  // --- State Management ---
  const [courses, setCourses] = useState<DropdownItem[]>([]);
  const [levels, setLevels] = useState<DropdownItem[]>([]);
  const [modules, setModules] = useState<DropdownItem[]>([]);
  const [intakes, setIntakes] = useState<DropdownItem[]>([]);
  const [branches, setBranches] = useState<DropdownItem[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(true);
  const [isLoadingModules, setIsLoadingModules] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    student_id: "",
    first_name: "",
    last_name: "",
    course_id: "",
    level_id: "",
    module_ids: [],
    intake_id: "",
    branch_id: "",
  });

  // --- API Fetch Functions ---

  // 1. Fetch initial dropdown data (once)
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoadingDropdowns(true);
      try {
        const [courseRes, levelRes, intakeRes, branchRes, studentRes] = await Promise.all([
          fetch("/api/courses"),
          fetch("/api/levels"),
          fetch("/api/intakes"),
          fetch("/api/branches"),
          fetch("/api/students"),
        ]);

        setCourses((await courseRes.json()) || []);
        setLevels((await levelRes.json()) || []);
        setIntakes((await intakeRes.json()) || []);
        setBranches((await branchRes.json()) || []);
        setStudents((await studentRes.json()) || []);

      } catch (err) {
        toast({
          title: "Error Loading Data",
          description: "Could not fetch all dropdown lists. Check server connection.",
          variant: "destructive",
        });
        console.error("Initial data fetch error:", err);
      } finally {
        setIsLoadingDropdowns(false);
      }
    };
    fetchInitialData();
  }, [toast]);

  // 2. Fetch modules based on student, course, and level
  useEffect(() => {
    const { student_id, course_id, level_id } = formData;
    if (student_id && course_id && level_id) {
      setIsLoadingModules(true);
      setModules([]); // Clear old modules

      const fetchModules = async () => {
        try {
          // Fetch all modules for the selected course and level
          const allModulesRes = await fetch(`/api/modules/${course_id}/${level_id}`);
          const allModules = (await allModulesRes.json()) || [];

          // Fetch already enrolled modules for this student
          const enrolledModulesRes = await fetch(`/api/student-modules/${student_id}/${course_id}/${level_id}`);
          const enrolledModules = (await enrolledModulesRes.json()) || [];

          // Filter out already enrolled modules
          const enrolledModuleIds = enrolledModules.map((m: any) => m.module_id);
          const availableModules = allModules.filter((m: any) => !enrolledModuleIds.includes(m.id));
          
          setModules(availableModules);
          
          if (availableModules.length === 0) {
            toast({
                title: "All Modules Enrolled",
                description: "This student is already enrolled in all modules for this course and level.",
                variant: "default",
            });
          }

        } catch (err) {
          toast({
            title: "Module Fetch Error",
            description: "Could not fetch available modules.",
            variant: "destructive",
          });
          setModules([]);
          console.error("Module fetch error:", err);
        } finally {
          setIsLoadingModules(false);
        }
      };

      fetchModules();
    } else {
        setModules([]);
    }
  }, [formData.student_id, formData.course_id, formData.level_id, toast]);

  // --- Handlers ---

  const handleStudentSelect = async (studentId: string) => {
    setFormData((prev) => ({ ...prev, student_id: studentId, branch_id: "" })); // Clear branch_id temporarily
    try {
        const res = await fetch(`/api/students/${studentId}`);
        if (!res.ok) throw new Error("Failed to fetch student details");
        const student: Student = await res.json();
        
        setFormData((prev) => ({
            ...prev,
            student_id: studentId,
            first_name: student.first_name || "",
            last_name: student.last_name || "",
            branch_id: student.branch_id || prev.branch_id, // Use fetched branch if available
        }));

    } catch (err) {
        toast({
            title: "Student Data Error",
            description: "Could not pre-fill student names.",
            variant: "warning",
        });
        console.error("Error fetching student:", err);
    }
  };

  const handleModuleToggle = (moduleId: number | string, checked: boolean) => {
    setFormData((prev) => {
      const currentModules = prev.module_ids;
      return {
        ...prev,
        module_ids: checked
          ? [...currentModules, moduleId]
          : currentModules.filter((id) => id !== moduleId),
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.student_id || !formData.course_id || !formData.level_id || !formData.intake_id || !formData.branch_id) {
        toast({
            title: "Validation Error",
            description: "Please ensure Student, Course, Level, Intake, and Branch are selected.",
            variant: "destructive",
        });
        return;
    }
    
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/enrollments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Enrollment failed on the server.");
      }

      toast({
        title: "Enrollment Successful!",
        description: data.message || "Student was successfully enrolled in the selected modules.",
        action: <CheckCircle className="h-5 w-5 text-green-500" />,
      });

      // Reset form after submission
      setFormData({
        student_id: "",
        first_name: "",
        last_name: "",
        course_id: "",
        level_id: "",
        module_ids: [],
        intake_id: "",
        branch_id: "",
      });

    } catch (err) {
      console.error("Enrollment error:", err);
      toast({
        title: "Enrollment Failed",
        description: (err as Error).message || "An unexpected error occurred during enrollment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingDropdowns) {
    return (
        <div className="max-w-3xl mx-auto mt-10 p-12 text-center border-2 border-dashed border-gray-200 rounded-xl bg-white shadow-lg">
            <Loader2 className="h-8 w-8 text-blue-500 mx-auto mb-4 animate-spin"/>
            <h3 className="text-xl font-medium text-gray-900">Loading Enrollment Resources...</h3>
            <p className="text-gray-500">Fetching courses, levels, and student lists from the server.</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-10">
        <Card className="max-w-4xl mx-auto shadow-2xl border-t-4 border-blue-600">
            <CardHeader className="p-6">
                <CardTitle className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
                    <User className="h-6 w-6 text-blue-600"/>
                    Student Course Enrollment
                </CardTitle>
                <CardDescription className="text-gray-500">
                    Register a student to a specific course, level, and assign modules.
                </CardDescription>
            </CardHeader>

            <CardContent className="p-6 pt-0">
                <form className="space-y-8" onSubmit={handleSubmit}>
                    
                    {/* SECTION 1: STUDENT & PERSONAL DETAILS */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
                           <User className="h-5 w-5"/> Student Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Student ID */}
                            <div className="md:col-span-1">
                                <Label htmlFor="student_id">Student ID / Name (Required)</Label>
                                <Select onValueChange={handleStudentSelect} value={formData.student_id}>
                                    <SelectTrigger id="student_id">
                                        <SelectValue placeholder="Select student ID" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {students.map((s: any) => (
                                            <SelectItem key={s.student_id} value={String(s.student_id)}>
                                                {s.student_id} - {s.first_name} {s.last_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            {/* First Name (Read-only/Pre-filled) */}
                            <div>
                                <Label>First Name</Label>
                                <Input value={formData.first_name} disabled placeholder="Pre-filled" />
                            </div>

                            {/* Last Name (Read-only/Pre-filled) */}
                            <div>
                                <Label>Last Name</Label>
                                <Input value={formData.last_name} disabled placeholder="Pre-filled" />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: COURSE & ACADEMIC DETAILS */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
                            <BookOpen className="h-5 w-5"/> Academic Placement
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Course */}
                            <div>
                                <Label htmlFor="course">Course (Required)</Label>
                                <Select
                                    onValueChange={(value) => setFormData({ ...formData, course_id: value, level_id: "", module_ids: [] })}
                                    value={formData.course_id}
                                >
                                    <SelectTrigger id="course">
                                        <SelectValue placeholder="Select course" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {courses.map((c: any) => (
                                            <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Level */}
                            <div>
                                <Label htmlFor="level">Level (Required)</Label>
                                <Select
                                    onValueChange={(value) => setFormData({ ...formData, level_id: value, module_ids: [] })}
                                    value={formData.level_id}
                                    disabled={!formData.course_id}
                                >
                                    <SelectTrigger id="level">
                                        <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {levels.map((lvl: any) => (
                                            <SelectItem key={lvl.id} value={String(lvl.id)}>{lvl.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Intake */}
                            <div>
                                <Label htmlFor="intake">Intake (Required)</Label>
                                <Select
                                    onValueChange={(value) => setFormData({ ...formData, intake_id: value })}
                                    value={formData.intake_id}
                                >
                                    <SelectTrigger id="intake">
                                        <SelectValue placeholder="Select intake" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {intakes.map((i: any) => (
                                            <SelectItem key={i.id} value={String(i.id)}>
                                                {i.intake_name} - {i.year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: MODULES & BRANCH */}
                    <div className="space-y-4">
                         <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
                            <Clock className="h-5 w-5"/> Module Assignment & Location
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            
                            {/* Branch */}
                            <div className="md:col-span-1">
                                <Label htmlFor="branch">Branch (Required)</Label>
                                <Select
                                    onValueChange={(value) => setFormData({ ...formData, branch_id: value })}
                                    value={formData.branch_id}
                                >
                                    <SelectTrigger id="branch">
                                        <SelectValue placeholder="Select branch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {branches.map((b: any) => (
                                            <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Modules */}
                            <div className="md:col-span-2">
                                <Label>Modules to Enroll</Label>
                                <div className="p-3 border rounded-lg min-h-[100px] bg-gray-50/50">
                                    {!formData.course_id || !formData.level_id ? (
                                        <p className="text-gray-400 text-sm italic">
                                            Select a Course and Level above to view required modules.
                                        </p>
                                    ) : isLoadingModules ? (
                                        <div className="flex items-center text-blue-500">
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin"/> Loading modules...
                                        </div>
                                    ) : modules.length === 0 ? (
                                        <div className="flex items-center text-amber-600">
                                            <AlertTriangle className="h-4 w-4 mr-2"/> No available modules to enroll.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
                                            {modules.map((m: any) => (
                                                <div key={m.id} className="flex items-center gap-2">
                                                    <Checkbox
                                                        id={`module-${m.id}`}
                                                        checked={formData.module_ids.includes(m.id)}
                                                        onCheckedChange={(checked: boolean) => handleModuleToggle(m.id, checked)}
                                                    />
                                                    <Label htmlFor={`module-${m.id}`} className="font-normal cursor-pointer text-sm">
                                                        {m.title}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* SUBMIT BUTTON */}
                    <Button 
                        type="submit" 
                        className="w-full text-lg py-3 bg-blue-600 hover:bg-blue-700 transition-colors"
                        disabled={isSubmitting || isLoadingDropdowns || isLoadingModules}
                    >
                        {isSubmitting ? (
                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Enrolling Student...</>
                        ) : (
                            "Finalize Enrollment"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}