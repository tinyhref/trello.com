import classNames from 'classnames';
import type { FunctionComponent } from 'react';

import * as styles from './MenuIcon.module.less';

interface MenuIconProps {
  isOpen: boolean;
}

export const MenuIcon: FunctionComponent<MenuIconProps> = ({ isOpen }) => (
  <div className={classNames(styles.menuIcon, { [styles.isOpen]: isOpen })}>
    <span></span>
    <span></span>
    <span></span>
  </div>
);
