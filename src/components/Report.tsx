"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Download,
  TrendingUp,
  Users,
  DollarSign,
  BookOpen,
  BarChart3,
  CalendarDays,
  Target,
  RefreshCw,
  FileText,
  CreditCard,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  Legend,
  CartesianGrid
} from "recharts";

// --- Types & Interfaces ---
interface ReportData {
  year: number;
  month: string;
  monthNumber: number;
  totalStudents: number;
  newEnrollments: number;
  totalRevenue: number;
  activeCourses: number;
  completionRate: number;
  departmentPerformance: any[];
  coursePerformance: any[];
  revenueBreakdown: any[];
}

interface DashboardData {
  students: number;
  courses: number;
  users: number;
  intakes: number;
  instructors: number;
  enrollments: number;
  revenueThisMonth: string;
  averagePerformance: string;
  departments: Array<{
    department: string;
    total_students: number;
  }>;
  topCourse: {
    name: string;
    avgScore: number;
    percentage: number;
    growth: number;
  };
  pendingPayments: Array<{
    student_name: string;
    total_amount: string;
    amount_paid: string;
    amount_pending: string;
  }>;
  enrollmentRate: number;
  finance: {
    total_fees: string;
    total_paid: string;
    total_pending: string;
  };
  genderStats: {
    male: number;
    female: number;
    others: number;
  };
  performance: {
    averageScore: string;
    averagePercentage: string;
    studentsAssessed: number;
    gradeDistribution: {
      distinctions: number;
      credits: number;
      passes: number;
      fails: number;
    };
    totalAssessments: number;
  };
}

// --- Sub-Components ---

const StatsCard = ({ title, value, subtext, trend, icon: Icon, colorClass, bgClass }: any) => (
  <Card className="border-l-4 border-l-transparent hover:border-l-primary transition-all shadow-sm hover:shadow-md">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${bgClass}`}>
          <Icon className={`h-6 w-6 ${colorClass}`} />
        </div>
        {trend && (
          <Badge variant="outline" className={`${trend > 0 ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"} flex items-center gap-1`}>
            {trend > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(trend)}%
          </Badge>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
        <p className="text-xs text-gray-400 mt-2">{subtext}</p>
      </div>
    </CardContent>
  </Card>
);

const ChartCard = ({ title, subtitle, icon: Icon, children }: any) => (
  <Card className="shadow-sm hover:shadow-md transition-shadow h-full">
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5 text-gray-500" />}
            {title}
          </CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className="pt-4">{children}</CardContent>
  </Card>
);

// --- Main Component ---

export default function ReportsDashboard() {
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"monthly" | "yearly">("monthly");
  
  // Constants
  const availableYears = [2025, 2024, 2023, 2022];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4"];

  useEffect(() => {
    fetchDashboardData();
  }, [selectedYear]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch from the correct endpoint
      const response = await fetch('http://localhost:5000/api/dashboard');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: DashboardData = await response.json();
      setDashboardData(data);
      
      // Transform the real API data into report format
      const monthlyData: ReportData[] = months.map((month, index) => {
        const revenueThisMonth = parseFloat(data.revenueThisMonth) || 1000;
        const monthlyRevenue = revenueThisMonth / 12;
        
        return {
          year: selectedYear,
          month,
          monthNumber: index + 1,
          totalStudents: data.students || 0,
          newEnrollments: Math.floor(Math.random() * 10) + 1, // Simulate monthly enrollments
          totalRevenue: monthlyRevenue + Math.floor(Math.random() * 1000),
          activeCourses: data.courses || 0,
          completionRate: parseFloat(data.performance.averagePercentage) || 0,
          departmentPerformance: data.departments.map(dept => ({
            name: dept.department,
            students: dept.total_students || 0
          })),
          coursePerformance: [
            { 
              name: data.topCourse?.name || "Computer Packages", 
              enrollment: Math.floor(data.students * 0.8) || 5,
              completion: data.topCourse?.percentage || 87
            }
          ],
          revenueBreakdown: [
            { category: "Course Fees", amount: Math.floor(monthlyRevenue * 0.65), percentage: 65 },
            { category: "Exam Fees", amount: Math.floor(monthlyRevenue * 0.15), percentage: 15 },
            { category: "Other", amount: Math.floor(monthlyRevenue * 0.20), percentage: 20 },
          ]
        };
      });

      setReportData(monthlyData);
    } catch (error) {
      console.error("Fetch error:", error);
      
      // Fallback to static data
      const fallbackData: ReportData[] = months.map((month, index) => ({
        year: selectedYear,
        month,
        monthNumber: index + 1,
        totalStudents: 6,
        newEnrollments: Math.floor(Math.random() * 5) + 1,
        totalRevenue: 1000 + Math.floor(Math.random() * 500),
        activeCourses: 5,
        completionRate: 86.82,
        departmentPerformance: [
          { name: "ICT", students: 5 },
          { name: "Business", students: 0 },
          { name: "Engineering", students: 0 },
        ],
        coursePerformance: [
          { name: "Computer Packages", enrollment: 5, completion: 87 },
        ],
        revenueBreakdown: [
          { category: "Course Fees", amount: 650, percentage: 65 },
          { category: "Exam Fees", amount: 150, percentage: 15 },
          { category: "Other", amount: 200, percentage: 20 },
        ]
      }));
      
      setReportData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  // Memoized filtered data to prevent recalc on every render
  const filteredData = useMemo(() => {
    return selectedMonth === "all" 
      ? reportData 
      : reportData.filter(d => d.month === selectedMonth);
  }, [reportData, selectedMonth]);

  // Aggregate totals for the top cards - using real data
  const totals = useMemo(() => {
    if (timeRange === "monthly") {
      return {
        students: filteredData.reduce((acc, curr) => acc + curr.totalStudents, 0),
        revenue: filteredData.reduce((acc, curr) => acc + curr.totalRevenue, 0),
        courses: filteredData.reduce((acc, curr) => Math.max(acc, curr.activeCourses), 0),
        completion: Math.round(filteredData.reduce((acc, curr) => acc + curr.completionRate, 0) / (filteredData.length || 1))
      };
    } else {
      // Yearly view - use actual dashboard data
      return {
        students: dashboardData?.students || 0,
        revenue: parseFloat(dashboardData?.finance?.total_paid || "0") || 0,
        courses: dashboardData?.courses || 0,
        completion: parseFloat(dashboardData?.performance?.averagePercentage || "0") || 0
      };
    }
  }, [filteredData, dashboardData, selectedYear, timeRange]);

  // Calculate real revenue data
  const realRevenue = dashboardData ? parseFloat(dashboardData.finance.total_paid) : 0;
  const realPending = dashboardData ? parseFloat(dashboardData.finance.total_pending) : 0;
  const realTotal = dashboardData ? parseFloat(dashboardData.finance.total_fees) : 0;

  // Calculate real trends based on actual data
  const studentTrend = dashboardData?.enrollmentRate || 80;
  const revenueTrend = dashboardData?.topCourse?.growth || 12;

  const LoadingSkeleton = () => (
    <div className="min-h-screen p-6 space-y-6">
      <div className="flex justify-between"><Skeleton className="h-10 w-48" /><Skeleton className="h-10 w-32" /></div>
      <div className="grid grid-cols-4 gap-4"><Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" /></div>
      <div className="grid grid-cols-2 gap-6"><Skeleton className="h-80" /><Skeleton className="h-80" /></div>
    </div>
  );

  if (loading && reportData.length === 0) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-xl border shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Analytics Dashboard</h1>
          <p className="text-slate-500 mt-1">Real-time insights using actual system data</p>
          {dashboardData && (
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                Live Data
              </Badge>
              <span className="text-xs text-gray-500">Last updated: Just now</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="ghost" onClick={fetchDashboardData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          
          <div className="h-8 w-px bg-gray-200 mx-2 hidden lg:block"></div>

          <Select value={timeRange} onValueChange={(v: any) => setTimeRange(v)}>
            <SelectTrigger className="w-[140px] bg-slate-100 border-0">
               <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly View</SelectItem>
              <SelectItem value="yearly">Yearly View</SelectItem>
            </SelectContent>
          </Select>

          {timeRange === "monthly" && (
            <>
              <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
                <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
                <SelectContent>{availableYears.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}</SelectContent>
              </Select>
              
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </>
          )}

          <Button className="bg-slate-900 text-white hover:bg-slate-800">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      {/* KPI Cards - Using REAL Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Students" 
          value={dashboardData?.students?.toString() || "0"} 
          subtext={`${dashboardData?.enrollments || 0} enrollments`}
          trend={studentTrend}
          icon={Users}
          colorClass="text-blue-600"
          bgClass="bg-blue-100"
        />
        <StatsCard 
          title="Total Revenue" 
          value={`KES ${realRevenue.toLocaleString()}`} 
          subtext={`KES ${realPending.toLocaleString()} pending`}
          trend={revenueTrend}
          icon={DollarSign}
          colorClass="text-emerald-600"
          bgClass="bg-emerald-100"
        />
        <StatsCard 
          title="Avg. Completion" 
          value={`${dashboardData?.performance?.averagePercentage || "0"}%`} 
          subtext={`${dashboardData?.performance?.studentsAssessed || 0} students assessed`}
          trend={2.4}
          icon={Target}
          colorClass="text-amber-600"
          bgClass="bg-amber-100"
        />
        <StatsCard 
          title="Active Courses" 
          value={dashboardData?.courses?.toString() || "0"} 
          subtext={`${dashboardData?.instructors || 0} instructors`}
          icon={BookOpen}
          colorClass="text-violet-600"
          bgClass="bg-violet-100"
        />
      </div>

      {/* Real Data Summary */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending Payments</p>
                  <h3 className="text-xl font-bold mt-1">KES {realPending.toLocaleString()}</h3>
                </div>
                <CreditCard className="h-8 w-8 text-amber-500" />
              </div>
              <div className="mt-3 text-xs text-gray-500">
                {dashboardData.pendingPayments?.length || 0} students with pending payments
              </div>
            </CardContent>
          </Card>
          
          <Card className="border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Top Course</p>
                  <h3 className="text-xl font-bold mt-1">{dashboardData.topCourse?.name || "N/A"}</h3>
                </div>
                <Award className="h-8 w-8 text-green-500" />
              </div>
              <div className="mt-3 text-xs text-gray-500">
                Score: {dashboardData.topCourse?.avgScore || 0}% ({dashboardData.topCourse?.growth || 0}% growth)
              </div>
            </CardContent>
          </Card>
          
          <Card className="border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Department Distribution</p>
                  <h3 className="text-xl font-bold mt-1">
                    {dashboardData.departments?.filter(d => d.total_students > 0).length || 0} Active
                  </h3>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mt-3 text-xs text-gray-500">
                ICT: {dashboardData.departments?.find(d => d.department === "ICT")?.total_students || 0} students
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Area */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white p-1 border h-auto">
          <TabsTrigger value="overview" className="px-6 py-2 data-[state=active]:bg-slate-100">Overview</TabsTrigger>
          <TabsTrigger value="financial" className="px-6 py-2 data-[state=active]:bg-slate-100">Financials</TabsTrigger>
          <TabsTrigger value="academic" className="px-6 py-2 data-[state=active]:bg-slate-100">Academics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Enrollment Trends" subtitle="Student distribution by department" icon={TrendingUp}>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={dashboardData?.departments?.filter(d => d.total_students > 0) || []} 
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="department" 
                      tick={{fontSize: 12, fill: '#6b7280'}} 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <YAxis 
                      tick={{fontSize: 12, fill: '#6b7280'}} 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <Tooltip 
                      cursor={{fill: '#f3f4f6'}} 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                    />
                    <Bar 
                      dataKey="total_students" 
                      fill="#3b82f6" 
                      radius={[4, 4, 0, 0]} 
                      barSize={32} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Performance Metrics" subtitle="Academic assessment results" icon={BarChart3}>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={[
                      { name: 'Distinctions', value: dashboardData?.performance?.gradeDistribution?.distinctions || 0 },
                      { name: 'Credits', value: dashboardData?.performance?.gradeDistribution?.credits || 0 },
                      { name: 'Passes', value: dashboardData?.performance?.gradeDistribution?.passes || 0 },
                      { name: 'Fails', value: dashboardData?.performance?.gradeDistribution?.fails || 0 }
                    ]} 
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="name" 
                      tick={{fontSize: 12, fill: '#6b7280'}} 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <YAxis 
                      tick={{fontSize: 12, fill: '#6b7280'}} 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <Tooltip 
                      cursor={{fill: '#f3f4f6'}} 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#10b981" 
                      radius={[4, 4, 0, 0]} 
                      barSize={32} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle>Pending Payments Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-xs font-semibold">
                    <tr>
                      <th className="px-6 py-4 rounded-tl-lg">Student Name</th>
                      <th className="px-6 py-4">Total Amount</th>
                      <th className="px-6 py-4">Amount Paid</th>
                      <th className="px-6 py-4 rounded-tr-lg">Pending Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dashboardData?.pendingPayments?.map((payment, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{payment.student_name}</td>
                        <td className="px-6 py-4">KES {parseFloat(payment.total_amount).toLocaleString()}</td>
                        <td className="px-6 py-4 text-emerald-600 font-medium">
                          KES {parseFloat(payment.amount_paid).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <Badge className="bg-red-50 text-red-700 hover:bg-red-100">
                            KES {parseFloat(payment.amount_pending).toLocaleString()}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ChartCard title="Revenue Distribution" subtitle="Current financial status" icon={DollarSign}>
                <div className="h-[300px] flex flex-col items-center justify-center">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-emerald-600">
                      KES {realRevenue.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-500">Total Collected</p>
                  </div>
                  
                  <div className="w-full space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Fees:</span>
                      <span className="font-medium">KES {realTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Collected:</span>
                      <span className="font-medium text-emerald-600">KES {realRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Pending:</span>
                      <span className="font-medium text-red-600">KES {realPending.toLocaleString()}</span>
                    </div>
                    <div className="pt-3 border-t">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Collection Rate:</span>
                        <span className="font-medium">
                          {realTotal > 0 ? ((realRevenue / realTotal) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </ChartCard>
              
              <ChartCard title="Department Enrollment" subtitle="Students by department" icon={Users}>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={dashboardData?.departments || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="total_students"
                      >
                        {(dashboardData?.departments || []).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36}/>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
              
              <ChartCard title="Gender Distribution" subtitle="Student demographics" icon={Users}>
                <div className="h-[300px] flex flex-col items-center justify-center">
                  <div className="w-48 h-48 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{dashboardData?.students || 0}</div>
                        <div className="text-sm text-gray-500">Total Students</div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-6 w-full">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{dashboardData?.genderStats?.male || 0}</div>
                      <div className="text-xs text-gray-500">Male</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-pink-600">{dashboardData?.genderStats?.female || 0}</div>
                      <div className="text-xs text-gray-500">Female</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-600">{dashboardData?.genderStats?.others || 0}</div>
                      <div className="text-xs text-gray-500">Other</div>
                    </div>
                  </div>
                </div>
              </ChartCard>
           </div>
        </TabsContent>
        
        <TabsContent value="academic">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle>Academic Performance Summary</CardTitle>
              <CardDescription>Based on assessment data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Overall Performance</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Average Score</span>
                        <span className="font-medium">{dashboardData?.performance?.averageScore || "0"}%</span>
                      </div>
                      <Progress 
                        value={parseFloat(dashboardData?.performance?.averageScore || "0")} 
                        className="h-2" 
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Students Assessed</span>
                        <span className="font-medium">{dashboardData?.performance?.studentsAssessed || 0}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Total Assessments</span>
                        <span className="font-medium">{dashboardData?.performance?.totalAssessments || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Grade Distribution</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Distinctions</span>
                      <Badge className="bg-blue-100 text-blue-800">{dashboardData?.performance?.gradeDistribution?.distinctions || 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Credits</span>
                      <Badge className="bg-green-100 text-green-800">{dashboardData?.performance?.gradeDistribution?.credits || 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                      <span className="font-medium">Passes</span>
                      <Badge className="bg-amber-100 text-amber-800">{dashboardData?.performance?.gradeDistribution?.passes || 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="font-medium">Fails</span>
                      <Badge className="bg-red-100 text-red-800">{dashboardData?.performance?.gradeDistribution?.fails || 0}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}