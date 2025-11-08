import React from "react";
import { BarChart3, Trophy } from "lucide-react";

interface MarksAnalyticsProps {
  submittedMarks: any[];
}

const MarksAnalytics: React.FC<MarksAnalyticsProps> = ({ submittedMarks }) => {
  if (submittedMarks.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        No marks data to analyze yet 📉
      </div>
    );
  }

  // 🧮 Calculate module averages
  const moduleAverages: Record<string, number> = {};
  submittedMarks.forEach((mark) => {
    if (!moduleAverages[mark.module]) moduleAverages[mark.module] = 0;
    moduleAverages[mark.module] += mark.total;
  });
  Object.keys(moduleAverages).forEach((m) => {
    const count = submittedMarks.filter((s) => s.module === m).length;
    moduleAverages[m] = Math.round(moduleAverages[m] / count);
  });

  // 🏆 Top student
  const topStudent = submittedMarks.reduce((a, b) =>
    a.total > b.total ? a : b
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-indigo-100 py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8 flex items-center gap-2">
          <BarChart3 className="text-indigo-600" /> Marks Analytics Dashboard
        </h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(moduleAverages).map(([module, avg]) => (
            <div
              key={module}
              className="p-5 bg-gray-50 border rounded-xl hover:shadow-lg transition"
            >
              <h4 className="font-semibold text-gray-800">{module}</h4>
              <p className="text-gray-600 text-sm">Average: {avg}%</p>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex items-center gap-4">
          <Trophy className="text-yellow-500" size={36} />
          <div>
            <h3 className="text-lg font-semibold text-yellow-700">Top Student</h3>
            <p className="text-gray-800 font-medium">
              {topStudent.name} — {topStudent.total} Marks ({topStudent.grade})
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarksAnalytics;
