import { Suspense, type FunctionComponent } from 'react';

import type { SourceType } from '@trello/analytics-types';
import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

interface Props {
  cardId: string;
  plannerEventCardId: string;
  source: SourceType;
  onUnlinkSuccess?: () => void;
}

export const LazyUnlinkCardConfirmationContent: FunctionComponent<Props> = (
  props,
) => {
  const UnlinkCardConfirmationContent = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "unlink-card-confirmation-content" */ './UnlinkCardConfirmationContent'
      ),
    { namedImport: 'UnlinkCardConfirmationContent' },
  );

  return (
    <ErrorBoundary>
      <ChunkLoadErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <UnlinkCardConfirmationContent {...props} />
        </Suspense>
      </ChunkLoadErrorBoundary>
    </ErrorBoundary>
  );
};
