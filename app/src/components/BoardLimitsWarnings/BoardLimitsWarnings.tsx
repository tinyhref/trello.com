import { Suspense, useEffect } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useBoardId } from '@trello/id-context';
import { TrelloStorage } from '@trello/storage';
import { importWithRetry, useLazyComponent } from '@trello/use-lazy-component';

import { useCanEditBoard } from 'app/src/components/BoardPermissionsContext';
import {
  getLimitStorageKey,
  useBoardLimitsWarnings,
} from './useBoardLimitsWarnings';

export function BoardLimitsWarnings() {
  const boardId = useBoardId();
  const { boardLimitsWarnings, dismissBoardLimitWarning } =
    useBoardLimitsWarnings({
      boardId,
    });
  const canEditBoard = useCanEditBoard();

  const LazyBoardWarning = useLazyComponent(
    () =>
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "board-limits-warning" */ './BoardLimitsWarning'
          ),
      ),
    {
      namedImport: 'BoardLimitsWarning',
      preload: false,
    },
  );

  useEffect(() => {
    if (boardLimitsWarnings) {
      boardLimitsWarnings.forEach((warning) => {
        const limit = warning.key;
        const localStorageKey = getLimitStorageKey({ limit, boardId });
        if (!canEditBoard && TrelloStorage.get(localStorageKey) !== null) {
          TrelloStorage.unset(localStorageKey);
        }
      });
    }
  }, [boardLimitsWarnings, boardId, canEditBoard]);

  if (!canEditBoard) {
    return null;
  }

  const currentBoardWarning = boardLimitsWarnings?.[0];

  if (!currentBoardWarning || currentBoardWarning.status === 'ok') {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <ChunkLoadErrorBoundary fallback={null}>
        <LazyBoardWarning
          limit={currentBoardWarning.key}
          status={currentBoardWarning.status}
          onDismiss={dismissBoardLimitWarning}
        />
      </ChunkLoadErrorBoundary>
    </Suspense>
  );
}
