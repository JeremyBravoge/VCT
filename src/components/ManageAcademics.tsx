"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label"; // Added Label for accessibility/clarity
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Added proper table components
import { BookOpen, Calendar, GripVertical, Trash2, Edit, Save, PlusCircle, XCircle } from 'lucide-react'; // Modern Icons

// --- Type Definitions (Kept as is) ---
type Level = { id: number; name: string; duration: string; description: string };
type Intake = { id: number; intake_name: string; year: number; term: string; start_date: string; end_date: string };
type Course = { id: number; name: string };
type Module = { id: number; code: string; title: string; course_id: number; level_id: number };

// --- Main Component ---
export default function ManageAcademics() {
  const [tab, setTab] = useState("levels");
  const [loading, setLoading] = useState(false); // Added loading state for buttons

  const [levels, setLevels] = useState<Level[]>([]);
  const [intakes, setIntakes] = useState<Intake[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const initialLevelForm = { id: 0, name: "", duration: "", description: "" };
  const initialIntakeForm = { id: 0, intake_name: "", year: new Date().getFullYear(), term: "January", start_date: "", end_date: "" };
  const initialModuleForm = { id: 0, code: "", title: "", course_id: 0, level_id: 0 };
  
  const [levelForm, setLevelForm] = useState<Level>(initialLevelForm);
  const [intakeForm, setIntakeForm] = useState<Intake>(initialIntakeForm);
  const [moduleForm, setModuleForm] = useState<Module>(initialModuleForm);

  // --- API Handlers (Kept Functionally Identical) ---
  const fetchData = async () => {
    // Note: Error handling/Toasts would be added in a production app
    const [levelRes, intakeRes, moduleRes, courseRes] = await Promise.all([
      fetch("/api/levels"),
      fetch("/api/intakes"),
      fetch("/api/modules"),
      fetch("/api/courses"),
    ]);

    setLevels(await levelRes.json());
    setIntakes(await intakeRes.json());
    setModules(await moduleRes.json());
    setCourses(await courseRes.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (type: "level" | "intake" | "module") => {
    setLoading(true);
    let url = `/api/${type}s`;
    let body: any;
    let id = 0;

    if (type === "level") { body = levelForm; id = levelForm.id; }
    if (type === "intake") { body = intakeForm; id = intakeForm.id; }
    if (type === "module") { body = moduleForm; id = moduleForm.id; }

    try {
      await fetch(`${url}${id ? `/${id}` : ""}`, {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await fetchData();
      // Reset form
      if (type === "level") setLevelForm(initialLevelForm);
      if (type === "intake") setIntakeForm(initialIntakeForm);
      if (type === "module") setModuleForm(initialModuleForm);
    } catch (error) {
        console.error(`Failed to submit ${type}:`, error);
        // Add toast error notification here
    } finally {
        setLoading(false);
    }
  };

  const handleEdit = (type: "level" | "intake" | "module", item: any) => {
    if (type === "level") setLevelForm(item);
    if (type === "intake") setIntakeForm(item);
    if (type === "module") setModuleForm(item);
  };
  
  const handleClear = (type: "level" | "intake" | "module") => {
    if (type === "level") setLevelForm(initialLevelForm);
    if (type === "intake") setIntakeForm(initialIntakeForm);
    if (type === "module") setModuleForm(initialModuleForm);
  }

  const handleDelete = async (type: "level" | "intake" | "module", id: number) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
        await fetch(`/api/${type}s/${id}`, { method: "DELETE" });
        fetchData();
    } catch (error) {
        console.error(`Failed to delete ${type}:`, error);
        // Add toast error notification here
    }
  };

  // --- Sub-Components for UI Clarity ---

  // Renders the form for Levels, Intakes, or Modules
  const renderForm = (type: "level" | "intake" | "module") => {
    const isEdit = type === "level" ? levelForm.id !== 0 : type === "intake" ? intakeForm.id !== 0 : moduleForm.id !== 0;
    const currentForm = type === "level" ? levelForm : type === "intake" ? intakeForm : moduleForm;
    const primaryIcon = isEdit ? <Edit className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />;
    const primaryText = isEdit ? "Update" : "Add";
    const title = isEdit ? `Edit ${type.charAt(0).toUpperCase() + type.slice(1)}` : `Create New ${type.charAt(0).toUpperCase() + type.slice(1)}`;

    return (
      <Card className="shadow-lg mb-6 border-t-4 border-blue-500">
        <CardHeader>
            <CardTitle className="flex items-center text-xl text-blue-700">
                {primaryIcon}{title}
            </CardTitle>
            <CardDescription>
                {type === 'level' && "Define the structure and duration of academic levels."}
                {type === 'intake' && "Schedule and manage academic intake periods and terms."}
                {type === 'module' && "Define course units and assign them to courses and levels."}
            </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {type === "level" && (
              <>
                <div className="space-y-1">
                    <Label htmlFor="level-name">Name</Label>
                    <Input id="level-name" placeholder="e.g., Level 1" value={levelForm.name} onChange={e=>setLevelForm({...levelForm,name:e.target.value})} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="level-duration">Duration</Label>
                    <Input id="level-duration" placeholder="e.g., 6 Months" value={levelForm.duration} onChange={e=>setLevelForm({...levelForm,duration:e.target.value})} />
                </div>
                <div className="space-y-1 col-span-full md:col-span-2">
                    <Label htmlFor="level-description">Description</Label>
                    <Input id="level-description" placeholder="Short description of the level" value={levelForm.description} onChange={e=>setLevelForm({...levelForm,description:e.target.value})} />
                </div>
              </>
            )}

            {type === "intake" && (
              <>
                <div className="space-y-1">
                    <Label htmlFor="intake-name">Intake Name</Label>
                    <Input id="intake-name" placeholder="e.g., Jan 2026" value={intakeForm.intake_name} onChange={e=>setIntakeForm({...intakeForm,intake_name:e.target.value})} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="intake-year">Year</Label>
                    <Input id="intake-year" type="number" value={intakeForm.year} onChange={e=>setIntakeForm({...intakeForm,year:Number(e.target.value)})} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="intake-term">Term</Label>
                    <Select value={intakeForm.term} onValueChange={v=>setIntakeForm({...intakeForm,term:v})}>
                        <SelectTrigger><SelectValue placeholder="Select Term"/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="January">January</SelectItem>
                            <SelectItem value="May">May</SelectItem>
                            <SelectItem value="September">September</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="intake-start">Start Date</Label>
                    <Input id="intake-start" type="date" value={intakeForm.start_date.split('T')[0]} onChange={e=>setIntakeForm({...intakeForm,start_date:e.target.value})} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="intake-end">End Date</Label>
                    <Input id="intake-end" type="date" value={intakeForm.end_date.split('T')[0]} onChange={e=>setIntakeForm({...intakeForm,end_date:e.target.value})} />
                </div>
              </>
            )}

            {type === "module" && (
              <>
                <div className="space-y-1">
                    <Label htmlFor="module-code">Code</Label>
                    <Input id="module-code" placeholder="e.g., MOD101" value={moduleForm.code} onChange={e=>setModuleForm({...moduleForm,code:e.target.value})} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="module-title">Title</Label>
                    <Input id="module-title" placeholder="e.g., Intro to Networking" value={moduleForm.title} onChange={e=>setModuleForm({...moduleForm,title:e.target.value})} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="module-course">Course</Label>
                    <Select value={moduleForm.course_id.toString()} onValueChange={v=>setModuleForm({...moduleForm,course_id:Number(v)})}>
                        <SelectTrigger><SelectValue placeholder="Select Course"/></SelectTrigger>
                        <SelectContent>
                            {courses.map(c=><SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="module-level">Level</Label>
                    {/* Using Select for Level ID for better UX, assuming levels are few */}
                    <Select value={moduleForm.level_id.toString()} onValueChange={v=>setModuleForm({...moduleForm,level_id:Number(v)})}>
                        <SelectTrigger><SelectValue placeholder="Select Level"/></SelectTrigger>
                        <SelectContent>
                            {levels.map(l=><SelectItem key={l.id} value={l.id.toString()}>{l.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end space-x-2 mt-6 border-t pt-4">
              {isEdit && (
                  <Button variant="outline" onClick={() => handleClear(type)}>
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel Edit
                  </Button>
              )}
              <Button onClick={()=>handleSubmit(type)} disabled={loading}>
                  {loading ? (
                    <GripVertical className="mr-2 h-4 w-4 animate-bounce" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {primaryText} {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  // Renders the data table for Levels, Intakes, or Modules
  const renderTable = (type: "level" | "intake" | "module") => {
    const data = type === "level" ? levels : type === "intake" ? intakes : modules;
    
    return (
        <Card className="shadow-lg">
            <CardHeader className="border-b">
                <CardTitle className="text-lg">Existing {type.charAt(0).toUpperCase() + type.slice(1)}s ({data.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {type === "level" && (
                                    <>
                                        <TableHead className="w-[150px]">Name</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="w-[150px] text-center">Actions</TableHead>
                                    </>
                                )}
                                {type === "intake" && (
                                    <>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Year</TableHead>
                                        <TableHead>Term</TableHead>
                                        <TableHead>Start Date</TableHead>
                                        <TableHead>End Date</TableHead>
                                        <TableHead className="w-[150px] text-center">Actions</TableHead>
                                    </>
                                )}
                                {type === "module" && (
                                    <>
                                        <TableHead className="w-[100px]">Code</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Course</TableHead>
                                        <TableHead>Level</TableHead>
                                        <TableHead className="w-[150px] text-center">Actions</TableHead>
                                    </>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item: any) => (
                                <TableRow key={item.id}>
                                    {/* Levels */}
                                    {type === "level" && (
                                        <>
                                            <TableCell className="font-medium">{item.name}</TableCell>
                                            <TableCell>{item.duration}</TableCell>
                                            <TableCell className="text-gray-500">{item.description}</TableCell>
                                        </>
                                    )}
                                    {/* Intakes */}
                                    {type === "intake" && (
                                        <>
                                            <TableCell className="font-medium">{item.intake_name}</TableCell>
                                            <TableCell>{item.year}</TableCell>
                                            <TableCell>{item.term}</TableCell>
                                            <TableCell>{item.start_date.split('T')[0]}</TableCell>
                                            <TableCell>{item.end_date.split('T')[0]}</TableCell>
                                        </>
                                    )}
                                    {/* Modules */}
                                    {type === "module" && (
                                        <>
                                            <TableCell className="font-medium">{item.code}</TableCell>
                                            <TableCell>{item.title}</TableCell>
                                            <TableCell>{courses.find(c=>c.id===item.course_id)?.name || item.course_id}</TableCell>
                                            <TableCell>{levels.find(l=>l.id===item.level_id)?.name || item.level_id}</TableCell>
                                        </>
                                    )}
                                    <TableCell className="text-center space-x-2">
                                        <Button size="icon" variant="outline" onClick={()=>handleEdit(type,item)}>
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button size="icon" variant="destructive" onClick={()=>handleDelete(type,item.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-gray-500 py-6">
                                        No {type}s defined yet. Use the form above to add one.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
  }


  // --- Final Render ---
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center">
        <BookOpen className="w-8 h-8 mr-3 text-blue-600" />
        Academic Structure Management
      </h1>
      
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <div className="flex justify-start mb-6 border-b">
            <TabsList className="bg-white shadow-md">
                <TabsTrigger value="levels" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
                    <GripVertical className="w-4 h-4 mr-2" /> Levels
                </TabsTrigger>
                <TabsTrigger value="intakes" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
                    <Calendar className="w-4 h-4 mr-2" /> Intakes / Terms
                </TabsTrigger>
                <TabsTrigger value="modules" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
                    <BookOpen className="w-4 h-4 mr-2" /> Modules
                </TabsTrigger>
            </TabsList>
        </div>

        {/* ---------- LEVELS TAB CONTENT ---------- */}
        <TabsContent value="levels">
          {renderForm("level")}
          {renderTable("level")}
        </TabsContent>

        {/* ---------- INTAKES TAB CONTENT ---------- */}
        <TabsContent value="intakes">
          {renderForm("intake")}
          {renderTable("intake")}
        </TabsContent>

        {/* ---------- MODULES TAB CONTENT ---------- */}
        <TabsContent value="modules">
          {renderForm("module")}
          {renderTable("module")}
        </TabsContent>
      </Tabs>
    </div>
  );
}