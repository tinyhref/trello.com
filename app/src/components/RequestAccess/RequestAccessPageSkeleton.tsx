import type { ReactNode } from 'react';

import { RequestAccessBackground } from './RequestAccessBackground';

import * as styles from './RequestAccessPageSkeleton.module.less';

export const RequestAccessPageSkeleton = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className={styles.page}>
      <div className={styles.box}>{children}</div>
      <RequestAccessBackground />
    </div>
  );
};
