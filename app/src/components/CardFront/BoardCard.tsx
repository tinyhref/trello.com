import cx from 'classnames';
import type { MouseEventHandler } from 'react';
import { useCallback, useEffect } from 'react';
import { sortBy } from 'underscore';

import {
  CanonicalBoardBoard as Board,
  BoardName,
  ErrorMessage,
  PlaceholderBoardTile,
  ProportionalBoardLists,
} from '@atlassian/trello-canonical-components';
import { Analytics } from '@trello/atlassian-analytics';
import { isDevserver } from '@trello/config';
import { intl } from '@trello/i18n';
import { RouterLink } from '@trello/router/router-link';
import { boardUrlFromShortLink, getShortLinkFromTrelloUrl } from '@trello/urls';

import { DragSort } from 'app/scripts/views/lib/DragSort';
import { noop } from 'app/src/noop';
import type { BoardCardQuery } from './BoardCardQuery.generated';
import { useBoardCardQuery } from './BoardCardQuery.generated';
import {
  DeprecatedEditCardButton,
  getDeprecatedEditCardButton,
} from './DeprecatedEditCardButton';

import * as styles from './BoardCard.module.less';

interface BoardCardProps {
  boardUrl: string;
  deprecated_openEditor?: MouseEventHandler<HTMLButtonElement>;
  deprecated_isEditable?: boolean;
  analyticsContainers?: Parameters<
    typeof Analytics.sendViewedComponentEvent
  >[0]['containers'];
}

const FULL_WIDTH_LIST = 5;
interface BoardStyle {
  bgColor?: string;
  bgImage: string | null;
  headerBgColor: string | null;
}

const getBoardStyle = (board: BoardCardQuery['board']): BoardStyle => {
  let bgColor = undefined;
  let headerBgColor = null;
  let bgImage = null;

  if (board !== null && board !== undefined) {
    if (board.prefs?.backgroundColor) {
      bgColor = board.prefs.backgroundColor;
    }

    if (board.prefs?.backgroundImage) {
      bgImage = board.prefs.backgroundImage;

      headerBgColor = board.prefs?.backgroundTopColor
        ? board.prefs?.backgroundTopColor
        : board.prefs.backgroundBrightness === 'dark'
          ? '#2C333A'
          : '#F1F2F4';

      if (board.prefs.backgroundImageScaled) {
        const sortedPreviews = sortBy(
          board.prefs.backgroundImageScaled,
          'width',
        );
        const bigEnoughPreviews = sortedPreviews.filter(
          (p) => p.width > 248 && p.height > 158,
        );
        if (bigEnoughPreviews.length > 0) {
          bgImage = bigEnoughPreviews[0].url;
        }
      }
    }
  }

  return {
    bgColor,
    bgImage,
    headerBgColor,
  };
};

export const BoardCard = ({
  boardUrl,
  deprecated_openEditor = noop,
  deprecated_isEditable = false,
  analyticsContainers,
}: BoardCardProps) => {
  const shortLink = getShortLinkFromTrelloUrl(boardUrl) || '';

  const { data, loading } = useBoardCardQuery({
    variables: { boardId: shortLink },
    // NOTE: If a user has many boards, this waitOn could cause BoardCard to
    // load for a longer time, but it's valuable for resolving a race condition.
    waitOn: ['MemberBoards'],
  });

  const { showEditCardButton, hideEditCardButton, shouldShowEditCardButton } =
    getDeprecatedEditCardButton();

  useEffect(() => {
    if (!loading && data?.board) {
      Analytics.sendViewedComponentEvent({
        componentType: 'card',
        componentName: 'boardCard',
        source: 'cardView',
        containers: analyticsContainers,
        attributes: {
          linkBoardId: data.board.id,
        },
      });
    }
  }, [analyticsContainers, data?.board, data?.board?.id, loading]);

  const trackClick = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((DragSort as any).sorting) {
        e.stopPropagation();
        e.preventDefault();
        return;
      }

      if (!loading && data?.board) {
        Analytics.sendClickedLinkEvent({
          linkName: 'boardCard',
          source: 'cardView',
          containers: analyticsContainers,
          attributes: {
            linkBoardId: data.board.id,
          },
        });
      }
    },
    [analyticsContainers, data?.board, loading],
  );

  // If this BoardCard is running in devserver, we need to replace the url
  // with a link that will work with the Router. Having a mismatched root
  // domain prevents these from linking correctly.
  const url = isDevserver
    ? boardUrlFromShortLink(shortLink, data?.board?.name ?? '')
    : boardUrl;

  if (data?.board) {
    const board = data.board || {};

    const isClosed = data.board?.closed ?? false;

    const cardCount: Record<string, number> = board.cards.reduce(
      (acc: Record<string, number>, card) => {
        if (acc[card.idList]) acc[card.idList] += 1;
        else acc[card.idList] = 1;
        return acc;
      },
      {},
    );

    const lists =
      board.lists.map((list) => ({
        id: list.id,
        size: cardCount[list.id] || 0,
      })) || [];

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        onFocus={showEditCardButton}
        onBlur={hideEditCardButton}
        onMouseOver={showEditCardButton}
        onMouseOut={hideEditCardButton}
      >
        <Board
          className={cx('board-background', styles.boardCard)}
          {...getBoardStyle(board)}
          numLists={FULL_WIDTH_LIST} // full width always
        >
          <DeprecatedEditCardButton
            onClick={deprecated_openEditor}
            shouldShow={
              deprecated_isEditable && !isClosed && shouldShowEditCardButton
            }
          />
          <BoardName>{board.name}</BoardName>
          <ProportionalBoardLists lists={lists} numLists={FULL_WIDTH_LIST} />
          <RouterLink
            href={url}
            className={styles.boardLink}
            title={board.name}
            onClick={trackClick}
            draggable="false"
          />
        </Board>
      </div>
    );
  } else if (loading) {
    return (
      <PlaceholderBoardTile
        className={cx('board-background', styles.boardCard)}
        numLists={FULL_WIDTH_LIST}
      />
    );
  } else
    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        onFocus={showEditCardButton}
        onBlur={hideEditCardButton}
        onMouseOver={showEditCardButton}
        onMouseOut={hideEditCardButton}
      >
        <Board
          className={cx('board-background', styles.boardCard)}
          // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage -- EXCEPTION (need static color values for color calc)
          bgColor="rgb(213 217 223)"
          hasError
          numLists={FULL_WIDTH_LIST}
        >
          <DeprecatedEditCardButton
            onClick={deprecated_openEditor}
            shouldShow={deprecated_isEditable && shouldShowEditCardButton}
          />
          <ErrorMessage>
            {intl.formatMessage({
              id: 'templates.board_card.unable-to-load-board',
              defaultMessage: 'Unable to load board',
              description: 'Error loading board card.',
            })}
          </ErrorMessage>
          <ProportionalBoardLists
            lists={[
              { id: '1', size: 2 },
              { id: '2', size: 3 },
              { id: '3', size: 1 },
              { id: '4', size: 2 },
              { id: '5', size: 2 },
              { id: '6', size: 1 },
            ]}
            numLists={FULL_WIDTH_LIST}
          />
          <RouterLink
            href={url}
            className={styles.boardLink}
            onClick={trackClick}
            draggable="false"
          />
        </Board>
      </div>
    );
};
