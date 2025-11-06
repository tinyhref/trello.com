import type { UnbindFn } from 'bind-event-listener';
import { bindAll } from 'bind-event-listener';

import type { PortalEvent } from '@atlaskit/portal';
import { PORTAL_MOUNT_EVENT, PORTAL_UNMOUNT_EVENT } from '@atlaskit/portal';

export type { UnbindFn } from 'bind-event-listener';

// note: addAkPortalEventListener listens to ak portal mount and unmount events (see https://atlassian.design/components/portal/examples)
// it is useful to let other global click event listeners ignore clicks on ak portals

export const activeAkPortals: Set<PortalEvent['detail']['layer']> = new Set();

export const addAkPortalEventListener = (
  {
    eventTarget,
  }: {
    eventTarget: EventTarget;
  } = { eventTarget: window },
) => {
  const portalEventListener = ((event: PortalEvent) => {
    const { type, detail } = event;
    if (detail?.layer !== null) {
      if (type === PORTAL_MOUNT_EVENT) {
        activeAkPortals.add(detail.layer);
      } else if (type === PORTAL_UNMOUNT_EVENT) {
        activeAkPortals.delete(detail.layer);
      }
    }
  }) as EventListener;

  const unbind: UnbindFn = bindAll(eventTarget, [
    {
      type: PORTAL_MOUNT_EVENT,
      listener: portalEventListener,
    },
    {
      type: PORTAL_UNMOUNT_EVENT,
      listener: portalEventListener,
    },
  ]);

  return unbind;
};
