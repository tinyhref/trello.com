import { useCallback } from 'react';

import { useDynamicConfig } from '@trello/dynamic-config';
import { useSharedStateSelector } from '@trello/shared-state';

import type { Facet, FeatureNames } from './featuresInfo';
import { featuresInfo } from './featuresInfo';
import { feedbackCollectorSharedState } from './feedbackCollectorSharedState';

interface UseFeedbackCollectorProps {
  featureName: FeatureNames;
}

interface GetAnalyticsAttributesOptions {
  numNegativeFacets?: number;
  fullyPositive?: boolean;
  fullyNegative?: boolean;
  numInBatch?: number;
}

interface UseFeedbackCollectorReturn {
  getAnalyticsAttributes: (
    options?: GetAnalyticsAttributesOptions,
  ) => Record<string, number | string>;
  negativeFacets: Facet[];
  getFeedbackCollectorProjectKey: () => string;
  isOpen: boolean;
  traceId?: string;
  setTraceId: (traceId: string) => void;
  showFeedbackCollector: () => void;
  hideFeedbackCollector: () => void;
}

const getSentimentModifier = (
  featureName: FeatureNames,
  numNegativeFacets?: number,
): number => {
  //count up the number of negative facets for the feature, and return a negative modifier for the number of negative facets
  //observed in this way

  if (!numNegativeFacets) {
    return 1; //default - when there are no negative facets observed, we assume wholly positive sentiment
  }

  const featureNegativeFacetsCount =
    featuresInfo[featureName]?.negativeFacets.length === 0
      ? 1
      : featuresInfo[featureName]?.negativeFacets.length;
  return ((numNegativeFacets ?? 1) / featureNegativeFacetsCount) * -1;
};

/**
 * Custom hook to expose any information or methods that might be needed to funnel information to the feedback collector.
 * @param featureName - The feature name for which feedback is collected.Currently, this must be one of the keys in `featuresInfo`.
 * @example
 * const { getAnalyticsAttributes, negativeFacets } = useFeedbackCollector({ featureName: 'smartScheduling' });
 * @returns An object containing a method to get the analytics attributes, as well as negative facets for the feature.
 */
export const useFeedbackCollector = ({
  featureName,
}: UseFeedbackCollectorProps): UseFeedbackCollectorReturn => {
  const isInternalAtlassian = useDynamicConfig('trello_web_atlassian_team');

  /**
   * A method to get the attributes to be used in the attributes object of an analytics event that needs to send information to the feedback collector.
   * @param options - Object containing optional properties to modify the sentiment modifier
   * @param options.numNegativeFacets - The number of negative facets considered true for the feature based on the current flow. If not provided, the code will use a default value of 1.
   * @param options.fullyPositive - If true, the sentiment modifier will be set to 1.
   * @param options.fullyNegative - If true, the sentiment modifier will be set to -1.
   * @param options.numInBatch - The number of items in the batch. If provided, the sentiment modifier will be multiplied by this value before being returned.
   * @example
   * const { getAnalyticsAttributes } = useFeedbackCollector({ featureName: 'smartScheduling' });
   * const attributes = getAnalyticsAttributes({ numNegativeFacets: 3, numInBatch: 10 });
   * @returns Analytics attributes to be used in the attributes object of an analytics event
   */
  const getAnalyticsAttributes = (
    options?: GetAnalyticsAttributesOptions,
  ): Record<string, number | string> => {
    if (!isInternalAtlassian) {
      return {};
    }

    const multiplier = options?.numInBatch ?? 1;

    if (options?.fullyPositive) {
      return {
        aiLabsFeatureName: featureName,
        aiLabsSentimentModifier: 1 * multiplier,
      };
    }

    if (options?.fullyNegative) {
      return {
        aiLabsFeatureName: featureName,
        aiLabsSentimentModifier: -1 * multiplier,
      };
    }

    return {
      aiLabsFeatureName: featureName,
      aiLabsSentimentModifier:
        getSentimentModifier(featureName, options?.numNegativeFacets) *
        multiplier,
    };
  };

  const negativeFacets = featuresInfo[featureName]?.negativeFacets || [];

  /**
   * A method to get the project key to be used in the feedback collector for freeform feedback, to properly track the feedback for the feature.
   * @returns The project key for the feature.
   */
  const getFeedbackCollectorProjectKey = (): string => {
    switch (featureName) {
      case 'smartScheduling':
        return 'project-key: smart-schedule';
      default:
        return 'project-key: global';
    }
  };

  const showFeedbackCollector = useCallback(() => {
    feedbackCollectorSharedState.setValue({ isOpen: true });
  }, []);

  const hideFeedbackCollector = useCallback(() => {
    feedbackCollectorSharedState.setValue({ isOpen: false });
  }, []);

  const isOpen = useSharedStateSelector(
    feedbackCollectorSharedState,
    (state) => state.isOpen,
  );

  const traceId = useSharedStateSelector(
    feedbackCollectorSharedState,
    (state) => state.traceId,
  );

  const setTraceId = useCallback((analyticsTraceId: string) => {
    feedbackCollectorSharedState.setValue({ traceId: analyticsTraceId });
  }, []);

  return {
    getAnalyticsAttributes,
    negativeFacets,
    getFeedbackCollectorProjectKey,
    isOpen,
    traceId,
    setTraceId,
    showFeedbackCollector,
    hideFeedbackCollector,
  };
};
