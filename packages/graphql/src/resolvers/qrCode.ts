import { sanitizeUrl } from '@trello/safe-urls';

import { safeTrelloFetch } from '../fetch';
import type { QueryQrCodeArgs } from '../generated';
import { isQueryInfo } from '../isQueryInfo';
import { prepareDataForApolloCache } from '../prepareDataForApolloCache';
import type { TrelloRestResolver } from '../types';

export const qrCodeResolver: TrelloRestResolver<QueryQrCodeArgs> = async (
  _parent,
  args,
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const searchParams = new URLSearchParams({ url: args.url });
  const apiUrl = sanitizeUrl`/1/share/qrcode?${searchParams}`;

  const response = await safeTrelloFetch(
    apiUrl,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Board_History.cardsPerList',
        operationName: context.operationName,
      },
    },
  );

  const qrCode = await response.json();

  return prepareDataForApolloCache(
    { imageData: qrCode._value || '' },
    rootNode,
  );
};
