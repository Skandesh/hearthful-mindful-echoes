
import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: {
    value: number;
    label: string;
  };
}

export function StatCard({ title, value, icon, description, trend }: StatCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="h-8 w-8 rounded-md bg-primary/10 p-1.5 text-primary">{icon}</div>
        </div>
        <div className="mt-2">
          <p className="text-2xl font-bold">{value}</p>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          {trend && (
            <div className="mt-2 flex items-center text-xs">
              <span className={trend.value >= 0 ? "text-green-500" : "text-red-500"}>
                {trend.value >= 0 ? "+" : ""}{trend.value}%
              </span>
              <span className="ml-1 text-muted-foreground">{trend.label}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
