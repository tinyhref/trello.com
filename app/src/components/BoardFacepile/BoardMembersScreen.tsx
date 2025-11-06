import cx from 'classnames';
import type {
  ChangeEvent,
  FunctionComponent,
  MouseEvent as ReactMouseEvent,
} from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { Analytics } from '@trello/atlassian-analytics';
import { useBoardMembers } from '@trello/business-logic-react/board';
import { useAutoFocusRef } from '@trello/dom-hooks';
import { intl, TrelloIntlProvider } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import { Textfield } from '@trello/nachos/textfield';

import { searchFilter } from 'app/scripts/lib/util/text/search-filter';
import { useBoardMembershipGroupings } from './useBoardMembershipGroupings';
import { useOrderedFacepileMemberships } from './useOrderedFacepileMemberships';
import { useRenderAvatar } from './useRenderAvatar';

import * as styles from './BoardMembersScreen.module.less';

interface BoardMemberSectionProps {
  memberIds: string[];
  idBoard: string;
  title: string;
  hideHeading?: boolean;
  elementId: string;
  onClickMember: (idMember: string) => void;
  isFreeWorkspace: boolean;
  isAdminOfOrganization: ReturnType<
    typeof useBoardMembers
  >['isAdminOfOrganization'];
  isAdmin: ReturnType<typeof useBoardMembers>['isAdmin'];
  isDeactivated: ReturnType<typeof useBoardMembers>['isMemberDeactivated'];
  isGhost: ReturnType<typeof useBoardMembers>['isMemberGhost'];
  getMember: ReturnType<typeof useBoardMembers>['getMember'];
}

const BoardMemberSection: FunctionComponent<BoardMemberSectionProps> = ({
  memberIds,
  idBoard,
  title,
  hideHeading = false,
  elementId,
  onClickMember,
  isFreeWorkspace,
  isAdminOfOrganization,
  isAdmin,
  isGhost,
  isDeactivated,
  getMember,
}) => {
  const renderAvatar = useRenderAvatar({
    size: 30,
    mode: 'popover',
    idBoard,
    onClickMember,
    isFreeWorkspace,
    isAdminOfOrganization,
    isAdmin,
    isGhost,
    isDeactivated,
    getMember,
  });

  if (!memberIds.length) {
    return null;
  }

  return (
    <div role={'presentation'} aria-labelledby={elementId}>
      {!hideHeading && (
        <h2 className={styles.sectionHeader} id={elementId}>
          {title}
        </h2>
      )}
      <ul
        className={cx({
          [styles.avatarList]: true,
        })}
      >
        {memberIds.map((memberId) => {
          const classes = [styles.avatarContainer];
          if (!isDeactivated(memberId)) {
            classes.push('member', 'ignore-mousejs-cancel');
          }
          return (
            <span className={cx(...classes)} key={memberId} data-id={memberId}>
              {renderAvatar(memberId)}
            </span>
          );
        })}
      </ul>
    </div>
  );
};

interface BoardMembersScreenProps {
  idBoard: string;
  idOrganization: string;
  isFreeWorkspace: boolean;
  canInviteMembers: boolean;
  renderBoardInviteModal: (e: ReactMouseEvent<Element, MouseEvent>) => void;
  onClickMember: (idMember: string) => void;
}

export const BoardMembersScreen: FunctionComponent<BoardMembersScreenProps> = ({
  idBoard,
  idOrganization,
  renderBoardInviteModal,
  onClickMember,
  canInviteMembers,
  isFreeWorkspace,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const onChangeSearchQuery = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [],
  );

  const autofocusRef = useRef<HTMLInputElement>(null);
  useAutoFocusRef({ ref: autofocusRef });

  const isSearching = !!searchQuery.trim().length;

  const {
    getMember,
    isMemberDeactivated,
    isMemberGhost,
    isAdmin,
    isAdminOfOrganization,
  } = useBoardMembers(idBoard);
  const orderedMemberIds = useOrderedFacepileMemberships(idBoard);
  const memberIdsLength = orderedMemberIds?.length ?? 0;
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current && memberIdsLength > 0) {
      hasMounted.current = true;
      Analytics.sendScreenEvent({
        name: 'allBoardMembersInlineDialog',
        containers: {
          board: {
            id: idBoard,
          },
          organization: {
            id: idOrganization,
          },
        },
        attributes: {
          numMembers: memberIdsLength,
        },
      });
    }
  }, [idBoard, idOrganization, memberIdsLength]);

  const filteredOrderedMemberIds = useMemo(() => {
    if (!isSearching) {
      return orderedMemberIds;
    }
    const satisfiesSearch = searchFilter(searchQuery);
    return orderedMemberIds.filter((memberId) => {
      const member = getMember(memberId);

      if (!member) {
        return false;
      }

      return satisfiesSearch(
        [member['username'], member['fullName'], member['initials']]
          .filter(Boolean)
          .map((attr) => attr?.toLowerCase())
          .join(' '),
      );
    });
  }, [isSearching, searchQuery, orderedMemberIds, getMember]);

  const memberGroupings = useBoardMembershipGroupings(
    filteredOrderedMemberIds,
    idBoard,
    idOrganization,
  );

  const memberSections = useMemo(() => {
    return (
      <TrelloIntlProvider>
        <BoardMemberSection
          idBoard={idBoard}
          title={intl.formatMessage({
            id: 'templates.popover_board_header_all_members.members',
            defaultMessage: 'Members',
            description: 'Members',
          })}
          hideHeading={
            filteredOrderedMemberIds.length === memberGroupings.members.length
          }
          memberIds={memberGroupings.members}
          elementId={'member-section'}
          onClickMember={onClickMember}
          isAdmin={isAdmin}
          isAdminOfOrganization={isAdminOfOrganization}
          isDeactivated={isMemberDeactivated}
          isGhost={isMemberGhost}
          getMember={getMember}
          isFreeWorkspace={isFreeWorkspace}
        />
        <BoardMemberSection
          idBoard={idBoard}
          title={intl.formatMessage({
            id: 'templates.popover_board_header_all_members.team-members',
            defaultMessage: 'Workspace members',
            description: 'Workspace members',
          })}
          memberIds={memberGroupings.team}
          elementId={'team-member-section'}
          onClickMember={onClickMember}
          isAdmin={isAdmin}
          isAdminOfOrganization={isAdminOfOrganization}
          isDeactivated={isMemberDeactivated}
          isGhost={isMemberGhost}
          getMember={getMember}
          isFreeWorkspace={isFreeWorkspace}
        />
        <BoardMemberSection
          idBoard={idBoard}
          title={intl.formatMessage({
            id: 'templates.popover_board_header_all_members.shared-with',
            defaultMessage: 'Shared with',
            description: 'Shared with',
          })}
          memberIds={memberGroupings.invited}
          elementId={'invited-section'}
          onClickMember={onClickMember}
          isAdmin={isAdmin}
          isAdminOfOrganization={isAdminOfOrganization}
          isDeactivated={isMemberDeactivated}
          isGhost={isMemberGhost}
          getMember={getMember}
          isFreeWorkspace={isFreeWorkspace}
        />
        <BoardMemberSection
          idBoard={idBoard}
          title={intl.formatMessage({
            id: 'templates.popover_board_header_all_members.guests',
            defaultMessage: 'Guests',
            description: 'Guests',
          })}
          memberIds={memberGroupings.guest}
          elementId={'guest-section'}
          onClickMember={onClickMember}
          isAdmin={isAdmin}
          isAdminOfOrganization={isAdminOfOrganization}
          isDeactivated={isMemberDeactivated}
          isGhost={isMemberGhost}
          getMember={getMember}
          isFreeWorkspace={isFreeWorkspace}
        />
        <BoardMemberSection
          idBoard={idBoard}
          title={intl.formatMessage({
            id: 'templates.popover_board_header_all_members.observers',
            defaultMessage: 'Observers',
            description: 'Observers',
          })}
          memberIds={memberGroupings.observer}
          elementId={'observer-section'}
          onClickMember={onClickMember}
          isAdmin={isAdmin}
          isAdminOfOrganization={isAdminOfOrganization}
          isDeactivated={isMemberDeactivated}
          isGhost={isMemberGhost}
          getMember={getMember}
          isFreeWorkspace={isFreeWorkspace}
        />
        <BoardMemberSection
          idBoard={idBoard}
          title={intl.formatMessage({
            id: 'templates.popover_board_header_all_members.deactivated',
            defaultMessage: 'Deactivated',
            description: 'Deactivated',
          })}
          memberIds={memberGroupings.deactivated}
          elementId={'deactivated-section'}
          onClickMember={onClickMember}
          isAdmin={isAdmin}
          isAdminOfOrganization={isAdminOfOrganization}
          isDeactivated={isMemberDeactivated}
          isGhost={isMemberGhost}
          getMember={getMember}
          isFreeWorkspace={isFreeWorkspace}
        />
      </TrelloIntlProvider>
    );
  }, [
    filteredOrderedMemberIds.length,
    getMember,
    idBoard,
    isAdmin,
    isAdminOfOrganization,
    isFreeWorkspace,
    isMemberDeactivated,
    isMemberGhost,
    memberGroupings.deactivated,
    memberGroupings.guest,
    memberGroupings.invited,
    memberGroupings.members,
    memberGroupings.observer,
    memberGroupings.team,
    onClickMember,
  ]);

  return (
    <div>
      <Textfield
        placeholder={intl.formatMessage({
          id: 'templates.popover_board_header_all_members.search-board-members',
          defaultMessage: 'Search members',
          description: 'Search members',
        })}
        aria-label={intl.formatMessage({
          id: 'templates.popover_board_header_all_members.search-board-members',
          defaultMessage: 'Search members',
          description: 'Search members',
        })}
        value={searchQuery}
        onChange={onChangeSearchQuery}
        ref={autofocusRef}
        className={styles.textfield}
      />
      {memberSections}
      {filteredOrderedMemberIds.length === 0 && (
        <div className={styles.noResults}>
          <p>
            {canInviteMembers ? (
              <FormattedMessage
                id="templates.popover_board_header_all_members.not-a-member-of-this-board"
                defaultMessage="This person is not a member of this board."
                description="The message that shows when a person is not a member of this board."
              />
            ) : (
              <FormattedMessage
                id="templates.popover_board_header_all_members.not-a-member-contact-admin"
                defaultMessage="This person is not a member of this board. To share this board with them, contact a board or Workspace admin."
                description="The message that shows when a person is not a member of this board, recommending contacting a board or workspace admin."
              />
            )}
            {canInviteMembers ? (
              <Button
                className={styles.shareLink}
                appearance="link"
                onClick={renderBoardInviteModal}
              >
                <FormattedMessage
                  id="templates.popover_board_header_all_members.share-board"
                  defaultMessage="Share board"
                  description="Share board"
                />
              </Button>
            ) : (
              <a
                className={styles.shareLink}
                target="_blank"
                href="https://help.trello.com/article/791-changing-permissions-on-a-board"
              >
                <FormattedMessage
                  id="templates.popover_board_header_all_members.learn-more"
                  defaultMessage="Learn more"
                  description="Learn more"
                />
              </a>
            )}
          </p>
        </div>
      )}
    </div>
  );
};
