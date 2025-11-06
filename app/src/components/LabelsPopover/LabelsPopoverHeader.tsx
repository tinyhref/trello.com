import type { FunctionComponent, PropsWithChildren } from 'react';

import * as styles from './LabelsPopoverHeader.module.less';

export const LabelsPopoverHeader: FunctionComponent<
  PropsWithChildren<unknown>
> = ({ children }) => <h3 className={styles.header}>{children}</h3>;
