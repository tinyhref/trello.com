import cx from 'classnames';
import {
  useCallback,
  useContext,
  useRef,
  useState,
  type FunctionComponent,
} from 'react';

import { useIsTemplateCard } from '@trello/business-logic-react/card';
import { useFeatureGate } from '@trello/feature-gate-client';
import { useCardId } from '@trello/id-context';
import { useIsInboxBoard } from '@trello/personal-workspace';
import { useSharedStateSelector } from '@trello/shared-state';

import { useCanEditBoard } from 'app/src/components/BoardPermissionsContext';
import { useCardHasRecurrence } from 'app/src/components/CardDoneState/useCardHasRecurrence';
import { useIsCardMarkedComplete } from 'app/src/components/CardDoneState/useIsCardMarkedComplete';
import { useIsInboxAutoArchiveEnabled } from 'app/src/components/CardDoneState/useIsInboxAutoArchiveEnabled';
import type { CardType } from 'app/src/components/CardType';
import { MirrorCardActions } from 'app/src/components/MirrorCard';
import { noop } from 'app/src/noop';
import { activeCardSharedState } from './activeCardSharedState';
import { CardFrontArchiveButton } from './CardFrontArchiveButton';
import { useCardFrontCardInfoFragment } from './CardFrontCardInfoFragment.generated';
import { CardFrontContext } from './CardFrontContext';
import { CardFrontEditButton } from './CardFrontEditButton';
import { CardFrontUnlinkButton } from './CardFrontUnlinkButton';

// eslint-disable-next-line @trello/less-matches-component
import * as styles from './CardFront.module.less';

interface CardFrontActionsProps {
  cardType: CardType;
}

function CardFrontActionsInner({ cardType }: CardFrontActionsProps) {
  const [hasOpenPopover, setHasOpenPopover] = useState(false);

  const { editButtonRef, cardFrontSource } = useContext(CardFrontContext);

  const cardId = useCardId();
  const isCardActive = useSharedStateSelector(
    activeCardSharedState,
    useCallback(({ idActiveCard }) => idActiveCard === cardId, [cardId]),
  );

  const { value: isRecurrenceEnabled } = useFeatureGate(
    'billplat_recurring_tasks',
  );

  const { data: card } = useCardFrontCardInfoFragment({
    from: { id: cardId },
  });

  const cardName = card?.name;
  const cardRole = card?.cardRole;
  const isComplete = useIsCardMarkedComplete(cardId);
  const cardRecurrence = useCardHasRecurrence(cardId);
  const hasRecurrence = isRecurrenceEnabled && cardRecurrence;
  const isArchived = card?.closed;
  const isTemplate = useIsTemplateCard(cardId);
  const isInbox = useIsInboxBoard();
  const isInboxAutoArchiveEnabled = useIsInboxAutoArchiveEnabled();
  const previousIsComplete = useRef(isComplete);

  // Determine if the archive button should be hidden while auto archiving *before* we update the ref
  const shouldHideArchiveButtonWhileAutoArchiving =
    isComplete &&
    !previousIsComplete.current &&
    isInbox &&
    isInboxAutoArchiveEnabled;

  previousIsComplete.current = isComplete;

  const isArchiveButtonVisible =
    !shouldHideArchiveButtonWhileAutoArchiving &&
    isComplete &&
    !isArchived &&
    !isTemplate &&
    cardType !== 'separator' &&
    !hasRecurrence;

  const isEditButtonVisible = !isArchived;
  const canShowArchiveButtonOnMirrorCard = !isArchived;
  const isPlannerCard = cardFrontSource === 'Planner';

  return (
    <div
      // Because we disable focus management inside planner cards, the action buttons will unmount when the user opens the
      // unlink confirmation popover, which causes it to reposition to the top left corner of the screen. This is a workaround
      // to keep the buttons from unmounting until we find a solution to the jitter bug that doesn't require disabling focus
      // management.
      className={cx(
        styles.cardFrontActions,
        (isCardActive || hasOpenPopover) &&
          styles['cardFrontActions--isCardActive'],
      )}
    >
      {cardType === 'mirror' && (
        <MirrorCardActions
          canShowArchiveButton={canShowArchiveButtonOnMirrorCard}
        />
      )}
      {isArchiveButtonVisible && (
        <CardFrontArchiveButton cardFrontSource={cardFrontSource ?? 'Board'} />
      )}
      {isPlannerCard && (
        <CardFrontUnlinkButton onPopoverStateChange={setHasOpenPopover} />
      )}
      {isEditButtonVisible && (
        <CardFrontEditButton
          ref={editButtonRef}
          cardRole={cardRole}
          cardName={cardName}
          cardFrontSource={cardFrontSource ?? 'Board'}
        />
      )}
    </div>
  );
}

export const CardFrontActions: FunctionComponent<CardFrontActionsProps> = ({
  cardType,
}) => {
  const canEditBoard = useCanEditBoard();
  const { cardFrontSource } = useContext(CardFrontContext);
  const isPlannerCard = cardFrontSource === 'Planner';

  if (isPlannerCard && canEditBoard) {
    return <CardFrontActionsInner cardType={cardType} />;
  }

  // Only unlink button should appear on planner cards if user does not have edit permissions.
  if (isPlannerCard && !canEditBoard) {
    return (
      <div className={styles.cardFrontActions}>
        <CardFrontUnlinkButton onPopoverStateChange={noop} />
      </div>
    );
  }

  // In all other cases where we don't have edit permissions, we should not render any buttons.
  if (!canEditBoard) {
    return null;
  }

  return <CardFrontActionsInner cardType={cardType} />;
};
