import type { FunctionComponent } from 'react';
import { useCallback, useEffect, useMemo } from 'react';

import { BoardPremiumFeaturesProvider } from '@trello/business-logic-react/board';
import { ErrorBoundary } from '@trello/error-boundaries';
import { useFeatureGate } from '@trello/feature-gate-client';
import { checkId, idCache, isShortLink } from '@trello/id-cache';
import {
  BoardIdProvider,
  EnterpriseIdProvider,
  WorkspaceIdProvider,
} from '@trello/id-context';
import { useMemberInboxIds } from '@trello/personal-workspace';
import { isActiveRoute, routerState, useSearchParams } from '@trello/router';
import { RouteId } from '@trello/router/routes';
import { useSharedStateSelector } from '@trello/shared-state';
import { useOpenBoardPanel } from '@trello/split-screen';
import { UFOSegment } from '@trello/ufo';

import { controllerEvents } from 'app/scripts/controller/controllerEvents';
import { LazyBoardClosed } from 'app/src/components/BoardClosed';
import { BoardMembersContextProvider } from 'app/src/components/BoardMembersContext';
import { BoardPermissionsContextProvider } from 'app/src/components/BoardPermissionsContext';
import { BoardPluginsContextProvider } from 'app/src/components/BoardPluginsContext';
import { BoardPreferencesContextProvider } from 'app/src/components/BoardPreferencesContext/BoardPreferencesContext';
import { CardBackDialogWithRouting } from 'app/src/components/CardBack';
import { CardBackDialogWithoutRouting } from 'app/src/components/CardBack/CardBackDialogWithoutRouting';
import { Error } from 'app/src/components/Error';
import { RuntimeError } from 'app/src/components/Error/RuntimeError';
import { LazyLegacyLabelsPopover } from 'app/src/components/LabelsPopover';
import { MirrorCardSubscriptions } from 'app/src/components/MirrorCard/MirrorCardSubscriptions';
import { useBoardInformationFragment } from './BoardInformationFragment.generated';
import { BoardLoading } from './BoardLoading';
import { BoardOverlays } from './BoardOverlays';
import { BoardTitleUpdater } from './BoardTitleUpdater';
import { BoardView } from './BoardView';
import { isBoardRenderedSharedState } from './isBoardRenderedSharedState';
import { legacyBoardModelsSharedState } from './legacyBoardModelsSharedState';
import { RedirectToBoardOverlay } from './RedirectToBoardOverlay';
import { returnToBoard } from './returnToBoard';
import { useBoardAndPossiblyCardDataLoader } from './useBoardAndPossiblyCardDataLoader';
import { useBoardBackgroundImageOrColor } from './useBoardBackgroundImageOrColor';
import { useBoardBodyClass } from './useBoardBodyClass';
import { useBoardMarketingScreenAnalytic } from './useBoardMarketingScreenAnalytic';
import { useBoardPageState } from './useBoardPageState';
import { useInboxBoardRedirect } from './useInboxBoardRedirect';
import { useViewBoardVitalStats } from './useViewBoardVitalStats';
import { useViewCardVitalStats } from './useViewCardVitalStats';

const OPEN_CARD_PARAM = 'openCard';

const Board: FunctionComponent<{
  boardId: string;
  boardNodeId: string | null;
}> = ({ boardId, boardNodeId }) => {
  const { data: board } = useBoardInformationFragment({
    from: { id: boardId },
    optimistic: true,
  });

  const closeCardBackAnywhere = useCallback(() => {
    returnToBoard();
  }, []);
  const { idBoard: inboxId } = useMemberInboxIds();

  const workspaceId = board?.idOrganization ?? null;
  const enterpriseId = board?.idEnterprise ?? null;

  useBoardMarketingScreenAnalytic(boardId);

  const boardIdContextValue = useMemo(
    () => ({ boardId, boardNodeId }),
    [boardId, boardNodeId],
  );

  const { value: mirrorCardSubscriptionsEnabled } = useFeatureGate(
    'ghost_use_mirror_card_subscriptions',
  );
  const searchParams = useSearchParams();
  const cardId = searchParams.get(OPEN_CARD_PARAM);

  return (
    <div aria-live="polite" aria-busy="false">
      <EnterpriseIdProvider value={enterpriseId}>
        <WorkspaceIdProvider value={workspaceId}>
          <BoardIdProvider value={boardIdContextValue}>
            <BoardPremiumFeaturesProvider boardId={boardId}>
              <BoardMembersContextProvider>
                <BoardPermissionsContextProvider>
                  <BoardPreferencesContextProvider>
                    <BoardPluginsContextProvider>
                      {board?.closed ? <LazyBoardClosed /> : <BoardView />}
                      {mirrorCardSubscriptionsEnabled && (
                        <MirrorCardSubscriptions />
                      )}
                      {cardId ? (
                        <CardBackDialogWithoutRouting
                          boardId={inboxId ?? ''}
                          cardId={cardId}
                          onClose={closeCardBackAnywhere}
                          source={'inboxScreen'}
                        />
                      ) : (
                        <CardBackDialogWithRouting />
                      )}

                      <BoardTitleUpdater />

                      <BoardOverlays />
                      <RedirectToBoardOverlay />

                      <LazyLegacyLabelsPopover />
                    </BoardPluginsContextProvider>
                  </BoardPreferencesContextProvider>
                </BoardPermissionsContextProvider>
              </BoardMembersContextProvider>
            </BoardPremiumFeaturesProvider>
          </BoardIdProvider>
        </WorkspaceIdProvider>
      </EnterpriseIdProvider>
    </div>
  );
};

export const TrelloBoard: FunctionComponent = () => {
  /**
   * Start vital stats first, which allows us to get best view of timings for view-board
   * and view-card. Also ensures that the traceId is set which gets used by useBoardAndPossiblyCardDataLoader
   */
  useViewBoardVitalStats();
  useViewCardVitalStats();
  useBoardAndPossiblyCardDataLoader();

  const { board, cardError } = useSharedStateSelector(
    legacyBoardModelsSharedState,
    useCallback((state) => {
      return {
        board: state.board,
        cardError: state.card.error,
      };
    }, []),
  );

  const { isBoardOrCardRouteActive, shortLinkOrId, isValidIdOrShortLink } =
    useSharedStateSelector(
      routerState,
      useCallback((state) => {
        const isRelevantRoute =
          isActiveRoute(state, RouteId.BOARD) ||
          isActiveRoute(state, RouteId.INVITE_ACCEPT_BOARD) ||
          isActiveRoute(state, RouteId.CARD);
        const shortLink = isRelevantRoute ? state.params?.shortLink : null;

        return {
          isBoardOrCardRouteActive: isRelevantRoute,
          shortLinkOrId: shortLink,
          isValidIdOrShortLink: shortLink
            ? checkId(shortLink) || isShortLink(shortLink)
            : true,
        };
      }, []),
    );

  const boardIds = useMemo(() => {
    /**
     * !OUTDATED COMMENT!
     * You might consider using a method of grabbing the board's id from the shortLink,
     * however that will cause issues with the loading state for the board. Here we use
     * id from the model itself to show the old board while the next board is loading.
     */
    const boardId = board.model?.get('id') ?? null;
    const boardNodeId = board.model?.get('nodeId') ?? null;
    /**
     * But before dropping the boardId from ModelCache completely
     * let's use it as a backup in case the boardId is not available in idCache
     * or when we are on a card route or route param is a full object id.
     */
    const boardIdFromShortLink = idCache.getBoardId(shortLinkOrId ?? '');
    const boardNodeIdFromShortLink = idCache.getBoardAri(shortLinkOrId ?? '');

    return {
      objectId: boardIdFromShortLink ?? boardId,
      nodeId: boardNodeIdFromShortLink ?? boardNodeId,
    };
  }, [board.model, shortLinkOrId]);

  const { idBoard: inboxId } = useMemberInboxIds();

  const isInboxBoard = inboxId === boardIds.objectId;

  const openBoardPanel = useOpenBoardPanel();

  useInboxBoardRedirect({
    boardId: boardIds.objectId,
    shortLinkOrId: shortLinkOrId ?? null,
  });

  useBoardPageState();

  useEffect(() => {
    isBoardRenderedSharedState.setValue(true);
    return () => {
      isBoardRenderedSharedState.setValue(false);
    };
  }, []);

  const hasBoardError = useCallback(() => board.error !== null, [board.error]);

  // Update the board background immediately; CurrentBoardInfo is faster than
  // the legacy Board model.
  useBoardBackgroundImageOrColor({
    skip: isInboxBoard,
  });
  useBoardBodyClass({ removeIf: hasBoardError });

  useEffect(() => {
    if (!boardIds.objectId) {
      return;
    }

    if (!board.loading && board.model) {
      controllerEvents.trigger('setViewType', board.model);
    }

    if (!isInboxBoard) {
      openBoardPanel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardIds.objectId, board.loading, board.model, isInboxBoard]);

  // When we navigate away from a board, there is a small amount of time where this component is still mounted and the
  // new page is loading. In this scenario we render null to avoid accidentally showing the board loading state.
  if (!isBoardOrCardRouteActive) {
    return null;
  }

  if (!isValidIdOrShortLink) {
    return <Error errorType="malformedUrl" />;
  }

  if (board.error) {
    switch (board.error.name) {
      case 'ServerError':
        return <Error errorType="serverError" reason={board.error.message} />;
      case 'BoardNotFound':
        return <Error errorType="boardNotFound" reason={board.error.message} />;
      case 'ConfirmToView':
        return <Error errorType="unconfirmedBoardNotFound" />;
      default:
        return <Error errorType="notFound" />;
    }
  }

  if (cardError) {
    switch (cardError.name) {
      case 'ServerError':
        return <Error errorType="serverError" reason={cardError.message} />;
      case 'CardNotFound':
        return <Error errorType="cardNotFound" reason={cardError.message} />;
      case 'ConfirmToView':
        return <Error errorType="unconfirmedBoardNotFound" />;
      default:
        return <Error errorType="notFound" />;
    }
  }

  if (board.loading || !boardIds.objectId || !boardIds.nodeId || isInboxBoard) {
    return (
      <div aria-live="polite" aria-busy="true">
        <UFOSegment name="board-view" isLoading={true}>
          <BoardLoading />
        </UFOSegment>
      </div>
    );
  }

  return (
    <ErrorBoundary
      errorHandlerComponent={RuntimeError}
      tags={{
        ownershipArea: 'trello-web-eng',
        feature: 'Trello Board',
      }}
    >
      <UFOSegment name="board-view" isLoading={false}>
        <Board boardId={boardIds.objectId} boardNodeId={boardIds.nodeId} />
      </UFOSegment>
    </ErrorBoundary>
  );
};
