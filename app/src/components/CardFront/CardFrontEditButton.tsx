import type { KeyboardEventHandler, MouseEventHandler } from 'react';
import { forwardRef, useCallback, useContext, useMemo } from 'react';

import AtlasKitEditIcon from '@atlaskit/icon/core/edit';
import { Analytics } from '@trello/atlassian-analytics';
import type { CardRole } from '@trello/card-roles';
import { intl } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import { Tooltip } from '@trello/nachos/tooltip';
import type { CardFrontTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';
import { usePressTracing } from '@trello/ufo';

import { ShortcutTooltip } from 'app/src/components/ShortcutTooltip';
import type { CardFrontSource } from './CardFront';
import { CardFrontContext } from './CardFrontContext';

import * as styles from './CardFrontEditButton.module.less';

interface CardFrontEditButtonProps {
  /**
   * The role of the card
   */
  cardRole?: CardRole;
  /**
   * The name of the card to display in the edit button's aria-label.
   * For normal cards (cardRole is null), the name is included in the aria-label.
   * For special card types (board, link, mirror, separator), only "Edit card" is shown.
   */
  cardName?: string;
  cardFrontSource: CardFrontSource;
}

export const CardFrontEditButton = forwardRef<
  HTMLButtonElement,
  CardFrontEditButtonProps
>(({ cardRole, cardName, cardFrontSource }, ref) => {
  const { openQuickCardEditorOverlay } = useContext(CardFrontContext);
  const rawTraceInteraction = usePressTracing(
    'cardfront-view-quick-editor-press-tracing',
  );

  const traceInteraction = useCallback(
    (event?: Event | React.UIEvent<Element, UIEvent>) => {
      rawTraceInteraction(event);
    },
    [rawTraceInteraction],
  );
  const isPlannerCard = cardFrontSource === 'Planner';

  const handleAction = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'cardFrontEditButton',
      source: isPlannerCard ? 'plannerCardFront' : 'boardScreen',
    });
    openQuickCardEditorOverlay();
  }, [openQuickCardEditorOverlay, isPlannerCard]);

  const onClick = useCallback<MouseEventHandler>(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      traceInteraction(event); // trigger UFO tracing interaction
      handleAction();
    },
    [handleAction, traceInteraction],
  );

  const onKeyDown = useCallback<KeyboardEventHandler<HTMLButtonElement>>(
    (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        event.stopPropagation();
        handleAction();
      }
    },
    [handleAction],
  );

  const ariaLabel =
    cardRole === null && cardName
      ? intl.formatMessage(
          {
            id: 'templates.card_front.edit-card-name',
            defaultMessage: 'Edit card {cardName}',
            description: 'Edit card button',
          },
          {
            cardName,
          },
        )
      : intl.formatMessage({
          id: 'templates.card_front.edit-card',
          defaultMessage: 'Edit card',
          description: 'Edit card button',
        });

  const EditButton = useMemo(
    () => (
      <Button
        aria-label={ariaLabel}
        className={styles.editButton}
        iconBefore={
          <AtlasKitEditIcon
            label={intl.formatMessage({
              id: 'templates.card_front.edit-card',
              defaultMessage: 'Edit card',
              description: 'Edit card button',
            })}
            color="currentColor"
          />
        }
        onClick={onClick}
        onKeyDown={onKeyDown}
        ref={ref}
        testId={getTestId<CardFrontTestIds>('quick-card-editor-button')}
      />
    ),
    [ariaLabel, onClick, onKeyDown, ref],
  );

  if (isPlannerCard) {
    return (
      <Tooltip
        content={intl.formatMessage({
          id: 'templates.card_front.edit-card',
          defaultMessage: 'Edit card',
          description: 'Edit card tooltip',
        })}
        isScreenReaderAnnouncementDisabled={true}
      >
        {EditButton}
      </Tooltip>
    );
  }

  return (
    <ShortcutTooltip
      shortcutText={intl.formatMessage({
        id: 'templates.card_front.edit-card',
        defaultMessage: 'Edit card',
        description: 'Edit card tooltip',
      })}
      isScreenReaderAnnouncementDisabled={true}
      shortcutKey="e"
    >
      {EditButton}
    </ShortcutTooltip>
  );
});
