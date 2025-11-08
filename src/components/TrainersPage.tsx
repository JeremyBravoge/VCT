import React, { useEffect, useState } from "react";
import { Search, Phone, Mail, GraduationCap, User } from "lucide-react";

interface Trainer {
  trainer_id: number;
  first_name: string;
  last_name: string;
  specialization: string;
  qualification: string;
  phone_number: string;
  email: string;
}

function TrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/instructors")
      .then((res) => res.json())
      .then((data) => {
        const normalized = Array.isArray(data)
          ? data.map((t: any) => ({
              trainer_id: t.trainer_id || t.id || 0,
              first_name: t.first_name || (t.name ? t.name.split(" ")[0] : "Unknown"),
              last_name: t.last_name || (t.name ? t.name.split(" ")[1] || "" : ""),
              specialization: t.specialization || t.expertise || "N/A",
              qualification: t.qualification || "N/A",
              phone_number: t.phone_number || t.phone || "N/A",
              email: t.email || "N/A",
            }))
          : [];
        setTrainers(normalized);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching trainers:", err);
        setLoading(false);
      });
  }, []);

  const filteredTrainers = trainers.filter((trainer) =>
    `${trainer.first_name} ${trainer.last_name}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold text-indigo-700 flex items-center gap-2">
            <User className="text-indigo-600" /> Trainer Management
          </h1>

          <div className="relative w-full sm:w-80 mt-4 sm:mt-0">
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500 animate-pulse">
            Loading trainers...
          </div>
        ) : filteredTrainers.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No trainers found.</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-indigo-600 text-white text-base">
                <tr>
                  <th className="px-4 py-3 text-center w-12">#</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Specialization</th>
                  <th className="px-4 py-3">Qualification</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Email</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrainers.map((trainer, index) => (
                  <tr
                    key={trainer.trainer_id || index}
                    className={`border-t ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition`}
                  >
                    <td className="px-4 py-3 text-center font-semibold text-gray-700">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{trainer.first_name} {trainer.last_name}</td>
                    <td className="px-4 py-3 text-gray-700">
                      <div className="flex items-center gap-2">
                        <GraduationCap size={16} className="text-indigo-500" />
                        {trainer.specialization}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{trainer.qualification}</td>
                    <td className="px-4 py-3 text-gray-700">
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-green-500" />
                        {trainer.phone_number}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-indigo-500" />
                        <span className="truncate">{trainer.email}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrainersPage;
