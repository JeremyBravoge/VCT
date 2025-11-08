import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  className?: string;
  bgColor?: string; // e.g. "bg-gradient-to-r from-indigo-500 to-purple-500"
}

export function MetricCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  className,
  bgColor = "bg-white", // ✅ default background
}: MetricCardProps) {
  return (
    <Card
      className={cn(
        "shadow-md transition-all hover:shadow-lg text-white border-0", // general style
        bgColor, // ✅ apply background color
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium opacity-90">{title}</CardTitle>
        <Icon className="h-5 w-5 opacity-80" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p
            className={cn(
              "text-xs mt-1",
              changeType === "positive" && "text-green-200",
              changeType === "negative" && "text-red-200",
              changeType === "neutral" && "text-gray-200"
            )}
          >
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
