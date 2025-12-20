import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // New Table component for better structure
import { Search, User, TrendingUp, BookOpen, CheckCircle, XCircle } from 'lucide-react'; // Modern icons

// --- Interface Definitions (Kept as is) ---
interface StudentInfo {
  name: string;
  admissionNo: string;
  tradeArea: string;
  trainingCenter: string;
  level: string;
  duration: string;
  profileImage: string | null;
}

interface Performance {
  totalModules: number;
  completedModules: number;
  averageMark: number;
  attendance: number;
  totalClasses: number;
  theoryMarks: number;
  practicalMarks: number;
  examStatus: string;
}

interface Module {
  code: string;
  title: string;
  theory: number;
  practical: number;
  grade: string;
}

interface PerformanceData {
  studentInfo: StudentInfo;
  performance: Performance;
  modules: Module[];
}

const VocationalPerformance: React.FC = () => {
  // --- State Management (Kept as is) ---
  const [admissionNo, setAdmissionNo] = useState("STU001");
  const [level, setLevel] = useState("Level 1");
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // --- API Fetch Logic (Kept as is to maintain functional API) ---
  const fetchPerformance = async () => {
    if (!admissionNo.trim()) {
      toast({
        title: "Error",
        description: "Please enter an admission number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/performance?admissionNo=${encodeURIComponent(
          admissionNo
        )}&level=${encodeURIComponent(level)}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: PerformanceData = await response.json();
      setPerformanceData({
        ...data,
        studentInfo: {
          ...data.studentInfo,
          profileImage:
            data.studentInfo.profileImage
              ? `http://localhost:5000/${data.studentInfo.profileImage}`
              : "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(data.studentInfo.name) +
                "&background=3b82f6&color=fff&size=96", // Updated background/size for better fit
        },
      });
      toast({
        title: "Success",
        description: "Performance data loaded successfully",
      });
    } catch (error) {
      console.error("Error fetching performance:", error);
      toast({
        title: "Error",
        description:
          "Failed to fetch performance data. Please check the admission number and level.",
        variant: "destructive",
      });
      setPerformanceData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformance();
  }, []);

  // --- Utility Function (Kept as is, using Tailwind classes) ---
  const getGradeColor = (grade: string) => {
    switch (grade.toLowerCase()) {
      case "distinction":
        return "text-green-600 font-semibold bg-green-50/50";
      case "credit":
        return "text-blue-600 font-semibold bg-blue-50/50";
      case "pass":
        return "text-yellow-600 font-semibold bg-yellow-50/50";
      default:
        return "text-red-600 font-semibold bg-red-50/50";
    }
  };
  
  const getExamStatusIcon = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('pass') || lowerStatus.includes('completed')) {
      return <CheckCircle className="w-4 h-4 text-green-500 mr-1" />;
    } else if (lowerStatus.includes('fail') || lowerStatus.includes('incomplete')) {
      return <XCircle className="w-4 h-4 text-red-500 mr-1" />;
    }
    return null;
  };

  // --- Rendered Component (Improved UI/UX) ---
  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center">
        <BookOpen className="w-8 h-8 mr-3 text-blue-600" />
        Student Performance Dashboard
      </h1>

      {/* Filter and Search Section */}
      <Card className="mb-8 p-4 shadow-lg border-t-4 border-blue-500">
        <CardHeader className="p-0 pb-3">
          <CardTitle className="text-xl font-bold text-gray-800">Filter Performance</CardTitle>
        </CardHeader>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <Input
            placeholder="Enter Admission No. (e.g., STU001)"
            value={admissionNo}
            onChange={(e) => setAdmissionNo(e.target.value)}
            className="w-full md:flex-1 h-10 border-gray-300 focus:border-blue-500"
          />
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger className="w-full md:w-[200px] h-10 border-gray-300 focus:ring-blue-500">
              <SelectValue placeholder="Select Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Level 1">Level 1</SelectItem>
              <SelectItem value="Level 2">Level 2</SelectItem>
              <SelectItem value="Level 3">Level 3</SelectItem>
              {/* Add more levels dynamically if needed */}
            </SelectContent>
          </Select>
          <Button
            onClick={fetchPerformance}
            disabled={loading}
            className="w-full md:w-[150px] h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition-colors duration-200"
          >
            {loading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    SEARCHING...
                </>
            ) : (
              <><Search className="w-4 h-4 mr-2" />SEARCH</>
            )}
          </Button>
        </div>
      </Card>

      {/* Main Content Dashboard Layout */}
      {performanceData && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Column 1: Student Profile Card */}
          <Card className="lg:col-span-1 shadow-xl overflow-hidden bg-white hover:shadow-2xl transition-shadow duration-300">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 h-28 relative">
              <img
                src={performanceData.studentInfo.profileImage || undefined}
                alt="Profile"
                className="w-28 h-28 rounded-full border-4 border-white shadow-lg absolute -bottom-14 left-1/2 transform -translate-x-1/2 object-cover"
              />
            </div>
            <CardContent className="pt-16 pb-6 text-center space-y-1">
              <h2 className="text-xl font-bold text-gray-900">{performanceData.studentInfo.name}</h2>
              <p className="text-sm text-gray-500 mb-4">
                Admission No: <span className="font-semibold text-gray-700">{performanceData.studentInfo.admissionNo}</span>
              </p>
              <div className="text-left text-sm space-y-2 border-t pt-3 mt-3">
                <p><strong><BookOpen className="w-4 h-4 inline mr-2 text-blue-500" />Trade Area:</strong> <span className="float-right font-medium text-gray-700">{performanceData.studentInfo.tradeArea}</span></p>
                <p><strong><User className="w-4 h-4 inline mr-2 text-blue-500" />Training Center:</strong> <span className="float-right font-medium text-gray-700">{performanceData.studentInfo.trainingCenter}</span></p>
                <p><strong>Level:</strong> <span className="float-right font-medium text-gray-700">{performanceData.studentInfo.level}</span></p>
                <p><strong>Duration:</strong> <span className="float-right font-medium text-gray-700">{performanceData.studentInfo.duration}</span></p>
              </div>
            </CardContent>
          </Card>

          {/* Column 2: Key Performance Indicators (KPIs) and Visuals */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* KPI 1: Average Mark (Visual Focus) */}
            <Card className="col-span-1 shadow-lg border-l-4 border-green-500 p-4 flex flex-col items-center justify-center">
              <CardTitle className="text-lg font-semibold text-gray-700 mb-4 flex items-center"><TrendingUp className="w-5 h-5 text-green-500 mr-2"/>Average Mark</CardTitle>
              <div style={{ width: 120, height: 120 }}>
                <CircularProgressbar
                  value={performanceData.performance.averageMark}
                  text={`${performanceData.performance.averageMark}%`}
                  styles={buildStyles({
                    pathColor: `#10b981`, // Green-500
                    textColor: "#1f2937", // Gray-800
                    trailColor: "#e5e7eb", // Gray-200
                    textSize: "18px",
                  })}
                />
              </div>
              <CardDescription className="mt-3 text-green-600 font-bold text-lg">Goal Met</CardDescription>
            </Card>

            {/* KPI 2: Attendance */}
            <Card className="col-span-1 shadow-lg border-l-4 border-yellow-500 p-4 flex flex-col items-center justify-center">
              <CardTitle className="text-lg font-semibold text-gray-700 mb-4 flex items-center"><User className="w-5 h-5 text-yellow-500 mr-2"/>Attendance Rate</CardTitle>
              <div style={{ width: 120, height: 120 }}>
                <CircularProgressbar
                  value={(performanceData.performance.attendance / performanceData.performance.totalClasses) * 100}
                  text={`${performanceData.performance.attendance}/${performanceData.performance.totalClasses}`}
                  styles={buildStyles({
                    pathColor: `#f59e0b`, // Yellow-500
                    textColor: "#1f2937",
                    trailColor: "#e5e7eb",
                    textSize: "16px",
                  })}
                />
              </div>
              <CardDescription className="mt-3 text-sm text-gray-600">Total Classes: {performanceData.performance.totalClasses}</CardDescription>
            </Card>

            {/* KPI 3: Module Completion */}
            <Card className="col-span-1 shadow-lg border-l-4 border-indigo-500 p-4 flex flex-col items-center justify-center">
              <CardTitle className="text-lg font-semibold text-gray-700 mb-4 flex items-center"><BookOpen className="w-5 h-5 text-indigo-500 mr-2"/>Module Progress</CardTitle>
              <div style={{ width: 120, height: 120 }}>
                <CircularProgressbar
                  value={(performanceData.performance.completedModules / performanceData.performance.totalModules) * 100}
                  text={`${performanceData.performance.completedModules}/${performanceData.performance.totalModules}`}
                  styles={buildStyles({
                    pathColor: `#6366f1`, // Indigo-500
                    textColor: "#1f2937",
                    trailColor: "#e5e7eb",
                    textSize: "16px",
                  })}
                />
              </div>
              <CardDescription className="mt-3 text-sm text-gray-600">Total Modules: {performanceData.performance.totalModules}</CardDescription>
            </Card>

            {/* Performance Breakdown Summary - Use the rest of the space in the grid */}
            <Card className="col-span-full shadow-lg border-t-2 border-indigo-500">
                <CardHeader className="p-4 border-b">
                    <CardTitle className="text-xl font-bold text-gray-800">Exam Results Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-gray-500 font-medium">Theory Marks</p>
                        <p className="text-xl font-bold text-blue-600 mt-1">{performanceData.performance.theoryMarks}%</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-gray-500 font-medium">Practical Marks</p>
                        <p className="text-xl font-bold text-blue-600 mt-1">{performanceData.performance.practicalMarks}%</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-gray-500 font-medium">Overall Average</p>
                        <p className="text-xl font-bold text-blue-600 mt-1">{performanceData.performance.averageMark}%</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg flex flex-col justify-center items-center">
                        <p className="text-xs text-gray-500 font-medium">Final Status</p>
                        <p className={`text-xl font-bold mt-1 flex items-center ${performanceData.performance.examStatus.toLowerCase().includes('pass') ? 'text-green-700' : 'text-red-700'}`}>
                            {getExamStatusIcon(performanceData.performance.examStatus)}
                            {performanceData.performance.examStatus}
                        </p>
                    </div>
                </CardContent>
            </Card>

          </div>
          
          {/* Column 3 (Full Width Below KPIs): Module Performance Table */}
          <Card className="lg:col-span-4 shadow-xl rounded-xl">
            <CardHeader className="bg-gray-100 rounded-t-xl border-b p-4">
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                Detailed Module Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="w-[100px] text-gray-700">Code</TableHead>
                      <TableHead className="min-w-[200px] text-gray-700">Module Title</TableHead>
                      <TableHead className="text-center text-gray-700">Theory (%)</TableHead>
                      <TableHead className="text-center text-gray-700">Practical (%)</TableHead>
                      <TableHead className="text-center text-gray-700">Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {performanceData.modules.map((m: Module, i: number) => (
                      <TableRow key={i} className="hover:bg-blue-50/50">
                        <TableCell className="font-medium">{m.code}</TableCell>
                        <TableCell>{m.title}</TableCell>
                        <TableCell className="text-center">{m.theory}</TableCell>
                        <TableCell className="text-center">{m.practical}</TableCell>
                        <TableCell className={`text-center font-bold ${getGradeColor(m.grade)}`}>
                            {m.grade}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

        </div>
      )}

      {/* No Data State */}
      {!performanceData && !loading && (
        <Card className="text-center p-10 mt-10 shadow-lg border-t-4 border-red-500">
          <CardTitle className="text-2xl text-red-600 mb-2">No Performance Data Found</CardTitle>
          <CardDescription>Please enter a valid Admission Number and select the correct Level, then click SEARCH.</CardDescription>
        </Card>
      )}
    </div>
  );
};

export default VocationalPerformance;