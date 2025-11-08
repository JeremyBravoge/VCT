"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: "Male", value: 50, color: "#FFA500" },
  { name: "Female", value: 35, color: "#00C49F" },
  { name: "Others", value: 15, color: "#FF4D4F" },
];

export function GenderDistributionChart() {
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
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={45}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="space-y-2">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center space-x-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-muted-foreground w-16">
                {entry.name}
              </span>
              <span className="text-sm font-medium text-foreground">
                {entry.value}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
