
import { useState, useEffect, useCallback } from 'react';
import { UserPlan } from '../types';
import { getCurrentUser, fetchUserPlan, createDefaultPlan } from '../services/affirmationService';
import { useToast } from '@/hooks/use-toast';

export function usePlanStatus() {
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPlanDetails = useCallback(async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      
      if (!user) {
        setUserPlan(null);
        setLoading(false);
        return null;
      }
      
      // Fetch user plan
      let planData = await fetchUserPlan(user.id);
        
      // Create a default plan if none exists
      if (!planData) {
        try {
          planData = await createDefaultPlan(user.id);
        } catch (e: any) {
          console.error('Error creating default plan:', e.message);
          setLoading(false);
          return null;
        }
      }
      
      setUserPlan(planData);
      return planData;
    } catch (e: any) {
      console.error('Error fetching user plan:', e.message);
      setError(e.message);
      toast({
        variant: "destructive",
        title: "Error loading user plan",
        description: e.message,
        duration: 4000
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Check if user has reached their plan limit
  const hasReachedLimit = useCallback(() => {
    if (!userPlan) return false;
    return userPlan.affirmations_used >= userPlan.affirmations_limit;
  }, [userPlan]);

  // Initial fetch
  useEffect(() => {
    fetchPlanDetails();
  }, [fetchPlanDetails]);

  return {
    userPlan,
    loading,
    error,
    fetchPlanDetails,
    hasReachedLimit: hasReachedLimit()
  };
}
