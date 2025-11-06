import type { FunctionComponent } from 'react';
import { useCallback, useMemo } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { idCache } from '@trello/id-cache';
import { hasValidInviteTokenForModel } from '@trello/invitation-tokens';
import { useBoardShortLink, useOrganizationName } from '@trello/router';

import { BigNav } from './BigNav';
import { useLoggedOutHeaderBoardQuery } from './LoggedOutHeaderBoardQuery.generated';
import { useLoggedOutHeaderOrganizationQuery } from './LoggedOutHeaderOrganizationQuery.generated';
import { SmallNav } from './SmallNav';

import './LoggedOutHeader.module.less';

type ModelType = 'Board' | 'Organization';

export const LoggedOutHeader: FunctionComponent = () => {
  const boardShortLink = useBoardShortLink();
  const orgName = useOrganizationName();

  const { data: boardData } = useLoggedOutHeaderBoardQuery({
    variables: {
      shortLink: boardShortLink || '',
    },
    skip: !boardShortLink,
    waitOn: ['CurrentBoardInfo'],
  });
  const { data: orgData } = useLoggedOutHeaderOrganizationQuery({
    variables: {
      orgId: orgName ? (idCache.getWorkspaceId(orgName) ?? orgName) : '',
    },
    skip: !orgName,
    waitOn: ['MemberHeader', 'MemberBoards'],
  });

  const board = boardData?.board;
  const boardId = board?.id;
  const boardOrgId = board?.idOrganization;
  const org = orgData?.organization;
  const orgId = org?.id;

  const { modelName, analyticsContainers } = useMemo((): {
    modelName: ModelType | '';
    analyticsContainers: object;
  } => {
    if (boardShortLink) {
      return {
        modelName: 'Board',
        analyticsContainers: {
          board: {
            id: boardId,
          },
          ...(boardOrgId
            ? {
                organization: {
                  id: boardOrgId,
                },
              }
            : {}),
        },
      };
    } else if (orgName) {
      return {
        modelName: 'Organization',
        analyticsContainers: {
          organization: {
            id: orgId,
          },
        },
      };
    }

    return { modelName: '', analyticsContainers: {} };
  }, [boardShortLink, orgName, boardId, boardOrgId, orgId]);

  const onSignupClick = useCallback(() => {
    if (modelName === 'Board' && board && hasValidInviteTokenForModel(board)) {
      Analytics.sendClickedButtonEvent({
        buttonName: 'headerSignupButton',
        source: 'acceptBoardInvitationScreen',
        containers: analyticsContainers,
      });
    } else if (
      modelName === 'Organization' &&
      org &&
      hasValidInviteTokenForModel(org)
    ) {
      Analytics.sendClickedButtonEvent({
        buttonName: 'headerSignupButton',
        source: 'acceptTeamInvitationScreen',
        containers: analyticsContainers,
      });
    }
  }, [modelName, board, org, analyticsContainers]);

  const onLoginClick = useCallback(() => {
    if (modelName === 'Board' && board && hasValidInviteTokenForModel(board)) {
      Analytics.sendClickedButtonEvent({
        buttonName: 'headerLoginButton',
        source: 'acceptBoardInvitationScreen',
        containers: analyticsContainers,
      });
    } else if (
      modelName === 'Organization' &&
      org &&
      hasValidInviteTokenForModel(org)
    ) {
      Analytics.sendClickedButtonEvent({
        buttonName: 'headerLoginButton',
        source: 'acceptTeamInvitationScreen',
        containers: analyticsContainers,
      });
    }
  }, [modelName, board, org, analyticsContainers]);

  return (
    <>
      <BigNav onLoginClick={onLoginClick} onSignupClick={onSignupClick} />
      <SmallNav onLoginClick={onLoginClick} onSignupClick={onSignupClick} />
    </>
  );
};
