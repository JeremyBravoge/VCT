import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface EnrollmentChartProps {
  enrollmentRate: number;
}

const EnrollmentChart: React.FC<EnrollmentChartProps> = ({ enrollmentRate }) => {
  const data = [
    { name: 'Enrolled', value: enrollmentRate, color: '#10B981' },
    { name: 'Not Enrolled', value: 100 - enrollmentRate, color: '#EF4444' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Enrollment Rate</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}%`, 'Rate']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center mt-4">
        <p className="text-2xl font-bold text-gray-900">{enrollmentRate}%</p>
        <p className="text-sm text-gray-600">Enrollment Rate</p>
      </div>
    </div>
  );
};

export default EnrollmentChart;
