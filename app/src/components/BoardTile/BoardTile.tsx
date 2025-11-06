import classNames from 'classnames';
import type { CSSProperties, FunctionComponent } from 'react';
import { useIntl } from 'react-intl';

import { hasUnreadActivity } from '@trello/business-logic/board';
import type { Preview } from '@trello/image-previews';
import { smallestPreviewBiggerThan } from '@trello/image-previews';
import { RouterLink, type RouterLinkProps } from '@trello/router/router-link';
import {
  getTestId,
  type BoardTileTestIds,
  type WorkspaceNavigationTestIds,
} from '@trello/test-ids';

import { BoardTemplateBadge } from './BoardTemplateBadge';
import { StarredBoardButton } from './StarredBoardButton';

import * as styles from './BoardTile.module.less';

export interface BoardTileProps extends Omit<RouterLinkProps, 'onClick'> {
  readonly id: string;
  readonly name: string;
  readonly url: string;
  readonly maxBoardStarPosition?: number;
  readonly boardStarId?: string;
  readonly dateLastView?: Date;
  readonly dateLastActivity?: Date;
  readonly boardTileClassName?: string;
  readonly onStarClick?: () => void;
  readonly onBoardClick?: () => void;
  readonly subtitle?: string;
  readonly isTemplate?: boolean;
  readonly backgroundTile?: boolean;
  readonly backgroundImage?: string;
  readonly backgroundColor?: string;
  readonly backgroundImageScaled?: Preview[];
  readonly draggable?: RouterLinkProps['draggable'];
  readonly isRelatedTemplate?: boolean;
  readonly isSelected?: boolean;
  readonly isMenuItem?: boolean;
  readonly starColor?: string;
  readonly badgeAppearance?: 'bold' | 'default';
}

export const getBackgroundStyle = (
  backgroundTile?: boolean,
  backgroundImage?: string,
  backgroundColor?: string,
  backgroundImageScaled?: Preview[],
) => {
  const css: CSSProperties = {};

  if (backgroundImage) {
    const image = backgroundTile
      ? { url: backgroundImage }
      : // some old boards have not gone through image scaling,
        // so <board response>.prefs.backgroundImageScaled === null
        smallestPreviewBiggerThan(backgroundImageScaled, 400, 200) || {
          url: backgroundImage,
        };

    css.backgroundImage = `url('${image.url}')`;
  } else {
    css.backgroundColor = backgroundColor || undefined;
  }

  return css;
};

export const BoardTile: FunctionComponent<BoardTileProps> = ({
  id,
  name,
  url,
  maxBoardStarPosition,
  dateLastView,
  dateLastActivity,
  backgroundTile,
  backgroundImage,
  backgroundColor,
  backgroundImageScaled,
  subtitle,
  isTemplate,
  boardTileClassName,
  onStarClick,
  onBoardClick,
  boardStarId,
  draggable,
  isRelatedTemplate,
  isMenuItem,
  isSelected,
  starColor,
  role,
  badgeAppearance = 'default',
  ...props
}) => {
  const intl = useIntl();
  const tileBackgroundStyle = getBackgroundStyle(
    backgroundTile,
    backgroundImage,
    backgroundColor,
    backgroundImageScaled,
  );

  const isUnread = hasUnreadActivity({
    dateLastView,
    dateLastActivity,
  });

  const containerStyles = classNames(
    styles.boardTile,
    boardTileClassName,
    isRelatedTemplate ? styles.relatedTemplates : '',
    isSelected && styles.selected,
  );
  const boardDescriptionStyles = classNames(
    styles.boardDescription,
    subtitle && styles.fullHeight,
  );

  const unreadStyles = classNames(
    styles.unreadMarker,
    isUnread && styles.isUnread,
    boardStarId && styles.isStarred,
  );
  const actionsWrapperStyles = classNames(
    styles.actionsWrapper,
    isUnread && styles.isUnread,
    boardStarId && styles.isStarred,
  );
  const starStyles = classNames(
    styles.utilityAction,
    boardStarId && styles.isStarred,
    styles.actionSmall,
  );

  const ariaLabel = isUnread
    ? intl.formatMessage(
        {
          id: 'templates.workspace_navigation.recently-active',
          defaultMessage: '{name} (recently active)',
          description: 'Aria label for board tile',
        },
        { name },
      )
    : name;

  return (
    <div className={containerStyles} role={role}>
      <RouterLink
        href={url || `/b/${id}`}
        className={classNames(styles.boardLink, {
          [styles.isStarred]: !!boardStarId,
        })}
        title={name}
        onClick={onBoardClick}
        role={isMenuItem ? 'menuitem' : undefined}
        draggable={draggable}
        aria-label={ariaLabel}
        {...props}
      >
        <div
          className={styles.boardThumbnail}
          style={tileBackgroundStyle}
          data-testid={getTestId<BoardTileTestIds>('board-tile-background')}
        >
          {isUnread && (
            <div
              className={unreadStyles}
              data-testid={getTestId<WorkspaceNavigationTestIds>(
                'board-recent-activity-indicator',
              )}
            />
          )}
        </div>
        <div className={boardDescriptionStyles}>
          <div className={styles.boardName}>{name}</div>
          {subtitle && <div className={styles.boardSubName}>{subtitle}</div>}
        </div>
        {isTemplate && (
          <div className={styles.boardTemplateBadgeContainer}>
            {badgeAppearance === 'bold' ? (
              <BoardTemplateBadge appearance="bold" />
            ) : (
              <BoardTemplateBadge
                dangerous_className={styles.boardTemplateBadge}
              />
            )}
          </div>
        )}
      </RouterLink>
      {!isRelatedTemplate && (
        <div className={actionsWrapperStyles}>
          <div className={starStyles}>
            <StarredBoardButton
              idBoard={id}
              boardStarId={boardStarId}
              maxBoardStarPosition={maxBoardStarPosition || 0}
              onClick={onStarClick}
              name={name}
              starColor={starColor}
            />
          </div>
        </div>
      )}
    </div>
  );
};
