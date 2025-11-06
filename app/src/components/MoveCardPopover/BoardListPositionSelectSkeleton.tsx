import * as styles from './BoardListPositionSelectSkeleton.module.less';

export const BoardListPositionSelectSkeleton = () => {
  return (
    <div>
      <div className={styles.skeletonHeaderText} />
      <div className={styles.skeletonSelectContainer}>
        <div className={styles.skeletonBoardContainer}>
          <div className={styles.skeletonSelectLabel} />
          <div className={styles.skeletonSelectBox} />
        </div>
        <div className={styles.skeletonListContainer}>
          <div className={styles.skeletonSelectLabel} />
          <div className={styles.skeletonSelectBox} />
        </div>
        <div className={styles.skeletonPositionContainer}>
          <div className={styles.skeletonSelectLabel} />
          <div className={styles.skeletonSelectBox} />
        </div>
      </div>
      <div className={styles.skeletonButton} />
    </div>
  );
};
