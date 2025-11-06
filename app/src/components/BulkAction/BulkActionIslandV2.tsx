import cx from 'classnames';
import { useCallback, type FunctionComponent } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import ArrowRightIcon from '@atlaskit/icon/core/arrow-right';
import CalendarPlusIcon from '@atlaskit/icon/core/calendar-plus';
import CopyIcon from '@atlaskit/icon/core/copy';
import CrossIcon from '@atlaskit/icon/core/cross';
import TableCellMergeIcon from '@atlaskit/icon/core/table-cell-merge';
import { LabsLozenge } from '@trello/ai-labs';
import { FeedbackCollector } from '@trello/ai-labs/FeedbackCollector';
import { Analytics } from '@trello/atlassian-analytics';
import { smartScheduledCardsSharedState } from '@trello/business-logic/planner';
import { useFeatureGate } from '@trello/feature-gate-client';
import { BoardIdProvider } from '@trello/id-context';
import { Key, Scope, useShortcut } from '@trello/keybindings';
import { Popover, PopoverPlacement, usePopover } from '@trello/nachos/popover';
import { useSharedStateSelector } from '@trello/shared-state';

import {
  IslandNav,
  IslandNavButton,
  IslandNavSeparator,
} from 'app/src/components/IslandNav';
import { CopyCardPopover } from 'app/src/components/MoveCardPopover/CopyCardPopover';
import { MoveCardPopoverBulk } from 'app/src/components/MoveCardPopover/MoveCardPopoverBulk';
import {
  useIsSmartScheduleM2Enabled,
  useSmartScheduleCards,
} from 'app/src/components/SmartSchedule';
import { SmartScheduleNavigation } from 'app/src/components/SmartSchedule/SmartScheduleNavigation';
import { bulkActionSelectedCardsSharedState } from './bulkActionSelectedCardsSharedState';
import { useCardInfoFragment } from './CardInfoFragment.generated';
import { useBulkAction } from './useBulkAction';
import { useIsMergeCardsEnabled } from './useIsMergeCardsEnabled';
import { useMergeSelectedCards } from './useMergeSelectedCards';

import * as styles from './BulkActionIslandV2.module.less';

export interface BulkActionIslandV2Props {
  isVisible?: boolean;
}

export const BulkActionIslandV2: FunctionComponent<BulkActionIslandV2Props> = ({
  isVisible = false,
}) => {
  const intl = useIntl();

  const {
    isBulkActionEnabled,
    numSelectedCards,
    lastSelectedCardId,
    numBoardsWithSelectedCards,
  } = useBulkAction();
  const { value: isSmartScheduleEnabled } = useFeatureGate(
    'phx_smart_schedule_m1',
  );
  const isSmartScheduleM2Enabled = useIsSmartScheduleM2Enabled();
  const { handleSmartScheduleCards, smartScheduleTraceId } =
    useSmartScheduleCards();

  const { numProposedEvents } = useSharedStateSelector(
    smartScheduledCardsSharedState,
    useCallback(
      (state) => ({
        numProposedEvents: state.proposedEvents.length,
      }),
      [],
    ),
  );

  const cardInfo = useCardInfoFragment({
    from: {
      id: lastSelectedCardId,
    },
  }).data;

  const targetBoardId = cardInfo?.idBoard;
  const targetListId = cardInfo?.idList;

  const shouldShowMergeButton =
    useIsMergeCardsEnabled() && targetBoardId && targetListId;
  const shouldDisableMergeClick = numSelectedCards < 2;

  const {
    popoverProps: movePopoverProps,
    triggerRef: moveTriggerRef,
    toggle: toggleMove,
  } = usePopover({
    placement: PopoverPlacement.TOP,
  });

  const {
    popoverProps: copyPopoverProps,
    triggerRef: copyTriggerRef,
    toggle: toggleCopy,
  } = usePopover({
    placement: PopoverPlacement.TOP,
  });

  const unSelectAllCards = useCallback(() => {
    bulkActionSelectedCardsSharedState.setValue(() => ({
      selectedCards: {},
      isLoading: false,
    }));
  }, []);

  useShortcut(unSelectAllCards, {
    key: Key.Escape,
    scope: Scope.Default,
  });

  const mergeSelectedCards = useMergeSelectedCards({
    source: 'bulkActionIsland',
    targetBoardId: targetBoardId ?? '',
    targetListId: targetListId ?? '',
  });

  const handleMerge = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'mergeCardsButton',
      source: 'bulkActionIsland',
      attributes: {
        numSelectedCards,
        numBoardsWithSelectedCards,
      },
    });
    mergeSelectedCards();
  }, [mergeSelectedCards, numSelectedCards, numBoardsWithSelectedCards]);

  const handleSchedule = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'smartScheduleButton',
      source: 'bulkActionIsland',
      attributes: {
        numSelectedCards,
      },
    });

    handleSmartScheduleCards({ source: 'bulkActionIsland' });
  }, [handleSmartScheduleCards, numSelectedCards]);

  if (!isBulkActionEnabled) {
    return null;
  }

  if (numProposedEvents > 0 && !isSmartScheduleM2Enabled) {
    return (
      <>
        <IslandNav
          buttonGroupClassName={styles.buttonGroup}
          className={cx(styles.bulkActionIsland, {
            [styles.visible]: isVisible,
            [styles.hidden]: !isVisible,
          })}
        >
          <SmartScheduleNavigation />
        </IslandNav>

        <FeedbackCollector
          featureName={'smartScheduling'}
          flagTreatment
          traceId={smartScheduleTraceId.current}
        />
      </>
    );
  }

  const firstBoardId =
    Object.keys(bulkActionSelectedCardsSharedState.value.selectedCards)?.[0] ??
    '';

  return (
    <>
      <IslandNav
        buttonGroupClassName={styles.buttonGroup}
        className={cx(styles.bulkActionIsland, {
          [styles.visible]: isVisible,
          [styles.hidden]: !isVisible,
        })}
      >
        {isSmartScheduleEnabled && (
          <IslandNavButton
            icon={
              <CalendarPlusIcon
                label={intl.formatMessage({
                  id: 'templates.bulk-actions.schedule',
                  defaultMessage: 'Schedule',
                  description: 'Schedule icon label',
                })}
              />
            }
            onClick={handleSchedule}
            role="checkbox"
            title={intl.formatMessage({
              id: 'templates.bulk-actions.schedule',
              defaultMessage: 'Schedule',
              description: 'Schedule button label',
            })}
            label={
              <FormattedMessage
                id="templates.bulk-actions.schedule"
                defaultMessage="Schedule"
                description="Schedule button label"
              />
            }
            aria-label={intl.formatMessage({
              id: 'templates.bulk-actions.schedule',
              defaultMessage: 'Schedule',
              description: 'Schedule button label',
            })}
            showLabels
          />
        )}
        {shouldShowMergeButton && (
          <IslandNavButton
            icon={
              <TableCellMergeIcon
                label={intl.formatMessage({
                  id: 'templates.bulk-actions.merge',
                  defaultMessage: 'Merge',
                  description: 'Merge icon label',
                })}
              />
            }
            onClick={handleMerge}
            role="checkbox"
            title={intl.formatMessage({
              id: 'templates.bulk-actions.merge',
              defaultMessage: 'Merge',
              description: 'Merge button label',
            })}
            label={
              <span className={styles.mergeLabel}>
                <FormattedMessage
                  id="templates.bulk-actions.merge"
                  defaultMessage="Merge"
                  description="Merge button label"
                />{' '}
                <LabsLozenge isDisabled={shouldDisableMergeClick} />
              </span>
            }
            aria-label={intl.formatMessage({
              id: 'templates.bulk-actions.merge',
              defaultMessage: 'Merge',
              description: 'Merge button label',
            })}
            showLabels
            isDisabled={shouldDisableMergeClick}
          />
        )}
        {numBoardsWithSelectedCards === 1 && (
          <>
            <IslandNavButton
              ref={moveTriggerRef}
              icon={
                <ArrowRightIcon
                  label={intl.formatMessage({
                    id: 'templates.bulk-actions.move',
                    defaultMessage: 'Move',
                    description: 'Move icon label',
                  })}
                />
              }
              onClick={toggleMove}
              isSelected={movePopoverProps.isVisible}
              role="checkbox"
              title={intl.formatMessage({
                id: 'templates.bulk-actions.move',
                defaultMessage: 'Move',
                description: 'Move button label',
              })}
              label={
                <FormattedMessage
                  id="templates.bulk-actions.move"
                  defaultMessage="Move"
                  description="Move button label"
                />
              }
              aria-label={intl.formatMessage({
                id: 'templates.bulk-actions.move',
                defaultMessage: 'Move',
                description: 'Move button label',
              })}
              showLabels
            />
            <IslandNavButton
              ref={copyTriggerRef}
              icon={
                <CopyIcon
                  label={intl.formatMessage({
                    id: 'templates.bulk-actions.copy',
                    defaultMessage: 'Copy',
                    description: 'Copy icon label',
                  })}
                />
              }
              onClick={toggleCopy}
              isSelected={copyPopoverProps.isVisible}
              role="checkbox"
              title={intl.formatMessage({
                id: 'templates.bulk-actions.copy',
                defaultMessage: 'Copy',
                description: 'Copy button label',
              })}
              label={
                <FormattedMessage
                  id="templates.bulk-actions.copy"
                  defaultMessage="Copy"
                  description="Copy button label"
                />
              }
              aria-label={intl.formatMessage({
                id: 'templates.bulk-actions.copy',
                defaultMessage: 'Copy',
                description: 'Copy button label',
              })}
              showLabels
            />
          </>
        )}
        <IslandNavSeparator />
        <IslandNavButton
          icon={
            <CrossIcon
              label={intl.formatMessage({
                id: 'templates.bulk-actions.unselect',
                defaultMessage: 'Unselect',
                description: 'Unselect icon label',
              })}
            />
          }
          onClick={unSelectAllCards}
          title={intl.formatMessage({
            id: 'templates.bulk-actions.unselect',
            defaultMessage: 'Unselect',
            description: 'Unselect button label',
          })}
          label={
            <FormattedMessage
              id="templates.bulk-actions.unselect"
              defaultMessage="Unselect"
              description="Unselect button label"
            />
          }
          aria-label={intl.formatMessage({
            id: 'templates.bulk-actions.unselect',
            defaultMessage: 'Unselect',
            description: 'Unselect button label',
          })}
          showLabels={false}
        />
      </IslandNav>
      <BoardIdProvider value={firstBoardId}>
        <Popover {...movePopoverProps}>
          <MoveCardPopoverBulk onClose={toggleMove} boardId={firstBoardId} />
        </Popover>
        <Popover {...copyPopoverProps}>
          <CopyCardPopover isBulk onClose={toggleCopy} />
        </Popover>
      </BoardIdProvider>
    </>
  );
};
