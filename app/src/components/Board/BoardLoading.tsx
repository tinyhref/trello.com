import type { BoardTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import * as styles from './BoardLoading.module.less';

export const BoardLoading = () => (
  <div data-testid={getTestId<BoardTestIds>('board-loading-skeleton')}>
    <div className={styles.boardHeaderSkeleton} />
    <ol className={styles.lists}>
      {/**
       * These are magic numbers — it doesn't much matter, but they loosely
       * correspond to possible list heights (based on number of cards).
       */}
      <li className={styles.listSkeleton} style={{ height: 306 }} />
      <li className={styles.listSkeleton} style={{ height: 162 }} />
      <li className={styles.listSkeleton} style={{ height: 44 }} />
    </ol>
  </div>
);
