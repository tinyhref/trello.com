import cx from 'classnames';
import {
  memo,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type FunctionComponent,
} from 'react';

import type { SourceType } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';
import { useIsTemplateBoard } from '@trello/business-logic-react/board';
import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useFeatureGate } from '@trello/feature-gate-client';
import {
  BoardIdProvider,
  EnterpriseIdProvider,
  ListIdProvider,
  WorkspaceIdProvider,
} from '@trello/id-context';
import { Layers } from '@trello/layer-manager';
import { Dialog, useDialog } from '@trello/nachos/dialog';
import { useSharedState } from '@trello/shared-state';
import { useLazyComponent } from '@trello/use-lazy-component';

import { ModelLoader } from 'app/scripts/db/model-loader';
import type { Board } from 'app/scripts/models/Board';
import type { Card } from 'app/scripts/models/Card';
import { BoardMembersContextProvider } from 'app/src/components/BoardMembersContext';
import { BoardPermissionsContextProvider } from 'app/src/components/BoardPermissionsContext';
import { BoardPluginsContextProvider } from 'app/src/components/BoardPluginsContext';
import { noop } from 'app/src/noop';
import { CARD_BACK_NAME_ID_ATTRIBUTE } from './CardBack.constants';
import type { CardBackKeyboardShortcutListenerProps } from './CardBackKeyboardShortcutListener';
import { CardBackLoading } from './CardBackLoading';
import { CardBackLoadingError } from './CardBackLoadingError';
import { cardBackSharedState } from './cardBackSharedState';
import { isCardBackFocusTrapDisabledState } from './isCardBackFocusTrapDisabledState';

import * as styles from './CardBackDialogWithoutRouting.module.less';

interface CardBackDialogWithoutRoutingProps
  extends CardBackKeyboardShortcutListenerProps {
  boardId: string;
  cardId: string;
  onClose: () => void;
  source: SourceType;
  isInboxBoard?: boolean;
  mirrorCardBoardId?: string;
}

export const CardBackDialogWithoutRouting: FunctionComponent<CardBackDialogWithoutRoutingProps> =
  memo(
    ({
      boardId,
      cardId,
      onClose,
      source,
      mirrorCardBoardId,
      getPreviousCard,
      getNextCard,
      getPreviousList,
      getNextList,
      isInboxBoard,
    }) => {
      const [board, setBoard] = useState<Board | null>(null);
      const [card, setCard] = useState<Card | null>(null);
      const traceIdRef = useRef<string | null>(null);

      const { dialogProps } = useDialog();
      const dialogRef = useRef<HTMLDivElement | null>(null);

      const [{ isPanelOpen }] = useSharedState(cardBackSharedState);
      const isTemplateBoard = useIsTemplateBoard(boardId);

      const { value: isResizeEnabled } = useFeatureGate(
        'phx_cardback_resize_panel',
      );

      const [isFocusTrappingDisabled] = useSharedState(
        isCardBackFocusTrapDisabledState,
      );

      const CardBack = useLazyComponent(
        () => import(/* webpackChunkName: "card-back" */ './CardBack'),
        { preload: false, namedImport: 'CardBack' },
      );

      const onChunkLoadError = useCallback(() => {
        if (traceIdRef.current) {
          Analytics.taskFailed({
            taskName: 'view-card/withoutRouting',
            source,
            traceId: traceIdRef.current,
            error: 'OCA - Chunk load error',
          });
        }
      }, [source]);

      const onError = useCallback(
        (error: Error) => {
          if (traceIdRef.current) {
            Analytics.taskFailed({
              taskName: 'view-card/withoutRouting',
              source,
              traceId: traceIdRef.current,
              error: 'OCA - ' + error,
            });
          }
        },
        [source],
      );

      const onCompleteTask = useCallback(() => {
        if (traceIdRef.current) {
          Analytics.taskSucceeded({
            taskName: 'view-card/withoutRouting',
            source,
            traceId: traceIdRef.current,
          });

          traceIdRef.current = null;
        }
      }, [source]);

      useEffect(() => {
        const newTraceId = Analytics.startTask({
          taskName: 'view-card/withoutRouting',
          source,
        });
        traceIdRef.current = newTraceId;
      }, [source]);

      // We're using the legacy ModelLoader because some parts of the card back
      // still use the legacy ModelCache - attachments, power ups - through the
      // use of useLegacyCardModel. There is no way right now to sync the Apollo
      // cache to ModelCache so we will use ModelLoader until those are refactored.
      useEffect(() => {
        const loadData = async () => {
          const cardPromise = ModelLoader.loadCardData(cardId);
          const boardPromise = ModelLoader.loadCurrentBoardInfo(boardId);
          const boardListsCardsPromise =
            ModelLoader.loadCurrentBoardListsCards(boardId);

          const [cardData, boardData] = await Promise.all([
            cardPromise,
            boardPromise,
            boardListsCardsPromise,
          ]);
          setCard(cardData);
          setBoard(boardData);
        };

        if (boardId && cardId) {
          loadData();
        }
      }, [boardId, cardId]);

      if (!card || !board) {
        return null;
      }

      const hasOpenPanel = isPanelOpen && !isTemplateBoard;

      return (
        <EnterpriseIdProvider value={board.attributes.idEnterprise}>
          <WorkspaceIdProvider value={board.attributes.idOrganization}>
            <BoardIdProvider value={boardId}>
              <BoardMembersContextProvider>
                <BoardPermissionsContextProvider>
                  <BoardPluginsContextProvider>
                    <ListIdProvider value={card.attributes.idList}>
                      {/* eslint-disable-next-line @trello/no-disable-focus-trapping */}
                      <Dialog
                        {...dialogProps}
                        isOpen={true}
                        className={cx({
                          [styles.cardBackDialog]: true,
                          [styles.fixed]: !isResizeEnabled,
                          [styles.resizable]: isResizeEnabled,
                          [styles.withPanel]: hasOpenPanel,
                        })}
                        size="medium"
                        hide={onClose}
                        dangerous_disableFocusTrapping={isFocusTrappingDisabled}
                        layer={Layers.CardBack}
                        labelledBy={CARD_BACK_NAME_ID_ATTRIBUTE}
                        ref={dialogRef}
                        focusLockGroup="cardback"
                      >
                        <ErrorBoundary
                          tags={{
                            ownershipArea: 'trello-web-eng',
                            feature: 'Card Detail Dialog Without Routing',
                          }}
                          onError={onError}
                        >
                          <ChunkLoadErrorBoundary
                            fallback={
                              <CardBackLoadingError onClose={onClose} />
                            }
                            onError={onChunkLoadError}
                          >
                            <Suspense fallback={<CardBackLoading />}>
                              <CardBack
                                cardId={cardId}
                                dangerous_mirrorCardBoardId={mirrorCardBoardId}
                                dialogRef={dialogRef}
                                dismissCardBackDialog={onClose}
                                isOpenedFromSourceBoard={false}
                                openCardBackDialog={noop}
                                getPreviousList={getPreviousList}
                                getNextList={getNextList}
                                getPreviousCard={getPreviousCard}
                                getNextCard={getNextCard}
                                onMount={onCompleteTask}
                                isInboxBoard={isInboxBoard}
                              />
                            </Suspense>
                          </ChunkLoadErrorBoundary>
                        </ErrorBoundary>
                      </Dialog>
                    </ListIdProvider>
                  </BoardPluginsContextProvider>
                </BoardPermissionsContextProvider>
              </BoardMembersContextProvider>
            </BoardIdProvider>
          </WorkspaceIdProvider>
        </EnterpriseIdProvider>
      );
    },
  );
