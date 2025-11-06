import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FunctionComponent,
} from 'react';
import { FormattedMessage } from 'react-intl';

import { type FlagId } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';
import { useMemberId } from '@trello/authentication';
import { useOneTimeMessagesDismissed } from '@trello/business-logic-react/member';
import { intl } from '@trello/i18n';
import { pauseShortcuts, resumeShortcuts } from '@trello/keybindings';
import { Button } from '@trello/nachos/button';
import { showFlag } from '@trello/nachos/experimental-flags';
import { Spotlight } from '@trello/nachos/experimental-onboarding';
import { CloseIcon } from '@trello/nachos/icons/close';
import { useMemberInboxIds } from '@trello/personal-workspace';
import { calculatePosition, NULL_POS } from '@trello/position';
import { useSplitScreenSharedState } from '@trello/split-screen';
import { token } from '@trello/theme';

import { useFetchInboxLazyQuery } from 'app/src/components/Inbox/FetchInboxQuery.generated';
import { useIsEligibleForSaveToInboxAction } from 'app/src/components/Inbox/useIsEligibleForSaveToInboxAction';
import {
  PLANNER_DISCOVERY_CARD_ONE_TIME_MESSAGE,
  PLANNER_DISCOVERY_CARD_ONE_TIME_MESSAGE_DISMISSED,
} from 'app/src/components/InboxNotifications/InboxNotifications.constants';
import { triggerInboxAnimation } from 'app/src/components/InboxNotifications/plannerCardAnimationState';
import { useInboxPositionSelectorLazyQuery } from 'app/src/components/MoveCardPopover/InboxPositionSelectorQuery.generated';
import { useCreatePlannerDiscoveryInboxCardMutation } from './CreatePlannerDiscoveryInboxCardMutation.generated';
import plannerDiscoverySpotlightImage from './planner-discovery-spotlight.gif';
import { PLANNER_DISCOVERY_SPOTLIGHT_TARGET } from './PlannerDiscoverySpotlight.constants';
import { useIsEligibleForExistingUserPlannerSpotlight } from './useIsEligibleForExistingUserPlannerSpotlight';
import {
  PLANNER_DISCOVERY_SPOTLIGHT_MESSAGE_ID,
  useIsEligibleForPlannerDiscoverySpotlight,
} from './useIsEligibleForPlannerDiscoverySpotlight';

import * as styles from './PlannerDiscoverySpotlight.module.less';

export const PlannerDiscoverySpotlight: FunctionComponent = () => {
  const { isEligible: isEligibleNewUser } =
    useIsEligibleForPlannerDiscoverySpotlight();
  const { isEligible: isEligibleExistingUser } =
    useIsEligibleForExistingUserPlannerSpotlight();
  const isEligible = isEligibleNewUser || isEligibleExistingUser;
  const { dismissOneTimeMessage } = useOneTimeMessagesDismissed();
  const { togglePlanner, panels } = useSplitScreenSharedState();
  const [isSpotlightActive, setIsSpotlightActive] = useState(false);
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const isEligibleForSaveToInboxAction = useIsEligibleForSaveToInboxAction();
  const memberId = useMemberId();
  const inboxIds = useMemberInboxIds();
  // TODO: convert this to client.query
  // eslint-disable-next-line @trello/prefer-client-query-over-lazy-query
  const [fetchInboxLazy] = useFetchInboxLazyQuery();
  // TODO: convert this to client.query
  // eslint-disable-next-line @trello/prefer-client-query-over-lazy-query
  const [fetchInboxCards] = useInboxPositionSelectorLazyQuery();
  const [createInboxCard] = useCreatePlannerDiscoveryInboxCardMutation();

  const {
    inbox: isInboxOpen,
    board: isBoardOpen,
    switcher: isSwitcherOpen,
  } = panels;

  const inboxOpenRef = useRef(isInboxOpen);

  const onNextFrame = (func: () => void, delay = 0): number => {
    const nextFrameTimeoutId = window.setTimeout(() => {
      window.requestAnimationFrame(() => window.requestAnimationFrame(func));
    }, delay);
    return nextFrameTimeoutId;
  };

  useEffect(() => {
    inboxOpenRef.current = isInboxOpen;
  }, [isInboxOpen]);

  useEffect(() => {
    if (isEligible) {
      const nextFrameTimeoutId = onNextFrame(() => {
        setIsSpotlightActive(true);
        Analytics.sendViewedComponentEvent({
          componentType: 'spotlight',
          componentName: 'plannerDiscoverySpotlight',
          source: 'plannerDiscoverySpotlight',
          attributes: {
            isInboxOpen,
            isExistingUser: isEligibleExistingUser,
            awarenessElement: 'planner',
          },
        });
        if (isEligibleForSaveToInboxAction) {
          Analytics.sendViewedComponentEvent({
            componentType: 'button',
            componentName: 'plannerDiscoverySpotlightSaveToInboxButton',
            source: 'plannerDiscoverySpotlight',
            attributes: {
              isInboxOpen,
              isExistingUser: isEligibleExistingUser,
              awarenessElement: 'inbox',
            },
          });
        }
      }, 250);
      return () => window.clearTimeout(nextFrameTimeoutId);
    }
  }, [
    isEligible,
    isEligibleExistingUser,
    isEligibleForSaveToInboxAction,
    isInboxOpen,
  ]);

  useEffect(() => {
    if (isSpotlightActive) {
      pauseShortcuts();
    } else if (!isSpotlightActive) {
      resumeShortcuts();
    }
  }, [isSpotlightActive]);

  const dismiss = useCallback(() => {
    dismissOneTimeMessage(PLANNER_DISCOVERY_SPOTLIGHT_MESSAGE_ID);
  }, [dismissOneTimeMessage]);

  const handleDismiss = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'plannerDiscoverySpotlightDismissButton',
      source: 'plannerDiscoverySpotlight',
      attributes: {
        isExistingUser: isEligibleExistingUser,
      },
    });
    dismiss();
  }, [dismiss, isEligibleExistingUser]);

  const handleCloseButton = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'plannerDiscoverySpotlightDismissButton',
      source: 'plannerDiscoverySpotlight',
      attributes: {
        dismissMethod: 'closeButton',
        isExistingUser: isEligibleExistingUser,
      },
    });
    dismiss();
  }, [dismiss, isEligibleExistingUser]);

  const handleSaveToInbox = useCallback(async () => {
    if (isCreatingCard) {
      return;
    }

    setIsCreatingCard(true);

    Analytics.sendViewedComponentEvent({
      componentType: 'spotlight',
      componentName: 'plannerDiscoverySpotlight',
      source: 'plannerDiscoverySpotlight',
      attributes: {
        state: 'loading',
      },
    });

    const traceId = Analytics.startTask({
      taskName: 'create-card/list',
      source: 'plannerDiscoverySpotlight',
    });

    try {
      Analytics.sendClickedButtonEvent({
        buttonName: 'plannerDiscoverySpotlightSaveToInboxButton',
        source: 'plannerDiscoverySpotlight',
        attributes: {
          isInboxOpen,
          isBoardOpen,
          isSwitcherOpen,
          awarenessElement: 'inbox',
        },
      });

      if (!memberId || memberId === 'me') {
        throw new Error('Valid member ID is required for inbox operations');
      }

      // Get inbox list ID - fetch if not cached
      let inboxListId = inboxIds.idList;
      let inboxBoardId = inboxIds.idBoard;
      if (!inboxListId || !inboxBoardId) {
        const { data } = await fetchInboxLazy({
          variables: { memberId },
        });
        inboxListId = data?.member?.inbox?.idList;
        inboxBoardId = data?.member?.inbox?.idBoard;
      }

      if (!inboxListId || !inboxBoardId) {
        throw new Error('Unable to find inbox list');
      }

      // Fetch existing inbox cards to calculate proper position
      const { data: cardsData } = await fetchInboxCards({
        variables: { inboxId: inboxBoardId },
      });

      // Calculate position to place at top - between 0 and first card
      const inboxCards = cardsData?.board?.cards || [];
      const sortedCards = [...inboxCards].sort((a, b) => a.pos - b.pos);
      const firstCardPos = sortedCards[0]?.pos ?? NULL_POS;
      const newPosition = calculatePosition(NULL_POS, firstCardPos);

      // Validate that we got a valid position
      if (!Number.isFinite(newPosition)) {
        throw new Error('Failed to calculate valid card position');
      }

      // Create the card with localized content
      const cardName = intl.formatMessage({
        id: 'templates.card_front.discovery.planner.title',
        defaultMessage: 'Protect your time with Planner',
        description: 'Planner Discovery card title',
      });

      const cardDesc = intl.formatMessage(
        {
          id: 'templates.card_front.discovery.planner.description',
          defaultMessage: `![Planner illustration]({plannerImage})**Trello Planner helps you take control of your time.**
Turn your to-dos into scheduled focus blocks on your calendar. See what matters, plan when to do it, and keep work moving. You can: - **Schedule time** for to-dos, emails, or Slack messages you've captured in Trello.
- **Sync with your calendars** so those focus time show up as events alongside your meetings.
- **Drag and drop** cards into Planner to block time, or link them to existing events. It's time blocking, built right into Trello.
[{supportLinkUrl}]({supportLinkUrl})`,
          description:
            'Planner Discovery card description with illustration and support link',
        },
        {
          plannerImage: plannerDiscoverySpotlightImage,
          supportLinkUrl:
            'https://support.atlassian.com/trello/docs/trello-planner/?utm_source=trello&utm_medium=card_description&utm_campaign=planner_discovery&utm_content=learn_link',
        },
      );

      const { data: cardData } = await createInboxCard({
        variables: {
          idList: inboxListId,
          name: cardName,
          desc: cardDesc,
          pos: newPosition,
          traceId,
        },
      });

      const newCardId = cardData?.createCard?.id;

      if (!newCardId) {
        throw new Error('Card creation succeeded but no card ID returned');
      }

      if (!inboxOpenRef.current) {
        const oneTimeMessageKey = `${PLANNER_DISCOVERY_CARD_ONE_TIME_MESSAGE}:${newCardId}`;
        await dismissOneTimeMessage(oneTimeMessageKey, { optimistic: false });
      } else {
        const oneTimeMessageKey = `${PLANNER_DISCOVERY_CARD_ONE_TIME_MESSAGE_DISMISSED}:${newCardId}`;
        await dismissOneTimeMessage(oneTimeMessageKey, { optimistic: false });
      }

      Analytics.sendTrackEvent({
        action: 'created',
        actionSubject: 'card',
        source: 'plannerDiscoverySpotlight',
        attributes: {
          taskId: traceId,
          cardId: newCardId,
          containerType: 'inbox',
        },
      });

      Analytics.taskSucceeded({
        taskName: 'create-card/list',
        source: 'plannerDiscoverySpotlight',
        traceId,
      });

      // Trigger inbox button animation for planner card creation
      triggerInboxAnimation();

      setIsCreatingCard(false);
      dismiss();
    } catch (error) {
      Analytics.taskFailed({
        taskName: 'create-card/list',
        source: 'plannerDiscoverySpotlight',
        traceId,
        error,
      });
      setIsCreatingCard(false);

      Analytics.sendTrackEvent({
        action: 'errored',
        actionSubject: 'card',
        source: 'plannerDiscoverySpotlight',
        attributes: {
          taskId: traceId,
          errorMessage:
            error instanceof Error ? error.message : 'Unknown error',
          errorType: 'inboxCardCreation',
        },
      });

      // Show error toast
      showFlag({
        id: 'plannerDiscoverySpotlightError' as FlagId,
        title: intl.formatMessage({
          id: 'templates.new_user_discovery.spotlight-planner-error',
          defaultMessage: "The card wasn't created. Try again.",
          description:
            'Error message when planner discovery spotlight fails to create inbox card',
        }),
        appearance: 'error',
        isAutoDismiss: true,
        msTimeout: 5000,
      });
    }
  }, [
    isCreatingCard,
    isInboxOpen,
    isBoardOpen,
    isSwitcherOpen,
    inboxIds.idList,
    inboxIds.idBoard,
    createInboxCard,
    dismiss,
    fetchInboxLazy,
    fetchInboxCards,
    memberId,
    dismissOneTimeMessage,
  ]);

  const handleOpen = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'plannerDiscoverySpotlightOpenButton',
      source: 'plannerDiscoverySpotlight',
      attributes: {
        isExistingUser: isEligibleExistingUser,
        awarenessElement: 'planner',
      },
    });
    togglePlanner();
    dismiss();
  }, [isEligibleExistingUser, togglePlanner, dismiss]);

  const onTargetClick = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'plannerPanelButton',
      source: 'plannerDiscoverySpotlight',
      attributes: {
        isInboxOpen: panels.inbox,
        isPlannerOpen: panels.planner,
        isBoardOpen: panels.board,
        isSwitcherOpen: panels.switcher,
        isExistingUser: isEligibleExistingUser,
        awarenessElement: 'planner',
      },
    });
    togglePlanner();
    dismiss();
  }, [
    panels.inbox,
    panels.planner,
    panels.board,
    panels.switcher,
    isEligibleExistingUser,
    togglePlanner,
    dismiss,
  ]);

  if (!isEligible || !isSpotlightActive) {
    return null;
  }

  // Existing users should only see Open/Dismiss (no Save to Inbox)
  const showSaveToInbox =
    isEligibleForSaveToInboxAction && !isEligibleExistingUser;

  return (
    <Spotlight
      key={PLANNER_DISCOVERY_SPOTLIGHT_TARGET}
      heading={intl.formatMessage({
        id: 'templates.new_user_discovery.spotlight-planner-title',
        defaultMessage: 'Protect your time with Trello Planner',
        description: 'Heading for planner discovery spotlight',
      })}
      target={PLANNER_DISCOVERY_SPOTLIGHT_TARGET}
      actions={[
        {
          text: intl.formatMessage({
            id: 'templates.new_user_discovery.spotlight-planner-open',
            defaultMessage: 'Open',
            description: 'Open button for planner discovery spotlight',
          }),
          onClick: handleOpen,
          appearance: 'primary',
          isDisabled: isCreatingCard,
        },
        {
          text: showSaveToInbox
            ? intl.formatMessage({
                id: 'templates.new_user_discovery.spotlight-planner-save-to-inbox',
                defaultMessage: 'Save to Inbox',
                description:
                  'Save to Inbox button for planner discovery spotlight',
              })
            : intl.formatMessage({
                id: 'templates.new_user_discovery.spotlight-planner-dismiss',
                defaultMessage: 'Dismiss',
                description: 'Dismiss button for planner discovery spotlight',
              }),
          onClick: showSaveToInbox ? handleSaveToInbox : handleDismiss,
          appearance: 'subtle',
          isLoading: isCreatingCard,
        },
      ]}
      image={plannerDiscoverySpotlightImage}
      dialogPlacement="top center"
      dialogWidth={390}
      targetRadius={3}
      targetBgColor={token('elevation.surface.overlay', '#FFFFFF')}
      targetOnClick={onTargetClick}
    >
      <div>
        {showSaveToInbox && (
          <Button
            iconBefore={
              <CloseIcon size="medium" color={token('color.text', '#172B4D')} />
            }
            onClick={handleCloseButton}
            className={styles.closeButton}
            aria-label={intl.formatMessage({
              id: 'templates.new_user_discovery.spotlight-planner-dismiss',
              defaultMessage: 'Dismiss',
              description: 'Dismiss button for planner discovery spotlight',
            })}
            appearance="subtle"
          />
        )}
        <FormattedMessage
          id="templates.new_user_discovery.spotlight-planner-description"
          defaultMessage="Connect your calendar, schedule your cards, and create focus time to get things done."
          description="Description for planner discovery spotlight"
        />
      </div>
    </Spotlight>
  );
};
