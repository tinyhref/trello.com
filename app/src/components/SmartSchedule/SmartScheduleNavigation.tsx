import { useCallback, type FunctionComponent } from 'react';

import ArrowLeftIcon from '@atlaskit/icon/core/arrow-left';
import ArrowRightIcon from '@atlaskit/icon/core/arrow-right';
import CrossIcon from '@atlaskit/icon/core/cross';
import TasksIcon from '@atlaskit/icon/core/tasks';
import { useFeedbackCollector } from '@trello/ai-labs/FeedbackCollector';
import { Analytics } from '@trello/atlassian-analytics';
import { smartScheduledCardsSharedState } from '@trello/business-logic/planner';
import { Key, Scope, useShortcut } from '@trello/keybindings';
import { Button } from '@trello/nachos/button';
import { PLANNER_CONSTANTS, useCreatePlannerEvent } from '@trello/planner';
import { useSharedState } from '@trello/shared-state';
import { token } from '@trello/theme';

import * as styles from './SmartScheduleNavigation.module.less';

export const SmartScheduleNavigation: FunctionComponent = () => {
  const [{ activeIndex, proposedEvents }, setSmartScheduleSharedState] =
    useSharedState(smartScheduledCardsSharedState);

  const { getAnalyticsAttributes } = useFeedbackCollector({
    featureName: 'smartScheduling',
  });

  const createPlannerEvent = useCreatePlannerEvent({
    source: 'bulkActionIsland',
    optimisticEventPrefix: PLANNER_CONSTANTS.PROPOSED_EVENT_ID_PREFIX,
  });

  const handlePrevious = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'previousProposedEventButton',
      source: 'smartScheduler',
    });

    setSmartScheduleSharedState((prev) => {
      const lastActiveIndex = prev.activeIndex ?? 0;
      // support wrap around
      const previousIndex =
        lastActiveIndex - 1 < 0
          ? prev.proposedEvents.length - 1
          : lastActiveIndex - 1;
      return {
        ...prev,
        activeIndex: previousIndex,
      };
    });
  }, [setSmartScheduleSharedState]);

  const handleNext = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'nextProposedEventButton',
      source: 'smartScheduler',
    });

    setSmartScheduleSharedState((prev) => {
      const lastActiveIndex = prev.activeIndex ?? 0;
      // support wrap around
      const nextIndex =
        lastActiveIndex + 1 >= prev.proposedEvents.length
          ? 0
          : lastActiveIndex + 1;
      return {
        ...prev,
        activeIndex: nextIndex,
      };
    });
  }, [setSmartScheduleSharedState]);

  const handleClose = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'closeSmartSchedulerButton',
      source: 'smartScheduler',
      attributes: {
        eventCardIds: proposedEvents.map((event) => event.id),
        proposedEventsCount: proposedEvents.length,
        ...getAnalyticsAttributes({
          numInBatch: proposedEvents.length,
          fullyNegative: true,
        }),
      },
    });

    setSmartScheduleSharedState(() => ({
      activeIndex: null,
      isLoading: false,
      proposedEvents: [],
    }));
  }, [getAnalyticsAttributes, proposedEvents, setSmartScheduleSharedState]);

  const handleEscapeKeyPress = useCallback(() => {
    setSmartScheduleSharedState(() => ({
      activeIndex: null,
      isLoading: false,
      proposedEvents: [],
    }));

    Analytics.sendPressedShortcutEvent({
      shortcutName: 'clearSmartScheduledProposedEventsShortcut',
      source: 'smartScheduler',
      keyValue: Key.Escape,
      attributes: {
        ...getAnalyticsAttributes({
          numInBatch: proposedEvents.length,
          fullyNegative: true,
        }),
      },
    });
  }, [getAnalyticsAttributes, proposedEvents, setSmartScheduleSharedState]);

  useShortcut(handleEscapeKeyPress, {
    key: Key.Escape,
    scope: Scope.Default,
  });

  const handleScheduleAll = useCallback(async () => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'scheduleAllProposedEventsButton',
      source: 'smartScheduler',
      attributes: {
        proposedEventsCount: proposedEvents.length,
        eventCardIds: proposedEvents.map((event) => event.id),
        ...getAnalyticsAttributes({
          numInBatch: proposedEvents.length,
          fullyPositive: true,
        }),
      },
    });

    setSmartScheduleSharedState((prev) => ({
      ...prev,
      isLoading: true,
    }));

    try {
      const createEventPromises =
        smartScheduledCardsSharedState.value.proposedEvents.map((event) =>
          createPlannerEvent({
            eventCardId: event.id,
            startDate: event?.start ? new Date(event.start) : null,
            endDate: event?.end ? new Date(event.end) : null,
          }),
        );

      await Promise.all(createEventPromises);

      setSmartScheduleSharedState(() => ({
        activeIndex: null,
        isLoading: false,
        proposedEvents: [],
      }));
    } catch {
      setSmartScheduleSharedState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  }, [
    createPlannerEvent,
    getAnalyticsAttributes,
    proposedEvents,
    setSmartScheduleSharedState,
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.navigationGroup}>
        <Button
          iconBefore={
            <ArrowLeftIcon
              // TODO: i18n
              label="Previous"
              color={token('color.icon', '#44546F')}
            />
          }
          onClick={handlePrevious}
          appearance="subtle"
        />
        {/* TODO: i18n */}
        <span>
          Event {activeIndex !== null ? activeIndex + 1 : 0} of{' '}
          {proposedEvents.length}
        </span>
        <Button
          iconBefore={
            <ArrowRightIcon
              // TODO: i18n
              label="Next"
              color={token('color.icon', '#44546F')}
            />
          }
          onClick={handleNext}
          appearance="subtle"
        />
      </div>
      <div className={styles.verticalDivider} />
      <Button
        iconBefore={
          <TasksIcon
            // TODO: i18n
            label="Schedule all proposed events"
            color={token('color.icon.inverse', '#FFFFFF')}
          />
        }
        appearance="primary"
        className={styles.scheduleAllButton}
        onClick={handleScheduleAll}
      >
        {/* TODO: i18n */}
        Schedule all
      </Button>
      <Button
        iconBefore={
          <CrossIcon
            // TODO: i18n
            label="Close"
            color={token('color.icon', '#44546F')}
          />
        }
        onClick={handleClose}
        appearance="subtle"
      />
    </div>
  );
};
