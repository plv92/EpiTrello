// Subscription utilities
// For now, we'll return false (no pro subscription)
// This can be extended later with Stripe integration

export const checkSubscription = async (): Promise<boolean> => {
  // TODO: Implement Stripe subscription check
  // For now, return false (free tier)
  return false;
};
