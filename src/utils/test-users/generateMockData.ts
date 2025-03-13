
import { supabase } from "@/integrations/supabase/client";

/**
 * This utility helps to generate mock data for testing paid users.
 * It updates user plans to Pro or Premium status and adds sample affirmations.
 * 
 * Usage:
 * Import this function and call it from your browser console:
 * 
 * import { generateMockPaidUsers } from "@/utils/test-users";
 * await generateMockPaidUsers();
 */
export async function generateMockPaidUsers() {
  console.log("Creating mock paid users data...");
  
  try {
    // 1. First, get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("No authenticated user found. Please log in first.");
      return;
    }
    
    // 2. Update current user's plan to Premium
    const { error: planError } = await supabase
      .from('user_plans')
      .upsert({
        user_id: user.id,
        plan_type: 'premium',
        affirmations_limit: 999,
        affirmations_used: 15,
        updated_at: new Date().toISOString()
      });
      
    if (planError) {
      console.error("Error upgrading user plan:", planError);
      return;
    }
    
    // 3. Generate sample affirmations with different timestamps
    const sampleAffirmations = [
      "I am capable of achieving my goals and dreams",
      "I radiate confidence, peace and strength",
      "I trust myself to make the right decisions",
      "Every day I am becoming a better version of myself",
      "I am worthy of love and respect",
      "My positive thoughts create positive feelings",
      "I am in charge of how I feel today",
      "I have the power to create change",
      "I believe in myself and my abilities",
      "I am enough just as I am"
    ];
    
    const affirmationEntries = [];
    
    // Create entries with staggered timestamps over the past week
    for (let i = 0; i < sampleAffirmations.length; i++) {
      const daysAgo = i % 7; // Spread over a week
      const hoursAgo = (i * 2) % 24; // Spread throughout the day
      
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - daysAgo);
      timestamp.setHours(timestamp.getHours() - hoursAgo);
      
      affirmationEntries.push({
        user_id: user.id,
        affirmation: sampleAffirmations[i],
        plan_type: i % 2 === 0 ? 'premium' : 'pro',
        is_favorite: i % 3 === 0, // Every third affirmation is a favorite
        created_at: timestamp.toISOString(),
        updated_at: timestamp.toISOString()
      });
    }
    
    // Insert the affirmations
    const { error: affirmationError } = await supabase
      .from('user_affirmations')
      .upsert(affirmationEntries);
      
    if (affirmationError) {
      console.error("Error creating mock affirmations:", affirmationError);
      return;
    }
    
    console.log("Mock paid user data created successfully!");
    console.log(`Added ${affirmationEntries.length} affirmations`);
    console.log("User plan upgraded to Premium");
    
    return {
      success: true,
      affirmationsAdded: affirmationEntries.length
    };
    
  } catch (error) {
    console.error("Error generating mock data:", error);
    return {
      success: false,
      error
    };
  }
}
