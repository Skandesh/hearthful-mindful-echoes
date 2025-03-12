
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PlanUsageCardProps {
  usedPercentage: number;
  planType: string;
  usedCount: number;
  totalCount: number;
}

export function PlanUsageCard({ usedPercentage, planType, usedCount, totalCount }: PlanUsageCardProps) {
  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-base font-medium">Plan Usage</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium capitalize">{planType}</span> plan
            </p>
            <p className="text-sm font-medium">{usedPercentage.toFixed(0)}%</p>
          </div>
          <Progress value={usedPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {usedCount} out of {totalCount} affirmations used
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
