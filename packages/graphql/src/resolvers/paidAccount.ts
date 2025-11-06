import type { GraphQLResolveInfo } from 'graphql';

import { sendNetworkErrorEvent } from '@trello/error-reporting';
import { parseNetworkError } from '@trello/graphql-error-handling';
import { sanitizeUrl } from '@trello/safe-urls';
import { getCsrfRequestPayload } from '@trello/session-cookie/csrf';

import { safeFetch, safeTrelloFetch } from '../fetch';
import type {
  MutationCancelWorkspacePaidAccountArgs,
  MutationExtendTrialPaidSubscriptionArgs,
  MutationPreAuthorizeWorkspaceCreditCardArgs,
  MutationRedeemPromoCodeArgs,
  MutationStartWorkspacePaidSubscriptionArgs,
  MutationUpdateOrganizationBillingContactDetailsArgs,
  MutationUpdateOrganizationBillingInvoiceDetailsArgs,
  MutationUpdateOrganizationCreditCardArgs,
  MutationUpdateOrganizationPaidProductArgs,
  QueryAddMembersPriceQuotesArgs,
  QueryFreeToAddMembersArgs,
  QueryMemberStatementsArgs,
  QueryNewSubscriptionListPriceQuotesArgs,
  QueryNewSubscriptionPriceQuotesArgs,
  QueryOrganizationStatementsArgs,
  QueryRenewalPriceQuotesArgs,
} from '../generated';
import { isQueryInfo } from '../isQueryInfo';
import { prepareDataForApolloCache } from '../prepareDataForApolloCache';
import type { QueryInfo, ResolverContext, TrelloRestResolver } from '../types';

export const newSubscriptionListPriceQuotesResolver: TrelloRestResolver<
  QueryNewSubscriptionListPriceQuotesArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const queryParams = new URLSearchParams();
  queryParams.set('product', String(args.product));
  if (args.includeUnconfirmed) {
    queryParams.set('includeUnconfirmed', 'true');
  }

  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: args.accountId,
    type: 'workspaceId',
  }}/paidAccount/newSubscriptionListPriceQuotesV2?${queryParams}`;

  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'NewSubscriptionListPriceQuotes',
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

  const quotes = await response.json();
  return prepareDataForApolloCache(quotes, rootNode);
};

export const memberStatementsResolver: TrelloRestResolver<
  QueryMemberStatementsArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/members/${{
    value: args.accountId,
    type: 'memberId',
  }}/paidAccount/transactions`;

  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'Statements',
      operationName: context.operationName,
    },
  });

  // Intentionally swallowing errors and returning an empty array.
  // Running this query on a free account will result in a 404
  return prepareDataForApolloCache(
    response.ok ? await response.json() : [],
    rootNode,
  );
};

export const organizationStatementsResolver: TrelloRestResolver<
  QueryOrganizationStatementsArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: args.accountId,
    type: 'workspaceId',
  }}/paidAccount/transactions`;

  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'Statements',
      operationName: context.operationName,
    },
  });

  // Intentionally swallowing errors and returning an empty array.
  // Running this query on a free account will result in a 404
  return prepareDataForApolloCache(
    response.ok ? await response.json() : [],
    rootNode,
  );
};

export const newSubscriptionPriceQuotesResolver: TrelloRestResolver<
  QueryNewSubscriptionPriceQuotesArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const queryParams = new URLSearchParams();
  (
    [
      'product',
      'country',
      'postalCode',
      'taxId',
      'stateTaxId',
      'promoCode',
    ] as const
  ).forEach((param) => {
    if (args[param]) {
      queryParams.set(param, String(args[param]));
    }
  });
  if (args.includeUnconfirmed) {
    queryParams.set('includeUnconfirmed', 'true');
  }
  if (args.isVatRegistered) {
    queryParams.set('isVatRegistered', 'true');
  }

  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: args.accountId,
    type: 'workspaceId',
  }}/paidAccount/newSubscriptionPriceQuotes?${queryParams}`;

  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'NewSubscriptionPriceQuotes',
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

  const quotes = await response.json();
  return prepareDataForApolloCache(quotes, rootNode);
};

export const renewalPriceQuotesResolver: TrelloRestResolver<
  QueryRenewalPriceQuotesArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: args.accountId,
    type: 'workspaceId',
  }}/paidAccount/renewalPriceQuotes`;

  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'RenewalPriceQuotes',
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

  const quotes = await response.json();
  return prepareDataForApolloCache(quotes, rootNode);
};

export const addMembersPriceQuotesResolver: TrelloRestResolver<
  QueryAddMembersPriceQuotesArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/organization/${{
    value: args.accountId,
    type: 'workspaceId',
  }}/paidAccount/addMembersPriceQuotes`;

  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      members: args.members,
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

  const quote = await response.json();
  return prepareDataForApolloCache(quote, rootNode);
};

export const upgradePriceQuotesResolver: TrelloRestResolver<
  QueryNewSubscriptionPriceQuotesArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const queryParams = new URLSearchParams();

  if (args['product']) {
    queryParams.set('product', String(args['product']));
  }

  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: args.accountId,
    type: 'workspaceId',
  }}/paidAccount/upgradePriceQuotes?${queryParams}`;

  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'UpgradePriceQuotes',
      operationType: 'mutation',
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

  const quotes = await response.json();
  return prepareDataForApolloCache(quotes, rootNode);
};

export const preAuthorizeWorkspaceCreditCard: TrelloRestResolver<
  MutationPreAuthorizeWorkspaceCreditCardArgs
> = async (obj, args, context, info) => {
  const { traceId, idOrganization, product, ...body } = args;

  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: args.idOrganization,
    type: 'workspaceId',
  }}/paidAccount/preauthorize`;

  const response = await safeTrelloFetch(
    apiUrl,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...body,
        products: [product.toString()],
        ...getCsrfRequestPayload(),
      }),
    },
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'preAuthorizeWorkspaceCreditCard',
        operationName: context.operationName,
        operationType: 'mutation',
        traceId: traceId ?? undefined,
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

  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const model = await response.json();
  return prepareDataForApolloCache(model, rootNode);
};

export const startWorkspacePaidSubscription: TrelloRestResolver<
  MutationStartWorkspacePaidSubscriptionArgs
> = async (obj, args, context, info) => {
  const { traceId, idOrganization, product, ...body } = args;

  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: args.idOrganization,
    type: 'workspaceId',
  }}/paidAccount/startsubscription`;

  const response = await safeTrelloFetch(
    apiUrl,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...body,
        products: [product.toString()],
        ...getCsrfRequestPayload(),
      }),
    },
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'startWorkspacePaidSubscription',
        operationName: context.operationName,
        operationType: 'mutation',
        traceId: traceId ?? undefined,
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

  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const model = await response.json();
  return prepareDataForApolloCache(model, rootNode);
};

export const extendTrialPaidSubscription: TrelloRestResolver<
  MutationExtendTrialPaidSubscriptionArgs
> = async (obj, args, context, info) => {
  const { traceId, idOrganization, product, ...body } = args;

  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: args.idOrganization,
    type: 'workspaceId',
  }}/paidAccount/extendTrial`;

  const response = await safeTrelloFetch(
    apiUrl,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...body,
        products: [product.toString()],
        ...getCsrfRequestPayload(),
      }),
    },
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'extendTrialPaidSubscription',
        operationName: context.operationName,
        operationType: 'mutation',
        traceId: traceId ?? undefined,
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

  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const model = await response.json();
  return prepareDataForApolloCache(model, rootNode);
};

/**
 * Update the Credit Card on file for a paid account
 */
export const updateOrganizationCreditCard = async (
  obj: object,
  args: MutationUpdateOrganizationCreditCardArgs,
  context: ResolverContext,
  info: GraphQLResolveInfo | QueryInfo,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: args.accountId,
    type: 'workspaceId',
  }}/paidAccount/creditCard`;

  const response = await safeTrelloFetch(
    apiUrl,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nonce: args.nonce,
        country: args.country,
        zipCode: args.zipCode,
        taxId: args.taxId,
        stateTaxId: args.stateTaxId,
        isVatRegistered: args.isVatRegistered,
        ...getCsrfRequestPayload(),
      }),
    },
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'updateOrganizationCreditCard',
        operationName: context.operationName,
        operationType: 'mutation',
        traceId: args.traceId ?? undefined,
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

  const model = await response.json();

  return prepareDataForApolloCache(model, rootNode);
};

/**
 * Update / change product associated with paid account.
 * This mutation can be used to switch a monthly account to an annual
 * account, or to renew a cancelled subscription before it expires.
 */
export const updateOrganizationPaidProduct = async (
  obj: object,
  args: MutationUpdateOrganizationPaidProductArgs,
  context: ResolverContext,
  info: GraphQLResolveInfo | QueryInfo,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: args.accountId,
    type: 'workspaceId',
  }}/paidAccount/products`;

  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      products: args.products.toString(),
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

export const updateOrganizationBillingContactDetails = async (
  obj: object,
  args: MutationUpdateOrganizationBillingContactDetailsArgs,
  context: ResolverContext,
  info: GraphQLResolveInfo | QueryInfo,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: args.accountId,
    type: 'workspaceId',
  }}/paidAccount/billingContact`;

  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      billingContactFullName: args.contactName,
      billingContactEmail: args.contactEmail,
      billingContactLocale: args.contactLocale,
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

export const updateOrganizationBillingInvoiceDetails = async (
  obj: object,
  args: MutationUpdateOrganizationBillingInvoiceDetailsArgs,
  context: ResolverContext,
  info: GraphQLResolveInfo | QueryInfo,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: args.accountId,
    type: 'workspaceId',
  }}/paidAccount/invoice`;

  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      invoiceDetails: args.invoiceDetails,
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

export const cancelWorkspacePaidAccount = async (
  obj: object,
  args: MutationCancelWorkspacePaidAccountArgs,
  context: ResolverContext,
  info: GraphQLResolveInfo | QueryInfo,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/organizations/${{
    value: args.accountId,
    type: 'workspaceId',
  }}/paidAccount/cancel`;

  const response = await safeFetch(apiUrl, {
    method: 'POST',
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

export const redeemPromoCode: TrelloRestResolver<
  MutationRedeemPromoCodeArgs
> = async (obj, args, context, info) => {
  const redeemUrl = sanitizeUrl`/1/organizations/${{
    value: args.accountId,
    type: 'workspaceId',
  }}/redeem`;

  const redeemResponse = await safeTrelloFetch(
    redeemUrl,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: args.promoCode,
        ...getCsrfRequestPayload(),
      }),
    },
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'redeemPromoCode',
        operationName: context.operationName,
        operationType: 'mutation',
      },
    },
  );

  if (!redeemResponse.ok) {
    sendNetworkErrorEvent({
      url: redeemUrl,
      response: await redeemResponse.clone().text(),
      status: redeemResponse.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(redeemResponse);
  }

  const params = new URLSearchParams();
  params.set('fields', ['credits', 'offering'].join(','));
  params.set('paidAccount', 'true');
  params.set('paidAccount_fields', 'all');

  const paidAccountUrl = sanitizeUrl`/1/organizations/${{
    value: args.accountId,
    type: 'workspaceId',
  }}?${params}`;

  const paidAccountResponse = await safeTrelloFetch(paidAccountUrl);
  if (!paidAccountResponse.ok) {
    sendNetworkErrorEvent({
      url: redeemUrl,
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

export const isFreeToAddMembersResolver = async (
  obj: object,
  args: QueryFreeToAddMembersArgs,
  context: ResolverContext,
  info: GraphQLResolveInfo | QueryInfo,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/organization/${{
    value: args.accountId,
    type: 'workspaceId',
  }}/paidAccount/isFreeToAdd`;

  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      members: args.members,
      potentialMembers: args.potentialMembers,
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

  const jsonResponse = await response.json();
  const formattedResults = Object.entries(jsonResponse).map(
    ([memberId, isFreeToAdd]): { id: string; isFreeToAdd: boolean } => ({
      id: memberId,
      isFreeToAdd: isFreeToAdd as boolean,
    }),
  );
  return prepareDataForApolloCache(formattedResults, rootNode);
};
