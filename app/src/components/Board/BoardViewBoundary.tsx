import type { FunctionComponent, ReactNode } from 'react';
import { Suspense, useCallback } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import type { Feature, OwnershipArea } from '@trello/error-reporting';

import { RuntimeError } from 'app/src/components/Error/RuntimeError';
import { viewBoardTaskState } from './viewBoardTaskState';

interface BoardViewBoundaryProps {
  feature: Feature;
  ownershipArea: OwnershipArea;
  children: ReactNode;
}

/**
 * A specialized boundary specifically for board views to mark tasks as completed
 * for view-board
 */
export const BoardViewBoundary: FunctionComponent<BoardViewBoundaryProps> = ({
  feature,
  ownershipArea,
  children,
}) => {
  const onError = useCallback((error: Error) => {
    if (viewBoardTaskState.value.status === 'started') {
      viewBoardTaskState.setValue({
        status: 'failed',
        error,
      });
    }
  }, []);

  const onChunkLoadError = useCallback(() => {
    if (viewBoardTaskState.value.status === 'started') {
      viewBoardTaskState.setValue({
        status: 'failed',
        error: new Error('Chunk load failed'),
      });
    }
  }, []);

  return (
    <ErrorBoundary
      errorHandlerComponent={RuntimeError}
      tags={{
        feature,
        ownershipArea,
      }}
      onError={onError}
    >
      <ChunkLoadErrorBoundary fallback={null} onError={onChunkLoadError}>
        <Suspense fallback={null}>{children}</Suspense>
      </ChunkLoadErrorBoundary>
    </ErrorBoundary>
  );
};
