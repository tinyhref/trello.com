import { useCallback, useMemo } from 'react';

import { dontUpsell } from '@trello/browser';
import { Entitlements } from '@trello/entitlements';
import { overlayState } from '@trello/nachos/overlay';
import { useSharedState } from '@trello/shared-state';

import type { PlanSelectionOverlayProps } from 'app/src/components/FreeTrial';
import { useUpgradePromptRulesQuery } from './UpgradePromptRulesQuery.generated';

interface UseUpgradePromptOpt {
  allowUpsell?: boolean;
  redirect?: boolean;
  skip?: boolean;
  callback?: UseOpenPlanSelectionCallbackOpt['callback'];
}

export type Product = 'businessClass' | 'enterprise' | 'free' | 'standard';

const productOrderMapping: Record<Product, number> = {
  enterprise: 3,
  businessClass: 2,
  standard: 1,
  free: 0,
};
interface UpgradePath {
  from?: Product;
  to?: Product;
}

const isValidUpgradePath = (
  currentTeamProduct: Product,
  from: UpgradePath['from'],
  to: UpgradePath['to'],
) => {
  if (!from && !to) {
    return currentTeamProduct === 'free';
  } else if (from && to) {
    return (
      currentTeamProduct === from &&
      productOrderMapping[from] < productOrderMapping[to]
    );
  } else if (to) {
    return productOrderMapping[currentTeamProduct] < productOrderMapping[to];
  } else {
    return currentTeamProduct === from;
  }
};

interface UseOpenPlanSelectionCallbackOpt {
  redirect?: boolean;
  /**
   * This function will be called after the user clicks any of the CTA buttons
   * in the overlay and its respective logic has finished executing.
   *
   * e.g. If the user clicks the "Start free trial" button this function will be
   * called after the related promise has been resolved/rejected.
   */
  callback?: PlanSelectionOverlayProps['onClose'];
}

export const useOpenPlanSelectionCallback = (
  orgId?: string,
  options?: UseOpenPlanSelectionCallbackOpt,
  boardLeftHandNavButtonClicked?: boolean,
) => {
  const setOverlayState = useSharedState(overlayState)[1];
  return useCallback(() => {
    if (!orgId) {
      return;
    }
    setOverlayState({
      overlayType: 'plan-selection',
      context: {
        orgId,
        redirect: options?.redirect ?? true,
        boardLeftHandNavButtonClicked,
        callback: options?.callback,
      },
    });
  }, [
    boardLeftHandNavButtonClicked,
    options?.redirect,
    options?.callback,
    orgId,
    setOverlayState,
  ]);
};

export const useUpgradePromptRules = (
  orgId?: string,
  messageId?: string,
  options?: UseUpgradePromptOpt,
  upgradePath?: UpgradePath,
) => {
  const { data, loading } = useUpgradePromptRulesQuery(
    orgId && !options?.skip
      ? {
          variables: {
            memberId: 'me',
            orgId: orgId || '',
          },
          waitOn: ['MemberHeader', 'MemberBoards'],
        }
      : { skip: true, waitOn: ['MemberHeader', 'MemberBoards'] },
  );

  const member = data?.member;
  const organization = data?.organization;
  const memberId = member?.id || '';
  const currentTeamProduct = useMemo((): Product => {
    if (Entitlements.isEnterprise(organization?.offering)) return 'enterprise';
    if (Entitlements.isPremium(organization?.offering)) return 'businessClass';
    if (Entitlements.isStandard(organization?.offering)) return 'standard';
    return 'free';
  }, [organization?.offering]);

  const isTeamMember = Boolean(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    organization?.memberships?.find((member) => member.idMember === memberId),
  );
  const isEnterprise = Entitlements.isEnterprise(
    member?.enterprises?.find((ent) => ent.id === member?.idEnterprise)
      ?.offering,
  );
  const isMessageDismissed = Boolean(
    member?.oneTimeMessagesDismissed?.find((msgId) => msgId === messageId),
  );
  const isMemberConfirmed = member?.confirmed;

  const boardLimit = data?.organization?.limits?.orgs?.freeBoardsPerOrg?.count;

  const shouldDisplayUpgradePrompt = Boolean(
    (!dontUpsell() || options?.allowUpsell) &&
      isValidUpgradePath(
        currentTeamProduct,
        upgradePath?.from,
        upgradePath?.to,
      ) &&
      !isMessageDismissed &&
      !isEnterprise &&
      isTeamMember &&
      isMemberConfirmed,
  );

  const openPlanSelection = useOpenPlanSelectionCallback(orgId, {
    redirect: options?.redirect,
    callback: options?.callback,
  });

  return {
    boardLimit,
    org: data?.organization,
    openPlanSelection,
    shouldDisplayUpgradePrompt,
    loading,
  };
};
