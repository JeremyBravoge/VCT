import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Sidebar from './components/Sidebar';
import StudentDetailModal from './components/StudentDetailModal';
import UserManagementPage from './components/UserManagement';
import AdmissionsPage from './components/AdmissionsPage';
import FinancePage from "./components/FinancePage";
import Dashboard from "./components/Dashboard";
import Courses from "./components/Courses";
import Login from './components/Login';
import RegisterPage from "./components/Register";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";
import FacilitiesPage from "./components/FacilitiesPage";
import { useState } from "react";
import StudentPerformance from "./components/StudentPerformance";
import StudentPortal from "./components/StudentPortal";
import TrainersPage from "./components/TrainersPage";
import StudentMarksEntryForm from "./components/StudentMarksEntryForm";
import MediaDashboard from "./components/MediaDashboard.tsx";
import TopBar from "./components/layout/TopBar";
import DepartmentManagement from "./components/DepartmentManagement";
import Departments from "./components/Department";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Hide sidebar for login and register pages
  const hideSidebar = location.pathname === "/" || location.pathname.toLowerCase() === "/register";

  const handleLogout = () => {
    console.log("User logged out");
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleNavigate = (page: string) => {
    navigate(`/${page}`);
  };

  return (
    <AuthProvider>
      <Toaster />
<div className="flex h-screen overflow-hidden">
  {/* Sidebar - Fixed */}
  {!hideSidebar && (
    <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white z-40">
      <Sidebar isOpen={sidebarOpen} />
    </div>
  )}

  {/* Main Area */}
  <div className={`flex flex-col flex-1 ${!hideSidebar ? "ml-64" : ""}`}>
    {/* Top Bar - Sticky */}
    {!hideSidebar && (
      <div className="sticky top-0 z-30">
        <TopBar />
      </div>
    )}

    {/* Page content - Scrollable */}
    <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/financepage" element={<ProtectedRoute><FinancePage /></ProtectedRoute>} />
        <Route path="/usermanagement" element={<ProtectedRoute><UserManagementPage /></ProtectedRoute>} />
        <Route path="/admissionsPage" element={<ProtectedRoute><AdmissionsPage /></ProtectedRoute>} />
        <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
        <Route path="/studentdetailmodal" element={<ProtectedRoute><StudentDetailModal /></ProtectedRoute>} />
        <Route path="/facilitiespage" element={<ProtectedRoute><FacilitiesPage /></ProtectedRoute>} />
        <Route path="/studentportal" element={<ProtectedRoute><StudentPortal onLogout={handleLogout} onNavigate={handleNavigate} /></ProtectedRoute>} />
        <Route path="/studentperformance" element={<ProtectedRoute><StudentPerformance /></ProtectedRoute>} />
        <Route path="/trainerspage" element={<ProtectedRoute><TrainersPage /></ProtectedRoute>} />
        <Route path="/marks-entry" element={<ProtectedRoute><StudentMarksEntryForm /></ProtectedRoute>} />
        <Route path="/media" element={<ProtectedRoute><MediaDashboard /></ProtectedRoute>} />
        <Route path="/departments/management" element={<DepartmentManagement />} />
        <Route path="/department" element={<ProtectedRoute><Departments /></ProtectedRoute>} />
      </Routes>
    </main>
  </div>
</div>

    </AuthProvider>
  );
}

export default App;
