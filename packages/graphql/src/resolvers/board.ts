import { Analytics } from '@trello/atlassian-analytics';
import { sendNetworkErrorEvent } from '@trello/error-reporting';
import { parseNetworkError } from '@trello/graphql-error-handling';
import type { SafeUrl } from '@trello/safe-urls';
import { sanitizeUrl } from '@trello/safe-urls';
import { getCsrfRequestPayload } from '@trello/session-cookie/csrf';

import { safeFetch, safeTrelloFetch } from '../fetch';
import type {
  Board_Prefs_Comments,
  Board_Prefs_Invitations,
  Board_Prefs_Voting,
  BoardDashboardViewTileArgs,
  BoardExportArgs,
  BoardStatsArgs,
  Input_Board_Prefs_SwitcherView,
  MutationAddBoardArgs,
  MutationAddMemberToBoardArgs,
  MutationBulkCopyCardsArgs,
  MutationBulkMoveCardsArgs,
  MutationCreateBoardInviteSecretArgs,
  MutationDeleteBoardArgs,
  MutationDeleteBoardPrivatePluginDataArgs,
  MutationDeleteTagArgs,
  MutationDisableBoardInviteSecretArgs,
  MutationDisableBoardPluginArgs,
  MutationEditTagArgs,
  MutationEnablePluginArgs,
  MutationMessageEmailKeyArgs,
  MutationRemoveMemberFromBoardArgs,
  MutationStartBoardExportArgs,
  MutationToggleTagArgs,
  MutationUpdateBackgroundPrefArgs,
  MutationUpdateBoardArgs,
  MutationUpdateBoardAutoArchivePrefArgs,
  MutationUpdateBoardBackgroundImageArgs,
  MutationUpdateBoardCardAgingPrefArgs,
  MutationUpdateBoardCardCoversPrefArgs,
  MutationUpdateBoardCommentsPrefArgs,
  MutationUpdateBoardHideVotesPrefArgs,
  MutationUpdateBoardInvitationsPrefArgs,
  MutationUpdateBoardMemberPermissionArgs,
  MutationUpdateBoardMyPrefsArgs,
  MutationUpdateBoardOrgArgs,
  MutationUpdateBoardSelfJoinPrefArgs,
  MutationUpdateBoardShowCompleteStatusPrefArgs,
  MutationUpdateBoardSwitcherViewsPrefArgs,
  MutationUpdateBoardTemplatePrefArgs,
  MutationUpdateBoardVisibilityArgs,
  MutationUpdateBoardVotingPrefArgs,
  MutationUpdateCalendarFeedEnabledPrefArgs,
  MutationUpdateCalendarKeyArgs,
  MutationUpdateEmailKeyArgs,
  MutationUpdateEmailPositionArgs,
  MutationUpdateHiddenPluginBoardButtonShortcutsArgs,
  QueryBoardActionsArgs,
  QueryBoardListsArgs,
  QueryBoardsSearchArgs,
} from '../generated';
import { isQueryInfo } from '../isQueryInfo';
import { prepareDataForApolloCache } from '../prepareDataForApolloCache';
import type { TrelloRestResolver } from '../types';

export const addBoard: TrelloRestResolver<MutationAddBoardArgs> = async (
  obj,
  args,
  context,
  info,
) => {
  const { traceId, ...body } = args;
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/boards`;
  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(traceId),
    },
    body: JSON.stringify({
      ...body,
      ...getCsrfRequestPayload(),
    }),
  });

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(traceId, trelloServerVersion);

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  const board = await response.json();

  return prepareDataForApolloCache(board, rootNode);
};

export const enablePlugin: TrelloRestResolver<
  MutationEnablePluginArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/boards/${{
    value: args.boardId,
    type: 'boardId',
  }}/boardPlugins`;
  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(args.traceId),
    },
    body: JSON.stringify({
      idPlugin: args.pluginId,
      ...getCsrfRequestPayload(),
    }),
  });

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(args.traceId, trelloServerVersion);

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  return prepareDataForApolloCache({ success: true }, rootNode);
};

export const disableBoardPlugin: TrelloRestResolver<
  MutationDisableBoardPluginArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/boards/${{
    value: args.boardId,
    type: 'boardId',
  }}/boardPlugins/${{
    value: args.boardPluginId,
    type: 'otherId',
  }}`;
  const response = await safeFetch(apiUrl, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(args.traceId),
    },
    body: JSON.stringify({
      ...getCsrfRequestPayload(),
    }),
  });

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(args.traceId, trelloServerVersion);

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  return prepareDataForApolloCache({ success: true }, rootNode);
};

export const deleteBoardPrivatePluginData: TrelloRestResolver<
  MutationDeleteBoardPrivatePluginDataArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/board/${{
    value: args.boardId,
    type: 'boardId',
  }}/privatePluginData/${{ value: args.pluginId, type: 'pluginId' }}`;

  const response = await safeFetch(apiUrl, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      ...getCsrfRequestPayload(),
    }),
  });

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  return prepareDataForApolloCache({ success: true }, rootNode);
};

export const updateBoardOrg: TrelloRestResolver<
  MutationUpdateBoardOrgArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/boards/${{
    value: args.boardId,
    type: 'boardId',
  }}`;
  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(args.traceId),
    },
    body: JSON.stringify({
      keepBillableGuests: args.keepBillableGuests,
      idOrganization: args.orgId,
      ...getCsrfRequestPayload(),
    }),
  });

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(args.traceId, trelloServerVersion);

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  const body = await response.json();

  return prepareDataForApolloCache(body, rootNode);
};

export const updateBoardVisibility: TrelloRestResolver<
  MutationUpdateBoardVisibilityArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/boards/${{
    value: args.boardId,
    type: 'boardId',
  }}`;
  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      keepBillableGuests: args.keepBillableGuests,
      'prefs/permissionLevel': args.visibility,
      idOrganization: args.orgId,
      ...getCsrfRequestPayload(),
    }),
  });

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  const body = await response.json();

  return prepareDataForApolloCache(body, rootNode);
};

export const updateBoardPref: TrelloRestResolver<{
  boardId: string;
  pref: string;
  value:
    | Board_Prefs_Comments
    | Board_Prefs_Invitations
    | Board_Prefs_Voting
    | Input_Board_Prefs_SwitcherView[]
    | boolean
    | string;
  traceId?: string | null;
}> = async (obj, { boardId, pref, value, traceId }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/boards/${{ value: boardId, type: 'boardId' }}`;
  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(traceId),
    },
    body: JSON.stringify({
      [`prefs/${pref}`]: value,
      ...getCsrfRequestPayload(),
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  const body = await response.json();

  return prepareDataForApolloCache(body, rootNode);
};

export const updateBoardAutoArchivePref: TrelloRestResolver<
  MutationUpdateBoardAutoArchivePrefArgs
> = async (obj, args, context, info) =>
  updateBoardPref(
    obj,
    {
      boardId: args.boardId,
      pref: 'autoArchive',
      value: args.autoArchive,
      traceId: args.traceId,
    },
    context,
    info,
  );

export const updateBoardCardCoversPref: TrelloRestResolver<
  MutationUpdateBoardCardCoversPrefArgs
> = async (obj, args, context, info) =>
  updateBoardPref(
    obj,
    {
      boardId: args.boardId,
      pref: 'cardCovers',
      value: args.cardCovers,
      traceId: args.traceId,
    },
    context,
    info,
  );

export const updateBoardCommentsPref: TrelloRestResolver<
  MutationUpdateBoardCommentsPrefArgs
> = async (obj, args, context, info) =>
  updateBoardPref(
    obj,
    {
      boardId: args.boardId,
      pref: 'comments',
      value: args.comments,
      traceId: args.traceId,
    },
    context,
    info,
  );

export const updateBoardHideVotesPref: TrelloRestResolver<
  MutationUpdateBoardHideVotesPrefArgs
> = async (obj, args, context, info) =>
  updateBoardPref(
    obj,
    {
      boardId: args.boardId,
      pref: 'hideVotes',
      value: args.hideVotes,
      traceId: args.traceId,
    },
    context,
    info,
  );

export const updateBoardInvitationsPref: TrelloRestResolver<
  MutationUpdateBoardInvitationsPrefArgs
> = async (obj, args, context, info) =>
  updateBoardPref(
    obj,
    {
      boardId: args.boardId,
      pref: 'invitations',
      value: args.invitations,
      traceId: args.traceId,
    },
    context,
    info,
  );

export const updateBoardSelfJoinPref: TrelloRestResolver<
  MutationUpdateBoardSelfJoinPrefArgs
> = async (obj, args, context, info) =>
  updateBoardPref(
    obj,
    {
      boardId: args.boardId,
      pref: 'selfJoin',
      value: args.selfJoin,
      traceId: args.traceId,
    },
    context,
    info,
  );

export const updateBoardShowCompleteStatusPref: TrelloRestResolver<
  MutationUpdateBoardShowCompleteStatusPrefArgs
> = async (obj, args, context, info) =>
  updateBoardPref(
    obj,
    {
      boardId: args.boardId,
      pref: 'showCompleteStatus',
      value: args.showCompleteStatus,
      traceId: args.traceId,
    },
    context,
    info,
  );

export const updateBoardTemplatePref: TrelloRestResolver<
  MutationUpdateBoardTemplatePrefArgs
> = async (obj, args, context, info) =>
  updateBoardPref(
    obj,
    {
      boardId: args.boardId,
      pref: 'isTemplate',
      value: args.isTemplate,
      traceId: args.traceId,
    },
    context,
    info,
  );

export const updateBoardSwitcherViewsPref: TrelloRestResolver<
  MutationUpdateBoardSwitcherViewsPrefArgs
> = async (obj, args, context, info) =>
  updateBoardPref(
    obj,
    {
      boardId: args.boardId,
      pref: 'switcherViews',
      value: args.switcherViews,
    },
    context,
    info,
  );

export const updateBoardVotingPref: TrelloRestResolver<
  MutationUpdateBoardVotingPrefArgs
> = async (obj, args, context, info) =>
  updateBoardPref(
    obj,
    {
      boardId: args.boardId,
      pref: 'voting',
      value: args.voting,
      traceId: args.traceId,
    },
    context,
    info,
  );

export const updateBoardCardAgingPref: TrelloRestResolver<
  MutationUpdateBoardCardAgingPrefArgs
> = async (obj, args, context, info) =>
  updateBoardPref(
    obj,
    {
      boardId: args.boardId,
      pref: 'cardAging',
      value: args.cardAging,
      traceId: args.traceId,
    },
    context,
    info,
  );

export const boardExportResolver: TrelloRestResolver<BoardExportArgs> = async (
  board: {
    id: string; // idBoard
  },
  args,
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  let model = null;

  const apiUrl = sanitizeUrl`/1/boards/${{
    value: board.id,
    type: 'boardId',
  }}/exports/${{ value: args.id, type: 'otherId' }}`;
  try {
    const response = await safeTrelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Board.export',
        operationName: context.operationName,
      },
    });

    if (response.ok) {
      model = await response.json();
    } else {
      if (response.status === 404) {
        model = null;
      } else {
        throw new Error(
          `An error occurred while resolving a GraphQL query. (status: ${response.status}, statusText: ${response.statusText})`,
        );
      }
    }

    return model ? prepareDataForApolloCache(model, rootNode, 'Board') : model;
  } catch (err) {
    console.error(err);
    return model;
  }
};

export const startBoardExport: TrelloRestResolver<
  MutationStartBoardExportArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/boards/${{
    value: args.id,
    type: 'boardId',
  }}/exports`;
  const response = await safeFetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      ...getCsrfRequestPayload(),
      attachments: true,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  const body = await response.json();

  return prepareDataForApolloCache(body, rootNode);
};

export const statsResolver: TrelloRestResolver<BoardStatsArgs> = async (
  obj,
  args,
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/boards/${{
    value: args.id,
    type: 'boardId',
  }}/stats`;
  const response = await safeTrelloFetch(
    apiUrl,
    { credentials: 'same-origin' },
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Board.stats',
        operationName: context.operationName,
      },
    },
  );

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    } else {
      const error = await response.text();
      console.error(error);
      throw new Error(error);
    }
  }

  const model = await response.json();
  return prepareDataForApolloCache(model, rootNode, 'Board');
};

export const boardDashboardViewTileResolver: TrelloRestResolver<
  BoardDashboardViewTileArgs
> = async (
  board: {
    id: string; // idBoard
  },
  args,
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  let model = null;

  const apiUrl = sanitizeUrl`/1/boards/${{
    value: board.id,
    type: 'boardId',
  }}/dashboardViewTiles/${{ value: args.id, type: 'otherId' }}`;
  try {
    const response = await safeTrelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Board.DashboardViewTile',
        operationName: context.operationName,
      },
    });

    if (response.ok) {
      model = await response.json();
    } else {
      if (response.status === 404) {
        model = null;
      } else {
        throw new Error(
          `An error occurred while resolving a GraphQL query. (status: ${response.status}, statusText: ${response.statusText})`,
        );
      }
    }

    return model ? prepareDataForApolloCache(model, rootNode, 'Board') : model;
  } catch (err) {
    console.error(err);
    return model;
  }
};

export const updateCalendarKey: TrelloRestResolver<
  MutationUpdateCalendarKeyArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/boards/${{
    value: args.boardId,
    type: 'boardId',
  }}/calendarKey/generate`;
  const response = await safeFetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      ...getCsrfRequestPayload(),
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  const key = await response.json();

  return prepareDataForApolloCache(key, rootNode);
};

export const messageEmailKey: TrelloRestResolver<
  MutationMessageEmailKeyArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/boards/${{
    value: args.boardId,
    type: 'boardId',
  }}/emailKey/message`;
  const response = await safeFetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      ...getCsrfRequestPayload(),
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  const key = await response.json();

  return prepareDataForApolloCache(key, rootNode);
};

export const updateEmailKey: TrelloRestResolver<
  MutationUpdateEmailKeyArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/boards/${{
    value: args.boardId,
    type: 'boardId',
  }}/emailKey/generate`;
  const response = await safeFetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      ...getCsrfRequestPayload(),
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  const key = await response.json();

  return prepareDataForApolloCache(key, rootNode);
};

export const updateEmailPosition: TrelloRestResolver<
  MutationUpdateEmailPositionArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/boards/${{
    value: args.boardId,
    type: 'boardId',
  }}/emailPosition`;
  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      value: args.emailPosition,
      ...getCsrfRequestPayload(),
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  const key = await response.json();

  return prepareDataForApolloCache(key, rootNode);
};

export const updateCalendarFeedEnabledPref: TrelloRestResolver<
  MutationUpdateCalendarFeedEnabledPrefArgs
> = async (obj, args, context, info) =>
  updateBoardPref(
    obj,
    {
      boardId: args.boardId,
      pref: 'calendarFeedEnabled',
      value: args.calendarFeedEnabled,
    },
    context,
    info,
  );

export const updateBackgroundPref: TrelloRestResolver<
  MutationUpdateBackgroundPrefArgs
> = async (obj, args, context, info) =>
  updateBoardPref(
    obj,
    {
      pref: 'background',
      ...args,
    },
    context,
    info,
  );

export const removeMemberFromBoard: TrelloRestResolver<
  MutationRemoveMemberFromBoardArgs
> = async (obj, { idBoard, idMember, traceId }, context, info) => {
  const apiUrl = sanitizeUrl`/1/Board/${{
    value: idBoard,
    type: 'boardId',
  }}/members/${{ value: idMember, type: 'memberId' }}`;
  const clientVersion = context.clientAwareness.version;
  const response = await safeTrelloFetch(
    apiUrl,
    {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': clientVersion,
        ...Analytics.getTaskRequestHeaders(traceId),
      },
      body: JSON.stringify({
        ...getCsrfRequestPayload(),
      }),
    },
    {
      clientVersion,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'removeMemberFromBoard',
        operationName: context.operationName,
        operationType: 'mutation',
        traceId: traceId ?? undefined,
      },
    },
  );

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(traceId, trelloServerVersion);

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });

    throw await parseNetworkError(response);
  }

  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  return prepareDataForApolloCache({ success: true }, rootNode);
};

export const deleteBoard: TrelloRestResolver<MutationDeleteBoardArgs> = async (
  obj,
  args,
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/boards/${{
    value: args.boardId,
    type: 'boardId',
  }}`;
  const response = await safeFetch(apiUrl, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(args.traceId),
    },
    body: JSON.stringify({
      ...getCsrfRequestPayload(),
    }),
  });

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(args.traceId, trelloServerVersion);

  if (!response.ok) {
    throw await parseNetworkError(response);
  }

  await response.json();

  return prepareDataForApolloCache({ success: true }, rootNode);
};

export const updateHiddenPluginBoardButtonShortcuts: TrelloRestResolver<
  MutationUpdateHiddenPluginBoardButtonShortcutsArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/boards/${{
    value: args.boardId,
    type: 'boardId',
  }}/prefs/hiddenPluginBoardButtons/?value=${{
    value: args.pluginId,
    type: 'pluginId',
  }}`;
  const method = 'PUT';

  const response = await safeFetch(apiUrl, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      ...getCsrfRequestPayload(),
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  const key = await response.json();

  return prepareDataForApolloCache(key, rootNode);
};

export const boardInviteSecretRequestResolver: TrelloRestResolver<
  MutationCreateBoardInviteSecretArgs
> = async (_parent, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/boards/${{
    value: args.idBoard,
    type: 'boardId',
  }}/invitationSecret`;
  const response = await safeTrelloFetch(
    apiUrl,
    { credentials: 'same-origin' },
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Board.invite',
        operationName: context.operationName,
      },
    },
  );

  if (!response.ok) {
    return prepareDataForApolloCache({}, rootNode);
  }

  const key = await response.json();

  return prepareDataForApolloCache(key, rootNode);
};

export const createBoardInviteSecret: TrelloRestResolver<
  MutationCreateBoardInviteSecretArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const url = sanitizeUrl`/1/boards/${{
    value: args.idBoard,
    type: 'boardId',
  }}/invitationSecret`;
  const response = await safeFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      ...getCsrfRequestPayload(),
      type: args.type,
    }),
  });

  if (!response.ok) {
    sendNetworkErrorEvent({
      url,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  const key = await response.json();

  return prepareDataForApolloCache(key, rootNode);
};

export const disableBoardInviteSecret: TrelloRestResolver<
  MutationDisableBoardInviteSecretArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const url = sanitizeUrl`/1/boards/${{
    value: args.idBoard,
    type: 'boardId',
  }}/invitationSecret`;
  const response = await safeFetch(url, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      ...getCsrfRequestPayload(),
    }),
  });

  if (!response.ok) {
    sendNetworkErrorEvent({
      url,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  await response.json();

  return prepareDataForApolloCache({ success: true }, rootNode);
};

export const updateBoardMemberPermission: TrelloRestResolver<
  MutationUpdateBoardMemberPermissionArgs
> = async (obj, args, context, info) => {
  const url = sanitizeUrl`/1/boards/${{
    value: args.boardId,
    type: 'boardId',
  }}/members/${{ value: args.memberId, type: 'memberId' }}`;

  const response = await safeFetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(args.traceId),
    },
    body: JSON.stringify({
      type: args.type,
      ...getCsrfRequestPayload(),
    }),
  });

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(args.traceId, trelloServerVersion);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
};

export const addMemberToBoard: TrelloRestResolver<
  MutationAddMemberToBoardArgs
> = async (
  obj,
  {
    boardId,
    member,
    type = 'normal',
    allowBillableGuest = false,
    invitationMessage,
    acceptUnconfirmed = false,
    traceId = '',
  },
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const { id: memberId, email: memberEmail } = member;
  if (!memberId && !memberEmail) {
    throw new Error();
  }

  const urlParams = new URLSearchParams({ type: type! });
  memberEmail && urlParams.append('email', memberEmail);

  let apiUrl: SafeUrl;
  if (memberId) {
    apiUrl = sanitizeUrl`/1/boards/${{
      value: boardId,
      type: 'boardId',
    }}/members/${{ value: memberId, type: 'memberId' }}?${urlParams}`;
  } else {
    apiUrl = sanitizeUrl`/1/boards/${{
      value: boardId,
      type: 'boardId',
    }}/members?${urlParams}`;
  }
  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(traceId),
    },
    body: JSON.stringify({
      ...getCsrfRequestPayload(),
      invitationMessage,
      allowBillableGuest,
      acceptUnconfirmed,
    }),
  });

  if (!response.ok) {
    throw await parseNetworkError(response);
  }

  await response.json();

  return prepareDataForApolloCache({ success: true }, rootNode);
};

export const boardsSearchResolver: TrelloRestResolver<
  QueryBoardsSearchArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const params = new URLSearchParams();
  params.set('board_fields', 'all');
  params.set('query', args.query);
  params.set('boards_limit', args.limit.toString());
  params.set('modelTypes', 'boards');
  params.set('partial', (!args.query.endsWith(' ')).toString());

  const apiUrl = sanitizeUrl`/1/search?${params}`;

  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'boardsSearch',
      operationName: context.operationName,
    },
  });

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }
  return prepareDataForApolloCache((await response.json()).boards, rootNode);
};

export const updateBoard: TrelloRestResolver<MutationUpdateBoardArgs> = async (
  obj,
  args,
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/boards/${{
    value: args.boardId,
    type: 'boardId',
  }}`;
  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(args.traceId),
    },
    body: JSON.stringify({
      ...args.board,
      ...getCsrfRequestPayload(),
    }),
  });

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(args.traceId, trelloServerVersion);

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  const body = await response.json();

  return prepareDataForApolloCache(body, rootNode);
};

export const updateBoardMyPrefs: TrelloRestResolver<
  MutationUpdateBoardMyPrefsArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/boards/${{
    value: args.boardId,
    type: 'boardId',
  }}/myPrefs/${{ value: args.pref, type: 'boardPref' }}`;
  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      value: args.value,
      ...getCsrfRequestPayload(),
    }),
  });

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  const body = await response.json();

  return prepareDataForApolloCache(body, rootNode);
};

export const boardActionsResolver: TrelloRestResolver<
  QueryBoardActionsArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const params = new URLSearchParams();
  params.set('filter', args.filter?.join(',') ?? 'all');
  params.set('limit', args.limit?.toString() ?? '50');
  params.set('page', args.page?.toString() ?? '0');
  params.set('display', 'true');

  const apiUrl = sanitizeUrl`/1/boards/${{
    value: args.boardId,
    type: 'boardId',
  }}/actions?${params}`;

  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'boardActions',
      operationName: context.operationName,
    },
  });

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  const actions = await response.json();
  const boardData = { id: args.boardId, actions };

  return prepareDataForApolloCache(boardData, rootNode);
};

export const toggleTag: TrelloRestResolver<MutationToggleTagArgs> = async (
  obj,
  args,
  context,
  info,
) => {
  const { traceId, idTag, idBoard, toggleOff } = args;
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  let apiUrl: SafeUrl;
  let response: Response;
  if (toggleOff) {
    apiUrl = sanitizeUrl`/1/boards/${{
      value: idBoard,
      type: 'boardId',
    }}/idTags/${{ value: idTag, type: 'otherId' }}`;
    response = await safeFetch(apiUrl, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
        ...Analytics.getTaskRequestHeaders(traceId),
      },
      body: JSON.stringify({
        ...getCsrfRequestPayload(),
      }),
    });
  } else {
    apiUrl = sanitizeUrl`/1/boards/${{
      value: idBoard,
      type: 'boardId',
    }}/idTags`;
    response = await safeFetch(apiUrl, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
        ...Analytics.getTaskRequestHeaders(traceId),
      },
      body: JSON.stringify({
        value: idTag,
        ...getCsrfRequestPayload(),
      }),
    });
  }
  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(traceId, trelloServerVersion);

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  const board = await response.json();

  return prepareDataForApolloCache(board, rootNode);
};

export const editTag: TrelloRestResolver<MutationEditTagArgs> = async (
  obj,
  args,
  context,
  info,
) => {
  const { traceId, idTag, idOrg, name } = args;
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: idOrg,
    type: 'workspaceId',
  }}/tags/${{ value: idTag, type: 'otherId' }}`;
  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(traceId),
    },
    body: JSON.stringify({
      name,
      ...getCsrfRequestPayload(),
    }),
  });
  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(traceId, trelloServerVersion);

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  const body = await response.json();

  return prepareDataForApolloCache(body, rootNode);
};

export const deleteTag: TrelloRestResolver<MutationDeleteTagArgs> = async (
  obj,
  args,
  context,
  info,
) => {
  const { traceId, idTag, idOrg } = args;
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: idOrg,
    type: 'workspaceId',
  }}/tags/${{ value: idTag, type: 'otherId' }}`;
  const response = await safeFetch(apiUrl, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(traceId),
    },
    body: JSON.stringify({
      ...getCsrfRequestPayload(),
    }),
  });
  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(traceId, trelloServerVersion);

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  const body = await response.json();

  return prepareDataForApolloCache(body, rootNode);
};

export const updateBoardBackgroundImage: TrelloRestResolver<
  MutationUpdateBoardBackgroundImageArgs
> = async (obj, { boardId, url, traceId }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const formData = new FormData();

  const apiUrl = sanitizeUrl`/1/boards/${{
    value: boardId,
    type: 'boardId',
  }}/prefs/background`;

  const csrfPayload = getCsrfRequestPayload({ fallbackValue: '' });
  if (csrfPayload.dsc) {
    formData.set('dsc', csrfPayload.dsc);
  }

  formData.set('url', url);

  const response = await safeFetch(apiUrl, {
    method: 'POST',
    headers: {
      'X-Trello-TraceId': traceId,
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(traceId),
    },
    credentials: 'include',
    body: formData,
  });

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(traceId, trelloServerVersion);

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });

    throw await parseNetworkError(response);
  }

  const background = await response.json();
  return prepareDataForApolloCache(background, rootNode);
};

export const boardListsResolver: TrelloRestResolver<
  QueryBoardListsArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/boards/${{
    value: args.id,
    type: 'boardId',
  }}/lists?filter=open&fields=id,name`;
  const response = await safeTrelloFetch(
    apiUrl,
    { credentials: 'same-origin' },
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Board.lists',
        operationName: context.operationName,
      },
    },
  );

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    } else {
      const error = await response.text();
      console.error(error);
      throw new Error(error);
    }
  }

  const model = await response.json();
  return prepareDataForApolloCache(model, rootNode, 'Board');
};

export const bulkCopyCards: TrelloRestResolver<
  MutationBulkCopyCardsArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/boards/${{
    value: args.idBoard,
    type: 'boardId',
  }}/cards/bulk/copy`;

  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(args.traceId),
    },
    body: JSON.stringify({
      idCards: args.cardIds,
      idBoard: args.targetBoardId,
      idList: args.targetListId,
      ...(args.pos && { pos: args.pos }),
      ...getCsrfRequestPayload(),
    }),
  });

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(args.traceId, trelloServerVersion);

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  const body = await response.json();
  return prepareDataForApolloCache(
    {
      idBoard: body.idBoard,
      cards: body.cards,
    },
    rootNode,
  );
};

export const bulkMoveCards: TrelloRestResolver<
  MutationBulkMoveCardsArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/boards/${{
    value: args.idBoard,
    type: 'boardId',
  }}/cards/bulk/move`;

  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(args.traceId),
    },
    body: JSON.stringify({
      idCards: args.cardIds,
      idBoard: args.targetBoardId,
      idList: args.targetListId,
      ...(args.pos && { pos: args.pos }),
      ...getCsrfRequestPayload(),
    }),
  });

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(args.traceId, trelloServerVersion);

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  const body = await response.json();
  return prepareDataForApolloCache(
    {
      idBoard: body.idBoard,
      cards: body.cards,
    },
    rootNode,
  );
};
