import * as styles from './AddCardToPlannerPopoverSkeleton.module.less';

export const AddCardToPlannerPopoverSkeleton = () => {
  return (
    <div className={styles.addCardToPlannerPopover}>
      <div>
        <div className={styles.skeletonLabelText} />
        <div className={styles.skeletonFormInput} />
        <div className={styles.skeletonLabelText} />
        <div className={styles.skeletonFormInput} />
        <div className={styles.skeletonLabelText} />
        <div className={styles.skeletonFormInput} />
      </div>
      <div className={styles.buttonGroup}>
        <div className={styles.skeletonButton} />
        <div className={styles.skeletonButton} />
      </div>
    </div>
  );
};
