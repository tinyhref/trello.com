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
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// eslint-disable-next-line no-restricted-imports
import Bluebird from 'bluebird';
import _ from 'underscore';

import { Analytics } from '@trello/atlassian-analytics';
import {
  canAddBoardToOrganization,
  canSetVisibilityOnBoard,
  getFreeTrialProperties,
  hasFreeTrialCredit,
} from '@trello/business-logic/organization';
import { validateEmail } from '@trello/emails';
import type { PremiumFeature } from '@trello/entitlements';
import { Entitlements } from '@trello/entitlements';
import { ApiError, getApiError, parseXHRError } from '@trello/error-handling';
import { sendNetworkErrorEvent } from '@trello/error-reporting';
import { getScreenFromUrl } from '@trello/marketing-screens';
import type { BillingDates, ExpirationDates } from '@trello/paid-account';
import { getOrganizationBillingUrl, getOrganizationUrl } from '@trello/urls';

import { getOrganizationInvitationLinkUrl } from 'app/scripts/controller/urls';
import { AttachmentTypes } from 'app/scripts/data/attachment-types';
import { Auth } from 'app/scripts/db/Auth';
import { ModelLoader } from 'app/scripts/db/model-loader';
import { ModelCache } from 'app/scripts/db/ModelCache';
import { attachmentTypeFromUrl } from 'app/scripts/lib/util/url/attachment-type-from-url';
import type { BoardList } from 'app/scripts/models/collections/BoardList';
import type { MemberList } from 'app/scripts/models/collections/MemberList';
import { PluginDataList } from 'app/scripts/models/collections/PluginDataList';
import { TagList } from 'app/scripts/models/collections/TagList';
import type { Enterprise } from 'app/scripts/models/Enterprise';
import { MembershipModel } from 'app/scripts/models/internal/MembershipModel';
import { ModelWithPreferences } from 'app/scripts/models/internal/ModelWithPreferences';
import type { TrelloModelAttributes } from 'app/scripts/models/internal/TrelloModel';
import { Member } from 'app/scripts/models/Member';
import type { Membership } from 'app/scripts/models/Membership';
import type { Tag } from 'app/scripts/models/Tag';
import { ApiAjax } from 'app/scripts/network/ApiAjax';
import { ApiPromise } from 'app/scripts/network/ApiPromise';
import { BoardInviteRestrictValues } from 'app/scripts/views/organization/Constants';
import type { Plugin } from './Plugin';
import type { PluginData } from './PluginData';

type CreditType = 'freeTrial' | 'invitation' | 'promoCode' | 'support';
type MemberType =
  | 'admin'
  | 'deactivated'
  | 'ghost'
  | 'guest'
  | 'invited'
  | 'none'
  | 'normal'
  | 'observer'
  | 'org'
  | 'pending'
  | 'public'
  | 'unconfirmed';

interface Credit {
  id: string;
  count: number;
  type: CreditType;
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

interface OrganizationAttributes extends TrelloModelAttributes {
  id: string;
  displayName: string;
  idEnterprise: string;
  name: string;
  tags: Tag[];
  limits: {
    orgs: {
      freeBoardsPerOrg: {
        count: number;
        disableAt: number;
        warnAt: number;
        status?: 'disabled' | 'maxExceeded' | 'ok' | 'warn';
      };
      usersPerFreeOrg: {
        count: number;
        disableAt: number;
        warnAt: number;
        status?: 'disabled' | 'maxExceeded' | 'ok' | 'warn';
      };
    };
  };
  memberships: Membership[];
  prefs: {
    associatedDomain?: string | null;
    orgInviteRestrict?: string[];
    boardInviteRestrict?: string;
    permissionLevel?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    boardDeleteRestrict?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    attachmentRestrictions?: any;
    newLicenseInviteRestrict?: string;
    newLicenseInviteRestrictUrl?: string;
    atlassianIntelligenceEnabled: boolean;
    archiveCleanupCutOff: number;
  };
  credits: Credit[];
  logoHash?: string | null;
  offering: string;
  paidAccount?: PaidAccount | null;
  premiumFeatures?: PremiumFeature[];
  products?: number[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bulkAddMemberErrors: any;
  availableLicenseCount?: number | null;
  maximumLicenseCount?: number | null;
}

interface Organization extends ModelWithPreferences<OrganizationAttributes> {
  typeName: 'Organization';
  url: () => string;
  boardList: BoardList;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getFreeTrialCreditsPromise: any;
  adminList: MemberList;
  memberList: MemberList;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pluginDataList: any;
  plugins: Plugin[];
  pluginsLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  snoop: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trigger: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let getMemberFromUser: any = undefined;

class Organization
  extends ModelWithPreferences<OrganizationAttributes>
  // @ts-expect-error
  implements MembershipModel
{
  static initClass() {
    this.prototype.typeName = 'Organization';
    // @ts-expect-error TS(2339): Property 'nameAttr' does not exist on type 'Organi... Remove this comment to see the full error message
    this.prototype.nameAttr = 'displayName';
    // @ts-expect-error TS(2339): Property 'urlRoot' does not exist on type 'Organiz... Remove this comment to see the full error message
    this.prototype.urlRoot = '/1/organizations';

    this.lazy({
      invitationList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          OrganizationInvitationList,
        } = require('app/scripts/models/collections/OrganizationInvitationList');
        return new OrganizationInvitationList([]);
      },
      boardList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          BoardList,
        } = require('app/scripts/models/collections/BoardList');
        return new BoardList().syncModel(this, 'idBoards') as BoardList;
      },
      memberList(): MemberList {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          MemberList,
        } = require('app/scripts/models/collections/MemberList');
        return new MemberList().syncModel(this, 'memberships', {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          fxGetIds(memberships: any) {
            return _.pluck(memberships, 'idMember');
          },
        });
      },
      adminList(): MemberList {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          MemberList,
        } = require('app/scripts/models/collections/MemberList');
        return new MemberList().syncModel(this, 'memberships', {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          fxGetIds: (memberships: any) => {
            // The only admins of organizations are those flagged as such on the
            // memberships subdoc.
            const isActiveAdmin = ({
              memberType,
              deactivated,
              unconfirmed,
            }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
            any) =>
              // NOTE: Can't check for deactivated == false; deactivated might not
              // be set, e.g. for non BC orgs
              memberType === 'admin' && !deactivated && !unconfirmed;
            return _.pluck(_.filter(memberships, isActiveAdmin), 'idMember');
          },
        });
      },
      collaboratorList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          MemberList,
        } = require('app/scripts/models/collections/MemberList');
        return new MemberList().syncModel(this, 'collaborators', {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          fxGetIds(member: any) {
            return _.pluck(member, 'id');
          },
        });
      },
      tagList() {
        return new TagList().syncSubModels(this, 'tags');
      },
      pluginDataList() {
        return new PluginDataList([], {
          scopeModel: this,
        }).syncCache(ModelCache, [], (pluginData: PluginData) => {
          return (
            pluginData.get('idModel') === this.id &&
            pluginData.get('scope') === 'organization'
          );
        });
      },
    });

    // @ts-expect-error TS(2339): Property 'prefNames' does not exist on type 'Organ... Remove this comment to see the full error message
    this.prototype.prefNames = [
      'permissionLevel',
      'boardInviteRestrict',
      'orgInviteRestrict',
      'boardVisibilityRestrict',
      'boardDeleteRestrict',
    ];

    // checks to see if input is already a member
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getMemberFromUser = function (user: any) {
      if (user != null ? user.id : undefined) {
        if (!user.idOrganizations && user.attributes) {
          user.idOrganizations = user.attributes.idOrganizations || [];
        }
        return Bluebird.resolve(user);
      } else if (_.isString(user)) {
        // need to fetch member
        return ApiPromise({
          method: 'get',
          url: `/1/members/${user}`,
          data: { fields: 'idOrganizations' },
        }).catch(ApiError.NotFound, (err) => null);
      } else {
        return Bluebird.resolve(null);
      }
    };
  }

  initialize() {
    // @ts-expect-error
    super.initialize();
  }

  editable() {
    return this.ownedByMember(Auth.me());
  }

  isPublic() {
    return this.getPref('permissionLevel') === 'public';
  }

  /**
   * Returns true if the org has *any* paid product
   * (Premium, Standard, PremiumPO, Enterprise)
   */
  hasPaidProduct() {
    return !Entitlements.isFree(this.get('offering'));
  }

  isCcp() {
    return this.isFeatureEnabled('ccpBilling');
  }

  isStandard() {
    return Entitlements.isStandard(this.get('offering'));
  }

  isPremium() {
    return Entitlements.isPremium(this.get('offering'));
  }

  belongsToRealEnterprise() {
    return Entitlements.isEnterprise(this.get('offering'));
  }

  isEnterprise() {
    return this.get('idEnterprise') != null;
  }

  isGrandfatheredBoardLimit() {
    const limit = this.getFreeBoardLimit();

    // @ts-expect-error
    if ((limit != null ? limit.disableAt : undefined) > 10) {
      return true;
    }
    return false;
  }

  ownedByMember(member: Member) {
    return this.getMemberType(member) === 'admin';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  canAddBoard(board: any) {
    // Delegate to our extracted typescript business logic
    return canAddBoardToOrganization({
      // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
      org: this.toJSON(),
      board: board.toJSON(),
      isOrgAdmin: this.owned(),
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  canDeleteBoard(board: any) {
    const vis = board.get('prefs').permissionLevel;
    const pref = this.get('prefs').boardDeleteRestrict?.[vis];

    return !pref || pref === 'org' || (pref === 'admin' && this.owned());
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  canSetVisibility(vis: any) {
    // Delegate to our extracted typescript business logic
    return canSetVisibilityOnBoard({
      // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
      org: this.toJSON(),
      boardVisibility: vis,
      isOrgAdmin: this.owned(),
      isEnterpriseAdmin: this.getEnterprise()?.isAdmin?.(Auth.me()),
    });
  }

  owned() {
    return this.getMemberType(Auth.me()) === 'admin';
  }

  /**
   * Check premium features list for a given feature
   */
  isFeatureEnabled(feature: PremiumFeature) {
    return (this.get('premiumFeatures') || []).includes(feature);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toJSON(opts?: any) {
    if (opts == null) {
      opts = {};
    }
    const data = super.toJSON(...arguments);

    if (opts.url) {
      const orgName = this.get('name');
      // orgName is undefined when it is a private org not visible to me
      if (orgName) {
        data.url = getOrganizationUrl(orgName);
      }
    }

    return data;
  }

  getPermLevel() {
    return this.get('prefs').permissionLevel;
  }

  getAvailableRoles() {
    if (this.isFeatureEnabled('superAdmins')) {
      return ['superadmin', 'normal'];
    } else {
      return ['admin', 'normal'];
    }
  }

  hasObservers() {
    return false;
  }

  setPluginData(idPlugin: string, visibility: string, data: string) {
    return this.pluginDataList.upsert(idPlugin, visibility, data);
  }

  setPluginDataByKey(
    idPlugin: string,
    visibility: string,
    key: string,
    val: string,
  ) {
    return this.pluginDataList.setPluginDataByKey(
      idPlugin,
      visibility,
      key,
      val,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getPluginData(idPlugin: any) {
    return this.pluginDataList.dataForPlugin(idPlugin);
  }

  getPluginDataByKey(
    idPlugin: string,
    visibility: string,
    key: string,
    defaultVal: string,
  ) {
    return this.pluginDataList.getPluginDataByKey(
      idPlugin,
      visibility,
      key,
      defaultVal,
    );
  }

  snoopPluginData(idPlugin: string) {
    return this.pluginDataList.snoopDataForPlugin(idPlugin);
  }

  clearPluginData(idPlugin: string, visibility = 'private') {
    const data = this.pluginDataList.for(idPlugin, visibility);
    if (data) {
      data.destroy();
    }
  }

  getPluginCount() {
    return ApiPromise({
      url: `/1/organizations/${this.id}/plugins`,
      method: 'GET',
    }).then((plugins) => {
      // @ts-expect-error TS(2571): Object is of type 'unknown'.
      return plugins.length;
    });
  }

  getPublicBoardCount() {
    return ApiPromise({
      url: `/1/organizations/${this.id}/boards`,
      method: 'GET',
      data: {
        filter: 'public',
        fields: 'id',
      },
    }).then((publicBoards) => {
      // @ts-expect-error TS(2571): Object is of type 'unknown'.
      return publicBoards.length;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  invitationUrl(secret: any) {
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    return getOrganizationInvitationLinkUrl(secret);
  }

  boardMembershipRestricted() {
    return (
      this.isFeatureEnabled('inviteBoard') &&
      this.getPref('boardInviteRestrict') &&
      this.getPref('boardInviteRestrict') !== BoardInviteRestrictValues.ANY
    );
  }

  onlyOrgMembers() {
    return (
      this.isFeatureEnabled('inviteBoard') &&
      this.getPref('boardInviteRestrict') &&
      this.getPref('boardInviteRestrict') === BoardInviteRestrictValues.ORG
    );
  }

  onlyManagedMembers() {
    return (
      this.isFeatureEnabled('inviteBoard') &&
      this.getPref('boardInviteRestrict') &&
      this.getPref('boardInviteRestrict') === BoardInviteRestrictValues.MANAGED
    );
  }

  onlyOrgOrManagedMembers() {
    return (
      this.isFeatureEnabled('inviteBoard') &&
      this.getPref('boardInviteRestrict') &&
      this.getPref('boardInviteRestrict') ===
        BoardInviteRestrictValues.ORG_OR_MANAGED
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changeMemberRole(member: Member, opts: any) {
    if (opts.type != null) {
      this.setOnMembership(member, { memberType: opts.type });
    }

    return ApiPromise({
      type: 'PUT',
      url: `/1/${this.typeName.toLowerCase()}/${this.id}/members/${member.id}`,
      data: opts,
    }).then(() =>
      Analytics.sendTrackEvent({
        action: 'updated',
        actionSubject: 'role',
        source: getScreenFromUrl(),
        containers: {
          workspace: {
            id: this.id,
          },
          enterprise: {
            id: this.getEnterprise()?.id,
          },
        },
        attributes: {
          updatedOn: 'member',
          value: opts.type,
        },
      }),
    );
  }

  // Copied inline from MembershipModel mixin in sake of bulk decaf.
  // Partially duplicates the corresponding method from board model
  reactivateMember(member: Member) {
    this.setOnMembership(member, { deactivated: false });

    // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
    return this.addMembers(member, { reactivate: true }).then((grouped) => {
      // @ts-expect-error
      if (!grouped[grouped._categories.ADDED]) {
        this.setOnMembership(member, { deactivated: true });
      }
      return grouped;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deactivateMember(member: Member, traceId: any, onSuccess: any, onError: any) {
    const url = `/1/organizations/${this.id}/members/${member.id}/deactivated`;
    ApiAjax({
      url,
      type: 'PUT',
      data: {
        value: true,
      },
      traceId,
      success: () => {
        Analytics.sendTrackEvent({
          action: 'deactivated',
          actionSubject: 'member',
          source: getScreenFromUrl(),
          containers: {
            workspace: {
              id: this.id,
            },
            enterprise: {
              id: this.getEnterprise()?.id,
            },
          },
          attributes: {
            taskId: traceId,
          },
        });

        onSuccess();
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error(xhr: any) {
        const errorMessage = parseXHRError(xhr);
        // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
        const error = getApiError(xhr.status, errorMessage);
        sendNetworkErrorEvent({
          status: xhr.status,
          response: error.toString(),
          url,
        });

        onError(error);
      },
    });

    this.setOnMembership(member, { deactivated: true });
  }

  addMember(member: Member) {
    // Enterprise admins will have a memberType of 'admin' even if they are
    // not real members of the team.
    const type = this.getMemberType(member) === 'admin' ? 'admin' : 'normal';

    return ApiPromise({
      url: `/1/organizations/${this.id}/members/${member.id}`,
      type: 'put',
      data: { type, acceptUnconfirmed: true },
      dataType: 'json',
    }).then((data) => {
      if (
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        data.token == null &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        !this.memberList.find((m: any) => m.id === member.id)
      ) {
        this.memberList.add(member);
        Analytics.sendTrackEvent({
          action: 'added',
          actionSubject: 'member',
          source: getScreenFromUrl(),
          containers: {
            workspace: {
              id: this.id,
            },
            enterprise: {
              id: this.getEnterprise()?.id,
            },
          },
          attributes: {
            role: 'member',
          },
        });
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateBulkAddMemberErrors(errorCategories: any) {
    const existingErrors = this.get('bulkAddMemberErrors');
    let errorMessages = null;
    let changed = false;

    // null clears errors
    if (errorCategories === null && existingErrors) {
      changed = true;
    } else {
      if (existingErrors) {
        for (const category of Array.from(
          _.values(existingErrors._categories),
        )) {
          if (
            (errorCategories[category] != null
              ? errorCategories[category].length
              : undefined) > 0
          ) {
            existingErrors[category] = _.union(
              existingErrors[category] || [],
              errorCategories[category],
            );
          }
        }
        errorMessages = existingErrors;
        changed = true;
      } else if (
        !_.isEmpty(_.omit(errorCategories, '_categories', '_categoryOrder'))
      ) {
        errorMessages = errorCategories;
        changed = true;
      }
    }

    // don't want to trigger a react update if there's no change
    if (changed) {
      this.set('bulkAddMemberErrors', errorMessages);
      return this.trigger('change:bulkAddMemberErrors');
    }
  }

  getBulkAddMemberErrors() {
    return this.get('bulkAddMemberErrors');
  }

  addMembers(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    users: any[],
    options?: { invitationMessage: string },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    progressHandler?: any,
  ) {
    if (typeof options === 'function') {
      progressHandler = options;
      options = undefined;
    }

    const CATEGORIES = {
      RESTRICTED: 'restricted',
      MUST_REACTIVATE: 'must-reactivate',
      USERNAME_NOT_FOUND: 'username-not-found',
      NOT_IN_ENTERPRISE: 'not-in-enterprise',
      NO_ENTERPRISE_LICENSES: 'no-enterprise-licenses',
      RATE_LIMIT: 'rate-limit-exceeded',
      UNKNOWN: 'unknown',
      EXISTING: 'existing',
      ADDED: 'added',
      TOO_MANY_MEMBERS: 'too-many-members',
      MEMBER_TOO_MANY_ORGS: 'member-too-many-orgs',
      DEACTIVATED_IN_THE_ENTERPRISE: 'deactivated-in-the-enterprise',
      MUST_BE_MANAGED_ENT_MEMBER_OR_VALID_EMAIL:
        'not-managed-ent-member-or-valid-email',
      MUST_BE_MANAGED_ENT_MEMBER: 'not-managed-ent-member',
      MEMBERSHIPS_TOO_MANY_UNCONFIRMED_INVITATIONS: 'member-unconfirmed',
      UNAUTHORIZED_LICENSED_INVITE: 'unauthorized-licensed-invite',
    };

    // This is the order the errors are displayed; sorted by most to least interesting
    const CATEGORY_ORDER = [
      CATEGORIES.RESTRICTED,
      CATEGORIES.MUST_REACTIVATE,
      CATEGORIES.USERNAME_NOT_FOUND,
      CATEGORIES.NOT_IN_ENTERPRISE,
      CATEGORIES.NO_ENTERPRISE_LICENSES,
      CATEGORIES.UNKNOWN,
      CATEGORIES.EXISTING,
      CATEGORIES.TOO_MANY_MEMBERS,
      CATEGORIES.MEMBER_TOO_MANY_ORGS,
      CATEGORIES.DEACTIVATED_IN_THE_ENTERPRISE,
      CATEGORIES.MUST_BE_MANAGED_ENT_MEMBER_OR_VALID_EMAIL,
      CATEGORIES.MUST_BE_MANAGED_ENT_MEMBER,
      CATEGORIES.ADDED,
      CATEGORIES.MEMBERSHIPS_TOO_MANY_UNCONFIRMED_INVITATIONS,
      CATEGORIES.UNAUTHORIZED_LICENSED_INVITE,
    ];

    users = users.length != null ? users : [users];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateProgress = (completed: any) =>
      typeof progressHandler === 'function'
        ? progressHandler({ completed, length: users.length })
        : undefined;

    let completed = 0;
    updateProgress(completed);

    // in case source changes as your adding many members,
    // set to variable here.
    const source = getScreenFromUrl();

    return Bluebird.map(
      users,
      (user) => {
        const traceId = Analytics.startTask({
          taskName: 'edit-organization/members/add',
          source,
        });

        return (
          getMemberFromUser(user)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .then((member: any) => {
              let type;
              if (member != null) {
                if (Array.from(member.idOrganizations).includes(this.id)) {
                  throw new ApiError.Conflict('already in organization');
                }

                // @ts-expect-error
                if (options != null ? options.reactivate : undefined) {
                  return ApiPromise({
                    method: 'put',
                    url: `/1/organizations/${this.id}/members/${member.id}/deactivated`,
                    data: {
                      value: false,
                    },
                  });
                } else {
                  // We can't call @getMemberType here because `member` here isn't
                  // really a member doc.
                  type =
                    this.isEnterprise() &&
                    this.getEnterprise()?.isAdmin?.(member)
                      ? 'admin'
                      : 'normal';

                  return ApiPromise({
                    method: 'put',
                    url: `/1/organizations/${this.id}/members/${member.id}`,
                    data: {
                      type,
                      invitationMessage:
                        options != null ? options.invitationMessage : undefined,
                      acceptUnconfirmed: true,
                    },
                  });
                }
              } else if (validateEmail(user)) {
                return ApiPromise({
                  method: 'post',
                  url: `/1/organizations/${this.id}/memberships`,
                  data: {
                    email: user,
                    type: 'normal',
                  },
                });
              } else if (validateEmail(user.email)) {
                return ApiPromise({
                  method: 'put',
                  url: `/1/organizations/${this.id}/members`,
                  data: {
                    invitationMessage:
                      options != null ? options.invitationMessage : undefined,
                    ...user,
                  },
                  dataType: 'json',
                }).then((data) => {
                  return (() => {
                    const result = [];
                    // @ts-expect-error TS(2571): Object is of type 'unknown'.
                    for (const _member of Array.from(data.members)) {
                      // @ts-expect-error TS(2554): Expected 0-1 arguments, but got 2.
                      member = new Member(_member, {
                        modelCache: ModelCache,
                      });
                      if (!this.memberList.get(member.id)) {
                        this.memberList.add(member);
                        result.push(
                          Analytics.sendTrackEvent({
                            action: 'sent',
                            actionSubject: 'emailOrganizationInvitation',
                            source: getScreenFromUrl(),
                            containers: {
                              workspace: {
                                id: this.id,
                              },
                              enterprise: {
                                id: this.getEnterprise()?.id,
                              },
                            },
                            attributes: {
                              // @ts-expect-error TS(2571): Object is of type 'unknown'.
                              role: _member.type,
                            },
                          }),
                        );
                      }
                    }
                    return result;
                  })();
                });
              } else {
                throw new ApiError.NotFound('username not found');
              }
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .then((response: any) => CATEGORIES.ADDED)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .catch(ApiError, function (err: any) {
              const response = err.message;
              let error;
              if (/email restricted/.test(response)) {
                error = CATEGORIES.RESTRICTED;
              } else if (
                /already invited|already in organization/.test(response)
              ) {
                error = CATEGORIES.EXISTING;
              } else if (/Must reactivate/.test(response)) {
                error = CATEGORIES.MUST_REACTIVATE;
              } else if (/username not found/.test(response)) {
                error = CATEGORIES.USERNAME_NOT_FOUND;
              } else if (/Must first transfer account to the/.test(response)) {
                error = CATEGORIES.NOT_IN_ENTERPRISE;
              } else if (/No Enterprise licenses/.test(response)) {
                error = CATEGORIES.NO_ENTERPRISE_LICENSES;
              } else if (
                /rate limit|invitation quota|sign-up quota/.test(response)
              ) {
                error = CATEGORIES.RATE_LIMIT;
              } else if (/ORGANIZATION_TOO_MANY_MEMBERSHIPS/.test(response)) {
                error = CATEGORIES.TOO_MANY_MEMBERS;
              } else if (/MEMBER_TOO_MANY_MEMBERSHIPS/.test(response)) {
                error = CATEGORIES.MEMBER_TOO_MANY_ORGS;
              } else if (/Member is deactivated in the/.test(response)) {
                error = CATEGORIES.DEACTIVATED_IN_THE_ENTERPRISE;
              } else if (
                /must be a managed enterprise member or have valid email/.test(
                  response,
                )
              ) {
                error = CATEGORIES.MUST_BE_MANAGED_ENT_MEMBER_OR_VALID_EMAIL;
              } else if (/must be a managed enterprise member/.test(response)) {
                error = CATEGORIES.MUST_BE_MANAGED_ENT_MEMBER;
              } else if (
                /confirm account to send more invitations/.test(response)
              ) {
                error = CATEGORIES.MEMBERSHIPS_TOO_MANY_UNCONFIRMED_INVITATIONS;
              } else if (
                /Unauthorized to grant licenses to non-enterprise members/.test(
                  response,
                )
              ) {
                error = CATEGORIES.UNAUTHORIZED_LICENSED_INVITE;
              } else {
                error = CATEGORIES.UNKNOWN;
              }

              Analytics.taskFailed({
                taskName: 'edit-organization/members/add',
                source,
                traceId,
                error: err,
              });

              return error;
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .then(function (state: any) {
              completed++;
              updateProgress(completed);
              const username =
                (user.attributes != null
                  ? user.attributes.username
                  : undefined) || user.username;

              if (state === CATEGORIES.ADDED) {
                Analytics.taskSucceeded({
                  taskName: 'edit-organization/members/add',
                  source,
                  traceId,
                });
              }

              return {
                user: username || user.email || user,
                state,
              };
            })
        );
      },
      { concurrency: 2 },
    ).then((results) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sortByUser = (entries: any) =>
        _.chain(entries)
          .pluck('user')
          .sortBy((user) => user.toLowerCase().replace(/@.*$/, ''))
          .value();

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-shadow */
      const groupUsersByCategory = (results: any) =>
        _.chain(results)
          .groupBy('state')
          .pairs()
          .map(function (...args) {
            const [category, entries] = Array.from(args[0]);
            return [category, sortByUser(entries)];
          })
          .object()
          .value();

      const grouped = groupUsersByCategory(results);
      // @ts-expect-error TS(2339): Property '_categories' does not exist on type 'any... Remove this comment to see the full error message
      grouped._categories = CATEGORIES;
      grouped._categoryOrder = CATEGORY_ORDER;

      // @ts-expect-error
      if (!(options != null ? options.ignoreErrors : undefined)) {
        this.updateBulkAddMemberErrors(_.omit(grouped, CATEGORIES.ADDED));
      }
      return grouped;
    });
  }

  getEnterprise(): Partial<Enterprise> {
    // @ts-expect-error
    return ModelCache.get('Enterprise', this.get('idEnterprise'));
  }

  fetchCollaborators() {
    return ApiPromise({
      url: `/1/organizations/${this.id}/collaborators`,
    }).then((data) => {
      return this.updateCollaboratorList(data);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateCollaboratorList(collaboratorArr: any) {
    this.set('collaborators', collaboratorArr);
    return this.trigger('change:collaborators');
  }

  getFreeTrialCredits() {
    return (this.getFreeTrialCreditsPromise = ApiPromise({
      url: `/1/organizations/${this.id}/credits?filter=freeTrial`,
      type: 'GET',
    }).then((credits) => {
      return credits;
    }));
  }

  hasFreeTrialCredits() {
    return hasFreeTrialCredit(this.get('credits'));
  }

  isFreeTrialActive() {
    const creditsPromise =
      this.getFreeTrialCreditsPromise || this.getFreeTrialCredits();
    return creditsPromise.then((credits: Credit[]) => {
      if (!_.isEmpty(credits)) {
        const trialProperties = getFreeTrialProperties(
          credits,
          this.get('offering'),
          this.get('paidAccount')?.trialExpiration || '',
        );

        return trialProperties?.isActive;
      }
    });
  }

  getRestrictedAttachmentTypes() {
    if (
      this.isFeatureEnabled('enterpriseUI') &&
      this.getPref('attachmentRestrictions') != null
    ) {
      return _.difference(
        AttachmentTypes,
        this.getPref('attachmentRestrictions'),
      );
    } else {
      return [];
    }
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

  getAvailableLicenseCount() {
    if (
      this.get('availableLicenseCount') === null ||
      this.get('availableLicenseCount') === undefined
    ) {
      return Infinity;
    } else {
      return this.get('availableLicenseCount');
    }
  }

  loadLicenses() {
    return ModelLoader.loadOrganizationMaximumAndAvailableLicenseCount(this.id);
  }

  getFreeBoardLimit() {
    return this.get('limits')?.orgs?.freeBoardsPerOrg;
  }

  // The number of free boards the org can still create, or null if the limit is not close
  // or relevant (eg. this is a premium team)
  getFreeBoardsRemaining() {
    const limit = this.getFreeBoardLimit();
    let delta = null;

    if (
      !this.hasPaidProduct() &&
      (limit != null ? limit.disableAt : undefined) &&
      (limit != null ? limit.count : undefined)
    ) {
      delta = limit.disableAt - limit.count;
      if (delta < 0) {
        return 0;
      } else {
        return delta;
      }
    }

    return null;
  }

  // The number of free boards an org has exceeded the limit by. This will only apply
  // to orgs grandfathered through the board limits, with more than 10 boards.
  getFreeBoardsOver() {
    const limit = this.getFreeBoardLimit();
    let delta = null;

    if (
      (limit != null ? limit.disableAt : undefined) &&
      (limit != null ? limit.count : undefined)
    ) {
      delta = limit.disableAt - limit.count;
    }

    if (delta != null && delta < 0) {
      return Math.abs(delta);
    } else {
      return 0;
    }
  }

  // Whether the org is within 7 boards of their free board limit, or it has been
  // met / exceeded.
  isCloseToFreeBoardLimit() {
    const limit = this.getFreeBoardLimit();
    const remaining = this.getFreeBoardsRemaining();

    if (remaining === null) {
      return false;
    } else {
      return remaining <= limit.disableAt - limit.warnAt;
    }
  }

  // Whether the org has reached their limit, or it is exceeded.
  isAtOrOverFreeBoardLimit() {
    const remaining = this.getFreeBoardsRemaining();
    return remaining != null && remaining === 0;
  }

  isFreeBoardLimitOverridden() {
    const limit = this.getFreeBoardLimit();
    return (
      (limit != null ? limit.disableAt : undefined) &&
      (limit != null ? limit.disableAt : undefined) !== 10
    );
  }

  incrementFreeBoardLimitCount(incrementBy: number) {
    const limits = this.get('limits');
    const openBoardCount =
      (limits != null ? limits.orgs : undefined)?.freeBoardsPerOrg?.count !=
      null;

    if (!openBoardCount) {
      return;
    }

    let { count, status } = limits.orgs.freeBoardsPerOrg;
    const { disableAt, warnAt } = limits.orgs.freeBoardsPerOrg;

    // calculate the new count
    count += incrementBy;

    // calculate the new status
    if (count > disableAt) {
      status = 'maxExceeded';
    } else if (count === disableAt) {
      status = 'disabled';
    } else if (count >= warnAt) {
      status = 'warn';
    } else {
      status = 'ok';
    }

    // optimistically update the limit
    limits.orgs.freeBoardsPerOrg.count = count;
    limits.orgs.freeBoardsPerOrg.status = status;
    return this.set({ limits });
  }

  getUrl() {
    return getOrganizationUrl(this.get('name'));
  }

  getBillingUrl() {
    return getOrganizationBillingUrl(this.get('name'));
  }

  getPrivateBoardCount() {
    const openBoards = this.boardList.models.filter(
      (board) => !board.attributes.closed,
    );
    return this.getFreeBoardLimit()?.count - openBoards.length;
  }

  /**
   * Only use this if you need the shop product SKU for checking legacy
   * behavior such as for Premium PO. Otherwise, you most likely
   * want to be using belongsToRealEnterprise() or just isPremium()
   * or isStandard().
   *
   * @deprecated
   */
  getProduct() {
    return this.get('products')?.[0];
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
    return ModelLoader.loadOrganizationPlugins(this.id)
      .then((plugins) => {
        this.plugins = plugins;
        return (this.pluginsLoading = false);
      })
      .catch((err) => {
        this.pluginsLoading = false;
        throw err;
      });
  }

  getPaidStatus() {
    if (this.belongsToRealEnterprise()) {
      return 'enterprise';
    } else if (this.isPremium()) {
      return 'bc';
    } else if (this.isStandard()) {
      return 'standard';
    } else {
      return 'free';
    }
  }

  isAdmin(member: Member) {
    return this.getMemberType(member) === 'admin';
  }

  isPremiumPO() {
    return (
      Entitlements.isPremium(this.get('offering')) &&
      this.get('premiumFeatures')?.includes('externallyBilled')
    );
  }

  orderedVisibleAdmins() {
    return MembershipModel.orderedVisibleAdmins.call(this);
  }
  orderedVisibleMembers() {
    return MembershipModel.orderedVisibleMembers.call(this);
  }
  getMemberType(
    member: Member,
    opts?: { ignoreEntAdminStatus: boolean },
  ): MemberType {
    return MembershipModel.getMemberType.call(this, member, opts);
  }
  _refreshMemberships() {
    return MembershipModel._refreshMemberships.call(this);
  }
  _getMembershipFor(member: Member) {
    return MembershipModel._getMembershipFor.call(this, member);
  }
  getMembershipFor(member: Member) {
    return MembershipModel.getMembershipFor.call(this, member);
  }
  hasActiveMembership(member: Member) {
    return MembershipModel.hasActiveMembership.call(this, member);
  }
  isMember(member: Member) {
    return MembershipModel.isMember.call(this, member);
  }
  isPending(member: Member): boolean {
    return MembershipModel.isPending.call(this, member);
  }
  isDeactivated(member: Member) {
    return MembershipModel.isDeactivated.call(this, member);
  }
  isUnconfirmed(member: Member) {
    return MembershipModel.isUnconfirmed.call(this, member);
  }
  isObserver(member: Member) {
    return MembershipModel.isObserver.call(this, member);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isPremOrgAdmin(memberOrId: any) {
    return MembershipModel.isPremOrgAdmin.call(this, memberOrId);
  }
  getExplicitMemberType(member: Member) {
    return MembershipModel.getExplicitMemberType.call(this, member);
  }
  canSeeDeactivated(member: Member) {
    return MembershipModel.canSeeDeactivated.call(this, member);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addMembership(membership: any) {
    return MembershipModel.addMembership.call(this, membership);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _removeFromMembershipsAttribute(membership: any) {
    return MembershipModel._removeFromMembershipsAttribute.call(
      this,
      membership,
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeMembership(membership: any) {
    return MembershipModel.removeMembership.call(this, membership);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setOnMembership(member: Member, attrs: any) {
    return MembershipModel.setOnMembership.call(this, member, attrs);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addMemberRole(opts: any) {
    return MembershipModel.addMemberRole.call(this, opts);
  }
}
Organization.initClass();

export { Organization };
