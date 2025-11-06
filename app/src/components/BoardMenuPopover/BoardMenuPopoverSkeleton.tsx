import * as styles from './BoardMenuPopoverSkeleton.module.less';

export const BoardMenuPopoverSkeleton = () => (
  <div className={styles.skeletonWrapper}>
    <div className={styles.skeletonPopoverOption} />
    <hr role="presentation" />
    <div className={styles.skeletonPopoverOption} />
    <div className={styles.skeletonPopoverOption} />
    <div className={styles.skeletonPopoverOption} />
    <div className={styles.skeletonPopoverOption} />
    <hr role="presentation" />
    <div className={styles.skeletonPopoverOption} />
    <div className={styles.skeletonPopoverOption} />
    <div className={styles.skeletonPopoverOption} />
    <div className={styles.skeletonPopoverOption} />
    <div className={styles.skeletonPopoverOption} />
    <hr role="presentation" />
    <div className={styles.skeletonPopoverOption} />
    <div className={styles.skeletonPopoverOption} />
    <div className={styles.skeletonPopoverOption} />
  </div>
);
