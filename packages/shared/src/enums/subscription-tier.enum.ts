export enum SubscriptionTier {
  STARTER = 'STARTER',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

export const SUBSCRIPTION_TIER_LABELS: Record<SubscriptionTier, string> = {
  [SubscriptionTier.STARTER]: 'Starter',
  [SubscriptionTier.PRO]: 'Pro',
  [SubscriptionTier.ENTERPRISE]: 'Enterprise',
};
