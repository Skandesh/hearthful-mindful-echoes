
import { supabase } from '@/integrations/supabase/client';
import { UserAffirmation, UserPlan } from '../types';

// Helper function to ensure plan_type is one of our valid types
export const validatePlanType = (planType: string): 'free' | 'pro' | 'premium' => {
  if (planType === 'free' || planType === 'pro' || planType === 'premium') {
    return planType;
  }
  // Default to 'free' if the plan type is not recognized
  return 'free';
};

// Get the current authenticated user
export const getCurrentUser = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error.message);
    return null;
  }
  return session?.user ?? null;
};

// Fetch user affirmations from Supabase
export const fetchAffirmations = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_affirmations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) {
    throw new Error(error.message);
  }
  
  // Map database results to our type with validated plan_type
  return (data || []).map(item => ({
    ...item,
    plan_type: validatePlanType(item.plan_type)
  })) as UserAffirmation[];
};

// Fetch user plan from Supabase
export const fetchUserPlan = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_plans')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
    
  if (error) {
    throw new Error(error.message);
  }
  
  return data ? {
    ...data,
    plan_type: validatePlanType(data.plan_type)
  } as UserPlan : null;
};

// Create a default plan for a new user
export const createDefaultPlan = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_plans')
    .insert({
      user_id: userId,
      plan_type: 'free',
      affirmations_limit: 10,
      affirmations_used: 0
    })
    .select('*')
    .single();
    
  if (error) {
    throw new Error(error.message);
  }
  
  return {
    ...data,
    plan_type: validatePlanType(data.plan_type)
  } as UserPlan;
};

// Save a new affirmation
export const saveAffirmationToDb = async (userId: string, affirmation: string, planType: string) => {
  const { error } = await supabase
    .from('user_affirmations')
    .insert({
      user_id: userId,
      affirmation,
      plan_type: planType || 'free'
    });
    
  if (error) {
    throw new Error(error.message);
  }
  
  // Increment the counter using our function
  const { error: functionError } = await supabase.rpc('increment_affirmations_used', {
    user_uuid: userId
  });
  
  if (functionError) {
    console.error('Error incrementing affirmation count:', functionError);
  }
  
  return true;
};

// Toggle favorite status for an affirmation
export const toggleFavoriteStatus = async (affirmationId: string, currentStatus: boolean) => {
  const { error } = await supabase
    .from('user_affirmations')
    .update({ is_favorite: !currentStatus })
    .eq('id', affirmationId);
    
  if (error) {
    throw new Error(error.message);
  }
  
  return true;
};
