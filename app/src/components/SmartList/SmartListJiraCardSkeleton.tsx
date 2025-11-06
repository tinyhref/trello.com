import Skeleton from '@atlaskit/skeleton';

import * as styles from './SmartListJiraCardSkeleton.module.less';

export const SmartListJiraCardSkeleton = () => (
  <li>
    <div className={styles.skeletonWrapper}>
      <div className={styles.skeletonHeader}>
        <Skeleton
          width="12px"
          height="12px"
          groupName="smart-list-jira-card"
          isShimmering
        />
        <div className={styles.skeletonSummary}>
          <Skeleton
            width="100%"
            height="12px"
            groupName="smart-list-jira-card"
            isShimmering
          />
          <Skeleton
            width="70%"
            height="12px"
            groupName="smart-list-jira-card"
            isShimmering
          />
        </div>
      </div>
      <Skeleton
        width="45%"
        height="12px"
        groupName="smart-list-jira-card"
        isShimmering
      />
      <div className={styles.skeletonFooter}>
        <Skeleton
          width="25%"
          height="12px"
          groupName="smart-list-jira-card"
          isShimmering
        />
        <div className={styles.skeletonOpenPreview}>
          <Skeleton
            width="100%"
            height="12px"
            groupName="smart-list-jira-card"
            isShimmering
          />
        </div>
      </div>
    </div>
  </li>
);
