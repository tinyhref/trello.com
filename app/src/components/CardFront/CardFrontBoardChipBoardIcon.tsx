import cx from 'classnames';
import type { FunctionComponent } from 'react';

import * as styles from './CardFrontBoardChipBoardIcon.module.less';

interface CardFrontBoardChipBoardIconProps {
  backgroundImage?: string;
  backgroundColor?: string;
  showListName: boolean;
  isCompact: boolean;
}

export const CardFrontBoardChipBoardIcon: FunctionComponent<
  CardFrontBoardChipBoardIconProps
> = ({ backgroundImage, backgroundColor, showListName, isCompact }) => {
  if (backgroundImage) {
    return (
      <img
        className={cx(
          showListName
            ? styles.cardFrontBoardChipBoardIconShowListName
            : styles.cardFrontBoardChipBoardIconImage,
          isCompact ? styles.compact : styles.expanded,
        )}
        src={backgroundImage}
        alt=""
      />
    );
  }
  return (
    <div
      className={cx(
        !showListName && styles.cardFrontBoardChipBoardIconColor,
        isCompact ? styles.compact : styles.expanded,
      )}
      style={backgroundColor ? { backgroundColor } : {}}
    />
  );
};
