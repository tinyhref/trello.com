import * as styles from './WorkspaceViewCalendarSkeleton.module.less';

export const WorkspaceViewCalendarSkeleton = () => {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonHeader}>
        <div className={styles.skeletonColumn} />
        <div className={styles.skeletonColumn} />
        <div className={styles.skeletonColumn} />
      </div>
      <div className={styles.skeletonBody} />
    </div>
  );
};
