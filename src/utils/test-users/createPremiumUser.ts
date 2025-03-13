
import { supabase } from "@/integrations/supabase/client";

/**
 * This utility creates a new test user with premium features.
 * It generates the user, sets up their plan, and adds sample affirmations.
 * 
 * @returns {Promise<Object>} Object containing login credentials and status
 */
export async function createPremiumTestUser() {
  console.log("Creating test premium user...");
  
  try {
    // Generate test email with timestamp to ensure uniqueness
    const timestamp = new Date().getTime();
    const email = `test.premium.${timestamp}@example.com`;
    const password = "testpassword123";
    
    // 1. Create a new user account
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (signUpError) {
      console.error("Error creating test user:", signUpError);
      return { success: false, error: signUpError };
    }
    
    const userId = authData.user?.id;
    
    if (!userId) {
      console.error("Failed to get user ID for newly created user");
      return { success: false, error: "No user ID returned" };
    }
    
    console.log("Created test user with ID:", userId);
    
    // 2. Create premium plan for the user
    const { error: planError } = await supabase
      .from('user_plans')
      .insert({
        user_id: userId,
        plan_type: 'premium',
        affirmations_limit: 999,
        affirmations_used: 15,
        updated_at: new Date().toISOString()
      });
      
    if (planError) {
      console.error("Error creating premium plan:", planError);
      return { 
        success: false, 
        error: planError,
        credentials: { email, password } // Return credentials anyway
      };
    }
    
    // 3. Generate sample affirmations
    const sampleAffirmations = [
      "I am capable of achieving my goals and dreams",
      "I radiate confidence, peace and strength",
      "I trust myself to make the right decisions",
      "Every day I am becoming a better version of myself",
      "I am worthy of love and respect"
    ];
    
    const affirmationEntries = [];
    
    // Create entries with staggered timestamps
    for (let i = 0; i < sampleAffirmations.length; i++) {
      const daysAgo = i % 5; // Spread over 5 days
      const hoursAgo = (i * 3) % 24; // Spread throughout the day
      
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - daysAgo);
      timestamp.setHours(timestamp.getHours() - hoursAgo);
      
      affirmationEntries.push({
        user_id: userId,
        affirmation: sampleAffirmations[i],
        plan_type: 'premium',
        is_favorite: i % 2 === 0, // Every other affirmation is a favorite
        created_at: timestamp.toISOString()
      });
    }
    
    // Insert the affirmations
    const { error: affirmationError } = await supabase
      .from('user_affirmations')
      .insert(affirmationEntries);
      
    if (affirmationError) {
      console.error("Error creating mock affirmations:", affirmationError);
      // Continue anyway, not critical
    }
    
    // 4. Return the credentials for login
    return {
      success: true,
      credentials: {
        email,
        password
      },
      message: "Premium test user created successfully",
      user: {
        id: userId,
        email
      }
    };
    
  } catch (error) {
    console.error("Error generating premium test user:", error);
    return {
      success: false,
      error
    };
  }
}
