import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FunctionComponent,
} from 'react';

import { useOneTimeMessagesDismissed } from '@trello/business-logic-react/member';
import { Dialog, useDialog } from '@trello/nachos/dialog';
import { useIsActiveRoute } from '@trello/router';
import { RouteId } from '@trello/router/routes';
import { useSharedStateSelector } from '@trello/shared-state';
import { workspaceState } from '@trello/workspace-state';

import { EndOfTrialFrictionCoordinator } from '../EndOfTrialFrictionCoordinator/EndOfTrialFrictionCoordinator';
import { useHasEndOfTrialFriction } from '../useHasEndOfTrialFriction';

import * as styles from './EndOfTrialFrictionDialog.module.less';

const END_OF_TRIAL_FRICTION_MESSAGE_DISMISSED_KEY_PREFIX =
  'end-of-trial-friction-message-dismissed-for-ws';

export const getOneTimeMessageKey = (workspaceId: string) =>
  `${END_OF_TRIAL_FRICTION_MESSAGE_DISMISSED_KEY_PREFIX}-${workspaceId}`;

export const EndOfTrialFrictionDialog: FunctionComponent = () => {
  /* --- HOOKS --- */
  const isValidRouteForModal = useIsActiveRoute(
    new Set([RouteId.BOARD, RouteId.ORGANIZATION_BOARDS]),
  );

  const hasEndOfTrialFriction = useHasEndOfTrialFriction();

  const { isOneTimeMessageDismissed, dismissOneTimeMessage } =
    useOneTimeMessagesDismissed();

  const workspaceId = useSharedStateSelector(
    workspaceState,
    useCallback((state) => state?.workspaceId, []),
  );

  const { dialogProps, show } = useDialog();

  /* --- STATE --- */
  const [showModal, setShowModal] = useState<boolean>(false);

  /* --- MEMOIZED STATE --- */
  const messageDismissedKey = useMemo(
    () => getOneTimeMessageKey(workspaceId ?? ''),
    [workspaceId],
  );

  const meetsConditionsForShowingModal = useMemo(() => {
    // the modal has already been dismissed for this workspace
    if (isOneTimeMessageDismissed(messageDismissedKey)) {
      return false;
    }

    // the current route is NOT one of the valid ones for showing end of trial friction
    if (!isValidRouteForModal) {
      return false;
    }

    // not eligible for the end of trial friction experience
    if (!hasEndOfTrialFriction) {
      return false;
    }

    return true;
  }, [
    hasEndOfTrialFriction,
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
  const dismissExperience = useCallback(() => {
    dismissOneTimeMessage(messageDismissedKey);
  }, [dismissOneTimeMessage, messageDismissedKey]);

  /* --- OUTPUT --- */
  if (!showModal) {
    return null;
  }

  return (
    <Dialog
      {...dialogProps}
      size="large"
      closeOnEscape={false}
      closeOnOutsideClick={false}
      alignment="center"
      className={styles.dialog}
    >
      {workspaceId && (
        <EndOfTrialFrictionCoordinator
          workspaceId={workspaceId}
          dismissExperience={dismissExperience}
        />
      )}
    </Dialog>
  );
};
