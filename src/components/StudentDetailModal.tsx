import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ Don't forget this import
import { Plus, Search, MoreHorizontal, Edit, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { StudentDetailModal } from "@/components/students/StudentDetailModal";
import AdmissionsPage from "@/components/AdmissionsPage";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Students() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const itemsPerPage = 5;
  const [departments, setDepartments] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [showAdmissionForm, setShowAdmissionForm] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});



  // Fetch students from API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/students"); 
        setStudents(response.data);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

useEffect(() => {
  axios.get("http://localhost:5000/api/courses")
    .then(res => setCourses(res.data));

  axios.get("http://localhost:5000/api/departments")
    .then(res => {
      // If your API returns { departments: [...] }
      setDepartments(res.data.departments || []); 
    });

  axios.get("http://localhost:5000/api/branches")
    .then(res => setBranches(res.data || []));
}, []);

const validateStudent = (student: any) => {
  const newErrors: { [key: string]: string } = {};

  if (!student.first_name?.trim()) newErrors.first_name = "First name is required";
  if (!student.last_name?.trim()) newErrors.last_name = "Last name is required";
  if (!student.id_number?.trim()) newErrors.id_number = "ID number is required";
  if (!student.date_of_birth) newErrors.date_of_birth = "Date of birth is required";
  if (!student.gender) newErrors.gender = "Gender is required";
  if (!student.email?.trim()) newErrors.email = "Email is required";
  if (!student.phone?.trim()) newErrors.phone = "Phone is required";
  if (!student.address?.trim()) newErrors.address = "Address is required";
  if (!student.county?.trim()) newErrors.county = "County is required";
  if (!student.nationality?.trim()) newErrors.nationality = "Nationality is required";
  if (!student.guardian_name?.trim()) newErrors.guardian_name = "Guardian name is required";
  if (!student.guardian_contact?.trim()) newErrors.guardian_contact = "Guardian contact is required";
  if (!student.course_id) newErrors.course_id = "Course is required";
  if (!student.branch_id) newErrors.branch_id = "Branch is required";
  if (!student.admission_date) newErrors.admission_date = "Admission date is required";
  if (!student.status) newErrors.status = "Status is required";

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};



const handleDeleteStudent = async (studentId: string) => {
  if (!confirm("Are you sure you want to delete this student?")) return;
  try {
    await axios.delete(`http://localhost:5000/api/students/${studentId}`);
    setStudents(prev => prev.filter(s => s.student_id !== studentId));
    alert("Student deleted successfully");
  } catch (err) {
    console.error(err);
    alert("Failed to delete student");
  }
};




// Handle edit
const handleEditStudent = (student: any) => {
  // Open modal prefilled for edit
  setSelectedStudent(student);
  // You can add a flag in your modal to switch to edit mode
};
const calculateAge = (dob: string) => {
  const birthDate = new Date(dob);
  const diff = Date.now() - birthDate.getTime();
  return new Date(diff).getUTCFullYear() - 1970;
};

const handleSaveEdit = async () => {
  try {
    await axios.put(`http://localhost:5000/api/students/${editingStudent.id}`, editingStudent);
    setStudents(prev => prev.map(s => s.id === editingStudent.id ? editingStudent : s));
    setEditingStudent(null);
    alert("Student updated successfully");
  } catch (err) {
    console.error(err);
    alert("Failed to update student");
  }
};


const [editingStudent, setEditingStudent] = useState<any | null>(null);



  // Badge helpers
  const getStatusBadge = (status: string) =>
    status === "Active" ? <Badge className="bg-accent/10 text-accent">Active</Badge> 
                        : <Badge variant="secondary">Inactive</Badge>;

  const getFeesBadge = (paid: boolean) =>
    paid ? <Badge className="bg-accent/10 text-accent">Paid</Badge> 
         : <Badge className="bg-warning/10 text-warning">Pending</Badge>;

  const getPerformanceBadge = (performance: string) => {
    const variants = {
      Excellent: "bg-excellent text-excellent",
      Good: "bg-good text-good",
      Average: "bg-average text-average",
      Poor: "bg-poor text-poor",
    };
    return <Badge className={variants[performance as keyof typeof variants] || "bg-muted text-muted-foreground"}>{performance}</Badge>;
  };

// Filters
const filteredStudents = students.filter(student => {
  const matchesSearch =
    (student.name ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.id ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.course ?? "").toLowerCase().includes(searchTerm.toLowerCase());

  const matchesDepartment =
    !selectedDepartment || student.department === selectedDepartment;

  const matchesStatus =
    !selectedStatus || student.status === selectedStatus;

  return matchesSearch && matchesDepartment && matchesStatus;
});


  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);
  const departmentFilters = [...new Set(students.map(s => s.department))];
  const statuses = [...new Set(students.map(s => s.status))];

  
  

  return (
<div className="space-y-6">
  {/* Header */}
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <div>
      <h1 className="text-3xl font-bold text-gradient-primary">Students</h1>
      <p className="text-muted-foreground">Manage student records and information</p>
    </div>
    <Button 
      onClick={() => navigate("/AdmissionsPage")}
      className="bg-gradient-to-r from-primary to-accent text-white shadow-md hover:scale-105 transition-transform flex items-center"
    >
      <Plus className="h-4 w-4 mr-2" />
      Add Student
    </Button>
  </div>

  {/* Filters */}
  <Card className="shadow-lg border border-gray-200 bg-white">
    <CardContent className="p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 border border-gray-300 focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>
        <Select value={selectedDepartment || "all"} onValueChange={(value) => {
          setSelectedDepartment(value === "all" ? "" : value);
          setCurrentPage(1);
        }}>
          <SelectTrigger className="w-48 border border-gray-300 focus:ring-2 focus:ring-primary/50">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map(dept => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedStatus || "all"} onValueChange={(value) => {
          setSelectedStatus(value === "all" ? "" : value);
          setCurrentPage(1);
        }}>
          <SelectTrigger className="w-32 border border-gray-300 focus:ring-2 focus:ring-primary/50">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statuses.map(status => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </CardContent>
  </Card>

  {/* Students Table */}
  <Card className="shadow-lg border border-gray-200 bg-white">
    <CardHeader>
      <CardTitle className="text-lg font-semibold text-foreground">
        Student Records ({filteredStudents.length} of {students.length})
      </CardTitle>
    </CardHeader>
    <CardContent>
      <Table className="border-separate border-spacing-0 rounded-lg overflow-hidden">
        <TableHeader className="bg-gradient-to-r from-primary/20 to-accent/20">
          <TableRow>
            <TableHead className="text-left">Student</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Admission Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Fees</TableHead>
            <TableHead>Performance</TableHead>
            <TableHead className="w-[50px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedStudents.map((student) => (
            <TableRow key={student.student_id} className="hover:bg-primary/10 transition-colors">
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-9 w-9 ring-2 ring-primary/30 shadow-sm">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {(student.name ?? "").split(" ").map((n: string) => n[0]).join("") || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.id}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-medium">{student.course}</TableCell>
              <TableCell className="text-muted-foreground">{student.department}</TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(student.admission_date).toLocaleDateString()}
              </TableCell>
              <TableCell>{getStatusBadge(student.status)}</TableCell>
              <TableCell>
                {student.feesPending && parseFloat(student.feesPending) > 0
                  ? <Badge className="bg-warning/20 text-warning font-semibold">Pending</Badge>
                  : <Badge className="bg-accent/20 text-accent font-semibold">Paid</Badge>}
              </TableCell>
              <TableCell>{getPerformanceBadge(student.performance)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-2 hover:bg-primary/10 transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="shadow-lg border border-gray-200 rounded-md">
                    <DropdownMenuItem onClick={() => setSelectedStudent(student)}> 
                      <Eye className="h-4 w-4 mr-2 text-primary" />
                      View Details 
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setEditingStudent(student)}>
                      <Edit className="h-4 w-4 mr-2 text-accent" />
                      Edit Student
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDeleteStudent(student.student_id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 text-sm text-muted-foreground">
          <p>
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredStudents.length)} of {filteredStudents.length} results
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </CardContent>
  </Card>
      

{/* Edit Student Modal */}
{editingStudent && (
  <Dialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Student</DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-4">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <Input
            value={editingStudent.first_name || ""}
            onChange={(e) =>
              setEditingStudent({ ...editingStudent, first_name: e.target.value })
            }
          />
          {errors.first_name && <p className="text-red-500 text-xs">{errors.first_name}</p>}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <Input
            value={editingStudent.last_name || ""}
            onChange={(e) =>
              setEditingStudent({ ...editingStudent, last_name: e.target.value })
            }
          />
          {errors.last_name && <p className="text-red-500 text-xs">{errors.last_name}</p>}
        </div>

        {/* ID Number */}
        <div>
          <label className="block text-sm font-medium mb-1">ID Number</label>
          <Input
            value={editingStudent.id_number || ""}
            onChange={(e) =>
              setEditingStudent({ ...editingStudent, id_number: e.target.value })
            }
          />
          {errors.id_number && <p className="text-red-500 text-xs">{errors.id_number}</p>}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium mb-1">Date of Birth</label>
          <Input
            type="date"
            value={editingStudent.date_of_birth?.split("T")[0] || ""}
            onChange={(e) =>
              setEditingStudent({
                ...editingStudent,
                date_of_birth: e.target.value,
              })
            }
          />
          {errors.date_of_birth && <p className="text-red-500 text-xs">{errors.date_of_birth}</p>}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select
            className="border rounded p-2 w-full"
            value={editingStudent.gender || ""}
            onChange={(e) =>
              setEditingStudent({ ...editingStudent, gender: e.target.value })
            }
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <p className="text-red-500 text-xs">{errors.gender}</p>}
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-medium mb-1">Age</label>
          <Input
            type="number"
            value={editingStudent.age || ""}
            onChange={(e) =>
              setEditingStudent({ ...editingStudent, age: e.target.value })
            }
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            value={editingStudent.email || ""}
            onChange={(e) =>
              setEditingStudent({ ...editingStudent, email: e.target.value })
            }
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <Input
            value={editingStudent.phone || ""}
            onChange={(e) =>
              setEditingStudent({ ...editingStudent, phone: e.target.value })
            }
          />
          {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <Input
            value={editingStudent.address || ""}
            onChange={(e) =>
              setEditingStudent({ ...editingStudent, address: e.target.value })
            }
          />
          {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
        </div>

        {/* County */}
        <div>
          <label className="block text-sm font-medium mb-1">County</label>
          <Input
            value={editingStudent.county || ""}
            onChange={(e) =>
              setEditingStudent({ ...editingStudent, county: e.target.value })
            }
          />
          {errors.county && <p className="text-red-500 text-xs">{errors.county}</p>}
        </div>

        {/* Nationality */}
        <div>
          <label className="block text-sm font-medium mb-1">Nationality</label>
          <Input
            value={editingStudent.nationality || ""}
            onChange={(e) =>
              setEditingStudent({ ...editingStudent, nationality: e.target.value })
            }
          />
          {errors.nationality && <p className="text-red-500 text-xs">{errors.nationality}</p>}
        </div>

        {/* Guardian Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Guardian Name</label>
          <Input
            value={editingStudent.guardian_name || ""}
            onChange={(e) =>
              setEditingStudent({
                ...editingStudent,
                guardian_name: e.target.value,
              })
            }
          />
          {errors.guardian_name && <p className="text-red-500 text-xs">{errors.guardian_name}</p>}
        </div>

        {/* Guardian Contact */}
        <div>
          <label className="block text-sm font-medium mb-1">Guardian Contact</label>
          <Input
            value={editingStudent.guardian_contact || ""}
            onChange={(e) =>
              setEditingStudent({
                ...editingStudent,
                guardian_contact: e.target.value,
              })
            }
          />
          {errors.guardian_contact && <p className="text-red-500 text-xs">{errors.guardian_contact}</p>}
        </div>

        {/* Course */}
        <div>
          <label className="block text-sm font-medium mb-1">Course</label>
          <select
            className="border rounded p-2 w-full"
            value={editingStudent.course_id || ""}
            onChange={(e) =>
              setEditingStudent({ ...editingStudent, course_id: e.target.value })
            }
          >
            <option value="">Select Course</option>
            {courses.map((course: any) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
          {errors.course_id && <p className="text-red-500 text-xs">{errors.course_id}</p>}
        </div>

        {/* Branch */}
        <div>
          <label className="block text-sm font-medium mb-1">Branch</label>
          <select
            className="border rounded p-2 w-full"
            value={editingStudent.branch_id || ""}
            onChange={(e) =>
              setEditingStudent({ ...editingStudent, branch_id: e.target.value })
            }
          >
            <option value="">Select Branch</option>
            {branches.map((branch: any) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
          {errors.branch_id && <p className="text-red-500 text-xs">{errors.branch_id}</p>}
        </div>

        {/* Intake Year */}
        <div>
          <label className="block text-sm font-medium mb-1">Intake Year</label>
          <Input
            type="number"
            value={editingStudent.intakeYear || ""}
            onChange={(e) =>
              setEditingStudent({ ...editingStudent, intakeYear: e.target.value })
            }
          />
        </div>

        {/* Admission Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Admission Date</label>
          <Input
            type="date"
            value={editingStudent.admission_date?.split("T")[0] || ""}
            onChange={(e) =>
              setEditingStudent({
                ...editingStudent,
                admission_date: e.target.value,
              })
            }
          />
          {errors.admission_date && <p className="text-red-500 text-xs">{errors.admission_date}</p>}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            className="border rounded p-2 w-full"
            value={editingStudent.status || ""}
            onChange={(e) =>
              setEditingStudent({ ...editingStudent, status: e.target.value })
            }
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          {errors.status && <p className="text-red-500 text-xs">{errors.status}</p>}
        </div>
      </div>

      {/* Modal Actions */}
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={() => setEditingStudent(null)}>
          Cancel
        </Button>
        <Button
          onClick={async () => {
            if (!validateStudent(editingStudent)) {
              alert("Please fill all required fields.");
              return;
            }

            try {
              const payload = {
                firstName: editingStudent.first_name,
                lastName: editingStudent.last_name,
                email: editingStudent.email,
                phone: editingStudent.phone,
                age: editingStudent.age,
                gender: editingStudent.gender,
                status: editingStudent.status,
                department_id: editingStudent.department_id,
                course_id: editingStudent.course_id,
                date_of_birth: editingStudent.date_of_birth,
                id_number: editingStudent.id_number,
                address: editingStudent.address,
                county: editingStudent.county,
                nationality: editingStudent.nationality,
                guardian_name: editingStudent.guardian_name,
                guardian_contact: editingStudent.guardian_contact,
                branch_id: editingStudent.branch_id,
                admission_date: editingStudent.admission_date,
                intakeYear: editingStudent.intakeYear,
              };

              await axios.put(
                `http://localhost:5000/api/students/${editingStudent.student_id}`,
                payload
              );

              setStudents((prev) =>
                prev.map((s) =>
                  s.student_id === editingStudent.student_id
                    ? { ...s, ...payload, course: courses.find(c => c.id == editingStudent.course_id)?.name || "" }
                    : s
                )
              );

              setEditingStudent(null);
              alert("Student updated successfully");
            } catch (err) {
              console.error("Update error:", err);
              alert("Failed to update student");
            }
          }}
        >
          Save
        </Button>
      </div>
    </DialogContent>
  </Dialog>
)}

{/* Admission Form Modal */}
<Dialog open={showAdmissionForm} onOpenChange={setShowAdmissionForm}>
  <DialogContent className="max-w-lg w-full">
    <DialogHeader>
      <DialogTitle></DialogTitle>
    </DialogHeader>

    {/* Render the form */}
    <AdmissionsPage />

    {/* Close Button */}
    <div className="flex justify-end mt-4">
      <Button variant="outline" onClick={() => setShowAdmissionForm(false)}>
        Close
      </Button>
    </div>
  </DialogContent>
</Dialog>

{/* Student Detail Modal */}
{selectedStudent && (
  <StudentDetailModal
    student={selectedStudent}
    onClose={() => setSelectedStudent(null)}
  />
)}


    </div>
    
  );
}
