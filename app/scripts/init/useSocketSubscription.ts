import { useEffect } from 'react';

import { sendErrorEvent } from '@trello/error-reporting';
import type {
  BoardSubscription,
  EnterpriseSubscription,
  MemberSubscription,
  OrganizationSubscription,
} from '@trello/realtime-updater';

import { subscriber } from 'app/scripts/init/subscriber';

type ModelType = 'Board' | 'Enterprise' | 'Member' | 'Organization';
type SubscriptionType =
  | BoardSubscription
  | EnterpriseSubscription
  | MemberSubscription
  | OrganizationSubscription;

export const isMongoId = (id?: string): boolean => {
  return !!id && /^[0-9a-fA-F]{24}$/.test(id);
};

const getEntry = (modelType: ModelType, idModel: string): SubscriptionType => {
  switch (modelType) {
    case 'Member':
      return {
        idModel,
        modelType,
        tags: ['updates'],
      };
    case 'Board':
      return {
        idModel,
        modelType,
        tags: ['clientActions', 'updates'],
      };
    case 'Organization':
      return {
        idModel,
        modelType,
        tags: ['allActions', 'updates'],
      };
    case 'Enterprise':
      return {
        idModel,
        modelType,
        tags: ['allActions', 'updates'],
      };
    default:
      throw new Error('Invalid modelType');
  }
};

export const useSocketSubscription = (
  modelType: ModelType,
  idModel?: string,
  skip?: boolean,
) => {
  useEffect(() => {
    if (!skip) {
      if (idModel && isMongoId(idModel)) {
        const unsubscribe = subscriber.addSubscription(
          getEntry(modelType, idModel),
        );
        return unsubscribe;
      } else {
        sendErrorEvent(
          new Error(
            `Cannot setup subscription to model '${modelType}' using an empty or invalid id: ${idModel}.`,
          ),
        );
      }
    }

    return () => {};
  }, [modelType, idModel, skip]);
};
