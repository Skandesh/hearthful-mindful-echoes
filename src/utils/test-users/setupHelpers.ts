
import { createPremiumTestUser } from "./createPremiumUser";
import { generateMockPaidUsers } from "./generateMockData";

/**
 * Sets up helper functions in the global window object for easy access from console
 */
export function setupMockDataHelper() {
  // @ts-ignore - Adding to window for console access
  window.generateMockPaidUsers = generateMockPaidUsers;
  window.createPremiumTestUser = createPremiumTestUser;
  console.log("Mock data helpers are ready! Run one of the following in console:");
  console.log("1. window.createPremiumTestUser() - Creates a new premium test user and returns login credentials");
  console.log("2. window.generateMockPaidUsers() - Upgrades current user to premium");
}
