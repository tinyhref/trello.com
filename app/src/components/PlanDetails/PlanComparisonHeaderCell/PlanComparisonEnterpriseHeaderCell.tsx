/* eslint-disable formatjs/enforce-description */
import classnames from 'classnames';
import { useContext, type FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import { Analytics } from '@trello/atlassian-analytics';
import { intl } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import type { BillingIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { PlanComparisonContext } from '../PlanComparisonContext';

import * as styles from './PlanComparisonEnterpriseHeaderCell.module.less';

export interface PlanComparisonEnterpriseHeaderCellProps {
  teamId: string;
  showRefreshedMessage?: boolean;
}
export const PlanComparisonEnterpriseHeaderCell: FunctionComponent<
  PlanComparisonEnterpriseHeaderCellProps
> = ({ teamId, showRefreshedMessage }) => {
  const { variation } = useContext(PlanComparisonContext);

  const onClickContactUs = () => {
    if (variation === 'end-of-trial-friction-overlay') {
      Analytics.sendClickedButtonEvent({
        buttonName: 'contactUsButton',
        source: 'trelloPlanPricingModal',
        attributes: {
          viaEndOfTrial: true,
        },
      });
    } else {
      Analytics.sendClickedButtonEvent({
        buttonName: 'contactUsButton',
        source: 'planComparisonSection',
        containers: {
          organization: {
            id: teamId,
          },
        },
      });
    }
  };

  return (
    <th
      className={styles.planCell}
      data-value={intl.formatMessage({
        id: 'templates.billing_page_one.best-value',
        defaultMessage: 'BEST VALUE',
      })}
      data-testid={getTestId<BillingIds>('plan-comparison-cell-enterprise')}
    >
      <h3 className={styles.name}>
        <FormattedMessage
          id="templates.billing_page_one.enterprise-name"
          defaultMessage="Enterprise"
        />
      </h3>
      {showRefreshedMessage && (
        <>
          <p className={styles.infoHeading}>
            <FormattedMessage
              id="templates.billing_page_one.enterprise-description-monetization-refresh-heading"
              defaultMessage="<strong>Scale with confidence.</strong>"
              description="Enterprise plan description heading"
              values={{
                strong: (chunks) => <strong>{chunks}</strong>,
              }}
            />
          </p>
          <p className={styles.infoBody}>
            <FormattedMessage
              id="templates.billing_page_one.enterprise-description-monetization-refresh-body"
              defaultMessage="Gain enterprise-level visibility and control."
              description="Enterprise plan description body"
            />
          </p>
        </>
      )}
      {!showRefreshedMessage && (
        <p className={styles.info}>
          <FormattedMessage
            id="templates.billing_page_one.enterprise-description-personal-productivity"
            defaultMessage="Add enterprise-grade security and controls. This plan includes Atlassian Guard Standard and 24/7 Enterprise Admin support."
          />
        </p>
      )}
      <p
        className={classnames(
          styles.pricingVaries,
          styles.frequency,
          showRefreshedMessage && styles.pricingVariesRefreshed,
        )}
      >
        <FormattedMessage
          id="templates.billing_page_one.pricing-varies"
          defaultMessage="Pricing varies with number of licenses"
        />
      </p>
      <Button
        onClick={onClickContactUs}
        testId={getTestId<BillingIds>('contact-sales-button')}
        href={'/enterprise#contact'}
        linkTarget="_blank"
      >
        <FormattedMessage
          id="templates.billing_page_one.contact-sales-repackaging-gtm"
          defaultMessage="Contact sales"
        />
      </Button>
    </th>
  );
};
