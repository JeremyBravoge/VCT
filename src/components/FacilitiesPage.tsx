import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Facility {
  id: number;
  name: string;
  description: string;
  status: "Good" | "Needs Repair" | "Broken";
  image_url?: string;
}

interface Repair {
  id: number;
  facility_id: number;
  issue_reported: string;
  repair_date: string | null;
  cost: number | null;
  status: "Pending" | "In Progress" | "Completed";
  facility_name?: string;
  image_url?: string;
}

const FacilitiesPage: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [newRepair, setNewRepair] = useState({
    facility_id: "",
    issue_reported: "",
    cost: "",
    image: null as File | null,
  });
  const [newFacility, setNewFacility] = useState({
    name: "",
    description: "",
    status: "Good",
    image: null as File | null,
  });

  // Fetch facilities
  useEffect(() => {
    fetch("http://localhost:5000/api/facilities")
      .then((res) => res.json())
      .then((data) => setFacilities(data))
      .catch((err) => console.error("Error fetching facilities:", err));
  }, []);

  // Fetch repairs
  useEffect(() => {
    fetch("http://localhost:5000/api/repairs")
      .then((res) => res.json())
      .then((data) => setRepairs(data))
      .catch((err) => console.error("Error fetching repairs:", err));
  }, []);

  // Submit new repair
  const handleRepairSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("facility_id", newRepair.facility_id);
    formData.append("issue_reported", newRepair.issue_reported);
    formData.append("cost", newRepair.cost);
    if (newRepair.image) formData.append("image", newRepair.image);

    fetch("http://localhost:5000/api/repairs", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setRepairs([...repairs, data]);
        setNewRepair({ facility_id: "", issue_reported: "", cost: "", image: null });
      })
      .catch((err) => console.error("Error adding repair:", err));
  };

  // Submit new facility
  const handleFacilitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newFacility.name);
    formData.append("description", newFacility.description);
    formData.append("status", newFacility.status);
    if (newFacility.image) formData.append("image", newFacility.image);

    fetch("http://localhost:5000/api/facilities", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setFacilities([...facilities, data]);
        setNewFacility({ name: "", description: "", status: "Good", image: null });
      })
      .catch((err) => console.error("Error adding facility:", err));
  };

  // Update repair status
  const updateRepairStatus = (id: number, status: string) => {
    fetch(`http://localhost:5000/api/repairs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then((updated) => {
        setRepairs(
          repairs.map((r) => (r.id === id ? { ...r, status: updated.status } : r))
        );
      })
      .catch((err) => console.error("Error updating repair:", err));
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "Good":
        return "bg-green-100 text-green-700";
      case "Needs Repair":
        return "bg-yellow-100 text-yellow-700";
      case "Broken":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-8 space-y-10 bg-gray-50 min-h-screen">
      {/* Page Title */}
      <header>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Facilities Management
        </h1>
        <p className="text-gray-600">
          Monitor, add, and maintain your training facilities.
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Facilities List */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-700">All Facilities</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add Facility</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Facility</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleFacilitySubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={newFacility.name}
                      onChange={(e) =>
                        setNewFacility({ ...newFacility, name: e.target.value })
                      }
                      placeholder="Facility name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={newFacility.description}
                      onChange={(e) =>
                        setNewFacility({
                          ...newFacility,
                          description: e.target.value,
                        })
                      }
                      placeholder="Short description"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={newFacility.status}
                      onValueChange={(value) =>
                        setNewFacility({ ...newFacility, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Needs Repair">Needs Repair</SelectItem>
                        <SelectItem value="Broken">Broken</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Image</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setNewFacility({
                          ...newFacility,
                          image: e.target.files ? e.target.files[0] : null,
                        })
                      }
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save Facility</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {facilities.map((facility) => (
              <Card
                key={facility.id}
                className="shadow-sm border rounded-2xl hover:shadow-md transition"
              >
                <CardHeader>
                  <CardTitle>{facility.name}</CardTitle>
                  <CardDescription>{facility.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {facility.image_url && (
                    <img
                      src={facility.image_url}
                      alt={facility.name}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                  )}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor(
                      facility.status
                    )}`}
                  >
                    {facility.status}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Add Repair Form */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-700">Report New Repair</h2>
          <Card className="shadow-sm border rounded-2xl">
            <CardContent className="p-6 space-y-4">
              <form onSubmit={handleRepairSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Facility</Label>
                  <Select
                    value={newRepair.facility_id}
                    onValueChange={(value) =>
                      setNewRepair({ ...newRepair, facility_id: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a facility" />
                    </SelectTrigger>
                    <SelectContent>
                      {facilities.map((f) => (
                        <SelectItem key={f.id} value={String(f.id)}>
                          {f.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Issue Reported</Label>
                  <Textarea
                    placeholder="Describe the issue..."
                    value={newRepair.issue_reported}
                    onChange={(e) =>
                      setNewRepair({
                        ...newRepair,
                        issue_reported: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Estimated Cost (Ksh)</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 5000"
                    value={newRepair.cost}
                    onChange={(e) =>
                      setNewRepair({
                        ...newRepair,
                        cost: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Upload Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setNewRepair({
                        ...newRepair,
                        image: e.target.files ? e.target.files[0] : null,
                      })
                    }
                  />
                </div>
                <Button type="submit" className="w-full">
                  Submit Report
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Repair Logs */}
      <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Repair Logs</h2>
        <div className="space-y-4">
          {repairs.map((repair) => (
            <Card
              key={repair.id}
              className="shadow-sm border rounded-2xl hover:shadow-md transition"
            >
              <CardContent className="p-5 space-y-2">
                <p className="font-semibold text-gray-800">
                  {repair.facility_name || `Facility #${repair.facility_id}`}
                </p>
                {repair.image_url && (
                  <img
                    src={repair.image_url}
                    alt="Repair issue"
                    className="w-full h-40 object-cover rounded-lg mb-2"
                  />
                )}
                <p className="text-sm text-gray-600">{repair.issue_reported}</p>
                {repair.cost && (
                  <p className="text-sm text-gray-800 font-medium">
                    Estimated Cost: Ksh {repair.cost}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Status: <span className="font-medium">{repair.status}</span>{" "}
                  {repair.repair_date ? `(Repaired on ${repair.repair_date})` : ""}
                </p>
                <div className="flex gap-2 mt-2">
                  {repair.status === "Pending" && (
                    <Button
                      size="sm"
                      onClick={() => updateRepairStatus(repair.id, "In Progress")}
                    >
                      Respond
                    </Button>
                  )}
                  {repair.status === "In Progress" && (
                    <Button
                      size="sm"
                      onClick={() => updateRepairStatus(repair.id, "Completed")}
                    >
                      Mark Completed
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FacilitiesPage;
