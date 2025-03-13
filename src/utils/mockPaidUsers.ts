
// This file now re-exports all functionality from the refactored modules
// for backward compatibility
export { 
  createPremiumTestUser,
  generateMockPaidUsers,
  setupMockDataHelper
} from "./test-users";

// Uncomment to auto-setup when imported
// setupMockDataHelper();
