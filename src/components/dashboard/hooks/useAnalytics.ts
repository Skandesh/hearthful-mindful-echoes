
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser } from '@/components/chat/services/affirmationService';

export interface AffirmationStat {
  date: string;
  count: number;
}

export interface AffirmationsByDay {
  day: string;
  count: number;
}

export interface FavoriteStat {
  count: number;
  percentage: number;
}

export interface AnalyticsData {
  totalAffirmations: number;
  favoriteStats: FavoriteStat;
  recentActivity: AffirmationStat[];
  affirmationsByDay: AffirmationsByDay[];
  planUsagePercentage: number;
  mostActiveDay: string;
}

export function useAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const user = await getCurrentUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch total affirmations
      const { data: affirmationData, error: affirmationError } = await supabase
        .from('user_affirmations')
        .select('*')
        .eq('user_id', user.id);

      if (affirmationError) {
        throw new Error(affirmationError.message);
      }

      // Fetch user plan data
      const { data: planData, error: planError } = await supabase
        .from('user_plans')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (planError && planError.code !== 'PGRST116') {
        throw new Error(planError.message);
      }

      // Process data
      const totalAffirmations = affirmationData?.length || 0;
      const favoriteAffirmations = affirmationData?.filter(a => a.is_favorite).length || 0;
      const favoritePercentage = totalAffirmations > 0 
        ? (favoriteAffirmations / totalAffirmations) * 100 
        : 0;
      
      // Get recent activity (last 14 days)
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      
      const recentActivity: AffirmationStat[] = [];
      for (let i = 0; i < 14; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const formattedDate = date.toISOString().split('T')[0];
        
        const count = affirmationData?.filter(a => {
          return a.created_at.split('T')[0] === formattedDate;
        }).length || 0;
        
        recentActivity.unshift({ date: formattedDate, count });
      }

      // Affirmations by day of week
      const dayMap: {[key: number]: string} = {
        0: 'Sunday',
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday'
      };
      
      const dayCount: {[key: string]: number} = {
        'Sunday': 0,
        'Monday': 0,
        'Tuesday': 0,
        'Wednesday': 0,
        'Thursday': 0,
        'Friday': 0,
        'Saturday': 0
      };
      
      affirmationData?.forEach(a => {
        const date = new Date(a.created_at);
        const day = dayMap[date.getDay()];
        dayCount[day]++;
      });
      
      const affirmationsByDay = Object.entries(dayCount).map(([day, count]) => ({ day, count }));
      
      // Find most active day
      let maxCount = 0;
      let mostActiveDay = 'None';
      
      Object.entries(dayCount).forEach(([day, count]) => {
        if (count > maxCount) {
          maxCount = count;
          mostActiveDay = day;
        }
      });
      
      // Calculate plan usage percentage
      const planUsagePercentage = planData
        ? (planData.affirmations_used / planData.affirmations_limit) * 100
        : 0;

      // Combine all data
      const analytics: AnalyticsData = {
        totalAffirmations,
        favoriteStats: {
          count: favoriteAffirmations,
          percentage: favoritePercentage
        },
        recentActivity,
        affirmationsByDay,
        planUsagePercentage: Math.min(planUsagePercentage, 100), // Cap at 100%
        mostActiveDay: maxCount > 0 ? mostActiveDay : 'None'
      };
      
      setAnalyticsData(analytics);
    } catch (e: any) {
      console.error('Error fetching analytics data:', e.message);
      setError(e.message);
      toast({
        variant: "destructive",
        title: "Error loading analytics",
        description: e.message,
        duration: 4000
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Initial fetch
  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  return {
    analyticsData,
    loading,
    error,
    refetch: fetchAnalyticsData
  };
}
