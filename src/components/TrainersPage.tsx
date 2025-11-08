import React, { useEffect, useState } from "react";
import {
  Search,
  Phone,
  Mail,
  User,
  GraduationCap,
  Edit,
  PlusCircle,
  X,
  Trash2,
} from "lucide-react";

interface TrainerTableRow {
  trainer_id: number;
  first_name: string;
  last_name: string;
  specialization: string;
  qualification: string;
  phone_number: string;
  email: string;
}

function TrainersPage() {
  const [trainers, setTrainers] = useState<TrainerTableRow[]>([]);
  const [departments, setDepartments] = useState<{ [key: number]: string }>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerTableRow | null>(
    null
  );

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    department: "",
    gender: "",
  });

  // Fetch departments
  const fetchDepartments = () => {
    fetch("http://localhost:5000/api/departments")
      .then((res) => res.json())
      .then((data: { id: number; name: string }[]) => {
        const deptMap: { [key: number]: string } = {};
        data.forEach((dept) => {
          deptMap[dept.id] = dept.name;
        });
        setDepartments(deptMap);
      })
      .catch((err) => {
        console.error("Error fetching departments:", err);
      });
  };

  // Fetch trainers
  const fetchTrainers = () => {
    setLoading(true);
    fetch("http://localhost:5000/api/instructors")
      .then((res) => res.json())
      .then(
        (
          data: {
            id: number;
            name: string;
            department_id: number;
            phone?: string;
            email: string;
          }[]
        ) => {
          const normalized = Array.isArray(data)
            ? data.map((t) => {
                const nameParts = t.name.split(" ");
                const first_name = nameParts[0] || "";
                const last_name = nameParts.slice(1).join(" ") || "";
                return {
                  trainer_id: t.id,
                  first_name,
                  last_name,
                  specialization: departments[t.department_id] || "Unknown",
                  qualification: "N/A",
                  phone_number: t.phone || "N/A",
                  email: t.email,
                };
              })
            : [];
          setTrainers(normalized);
          setLoading(false);
        }
      )
      .catch((err) => {
        console.error("Error fetching instructors:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (Object.keys(departments).length > 0) {
      fetchTrainers();
    }
  }, [departments]);

  const filteredTrainers = trainers.filter((trainer) =>
    `${trainer.first_name} ${trainer.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Handlers
  const handleAddTrainer = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      department: "",
      gender: "",
    });
    setShowAddModal(true);
  };

  const handleEdit = (trainer: TrainerTableRow) => {
    setSelectedTrainer(trainer);
    setFormData({
      first_name: trainer.first_name,
      last_name: trainer.last_name,
      email: trainer.email,
      phone: trainer.phone_number,
      department: trainer.specialization,
      gender: "",
    });
    setShowEditModal(true);
  };

  const handleDelete = async (trainer_id: number) => {
    if (!window.confirm("Are you sure you want to delete this trainer?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/instructors/${trainer_id}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        alert("Trainer deleted successfully!");
        fetchTrainers();
      } else {
        alert("Failed to delete trainer.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/instructors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("Trainer added successfully!");
        setShowAddModal(false);
        fetchTrainers();
      } else {
        const errText = await res.text();
        alert(`Failed to add trainer. Server said: ${errText}`);
      }
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrainer) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/instructors/${selectedTrainer.trainer_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (res.ok) {
        alert("Trainer updated successfully!");
        setShowEditModal(false);
        setSelectedTrainer(null);
        fetchTrainers();
      } else {
        alert("Failed to update trainer.");
      }
    } catch (err) {
      console.error("Edit error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-indigo-700 flex items-center gap-2">
            <User className="text-yellow-600" /> Instructor Management
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <button
              onClick={handleAddTrainer}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl shadow transition"
            >
              <PlusCircle size={18} />
              Add Trainer
            </button>

            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-10 text-gray-500 animate-pulse">
            Loading instructors...
          </div>
        ) : filteredTrainers.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No instructors found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-yellow-500 text-white text-base">
                <tr>
                  <th className="px-4 py-3 text-center w-12">#</th>
                  <th className="px-4 py-3 whitespace-nowrap">Name</th>
                  <th className="px-4 py-3 whitespace-nowrap">Department</th>
                  <th className="px-4 py-3 whitespace-nowrap">Qualification</th>
                  <th className="px-4 py-3 whitespace-nowrap">Phone</th>
                  <th className="px-4 py-3 whitespace-nowrap">Email</th>
                  <th className="px-4 py-3 whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 text-center whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTrainers.map((trainer, index) => (
                  <tr
                    key={trainer.trainer_id}
                    className={`border-t ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100 transition`}
                  >
                    <td className="px-4 py-3 text-center font-semibold text-gray-700">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap truncate max-w-[180px]">
                      {trainer.first_name} {trainer.last_name}
                    </td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <GraduationCap size={16} className="text-indigo-500" />
                        {trainer.specialization}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      {trainer.qualification}
                    </td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-green-500" />
                        {trainer.phone_number}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap truncate max-w-[200px]">
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-indigo-500" />
                        {trainer.email}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-white bg-green-500">
                        Active
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(trainer)}
                          className="p-2 rounded-lg bg-yellow-100 hover:bg-yellow-200 text-yellow-600 transition"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(trainer.trainer_id)}
                          className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => {
                setShowAddModal(false);
                setShowEditModal(false);
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold text-yellow-600 mb-4">
              {showAddModal ? "Add Trainer" : "Edit Trainer"}
            </h2>

            <form
              onSubmit={showAddModal ? handleSubmitAdd : handleSubmitEdit}
              className="space-y-4"
            >
              <div>
                <label className="block text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gender: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Department</label>
                <select
                  required
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      department: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Select Department</option>
                  {Object.values(departments).map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition"
              >
                {showAddModal ? "Add Trainer" : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrainersPage;
