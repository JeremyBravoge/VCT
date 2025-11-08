"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Plus, Building2, BookOpen, Users, DollarSign } from "lucide-react";

export default function AcademicDashboard() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/departments").then(res => res.json()),
      fetch("http://localhost:5000/api/courses").then(res => res.json())
    ])
      .then(([deptData, courseData]) => {
        setDepartments(deptData);
        setCourses(courseData);
        setLoading(false);
      })
      .catch(err => console.error("Error loading data:", err));
  }, []);

  const totalStudents = departments.reduce((acc, d) => acc + (d.total_students || 0), 0);
  const totalRevenue = departments.reduce((acc, d) => acc + (d.fee_charge || 0), 0);

  const deptPerformance = departments.map(d => ({
    name: d.name,
    students: d.total_students || 0,
    revenue: d.fee_charge || 0
  }));

  const COLORS = ["#2563eb", "#22c55e", "#eab308", "#ef4444", "#8b5cf6"];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Academic Dashboard</h1>
        <div className="space-x-2">
          <Button><Plus className="w-4 h-4 mr-1" /> Add Department</Button>
          <Button variant="secondary"><Plus className="w-4 h-4 mr-1" /> Add Course</Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Departments</CardTitle>
            <Building2 className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{departments.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Courses</CardTitle>
            <BookOpen className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{courses.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Students</CardTitle>
            <Users className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalStudents}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Ksh {totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Department Performance</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deptPerformance}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="students" fill="#2563eb" name="Students" />
                <Bar dataKey="revenue" fill="#22c55e" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Student Distribution by Department</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deptPerformance}
                  dataKey="students"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {deptPerformance.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Department Table */}
      <Card>
        <CardHeader><CardTitle>Department & Course Summary</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Head</TableHead>
                <TableHead>Courses</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Fee (Ksh)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell>{dept.name}</TableCell>
                  <TableCell>{dept.head || "N/A"}</TableCell>
                  <TableCell>{courses.filter(c => c.department_id === dept.id).length}</TableCell>
                  <TableCell>{dept.total_students || 0}</TableCell>
                  <TableCell>{dept.fee_charge?.toLocaleString() || "0"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
