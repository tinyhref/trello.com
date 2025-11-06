import type { FunctionComponent, PropsWithChildren } from 'react';

import * as styles from './Board.module.less';

export const List: FunctionComponent<PropsWithChildren<unknown>> = ({
  children,
}) => <div className={styles.list}>{children}</div>;
