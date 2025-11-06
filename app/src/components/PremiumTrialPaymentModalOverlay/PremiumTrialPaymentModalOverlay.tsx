import {
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FunctionComponent,
} from 'react';

import { Overlay } from '@trello/nachos/overlay';
import { useSharedStateSelector } from '@trello/shared-state';
import { importWithRetry } from '@trello/use-lazy-component';
import { workspaceState } from '@trello/workspace-state';

import { PremiumTrialPaymentModal } from 'app/src/components/PremiumTrialPaymentModal';
import { premiumTrialPaymentModalOverlayState } from './premiumTrialPaymentModalOverlayState';

const LazyStripeProvider = lazy(() =>
  importWithRetry(() =>
    import(
      /* webpackChunkName: "premium-trial-payment-modal" */ 'app/src/components/CreditCardForm/StripeContextProvider'
    ).then((module) => ({ default: module.StripeContextProvider })),
  ),
);

export const PremiumTrialPaymentModalOverlay: FunctionComponent = () => {
  /* --- GLOBAL STATE --- */
  const workspaceId = useSharedStateSelector(
    workspaceState,
    useCallback((state) => state.workspaceId, []),
  );

  const isModalOverlayVisible = useSharedStateSelector(
    premiumTrialPaymentModalOverlayState,
    useCallback((state) => state.isVisible, []),
  );

  /* --- STATE --- */
  const [showModal, setShowModal] = useState<boolean>(false);

  /* --- MEMOIZED STATE --- */
  const meetsConditionsForShowingModal = useMemo(() => {
    if (!workspaceId) {
      return false;
    }

    if (!isModalOverlayVisible) {
      return false;
    }

    return true;
  }, [isModalOverlayVisible, workspaceId]);

  /* --- CALLBACKS--- */
  const onClose = useCallback(() => {
    premiumTrialPaymentModalOverlayState.setValue({ isVisible: false });
  }, []);

  /* --- EFFECTS --- */
  useEffect(() => {
    setShowModal(meetsConditionsForShowingModal);
  }, [meetsConditionsForShowingModal]);

  /* --- OUTPUT --- */

  if (!showModal) {
    return null;
  }

  return (
    <Overlay onClose={onClose} closeOnOutsideClick={false}>
      <LazyStripeProvider>
        <PremiumTrialPaymentModal
          workspaceId={workspaceId!}
          closeModal={onClose}
        />
      </LazyStripeProvider>
    </Overlay>
  );
};
