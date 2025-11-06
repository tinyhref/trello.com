import type { FunctionComponent } from 'react';
import { Suspense, useEffect, useState } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useRecentlyUsedFeaturePreloader } from '@trello/recently-used-feature-preloader';
import { useSharedState } from '@trello/shared-state';
import { SuspendedComponent } from '@trello/use-lazy-component';

import { LabelsPopoverState } from './LabelsPopoverState';

/**
 * Lazy wrapper around the LabelsPopover. Defers the initial component bundle
 * download as long as possible by rendering an indefinitely suspended component
 * until the first time the component has ever been opened, or preloaded.
 */
export const LazyLegacyLabelsPopover: FunctionComponent = () => {
  const [{ isOpen }] = useSharedState(LabelsPopoverState);

  /**
   * shouldRender will be true if the popover has ever been opened or preloaded.
   * Allows us to delay rendering as long as possible.
   */
  const [shouldRender, setShouldRender] = useState(false);

  const [LegacyLabelsPopover, trackFeatureUsage] =
    useRecentlyUsedFeaturePreloader({
      featureName: 'LegacyLabelsPopover',
      useLazyComponentArgs: [
        () =>
          import(
            /* webpackChunkName: "legacy-labels-popover" */ './LegacyLabelsPopover'
          ),
        { namedImport: 'LegacyLabelsPopover' },
      ],
      onPreloadedCallback: () => setShouldRender(true),
    });

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      trackFeatureUsage();
    }
  }, [isOpen, setShouldRender, trackFeatureUsage]);

  return (
    <ErrorBoundary
      tags={{ ownershipArea: 'trello-web-eng', feature: 'Labels Popover' }}
    >
      <ChunkLoadErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          {shouldRender ? <LegacyLabelsPopover /> : <SuspendedComponent />}
        </Suspense>
      </ChunkLoadErrorBoundary>
    </ErrorBoundary>
  );
};
