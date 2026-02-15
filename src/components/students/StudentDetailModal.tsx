import {
  X,
  Mail,
  Phone,
  Calendar,
  User,
  GraduationCap,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

interface StudentDetailModalProps {
  student: any;
  onClose: () => void;
}

export function StudentDetailModal({ student, onClose }: StudentDetailModalProps) {
  const formatCurrency = (value: number | string | undefined) =>
    `Ksh. ${(Number(value) || 0).toLocaleString()}`;

  const totalFees = Number(student.totalFees) || 0;
  const totalPaid = Number(student.totalPaid) || 0;
  const feesPending = Number(student.feesPending) || totalFees - totalPaid;
  const progress = totalFees > 0 ? (totalPaid / totalFees) * 100 : 0;

  const getStatusBadge = (status: string) =>
    status === "Active" ? (
      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Active</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inactive</Badge>
    );

  const getPaymentBadge = (pending: number) =>
    pending <= 0 ? (
      <Badge className="bg-green-100 text-green-800 border-green-200">Paid</Badge>
    ) : (
      <Badge className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>
    );

  const getPerformanceBadge = (performance: string) => {
    const variants: Record<string, string> = {
      Excellent: "bg-green-200 text-green-900",
      Good: "bg-blue-200 text-blue-900",
      Average: "bg-yellow-200 text-yellow-900",
      Poor: "bg-red-200 text-red-900",
    };
    return <Badge className={variants[performance] || "bg-gray-100 text-gray-800"}>{performance || "N/A"}</Badge>;
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-white/20"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200/60 dark:border-gray-700/50 bg-gradient-to-r from-purple-600/10 to-pink-500/10 rounded-t-3xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Student Profile</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-red-100 dark:hover:bg-red-900/30"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Personal Info */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-none shadow-lg hover:shadow-xl transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
                  <User className="h-5 w-5" /> Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <Avatar className="h-24 w-24 ring-4 ring-purple-200 shadow-md">
                    {student.image_url ? (
                      <AvatarImage
                        src={
                          student.image_url.startsWith("http")
                            ? student.image_url
                            : `/${student.image_url}`
                        }
                        alt={student.name || "Student"}
                        className="object-cover"
                      />
                    ) : (
                      <AvatarFallback className="bg-purple-100 text-purple-700 font-bold text-xl">
                        {student.name
                          ? student.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                          : "N/A"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {student.name || "N/A"}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {student.student_id || "N/A"}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <Mail className="h-4 w-4" /> {student.email || "N/A"}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <Phone className="h-4 w-4" /> {student.phone || "N/A"}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <Calendar className="h-4 w-4" /> Gender: {student.gender || "N/A"}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Status:</span>
                        {getStatusBadge(student.status || "Inactive")}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Admission Date:</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {student.admission_date || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Attendance:</span>
                        <span className="text-sm font-semibold text-purple-700 dark:text-purple-400">
                          {student.attendance || 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic + Financial */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Academic */}
              <Card className="bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 border-none shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                    <GraduationCap className="h-5 w-5" /> Academic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Course:</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {student.course || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Department:</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {student.department || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-medium">Performance:</span>
                    <div className="flex items-center gap-2">
                      {getPerformanceBadge(student.performance || "")}
                      <span className="text-sm font-semibold">
                        Score: {student.performanceScore || 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Financial */}
              <Card className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:from-amber-900/20 dark:to-orange-900/20 border-none shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                    <DollarSign className="h-5 w-5" /> Financial Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Total Fees:</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatCurrency(totalFees)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Amount Paid:</span>
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency(totalPaid)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Pending:</span>
                      <span
                        className={`text-lg font-bold ${
                          feesPending > 0 ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {formatCurrency(feesPending)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <span className="text-sm font-medium">Payment Progress:</span>
                    <Progress value={progress} className="h-2 rounded-full" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {Math.round(progress)}% completed
                    </p>
                    <Button className="w-full mt-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold hover:brightness-110 transition-all">
                      <DollarSign className="h-4 w-4 mr-2" /> Record Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Analytics */}
            <Card className="bg-gradient-to-r from-purple-50/80 to-pink-50/80 dark:from-purple-900/20 dark:to-pink-900/20 border-none shadow-lg hover:shadow-xl transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
                  <TrendingUp className="h-5 w-5" /> Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-xl bg-purple-100/60 dark:bg-purple-900/30">
                    <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                      {student.performanceScore || 0}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Performance Score
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-green-100/60 dark:bg-green-900/30">
                    <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                      {student.attendance || 0}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Attendance</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-blue-100/60 dark:bg-blue-900/30">
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                      {student.currentGrade || "N/A"}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Current Grade
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
