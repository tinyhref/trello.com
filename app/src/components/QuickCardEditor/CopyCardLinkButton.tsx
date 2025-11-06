import type { FunctionComponent } from 'react';
import { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import LinkIcon from '@atlaskit/icon/core/link';
import SuccessIcon from '@atlaskit/icon/core/status-success';
import { isMac } from '@trello/browser';
import { intl } from '@trello/i18n';
import type { QuickCardEditorTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';
import { token } from '@trello/theme';

import { QuickCardEditorButton } from './QuickCardEditorButton';

interface CopyCardLinkButtonProps {
  url: string;
  isPlannerCard: boolean;
}

export const CopyCardLinkButton: FunctionComponent<CopyCardLinkButtonProps> = ({
  url,
  isPlannerCard,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const onClick = useCallback(() => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }, [url]);

  const shortcutText = isPlannerCard
    ? ''
    : isMac()
      ? 'Command + c'
      : 'Ctrl + c';

  return (
    <QuickCardEditorButton
      icon={
        isCopied ? (
          <SuccessIcon
            label={intl.formatMessage({
              id: 'templates.quick_card_editor.copied',
              defaultMessage: 'Copied',
              description: 'Quick card editor Copied message',
            })}
            color={token('color.icon.success', '#4bce97')}
          />
        ) : (
          <LinkIcon
            color="currentColor"
            label=""
            testId={getTestId<QuickCardEditorTestIds>(
              'quick-card-editor-copy-link-icon',
            )}
          />
        )
      }
      onClick={onClick}
      testId={getTestId<QuickCardEditorTestIds>('quick-card-editor-copy-link')}
      style={{
        display: 'flex',
        gap: token('space.100', '8px'),
      }}
      shortcutText={intl.formatMessage({
        id: 'templates.quick_card_editor.copy-link',
        defaultMessage: 'Copy link',
        description: 'Quick card editor Copy link button',
      })}
      shortcutKey={shortcutText}
      position="right"
    >
      <FormattedMessage
        id="templates.quick_card_editor.copy-link"
        defaultMessage="Copy link"
        description="Quick card editor Copy link button"
      />
    </QuickCardEditorButton>
  );
};
