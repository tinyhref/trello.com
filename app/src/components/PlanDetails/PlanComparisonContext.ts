import { createContext } from 'react';

import type { ProductId } from '@trello/paid-account';

import type { BillingQuotes } from './types';

export interface PlanComparisonContextProps {
  variation:
    | 'billing-page'
    | 'downgrade-plan-overlay'
    | 'end-of-trial-friction-overlay'
    | 'reverse-trial-overlay';
  billingQuote?: BillingQuotes;
  onChooseFree?: () => void;
  onChooseStandard?: (productCode: ProductId) => void;
  onChoosePremium?: (productCode: ProductId) => void;
}

export const PlanComparisonContext = createContext<PlanComparisonContextProps>({
  variation: 'billing-page',
  billingQuote: {} as BillingQuotes,
  onChooseFree: () => null,
  onChooseStandard: () => null,
  onChoosePremium: () => null,
});
