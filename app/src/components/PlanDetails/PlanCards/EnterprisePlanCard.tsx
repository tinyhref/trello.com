/* eslint-disable formatjs/enforce-description */
import { useContext, type FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import { Analytics } from '@trello/atlassian-analytics';
import { Button } from '@trello/nachos/button';

import { PlanComparisonContext } from '../PlanComparisonContext';

import * as styles from './EnterprisePlanCard.module.less';

interface EnterprisePlanCardProps {
  showRefreshedMessage?: boolean;
}

export const EnterprisePlanCard: FunctionComponent<EnterprisePlanCardProps> = ({
  showRefreshedMessage = false,
}) => {
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
    }
  };

  return (
    <section className={styles.planCard}>
      <article>
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
        <div className={styles.priceContainer}>
          <span className={styles.pricingVaries}>
            <FormattedMessage
              id="templates.billing_page_one.pricing-varies"
              defaultMessage="Pricing varies with number of licenses"
            />
          </span>
        </div>
      </article>
      <article className={styles.enterpriseFooter}>
        <Button
          href={'/enterprise#contact'}
          linkTarget="_blank"
          onClick={onClickContactUs}
        >
          <FormattedMessage
            id="templates.billing_page_one.contact-sales-repackaging-gtm"
            defaultMessage="Contact sales"
          />
        </Button>
      </article>
    </section>
  );
};
