import type { FunctionComponent } from 'react';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import { intl } from '@trello/i18n';
import { ArchiveIcon } from '@trello/nachos/icons/archive';
import type { QuickCardEditorTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { useArchiveCard } from 'app/src/components/CardFront/useArchiveCard';
import { QuickCardEditorButton } from './QuickCardEditorButton';

interface ArchiveCardButtonProps {
  isCardTemplate: boolean;
  isClosed: boolean;
  onClose: () => void;
  isPlannerCard: boolean;
}

export const ArchiveCardButton: FunctionComponent<ArchiveCardButtonProps> = ({
  isCardTemplate,
  isClosed,
  onClose,
  isPlannerCard,
}) => {
  const archiveCard = useArchiveCard({
    source: 'quickCardEditorInlineDialog',
    shouldShowFlag: false,
  });

  const onClick = useCallback(() => {
    archiveCard();
    onClose();
  }, [archiveCard, onClose]);

  if (isClosed) {
    return null;
  }

  return (
    <QuickCardEditorButton
      icon={<ArchiveIcon size="small" />}
      onClick={onClick}
      testId={getTestId<QuickCardEditorTestIds>('quick-card-editor-archive')}
      shortcutText={intl.formatMessage({
        id: 'templates.quick_card_editor.archive-card',
        defaultMessage: 'Archive card',
        description: 'Tooltip text for archiving a card',
      })}
      shortcutKey={isPlannerCard ? '' : 'c'}
      position="right"
    >
      {isCardTemplate ? (
        <FormattedMessage
          id="templates.quick_card_editor.hide-from-list"
          defaultMessage="Hide from list"
          description="Quick card editor Hide from list button"
        />
      ) : (
        <FormattedMessage
          id="templates.quick_card_editor.archive"
          defaultMessage="Archive"
          description="Quick card editor Archive button"
        />
      )}
    </QuickCardEditorButton>
  );
};
