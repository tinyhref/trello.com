import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FunctionComponent,
} from 'react';

import { useMemberId } from '@trello/authentication';
import { useOneTimeMessagesDismissed } from '@trello/business-logic-react/member';
import { useIsOrganizationMembershipType } from '@trello/business-logic-react/organization';
import { Dialog, useDialog } from '@trello/nachos/dialog';
import { useIsActiveRoute } from '@trello/router';
import { RouteId } from '@trello/router/routes';
import { useSharedStateSelector } from '@trello/shared-state';
import { workspaceState } from '@trello/workspace-state';

import { useHasReverseTrialExperience } from 'app/src/components/FreeTrial';
import { PremiumTrialModal } from 'app/src/components/PremiumTrialModal';
import { premiumTrialPaymentModalOverlayState } from 'app/src/components/PremiumTrialPaymentModalOverlay';

const PREMIUM_TRIAL_MODAL_MESSAGE_DISMISSED_KEY_PREFIX =
  'premium-trial-modal-message-dismissed-for-ws';

export const PremiumTrialModalOverlay: FunctionComponent = () => {
  /* --- HOOKS --- */

  const { isOneTimeMessageDismissed, dismissOneTimeMessage } =
    useOneTimeMessagesDismissed();

  const isValidRouteForModal = useIsActiveRoute(
    new Set([RouteId.BOARD, RouteId.ORGANIZATION_BOARDS]),
  );
  const isBoardPage = useIsActiveRoute(RouteId.BOARD);

  const workspaceId = useSharedStateSelector(
    workspaceState,
    useCallback((state) => state?.workspaceId, []),
  );

  const hasReverseTrialExperience = useHasReverseTrialExperience();

  const idMember = useMemberId();

  const isWorkspaceAdmin = useIsOrganizationMembershipType({
    idMember,
    idOrganization: workspaceId,
    expectedMemberType: 'admin',
  });

  const { dialogProps, show, hide } = useDialog();

  /* --- STATE --- */

  const [showModal, setShowModal] = useState<boolean>(false);

  /* --- MEMOIZED STATE --- */

  const messageDismissedKey = useMemo(
    () => `${PREMIUM_TRIAL_MODAL_MESSAGE_DISMISSED_KEY_PREFIX}-${workspaceId}`,
    [workspaceId],
  );

  const meetsConditionsForShowingModal = useMemo(() => {
    // the modal has already been dismissed for this workspace
    if (isOneTimeMessageDismissed(messageDismissedKey)) {
      return false;
    }

    // the current route is NOT one of the valid ones for showing a modal
    if (!isValidRouteForModal) {
      return false;
    }

    if (!hasReverseTrialExperience) {
      return false;
    }

    return true;
  }, [
    hasReverseTrialExperience,
    isOneTimeMessageDismissed,
    isValidRouteForModal,
    messageDismissedKey,
  ]);

  /* --- EFFECTS --- */

  useEffect(() => {
    setShowModal(meetsConditionsForShowingModal);
    if (meetsConditionsForShowingModal) {
      show();
    }
  }, [meetsConditionsForShowingModal, show]);

  /* --- CALLBACKS --- */

  const closeModal = useCallback(() => {
    dismissOneTimeMessage(messageDismissedKey);
    hide();
  }, [dismissOneTimeMessage, hide, messageDismissedKey]);

  const onCtaClick = useCallback(() => {
    closeModal();
  }, [closeModal]);

  const onTrialExtensionClick = useCallback(() => {
    closeModal();
    premiumTrialPaymentModalOverlayState.setValue({ isVisible: true });
  }, [closeModal]);

  /* --- OUTPUT --- */

  if (!showModal) {
    return null;
  }

  return (
    <Dialog
      {...dialogProps}
      closeOnOutsideClick={false}
      labelledBy="premium-trial-modal-title"
      alignment="center"
    >
      <PremiumTrialModal
        onTrialExtensionClick={onTrialExtensionClick}
        isAdmin={isWorkspaceAdmin}
        onCtaClick={onCtaClick}
        ctaLeadsToBoard={isBoardPage}
        titleId="premium-trial-modal-title"
        workspaceId={workspaceId}
      />
    </Dialog>
  );
};
