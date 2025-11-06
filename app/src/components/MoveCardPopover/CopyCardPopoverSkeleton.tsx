import { BoardListPositionSelectSkeleton } from './BoardListPositionSelectSkeleton';

import * as styles from './CopyCardPopoverSkeleton.module.less';

export const CopyCardPopoverSkeleton = () => {
  return (
    <div>
      <div className={styles.skeletonHeaderText} />
      <div className={styles.skeletonTitleInput} />
      <BoardListPositionSelectSkeleton />
    </div>
  );
};
