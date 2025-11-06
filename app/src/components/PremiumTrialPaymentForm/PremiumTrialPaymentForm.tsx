import { type FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import InfoIcon from '@atlaskit/icon/core/status-information';
import { Button } from '@trello/nachos/button';

import type { TokenizedCardDetails } from 'app/src/components/CreditCardForm/useStripeCreditCardForm';
import { CreditCardEntryForm } from 'app/src/components/ProductPurchaseForm/Flatline/CreditCardEntryForm';

import * as styles from './PremiumTrialPaymentForm.module.less';

interface PremiumTrialPaymentFormProps {
  workspaceId: string;
  onCardEntrySuccess: (account: TokenizedCardDetails) => void;
  onCancel: () => void;
  onToggleBillingCadence: () => void;
  product: number;
  cardDetails: TokenizedCardDetails | undefined;
}

export const PremiumTrialPaymentForm: FunctionComponent<
  PremiumTrialPaymentFormProps
> = ({
  workspaceId,
  onCardEntrySuccess,
  onCancel,
  onToggleBillingCadence,
  product,
  cardDetails,
}) => {
  return (
    <div className={styles.PremiumTrialPaymentForm}>
      <h2 className={styles.title} data-testid="title">
        <FormattedMessage
          id="templates.premium_trial.payment-modal-title"
          defaultMessage="Extend your Premium trial"
          description="modal title"
        />
      </h2>
      <p className={styles.description} data-testid="description">
        <FormattedMessage
          id="templates.premium_trial.payment-modal-description"
          defaultMessage="Add payment details to extend your Premium trial to 30 days."
          description="modal description"
        />
      </p>
      <div className={styles.disclaimer}>
        <span className={styles.infoIcon}>
          <InfoIcon label="" />
        </span>
        <p className={styles.disclaimerDescription} data-testid="disclaimer">
          <FormattedMessage
            id="templates.premium_trial.payment-modal-disclaimer"
            defaultMessage="Your card will not be charged until your free trial expires."
            description="modal description"
          />
        </p>
      </div>

      <CreditCardEntryForm
        cardDetails={cardDetails ?? null}
        idOrganization={workspaceId}
        onSuccess={onCardEntrySuccess}
        onToggleBillingCadence={onToggleBillingCadence}
        product={product}
        extendTrial={true}
      />

      <Button className={styles.cancelButton} onClick={onCancel}>
        <FormattedMessage
          id="templates.premium_trial.payment-modal-cancel"
          defaultMessage="Cancel"
          description="cancel"
        />
      </Button>
    </div>
  );
};
