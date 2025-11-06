import cx from 'classnames';
import type { FunctionComponent, PropsWithChildren } from 'react';

import type { PurchaseFormIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import * as styles from './ADSCreditCardGrid.module.less';

interface ADSCreditCardGridProps {
  size?: 'large' | 'medium' | 'small' | 'xsmall';
}

export const ADSCreditCardGrid: FunctionComponent<
  PropsWithChildren<ADSCreditCardGridProps>
> = ({ children, size }) => (
  <div
    data-testid={getTestId<PurchaseFormIds>('ads-credit-card-grid')}
    className={cx(styles.grid, {
      [styles.xsmall]: size === 'xsmall',
      [styles.small]: size === 'small',
      [styles.medium]: !size || size === 'medium',
      [styles.large]: size === 'large',
    })}
  >
    {children}
  </div>
);
