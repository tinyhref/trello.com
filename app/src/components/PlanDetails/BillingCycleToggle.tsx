import classNames from 'classnames';
import type {
  ChangeEvent,
  Dispatch,
  FunctionComponent,
  SetStateAction,
} from 'react';

import type { SourceType } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';
import type { PurchaseFormIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { SavePercentageTag } from './SavePercentageTag';

import * as styles from './BillingCycleToggle.module.less';

interface OwnProps {
  leftLabel?: string;
  rightLabel?: string;
  primaryLabel: string;
  hasDiscount: boolean;
  isMonthly: boolean;
  isDisabled?: boolean;
  toggleLabel: Dispatch<SetStateAction<boolean>>;
  teamId: string;
  source?: SourceType;
}

export const BillingCycleToggle: FunctionComponent<OwnProps> = ({
  leftLabel,
  rightLabel,
  primaryLabel,
  hasDiscount = false,
  isMonthly,
  isDisabled,
  toggleLabel,
  teamId,
  source = 'workspaceBillingScreen',
}) => {
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    toggleLabel(!isMonthly);
    Analytics.sendUIEvent({
      action: 'clicked',
      actionSubject: 'toggle',
      actionSubjectId: 'planTypeToggle',
      source,
      containers: { organization: { id: teamId } },
      attributes: {
        planType: isMonthly ? 'yearly' : 'monthly',
      },
    });
  };

  return (
    <section className={styles.toggleWrapper}>
      <p className={styles.primaryLabel}>{primaryLabel}: </p>
      <p
        className={classNames(styles.label, {
          [styles.leftLabel]: isMonthly,
        })}
      >
        {leftLabel}
      </p>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className={styles.switch}>
        <input
          data-testid={
            isMonthly
              ? getTestId<PurchaseFormIds>(
                  'purchase-form-monthly-button-selected',
                )
              : getTestId<PurchaseFormIds>(
                  'purchase-form-annual-button-selected',
                )
          }
          disabled={isDisabled}
          type="checkbox"
          onChange={onChange}
          defaultChecked={!isMonthly}
          tabIndex={0}
        />
        <span className={styles.slider} />
      </label>
      <p
        className={classNames(styles.label, {
          [styles.rightLabel]: !isMonthly,
        })}
      >
        {rightLabel}
      </p>

      {hasDiscount ? <SavePercentageTag percentage={20} /> : null}
    </section>
  );
};
