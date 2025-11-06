import { getApiGatewayUrl } from '@trello/api-gateway';
import { Analytics } from '@trello/atlassian-analytics';
import { trelloServerMicrosUrl } from '@trello/config';
import { sendNetworkErrorEvent } from '@trello/error-reporting';
import type { ErrorExtensionsType } from '@trello/graphql-error-handling';
import {
  NetworkError,
  parseNetworkError,
} from '@trello/graphql-error-handling';
import type { SafeUrl } from '@trello/safe-urls';
import { sanitizeUrl } from '@trello/safe-urls';
import { getCsrfRequestPayload } from '@trello/session-cookie/csrf';

import { safeFetch, safeTrelloFetch } from '../fetch';
import type {
  EnterpriseBoardsArgs,
  EnterpriseClaimableOrganizationsArgs,
  EnterpriseClaimedOrganizationsArgs,
  EnterpriseExportArgs,
  EnterpriseManagedMembersWithTokensArgs,
  EnterpriseMembershipsArgs,
  EnterpriseOrganizationsArgs,
  EnterprisePendingOrganizationsArgs,
  EnterpriseTransferrableDataArgs,
  MutationAllowPluginOnEnterpriseArgs,
  MutationAssignMemberEnterpriseAdminArgs,
  MutationClaimOrganizationArgs,
  MutationCreateSeatAutomationExportArgs,
  MutationCreateSeatExpansionTicketArgs,
  MutationCreateSelfServeExpansionArgs,
  MutationDeactivateEnterpriseMemberArgs,
  MutationDeleteEnterpriseBoardCreationRestrictionsArgs,
  MutationDeleteEnterpriseBoardDeletionRestrictionsArgs,
  MutationDeleteEnterpriseBoardSharingRestrictionsArgs,
  MutationDeleteEnterpriseLogoArgs,
  MutationDeleteEnterpriseVisibilityRestrictionsArgs,
  MutationDeleteEnterpriseWorkspaceInviteRestrictionsUrlArgs,
  MutationDeleteEnterpriseWorkspaceMembershipRestrictionsArgs,
  MutationDeleteManagedMemberTokensArgs,
  MutationDisallowPluginOnEnterpriseArgs,
  MutationDismissCompletedWorkspaceBatchesArgs,
  MutationGrantEnterpriseLicenseArgs,
  MutationLinkEnterpriseWithAtlassianOrganizationArgs,
  MutationReactivateMemberArgs,
  MutationRemoveEnterpriseMemberArgs,
  MutationRunSeatAutomationArgs,
  MutationStartEnterpriseExportArgs,
  MutationToggleEnterprisePluginAdministrationArgs,
  MutationUpdateDefaultWorkspaceArgs,
  MutationUpdateEnterpriseApiTokenCreationPermissionArgs,
  MutationUpdateEnterpriseAtlassianIntelligenceEnabledArgs,
  MutationUpdateEnterpriseAutoJoinOrganizationsPreferenceArgs,
  MutationUpdateEnterpriseBoardCreationRestrictionsArgs,
  MutationUpdateEnterpriseBoardDeletionRestrictionsArgs,
  MutationUpdateEnterpriseBoardPrefsPermissionLevelArgs,
  MutationUpdateEnterpriseBoardSharingRestrictionsArgs,
  MutationUpdateEnterpriseDisplayNameArgs,
  MutationUpdateEnterpriseOrganizationPrefsAttachmentRestrictionsArgs,
  MutationUpdateEnterprisePrefsSeatAutomationArgs,
  MutationUpdateEnterprisePrefsSeatAutomationBlockedMembersArgs,
  MutationUpdateEnterpriseVisibilityRestrictionsArgs,
  MutationUpdateEnterpriseWorkspaceInviteRestrictionsArgs,
  MutationUpdateEnterpriseWorkspaceInviteRestrictionsUrlArgs,
  MutationUpdateEnterpriseWorkspaceMembershipRestrictionsArgs,
  QueryEnterpriseIdFromNameArgs,
  QueryFetchSeatAutomationExportArgs,
  QueryFetchSeatAutomationPreviewArgs,
  QueryGetAssociatedWorkspacesForMemberArgs,
  QuerySeatAutomationBlocklistMembersArgs,
  QuerySeatAutomationHistoryArgs,
  QuerySeatAutomationNextRunDateArgs,
  QuerySelfServeExpansionEstimateArgs,
} from '../generated';
import { isQueryInfo } from '../isQueryInfo';
import { prepareDataForApolloCache } from '../prepareDataForApolloCache';
import {
  getChildFieldNames,
  getChildNodes,
} from '../restResourceResolver/queryParsing';
import type {
  JSONObject,
  RestResourceResolverArgs,
  TrelloRestResolver,
} from '../types';

/**
 * Enterprise.organizations is queried as a custom resolver (as opposed to
 * utilizing restResourceResolver)for two reasons
 *
 * 1. At the time of this resolver's writing, the Enterprise API did not support the
 * "sortBy", "sortOrder", "count", or "startIndex" params for the Organizations nested
 * resource.
 *
 * 2. The API returns a list of Organizations, while the GQL type includes both
 * the list of Organizations, as well as the total count of Organizations (extracted
 * via an HTTP header)
 */
export const enterpriseClaimedOrganizationsResolver: TrelloRestResolver<
  EnterpriseClaimedOrganizationsArgs
> = async (enterprise, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const { count, startIndex, query, activeSince, inactiveSince } = args ?? {};

  const searchParams = new URLSearchParams({
    ...(Number.isInteger(count) && { count: String(count) }),
    ...(Number.isInteger(startIndex) && { startIndex: String(startIndex) }),
    ...(query && { filter: `displayName co "${query}"` }),
    ...(activeSince && { activeSince }),
    ...(inactiveSince && { inactiveSince }),
  });

  const children = getChildNodes(rootNode);
  const organizationsSelection = children.find(
    (child) => child.name.value === 'organizations',
  );
  if (organizationsSelection) {
    searchParams.set(
      'fields',
      getChildFieldNames(organizationsSelection, ['memberships']).join(','),
    );
  }

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: enterprise.id,
    type: 'enterpriseId',
  }}/claimedWorkspaces?${searchParams}`;

  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'Enterprise.organizations',
      operationName: context.operationName,
    },
    deduplicate: context.deduplicate,
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

  const organizations = await response.json();
  const apiQueryMetaHeader = response.headers.get('x-trello-api-query-meta');
  const apiQueryMeta = apiQueryMetaHeader
    ? JSON.parse(apiQueryMetaHeader)
    : null;
  const totalOrganizations = apiQueryMeta?.['totalResults'] ?? 0;
  const model = { organizations, totalOrganizations };

  return prepareDataForApolloCache(model, rootNode, 'Enterprise');
};

export const enterpriseOrganizationsResolver: TrelloRestResolver<
  EnterpriseOrganizationsArgs
> = async (enterprise, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const { count, startIndex, filter, sortBy, sortOrder } = args ?? {};

  const searchParams = new URLSearchParams({
    ...(sortBy && { sortBy: String(sortBy) }),
    ...(sortOrder && { sortOrder: String(sortOrder) }),
    ...(Number.isInteger(count) && { count: String(count) }),
    ...(Number.isInteger(startIndex) && { startIndex: String(startIndex) }),
    ...(filter && { filter: `displayName co "${filter}"` }),
  });

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: enterprise.id,
    type: 'enterpriseId',
  }}/organizations?${searchParams}`;

  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'Enterprise.organizations',
      operationName: context.operationName,
    },
    deduplicate: context.deduplicate,
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

  const organizations = await response.json();
  const apiQueryMetaHeader = response.headers.get('x-trello-api-query-meta');
  const apiQueryMeta = apiQueryMetaHeader
    ? JSON.parse(apiQueryMetaHeader)
    : null;
  const totalOrganizations = apiQueryMeta?.['totalResults'] ?? 0;
  const model = { organizations, totalOrganizations };

  return prepareDataForApolloCache(model, rootNode, 'Enterprise');
};

export const enterpriseClaimableOrganizationsResolver: TrelloRestResolver<
  EnterpriseClaimableOrganizationsArgs
> = async (enterprise, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  let model = null;
  const { limit, cursor, name, activeSince, inactiveSince } = args;

  const urlParams = new URLSearchParams();
  urlParams.set('limit', (limit || 20).toString());
  urlParams.set('cursor', cursor || '');
  if (name) {
    urlParams.set('name', name);
  }
  if (activeSince && !inactiveSince) {
    urlParams.set('activeSince', activeSince);
  } else if (inactiveSince && !activeSince) {
    urlParams.set('inactiveSince', inactiveSince);
  }

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: enterprise.id,
    type: 'enterpriseId',
  }}/claimableOrganizations?${urlParams}`;

  try {
    const response = await safeTrelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Enterprise.claimableOrganizations',
        operationName: context.operationName,
      },
    });

    if (response.ok) {
      const {
        organizations,
        claimableCount,
        cursor: nextCursor,
      } = await response.json();
      model = { organizations, count: claimableCount, cursor: nextCursor };
    } else {
      throw new Error(
        `An error occurred while resolving a GraphQL query. (status: ${response.status}, statusText: ${response.statusText})`,
      );
    }

    return model
      ? prepareDataForApolloCache(model, rootNode, 'Enterprise')
      : model;
  } catch (err) {
    console.error(err);
    return model;
  }
};

export const transferrableDataForOrganizationResolver: TrelloRestResolver<
  EnterpriseTransferrableDataArgs
> = async (enterprise, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const urlParams = new URLSearchParams();
  urlParams.set('idOrganizations', args.idOrganizations.toString());

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: enterprise.id,
    type: 'enterpriseId',
  }}/transferrable/bulk?${urlParams}`;

  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'Enterprise.transferrableData',
      operationName: context.operationName,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(error);
    throw new Error(error);
  }

  const model = await response.json();

  // The API should probably not be sending back status 200 for this, but alas
  if ('message' in model) {
    console.error(model);
    throw new Error(model.message);
  }

  return model
    ? prepareDataForApolloCache(model.organizations, rootNode, 'Enterprise')
    : model;
};

export const enterpriseBoardsResolver: TrelloRestResolver<
  EnterpriseBoardsArgs
> = async (enterprise, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const {
    count,
    filter,
    search,
    sortBy,
    sortOrder,
    startIndex,
    idOrganizations,
  } = args ?? {};

  const searchParams = new URLSearchParams({
    ...(sortBy && { sortBy }),
    ...(sortOrder && { sortOrder }),
    ...(Number.isInteger(count) && { count: String(count) }),
    ...(Number.isInteger(startIndex) && { startIndex: String(startIndex) }),
    ...(search && { search }),
    ...(filter && { filter }),
    ...(idOrganizations && { idOrganizations: String(idOrganizations) }),
    members: 'admins',
    organization: 'true',
  });

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: enterprise.id,
    type: 'enterpriseId',
  }}/boards?${searchParams}`;

  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'Enterprise.boards',
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
  const apiQueryMetaHeader = response.headers.get('x-trello-api-query-meta');
  const apiQueryMeta = apiQueryMetaHeader
    ? JSON.parse(apiQueryMetaHeader)
    : null;
  const totalBoards = apiQueryMeta?.['totalResults'] ?? 0;
  const model = { boards, totalBoards };

  return prepareDataForApolloCache(model, rootNode, 'Enterprise');
};

export const enterprisePendingOrganizationsResolver: TrelloRestResolver<
  EnterprisePendingOrganizationsArgs
> = async (enterprise, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const {
    count,
    startIndex,
    search,
    activeSince,
    inactiveSince,
    sortBy,
    sortOrder,
  } = args ?? {};

  const searchParams = new URLSearchParams({
    ...(sortBy && { sortBy: String(sortBy) }),
    ...(sortOrder && { sortOrder: String(sortOrder) }),
    ...(Number.isInteger(count) && { count: String(count) }),
    ...(Number.isInteger(startIndex) && { startIndex: String(startIndex) }),
    ...(search && { search: String(search) }),
    ...(activeSince && { activeSince }),
    ...(inactiveSince && { inactiveSince }),
  });

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: enterprise.id,
    type: 'enterpriseId',
  }}/pendingOrganizations?${searchParams}`;

  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'Enterprise.pendingOrganizations',
      operationName: context.operationName,
    },
    deduplicate: context.deduplicate,
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

  const organizations = await response.json();
  const apiQueryMetaHeader = response.headers.get('x-trello-api-query-meta');
  const apiQueryMeta = apiQueryMetaHeader
    ? JSON.parse(apiQueryMetaHeader)
    : null;
  const totalOrganizations = apiQueryMeta?.['totalResults'] ?? 0;
  const model = { organizations, totalOrganizations };

  return prepareDataForApolloCache(model, rootNode, 'Enterprise');
};

export const startEnterpriseExport: TrelloRestResolver<
  MutationStartEnterpriseExportArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: args.id,
    type: 'enterpriseId',
  }}/exports`;

  const response = await safeFetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      ...getCsrfRequestPayload(),
      enterpriseAssociationType: args.enterpriseAssociationType,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  const body = await response.json();

  return prepareDataForApolloCache(body, rootNode);
};

export const getEnterpriseExportResolver: TrelloRestResolver<
  EnterpriseExportArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/enterprise/${{
    value: args.idEnterprise,
    type: 'enterpriseId',
  }}/exports/${{ value: args.idExport, type: 'otherId' }}`;

  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'Enterprise.export',
      operationName: context.operationName,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
  const body = await response.json();
  return prepareDataForApolloCache(body, rootNode, 'Enterprise');
};

export const updateEnterpriseDisplayName: TrelloRestResolver<
  MutationUpdateEnterpriseDisplayNameArgs
> = async (obj, { enterpriseId, displayName }, context, info) => {
  const params = new URLSearchParams();
  params.append('displayName', displayName);
  const csrfPayload = getCsrfRequestPayload();
  Object.entries(csrfPayload).forEach(([key, value]) => {
    params.append(key, value as string);
  });

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: enterpriseId,
    type: 'enterpriseId',
  }}`;

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
    const error = await response.text();
    throw new Error(error);
  }
  return {
    id: enterpriseId,
    displayName,
    __typename: 'Enterprise',
  };
};

export const deactivateEnterpriseMember: TrelloRestResolver<
  MutationDeactivateEnterpriseMemberArgs
> = async (obj, { idEnterprise, idMember }, context, info) => {
  const params = new URLSearchParams(
    getCsrfRequestPayload({ fallbackValue: '' }),
  );
  params.set('value', 'true');

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: idEnterprise,
    type: 'enterpriseId',
  }}/members/${{ value: idMember, type: 'memberId' }}/deactivated`;

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
    const error = await response.text();
    throw new Error(error);
  }
  return response;
};

export const updateEnterpriseAtlassianIntelligenceEnabled: TrelloRestResolver<
  MutationUpdateEnterpriseAtlassianIntelligenceEnabledArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/enterprises/${{ value: args.idEnterprise, type: 'enterpriseId' }}`;

  const response = await safeTrelloFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      'aiPrefs/atlassianIntelligenceEnabled': args.atlassianIntelligenceEnabled,
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

export const assignMemberEnterpriseAdmin: TrelloRestResolver<
  MutationAssignMemberEnterpriseAdminArgs
> = async (obj, { idEnterprise, idMember, isAdmin }, context, info) => {
  const params = new URLSearchParams(
    getCsrfRequestPayload({ fallbackValue: '' }),
  );

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: idEnterprise,
    type: 'enterpriseId',
  }}/admins/${{ value: idMember, type: 'memberId' }}`;

  const response = await safeFetch(apiUrl, {
    method: isAdmin ? 'PUT' : 'DELETE',
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
  return response;
};

export const grantEnterpriseLicense: TrelloRestResolver<
  MutationGrantEnterpriseLicenseArgs
> = async (obj, { idEnterprise, idMember }, context, info) => {
  const params = new URLSearchParams(
    getCsrfRequestPayload({ fallbackValue: '' }),
  );
  params.set('value', 'true');

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: idEnterprise,
    type: 'enterpriseId',
  }}/members/${{ value: idMember, type: 'memberId' }}/licensed`;

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
  return response;
};

export const reactivateMember: TrelloRestResolver<
  MutationReactivateMemberArgs
> = async (obj, { idEnterprise, idMember }, context, info) => {
  const params = new URLSearchParams(
    getCsrfRequestPayload({ fallbackValue: '' }),
  );
  params.set('value', 'false');

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: idEnterprise,
    type: 'enterpriseId',
  }}/members/${{ value: idMember, type: 'memberId' }}/deactivated`;

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
  return response;
};

export const removeEnterpriseMember: TrelloRestResolver<
  MutationRemoveEnterpriseMemberArgs
> = async (obj, { idEnterprise, idMember }, context, info) => {
  const params = new URLSearchParams(
    getCsrfRequestPayload({ fallbackValue: '' }),
  );
  params.set('value', 'true');

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: idEnterprise,
    type: 'enterpriseId',
  }}/members/${{ value: idMember, type: 'memberId' }}`;

  const response = await safeFetch(apiUrl, {
    method: 'DELETE',
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
  return response;
};

export const claimOrganization: TrelloRestResolver<
  MutationClaimOrganizationArgs
> = async (obj, { idEnterprise, idOrganizations, traceId }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: idEnterprise,
    type: 'enterpriseId',
  }}/organizations/bulk`;

  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(traceId),
    },
    body: JSON.stringify({
      idOrganizations,
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

export const declineOrganizations: TrelloRestResolver<
  MutationClaimOrganizationArgs
> = async (obj, { idEnterprise, idOrganizations, traceId }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: idEnterprise,
    type: 'enterpriseId',
  }}/enterpriseJoinRequest/bulk`;

  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(traceId),
    },
    body: JSON.stringify({
      idOrganizations,
      ...getCsrfRequestPayload(),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  const model = await response.json();
  return prepareDataForApolloCache(model, rootNode);
};

export const linkEnterpriseWithAtlassianOrganization: TrelloRestResolver<
  MutationLinkEnterpriseWithAtlassianOrganizationArgs
> = async (obj, { idEnterprise, atlOrgId, enterpriseARI }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const performFetch = async (url: SafeUrl, reqBody = {}) => {
    const response = await safeFetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify(reqBody),
    });
    if (!response.ok) {
      sendNetworkErrorEvent({
        url,
        response: await response.clone().text(),
        status: response.status,
        operationName: context.operationName,
      });
    }
    return response;
  };

  const callbackUrl = `${trelloServerMicrosUrl}/1/atl/backfillProvisionerCallback/${idEnterprise}`;
  const reqBody = {
    callbackUrl,
    audience: 'trello-server',
  };
  const apiUrlAdminPortfolio = sanitizeUrl`/admin/private/api/admin/v1/orgs/${{
    value: atlOrgId,
    type: 'organizationId',
  }}/workspaces/${{
    value: enterpriseARI,
    type: 'workspaceId',
  }}/_link`;
  const gatewayUrl = getApiGatewayUrl(
    apiUrlAdminPortfolio as unknown as string,
  );
  const responseAdminPortfolio = await performFetch(
    gatewayUrl as unknown as SafeUrl,
    reqBody,
  );
  if (!responseAdminPortfolio.ok) {
    throw await parseNetworkError(responseAdminPortfolio);
  }

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: idEnterprise,
    type: 'enterpriseId',
  }}/linkWithAtlassianOrganization`;
  const response = await performFetch(apiUrl, {
    atlOrgId,
    ...getCsrfRequestPayload(),
  });
  if (!response.ok) {
    throw await parseNetworkError(response);
  }

  return prepareDataForApolloCache({ success: true }, rootNode);
};

export const dismissCompletedWorkspaceBatches: TrelloRestResolver<
  MutationDismissCompletedWorkspaceBatchesArgs
> = async (obj, { idEnterprise, idBatches }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: idEnterprise,
    type: 'enterpriseId',
  }}/organizations/add-to-enterprise-batches/completed`;

  const response = await safeFetch(apiUrl, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      ...getCsrfRequestPayload(),
      idsBatch: idBatches,
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

export const managedMembersWithTokensResolver: TrelloRestResolver<
  EnterpriseManagedMembersWithTokensArgs
> = async (enterprise, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const params = new URLSearchParams();
  if (args?.filter) {
    params.set('filter', args.filter);
  }

  const apiUrl = params.toString()
    ? sanitizeUrl`/1/enterprises/${{
        value: enterprise.id,
        type: 'enterpriseId',
      }}/members/tokens?${params}`
    : sanitizeUrl`/1/enterprises/${{
        value: enterprise.id,
        type: 'enterpriseId',
      }}/members/tokens`;

  try {
    const response = await safeTrelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Enterprise.managedMembersWithTokens',
        operationName: context.operationName,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const model = await response.json();
    return model
      ? prepareDataForApolloCache(model, rootNode, 'Enterprise')
      : model;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const deleteManagedMemberTokens: TrelloRestResolver<
  MutationDeleteManagedMemberTokensArgs
> = async (obj, { idEnterprise, idMember, filter }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: idEnterprise,
    type: 'enterpriseId',
  }}/members/tokens/${{ value: idMember, type: 'memberId' }}`;

  const response = await safeFetch(apiUrl, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      filter,
      ...getCsrfRequestPayload(),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(error);
    throw new Error(error);
  }

  return prepareDataForApolloCache({ success: true }, rootNode);
};

export const deleteAllManagedMemberTokens: TrelloRestResolver<
  MutationDeleteManagedMemberTokensArgs
> = async (obj, { idEnterprise, filter }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: idEnterprise,
    type: 'enterpriseId',
  }}/members/tokens`;

  const response = await safeFetch(apiUrl, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      filter,
      ...getCsrfRequestPayload(),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(error);
    throw new Error(error);
  }

  return prepareDataForApolloCache({ success: true }, rootNode);
};

export const updateEnterpriseApiTokenCreationPermission: TrelloRestResolver<
  MutationUpdateEnterpriseApiTokenCreationPermissionArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/enterprise/${{
    value: args.idEnterprise,
    type: 'enterpriseId',
  }}`;

  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      'prefs/canIssueManagedConsentTokens': args.isAllowed,
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

export const auditlogResolver: TrelloRestResolver<null> = async (
  enterprise,
  args,
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/enterprise/${{
    value: enterprise.id,
    type: 'enterpriseId',
  }}/auditlog`;

  const response = await safeFetch(apiUrl, {
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  const body = await response.json();
  return prepareDataForApolloCache(body, rootNode, 'Enterprise');
};

export const selfServeExpansionEstimateResolver: TrelloRestResolver<
  QuerySelfServeExpansionEstimateArgs
> = async (obj, args, context, info) => {
  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: args.idEnterprise,
    type: 'enterpriseId',
  }}/seat-expansion-estimated-price/${{
    value: args.seats,
    type: 'number',
  }}`;

  const response = await safeFetch(apiUrl, {
    credentials: 'include',
    headers: {
      'X-Trello-Client-Version': context.clientAwareness.version,
      Authorization: `Bearer ${document.cookie}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  const result = await response.json();
  return result;
};

export const createSelfServeExpansion: TrelloRestResolver<
  MutationCreateSelfServeExpansionArgs
> = async (obj, args, context) => {
  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: args.idEnterprise,
    type: 'enterpriseId',
  }}/seat-expansion`;

  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'X-Trello-Client-Version': context.clientAwareness.version,
      Authorization: `Bearer ${document.cookie}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      seats: args.seats,
      ...getCsrfRequestPayload(),
    }),
  });

  return { ok: response.ok };
};

export const defaultOrganizationResolver: TrelloRestResolver<null> = async (
  enterprise,
  args,
  context,
) => {
  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: enterprise.id,
    type: 'enterpriseId',
  }}/organizations/default`;

  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'Enterprise.defaultOrganization',
      operationName: context.operationName,
    },
  });

  if (response.status === 404) {
    // The workspace hasn't been set yet - that's OK
    return null;
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

  return response.json();
};

export const updateDefaultWorkspace: TrelloRestResolver<
  MutationUpdateDefaultWorkspaceArgs
> = async (obj, args, context) => {
  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: args.idEnterprise,
    type: 'enterpriseId',
  }}/organizations/default`;

  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(args.traceId),
    },
    body: JSON.stringify({
      idOrganization: args.idOrganization,
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

  return response.json();
};

export const membershipsResolver: TrelloRestResolver<
  EnterpriseMembershipsArgs
> = async (enterprise, { after, filter }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  // The query endpoint does not allow values to be null, undefined or empty.
  // They must be removed from the request body object.
  const filterWithoutNulls = Object.fromEntries(
    Object.entries(filter).filter(
      ([_, v]) => v !== null && v !== undefined && v !== '',
    ),
  );

  const searchParams = new URLSearchParams(
    filterWithoutNulls as Record<string, string>,
  );
  if (after) {
    searchParams.append('cursor', after);
  }

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: enterprise.id,
    type: 'enterpriseId',
  }}/members/query?${searchParams}`;

  const response = await safeTrelloFetch(apiUrl, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
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

  const body = await response.json();
  return prepareDataForApolloCache(body, rootNode, 'Enterprise');
};

export const updateEnterprisePrefsSeatAutomation: TrelloRestResolver<
  MutationUpdateEnterprisePrefsSeatAutomationArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: args.idEnterprise,
    type: 'enterpriseId',
  }}`;

  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(args.traceId),
    },
    body: JSON.stringify({
      [`prefs/seatAutomationSetting/${args.pref}`]: args.value,
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
  const enterprise = await response.json();
  return prepareDataForApolloCache(enterprise, rootNode);
};

export const updateEnterpriseOrganizationPrefsAttachmentRestrictions: TrelloRestResolver<
  MutationUpdateEnterpriseOrganizationPrefsAttachmentRestrictionsArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: args.idEnterprise,
    type: 'enterpriseId',
  }}`;

  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      [`organizationPrefs/attachmentRestrictions`]: args.attachmentRestrictions,
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
  const enterprise = await response.json();
  return prepareDataForApolloCache(enterprise, rootNode);
};

export const updateEnterpriseBoardPrefsPermissionLevel: TrelloRestResolver<
  MutationUpdateEnterpriseBoardPrefsPermissionLevelArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: args.idEnterprise,
    type: 'enterpriseId',
  }}/boards/prefs/permissionLevel`;

  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      idBoards: args.idBoards,
      value: args.permissionLevel,
      filter: args.filter,
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
  const boards = await response.json();
  return prepareDataForApolloCache(boards, rootNode);
};

export const updateEnterprisePrefsSeatAutomationBlockedMembers: TrelloRestResolver<
  MutationUpdateEnterprisePrefsSeatAutomationBlockedMembersArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: args.idEnterprise,
    type: 'enterpriseId',
  }}`;

  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      [`prefs/seatAutomationSetting/memberBlocklist`]: args.value,
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
  const enterprise = await response.json();
  return prepareDataForApolloCache(enterprise, rootNode);
};

export const updateEnterpriseAutoJoinOrganizationsPreference: TrelloRestResolver<
  MutationUpdateEnterpriseAutoJoinOrganizationsPreferenceArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/enterprises/${{ value: args.id, type: 'enterpriseId' }}/prefs/autoJoinOrganizations`;

  const response = await safeTrelloFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(args.traceId),
    },
    body: JSON.stringify({
      value: args.autoJoinOrganizations,
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
  const enterprise = await response.json();
  return prepareDataForApolloCache(enterprise, rootNode);
};

export const getAssociatedWorkspacesForMemberResolver: TrelloRestResolver<
  QueryGetAssociatedWorkspacesForMemberArgs
> = async (obj, { idMember, idEnterprise }, context) => {
  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: idEnterprise,
    type: 'enterpriseId',
  }}/members/${{
    value: idMember,
    type: 'memberId',
  }}/associatedOrganizations?fields=name,displayName,logoHash,memberships,url`;
  const response = await safeTrelloFetch(apiUrl, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
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
  const workspaces = await response.json();
  return workspaces;
};

export const seatAutomationHistoryResolver: TrelloRestResolver<
  QuerySeatAutomationHistoryArgs
> = async (obj, { idEnterprise }, context) => {
  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: idEnterprise,
    type: 'enterpriseId',
  }}/seatautomations`;

  const response = await safeTrelloFetch(apiUrl, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
  });

  const body = await response.json();
  return body;
};

export const seatAutomationPreviewResolver: TrelloRestResolver<
  QueryFetchSeatAutomationPreviewArgs
> = async (obj, { idEnterprise, activeDays, inactiveDays }, context, info) => {
  const params = new URLSearchParams();
  params.set('activeDays', activeDays.toString());
  params.set('inactiveDays', inactiveDays.toString());

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: idEnterprise,
    type: 'enterpriseId',
  }}/seatautomation/preview?${params}`;

  const response = await safeTrelloFetch(apiUrl, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
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
  const body = await response.json();
  return body;
};

export const seatAutomationBlocklistMembersResolver: TrelloRestResolver<
  QuerySeatAutomationBlocklistMembersArgs
> = async (obj, { idEnterprise }, context, info) => {
  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: idEnterprise,
    type: 'enterpriseId',
  }}/seatautomation/memberBlocklistInfo`;

  const response = await safeTrelloFetch(apiUrl, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
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
  const body = await response.json();
  return { blocklistMembers: body.members };
};

export const runSeatAutomation: TrelloRestResolver<
  MutationRunSeatAutomationArgs
> = async (obj, { idEnterprise }, context, info) => {
  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: idEnterprise,
    type: 'enterpriseId',
  }}/seatautomation`;

  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
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

  const body = await response.json();
  return body;
};

export const createSeatAutomationExport: TrelloRestResolver<
  MutationCreateSeatAutomationExportArgs
> = async (obj, { idEnterprise, idSeatAutomation }, context) => {
  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: idEnterprise,
    type: 'enterpriseId',
  }}/exports`;

  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      Accept: 'application/json',
    },
    body: JSON.stringify({
      ...getCsrfRequestPayload(),
      seatAutomationId: idSeatAutomation,
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
  return body;
};

export const fetchSeatAutomationExportResolver: TrelloRestResolver<
  QueryFetchSeatAutomationExportArgs
> = async (obj, { idEnterprise, idExport }, context) => {
  const apiUrl = sanitizeUrl`/1/enterprise/${{
    value: idEnterprise,
    type: 'enterpriseId',
  }}/exports/${{ value: idExport, type: 'otherId' }}`;

  const response = await safeTrelloFetch(apiUrl, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
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
  const body = await response.json();
  return body;
};

export const seatAutomationNextRunDateResolver: TrelloRestResolver<
  QuerySeatAutomationNextRunDateArgs
> = async (_, { idEnterprise }, context) => {
  const apiUrl = sanitizeUrl`/1/enterprise/${{
    value: idEnterprise,
    type: 'enterpriseId',
  }}/seatautomation/next-run-date`;

  const response = await safeTrelloFetch(apiUrl, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
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

  const body = await response.json();
  return body;
};

export const deleteEnterpriseLogo: TrelloRestResolver<
  MutationDeleteEnterpriseLogoArgs
> = async (obj, { enterpriseId }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: enterpriseId,
    type: 'enterpriseId',
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

  const enterprise = await response.json();
  return prepareDataForApolloCache(enterprise, rootNode);
};

export const uploadEnterpriseLogo: TrelloRestResolver<{
  enterpriseId: string;
  file: File;
}> = async (obj, { enterpriseId, file }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const formData = new FormData();
  formData.set('file', file);
  const csrfPayload = getCsrfRequestPayload({
    fallbackValue: '',
  });
  if (csrfPayload.dsc) {
    formData.set('dsc', csrfPayload.dsc);
  }
  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: enterpriseId,
    type: 'enterpriseId',
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
    const enterprise = await request;
    return prepareDataForApolloCache(enterprise, rootNode);
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

export const createSeatExpansionTicket: TrelloRestResolver<
  MutationCreateSeatExpansionTicketArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: args.input.idEnterprise,
    type: 'enterpriseId',
  }}/seat-expansion-ticket`;

  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'X-Trello-Client-Version': context.clientAwareness.version,
      Authorization: `Bearer ${document.cookie}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...args.input,
      ...getCsrfRequestPayload(),
    }),
  });

  const result = await response.json();
  return prepareDataForApolloCache(result, rootNode);
};

export const getEnterprisePluginsResolver: TrelloRestResolver<
  RestResourceResolverArgs
> = async (enterprise, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: enterprise.id,
    type: 'enterpriseId',
  }}/plugins`;

  const response = await safeTrelloFetch(apiUrl, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
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

  const results = await response.json();
  return prepareDataForApolloCache(results, rootNode, 'Enterprise');
};

export const toggleEnterprisePluginAdministration: TrelloRestResolver<
  MutationToggleEnterprisePluginAdministrationArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: args.enterpriseId,
    type: 'enterpriseId',
  }}/pluginWhitelistingEnabled`;

  const response = await safeTrelloFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(args.traceId),
    },
    body: JSON.stringify({
      value: args.enabled,
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

  const enterprise = await response.json();
  return prepareDataForApolloCache(enterprise, rootNode);
};

export const allowPluginOnEnterprise: TrelloRestResolver<
  MutationAllowPluginOnEnterpriseArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: args.enterpriseId,
    type: 'enterpriseId',
  }}/allowedPlugins`;

  const response = await safeTrelloFetch(apiUrl, {
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
  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  const enterprise = await response.json();
  return prepareDataForApolloCache(enterprise, rootNode);
};

export const disallowPluginOnEnterprise: TrelloRestResolver<
  MutationDisallowPluginOnEnterpriseArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: args.enterpriseId,
    type: 'enterpriseId',
  }}/allowedPlugins`;

  const response = await safeTrelloFetch(apiUrl, {
    method: 'DELETE',
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
  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  const enterprise = await response.json();
  return prepareDataForApolloCache(enterprise, rootNode);
};

export const deleteEnterpriseVisibilityRestrictions: TrelloRestResolver<
  MutationDeleteEnterpriseVisibilityRestrictionsArgs
> = async (obj, { enterpriseId }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: enterpriseId,
    type: 'enterpriseId',
  }}/organizationPrefs/permissionLevel`;

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

  const enterprise = await response.json();
  return prepareDataForApolloCache(enterprise, rootNode);
};

export const deleteEnterpriseWorkspaceInviteRestrictionsUrl: TrelloRestResolver<
  MutationDeleteEnterpriseWorkspaceInviteRestrictionsUrlArgs
> = async (obj, { enterpriseId }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: enterpriseId,
    type: 'enterpriseId',
  }}/organizationPrefs/newLicenseInviteRestrictUrl`;

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

  const enterprise = await response.json();
  return prepareDataForApolloCache(enterprise, rootNode);
};

export const updateEnterpriseWorkspaceInviteRestrictionsUrl: TrelloRestResolver<
  MutationUpdateEnterpriseWorkspaceInviteRestrictionsUrlArgs
> = async (obj, { enterpriseId, value }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: enterpriseId,
    type: 'enterpriseId',
  }}/organizationPrefs/newLicenseInviteRestrictUrl`;

  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      value,
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

  const enterprise = await response.json();
  return prepareDataForApolloCache(enterprise, rootNode);
};

export const updateEnterpriseWorkspaceInviteRestrictions: TrelloRestResolver<
  MutationUpdateEnterpriseWorkspaceInviteRestrictionsArgs
> = async (obj, { enterpriseId, value }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: enterpriseId,
    type: 'enterpriseId',
  }}/organizationPrefs/newLicenseInviteRestrict`;

  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      value,
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

  const enterprise = await response.json();
  return prepareDataForApolloCache(enterprise, rootNode);
};

export const updateEnterpriseWorkspaceMembershipRestrictions: TrelloRestResolver<
  MutationUpdateEnterpriseWorkspaceMembershipRestrictionsArgs
> = async (obj, { enterpriseId, value }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: enterpriseId,
    type: 'enterpriseId',
  }}`;

  const requestBody = {
    'organizationPrefs/orgInviteRestrict': value,
    ...getCsrfRequestPayload(),
  };

  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify(requestBody),
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

  const enterprise = await response.json();
  return prepareDataForApolloCache(enterprise, rootNode);
};

export const deleteEnterpriseWorkspaceMembershipRestrictions: TrelloRestResolver<
  MutationDeleteEnterpriseWorkspaceMembershipRestrictionsArgs
> = async (obj, { enterpriseId }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: enterpriseId,
    type: 'enterpriseId',
  }}/organizationPrefs/orgInviteRestrict`;

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

  const enterprise = await response.json();
  return prepareDataForApolloCache(enterprise, rootNode);
};

export const updateEnterpriseVisibilityRestrictions: TrelloRestResolver<
  MutationUpdateEnterpriseVisibilityRestrictionsArgs
> = async (obj, { enterpriseId, value }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: enterpriseId,
    type: 'enterpriseId',
  }}/organizationPrefs/permissionLevel`;

  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      value,
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

  const enterprise = await response.json();
  return prepareDataForApolloCache(enterprise, rootNode);
};

export const updateEnterpriseBoardCreationRestrictions: TrelloRestResolver<
  MutationUpdateEnterpriseBoardCreationRestrictionsArgs
> = async (obj, { enterpriseId, value, restrictType }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: enterpriseId,
    type: 'enterpriseId',
  }}/organizationPrefs/boardVisibilityRestrict/${{
    value: restrictType,
    type: 'stringUnion',
    allowedValues: ['public', 'private', 'enterprise', 'org'],
  }}`;

  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      value,
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

  const enterprise = await response.json();
  return prepareDataForApolloCache(enterprise, rootNode);
};

export const deleteEnterpriseBoardCreationRestrictions: TrelloRestResolver<
  MutationDeleteEnterpriseBoardCreationRestrictionsArgs
> = async (obj, { enterpriseId, restrictType }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: enterpriseId,
    type: 'enterpriseId',
  }}/organizationPrefs/boardVisibilityRestrict/${{
    value: restrictType,
    type: 'stringUnion',
    allowedValues: ['public', 'private', 'enterprise', 'org'],
  }}`;

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

  const enterprise = await response.json();
  return prepareDataForApolloCache(enterprise, rootNode);
};

export const updateEnterpriseBoardDeletionRestrictions: TrelloRestResolver<
  MutationUpdateEnterpriseBoardDeletionRestrictionsArgs
> = async (obj, { enterpriseId, value, restrictType }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: enterpriseId,
    type: 'enterpriseId',
  }}/organizationPrefs/boardDeleteRestrict/${{
    value: restrictType,
    type: 'stringUnion',
    allowedValues: ['public', 'private', 'enterprise', 'org'],
  }}`;

  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      value,
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

  const enterprise = await response.json();
  return prepareDataForApolloCache(enterprise, rootNode);
};

export const deleteEnterpriseBoardDeletionRestrictions: TrelloRestResolver<
  MutationDeleteEnterpriseBoardDeletionRestrictionsArgs
> = async (obj, { enterpriseId, restrictType }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: enterpriseId,
    type: 'enterpriseId',
  }}/organizationPrefs/boardDeleteRestrict/${{
    value: restrictType,
    type: 'stringUnion',
    allowedValues: ['public', 'private', 'enterprise', 'org'],
  }}`;

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

  const enterprise = await response.json();
  return prepareDataForApolloCache(enterprise, rootNode);
};

export const updateEnterpriseBoardSharingRestrictions: TrelloRestResolver<
  MutationUpdateEnterpriseBoardSharingRestrictionsArgs
> = async (obj, { enterpriseId, value }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: enterpriseId,
    type: 'enterpriseId',
  }}/organizationPrefs/boardInviteRestrict`;

  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      value,
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

  const enterprise = await response.json();
  return prepareDataForApolloCache(enterprise, rootNode);
};

export const deleteEnterpriseBoardSharingRestrictions: TrelloRestResolver<
  MutationDeleteEnterpriseBoardSharingRestrictionsArgs
> = async (obj, { enterpriseId }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/enterprises/${{
    value: enterpriseId,
    type: 'enterpriseId',
  }}/organizationPrefs/boardInviteRestrict`;

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

  const enterprise = await response.json();
  return prepareDataForApolloCache(enterprise, rootNode);
};

export const enterpriseIdFromNameResolver: TrelloRestResolver<
  QueryEnterpriseIdFromNameArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const { name } = args;

  if (name === undefined || name === null) {
    throw new Error(
      'name is required and was not provided in the "enterpriseIdFromNameResolver" resolver',
    );
  }

  const apiUrl = sanitizeUrl`/1/enterprise/${{
    value: name!,
    type: 'enterpriseName',
  }}?fields=id`;

  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'enterpriseIdFromName',
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

  const model = await response.json();
  return prepareDataForApolloCache(model, rootNode);
};
