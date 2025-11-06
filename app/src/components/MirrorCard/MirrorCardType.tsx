import {
  useCallback,
  useEffect,
  type FunctionComponent,
  type MouseEventHandler,
} from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { useMemberId } from '@trello/authentication';
import { idCache } from '@trello/id-cache';
import { useBoardId, useCardId } from '@trello/id-context';
import {
  useIsInboxBoard,
  useIsInboxBoardPassContextVals,
} from '@trello/personal-workspace';
import { navigateTo } from '@trello/router/navigate';
import { RouteId } from '@trello/router/routes';
import { useSharedState } from '@trello/shared-state';

import { CardFrontBoardHint } from 'app/src/components/CardFront/CardFrontBoardHint';
import { TrelloCard } from 'app/src/components/CardFront/TrelloCard';
import { stopPropagationAndPreventDefault } from 'app/src/stopPropagationAndPreventDefault';
import { MirrorCardAccessRestricted } from './MirrorCardAccessRestricted';
import { useMirrorCardBoardInfoFragment } from './MirrorCardBoardInfoFragment.generated';
import { MirrorCardCompact } from './MirrorCardCompact';
import { MirrorCardExpanded } from './MirrorCardExpanded';
import { useMirrorCardFragment } from './MirrorCardFragment.generated';
import { MirrorCardNotFound } from './MirrorCardNotFound';
import { mirrorCardsBySourceBoardState } from './mirrorCardsBySourceBoardState';
import { useGetMirrorCardPaidStatus } from './useGetMirrorCardPaidStatus';

interface MirrorCardTypeProps {
  mirrorCardError?: string;
  name: string;
  mirrorCardShortLink: string;
}

export const MirrorCardType: FunctionComponent<MirrorCardTypeProps> = ({
  mirrorCardError,
  name,
  mirrorCardShortLink,
}) => {
  const cardId = useCardId();
  const boardId = useBoardId();

  const { data: card } = useMirrorCardFragment({
    from: { id: cardId },
    returnPartialData: true,
  });

  const { data: boardData } = useMirrorCardBoardInfoFragment({
    from: { id: boardId },
  });
  const isPaid = useGetMirrorCardPaidStatus();
  const showExpanded = !(boardData?.myPrefs?.showCompactMirrorCards ?? false);

  const memberId = useMemberId();
  const isInboxCard = useIsInboxBoardPassContextVals({
    boardId: card?.board?.id || '',
    memberId,
  });
  const isInboxBoard = useIsInboxBoard();

  const [, setMirrorCardsByBoard] = useSharedState(
    mirrorCardsBySourceBoardState,
  );

  const handleMirrorCardFrontClick = useCallback<MouseEventHandler>(
    (event) => {
      Analytics.sendUIEvent({
        action: 'clicked',
        actionSubject: 'card',
        actionSubjectId: 'mirrorCard',
        source: 'cardView',
        attributes: {
          paidOrFreeWorkspace: isPaid ? 'paid' : 'free',
          compactOrExpanded: showExpanded ? 'expanded' : 'compact',
        },
      });

      // Ensure we don't navigate to the card back for paid mirror cards in the inbox.
      // The card front click handler will manage opening the card back dialog in this case.
      // (See useCardFrontClickHandler.ts)
      if (isInboxBoard && isPaid) {
        return;
      }

      stopPropagationAndPreventDefault(event);

      if (!card?.shortLink) {
        return;
      }

      isPaid
        ? navigateTo(RouteId.CARD, {
            routeParams: { shortLink: mirrorCardShortLink, path: '' },
            navigateOptions: {},
          })
        : navigateTo(RouteId.CARD, {
            routeParams: { shortLink: card.shortLink, path: '' },
            navigateOptions: {},
          });
    },
    [card?.shortLink, isPaid, mirrorCardShortLink, showExpanded, isInboxBoard],
  );

  useEffect(() => {
    if (
      isPaid &&
      card?.shortLink &&
      card.nodeId &&
      card.board?.shortLink &&
      card.board?.id !== boardId &&
      card.board?.nodeId
    ) {
      setMirrorCardsByBoard((prev) => {
        idCache.setCardId(card.shortLink, card.id);
        idCache.setCardAri(card.shortLink, card.nodeId);
        idCache.setBoardAri(card.board?.shortLink, card.board?.nodeId);
        const next = { ...prev };
        next[card.shortLink] = card.board.shortLink;
        return next;
      });
    }
    return () => {
      setMirrorCardsByBoard((prev) => {
        const next = { ...prev };
        if (!card?.shortLink || !isPaid) {
          return prev;
        }
        delete next[card?.shortLink];
        return next;
      });
    };
  }, [
    isPaid,
    card?.nodeId,
    boardId,
    card?.shortLink,
    card?.board?.shortLink,
    card?.board?.nodeId,
    card?.id,
    setMirrorCardsByBoard,
    card?.board?.id,
  ]);

  // This should only happen briefly while a newly-created mirror of an inbox card
  // is being rendered by the optimistic updates - once the server finishes with it,
  // it won't be a mirror card anymore.
  if (isInboxCard) {
    return <TrelloCard name={name} url={name} />;
  }

  if (mirrorCardError === 'notPermitted') {
    return <MirrorCardAccessRestricted sourceCardUrl={name} />;
  }

  if (mirrorCardError === 'notFound') {
    return <MirrorCardNotFound />;
  }

  if (!card || !card.board) {
    return null;
  }

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div onClick={handleMirrorCardFrontClick}>
        {isPaid && showExpanded ? (
          <MirrorCardExpanded
            isArchived={card.closed}
            name={card.name}
            url={card.url}
          />
        ) : (
          <MirrorCardCompact
            name={card.name}
            url={card.url}
            isArchived={card.closed}
            isPaid={isPaid}
          />
        )}
        <CardFrontBoardHint boardId={card.board.id} />
      </div>
    </>
  );
};
