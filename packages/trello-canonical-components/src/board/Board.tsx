import cx from 'classnames';
import type {
  CSSProperties,
  FunctionComponent,
  PropsWithChildren,
} from 'react';

import { makeRGBA, useLightText } from '@trello/colors';
import { TextDefaultColor, TextLightColor } from '@trello/nachos/tokens';

import * as styles from './Board.module.less';

export interface BoardProps {
  bgColor?: string;
  bgImage?: string | null;
  boardContainerClassName?: string;
  borderColor?: string;
  className?: string;
  hasError?: boolean;
  headerBgColor?: string | null;
  loading?: boolean;
  numLists?: number;
  title?: string;
  widthPx?: number;
  style?: CSSProperties;
  gradientLocation?: 'bottom' | 'top';
}

const defaultStyles: CSSProperties = {};

export const Board: FunctionComponent<PropsWithChildren<BoardProps>> = ({
  bgColor,
  bgImage,
  borderColor,
  hasError,
  headerBgColor,
  children,
  className,
  loading,
  numLists = 5,
  widthPx,
  style = defaultStyles,
  gradientLocation = 'top',
}) => {
  // Apply base classes
  const boardClasses = cx(
    styles.board,
    className,
    hasError && styles.boardError,
    loading && styles.boardLoading,
  );

  // Set custom background color
  const dynamicStyles: CSSProperties = { ...style };
  if (bgColor) {
    dynamicStyles.backgroundColor = bgColor;
  }

  // Set custom background image
  if (bgImage && !headerBgColor) {
    dynamicStyles.backgroundImage = `url(${bgImage})`;
    dynamicStyles.backgroundSize = 'cover';
    dynamicStyles.backgroundPosition = 'bottom';
  } else if (headerBgColor) {
    const headerColor = makeRGBA(headerBgColor, 0.7);
    const headerBg = `linear-gradient(0deg, ${headerColor} 50%, ${headerColor} 0%)`;
    dynamicStyles.backgroundSize = `100% 36px, cover`;

    if (gradientLocation === 'bottom') {
      dynamicStyles.backgroundPosition = 'bottom';
    }

    dynamicStyles.backgroundImage = `${headerBg}`;

    if (bgImage) {
      dynamicStyles.backgroundImage += `, url(${bgImage})`;
    }
  }

  // Set text color based on background color
  const color = headerBgColor || bgColor || '#0C66E4';
  dynamicStyles.color =
    useLightText(color) && !hasError ? TextLightColor : TextDefaultColor;

  // Set dynamic width based on number of lists
  if (numLists !== 5) {
    dynamicStyles.width = `${numLists * 48 + 8}px`;
  }

  // Set custom border color
  if (borderColor) {
    dynamicStyles.border = `1px solid ${borderColor}`;
  }

  if (widthPx) {
    dynamicStyles.width = `${widthPx}px`;
  }

  return (
    <div className={boardClasses} style={dynamicStyles}>
      {children}
    </div>
  );
};

export const BoardLists: FunctionComponent<PropsWithChildren<unknown>> = ({
  children,
}) => <div className={styles.boardLists}>{children}</div>;

export const TeamName: FunctionComponent<PropsWithChildren<unknown>> = ({
  children,
}) => <h2 className={styles.teamName}>{children}</h2>;

export const BoardName: FunctionComponent<
  PropsWithChildren<{ className?: string }>
> = ({ children, className }) => (
  <h1 className={cx(styles.boardName, className)}>{children}</h1>
);

export const ErrorMessage: FunctionComponent<PropsWithChildren<unknown>> = ({
  children,
}) => <h1 className={cx(styles.boardName, styles.errorMessage)}>{children}</h1>;
