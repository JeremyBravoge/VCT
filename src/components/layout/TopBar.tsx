import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Bell, User, LogOut, Menu, Search, Settings, ChevronDown, Users, BookOpen, GraduationCap
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/AuthContext';
import axios from 'axios';

interface TopBarProps {
  onLogout: () => void;
  onToggleSidebar: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onLogout,
  onToggleSidebar
}) => {
  const [notifications] = useState([
    { id: 1, message: 'New student enrollment pending', time: '5m ago', unread: true },
    { id: 2, message: 'Grade 4 Math assessment completed', time: '1h ago', unread: true },
    { id: 3, message: 'Staff meeting scheduled for tomorrow', time: '2h ago', unread: false },
  ]);
  const [currentUser, setCurrentUser] = useState<{
    full_name: string;
    email: string;
    profile_image: string | null;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { logout } = useAuth();

  const unreadCount = notifications.filter(n => n.unread).length;

  // ✅ Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return null;
      try {
        const res = await fetch('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        return data.error ? null : data;
      } catch {
        return null;
      }
    };

    fetchCurrentUser().then(user => {
      if (user) {
        setCurrentUser(user);
      } else {
        // fallback
        setCurrentUser({
          full_name: 'Administrator',
          email: 'admin@school.edu',
          profile_image: '/default-avatar.png',
        });
      }
    });
  }, []);

  // ✅ Global search functionality
  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setShowSearchResults(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const [studentsRes, usersRes, coursesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/students', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/users', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/courses', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const students = studentsRes.data || [];
        const users = usersRes.data || [];
        const courses = coursesRes.data || [];

        const query = searchQuery.toLowerCase();

        const filteredStudents = students.filter((student: any) =>
          (student.name || '').toLowerCase().includes(query) ||
          (student.email || '').toLowerCase().includes(query) ||
          (student.student_id || '').toLowerCase().includes(query) ||
          (student.course || '').toLowerCase().includes(query)
        ).slice(0, 5).map((student: any) => ({ ...student, type: 'student' }));

        const filteredUsers = users.filter((user: any) =>
          (user.full_name || '').toLowerCase().includes(query) ||
          (user.email || '').toLowerCase().includes(query) ||
          (user.username || '').toLowerCase().includes(query)
        ).slice(0, 5).map((user: any) => ({ ...user, type: 'user' }));

        const filteredCourses = courses.filter((course: any) =>
          (course.name || '').toLowerCase().includes(query) ||
          (course.description || '').toLowerCase().includes(query)
        ).slice(0, 5).map((course: any) => ({ ...course, type: 'course' }));

        const results = [...filteredStudents, ...filteredUsers, ...filteredCourses];
        setSearchResults(results);
        setShowSearchResults(results.length > 0);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
        setShowSearchResults(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 shadow-sm fixed top-0 left-64 right-0 z-50">
      <div className="flex items-center justify-between">
        
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="md:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Center of Hope and Transformation
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              CBC School Management System
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search students, staff, or records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <div
                    key={`${result.type}-${result.id || index}`}
                    className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      {result.type === 'student' && <GraduationCap className="w-4 h-4 text-blue-500" />}
                      {result.type === 'user' && <Users className="w-4 h-4 text-green-500" />}
                      {result.type === 'course' && <BookOpen className="w-4 h-4 text-purple-500" />}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {result.type === 'student' ? result.name : result.type === 'user' ? result.full_name : result.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {result.type === 'student' ? `${result.student_id} • ${result.course}` :
                           result.type === 'user' ? `${result.email} • ${result.role}` :
                           result.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
              <div className="p-4 border-b">
                <h3 className="font-medium">Notifications</h3>
                <p className="text-sm text-gray-500">{unreadCount} unread</p>
              </div>
              {notifications.map((n) => (
                <DropdownMenuItem key={n.id} className="p-4 cursor-pointer">
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${n.unread ? 'bg-blue-500' : 'bg-gray-300'}`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">{n.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          {currentUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 px-3">
                  <img
                    src={currentUser.profile_image ? `http://localhost:5000/uploads/${currentUser.profile_image}` : '/default-avatar.png'}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/default-avatar.png';
                    }}
                  />
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {currentUser.full_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {currentUser.email}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  System Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 hover:text-red-700"
                  onClick={() => {
                    localStorage.removeItem('token');
                    onLogout();
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};
