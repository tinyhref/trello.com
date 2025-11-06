import type {
  FunctionComponent,
  KeyboardEventHandler,
  MouseEventHandler,
} from 'react';
import { useCallback, useMemo } from 'react';

import ArchiveBoxIcon from '@atlaskit/icon/core/archive-box';
import Tooltip from '@atlaskit/tooltip';
import { Analytics } from '@trello/atlassian-analytics';
import { intl } from '@trello/i18n';
import { Button } from '@trello/nachos/button';

import { ShortcutTooltip } from 'app/src/components/ShortcutTooltip';
import type { CardFrontSource } from './CardFront';
import { useArchiveCard } from './useArchiveCard';

import * as styles from './CardFrontArchiveButton.module.less';

interface CardFrontArchiveButtonProps {
  label?: string;
  cardFrontSource?: CardFrontSource;
}

export const CardFrontArchiveButton: FunctionComponent<
  CardFrontArchiveButtonProps
> = ({ label, cardFrontSource }) => {
  const archiveCard = useArchiveCard();

  const handleAction = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'cardFrontArchiveButton',
      source: 'cardView',
    });

    archiveCard();
  }, [archiveCard]);

  const onClick = useCallback<MouseEventHandler>(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleAction();
    },
    [handleAction],
  );

  const handleKeyDown = useCallback<KeyboardEventHandler<HTMLButtonElement>>(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        handleAction();
      }
    },
    [handleAction],
  );

  const archiveLabel =
    label ??
    intl.formatMessage({
      id: 'templates.card_front.archive-card',
      defaultMessage: 'Archive card',
      description: 'Tooltip content for the archive card button',
    });

  const ArchiveButton = useMemo(
    () => (
      <Button
        aria-label={intl.formatMessage({
          id: 'templates.card_front.archive-card',
          defaultMessage: 'Archive card',
          description: 'Tooltip content for the archive card button',
        })}
        className={styles.archiveButton}
        onClick={onClick}
        iconBefore={
          <ArchiveBoxIcon label={archiveLabel} color="currentColor" />
        }
        onKeyDown={handleKeyDown}
      />
    ),
    [archiveLabel, handleKeyDown, onClick],
  );

  if (cardFrontSource === 'Planner') {
    return <Tooltip content={archiveLabel}>{ArchiveButton}</Tooltip>;
  }

  return (
    <ShortcutTooltip shortcutText={archiveLabel} shortcutKey="c">
      {ArchiveButton}
    </ShortcutTooltip>
  );
};
