import type { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import PremiumIcon from '@atlaskit/icon/core/premium';

import * as styles from './PresentationalUpgradePill.module.less';

export const PresentationalUpgradePill: FunctionComponent = () => {
  return (
    <div className={styles.upgradePromptPill}>
      <PremiumIcon size="small" label="" />
      <span className={styles.pillText}>
        <FormattedMessage
          id="templates.planner.upgrade"
          defaultMessage="Upgrade"
          description="Upgrade prompt pill text"
        />
      </span>
    </div>
  );
};
