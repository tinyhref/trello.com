import type { SourceType } from '@trello/analytics-types';
import type { SendViewedComponentEvent } from '@trello/atlassian-analytics';
import { Analytics } from '@trello/atlassian-analytics';

import { Auth } from 'app/scripts/db/Auth';
import { ModelCache } from 'app/scripts/db/ModelCache';
import type { Board } from 'app/scripts/models/Board';

// these are a collection of wrapper functions to send events to GASv3 for plugins.
// it turns passed in board and card id into containers. Infers idOrganization from idBoard.
// common plugin and board info are put into attributes.
// but other event info like action, source, and other attrs must be passed in

interface SendPluginScreenEventArgs {
  idPlugin: string;
  idBoard: string;
  idCard?: string;
  screenName: SourceType;
  attributes?: Parameters<typeof Analytics.sendScreenEvent>[0]['attributes'];
}

interface SendPluginUIEventArgs {
  idPlugin: string;
  idBoard: string;
  idCard?: string;
  event: Parameters<typeof Analytics.sendUIEvent>[0];
}

interface SendPluginTrackEventArgs {
  idPlugin: string;
  idBoard: string;
  idCard?: string;
  event: Parameters<typeof Analytics.sendTrackEvent>[0];
}

interface SendPluginViewedComponentEventArgs {
  idPlugin: string;
  idBoard: string;
  idCard?: string;
  event: SendViewedComponentEvent;
}

interface SendPluginOperationalEventArgs {
  idPlugin: string;
  idBoard: string;
  idCard?: string;
  event: Parameters<typeof Analytics.sendOperationalEvent>[0];
}

function getCommonPluginAttributes(idPlugin: string) {
  const plugin = ModelCache.get('Plugin', idPlugin);
  if (plugin) {
    return {
      powerUpId: plugin.get('id'),
      powerUpName: plugin.get('public')
        ? plugin.get('listing')?.name || plugin.get('name')
        : undefined,
      isPowerUpPublic: plugin.get('public'),
      idOrganizationOwner: plugin.get('idOrganizationOwner'),
    };
  } else {
    throw new Error(`Failed to get plugin info for ${idPlugin}`);
  }
}

function getCommonBoardAttributes(idBoard: string) {
  const board = ModelCache.get('Board', idBoard) as Board;
  if (board) {
    return {
      powerUpsCount: board.powerUpsCount(),
      canEnableAdditionalPowerUps: board.canEnableAdditionalPowerUps(),
      boardPaidStatus: board.getPaidStatus(),
    };
  } else {
    throw new Error(`Failed to get board data for ${idBoard}`);
  }
}

function getCommonAttributes(idPlugin: string, idBoard: string) {
  const maxUserPaidStatus = Auth?.me()?.getMaxPaidStatus();
  const commonPluginAttributes = idPlugin
    ? getCommonPluginAttributes(idPlugin)
    : {};
  const commonBoardAttributes = idBoard
    ? getCommonBoardAttributes(idBoard)
    : {};
  return {
    maxUserPaidStatus,
    ...commonBoardAttributes,
    ...commonPluginAttributes,
  };
}

function handleFailedPluginEvent(
  args:
    | SendPluginOperationalEventArgs
    | SendPluginScreenEventArgs
    | SendPluginTrackEventArgs
    | SendPluginUIEventArgs
    | SendPluginViewedComponentEventArgs,
  type:
    | 'pluginOperationalEvent'
    | 'pluginScreenEvent'
    | 'pluginTrackEvent'
    | 'pluginUIEvent'
    | 'pluginViewedComponentEvent',
  errorMessage: string,
) {
  Analytics.sendOperationalEvent({
    action: 'failed',
    actionSubject: type,
    source: 'lib:pluginBehavioralAnalytics',
    attributes: {
      errorMessage,
      sendPluginEventArgs: args as unknown as Parameters<
        typeof Analytics.sendScreenEvent
      >[0]['attributes'],
    },
  });
}

export function sendPluginScreenEvent(args: SendPluginScreenEventArgs) {
  try {
    const { idPlugin, idBoard, idCard, screenName, attributes } = args;
    const commonAttributes = getCommonAttributes(idPlugin, idBoard);
    const idOrg = (ModelCache.get('Board', idBoard) as Board).get(
      'idOrganization',
    );
    Analytics.sendScreenEvent({
      name: screenName,
      attributes: { ...commonAttributes, ...attributes },
      containers: {
        card: idCard ? { id: idCard } : undefined,
        board: { id: idBoard },
        organization: { id: idOrg },
      },
    });
  } catch (error) {
    // @ts-expect-error TS(2571): Object is of type 'unknown'.
    handleFailedPluginEvent(args, 'pluginScreenEvent', error.message);
  }
}

export function sendPluginUIEvent(args: SendPluginUIEventArgs) {
  try {
    const { idPlugin, idBoard, idCard, event } = args;
    const idOrg = (ModelCache.get('Board', idBoard) as Board).get(
      'idOrganization',
    );
    const commonAttributes = getCommonAttributes(idPlugin, idBoard);

    const { action, actionSubject, actionSubjectId, ...eventRest } = event;
    if (action === 'clicked' && actionSubject === 'button' && actionSubjectId) {
      Analytics.sendClickedButtonEvent({
        buttonName: actionSubjectId,
        ...eventRest,
        attributes: { ...commonAttributes, ...event.attributes },
        containers: {
          card: idCard ? { id: idCard } : undefined,
          board: { id: idBoard },
          organization: { id: idOrg },
        },
      });
    } else {
      Analytics.sendUIEvent({
        ...event,
        attributes: { ...commonAttributes, ...event.attributes },
        containers: {
          card: idCard ? { id: idCard } : undefined,
          board: { id: idBoard },
          organization: { id: idOrg },
        },
      });
    }
  } catch (error) {
    // @ts-expect-error TS(2571): Object is of type 'unknown'.
    handleFailedPluginEvent(args, 'pluginUIEvent', error.message);
  }
}

export function sendPluginTrackEvent(args: SendPluginTrackEventArgs) {
  try {
    const { idPlugin, idBoard, idCard, event } = args;
    const idOrg = (ModelCache.get('Board', idBoard) as Board).get(
      'idOrganization',
    );
    const commonAttributes = getCommonAttributes(idPlugin, idBoard);
    Analytics.sendTrackEvent({
      ...event,
      attributes: { ...commonAttributes, ...event.attributes },
      containers: {
        card: idCard ? { id: idCard } : undefined,
        board: { id: idBoard },
        organization: { id: idOrg },
      },
    });
  } catch (error) {
    // @ts-expect-error TS(2571): Object is of type 'unknown'.
    handleFailedPluginEvent(args, 'pluginTrackEvent', error.message);
  }
}

export function sendPluginOperationalEvent(
  args: SendPluginOperationalEventArgs,
) {
  try {
    const { idPlugin, idBoard, idCard, event } = args;
    const board = ModelCache.get('Board', idBoard) as Board;
    const idOrg = board?.get('idOrganization');
    const commonAttributes = getCommonAttributes(idPlugin, idBoard);

    Analytics.sendOperationalEvent({
      ...event,
      attributes: { ...commonAttributes, ...event.attributes },
      containers: {
        card: idCard ? { id: idCard } : undefined,
        board: { id: idBoard },
        organization: idOrg ? { id: idOrg } : undefined,
      },
    });
  } catch (error) {
    // @ts-expect-error TS(2571): Object is of type 'unknown'.
    handleFailedPluginEvent(args, 'pluginOperationalEvent', error.message);
  }
}

export function sendPluginViewedComponentEvent(
  args: SendPluginViewedComponentEventArgs,
) {
  try {
    const { idPlugin, idBoard, idCard, event } = args;
    const idOrg = (ModelCache.get('Board', idBoard) as Board).get(
      'idOrganization',
    );
    const commonAttributes = getCommonAttributes(idPlugin, idBoard);
    Analytics.sendViewedComponentEvent({
      ...event,
      attributes: { ...commonAttributes, ...event.attributes },
      containers: {
        card: idCard ? { id: idCard } : undefined,
        board: { id: idBoard },
        organization: { id: idOrg },
      },
    });
  } catch (error) {
    // @ts-expect-error TS(2571): Object is of type 'unknown'.
    handleFailedPluginEvent(args, 'pluginViewedComponentEvent', error.message);
  }
}
