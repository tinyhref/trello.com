// eslint-disable-next-line no-restricted-imports
import Bluebird from 'bluebird';
import _ from 'underscore';

import { getInvitationTokens } from '@trello/invitation-tokens/getInvitationTokens';
import { QuickLoad } from '@trello/quickload';

import { Util } from 'app/scripts/lib/util';
import { ninvoke } from 'app/scripts/lib/util/ninvoke';
import type { Action } from 'app/scripts/models/Action';
import type { Board } from 'app/scripts/models/Board';
import type { Card } from 'app/scripts/models/Card';
import type { Enterprise } from 'app/scripts/models/Enterprise';
import type { List } from 'app/scripts/models/List';
import type { Member } from 'app/scripts/models/Member';
import type { Organization } from 'app/scripts/models/Organization';
import type { PendingOrganization } from 'app/scripts/models/PendingOrganization';
import type { Plugin } from 'app/scripts/models/Plugin';
import type { Reaction } from 'app/scripts/models/Reaction';
import type { PayloadQuery } from 'app/scripts/network/payloads';
import type { ModelTypes } from './loadApiDataFromUrl';
import { loadApiDataFromUrl } from './loadApiDataFromUrl';
import { ModelCache } from './ModelCache';

interface LoadApiDataOptions {
  id?: string | null;
  payload?: PayloadQuery;
  path?: string | null;
  metadataHeaderName?: string | null;
  isHeaderLoad?: boolean | null;
  traceId?: string | null;
}

export function loadApiDataFromPayload(
  modelType: 'Member',
  options: LoadApiDataOptions,
): Bluebird<Member>;
export function loadApiDataFromPayload(
  modelType: 'Organization',
  options: LoadApiDataOptions,
): Bluebird<Organization>;
export function loadApiDataFromPayload(
  modelType: 'Board',
  options: LoadApiDataOptions,
): Bluebird<Board>;
export function loadApiDataFromPayload(
  modelType: 'Card',
  options: LoadApiDataOptions,
): Bluebird<Card>;
export function loadApiDataFromPayload(
  modelType: 'Action',
  options: LoadApiDataOptions,
): Bluebird<Action>;
export function loadApiDataFromPayload(
  modelType: 'Enterprise',
  options: LoadApiDataOptions,
): Bluebird<Enterprise>;
export function loadApiDataFromPayload(
  modelType: 'List',
  options: LoadApiDataOptions,
): Bluebird<List>;
export function loadApiDataFromPayload(
  modelType: 'Plugin',
  options: LoadApiDataOptions,
): Bluebird<Plugin[]>;
export function loadApiDataFromPayload(
  modelType: 'PendingOrganization',
  options: LoadApiDataOptions,
): Bluebird<PendingOrganization>;
export function loadApiDataFromPayload(
  modelType: 'Reaction',
  options: LoadApiDataOptions,
): Bluebird<Reaction>;
export function loadApiDataFromPayload(
  modelType: 'highlights' | 'notificationsCount' | 'search' | 'upNext',
  options: LoadApiDataOptions,
): Bluebird<unknown>;
export function loadApiDataFromPayload(
  modelType: ModelTypes,
  {
    id,
    payload,
    path,
    metadataHeaderName,
    isHeaderLoad,
    traceId,
  }: LoadApiDataOptions,
): Bluebird<unknown> {
  let { query } = payload || {};
  const { operationName, mappingRules = {} } = payload || {};

  // If we gave a class like Board, convert that to "Board"
  if (!_.isString(modelType)) {
    // We expect an error here because we have no way to tell the signature that this can be any Trello Model. I think
    // we should work towards converging on the `modelType: string` signature and then delete this code once it's safe.
    // @ts-expect-error
    modelType = modelType.prototype.typeName;
  }

  if (typeof path === 'undefined' || path === null) {
    path = `${Util.pluralize(modelType)}/${id}`;
  }

  const invitationTokens = getInvitationTokens();
  if (invitationTokens) {
    // Note that this has to match the behavior of quickload; where
    // invitationTokens is added as the last thing
    query = { ...query, invitationTokens };
  }

  const url = QuickLoad.makeUrl(`/1/${path}`, query);

  return loadApiDataFromUrl(url, {
    isHeaderLoad,
    modelType,
    traceId,
    operationName,
    idModel: id,
  }).then(([data, xhr, { wasDerivedFromCache }]) => {
    return Bluebird.try(function () {
      if (data) {
        // we already synced this to the cache in the past, skip syncing
        if (wasDerivedFromCache) {
          return data;
        }

        return ninvoke(
          ModelCache,
          'enqueueDelta',
          modelType,
          data,
          mappingRules,
          { query },
        );
      } else {
        return [];
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }).then(function (models: any) {
      if (metadataHeaderName && xhr) {
        const metadata = JSON.parse(
          xhr.getResponseHeader(metadataHeaderName) || '{}',
        );
        return [models, metadata];
      }

      return models;
    });
  });
}
