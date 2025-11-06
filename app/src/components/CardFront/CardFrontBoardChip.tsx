import cx from 'classnames';
import type { FunctionComponent, ReactNode } from 'react';

import { useCardId } from '@trello/id-context';
import { smallestPreview } from '@trello/image-previews';
import { ExternalLinkIcon } from '@trello/nachos/icons/external-link';
import { Tooltip } from '@trello/nachos/tooltip';
import { RouterLink } from '@trello/router/router-link';
import { useSharedState } from '@trello/shared-state';

import { inboxActiveCardSharedState } from 'app/src/components/Inbox/inboxActiveCardSharedState';
import { CardFrontBoardChipBoardIcon } from './CardFrontBoardChipBoardIcon';
import { useCardFrontBoardChipFragment } from './CardFrontBoardChipFragment.generated';

import * as styles from './CardFrontBoardChip.module.less';

interface ConditionalRouterLinkWrapperProps {
  children: ReactNode;
  showListName: boolean;
  boardUrl: string;
  isCompact: boolean;
}
/**
 * A component that conditionally adds a RouterLink depending
 * if in a free workspace or not.
 */
const ConditionalRouterLinkWrapper: FunctionComponent<
  ConditionalRouterLinkWrapperProps
> = ({ children, showListName, boardUrl, isCompact }) => {
  const [activeCardId, setActiveCardId] = useSharedState(
    inboxActiveCardSharedState,
  );
  if (!showListName) {
    return (
      <div
        className={cx(styles.cardFrontBoardChip, styles.free, styles.compact)}
        tabIndex={-1}
      >
        {children}
      </div>
    );
  }

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();

    // Close active inbox card when clicking trello card attachment to go to board
    if (activeCardId) {
      setActiveCardId(null);
    }
  };

  return (
    <RouterLink
      href={boardUrl}
      className={cx(
        styles.cardFrontBoardChip,
        styles.showListName,
        isCompact ? styles.compact : styles.expanded,
      )}
      onClick={onClick}
      tabIndex={-1}
    >
      {children}
    </RouterLink>
  );
};
interface CardFrontBoardChipProps {
  showListName: boolean;
  isCompact: boolean;
}

export const CardFrontBoardChip: FunctionComponent<CardFrontBoardChipProps> = ({
  showListName,
  isCompact,
}) => {
  const cardId = useCardId();
  const { data: card } = useCardFrontBoardChipFragment({
    from: { id: cardId },
  });

  const board = card?.board;
  const listName = card?.list?.name;

  // some old boards have not gone through image scaling,
  // so <board response>.prefs.backgroundImageScaled === null
  const { url: backgroundUrl } = smallestPreview(
    board?.prefs?.backgroundImageScaled,
  ) ?? { url: board?.prefs?.backgroundImage || undefined };
  const backgroundColor = board?.prefs?.backgroundColor ?? '';

  if (!board) {
    return;
  }

  // Workaround for https://trello.atlassian.net/browse/ENT-1666
  // Inbox is intentionally untranslated
  const isInbox = board.name === 'Inbox Board';
  const boardName = isInbox ? 'Inbox' : board.name;

  return (
    <ConditionalRouterLinkWrapper
      boardUrl={board.url}
      isCompact={isCompact}
      showListName={showListName}
    >
      <Tooltip
        content={showListName ? `${boardName}: ${listName}` : `${boardName}`}
        position="top"
        delay={600}
      >
        <div className={styles.boardChipContents}>
          <CardFrontBoardChipBoardIcon
            backgroundColor={backgroundColor}
            backgroundImage={backgroundUrl}
            isCompact={isCompact}
            showListName={showListName}
          />
          <div className={styles.names}>
            <div className={styles.boardName}>
              <span className={styles.boardNameText}>{boardName}</span>
              {showListName && (
                <span className={styles.externalLinkIcon}>
                  <ExternalLinkIcon size="small" />
                </span>
              )}
            </div>
            {showListName && !isCompact && (
              <span className={styles.listName}>{listName}</span>
            )}
          </div>
        </div>
      </Tooltip>
    </ConditionalRouterLinkWrapper>
  );
};
