import cx from 'classnames';
import type { FunctionComponent, PropsWithChildren, ReactNode } from 'react';

import * as styles from './WorkspacePageHeader.module.less';

interface WorkspacePageHeaderProps {
  title: ReactNode;
  sticky?: boolean;
}

export const WorkspacePageHeader: FunctionComponent<
  PropsWithChildren<WorkspacePageHeaderProps>
> = ({ title, children, sticky }) => {
  return (
    <header
      className={cx(styles.header, {
        [styles.sticky]: !!sticky,
      })}
    >
      <h1 className={styles.title}>{title}</h1>
      {children}
    </header>
  );
};
