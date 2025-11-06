import type { Organization } from '@trello/model-types';

/**
 * Checks if AI is enabled for a premium organization
 */
export const isAIEnabledForPremOrganization = (organization: {
  prefs?: {
    atlassianIntelligenceEnabled?:
      | Organization['prefs']['atlassianIntelligenceEnabled']
      | null;
  };
}): boolean => {
  return organization?.prefs?.atlassianIntelligenceEnabled ?? false;
};
