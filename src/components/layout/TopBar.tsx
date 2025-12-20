import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, User, Settings, Bell, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/AuthContext";

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon: string;
}

interface UserProfile {
  id: number;
  full_name: string;
  email: string;
  role: string;
  profile_image?: string;
}

export default function DashboardTopbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();

  const path = location.pathname.split("/")[1] || "dashboard";
  const pageName =
    path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");

  // ✅ Fetch Notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!token) return;
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("http://localhost:5000/api/activities/recent", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch notifications");

        const data = await response.json();
        const formatted = data.map((item: any) => ({
          id: item.id,
          type: item.type || "activity",
          title: `${item.student} ${item.action} ${item.course}`,
          message: `${item.action} ${item.course}`,
          timestamp: item.time,
          read: false,
          icon:
            item.type === "enrollment"
              ? "🎓"
              : item.type === "payment"
              ? "💳"
              : "📢",
        }));

        setNotifications(formatted);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [token]);

  // ✅ Fetch Logged-in User Profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user profile");

        const data = await res.json();

        // ✅ Map backend fields correctly
        const userData: UserProfile = {
          id: data.id,
          full_name: data.full_name,
          email: data.email,
          role: data.role,
          profile_image: data.profile_image
            ? `http://localhost:5000/uploads/${data.profile_image}`
            : "https://randomuser.me/api/portraits/men/32.jpg",
        };

        setProfile(userData);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [token]);

  // ✅ Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Format timestamp
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff} mins ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return `${Math.floor(diff / 1440)} days ago`;
  };

  const getIconBgColor = (type: string) => {
    switch (type) {
      case "message": return "bg-blue-100 text-blue-600";
      case "announcement": return "bg-purple-100 text-purple-600";
      case "payment": return "bg-green-100 text-green-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <header className="flex items-center justify-between bg-gray-50 px-6 py-3 border-b relative">
      {/* Left Side */}
      <div>
        <div className="flex items-center text-sm text-gray-500">
          <Home className="w-4 h-4 mr-1" />
          <span> / </span>
          <span className="ml-1">{pageName}</span>
        </div>
        <h1 className="text-lg font-semibold text-gray-800">{pageName}</h1>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-4">
        <Input
          type="text"
          placeholder="Search here"
          className="pl-3 pr-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none w-48"
        />

        {/* Notifications */}
        <div className="flex items-center space-x-4 text-gray-500 relative" ref={dropdownRef}>
          <Settings className="w-5 h-5 cursor-pointer hover:text-gray-700" />
          <Bell
            className="w-5 h-5 cursor-pointer hover:text-gray-700"
            onClick={() => setShowNotifications(!showNotifications)}
          />

          {/* Notifications dropdown */}
{showNotifications && (
  <div
    className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50"
    style={{ maxHeight: "70vh", overflowY: "auto" }}
  >
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
      <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
      <button onClick={() => navigate("/notification")} className="text-xs text-blue-600 hover:underline">
        Mark all as read
      </button>
    </div>

    <ul className="divide-y divide-gray-100">
      {loading ? (
        <li className="px-4 py-3 text-center text-sm text-gray-500">
          Loading...
        </li>
      ) : error ? (
        <li className="px-4 py-3 text-center text-sm text-red-500">{error}</li>
      ) : notifications.length === 0 ? (
        <li className="px-4 py-3 text-center text-sm text-gray-500">
          No notifications
        </li>
      ) : (
        notifications.map((n) => (
          <li
            key={n.id}
            className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition"
          >
            <span className={`${getIconBgColor(n.type)} p-2 rounded-lg`}>
              {n.icon}
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{n.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {formatTimeAgo(n.timestamp)}
              </p>
            </div>
          </li>
        ))
      )}
    </ul>
  </div>
)}

        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <img
            src={profile?.profile_image}
            alt="User avatar"
            className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer hover:ring-2 hover:ring-blue-400"
            onClick={() => setShowProfile(!showProfile)}
          />

          {showProfile && (
            <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-800">{profile?.full_name || "User"}</p>
                <p className="text-xs text-gray-500">{profile?.role || "Member"}</p>
              </div>
              <div className="p-2">
                <button
                  onClick={() => navigate("/UserManagement")}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-700"
                >
                  <User size={16} /> View Profile
                </button>
                <button
                  onClick={() => navigate("/settings")}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-700"
                >
                  <Settings size={16} /> Settings
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/");
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 rounded-md hover:bg-red-500 hover:text-white transition"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
