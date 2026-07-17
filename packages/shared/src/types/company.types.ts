import type { SubscriptionTier } from '../enums/subscription-tier.enum';

export interface Company {
  id: string;
  name: string;
  taxId: string;
  country: string;
  subscriptionTier: SubscriptionTier;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
