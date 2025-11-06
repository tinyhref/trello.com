import cx from 'classnames';
import type {
  FunctionComponent,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
} from 'react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useContext as useContext_selector } from 'use-context-selector';

import ArchiveBoxIcon from '@atlaskit/icon/core/archive-box';
import RadioUncheckedIcon from '@atlaskit/icon/core/radio-unchecked';
import SuccessIcon from '@atlaskit/icon/core/status-success';
import type { IconColor, TextColor } from '@atlaskit/tokens/css-type-schema';
import type { SourceType } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';
import { useMemberId } from '@trello/authentication';
import type { CardRole } from '@trello/card-roles';
import { sendErrorEvent } from '@trello/error-reporting';
import { useFeatureGate } from '@trello/feature-gate-client';
import { useBoardId, useCardId } from '@trello/id-context';
import { Button } from '@trello/nachos/button';
import { showFlag } from '@trello/nachos/experimental-flags';
import { Tooltip } from '@trello/nachos/tooltip';
import { useIsInboxBoard, useMemberInboxIds } from '@trello/personal-workspace';
import type { CardTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';
import { token } from '@trello/theme';

import { CardBackContext } from 'app/src/components/CardBack/CardBackContext';
import type { CardFrontSource } from 'app/src/components/CardFront/CardFront';
/**
 * This is the best way to add styles when the card front is hovered,
 * we have also added a condition so this styles only take place when the animateFromExternal is passed.
 */
// eslint-disable-next-line @trello/assets-alongside-implementation, @trello/less-matches-component
import * as cardFrontStyles from 'app/src/components/CardFront/CardFront.module.less';
import { CardFrontContext } from 'app/src/components/CardFront/CardFrontContext';
import { useArchiveCard } from 'app/src/components/CardFront/useArchiveCard';
import type { CardType } from 'app/src/components/CardType';
import { useCardType } from 'app/src/components/CardType';
import { useInboxMarkDone } from 'app/src/components/Inbox/InboxMarkDoneContext';
import { MirrorCardIdContext } from 'app/src/components/MirrorCard/MirrorCardIdContext';
import { useCardDoneStateCardInfoFragment } from './CardDoneStateCardInfo.generated';
import { CardDoneStateReadOnly } from './CardDoneStateReadOnly';
import { useUndoAutoArchivedCardMutation } from './UndoAutoArchivedCardMutation.generated';
import { useCanEditCardDoneState } from './useCanEditCardDoneState';
import { useIsCardMarkedComplete } from './useIsCardMarkedComplete';
import { useIsInboxAutoArchiveEnabled } from './useIsInboxAutoArchiveEnabled';
import { useUpdateDueCompletion } from './useUpdateDueCompletion';

import * as styles from './CardDoneState.module.less';

/**
 * The source of the card done state
 */
export type DoneStateSource =
  | CardFrontSource
  | 'Inbox'
  | 'Workspace'
  | 'YourCards';

export interface CardDoneStateProps {
  animateFromExternal?: boolean;
  buttonClassName?: string;
  cardSource?: DoneStateSource;
  children?: ReactNode;
  childrenClassName?: string;
  containerClassName?: string;
  readOnlyContainerClassName?: string;
  manualCompleteStyle?: boolean;
  readOnlyCustomIcon?: JSX.Element;
  showDoneStatebutton?: boolean;
  analyticsSource?: SourceType;
  successIconColor?: Exclude<TextColor, 'transparent'> | IconColor;
  uncheckedIconColor?:
    | Exclude<TextColor, 'transparent'>
    | IconColor
    | 'currentColor';
  isSmall?: boolean;
  isAriaHidden?: boolean;
}

const typeToRole = (cardType: CardType): CardRole => {
  if (
    cardType === 'default' ||
    cardType === 'cover' ||
    cardType === 'loading' ||
    cardType === 'planner-discovery'
  ) {
    return null;
  }
  return cardType;
};

const colorfulLineColors = [
  token('color.icon.accent.magenta', '#cd519d'),
  token('color.icon.success', '#22A06B'),
  token('color.icon.accent.purple', '#8270db'),
  token('color.icon.accent.orange', '#e56910'),
  token('color.icon.accent.blue', '#1d7afc'),
  token('color.icon.success', '#22A06B'),
  token('color.icon.accent.magenta', '#cd519d'),
  token('color.icon.accent.teal', '#2898bd'),
];

export const CardDoneState: FunctionComponent<CardDoneStateProps> = ({
  animateFromExternal,
  buttonClassName,
  cardSource,
  children,
  childrenClassName,
  containerClassName,
  readOnlyContainerClassName,
  manualCompleteStyle,
  readOnlyCustomIcon,
  showDoneStatebutton = true,
  analyticsSource = 'cardView',
  successIconColor,
  uncheckedIconColor,
  isSmall,
  isAriaHidden = false,
}) => {
  const intl = useIntl();
  const boardId = useBoardId();
  const memberId = useMemberId();
  const cardId = useCardId();
  const isInbox = useIsInboxBoard();
  const mirrorCardId = useContext(MirrorCardIdContext);

  const isInboxAutoArchiveEnabled = useIsInboxAutoArchiveEnabled();
  const { setHasMarkedDone } = useInboxMarkDone();

  const [isButtonAnimating, setIsButtonAnimating] = useState(false);
  const [isLineColorful, setIsLineColorful] = useState(false);

  const {
    cardType: cardTypeFront,
    cardFrontRef: { current: cardFront },
  } = useContext(CardFrontContext);
  const {
    cardType: cardTypeBack,
    dialogRef: { current: cardBack },
  } = useContext_selector(CardBackContext);
  const cardTypeOther = useCardType(cardId);

  const { data: card } = useCardDoneStateCardInfoFragment({
    from: { id: cardId },
    optimistic: true,
    // We need to return partial data because the recurrence info is not always available
    // This will not be needed once recurrence rule is added as a native field - BILLPLAT-3403
    returnPartialData: true,
  });

  /**
   * This logic is a little brittle intrinsically, but very reliable in
   * practice.
   */
  const hasCardFrontContext = !!cardFront;
  const hasCardBackContext = !!cardBack;

  /**
   * Using the cardType from the contexts allows us to see if the card
   * is being mirrored.
   */
  const cardType = hasCardFrontContext
    ? cardTypeFront
    : hasCardBackContext
      ? cardTypeBack
      : cardTypeOther;

  const { value: isRecurringTasksEnabled } = useFeatureGate(
    'billplat_recurring_tasks',
  );

  const hasCardCover = cardType === 'cover';
  const hasDueDate = !!card?.due;
  const hasLabels = !!card?.labels?.length;
  const hasCardMembers = !!card?.idMembers?.length;
  const hasCustomFields = !!card?.customFieldItems?.length; // TODO: seems like a type error here, customFieldItems is null in MultiBoardViews
  const hasRecurrence = isRecurringTasksEnabled && !!card?.recurrenceRule?.rule;

  const isComplete = useIsCardMarkedComplete(cardId);
  const canEditCardDoneState = useCanEditCardDoneState(boardId, memberId);
  const { idBoard: idInboxBoard } = useMemberInboxIds();
  const cardOpenedFromInbox = idInboxBoard && boardId === idInboxBoard;

  const [updateDueComplete] = useUpdateDueCompletion({
    analyticsSource,
  });

  const cardMarkedDoneFrom =
    cardSource === 'Planner'
      ? 'planner'
      : cardOpenedFromInbox
        ? 'inbox'
        : undefined;

  const archiveCard = useArchiveCard({
    source: analyticsSource,
    shouldShowFlag: false,
    // if we have a mirror card ID, we want to archive that instead of the source card
    targetCardId: mirrorCardId ?? cardId,
  });

  const [undoAutoArchivedCard] = useUndoAutoArchivedCardMutation();

  const handleUndoArchiveCard = useCallback(async () => {
    const taskName = isInbox ? 'edit-inbox-card/unarchive' : 'edit-card/closed';
    const traceId = Analytics.startTask({
      taskName,
      source: 'autoArchiveFlag',
    });
    try {
      await undoAutoArchivedCard({
        variables: {
          idCard: mirrorCardId ?? cardId,
          traceId,
        },
      });
      Analytics.taskSucceeded({
        taskName,
        source: 'autoArchiveFlag',
        traceId,
      });
      Analytics.sendTrackEvent({
        action: 'unarchived',
        actionSubject: 'card',
        source: analyticsSource,
        attributes: {
          isUndoAutoArchive: true,
          containerType: isInbox ? 'inbox' : undefined,
        },
      });
    } catch (error) {
      Analytics.taskFailed({
        taskName,
        source: 'autoArchiveFlag',
        traceId,
        error,
      });

      sendErrorEvent(error, {
        tags: {
          ownershipArea: 'trello-web-eng',
          feature: 'Inbox Auto Archive',
        },
      });
    }
  }, [undoAutoArchivedCard, cardId, isInbox, analyticsSource, mirrorCardId]);

  const handleArchiveCard = useCallback(async () => {
    const { success } = await archiveCard();
    if (success) {
      const dismissFlag = showFlag({
        testId: getTestId<CardTestIds>('card-done-state-auto-archive'),
        id: 'card-done-state-auto-archive',
        title: intl.formatMessage(
          {
            id: 'templates.card-done-state.card-auto-archived',
            defaultMessage: '{cardName} auto-archived',
            description: 'Card auto-archived title',
          },
          { cardName: card?.name },
        ),
        icon: <ArchiveBoxIcon label="Archive" />,
        isAutoDismiss: true,
        msTimeout: 8000,
        actions: [
          {
            content: intl.formatMessage({
              id: 'templates.card-done-state.undo',
              defaultMessage: 'Undo',
              description: 'Undo button text',
            }),
            type: 'link',
            onClick: async () => {
              await handleUndoArchiveCard();
              dismissFlag();
            },
          },
        ],
        seed: card?.id,
      });
      Analytics.sendTrackEvent({
        action: 'archived',
        actionSubject: 'card',
        source: analyticsSource,
        attributes: {
          isAutoArchive: true,
          containerType: isInbox ? 'inbox' : undefined,
        },
      });
    } else {
      sendErrorEvent(new Error('Failed to auto archive inbox card'), {
        tags: {
          ownershipArea: 'trello-web-eng',
          feature: 'Inbox Auto Archive',
        },
      });
    }
  }, [
    archiveCard,
    card?.name,
    card?.id,
    handleUndoArchiveCard,
    isInbox,
    analyticsSource,
    intl,
  ]);

  const handleDoneStatusUpdate = useCallback(async () => {
    if (isComplete) {
      setIsLineColorful(false);
      setIsButtonAnimating(false);
    } else {
      const randomValue = Math.random();

      setIsLineColorful(randomValue < 0.05);
      setIsButtonAnimating(true);
    }

    await updateDueComplete(!isComplete, {
      containerType: cardMarkedDoneFrom,
      cardRole: typeToRole(cardType),
      hasCardCover,
      hasDueDate,
      hasLabels,
      hasCardMembers,
      hasCustomFields,
    });

    // if card is not complete and we get to this point, its because the status is changing to complete and we can archive the card
    if (!isComplete && isInboxAutoArchiveEnabled && isInbox) {
      if (!hasRecurrence) {
        handleArchiveCard();
      }
      setHasMarkedDone(true);
    }
  }, [
    updateDueComplete,
    isComplete,
    cardType,
    hasCardCover,
    hasDueDate,
    hasLabels,
    hasCardMembers,
    hasCustomFields,
    cardMarkedDoneFrom,
    handleArchiveCard,
    isInboxAutoArchiveEnabled,
    isInbox,
    setHasMarkedDone,
    hasRecurrence,
  ]);

  const updateCardDoneStatus: MouseEventHandler<HTMLButtonElement> =
    useCallback(
      async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await handleDoneStatusUpdate();
      },
      [handleDoneStatusUpdate],
    );

  const handleKeyDown = useCallback<KeyboardEventHandler<HTMLButtonElement>>(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        handleDoneStatusUpdate();
      }
    },
    [handleDoneStatusUpdate],
  );

  const getLineColor = useCallback(
    (index: number) => {
      if (successIconColor) {
        return successIconColor;
      }

      if (isLineColorful) {
        return colorfulLineColors[index];
      }
      return token('color.icon.success', '#22A06B');
    },
    [isLineColorful, successIconColor],
  );

  const resetAnimation = useCallback(() => {
    setIsLineColorful(false);
    setIsButtonAnimating(false);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleReducedMotionChange = () => {
      setIsButtonAnimating(false);
    };

    mediaQuery.addEventListener('change', handleReducedMotionChange);
    return () =>
      mediaQuery.removeEventListener('change', handleReducedMotionChange);
  }, []);

  if (!canEditCardDoneState) {
    return (
      <CardDoneStateReadOnly
        isComplete={isComplete}
        buttonClassName={buttonClassName}
        containerClassName={containerClassName}
        readOnlyContainerClassName={readOnlyContainerClassName}
        readOnlyCustomIcon={readOnlyCustomIcon}
        cardSource={cardSource}
        isSmall={isSmall}
      >
        {children}
      </CardDoneStateReadOnly>
    );
  }

  return (
    <div
      data-testid={getTestId<CardTestIds>('card-done-state')}
      className={cx(containerClassName, {
        [styles.cardDoneState]: true,
        [cardFrontStyles.cardFrontAnimateDoneState]: animateFromExternal,
      })}
    >
      {showDoneStatebutton && (
        <Tooltip
          content={
            isComplete
              ? intl.formatMessage({
                  id: 'templates.card-done-state.mark-incomplete',
                  defaultMessage: 'Mark incomplete',
                  description: 'Tooltip text for marking a card as incomplete',
                })
              : intl.formatMessage({
                  id: 'templates.card-done-state.mark-complete',
                  defaultMessage: 'Mark complete',
                  description: 'Tooltip text for marking a card as complete',
                })
          }
          position="top"
          tag="span"
        >
          <div className={styles.animationContainer}>
            <Button
              className={cx(buttonClassName, {
                [styles.checkmarkButton]: true,
                [cardFrontStyles.buttonAnimation]:
                  children && !isComplete && animateFromExternal,
                [styles.buttonAnimation]:
                  children && !isComplete && !animateFromExternal,
              })}
              onClick={updateCardDoneStatus}
              appearance="subtle"
              data-testid={getTestId<CardTestIds>(
                'card-done-state-completion-button',
              )}
              onKeyDown={handleKeyDown}
              {...(isAriaHidden ? { 'aria-hidden': true, tabIndex: -1 } : {})}
            >
              <div
                className={cx({
                  [styles.iconContainer]: true,
                  [styles.buttonRotatingAnimation]: isButtonAnimating,
                  [styles.iconContainerSmall]: isSmall,
                })}
                data-testid="card-done-state-icon-container"
              >
                {isComplete ? (
                  <SuccessIcon
                    label={intl.formatMessage(
                      {
                        id: 'templates.card-done-state.mark-this-card-incomplete',
                        defaultMessage:
                          'Mark this card incomplete ({cardName})',
                        description: 'Label for marking a card as incomplete',
                      },
                      {
                        cardName: card?.name,
                      },
                    )}
                    color={
                      successIconColor ?? token('color.icon.success', '#22A06B')
                    }
                  />
                ) : (
                  <RadioUncheckedIcon
                    color={
                      uncheckedIconColor ??
                      token('color.icon.subtle', '#626F86')
                    }
                    label={intl.formatMessage(
                      {
                        id: 'templates.card-done-state.mark-this-card-complete',
                        defaultMessage: 'Mark this card complete ({cardName})',
                        description: 'Label for marking a card as complete',
                      },
                      {
                        cardName: card?.name,
                      },
                    )}
                  />
                )}
              </div>
              {isButtonAnimating && (
                <div
                  className={cx(styles.linesContainer, {
                    [styles.linesContainerSmall]: isSmall,
                  })}
                  data-testid="card-done-state-lines"
                >
                  {Array.from({ length: 8 }, (_, index) => index).map(
                    (index) => (
                      <div
                        key={index}
                        data-testid={`card-done-state-line-${index}`}
                        className={cx({
                          [styles.line]: true,
                          [styles.lineAnimation]: true,

                          [styles.lineAnimationSmall]: isSmall,
                        })}
                        style={{
                          backgroundColor: getLineColor(index),
                        }}
                        onAnimationEnd={resetAnimation}
                      />
                    ),
                  )}
                </div>
              )}
            </Button>
          </div>
        </Tooltip>
      )}

      {children && (
        <span
          className={cx(childrenClassName, {
            [styles.cardTitle]: true,
            [cardFrontStyles.cardTitleAnimation]:
              !isComplete && showDoneStatebutton,
            [styles.cardTitleAnimation]:
              !isComplete && !animateFromExternal && showDoneStatebutton,
            [styles.isComplete]: isComplete && !manualCompleteStyle,
          })}
        >
          {children}
        </span>
      )}
    </div>
  );
};
