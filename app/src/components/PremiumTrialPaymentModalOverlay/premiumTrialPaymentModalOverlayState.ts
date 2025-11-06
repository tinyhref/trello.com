import { SharedState } from '@trello/shared-state';

export interface PremiumTrialPaymentModalOverlayState {
  isVisible: boolean;
}

export const premiumTrialPaymentModalOverlayState = new SharedState({
  isVisible: false,
});
