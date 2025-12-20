"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  BookOpen,
  Users,
  Award,
  TrendingUp,
  Target,
  BarChart3,
  Filter,
  Download,
  RefreshCw,
  Star,
  Crown,
  CheckCircle,
  AlertTriangle,
  GraduationCap,
  BookText,
  Eye,
} from "lucide-react";

interface Course {
  id: number;
  name: string;
  department: string;
  enrolled: number;
  capacity: number;
}

interface Level {
  id: number;
  name: string;
  duration: string;
  description: string;
}

interface StudentPerformance {
  level_id: number;
  level_name: string;
  total_students: number;
  average_score: number;
  distinctions: number;
  passes: number;
  fails: number;
  completion_rate: number;
  teacher_name: string;
  modules_count: number;
}

const CoursePerformancePage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [levels, setLevels] = useState<Level[]>([]);
  const [performanceData, setPerformanceData] = useState<StudentPerformance[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch courses
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/courses")
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Fetch levels when course is selected
  useEffect(() => {
    if (!selectedCourse) {
      setLevels([]);
      setSelectedLevel(null);
      return;
    }
    
    setLoading(true);
    fetch(`http://localhost:5000/api/courses/${selectedCourse}/levels`)
      .then(res => res.json())
      .then(data => {
        setLevels(data);
        if (data.length > 0) {
          setSelectedLevel(data[0].id);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedCourse]);

  // Fetch performance when level selected
  useEffect(() => {
    if (!selectedLevel || !selectedCourse) {
      setPerformanceData([]);
      return;
    }
    
    setLoading(true);
    fetch(`http://localhost:5000/api/performance/courses/${selectedCourse}/levels/${selectedLevel}/performance`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setPerformanceData(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setPerformanceData([]);
        setLoading(false);
      });
  }, [selectedLevel, selectedCourse]);

  // Chart data for visualization
  const gradeDistributionData = performanceData.length > 0 ? [
    { name: 'Distinctions', value: performanceData[0]?.distinctions || 0, color: '#10B981' },
    { name: 'Passes', value: performanceData[0]?.passes || 0, color: '#3B82F6' },
    { name: 'Fails', value: performanceData[0]?.fails || 0, color: '#EF4444' },
  ] : [];

  const performanceTrendData = [
    { month: 'Jan', score: 65 },
    { month: 'Feb', score: 72 },
    { month: 'Mar', score: 68 },
    { month: 'Apr', score: 75 },
    { month: 'May', score: 80 },
    { month: 'Jun', score: performanceData[0]?.average_score || 0 },
  ];

  const getGradeColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 70) return "bg-blue-100 text-blue-800 border-blue-200";
    if (score >= 50) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getGradeIcon = (score: number) => {
    if (score >= 80) return <Crown className="w-4 h-4" />;
    if (score >= 70) return <Star className="w-4 h-4" />;
    if (score >= 50) return <CheckCircle className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  const getPerformanceStatus = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Satisfactory";
    return "Needs Improvement";
  };

  const selectedCourseData = courses.find(c => c.id === selectedCourse);
  const selectedLevelData = levels.find(l => l.id === selectedLevel);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course performance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 lg:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
              Course Performance Analytics
            </h1>
            <p className="text-slate-600 mt-2 text-sm lg:text-base">
              Detailed performance analysis and student progress tracking
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-white rounded-xl shadow-sm border">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Select Course</label>
            <Select value={selectedCourse?.toString() || ""} onValueChange={(val) => setSelectedCourse(Number(val))}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Choose a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      {course.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Select Level</label>
            <Select 
              value={selectedLevel?.toString() || ""} 
              onValueChange={(val) => setSelectedLevel(Number(val))}
              disabled={!selectedCourse}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder={selectedCourse ? "Choose level" : "Select course first"} />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level.id} value={level.id.toString()}>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      {level.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button variant="outline" className="w-full h-12 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Advanced Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Course & Level Info Banner */}
      {selectedCourseData && selectedLevelData && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-900 text-lg">
                {selectedCourseData.name} • {selectedLevelData.name}
              </h3>
              <p className="text-blue-700 text-sm">
                {selectedLevelData.description} • {selectedLevelData.duration}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-blue-600">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{selectedCourseData.enrolled}/{selectedCourseData.capacity} students</span>
              </div>
              <div className="flex items-center gap-1">
                <BookText className="w-4 h-4" />
                <span>{performanceData[0]?.modules_count || 0} modules</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Overview */}
      {performanceData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Average Score</p>
                  <h3 className="text-2xl font-bold text-blue-900 mt-1">
                    {performanceData[0].average_score.toFixed(1)}%
                  </h3>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-600">Class Average</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Distinctions</p>
                  <h3 className="text-2xl font-bold text-green-900 mt-1">
                    {performanceData[0].distinctions}
                  </h3>
                  <p className="text-sm text-green-600 mt-1">
                    {((performanceData[0].distinctions / performanceData[0].total_students) * 100).toFixed(1)}% of class
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Completion Rate</p>
                  <h3 className="text-2xl font-bold text-purple-900 mt-1">
                    {performanceData[0].completion_rate}%
                  </h3>
                  <p className="text-sm text-purple-600 mt-1">
                    Course completion
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Total Students</p>
                  <h3 className="text-2xl font-bold text-orange-900 mt-1">
                    {performanceData[0].total_students}
                  </h3>
                  <p className="text-sm text-orange-600 mt-1">
                    Enrolled in level
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Details
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Performance Trend
                </CardTitle>
                <CardDescription>Monthly average scores progression</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceTrendData}>
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', r: 5 }}
                      activeDot={{ r: 8, fill: '#1d4ed8' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Grade Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Grade Distribution
                </CardTitle>
                <CardDescription>Student performance breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={gradeDistributionData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {gradeDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          {performanceData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
                <CardDescription>Key metrics and statistics for the selected level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Crown className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-sm text-slate-600">Distinctions</p>
                    <p className="text-2xl font-bold text-slate-900">{performanceData[0].distinctions}</p>
                    <p className="text-xs text-slate-500">
                      {((performanceData[0].distinctions / performanceData[0].total_students) * 100).toFixed(1)}%
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-sm text-slate-600">Passes</p>
                    <p className="text-2xl font-bold text-slate-900">{performanceData[0].passes}</p>
                    <p className="text-xs text-slate-500">
                      {((performanceData[0].passes / performanceData[0].total_students) * 100).toFixed(1)}%
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    <p className="text-sm text-slate-600">Fails</p>
                    <p className="text-2xl font-bold text-slate-900">{performanceData[0].fails}</p>
                    <p className="text-xs text-slate-500">
                      {((performanceData[0].fails / performanceData[0].total_students) * 100).toFixed(1)}%
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <GraduationCap className="w-8 h-8 text-purple-600" />
                    </div>
                    <p className="text-sm text-slate-600">Completion</p>
                    <p className="text-2xl font-bold text-slate-900">{performanceData[0].completion_rate}%</p>
                    <p className="text-xs text-slate-500">Overall rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Performance Analysis</CardTitle>
              <CardDescription>Comprehensive performance metrics and student progress</CardDescription>
            </CardHeader>
            <CardContent>
              {performanceData.length > 0 ? (
                <div className="space-y-6">
                  {/* Performance Bar Chart */}
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceData}>
                        <XAxis dataKey="level_name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="average_score" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Average Score" />
                        <Bar dataKey="completion_rate" fill="#10b981" radius={[4, 4, 0, 0]} name="Completion Rate" />
                        <Legend />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Progress Indicators */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Overall Progress</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Course Completion</span>
                            <span>{performanceData[0].completion_rate}%</span>
                          </div>
                          <Progress value={performanceData[0].completion_rate} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Academic Performance</span>
                            <span>{performanceData[0].average_score}%</span>
                          </div>
                          <Progress value={performanceData[0].average_score} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Instructor Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {performanceData[0].teacher_name?.split(' ').map(n => n[0]).join('') || 'IT'}
                          </div>
                          <div>
                            <p className="font-semibold">{performanceData[0].teacher_name || 'Instructor'}</p>
                            <p className="text-sm text-slate-600">Course Instructor</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <p>No performance data available for the selected course and level.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Performance Details</CardTitle>
              <CardDescription>Detailed breakdown of student performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              {performanceData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Level</TableHead>
                      <TableHead>Total Students</TableHead>
                      <TableHead>Average Score</TableHead>
                      <TableHead>Distinctions</TableHead>
                      <TableHead>Passes</TableHead>
                      <TableHead>Fails</TableHead>
                      <TableHead>Completion Rate</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {performanceData.map((perf) => (
                      <TableRow key={perf.level_id}>
                        <TableCell className="font-medium">{perf.level_name}</TableCell>
                        <TableCell>{perf.total_students}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getGradeIcon(perf.average_score)}
                            <span className="font-semibold">{perf.average_score.toFixed(1)}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-green-600 font-semibold">{perf.distinctions}</TableCell>
                        <TableCell className="text-blue-600 font-semibold">{perf.passes}</TableCell>
                        <TableCell className="text-red-600 font-semibold">{perf.fails}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={perf.completion_rate} className="w-20 h-2" />
                            <span className="text-sm font-medium">{perf.completion_rate}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getGradeColor(perf.average_score)}>
                            {getPerformanceStatus(perf.average_score)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <p>Select a course and level to view performance details.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CoursePerformancePage;