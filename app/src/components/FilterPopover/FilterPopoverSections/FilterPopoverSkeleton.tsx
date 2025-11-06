import * as styles from './FilterPopoverSkeleton.module.less';

export const FilterPopoverSkeleton = () => (
  <div>
    {/* Search input */}
    <div className={styles.skeletonHeader} />
    <div className={styles.skeletonRow} />
    <div className={styles.skeletonRow} />
    {/* Members */}
    <div className={styles.skeletonHeader} />
    <div className={styles.skeletonRow} />
    <div className={styles.skeletonRow} />
    <div className={styles.skeletonRow} />
    {/* Due date */}
    <div className={styles.skeletonHeader} />
    <div className={styles.skeletonRow} />
    <div className={styles.skeletonRow} />
    <div className={styles.skeletonRow} />
    <div className={styles.skeletonRow} />
    {/* Labels */}
    <div className={styles.skeletonHeader} />
    <div className={styles.skeletonRow} />
    <div className={styles.skeletonRow} />
    <div className={styles.skeletonRow} />
    <div className={styles.skeletonRow} />
    <div className={styles.skeletonRow} />
    {/* Activity */}
    <div className={styles.skeletonHeader} />
    <div className={styles.skeletonRow} />
    <div className={styles.skeletonRow} />
    <div className={styles.skeletonRow} />
    <div className={styles.skeletonRow} />
    {/* Mode */}
    <div className={styles.skeletonRow} />
  </div>
);

export const FilterPopoverBoardsSelectorSkeleton = () => (
  <div>
    <div className={styles.skeletonHeader} />
    <div className={styles.skeletonRow} />
  </div>
);
