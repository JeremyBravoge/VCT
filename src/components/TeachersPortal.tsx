
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  BookOpen,
  Calendar,
  Users,
  ClipboardList,
  GraduationCap,
  Home,
  LogOut,
  Plus,
  Edit,
  Save,
  FileText,
  UserCheck,
  CheckCircle,
  Clock
} from 'lucide-react';

interface TeacherPortalProps {
  currentUser: string;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  currentUser,
  onLogout,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [newGrade, setNewGrade] = useState({ student: '', subject: '', marks: '', grade: '' });
  const [newAssignment, setNewAssignment] = useState({ title: '', subject: '', dueDate: '', description: '' });

  // Mock teacher data for vocational training
  const teacherData = {
    profile: {
      name: "Sarah Wanjiku",
      teacherNumber: "TCH2024001",
      specialization: "Electrical & Electronics",
      courses: ["Electrical Installation", "Electronics", "Solar PV Systems"]
    },
    courses: [
      { name: "Electrical Installation", tradeArea: "Electrical", students: 25, present: 23, absent: 2, level: "Level 2" },
      { name: "Electronics", tradeArea: "Electronics", students: 20, present: 19, absent: 1, level: "Level 1" },
      { name: "Solar PV Systems", tradeArea: "Renewable Energy", students: 15, present: 14, absent: 1, level: "Level 3" }
    ],
    recentGrades: [
      { student: "Mary Wanjiku", module: "Electrical Wiring", theory: 85, practical: 88, grade: "A", date: "2025-01-10" },
      { student: "John Kiprotich", module: "Circuit Design", theory: 78, practical: 82, grade: "B+", date: "2025-01-10" },
      { student: "Grace Mutindi", module: "Solar Installation", theory: 92, practical: 90, grade: "A", date: "2025-01-09" }
    ],
    assignments: [
      { title: "Wiring Project", course: "Electrical Installation", module: "Basic Wiring", dueDate: "2025-01-15", submissions: 22, total: 25 },
      { title: "Circuit Simulation", course: "Electronics", module: "Digital Circuits", dueDate: "2025-01-18", submissions: 18, total: 20 },
      { title: "Solar Panel Setup", course: "Solar PV Systems", module: "PV Installation", dueDate: "2025-01-20", submissions: 12, total: 15 }
    ],
    students: [
      { name: "Mary Wanjiku", course: "Electrical Installation", admissionNo: "STU001", attendance: 95, avgGrade: 85, level: "Level 2", tradeArea: "Electrical" },
      { name: "John Kiprotich", course: "Electrical Installation", admissionNo: "STU002", attendance: 88, avgGrade: 78, level: "Level 2", tradeArea: "Electrical" },
      { name: "Grace Mutindi", course: "Electronics", admissionNo: "STU003", attendance: 97, avgGrade: 92, level: "Level 1", tradeArea: "Electronics" },
      { name: "David Otieno", course: "Solar PV Systems", admissionNo: "STU004", attendance: 91, avgGrade: 80, level: "Level 3", tradeArea: "Renewable Energy" }
    ]
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle grade submission
    console.log('Grade submitted:', newGrade);
    setNewGrade({ student: '', subject: '', marks: '', grade: '' });
  };

  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle assignment creation
    console.log('Assignment created:', newAssignment);
    setNewAssignment({ title: '', subject: '', dueDate: '', description: '' });
  };

  const calculateGrade = (marks: number) => {
    if (marks >= 90) return 'A';
    if (marks >= 80) return 'A-';
    if (marks >= 75) return 'B+';
    if (marks >= 70) return 'B';
    if (marks >= 65) return 'B-';
    if (marks >= 60) return 'C+';
    if (marks >= 55) return 'C';
    if (marks >= 50) return 'C-';
    if (marks >= 45) return 'D+';
    if (marks >= 40) return 'D';
    return 'E';
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Teacher Portal</h1>
                <p className="text-gray-600">Welcome, {teacherData.profile.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => onNavigate('home')}
                variant="ghost"
                className="flex items-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Button>
              <Button
                onClick={onLogout}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Courses</p>
                  <p className="text-2xl font-bold text-green-600">{teacherData.courses.length}</p>
                </div>
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {teacherData.courses.reduce((acc, course) => acc + course.students, 0)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Assignments</p>
                  <p className="text-2xl font-bold text-purple-600">{teacherData.assignments.length}</p>
                </div>
                <ClipboardList className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Attendance</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {Math.round(teacherData.courses.reduce((acc, course) => acc + (course.present / course.students * 100), 0) / teacherData.courses.length)}%
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Card>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-5 w-full bg-gray-100 p-1 rounded-none">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="grades">Grades</TabsTrigger>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="students">Students</TabsTrigger>
              </TabsList>

              <div className="p-6">
                {/* Overview Tab */}
                <TabsContent value="overview">
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">Teaching Overview</h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* My Courses */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <BookOpen className="w-5 h-5" />
                            <span>My Courses</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {teacherData.courses.map((course, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                  <p className="font-medium">{course.name}</p>
                                  <p className="text-sm text-gray-600">{course.tradeArea} • {course.level}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">{course.students} students</p>
                                  <p className="text-sm text-gray-600">{course.present} present today</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Recent Activities */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Clock className="w-5 h-5" />
                            <span>Recent Activities</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                              <CheckCircle className="w-5 h-5 text-blue-600" />
                              <div>
                                <p className="text-sm font-medium">Graded Mathematics test for Grade 7A</p>
                                <p className="text-xs text-gray-600">2 hours ago</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                              <UserCheck className="w-5 h-5 text-green-600" />
                              <div>
                                <p className="text-sm font-medium">Marked attendance for Grade 6B</p>
                                <p className="text-xs text-gray-600">4 hours ago</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                              <FileText className="w-5 h-5 text-purple-600" />
                              <div>
                                <p className="text-sm font-medium">Created new assignment for Grade 8A</p>
                                <p className="text-xs text-gray-600">1 day ago</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* Grades Tab */}
                <TabsContent value="grades">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-900">Grade Management</h2>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Grade
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Add New Grade Form */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Add New Grade</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <form onSubmit={handleGradeSubmit} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="student">Student</Label>
                              <Select value={newGrade.student} onValueChange={(value) => setNewGrade({...newGrade, student: value})}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select student" />
                                </SelectTrigger>
                                <SelectContent>
                                  {teacherData.students.map((student, index) => (
                                    <SelectItem key={index} value={student.name}>
                                      {student.name} ({student.course})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="subject">Subject</Label>
                              <Select value={newGrade.subject} onValueChange={(value) => setNewGrade({...newGrade, subject: value})}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select subject" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                                  <SelectItem value="Science">Science</SelectItem>
                                  <SelectItem value="English">English</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="marks">Marks</Label>
                              <Input
                                id="marks"
                                type="number"
                                value={newGrade.marks}
                                onChange={(e) => {
                                  const marks = parseInt(e.target.value) || 0;
                                  setNewGrade({
                                    ...newGrade, 
                                    marks: e.target.value,
                                    grade: calculateGrade(marks)
                                  });
                                }}
                                placeholder="Enter marks"
                                min="0"
                                max="100"
                              />
                            </div>

                            {newGrade.marks && (
                              <div className="space-y-2">
                                <Label>Calculated Grade</Label>
                                <Badge className={getGradeColor(newGrade.grade)}>
                                  {newGrade.grade}
                                </Badge>
                              </div>
                            )}

                            <Button type="submit" className="w-full">
                              <Save className="w-4 h-4 mr-2" />
                              Save Grade
                            </Button>
                          </form>
                        </CardContent>
                      </Card>

                      {/* Recent Grades */}
                      <Card className="lg:col-span-2">
                        <CardHeader>
                          <CardTitle>Recent Grades</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {teacherData.recentGrades.map((grade, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                  <p className="font-medium">{grade.student}</p>
                                  <p className="text-sm text-gray-600">{grade.module} • {grade.date}</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <span className="font-medium">{Math.round((grade.theory + grade.practical) / 2)}%</span>
                                  <Badge className={getGradeColor(grade.grade)}>
                                    {grade.grade}
                                  </Badge>
                                  <Button variant="ghost" size="sm">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* Attendance Tab */}
                <TabsContent value="attendance">
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">Attendance Management</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {teacherData.courses.map((course, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle className="text-lg">{course.name}</CardTitle>
                            <p className="text-sm text-gray-600">{course.tradeArea} • {course.level}</p>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="text-center">
                                <p className="text-2xl font-bold text-green-600">
                                  {Math.round((course.present / course.students) * 100)}%
                                </p>
                                <p className="text-sm text-gray-600">Today's Attendance</p>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm">Present</span>
                                  <span className="font-medium text-green-600">{course.present}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm">Absent</span>
                                  <span className="font-medium text-red-600">{course.absent}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm">Total</span>
                                  <span className="font-medium">{course.students}</span>
                                </div>
                              </div>
                              <Button className="w-full" variant="outline">
                                <UserCheck className="w-4 h-4 mr-2" />
                                Mark Attendance
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Assignments Tab */}
                <TabsContent value="assignments">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-900">Assignment Management</h2>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Assignment
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Create Assignment Form */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Create New Assignment</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <form onSubmit={handleAssignmentSubmit} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="title">Title</Label>
                              <Input
                                id="title"
                                value={newAssignment.title}
                                onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                                placeholder="Assignment title"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="assignmentSubject">Subject</Label>
                              <Select value={newAssignment.subject} onValueChange={(value) => setNewAssignment({...newAssignment, subject: value})}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select subject" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                                  <SelectItem value="Science">Science</SelectItem>
                                  <SelectItem value="English">English</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="dueDate">Due Date</Label>
                              <Input
                                id="dueDate"
                                type="date"
                                value={newAssignment.dueDate}
                                onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                id="description"
                                value={newAssignment.description}
                                onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                                placeholder="Assignment description..."
                                rows={3}
                              />
                            </div>

                            <Button type="submit" className="w-full">
                              <Save className="w-4 h-4 mr-2" />
                              Create Assignment
                            </Button>
                          </form>
                        </CardContent>
                      </Card>

                      {/* Current Assignments */}
                      <Card className="lg:col-span-2">
                        <CardHeader>
                          <CardTitle>Current Assignments</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {teacherData.assignments.map((assignment, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                  <p className="font-medium">{assignment.title}</p>
                                  <p className="text-sm text-gray-600">{assignment.course} • {assignment.module}</p>
                                  <p className="text-sm text-gray-600">Due: {assignment.dueDate}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">{assignment.submissions}/{assignment.total}</p>
                                  <p className="text-sm text-gray-600">Submissions</p>
                                  <Badge className={assignment.submissions === assignment.total ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                    {assignment.submissions === assignment.total ? 'Complete' : 'Pending'}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* Students Tab */}
                <TabsContent value="students">
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">Student Management</h2>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {teacherData.students.map((student, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-white font-medium">
                                    {student.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium">{student.name}</p>
                                  <p className="text-sm text-gray-600">{student.course} • {student.admissionNo}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-6">
                                <div className="text-center">
                                  <p className="font-medium">{student.attendance}%</p>
                                  <p className="text-xs text-gray-600">Attendance</p>
                                </div>
                                <div className="text-center">
                                  <p className="font-medium">{student.avgGrade}%</p>
                                  <p className="text-xs text-gray-600">Avg Grade</p>
                                </div>
                                <Button variant="outline" size="sm">
                                  View Profile
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
