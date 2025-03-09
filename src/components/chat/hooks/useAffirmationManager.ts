
import { useState, useEffect, useCallback } from 'react';
import { UserAffirmation } from '../types';
import { getCurrentUser, fetchAffirmations, saveAffirmationToDb, toggleFavoriteStatus } from '../services/affirmationService';
import { usePlanStatus } from './usePlanStatus';
import { useToast } from '@/hooks/use-toast';

export function useAffirmationManager() {
  const [userAffirmations, setUserAffirmations] = useState<UserAffirmation[]>([]);
  const [favoriteAffirmations, setFavoriteAffirmations] = useState<UserAffirmation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const { userPlan, hasReachedLimit, fetchPlanDetails } = usePlanStatus();
  
  // Fetch user affirmations
  const fetchUserAffirmations = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const user = await getCurrentUser();
    
    if (!user) {
      setUserAffirmations([]);
      setFavoriteAffirmations([]);
      setLoading(false);
      return;
    }
    
    try {
      // Fetch all affirmations for this user
      const affirmations = await fetchAffirmations(user.id);
      
      setUserAffirmations(affirmations);
      setFavoriteAffirmations(affirmations.filter(a => a.is_favorite));
    } catch (e: any) {
      console.error('Error in fetchUserAffirmations:', e.message);
      setError(e.message);
      toast({
        variant: "destructive",
        title: "Error loading affirmations",
        description: e.message,
        duration: 4000
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);
  
  // Save a new affirmation
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
    if (hasReachedLimit && userPlan?.plan_type === 'free') {
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
      await saveAffirmationToDb(user.id, affirmation, userPlan?.plan_type || 'free');
      
      // Refresh data
      await fetchUserAffirmations();
      await fetchPlanDetails();
      
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
  }, [fetchUserAffirmations, fetchPlanDetails, toast, userPlan, hasReachedLimit]);
  
  // Toggle favorite status
  const toggleFavorite = useCallback(async (affirmationId: string, currentStatus: boolean) => {
    try {
      await toggleFavoriteStatus(affirmationId, currentStatus);
      
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
    loading,
    error,
    saveAffirmation,
    toggleFavorite,
    fetchUserAffirmations,
    hasReachedLimit
  };
}
