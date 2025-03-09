
import { useAffirmationManager } from './hooks/useAffirmationManager';
import { usePlanStatus } from './hooks/usePlanStatus';

export function useUserAffirmations() {
  const { userPlan, hasReachedLimit } = usePlanStatus();
  const {
    userAffirmations,
    favoriteAffirmations,
    loading,
    error,
    saveAffirmation,
    toggleFavorite,
    fetchUserAffirmations
  } = useAffirmationManager();
  
  return {
    userAffirmations,
    favoriteAffirmations,
    userPlan,
    loading,
    error,
    saveAffirmation,
    toggleFavorite,
    fetchUserAffirmations,
    hasReachedLimit
  };
}
