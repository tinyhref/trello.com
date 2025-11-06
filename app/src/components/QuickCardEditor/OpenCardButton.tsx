import type { FunctionComponent, MouseEventHandler } from 'react';
import { useCallback, useContext, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { intl } from '@trello/i18n';
import { useCardId } from '@trello/id-context';
import { CardIcon } from '@trello/nachos/icons/card';
import type { QuickCardEditorTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';
import { getCardUrl } from '@trello/urls';

import { CardFrontContext } from 'app/src/components/CardFront/CardFrontContext';
import { stopPropagationAndPreventDefault } from 'app/src/stopPropagationAndPreventDefault';
import { QuickCardEditorButton } from './QuickCardEditorButton';

interface OpenCardButtonProps {
  onClose: () => void;
  url: string | undefined;
  isPlannerCard: boolean;
}

export const OpenCardButton: FunctionComponent<OpenCardButtonProps> = ({
  onClose,
  url,
  isPlannerCard,
}) => {
  const cardId = useCardId();
  const { openCardBackDialog } = useContext(CardFrontContext);

  const cardUrl = useMemo(() => {
    if (!url) return undefined;
    return getCardUrl({ url, id: cardId });
  }, [cardId, url]);

  const onClick = useCallback<MouseEventHandler>(
    (e) => {
      stopPropagationAndPreventDefault(e);
      openCardBackDialog(cardId);
      onClose();
    },
    [cardId, onClose, openCardBackDialog],
  );

  return (
    <QuickCardEditorButton
      href={cardUrl}
      icon={<CardIcon color="currentColor" size="small" />}
      onClick={onClick}
      testId={getTestId<QuickCardEditorTestIds>('quick-card-editor-open-card')}
      shortcutText={intl.formatMessage({
        id: 'templates.quick_card_editor.open-card',
        defaultMessage: 'Open card',
        description: 'Quick card editor Open card button',
      })}
      shortcutKey={isPlannerCard ? '' : 'Enter'}
      position="right"
    >
      <FormattedMessage
        id="templates.quick_card_editor.open-card"
        defaultMessage="Open card"
        description="Quick card editor Open card button"
      />
    </QuickCardEditorButton>
  );
};
