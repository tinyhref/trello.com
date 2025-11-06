import { useMemo } from 'react';

import { useMemberId } from '@trello/authentication';
import { useBoardMembers } from '@trello/business-logic-react/board';
import { intl } from '@trello/i18n';
import { useBoardId } from '@trello/id-context';

import { useMoveCardCurrentBoardFragment } from './MoveCardCurrentBoardFragment.generated';
import { useMoveCardMemberBoardsFragment } from './MoveCardMemberBoardsFragment.generated';

export interface DropdownOption {
  label: string;
  value: string;
  meta?: string;
}

export interface OrganizationOption {
  label: string;
  value: string;
  options: DropdownOption[];
}

export const useBoardOptionsSelect = () => {
  const memberId = useMemberId();
  const currentBoardId = useBoardId();

  const { data: memberBoardsData } = useMoveCardMemberBoardsFragment({
    from: { id: memberId },
  });

  const { data: currentBoardData } = useMoveCardCurrentBoardFragment({
    from: { id: currentBoardId },
  });

  const currentBoardName = currentBoardData?.name;

  const { isMember } = useBoardMembers(currentBoardId);
  const boardMember = isMember(memberId);

  const currentBoardEnterpriseId = currentBoardData?.idEnterprise;

  const isEnterpriseOwned = currentBoardData?.enterpriseOwned;

  const memberBoards = memberBoardsData?.boards;

  const currentString = intl.formatMessage({
    id: 'templates.popover_move_card.current',
    defaultMessage: '(current)',
    description:
      '(current) label on Select dropdown options on move card popover',
  });

  const boardOptions: OrganizationOption[] = useMemo(() => {
    if (!memberBoards?.length) {
      return [];
    }

    // This Map is built by iterating over the member’s boards and does 2 things:
    // 1. Sort boards by organization using orgId as a key
    // 2. Format organization and board data into value/label to pass to Board Select component

    const organizationIdToBoardOptionsMap = new Map<
      string,
      OrganizationOption
    >();

    const teamlessBoards: DropdownOption[] = [];

    for (const board of memberBoards) {
      if (currentBoardEnterpriseId && isEnterpriseOwned) {
        if (board?.idEnterprise !== currentBoardEnterpriseId) {
          continue; // Ignore boards that aren't in the enterprise if current board is enterprise
        }
      }

      const boardData: DropdownOption = {
        label: board.name,
        value: board.id,
        meta: board.id === currentBoardId ? currentString : undefined,
      };

      if (!board?.organization) {
        teamlessBoards.push(boardData);
      } else {
        const orgId = board?.organization?.id;

        if (organizationIdToBoardOptionsMap.has(orgId)) {
          organizationIdToBoardOptionsMap.get(orgId)!.options.push(boardData);
        } else {
          const orgData: OrganizationOption = {
            label: board.organization?.displayName,
            value: board.organization?.id,
            options: [boardData],
          };
          organizationIdToBoardOptionsMap.set(orgId, orgData);
        }
      }
    }

    // If the user is not a member of the current board then it needs
    // to be added separately because it won't be returned by MemberBoards
    if (!boardMember && currentBoardName && currentBoardData?.organization) {
      const currentBoardOrgId = currentBoardData?.organization?.id;

      const currentBoardOption: DropdownOption = {
        label: currentBoardName,
        value: currentBoardId,
        meta: currentString,
      };

      if (organizationIdToBoardOptionsMap.has(currentBoardOrgId)) {
        organizationIdToBoardOptionsMap
          .get(currentBoardOrgId)!
          .options.push(currentBoardOption);
      } else if (currentBoardOrgId) {
        const currentOrgData: OrganizationOption = {
          label: currentBoardData.organization?.displayName,
          value: currentBoardData.organization?.id,
          options: [currentBoardOption],
        };
        organizationIdToBoardOptionsMap.set(currentBoardOrgId, currentOrgData);
      }
    }

    // Sort list of boards for each organization
    organizationIdToBoardOptionsMap.forEach((organization) => {
      organization.options.sort((a, b) => a.label.localeCompare(b.label));
    });

    const teamlessBoardsOptions: OrganizationOption = {
      label: intl.formatMessage({
        id: 'templates.popover_move_card.boards',
        defaultMessage: 'Boards',
        description: 'Boards label for teamless boards',
      }),
      value: '',
      options: teamlessBoards.sort((a, b) => a.label.localeCompare(b.label)),
    };

    const options = [...organizationIdToBoardOptionsMap.values()].sort((a, b) =>
      a.label.localeCompare(b.label),
    );
    if (teamlessBoards.length > 0) {
      options.unshift(teamlessBoardsOptions);
    }

    return options;
  }, [
    memberBoards,
    boardMember,
    currentBoardName,
    currentBoardData?.organization,
    currentBoardEnterpriseId,
    isEnterpriseOwned,
    currentBoardId,
    currentString,
  ]);

  return boardOptions;
};
