import { useCallback, useState, type FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import ArrowsDiagonalUpRightDownLeftIcon from '@atlaskit/icon-lab/core/arrows-diagonal-up-right-down-left';
import { sendErrorEvent } from '@trello/error-reporting';
import { intl } from '@trello/i18n';
import { showFlag } from '@trello/nachos/experimental-flags';
import { Popover, usePopover } from '@trello/nachos/popover';

import { usePlannerEventCardReorder } from 'app/src/components/Planner/EventDetailPopover/usePlannerEventCardReorder';
import { useSortedPlannerEventCards } from 'app/src/components/Planner/useSortedPlannerEventCards';
import { LazyReorderCardInPlannerContent } from './LazyReorderCardInPlannerContent';
import { QuickCardEditorButton } from './QuickCardEditorButton';

import * as styles from './ReorderCardInPlannerButton.module.less';

interface ReorderCardInPlannerButtonProps {
  onClose: () => void;
  cardId: string;
}

export const ReorderCardInPlannerButton: FunctionComponent<
  ReorderCardInPlannerButtonProps
> = ({ onClose, cardId }) => {
  const { triggerRef, popoverProps, hide, toggle } = usePopover();
  const { cards } = useSortedPlannerEventCards();
  const { reorderCard } = usePlannerEventCardReorder();

  const totalCards = cards?.edges?.length ?? 0;

  const currentCardIndex = cards?.edges?.findIndex((edge) => {
    const edgeCardObjectId = edge.node?.card?.objectId;
    if (!edgeCardObjectId) {
      return false;
    }

    return edgeCardObjectId === cardId;
  });

  const positionOptions = Array.from({ length: totalCards }, (_, index) => {
    const isCurrent = index === currentCardIndex;
    return {
      label: String(index + 1),
      value: index,
      meta: isCurrent
        ? intl.formatMessage({
            id: 'templates.popover_move_card.current',
            defaultMessage: '(current)',
            description:
              '(current) label on Select dropdown options on move card popover',
          })
        : undefined,
    };
  });

  const [selectedPosition, setSelectedPosition] = useState(
    currentCardIndex >= 0 ? currentCardIndex : 0,
  );

  const handlePositionChange = useCallback(
    (option: { label: string; value: number; meta?: string } | null) => {
      if (option !== null) {
        setSelectedPosition(option.value);
      }
    },
    [],
  );

  const handleSave = useCallback(async () => {
    if (currentCardIndex >= 0 && selectedPosition !== currentCardIndex) {
      try {
        hide();
        onClose();
        await reorderCard({
          cardId,
          newIndex: selectedPosition,
        });
      } catch (error) {
        sendErrorEvent(error, {
          tags: {
            component: 'ReorderCardInPlannerButton',
            action: 'reorderCard',
          },
          extraData: {
            cardId,
            currentCardIndex: String(currentCardIndex),
            selectedPosition: String(selectedPosition),
            totalCards: String(totalCards),
          },
        });

        showFlag({
          id: 'plannerCardReorderError',
          title: 'We were unable to reorder the card, please try again',
          appearance: 'error',
          isAutoDismiss: true,
        });
      }
    }
  }, [
    reorderCard,
    cardId,
    selectedPosition,
    currentCardIndex,
    totalCards,
    hide,
    onClose,
  ]);

  if (totalCards <= 1 || !cards) {
    return null;
  }

  return (
    <>
      <QuickCardEditorButton
        ref={triggerRef}
        icon={
          <div className={styles.iconWrapper}>
            <ArrowsDiagonalUpRightDownLeftIcon label="" />
          </div>
        }
        onClick={toggle}
      >
        <FormattedMessage
          id="templates.planner.reorder-card"
          defaultMessage="Reorder card"
          description="Button to reorder card in planner event"
        />
      </QuickCardEditorButton>
      <Popover
        {...popoverProps}
        size="medium"
        title={intl.formatMessage({
          id: 'templates.planner.reorder',
          defaultMessage: 'Reorder',
          description: 'Reorder card in Planner popover title',
        })}
        noHorizontalPadding
      >
        <LazyReorderCardInPlannerContent
          handleSave={handleSave}
          selectedPosition={selectedPosition}
          positionOptions={positionOptions}
          handlePositionChange={handlePositionChange}
        />
      </Popover>
    </>
  );
};
