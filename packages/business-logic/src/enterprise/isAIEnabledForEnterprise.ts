import type { Enterprise } from '@trello/model-types';

/**
 * Determines if a member is an admin of an enterprise
 */
export const isAIEnabledForEnterprise = (enterprise: {
  aiPrefs?: {
    atlassianIntelligenceEnabled?:
      | Enterprise['aiPrefs']['atlassianIntelligenceEnabled']
      | null;
  } | null;
}): boolean => {
  return enterprise.aiPrefs?.atlassianIntelligenceEnabled ?? false;
};
