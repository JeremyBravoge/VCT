import { useState, useEffect } from "react";
import { Plus, Clock, Users, DollarSign, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Active":
      return <Badge className="bg-accent/10 text-accent hover:bg-accent/20">Active</Badge>;
    case "Upcoming":
      return <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Upcoming</Badge>;
    case "Completed":
      return <Badge variant="secondary">Completed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};


export default function Courses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<any[]>([]);

  // For modal state
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
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
  });
  


  useEffect(() => {
    fetch("http://localhost:5000/api/courses") // replace with your backend URL
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);
  // ✅ Fetch departments
  useEffect(() => {
    fetch("http://localhost:5000/api/departments")
      .then(res => res.json())
      .then(data => setDepartments(data))
      .catch(err => console.error("Error fetching departments:", err));
  }, []);
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteCourse = async (id: number) => {
  try {
    const res = await fetch(`http://localhost:5000/api/courses/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete course");

    // Remove from local state
    setCourses(courses.filter(c => c.id !== id));
  } catch (err) {
    console.error("❌ Error deleting course:", err);
  }
};


  // Add this function inside Courses component
const handleSaveCourse = async () => {
  try {
    if (editingCourse) {
      // Editing existing course
      const res = await fetch(`http://localhost:5000/api/courses/${editingCourse.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newCourse,
          fee: Number(newCourse.fee),
          capacity: Number(newCourse.capacity),
        }),
      });
      if (!res.ok) throw new Error("Failed to update course");
      const updated = await res.json();

      setCourses(courses.map(c => (c.id === updated.id ? updated : c)));
    } else {
      // Adding new course
      const res = await fetch("http://localhost:5000/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newCourse,
          fee: Number(newCourse.fee),
          capacity: Number(newCourse.capacity),
        }),
      });
      if (!res.ok) throw new Error("Failed to save course");
      const saved = await res.json();

      setCourses([...courses, saved]);
    }

    setOpen(false);
    setNewCourse({
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
    });
    setEditingCourse(null);
  } catch (err) {
    console.error("❌ Error saving course:", err);
  }
};


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Courses</h1>
          <p className="text-muted-foreground">Manage course offerings and schedules</p>
        </div>
<Button 
  className="gradient-primary hover:opacity-90 text-white shadow-sm"
  onClick={() => setOpen(true)}
>
  <Plus className="h-4 w-4 mr-2" />
  Add Course
</Button>

      </div>

      {/* Search */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {/* Courses Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="shadow-card hover:shadow-academic transition-smooth">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-foreground mb-1">
                    {course.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mb-2">{course.department}</p>
                </div>
                {getStatusBadge(course.status)}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {course.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Course Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{course.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  
                  <span className="font-medium text-foreground">
                                                  Ksh {Number(course.fee).toLocaleString()}
                                          </span>

                </div>
              </div>

              {/* Enrollment Progress */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Enrollment</span>
                  </div>
                  <span className="font-medium text-foreground">
                    {course.enrolled}/{course.capacity}
                  </span>
                </div>
                <Progress 
                  value={(course.enrolled / course.capacity) * 100} 
                  className="h-2"
                />
              </div>

              {/* Instructor & Date */}
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Instructor:</span>
                  <span className="font-medium text-foreground">{course.instructor}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Start Date:</span>
                 <span className="text-foreground">
                 {course.startDate ? new Date(course.startDate).toLocaleDateString() : ""}
                </span>

                </div>
              </div>

              {/* Actions */}
<div className="flex space-x-2 pt-2">
  <Button variant="outline" size="sm" className="flex-1">
    <BookOpen className="h-4 w-4 mr-2" />
    View Details
  </Button>
  <Button
    variant="ghost"
    size="sm"
    className="flex-1"
    onClick={() => {
      setEditingCourse(course);
      setNewCourse(course);
      setOpen(true);
    }}
  >
    Edit
  </Button>
  <Button
    variant="destructive"
    size="sm"
    className="flex-1"
    onClick={() => handleDeleteCourse(course.id)}
  >
    Delete
  </Button>
</div>

            </CardContent>
          </Card>
        ))}
      </div>

         <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Course</DialogTitle>
          </DialogHeader>


<div>
  <Label>Department</Label>
  <select
    className="w-full border rounded-md p-2"
    value={newCourse.department_id || ""}
    onChange={(e) => {
      const selectedDept = departments.find(
        (d) => d.id === Number(e.target.value)
      );

      setNewCourse({
        ...newCourse,
        department_id: Number(e.target.value),
        department: selectedDept?.name || "",
        fee: selectedDept?.fee_charge || "",
      });
    }}
  >
    <option value="">Select Department</option>
    {departments.map((dept) => (
      <option key={dept.id} value={dept.id}>
        {dept.name}
      </option>
    ))}
  </select>
</div>
           <div className="space-y-3">
            <div>
              <Label>Course Name</Label>
              <Input 
                value={newCourse.name}
                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input 
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              />
            </div>
            <div>
              <Label>Duration</Label>
              <Input 
                value={newCourse.duration}
                onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
              />
            </div>
            <div>
              <Label>Fee</Label>
              <Input 
                type="number"
                value={newCourse.fee}
                onChange={(e) => setNewCourse({ ...newCourse, fee: e.target.value })}
              />
            </div>
            <div>
              <Label>Capacity</Label>
              <Input 
                type="number"
                value={newCourse.capacity}
                onChange={(e) => setNewCourse({ ...newCourse, capacity: e.target.value })}
              />
            </div>
            <div>
              <Label>Instructor</Label>
              <Input 
                value={newCourse.instructor}
                onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
              />
            </div>
            <div>
              <Label>Start Date</Label>
              <Input 
                type="date"
                value={newCourse.startDate}
                onChange={(e) => setNewCourse({ ...newCourse, startDate: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveCourse}>
  {editingCourse ? "Update" : "Save"}
</Button>

          </DialogFooter>
        </DialogContent>
      </Dialog>
      
    </div>
  
    
  );
}
