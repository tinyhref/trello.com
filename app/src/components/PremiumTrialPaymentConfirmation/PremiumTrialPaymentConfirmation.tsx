import { type FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import { Button } from '@trello/nachos/button';

import type { TokenizedCardDetails } from 'app/src/components/CreditCardForm/useStripeCreditCardForm';
import { CreditCardConfirmation } from 'app/src/components/ProductPurchaseForm/Flatline/CreditCardConfirmation';

import * as styles from './PremiumTrialPaymentConfirmation.module.less';

interface PremiumTrialPaymenConfirmationProps {
  workspaceId: string;
  cardDetails: TokenizedCardDetails;
  onClickBack: () => void;
  onPurchaseComplete: (paidAccount: {
    standing: number;
    products: number[];
  }) => void;
  onToggleBillingCadence: () => void;
  product: number;
  onCancel: () => void;
}

export const PremiumTrialPaymentConfirmation: FunctionComponent<
  PremiumTrialPaymenConfirmationProps
> = ({
  workspaceId,
  cardDetails,
  onClickBack,
  onPurchaseComplete,
  onToggleBillingCadence,
  product,
  onCancel,
}) => {
  return (
    <div className={styles.PremiumTrialPaymenConfirmation}>
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

      <CreditCardConfirmation
        cardDetails={cardDetails}
        idOrganization={workspaceId}
        onClickBack={onClickBack}
        onPurchaseComplete={onPurchaseComplete}
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
