import type { MouseEventHandler, PropsWithChildren } from 'react';

import { token } from '@trello/theme';

import * as styles from './Preview.module.less';

interface PreviewProps {
  hideFull: boolean;
  text: string;
  /**
   * Restricts the max height of the preview.
   *
   * Only used if `hideFull` is true.
   */
  height: number;
  onShow: MouseEventHandler;
}

export const Preview = ({
  children,
  hideFull,
  text,
  height,
  onShow,
}: PropsWithChildren<PreviewProps>) => {
  const contentStyle: { maxHeight?: string; overflow?: string } = {};
  if (hideFull) {
    contentStyle.maxHeight = `${height - 2}px`;
    contentStyle.overflow = 'hidden';
  }

  return (
    <div className={styles.content} style={contentStyle}>
      {hideFull && (
        <div
          className={styles.fadeArea}
          style={{
            height: `${height}px`,
            // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage -- (spacing) This usage is computed at runtime
            paddingTop: `${height - 32}px`,
            background: `linear-gradient(180deg, ${token(
              'utility.UNSAFE.transparent',
              'rgba(235, 238, 240, 0)',
            )}, ${token(
              'utility.UNSAFE.transparent',
              'rgba(235, 238, 240, 0)',
            )} ${height - 62}px, ${token('elevation.surface', '#FFFFFF')} ${
              height - 32
            }px)`,
          }}
          onClick={onShow}
          role="button"
        >
          <span className={styles.fadeText}>{text}</span>
        </div>
      )}
      <div
        style={{
          height: hideFull ? `${height}px` : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
};
