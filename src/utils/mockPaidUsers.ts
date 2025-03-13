
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

/**
 * This utility helps to generate mock data for testing paid users.
 * It updates user plans to Pro or Premium status and adds sample affirmations.
 * 
 * Usage:
 * Import this function and call it from your browser console:
 * 
 * import { generateMockPaidUsers } from "@/utils/mockPaidUsers";
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

// Console helper function
export function setupMockDataHelper() {
  // @ts-ignore - Adding to window for console access
  window.generateMockPaidUsers = generateMockPaidUsers;
  window.createPremiumTestUser = createPremiumTestUser;
  console.log("Mock data helpers are ready! Run one of the following in console:");
  console.log("1. window.createPremiumTestUser() - Creates a new premium test user and returns login credentials");
  console.log("2. window.generateMockPaidUsers() - Upgrades current user to premium");
}

// Uncomment to auto-setup when imported
// setupMockDataHelper();
