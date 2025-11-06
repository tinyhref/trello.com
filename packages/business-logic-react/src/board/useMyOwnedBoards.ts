import { useMemo } from 'react';

import { useMemberId } from '@trello/authentication';
import { getMyOwnedBoards } from '@trello/business-logic/board';

import type { MyOwnedBoardsFragment } from './MyOwnedBoardsFragment.generated';
import { useMyOwnedBoardsFragment } from './MyOwnedBoardsFragment.generated';

type Organization = NonNullable<MyOwnedBoardsFragment>['organizations'][number];

export const useMyOwnedBoards = () => {
  const memberId = useMemberId();
  const { data: member } = useMyOwnedBoardsFragment({
    from: {
      id: memberId,
    },
  });

  const boardsWithOrganizations = useMemo(() => {
    if (!member?.organizations) {
      return [];
    }

    const boards = [];
    const organizationsMap = new Map<string, Organization>();
    member.organizations.forEach((organization) =>
      organizationsMap.set(organization.id, organization),
    );

    // eslint-disable-next-line no-unsafe-optional-chaining
    for (const board of member?.boards) {
      boards.push({
        ...board,
        organization: board.idOrganization
          ? (organizationsMap.get(board.idOrganization) ?? null)
          : null,
      });
    }

    return boards;
  }, [member]);

  if (!member?.boards) {
    return [];
  }

  return getMyOwnedBoards({
    ...member,
    boards: boardsWithOrganizations,
  });
};
