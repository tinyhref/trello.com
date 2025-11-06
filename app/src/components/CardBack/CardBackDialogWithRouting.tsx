import cx from 'classnames';
import type { FunctionComponent } from 'react';
import { useCallback, useEffect, useRef } from 'react';

import { useIsTemplateBoard } from '@trello/business-logic-react/board';
import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useFeatureGate } from '@trello/feature-gate-client';
import { useBoardId } from '@trello/id-context';
import { Layers } from '@trello/layer-manager';
import { Dialog, useDialog } from '@trello/nachos/dialog';
import { useRecentlyUsedFeaturePreloader } from '@trello/recently-used-feature-preloader';
import { useIsActiveRoute } from '@trello/router';
import { RouteId } from '@trello/router/routes';
import { useSharedState, useSharedStateSelector } from '@trello/shared-state';
import { UFOSuspense } from '@trello/ufo';
import { SuspendedComponent } from '@trello/use-lazy-component';

import { legacyBoardModelsSharedState } from 'app/src/components/Board/legacyBoardModelsSharedState';
import { returnToBoard } from 'app/src/components/Board/returnToBoard';
import { viewCardTaskState } from 'app/src/components/Board/useViewCardVitalStats';
import { openCardBack } from 'app/src/components/CardFront/openCardBack';
import { CARD_BACK_NAME_ID_ATTRIBUTE } from './CardBack.constants';
import { CardBackLoading } from './CardBackLoading';
import { CardBackLoadingError } from './CardBackLoadingError';
import { cardBackSharedState } from './cardBackSharedState';
import { getNextCard, getPreviousCard } from './getAdjacentCard';
import { getNextList, getPreviousList } from './getAdjacentList';
import { isCardBackFocusTrapDisabledState } from './isCardBackFocusTrapDisabledState';

import * as styles from './CardBackDialogWithRouting.module.less';

export const CardBackDialogWithRouting: FunctionComponent = () => {
  const boardId = useBoardId();

  const { dialogProps } = useDialog();
  const isActiveCardRoute = useIsActiveRoute(RouteId.CARD);

  const dialogRef = useRef<HTMLDivElement | null>(null);

  const [{ isPanelOpen }] = useSharedState(cardBackSharedState);

  const isTemplateBoard = useIsTemplateBoard(boardId);

  const { value: isResizeEnabled } = useFeatureGate(
    'phx_cardback_resize_panel',
  );

  const { isLoading, cardModel } = useSharedStateSelector(
    legacyBoardModelsSharedState,
    useCallback(
      (state) => {
        if (!isActiveCardRoute) {
          return { isLoading: false, cardModel: null };
        }
        return {
          isLoading:
            state.board.loading || state.card.loading || !state.board.model,
          cardModel: state.card.model,
        };
      },
      [isActiveCardRoute],
    ),
  );

  const dismissCardBackDialog = useCallback(() => {
    returnToBoard();
  }, []);

  const onChunkLoadError = useCallback(() => {
    if (viewCardTaskState.value.status === 'started') {
      viewCardTaskState.setValue({
        status: 'failed',
        error: 'Chunk load failed',
      });
    }
  }, []);

  const onError = useCallback((error: Error) => {
    if (viewCardTaskState.value.status === 'started') {
      viewCardTaskState.setValue({
        status: 'failed',
        error,
      });
    }
  }, []);

  const [isFocusTrappingDisabled] = useSharedState(
    isCardBackFocusTrapDisabledState,
  );

  const [CardBack, trackCardBackUsage] = useRecentlyUsedFeaturePreloader({
    featureName: 'CardBack',
    useLazyComponentArgs: [
      () => import(/* webpackChunkName: "card-back" */ './CardBack'),
      { namedImport: 'CardBack' },
    ],
  });

  // Track feature usage when the card back is opened:
  useEffect(() => {
    if (isActiveCardRoute) {
      trackCardBackUsage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActiveCardRoute]);

  const hasOpenPanel = isPanelOpen && !isTemplateBoard;

  return (
    // eslint-disable-next-line @trello/no-disable-focus-trapping
    <Dialog
      {...dialogProps}
      isOpen={isActiveCardRoute}
      className={cx({
        [styles.cardBackDialog]: true,
        [styles.fixed]: !isResizeEnabled,
        [styles.resizable]: isResizeEnabled,
        [styles.withPanel]: hasOpenPanel,
      })}
      size="medium"
      hide={dismissCardBackDialog}
      dangerous_disableFocusTrapping={isFocusTrappingDisabled}
      layer={Layers.CardBack}
      labelledBy={CARD_BACK_NAME_ID_ATTRIBUTE}
      ref={dialogRef}
      focusLockGroup="cardback"
    >
      <ErrorBoundary
        tags={{
          ownershipArea: 'trello-web-eng',
          feature: 'Card Detail Dialog',
        }}
        onError={onError}
      >
        <ChunkLoadErrorBoundary
          fallback={<CardBackLoadingError onClose={dismissCardBackDialog} />}
          onError={onChunkLoadError}
        >
          <UFOSuspense name="cardback-view" fallback={<CardBackLoading />}>
            {isLoading || !cardModel ? (
              <SuspendedComponent />
            ) : (
              <CardBack
                cardId={cardModel.get('id')}
                dialogRef={dialogRef}
                dismissCardBackDialog={dismissCardBackDialog}
                getPreviousList={getPreviousList}
                getNextList={getNextList}
                getPreviousCard={getPreviousCard}
                getNextCard={getNextCard}
                openCardBackDialog={openCardBack}
              />
            )}
          </UFOSuspense>
        </ChunkLoadErrorBoundary>
      </ErrorBoundary>
    </Dialog>
  );
};
