import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { User, FileText, CheckCircle, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

//
// Zod Schema
//
const admissionSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  idNumber: z.string().min(1, "ID number is required"),
  dateOfBirth: z.string().optional(),
  gender: z.string().min(1, "Gender is required"),
  nationality: z.string().optional(),
  county: z.string().min(1, "County is required"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Valid email required"),
  address: z.string().optional(),
  previousSchool: z.string().optional(),
  graduationYear: z.string().optional(),
  gradeObtained: z.string().optional(),
  programChoice: z.string().min(1, "Program choice required"),
  intakeYear: z.string().min(1, "Intake year required"),
});

type AdmissionFormData = z.infer<typeof admissionSchema>;

const AdmissionsPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [courses, setCourses] = useState<{ id: number; name: string }[]>([]);
  const [intakes, setIntakes] = useState<{ id: number; intake_name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const totalSteps = 2;
  const progress = (currentStep / totalSteps) * 100;
  const { toast } = useToast();


  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<AdmissionFormData>({
    resolver: zodResolver(admissionSchema),
  });

  // Fetch data
  useEffect(() => {
    fetch("http://localhost:5000/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch(() => toast({ title: "Error", description: "Failed to load courses", variant: "destructive" }));

    fetch("http://localhost:5000/api/intakes")
      .then((res) => res.json())
      .then((data) => setIntakes(data))
      .catch(() => toast({ title: "Error", description: "Failed to load intakes", variant: "destructive" }));
  }, []);

  // Submit Handler
  const onSubmit = async (data: AdmissionFormData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // Append the image file if selected
if (selectedFile) {
  formData.append('photo', selectedFile);
}


      const res = await fetch("http://localhost:5000/api/students/register", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to submit application");
      toast({ title: "✅ Application Submitted", description: "Your admission application was successful!" });
      reset();
      setProfileImage(null);
      setCurrentStep(1);
    } catch (err) {
      toast({
        title: "Submission Failed",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Image Upload
const [selectedFile, setSelectedFile] = useState<File | null>(null);

const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0] ?? null;
  if (file) {
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = () => setProfileImage(reader.result as string);
    reader.readAsDataURL(file);
  }
};

  // Steps
  const StepOne = () => (
    <div className="space-y-5 animate-fadeIn">
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-28 h-28">
          <div className="w-full h-full rounded-full overflow-hidden border-4 border-blue-200 shadow-md">
{profileImage ? (
  <img
    src={profileImage}
    alt="Student photo"
    className="w-full h-full object-cover"
  />
) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                <User className="w-10 h-10" />
              </div>
            )}
          </div>
          <label className="absolute bottom-0 right-0 bg-yellow-600 p-1 rounded-full cursor-pointer hover:bg-yellow-700 transition">
            <Camera className="w-4 h-4 text-white" />
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>
        <p className="text-sm text-gray-600 mt-2">Upload your passport photo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>First Name *</Label>
          <Input {...register("firstName")} placeholder="Enter first name" />
          {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
        </div>
        <div>
          <Label>Last Name *</Label>
          <Input {...register("lastName")} placeholder="Enter last name" />
          {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>ID Number *</Label>
          <Input {...register("idNumber")} placeholder="Enter ID number" />
          {errors.idNumber && <p className="text-red-500 text-sm">{errors.idNumber.message}</p>}
        </div>
        <div>
          <Label>Date of Birth</Label>
          <Input type="date" {...register("dateOfBirth")} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Gender *</Label>
          <Select onValueChange={(val) => setValue("gender", val)} value={watch("gender")}>
            <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
        </div>
        <div>
          <Label>Nationality</Label>
          <Input {...register("nationality")} placeholder="Kenyan" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>County *</Label>
          <Input {...register("county")} placeholder="Enter county" />
          {errors.county && <p className="text-red-500 text-sm">{errors.county.message}</p>}
        </div>
        <div>
          <Label>Phone Number *</Label>
          <Input {...register("phone")} placeholder="07..." />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <Label>Email *</Label>
        <Input type="email" {...register("email")} placeholder="you@example.com" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <Label>Address</Label>
        <Textarea {...register("address")} placeholder="Enter your address" rows={3} />
      </div>
    </div>
  );

  const StepTwo = () => (
    <div className="space-y-5 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Previous School</Label>
          <Input {...register("previousSchool")} placeholder="Enter previous school" />
        </div>
        <div>
          <Label>Graduation Year</Label>
          <Input type="number" {...register("graduationYear")} placeholder="e.g. 2023" />
        </div>
      </div>

      <div>
        <Label>Grade / CGPA</Label>
        <Input {...register("gradeObtained")} placeholder="e.g., B+, 3.2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Program Choice *</Label>
          <Select onValueChange={(val) => setValue("programChoice", val)} value={watch("programChoice")}>
            <SelectTrigger><SelectValue placeholder="Select program" /></SelectTrigger>
            <SelectContent>
              {courses.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.programChoice && <p className="text-red-500 text-sm">{errors.programChoice.message}</p>}
        </div>

        <div>
          <Label>Intake Year *</Label>
          <Select onValueChange={(val) => setValue("intakeYear", val)} value={watch("intakeYear")}>
            <SelectTrigger><SelectValue placeholder="Select intake" /></SelectTrigger>
            <SelectContent>
              {intakes.map((i) => (
                <SelectItem key={i.id} value={String(i.id)}>{i.intake_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.intakeYear && <p className="text-red-500 text-sm">{errors.intakeYear.message}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-10 px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-yellow-700 mb-1">🎓 Student Admission Application</h1>
        <p className="text-gray-600">Complete your application in two easy steps</p>
      </div>

      <Card className="shadow-md border-blue-100">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-700">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} />
        </CardContent>
      </Card>

      <Card className="shadow-lg border border-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-700">
            {currentStep === 1 ? <User className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
            <span>{currentStep === 1 ? "Personal Information" : "Academic Information"}</span>
          </CardTitle>
          <CardDescription>
            {currentStep === 1
              ? "Please provide your personal details"
              : "Tell us about your academic background"}
          </CardDescription>
        </CardHeader>
        <CardContent>{currentStep === 1 ? <StepOne /> : <StepTwo />}</CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep((s) => Math.max(1, s - 1))} disabled={currentStep === 1}>
          Previous
        </Button>

        {currentStep < totalSteps ? (
          <Button onClick={() => setCurrentStep((s) => Math.min(totalSteps, s + 1))}>Next</Button>
        ) : (
          <Button onClick={handleSubmit(onSubmit)} disabled={loading}>
            {loading ? "Submitting..." : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" /> Submit Application
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AdmissionsPage;
