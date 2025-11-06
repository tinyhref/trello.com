import { JiraSoftwareSiteAri } from '@atlassian/ari';
import { getApiGatewayUrl } from '@trello/api-gateway';
import { Analytics } from '@trello/atlassian-analytics';
import { clientVersion } from '@trello/config';
import { sendErrorEvent, sendNetworkErrorEvent } from '@trello/error-reporting';
import { fetch } from '@trello/fetch';
import { TrelloStorage } from '@trello/storage';

import { CloudInstanceRestrictedError } from './CloudInstanceRestrictedError';
import { getCachedInvitePermissions } from './getCachedInvitePermissions';
import { getJiraInvitePermissionsStorageKey } from './getJiraInvitePermissionsStorageKey';
import { jiraApiFetch } from './jiraApiFetch';

interface InvitationCapability {
  resourceARI: string;
  role: string;
  directInvite: {
    mode: string;
    domains?: string[];
  };
  invitePendingApproval: { mode: string };
}

export const isInstanceMember = async (idCloud: string): Promise<boolean> => {
  const url = getApiGatewayUrl('permissions/permitted');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': clientVersion,
      },
      body: JSON.stringify({
        permissionId: 'write',
        resourceId: `ari:cloud:jira::site/${idCloud}`,
      }),
    });

    if (response.ok) {
      return (await response.json()).permitted;
    }

    if (response.status === 401) {
      // There is a known issue where logged in Trello users can
      // have a missing or invalid Atlassian auth cookie token.
      Analytics.sendOperationalEvent({
        action: 'attempted',
        actionSubject: 'fetchPermissionsPermitted',
        source: '@trello/jwm',
      });
    } else {
      sendNetworkErrorEvent({
        status: response.status,
        response: 'Error response from permissions/permitted',
        url,
        ownershipArea: 'trello-ghost',
        operationName: 'isInstanceMember',
      });
    }

    return false;
  } catch (error) {
    sendErrorEvent(error, {
      tags: {
        feature: 'JWM Workspace Linking',
        ownershipArea: 'trello-ghost',
      },
      extraData: {
        component: 'isInstanceMember',
      },
    });
    return false;
  }
};

export const isSiteAdmin = async (idCloud: string): Promise<boolean> => {
  const url = getApiGatewayUrl('permissions/permitted');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': clientVersion,
      },
      body: JSON.stringify({
        permissionId: 'manage',
        resourceId: `ari:cloud:platform::site/${idCloud}`,
      }),
    });

    if (response.ok) {
      return (await response.json()).permitted;
    }

    if (response.status === 401) {
      // There is a known issue where logged in Trello users can
      // have a missing or invalid Atlassian auth cookie token.
      Analytics.sendOperationalEvent({
        action: 'attempted',
        actionSubject: 'fetchPermissionsPermitted',
        source: '@trello/jwm',
      });
    } else {
      sendNetworkErrorEvent({
        status: response.status,
        response: 'Error response from permissions/permitted',
        url,
        ownershipArea: 'trello-ghost',
        operationName: 'isSiteAdmin',
      });
    }

    return false;
  } catch (error) {
    sendErrorEvent(error, {
      tags: {
        feature: 'JWM Workspace Linking',
        ownershipArea: 'trello-ghost',
      },
      extraData: {
        component: 'isSiteAdmin',
      },
    });
    return false;
  }
};

export const canCreateProject = async (idCloud: string): Promise<boolean> => {
  const path = `/3/mypermissions?permissions=CREATE_PROJECT%2CADMINISTER`;

  try {
    const response = await jiraApiFetch(idCloud, path);

    const { CREATE_PROJECT, ADMINISTER } = response.permissions;
    return CREATE_PROJECT.havePermission || ADMINISTER.havePermission;
  } catch (error) {
    if (!(error instanceof CloudInstanceRestrictedError)) {
      sendErrorEvent(error, {
        tags: {
          feature: 'JWM Workspace Linking',
          ownershipArea: 'trello-ghost',
        },
        extraData: {
          component: 'canCreateProject',
        },
      });
    }
    return false;
  }
};

/**
 * https://developer.atlassian.com/cloud/jira/platform/rest/v2/api-group-permissions/#api-rest-api-2-mypermissions-get
 *
 * Returns both the success of the call and whether the user can view the project.  This is to allow the consumer to
 * retry if user permissions have not yet propagated.
 *
 * From reading the docs, this endpoint will return HTTP 400 if there are no results
 *
 * @param idCloud jira instance
 * @returns success of the call and the ability to browse projects
 */
export const canBrowseProjects = async (
  idCloud: string,
): Promise<{ success: boolean; result: boolean }> => {
  const path = `/2/mypermissions?permissions=BROWSE_PROJECTS`;

  try {
    const response = await jiraApiFetch(idCloud, path);
    const { BROWSE_PROJECTS } = response.permissions;
    return { success: true, result: BROWSE_PROJECTS.havePermission };
  } catch (error) {
    return { success: false, result: false };
  }
};

export const canInvite = async (
  idCloud: string,
): Promise<{ canInvite: boolean; hasDomainRestrictions: boolean }> => {
  const url = getApiGatewayUrl(
    `v3/invitations/capabilities?resource=ari:cloud:platform::site/${idCloud}`,
  );

  const siteAri = JiraSoftwareSiteAri.create({
    siteId: idCloud,
  }).toString();

  try {
    const cachedInvitePermissions = getCachedInvitePermissions(idCloud);
    if (cachedInvitePermissions) {
      return Promise.resolve({
        canInvite: cachedInvitePermissions.canInvite,
        hasDomainRestrictions: cachedInvitePermissions.hasDomainRestrictions,
      });
    }
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'X-Trello-Client-Version': clientVersion,
      },
    });

    if (response.ok) {
      const inviteCapabilities = await response.json();
      const jiraCapability = inviteCapabilities.find(
        (c: InvitationCapability) => c.resourceARI === siteAri,
      );
      const directInvite = jiraCapability?.directInvite;
      const domainRestrictions =
        directInvite?.mode === 'DOMAIN_RESTRICTED' &&
        directInvite?.domains?.length > 0;

      const inviteData = {
        canInvite: directInvite?.mode === 'ANYONE' || domainRestrictions,
        hasDomainRestrictions: domainRestrictions,
      };

      // update cached value
      TrelloStorage.set(getJiraInvitePermissionsStorageKey(idCloud), {
        timestamp: Date.now(),
        data: inviteData,
      });

      return inviteData;
    }

    if (response.status === 401) {
      Analytics.sendOperationalEvent({
        action: 'attempted',
        actionSubject: 'fetchInvitationsCapabilities',
        source: '@trello/jwm',
      });
    } else {
      sendNetworkErrorEvent({
        status: response.status,
        response: 'Error response from invitations/capabilities',
        url,
        ownershipArea: 'trello-ghost',
        operationName: 'canInvite',
      });
    }

    return { canInvite: false, hasDomainRestrictions: false };
  } catch (error) {
    sendErrorEvent(error, {
      tags: {
        feature: 'JWM Workspace Linking',
        ownershipArea: 'trello-ghost',
      },
      extraData: {
        component: 'canInvite',
      },
    });
    return { canInvite: false, hasDomainRestrictions: false };
  }
};
