import type { GraphQLResolveInfo } from 'graphql';

import { getApiGatewayUrl } from '@trello/api-gateway';
import { Analytics } from '@trello/atlassian-analytics';
import { developerConsoleState } from '@trello/developer-console-state';
import { sendNetworkErrorEvent } from '@trello/error-reporting';
import type { ErrorExtensionsType } from '@trello/graphql-error-handling';
import {
  NetworkError,
  parseNetworkError,
} from '@trello/graphql-error-handling';
import type { SafeUrl, UnsafeData } from '@trello/safe-urls';
import { sanitizeUrl } from '@trello/safe-urls';
import { getCsrfRequestPayload } from '@trello/session-cookie/csrf';

import { safeFetch, safeTrelloFetch } from '../fetch';
import type {
  MutationAddFreeTrialArgs,
  MutationAddMemberToOrgArgs,
  MutationAddTagArgs,
  MutationBulkDisableWorkspacePowerUpArgs,
  MutationBulkEnableWorkspacePowerUpArgs,
  MutationCancelFreeTrialArgs,
  MutationCopyBoardToOrgArgs,
  MutationCreateEnterpriseJoinRequestArgs,
  MutationCreateOrganizationArgs,
  MutationCreateOrganizationInviteSecretArgs,
  MutationDeactivateMemberForWorkspaceArgs,
  MutationDeleteEnterpriseJoinRequestArgs,
  MutationDeleteOrganizationArgs,
  MutationDeleteOrganizationInviteSecretArgs,
  MutationDeleteOrganizationLogoArgs,
  MutationDeleteWorkspacePrivatePluginDataArgs,
  MutationInviteMemberToJiraArgs,
  MutationReactivateMemberForWorkspaceArgs,
  MutationRemoveMemberFromWorkspaceArgs,
  MutationRemoveOrganizationOrgInviteRestrictDomainArgs,
  MutationStartOrganizationExportArgs,
  MutationToggleAutoUpgradeArgs,
  MutationUnlinkSlackTeamArgs,
  MutationUpdateOrganizationArchiveDeletionCutoffArgs,
  MutationUpdateOrganizationArgs,
  MutationUpdateOrganizationAtlassianIntelligenceEnabledArgs,
  MutationUpdateOrganizationBoardInvitationRestrictArgs,
  MutationUpdateOrganizationEnterpriseBoardDeleteRestrictArgs,
  MutationUpdateOrganizationEnterpriseBoardVisibilityRestrictArgs,
  MutationUpdateOrganizationOrgBoardDeleteRestrictArgs,
  MutationUpdateOrganizationOrgBoardVisibilityRestrictArgs,
  MutationUpdateOrganizationOrgInviteRestrictArgs,
  MutationUpdateOrganizationPermissionLevelArgs,
  MutationUpdateOrganizationPrivateBoardDeleteRestrictArgs,
  MutationUpdateOrganizationPrivateBoardVisibilityRestrictArgs,
  MutationUpdateOrganizationPublicBoardDeleteRestrictArgs,
  MutationUpdateOrganizationPublicBoardVisibilityRestrictArgs,
  MutationUpdateOrganizationSlackTeamInvitationRestrictionArgs,
  MutationUpdateOrganizationSlackTeamLinkRestrictionArgs,
  MutationUpdateWorkspaceMemberPermissionArgs,
  MutationUploadOrganizationImageArgs,
  Organization_Stats_Cards_GroupBy,
  Organization_StatsCardsArgs,
  OrganizationCardsArgs,
  OrganizationNewBillableGuestsArgs,
  QueryOrganizationBoardsArgs,
  QueryOrganizationInviteSecretArgs,
  QueryOrganizationMemberCardsArgs,
} from '../generated';
import { isQueryInfo } from '../isQueryInfo';
import { prepareDataForApolloCache } from '../prepareDataForApolloCache';
import type {
  JSONObject,
  QueryInfo,
  ResolverContext,
  TrelloRestResolver,
  TypedJSONObject,
} from '../types';

export const organizationBoardsResolver: TrelloRestResolver<
  QueryOrganizationBoardsArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const { id, limit, offset, filter, search, sortBy, sortOrder, tags } = args;

  const params = new URLSearchParams();
  if (limit) {
    params.set('count', limit.toString());
  }
  if (offset) {
    params.set('startIndex', offset.toString());
  }
  if (search) {
    params.set('search', search);
  }
  if (filter) {
    params.set('filter', filter);
  }
  if (sortBy) {
    params.set('sortBy', sortBy);
  }
  if (sortOrder) {
    params.set('sortOrder', sortOrder);
  }
  if (tags?.length) {
    params.set('idTags', tags.join(','));
  }

  const apiUrl = params.toString()
    ? sanitizeUrl`/1/organizations/${{
        value: id,
        type: 'organizationId',
      }}/boards?${params}`
    : sanitizeUrl`/1/organizations/${{
        value: id,
        type: 'organizationId',
      }}/boards`;

  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'Organization.boards',
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

  const boards = await response.json();
  return prepareDataForApolloCache(boards, rootNode);
};

export const organizationNewBillableGuestsResolver: TrelloRestResolver<
  OrganizationNewBillableGuestsArgs
> = async (
  organization: {
    id: string;
  },
  args,
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  let model = null;

  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: organization.id,
    type: 'organizationId',
  }}/newBillableGuests/${{ value: args.boardId, type: 'boardId' }}`;

  try {
    const response = await safeTrelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Organization.newBillableGuests',
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

    return model
      ? prepareDataForApolloCache(model, rootNode, 'Organization')
      : model;
  } catch (err) {
    console.error(err);
    return model;
  }
};

export const organizationOwnedPluginsResolver: TrelloRestResolver<
  object
> = async (
  organization: {
    id: string;
  },
  args,
  context,
  info,
): Promise<TypedJSONObject> => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  let model = null;

  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: organization.id,
    type: 'organizationId',
  }}/ownedPlugins`;

  try {
    const response = await safeTrelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Organization.ownedPlugins',
        operationName: context.operationName,
      },
    });

    if (response.ok) {
      model = await response.json();
    } else {
      if ([401, 404, 449].includes(response.status)) {
        model = null;
      } else {
        throw new Error(
          `An error occurred while resolving a GraphQL query. (status: ${response.status}, statusText: ${response.statusText})`,
        );
      }
    }

    return model
      ? (prepareDataForApolloCache(
          model,
          rootNode,
          'Organization',
        ) as TypedJSONObject)
      : model;
  } catch (err) {
    console.error(err);
    return model;
  }
};

export const organizationJiraEligibleMembersResolver: TrelloRestResolver<
  object
> = async (
  organization: {
    id: string;
  },
  args,
  context,
  info,
): Promise<TypedJSONObject> => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  let model = null;

  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: organization.id,
    type: 'organizationId',
  }}/jiraEligibleMembers`;

  try {
    const response = await safeTrelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Organization.jiraEligibleMembers',
        operationName: context.operationName,
      },
    });

    if (response.ok) {
      model = await response.json();
    } else {
      if ([401, 404, 449].includes(response.status)) {
        model = null;
      } else {
        throw new Error(
          `An error occurred while resolving a GraphQL query. (status: ${response.status}, statusText: ${response.statusText})`,
        );
      }
    }

    return model
      ? (prepareDataForApolloCache(
          model,
          rootNode,
          'Organization',
        ) as TypedJSONObject)
      : model;
  } catch (err) {
    console.error(err);
    return model;
  }
};

export const organizationLabelNamesResolver: TrelloRestResolver<
  object
> = async (
  organization: {
    id: string;
  },
  args,
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  let model = null;

  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: organization.id,
    type: 'organizationId',
  }}/stats/labelNames/`;

  try {
    const response = await safeTrelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Organization_Stats.labelNames',
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

    const mappedModel =
      Object.entries(model['data'] as JSONObject)
        // Map the labelNames returned from Apollo to LabelFilterOrgLabels
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .map(([name, orgLabel]: [string, JSONObject]) => ({
          name,
          ...orgLabel,
        })) || [];

    return prepareDataForApolloCache(
      {
        incomplete: model.incomplete,
        stats: mappedModel,
      },
      rootNode,
      'Organization_Stats',
    );
  } catch (err) {
    console.error(err);
    return model;
  }
};

// eslint-disable-next-line @trello/enforce-variable-case
const GroupByToIdField: Record<Organization_Stats_Cards_GroupBy, string> = {
  label: 'idLabel',
  labelName: 'labelName',
  member: 'idMember',
};

const assignGroupById = (
  obj: JSONObject,
  id: string,
  groupBy: Organization_Stats_Cards_GroupBy,
) => {
  const idField = GroupByToIdField[groupBy];
  return idField ? { [idField]: id, ...obj } : obj;
};

export const organizationCardStatsResolver: TrelloRestResolver<
  Organization_StatsCardsArgs
> = async (
  organizationStats: {
    id: string;
  },
  args,
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const { groupBy, idBoards, idMembers, idLabels, dueDateUntil, dueDateSince } =
    args;
  const params = new URLSearchParams({
    ...(groupBy && { groupBy }),
    ...(idBoards && idBoards.length > 0 && { idBoards: idBoards.join(',') }),
    ...(idMembers &&
      idMembers.length > 0 && { idMembers: idMembers.join(',') }),
    ...(idLabels && idLabels.length > 0 && { idLabels: idLabels.join(',') }),
    ...(dueDateUntil && { dueDateUntil }),
    ...(dueDateSince && { dueDateSince }),
    includeIds: 'overdue,upcoming',
  });

  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: organizationStats.id,
    type: 'organizationId',
  }}/stats/cards?${params}`;
  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'Organization_Stats.cards',
      operationName: context.operationName,
    },
  });
  const json = await response.json();
  const cards = groupBy
    ? Object.entries((json['data'] || {}) as JSONObject).map(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ([key, value]: [string, JSONObject]) => {
          return assignGroupById(value, key, groupBy);
        },
      )
    : [json['data'] || {}];
  return prepareDataForApolloCache(
    {
      incomplete: json.incomplete,
      stats: cards,
    },
    rootNode,
    'Organization_Stats',
  );
};

export const organizationStatsResolver: TrelloRestResolver<object> = (
  organization: {
    id: string;
  },
  args,
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  return prepareDataForApolloCache(
    {
      id: organization.id,
    },
    rootNode,
    'Organization',
  );
};

export const createOrganization: TrelloRestResolver<
  MutationCreateOrganizationArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/organizations`;
  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(args.traceId),
    },
    body: JSON.stringify({
      ...(args || {}),
      ...getCsrfRequestPayload(),
    }),
  });

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(args.traceId, trelloServerVersion);

  if (response.ok) {
    return prepareDataForApolloCache(await response.json(), rootNode);
  }

  sendNetworkErrorEvent({
    url: apiUrl,
    response: await response.clone().text(),
    status: response.status,
    operationName: context.operationName,
  });
  throw await parseNetworkError(response);
};

export const updateOrganization: TrelloRestResolver<
  MutationUpdateOrganizationArgs
> = async (obj, args, context, info) => {
  const { orgId, ...fields } = args;
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: orgId,
    type: 'organizationId',
  }}`;
  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      ...(fields || {}),
      ...getCsrfRequestPayload(),
    }),
  });

  if (response.ok) {
    return prepareDataForApolloCache(await response.json(), rootNode);
  }

  sendNetworkErrorEvent({
    url: apiUrl,
    response: await response.clone().text(),
    status: response.status,
    operationName: context.operationName,
  });
  throw await parseNetworkError(response);
};

export const updateOrganizationPermissionLevel: TrelloRestResolver<
  MutationUpdateOrganizationPermissionLevelArgs
> = async (obj, args, context, info) => {
  const { orgId, visibility, traceId } = args;
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: orgId,
    type: 'organizationId',
  }}/prefs/permissionLevel`;
  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(traceId),
    },
    body: JSON.stringify({
      value: visibility,
      ...getCsrfRequestPayload(),
    }),
  });

  if (response.ok) {
    return prepareDataForApolloCache(await response.json(), rootNode);
  }

  sendNetworkErrorEvent({
    url: apiUrl,
    response: await response.clone().text(),
    status: response.status,
    operationName: context.operationName,
  });
  throw await parseNetworkError(response);
};

export const updateOrganizationOrgInviteRestrict: TrelloRestResolver<
  MutationUpdateOrganizationOrgInviteRestrictArgs
> = async (obj, args, context, info) => {
  const { orgId, restriction, traceId } = args;
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: orgId,
    type: 'organizationId',
  }}/prefs/orgInviteRestrict`;
  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(traceId),
    },
    body: JSON.stringify({
      value: restriction,
      ...getCsrfRequestPayload(),
    }),
  });

  if (response.ok) {
    return prepareDataForApolloCache(await response.json(), rootNode);
  }

  sendNetworkErrorEvent({
    url: apiUrl,
    response: await response.clone().text(),
    status: response.status,
    operationName: context.operationName,
  });
  throw await parseNetworkError(response);
};

export const removeOrganizationOrgInviteRestrictDomain: TrelloRestResolver<
  MutationRemoveOrganizationOrgInviteRestrictDomainArgs
> = async (obj, args, context, info) => {
  const { orgId, domain, traceId } = args;
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: orgId,
    type: 'organizationId',
  }}/prefs/orgInviteRestrict`;
  const response = await safeFetch(apiUrl, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(traceId),
    },
    body: JSON.stringify({
      value: domain,
      ...getCsrfRequestPayload(),
    }),
  });

  if (response.ok) {
    return prepareDataForApolloCache(await response.json(), rootNode);
  }

  sendNetworkErrorEvent({
    url: apiUrl,
    response: await response.clone().text(),
    status: response.status,
    operationName: context.operationName,
  });
  throw await parseNetworkError(response);
};

export const updateOrganizationAtlassianIntelligenceEnabled: TrelloRestResolver<
  MutationUpdateOrganizationAtlassianIntelligenceEnabledArgs
> = async (obj, args, context, info) => {
  const { orgId, atlassianIntelligenceEnabled, traceId } = args;
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: orgId,
    type: 'organizationId',
  }}/prefs/atlassianIntelligenceEnabled`;
  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(traceId),
    },
    body: JSON.stringify({
      value: atlassianIntelligenceEnabled,
      ...getCsrfRequestPayload(),
    }),
  });

  if (response.ok) {
    return prepareDataForApolloCache(await response.json(), rootNode);
  }

  sendNetworkErrorEvent({
    url: apiUrl,
    response: await response.clone().text(),
    status: response.status,
    operationName: context.operationName,
  });
  throw await parseNetworkError(response);
};

const updateOrganizationBoardCreateRestrict: (
  path: TemplateStringsArray,
  ...values: (UnsafeData | URLSearchParams)[]
) => TrelloRestResolver<
  | MutationUpdateOrganizationEnterpriseBoardVisibilityRestrictArgs
  | MutationUpdateOrganizationOrgBoardVisibilityRestrictArgs
  | MutationUpdateOrganizationPrivateBoardVisibilityRestrictArgs
  | MutationUpdateOrganizationPublicBoardVisibilityRestrictArgs
> =
  (path, ...values) =>
  async (obj, args, context, info) => {
    const { visibility } = args;
    const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
    const apiUrl = sanitizeUrl(path, ...values);

    const response = await safeFetch(apiUrl, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
        ...Analytics.getTaskRequestHeaders(args.traceId),
      },
      body: JSON.stringify({
        value: visibility,
        ...getCsrfRequestPayload(),
      }),
    });

    if (response.ok) {
      return prepareDataForApolloCache(await response.json(), rootNode);
    }

    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  };

export const updateOrganizationPublicBoardVisibilityRestrict: TrelloRestResolver<
  MutationUpdateOrganizationPublicBoardVisibilityRestrictArgs
> = async (obj, args, context, info) => {
  return updateOrganizationBoardCreateRestrict`/1/organizations/${{
    value: args.orgId,
    type: 'organizationId',
  }}/prefs/boardVisibilityRestrict/public`(obj, args, context, info);
};

export const updateOrganizationEnterpriseBoardVisibilityRestrict: TrelloRestResolver<
  MutationUpdateOrganizationEnterpriseBoardVisibilityRestrictArgs
> = async (obj, args, context, info) => {
  return updateOrganizationBoardCreateRestrict`/1/organizations/${{
    value: args.orgId,
    type: 'organizationId',
  }}/prefs/boardVisibilityRestrict/enterprise`(obj, args, context, info);
};

export const updateOrganizationOrgBoardVisibilityRestrict: TrelloRestResolver<
  MutationUpdateOrganizationOrgBoardVisibilityRestrictArgs
> = async (obj, args, context, info) => {
  return updateOrganizationBoardCreateRestrict`/1/organizations/${{
    value: args.orgId,
    type: 'organizationId',
  }}/prefs/boardVisibilityRestrict/org`(obj, args, context, info);
};

export const updateOrganizationPrivateBoardVisibilityRestrict: TrelloRestResolver<
  MutationUpdateOrganizationPrivateBoardVisibilityRestrictArgs
> = async (obj, args, context, info) => {
  return updateOrganizationBoardCreateRestrict`/1/organizations/${{
    value: args.orgId,
    type: 'organizationId',
  }}/prefs/boardVisibilityRestrict/private`(obj, args, context, info);
};

const updateOrganizationBoardDeleteRestrict: (
  path: TemplateStringsArray,
  ...values: (UnsafeData | URLSearchParams)[]
) => TrelloRestResolver<
  | MutationUpdateOrganizationEnterpriseBoardDeleteRestrictArgs
  | MutationUpdateOrganizationOrgBoardDeleteRestrictArgs
  | MutationUpdateOrganizationPrivateBoardDeleteRestrictArgs
  | MutationUpdateOrganizationPublicBoardDeleteRestrictArgs
> =
  (path, ...values) =>
  async (obj, args, context, info) => {
    const { deletion } = args;
    const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
    const apiUrl = sanitizeUrl(path, ...values);

    const response = await safeFetch(apiUrl, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
        ...Analytics.getTaskRequestHeaders(args.traceId),
      },
      body: JSON.stringify({
        value: deletion,
        ...getCsrfRequestPayload(),
      }),
    });

    if (response.ok) {
      return prepareDataForApolloCache(await response.json(), rootNode);
    }

    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  };

export const updateOrganizationPublicBoardDeleteRestrict: TrelloRestResolver<
  MutationUpdateOrganizationPublicBoardDeleteRestrictArgs
> = async (obj, args, context, info) => {
  return updateOrganizationBoardDeleteRestrict`/1/organizations/${{
    value: args.orgId,
    type: 'organizationId',
  }}/prefs/boardDeleteRestrict/public`(obj, args, context, info);
};

export const updateOrganizationEnterpriseBoardDeleteRestrict: TrelloRestResolver<
  MutationUpdateOrganizationEnterpriseBoardDeleteRestrictArgs
> = async (obj, args, context, info) => {
  return updateOrganizationBoardDeleteRestrict`/1/organizations/${{
    value: args.orgId,
    type: 'organizationId',
  }}/prefs/boardDeleteRestrict/enterprise`(obj, args, context, info);
};

export const updateOrganizationOrgBoardDeleteRestrict: TrelloRestResolver<
  MutationUpdateOrganizationOrgBoardDeleteRestrictArgs
> = async (obj, args, context, info) => {
  return updateOrganizationBoardDeleteRestrict`/1/organizations/${{
    value: args.orgId,
    type: 'organizationId',
  }}/prefs/boardDeleteRestrict/org`(obj, args, context, info);
};

export const updateOrganizationPrivateBoardDeleteRestrict: TrelloRestResolver<
  MutationUpdateOrganizationPrivateBoardDeleteRestrictArgs
> = async (obj, args, context, info) => {
  return updateOrganizationBoardDeleteRestrict`/1/organizations/${{
    value: args.orgId,
    type: 'organizationId',
  }}/prefs/boardDeleteRestrict/private`(obj, args, context, info);
};

export const updateOrganizationBoardInvitationRestrict: TrelloRestResolver<
  MutationUpdateOrganizationBoardInvitationRestrictArgs
> = async (obj, args, context, info) => {
  const { orgId, restriction, traceId } = args;
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: orgId,
    type: 'organizationId',
  }}/prefs/boardInviteRestrict`;
  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(traceId),
    },
    body: JSON.stringify({
      value: restriction,
      ...getCsrfRequestPayload(),
    }),
  });

  if (response.ok) {
    return prepareDataForApolloCache(await response.json(), rootNode);
  }

  sendNetworkErrorEvent({
    url: apiUrl,
    response: await response.clone().text(),
    status: response.status,
    operationName: context.operationName,
  });
  throw await parseNetworkError(response);
};

export const updateOrganizationArchiveDeletionCutoff: TrelloRestResolver<
  MutationUpdateOrganizationArchiveDeletionCutoffArgs
> = async (obj, args, context, info) => {
  const { orgId, archiveCleanupCutOff, traceId } = args;
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: orgId,
    type: 'organizationId',
  }}/prefs/autoArchiveCleanup`;
  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(traceId),
    },
    body: JSON.stringify({
      value: archiveCleanupCutOff.toString(),
      ...getCsrfRequestPayload(),
    }),
  });

  if (response.ok) {
    return prepareDataForApolloCache(await response.json(), rootNode);
  }

  sendNetworkErrorEvent({
    url: apiUrl,
    response: await response.clone().text(),
    status: response.status,
    operationName: context.operationName,
  });
  throw await parseNetworkError(response);
};

export const deleteOrganization: TrelloRestResolver<
  MutationDeleteOrganizationArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: args.idOrganization,
    type: 'organizationId',
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

  if (response.ok) {
    return prepareDataForApolloCache(await response.json(), rootNode);
  }

  sendNetworkErrorEvent({
    url: apiUrl,
    response: await response.clone().text(),
    status: response.status,
    operationName: context.operationName,
  });

  throw await parseNetworkError(response);
};

export const copyBoardToOrg: TrelloRestResolver<
  MutationCopyBoardToOrgArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/boards/${{
    value: args.boardId,
    type: 'boardId',
  }}`;
  let response = await safeTrelloFetch(
    apiUrl,
    {
      credentials: 'same-origin',
    },
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'copyBoardToOrg',
        operationType: 'mutation',
        operationName: context.operationName,
      },
    },
  );
  const copy = await response.json();

  const searchParams = new URLSearchParams(
    getCsrfRequestPayload({ fallbackValue: '' }),
  );

  searchParams.set('name', copy.name);
  searchParams.set('idOrganization', args.organizationId);
  searchParams.set('idBoardSource', args.boardId);
  searchParams.set('creationMethod', 'assisted');
  searchParams.set('keepFromSource', 'cards');
  searchParams.set('prefs_permissionLevel', 'org');

  const destinationApiUrl = sanitizeUrl`/1/boards/`;
  response = await safeFetch(destinationApiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: searchParams.toString(),
  });

  const board = await response.json();

  return prepareDataForApolloCache(board, rootNode);
};

export const addMemberToOrg: TrelloRestResolver<
  MutationAddMemberToOrgArgs
> = async (
  obj,
  { orgId, user, invitationMessage, type = 'normal', traceId = '' },
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = user?.id
    ? sanitizeUrl`/1/organizations/${{
        value: orgId,
        type: 'organizationId',
      }}/members/${{ value: user.id, type: 'memberId' }}`
    : sanitizeUrl`/1/organizations/${{
        value: orgId,
        type: 'organizationId',
      }}/members`;

  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(traceId),
    },
    body: JSON.stringify({
      ...(user?.id ? { acceptUnconfirmed: true } : { email: user?.email }),
      type,
      invitationMessage,
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

export const updateWorkspaceMemberPermission: TrelloRestResolver<
  MutationUpdateWorkspaceMemberPermissionArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: args.workspaceId,
    type: 'organizationId',
  }}/members/${{ value: args.memberId, type: 'memberId' }}`;

  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
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
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  const data = await response.json();
  return prepareDataForApolloCache(data, rootNode);
};

export const removeMemberFromWorkspace: TrelloRestResolver<
  MutationRemoveMemberFromWorkspaceArgs
> = async (
  obj,
  { orgId, user, type = 'normal', traceId = '' },
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = user?.id
    ? sanitizeUrl`/1/organizations/${{
        value: orgId,
        type: 'organizationId',
      }}/members/${{ value: user.id, type: 'memberId' }}`
    : sanitizeUrl`/1/organizations/${{
        value: orgId,
        type: 'organizationId',
      }}/members`;

  const response = await safeFetch(apiUrl, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(traceId),
    },
    body: JSON.stringify({
      ...(user?.id ? { acceptUnconfirmed: true } : { email: user?.email }),
      type,
      ...getCsrfRequestPayload(),
    }),
  });

  if (!response.ok) {
    throw await parseNetworkError(response);
  }

  return prepareDataForApolloCache({ success: true }, rootNode);
};

export const uploadOrganizationImage: TrelloRestResolver<
  MutationUploadOrganizationImageArgs
> = async (obj, { orgId, file }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const formData = new FormData();
  formData.set('file', file);
  const csrfPayload = getCsrfRequestPayload({
    fallbackValue: '',
  });
  if (csrfPayload.dsc) {
    formData.set('dsc', csrfPayload.dsc);
  }
  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: orgId,
    type: 'organizationId',
  }}/logo`;

  // We need to use XHR in order to track upload progress
  const request = new Promise<JSONObject>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.open('POST', apiUrl as unknown as string);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.response);
        resolve(response);
      } else {
        reject(xhr.response);
      }
    };
    xhr.onerror = () => {
      reject(xhr.response);
    };

    xhr.send(formData);
  });

  try {
    const organization = await request;
    return prepareDataForApolloCache(organization, rootNode);
  } catch (err) {
    let error: { message: string; error: string };
    try {
      error = JSON.parse(err as string);
    } catch (e) {
      error = {
        message: err as string,
        error: 'UNKNOWN_ERROR',
      };
    }

    throw new NetworkError(error?.message, {
      code: (error?.error as ErrorExtensionsType) || 'UNKNOWN_ERROR',
      status: 400,
    });
  }
};

export const deleteOrganizationLogo: TrelloRestResolver<
  MutationDeleteOrganizationLogoArgs
> = async (obj, { orgId }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: orgId,
    type: 'organizationId',
  }}/logo`;
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

  const organizationApiUrl = sanitizeUrl`/1/organizations/${{
    value: orgId,
    type: 'organizationId',
  }}`;
  const organizationResponse = await safeTrelloFetch(
    organizationApiUrl,
    undefined,
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'deleteOrganizationLogo',
        operationType: 'mutation',
        operationName: context.operationName,
      },
    },
  );
  return prepareDataForApolloCache(await organizationResponse.json(), rootNode);
};

export const createEnterpriseJoinRequest: TrelloRestResolver<
  MutationCreateEnterpriseJoinRequestArgs
> = async (obj, { traceId, workspaceId, enterpriseId }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: workspaceId,
    type: 'organizationId',
  }}/enterpriseJoinRequest`;
  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(traceId),
    },
    body: JSON.stringify({
      value: enterpriseId,
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

  const data = await response.json();

  return prepareDataForApolloCache(data, rootNode);
};

export const deleteEnterpriseJoinRequest: TrelloRestResolver<
  MutationDeleteEnterpriseJoinRequestArgs
> = async (obj, { traceId, workspaceId }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: workspaceId,
    type: 'organizationId',
  }}/enterpriseJoinRequest`;
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

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  return prepareDataForApolloCache({ enterpriseJoinRequest: null }, rootNode);
};

export const toggleAutoUpgrade: TrelloRestResolver<
  MutationToggleAutoUpgradeArgs
> = async (obj, { upgrade, orgId }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: orgId,
    type: 'organizationId',
  }}/freeTrial/setAutoUpgrade`;
  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      ...getCsrfRequestPayload(),
      upgrade,
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

  const data = await response.json();
  return prepareDataForApolloCache(data, rootNode);
};

export const addFreeTrial: TrelloRestResolver<
  MutationAddFreeTrialArgs
> = async (obj, { orgId, via, count, traceId }, context, info) => {
  const redeemUrl = sanitizeUrl`/1/organizations/${{
    value: orgId,
    type: 'organizationId',
  }}/freeTrial`;

  const redeemResponse = await safeFetch(redeemUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(traceId ?? undefined),
      'X-Trello-Operation-Name': context.operationName,
      'X-Trello-Operation-Source': 'graphql',
    },
    body: JSON.stringify({
      ...getCsrfRequestPayload(),
      ...(via ? { via } : {}),
      ...(count ? { count } : {}),
    }),
  });

  if (!redeemResponse.ok) {
    sendNetworkErrorEvent({
      url: redeemUrl,
      response: await redeemResponse.clone().text(),
      status: redeemResponse.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(redeemResponse);
  }

  const urlParams = new URLSearchParams();
  urlParams.set('paidAccount', 'true');
  urlParams.set('paidAccount_fields', 'all');

  const paidAccountUrl = sanitizeUrl`/1/organizations/${{
    value: orgId,
    type: 'organizationId',
  }}?fields=credits,offering&${urlParams}`;

  const paidAccountResponse = await safeTrelloFetch(paidAccountUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'addFreeTrial',
      operationName: context.operationName,
      operationType: 'mutation',
    },
  });

  if (!paidAccountResponse.ok) {
    sendNetworkErrorEvent({
      url: paidAccountUrl,
      response: await paidAccountResponse.clone().text(),
      status: paidAccountResponse.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(paidAccountResponse);
  }

  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const model = await paidAccountResponse.json();
  return prepareDataForApolloCache(model, rootNode);
};

export const cancelFreeTrial = async (
  obj: object,
  args: MutationCancelFreeTrialArgs,
  context: ResolverContext,
  info: GraphQLResolveInfo | QueryInfo,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: args.workspaceId,
    type: 'organizationId',
  }}/freeTrial`;

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

  const model = await response.json();
  return prepareDataForApolloCache(model, rootNode);
};

export const organizationCardsResolver: TrelloRestResolver<
  OrganizationCardsArgs
> = async (
  organization: {
    id: string;
  },
  args,
  context,
  info,
): Promise<TypedJSONObject> => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  let model = null;

  try {
    const {
      idBoards,
      limit,
      cursor,
      due,
      start,
      date,
      dueComplete,
      sortBy,
      idLists,
      labels,
      idMembers,
    } = args;
    const params = new URLSearchParams({
      idBoards: idBoards.join(','),
      ...(limit && { limit: `${limit}` }),
      ...(cursor && { cursor }),
      ...(start && { start }),
      ...(date && { date }),
      ...(due && { due }),
      ...(dueComplete !== null && { dueComplete: `${dueComplete}` }),
      ...(sortBy && { sortBy }),
      ...(idLists && { idLists: idLists.join(',') }),
      ...(labels && { labels: labels.join(',') }),
      ...(idMembers && { idMembers: idMembers.join(',') }),
    });

    const apiUrl = sanitizeUrl`/1/organizations/${{
      value: organization.id,
      type: 'organizationId',
    }}/cards`;

    const response = await safeFetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        ...getCsrfRequestPayload(),
        ...Object.fromEntries(params),
      }),
    });

    if (response.ok) {
      model = await response.json();
    } else {
      if ([400, 401, 404, 422, 449].includes(response.status)) {
        model = null;
        throw new Error(await response.text());
      } else {
        throw new Error(
          `An error occurred while resolving a GraphQL query. (status: ${response.status}, statusText: ${response.statusText})`,
        );
      }
    }

    return model
      ? (prepareDataForApolloCache(
          model,
          rootNode,
          'Organization',
        ) as TypedJSONObject)
      : model;
  } catch (err) {
    console.error(err);
    throw new Error((err as Error).toString());
  }
};

// Very specific resolver to use on /members/id/cards
export const organizationMemberCardsResolver: TrelloRestResolver<
  QueryOrganizationMemberCardsArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const { id, idMember } = args;

  const params = new URLSearchParams({
    fields:
      'badges,closed,dateLastActivity,due,dueComplete,idAttachmentCover,idList,idBoard,idMembers,idShort,labels,name,url',
    board: 'true',
    board_fields: 'name,closed,memberships',
    list: 'true',
    attachments: 'true',
    stickers: 'all',
    members: 'true',
    member_fields:
      'activityBlocked,avatarUrl,bio,bioData,confirmed,fullName,idEnterprise,idMemberReferrer,initials,memberType,nonPublic,products,url,username',
  });

  const apiUrl = sanitizeUrl`/1/organization/${{
    value: id,
    type: 'organizationId',
  }}/members/${{ value: idMember, type: 'memberId' }}/cards?${params}`;

  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'organizationMemberCards',
      operationName: context.operationName,
    },
  });

  if (response.ok) {
    const model = await response.json();
    return prepareDataForApolloCache(model, rootNode);
  } else {
    throw new Error(
      `An error occurred while resolving a GraphQL query. (status: ${response.status}, statusText: ${response.statusText})`,
    );
  }
};

export const organizationSlackAssociationResolver: TrelloRestResolver<
  object
> = async (
  organization: {
    id: string;
  },
  args,
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = getApiGatewayUrl(
    sanitizeUrl`/slack/trello/${{
      value: organization.id,
      type: 'organizationId',
    }}/association` as unknown as string,
  );
  const response = await safeTrelloFetch(
    apiUrl as unknown as SafeUrl,
    undefined,
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'organizationSlackAssociation',
        operationName: context.operationName,
      },
    },
  );

  if (response.ok) {
    try {
      const model = await response.json();
      return prepareDataForApolloCache(model, rootNode, 'Organization');
    } catch {
      sendNetworkErrorEvent({
        url: apiUrl,
        response: await response.clone().text(),
        status: response.status,
        operationName: context.operationName,
      });

      return null;
    }
  } else {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });

    return null;
  }
};

export const updateOrganizationSlackTeamInvitationRestriction: TrelloRestResolver<
  MutationUpdateOrganizationSlackTeamInvitationRestrictionArgs
> = async (obj, args, context, info) => {
  const { orgId, slackTeamId, selfJoin } = args;
  const urlParams = new URLSearchParams();
  urlParams.set('idSlackTeam', slackTeamId);
  urlParams.set('value', selfJoin.toString());
  const apiUrl = getApiGatewayUrl(
    sanitizeUrl`/slack/trello/${{
      value: orgId,
      type: 'organizationId',
    }}/selfJoin?${urlParams}` as unknown as string,
  );
  const response = await safeFetch(apiUrl as unknown as SafeUrl, {
    method: 'PUT',
    headers: {
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
  });

  if (response.ok) {
    // There is no response body for this request.
    // It just returns a plain text "OK" response
    return null;
  } else {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });

    throw await parseNetworkError(response);
  }
};

export const updateOrganizationSlackTeamLinkRestriction: TrelloRestResolver<
  MutationUpdateOrganizationSlackTeamLinkRestrictionArgs
> = async (obj, args, context, info) => {
  const { orgId, adminOnlyLinking } = args;
  const urlParams = new URLSearchParams();
  urlParams.set('value', adminOnlyLinking.toString());
  const apiUrl = getApiGatewayUrl(
    sanitizeUrl`/slack/trello/${{
      value: orgId,
      type: 'organizationId',
    }}/adminOnlyLinking?${urlParams}` as unknown as string,
  );
  const response = await safeFetch(apiUrl as unknown as SafeUrl, {
    method: 'PUT',
    headers: {
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
  });

  if (response.ok) {
    // There is no response body for this request.
    // It just returns a plain text "OK" response
    return null;
  } else {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });

    throw await parseNetworkError(response);
  }
};

export const unlinkSlackTeam: TrelloRestResolver<
  MutationUnlinkSlackTeamArgs
> = async (obj, args, context, info) => {
  const { orgId, slackTeamId } = args;
  const urlParams = new URLSearchParams();
  urlParams.set('idSlackTeam', slackTeamId);

  const apiUrl = getApiGatewayUrl(
    sanitizeUrl`/slack/trello/${{
      value: orgId,
      type: 'organizationId',
    }}/association?${urlParams}` as unknown as string,
  );
  const response = await safeFetch(apiUrl as unknown as SafeUrl, {
    method: 'DELETE',
    headers: {
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
  });

  if (response.ok) {
    // There is no response body for this request.
    // It just returns a plain text "OK" response
    return null;
  } else {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });

    throw await parseNetworkError(response);
  }
};

export const addTag: TrelloRestResolver<MutationAddTagArgs> = async (
  obj,
  { orgId, tag },
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: orgId,
    type: 'organizationId',
  }}/tags`;
  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      ...getCsrfRequestPayload(),
      name: tag,
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

  const tagData = await response.json();
  return prepareDataForApolloCache(tagData, rootNode);
};

export const bulkDisableWorkspacePowerUp: TrelloRestResolver<
  MutationBulkDisableWorkspacePowerUpArgs
> = async (obj, { orgId, pluginId, traceId }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: orgId,
    type: 'organizationId',
  }}/plugins/${{ value: pluginId, type: 'pluginId' }}`;
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
    throw await parseNetworkError(response);
  }

  const json = await response.json();

  // Since this request could be potentially updating
  // many boards, it may be updated through a heartbeat
  // rather than through this request
  if (json.updateQueued) {
    return json;
  }
  return prepareDataForApolloCache({ plugins: json }, rootNode);
};

export const bulkEnableWorkspacePowerUp: TrelloRestResolver<
  MutationBulkEnableWorkspacePowerUpArgs
> = async (obj, { orgId, pluginId, traceId }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: orgId,
    type: 'organizationId',
  }}/plugins/${{ value: pluginId, type: 'pluginId' }}`;
  const response = await safeFetch(apiUrl, {
    method: 'POST',
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
    throw await parseNetworkError(response);
  }

  const json = await response.json();

  // Since this request could be potentially updating
  // many boards, it may be updated through a heartbeat
  // rather than through this request
  if (json.updateQueued) {
    return json;
  }

  return prepareDataForApolloCache({ plugins: json }, rootNode);
};

export const createOrganizationInviteSecret: TrelloRestResolver<
  MutationCreateOrganizationInviteSecretArgs
> = async (obj, { idOrganization, traceId }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const operationNameInUrl = developerConsoleState.value.operationNameInUrl;
  const urlParams = new URLSearchParams();
  if (operationNameInUrl) {
    urlParams.set('operationName', context.operationName);
  }
  const apiUrl = operationNameInUrl
    ? sanitizeUrl`/1/organizations/${{
        value: idOrganization,
        type: 'organizationId',
      }}/invitationSecret?${urlParams}`
    : sanitizeUrl`/1/organizations/${{
        value: idOrganization,
        type: 'organizationId',
      }}/invitationSecret`;

  const response = await safeFetch(apiUrl, {
    method: 'POST',
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

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  return prepareDataForApolloCache(await response.json(), rootNode);
};

export const deleteOrganizationInviteSecret: TrelloRestResolver<
  MutationDeleteOrganizationInviteSecretArgs
> = async (obj, { idOrganization, traceId }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const operationNameInUrl = developerConsoleState.value.operationNameInUrl;
  const urlParams = new URLSearchParams();
  if (operationNameInUrl) {
    urlParams.set('operationName', context.operationName);
  }

  const apiUrl = operationNameInUrl
    ? sanitizeUrl`/1/organizations/${{
        value: idOrganization,
        type: 'organizationId',
      }}/invitationSecret?${urlParams}`
    : sanitizeUrl`/1/organizations/${{
        value: idOrganization,
        type: 'organizationId',
      }}/invitationSecret`;

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

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  return prepareDataForApolloCache(await response.json(), rootNode);
};

export const organizationInviteSecretResolver: TrelloRestResolver<
  QueryOrganizationInviteSecretArgs
> = async (obj, { idOrganization }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: idOrganization,
    type: 'organizationId',
  }}/invitationSecret`;

  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'Organization.invite',
      operationName: context.operationName,
    },
  });

  // If we get a 404 response, we know that the user has disabled the workspace invite link
  // We want to repopulate the cache so that the two workspace invite UIs rerender
  if (response.status === 404) {
    return prepareDataForApolloCache({ secret: null, type: null }, rootNode);
  }

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  return prepareDataForApolloCache(await response.json(), rootNode);
};

export const workspaceGuestsResolver: TrelloRestResolver<{
  workspaceId: string;
}> = async (obj, { workspaceId }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: workspaceId,
    type: 'organizationId',
  }}/collaborators`;

  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'Organization.guests',
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

  return prepareDataForApolloCache(await response.json(), rootNode);
};

export const deactivateMemberForWorkspace: TrelloRestResolver<
  MutationDeactivateMemberForWorkspaceArgs
> = async (obj, { workspaceId, memberId, traceId }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const params = new URLSearchParams(
    getCsrfRequestPayload({ fallbackValue: '' }),
  );
  params.set('value', 'true');

  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: workspaceId,
    type: 'organizationId',
  }}/members/${{ value: memberId, type: 'memberId' }}/deactivated`;
  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(traceId),
    },
    body: params,
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

  return prepareDataForApolloCache(await response.json(), rootNode);
};

export const reactivateMemberForWorkspace: TrelloRestResolver<
  MutationReactivateMemberForWorkspaceArgs
> = async (obj, { workspaceId, memberId }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const params = new URLSearchParams(
    getCsrfRequestPayload({ fallbackValue: '' }),
  );
  params.set('value', 'false');

  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: workspaceId,
    type: 'organizationId',
  }}/members/${{ value: memberId, type: 'memberId' }}/deactivated`;
  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: params,
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

  return prepareDataForApolloCache(await response.json(), rootNode);
};

export const inviteMemberToJira: TrelloRestResolver<
  MutationInviteMemberToJiraArgs
> = async (obj, { workspaceId, memberIds }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: workspaceId,
    type: 'organizationId',
  }}/jiraInvite`;
  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      ...getCsrfRequestPayload(),
      inviteMembers: memberIds,
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

  return prepareDataForApolloCache(await response.json(), rootNode);
};

export const startOrganizationExport: TrelloRestResolver<
  MutationStartOrganizationExportArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: args.id,
    type: 'organizationId',
  }}/exports`;
  const response = await safeFetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      ...getCsrfRequestPayload(),
      attachments: args.attachments,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return prepareDataForApolloCache(await response.json(), rootNode);
};

export const deleteWorkspacePrivatePluginData: TrelloRestResolver<
  MutationDeleteWorkspacePrivatePluginDataArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: args.workspaceId,
    type: 'organizationId',
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
