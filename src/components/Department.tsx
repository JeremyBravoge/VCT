"use client";

import { useEffect, useState } from "react";
import { Plus, Users, BookOpen, Edit, Trash2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";


export default function Departments() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<any | null>(null);
  const navigate = useNavigate();


  const [newDept, setNewDept] = useState({
    name: "",
    description: "",
    head: "",
    total_students: 0,
    fee_charge: "",
  });

  // ✅ Fetch departments
  useEffect(() => {
    fetch("http://localhost:5000/api/departments")
      .then(res => res.json())
      .then(data => {
        setDepartments(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching departments:", err);
        setLoading(false);
      });
  }, []);

  const filteredDepts = departments.filter((dept) =>
    dept.name.toLowerCase().includes(search.toLowerCase()) ||
    dept.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/departments/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete department");
      setDepartments(departments.filter((d) => d.id !== id));
    } catch (err) {
      console.error("❌ Error deleting department:", err);
    }
  };

  const handleSave = async () => {
    try {
      const method = editingDept ? "PUT" : "POST";
      const url = editingDept
        ? `http://localhost:5000/api/departments/${editingDept.id}`
        : "http://localhost:5000/api/departments";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDept),
      });

      if (!res.ok) throw new Error("Failed to save department");

      const saved = await res.json();

      setDepartments((prev) =>
        editingDept
          ? prev.map((d) => (d.id === saved.id ? saved : d))
          : [...prev, saved]
      );

      setOpen(false);
      setEditingDept(null);
      setNewDept({ name: "", description: "", head: "", total_students: 0, fee_charge: "" });
    } catch (err) {
      console.error("❌ Error saving department:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
  <div>
    <h1 className="text-3xl font-bold text-foreground">Departments</h1>
    <p className="text-muted-foreground">Manage your institution's departments</p>
  </div>

  <div className="flex gap-2">
    <Button
      className="gradient-primary hover:opacity-90 text-white shadow-sm"
      variant="outline"
      size="sm"
      onClick={() => navigate("/departments/management")}
    >
      ← Back
    </Button>
    <Button
      className="gradient-primary hover:opacity-90 text-white shadow-sm"
      onClick={() => setOpen(true)}
    >
      <Plus className="h-4 w-4 mr-2" /> Add Department
    </Button>
  </div>
</div>

      {/* Search */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <Input
            placeholder="Search departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {/* Department Cards */}
      {loading ? (
        <p>Loading departments...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDepts.map((dept) => (
            <Card
              key={dept.id}
              className="shadow-card hover:shadow-academic transition-smooth"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground">
                      {dept.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {dept.description || "No description available"}
                    </p>
                  </div>
                  <Badge variant="outline">ID #{dept.id}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center space-x-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{dept.total_students} students</span>
                  </span>
                  <span className="flex items-center space-x-1 text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>Fee: {dept.fee_charge ? `Ksh ${dept.fee_charge}` : "N/A"}</span>
                  </span>
                </div>

                <div>
                  <Progress value={Math.min(dept.total_students / 200 * 100, 100)} className="h-2" />
                </div>

                <div className="text-sm">
                  <span className="text-muted-foreground">Head:</span>{" "}
                  <span className="font-medium">{dept.head || "Not assigned"}</span>
                </div>

                {/* Actions */}
                <div className="flex justify-between pt-2 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingDept(dept);
                      setNewDept(dept);
                      setOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(dept.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog: Add/Edit Department */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingDept ? "Edit Department" : "Add Department"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label>Name</Label>
              <Input
                value={newDept.name}
                onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={newDept.description}
                onChange={(e) =>
                  setNewDept({ ...newDept, description: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Head of Department</Label>
              <Input
                value={newDept.head}
                onChange={(e) => setNewDept({ ...newDept, head: e.target.value })}
              />
            </div>
            <div>
              <Label>Fee Charge (Ksh)</Label>
              <Input
                type="number"
                value={newDept.fee_charge}
                onChange={(e) =>
                  setNewDept({ ...newDept, fee_charge: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingDept ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
