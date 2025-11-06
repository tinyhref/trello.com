import type {
  FunctionComponent,
  KeyboardEventHandler,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
} from 'react';
import { useCallback, useEffect, useState } from 'react';
import isEqual from 'react-fast-compare';
import { useIntl } from 'react-intl';

import { TrelloBoardStarAri, TrelloUserAri } from '@atlassian/ari';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { useMemberId } from '@trello/authentication';
import { DynamicButton } from '@trello/dynamic-tokens';
import { useFeatureGate } from '@trello/feature-gate-client';
import type { WorkspaceNavigationTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { useAddBoardStarMutation } from './AddBoardStarMutation.generated';
import { BoardTileStarsDocument } from './BoardTileStarsQuery.generated';
import { useRemoveBoardStarMutation } from './RemoveBoardStarMutation.generated';
import { StarredIcons } from './StarredIcons';
import { useTrelloRemoveBoardStarMutation } from './TrelloRemoveBoardStarMutation.generated';

import * as styles from './StarredBoardButton.module.less';

interface StarredBoardButtonProps {
  readonly idBoard: string;
  readonly name: string;
  readonly maxBoardStarPosition: number;
  readonly boardStarId?: string;
  readonly onClick?: () => void;
  readonly onKeyDown?: KeyboardEventHandler;
  readonly starColor?: string;
  readonly isOnNewBoardTile?: boolean;
}

const sendAnalyticsError = (idBoard: string, error: Error) => {
  Analytics.sendOperationalEvent({
    action: 'errored',
    actionSubject: 'viewsSwitcherCalloutCache',
    source: 'boardsMenuInlineDialog',
    containers: formatContainers({ idBoard }),
    attributes: {
      message: error?.message,
      name: error?.name,
    },
  });
};

export const StarredBoardButton: FunctionComponent<StarredBoardButtonProps> = ({
  onClick,
  onKeyDown,
  starColor,
  isOnNewBoardTile = false,
  ...boardFromCache
}) => {
  const memberId = useMemberId();
  const memberAri = TrelloUserAri.create({ userId: memberId }).toString();
  const [previousBoardFromCache, setPreviousBoardFromCache] =
    useState(boardFromCache);
  const [board, setBoard] = useState(boardFromCache);
  const { value: shouldUseNativeBoardStars } = useFeatureGate(
    'goo_remove_non_native_gql_board_stars',
  );

  useEffect(() => {
    const cacheUpdate = !isEqual(boardFromCache, previousBoardFromCache);
    if (cacheUpdate) {
      setPreviousBoardFromCache(boardFromCache);
      setBoard(boardFromCache);
    }
  }, [boardFromCache, previousBoardFromCache]);

  const [removeBoardStar] = useRemoveBoardStarMutation();
  const [trelloRemoveBoardStar] = useTrelloRemoveBoardStarMutation();
  const [addBoardStar] = useAddBoardStarMutation();

  const clickHandler = useCallback(async () => {
    const {
      boardStarId,
      idBoard: boardId,
      maxBoardStarPosition,
    } = boardFromCache;
    const taskName = 'edit-member/boardStars';
    const source = 'starredBoardButton';
    const traceId = Analytics.startTask({
      taskName,
      source,
    });

    try {
      if (boardStarId) {
        setBoard({
          ...boardFromCache,
          boardStarId: undefined,
        });

        if (shouldUseNativeBoardStars) {
          const boardStarAri = TrelloBoardStarAri.create({
            boardStarId,
          }).toString();
          await trelloRemoveBoardStar({
            variables: {
              input: {
                boardStarId: boardStarAri,
                userId: memberAri,
              },
            },
            context: { traceId },
          });
        } else {
          await removeBoardStar({
            variables: {
              memberId,
              boardStarId,
              traceId,
            },
            refetchQueries: [
              {
                query: BoardTileStarsDocument,
                variables: { memberId, boardId },
                context: {
                  operationName: 'BoardStars',
                  document: BoardTileStarsDocument,
                },
              },
            ],
          });
        }
        Analytics.taskSucceeded({
          attributes: {
            action: 'removed',
          },
          taskName,
          traceId,
          source,
        });
      } else {
        setBoard({
          ...boardFromCache,
          boardStarId: 'boardStarId',
        });
        await addBoardStar({
          variables: {
            memberId,
            boardId,
            pos: 1 + maxBoardStarPosition,
            traceId,
          },
          refetchQueries: [
            {
              query: BoardTileStarsDocument,
              variables: { memberId, boardId },
              context: {
                operationName: 'BoardStars',
                document: BoardTileStarsDocument,
              },
            },
          ],
        });
        Analytics.taskSucceeded({
          taskName,
          traceId,
          source,
        });
      }
    } catch (error) {
      // @ts-expect-error
      sendAnalyticsError(boardId, error);
      setBoard(boardFromCache);
      Analytics.taskFailed({
        attributes: {
          action: boardStarId ? 'removed' : 'added',
        },
        taskName,
        traceId,
        source,
        error,
      });
    }
    if (onClick) {
      onClick();
    }
  }, [
    boardFromCache,
    onClick,
    shouldUseNativeBoardStars,
    trelloRemoveBoardStar,
    memberAri,
    memberId,
    removeBoardStar,
    addBoardStar,
  ]);

  const onClickHandler = useCallback(
    (e: ReactMouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      clickHandler();
    },
    [clickHandler],
  );
  const onKeyDownHandler = useCallback(
    (e: ReactKeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        clickHandler();
      } else {
        onKeyDown?.(e);
      }
    },
    [clickHandler, onKeyDown],
  );

  const intl = useIntl();

  const isStarred = !!board?.boardStarId;

  const titleWithBoardName = isStarred
    ? intl.formatMessage(
        {
          id: 'templates.board_item.click-to-unstar-board-name',
          defaultMessage:
            'Click to unstar {boardName}. It will be removed from your starred list.',
          description: 'Title for the starred button with a board name',
        },
        { boardName: board?.name },
      )
    : intl.formatMessage(
        {
          id: 'templates.board_item.click-to-star-board-name',
          defaultMessage:
            'Click to star {boardName}. It will be added to your starred list.',
          description: 'Title for the unstarred button with a board name',
        },
        { boardName: board?.name },
      );

  const titleWithoutBoardName = isStarred
    ? intl.formatMessage({
        id: 'templates.board_item.click-to-unstar',
        defaultMessage:
          'Click to unstar this board. It will be removed from your starred list.',
        description: 'Title for the starred button without a board name',
      })
    : intl.formatMessage({
        id: 'templates.board_item.click-to-star',
        defaultMessage:
          'Click to star this board. It will be added your starred list.',
        description: 'Title for the unstarred button without a board name',
      });

  const title = board?.name ? titleWithBoardName : titleWithoutBoardName;

  return (
    <DynamicButton
      className={styles.button}
      iconBefore={
        <StarredIcons
          isStarred={isStarred}
          starColor={starColor}
          useNewIcons={isOnNewBoardTile}
        />
      }
      onClick={onClickHandler}
      onKeyDown={onKeyDownHandler}
      title={title}
      data-testid={getTestId<WorkspaceNavigationTestIds>('board-star')}
    />
  );
};
