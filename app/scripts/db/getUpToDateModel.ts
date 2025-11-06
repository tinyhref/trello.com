import { idCache, isShortLink } from '@trello/id-cache';
import { SupportedSubscriptionChannels } from '@trello/realtime-updater';

import { ModelCache } from 'app/scripts/db/ModelCache';
import type { Board } from 'app/scripts/models/Board';
import type { Member } from 'app/scripts/models/Member';
import type { Organization } from 'app/scripts/models/Organization';
import type { ModelTypes } from './loadApiDataFromUrl';

export const getUpToDateModel = (
  modelType: ModelTypes,
  idModel?: string | null,
) => {
  if (!idModel) {
    return null;
  }

  // if we don't support subscriptions for the model, then let the request happen
  if (!SupportedSubscriptionChannels.some((type) => type === modelType)) {
    return null;
  }

  modelType = modelType as (typeof SupportedSubscriptionChannels)[number];
  idModel =
    modelType === 'Board' && isShortLink(idModel)
      ? idCache.getBoardId(idModel)
      : idModel;
  // @ts-expect-error this error makes no sense. Its modelType Organization, Member, or Board, which there are
  // overrides for.
  const model = ModelCache.get(modelType, idModel) as
    | Board
    | Member
    | Organization
    | undefined;

  // the model doesn't exist in the cache, so let the request happen
  if (!model) {
    return null;
  }

  return model;
};
