// src/components/students/EditStudentModal.tsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";

interface EditStudentModalProps {
  student: any | null; // Student object
  open: boolean;
  onClose: () => void;
  onStudentUpdated: () => void; // callback after update
}

const EditStudentModal: React.FC<EditStudentModalProps> = ({
  student,
  open,
  onClose,
  onStudentUpdated,
}) => {
  const [formData, setFormData] = useState<any>({});

  // Load student data into form when modal opens
  useEffect(() => {
    if (student) {
      setFormData(student);
    }
  }, [student]);

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  // Save updates
  const handleSubmit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/students/${student.id}`, formData);
      alert("Student updated successfully!");
      onStudentUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update student.");
    }
  };

  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* Personal Info */}
          <div>
            <Label>First Name</Label>
            <Input name="first_name" value={formData.first_name || ""} onChange={handleChange} />
          </div>
          <div>
            <Label>Last Name</Label>
            <Input name="last_name" value={formData.last_name || ""} onChange={handleChange} />
          </div>
          <div>
            <Label>ID Number</Label>
            <Input name="id_number" value={formData.id_number || ""} onChange={handleChange} />
          </div>
          <div>
            <Label>Date of Birth</Label>
            <Input type="date" name="date_of_birth" value={formData.date_of_birth?.split("T")[0] || ""} onChange={handleChange} />
          </div>
          <div>
            <Label>Age</Label>
            <Input name="age" value={formData.age || ""} onChange={handleChange} />
          </div>
          <div>
            <Label>Gender</Label>
            <Select onValueChange={(v) => handleSelectChange("gender", v)} value={formData.gender || ""}>
              <SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" name="email" value={formData.email || ""} onChange={handleChange} />
          </div>
          <div>
            <Label>Phone</Label>
            <Input name="phone" value={formData.phone || ""} onChange={handleChange} />
          </div>
          <div>
            <Label>Address</Label>
            <Input name="address" value={formData.address || ""} onChange={handleChange} />
          </div>
          <div>
            <Label>Nationality</Label>
            <Input name="nationality" value={formData.nationality || ""} onChange={handleChange} />
          </div>
          <div>
            <Label>County</Label>
            <Input name="county" value={formData.county || ""} onChange={handleChange} />
          </div>

          {/* Guardian Info */}
          <div>
            <Label>Guardian Name</Label>
            <Input name="guardian_name" value={formData.guardian_name || ""} onChange={handleChange} />
          </div>
          <div>
            <Label>Guardian Contact</Label>
            <Input name="guardian_contact" value={formData.guardian_contact || ""} onChange={handleChange} />
          </div>

          {/* Academic Info */}
          <div>
            <Label>Admission Date</Label>
            <Input type="date" name="admission_date" value={formData.admission_date?.split("T")[0] || ""} onChange={handleChange} />
          </div>
          <div>
            <Label>Status</Label>
            <Select onValueChange={(v) => handleSelectChange("status", v)} value={formData.status || ""}>
              <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Later: department_id and branch_id dropdowns from API */}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditStudentModal;
