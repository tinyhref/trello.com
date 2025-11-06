import { useFeatureGate } from '@trello/feature-gate-client';
import type { ListTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import * as styles from './ListActionsPopoverSkeleton.module.less';

export const ListActionsPopoverSkeleton = () => {
  const { value: isArchiveCompletedCardsEnabled } = useFeatureGate(
    'phx_archive_all_cards_in_list',
  );

  return (
    <div
      data-testid={getTestId<ListTestIds>('list-actions-popover-skeleton')}
      className={styles.skeletonWrapper}
    >
      <div className={styles.skeletonPopoverOption} />
      <div className={styles.skeletonPopoverOption} />
      <div className={styles.skeletonPopoverOption} />
      <div className={styles.skeletonPopoverOption} />
      <div className={styles.skeletonPopoverOption} />
      <div className={styles.skeletonSectionTitle} />
      <div className={styles.skeletonColorSection} />
      <div className={styles.skeletonSectionTitle} />
      <div className={styles.skeletonButlerOption} />
      <div className={styles.skeletonButlerOption} />
      <div className={styles.skeletonButlerOption} />
      <div className={styles.skeletonButlerOption} />
      <div className={styles.skeletonPopoverOption} />
      <div className={styles.skeletonPopoverOption} />
      {isArchiveCompletedCardsEnabled && (
        <div className={styles.skeletonPopoverOption} />
      )}
    </div>
  );
};
