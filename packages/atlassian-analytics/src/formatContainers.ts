import type {
  EventContainer,
  EventContainerType,
} from '@trello/analytics-types';

type ContainerId = string | null | undefined;

interface InputContainerIds {
  // New preference for ID syntax: https://hello.atlassian.net/wiki/spaces/TRFC/pages/2672708415/RFC+Consistent+naming+for+idBoard+idOrg+etc.+in+the+web+repo
  boardId?: ContainerId;
  cardId?: ContainerId;
  enterpriseId?: ContainerId;
  listId?: ContainerId;
  organizationId?: ContainerId;
  sourceBoardId?: ContainerId;
  workspaceId?: ContainerId;
  // Legacy preference for ID syntax:
  idBoard?: ContainerId;
  idCard?: ContainerId;
  idEnterprise?: ContainerId;
  idList?: ContainerId;
  idOrganization?: ContainerId;
}

const inputToContainer: Record<keyof InputContainerIds, EventContainerType> =
  Object.freeze({
    boardId: 'board',
    cardId: 'card',
    enterpriseId: 'enterprise',
    listId: 'list',
    organizationId: 'organization',
    sourceBoardId: 'sourceBoard',
    workspaceId: 'workspace',

    idBoard: 'board',
    idCard: 'card',
    idEnterprise: 'enterprise',
    idList: 'list',
    idOrganization: 'organization',
  });

/**
 * Conveniently formats an EventContainer from common ID keys.
 *
 * @param {InputContainerIds} ids Container IDs with named keys.
 *
 * @example
 * // Creates containers structures in a single line.
 * Analytics.sendTrackEvent({
 *    action: 'created',
 *    actionSubject: 'card',
 *    containers: formatContainers({ boardId, cardId }),
 * });
 * @example
 * // Formats containers with valid values.
 * formatContainers({
 *    cardId: '5f7ca1ad307cc152471a3f2c',
 *    enterpriseId: null,
 * });
 * // Outputs `{ card: { id: '5f7ca1ad307cc152471a3f2c' } }`;
 */
export const formatContainers = (ids: InputContainerIds): EventContainer =>
  Object.entries(ids).reduce((acc, [key, id]): EventContainer => {
    if (!id) {
      return acc;
    }
    const container = inputToContainer[key as keyof InputContainerIds];
    if (container) {
      acc[container] = { id };
    }
    return acc;
  }, {} as EventContainer);
