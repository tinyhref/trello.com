import type { FunctionComponent } from 'react';

import InboxIcon from '@atlaskit/icon/core/inbox';

import * as styles from './StubInbox.module.less';

export const StubInbox: FunctionComponent = () => {
  return (
    <header className={styles.header}>
      <InboxIcon label="" spacing="spacious" />
      <span>Inbox</span>
    </header>
  );
};
