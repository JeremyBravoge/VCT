import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, FileText, User } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";




const AdmissionsPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    firstName: '',
    lastName: '',
    idNumber: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    county: '',
    phone: '',
    email: '',
    address: '',
    
    // Step 2: Academic Information
    previousSchool: '',
    graduationYear: '',
    gradeObtained: '',
    programChoice: '',
    intakeYear: '',
    intakeSemester: '',
  });
  const [courses, setCourses] = useState<any[]>([]);
  const [intakes, setIntakes] = useState<any[]>([]);

  const { toast } = useToast();
  
useEffect(() => {
  // Fetch courses
  fetch("http://localhost:5000/api/courses")
    .then((res) => res.json())
    .then((data) => setCourses(data))
    .catch((err) => console.error("Error fetching courses:", err));

  // Fetch intakes
  fetch("http://localhost:5000/api/intakes")
    .then((res) => res.json())
    .then((data) => setIntakes(data))
    .catch((err) => console.error("Error fetching intakes:", err));
}, []);


  const totalSteps = 2;
  const progress = (currentStep / totalSteps) * 100;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        const requiredFields = ['firstName', 'lastName', 'idNumber', 'gender', 'county', 'phone', 'email'];
        const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
        if (missingFields.length > 0) {
          toast({
            title: "Missing Information",
            description: "Please fill in all required fields.",
            variant: "destructive"
          });
          return false;
        }
        return true;
      case 2:
        if (!formData.programChoice || !formData.intakeYear) {
          toast({
            title: "Missing Information",
            description: "Please complete your academic information.",
            variant: "destructive"
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };
  

  const handleSubmit = async () => {
    try {
      const submission = new FormData();

      // Append form fields
      Object.entries(formData).forEach(([key, value]) => {
        submission.append(key, value as string);
      });

          const response = await fetch("http://localhost:5000/api/students/register", {
             method: "POST",
                   headers: {
                  "Content-Type": "application/json",
                              },
                              body: JSON.stringify(formData), // send plain JSON
                      });


      if (!response.ok) throw new Error("Submission failed");

      toast({
        title: "Application Submitted",
        description: "Your admission application has been submitted successfully!",
      });
    } catch (err) {
      toast({
        title: "Submission Failed",
        description: (err as Error).message,
        variant: "destructive",
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="idNumber">ID Number *</Label>
                <Input
                  id="idNumber"
                  value={formData.idNumber}
                  onChange={(e) => handleInputChange('idNumber', e.target.value)}
                  placeholder="Enter your ID number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange('gender', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  placeholder="Enter your nationality"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="county">County *</Label>
                <Input
                  id="county"
                  value={formData.county}
                  onChange={(e) => handleInputChange('county', e.target.value)}
                  placeholder="Enter your county"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Home Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter your home address"
                rows={3}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="previousSchool">Previous School/Institution</Label>
                <Input
                  id="previousSchool"
                  value={formData.previousSchool}
                  onChange={(e) => handleInputChange('previousSchool', e.target.value)}
                  placeholder="Enter your previous school"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="graduationYear">Graduation Year</Label>
                <Input
                  id="graduationYear"
                  type="number"
                  value={formData.graduationYear}
                  onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                  placeholder="e.g., 2023"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gradeObtained">Grade/CGPA Obtained</Label>
              <Input
                id="gradeObtained"
                value={formData.gradeObtained}
                onChange={(e) => handleInputChange('gradeObtained', e.target.value)}
                placeholder="e.g., A, 3.5"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="programChoice">Program Choice *</Label>
                          <Select
                                   value={formData.programChoice}
                                    onValueChange={(value) => handleInputChange("programChoice", value)}
                                          >
                  <SelectTrigger>
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                        <SelectContent className="bg-white">
                                {courses.map((course) => (
                          <SelectItem key={course.id} value={String(course.id)}>
                              {course.name}
                                  </SelectItem>
                                               ))}
                                        </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="intakeYear">Intake Year *</Label>
               <Select
                        value={formData.intakeYear}
                          onValueChange={(value) => handleInputChange("intakeYear", value)}
                                  >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                        <SelectContent className="bg-white">
                            {intakes.map((intake) => (
                          <SelectItem key={intake.id} value={String(intake.id)}>
                             {intake.intake_name}
                             </SelectItem>
                                       ))}
                            </SelectContent>
                </Select>
              </div>
            </div>

            
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Student Admission Application</h1>
        <p className="text-muted-foreground">Complete your application in two simple steps</p>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="mb-4" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className={currentStep >= 1 ? 'text-primary font-medium' : ''}>Personal Info</span>
            <span className={currentStep >= 2 ? 'text-primary font-medium' : ''}>Academic Info</span>
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {currentStep === 1 && <User className="h-5 w-5" />}
            {currentStep === 2 && <FileText className="h-5 w-5" />}
            <span>
              {currentStep === 1 && 'Personal Information'}
              {currentStep === 2 && 'Academic Information'}
            </span>
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && 'Please provide your personal details'}
            {currentStep === 2 && 'Tell us about your academic background'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevStep}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        
        {currentStep < totalSteps ? (
          <Button onClick={handleNextStep} className="gradient-primary text-white">
            Next Step
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="gradient-primary text-white">
            <CheckCircle className="mr-2 h-4 w-4" />
            Submit Application
          </Button>
        )}
      </div>
    </div>
  );
};

export default AdmissionsPage;