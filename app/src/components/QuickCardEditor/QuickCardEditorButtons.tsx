import cx from 'classnames';
import { useEffect, useMemo, useRef, type FunctionComponent } from 'react';
import { useIntl } from 'react-intl';

import { Popper } from '@atlaskit/popper';
import { useCanShowMirrorButton } from '@trello/business-logic-react/card';
import { useFeatureGate } from '@trello/feature-gate-client';
import { useBoardId, useCardId } from '@trello/id-context';
import { useIsInboxBoard } from '@trello/personal-workspace';
import { useSplitScreenSharedState } from '@trello/split-screen';
import type { QuickCardEditorTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { useBulkAction } from 'app/src/components/BulkAction';
import type { CardFrontSource } from 'app/src/components/CardFront/CardFront';
import { useCardType } from 'app/src/components/CardType';
import { inboxActionButtonPositionSharedState } from 'app/src/components/Inbox/inboxActionButtonPositionSharedState';
import { useGetMirrorCardPaidStatus } from 'app/src/components/MirrorCard/useGetMirrorCardPaidStatus';
import { useMirrorCardSourceId } from 'app/src/components/MirrorCard/useMirrorCardSourceId';
import { useIsSmartScheduleM1Enabled } from 'app/src/components/SmartSchedule/useIsSmartScheduleM1Enabled';
import { AddCardToPlannerButton } from './AddCardToPlannerButton';
import { ArchiveCardButton } from './ArchiveCardButton';
import { ChangeCoverButton } from './ChangeCoverButton';
import { ChangeMembersButton } from './ChangeMembersButton';
import { ConvertCardRoleButton } from './ConvertCardRoleButton';
import { CopyCardButton } from './CopyCardButton';
import { CopyCardLinkButton } from './CopyCardLinkButton';
import { DeleteCardButton } from './DeleteCardButton';
import { EditDatesButton } from './EditDatesButton';
import { EditLabelsButton } from './EditLabelsButton';
import { MirrorCardButton } from './MirrorCardButton';
import { MoveCardButton } from './MoveCardButton';
import { OpenCardButton } from './OpenCardButton';
import { PinCardButton } from './PinCardButton';
import { useQuickCardEditorBoardFragment } from './QuickCardEditorBoardFragment.generated';
import { useQuickCardEditorCardFrontFragment } from './QuickCardEditorCardFrontFragment.generated';
import { RemoveFromBoardButton } from './RemoveFromBoardButton';
import { ReorderCardInPlannerButton } from './ReorderCardInPlannerButton';
import { ScheduleCardButton } from './ScheduleCardButton';
import { UnlinkCardButton } from './UnlinkCardButton';

import * as styles from './QuickCardEditorButtons.module.less';

interface QuickCardEditorButtonsProps {
  editableCardFrontRef: React.MutableRefObject<HTMLDivElement | null>;
  onClose: () => void;
  cardFrontSource?: CardFrontSource;
  plannerEventCardId?: string;
}

const isNegativeXOffsetRegex = /^translate(3d|X)?\(-/i;

/**
 * A bit of a hack: when the editor buttons are automatically flipped on the
 * x-axis by Popper's recalculations, we want to align items to the right side,
 * rather than the left. Unfortunately, Popper doesn't offer a blessed way to
 * detect that a flip has occurred. As a workaround, we can sniff the transform
 * style returned from Popper for a negative x-offset.
 *
 * Note: we should verify that this style remains consistent between Popper
 * versions. From testing Popper@5.x, I believe `translate3d` is changed to
 * `translate`, hence the optional groups in the regex.
 */
const hasNegativeXOffset = (transform: string | undefined): boolean =>
  transform ? isNegativeXOffsetRegex.test(transform) : false;

// Helper to extract /c/{SHORTLINK} from a Trello card URL
const extractShortLinkUrl = (url?: string) => {
  if (!url) return url;
  const match = url.match(/^(.*\/c\/[a-z0-9]{8})/i);
  return match ? match[1] : url;
};

export const QuickCardEditorButtons: FunctionComponent<
  QuickCardEditorButtonsProps
> = ({
  editableCardFrontRef,
  onClose,
  cardFrontSource,
  plannerEventCardId,
}) => {
  const intl = useIntl();
  const boardId = useBoardId();
  const cardId = useCardId();
  const isInbox = useIsInboxBoard();
  const { value: pinCardFeatureFlag } = useFeatureGate(
    'trello_web_pinned_cards',
  );
  const { value: isPersonalProductivityEnabled } = useFeatureGate(
    'trello_personal_productivity_release',
  );

  const { isBulkActionV2Enabled, numSelectedCards } = useBulkAction();

  const isSmartScheduleM1Enabled = useIsSmartScheduleM1Enabled();
  const { areMultiplePanelsOpen, panels } = useSplitScreenSharedState();
  const position = inboxActionButtonPositionSharedState.value.position;
  const { data: board } = useQuickCardEditorBoardFragment({
    from: { id: boardId },
    optimistic: true,
  });

  const { data: card } = useQuickCardEditorCardFrontFragment({
    from: { id: cardId },
    optimistic: true,
  });

  const isBoardTemplate = board?.prefs?.isTemplate ?? false;
  const isCardTemplate = card?.isTemplate ?? false;
  const isClosed = card?.closed ?? false;
  const cardRole = card?.cardRole ?? null;
  const isPlannerCard = cardFrontSource === 'Planner';

  const cardType = useCardType(cardId);
  const canHaveMetadata = cardType === 'default';
  const canHaveCover = cardType === 'cover' || canHaveMetadata;

  const canShowMirrorButton = useCanShowMirrorButton();

  const isCardPinned = card?.pinned ?? false;
  // display quick card editor buttons on the bottom side of the card if the inbox panel is open in full window
  const isInboxPanelFullScreen = !areMultiplePanelsOpen && panels.inbox;
  const isPlannerOpen = panels.planner;
  const { mirrorCardError } = useMirrorCardSourceId(cardId);

  const isPaidMirrorCards = useGetMirrorCardPaidStatus();
  const copyLinkUrl = useMemo(() => {
    if (cardType === 'mirror') {
      const baseUrl = isPaidMirrorCards ? card?.url : card?.name;
      return extractShortLinkUrl(baseUrl);
    }

    return card?.url;
  }, [cardType, card?.url, card?.name, isPaidMirrorCards]);

  const shouldShowMirrorButton =
    (cardType === 'default' || cardType === 'cover') &&
    !isInbox &&
    canShowMirrorButton &&
    !isPlannerCard;

  const schedulePopperUpdateRef = useRef<(() => void) | undefined>(undefined);
  // The useEffect here helps re-render the quick card editor menu
  // whenever the card role changes. The re-render will prevent
  // the menu from being cut off.
  useEffect(() => {
    schedulePopperUpdateRef.current?.();
  }, [cardRole]);

  if (isBulkActionV2Enabled && numSelectedCards > 1) {
    return null;
  }

  return (
    <Popper
      placement={isInboxPanelFullScreen ? position : 'right-start'}
      referenceElement={editableCardFrontRef?.current ?? undefined}
    >
      {({ ref, style, update }) => {
        schedulePopperUpdateRef.current = update;
        return (
          <div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label={intl.formatMessage({
              id: 'templates.quick_card_editor.edit-card-options',
              defaultMessage: 'Edit card options',
              description: 'Title for the quick card editor dialog',
            })}
            style={style}
          >
            <ul
              data-testid={getTestId<QuickCardEditorTestIds>(
                'quick-card-editor-buttons',
              )}
              className={cx(
                styles.buttons,
                hasNegativeXOffset(style.transform) &&
                  styles[`buttons--flipped`],
                {
                  [styles.inboxCardButtons]:
                    isInboxPanelFullScreen && position === 'bottom-end',
                },
              )}
            >
              {isPlannerCard && plannerEventCardId && (
                <UnlinkCardButton
                  cardId={cardId}
                  plannerEventCardId={plannerEventCardId}
                  onClose={onClose}
                />
              )}
              {canHaveMetadata && (
                <OpenCardButton
                  onClose={onClose}
                  url={card?.url}
                  isPlannerCard={isPlannerCard}
                />
              )}
              {isPlannerCard && (
                <ReorderCardInPlannerButton onClose={onClose} cardId={cardId} />
              )}
              {canHaveMetadata && (
                <>
                  {pinCardFeatureFlag && (
                    <PinCardButton pinned={isCardPinned} onClose={onClose} />
                  )}
                  {!isInbox && !isPlannerCard && <EditLabelsButton />}
                  {!isInbox && !isPlannerCard && (
                    <ChangeMembersButton isBoardTemplate={isBoardTemplate} />
                  )}
                </>
              )}
              {isSmartScheduleM1Enabled && !isPlannerCard && (
                <ScheduleCardButton onClose={onClose} />
              )}
              {canHaveCover && <ChangeCoverButton />}
              {canHaveMetadata && !isPlannerCard && (
                <EditDatesButton
                  isCardTemplate={isCardTemplate}
                  due={card?.due}
                  start={card?.start}
                  dueReminder={card?.dueReminder}
                  isPlannerCard={isPlannerCard}
                />
              )}

              {!isPlannerCard &&
                (pinCardFeatureFlag ? (
                  !isCardPinned && (
                    <MoveCardButton
                      onClose={onClose}
                      isPlannerCard={isPlannerCard}
                    />
                  )
                ) : (
                  <MoveCardButton
                    onClose={onClose}
                    isPlannerCard={isPlannerCard}
                  />
                ))}
              <CopyCardButton onClose={onClose} />
              {copyLinkUrl && (
                <CopyCardLinkButton
                  url={copyLinkUrl}
                  isPlannerCard={isPlannerCard}
                />
              )}
              {shouldShowMirrorButton && <MirrorCardButton onClose={onClose} />}
              {isPersonalProductivityEnabled &&
                isPlannerOpen &&
                !isPlannerCard && <AddCardToPlannerButton onClose={onClose} />}
              <ConvertCardRoleButton />
              {cardType === 'mirror' ? (
                <RemoveFromBoardButton onClose={onClose} />
              ) : (
                <ArchiveCardButton
                  isCardTemplate={isCardTemplate}
                  isClosed={isClosed}
                  onClose={onClose}
                  isPlannerCard={isPlannerCard}
                />
              )}
              {cardType === 'mirror' && mirrorCardError === 'notFound' && (
                <DeleteCardButton />
              )}
            </ul>
          </div>
        );
      }}
    </Popper>
  );
};
