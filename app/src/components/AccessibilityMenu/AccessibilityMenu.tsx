import type { FunctionComponent } from 'react';

import { ExternalLinkIconNewTab } from '@trello/nachos/icons/ExternalLinkIconNewTab';

import { ColorVisionOptions, ToggleColorVision } from './ToggleColorVision';

import * as styles from './AccessibilityMenu.module.less';

export const AccessibilityMenu: FunctionComponent = () => {
  return (
    <div className={styles.accessibilityMenuWrapper}>
      <ToggleColorVision />
      <a
        className={styles.link}
        href="https://hello.atlassian.net/wiki/spaces/TRELLOFE/pages/941672748/20.+Accessibility"
        target="_blank"
      >
        Web accessibility guide <ExternalLinkIconNewTab />
      </a>
    </div>
  );
};

export const AccessibilityMenuOptions: FunctionComponent = () => {
  return <ColorVisionOptions />;
};
