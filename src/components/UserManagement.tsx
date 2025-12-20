import axios from "axios";
import React, { useEffect, useState, type ChangeEvent } from "react";
// Import more icons for better visual clarity
import { Eye, Pencil, Trash, Plus, User, Mail, Phone, Lock, Upload, Server, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator"; // Added Separator for modal clarity

// Existing Interfaces (Kept as is)
interface SystemUser {
  id: string;
  full_name: string;
  username: string;
  email: string;
  role: string;
  branch_id: string | null;
  status: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
  profile_image: string | null;
}

interface UserRole {
  id: string;
  name: string;
  description: string;
}

interface Branch {
  id: string;
  name: string;
  location: string;
}

interface NewUser {
  full_name: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  branch_id: string;
  status: string;
  profile_image: string | File;
  password: string;
}

const BACKEND_URL = "http://localhost:5000";

const UserManagementPage = () => {
  // --- State Hooks ---
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // Added for button loading state
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);

  const initialNewUserState: NewUser = {
    full_name: "",
    username: "",
    email: "",
    phone: "",
    role: "teacher",
    branch_id: "none",
    status: "active",
    profile_image: "https://dummyimage.com/100x100/A0AEC0/FFFFFF&text=P", // Default placeholder image
    password: "",
  };

  const [newUser, setNewUser] = useState<NewUser>(initialNewUserState);

  // --- Utility Functions ---
  const resetForm = () => {
    setNewUser(initialNewUserState);
    setEditingUser(null);
  };
  
  // UX Improvement: Centralized modal close/open logic to reset form easily
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetForm();
    }
  };

  const getRoleByName = (roleName: string) => userRoles.find((role) => role.name === roleName);
  const getBranchById = (branchId: string | null) => branches.find((branch) => branch.id === branchId);

  // UX Improvement: Robust image rendering logic
  const renderProfileImage = (image: string | File | null) => {
    if (!image || (typeof image === "string" && (image.startsWith("https://via.placeholder.com") || image.startsWith("https://dummyimage.com")))) {
      return "https://dummyimage.com/100x100/A0AEC0/FFFFFF&text=P"; // Generic User Placeholder
    }
    if (typeof image === "string") {
      if (image.startsWith("http")) return image;
      const filename = image.replace(/^\/uploads\//, "");
      return `${BACKEND_URL}/uploads/${filename}`;
    }
    return URL.createObjectURL(image); // For local file preview
  };
  
  // UX Improvement: View action shows a styled alert
  const handleView = (user: SystemUser) => {
    alert(`
      👤 **User Details**
      Full Name: ${user.full_name}
      Username: ${user.username}
      Email: ${user.email}
      Phone: ${user.phone || "N/A"}
      Role: ${user.role}
      Branch: ${getBranchById(user.branch_id)?.name || "Global"}
      Status: ${user.status}
      Created: ${new Date(user.created_at).toLocaleDateString()}
    `);
  };

  // --- API Call Functions ---

  useEffect(() => {
    // Static roles and branches initialization
    setUserRoles([
      { id: "1", name: "admin", description: "Full system access" },
      { id: "2", name: "teacher", description: "Manages classes and students" },
      { id: "3", name: "accountant", description: "Handles school fees" },
      { id: "4", name: "super admin", description: "Oversees all branches" },
    ]);
    setBranches([
      { id: "1", name: "Kakamega Branch", location: "Kakamega" },
      { id: "2", name: "Nairobi Branch", location: "Nairobi" },
    ]);

    // Fetch users
    axios
      .get(`${BACKEND_URL}/api/users`)
      .then((res) => setUsers(res.data))
      .catch((err) => {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users. Please ensure the backend is running at " + BACKEND_URL);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (user: SystemUser) => {
    setEditingUser(user);
    // Initialize form with existing user data
    setNewUser({
      full_name: user.full_name,
      username: user.username,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      branch_id: user.branch_id || "",
      status: user.status,
      profile_image: user.profile_image || initialNewUserState.profile_image,
      password: "", // Password is never pre-filled for security
    });
    handleOpenChange(true); // Use centralized open handler
  };

  const handleDelete = async (id: string) => {
    if (!confirm("⚠️ Are you sure you want to permanently delete this user? This action cannot be undone.")) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
      alert("✅ User deleted successfully!"); // Replace with Toast in a real app
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err) ? err.response?.data?.message || err.message : "Unknown error";
      console.error("Error deleting user:", errorMessage);
      alert("❌ Failed to delete user: " + errorMessage);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setNewUser({ ...newUser, profile_image: file });
  };

  const handleSaveUser = async () => {
    const isEditing = editingUser !== null;
    
    if (!newUser.full_name || !newUser.username || !newUser.email || (!isEditing && !newUser.password)) {
      alert(`❌ Please fill all required fields: Full Name, Username, Email${isEditing ? '' : ', and Password'}`);
      return;
    }

    setIsSubmitting(true);
    const url = isEditing ? `${BACKEND_URL}/api/users/${editingUser!.id}` : `${BACKEND_URL}/api/users/register`;
    const method = isEditing ? "PUT" : "POST";

    try {
      const formData = new FormData();
      formData.append("full_name", newUser.full_name);
      formData.append("username", newUser.username);
      formData.append("email", newUser.email);
      formData.append("phone", newUser.phone);
      formData.append("role", newUser.role);
      formData.append("branch_id", newUser.branch_id === "none" ? "" : newUser.branch_id);
      formData.append("status", newUser.status);
      
      if (newUser.profile_image instanceof File) {
        formData.append("profile_image", newUser.profile_image);
      } else if (typeof newUser.profile_image === "string") {
        // Send existing path/placeholder if no new file is selected
        formData.append("profile_image_path", newUser.profile_image);
      }
      
      if (newUser.password) {
        formData.append("password", newUser.password);
      }
      
      const res = await axios({ method, url, data: formData });

      // State update approximation (assumes API returns success/relevant data)
      const newUserData: SystemUser = {
        ...(isEditing ? editingUser! : {}),
        id: isEditing ? editingUser!.id : res.data.userId?.toString() || `temp-id-${Date.now()}`, // Fallback for ID
        full_name: newUser.full_name,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone || null,
        role: newUser.role,
        branch_id: newUser.branch_id || null,
        status: newUser.status,
        created_at: isEditing ? editingUser!.created_at : new Date().toISOString(),
        updated_at: new Date().toISOString(),
        profile_image: typeof newUser.profile_image === "string" ? newUser.profile_image : (newUser.profile_image as File).name,
      };

      if (isEditing) {
        setUsers(users.map(u => u.id === newUserData.id ? newUserData : u));
        alert("✅ User updated successfully!");
      } else {
        setUsers([...users, newUserData]);
        alert("✅ User added successfully!");
      }

      handleOpenChange(false);
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err) ? err.response?.data?.message || err.message : "Unknown error";
      console.error(`Error ${isEditing ? 'updating' : 'adding'} user:`, errorMessage);
      alert(`❌ Failed to ${isEditing ? 'update' : 'add'} user: ` + errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render Component (UI/UX Improvements implemented below) ---
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      
      {/* Header and Add Button */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
             <User className="w-6 h-6 text-blue-600" /> System Users Management
          </h1>
          <p className="text-gray-600 mt-1">Central dashboard to manage all system accounts and assign their roles/branches.</p>
        </div>
        <Button onClick={() => handleOpenChange(true)} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-md transition-all px-6 py-3">
          <Plus className="w-4 h-4" /> Create New User
        </Button>
      </div>

      {/* Loading and Error States */}
      {loading && <p className="text-center py-10 text-lg text-gray-500 flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin mr-2" /> Fetching user data...</p>}
      {error && <p className="text-center py-10 text-xl font-medium text-red-600 border border-red-300 bg-red-50 rounded-lg">{error}</p>}

      {/* User Table (Improved Design) */}
      {!loading && !error && (
        <div className="overflow-x-auto rounded-xl shadow-2xl border border-gray-100 bg-white">
          <Table>
            <TableHeader className="bg-blue-50/50">
              <TableRow className="border-b-2 border-blue-100">
                <TableHead className="w-[80px]">Profile</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead className="text-center w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => {
                  const role = getRoleByName(user.role);
                  const branch = getBranchById(user.branch_id);
                  return (
                    <TableRow key={user.id} className="hover:bg-blue-50/30 transition-colors">
                      <TableCell>
                        <img
                          src={renderProfileImage(user.profile_image)}
                          alt={user.full_name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 shadow-sm"
                        />
                      </TableCell>
                      <TableCell className="font-medium text-gray-800">{user.full_name}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell className="text-sm text-gray-600">{user.email}</TableCell>
                      <TableCell>
                        <Badge 
                          className={`
                            font-semibold text-xs py-1 px-3 
                            ${user.role === 'super admin' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' : 
                              user.role === 'teacher' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : 
                              'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                          {role?.name.charAt(0).toUpperCase() + role?.name.slice(1) || user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`font-semibold text-xs py-1 px-3 ${user.status === "active" ? "bg-green-500 hover:bg-green-600 text-white" : "bg-red-400 hover:bg-red-500 text-white"}`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-700">{branch?.name || "Global"}</TableCell>
                      <TableCell className="flex gap-2 justify-center">
                        <Button variant="outline" size="icon" onClick={() => handleView(user)} title="View Details" className="w-8 h-8 hover:bg-blue-100 border-blue-200">
                          <Eye className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleEdit(user)} title="Edit User" className="w-8 h-8 hover:bg-yellow-100 border-yellow-200">
                          <Pencil className="w-4 h-4 text-yellow-600" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(user.id)} title="Delete User" className="w-8 h-8 hover:bg-red-100 border-red-200">
                          <Trash className="w-4 h-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                    No users found. Click "Create New User" to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* --- ADD/EDIT USER DIALOG (Major UI/UX Improvement) --- */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-4xl w-full rounded-xl shadow-2xl p-6 bg-white">
          <DialogHeader className="border-b pb-4 mb-4">
            <DialogTitle className="text-2xl font-bold text-gray-800">{editingUser ? "Edit User: " + editingUser.full_name : "Add New System User"}</DialogTitle>
            <DialogDescription>
              {editingUser ? "Update user profile and system access permissions." : "Fill in the details to create a new user account."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column: Profile Image Upload */}
            <div className="flex flex-col items-center gap-4 w-full md:w-1/4 pt-6 pb-4 border-r pr-6">
              <img
                src={renderProfileImage(newUser.profile_image)}
                alt="Profile Preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-xl"
              />
              <Label htmlFor="profile-image" className="font-semibold text-gray-700 flex items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors">
                <Upload className="w-4 h-4" /> Upload Image
              </Label>
              <Input id="profile-image" type="file" accept="image/*" onChange={handleImageChange} className="text-sm p-1 file:bg-gray-100 file:border-0 file:text-xs" />
            </div>

            {/* Right Column: Form Fields */}
            <div className="flex-1 space-y-6">
              {/* Personal Information Group */}
              <div>
                <h3 className="font-semibold text-lg text-blue-600 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5" /> Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Full Name <span className="text-red-500">*</span></Label>
                    <Input value={newUser.full_name} onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })} placeholder="e.g., Jane Doe" />
                  </div>
                  <div className="space-y-1">
                    <Label>Username <span className="text-red-500">*</span></Label>
                    <Input value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} placeholder="e.g., janed" />
                  </div>
                  <div className="space-y-1">
                    <Label><Mail className="w-3 h-3 inline mr-1 text-gray-500" /> Email <span className="text-red-500">*</span></Label>
                    <Input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} placeholder="jane@school.com" />
                  </div>
                  <div className="space-y-1">
                    <Label><Phone className="w-3 h-3 inline mr-1 text-gray-500" /> Phone</Label>
                    <Input value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} placeholder="e.g., +254 700 000 000" />
                  </div>
                </div>
              </div>
              
              <Separator />

              {/* System Access & Security Group */}
              <div>
                <h3 className="font-semibold text-lg text-blue-600 mb-3 flex items-center gap-2">
                  <Server className="w-5 h-5" /> System Access
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Role <span className="text-red-500">*</span></Label>
                    <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        {userRoles.map((role) => (
                          <SelectItem key={role.id} value={role.name}>
                            {role.name.charAt(0).toUpperCase() + role.name.slice(1)} ({role.description})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Branch</Label>
                    <Select value={newUser.branch_id} onValueChange={(value) => setNewUser({ ...newUser, branch_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Branch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Global / N/A</SelectItem>
                        {branches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Status</Label>
                    <Select value={newUser.status} onValueChange={(value) => setNewUser({ ...newUser, status: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label><Lock className="w-3 h-3 inline mr-1 text-gray-500" /> {editingUser ? "New Password (optional)" : "Password"} <span className="text-red-500">{!editingUser && '*'}</span></Label>
                    <Input 
                      type="password" 
                      placeholder={editingUser ? "Leave blank to keep current password" : "Required for new users"} 
                      value={newUser.password} 
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 pt-4 border-t">
            <Button
              onClick={handleSaveUser}
              disabled={isSubmitting} // UX Improvement: Disable button during submission
              className="bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg min-w-[120px]"
            >
              {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
              ) : (
                  <>{editingUser ? "Update User" : "Save User"}</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagementPage;