import React, { useEffect, useState } from "react";
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  Building2,
  GraduationCap,
  UserCheck,
  BarChart3,
  Target,
  Award,
  CheckCircle,
  XCircle
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import EnrollmentChart from "./EnrollmentChart";
import { GenderDistributionChart } from "@/components/dashboard/GenderDistributionChart";

interface DashboardStats {
  totalStudents: number;
  activeCourses: number;
  revenueThisMonth: number;
  averagePerformance: number;
  totalInstructors: number;
  departments: {
    name: string;
    students: number;
    progress: number;
  }[];
  topCourse: {
    name: string;
    avgScore: number;
    percentage: number;
    growth: number;
  };
  pendingPayments: {
    amount: number;
    students: number;
    change: number;
  };
  enrollmentRate: {
    rate: number;
    change: number;
  };
  // NEW: Enhanced Performance Data
  performance: {
    averageScore: number;
    averagePercentage: number;
    studentsAssessed: number;
    gradeDistribution: {
      distinctions: number;
      credits: number;
      passes: number;
      fails: number;
    };
    totalAssessments: number;
  };
  genderStats?: any;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        const totalStudents = data.departments.reduce(
          (sum: number, d: { total_students: number }) => sum + d.total_students,
          0
        );
        setStats({
          totalStudents: data.students,
          activeCourses: data.courses,
          revenueThisMonth: Number(data.revenueThisMonth),
          averagePerformance: Number(data.averagePerformance),
          totalInstructors: data.instructors,
          departments: data.departments.map(
            (d: { department: string; total_students: number }) => ({
              name: d.department,
              students: d.total_students,
              progress:
                totalStudents > 0
                  ? Math.round((d.total_students / totalStudents) * 100)
                  : 0,
            })
          ),
          topCourse: data.topCourse || { name: "N/A", avgScore: 0, percentage: 0, growth: 0 },
          pendingPayments: {
            amount: data.finance.total_pending,
            students: data.pendingPayments.length,
            change: 0,
          },
          enrollmentRate: { rate: Number(data.enrollmentRate), change: 0 },
          // NEW: Include enhanced performance data
          performance: data.performance || {
            averageScore: 0,
            averagePercentage: 0,
            studentsAssessed: 0,
            gradeDistribution: {
              distinctions: 0,
              credits: 0,
              passes: 0,
              fails: 0
            },
            totalAssessments: 0
          },
          genderStats: data.genderStats
        });
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6 bg-white text-gray-800">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening at your institution today.
        </p>
      </div>

      {loading && <p className="text-gray-700">Loading dashboard...</p>}

      {!loading && stats && (
        <>
          {/* Metrics Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <MetricCard
              title="Total Students"
              value={stats.totalStudents.toLocaleString()}
              change=""
              changeType="positive"
              icon={Users}
              bgColor="bg-gradient-to-r from-indigo-500 to-purple-500"
            />
            <MetricCard
              title="Active Courses"
              value={stats.activeCourses.toString()}
              change=""
              changeType="positive"
              icon={BookOpen}
              bgColor="bg-gradient-to-r from-indigo-500 to-purple-500"
            />
            <MetricCard
              title="Total Instructors"
              value={stats.totalInstructors.toString()}
              change=""
              changeType="positive"
              icon={UserCheck}
              bgColor="bg-gradient-to-r from-blue-500 to-cyan-400"
            />
            <MetricCard
              title="Revenue This Month"
              value={`Ksh ${stats.revenueThisMonth.toLocaleString()}`}
              change=""
              changeType="positive"
              icon={DollarSign}
              bgColor="bg-gradient-to-r from-green-500 to-emerald-400"
            />
            {/* ENHANCED: Performance Metric */}
            <MetricCard
              title="Performance Score"
              value={`${stats.performance.averagePercentage}%`}
              change={`${stats.performance.studentsAssessed} students assessed`}
              changeType="positive"
              icon={BarChart3}
              bgColor="bg-gradient-to-r from-orange-500 to-red-500"
            />
          </div>

          {/* NEW: Performance Analytics Section */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Assessment Coverage */}
            <Card className="shadow-sm bg-white border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center space-x-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span>Assessment Coverage</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.performance.studentsAssessed}
                  </p>
                  <p className="text-sm text-gray-600">Students Assessed</p>
                  <Progress 
                    value={(stats.performance.studentsAssessed / stats.totalStudents) * 100} 
                    className="h-2 mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round((stats.performance.studentsAssessed / stats.totalStudents) * 100)}% of total students
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Grade Distribution */}
            <Card className="shadow-sm bg-white border lg:col-span-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center space-x-2">
                  <Award className="h-4 w-4 text-green-600" />
                  <span>Grade Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Distinctions */}
                  <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <Award className="h-6 w-6 text-green-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-green-700">{stats.performance.gradeDistribution.distinctions}</p>
                    <p className="text-xs text-green-600">Distinctions</p>
                    <p className="text-xs text-gray-500">80-100%</p>
                  </div>
                  
                  {/* Credits */}
                  <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-blue-700">{stats.performance.gradeDistribution.credits}</p>
                    <p className="text-xs text-blue-600">Credits</p>
                    <p className="text-xs text-gray-500">70-79%</p>
                  </div>
                  
                  {/* Passes */}
                  <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <CheckCircle className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-yellow-700">{stats.performance.gradeDistribution.passes}</p>
                    <p className="text-xs text-yellow-600">Passes</p>
                    <p className="text-xs text-gray-500">50-69%</p>
                  </div>
                  
                  {/* Fails */}
                  <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                    <XCircle className="h-6 w-6 text-red-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-red-700">{stats.performance.gradeDistribution.fails}</p>
                    <p className="text-xs text-red-600">Fails</p>
                    <p className="text-xs text-gray-500">0-49%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Department Overview */}
            <Card className="lg:col-span-1 shadow-sm bg-yellow-100 border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-800">
                  <Building2 className="h-5 w-5 text-gray-700" />
                  <span>Department Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.departments.map((dept, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-700">
                      <span>{dept.name}</span>
                      <span className="font-semibold text-gray-800">
                        {dept.students} students
                      </span>
                    </div>
                    <Progress value={dept.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <RecentActivity />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 [&>*]:p-2 [&>*]:h-[180px]">
            {/* Top Performing Course */}
            <Card className="shadow-sm bg-gray-50 border rounded-lg p-2">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm font-semibold flex items-center space-x-2 text-gray-800">
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                  <span>Top Performing Course</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-1">
                <p className="text-base font-semibold text-gray-900">
                  {stats.topCourse.name}
                </p>
                <p className="text-xs text-gray-700">
                  Avg Score: {stats.topCourse.avgScore}%
                </p>
                <div className="flex items-center space-x-1 text-xs">
                  <span className="text-green-600 font-semibold">
                    ↗ +{stats.topCourse.growth}%
                  </span>
                  <span className="text-gray-600">vs last cohort</span>
                </div>
              </CardContent>
            </Card>

            {/* Pending Payments */}
            <Card className="shadow-sm bg-gray-50 border rounded-lg p-2">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm font-semibold flex items-center space-x-2 text-gray-800">
                  <DollarSign className="h-4 w-4 text-yellow-500" />
                  <span>Pending Payments</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-1">
                <p className="text-base font-semibold text-gray-900">
                  Ksh {stats.pendingPayments.amount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-700">
                  {stats.pendingPayments.students} students with pending fees
                </p>
                <div className="flex items-center space-x-1 text-xs">
                  <span
                    className={
                      stats.pendingPayments.change > 0
                        ? "text-red-600 font-semibold"
                        : "text-green-600 font-semibold"
                    }
                  >
                    {stats.pendingPayments.change > 0
                      ? `↗ +${stats.pendingPayments.change}%`
                      : `↓ ${stats.pendingPayments.change}%`}
                  </span>
                  <span className="text-gray-600">from last month</span>
                </div>
              </CardContent>
            </Card>

            {/* Total Assessments */}
            <Card className="shadow-sm bg-gray-50 border rounded-lg p-2">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm font-semibold flex items-center space-x-2 text-gray-800">
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                  <span>Total Assessments</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-1">
                <p className="text-base font-semibold text-gray-900">
                  {stats.performance.totalAssessments}
                </p>
                <p className="text-xs text-gray-700">
                  Across all courses and modules
                </p>
                <div className="flex items-center space-x-1 text-xs">
                  <span className="text-green-600 font-semibold">
                    Active tracking
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Gender Distribution */}
            <GenderDistributionChart genderStats={stats.genderStats} />
          </div>
          </>
        )}
      </div>
    );
  }
