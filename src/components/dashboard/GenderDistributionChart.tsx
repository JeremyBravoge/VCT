"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GenderDistributionChartProps {
  genderStats?: {
    male: number;
    female: number;
    others: number;
  };
}

export function GenderDistributionChart({ genderStats }: GenderDistributionChartProps) {
  // Use actual data from props or default to zeros
  const actualData = genderStats || { male: 0, female: 0, others: 0 };
  
  // Calculate percentages for display
  const total = actualData.male + actualData.female + actualData.others;
  
  const chartData = [
    { 
      name: "Male", 
      value: actualData.male, 
      percentage: total > 0 ? Math.round((actualData.male / total) * 100) : 0,
      color: "#FFA500" 
    },
    { 
      name: "Female", 
      value: actualData.female, 
      percentage: total > 0 ? Math.round((actualData.female / total) * 100) : 0,
      color: "#00C49F" 
    },
    { 
      name: "Others", 
      value: actualData.others, 
      percentage: total > 0 ? Math.round((actualData.others / total) * 100) : 0,
      color: "#FF4D4F" 
    },
  ];

  // Show message if no data
  if (total === 0) {
    return (
      <Card className="shadow-card transition-smooth hover:shadow-academic">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Gender Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-28">
          <p className="text-sm text-muted-foreground text-center">
            No gender data available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card transition-smooth hover:shadow-academic">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Gender Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center gap-4">
        {/* Chart */}
        <div className="w-28 h-28 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={45}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="space-y-2">
          {chartData.map((entry) => (
            <div key={entry.name} className="flex items-center space-x-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-muted-foreground w-16">
                {entry.name}
              </span>
              <span className="text-sm font-medium text-foreground">
                {entry.percentage}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}