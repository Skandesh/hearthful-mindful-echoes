
import React from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Heart, Calendar, BarChart4, TrendingUp, Clock } from "lucide-react";
import { useAuthState } from "@/components/chat/useAuthState";
import { usePlanStatus } from "@/components/chat/hooks/usePlanStatus";
import { useAnalytics } from "@/components/dashboard/hooks/useAnalytics";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { DayDistributionChart } from "@/components/dashboard/DayDistributionChart";
import { PlanUsageCard } from "@/components/dashboard/PlanUsageCard";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuthState();
  const { userPlan, loading: planLoading } = usePlanStatus();
  const { analyticsData, loading: analyticsLoading, error } = useAnalytics();
  const navigate = useNavigate();

  const isLoading = authLoading || planLoading || analyticsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="container max-w-7xl mx-auto pt-24 pb-16 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground">Your Dashboard</h1>
        <Button onClick={() => navigate("/app")} className="bg-primary">
          Go to App
        </Button>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 text-red-500 rounded-md">
          Error loading analytics: {error}
        </div>
      ) : !analyticsData ? (
        <div className="text-center py-8">No analytics data available</div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total Affirmations"
              value={analyticsData.totalAffirmations}
              icon={<Activity />}
              description="All time"
            />
            <StatCard
              title="Favorites"
              value={`${analyticsData.favoriteStats.count} (${analyticsData.favoriteStats.percentage.toFixed(0)}%)`}
              icon={<Heart />}
              description="Saved as favorites"
            />
            <StatCard
              title="Most Active Day"
              value={analyticsData.mostActiveDay}
              icon={<Calendar />}
              description="Day with most activity"
            />
            <StatCard
              title="Plan Usage"
              value={`${analyticsData.planUsagePercentage.toFixed(0)}%`}
              icon={<BarChart4 />}
              description={`${userPlan?.plan_type.toUpperCase()} Plan`}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <ActivityChart
              data={analyticsData.recentActivity}
              title="Recent Activity (Last 14 Days)"
            />
            <DayDistributionChart
              data={analyticsData.affirmationsByDay}
              title="Activity by Day of Week"
            />
          </div>

          {/* Plan Usage */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <PlanUsageCard
              usedPercentage={analyticsData.planUsagePercentage}
              planType={userPlan?.plan_type || 'free'}
              usedCount={userPlan?.affirmations_used || 0}
              totalCount={userPlan?.affirmations_limit || 10}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
