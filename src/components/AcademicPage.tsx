import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
  BookOpen,
  Plus,
  Check,
  Clock,
  X,
  Search,
  Filter,
  GraduationCap,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AcademicPage: React.FC = () => {
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('current');
  const { toast } = useToast();
  

  // Mock data for available units
  const availableUnits = [
    {
      id: 'CSC609',
      name: 'Advanced Database Systems',
      credits: 3,
      prerequisite: 'CSC301',
      lecturer: 'Dr. Smith',
      schedule: 'Mon, Wed 10:00-12:00',
      description: 'Advanced concepts in database design, optimization, and distributed systems.',
      available: true
    },
    {
      id: 'CSC610',
      name: 'Software Engineering',
      credits: 3,
      prerequisite: 'CSC302',
      lecturer: 'Prof. Johnson',
      schedule: 'Tue, Thu 14:00-16:00',
      description: 'Comprehensive software development methodologies and project management.',
      available: true
    },
    {
      id: 'CSC611',
      name: 'Computer Networks',
      credits: 3,
      prerequisite: 'CSC303',
      lecturer: 'Dr. Williams',
      schedule: 'Mon, Fri 09:00-11:00',
      description: 'Network protocols, architecture, and security fundamentals.',
      available: false
    },
    {
      id: 'CSC612',
      name: 'Machine Learning',
      credits: 3,
      prerequisite: 'MATH201',
      lecturer: 'Dr. Brown',
      schedule: 'Wed, Fri 13:00-15:00',
      description: 'Introduction to machine learning algorithms and applications.',
      available: true
    },
    {
      id: 'CSC613',
      name: 'Web Development',
      credits: 3,
      prerequisite: 'CSC304',
      lecturer: 'Prof. Davis',
      schedule: 'Tue, Thu 10:00-12:00',
      description: 'Modern web development frameworks and technologies.',
      available: true
    }
  ];

  // Mock data for registered units
  const registeredUnits = [
    {
      id: 'CSC609',
      name: 'Advanced Database Systems',
      credits: 3,
      status: 'approved',
      registrationDate: '2024-01-15',
      semester: 'Spring 2024'
    },
    {
      id: 'CSC610',
      name: 'Software Engineering',
      credits: 3,
      status: 'pending',
      registrationDate: '2024-01-16',
      semester: 'Spring 2024'
    },
    {
      id: 'CSC611',
      name: 'Computer Networks',
      credits: 3,
      status: 'approved',
      registrationDate: '2024-01-10',
      semester: 'Spring 2024'
    }
  ];

  const filteredUnits = availableUnits.filter(unit =>
    unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUnitSelection = (unitId: string) => {
    setSelectedUnits(prev =>
      prev.includes(unitId)
        ? prev.filter(id => id !== unitId)
        : [...prev, unitId]
    );
  };

  const handleRegisterUnits = () => {
    if (selectedUnits.length === 0) {
      toast({
        title: "No units selected",
        description: "Please select at least one unit to register.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Registration Submitted",
      description: `Successfully submitted registration for ${selectedUnits.length} unit(s).`,
    });
    setSelectedUnits([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <Check className="h-3 w-3" />;
      case 'pending':
        return <Clock className="h-3 w-3" />;
      case 'rejected':
        return <X className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Academic Management</h1>
          <p className="text-muted-foreground">Manage your unit registration and academic progress</p>
        </div>
        <Button className="gradient-primary text-white">
          <GraduationCap className="mr-2 h-4 w-4" />
          Academic Calendar
        </Button>
      </div>

      <Tabs defaultValue="registration" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="registration">Unit Registration</TabsTrigger>
          <TabsTrigger value="current">Current Units</TabsTrigger>
          <TabsTrigger value="history">Academic History</TabsTrigger>
        </TabsList>

        <TabsContent value="registration" className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search units by name or code..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="current">Current Semester</SelectItem>
                    <SelectItem value="next">Next Semester</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Available Units */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Available Units</span>
              </CardTitle>
              <CardDescription>
                Select units you want to register for this semester
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredUnits.map((unit) => (
                <div
                  key={unit.id}
                  className={`p-4 border rounded-lg transition-all ${
                    selectedUnits.includes(unit.id)
                      ? 'border-primary bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${!unit.available ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={selectedUnits.includes(unit.id)}
                        onCheckedChange={() => handleUnitSelection(unit.id)}
                        disabled={!unit.available}
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-primary">{unit.id}</h3>
                          <Badge variant="outline">{unit.credits} credits</Badge>
                          {!unit.available && (
                            <Badge variant="destructive">Full</Badge>
                          )}
                        </div>
                        <h4 className="font-medium mb-1">{unit.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {unit.description}
                        </p>
                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                          <span>Lecturer: {unit.lecturer}</span>
                          <span>Schedule: {unit.schedule}</span>
                          <span>Prerequisite: {unit.prerequisite}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Selected Units Summary */}
          {selectedUnits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Registration Summary</CardTitle>
                <CardDescription>
                  Review your selected units before submission
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {selectedUnits.map((unitId) => {
                    const unit = availableUnits.find(u => u.id === unitId);
                    return (
                      <div key={unitId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="font-medium">{unit?.id} - {unit?.name}</span>
                        <span className="text-sm text-muted-foreground">{unit?.credits} credits</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="font-semibold">
                    Total Credits: {selectedUnits.reduce((total, unitId) => {
                      const unit = availableUnits.find(u => u.id === unitId);
                      return total + (unit?.credits || 0);
                    }, 0)}
                  </span>
                  <Button onClick={handleRegisterUnits} className="gradient-primary text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Register Selected Units
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="current" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Current Semester Units</span>
              </CardTitle>
              <CardDescription>
                Your registered units for the current semester
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {registeredUnits.map((unit) => (
                <div key={unit.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-primary">{unit.id}</h3>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(unit.status)}
                      >
                        {getStatusIcon(unit.status)}
                        {unit.status}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {unit.credits} credits
                    </span>
                  </div>
                  <h4 className="font-medium mb-2">{unit.name}</h4>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Registered: {unit.registrationDate}</span>
                    <span>{unit.semester}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Academic History</CardTitle>
              <CardDescription>
                Your complete academic record and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Academic History</h3>
                <p className="text-muted-foreground">
                  Your academic history will appear here once you complete your first semester.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AcademicPage;
