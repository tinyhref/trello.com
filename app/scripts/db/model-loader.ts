/* eslint-disable eqeqeq */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS201: Simplify complex destructure assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// eslint-disable-next-line no-restricted-imports
import Bluebird from 'bluebird';

import { Cookies } from '@trello/cookies';
import { QuickLoad } from '@trello/quickload';
import type { TrelloWindow } from '@trello/window-types';

import { Util } from 'app/scripts/lib/util';
import type { Board } from 'app/scripts/models/Board';
import type { Card } from 'app/scripts/models/Card';
import type { Enterprise } from 'app/scripts/models/Enterprise';
import type { PayloadQuery } from 'app/scripts/network/payloads';
import Payloads, {
  attachmentsUnion,
  membershipUnion,
} from 'app/scripts/network/payloads';
import type {
  BoardChecklistsQuery,
  BoardChecklistsQueryVariables,
} from './queries/BoardChecklistsQuery.generated';
import { BoardChecklistsDocument } from './queries/BoardChecklistsQuery.generated';
import { loadApiDataFromGraphQL } from './loadApiDataFromGraphQL';
import { loadApiDataFromPayload } from './loadApiDataFromPayload';
import { loadApiDataFromQuickLoad } from './loadApiDataFromQuickLoad';
import { triggerWaits, waitFor } from './waitFor';

declare const window: TrelloWindow;

/**
 * @deprecated in favor of `getInvitationTokens()` from `@trello/invitation-tokens`
 */
function invitationTokens() {
  const inviteRegex = /invite-token-[-a-f0-9]*/g;
  return (() => {
    let cookieName;
    const result = [];
    while ((cookieName = inviteRegex.exec(document.cookie)?.[0]) != null) {
      result.push(Cookies.get(cookieName));
    }
    return result;
  })();
}

export const extendQuery = (
  { query, mappingRules }: PayloadQuery,
  moreQuery: object,
) => ({
  query: { ...query, ...moreQuery },
  mappingRules,
});

export const EnterpriseMemberDashboardEndpoints = {
  deactivatedEnterprise: 'deactivated',
  licensed: 'licensed',
  licensedCollaborator: 'boardGuests',
  managedFree: 'activeManagedFree',
};

class LoaderHelpers {
  triggerWaits(eventName: string) {
    return triggerWaits(eventName);
  }

  waitFor(type: string, callback: () => void) {
    return waitFor(type, callback);
  }

  await(type: string) {
    return new Bluebird((resolve) => {
      return this.waitFor(type, resolve);
    });
  }

  getPreloadTraceId() {
    return QuickLoad.getPreloadTraceId();
  }
}
class Loaders extends LoaderHelpers {
  loadHeaderData() {
    return loadApiDataFromQuickLoad('MemberHeader', {
      idModel: 'me',
      isHeaderLoad: true,
      modelType: 'Member',
    });
  }

  loadBoardsData() {
    // the /u/:username/boards requires all orgs for all boards and all memberships for all orgs the user is in
    // so if we are on that route, we should load data from that quickload query
    // if we aren't on that route, then we shouldn't need all that extra information and can rely on the new slim query for performance gains
    const userBoardsRegex = /^\/u\/([^/]+)\/boards$/;
    const memberBoardsQuery = userBoardsRegex.test(window.location.pathname)
      ? 'MemberBoardsHome'
      : 'MemberBoards';
    return loadApiDataFromQuickLoad(memberBoardsQuery, {
      idModel: 'me',
      modelType: 'Member',
      mappingRules: {
        memberships: membershipUnion,
      },
    });
  }

  loadBoardMinimal(id: string) {
    return loadApiDataFromPayload('Board', {
      id,
      payload: Payloads.boardMinimal,
    });
  }

  loadBoardData(id: string, payload: PayloadQuery, traceId: string) {
    return loadApiDataFromPayload('Board', {
      id,
      payload,
      traceId,
    });
  }

  loadBoardMembers(id: string) {
    return loadApiDataFromPayload('Member', {
      id,
      path: `boards/${id}/members`,
    });
  }

  loadBoardAttachment(idBoard: string) {
    return loadApiDataFromPayload('Board', {
      id: idBoard,
      payload: Payloads.boardAttachment,
    });
  }

  loadCardData(idOrShortId: string, idBoard?: string | null, traceId?: string) {
    if (typeof idBoard !== 'undefined' && idBoard !== null) {
      return loadApiDataFromPayload('Card', {
        id: idOrShortId,
        payload: Payloads.card,
        path: `boards/${idBoard}/cards/${idOrShortId}`,
        traceId,
      });
    } else {
      return loadApiDataFromQuickLoad('PreloadCard', {
        idModel: idOrShortId,
        traceId,
        modelType: 'Card',
      }) as Bluebird<Card>;
    }
  }

  loadCardLinkData(idOrShortId: string) {
    const query = { fields: ['name', 'shortLink', 'idBoard'].join(',') };
    return loadApiDataFromPayload('Card', {
      id: idOrShortId,
      payload: { query },
    });
  }

  loadCardCompleterData(id: string) {
    return loadApiDataFromPayload('Card', {
      id,
      payload: Payloads.cardCompleter,
    });
  }

  loadCardId(idBoard: string, idShort: string) {
    return loadApiDataFromPayload('Card', {
      id: idShort,
      payload: Payloads.idCard,
      path: `boards/${idBoard}/cards/${idShort}`,
    }).then((card) => card.get('id'));
  }

  loadCardDetails(idCard: string, limit: number) {
    return loadApiDataFromPayload('Card', {
      id: idCard,
      payload: extendQuery(Payloads.cardDetails, { actions_limit: limit }),
      path: `cards/${idCard}`,
    });
  }

  loadCardHideDetails(idCard: string, limit: number) {
    return loadApiDataFromPayload('Card', {
      id: idCard,
      payload: extendQuery(Payloads.cardDetails, {
        actions: 'commentCard,copyCommentCard,createCard,copyCard',
        actions_limit: limit,
      }),
      path: `cards/${idCard}`,
    });
  }

  loadCardVoters(id: string) {
    return loadApiDataFromPayload('Card', {
      id,
      payload: Payloads.cardVoters,
      path: `cards/${id}`,
    });
  }

  loadCardCopyData(idBoard: string, idOrShortId: string) {
    return loadApiDataFromPayload('Card', {
      id: idOrShortId,
      payload: Payloads.cardCopy,
      path: `boards/${idBoard}/cards/${idOrShortId}`,
    });
  }

  loadCardAttachment(idCard: string) {
    return loadApiDataFromPayload('Card', {
      id: idCard,
      payload: Payloads.cardAttachment,
    });
  }

  loadMemberBoardsData(idOrUsername: string) {
    return loadApiDataFromQuickLoad('MemberBoards', {
      idModel: idOrUsername,
      modelType: 'Member',
    });
  }

  loadMemberEmail(idOrUsername: string) {
    return loadApiDataFromPayload('Member', {
      id: idOrUsername,
      payload: {
        query: {
          fields: 'email',
          invitationTokens: invitationTokens().join(','),
        },
      },
    });
  }

  loadOrganizationCredits(idOrOrgName: string) {
    return loadApiDataFromPayload('Organization', {
      id: idOrOrgName,
      payload: Payloads.organizationCredits,
    });
  }

  loadMoreActionData(
    modelType: string,
    idOrName: string,
    page: number,
    limit: number,
    idModels: string[],
    filter: string,
  ) {
    const query: {
      filter: string;
      limit: number;
      page: number;
      display: boolean;
      idModels?: string;
    } = { filter: 'all', limit, page, display: true };
    if (typeof idModels !== 'undefined' && idModels !== null) {
      query.idModels = idModels.join(',');
    }
    if (typeof filter !== 'undefined' && filter !== null) {
      query.filter = filter;
    }

    return loadApiDataFromPayload('Action', {
      id: idOrName,
      payload: { query },
      path: `${modelType}s/${idOrName}/actions`,
    });
  }

  loadListCards(idList: string) {
    return loadApiDataFromPayload('List', {
      id: idList,
      payload: Payloads.listCards,
    });
  }

  loadArchivedLists(idBoard: string) {
    return loadApiDataFromPayload('Board', {
      id: idBoard,
      payload: Payloads.archivedLists,
    });
  }

  loadArchivedListsAndCards(idBoard: string) {
    return loadApiDataFromPayload('Board', {
      id: idBoard,
      payload: Payloads.archivedListsAndCards,
    });
  }

  loadMemberLogins(idOrUsername: string) {
    return loadApiDataFromPayload('Member', {
      id: idOrUsername,
      payload: {
        query: {
          fields: 'email',
          logins: true,
        },
      },
    });
  }

  loadMemberCustomBackgrounds(idOrUsername: string) {
    return loadApiDataFromPayload('Member', {
      id: idOrUsername,
      payload: {
        query: {
          fields: '',
          boardBackgrounds: 'custom',
        },
      },
    });
  }

  loadMemberCustomStickers(idOrUsername: string) {
    return loadApiDataFromPayload('Member', {
      id: idOrUsername,
      payload: {
        query: {
          fields: '',
          customStickers: 'all',
        },
      },
    });
  }

  loadMemberCustomEmoji(idOrUsername: string) {
    return loadApiDataFromPayload('Member', {
      id: idOrUsername,
      payload: {
        query: {
          fields: '',
          customEmoji: 'all',
        },
      },
    });
  }

  loadMemberEnterpriseUserType(
    enterpriseIdOrName: string,
    idOrUsername: string,
  ) {
    const query = { fields: 'userType' };
    return loadApiDataFromPayload('Member', {
      id: idOrUsername,
      payload: { query },
      path: `enterprises/${enterpriseIdOrName}/members/${idOrUsername}`,
    });
  }

  loadMemberEnterpriseActive(enterpriseIdOrName: string, idOrUsername: string) {
    const query = { fields: 'active' };
    return loadApiDataFromPayload('Member', {
      id: idOrUsername,
      payload: { query },
      path: `enterprises/${enterpriseIdOrName}/members/${idOrUsername}`,
    });
  }

  loadMemberNonPublicFields(idOrUsername: string) {
    const query = { fields: 'nonPublic' };
    return loadApiDataFromPayload('Member', {
      id: idOrUsername,
      payload: { query },
      path: `members/${idOrUsername}`,
    });
  }

  loadOrganizationPlugins(idOrOrgName: string) {
    const query = { enabledBoards: true };
    return loadApiDataFromPayload('Plugin', {
      payload: { query },
      path: `organizations/${idOrOrgName}/plugins`,
    });
  }

  loadOrganizationData(idOrOrgName: string, traceId?: string) {
    return loadApiDataFromPayload('Organization', {
      id: idOrOrgName,
      payload: Payloads.organization,
      traceId,
    });
  }

  loadOrganizationBoardsData(idOrOrgName: string, traceId?: string) {
    return loadApiDataFromPayload('Organization', {
      id: idOrOrgName,
      payload: Payloads.organizationBoardsPage,
      traceId,
    });
  }

  loadWorkspaceBoardsData(idOrOrgName: string) {
    return loadApiDataFromPayload('Organization', {
      id: idOrOrgName,
      payload: Payloads.workspaceBoardsPage,
    });
  }

  loadOrganizationMinimal(idOrOrgName: string) {
    return loadApiDataFromPayload('Organization', {
      id: idOrOrgName,
      payload: Payloads.organizationMinimal,
    });
  }

  loadOrganizationMembersData(idOrOrgName: string, traceId?: string) {
    return loadApiDataFromPayload('Organization', {
      id: idOrOrgName,
      payload: Payloads.organizationMembers,
      traceId,
    });
  }

  loadOrganizationMembersDataWithAvailableLicenseCount(idOrOrgName: string) {
    return loadApiDataFromPayload('Organization', {
      id: idOrOrgName,
      payload: Payloads.organizationMembersWithAvailableLicenseCount,
    });
  }

  loadOrganizationMembersBoards(idOrOrgName: string) {
    return loadApiDataFromPayload('Organization', {
      id: idOrOrgName,
      payload: Payloads.organizationMembersBoards,
    });
  }

  loadOrganizationMembersCollaborators(idOrOrgName: string) {
    return loadApiDataFromPayload('Organization', {
      id: idOrOrgName,
      payload: Payloads.organizationMembersCollaborators,
    });
  }

  loadOrganizationMembersMinimal(idOrOrgName: string) {
    return loadApiDataFromPayload('Organization', {
      id: idOrOrgName,
      payload: Payloads.organizationMembersMinimal,
    });
  }

  loadOrganizationMembersMinimalWithAvailableLicenseCount(idOrOrgName: string) {
    return loadApiDataFromPayload('Organization', {
      id: idOrOrgName,
      payload: Payloads.organizationFieldsMinimalWithAvailableLicenseCount,
    });
  }

  loadOrganizationMinimalWithoutBoards(idOrOrgName: string) {
    return loadApiDataFromPayload('Organization', {
      id: idOrOrgName,
      payload: Payloads.organizationMinimalWithoutBoards,
    });
  }

  loadOrganizationMaximumAndAvailableLicenseCount(idOrOrgName: string) {
    return loadApiDataFromPayload('Organization', {
      id: idOrOrgName,
      payload: Payloads.organizationFieldsMaximumAndAvailableLicenseCount,
    });
  }

  loadMemberOrganizationsDeactivatedMembers() {
    return loadApiDataFromPayload('Organization', {
      payload: Payloads.memberOrganizationDeactivatedMembers,
      path: 'members/me/organizations',
    });
  }

  loadOrgMemberCardData(idOrOrgName: string, idOrUsername: string) {
    const path = `organization/${idOrOrgName}/members/${idOrUsername}/cards`;
    return loadApiDataFromPayload('Card', {
      id: idOrOrgName,
      payload: Payloads.orgMemberCards,
      path,
    });
  }

  loadOrgNameById(idOrganization: string) {
    const query = { fields: 'name' };
    return loadApiDataFromPayload('Organization', {
      id: idOrganization,
      payload: {
        query,
      },
    }).call('get', 'name');
  }

  loadCurrentBoardMinimal(id: string, traceId?: string) {
    return loadApiDataFromPayload('Board', {
      id,
      payload: Payloads.currentBoardMinimal,
      traceId,
    });
  }

  loadCurrentBoardInfo(id: string, traceId?: string) {
    return loadApiDataFromQuickLoad('CurrentBoardInfo', {
      idModel: id,
      modelType: 'Board',
      traceId,
      mappingRules: {
        attachments: attachmentsUnion,
      },
    }) as Bluebird<Board>;
  }

  loadCurrentBoardListsCards(id: string, traceId?: string) {
    return loadApiDataFromQuickLoad('CurrentBoardListsCards', {
      idModel: id,
      modelType: 'Board',
      traceId,
      mappingRules: {
        attachments: attachmentsUnion,
      },
    }) as Bluebird<Board>;
  }

  loadBoardMinimalForDisplayCard(id: string, traceId?: string) {
    return loadApiDataFromPayload('Board', {
      id,
      payload: Payloads.boardMinimalForDisplayCard,
      traceId,
    });
  }

  async loadBoardChecklists(id: string, traceId: string) {
    return loadApiDataFromGraphQL<
      BoardChecklistsQuery['board'],
      BoardChecklistsQueryVariables
    >('Board', {
      query: BoardChecklistsDocument,
      variables: {
        id,
        traceId,
      },
    });
  }

  loadBoardCompleterData(id: string) {
    return loadApiDataFromPayload('Board', {
      id,
      payload: Payloads.boardCompleter,
    });
  }

  loadBoardName(idBoard: string) {
    const query = { fields: ['name', 'closed', 'shortLink'].join(',') };
    return loadApiDataFromPayload('Board', {
      id: idBoard,
      payload: { query },
    }).call('get', 'name');
  }

  loadBoardPrefs(idBoard: string) {
    const query = { fields: ['prefs'].join(',') };
    return loadApiDataFromPayload('Board', {
      id: idBoard,
      payload: { query },
    }).call('get', 'prefs');
  }

  loadMembersOfEnterpriseDashboard({
    enterpriseIdOrName,
    params,
    endpoint,
  }: {
    enterpriseIdOrName: string;
    params: object;
    endpoint: string;
  }) {
    const query = { fields: Payloads.enterpriseMemberFields, ...params };
    return loadApiDataFromPayload('Member', {
      id: enterpriseIdOrName,
      payload: { query },
      path: `enterprises/${enterpriseIdOrName}/members/${endpoint}`,
      metadataHeaderName: 'X-Trello-API-Query-Meta',
    });
  }

  loadMembersOfEnterprise(enterpriseIdOrName: string, params: object) {
    const query = { fields: Payloads.enterpriseMemberFields, ...params };
    return loadApiDataFromPayload('Member', {
      id: enterpriseIdOrName,
      payload: { query },
      path: `enterprises/${enterpriseIdOrName}/members`,
      metadataHeaderName: 'X-Trello-API-Query-Meta',
    });
  }

  loadEnterpriseOrganizations(enterpriseIdOrName: string, params: object) {
    const query = { fields: Payloads.enterpriseOrganizationFields, ...params };
    return loadApiDataFromPayload('Organization', {
      id: enterpriseIdOrName,
      payload: { query },
      path: `enterprises/${enterpriseIdOrName}/organizations`,
      metadataHeaderName: 'X-Trello-API-Query-Meta',
    });
  }

  loadEnterprisePendingOrganizations(
    enterpriseIdOrName: string,
    query: object,
  ) {
    return loadApiDataFromPayload('PendingOrganization', {
      id: enterpriseIdOrName,
      payload: {
        query,
        mappingRules: Payloads.pendingOrganizations.mappingRules,
      },
      path: `enterprises/${enterpriseIdOrName}/pendingOrganizations`,
      metadataHeaderName: 'X-Trello-API-Query-Meta',
    });
  }

  loadEnterprisePublicBoards(enterpriseIdOrName: string, params: object) {
    const query = {
      ...params,
      filter: 'public',
      organization: true,
      members: 'admins',
    };

    return loadApiDataFromPayload('Board', {
      id: enterpriseIdOrName,
      payload: { query },
      path: `enterprises/${enterpriseIdOrName}/boards`,
      metadataHeaderName: 'X-Trello-API-Query-Meta',
    });
  }

  loadEnterpriseStanding(
    modelType: 'Enterprise' | 'Organization',
    orgOrEnterpriseId: string,
  ): Bluebird<Enterprise['attributes']['paidAccount']> {
    const url = `${Util.pluralize(modelType)}/${orgOrEnterpriseId}/paidAccount`;
    const query = {
      fields: 'enterpriseStanding,pendingDeprovision',
    };
    // This looks like dumb code to branch on because both branches are identical. It's basically
    // to satisfy the TS compiler, even though we are throwing away this function's given
    // return type. Whether this is an org or an enterprise, it is returning only the paidAccount
    // object - and we are only using this after checking for an enterprise product, so in the
    // case it is an org, it is returning the parent enterprise's paidAccount anyway.
    if (modelType === 'Enterprise') {
      return loadApiDataFromPayload('Enterprise', {
        id: orgOrEnterpriseId,
        payload: { query },
        path: url,
      }).then((model) => model.toJSON()) as unknown as Bluebird<
        Enterprise['attributes']['paidAccount']
      >;
    } else {
      return loadApiDataFromPayload('Organization', {
        id: orgOrEnterpriseId,
        payload: { query },
        path: url,
      }).then((model) => model.toJSON()) as unknown as Bluebird<
        Enterprise['attributes']['paidAccount']
      >;
    }
  }

  loadEnterprise(enterpriseIdOrName: string, query: object, traceId?: string) {
    if (query == null) {
      query = {
        organizations: 'all',
        fields: [
          'displayName',
          'idAdmins',
          'idOrganizations',
          'pendingOrganizations',
          'name',
          'organizationPrefs',
          'prefs',
          'products',
          'ssoActivationFailed',
          'ssoDateDelayed',
          'pluginWhitelistingEnabled',
        ].join(','),
      };
    }
    return loadApiDataFromPayload('Enterprise', {
      id: enterpriseIdOrName,
      payload: {
        query,
      },
      traceId,
    });
  }

  loadHighlights({
    before,
    since,
    organization,
  }: {
    before?: string;
    since?: string;
    organization?: string | null;
  }) {
    const query: {
      board_customFields: boolean;
      board_memberships: string;
      card_customFieldItems: boolean;
      action_reactions: boolean;
      before?: string;
      since?: string;
      organization?: string;
    } = {
      board_customFields: true,
      board_memberships: 'all',
      card_customFieldItems: true,
      action_reactions: true,
    };

    if (before) {
      query.before = before;
    }
    if (since) {
      query.since = since;
    }
    if (organization) {
      query.organization = organization;
    }

    return loadApiDataFromPayload('highlights', {
      payload: { query },
      path: 'members/me/highlights',
    });
  }

  loadUpNext(idMember: string) {
    const query = {
      board_customFields: true,
      board_memberships: 'all',
      card_customFieldItems: true,
      action_reactions: true,
    };

    return loadApiDataFromPayload('upNext', {
      payload: { query },
      path: `members/${idMember}/upNext`,
    });
  }

  loadMyOrganizations() {
    return this.loadMemberOrganizations('me');
  }

  loadMyOrganizationsMinimal() {
    return this.loadMemberOrganizations('me', Payloads.organizationsMinimal);
  }

  loadMemberOrganizations(idMember: string, payload?: PayloadQuery | null) {
    if (payload == null) {
      payload = Payloads.organizations;
    }
    return loadApiDataFromPayload('Member', { id: idMember, payload });
  }

  loadSearchData(query: PayloadQuery) {
    return loadApiDataFromPayload('search', {
      payload: { query },
      path: 'search',
    });
  }

  loadModel(modelType: 'Card', id: string, payload: PayloadQuery) {
    return loadApiDataFromPayload(modelType, { id, payload });
  }

  loadBoardPlugins(id: string, locales?: string) {
    // load public plugins, which are cached based on locale
    // then load private ones separately which are not cached
    if (!locales) {
      locales = 'en';
    }
    return Bluebird.all([
      loadApiDataFromPayload('Plugin', {
        payload: {
          query: { preferredLocales: locales },
        },
        path: 'plugins/public',
      }),
      loadApiDataFromPayload('Plugin', {
        payload: {
          query: { filter: 'private' },
        },
        path: `boards/${id}/plugins`,
      }),
    ]).then(([publicPlugins, privatePlugins]) => {
      return publicPlugins.concat(privatePlugins);
    });
  }

  loadBoardEnabledPlugins(id: string) {
    return loadApiDataFromPayload('Plugin', {
      payload: {
        query: {
          filter: 'enabled',
        },
      },
      path: `boards/${id}/plugins`,
    });
  }

  loadEnterprisePlugins(id: string) {
    return loadApiDataFromPayload('Plugin', {
      payload: {
        query: { filter: 'all' },
      },
      path: `enterprises/${id}/plugins`,
    });
  }

  loadPluginsWithClaimedDomains(id: string) {
    return loadApiDataFromPayload('Plugin', {
      payload: {
        query: {
          filter: 'hasClaimedDomains',
        },
      },
      path: `boards/${id}/plugins`,
    });
  }

  loadCustomFields(id: string) {
    return loadApiDataFromPayload('Board', {
      id,
      payload: Payloads.customFields,
    });
  }

  loadQuickBoardsData() {
    return loadApiDataFromQuickLoad('MemberQuickBoards', {
      modelType: 'Member',
    });
  }

  loadQuickBoardsSearch(search: string) {
    return loadApiDataFromQuickLoad('QuickBoardsSearch', {
      idModel: search,
      modelType: 'Board',
    });
  }

  loadAction(id: string) {
    return loadApiDataFromPayload('Action', {
      id,
      payload: Payloads.action,
    });
  }

  loadReactions(idAction: string) {
    return loadApiDataFromPayload('Reaction', {
      id: idAction,
      path: `actions/${idAction}/reactions`,
    });
  }
}

export const ModelLoader = new Loaders();
window.ModelLoader = ModelLoader;
