import type { FunctionComponent, PropsWithChildren } from 'react';

import * as styles from './Surface.module.less';

export const Surface: FunctionComponent<PropsWithChildren<unknown>> = ({
  children,
}) => {
  return (
    <div id="surface" className={styles.surface}>
      {children}
    </div>
  );
};
