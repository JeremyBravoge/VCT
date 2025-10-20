// components/FinanceChart.tsx
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LabelList } from "recharts";

interface SummaryChartProps {
  financeData: any[];
}

const FinanceChart: React.FC<SummaryChartProps> = ({ financeData }) => {
  // Aggregate totals
  const totalFees = financeData.reduce((sum, f) => sum + parseFloat(f.total_amount || 0), 0);
  const totalPaid = financeData.reduce((sum, f) => sum + parseFloat(f.amount_paid || 0), 0);
  const totalPending = financeData.reduce((sum, f) => sum + parseFloat(f.amount_pending || 0), 0);

  const chartData = [
    { category: "Total Fees", amount: totalFees },
    { category: "Paid", amount: totalPaid },
    { category: "Pending", amount: totalPending },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip formatter={(value: number) => `Ksh ${value.toLocaleString()}`} />
        <Legend />
        <Bar dataKey="amount" fill="#4f46e5">
          <LabelList dataKey="amount" position="top" formatter={(value) => `Ksh ${value.toLocaleString()}`} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default FinanceChart;
