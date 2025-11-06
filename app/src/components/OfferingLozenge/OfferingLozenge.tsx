import cx from 'classnames';
import type { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import Lozenge from '@atlaskit/lozenge';
import { Entitlements } from '@trello/entitlements';

import * as styles from './OfferingLozenge.module.less';

interface OfferingLozengeProps {
  offering: string | null;
  className?: string;
}

export const OfferingLozenge: FunctionComponent<OfferingLozengeProps> = ({
  className = '',
  offering,
}) => {
  if (Entitlements.isEnterprise(offering)) {
    return (
      <span className={cx(styles.lozenge, className)}>
        <span className={styles.text}>
          <FormattedMessage
            id="templates.board_switcher.enterprise"
            defaultMessage="Enterprise"
            description="Lozenge displayed for enterprise workspaces"
          />
        </span>
      </span>
    );
  }
  if (Entitlements.isPremium(offering)) {
    return (
      <span className={cx(styles.lozenge, className)}>
        <span className={styles.text}>
          <FormattedMessage
            id="templates.board_switcher.premium"
            defaultMessage="Premium"
            description="Lozenge displayed for premium workspaces"
          />
        </span>
      </span>
    );
  }
  if (Entitlements.isStandard(offering)) {
    return (
      <span className={cx(styles.lozenge, className)}>
        <span className={styles.text}>
          <FormattedMessage
            id="templates.board_switcher.standard"
            defaultMessage="Standard"
            description="Lozenge displayed for standard workspaces"
          />
        </span>
      </span>
    );
  }
  if (Entitlements.isFree(offering)) {
    return (
      <span className={className}>
        <Lozenge appearance="default">
          <FormattedMessage
            id="templates.board_switcher.free"
            defaultMessage="Free"
            description="Lozenge displayed for free workspaces"
          />
        </Lozenge>
      </span>
    );
  }
  if (offering === 'guest') {
    return (
      <span className={className}>
        <Lozenge appearance="success">
          <FormattedMessage
            id="templates.board_switcher.guest"
            defaultMessage="Guest"
            description="Lozenge displayed for guest workspaces"
          />
        </Lozenge>
      </span>
    );
  }
  return null;
};
