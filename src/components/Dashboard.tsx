import React, { useEffect, useState } from "react";
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  Building2,
  GraduationCap,
  UserCheck,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import EnrollmentChart from "./EnrollmentChart";


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
}



export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
useEffect(() => {
  fetch("http://localhost:5000/api/dashboard")
    .then(res => res.json())
    .then(data => {
      setStats({
        totalStudents: data.students,
        activeCourses: data.courses,
        revenueThisMonth: Number(data.revenueThisMonth),
        averagePerformance: Number(data.averagePerformance),
        totalInstructors: data.instructors,
        departments: data.departments.map((d: { department: string; total_students: number }) => ({
          name: d.department,
          students: d.total_students,
          progress: Math.floor(Math.random() * 100) // temp until backend sends real
        })),
        topCourse: data.topCourse || { name: "N/A", avgScore: 0, growth: 0 },
        pendingPayments: {
          amount: data.finance.total_pending,
          students: data.pendingPayments.length,
          change: 0
        },
        enrollmentRate: { rate: Number(data.enrollmentRate), change: 0 }
      });
      setLoading(false);
    });
}, []);


  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening at your institution today.
        </p>
      </div>

      {loading && <p className="text-gray-600">Loading dashboard...</p>}

      {!loading && stats && (
        <>
          {/* Metrics Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <MetricCard
              title="Total Students"
              value={stats.totalStudents.toLocaleString()}
              change="+12% from last month"
              changeType="positive"
              icon={Users}
            />
            <MetricCard
              title="Active Courses"
              value={stats.activeCourses.toString()}
              change="+2 new courses"
              changeType="positive"
              icon={BookOpen}
            />
            <MetricCard
              title="Total Instructors"
              value={stats.totalInstructors.toString()}
              change="+3 new instructors"
              changeType="positive"
              icon={UserCheck}
            />
            <MetricCard
              title="Revenue This Month"
              value={`Ksh ${stats.revenueThisMonth.toLocaleString()}`}
              change="+8% from last month"
              changeType="positive"
              icon={DollarSign}
            />
            <MetricCard
              title="Average Performance"
              value={`${stats.averagePerformance.toFixed(1)}%`}
              change="+3.2% improvement"
              changeType="positive"
              icon={TrendingUp}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Department Overview */}
            <Card className="lg:col-span-1 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Department Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.departments.map((dept, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{dept.name}</span>
                      <span className="font-medium">{dept.students} students</span>
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-accent" />
                  <span>Top Performing Course</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-foreground">
                    {stats.topCourse.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Average Score: {stats.topCourse.avgScore}%
                  </p>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-accent font-medium">
                      ↗ +{stats.topCourse.growth}%
                    </span>
                    <span className="text-muted-foreground">vs last cohort</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-warning" />
                  <span>Pending Payments</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-foreground">
                    Ksh {stats.pendingPayments.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {stats.pendingPayments.students} students with pending fees
                  </p>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-warning font-medium">
                      {stats.pendingPayments.change > 0
                        ? `↗ +${stats.pendingPayments.change}%`
                        : `↓ ${stats.pendingPayments.change}%`}
                    </span>
                    <span className="text-muted-foreground">from last month</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <EnrollmentChart enrollmentRate={stats.enrollmentRate.rate} />
          </div>
        </>
      )}
    </div>
  );
}
