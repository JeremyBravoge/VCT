"use client";

import React, { useState, useEffect } from "react";
import { Edit, Trash2, Save, Plus, X, Award, BookOpen, Search, Filter } from "lucide-react";

interface ApiMark {
  student_id: string;
  first_name: string;
  last_name: string;
  module_id: number;
  module_title: string;
  level_name: string;
  practical_marks: number;
  theory_marks: number;
  grade: string;
}

interface Mark {
  id: string;
  name: string;
  module: string;
  moduleId: number;
  level: string;
  practical: number;
  theory: number;
  total: number;
  grade: string;
}

interface FormData {
  studentID: string;
  studentName: string;
  module: string;
  level: string;
  practical: string;
  theory: string;
}

interface Module {
  id: number;
  title: string;
  level_name: string;
}



interface Student {
  id: string;
  first_name: string;
  last_name: string;
  course_id: number;
  course_name: string;
}

const StudentMarksEntryForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    studentID: "",
    studentName: "",
    module: "",
    level: "",
    practical: "",
    theory: "",
  });
  const [submittedMarks, setSubmittedMarks] = useState<Mark[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterGrade, setFilterGrade] = useState("All");

  const [students, setStudents] = useState<Student[]>([]);
  const [filteredModules, setFilteredModules] = useState<Module[]>([]);

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/student-performance/students");
        if (!res.ok) throw new Error("Failed to fetch students");
        const data: Student[] = await res.json();
        setStudents(data);
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    };
    fetchStudents();
  }, []);

  // Fetch all marks
  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/student-performance");
        if (!res.ok) throw new Error("Failed to fetch marks");
        const data: ApiMark[] = await res.json();

        const mapped: Mark[] = data.map((item) => ({
          id: item.student_id ?? "",
          name: `${item.first_name ?? ""} ${item.last_name ?? ""}`
            .trim()
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          module: item.module_title ?? "",
          moduleId: item.module_id ?? 0,
          level: item.level_name ?? "",
          practical: item.practical_marks ?? 0,
          theory: item.theory_marks ?? 0,
          total: (item.practical_marks ?? 0) + (item.theory_marks ?? 0),
          grade: item.grade
            ? item.grade.charAt(0).toUpperCase() + item.grade.slice(1).toLowerCase()
            : "Fail",
        }));

        setSubmittedMarks(mapped);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMarks();
  }, []);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Fetch enrolled modules when student is selected
    if (name === "studentID" && value) {
      fetchModulesForCourse(value);
    }

    // Update level when module changes
    if (name === "module" && value) {
      const selectedModule = filteredModules.find((m) => m.id.toString() === value);
      if (selectedModule) setFormData((prev) => ({ ...prev, level: selectedModule.level_name }));
    }
  };

  // Fetch only enrolled modules for a student
  const fetchModulesForCourse = async (studentId: string) => {
    try {
      if (!studentId) return setFilteredModules([]);

      const res = await fetch(`http://localhost:5000/api/student-performance/modules?student_id=${studentId}`);
      if (!res.ok) throw new Error("Failed to fetch enrolled modules");

      const modules: Module[] = await res.json();

      setFilteredModules(modules);

      // Auto-set level to first module
      if (modules.length > 0) {
        setFormData((prev) => ({ ...prev, level: modules[0].level_name, module: modules[0].id.toString() }));
      } else {
        setFormData((prev) => ({ ...prev, level: "", module: "" }));
      }
    } catch (err) {
      console.error("Error fetching modules:", err);
      setFilteredModules([]);
      setFormData((prev) => ({ ...prev, level: "", module: "" }));
    }
  };

  const resetForm = () => {
    setFormData({
      studentID: "",
      studentName: "",
      module: "",
      level: "",
      practical: "",
      theory: "",
    });
    setErrorMsg("");
    setFilteredModules([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { studentID, module, level, practical, theory } = formData;

    if (!studentID || !module || !level) {
      setErrorMsg("⚠️ Please fill in all fields.");
      return;
    }

    const p = parseFloat(practical);
    const t = parseFloat(theory);
    if (isNaN(p) || isNaN(t) || p < 0 || p > 50 || t < 0 || t > 50) {
      setErrorMsg("⚠️ Practical/Theory marks must be between 0 and 50.");
      return;
    }

    const payload = {
      student_id: studentID,
      module_id: module,
      practical_marks: Number(practical),
      theory_marks: Number(theory),
    };

    try {
      const response = await fetch("http://localhost:5000/api/student-performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to save marks" }));
        throw new Error(errorData.error || "Failed to save marks");
      }

      // Refresh marks after saving
      const fetchRes = await fetch("http://localhost:5000/api/student-performance");
      const data: ApiMark[] = await fetchRes.json();
      const mapped: Mark[] = data.map((item) => ({
        id: item.student_id ?? "",
        name: `${item.first_name ?? ""} ${item.last_name ?? ""}`
          .trim()
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        module: item.module_title ?? "",
        moduleId: item.module_id ?? 0,
        level: item.level_name ?? "",
        practical: item.practical_marks ?? 0,
        theory: item.theory_marks ?? 0,
        total: (item.practical_marks ?? 0) + (item.theory_marks ?? 0),
        grade: item.grade
          ? item.grade.charAt(0).toUpperCase() + item.grade.slice(1).toLowerCase()
          : "Fail",
      }));
      setSubmittedMarks(mapped);
      setIsEditing(false);
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setErrorMsg(`⚠️ ${err.message}`);
    }
  };

  const handleEdit = (index: number) => {
    const mark = submittedMarks[index];
    fetchModulesForCourse(mark.id);

    setFormData({
      studentID: mark.id,
      studentName: mark.name,
      module: mark.moduleId.toString(),
      level: mark.level,
      practical: mark.practical.toString(),
      theory: mark.theory.toString(),
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (index: number) => {
    const mark = submittedMarks[index];
    if (!mark.id || !mark.moduleId) return alert("Missing student or module info.");
    if (!window.confirm(`Delete ${mark.name}'s marks for ${mark.module}?`)) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/student-performance/${mark.id}/${mark.moduleId}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete record");
      setSubmittedMarks(submittedMarks.filter((_, i) => i !== index));
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete record. Please try again.");
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "Distinction":
        return "bg-green-100 text-green-800";
      case "Credit":
        return "bg-blue-100 text-blue-800";
      case "Pass":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const filteredMarks = submittedMarks.filter((mark) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      mark.name.toLowerCase().includes(query) ||
      mark.id.toLowerCase().includes(query) ||
      mark.module.toLowerCase().includes(query) ||
      mark.level.toLowerCase().includes(query);
    const matchesGrade = filterGrade === "All" || mark.grade === filterGrade;
    return matchesSearch && matchesGrade;
  });

  const gradeCounts = submittedMarks.reduce<Record<string, number>>(
    (acc, curr) => {
      const g = curr.grade || "Fail";
      acc[g] = (acc[g] || 0) + 1;
      return acc;
    },
    { Distinction: 0, Credit: 0, Pass: 0, Fail: 0 }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 flex justify-center items-center gap-2">
            <Award className="text-indigo-600" /> Student Marks Portal
          </h1>
          <p className="text-gray-500 text-lg">Manage and track student marks effortlessly 🎓</p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {["Distinction", "Credit", "Pass", "Fail"].map((g) => (
            <div
              key={g}
              className={`bg-white shadow rounded-xl p-4 border-l-4 ${
                g === "Distinction"
                  ? "border-green-500"
                  : g === "Credit"
                  ? "border-blue-500"
                  : g === "Pass"
                  ? "border-yellow-500"
                  : "border-red-500"
              }`}
            >
              <h3 className="text-sm text-gray-600">{g + "s"}</h3>
              <p
                className={`text-2xl font-bold ${
                  g === "Distinction"
                    ? "text-green-600"
                    : g === "Credit"
                    ? "text-blue-600"
                    : g === "Pass"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {gradeCounts[g]}
              </p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <BookOpen className="text-purple-600" /> Marks Records ({filteredMarks.length})
            </h2>
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <div className="relative w-full lg:w-64">
                <Search className="absolute left-2 top-2.5 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by name, ID, or module..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-2 top-2.5 text-gray-400" size={18} />
                <select
                  value={filterGrade}
                  onChange={(e) => setFilterGrade(e.target.value)}
                  className="pl-8 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                >
                  {["All", "Distinction", "Credit", "Pass", "Fail"].map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow"
              >
                <Plus size={16} /> Add Marks
              </button>
            </div>
          </div>

          {filteredMarks.length > 0 ? (
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  {["ID", "Name", "Module", "Level", "Practical", "Theory", "Total", "Grade", "Actions"].map(
                    (head) => (
                      <th key={head} className="p-3 text-left font-semibold">
                        {head}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredMarks.map((mark, i) => (
                  <tr key={i} className="border-b hover:bg-indigo-50 transition-all">
                    <td className="p-3 font-medium">{mark.id}</td>
                    <td className="p-3">{mark.name}</td>
                    <td className="p-3">{mark.module}</td>
                    <td className="p-3">{mark.level}</td>
                    <td className="p-3">{mark.practical}</td>
                    <td className="p-3">{mark.theory}</td>
                    <td className="p-3 font-semibold">{mark.total}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${getGradeColor(
                          mark.grade
                        )}`}
                      >
                        {mark.grade}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      <button onClick={() => handleEdit(i)} className="text-indigo-600 hover:text-indigo-800">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(i)} className="text-red-600 hover:text-red-800">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500 py-10">No records found 📝</p>
          )}
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative animate-fadeIn">
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                {isEditing ? "Edit Marks" : "Add Marks"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Student</label>
                  <select
                    name="studentID"
                    value={formData.studentID}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Student</option>
                    {students.map((s, index) => (
                      <option key={`${s.id}-${index}`} value={s.id}>
                        {`${s.first_name} ${s.last_name}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Module</label>
                  <select
                    name="module"
                    value={formData.module}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Module</option>
                    {filteredModules.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Level</label>
                  <input
                    type="text"
                    name="level"
                    value={formData.level}
                    readOnly
                    className="w-full mt-1 p-2 rounded-md border border-gray-300 bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Practical Marks</label>
                    <input
                      type="number"
                      name="practical"
                      value={formData.practical}
                      onChange={handleChange}
                      min={0}
                      max={50}
                      className="w-full mt-1 p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Theory Marks</label>
                    <input
                      type="number"
                      name="theory"
                      value={formData.theory}
                      onChange={handleChange}
                      min={0}
                      max={50}
                      className="w-full mt-1 p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium flex justify-center items-center gap-2"
                >
                  <Save size={16} /> {isEditing ? "Update Marks" : "Submit Marks"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentMarksEntryForm;
