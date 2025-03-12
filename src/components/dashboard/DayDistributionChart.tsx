
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { AffirmationsByDay } from "./hooks/useAnalytics";

interface DayDistributionChartProps {
  data: AffirmationsByDay[];
  title: string;
}

export function DayDistributionChart({ data, title }: DayDistributionChartProps) {
  // Sort data by days of week
  const daysOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const sortedData = [...data].sort((a, b) => 
    daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day)
  );
  
  return (
    <Card className="col-span-1">
      <CardHeader className="pb-0">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value.substring(0, 3)} // Show only first 3 letters
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value: number) => [`${value} affirmation(s)`, 'Count']}
                labelFormatter={(label) => `Day: ${label}`}
              />
              <Bar 
                dataKey="count" 
                fill="#8884d8" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
