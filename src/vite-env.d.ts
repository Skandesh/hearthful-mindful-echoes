
/// <reference types="vite/client" />

interface Window {
  generateMockPaidUsers: () => Promise<any>;
  createPremiumTestUser: () => Promise<any>;
}
