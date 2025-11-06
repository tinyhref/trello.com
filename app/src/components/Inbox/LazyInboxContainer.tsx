import { useCallback, type FunctionComponent } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useFeatureGate } from '@trello/feature-gate-client';
import { UFOSuspense } from '@trello/ufo';
import { useLazyComponent } from '@trello/use-lazy-component';

import { InboxSkeleton } from './InboxSkeleton';
import { StubInbox } from './StubInbox';
import { useInboxVitalStats } from './useInboxVitalStats';
import { viewInboxVitalStatsSharedState } from './viewInboxVitalStatsSharedState';

export const LazyInboxContainer: FunctionComponent = () => {
  const InboxContainer = useLazyComponent(
    () => import(/* webpackChunkName: "inbox-container" */ './InboxContainer'),
    { namedImport: 'InboxContainer' },
  );

  useInboxVitalStats();

  const onError = useCallback((error: Error) => {
    if (viewInboxVitalStatsSharedState.value.status === 'started') {
      viewInboxVitalStatsSharedState.setValue({
        status: 'failed',
        error,
      });
    }
  }, []);

  const { value: isInboxEnabled } = useFeatureGate(
    'trello_personal_productivity_release',
  );

  if (!isInboxEnabled) {
    return <StubInbox />;
  }

  return (
    <ErrorBoundary
      tags={{ ownershipArea: 'trello-web-eng', feature: 'Inbox' }}
      onError={onError}
    >
      <ChunkLoadErrorBoundary fallback={null} onError={onError}>
        <UFOSuspense name="inbox-view" fallback={<InboxSkeleton />}>
          <InboxContainer />
        </UFOSuspense>
      </ChunkLoadErrorBoundary>
    </ErrorBoundary>
  );
};
