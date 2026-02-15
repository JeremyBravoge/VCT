import React, { useState } from "react";
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
// Zod Schema including all necessary fields
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

  // Guardian fields
  guardianName: z.string().min(1, "Guardian name required"),
  guardianContact: z.string().min(10, "Valid contact required"),
  guardianEmail: z.string().email("Valid email").optional(),
  guardianRelationship: z.string().optional(),
  guardianAddress: z.string().optional(),
});

type AdmissionFormData = z.infer<typeof admissionSchema>;

const AdmissionsPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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



  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: AdmissionFormData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value.toString());
      });

      if (selectedFile) formData.append("photo", selectedFile);

      const res = await fetch("/api/students/register", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to submit application");

      toast({ title: "Success", description: "Student registered successfully!" });

      reset();
      setProfileImage(null);
      setSelectedFile(null);
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

  //
  // STEP 1 — PERSONAL INFORMATION
  //
  const StepOne = () => (
    <div className="space-y-5 animate-fadeIn">
      {/* PHOTO */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-28 h-28">
          <div className="w-full h-full rounded-full overflow-hidden border-4 border-blue-200 shadow-md">
            {profileImage ? (
              <img src={profileImage} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                <User className="w-10 h-10" />
              </div>
            )}
          </div>
          <label className="absolute bottom-0 right-0 bg-yellow-600 p-1 rounded-full cursor-pointer hover:bg-yellow-700">
            <Camera className="w-4 h-4 text-white" />
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>
      </div>

      {/* PERSONAL FIELDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>First Name *</Label>
          <Input {...register("firstName")} />
          {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName.message}</span>}
        </div>
        <div>
          <Label>Last Name *</Label>
          <Input {...register("lastName")} />
          {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName.message}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>ID Number *</Label>
          <Input {...register("idNumber")} />
          {errors.idNumber && <span className="text-red-500 text-sm">{errors.idNumber.message}</span>}
        </div>
        <div>
          <Label>Date of Birth</Label>
          <Input type="date" {...register("dateOfBirth")} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Gender *</Label>
          <Select onValueChange={(v) => setValue("gender", v)} value={watch("gender")}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && <span className="text-red-500 text-sm">{errors.gender.message}</span>}
        </div>
        <div>
          <Label>Nationality</Label>
          <Input {...register("nationality")} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>County *</Label>
          <Input {...register("county")} />
          {errors.county && <span className="text-red-500 text-sm">{errors.county.message}</span>}
        </div>
        <div>
          <Label>Phone *</Label>
          <Input {...register("phone")} />
          {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
        </div>
      </div>

      <div>
        <Label>Email *</Label>
        <Input type="email" {...register("email")} />
        {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
      </div>

      <div>
        <Label>Address</Label>
        <Textarea rows={3} {...register("address")} />
      </div>
    </div>
  );

  //
  // STEP 2 — GUARDIAN INFORMATION
  //
  const StepTwo = () => (
    <div className="space-y-5 animate-fadeIn">
      <h2 className="text-lg font-semibold text-gray-700">Guardian Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Guardian Name *</Label>
          <Input {...register("guardianName")} />
          {errors.guardianName && <span className="text-red-500 text-sm">{errors.guardianName.message}</span>}
        </div>
        <div>
          <Label>Guardian Contact *</Label>
          <Input {...register("guardianContact")} />
          {errors.guardianContact && <span className="text-red-500 text-sm">{errors.guardianContact.message}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Guardian Email</Label>
          <Input type="email" {...register("guardianEmail")} />
        </div>
        <div>
          <Label>Guardian Relationship</Label>
          <Input {...register("guardianRelationship")} />
        </div>
        <div>
          <Label>Guardian Address</Label>
          <Textarea rows={1} {...register("guardianAddress")} />
        </div>
      </div>


    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-10 px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-yellow-700 mb-1">🎓 Student Admission</h1>
        <p className="text-gray-600">Complete your registration in 2 easy steps</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-700">
            {currentStep === 1 ? <User className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
            <span>{currentStep === 1 ? "Personal Information" : "Guardian Information"}</span>
          </CardTitle>
          <CardDescription>
            {currentStep === 1
              ? "Provide personal details"
              : "Add guardian info"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {currentStep === 1 ? <StepOne /> : <StepTwo />}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
          disabled={currentStep === 1}
        >
          Previous
        </Button>

        {currentStep < totalSteps ? (
          <Button onClick={() => setCurrentStep((s) => Math.min(totalSteps, s + 1))}>
            Next
          </Button>
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
