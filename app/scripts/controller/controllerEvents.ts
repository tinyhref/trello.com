import Backbone from '@trello/backbone';

import type { Board } from 'app/scripts/models/Board';
import type { Enterprise } from 'app/scripts/models/Enterprise';
import type { Organization } from 'app/scripts/models/Organization';

interface ControllerEvents {
  on(eventName: 'setViewType', callback: (viewType: string) => void): void;
  on(eventName: 'clearPreviousView', callback: (options: object) => void): void;
  trigger(
    eventName: 'setViewType',
    viewType: Board | Enterprise | Organization | string,
  ): void;
  trigger(
    eventName: 'clearPreviousView',
    options: { isNextViewReact: boolean },
  ): void;
  trigger(eventName: 'clearAttachmentViewer' | 'clearPreviousView'): void;
}

export const controllerEvents: ControllerEvents = {
  ...Backbone.Events,
} as unknown as ControllerEvents;
