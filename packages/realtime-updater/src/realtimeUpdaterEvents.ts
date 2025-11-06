import _ from 'underscore';

import Backbone from '@trello/backbone';

import type {
  RealtimeDeletePayload,
  RealtimeUpdatePayload,
  RealtimeUpdaterModelType,
} from './realtimeUpdater.types';

type BackboneEvents = typeof Backbone.Events;
// @ts-expect-error
interface RealtimeUpdaterEvents extends BackboneEvents {
  on(
    type: 'updateModels',
    callback: (payload: RealtimeUpdatePayload) => void,
  ): this;
  on(
    type: 'deleteModels',
    callback: (payload: RealtimeDeletePayload) => void,
  ): this;
  on(
    type: 'invalidModel',
    callback: (typeName: RealtimeUpdaterModelType, id: string) => void,
  ): this;
  on(
    type: 'subscription_invalid',
    callback: (modelType: string, modelId: string) => void,
  ): this;
  on(
    type:
      | 'connect_failed'
      | 'connecting'
      | 'ready'
      | 'reconnect_failed'
      | 'reconnect',
    callback: () => void,
  ): this;
  off(
    type: 'reconnect' | 'updateModels' | null,
    callback: ((payload: RealtimeUpdatePayload) => void) | null,
  ): this;
  off(
    type: 'subscription_invalid',
    callback: (modelType: string, modelId: string) => void,
  ): this;
  trigger(
    name:
      | 'deleteModels'
      | 'invalidModel'
      | 'ready'
      | 'reconnect'
      | 'subscription_invalid'
      | 'updateModels',
    data?: object | string,
    idModel?: string,
    tags?: string[],
  ): this;
}

export const realtimeUpdaterEvents: RealtimeUpdaterEvents = _.extend(
  {},
  Backbone.Events,
);
