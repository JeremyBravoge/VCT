"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  TimeScale,
  Title,
  BarElement,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Users, 
  Award, 
  Target, 
  Download, 
  BarChart3,
  Star,
  Calendar,
  BookOpen,
  GraduationCap,
  BookText,
  Clock,
  Zap,
  AlertCircle
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
  TimeScale,
  Title
);

// Interfaces
interface Course {
  id: number;
  name: string;
  department_id: number;
}

interface Level {
  id: number;
  name: string;
  duration: string;
  description: string;
}

interface StudentPerformance {
  student_id: string;
  module_id: number;
  theory_marks: number;
  practical_marks: number;
  total_marks: number;
  grade: string;
  module_name?: string;
  course_name?: string;
  student_name?: string;
}

interface Module {
  id: number;
  title: string;
  course_id: number;
  level_id: number;
}

export default function AdvancedLevelPerformance() {
  // UI state
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // API data state
  const [courses, setCourses] = useState<Course[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [performanceData, setPerformanceData] = useState<StudentPerformance[]>([]);
  const [loading, setLoading] = useState(false);

  interface PerformanceSummary {
    totalStudents: number;
    averageScore: number;
    averagePercentage: number;
    distinctions: number;
    credits: number;
    passes: number;
    fails: number;
    topPerformer: { name: string; score: number; id: string } | null;
    theoryAverage: number;
    practicalAverage: number;
  }

  const [performanceSummary, setPerformanceSummary] = useState<PerformanceSummary>({
    totalStudents: 0,
    averageScore: 0,
    averagePercentage: 0,
    distinctions: 0,
    credits: 0,
    passes: 0,
    fails: 0,
    topPerformer: null,
    theoryAverage: 0,
    practicalAverage: 0,
  });

  // Reset data when course or level changes
  useEffect(() => {
    setModules([]);
    setSelectedModule(null);
    setPerformanceData([]);
    setPerformanceSummary({
      totalStudents: 0,
      averageScore: 0,
      averagePercentage: 0,
      distinctions: 0,
      credits: 0,
      passes: 0,
      fails: 0,
      topPerformer: null,
      theoryAverage: 0,
      practicalAverage: 0,
    });
  }, [selectedCourse, selectedLevel]);

  // Fetch data functions
  useEffect(() => {
    fetch("http://localhost:5000/api/courses")
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error("Error fetching courses:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/levels")
      .then(res => res.json())
      .then(data => setLevels(data))
      .catch(err => console.error("Error fetching levels:", err));
  }, []);

  useEffect(() => {
    if (!selectedCourse || !selectedLevel) {
      return;
    }
    
    setLoading(true);
    fetch(`http://localhost:5000/api/performance/courses/${selectedCourse}/levels/${selectedLevel}/modules`)
      .then(res => res.json())
      .then(data => {
        const modulesData = data.data || data;
        setModules(modulesData);
        if (modulesData.length > 0) {
          setSelectedModule(modulesData[0].id);
        }
      })
      .catch(err => console.error("Error fetching modules:", err))
      .finally(() => setLoading(false));
  }, [selectedCourse, selectedLevel]);

  useEffect(() => {
    if (!selectedModule) {
      setPerformanceData([]);
      return;
    }
    
    setLoading(true);
    fetch(`http://localhost:5000/api/performance/modules/${selectedModule}/performance`)
      .then(res => res.json())
      .then(data => {
        const performanceData = data.data || data;
        setPerformanceData(performanceData);
        
        if (performanceData.length > 0) {
          const totalMarks = performanceData.reduce((sum: number, perf: StudentPerformance) => 
            sum + (perf.theory_marks + perf.practical_marks), 0);
          const avgScore = totalMarks / performanceData.length;
          const avgPercentage = (avgScore / 100) * 100;
          
          const theoryTotal = performanceData.reduce((sum: number, perf: StudentPerformance) => 
            sum + perf.theory_marks, 0);
          const practicalTotal = performanceData.reduce((sum: number, perf: StudentPerformance) => 
            sum + perf.practical_marks, 0);
          
          const distinctions = performanceData.filter((p: StudentPerformance) => 
            (p.theory_marks + p.practical_marks) >= 80).length;
          const credits = performanceData.filter((p: StudentPerformance) => 
            (p.theory_marks + p.practical_marks) >= 70 && (p.theory_marks + p.practical_marks) < 80).length;
          const passes = performanceData.filter((p: StudentPerformance) => 
            (p.theory_marks + p.practical_marks) >= 50 && (p.theory_marks + p.practical_marks) < 70).length;
          const fails = performanceData.filter((p: StudentPerformance) => 
            (p.theory_marks + p.practical_marks) < 50).length;
            
          const topPerformer = performanceData.reduce((max: StudentPerformance, perf: StudentPerformance) => 
            (perf.theory_marks + perf.practical_marks) > (max.theory_marks + max.practical_marks) ? perf : max, performanceData[0]);
          
          setPerformanceSummary({
            totalStudents: performanceData.length,
            averageScore: avgScore,
            averagePercentage: avgPercentage,
            distinctions,
            credits,
            passes,
            fails,
            topPerformer: topPerformer ? { 
              name: topPerformer.student_name || `Student ${topPerformer.student_id}`,
              id: topPerformer.student_id,
              score: topPerformer.theory_marks + topPerformer.practical_marks 
            } : null,
            theoryAverage: theoryTotal / performanceData.length,
            practicalAverage: practicalTotal / performanceData.length,
          });
        }
      })
      .catch(err => console.error("Error fetching performance:", err))
      .finally(() => setLoading(false));
  }, [selectedModule]);

  // Enhanced Chart Data - More meaningful visualizations
  const gradeDistributionData = useMemo(() => {
    return {
      labels: ['Distinction 🏆', 'Credit ⭐', 'Pass ✅', 'Fail ❌'],
      datasets: [
        {
          data: [
            performanceSummary.distinctions,
            performanceSummary.credits,
            performanceSummary.passes,
            performanceSummary.fails
          ],
          backgroundColor: [
            '#10B981',
            '#3B82F6', 
            '#F59E0B',
            '#EF4444'
          ],
          borderWidth: 3,
          borderColor: '#fff',
          hoverOffset: 20,
        },
      ],
    };
  }, [performanceSummary]);

  const marksDistributionData = useMemo(() => {
    return {
      labels: ['Theory', 'Practical'],
      datasets: [
        {
          label: 'Average Marks',
          data: [performanceSummary.theoryAverage, performanceSummary.practicalAverage],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(139, 92, 246, 0.8)',
          ],
          borderColor: [
            'rgb(59, 130, 246)',
            'rgb(139, 92, 246)',
          ],
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    };
  }, [performanceSummary.theoryAverage, performanceSummary.practicalAverage]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          }
        }
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        max: 50,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value: any) {
            return value + '/50';
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Utility functions
  const format2 = (n: number) => n.toFixed(2);
  const getGradeColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (percentage >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getGradeIcon = (percentage: number) => {
    if (percentage >= 80) return '🏆';
    if (percentage >= 70) return '⭐';
    if (percentage >= 50) return '✅';
    return '❌';
  };

  const getPerformanceInsight = () => {
    const { averagePercentage, distinctions, fails } = performanceSummary;
    if (averagePercentage >= 80) return { 
      message: "Outstanding performance! The class is excelling.", 
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    };
    if (averagePercentage >= 70) return { 
      message: "Good performance with room for growth.", 
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    };
    if (averagePercentage >= 50) return { 
      message: "Average performance. Consider additional support.", 
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    };
    return { 
      message: "Needs immediate attention and intervention.", 
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    };
  };

  const insight = getPerformanceInsight();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Academic Performance Dashboard</h1>
            <p className="text-slate-600 mt-2 text-sm lg:text-base">
              Comprehensive analysis of student performance across modules and levels
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2 text-xs lg:text-sm">
              <Download className="w-3 h-3 lg:w-4 lg:h-4" />
              Export
            </Button>
            <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-xs lg:text-sm">
              <BarChart3 className="w-3 h-3 lg:w-4 lg:h-4" />
              Analytics
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 lg:mt-6 p-4 bg-white rounded-xl shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4">
            <div>
              <label className="text-xs font-medium text-slate-700 mb-2 block">Course</label>
              <Select onValueChange={(v) => setSelectedCourse(Number(v))} value={selectedCourse?.toString() || ""}>
                <SelectTrigger className="h-10 lg:h-12">
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-3 h-3 lg:w-4 lg:h-4" />
                        <span className="text-sm">{course.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 mb-2 block">Level</label>
              <Select onValueChange={(v) => setSelectedLevel(Number(v))} value={selectedLevel?.toString() || ""}>
                <SelectTrigger className="h-10 lg:h-12">
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level.id} value={level.id.toString()}>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4" />
                        <span className="text-sm">{level.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 mb-2 block">Module</label>
              <Select 
                onValueChange={(v) => setSelectedModule(Number(v))} 
                value={selectedModule?.toString() || ""}
                disabled={!selectedCourse || !selectedLevel || modules.length === 0}
              >
                <SelectTrigger className="h-10 lg:h-12">
                  <SelectValue placeholder={modules.length === 0 ? "No modules available" : "Select Module"} />
                </SelectTrigger>
                <SelectContent>
                  {modules.map((module) => (
                    <SelectItem key={module.id} value={module.id.toString()}>
                      <div className="flex items-center gap-2">
                        <BookText className="w-3 h-3 lg:w-4 lg:h-4" />
                        <span className="text-sm">{module.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Insight Banner */}
      {selectedModule && performanceSummary.totalStudents > 0 && (
        <div className={`mb-6 p-4 rounded-xl border ${insight.bgColor} ${insight.borderColor}`}>
          <div className="flex items-center gap-3">
            <Zap className={`w-5 h-5 ${insight.color}`} />
            <div>
              <h3 className={`font-semibold ${insight.color}`}>Performance Insight</h3>
              <p className={`text-sm ${insight.color} opacity-90`}>{insight.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 lg:space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
          <TabsTrigger value="overview" className="flex items-center gap-2 text-xs lg:text-sm">
            <BarChart3 className="w-3 h-3 lg:w-4 lg:h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center gap-2 text-xs lg:text-sm">
            <Users className="w-3 h-3 lg:w-4 lg:h-4" />
            Students
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2 text-xs lg:text-sm">
            <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 lg:space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs lg:text-sm font-medium text-blue-600">Average Score</p>
                    <h3 className="text-lg lg:text-2xl font-bold text-blue-900 mt-1">
                      {format2(performanceSummary.averageScore)}
                    </h3>
                    <p className="text-xs text-blue-600 mt-1">/100 points</p>
                  </div>
                  <div className="w-8 h-8 lg:w-12 lg:h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs lg:text-sm font-medium text-green-600">Top Performer</p>
                    <h3 className="text-sm lg:text-xl font-bold text-green-900 mt-1 truncate">
                      {performanceSummary.topPerformer?.name || 'N/A'}
                    </h3>
                    <p className="text-xs text-green-700 mt-1">
                      {performanceSummary.topPerformer?.score || 0}/100
                    </p>
                  </div>
                  <div className="w-8 h-8 lg:w-12 lg:h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs lg:text-sm font-medium text-purple-600">Distinctions</p>
                    <h3 className="text-lg lg:text-2xl font-bold text-purple-900 mt-1">
                      {performanceSummary.distinctions}
                    </h3>
                    <p className="text-xs text-purple-600 mt-1">
                      {performanceSummary.totalStudents > 0 
                        ? ((performanceSummary.distinctions / performanceSummary.totalStudents) * 100).toFixed(1) 
                        : 0}% of class
                    </p>
                  </div>
                  <div className="w-8 h-8 lg:w-12 lg:h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs lg:text-sm font-medium text-orange-600">Students</p>
                    <h3 className="text-lg lg:text-2xl font-bold text-orange-900 mt-1">
                      {performanceSummary.totalStudents}
                    </h3>
                    <p className="text-xs text-orange-600 mt-1">Assessed</p>
                  </div>
                  <div className="w-8 h-8 lg:w-12 lg:h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Grade Distribution */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                  <BarChart3 className="w-4 h-4 lg:w-5 lg:h-5" />
                  Grade Distribution
                </CardTitle>
                <CardDescription>Breakdown of student performance by grade category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 lg:h-80">
                  <Doughnut data={gradeDistributionData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>

            {/* Marks Distribution */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                  <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5" />
                  Marks Analysis
                </CardTitle>
                <CardDescription>Average marks in theory vs practical components</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 lg:h-80">
                  <Bar data={marksDistributionData} options={barChartOptions} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <BookText className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-xs text-slate-600">Theory Average</p>
                  <p className="text-lg font-bold text-slate-900">{format2(performanceSummary.theoryAverage)}/50</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-xs text-slate-600">Practical Average</p>
                  <p className="text-lg font-bold text-slate-900">{format2(performanceSummary.practicalAverage)}/50</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-xs text-slate-600">Completion</p>
                  <p className="text-lg font-bold text-slate-900">{format2(performanceSummary.averagePercentage)}%</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <p className="text-xs text-slate-600">Need Help</p>
                  <p className="text-lg font-bold text-slate-900">{performanceSummary.fails}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Students Tab - Same as before but improved */}
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Student Performance Details</CardTitle>
              <CardDescription>
                Individual student performance with detailed breakdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-slate-600 mt-4">Loading performance data...</p>
                </div>
              ) : performanceData.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600">No Data Available</h3>
                  <p className="text-slate-500">
                    {selectedModule 
                      ? "No performance data available for this module" 
                      : "Select a course, level, and module to view performance data"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b">
                        <th className="text-left p-3 font-semibold text-slate-700">Student</th>
                        <th className="text-left p-3 font-semibold text-slate-700">Theory</th>
                        <th className="text-left p-3 font-semibold text-slate-700">Practical</th>
                        <th className="text-left p-3 font-semibold text-slate-700">Total</th>
                        <th className="text-left p-3 font-semibold text-slate-700">Progress</th>
                        <th className="text-left p-3 font-semibold text-slate-700">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {performanceData.map((perf, index) => {
                        const totalMarks = perf.theory_marks + perf.practical_marks;
                        const percentage = (totalMarks / 100) * 100;
                        return (
                          <tr key={perf.student_id} className="border-b hover:bg-slate-50/50 transition-colors">
                            <td className="p-3">
                              <div>
                                <div className="font-medium text-slate-900 text-xs lg:text-sm">
                                  {perf.student_name || `Student ${perf.student_id}`}
                                </div>
                                <div className="text-xs text-slate-500">{perf.student_id}</div>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="font-medium text-xs lg:text-sm">{perf.theory_marks}/50</div>
                            </td>
                            <td className="p-3">
                              <div className="font-medium text-xs lg:text-sm">{perf.practical_marks}/50</div>
                            </td>
                            <td className="p-3">
                              <div className="font-bold text-slate-900 text-xs lg:text-sm">{totalMarks}/100</div>
                            </td>
                            <td className="p-3">
                              <div className="w-24 lg:w-32">
                                <Progress value={percentage} className="h-2" />
                                <div className="text-xs text-slate-600 mt-1">{format2(percentage)}%</div>
                              </div>
                            </td>
                            <td className="p-3">
                              <Badge 
                                variant="outline" 
                                className={`font-medium border-2 text-xs ${getGradeColor(percentage)}`}
                              >
                                <span className="mr-1">{getGradeIcon(percentage)}</span>
                                {perf.grade}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab - Enhanced */}
        <TabsContent value="insights">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analysis</CardTitle>
                <CardDescription>Detailed insights and recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Overall Performance
                  </h4>
                  <p className="text-blue-700 text-sm">
                    The class average is <strong>{format2(performanceSummary.averagePercentage)}%</strong>. 
                    {performanceSummary.averagePercentage >= 75 ? ' Excellent overall performance!' : 
                     performanceSummary.averagePercentage >= 60 ? ' Good results with consistent performance.' : 
                     ' Consider targeted interventions for improvement.'}
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Achievement Highlights
                  </h4>
                  <p className="text-green-700 text-sm">
                    <strong>{performanceSummary.distinctions} students</strong> achieved distinction level. 
                    {performanceSummary.distinctions > 0 ? ' These students demonstrate exceptional understanding.' : ' Focus on building excellence in the cohort.'}
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Support Needed
                  </h4>
                  <p className="text-yellow-700 text-sm">
                    {performanceSummary.fails > 0 ? 
                      `<strong>${performanceSummary.fails} students</strong> are struggling and need immediate support. Consider remedial sessions.` : 
                      'All students are meeting minimum requirements. Maintain current support levels.'}
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Component Analysis
                  </h4>
                  <p className="text-purple-700 text-sm">
                    Theory average: <strong>{format2(performanceSummary.theoryAverage)}/50</strong><br/>
                    Practical average: <strong>{format2(performanceSummary.practicalAverage)}/50</strong>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Action Plan</CardTitle>
                <CardDescription>Recommended next steps</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start h-12 text-sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download Detailed Performance Report
                </Button>
                <Button variant="outline" className="w-full justify-start h-12 text-sm">
                  <Users className="w-4 h-4 mr-2" />
                  Identify At-Risk Students
                </Button>
                <Button variant="outline" className="w-full justify-start h-12 text-sm">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Create Study Groups
                </Button>
                <Button variant="outline" className="w-full justify-start h-12 text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Parent-Teacher Meetings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}