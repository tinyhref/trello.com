import type { FunctionComponent } from 'react';
import { Suspense, useCallback, useEffect, useState } from 'react';

import type { SourceType } from '@trello/analytics-types';
import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { Key } from '@trello/keybindings';
import { currentLocale } from '@trello/locale';

import type { EntrypointId } from './EntrypointId';
import type { AkFeedbackCollectorProps } from './FeedbackCollector';
import { showFeedbackFlag } from './showFeedbackFlag';
import { useAdditionalFields } from './useAdditionalFields';
import { useFeedbackCollectorAnalytics } from './useFeedbackCollectorAnalytics';
import { useLazyFeedbackCollector } from './useLazyFeedbackCollector';

export const useFeedbackCollector = ({
  entrypointId,
  source,
  feedbackCollectorProps,
  attributes,
  getFeedbackContextOverride,
  onClose,
}: {
  entrypointId: EntrypointId;
  source: SourceType;
  feedbackCollectorProps: Partial<AkFeedbackCollectorProps>;
  attributes?: Record<string, string>;
  // Returns string (which is generally stringified JSON)
  getFeedbackContextOverride?: () => string;
  onClose?: () => void;
}): {
  FeedbackCollector: FunctionComponent;
  showFeedbackCollector: () => void;
} => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackContextOverride, setFeedbackContextOverride] = useState<
    string | undefined
  >(undefined);
  const { onCloseAnalyticsEvent, onSubmitAnalyticsEvent } =
    useFeedbackCollectorAnalytics({ source, entrypointId });
  const LazyFeedbackCollector = useLazyFeedbackCollector({ preload: isOpen });

  const onCloseCollector = useCallback(() => {
    onCloseAnalyticsEvent();
    setIsOpen(false);
    setFeedbackContextOverride(undefined);
    onClose?.();
  }, [onClose, onCloseAnalyticsEvent]);

  const onSubmit = useCallback(() => {
    onSubmitAnalyticsEvent();
    showFeedbackFlag({ id: 'feedbackCollectorSuccessFlag' });
    setIsOpen(false);
    setFeedbackContextOverride(undefined);
  }, [onSubmitAnalyticsEvent]);

  const handleEscapePress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === Key.Escape && isOpen) {
        onCloseCollector();
      }
    },
    [onCloseCollector, isOpen],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleEscapePress);
    return () => {
      document.removeEventListener('keydown', handleEscapePress);
    };
  }, [handleEscapePress]);

  useEffect(() => {
    // When the feedback collector is opened, fetch attributes via overrides
    // if one exists
    if (isOpen && getFeedbackContextOverride) {
      setFeedbackContextOverride(getFeedbackContextOverride());
    }
  }, [isOpen, getFeedbackContextOverride]);

  const additionalFields = useAdditionalFields({
    contextAttributes: attributes,
    contextOverride: feedbackContextOverride,
    entrypointId,
  });

  const renderFeedbackCollector = useCallback(
    () =>
      isOpen ? (
        <ChunkLoadErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <LazyFeedbackCollector
              {...feedbackCollectorProps}
              onClose={onCloseCollector}
              onSubmit={onSubmit}
              entrypointId={entrypointId}
              showTypeField={false}
              additionalFields={additionalFields}
              locale={currentLocale}
            />
          </Suspense>
        </ChunkLoadErrorBoundary>
      ) : null,
    [
      LazyFeedbackCollector,
      isOpen,
      additionalFields,
      entrypointId,
      onCloseCollector,
      onSubmit,
      feedbackCollectorProps,
    ],
  );

  const showFeedbackCollector = useCallback((): void => {
    setIsOpen(true);
  }, []);

  return {
    FeedbackCollector: renderFeedbackCollector,
    showFeedbackCollector,
  };
};
