import classNames from 'classnames';
import type { ComponentProps, FunctionComponent } from 'react';

import { RouterLink } from '@trello/router/router-link';

import * as styles from './HeaderButton.module.less';

export const HeaderLink: FunctionComponent<
  ComponentProps<typeof RouterLink>
> = ({ children, className, ...rest }) => (
  <RouterLink {...rest} className={classNames(styles.headerButton, className)}>
    {children}
  </RouterLink>
);
