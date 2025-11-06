import {
  lazy,
  useCallback,
  useMemo,
  useState,
  type FunctionComponent,
} from 'react';
import { FormattedMessage } from 'react-intl';

import { Analytics } from '@trello/atlassian-analytics';
import { Button } from '@trello/nachos/button';
import { Products } from '@trello/paid-account';
import { importWithRetry } from '@trello/use-lazy-component';

import type { TokenizedCardDetails } from 'app/src/components/CreditCardForm/useStripeCreditCardForm';
import { CreditCardConfirmation } from 'app/src/components/ProductPurchaseForm/Flatline/CreditCardConfirmation';
import { CreditCardEntryForm } from 'app/src/components/ProductPurchaseForm/Flatline/CreditCardEntryForm';

import * as styles from './PaymentModal.module.less';

const LazyStripeProvider = lazy(() =>
  importWithRetry(() =>
    import(
      /* webpackChunkName: "premium-trial-payment-modal" */ 'app/src/components/CreditCardForm/StripeContextProvider'
    ).then((module) => ({ default: module.StripeContextProvider })),
  ),
);

interface PaymentModalProps {
  workspaceId: string;
  productClass: 'Premium' | 'Standard';
  onBackToPlans: () => void;
  onStartSubscription: () => void;
}

export const PaymentModal: FunctionComponent<PaymentModalProps> = ({
  workspaceId,
  productClass,
  onBackToPlans,
  onStartSubscription,
}) => {
  /* --- STATE --- */
  const [isFormStep, setIsFormStep] = useState(true);
  const [isAnnualCadence, setIsAnnualCadence] = useState(true);
  const [cardDetails, setCardDetails] = useState<TokenizedCardDetails>();

  /* --- MEMOIZED STATE --- */
  const product = useMemo(() => {
    const cadence = isAnnualCadence ? 'yearly' : 'monthly';
    if (productClass === 'Premium') {
      return Products.Organization.Premium.current[cadence];
    } else {
      return Products.Organization.Standard.v1[cadence];
    }
  }, [isAnnualCadence, productClass]);

  /* --- CALLBACKS --- */
  const onToggleBillingCadence = useCallback(() => {
    setIsAnnualCadence((prev) => !prev);
  }, []);

  const onCardEntrySuccess = useCallback(
    (tokenizedCardDetails: TokenizedCardDetails) => {
      setCardDetails(tokenizedCardDetails);
      setIsFormStep(false);
    },
    [],
  );

  const onClickBackStep = useCallback(() => {
    setIsFormStep(true);
  }, []);

  const onBackToPlansWithAnalytics = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'backToPlansButton',
      source: 'endOfTrialFrictionScreen',
      attributes: {
        step: isFormStep ? 'paymentEntry' : 'paymentConfirm',
      },
    });
    onBackToPlans();
  }, [isFormStep, onBackToPlans]);

  return (
    <div className={styles.paymentModal}>
      <h2>
        {productClass === 'Premium' ? (
          <FormattedMessage
            id="templates.end_of_trial_friction.payment-modal-premium-title"
            defaultMessage="Subscribe to Premium"
            description="Title for Premium modal"
          />
        ) : (
          <FormattedMessage
            id="templates.end_of_trial_friction.payment-modal-standard-title"
            defaultMessage="Subscribe to Standard"
            description="Title for Standard modal"
          />
        )}
      </h2>
      <p className={styles.description}>
        <FormattedMessage
          id="templates.end_of_trial_friction.payment-modal-description"
          defaultMessage="Add payment information to start your subscription."
          description="Description for payment modal"
        />
      </p>

      <LazyStripeProvider>
        {isFormStep ? (
          <CreditCardEntryForm
            cardDetails={cardDetails ?? null}
            idOrganization={workspaceId}
            onSuccess={onCardEntrySuccess}
            onToggleBillingCadence={onToggleBillingCadence}
            product={product}
            source={'endOfTrialFrictionScreen'}
          />
        ) : (
          <CreditCardConfirmation
            cardDetails={cardDetails!}
            idOrganization={workspaceId}
            onClickBack={onClickBackStep}
            onPurchaseComplete={onStartSubscription}
            onToggleBillingCadence={onToggleBillingCadence}
            product={product}
            source={'endOfTrialFrictionScreen'}
          />
        )}
      </LazyStripeProvider>

      <Button
        className={styles.backToPlansButton}
        onClick={onBackToPlansWithAnalytics}
      >
        <FormattedMessage
          id="templates.end_of_trial_friction.back-to-plans"
          defaultMessage="Back to plans"
          description="Title for Standard modal"
        />
      </Button>
    </div>
  );
};
