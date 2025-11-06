import { type FunctionComponent } from 'react';

import { intl } from '@trello/i18n';
import { useCardId } from '@trello/id-context';

import { CardFrontArchiveButton } from 'app/src/components/CardFront/CardFrontArchiveButton';
import { CardFrontDeleteButton } from 'app/src/components/CardFront/CardFrontDeleteButton';
import { MirrorCardExpandToggle } from './MirrorCardExpandToggle';
import { MirrorCardFreeBadge } from './MirrorCardFreeBadge';
import { useGetMirrorCardPaidStatus } from './useGetMirrorCardPaidStatus';
import { useMirrorCardSourceId } from './useMirrorCardSourceId';

interface MirrorCardActionsProps {
  canShowArchiveButton: boolean;
}

export const MirrorCardActions: FunctionComponent<MirrorCardActionsProps> = ({
  canShowArchiveButton,
}) => {
  const cardId = useCardId();

  const isPremiumMirrorCard = useGetMirrorCardPaidStatus();

  const { mirrorCardError } = useMirrorCardSourceId(cardId);

  const isArchiveButtonVisible = canShowArchiveButton;

  const archiveLabel = isPremiumMirrorCard
    ? intl.formatMessage({
        id: 'templates.card_front.archive-card-mirror-card',
        defaultMessage: 'Archive Mirror card',
        description: 'Tooltip content for the archive mirror card button',
      })
    : intl.formatMessage({
        id: 'templates.card_front.archive-card-link-card',
        defaultMessage: 'Archive link card',
        description: 'Tooltip content for the archive link card button',
      });

  if (mirrorCardError === 'notFound') {
    return <CardFrontDeleteButton />;
  }

  if (!mirrorCardError) {
    return (
      <>
        <MirrorCardExpandToggle />
        {isArchiveButtonVisible && (
          <CardFrontArchiveButton label={archiveLabel} />
        )}
        <MirrorCardFreeBadge />
      </>
    );
  }

  return null;
};
