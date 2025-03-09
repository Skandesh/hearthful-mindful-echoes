
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserAffirmation, UserPlan } from './types';

export function useUserAffirmations() {
  const [userAffirmations, setUserAffirmations] = useState<UserAffirmation[]>([]);
  const [favoriteAffirmations, setFavoriteAffirmations] = useState<UserAffirmation[]>([]);
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Get the current user
  const getCurrentUser = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error.message);
      return null;
    }
    return session?.user ?? null;
  };

  // Helper function to ensure plan_type is one of our valid types
  const validatePlanType = (planType: string): 'free' | 'pro' | 'premium' => {
    if (planType === 'free' || planType === 'pro' || planType === 'premium') {
      return planType;
    }
    // Default to 'free' if the plan type is not recognized
    return 'free';
  };
  
  // Fetch user affirmations
  const fetchUserAffirmations = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const user = await getCurrentUser();
    
    if (!user) {
      setUserAffirmations([]);
      setFavoriteAffirmations([]);
      setUserPlan(null);
      setLoading(false);
      return;
    }
    
    try {
      // Fetch all affirmations for this user
      const { data, error } = await supabase
        .from('user_affirmations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        setError(error.message);
        toast({
          variant: "destructive",
          title: "Error loading affirmations",
          description: error.message,
          duration: 4000
        });
      } else {
        // Map database results to our type with validated plan_type
        const typedAffirmations: UserAffirmation[] = (data || []).map(item => ({
          ...item,
          plan_type: validatePlanType(item.plan_type)
        })) as UserAffirmation[];
        
        setUserAffirmations(typedAffirmations);
        setFavoriteAffirmations(typedAffirmations.filter(a => a.is_favorite));
      }
      
      // Fetch user plan
      const { data: planData, error: planError } = await supabase
        .from('user_plans')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (planError) {
        setError(planError.message);
        toast({
          variant: "destructive",
          title: "Error loading user plan",
          description: planError.message,
          duration: 4000
        });
      } else if (planData) {
        // Convert the plan data to our UserPlan type with validated plan_type
        setUserPlan({
          ...planData,
          plan_type: validatePlanType(planData.plan_type)
        } as UserPlan);
      } else {
        // Create a default plan if none exists
        const { data: newPlan, error: newPlanError } = await supabase
          .from('user_plans')
          .insert({
            user_id: user.id,
            plan_type: 'free',
            affirmations_limit: 10,
            affirmations_used: 0
          })
          .select('*')
          .single();
          
        if (newPlanError) {
          console.error('Error creating default plan:', newPlanError.message);
        } else if (newPlan) {
          setUserPlan({
            ...newPlan,
            plan_type: validatePlanType(newPlan.plan_type)
          } as UserPlan);
        }
      }
    } catch (e: any) {
      console.error('Error in fetchUserAffirmations:', e.message);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);
  
  // Save a new affirmation to the database
  const saveAffirmation = useCallback(async (affirmation: string) => {
    const user = await getCurrentUser();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not signed in",
        description: "You need to be signed in to save affirmations.",
        duration: 4000
      });
      return false;
    }
    
    // Check if user has reached the limit
    if (userPlan && userPlan.affirmations_used >= userPlan.affirmations_limit && userPlan.plan_type === 'free') {
      toast({
        variant: "destructive",
        title: "Free trial limit reached",
        description: "You've reached your limit of 10 affirmations. Upgrade to continue.",
        duration: 5000
      });
      return false;
    }
    
    try {
      // Insert the affirmation
      const { error } = await supabase
        .from('user_affirmations')
        .insert({
          user_id: user.id,
          affirmation,
          plan_type: userPlan?.plan_type || 'free'
        });
        
      if (error) {
        toast({
          variant: "destructive",
          title: "Error saving affirmation",
          description: error.message,
          duration: 4000
        });
        return false;
      }
      
      // Increment the counter using our function
      const { error: functionError } = await supabase.rpc('increment_affirmations_used', {
        user_uuid: user.id
      });
      
      if (functionError) {
        console.error('Error incrementing affirmation count:', functionError);
      }
      
      await fetchUserAffirmations();
      
      // Display success message
      toast({
        title: "Affirmation Saved",
        description: "Your affirmation has been saved to your account",
        duration: 2000
      });
      
      return true;
    } catch (e: any) {
      console.error('Error in saveAffirmation:', e.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: e.message || "An error occurred while saving the affirmation",
        duration: 4000
      });
      return false;
    }
  }, [fetchUserAffirmations, toast, userPlan]);
  
  // Toggle favorite status
  const toggleFavorite = useCallback(async (affirmationId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('user_affirmations')
        .update({ is_favorite: !currentStatus })
        .eq('id', affirmationId);
        
      if (error) {
        toast({
          variant: "destructive",
          title: "Error updating favorite status",
          description: error.message,
          duration: 4000
        });
        return;
      }
      
      await fetchUserAffirmations();
      
      toast({
        title: !currentStatus ? "Added to Favorites" : "Removed from Favorites",
        description: !currentStatus 
          ? "This affirmation has been added to your favorites" 
          : "This affirmation has been removed from your favorites",
        duration: 2000
      });
    } catch (e: any) {
      console.error('Error in toggleFavorite:', e.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: e.message || "An error occurred while updating favorite status",
        duration: 4000
      });
    }
  }, [fetchUserAffirmations, toast]);
  
  // Initial fetch
  useEffect(() => {
    fetchUserAffirmations();
  }, [fetchUserAffirmations]);
  
  return {
    userAffirmations,
    favoriteAffirmations,
    userPlan,
    loading,
    error,
    saveAffirmation,
    toggleFavorite,
    fetchUserAffirmations,
    hasReachedLimit: userPlan ? userPlan.affirmations_used >= userPlan.affirmations_limit : false
  };
}
