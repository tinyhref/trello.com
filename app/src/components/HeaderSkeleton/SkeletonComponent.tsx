import type { CSSProperties, FunctionComponent } from 'react';

import { token } from '@trello/theme';

interface SkeletonComponentProps {
  height?: number;
  width?: number;
  circle?: boolean;
}

export const SkeletonComponent: FunctionComponent<SkeletonComponentProps> = ({
  height = 32,
  width = 32,
  circle = false,
}) => {
  const styles: CSSProperties = {
    height,
    width,
    flex: `0 0 ${width}px`,
    borderRadius: token('radius.small', '3px'),
    backgroundColor: token('color.skeleton', '#091E420F'),
  };

  if (circle) {
    styles.borderRadius = token('radius.full', '50%');
  }

  return <div style={styles} />;
};
