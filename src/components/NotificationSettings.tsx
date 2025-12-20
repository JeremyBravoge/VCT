"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { notificationsApi } from "@/utils/api";
import {
  Bell,
  Check,
  Clock,
  AlertCircle,
  User,
  BookOpen,
  DollarSign,
  Calendar,
  Settings,
  Filter,
  Trash2,
  Eye,
  MessageSquare,
  Download,
  MoreVertical,
  Search,
  X,
  Users,
  FileText,
  CheckCircle,
  Info,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Types
interface Notification {
  id: string;
  type: 'payment' | 'academic' | 'system' | 'enrollment' | 'announcement' | 'alert';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  sender?: string;
  senderAvatar?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  paymentAlerts: boolean;
  academicAlerts: boolean;
  systemAlerts: boolean;
  enrollmentAlerts: boolean;
  announcementAlerts: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

// Mock Data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'payment',
    title: 'Payment Received',
    message: 'John Doe has successfully paid Ksh 15,000 for the Web Development course',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    read: false,
    priority: 'medium',
    sender: 'Finance Department',
    senderAvatar: '',
    actionUrl: '/finance/payments',
    metadata: { amount: 15000, student: 'John Doe', course: 'Web Development' }
  },
  {
    id: '2',
    type: 'academic',
    title: 'New Assignment Posted',
    message: 'Professor Smith posted a new assignment for Data Science course',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    priority: 'high',
    sender: 'Prof. Smith',
    senderAvatar: '',
    actionUrl: '/academics/assignments',
    metadata: { course: 'Data Science', dueDate: '2024-12-15' }
  },
  {
    id: '3',
    type: 'system',
    title: 'System Maintenance',
    message: 'Scheduled maintenance this weekend from 2 AM to 6 AM',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: true,
    priority: 'low',
    sender: 'System Admin',
    senderAvatar: '',
    metadata: { maintenanceWindow: '2 AM - 6 AM', date: '2024-12-10' }
  },
  {
    id: '4',
    type: 'enrollment',
    title: 'New Student Enrollment',
    message: 'Alice Johnson enrolled in the Cyber Security course',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    read: true,
    priority: 'medium',
    sender: 'Admissions',
    senderAvatar: '',
    actionUrl: '/students/profile',
    metadata: { student: 'Alice Johnson', course: 'Cyber Security' }
  },
  {
    id: '5',
    type: 'announcement',
    title: 'Holiday Announcement',
    message: 'College will be closed from Dec 24th to Jan 2nd for Christmas break',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    priority: 'medium',
    sender: 'Administration',
    senderAvatar: '',
    metadata: { startDate: '2024-12-24', endDate: '2025-01-02' }
  },
  {
    id: '6',
    type: 'alert',
    title: 'Low Attendance Alert',
    message: 'Physics 101 has attendance below 60% for this week',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    read: true,
    priority: 'high',
    sender: 'Attendance System',
    senderAvatar: '',
    actionUrl: '/attendance/reports',
    metadata: { course: 'Physics 101', attendance: '58%' }
  },
  {
    id: '7',
    type: 'payment',
    title: 'Payment Overdue',
    message: '3 students have overdue payments totaling Ksh 45,000',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    read: true,
    priority: 'high',
    sender: 'Finance Department',
    senderAvatar: '',
    actionUrl: '/finance/overdue',
    metadata: { overdueCount: 3, totalAmount: 45000 }
  },
  {
    id: '8',
    type: 'academic',
    title: 'Exam Schedule Published',
    message: 'Final exam schedule for Semester 2 is now available',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96), // 4 days ago
    read: true,
    priority: 'medium',
    sender: 'Examination Office',
    senderAvatar: '',
    actionUrl: '/exams/schedule',
    metadata: { semester: 'Semester 2', publishDate: '2024-12-05' }
  }
];

// Notification Type Config
const notificationTypeConfig = {
  payment: {
    icon: DollarSign,
    color: "text-emerald-600 bg-emerald-100",
    label: "Payment"
  },
  academic: {
    icon: BookOpen,
    color: "text-blue-600 bg-blue-100",
    label: "Academic"
  },
  system: {
    icon: Settings,
    color: "text-slate-600 bg-slate-100",
    label: "System"
  },
  enrollment: {
    icon: Users,
    color: "text-violet-600 bg-violet-100",
    label: "Enrollment"
  },
  announcement: {
    icon: MessageSquare,
    color: "text-amber-600 bg-amber-100",
    label: "Announcement"
  },
  alert: {
    icon: AlertCircle,
    color: "text-rose-600 bg-rose-100",
    label: "Alert"
  }
} as const;

// Priority Badge Component
const PriorityBadge: React.FC<{ priority: Notification['priority'] }> = ({ priority }) => {
  const config = {
    high: { color: "bg-rose-100 text-rose-700", label: "High" },
    medium: { color: "bg-amber-100 text-amber-700", label: "Medium" },
    low: { color: "bg-emerald-100 text-emerald-700", label: "Low" }
  }[priority];

  return (
    <Badge variant="outline" className={`text-xs font-medium ${config.color}`}>
      {config.label}
    </Badge>
  );
};

// Time Formatter
const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

// Notification Item Component
const NotificationItem: React.FC<{
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ notification, onMarkAsRead, onDelete }) => {
  const typeConfig = notificationTypeConfig[notification.type];
  const Icon = typeConfig.icon;
  
  return (
    <div className={`p-4 border rounded-lg transition-all duration-200 ${notification.read ? 'bg-white' : 'bg-blue-50'} hover:shadow-md`}>
      <div className="flex items-start gap-4">
        {/* Notification Icon */}
        <div className={`p-2 rounded-lg ${typeConfig.color} flex-shrink-0`}>
          <Icon className="h-5 w-5" />
        </div>
        
        {/* Notification Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">{notification.title}</h4>
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <PriorityBadge priority={notification.priority} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onMarkAsRead(notification.id)}>
                    <Check className="h-4 w-4 mr-2" />
                    Mark as {notification.read ? 'unread' : 'read'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.open(notification.actionUrl, '_blank')} disabled={!notification.actionUrl}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onDelete(notification.id)} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {notification.sender && (
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-xs text-gray-500">{notification.sender}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-xs text-gray-500">{formatTimeAgo(notification.timestamp)}</span>
              </div>
            </div>
            
            {!notification.read && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMarkAsRead(notification.id)}
                className="h-7 px-2 text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                Mark Read
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    high_priority: 0,
    today: 0,
    by_type: {}
  });
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    paymentAlerts: true,
    academicAlerts: true,
    systemAlerts: true,
    enrollmentAlerts: true,
    announcementAlerts: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '07:00'
    }
  });

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
    fetchStats();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationsApi.getNotifications();
      if (response.success && response.data) {
        const transformedNotifications = response.data.notifications.map((notification: any) => ({
          id: notification.id.toString(),
          type: notification.type,
          title: notification.title,
          message: notification.message,
          timestamp: new Date(notification.timestamp),
          read: notification.read,
          priority: notification.priority,
          sender: notification.metadata?.sender || notification.sender,
          actionUrl: notification.action_url,
          metadata: notification.metadata
        }));
        setNotifications(transformedNotifications);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await notificationsApi.getStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  // Stats
  const unreadCount = notifications.filter(n => !n.read).length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high').length;
  const todayCount = notifications.filter(n => {
    const today = new Date();
    const notificationDate = new Date(n.timestamp);
    return notificationDate.toDateString() === today.toDateString();
  }).length;

  // Filtered Notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || notification.type === filter;
    const matchesSearch = searchQuery === '' || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadNotifications = filteredNotifications.filter(n => !n.read);
  const readNotifications = filteredNotifications.filter(n => n.read);

  // Handlers
  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await notificationsApi.markAsRead(id);
      if (response.success) {
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === id ? { ...notification, read: !notification.read } : notification
          )
        );
        fetchStats(); // Refresh stats
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await notificationsApi.markAllAsRead();
      if (response.success) {
        setNotifications(prev =>
          prev.map(notification => ({ ...notification, read: true }))
        );
        fetchStats(); // Refresh stats
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await notificationsApi.delete(id);
      if (response.success) {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
        fetchStats(); // Refresh stats
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleDeleteAllRead = async () => {
    try {
      const response = await notificationsApi.clearRead();
      if (response.success) {
        setNotifications(prev => prev.filter(notification => !notification.read));
        fetchStats(); // Refresh stats
      }
    } catch (error) {
      console.error('Failed to clear read notifications:', error);
    }
  };

  const handleClearAll = async () => {
    try {
      // This would need a new API endpoint for clearing all notifications
      // For now, we'll clear locally
      setNotifications([]);
      fetchStats(); // Refresh stats
    } catch (error) {
      console.error('Failed to clear all notifications:', error);
    }
  };

  const handleRefresh = async () => {
    await Promise.all([fetchNotifications(), fetchStats()]);
  };

  // Settings Handlers
  const handleSettingChange = (key: keyof NotificationSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleQuietHourChange = (key: 'enabled' | 'start' | 'end', value: any) => {
    setSettings(prev => ({
      ...prev,
      quietHours: { ...prev.quietHours, [key]: value }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-blue-100 rounded-2xl">
                  <Bell className="h-7 w-7 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                  <p className="text-gray-600 mt-2">
                    Stay updated with all important activities and alerts
                  </p>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  onClick={handleMarkAllAsRead}
                  className="border-gray-300 hover:bg-gray-100"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Mark All as Read
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={loading}
                className="border-gray-300 hover:bg-gray-100"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Unread</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{unreadCount}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Bell className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">High Priority</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{highPriorityCount}</p>
                  </div>
                  <div className="p-3 bg-rose-100 rounded-xl">
                    <AlertCircle className="h-6 w-6 text-rose-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Today</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{todayCount}</p>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-xl">
                    <Calendar className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{notifications.length}</p>
                  </div>
                  <div className="p-3 bg-violet-100 rounded-xl">
                    <FileText className="h-6 w-6 text-violet-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="border border-gray-200 mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="border-gray-300">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Notification Type</DropdownMenuLabel>
                      <DropdownMenuCheckboxItem
                        checked={filter === 'all'}
                        onCheckedChange={() => setFilter('all')}
                      >
                        All Notifications
                      </DropdownMenuCheckboxItem>
                      {Object.entries(notificationTypeConfig).map(([type, config]) => (
                        <DropdownMenuCheckboxItem
                          key={type}
                          checked={filter === type}
                          onCheckedChange={() => setFilter(type)}
                        >
                          <config.icon className="h-4 w-4 mr-2" />
                          {config.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="border-gray-300">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                      <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                      <DropdownMenuItem>Print Report</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {(searchQuery || filter !== 'all') && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery('');
                        setFilter('all');
                      }}
                      className="border-gray-300 hover:bg-gray-100"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="read">
              Read ({notifications.length - unreadCount})
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {filteredNotifications.length === 0 ? (
              <Card className="border border-gray-200">
                <CardContent className="py-16 text-center">
                  <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Notifications</h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery 
                      ? `No notifications match "${searchQuery}"`
                      : "You're all caught up! No new notifications."}
                  </p>
                  {searchQuery && (
                    <Button
                      variant="outline"
                      onClick={() => setSearchQuery('')}
                      className="border-gray-300"
                    >
                      Clear Search
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="unread" className="space-y-6">
            {unreadNotifications.length === 0 ? (
              <Card className="border border-gray-200">
                <CardContent className="py-16 text-center">
                  <CheckCircle className="h-16 w-16 text-emerald-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
                  <p className="text-gray-600">No unread notifications.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {unreadNotifications.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="read" className="space-y-6">
            {readNotifications.length === 0 ? (
              <Card className="border border-gray-200">
                <CardContent className="py-16 text-center">
                  <Info className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Read Notifications</h3>
                  <p className="text-gray-600">All notifications are currently unread.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Read Notifications ({readNotifications.length})
                    </h3>
                    <p className="text-gray-600 text-sm">Notifications you've already viewed</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleDeleteAllRead}
                    className="border-gray-300 hover:bg-gray-100"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All Read
                  </Button>
                </div>
                <div className="space-y-4">
                  {readNotifications.map(notification => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Notification Channels */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Notification Channels</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                        <p className="text-sm text-gray-600">Receive notifications via email</p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="push-notifications" className="font-medium">Push Notifications</Label>
                        <p className="text-sm text-gray-600">Receive browser push notifications</p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={settings.pushNotifications}
                        onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Notification Types */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Notification Types</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(notificationTypeConfig).map(([type, config]) => {
                      const Icon = config.icon;
                      const settingKey = `${type}Alerts` as keyof NotificationSettings;
                      
                      return (
                        <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${config.color}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <Label htmlFor={type} className="font-medium">{config.label} Alerts</Label>
                              <p className="text-xs text-gray-600">Receive {config.label.toLowerCase()} notifications</p>
                            </div>
                          </div>
                          <Switch
                            id={type}
                            checked={settings[settingKey] as boolean}
                            onCheckedChange={(checked) => handleSettingChange(settingKey, checked)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                {/* Quiet Hours */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Quiet Hours</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="quiet-hours" className="font-medium">Enable Quiet Hours</Label>
                        <p className="text-sm text-gray-600">Pause notifications during specific hours</p>
                      </div>
                      <Switch
                        id="quiet-hours"
                        checked={settings.quietHours.enabled}
                        onCheckedChange={(checked) => handleQuietHourChange('enabled', checked)}
                      />
                    </div>
                    
                    {settings.quietHours.enabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <Label htmlFor="quiet-start">Start Time</Label>
                          <Input
                            id="quiet-start"
                            type="time"
                            value={settings.quietHours.start}
                            onChange={(e) => handleQuietHourChange('start', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="quiet-end">End Time</Label>
                          <Input
                            id="quiet-end"
                            type="time"
                            value={settings.quietHours.end}
                            onChange={(e) => handleQuietHourChange('end', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <div className="flex justify-between w-full">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSettings({
                        emailNotifications: true,
                        pushNotifications: true,
                        paymentAlerts: true,
                        academicAlerts: true,
                        systemAlerts: true,
                        enrollmentAlerts: true,
                        announcementAlerts: true,
                        quietHours: {
                          enabled: false,
                          start: '22:00',
                          end: '07:00'
                        }
                      });
                    }}
                  >
                    Reset to Default
                  </Button>
                  <Button
                    onClick={() => {
                      // Save settings to backend
                      alert('Settings saved successfully!');
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Save Settings
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Bulk Actions Footer */}
        {notifications.length > 0 && (
          <Card className="border border-gray-200 mt-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{unreadCount} unread</span> • 
                  <span className="font-medium ml-2">{notifications.length} total</span> • 
                  <span className="font-medium ml-2">{filteredNotifications.length} showing</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {unreadCount > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      className="border-gray-300"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Mark All Read
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearAll}
                    className="border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Add missing RefreshCw icon import
const RefreshCw = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </svg>
);

const ChevronDown = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);