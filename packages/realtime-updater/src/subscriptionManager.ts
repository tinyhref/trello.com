import _ from 'underscore';

import { logConnectionInformation } from '@trello/web-sockets';

import type { RealtimeUpdaterModel } from './realtimeUpdater.types';
import { realtimeUpdaterEvents } from './realtimeUpdaterEvents';
import { INVALID_MODEL_ERRORS } from './socket.constants';
import type { Tag } from './SocketConnection.types';

export class SubscriptionManager {
  currentSubscriptions: Record<string, RealtimeUpdaterModel> = {};

  getSubscriptions() {
    return Object.values(this.currentSubscriptions);
  }

  isInvalidModelError(error: string) {
    // @ts-expect-error This can be any string
    return INVALID_MODEL_ERRORS.includes(error);
  }

  getIxLastUpdate(idModel: string) {
    return this.currentSubscriptions[idModel]
      ? this.currentSubscriptions[idModel].ixLastUpdate
      : undefined;
  }

  setIxLastUpdate(idModel: string, ixLastUpdate: number) {
    let entry;
    if ((entry = this.currentSubscriptions[idModel])) {
      return (entry.ixLastUpdate = ixLastUpdate);
    }
  }

  handleInvalidSubscription(idModelInvalid: string) {
    let subscription;
    if ((subscription = this.currentSubscriptions[idModelInvalid])) {
      const { modelType, idModel, tags } = subscription;

      this.removeSubscription(modelType, idModel);

      const triggerInvalidModel = () => {
        realtimeUpdaterEvents.trigger('invalidModel', modelType, idModel, tags);
      };

      triggerInvalidModel();
    }
  }

  addSubscription(
    modelType: 'Board' | 'Enterprise' | 'Member' | 'Organization',
    idModel: string,
    tags: Tag[],
  ) {
    let subscription;

    logConnectionInformation({
      eventName: 'subscribe',
      source: 'realtimeUpdater',
      payload: {
        modelType,
        idModel,
        tags,
      },
    });

    if ((subscription = this.currentSubscriptions[idModel])) {
      subscription.tags = _.union(subscription.tags, tags);
    } else {
      this.currentSubscriptions[idModel] = {
        tags,
        ixLastUpdate: -1,
        modelType,
        idModel,
      };
    }

    return this.currentSubscriptions[idModel];
  }

  removeSubscription(modelType: string, idModel: string) {
    logConnectionInformation({
      eventName: 'unsubscribe',
      source: 'realtimeUpdater',
      payload: {
        modelType,
        idModel,
      },
    });

    delete this.currentSubscriptions[idModel];
    return this.currentSubscriptions;
  }
}

export const subscriptionManager = new SubscriptionManager();
