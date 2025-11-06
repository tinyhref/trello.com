import type { FunctionComponent, PropsWithChildren } from 'react';

import { CheckIcon } from '@trello/nachos/icons/check';
import { token } from '@trello/theme';

import * as styles from './ListItem.module.less';

export const ListItem: FunctionComponent<PropsWithChildren<object>> = ({
  children,
}) => (
  <div className={styles.listItem}>
    <span className={styles.checkIcon}>
      <CheckIcon
        size="large"
        color={token('color.icon.accent.green', '#22A06B')}
      />
    </span>
    <span>{children}</span>
  </div>
);
