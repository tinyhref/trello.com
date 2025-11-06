/* eslint-disable formatjs/enforce-description */
import { formatDate } from 'date-fns';
import type { CSSProperties, FunctionComponent } from 'react';

import { intl } from '@trello/i18n';
import {
  smallestPreviewBiggerThan,
  type Preview,
} from '@trello/image-previews';
import type { SelectTestClasses } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import * as styles from './ClosedBoardRow.module.less';

interface ClosedBoardRowProps {
  backgroundColor?: string | null;
  scaledBackgroundImages?: Preview[] | null;
  name: string;
  dateClosed: string;
}

export const ClosedBoardRow: FunctionComponent<ClosedBoardRowProps> = ({
  backgroundColor,
  scaledBackgroundImages,
  name,
  dateClosed,
}) => {
  const backgroundStyle: CSSProperties = {};

  if (scaledBackgroundImages) {
    const image = smallestPreviewBiggerThan(scaledBackgroundImages, 24, 24);
    if (image) {
      backgroundStyle.backgroundImage = `url('${image.url}')`;
    }
  }
  if (backgroundColor) {
    backgroundStyle.backgroundColor = backgroundColor;
  }

  const text = {
    closedOnDate: intl.formatMessage(
      {
        id: 'closed boards dialog.closed',
        defaultMessage: 'Closed {date}',
      },
      {
        date: formatDate(new Date(dateClosed), 'PPP'),
      },
    ),
  };

  return (
    <div
      className={styles.boardRow}
      data-test-class={getTestId<SelectTestClasses>('board-tile')}
    >
      <div className={styles.boardRowLeftContainer}>
        <div className={styles.boardThumbnail} style={backgroundStyle} />
        <div className={styles.boardName}>{name}</div>
      </div>

      <div className={styles.boardRowRightContainer}>
        <div className={styles.boardDateClosed}>{text.closedOnDate}</div>
      </div>
    </div>
  );
};
