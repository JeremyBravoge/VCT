import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
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
  const [admissionNo, setAdmissionNo] = useState("STU001");
  const [level, setLevel] = useState("Level 1");
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
                "&background=4f46e5&color=fff",
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
          "Failed to fetch performance data. Please check the admission number.",
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

  const getGradeColor = (grade: string) => {
    switch (grade.toLowerCase()) {
      case "distinction":
        return "text-green-700 font-semibold";
      case "credit":
        return "text-blue-700 font-semibold";
      case "pass":
        return "text-yellow-600 font-semibold";
      default:
        return "text-red-600 font-semibold";
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-screen p-8">
      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center justify-start gap-4 mb-8">
        <Input
          placeholder="Enter Admission No."
          value={admissionNo}
          onChange={(e) => setAdmissionNo(e.target.value)}
          className="w-full md:w-1/3 border-gray-300"
        />
        <Select value={level} onValueChange={setLevel}>
          <SelectTrigger className="w-full md:w-1/3 border-gray-300">
            <SelectValue placeholder="Select Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Level 1">Level 1</SelectItem>
            <SelectItem value="Level 2">Level 2</SelectItem>
            <SelectItem value="Level 3">Level 3</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={fetchPerformance}
          disabled={loading}
          className="bg-yellow-600 hover:bg-yellow-700 text-white w-full md:w-[140px] font-medium shadow"
        >
          {loading ? "SEARCHING..." : "SEARCH"}
        </Button>
      </div>

      {/* Duplicate layout removed; single layout block retained below */}

       {/* Main layout */}
<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
  {/* Left: Table Section */}
  <div className="lg:col-span-3">
    <Card className="shadow-lg rounded-xl border border-yellow-700">
      <CardHeader className="bg-yellow-500 rounded-t-xl">
        <CardTitle className="text-gray-1000 text-lg text-center">Module Performance</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="p-2 border">Code</th>
              <th className="p-2 border">Module Title</th>
              <th className="p-2 border text-center">Theory (%)</th>
              <th className="p-2 border text-center">Practical (%)</th>
              <th className="p-2 border text-center">Grade</th>
            </tr>
          </thead>
          <tbody>
            {performanceData?.modules.map((m: Module, i: number) => (
              <tr key={i} className="hover:bg-indigo-50 transition-all">
                <td className="p-2 border font-medium">{m.code}</td>
                <td className="p-2 border">{m.title}</td>
                <td className="p-2 border text-center">{m.theory}</td>
                <td className="p-2 border text-center">{m.practical}</td>
                <td className={`p-2 border text-center ${getGradeColor(m.grade)}`}>
                  {m.grade}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-3 text-gray-700 text-sm">
          <p>Total Modules: <span className="font-semibold">{performanceData?.performance.totalModules}</span></p>
          <p>Completed: <span className="font-semibold">{performanceData?.performance.completedModules}</span></p>
          <p>Exam Status: <span className="font-semibold text-green-600">{performanceData?.performance.examStatus}</span></p>
        </div>
      </CardContent>
    </Card>
  </div>

  {/* Right: Student Profile (was Attendance) */}
  <Card className="shadow-lg rounded-x3 overflow-hidden border border-yellow-100 bg-gradient-to-r from--600 to-red-50">
    <div className="bg-gradient-to-r from-yellow-600 to-red-600 h-24 relative">
      <img
        src={performanceData?.studentInfo.profileImage}
        alt="Profile"
        className="w-24 h-24 rounded-full border-4 border-red-600 absolute -bottom-10 left-6 object-cover"
      />
    </div>
    <CardContent className="pt-14 pb-6 text-sm space-y-1">
      <h2 className="text-lg font-semibold text-gray-800">{performanceData?.studentInfo.name}</h2>
      <p className="text-gray-500 mb-2">
        Admission No: <span className="font-medium text-gray-800">{performanceData?.studentInfo.admissionNo}</span>
      </p>
      <p><strong>Trade Area:</strong> {performanceData?.studentInfo.tradeArea}</p>
      <p><strong>Training Center:</strong> {performanceData?.studentInfo.trainingCenter}</p>
      <p><strong>Level:</strong> {performanceData?.studentInfo.level}</p>
      <p><strong>Duration:</strong> {performanceData?.studentInfo.duration}</p>
    </CardContent>
  </Card>

        {/* Performance Breakdown */}
        <Card className="lg:col-span-2 shadow-lg rounded-xl border border-gray-100">
          <CardHeader className="bg-indigo-50 rounded-t-xl">
            <CardTitle className="text-gray-800">Performance Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 p-6">
            <div className="space-y-2 text-sm md:text-base">
              <p>
                <strong>Theory Marks:</strong>{" "}
                {performanceData?.performance.theoryMarks}%
              </p>
              <p>
                <strong>Practical Marks:</strong>{" "}
                {performanceData?.performance.practicalMarks}%
              </p>
              <p>
                <strong>Average Marks:</strong>{" "}
                {performanceData?.performance.averageMark}%
              </p>
              <p>
                <strong>Exam Status:</strong>{" "}
                {performanceData?.performance.examStatus}
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div style={{ width: 130, height: 130 }}>
                <CircularProgressbar
                  value={performanceData?.performance.averageMark || 0}
                  text={`${performanceData?.performance.averageMark || 0}%`}
                  styles={buildStyles({
                    pathColor: "#16a34a",
                    textColor: "#1e293b",
                    trailColor: "#e2e8f0",
                    textSize: "16px",
                  })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VocationalPerformance;
