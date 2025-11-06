import type { Credit } from './getFreeTrialProperties';

/**
 * Checks if there are any free trial credits in the set of credits.
 */
export const hasFreeTrialCredit = (credits: Credit[] = []) => {
  return credits.some((credit) => credit.type === 'freeTrial');
};
