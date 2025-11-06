import type { FunctionComponent } from 'react';
import { useCallback, useContext } from 'react';

import { formatContainers } from '@trello/atlassian-analytics';
import {
  useBoardId,
  useCardId,
  useEnterpriseId,
  useListId,
  useWorkspaceId,
} from '@trello/id-context';

import { MirrorCard } from 'app/src/components/MirrorCard';
import { BoardCard } from './BoardCard';
import { CardFrontContext } from './CardFrontContext';
import { FullCoverCard } from './FullCoverCard';
import { LazyLinkCard } from './LazyLinkCard';
import { LoadingCard } from './LoadingCard';
import { MinimalCard } from './MinimalCard';
import { PlannerDiscoveryCard } from './PlannerDiscoveryCard';
import { SeparatorCard } from './SeparatorCard';
import { TrelloCard } from './TrelloCard';

interface CardFrontTypeProps {
  isMinimal?: boolean;
  name?: string;
  url?: string;
}

/**
 * Renders the card front component associated with a given card type.
 */
export const CardFrontType: FunctionComponent<CardFrontTypeProps> = ({
  isMinimal,
  name = '',
  url = '',
}) => {
  const cardId = useCardId();
  const boardId = useBoardId();
  const enterpriseId = useEnterpriseId();
  const listId = useListId();
  const workspaceId = useWorkspaceId();

  const { cardType, cardFrontSource } = useContext(CardFrontContext);

  // After board-canvas-modernization ships, these containers should be moved
  // within the components themselves.
  const getAnalyticsContainers = useCallback(() => {
    return formatContainers({
      idCard: cardId,
      boardId,
      idEnterprise: enterpriseId,
      idList: listId,
      idOrganization: workspaceId,
    });
  }, [cardId, boardId, enterpriseId, listId, workspaceId]);

  if (isMinimal) {
    return <MinimalCard name={name} url={url} />;
  }

  switch (cardType) {
    case 'board':
      return (
        <BoardCard
          boardUrl={name}
          analyticsContainers={getAnalyticsContainers()}
        />
      );

    case 'cover':
      return <FullCoverCard name={name} url={url} />;

    case 'loading':
      return <LoadingCard name={name} url={url} />;

    case 'link':
      return (
        <LazyLinkCard
          idCard={cardId}
          boardId={boardId}
          url={name}
          analyticsContainers={getAnalyticsContainers()}
          overrideWidthConstraint={cardFrontSource === 'Planner'}
        />
      );

    case 'separator':
      return <SeparatorCard analyticsContainers={getAnalyticsContainers()} />;

    case 'mirror':
      return <MirrorCard cardId={cardId} name={name} />;

    case 'planner-discovery':
      return <PlannerDiscoveryCard name={name} url={url} />;

    case 'default':
    default: {
      return <TrelloCard name={name} url={url} />;
    }
  }
};
