/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS201: Simplify complex destructure assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// eslint-disable-next-line no-restricted-imports
import Bluebird from 'bluebird';
import _ from 'underscore';

import type { PremiumFeature } from '@trello/entitlements';
import { Entitlements } from '@trello/entitlements';
import { ApiError } from '@trello/error-handling';
import type { BillingDates, ExpirationDates } from '@trello/paid-account';

import { AttachmentTypes } from 'app/scripts/data/attachment-types';
import { Auth } from 'app/scripts/db/Auth';
import {
  EnterpriseMemberDashboardEndpoints,
  ModelLoader,
} from 'app/scripts/db/model-loader';
import { ModelCache } from 'app/scripts/db/ModelCache';
import { attachmentTypeFromUrl } from 'app/scripts/lib/util/url/attachment-type-from-url';
import type { MemberList } from 'app/scripts/models/collections/MemberList';
import type { ModelWithPreferencesAttributes } from 'app/scripts/models/internal/ModelWithPreferences';
import { ModelWithPreferences } from 'app/scripts/models/internal/ModelWithPreferences';
import type { Member } from 'app/scripts/models/Member';
import type { Plugin } from 'app/scripts/models/Plugin';
import { ApiPromise } from 'app/scripts/network/ApiPromise';
import Payloads from 'app/scripts/network/payloads';
import { BoardInviteRestrictValues } from 'app/scripts/views/organization/Constants';
import type { Board } from './Board';

type ExpansionType = 'disabled' | 'purchase' | 'ticket';

interface EnterprisePrefs extends Record<string, unknown> {
  canIssueManagedConsentTokens: boolean;
  ssoOnly: boolean;
  selfServiceExpansionType: ExpansionType;
  adminHubOptIn: boolean;
}

interface EnterpriseAIPrefs extends Record<string, unknown> {
  atlassianIntelligenceEnabled: boolean;
}

interface PaidAccount {
  products: number[];
  standing: number;
  dateFirstSubscription?: string;
  trialExpiration?: string;
  billingDates?: BillingDates | null;
  expirationDates?: ExpirationDates | null;
  needsCreditCardUpdate?: boolean;
  enterpriseStanding?: number | null;
  pendingDeprovision?: string | null;
}

export interface EnterpriseAttributes extends ModelWithPreferencesAttributes {
  id: string;
  atlOrgId: string;
  isAtlassianOrg: string;
  displayName: string;
  hasClaimedDomains: boolean;
  logoHash: string;
  name: string;
  offering: string;
  aiPrefs: EnterpriseAIPrefs;
  prefs: EnterprisePrefs;
  paidAccount: PaidAccount | null;
  organizationPrefs: Record<string, unknown>;
  idAdmins: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  licenses: any;
  pluginWhitelistingEnabled: boolean;
  idPluginsAllowed: string[];
  products: number[];
  sandbox: boolean | null;
  sandboxExpiry: string | null;
  premiumFeatures: PremiumFeature[];
}

interface Enterprise extends ModelWithPreferences<EnterpriseAttributes> {
  typeName: 'Enterprise';
  displayName: string;
  plugins: Plugin[];
  pluginsLoading: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  api: any;
  licensesLoadFailed: boolean;
  licensesLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  memberList: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  organizationList: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pendingOrganizationList: any;
  pluginWhitelistingLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  publicBoardList: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trigger: any;
}

class Enterprise extends ModelWithPreferences<EnterpriseAttributes> {
  static initClass() {
    this.prototype.typeName = 'Enterprise';
    // @ts-expect-error TS(2339): Property 'nameAttr' does not exist on type 'Enterp... Remove this comment to see the full error message
    this.prototype.nameAttr = 'name';
    // @ts-expect-error TS(2339): Property 'urlRoot' does not exist on type 'Enterpr... Remove this comment to see the full error message
    this.prototype.urlRoot = '/1/enterprises';

    this.lazy({
      organizationList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          OrganizationList,
        } = require('app/scripts/models/collections/OrganizationList');
        return new OrganizationList();
      },

      memberList(): MemberList {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          MemberList,
        } = require('app/scripts/models/collections/MemberList');
        return new MemberList();
      },

      pendingOrganizationList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          PendingOrganizationList,
        } = require('app/scripts/models/collections/PendingOrganizationList');
        return new PendingOrganizationList();
      },

      publicBoardList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          PublicBoardList,
        } = require('app/scripts/models/collections/PublicBoardList');
        return new PublicBoardList();
      },
    });
  }

  constructor(attr?: Partial<EnterpriseAttributes>) {
    super(...arguments);
    this.triggerSubpropertyChangesOn('organizationPrefs');
    this.triggerSubpropertyChangesOn('aiPrefs');
    this.enablePluginWhitelisting = this.enablePluginWhitelisting.bind(this);
    this.disablePluginWhitelisting = this.disablePluginWhitelisting.bind(this);
  }

  initialize() {
    // @ts-expect-error
    super.initialize(...arguments);

    this.licensesLoading = true;
    this.licensesLoadFailed = false;
    this.pluginsLoading = true;
    return (this.pluginWhitelistingLoading = false);
  }

  getOrganizationPref(name: string) {
    return this.get('organizationPrefs')?.[name];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setOrganizationPref(name: string, value: string, opts?: any, next?: any) {
    return this.update(
      // @ts-expect-error
      `organizationPrefs/${name}`,
      value,
      opts,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (err: any) => {
        if (!err) {
          this._cascadeOrganizationPrefs(name, value);
        }
        if (_.isFunction(next)) {
          return next(err);
        }
      },
    );
  }

  setOrganizationPrefWithTracing(
    name: string,
    value: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    opts: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    next: any,
  ) {
    //TraceId is based in opts to keep with TrelloModel's update param pattern
    return this.update(
      // @ts-expect-error
      `organizationPrefs/${name}`,
      value,
      opts,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (err: any, success: any) => {
        if (!err) {
          this._cascadeOrganizationPrefs(name, value);
        }
        if (_.isFunction(next)) {
          return next(err, success);
        }
      },
    );
  }

  setMultipleOrganizationPrefsWithTracing(
    obj: { [key: string]: string },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    opts: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    next: any,
  ) {
    const keys = Object.keys(obj);
    const updates: { [key: string]: string } = {};
    for (const key of Array.from(keys)) {
      updates[`organizationPrefs/${key}`] = obj[key];
    }
    return this.update(
      // @ts-expect-error
      updates,
      opts,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (err: any, success: any) => {
        if (!err) {
          for (const key of Array.from(keys)) {
            const value = obj[key];
            this._cascadeOrganizationPrefs(key, value);
          }
        }
        if (_.isFunction(next)) {
          return next(err, success);
        }
      },
    );
  }

  // Optimistically update all cached orgs in this enterprise
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _cascadeOrganizationPrefs(name: string, value: any) {
    return (
      this.modelCache
        // @ts-expect-error
        .all('Organization')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((cachedOrg: any) => {
          return cachedOrg.get('idEnterprise') === this.id;
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .forEach((enterpriseOrg: any) => {
          return enterpriseOrg.set({ [`prefs/${name}`]: value });
        })
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deleteOrganizationPrefWithTracing(name: string, traceId: any, next: any) {
    this.set({ [`organizationPrefs/${name}`]: undefined });
    return this.api(
      {
        type: 'delete',
        method: `organizationPrefs/${name}`,
        traceId,
      },
      next,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deleteOrganizationPref(name: string, next: any) {
    this.set({ [`organizationPrefs/${name}`]: undefined });
    return this.api(
      {
        type: 'delete',
        method: `organizationPrefs/${name}`,
      },
      next,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setIdpValue(field: string, value: any) {
    return ApiPromise({
      url: `/1/enterprises/${this.id}/idp/${field}`,
      type: 'PUT',
      data: {
        value,
      },
    }).then(() => {
      this.set({ [`idp/${field}`]: value });
      return this.trigger('change:idp');
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loadPageOfMembers(query: any) {
    // When the workspace or enterprise admin filter is enabled in the UI
    // it uses the association type to filter the members.
    const isAdminFilterEnabled =
      query.associationTypes.includes('organizationAdmin') ||
      query.associationTypes.includes('enterpriseAdmin');

    const areAnyDashboardFiltersEnabled =
      !!query.filter || isAdminFilterEnabled;

    // The dashboard endpoints provide the best performance for unfiltered queries
    const shouldUseDashboardEndpoint = !areAnyDashboardFiltersEnabled;

    if (shouldUseDashboardEndpoint) {
      return ModelLoader.loadMembersOfEnterpriseDashboard({
        enterpriseIdOrName: this.get('name'),
        params: query,
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        endpoint: EnterpriseMemberDashboardEndpoints[query.associationTypes],
      }).then((result: unknown) => {
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        const [members] = result;
        if (members.length > 0) {
          return this.memberList.add(members);
        }
        return result;
      });
    }

    // workaround for ensuring that deactivated members are NOT shown on the
    // managedFree and licensed members pages. This is required because the filterable
    // /members endpoint does not automatically filter out deactivated but the more
    // specific routes (/licensed & /activeManagedFree) do.
    const shouldRemoveDeactivated =
      query.associationTypes.includes('managedFree') ||
      query.associationTypes.includes('licensed');
    const adjustedQuery = {
      ...query,
      filter: shouldRemoveDeactivated
        ? query.filter + ` and (deactivatedEnterprises ne "${this.id}")`
        : query.filter,
    };

    return ModelLoader.loadMembersOfEnterprise(
      this.get('name'),
      adjustedQuery,
    ).then((result: unknown) => {
      // @ts-expect-error TS(2571): Object is of type 'unknown'.
      const [members] = result;
      if (members.length > 0) {
        this.memberList.add(members);
      }
      return result;
    });
  }

  loadLicenses(traceId?: string) {
    if (this.licensesLoadFailed) {
      return Bluebird.resolve();
    }

    this.licensesLoading = true;
    this.trigger('loading:licenses');

    return (
      ModelLoader.loadEnterprise(
        this.id,
        {
          fields: 'licenses',
          organizations: 'none',
        },
        traceId,
      )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch(ApiError.Server, function (this: any, err) {
          this.licensesLoadFailed = true;
          if (err.message !== 'Gateway Timeout') {
            throw err;
          }
        })
        .then(() => {
          this.licensesLoading = false;
          return this.trigger('change:licenses');
        })
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loadPageOfOrganizations(query: any) {
    return ModelLoader.loadEnterpriseOrganizations(
      this.get('name'),
      query,
    ).then((result: unknown) => {
      // @ts-expect-error TS(2571): Object is of type 'unknown'.
      const [organizations] = result;
      if (organizations.length > 0) {
        this.organizationList.add(organizations, { merge: true });
      }
      return result;
    });
  }

  loadMaxMembers() {
    return ModelLoader.loadEnterprise(this.id, {
      // load prefs to refresh maxMembers
      fields: 'prefs',
      organizations: 'none',
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loadPlugins(opts: any) {
    if (opts == null) {
      opts = {};
    }
    if (this.plugins && !opts.force) {
      return Bluebird.resolve();
    }

    this.pluginsLoading = true;
    return ModelLoader.loadEnterprisePlugins(this.id)
      .then((plugins) => {
        this.plugins = plugins;
        return (this.pluginsLoading = false);
      })
      .catch((err) => {
        this.pluginsLoading = false;
        throw err;
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  allowPlugin(idPlugin: any) {
    return ApiPromise({
      url: `/1/enterprises/${this.id}/allowedPlugins`,
      type: 'POST',
      data: {
        idPlugin,
      },
    })
      .then(() => {
        return ModelLoader.loadEnterprise(this.id, {
          fields: 'idPluginsAllowed',
        });
      })
      .then(() => {
        return ModelLoader.loadEnterprisePlugins(this.id).then((plugins) => {
          return (this.plugins = plugins);
        });
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  disablePlugin(idPlugin: any) {
    return ApiPromise({
      url: `/1/enterprises/${this.id}/allowedPlugins`,
      type: 'DELETE',
      data: {
        idPlugin,
      },
    })
      .then(() => {
        return ModelLoader.loadEnterprise(this.id, {
          fields: 'idPluginsAllowed',
        });
      })
      .then(() => {
        return ModelLoader.loadEnterprisePlugins(this.id).then((plugins) => {
          return (this.plugins = plugins);
        });
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loadPageOfPendingOrganizations(query: any) {
    return ModelLoader.loadEnterprisePendingOrganizations(
      this.get('name'),
      query,
    ).then((result: unknown) => {
      // @ts-expect-error TS(2571): Object is of type 'unknown'.
      const [pendingOrganizations] = result;
      if (pendingOrganizations.length > 0) {
        this.pendingOrganizationList.add(pendingOrganizations);
      }
      return result;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loadPageOfPublicBoards(query: any) {
    return ModelLoader.loadEnterprisePublicBoards(this.get('name'), query).then(
      (result: unknown) => {
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        const [publicBoards] = result;
        if (publicBoards.length > 0) {
          this.publicBoardList.add(publicBoards);
        }
        return result;
      },
    );
  }

  // This will determine if an enterprise object has an Enterprise
  // subscription or if it is a Premium PO subscription
  isRealEnterprise() {
    return Entitlements.isEnterprise(this.get('offering'));
  }

  isEnterpriseProductWithoutSSO() {
    return !this.get('premiumFeatures').includes('trelloSso');
  }

  isEnterpriseProductWithoutSelfService() {
    return !this.get('premiumFeatures').includes('selfServeExpansion');
  }

  atlassianOrgLinkingEnabled() {
    return !!this.get('prefs')?.atlassianOrganizationLinking;
  }

  async declinePendingOrganization(idOrganizations: string[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toRemove = this.pendingOrganizationList.filter((org: any) =>
      idOrganizations.includes(org.id),
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toRemove.forEach((org: any) => this.pendingOrganizationList.remove(org));
  }

  async acceptPendingOrganizations(idOrganizations: string[]) {
    /*
     * Removes all pending organizations from the local model,
     * as some areas subscribe to Backbone event updates on this
     * collection via the 'remove' event.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toRemove = this.pendingOrganizationList.filter((org: any) =>
      idOrganizations.includes(org.id),
    );
    // Backbone collections are funky - need to have `this` bound correctly when calling remove, hence the arrow function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toRemove.forEach((org: any) => this.pendingOrganizationList.remove(org));

    /*
     * Although the single version updates the organizationList as well,
     * no other areas appear to reference this list, either directly
     * or via Backbone collection events.
     */

    this.trigger('accept:pendingOrganization');
  }

  updatePublicBoardsVisibility(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    boards: any,
    permissionLevel: string,

    traceId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    next: any,
  ) {
    const idBoards = _.pluck(boards, 'id');

    return ApiPromise({
      url: `/1/enterprises/${this.id}/boards/prefs/permissionLevel`,
      type: 'PUT',
      traceId,
      data: {
        idBoards,
        value: permissionLevel,
        filter: 'public',
      },
    })
      .then((response) => {
        this.publicBoardList.remove(boards);
        next(null, response);
        // If the user tries to access the board view after
        // updating the visibility in the enterprise dashboard,
        // it will not have the new visibility so we have to
        // update the modelCache if it exists
        for (const idBoard of Array.from(idBoards)) {
          const board = ModelCache.get('Board', idBoard);
          if (board != null) {
            const updateBoardPrefs = { ...board.get('prefs'), permissionLevel };
            board.set(updateBoardPrefs);
          }
        }

        return this.trigger('change:enterprisePublicBoards');
      })
      .catch((error) => {
        next(error);
      });
  }

  getAvailableLicenses() {
    if (this.get('licenses') != null) {
      if (this.get('licenses')?.maxMembers) {
        return (
          this.get('licenses').maxMembers - this.get('licenses').totalMembers
        );
      } else {
        return Infinity;
      }
    }
  }

  getAttachmentRestrictions() {
    const attachmentRestrictions =
      this.get('organizationPrefs')?.attachmentRestrictions;

    if (attachmentRestrictions != null) {
      return {
        enabled: attachmentRestrictions,
        // @ts-expect-error
        disabled: _.difference(AttachmentTypes, attachmentRestrictions),
      };
    } else {
      return { enabled: AttachmentTypes, disabled: [] };
    }
  }

  getRestrictedAttachmentTypes() {
    return this.getAttachmentRestrictions().disabled;
  }

  attachmentTypeRestricted(attachmentType: string) {
    let needle;
    return (
      (needle = attachmentType),
      Array.from(this.getRestrictedAttachmentTypes()).includes(needle)
    );
  }

  attachmentUrlRestricted(url: string) {
    const attachmentType = attachmentTypeFromUrl(url);
    return this.attachmentTypeRestricted(attachmentType);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  grantMemberLicense(member: any, traceId: any) {
    return ApiPromise({
      url: `/1/enterprises/${this.id}/members/${member.id}/licensed`,
      type: 'PUT',
      traceId,
      data: {
        fields: Payloads.enterpriseMemberFields,
        value: true,
      },
    }).then((data) => {
      ModelCache.enqueueDelta(member, data);
      this.trigger('change:memberLicensed');
      return data;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setMemberActive(member: any, active: any, traceId: any) {
    return ApiPromise({
      url: `/1/enterprises/${this.id}/members/${member.id}/deactivated`,
      // Larger enterprises were experiencing deactivation request times that exceeded
      // the default 32 second timeout, so it's increased here to the maximum allowed by
      // server for PUT requests, 2 minutes
      timeout: 120000,
      type: 'PUT',
      traceId,
      data: {
        fields: Payloads.enterpriseMemberFields,
        value: !active,
      },
    }).then((data) => {
      ModelCache.enqueueDelta(member, data);
      this.trigger('change:memberActive');
      return data;
    });
  }

  removeMember(member: Member) {
    return ApiPromise({
      url: `/1/enterprises/${this.id}/members/${member.id}`,
      type: 'DELETE',
      // Larger enterprises were experiencing request times that exceeded the
      // default 32 second timeout, so it's increased here to the maximum allowed by
      // server for DELETE requests, 2 minutes
      timeout: 120000,
    });
  }

  assignMemberAdmin(member: Member) {
    const memberModel = this.memberList.get(member.id);
    const roles = memberModel.get('roles');
    const isMemberAlreadyAdmin = roles.find(
      (role: string) => role === 'enterprise.admin',
    );
    if (!isMemberAlreadyAdmin) {
      const newRoles = _.clone(roles);
      newRoles.push('enterprise.admin');
      return memberModel.set('roles', newRoles);
    }
  }

  revokeMemberAdmin(member: Member) {
    const memberModel = this.memberList.get(member.id);
    const roles = memberModel.get('roles');
    const isMemberAlreadyAdmin = roles.find(
      (role: string) => role === 'enterprise.admin',
    );
    if (isMemberAlreadyAdmin) {
      const newRoles = _.clone(roles).filter(
        (role: string) => role !== 'enterprise.admin',
      );
      return memberModel.set('roles', newRoles);
    }
  }

  getTotalMembers() {
    return this.get('licenses')?.totalMembers;
  }

  isNearMaxMembers() {
    const max = this.getMaxMembers();
    if (max == null) {
      return false;
    }
    const count = this.getTotalMembers();
    // "near" means < 5% capacity remaining, or 20 seats, whichever is less
    return max - count <= Math.min(Math.ceil(max * 0.05), 20);
  }

  isAtMaxMembers() {
    const max = this.getMaxMembers();
    return max != null && max <= this.getTotalMembers();
  }

  isOverMaxMembers() {
    const max = this.getMaxMembers();
    return max != null && max < this.getTotalMembers();
  }

  getMaxMembers() {
    if (this.get('licenses')) {
      return this.get('licenses').maxMembers;
    } else {
      return this.get('prefs')?.maxMembers;
    }
  }

  getMemberCounts() {
    return this.get('licenses')?.relatedEnterprises;
  }

  hasRelatedEnterprises() {
    return this.get('licenses')?.relatedEnterprises.length > 1;
  }

  parentEnterprise() {
    return this.get('licenses')?.parent;
  }

  isPluginAllowed(idPlugin: string) {
    if (this.get('pluginWhitelistingEnabled')) {
      let needle;
      return (
        (needle = idPlugin),
        Array.from(this.get('idPluginsAllowed') || []).includes(needle)
      );
    } else {
      return true;
    }
  }

  isPluginWhitelistingEnabled() {
    return this.get('pluginWhitelistingEnabled');
  }

  getPluginUsageGroups() {
    const result = {
      inUse: [],
      notInUse: [],
      allowed: [],
    };

    if (!this.plugins) {
      return result;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.plugins.reduce((acc: any, plugin: any) => {
      let needle;
      if (plugin.attributes.boardsCount > 0) {
        acc.inUse.push(plugin);
      } else {
        acc.notInUse.push(plugin);
      }

      if (
        ((needle = plugin.id),
        Array.from(this.get('idPluginsAllowed')).includes(needle))
      ) {
        acc.allowed.push(plugin);
      }

      return acc;
    }, result);
  }

  getInUsePlugins() {
    return this.getPluginUsageGroups().inUse;
  }

  getAllowedPlugins() {
    return this.getPluginUsageGroups().allowed;
  }

  getNotInUsePlugins() {
    return this.getPluginUsageGroups().notInUse;
  }

  // Plugins that would be disabled if PUPs allowlisting were to be turned on.
  getWouldBeDisabledPlugins() {
    return _.uniq(
      _.difference(this.getNotInUsePlugins(), this.getAllowedPlugins()),
    );
  }

  // Plugins that would remain allowed if PUPs allowlisting were to be turned on.
  getWouldRemainAllowedPlugins() {
    return _.uniq(_.union(this.getInUsePlugins(), this.getAllowedPlugins()));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setPluginWhitelisting(enabled: any) {
    this.pluginWhitelistingLoading = true;
    this.trigger('loading:pluginWhitelistingEnabled');
    return ApiPromise({
      url: `/1/enterprises/${this.id}/pluginWhitelistingEnabled`,
      type: 'PUT',
      data: {
        value: enabled,
      },
    })
      .then(() => {
        this.set({ pluginWhitelistingEnabled: enabled });
        this.pluginWhitelistingLoading = false;
        return this.trigger('change:pluginWhitelistingEnabled');
      })
      .catch((err) => {
        this.pluginWhitelistingLoading = false;
        this.trigger('change:pluginWhitelistingEnabled');
        throw err;
      });
  }

  enablePluginWhitelisting() {
    return this.setPluginWhitelisting(true);
  }

  disablePluginWhitelisting() {
    return this.setPluginWhitelisting(false);
  }

  canViewEnterpriseVisibleBoard(member: Member) {
    const idEnterprise = this.get('id');
    return member.attributes.enterpriseLicenses?.some(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (entLicense: any) => entLicense.idEnterprise === idEnterprise,
    );
  }

  canAddTeamlessBoard(board: Board) {
    if (!this.isRealEnterprise()) {
      return true;
    }
    const vis = board.get('prefs').permissionLevel;
    return this.canSetTeamlessBoardVisibility(vis);
  }

  canDeleteTeamlessBoard(board: Board) {
    if (!this.isRealEnterprise()) {
      return true;
    }
    const vis = board.get('prefs').permissionLevel;
    const organizationPrefs = this.get('organizationPrefs');
    // @ts-expect-error
    const pref = organizationPrefs?.boardDeleteRestrict?.[vis];
    return (
      !pref ||
      pref === 'org' ||
      (pref === 'admin' && this.isTeamAdmin(Auth.me()))
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  canSetTeamlessBoardVisibility(vis: any) {
    if (!this.isRealEnterprise()) {
      return true;
    }
    if (['org', 'enterprise'].includes(vis)) {
      return false;
    }
    const organizationPrefs = this.get('organizationPrefs');
    // @ts-expect-error
    const pref = organizationPrefs?.boardVisibilityRestrict?.[vis];
    return (
      !pref ||
      pref === 'org' ||
      (pref === 'admin' && this.isTeamAdmin(Auth.me()))
    );
  }

  isAdmin(member?: Member | null) {
    if (!member) {
      return false;
    }

    if (this.get('idAdmins')?.includes(member.id)) {
      return true;
    }

    if (member.get('idEnterprisesImplicitAdmin')?.includes(this.get('id'))) {
      return true;
    }

    return false;
  }

  isTeamAdmin(member?: Member | null) {
    if (this.isAdmin(member)) {
      // ent admins are always team admins
      return true;
    }
    const idEnterprise = this.get('id');
    return (
      !!member &&
      // @ts-expect-error
      member.organizationList.any(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (org: any) =>
          org.get('idEnterprise') === idEnterprise &&
          org.isPremOrgAdmin(member),
      )
    );
  }

  getAuditLog() {
    return ApiPromise({
      url: `/1/enterprises/${this.id}/auditlog`,
      type: 'GET',
    });
  }

  /**
   * Only use this if you need the shop product SKU for checking legacy
   * behavior such as EnterpriseWithoutSSO. Otherwise, you most likely
   * want to be using isRealEnterprise() instead.
   *
   * @deprecated
   */
  getProduct() {
    return this.get('products')?.[0];
  }

  onlyLicensedMembers() {
    return (
      this.getPref('personalBoardInviteRestrict') &&
      this.getPref('personalBoardInviteRestrict') ===
        BoardInviteRestrictValues.LICENSED
    );
  }

  onlyManagedMembers() {
    return (
      this.getPref('personalBoardInviteRestrict') &&
      this.getPref('personalBoardInviteRestrict') ===
        BoardInviteRestrictValues.MANAGED
    );
  }

  onlyLicensedOrManagedMembers() {
    return (
      this.getPref('personalBoardInviteRestrict') &&
      this.getPref('personalBoardInviteRestrict') ===
        BoardInviteRestrictValues.LICENSED_OR_MANAGED
    );
  }
}
Enterprise.initClass();

export { Enterprise };
