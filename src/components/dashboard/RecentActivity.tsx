import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Activity {
  id: number;
  student: string;
  action: string;
  course: string;
  time: string;
  type: string;
}

const getBadgeVariant = (type: string) => {
  switch (type) {
    case "enrollment":
      return "default";
    case "payment":
      return "secondary";
    case "exam":
    case "assignment":
      return "outline";
    default:
      return "outline";
  }
};

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetch("http://localhost:5000/api/activities/recent")
    .then((res) => res.json())
    .then((data) => {
      setActivities(data);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Failed to fetch recent activity:", err);
      setLoading(false);
    });
}, []);


  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
        {!loading && activities.length === 0 && (
          <p className="text-sm text-muted-foreground">No activity yet.</p>
        )}
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center space-x-4">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {activity.student
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                {activity.student}
              </p>
              <p className="text-sm text-muted-foreground">
                {activity.action} • {activity.course}
              </p>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <Badge
                variant={getBadgeVariant(activity.type)}
                className="text-xs"
              >
                {activity.action}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(activity.time).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
