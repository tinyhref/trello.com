import { useMemo } from 'react';

import { useFeatureGate } from '@trello/feature-gate-client';

import { useCardType } from 'app/src/components/CardType';
import { useMirrorCardQuery } from './MirrorCardQuery.generated';
import { useMirrorCardSourceIdFragment } from './MirrorCardSourceIdFragment.generated';
import { useTrelloMirrorCardSourceCardIdFragment } from './TrelloMirrorCardSourceCardIdFragment.generated';

export const useMirrorCardSourceId = (
  cardId: string,
): { mirrorCardSourceId: string | null; mirrorCardError?: string } => {
  const cardType = useCardType(cardId);

  const { value: isQuickloadErrorsEnabled } = useFeatureGate(
    'ghost_use_mirror_quickload_errors',
  );

  const { data } = useMirrorCardSourceIdFragment({
    from: { id: cardId },
    returnPartialData: true,
  });

  const { data: nativeData } = useTrelloMirrorCardSourceCardIdFragment({
    from: { id: data?.nodeId },
    returnPartialData: true,
  });

  const {
    data: mirrorData,
    error,
    loading,
  } = useMirrorCardQuery({
    variables: { id: data?.mirrorSourceId ?? '' },
    skip:
      !data?.mirrorSourceId ||
      cardType !== 'mirror' ||
      (isQuickloadErrorsEnabled && !!nativeData?.id) ||
      !!nativeData?.sourceCard?.id,
    waitOn: ['TrelloBoardMirrorCards'],
    errorPolicy: 'all',
    context: {
      returnNotFoundError: true,
      returnNetworkErrors: true,
      operationName: 'MirrorCardQuery',
    },
  });

  const sourceCardId = useMemo(() => {
    if (nativeData?.id) {
      return nativeData.sourceCard?.objectId ?? null;
    }
    return mirrorData?.card?.id ?? null;
  }, [mirrorData?.card?.id, nativeData?.id, nativeData?.sourceCard?.objectId]);

  if (loading) {
    return { mirrorCardSourceId: null };
  }

  if (cardType !== 'mirror') {
    return { mirrorCardSourceId: null };
  }

  if (isQuickloadErrorsEnabled && sourceCardId === '000000000000000000000000') {
    return {
      mirrorCardSourceId: cardId,
      mirrorCardError: 'notPermitted',
    };
  }

  if (error || !sourceCardId) {
    const mirrorCardError =
      error?.message === 'unauthorized card permission requested'
        ? 'notPermitted'
        : 'notFound';
    return {
      mirrorCardSourceId: cardId,
      mirrorCardError,
    };
  }

  return { mirrorCardSourceId: sourceCardId };
};
