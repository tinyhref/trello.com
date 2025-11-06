import { useCallback, useEffect, useMemo, useState } from 'react';

import { getDateBefore } from '@trello/dates';
import { TrelloStorage, type StorageKey } from '@trello/storage';

import type { LimitType, SimplifiedLimit } from 'app/scripts/lib/limits';
import { sortBySeverity } from 'app/scripts/lib/limits';
import { useBoardLimitsWarningsFragment } from './BoardLimitsWarningsFragment.generated';

export function getLimitStorageKey({
  boardId,
  limit,
}: {
  boardId: string;
  limit: LimitType;
}): StorageKey<'localStorage'> {
  return `BoardWarning-${limit}-${boardId}`;
}

const sixMonthsAgo = () => getDateBefore({ months: 6 });

export function useBoardLimitsWarnings({ boardId }: { boardId: string }) {
  const { data: board } = useBoardLimitsWarningsFragment({
    from: { id: boardId },
  });

  const [boardLimitsWarnings, setBoardLimitsWarnings] = useState<
    SimplifiedLimit[]
  >([]);

  const sortedWarnings = useMemo(() => {
    const warnings: SimplifiedLimit[] = [];
    if (!board?.limits) {
      return [];
    } else {
      for (const [model, limit] of Object.entries(board?.limits)) {
        if (model !== '__typename') {
          for (const [limitType, statusObject] of Object.entries(limit)) {
            if (limitType !== '__typename') {
              if (statusObject.status !== 'ok') {
                const limitKey = `${model}.${limitType}` as LimitType;
                const localStorageKey = getLimitStorageKey({
                  boardId,
                  limit: limitKey,
                });
                const lastDismissed = TrelloStorage.get(localStorageKey);
                if (lastDismissed < sixMonthsAgo()) {
                  warnings.push({
                    key: limitKey,
                    status: statusObject.status,
                    count: undefined,
                  });
                }
              }
            }
          }
        }
      }
      return warnings.length > 0 ? sortBySeverity(warnings) : warnings;
    }
  }, [board?.limits, boardId]);

  useEffect(() => {
    setBoardLimitsWarnings(sortedWarnings);
  }, [sortedWarnings]);

  const dismissBoardLimitWarning = useCallback(
    (limitType: LimitType) => {
      const localStorageKey = getLimitStorageKey({
        boardId,
        limit: limitType,
      });
      TrelloStorage.set(localStorageKey, Date.now());
      setBoardLimitsWarnings((currentWarnings) =>
        currentWarnings.filter((warning) => warning.key !== limitType),
      );
    },
    [boardId],
  );

  return {
    boardLimitsWarnings,
    dismissBoardLimitWarning,
  };
}
