import type { FunctionComponent } from 'react';

import { Spinner } from '@trello/nachos/spinner';

import * as styles from './InboxSkeleton.module.less';

export const InboxSkeleton: FunctionComponent = () => {
  return (
    <div className={styles.container}>
      <Spinner />
    </div>
  );
};
