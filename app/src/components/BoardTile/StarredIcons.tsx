import classNames from 'classnames';
import type { FunctionComponent } from 'react';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';

import StarStarredIcon from '@atlaskit/icon/core/star-starred';
import StarUnstarredIcon from '@atlaskit/icon/core/star-unstarred';
import { StarIcon } from '@trello/nachos/icons/star';
import { StarredIcon } from '@trello/nachos/icons/starred';
import { token } from '@trello/theme';

import * as styles from './StarredIcons.module.less';

interface StarredIconProps {
  readonly isStarred: boolean;
  starColor?: string;
  useNewIcons?: boolean;
}

export const StarredIcons: FunctionComponent<StarredIconProps> = ({
  isStarred,
  starColor,
  useNewIcons = false,
}) => {
  const getCustomStarColorStyles = useCallback(() => {
    if (starColor) {
      if (isStarred) {
        return styles.starredBoardIconCustomStarColor;
      } else {
        return styles.unstarredBoardIconCustomStarColor;
      }
    }
  }, [isStarred, starColor]);

  const intl = useIntl();

  const starredIconLabel = intl.formatMessage({
    id: 'templates.board_item.starred-icon',
    defaultMessage: 'Starred Icon',
    description: 'Label for the starred star icon',
  });

  const unstarredIconLabel = intl.formatMessage({
    id: 'templates.board_item.star-icon',
    defaultMessage: 'Star Icon',
    description: 'Label for the unstarred star icon',
  });

  if (useNewIcons) {
    return isStarred ? (
      <StarStarredIcon
        label={starredIconLabel}
        color={token('color.icon', '#44546F')}
      />
    ) : (
      <StarUnstarredIcon
        label={unstarredIconLabel}
        color={token('color.icon', '#44546F')}
      />
    );
  }

  return (
    <div
      className={classNames(
        isStarred ? styles.starredBoardIcon : styles.unstarredBoardIcon,
        getCustomStarColorStyles(),
      )}
    >
      <StarIcon
        size="small"
        label={unstarredIconLabel}
        color={starColor || token('color.icon', '#44546F')}
        dangerous_className={styles.starIcon}
      />
      <StarredIcon
        size="small"
        color={starColor || token('trello.color.icon.star', '#E2B203')}
        label={starredIconLabel}
        dangerous_className={styles.starredIcon}
      />
    </div>
  );
};
