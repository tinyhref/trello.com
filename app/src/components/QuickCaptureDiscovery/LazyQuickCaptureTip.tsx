import { Suspense, useEffect, useState } from 'react';

import { useOneTimeMessagesDismissed } from '@trello/business-logic-react/member';
import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useGetExperimentValue } from '@trello/feature-gate-client';
import { useLazyComponent } from '@trello/use-lazy-component';

import { TRELLO_UI_QUICK_CAPTURE_DISMISS_TIP } from './QuickCaptureTipPopover';
import { useIsEligibleForQuickCaptureDiscoveryTip } from './useIsEligibleForQuickCaptureDiscoveryTip';

export const LazyQuickCaptureTip = ({
  onPopoverVisibilityChange,
}: {
  onPopoverVisibilityChange: (isVisible: boolean) => void;
}) => {
  const [fireExposureEvent, setFireExposureEvent] = useState(false);
  const [showExperimentVariation, setShowExperimentVariation] = useState(false);

  const QuickCaptureTip = useLazyComponent(
    () =>
      import(/* webpackChunkName: "quick-capture-tip" */ './QuickCaptureTip'),
    { namedImport: 'QuickCaptureTip' },
  );

  const { isOneTimeMessageDismissed } = useOneTimeMessagesDismissed();

  const isEligibleForQuickCaptureDiscovery =
    useIsEligibleForQuickCaptureDiscoveryTip();

  const { cohort, loading } = useGetExperimentValue({
    experimentName: 'ghost_evergreen_quick_capture_tip',
    parameter: 'cohort',
    fireExposureEvent,
  });

  useEffect(() => {
    if (loading || cohort === 'not-enrolled') {
      return;
    }
    if (isEligibleForQuickCaptureDiscovery) {
      setFireExposureEvent(true);
      if (cohort === 'experiment') {
        setShowExperimentVariation(true);
      }
    }
  }, [cohort, loading, isEligibleForQuickCaptureDiscovery]);

  if (
    showExperimentVariation &&
    !isOneTimeMessageDismissed(TRELLO_UI_QUICK_CAPTURE_DISMISS_TIP)
  ) {
    return (
      <Suspense fallback={null}>
        <ChunkLoadErrorBoundary fallback={null}>
          <QuickCaptureTip
            onPopoverVisibilityChange={onPopoverVisibilityChange}
          />
        </ChunkLoadErrorBoundary>
      </Suspense>
    );
  }

  return null;
};
