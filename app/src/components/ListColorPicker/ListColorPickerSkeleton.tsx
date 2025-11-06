import type { FunctionComponent } from 'react';

import type { ListTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import * as styles from './ListColorPickerSkeleton.module.less';

export const ListColorPickerSkeleton: FunctionComponent = () => {
  return (
    <div data-testid={getTestId<ListTestIds>('list-color-picker-skeleton')}>
      <div className={styles.row} />
      <div className={styles.row} />
      <div className={styles.removeColorButton} />
    </div>
  );
};
