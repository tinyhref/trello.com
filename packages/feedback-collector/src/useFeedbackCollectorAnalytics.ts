import { useCallback } from 'react';

import type { SourceType } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';

import type { EntrypointId } from './EntrypointId';

export const useFeedbackCollectorAnalytics = ({
  source,
  entrypointId,
}: {
  source: SourceType;
  entrypointId: EntrypointId;
}) => {
  const onSubmitAnalyticsEvent = useCallback(() => {
    Analytics.sendTrackEvent({
      action: 'submitted',
      actionSubject: 'feedback',
      actionSubjectId: 'feedbackCollectorModal',
      source,
      attributes: {
        entrypointId,
      },
    });
  }, [source, entrypointId]);
  const onCloseAnalyticsEvent = useCallback(() => {
    Analytics.sendClosedComponentEvent({
      componentType: 'feedback',
      componentName: 'feedbackCollectorModal',
      source,
      attributes: {
        entrypointId,
      },
    });
  }, [source, entrypointId]);
  return {
    onSubmitAnalyticsEvent,
    onCloseAnalyticsEvent,
  };
};
