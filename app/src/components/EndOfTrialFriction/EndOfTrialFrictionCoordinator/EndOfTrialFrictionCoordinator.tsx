import classNames from 'classnames';
import {
  useMemo,
  useState,
  type FunctionComponent,
  type ReactNode,
} from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { isAtOrOverFreeBoardLimit } from '@trello/business-logic/organization';
import { showFlag } from '@trello/nachos/experimental-flags';
import { useIsActiveRoute } from '@trello/router';
import { RouteId } from '@trello/router/routes';
import { useWorkspaceUserLimit } from '@trello/workspaces/user-limit';

import { EndOfTrialFrictionPlanComparisonModal } from 'app/src/components/PlanDetails/EndOfTrialFrictionPlanComparisonModal/EndOfTrialFrictionPlanComparisonModal';
import {
  BoardLimitView,
  type ClosedBoard,
} from '../BoardLimitView/BoardLimitView';
import { FreeSelectionInformationModal } from '../FreeSelectionInformationModal/FreeSelectionInformationModal';
import { PaymentModal } from '../PaymentModal/PaymentModal';
import { PremiumTrialEndedPlanSelectionModal } from '../PremiumTrialEndedPlanSelectionModal/PremiumTrialEndedPlanSelectionModal';
import { useEndOfTrialFrictionCoordinatorQuery } from './EndOfTrialFrictionCoordinatorQuery.generated';

import * as styles from './EndOfTrialFrictionCoordinator.module.less';

type SuccessFlags = 'free' | 'premium' | 'standard';

function showSuccessFlag(type: SuccessFlags, isBoardsPage: boolean) {
  let title: ReactNode;
  let description: ReactNode;

  switch (type) {
    case 'free':
      title = 'Welcome to Trello free!';
      description = (
        <a
          href="https://support.atlassian.com/trello/docs/which-trello-plan-is-best-for-me/#Trello-Free"
          target="_blank"
          rel="noopener noreferrer"
        >
          More about this plan
        </a>
      );
      break;
    case 'standard':
      title = 'Welcome to Trello Standard!';
      description = (
        <a
          href=" https://support.atlassian.com/trello/docs/trello-standard"
          target="_blank"
          rel="noopener noreferrer"
        >
          More about this plan
        </a>
      );
      break;
    case 'premium':
      title = 'Welcome to Trello Premium!';
      description = (
        <a
          href=" https://support.atlassian.com/trello/docs/trello-premium-user-guide"
          target="_blank"
          rel="noopener noreferrer"
        >
          More about this plan
        </a>
      );
      break;
    default:
      title = '';
      description = '';
  }

  showFlag({
    id: 'endOfTrialFriction',
    appearance: 'success',
    msTimeout: 5000,
    title,
    description,
  });
  Analytics.sendDismissedComponentEvent({
    componentType: 'flag',
    componentName: 'endOfTrialFriction',
    source: isBoardsPage ? 'cardAndBoardRoute' : 'workspacesBoardsRoute',
    attributes: {
      edition: type,
    },
  });
}

type Steps =
  | 'closed-boards'
  | 'free-selection-information'
  | 'payment-premium'
  | 'payment-standard'
  | 'plan-comparison'
  | 'trial-ended-plan-selection';

export interface EndOfTrialFrictionCoordinatorProps {
  workspaceId: string;
  dismissExperience: () => void;
}

export const EndOfTrialFrictionCoordinator: FunctionComponent<
  EndOfTrialFrictionCoordinatorProps
> = ({
  workspaceId,
  dismissExperience,
}: EndOfTrialFrictionCoordinatorProps) => {
  /* --- HOOKS --- */
  const { data } = useEndOfTrialFrictionCoordinatorQuery({
    variables: { workspaceId },
    waitOn: ['MemberHeader', 'MemberBoards'],
  });

  const { isOverLimit: isOverUserLimit } = useWorkspaceUserLimit({
    workspaceId,
  });

  const isBoardsPage = useIsActiveRoute(RouteId.BOARD);

  /* --- STATE --- */
  const [step, setStep] = useState<Steps>('trial-ended-plan-selection');

  /* -- MEMOIZED STATE -- */

  const closedBoards = useMemo(() => {
    if (!data?.organization?.boards) {
      return [];
    }
    return data.organization.boards.reduce<ClosedBoard[]>((arr, board) => {
      const { id, closed, dateClosed, name, prefs } = board;
      if (!closed || !dateClosed) {
        return arr;
      }
      arr.push({
        id,
        dateClosed,
        name,
        backgroundColor: prefs?.backgroundColor ?? undefined,
        scaledBackgroundImages:
          prefs?.backgroundImageScaled?.map(({ height, url, width }) => ({
            scaled: true,
            width,
            height,
            url,
          })) ?? undefined,
      });
      return arr;
    }, [] as ClosedBoard[]);
  }, [data?.organization?.boards]);

  const closedBoardsCount = useMemo(
    () => closedBoards.length,
    [closedBoards.length],
  );

  const isWorkspaceAtOrOverFreeBoardLimit = data?.organization
    ? isAtOrOverFreeBoardLimit(data!.organization!)
    : false;

  const currentStepComponent = useMemo(() => {
    switch (step) {
      case 'trial-ended-plan-selection':
        return (
          <PremiumTrialEndedPlanSelectionModal
            onSelectStandardPlan={() => setStep('payment-standard')}
            onSelectPremiumPlan={() => setStep('payment-premium')}
            onSelectDowngradeToFree={() =>
              setStep('free-selection-information')
            }
            isAtBoardLimitWithClosedBoards={
              isWorkspaceAtOrOverFreeBoardLimit && closedBoardsCount > 0
            }
            isOverUserLimit={isOverUserLimit}
          />
        );

      case 'payment-standard':
        return (
          <PaymentModal
            workspaceId={workspaceId}
            productClass="Standard"
            onBackToPlans={() => setStep('trial-ended-plan-selection')}
            onStartSubscription={() => {
              dismissExperience();
              showSuccessFlag('standard', isBoardsPage);
            }}
          />
        );

      case 'payment-premium':
        return (
          <PaymentModal
            workspaceId={workspaceId}
            productClass="Premium"
            onBackToPlans={() => setStep('trial-ended-plan-selection')}
            onStartSubscription={() => {
              dismissExperience();
              showSuccessFlag('premium', isBoardsPage);
            }}
          />
        );

      case 'free-selection-information':
        return (
          <FreeSelectionInformationModal
            onComparePlans={() => setStep('plan-comparison')}
            onBackToPlans={() => setStep('trial-ended-plan-selection')}
            onContinue={() => {
              if (isWorkspaceAtOrOverFreeBoardLimit && closedBoardsCount > 0) {
                setStep('closed-boards');
              } else if (isOverUserLimit) {
                dismissExperience();
              } else {
                dismissExperience();
                showSuccessFlag('free', isBoardsPage);
              }
            }}
          />
        );

      case 'plan-comparison':
        return (
          <EndOfTrialFrictionPlanComparisonModal
            workspaceId={workspaceId}
            onChooseFree={() => setStep('free-selection-information')}
            onChooseStandard={() => setStep('payment-standard')}
            onKeepPremium={() => setStep('payment-premium')}
          />
        );

      case 'closed-boards':
        return (
          <BoardLimitView
            isOpen={true}
            boards={closedBoards}
            workspaceName={data?.organization?.displayName || ''}
            onButtonClick={(name) => {
              switch (name) {
                case 'continue-with-free':
                  dismissExperience();

                  if (!isOverUserLimit) {
                    showSuccessFlag('free', isBoardsPage);
                  }
                  break;

                case 'choose-plan':
                  setStep('trial-ended-plan-selection');
                  break;

                default:
                  break;
              }
            }}
          />
        );

      default:
        return null;
    }
  }, [
    closedBoards,
    closedBoardsCount,
    data?.organization?.displayName,
    dismissExperience,
    isBoardsPage,
    isOverUserLimit,
    isWorkspaceAtOrOverFreeBoardLimit,
    step,
    workspaceId,
  ]);

  /* --- OUTPUT --- */
  return (
    <div className={classNames(styles.modalWrapper, styles[step])}>
      {currentStepComponent}
    </div>
  );
};
