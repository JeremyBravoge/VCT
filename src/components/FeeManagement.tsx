import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Course {
  id: string;
  name: string;
  duration: string;
  fee: number;
}

interface Payment {
  id: string;
  studentName: string;
  courseName: string;
  amountPaid: number;
  balance: number;
  receiptNo: string;
  status: "paid" | "partial" | "pending";
}

const FeeManagement: React.FC = () => {
  const [view, setView] = useState<"courses" | "payments" | "receipts">("courses");

  // Dummy courses
  const courses: Course[] = [
    { id: "1", name: "Computer Packages", duration: "3 months", fee: 5000 },
    { id: "2", name: "Hairdressing & Beauty", duration: "3 months", fee: 7000 },
    { id: "3", name: "Electrical Installation", duration: "3 months", fee: 10000 },
  ];

  // Dummy payments
  const payments: Payment[] = [
    { id: "p1", studentName: "John Doe", courseName: "Computer Packages", amountPaid: 3000, balance: 2000, receiptNo: "RC001", status: "partial" },
    { id: "p2", studentName: "Jane Smith", courseName: "Hairdressing & Beauty", amountPaid: 7000, balance: 0, receiptNo: "RC002", status: "paid" },
  ];

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-red-600 to-yellow-500">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Fee Management</h1>
        <div className="space-x-3">
          <Button onClick={() => setView("courses")} variant={view === "courses" ? "default" : "outline"}>
            Courses
          </Button>
          <Button onClick={() => setView("payments")} variant={view === "payments" ? "default" : "outline"}>
            Payments
          </Button>
          <Button onClick={() => setView("receipts")} variant={view === "receipts" ? "default" : "outline"}>
            Receipts
          </Button>
        </div>
      </div>

      {/* Courses Section */}
      {view === "courses" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="shadow-lg border-2 border-yellow-400">
              <CardHeader className="bg-red-700 text-white rounded-t-lg">
                <CardTitle>{course.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Duration:</strong> {course.duration}</p>
                <p><strong>Fee:</strong> KES {course.fee.toLocaleString()}</p>
                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
                  Enroll
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Payments Section */}
      {view === "payments" && (
        <Card className="shadow-lg border-2 border-yellow-400">
          <CardHeader className="bg-red-700 text-white rounded-t-lg">
            <CardTitle>Payments</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full border border-gray-200 bg-white">
              <thead className="bg-yellow-100">
                <tr>
                  <th className="p-3 text-left">Receipt No</th>
                  <th className="p-3 text-left">Student</th>
                  <th className="p-3 text-left">Course</th>
                  <th className="p-3 text-left">Paid</th>
                  <th className="p-3 text-left">Balance</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{p.receiptNo}</td>
                    <td className="p-3">{p.studentName}</td>
                    <td className="p-3">{p.courseName}</td>
                    <td className="p-3 text-green-600">KES {p.amountPaid.toLocaleString()}</td>
                    <td className="p-3 text-red-600">KES {p.balance.toLocaleString()}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          p.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : p.status === "partial"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Receipts Section */}
      {view === "receipts" && (
        <Card className="shadow-lg border-2 border-yellow-400">
          <CardHeader className="bg-red-700 text-white rounded-t-lg">
            <CardTitle>Receipts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">Here you can generate and view payment receipts.</p>
            <Button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white">Generate Receipt</Button>
            <Button className="mt-4 ml-2 bg-green-500 hover:bg-green-600 text-white">Export to Excel</Button>
            <Button className="mt-4 ml-2 bg-blue-500 hover:bg-blue-600 text-white">Print All</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FeeManagement;
