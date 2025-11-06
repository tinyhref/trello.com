import { type FunctionComponent } from 'react';

import { CardIdProvider } from '@trello/id-context';

import { MirrorCardAgingUpdater } from './MirrorCardAgingUpdater';
import { MirrorCardIdProvider } from './MirrorCardIdContext';
import { MirrorCardType } from './MirrorCardType';
import { useMirrorCardUrlFragment } from './MirrorCardUrlFragment.generated';
import { useMirrorCardSourceId } from './useMirrorCardSourceId';

interface MirrorCardProps {
  cardId: string;
  name: string;
}

export const MirrorCard: FunctionComponent<MirrorCardProps> = ({
  cardId,
  name,
}) => {
  const { mirrorCardSourceId, mirrorCardError } = useMirrorCardSourceId(cardId);

  const { data: mirrorCard } = useMirrorCardUrlFragment({
    from: { id: cardId },
  });

  const cardIdForProvider = mirrorCardSourceId ?? cardId;

  return (
    <CardIdProvider value={cardIdForProvider}>
      <MirrorCardIdProvider value={cardId}>
        <MirrorCardType
          mirrorCardError={mirrorCardError}
          name={name}
          mirrorCardShortLink={mirrorCard?.shortLink ?? ''}
        />
        <MirrorCardAgingUpdater mirrorCardId={cardId} />
      </MirrorCardIdProvider>
    </CardIdProvider>
  );
};
