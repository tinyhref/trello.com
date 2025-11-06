import { sanitizeUrl } from '@trello/safe-urls';
import { getCsrfRequestPayload } from '@trello/session-cookie/csrf';

import { safeFetch, safeTrelloFetch } from '../fetch';
import type {
  MutationAddPluginCollaboratorArgs,
  MutationCreateListingUpdateArgs,
  MutationCreateOAuth2ApplicationArgs,
  MutationCreatePluginArgs,
  MutationCreatePluginListingArgs,
  MutationDeleteListingUpdateArgs,
  MutationDeletePluginArgs,
  MutationDeletePluginListingArgs,
  MutationDeleteSharedPluginDataArgs,
  MutationRemovePluginCollaboratorArgs,
  MutationUpdateListingUpdateArgs,
  MutationUpdatePluginArgs,
  MutationUpdatePluginListingArgs,
} from '../generated';
import { isQueryInfo } from '../isQueryInfo';
import { prepareDataForApolloCache } from '../prepareDataForApolloCache';
import type { TrelloRestResolver } from '../types';

export const updatePlugin: TrelloRestResolver<
  MutationUpdatePluginArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  if (!args.fields) {
    throw new Error('Expected fields argument is missing.');
  }

  const apiUrl = sanitizeUrl`/1/plugin/${{
    value: args.pluginId,
    type: 'pluginId',
  }}`;
  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({ ...args.fields, ...getCsrfRequestPayload() }),
  });

  const plugin = await response.json();

  if (plugin.error) {
    throw new Error('Could not update plugin');
  }

  return prepareDataForApolloCache(plugin, rootNode);
};

export const deleteSharedPluginData: TrelloRestResolver<
  MutationDeleteSharedPluginDataArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/boards/${{
    value: args.boardId,
    type: 'boardId',
  }}/sharedPluginData/${{ value: args.pluginId, type: 'pluginId' }}`;
  const response = await safeFetch(apiUrl, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({ ...args, ...getCsrfRequestPayload() }),
  });

  const listing = await response.json();

  return prepareDataForApolloCache(listing, rootNode);
};

export const deletePluginListing: TrelloRestResolver<
  MutationDeletePluginListingArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/plugin/${{
    value: args.pluginId,
    type: 'pluginId',
  }}/listings/${{ value: args.pluginListingId, type: 'otherId' }}`;
  const response = await safeFetch(apiUrl, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({ ...args, ...getCsrfRequestPayload() }),
  });

  const listing = await response.json();

  return prepareDataForApolloCache(listing, rootNode);
};

export const updatePluginListing: TrelloRestResolver<
  MutationUpdatePluginListingArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/plugin/${{
    value: args.pluginId,
    type: 'pluginId',
  }}/listings/${{ value: args.pluginListingId, type: 'otherId' }}`;
  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({ ...args, ...getCsrfRequestPayload() }),
  });

  const listing = await response.json();

  return prepareDataForApolloCache(listing, rootNode);
};

export const createPluginListing: TrelloRestResolver<
  MutationCreatePluginListingArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/plugin/${{
    value: args.pluginId,
    type: 'pluginId',
  }}/listings`;
  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({ ...args, ...getCsrfRequestPayload() }),
  });

  const listing = await response.json();

  return prepareDataForApolloCache(listing, rootNode);
};

export const deleteListingUpdate: TrelloRestResolver<
  MutationDeleteListingUpdateArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/plugin/${{
    value: args.pluginId,
    type: 'pluginId',
  }}/listings/${{
    value: args.pluginListingId,
    type: 'otherId',
  }}/updates/${{ value: args.listingUpdateId, type: 'otherId' }}`;
  const response = await safeFetch(apiUrl, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({ ...args, ...getCsrfRequestPayload() }),
  });

  const updates = await response.json();

  return prepareDataForApolloCache(updates, rootNode);
};

export const updateListingUpdate: TrelloRestResolver<
  MutationUpdateListingUpdateArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/plugin/${{
    value: args.pluginId,
    type: 'pluginId',
  }}/listings/${{
    value: args.pluginListingId,
    type: 'otherId',
  }}/updates/${{ value: args.listingUpdateId, type: 'otherId' }}`;
  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({ ...args, ...getCsrfRequestPayload() }),
  });

  const updates = await response.json();

  return prepareDataForApolloCache(updates, rootNode);
};

export const createListingUpdate: TrelloRestResolver<
  MutationCreateListingUpdateArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/plugin/${{
    value: args.pluginId,
    type: 'pluginId',
  }}/listings/${{ value: args.pluginListingId, type: 'otherId' }}/updates`;
  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({ ...args, ...getCsrfRequestPayload() }),
  });

  const updates = await response.json();

  return prepareDataForApolloCache(updates, rootNode);
};

export const createPlugin: TrelloRestResolver<
  MutationCreatePluginArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/plugin`;
  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      idAgreement: args.agreementId,
      idOrganizationOwner: args.organizationId,
      iframeConnectorUrl: args.iframeConnectorUrl,
      listings: args.listings,
      author: args.author || '',
      email: args.email,
      supportEmail: args.supportEmail,
      ...getCsrfRequestPayload(),
    }),
  });

  const plugin = await response.json();

  if (plugin.error) {
    throw new Error('Could not create plugin');
  }

  return prepareDataForApolloCache(plugin, rootNode);
};

export const deletePlugin: TrelloRestResolver<
  MutationDeletePluginArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/plugins/${{
    value: args.pluginId,
    type: 'pluginId',
  }}`;
  const response = await safeFetch(apiUrl, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({ ...getCsrfRequestPayload() }),
  });

  await response.json();

  return prepareDataForApolloCache({ success: true }, rootNode);
};

export const pluginCollaboratorsResolver: TrelloRestResolver<object> = async (
  plugin: { id: string },
  args,
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  let model = null;

  const apiUrl = sanitizeUrl`/1/plugin/${{
    value: plugin.id,
    type: 'pluginId',
  }}/collaborators`;

  try {
    const response = await safeTrelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Plugin.collaborators',
        operationName: context.operationName,
      },
    });

    if (response.ok) {
      model = await response.json();
    } else {
      if ([401, 404].includes(response.status)) {
        model = null;
      } else {
        throw new Error(
          `An error occurred while resolving a GraphQL query. (status: ${response.status}, statusText: ${response.statusText})`,
        );
      }
    }

    return model ? prepareDataForApolloCache(model, rootNode, 'Plugin') : model;
  } catch (err) {
    console.error(err);
    return model;
  }
};

const updatePluginCollaborator: TrelloRestResolver<{
  pluginId: string;
  memberId: string;
  method: string;
}> = async (plugin: { id: string }, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  let model = null;

  const apiUrl = sanitizeUrl`/1/plugin/${{
    value: args.pluginId,
    type: 'pluginId',
  }}/collaborators`;

  try {
    const response = await safeFetch(apiUrl, {
      method: args.method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        idCollaborator: args.memberId,
        ...getCsrfRequestPayload(),
      }),
    });

    if (response.ok) {
      model = await response.json();
    } else {
      if ([401, 404].includes(response.status)) {
        model = null;
      } else {
        throw new Error(
          `An error occurred while resolving a GraphQL query. (status: ${response.status}, statusText: ${response.statusText})`,
        );
      }
    }

    return model ? prepareDataForApolloCache(model, rootNode) : model;
  } catch (err) {
    console.error(err);
    return model;
  }
};

export const addPluginCollaborator: TrelloRestResolver<
  MutationAddPluginCollaboratorArgs
> = async (plugin: { id: string }, args, context, info) => {
  const mutationArgs = { ...args, method: 'PUT' };
  return updatePluginCollaborator(plugin, mutationArgs, context, info);
};

export const removePluginCollaborator: TrelloRestResolver<
  MutationRemovePluginCollaboratorArgs
> = async (plugin: { id: string }, args, context, info) => {
  const mutationArgs = { ...args, method: 'DELETE' };
  return updatePluginCollaborator(plugin, mutationArgs, context, info);
};

export const createOAuth2Application: TrelloRestResolver<
  MutationCreateOAuth2ApplicationArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/plugin/oauth2`;
  const response = await safeTrelloFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      author: args.author,
      appName: args.appName,
      email: args.email,
      supportEmail: args.supportEmail,
      ...getCsrfRequestPayload(),
    }),
  });

  const application = await response.json();

  return prepareDataForApolloCache(application, rootNode);
};
