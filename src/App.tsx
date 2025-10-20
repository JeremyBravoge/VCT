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
import { TopBar } from "./components/layout/TopBar";
import { useState } from "react";
import StudentPerformance from "./components/StudentPerformance";
import StudentPortal from "./components/StudentPortal";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Hide sidebar & topbar for login and register pages
  const hideSidebarAndTopbar =
    location.pathname === "/" || location.pathname.toLowerCase() === "/register";

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
      <div className="flex min-h-screen">
        {/* Sidebar */}
        {!hideSidebarAndTopbar && (
          <Sidebar isOpen={sidebarOpen} />
        )}

        {/* Main Area */}
        <div className={`flex-1 ${!hideSidebarAndTopbar ? "ml-64" : ""}`}>
          {/* TopBar should look like part of content, not global header */}
          {!hideSidebarAndTopbar && (
            <TopBar
              onLogout={handleLogout}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />
          )}

          {/* Page content */}
          <div className={`${!hideSidebarAndTopbar ? "pt-20" : ""} p-6`}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/financepage"
                element={
                  <ProtectedRoute>
                    <FinancePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/usermanagement"
                element={
                  <ProtectedRoute>
                    <UserManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admissionsPage"
                element={
                  <ProtectedRoute>
                    <AdmissionsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses"
                element={
                  <ProtectedRoute>
                    <Courses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/studentdetailmodal"
                element={
                  <ProtectedRoute>
                    <StudentDetailModal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/facilitiespage"
                element={
                  <ProtectedRoute>
                    <FacilitiesPage />
                  </ProtectedRoute>
                }
                
              />
              <Route
                path="/studentportal"
                element={
                  <ProtectedRoute>
                    <StudentPortal onLogout={handleLogout} onNavigate={handleNavigate} />
                  </ProtectedRoute>
                }

              />
              <Route
                path="/studentperformance"
                element={
                  <ProtectedRoute>
                    <StudentPerformance/>
                  </ProtectedRoute>
                }
                
              />
            </Routes>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
