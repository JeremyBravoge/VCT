"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  Settings,
  Save,
  User,
  Shield,
  Bell,
  Globe,
  Database,
  Download,
  DatabaseBackup,
  Upload,
  Lock,
  Moon,
  Sun,
  Palette,
  Users,
  BookOpen,
  CreditCard,
  FileText,
  Trash2,
  RefreshCw,
  Monitor,
  Server,
  ShieldCheck,
  Activity,
  BellOff,
  Calendar,
  GraduationCap,
  BellRing,
  UserCog,
  // Only include icons you actually use in the component
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";

// Types
interface UserSettings {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    department: string;
    avatar: string;
  };
  account: {
    twoFactorAuth: boolean;
    loginAlerts: boolean;
    sessionTimeout: number;
    passwordExpiry: number;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    soundEnabled: boolean;
    desktopAlerts: boolean;
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
    notificationTypes: {
      payments: boolean;
      enrollments: boolean;
      attendance: boolean;
      results: boolean;
      announcements: boolean;
      system: boolean;
    };
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    fontSize: number;
    density: 'compact' | 'normal' | 'comfortable';
    language: string;
    timezone: string;
    dateFormat: string;
    timeFormat: string;
  };
  system: {
    autoSave: boolean;
    autoBackup: boolean;
    backupInterval: number;
    cacheEnabled: boolean;
    analyticsEnabled: boolean;
    performanceMode: boolean;
  };
  privacy: {
    dataCollection: boolean;
    analyticsSharing: boolean;
    activityLogging: boolean;
    dataRetention: number;
    exportData: boolean;
    deleteData: boolean;
  };
}

interface SystemInfo {
  version: string;
  lastBackup: string;
  storageUsed: number;
  storageTotal: number;
  activeUsers: number;
  uptime: string;
  databaseSize: number;
  apiCalls: number;
}

// Mock initial settings
const initialSettings: UserSettings = {
  profile: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@vct.edu",
    phone: "+254 712 345 678",
    position: "Administrator",
    department: "Academic Affairs",
    avatar: ""
  },
  account: {
    twoFactorAuth: true,
    loginAlerts: true,
    sessionTimeout: 30,
    passwordExpiry: 90
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: true,
    desktopAlerts: true,
    quietHours: {
      enabled: false,
      start: "22:00",
      end: "07:00"
    },
    notificationTypes: {
      payments: true,
      enrollments: true,
      attendance: true,
      results: true,
      announcements: true,
      system: true
    }
  },
  appearance: {
    theme: 'light',
    fontSize: 16,
    density: 'normal',
    language: 'en-US',
    timezone: 'Africa/Nairobi',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h'
  },
  system: {
    autoSave: true,
    autoBackup: true,
    backupInterval: 24,
    cacheEnabled: true,
    analyticsEnabled: true,
    performanceMode: false
  },
  privacy: {
    dataCollection: true,
    analyticsSharing: false,
    activityLogging: true,
    dataRetention: 365,
    exportData: true,
    deleteData: false
  }
};

// Mock system info
const initialSystemInfo: SystemInfo = {
  version: "2.5.1",
  lastBackup: "2024-12-08 02:00",
  storageUsed: 4.7,
  storageTotal: 50,
  activeUsers: 1245,
  uptime: "15 days, 6 hours",
  databaseSize: 2.3,
  apiCalls: 1245678
};

// Settings Section Component
const SettingsSection = ({ 
  title, 
  description, 
  icon: Icon, 
  children 
}: { 
  title: string; 
  description: string; 
  icon: React.ComponentType<any>;
  children: React.ReactNode;
}) => (
  <Card className="border border-gray-200">
    <CardHeader className="pb-3">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

// Setting Item Component
const SettingItem = ({ 
  label, 
  description, 
  children 
}: { 
  label: string; 
  description?: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
    <div className="space-y-1">
      <Label className="text-sm font-medium">{label}</Label>
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
    </div>
    <div className="ml-4">
      {children}
    </div>
  </div>
);

// Main Component
export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(initialSettings);
  const [systemInfo, setSystemInfo] = useState<SystemInfo>(initialSystemInfo);
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState({ current: "", new: "", confirm: "" });

  // Handle settings change
  const handleSettingChange = (section: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => {
      const updated = { ...prev };
      const keys = key.split('.');
      let current: any = updated[section];
      
      // Handle nested keys (e.g., "quietHours.enabled")
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      
      return updated;
    });
    setHasChanges(true);
  };

  // Save settings
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real app: await api.saveSettings(settings);
      toast({
        title: "Settings Saved",
        description: "Your settings have been updated successfully.",
      });
      setHasChanges(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset settings
  const handleResetSettings = () => {
    setSettings(initialSettings);
    setHasChanges(false);
    setShowResetDialog(false);
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
    });
  };

  // Export settings
  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `vct-settings-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    setShowExportDialog(false);
    toast({
      title: "Settings Exported",
      description: "Your settings have been exported successfully.",
    });
  };

  // Import settings
  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string);
        setSettings(importedSettings);
        setHasChanges(true);
        setShowImportDialog(false);
        toast({
          title: "Settings Imported",
          description: "Settings imported successfully. Don't forget to save.",
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Invalid settings file format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  // Calculate storage percentage
  const storagePercentage = (systemInfo.storageUsed / systemInfo.storageTotal) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-blue-100 rounded-2xl">
                  <Settings className="h-7 w-7 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                  <p className="text-gray-600 mt-2">
                    Configure system preferences and manage your account
                  </p>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => setShowImportDialog(true)}
                className="border-gray-300 hover:bg-gray-100"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowExportDialog(true)}
                className="border-gray-300 hover:bg-gray-100"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowResetDialog(true)}
                className="border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button
                onClick={handleSaveSettings}
                disabled={!hasChanges || isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* System Status Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Storage Used</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {systemInfo.storageUsed.toFixed(1)} GB
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {storagePercentage.toFixed(1)}% of {systemInfo.storageTotal} GB
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Database className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <Progress value={storagePercentage} className="h-2 mt-3" />
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {systemInfo.activeUsers.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Currently online</p>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-xl">
                    <Users className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">System Uptime</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {systemInfo.uptime.split(',')[0]}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Since last restart</p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-xl">
                    <Activity className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Version</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      v{systemInfo.version}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Latest version</p>
                  </div>
                  <div className="p-3 bg-violet-100 rounded-xl">
                    <ShieldCheck className="h-6 w-6 text-violet-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Settings */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-6">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="account">
              <Shield className="h-4 w-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="h-4 w-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="system">
              <Server className="h-4 w-4 mr-2" />
              System
            </TabsTrigger>
            <TabsTrigger value="privacy">
              <Lock className="h-4 w-4 mr-2" />
              Privacy
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <SettingsSection
              title="Personal Information"
              description="Update your personal details and contact information"
              icon={User}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={settings.profile.firstName}
                      onChange={(e) => handleSettingChange('profile', 'firstName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={settings.profile.lastName}
                      onChange={(e) => handleSettingChange('profile', 'lastName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={settings.profile.phone}
                      onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={settings.profile.position}
                      onChange={(e) => handleSettingChange('profile', 'position', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={settings.profile.department}
                      onValueChange={(value) => handleSettingChange('profile', 'department', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Academic Affairs">Academic Affairs</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Administration">Administration</SelectItem>
                        <SelectItem value="IT Support">IT Support</SelectItem>
                        <SelectItem value="Student Services">Student Services</SelectItem>
                        <SelectItem value="Human Resources">Human Resources</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="pt-4">
                    <Label className="block mb-3">Profile Picture</Label>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={settings.profile.avatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                          {settings.profile.firstName[0]}{settings.profile.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Photo
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove Photo
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SettingsSection>

            <SettingsSection
              title="Password & Security"
              description="Change your password and manage security settings"
              icon={Lock}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button onClick={() => setShowPasswordDialog(true)}>
                  Change Password
                </Button>
              </div>
            </SettingsSection>
          </TabsContent>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-6">
            <SettingsSection
              title="Security Settings"
              description="Manage your account security and authentication"
              icon={Shield}
            >
              <div className="space-y-2">
                <SettingItem
                  label="Two-Factor Authentication"
                  description="Add an extra layer of security to your account"
                >
                  <Switch
                    checked={settings.account.twoFactorAuth}
                    onCheckedChange={(checked) => handleSettingChange('account', 'twoFactorAuth', checked)}
                  />
                </SettingItem>
                
                <SettingItem
                  label="Login Alerts"
                  description="Get notified of new sign-ins from unknown devices"
                >
                  <Switch
                    checked={settings.account.loginAlerts}
                    onCheckedChange={(checked) => handleSettingChange('account', 'loginAlerts', checked)}
                  />
                </SettingItem>
                
                <SettingItem
                  label="Session Timeout"
                  description="Automatically log out after inactivity"
                >
                  <Select
                    value={settings.account.sessionTimeout.toString()}
                    onValueChange={(value) => handleSettingChange('account', 'sessionTimeout', parseInt(value))}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="240">4 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingItem>
                
                <SettingItem
                  label="Password Expiry"
                  description="Require password change every"
                >
                  <Select
                    value={settings.account.passwordExpiry.toString()}
                    onValueChange={(value) => handleSettingChange('account', 'passwordExpiry', parseInt(value))}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingItem>
              </div>
            </SettingsSection>

            <SettingsSection
              title="Account Management"
              description="Manage your account data and access"
              icon={UserCog}
            >
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Export Account Data</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Download a copy of your personal data stored in our system
                  </p>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Request Data Export
                  </Button>
                </div>
                
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <h4 className="font-medium text-red-900 mb-2">Delete Account</h4>
                  <p className="text-sm text-red-700 mb-3">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-red-300 text-red-700 hover:bg-red-100"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </SettingsSection>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <SettingsSection
              title="Notification Preferences"
              description="Choose how and when you receive notifications"
              icon={Bell}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <SettingItem
                      label="Email Notifications"
                      description="Receive notifications via email"
                    >
                      <Switch
                        checked={settings.notifications.emailNotifications}
                        onCheckedChange={(checked) => handleSettingChange('notifications', 'emailNotifications', checked)}
                      />
                    </SettingItem>
                    
                    <SettingItem
                      label="Push Notifications"
                      description="Receive browser push notifications"
                    >
                      <Switch
                        checked={settings.notifications.pushNotifications}
                        onCheckedChange={(checked) => handleSettingChange('notifications', 'pushNotifications', checked)}
                      />
                    </SettingItem>
                  </div>
                  
                  <div className="space-y-3">
                    <SettingItem
                      label="Sound Alerts"
                      description="Play sound for new notifications"
                    >
                      <Switch
                        checked={settings.notifications.soundEnabled}
                        onCheckedChange={(checked) => handleSettingChange('notifications', 'soundEnabled', checked)}
                      />
                    </SettingItem>
                    
                    <SettingItem
                      label="Desktop Alerts"
                      description="Show desktop notifications"
                    >
                      <Switch
                        checked={settings.notifications.desktopAlerts}
                        onCheckedChange={(checked) => handleSettingChange('notifications', 'desktopAlerts', checked)}
                      />
                    </SettingItem>
                  </div>
                </div>
              </div>
            </SettingsSection>

            <SettingsSection
              title="Notification Types"
              description="Select which types of notifications you want to receive"
              icon={BellRing}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(settings.notifications.notificationTypes).map(([key, value]) => {
                  const label = key.charAt(0).toUpperCase() + key.slice(1);
                  const icons = {
                    payments: CreditCard,
                    enrollments: BookOpen,
                    attendance: Calendar,
                    results: GraduationCap,
                    announcements: Bell,
                    system: Settings
                  };
                  const Icon = icons[key as keyof typeof icons];
                  
                  return (
                    <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded">
                          <Icon className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <Label className="font-medium">{label}</Label>
                          <p className="text-xs text-gray-500">Receive {key.toLowerCase()} notifications</p>
                        </div>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => 
                          handleSettingChange('notifications', `notificationTypes.${key}`, checked)
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </SettingsSection>

            <SettingsSection
              title="Quiet Hours"
              description="Pause notifications during specific hours"
              icon={BellOff}
            >
              <div className="space-y-4">
                <SettingItem
                  label="Enable Quiet Hours"
                  description="Temporarily disable notifications"
                >
                  <Switch
                    checked={settings.notifications.quietHours.enabled}
                    onCheckedChange={(checked) => 
                      handleSettingChange('notifications', 'quietHours.enabled', checked)
                    }
                  />
                </SettingItem>
                
                {settings.notifications.quietHours.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label htmlFor="quietStart">Start Time</Label>
                      <Input
                        id="quietStart"
                        type="time"
                        value={settings.notifications.quietHours.start}
                        onChange={(e) => 
                          handleSettingChange('notifications', 'quietHours.start', e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="quietEnd">End Time</Label>
                      <Input
                        id="quietEnd"
                        type="time"
                        value={settings.notifications.quietHours.end}
                        onChange={(e) => 
                          handleSettingChange('notifications', 'quietHours.end', e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}
              </div>
            </SettingsSection>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <SettingsSection
              title="Theme & Display"
              description="Customize the look and feel of the application"
              icon={Palette}
            >
              <div className="space-y-4">
                <SettingItem
                  label="Theme"
                  description="Choose your preferred color scheme"
                >
                  <Select
                    value={settings.appearance.theme}
                    onValueChange={(value: 'light' | 'dark' | 'system') => 
                      handleSettingChange('appearance', 'theme', value)
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4" />
                          System
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </SettingItem>
                
                <SettingItem
                  label="Font Size"
                  description="Adjust the text size throughout the application"
                >
                  <div className="flex items-center gap-4 w-[200px]">
                    <span className="text-sm text-gray-500">Small</span>
                    <Slider
                      value={[settings.appearance.fontSize]}
                      min={12}
                      max={20}
                      step={1}
                      onValueChange={([value]) => 
                        handleSettingChange('appearance', 'fontSize', value)
                      }
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500">Large</span>
                  </div>
                </SettingItem>
                
                <SettingItem
                  label="Density"
                  description="Control the spacing and layout density"
                >
                  <Select
                    value={settings.appearance.density}
                    onValueChange={(value: 'compact' | 'normal' | 'comfortable') => 
                      handleSettingChange('appearance', 'density', value)
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="comfortable">Comfortable</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingItem>
              </div>
            </SettingsSection>

            <SettingsSection
              title="Language & Region"
              description="Set your preferred language, timezone, and formats"
              icon={Globe}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={settings.appearance.language}
                    onValueChange={(value) => handleSettingChange('appearance', 'language', value)}
                  >
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="en-GB">English (UK)</SelectItem>
                      <SelectItem value="sw-KE">Kiswahili</SelectItem>
                      <SelectItem value="fr-FR">French</SelectItem>
                      <SelectItem value="es-ES">Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.appearance.timezone}
                    onValueChange={(value) => handleSettingChange('appearance', 'timezone', value)}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Nairobi">Nairobi (GMT+3)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">New York (EST)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select
                    value={settings.appearance.dateFormat}
                    onValueChange={(value) => handleSettingChange('appearance', 'dateFormat', value)}
                  >
                    <SelectTrigger id="dateFormat">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timeFormat">Time Format</Label>
                  <Select
                    value={settings.appearance.timeFormat}
                    onValueChange={(value) => handleSettingChange('appearance', 'timeFormat', value)}
                  >
                    <SelectTrigger id="timeFormat">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12-hour</SelectItem>
                      <SelectItem value="24h">24-hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SettingsSection>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system" className="space-y-6">
            <SettingsSection
              title="Performance & Storage"
              description="Optimize system performance and manage storage"
              icon={Server}
            >
              <div className="space-y-2">
                <SettingItem
                  label="Auto Save"
                  description="Automatically save changes as you work"
                >
                  <Switch
                    checked={settings.system.autoSave}
                    onCheckedChange={(checked) => handleSettingChange('system', 'autoSave', checked)}
                  />
                </SettingItem>
                
                <SettingItem
                  label="Auto Backup"
                  description="Automatically backup system data"
                >
                  <Switch
                    checked={settings.system.autoBackup}
                    onCheckedChange={(checked) => handleSettingChange('system', 'autoBackup', checked)}
                  />
                </SettingItem>
                
                {settings.system.autoBackup && (
                  <SettingItem
                    label="Backup Interval"
                    description="How often to create automatic backups"
                  >
                    <Select
                      value={settings.system.backupInterval.toString()}
                      onValueChange={(value) => handleSettingChange('system', 'backupInterval', parseInt(value))}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Every hour</SelectItem>
                        <SelectItem value="6">Every 6 hours</SelectItem>
                        <SelectItem value="12">Every 12 hours</SelectItem>
                        <SelectItem value="24">Every 24 hours</SelectItem>
                        <SelectItem value="168">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </SettingItem>
                )}
                
                <SettingItem
                  label="Cache Enabled"
                  description="Store temporary data for faster performance"
                >
                  <Switch
                    checked={settings.system.cacheEnabled}
                    onCheckedChange={(checked) => handleSettingChange('system', 'cacheEnabled', checked)}
                  />
                </SettingItem>
                
                <SettingItem
                  label="Performance Mode"
                  description="Optimize for speed (may use more resources)"
                >
                  <Switch
                    checked={settings.system.performanceMode}
                    onCheckedChange={(checked) => handleSettingChange('system', 'performanceMode', checked)}
                  />
                </SettingItem>
              </div>
            </SettingsSection>

            <SettingsSection
              title="Data & Analytics"
              description="Configure data collection and analytics settings"
              icon={Database}
            >
              <div className="space-y-2">
                <SettingItem
                  label="Analytics Collection"
                  description="Help improve the system by sharing usage analytics"
                >
                  <Switch
                    checked={settings.system.analyticsEnabled}
                    onCheckedChange={(checked) => handleSettingChange('system', 'analyticsEnabled', checked)}
                  />
                </SettingItem>
                
                <div className="p-4 bg-gray-50 rounded-lg mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Database Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Database Size</p>
                      <p className="font-medium">{systemInfo.databaseSize.toFixed(1)} GB</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">API Calls Today</p>
                      <p className="font-medium">{systemInfo.apiCalls.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Last Backup</p>
                      <p className="font-medium">{systemInfo.lastBackup}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Uptime</p>
                      <p className="font-medium">{systemInfo.uptime}</p>
                    </div>
                  </div>
                </div>
              </div>
            </SettingsSection>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-6">
            <SettingsSection
              title="Data Privacy"
              description="Control how your data is collected and used"
              icon={Lock}
            >
              <div className="space-y-2">
                <SettingItem
                  label="Data Collection"
                  description="Allow collection of usage data to improve services"
                >
                  <Switch
                    checked={settings.privacy.dataCollection}
                    onCheckedChange={(checked) => handleSettingChange('privacy', 'dataCollection', checked)}
                  />
                </SettingItem>
                
                <SettingItem
                  label="Analytics Sharing"
                  description="Share anonymized analytics with third parties"
                >
                  <Switch
                    checked={settings.privacy.analyticsSharing}
                    onCheckedChange={(checked) => handleSettingChange('privacy', 'analyticsSharing', checked)}
                  />
                </SettingItem>
                
                <SettingItem
                  label="Activity Logging"
                  description="Keep logs of your system activities"
                >
                  <Switch
                    checked={settings.privacy.activityLogging}
                    onCheckedChange={(checked) => handleSettingChange('privacy', 'activityLogging', checked)}
                  />
                </SettingItem>
                
                <SettingItem
                  label="Data Retention"
                  description="How long to keep your data"
                >
                  <Select
                    value={settings.privacy.dataRetention.toString()}
                    onValueChange={(value) => handleSettingChange('privacy', 'dataRetention', parseInt(value))}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                      <SelectItem value="730">2 years</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingItem>
              </div>
            </SettingsSection>

            <SettingsSection
              title="Data Management"
              description="Manage your personal data and privacy"
              icon={DatabaseBackup}
            >
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Export Your Data</h4>
                      <p className="text-sm text-gray-600">
                        Download a copy of all your personal data
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handleExportSettings()}
                      disabled={!settings.privacy.exportData}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-red-900 mb-1">Delete All Data</h4>
                      <p className="text-sm text-red-700">
                        Permanently delete all your personal data from our systems
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-100"
                      onClick={() => setShowDeleteDialog(true)}
                      disabled={!settings.privacy.deleteData}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Data
                    </Button>
                  </div>
                </div>
              </div>
            </SettingsSection>
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset All Settings?</AlertDialogTitle>
              <AlertDialogDescription>
                This will reset all your settings to their default values. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleResetSettings}
                className="bg-red-600 hover:bg-red-700"
              >
                Reset Settings
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showExportDialog} onOpenChange={setShowExportDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Export Settings</AlertDialogTitle>
              <AlertDialogDescription>
                Your current settings will be exported as a JSON file that you can import later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleExportSettings}>
                Export
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Import Settings</DialogTitle>
              <DialogDescription>
                Select a JSON file containing your previously exported settings.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                type="file"
                accept=".json"
                onChange={handleImportSettings}
              />
              <p className="text-sm text-gray-500 mt-2">
                Only JSON files exported from this system are supported.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Account Data?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all your personal data and account information. 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                Delete All Data
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                Enter your current password and new password to update.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={password.current}
                  onChange={(e) => setPassword({...password, current: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={password.new}
                  onChange={(e) => setPassword({...password, new: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={password.confirm}
                  onChange={(e) => setPassword({...password, confirm: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // Handle password change
                setShowPasswordDialog(false);
                toast({
                  title: "Password Updated",
                  description: "Your password has been changed successfully.",
                });
              }}>
                Update Password
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}