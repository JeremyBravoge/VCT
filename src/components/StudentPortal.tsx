import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  GraduationCap,
  Home,
  LogOut,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

interface StudentPortalProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

const StudentPortal: React.FC<StudentPortalProps> = ({
  onLogout,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState("overview");

  const studentData = {
    profile: {
      name: "Mary Wanjiku",
      admissionNumber: "STD2024001",
      class: "Grade 7A",
      level: "Upper Primary",
      photo: "/placeholder.svg",
    },
    grades: [
      { subject: "Mathematics", currentTerm: 85, previousTerm: 78, grade: "A", trend: "up" },
      { subject: "English", currentTerm: 78, previousTerm: 82, grade: "B+", trend: "down" },
      { subject: "Science", currentTerm: 92, previousTerm: 88, grade: "A", trend: "up" },
      { subject: "Social Studies", currentTerm: 75, previousTerm: 70, grade: "B", trend: "up" },
      { subject: "Kiswahili", currentTerm: 80, previousTerm: 76, grade: "B+", trend: "up" },
      { subject: "CRE", currentTerm: 88, previousTerm: 85, grade: "A-", trend: "up" },
    ],
    attendance: { current: 94, total: 180, present: 169, absent: 8, late: 3 },
    fees: {
      totalDue: 28000,
      totalPaid: 20000,
      balance: 8000,
      dueDate: "2025-02-15",
      payments: [
        { date: "2025-01-15", amount: 10000, method: "M-Pesa", receipt: "MPT001" },
        { date: "2025-01-05", amount: 10000, method: "Bank Transfer", receipt: "BNK001" },
      ],
    },
    assignments: [
      { subject: "Mathematics", title: "Algebra Problems", dueDate: "2025-01-15", status: "pending" },
      { subject: "English", title: "Essay Writing", dueDate: "2025-01-12", status: "submitted" },
      { subject: "Science", title: "Lab Report", dueDate: "2025-01-18", status: "pending" },
    ],
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "bg-green-100 text-green-800";
    if (grade.startsWith("B")) return "bg-blue-100 text-blue-800";
    if (grade.startsWith("C")) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getTrendIcon = (trend: string) =>
    trend === "up" ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                Student Portal
              </h1>
              <p className="text-gray-600 text-sm">
                Welcome back, {studentData.profile.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => onNavigate("home")}
              variant="ghost"
              className="flex items-center space-x-2 hover:bg-gray-100"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Button>
            <Button
              onClick={onLogout}
              variant="outline"
              className="flex items-center space-x-2 border-gray-300 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto p-6 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              label: "Current Average",
              value: `${Math.round(
                studentData.grades.reduce((a, g) => a + g.currentTerm, 0) /
                  studentData.grades.length
              )}%`,
              color: "text-blue-600",
              icon: <Award className="w-8 h-8 text-blue-600" />,
            },
            {
              label: "Attendance",
              value: `${studentData.attendance.current}%`,
              color: "text-green-600",
              icon: <Calendar className="w-8 h-8 text-green-600" />,
            },
            {
              label: "Fee Balance",
              value: `KSh ${studentData.fees.balance.toLocaleString()}`,
              color: "text-orange-600",
              icon: <DollarSign className="w-8 h-8 text-orange-600" />,
            },
            {
              label: "Class Rank",
              value: "3rd / 45",
              color: "text-purple-600",
              icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="hover:shadow-md transition">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                  </div>
                  {stat.icon}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Card className="shadow-md border-gray-200">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 bg-gray-100 rounded-t-lg">
                {["overview", "grades", "attendance", "fees", "assignments"].map(
                  (tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="capitalize data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:font-semibold"
                    >
                      {tab}
                    </TabsTrigger>
                  )
                )}
              </TabsList>

              {/* Content Wrapper */}
              <motion.div
                className="p-6"
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Academic Overview
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Grades Summary */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5" /> Recent Grades
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {studentData.grades.slice(0, 3).map((g, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                            >
                              <div>
                                <p className="font-medium">{g.subject}</p>
                                <p className="text-sm text-gray-500">
                                  {g.currentTerm}%
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={getGradeColor(g.grade)}>
                                  {g.grade}
                                </Badge>
                                {getTrendIcon(g.trend)}
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      {/* Attendance Summary */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" /> Attendance Summary
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Overall Attendance</span>
                              <span>{studentData.attendance.current}%</span>
                            </div>
                            <Progress
                              value={studentData.attendance.current}
                              className="h-2"
                            />
                          </div>
                          <div className="grid grid-cols-3 text-center">
                            <div>
                              <p className="text-xl font-bold text-green-600">
                                {studentData.attendance.present}
                              </p>
                              <p className="text-xs text-gray-600">Present</p>
                            </div>
                            <div>
                              <p className="text-xl font-bold text-red-600">
                                {studentData.attendance.absent}
                              </p>
                              <p className="text-xs text-gray-600">Absent</p>
                            </div>
                            <div>
                              <p className="text-xl font-bold text-yellow-600">
                                {studentData.attendance.late}
                              </p>
                              <p className="text-xs text-gray-600">Late</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* You can keep your other tab contents (grades, attendance, fees, assignments) unchanged — they’ll inherit this modern layout styling */}
              </motion.div>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentPortal;
