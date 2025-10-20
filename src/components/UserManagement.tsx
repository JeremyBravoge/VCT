import axios from "axios";
import React, { useEffect, useState, type ChangeEvent } from "react";
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
import { Eye, Pencil, Trash, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);

  const [newUser, setNewUser] = useState<NewUser>({
    full_name: "",
    username: "",
    email: "",
    phone: "",
    role: "teacher",
    branch_id: "",
    status: "active",
    profile_image: "https://via.placeholder.com/100",
    password: "",
  });

  useEffect(() => {
    // Static roles
    setUserRoles([
      { id: "1", name: "admin", description: "Full system access" },
      { id: "2", name: "teacher", description: "Manages classes and students" },
      { id: "3", name: "accountant", description: "Handles school fees" },
      { id: "4", name: "super admin", description: "Oversees all branches" },
    ]);

    // Static branches
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
        setError("Failed to fetch users. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (user: SystemUser) => {
    setEditingUser(user);
    setNewUser({
      full_name: user.full_name,
      username: user.username,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      branch_id: user.branch_id || "",
      status: user.status,
      profile_image: user.profile_image || "https://via.placeholder.com/100",
      password: "",
    });
    setOpen(true);
  };

  const getRoleByName = (roleName: string) => userRoles.find((role) => role.name === roleName);
  const getBranchById = (branchId: string | null) => branches.find((branch) => branch.id === branchId);

  const handleView = (id: string) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;
    alert(`👤 ${user.full_name}\n📧 ${user.email}\n📞 ${user.phone || "N/A"}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
      alert("✅ User deleted successfully");
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

  const renderProfileImage = (image: string | File | null) => {
    if (!image) {
      return "https://via.placeholder.com/100";
    }
    if (typeof image === "string") {
      if (image.startsWith("http")) return image;
      const filename = image.replace(/^\/uploads\//, "");
      return `${BACKEND_URL}/uploads/${filename}`;
    }
    return URL.createObjectURL(image);
  };

  const handleAddUser = async () => {
    if (!newUser.full_name || !newUser.username || !newUser.email || !newUser.password) {
      alert("❌ Please fill all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("full_name", newUser.full_name);
      formData.append("username", newUser.username);
      formData.append("email", newUser.email);
      formData.append("phone", newUser.phone);
      formData.append("role", newUser.role);
      formData.append("branch_id", newUser.branch_id);
      formData.append("status", newUser.status);
      if (typeof newUser.profile_image === "string") {
        formData.append("profile_image", newUser.profile_image);
      } else if (newUser.profile_image instanceof File) {
        formData.append("profile_image", newUser.profile_image);
      }
      if (newUser.password) {
        formData.append("password", newUser.password);
      }

      const res = await axios.post(`${BACKEND_URL}/api/users/register`, formData);

      const addedUser: SystemUser = {
        id: res.data.userId.toString(),
        full_name: newUser.full_name,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone || null,
        role: newUser.role,
        branch_id: newUser.branch_id || null,
        status: newUser.status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        profile_image:
          typeof newUser.profile_image === "string"
            ? newUser.profile_image
            : (newUser.profile_image as File).name,
      };

      setUsers([...users, addedUser]);
      setOpen(false);
      resetForm();
      alert("✅ User added successfully");
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err) ? err.response?.data?.message || err.message : "Unknown error";
      console.error("Error adding user:", errorMessage);
      alert("❌ Failed to add user: " + errorMessage);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      const formData = new FormData();
      formData.append("full_name", newUser.full_name);
      formData.append("username", newUser.username);
      formData.append("email", newUser.email);
      formData.append("phone", newUser.phone);
      formData.append("role", newUser.role);
      formData.append("branch_id", newUser.branch_id);
      formData.append("status", newUser.status);
      if (typeof newUser.profile_image === "string") {
        formData.append("profile_image", newUser.profile_image);
      } else if (newUser.profile_image instanceof File) {
        formData.append("profile_image", newUser.profile_image);
      }
      if (newUser.password) {
        formData.append("password", newUser.password);
      }

      await axios.put(`${BACKEND_URL}/api/users/${editingUser.id}`, formData);

      const updatedUser: SystemUser = {
        ...editingUser,
        full_name: newUser.full_name,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone || null,
        role: newUser.role,
        branch_id: newUser.branch_id || null,
        status: newUser.status,
        updated_at: new Date().toISOString(),
        profile_image:
          typeof newUser.profile_image === "string"
            ? newUser.profile_image
            : (newUser.profile_image as File).name,
      };

      setUsers(
        users.map((u) =>
          u.id === editingUser.id ? updatedUser : u
        )
      );

      setOpen(false);
      setEditingUser(null);
      resetForm();
      alert("✅ User updated successfully");
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err) ? err.response?.data?.message || err.message : "Unknown error";
      console.error("Error updating user:", errorMessage);
      alert("❌ Failed to update user: " + errorMessage);
    }
  };

  const resetForm = () => {
    setNewUser({
      full_name: "",
      username: "",
      email: "",
      phone: "",
      role: "teacher",
      branch_id: "",
      status: "active",
      profile_image: "https://via.placeholder.com/100",
      password: "",
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">System Users</h1>
          <p className="text-gray-600">Manage all registered users across branches.</p>
        </div>
        <Button onClick={() => setOpen(true)} className="bg-blue-600 text-white flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add User
        </Button>
      </div>

      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-lg shadow-lg border bg-white">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead>Profile</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => {
                  const role = getRoleByName(user.role);
                  const branch = getBranchById(user.branch_id);
                  return (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell>
                        <img
                          src={renderProfileImage(user.profile_image)}
                          alt={user.full_name}
                          className="w-10 h-10 rounded-full"
                        />
                      </TableCell>
                      <TableCell>{user.full_name}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone || "N/A"}</TableCell>
                      <TableCell>
                        <Badge>{role?.name || user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{branch?.name || "N/A"}</TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="flex gap-2 justify-center">
                        <Button variant="ghost" size="sm" onClick={() => handleView(user.id)}>
                          <Eye className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                          <Pencil className="w-4 h-4 text-yellow-600" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)}>
                          <Trash className="w-4 h-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-6">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl w-full rounded-lg shadow-lg p-6 bg-white">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
            <DialogDescription>
              {editingUser ? "Update user information." : "Fill in all the fields to create a new system user."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-6 mt-4">
            <div className="flex flex-col items-center gap-4">
              <img
                src={renderProfileImage(newUser.profile_image)}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover border"
              />
              <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <Label>Full Name</Label>
                <Input value={newUser.full_name} onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })} placeholder="Full Name" />
              </div>
              <div className="flex flex-col">
                <Label>Username</Label>
                <Input value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} placeholder="Username" />
              </div>
              <div className="flex flex-col">
                <Label>Email</Label>
                <Input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} placeholder="Email" />
              </div>
              <div className="flex flex-col">
                <Label>Phone</Label>
                <Input value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} placeholder="Phone" />
              </div>
              <div className="flex flex-col">
                <Label>Role</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {userRoles.map((role) => (
                      <SelectItem key={role.id} value={role.name}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col">
                <Label>Branch</Label>
                <Select value={newUser.branch_id} onValueChange={(value) => setNewUser({ ...newUser, branch_id: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col">
                <Label>Status</Label>
                <Select value={newUser.status} onValueChange={(value) => setNewUser({ ...newUser, status: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col col-span-2">
                <Label>{editingUser ? "New Password (optional)" : "Password"}</Label>
                <Input 
                  type="password" 
                  placeholder={editingUser ? "Leave blank to keep current password" : "Password"} 
                  value={newUser.password} 
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} 
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              onClick={editingUser ? handleUpdateUser : handleAddUser}
              className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              {editingUser ? "Update" : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagementPage;
