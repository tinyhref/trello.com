import _ from 'underscore';

import Backbone from '@trello/backbone';

type BackboneEvents = typeof Backbone.Events;
export interface MonitorEvents extends BackboneEvents {
  trigger(
    name: 'setStale' | 'setStatus' | 'visibilitychange',
    data?: string,
  ): this;
}

export const monitorEvents: MonitorEvents = _.extend({}, Backbone.Events);
