import { useCallback, useMemo, useState, type FunctionComponent } from 'react';

import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { intl } from '@trello/i18n';
import { showFlag } from '@trello/nachos/experimental-flags';
import { Products } from '@trello/paid-account';

import type { TokenizedCardDetails } from 'app/src/components/CreditCardForm/useStripeCreditCardForm';
import { PremiumTrialPaymentConfirmation } from 'app/src/components/PremiumTrialPaymentConfirmation';
import { PremiumTrialPaymentForm } from 'app/src/components/PremiumTrialPaymentForm';

import * as styles from './PremiumTrialPaymentModal.module.less';

interface PremiumTrialPaymentModalProps {
  workspaceId: string;
  closeModal: () => void;
}

export const PremiumTrialPaymentModal: FunctionComponent<
  PremiumTrialPaymentModalProps
> = ({ workspaceId, closeModal }) => {
  /* --- STATE --- */
  const [isFormStep, setIsFormStep] = useState(true);
  const [isAnnualCadence, setIsAnnualCadence] = useState(true);
  const [cardDetails, setCardDetails] = useState<TokenizedCardDetails>();

  /* --- MEMOIZED STATE --- */
  const product = useMemo(
    () =>
      Products.Organization.Premium.current[
        isAnnualCadence ? 'yearly' : 'monthly'
      ],
    [isAnnualCadence],
  );

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

  const onPurchaseComplete = useCallback(() => {
    closeModal();
    showFlag({
      id: 'PremiumTrialPaymentModalSuccess',
      title: intl.formatMessage({
        id: 'templates.premium_trial.payment-success-flag-title',
        defaultMessage: 'Payment details saved.',
        description: 'Success flag title',
      }),
      description: intl.formatMessage({
        id: 'templates.premium_trial.payment-success-flag-description',
        defaultMessage:
          'Your card will not be charged until your free trial expires.',
        description: 'Success flag description',
      }),
      appearance: 'success',
    });
    Analytics.sendTrackEvent({
      action: 'triggered',
      actionSubject: 'freeTrialExtension',
      source: 'reverseTrialPremiumModal',
    });
  }, [closeModal]);

  const onClickBack = useCallback(() => {
    setIsFormStep(true);
  }, []);

  const onClickCancel = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'premiumSignupFormCancelButton',
      source: 'reverseTrialPremiumModal',
      containers: formatContainers({
        workspaceId,
      }),
    });
    closeModal();
  }, [closeModal, workspaceId]);

  return (
    <div className={styles.PremiumTrialPaymentModal}>
      {isFormStep ? (
        <PremiumTrialPaymentForm
          workspaceId={workspaceId}
          product={product}
          onToggleBillingCadence={onToggleBillingCadence}
          onCancel={onClickCancel}
          onCardEntrySuccess={onCardEntrySuccess}
          cardDetails={cardDetails}
        />
      ) : (
        <PremiumTrialPaymentConfirmation
          workspaceId={workspaceId}
          product={product}
          onToggleBillingCadence={onToggleBillingCadence}
          onClickBack={onClickBack}
          onPurchaseComplete={onPurchaseComplete}
          onCancel={onClickCancel}
          cardDetails={cardDetails!}
        />
      )}
    </div>
  );
};
