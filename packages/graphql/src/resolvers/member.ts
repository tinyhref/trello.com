import { Analytics } from '@trello/atlassian-analytics';
import { clientVersion } from '@trello/config';
import { developerConsoleState } from '@trello/developer-console-state';
import { sendNetworkErrorEvent } from '@trello/error-reporting';
import {
  MemberErrorExtensions,
  NetworkError,
  parseNetworkError,
} from '@trello/graphql-error-handling';
import { dangerouslyConvertPrivacyString } from '@trello/privacy';
import { sanitizeUrl } from '@trello/safe-urls';
import { getCsrfRequestPayload } from '@trello/session-cookie/csrf';

import { atlassianOrganizationSsoUrl } from '../atlassianOrganizationSsoUrl';
import { safeFetch, safeTrelloFetch } from '../fetch';
import type {
  Member_Atlassian_Organization,
  MutationAcceptDeveloperTermsArgs,
  MutationAddBoardStarArgs,
  MutationAddCampaignArgs,
  MutationAddMessageDismissedArgs,
  MutationAddOneTimeMessagesDismissedArgs,
  MutationAddSavedSearchArgs,
  MutationDeleteCustomBackgroundArgs,
  MutationDeleteCustomStickerArgs,
  MutationDeleteMemberPrivatePluginDataArgs,
  MutationDeleteOneTimeMessagesDismissedArgs,
  MutationDeleteSavedSearchArgs,
  MutationEnableMemberProfileSyncArgs,
  MutationRefreshEmailConfirmationArgs,
  MutationRemoveBoardStarArgs,
  MutationResendVerificationEmailArgs,
  MutationTrelloMemberRecapArgs,
  MutationUnblockMemberProfileSyncArgs,
  MutationUpdateBoardStarArgs,
  MutationUpdateCampaignArgs,
  MutationUpdateCustomBackgroundArgs,
  MutationUpdateMarketingOptInArgs,
  MutationUpdateMemberColorBlindPrefArgs,
  MutationUpdateMemberProfileArgs,
  MutationUpdateNotificationChannelSettingsArgs,
  MutationUpdateNotificationEmailFrequencyArgs,
  MutationUploadCustomBackgroundArgs,
  MutationUploadCustomStickerArgs,
  QueryMemberActionsArgs,
  QueryMemberCardsArgs,
  QueryMemberCardsQueryArgs,
  QueryMemberCustomEmojiArgs,
  QueryMemberIdFromUsernameArgs,
  QueryMemberSearchArgs,
  QueryNotificationChannelSettingsArgs,
} from '../generated';
import { isQueryInfo } from '../isQueryInfo';
import { prepareDataForApolloCache } from '../prepareDataForApolloCache';
import type { JSONObject, TrelloRestResolver } from '../types';

export const addBoardStar: TrelloRestResolver<
  MutationAddBoardStarArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/member/${{
    value: args.memberId,
    type: 'memberId',
  }}/boardStars`;

  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(args.traceId),
    },
    body: JSON.stringify({
      ...getCsrfRequestPayload(),
      idBoard: args.boardId,
      pos: args.pos,
    }),
  });

  const member = await response.json();

  return prepareDataForApolloCache(member, rootNode);
};

export const removeBoardStar: TrelloRestResolver<
  MutationRemoveBoardStarArgs
> = async (obj, args, context) => {
  const apiUrl = sanitizeUrl`/1/member/${{
    value: args.memberId,
    type: 'memberId',
  }}/boardStars/${{
    value: args.boardStarId,
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

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });

    throw await parseNetworkError(response);
  }

  return true;
};

export const updateBoardStar: TrelloRestResolver<
  MutationUpdateBoardStarArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/member/${{
    value: args.memberId,
    type: 'memberId',
  }}/boardStars/${{
    value: args.boardStarId,
    type: 'otherId',
  }}`;

  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      ...getCsrfRequestPayload(),
      pos: args.pos,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  const json = await response.json();

  return prepareDataForApolloCache(json, rootNode);
};

export const addSavedSearch: TrelloRestResolver<
  MutationAddSavedSearchArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  if (!args.memberId) {
    throw new Error('memberId is required');
  }

  const apiUrl = sanitizeUrl`/1/member/${{
    value: args.memberId,
    type: 'memberId',
  }}/savedSearches`;

  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      ...args.savedSearch,
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

export const deleteSavedSearch: TrelloRestResolver<
  MutationDeleteSavedSearchArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  if (!args.memberId) {
    throw new Error(
      'memberId is required and was not provided in the "deleteSavedSearch" resolver',
    );
  }

  const apiUrl = sanitizeUrl`/1/member/${{
    value: args.memberId,
    type: 'memberId',
  }}/savedSearches/${{
    value: args.savedSearchId,
    type: 'otherId',
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

  return prepareDataForApolloCache(await response.json(), rootNode);
};

export const enableMemberProfileSync: TrelloRestResolver<
  MutationEnableMemberProfileSyncArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const searchParams = new URLSearchParams(
    getCsrfRequestPayload({ fallbackValue: '' }),
  );

  const apiUrl = sanitizeUrl`/1/member/${{
    value: args.memberId,
    type: 'memberId',
  }}/atlassianAccount/clearProfileSyncBlock`;

  const postResponse = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: searchParams.toString(),
  });

  if (!postResponse.ok) {
    // Sometimes the server sends us just the string as the error, however
    // sometimes the server also sends a JSON error with the key 'message'
    // as the error
    let message = await postResponse.text(); // Parse it as text
    let data = null;

    try {
      data = JSON.parse(message); // Try to parse it as json
      message = data.message;
      // eslint-disable-next-line no-empty
    } catch {}

    sendNetworkErrorEvent({
      url: apiUrl,
      response: await postResponse.clone().text(),
      status: postResponse.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(postResponse);
  }

  // Re-fetch the Member so that the return will correctly update the apollo cache
  const refetchUrl = sanitizeUrl`/1/member/${{
    value: args.memberId,
    type: 'memberId',
  }}?fields=aaBlockSyncUntil`;

  const response = await safeTrelloFetch(refetchUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'enableMemberProfileSync',
      operationType: 'query',
      operationName: context.operationName,
    },
  });

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: refetchUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  const member = await response.json();
  return prepareDataForApolloCache(member, rootNode);
};

export const unblockMemberProfileSync: TrelloRestResolver<
  MutationUnblockMemberProfileSyncArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const searchParams = new URLSearchParams(
    getCsrfRequestPayload({ fallbackValue: '' }),
  );

  const apiUrl = sanitizeUrl`/1/member/${{
    value: args.memberId,
    type: 'memberId',
  }}/atlassianAccount/migrationComplete`;

  const postResponse = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: searchParams.toString(),
  });

  if (!postResponse.ok) {
    // Sometimes the server sends us just the string as the error, however
    // sometimes the server also sends a JSON error with the key 'message'
    // as the error
    let message = await postResponse.text(); // Parse it as text
    let data = null;

    try {
      data = JSON.parse(message); // Try to parse it as json
      message = data.message;
      // eslint-disable-next-line no-empty
    } catch {}

    throw new Error(message);
  }

  // Re-fetch the Member so that the return will correctly update the apollo cache
  const refetchUrl = sanitizeUrl`/1/member/${{
    value: args.memberId,
    type: 'memberId',
  }}?fields=aaBlockSyncUntil,oneTimeMessagesDismissed,requiresAaOnboarding`;

  const response = await safeTrelloFetch(refetchUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'unblockMemberProfileSync',
      operationType: 'query',
      operationName: context.operationName,
    },
  });
  if (!response.ok) {
    throw new Error(
      `Invalid response status ${response.status} from GET ${response.url}`,
    );
  }
  const member = await response.json();

  return prepareDataForApolloCache(member, rootNode);
};

// Internal endpoint for development and trelloinc members
export const deleteOneTimeMessagesDismissed: TrelloRestResolver<
  MutationDeleteOneTimeMessagesDismissedArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const searchParams = new URLSearchParams(
    getCsrfRequestPayload({ fallbackValue: '' }),
  );

  searchParams.set('value', args.message);

  const apiUrl = sanitizeUrl`/1/members/${{
    value: args.memberId,
    type: 'memberId',
  }}/oneTimeMessagesDismissed`;

  const response = await safeFetch(apiUrl, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: searchParams,
  });

  const member = await response.json();

  return prepareDataForApolloCache(member, rootNode);
};

export const addOneTimeMessagesDismissed: TrelloRestResolver<
  MutationAddOneTimeMessagesDismissedArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const searchParams = new URLSearchParams(
    getCsrfRequestPayload({ fallbackValue: '' }),
  );

  searchParams.set('value', args.messageId);

  const apiUrl = sanitizeUrl`/1/members/${{
    value: args.memberId,
    type: 'memberId',
  }}/oneTimeMessagesDismissed`;

  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    body: searchParams,
    headers: {
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
  });

  const member = await response.json();

  return prepareDataForApolloCache(member, rootNode);
};

export const addMessageDismissed: TrelloRestResolver<
  MutationAddMessageDismissedArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/members/${{
    value: args.memberId,
    type: 'memberId',
  }}/messagesDismissed`;

  const response = await safeTrelloFetch(
    apiUrl,
    {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        name: args.name,
        ...getCsrfRequestPayload(),
        lastDismissed: args.lastDismissed,
      }),
      headers: {
        'X-Trello-Client-Version': context.clientAwareness.version,
        'Content-Type': 'application/json',
      },
    },
    {
      clientVersion,
      networkRequestEventAttributes: {
        operationName: context.operationName,
        resolver: 'addMessageDismissed',
        operationType: 'mutation',
        source: 'graphql',
      },
    },
  );

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  const member = await response.json();

  return prepareDataForApolloCache(member, rootNode);
};

export const memberAgreementsResolver: TrelloRestResolver<object> = async (
  member: {
    id: string;
  },
  args,
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  let model = null;

  const apiUrl = sanitizeUrl`/1/members/${{
    value: member.id,
    type: 'memberId',
  }}/agreements`;

  try {
    const response = await safeTrelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Member.agreements',
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

    return model ? prepareDataForApolloCache(model, rootNode, 'Member') : model;
  } catch (err) {
    console.error(err);
    return model;
  }
};

export const memberAtlassianOrganizationsResolver: TrelloRestResolver<
  object
> = async (
  member: {
    id: string;
  },
  args,
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  let model = null;

  const apiUrl = sanitizeUrl`/1/members/${{
    value: member.id,
    type: 'memberId',
  }}/atlassianOrganizations`;

  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'Member.atlassianOrganizations',
      operationName: context.operationName,
    },
  });

  if (response.ok) {
    model = await response.json();
  } else if (response.status === 404) {
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

  // attempt to populate SSO URLs for any administered Orgs without a value
  await Promise.all(
    model.map(async (org: Member_Atlassian_Organization) => {
      /*
        Server always sends back an `ssoUrl` field.
        We make it the default value for `ssoUrls` here
        to minimize risk and for backwards compatibility.
      */
      org.ssoUrls = org.ssoUrl ? [org.ssoUrl] : [];

      if (org.isIdentityAdmin) {
        try {
          const ssoUrls = await atlassianOrganizationSsoUrl(
            member.id,
            org.id,
            context,
          );
          if (ssoUrls.length) {
            org.ssoUrls = ssoUrls;
          }
        } catch (e) {
          console.error(e);
          // If the request to fetch the SAML configuration fails,
          // we don't want to re-throw that error from here, because there
          // could be successful requests for other AtlOrgs. But we do want
          // to surface that error in the UI. So we set flexAuthError and use
          // that in the component to show an error message.
          org.flexAuthError = true;
        }
      }
    }),
  );
  return model ? prepareDataForApolloCache(model, rootNode, 'Member') : model;
};

export const acceptDeveloperTerms: TrelloRestResolver<
  MutationAcceptDeveloperTermsArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  let model = null;

  const apiUrl = sanitizeUrl`/1/members/${{
    value: args.memberId,
    type: 'memberId',
  }}/agreements`;

  try {
    const response = await safeFetch(apiUrl, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        agreementType: 'developer-terms',
        ...getCsrfRequestPayload(),
      }),
    });

    if (response.ok) {
      model = await response.json();
    } else {
      throw new Error(
        `An error occurred while resolving a GraphQL mutation. (status: ${response.status}, statusText: ${response.statusText})`,
      );
    }

    return model ? prepareDataForApolloCache(model, rootNode) : model;
  } catch (err) {
    console.error(err);
    return model;
  }
};

export const updateMemberProfile: TrelloRestResolver<
  MutationUpdateMemberProfileArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const operationNameInUrl = developerConsoleState.value.operationNameInUrl;

  const params = new URLSearchParams();
  if (operationNameInUrl) {
    params.set('operationName', context.operationName);
  }

  const apiUrl =
    params.size > 0
      ? sanitizeUrl`/1/members/me?${params}`
      : sanitizeUrl`/1/members/me`;

  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      ...args.profile,
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

export const updateMemberColorBlindPref: TrelloRestResolver<
  MutationUpdateMemberColorBlindPrefArgs
> = async (obj, args, context, info) => {
  const { colorBlind } = args;
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const operationNameInUrl = developerConsoleState.value.operationNameInUrl;

  const params = new URLSearchParams();
  if (operationNameInUrl) {
    params.set('operationName', context.operationName);
  }

  const apiUrl =
    params.size > 0
      ? sanitizeUrl`/1/member/me?${params}`
      : sanitizeUrl`/1/member/me`;

  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      'prefs/colorBlind': colorBlind,
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

export const addCampaign: TrelloRestResolver<MutationAddCampaignArgs> = async (
  obj,
  args,
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/members/me/campaigns`;

  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      ...(args || {}),
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

export const updateCampaign: TrelloRestResolver<
  MutationUpdateCampaignArgs
> = async (obj, args, context) => {
  const { campaignId, ...rest } = args;

  const apiUrl = sanitizeUrl`/1/members/me/campaigns/${{
    value: campaignId,
    type: 'otherId',
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
      ...(rest || {}),
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
};

export const resendVerificationEmail: TrelloRestResolver<
  MutationResendVerificationEmailArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  let model = null;

  const apiUrl = sanitizeUrl`/resendValidate`;

  const { email, confirmReturnUrl } = args;

  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      email,
      confirmReturnUrl,
      ...getCsrfRequestPayload(),
    }),
  });

  if (response.ok) {
    model = await response.json();

    if (model.badEmail) {
      throw new NetworkError('bad email', {
        code: MemberErrorExtensions.BAD_EMAIL,
        status: 400,
      });
    } else if (model.alreadyConfirmed) {
      throw new NetworkError('already confirmed', {
        code: MemberErrorExtensions.ALREADY_CONFIRMED_EMAIL,
        status: 400,
      });
    }
  } else {
    throw new Error(
      `An error occurred while resolving a GraphQL mutation. (status: ${response.status}, statusText: ${response.statusText})`,
    );
  }

  return prepareDataForApolloCache({ success: true }, rootNode);
};

export const memberCustomEmojiResolver: TrelloRestResolver<
  QueryMemberCustomEmojiArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const { id } = args;

  const apiUrl = sanitizeUrl`/1/members/${{
    value: id,
    type: 'memberId',
  }}/customEmoji`;

  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'memberCustomEmoji',
      operationName: context.operationName,
      traceId: undefined,
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

export const memberActionsResolver: TrelloRestResolver<
  QueryMemberActionsArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const { memberId, limit, page, idModels } = args;

  const memberActions = [
    'addAttachmentToCard',
    'addChecklistToCard',
    'addMemberToBoard',
    'addMemberToCard',
    'addToOrganizationBoard',
    'commentCard',
    'convertToCardFromCheckItem',
    'copyBoard',
    'copyCard',
    'copyCommentCard',
    'copyInboxCard',
    'createBoard',
    'createCard',
    'createInboxCard',
    'createList',
    'createCustomField',
    'deleteAttachmentFromCard',
    'deleteCard',
    'deleteCustomField',
    'deleteList',
    'disablePlugin',
    'disablePowerUp',
    'emailCard',
    'enablePlugin',
    'enablePowerUp',
    'makeAdminOfBoard',
    'makeNormalMemberOfBoard',
    'makeObserverOfBoard',
    'moveCardFromBoard',
    'moveCardToBoard',
    'moveInboxCardToBoard',
    'moveListFromBoard',
    'moveListToBoard',
    'removeChecklistFromCard',
    'removeDeprecatedPlugin',
    'removeFromOrganizationBoard',
    'removeMemberFromCard',
    'unconfirmedBoardInvitation',
    'unconfirmedOrganizationInvitation',
    'updateBoard',
    'updateCard:idList',
    'updateCard:closed',
    'updateCard:due',
    'updateCard:dueComplete',
    'updateCheckItemStateOnCard',
    'updateCustomField',
    'updateCustomFieldItem',
    'updateList:closed',
    'updateMember',
  ];

  const params = new URLSearchParams({
    filter: memberActions.join(','),
    limit: limit?.toString() ?? '10',
    display: 'true',
    page: page?.toString() ?? '0',
  });

  if (idModels) {
    params.set('idModels', idModels.join(','));
  }

  const apiUrl = sanitizeUrl`/1/members/${{
    value: memberId,
    type: 'memberId',
  }}/actions?${params}`;

  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'memberActions',
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
  return prepareDataForApolloCache(actions, rootNode);
};

// Very specific resolver to use on /members/id/cards
export const memberCardsResolver: TrelloRestResolver<
  QueryMemberCardsArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const { id, limit, before, modifiedSince, sort, traceId } = args;

  const params = new URLSearchParams();
  params.set('filter', 'visible');
  params.set('stickers', 'true');
  params.set('attachments', 'true');
  params.set('members', 'true');

  if (limit) {
    params.set('limit', limit.toString());
  }
  if (before) {
    params.set('before', before);
  }
  if (modifiedSince) {
    params.set('modifiedSince', modifiedSince.toString());
  }
  if (sort) {
    params.set('sort', sort);
  }

  const apiUrl = sanitizeUrl`/1/members/${{
    value: id,
    type: 'memberId',
  }}/cards?${params}`;

  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'memberCards',
      operationName: context.operationName,
      traceId: traceId ? traceId : undefined,
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

export const memberCardsQueryResolver: TrelloRestResolver<
  QueryMemberCardsQueryArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const { id, limit, sort, search, activeSince, due, dueComplete, idBoards } =
    args;
  const params = new URLSearchParams();
  if (limit) {
    params.set('limit', limit.toString());
  }
  if (sort) {
    params.set('sort', sort);
  }
  if (search) {
    params.set('search', search);
  }
  if (activeSince) {
    params.set('activeSince', activeSince);
  }
  if (due) {
    params.set('due', due);
  }
  // If dueComplete is undefined, it will not be included in the query
  if (dueComplete !== undefined && dueComplete !== null) {
    params.set('dueComplete', dueComplete.toString());
  }
  if (idBoards) {
    params.set('idBoards', idBoards);
  }

  const apiUrl = sanitizeUrl`/1/members/${{
    value: id,
    type: 'memberId',
  }}/cards/query?${params}`;
  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'memberCardsQuery',
      operationName: context.operationName,
    },
  });

  if (response.ok) {
    const cards = await response.json();
    return prepareDataForApolloCache(cards, rootNode);
  } else {
    throw new Error(
      `An error occurred while resolving memberCardsQuery GraphQL query. (status: ${response.status}, statusText: ${response.statusText})`,
    );
  }
};

export const memberIdFromUsernameResolver: TrelloRestResolver<
  QueryMemberIdFromUsernameArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const { username } = args;

  if (username === undefined) {
    throw new Error(
      'username is required and was not provided in the "memberIdFromUsernameResolver" resolver',
    );
  }

  const apiUrl = sanitizeUrl`/1/members/${{
    value: dangerouslyConvertPrivacyString(username!),
    type: 'username',
  }}?fields=id`;

  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'memberIdFromUsername',
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

export const memberSearchResolver: TrelloRestResolver<
  QueryMemberSearchArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const params = new URLSearchParams();

  Object.entries(args).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, value.toString());
    }
  });

  const apiUrl = sanitizeUrl`/1/search/members?${params}`;

  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'memberSearch',
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

export const updateMarketingOptIn: TrelloRestResolver<
  MutationUpdateMarketingOptInArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const { optedIn, prompt } = args;

  const apiUrl = sanitizeUrl`/1/members/me`;

  const response = await safeTrelloFetch(
    apiUrl,
    {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        'marketingOptIn/optedIn': optedIn,
        'marketingOptIn/displayText': prompt,
        ...getCsrfRequestPayload(),
      }),
    },
    {
      clientVersion,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'updateMarketingOptIn',
        operationName: context.operationName,
        operationType: 'mutation',
      },
    },
  );

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  const member = await response.json();
  return prepareDataForApolloCache(member, rootNode);
};

export const updateNotificationEmailFrequency: TrelloRestResolver<
  MutationUpdateNotificationEmailFrequencyArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const { id, frequency } = args;

  const params = new URLSearchParams({
    'prefs/minutesBetweenSummaries': frequency.toString(),
  });

  const apiUrl = sanitizeUrl`/1/members/${{
    value: id,
    type: 'memberId',
  }}?${params}`;

  const response = await safeTrelloFetch(
    apiUrl,
    {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
        ...Analytics.getTaskRequestHeaders(args.traceId),
      },
      body: JSON.stringify({
        ...getCsrfRequestPayload(),
      }),
    },
    {
      clientVersion,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'updateNotificationEmailFrequency',
        operationName: context.operationName,
        operationType: 'mutation',
      },
    },
  );

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  const member = await response.json();
  return prepareDataForApolloCache(member, rootNode);
};

export const updateNotificationChannelSettings: TrelloRestResolver<
  MutationUpdateNotificationChannelSettingsArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const { blockedKeys, channel } = args;

  const apiUrl = sanitizeUrl`/1/members/me/notificationChannelSettings`;

  const response = await safeTrelloFetch(
    apiUrl,
    {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        channel,
        blockedKeys,
        ...getCsrfRequestPayload(),
      }),
    },
    {
      clientVersion,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'updateNotificationChannelSettings',
        operationName: context.operationName,
        operationType: 'mutation',
      },
    },
  );

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  const member = await response.json();
  return prepareDataForApolloCache(member, rootNode);
};

export const notificationChannelSettingsResolver: TrelloRestResolver<
  QueryNotificationChannelSettingsArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  let member = null;

  const apiUrl = sanitizeUrl`/1/members/me/notificationChannelSettings/${{
    value: args.channel,
    type: 'stringUnion',
    allowedValues: ['email'],
  }}`;

  const getResponse = await safeTrelloFetch(
    apiUrl,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
    {
      clientVersion,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'notificationChannelSettings',
        operationName: context.operationName,
      },
    },
  );

  if (getResponse.ok) {
    member = await getResponse.json();
  } else {
    // Since the notification settings mongo collection is not being
    // backfilled for all users, the first time a user comes to the
    // notifications settings screen, the API request to get their
    // settings will return 404. The endpoint does not have the
    // option to do a POST so we do a PUT instead. This flow will
    // only happen once per user.
    if (getResponse.status === 404) {
      const createResponse = await safeTrelloFetch(apiUrl, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Trello-Client-Version': context.clientAwareness.version,
        },
        body: JSON.stringify({
          channel: args.channel,
          blockedKeys: [],
          ...getCsrfRequestPayload(),
        }),
      });
      if (createResponse.ok) {
        member = await createResponse.json();
      } else {
        sendNetworkErrorEvent({
          url: apiUrl,
          response: await createResponse.clone().text(),
          status: createResponse.status,
          operationName: context.operationName,
        });
        throw await parseNetworkError(getResponse);
      }
    } else {
      sendNetworkErrorEvent({
        url: apiUrl,
        response: await getResponse.clone().text(),
        status: getResponse.status,
        operationName: context.operationName,
      });
      throw await parseNetworkError(getResponse);
    }
  }

  return member ? prepareDataForApolloCache(member, rootNode) : member;
};

export const uploadCustomSticker: TrelloRestResolver<
  MutationUploadCustomStickerArgs
> = async (obj, { memberId, workspaceId, file, traceId }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/member/${{
    value: memberId,
    type: 'memberId',
  }}/customStickers`;

  const formData = new FormData();
  formData.set('file', file);
  formData.set('idOrganization', workspaceId || '');

  const csrfPayload = getCsrfRequestPayload({ fallbackValue: '' });
  if (csrfPayload.dsc) {
    formData.set('dsc', csrfPayload.dsc);
  }

  const request = new Promise<JSONObject>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open('POST', apiUrl as unknown as string);
    const tracingHeaders = Analytics.getTaskRequestHeaders(traceId);
    for (const header in tracingHeaders) {
      const value = tracingHeaders[header as keyof typeof tracingHeaders];
      xhr.setRequestHeader(header, value);
    }
    xhr.onload = () => {
      const trelloServerVersion = xhr.getResponseHeader('X-Trello-Version');
      Analytics.setTrelloServerVersion(traceId, trelloServerVersion);

      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.response);
        resolve(response);
      } else {
        sendNetworkErrorEvent({
          url: apiUrl,
          response: xhr.statusText,
          status: xhr.status,
          operationName: context.operationName,
        });

        reject(xhr.statusText);
      }
    };
    xhr.onerror = () => {
      const trelloServerVersion = xhr.getResponseHeader('X-Trello-Version');
      Analytics.setTrelloServerVersion(traceId, trelloServerVersion);

      sendNetworkErrorEvent({
        url: apiUrl,
        response: xhr.statusText,
        status: xhr.status,
        operationName: context.operationName,
      });

      reject({ status: xhr.status, statusText: xhr.statusText });
    };

    xhr.send(formData);
  });

  try {
    const sticker = await request;
    return prepareDataForApolloCache(sticker, rootNode);
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

export const deleteCustomSticker: TrelloRestResolver<
  MutationDeleteCustomStickerArgs
> = async (obj, args, context) => {
  const apiUrl = sanitizeUrl`/1/member/${{
    value: args.memberId,
    type: 'memberId',
  }}/customStickers/${{
    value: args.stickerId,
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

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });

    throw await parseNetworkError(response);
  }

  return true;
};

export const uploadCustomBackground: TrelloRestResolver<
  MutationUploadCustomBackgroundArgs
> = async (obj, { memberId, workspaceId, file, traceId }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const formData = new FormData();

  const apiUrl = sanitizeUrl`/1/member/${{
    value: memberId,
    type: 'memberId',
  }}/customBoardBackgrounds`;

  const csrfPayload = getCsrfRequestPayload({ fallbackValue: '' });
  if (csrfPayload.dsc) {
    formData.set('dsc', csrfPayload.dsc);
  }

  formData.set('file', file);
  formData.set('idOrganization', workspaceId || '');

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

export const updateCustomBackground: TrelloRestResolver<
  MutationUpdateCustomBackgroundArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/member/${{
    value: args.memberId,
    type: 'memberId',
  }}/customBoardBackgrounds/${{
    value: args.backgroundId,
    type: 'otherId',
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
      ...getCsrfRequestPayload(),
      brightness: args.brightness,
      tile: args.tile,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  const json = await response.json();

  return prepareDataForApolloCache(json, rootNode);
};

export const deleteCustomBackground: TrelloRestResolver<
  MutationDeleteCustomBackgroundArgs
> = async (obj, args, context) => {
  const apiUrl = sanitizeUrl`/1/member/${{
    value: args.memberId,
    type: 'memberId',
  }}/customBoardBackgrounds/${{
    value: args.backgroundId,
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

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });

    throw await parseNetworkError(response);
  }

  return true;
};

export const trelloMemberRecap: TrelloRestResolver<
  MutationTrelloMemberRecapArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const urlParams = new URLSearchParams({
    range: args.range,
  });

  const apiUrl = sanitizeUrl`/1/member/${{
    value: args.memberId,
    type: 'memberId',
  }}/recap?${urlParams}`;

  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(''), // TODO: add traceId
    },
  });

  const recapResponse = await response.json();

  return prepareDataForApolloCache(recapResponse, rootNode);
};

export const refreshEmailConfirmation: TrelloRestResolver<
  MutationRefreshEmailConfirmationArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/member/${{
    value: args.memberId,
    type: 'memberId',
  }}/refreshEmailConfirmation`;

  const response = await safeFetch(apiUrl, {
    method: 'POST',
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

  const confirmationResponse = await response.json();

  return prepareDataForApolloCache(confirmationResponse, rootNode);
};

export const revokeToken: TrelloRestResolver<{
  tokenId: string;
}> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/members/me/tokens/${{
    value: args.tokenId,
    type: 'otherId',
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

  return prepareDataForApolloCache({ id: args.tokenId }, rootNode);
};

export const deleteMemberPrivatePluginData: TrelloRestResolver<
  MutationDeleteMemberPrivatePluginDataArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/member/${{
    value: args.memberId,
    type: 'memberId',
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
