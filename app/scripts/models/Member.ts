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
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { differenceInCalendarDays, differenceInHours } from 'date-fns';
import _ from 'underscore';

import {
  getEmailDomain,
  isPaidManagedEnterpriseMember,
} from '@trello/business-logic/member';
import { Entitlements, type PremiumFeature } from '@trello/entitlements';
import { checkId, idCache } from '@trello/id-cache';
import { getPreferredLanguages } from '@trello/locale';
import { normalizeLocale } from '@trello/locale/normalizeLocale';
import type { PIIString } from '@trello/privacy';
import { TrelloStorage } from '@trello/storage';

import { Auth } from 'app/scripts/db/Auth';
import { ModelLoader } from 'app/scripts/db/model-loader';
import { ModelCache } from 'app/scripts/db/ModelCache';
import { l } from 'app/scripts/lib/localize';
import { Util } from 'app/scripts/lib/util';
import { actionFilterFromString } from 'app/scripts/lib/util/action-filter-from-string';
import type { Board } from 'app/scripts/models/Board';
import { BoardBackgroundList } from 'app/scripts/models/collections/BoardBackgroundList';
import type { BoardList } from 'app/scripts/models/collections/BoardList';
import { BoardStarList } from 'app/scripts/models/collections/BoardStarList';
import { CustomEmojiList } from 'app/scripts/models/collections/CustomEmojiList';
import { CustomStickerList } from 'app/scripts/models/collections/CustomStickerList';
import { LoginList } from 'app/scripts/models/collections/LoginList';
import { PluginDataList } from 'app/scripts/models/collections/PluginDataList';
import { SavedSearchList } from 'app/scripts/models/collections/SavedSearchList';
import type {
  Enterprise,
  EnterpriseAttributes,
} from 'app/scripts/models/Enterprise';
import { ModelWithPreferences } from 'app/scripts/models/internal/ModelWithPreferences';
import type { TrelloModelAttributes } from 'app/scripts/models/internal/TrelloModel';
import type { Login } from 'app/scripts/models/Login';
import type { Organization } from 'app/scripts/models/Organization';
import { ApiAjax } from 'app/scripts/network/ApiAjax';
import { ApiPromise } from 'app/scripts/network/ApiPromise';
import Payloads from 'app/scripts/network/payloads';
import type { PluginData } from './PluginData';

interface Campaign {
  id: string;
  name: string;
  currentStep: string;
  dateDismissed: Date | null;
}

interface Message {
  idBoard?: string;
  idCard?: string;
  action?: string;
}

type LoginType = 'password';

export interface MemberAttributes extends TrelloModelAttributes {
  campaigns: Campaign[];
  confirmed: boolean;
  logins: Login[];
  loginTypes: LoginType[];
  email: PIIString;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  enterpriseLicenses: any;
  organizationList: Organization[];
  isAaMastered: boolean;
  lang: string;
  enterprises: EnterpriseAttributes[];
  enterpriseWithRequiredConversion: boolean;
  fullName: PIIString;
  idBoards: string[];
  idEnterprise: string;
  idEnterprisesAdmin: string[];
  idMemberReferrer: string;
  idPremOrgsAdmin: string[];
  idEnterprisesImplicitAdmin: string[];
  idOrganizations: string[];
  marketingOptIn: {
    date: string;
  };
  missedTransferDate: boolean;
  messagesDismissed: {
    name: string;
    lastDismissed: string;
  }[];
  nonPublicAvailable: boolean;
  nonPublicModified: string;
  notLoggedIn: boolean;
  oneTimeMessagesDismissed: string[];
  username: string;
  avatarUrl: string;
  prefs: {
    colorBlind: boolean;
    timezone: string;
    locale: string;
  };
  premiumFeatures: PremiumFeature[];
  memberType: 'ghost' | 'normal';
  aaId: string;
  daysLeft: number;
  daysOld: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nonPublic: any;
}

interface Member extends ModelWithPreferences<MemberAttributes> {
  typeName: 'Member';
  organizationList: Organization[];
  isAaMastered: boolean;
  boardStarList: BoardStarList;
  boardList: BoardList;
  fullName: PIIString;
  enterpriseList: Enterprise[];
  customEmojiList: CustomEmojiList;
  nonPublicFields: string[];
  nameAttr: string;
  urlRoot: string;
  nonPublicKey: 'nonPublic';
  loadingNonPublicFields: boolean;
  prefNames: string[];

  _actionFilter: ((action: string) => boolean) | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _overridingOneTimeMessages: any;
  boardBackgroundList: BoardBackgroundList;
  clearLastTimeout: NodeJS.Timeout | number | string | undefined;
  customStickerList: CustomStickerList;
  lastMessage: Message | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listenTo: any;
  loginList: LoginList;
  pluginDataList: PluginDataList;
  savedSearchList: SavedSearchList;

  avatarUrl: string;
  boardCount: number;
  initials: string;
  isDeactivated: boolean;
  idEnterprise: string;
  username: string;
}

const EDITING_AUTO_CLEAR_MS = 10000;

class Member extends ModelWithPreferences<MemberAttributes> {
  static initClass() {
    this.prototype.typeName = 'Member' as const;
    this.prototype.nameAttr = 'fullName';
    this.prototype.urlRoot = '/1/members';
    this.prototype.nonPublicFields = ['avatarUrl', 'fullName', 'initials'];
    this.prototype.nonPublicKey = 'nonPublic' as const;
    this.prototype.loadingNonPublicFields = false;
    this.prototype.prefNames = ['minutesBetweenSummaries'];

    this.lazy({
      boardList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          BoardList,
        } = require('app/scripts/models/collections/BoardList');
        return new BoardList().syncModel(this, 'idBoards') as BoardList;
      },
      enterpriseList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          EnterpriseList,
        } = require('app/scripts/models/collections/EnterpriseList');
        return new EnterpriseList().syncModel(this, 'enterprises', {
          fxGetIds(enterprises: EnterpriseAttributes[]) {
            return (enterprises || [])
              .filter((enterprise) =>
                Entitlements.isEnterprise(enterprise.offering),
              )
              .map((enterprise) => enterprise.id);
          },
        });
      },
      organizationList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          OrganizationList,
        } = require('app/scripts/models/collections/OrganizationList');
        return new OrganizationList().syncModel(this, 'idOrganizations');
      },
      pluginDataList() {
        return new PluginDataList([], {
          scopeModel: this,
        }).syncCache(ModelCache, [], (pluginData: PluginData) => {
          return (
            pluginData.get('idModel') === this.id &&
            pluginData.get('scope') === 'member'
          );
        });
      },
    });
  }

  constructor(attr?: Partial<MemberAttributes>) {
    super(...arguments);
    this.loadNonPublicFields = this.loadNonPublicFields.bind(this);
  }

  initialize() {
    // @ts-expect-error
    super.initialize(...arguments);

    if (Auth.isMe(this)) {
      this.destruct([
        (this.boardStarList = new BoardStarList([], {
          member: this,
        }).syncSubModels(this, 'boardStars')),
        (this.savedSearchList = new SavedSearchList([], {
          member: this,
        }).syncSubModels(this, 'savedSearches')),
        (this.customStickerList = new CustomStickerList([], {
          member: this,
        }).syncSubModels(this, 'customStickers')),
        (this.boardBackgroundList = new BoardBackgroundList([], {
          member: this,
        }).syncSubModels(this, 'boardBackgrounds')),
        (this.customEmojiList = new CustomEmojiList([], {
          member: this,
        }).syncSubModels(this, 'customEmoji')),
        (this.loginList = new LoginList([], { member: this }).syncSubModels(
          this,
          'logins',
        )),
      ]);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.listenTo(this, 'change:editing', (member: any) => {
      return ModelCache.get(
        'Card',
        member.get('editing')?.idCard,
      )?.updateEditing(member);
    });

    // Privacy
    this.listenTo(
      this,
      'change:nonPublicAvailable',
      this.nonPublicAvailableChanged,
    );
    this.listenTo(
      this,
      'change:nonPublicModified',
      this.nonPublicModifiedChanged,
    );
    this.updateMemberIdCache(this.id, this.attributes.username);
  }

  updateMemberIdCache(id: string, username: string) {
    if (checkId(id)) {
      idCache.setMemberId(username, id);
    }
  }

  isVisibleAction(action: string) {
    if (this._actionFilter == null) {
      this._actionFilter = actionFilterFromString(Payloads.memberActions);
    }
    return this._actionFilter(action);
  }

  isLoggedIn() {
    return !this.get('notLoggedIn');
  }

  loadCustomEmojis() {
    ModelLoader.loadMemberCustomEmoji(this.id);
  }

  getMembershipData(model: Board | Organization): {
    isMe: boolean;
    canRemove: boolean;
    canDeactivate: boolean;
    canChangeRole: boolean;
    memberIsAdmin: boolean;
    memberIsObserver: boolean;
    memberIsNormal: boolean;
    memberisPending: boolean;
    canMakeMember: boolean;
    canMakeObserver: boolean;
    canMakeAdmin: boolean;
    isMoreThanOneAdmin: boolean;
    isMoreThanOneMember: boolean;
  } {
    const admins = model.adminList.models;
    const isMe = Auth.isMe(this);
    const me = Auth.me();

    // logic
    const isOneOtherAdmin = _.some(admins, (admin) => admin.id !== this.id);
    const isMoreThanOneAdmin = admins.length > 1;
    const isMoreThanOneMember = model.memberList.length > 1;
    const membership = model.getMembershipFor(this);
    const memberIsAdmin =
      model.getExplicitMemberType(this) === 'admin' ||
      (membership != null ? membership.memberType : undefined) === 'admin';
    const memberIsObserver =
      model.getExplicitMemberType(this) === 'observer' ||
      (membership != null ? membership.memberType : undefined) === 'observer';
    const memberIsNormal = !(memberIsAdmin || memberIsObserver);
    const memberisPending = model.isPending(this);
    const isAdmin = model.owned(); // this checks whether the current member (me) is an admin
    const notOrg = model.getExplicitMemberType(this) !== 'org';

    // perms
    const canChangeRole = isAdmin;
    const canMakeMember = !memberIsNormal && isOneOtherAdmin && isAdmin;
    const canMakeObserver = !memberIsObserver && isOneOtherAdmin && isAdmin;
    const canMakeAdmin = !memberIsAdmin && isAdmin;

    // For any model, an admin can always remove any member and a member can always
    // remove himself as long as there is more than one member and another admin remaining.
    // For models except orgs, a member can be removed if the current member (me)
    // can invite members to the board and has equal or higher permissions to
    // the member he's removing.
    const canRemove =
      isMoreThanOneMember &&
      ((isOneOtherAdmin && (isAdmin || isMe)) ||
        (!isMe &&
          notOrg &&
          // @ts-expect-error
          (typeof model.canInviteMembers === 'function'
            ? // @ts-expect-error
              model.canInviteMembers()
            : undefined) &&
          // @ts-expect-error
          (typeof model.compareMemberType === 'function'
            ? // @ts-expect-error
              model.compareMemberType(me, this)
            : undefined) >= 0));
    const canDeactivate =
      canRemove &&
      model.typeName === 'Organization' &&
      isAdmin &&
      !model.isDeactivated(this) &&
      !memberisPending;

    return {
      isMe,
      canRemove,
      canDeactivate,
      canChangeRole,
      memberIsAdmin,
      memberIsObserver,
      memberIsNormal,
      memberisPending,
      canMakeMember,
      canMakeObserver,
      canMakeAdmin,
      isMoreThanOneAdmin,
      isMoreThanOneMember,
    };
  }

  canAddBoardsTo(org: Organization) {
    return (
      org.getMembershipFor(this) != null || org.getEnterprise()?.isAdmin?.(this)
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addCampaign(data: string, next: any) {
    return ApiPromise({
      url: `${this.urlRoot}/me/campaigns`,
      type: 'POST',
      data,
    }).then((campaign) => {
      this.set(
        'campaigns',
        // @ts-expect-error
        _.uniq(this.get('campaigns').concat(campaign), (c) => c.id),
      );
      return typeof next === 'function' ? next() : undefined;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateCampaign(id: string, data: any) {
    return ApiPromise({
      url: `${this.urlRoot}/me/campaigns/${id}`,
      type: 'PUT',
      data,
    }).then(() => {
      return this.set(
        'campaigns',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.get('campaigns').map(function (c: any) {
          if (c.id === id) {
            return { ...c, ...data };
          } else {
            return c;
          }
        }),
      );
    });
  }

  dismissCampaign(name: string) {
    const campaign = this.getCampaign(name);

    if (campaign == null) {
      return;
    }

    return this.updateCampaign(campaign.id, {
      isDismissed: true,
      dateDismissed: new Date(),
    });
  }

  getCampaign(name: string) {
    const campaigns = this.get('campaigns') || [];
    return _.find(campaigns, (campaign) => campaign.name === name);
  }

  hasCampaign(name: string) {
    return this.getCampaign(name) != null;
  }

  campaignIsDismissed(name: string) {
    const campaign = this.getCampaign(name);
    return !!campaign?.dateDismissed;
  }

  campaignIsActive(name: string) {
    return !this.getCampaign(name)?.dateDismissed;
  }

  _oneTimeMessagesDismissedOverride() {
    return TrelloStorage.get('otmd');
  }

  _isOverridingOneTimeMessages() {
    return this._overridingOneTimeMessages != null
      ? this._overridingOneTimeMessages
      : (this._overridingOneTimeMessages =
          this._oneTimeMessagesDismissedOverride() != null);
  }

  isDismissed(name: string) {
    const dismissed = this._isOverridingOneTimeMessages()
      ? this._oneTimeMessagesDismissedOverride()
      : this.get('oneTimeMessagesDismissed');

    return dismissed != null && Array.from(dismissed).includes(name);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dismiss(name: string, next?: any) {
    if (this.isDismissed(name) || !this.isLoggedIn()) {
      return typeof next === 'function' ? next() : undefined;
    }

    if (this._isOverridingOneTimeMessages()) {
      let left;
      TrelloStorage.set('otmd', [
        ...Array.from(
          (left = this._oneTimeMessagesDismissedOverride()) != null ? left : [],
        ),
        name,
      ]);
    }

    // @ts-expect-error
    return this.addToSet('oneTimeMessagesDismissed', name, next);
  }

  recordDismissed(name: string) {
    return ApiPromise({
      url: `${this.urlRoot}/me/messagesDismissed`,
      type: 'post',
      data: {
        name,
      },
    }).then((data) => {
      // @ts-expect-error TS(2571): Object is of type 'unknown'.
      return this.set('messagesDismissed', data.messagesDismissed);
    });
  }

  dismissAd(adId: string) {
    return this.recordDismissed(`ad-${adId}`);
  }

  dismissSurveyById(surveyId: string) {
    return this.recordDismissed(`survey-${surveyId}`);
  }

  getDismissedAd(adId: string) {
    const messagesDismissed = this.get('messagesDismissed') || [];
    return _.find(
      messagesDismissed,
      (dismissedMessage) => dismissedMessage.name === `ad-${adId}`,
    );
  }

  getDismissedSurveys() {
    const messagesDismissed = this.get('messagesDismissed') || [];
    // Survey messages dismissed match format "survey-{SURVEY_ID}"
    // @ts-expect-error TS(2571): Object is of type 'unknown'.
    return _.filter(messagesDismissed, (msg) => msg.name.match(/^survey-.*$/));
  }

  isAdDismissed(adId: string) {
    const dismissedAd = this.getDismissedAd(adId);
    if (dismissedAd) {
      return (
        differenceInCalendarDays(
          new Date(),
          new Date(dismissedAd.lastDismissed),
        ) <= 14
      );
    } else {
      return false;
    }
  }

  setDateFirstSawHighlights() {
    return this.recordDismissed('feedback-card-home-page-internal');
  }

  getDateFirstSawHighlights(): string | null {
    const messagesDismissed = this.get('messagesDismissed') || [];
    const feedbackCard = _.find(
      messagesDismissed,
      (dismissedMessage) =>
        dismissedMessage.name === 'feedback-card-home-page-internal',
    );
    if (!feedbackCard) {
      return null;
    } else {
      return feedbackCard.lastDismissed;
    }
  }

  shouldShowFeedbackCard() {
    if (this.isDismissed('homeFeedbackOrientationCard')) {
      return false;
    }

    const messagesDismissed = this.get('messagesDismissed') || [];
    const feedbackCard = _.find(
      messagesDismissed,
      (dismissedMessage) =>
        dismissedMessage.name === 'feedback-card-home-page-internal',
    );
    let days = 0;
    if (feedbackCard) {
      days = differenceInCalendarDays(
        new Date(),
        new Date(feedbackCard.lastDismissed),
      );
    }
    return days > 7;
  }

  toggleSubscribeOnComment() {
    return this.dismissAd('subscribeOnComment');
  }

  isSubscribeOnCommentEnabled() {
    const dismissalCount =
      // @ts-expect-error TS(2571): Object is of type 'unknown'.
      this.getDismissedAd('subscribeOnComment')?.count ?? 0;
    // Overloading the dismissal count since messagesDismissed
    // does not allow for deletion.
    return dismissalCount % 2 === 0;
  }

  hasDismissedSince(name: string, period: 'days' | 'hours', count: number) {
    const messagesDismissed = this.get('messagesDismissed') || [];
    const message = _.find(
      messagesDismissed,
      (dismissedMessage) => dismissedMessage.name === name,
    );

    if (message) {
      if (period === 'days') {
        return (
          differenceInCalendarDays(
            new Date(),
            new Date(message.lastDismissed),
          ) < count
        );
      } else if (period === 'hours') {
        return (
          differenceInHours(new Date(), new Date(message.lastDismissed)) < count
        );
      }
    }

    return false;
  }

  owned() {
    return Auth.isMe(this);
  }

  getLocale() {
    if (this.getPref('locale')) {
      return normalizeLocale(this.getPref('locale'));
    } else {
      return 'en';
    }
  }

  getLocales() {
    if (this.isLoggedIn()) {
      return [this.getLocale(), 'en'];
    } else {
      return getPreferredLanguages();
    }
  }

  getMemberViewTitle() {
    const username = this.get('username');
    const fullName = this.get('fullName');
    // eslint-disable-next-line @trello/disallow-altering-privacy-fields
    const viewTitle = `${fullName} (${username})`;
    return viewTitle;
  }

  toggleColorBlindMode() {
    if (this.get('prefs') != null) {
      if (this.get('prefs').colorBlind) {
        // @ts-expect-error
        this.setPref('colorBlind', false).save();
      } else {
        // @ts-expect-error
        this.setPref('colorBlind', true).save();
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addCurrentBoardToOrgs(currentBoard: Board, organizations: any) {
    if (organizations[currentBoard.idOrganization]) {
      return organizations[currentBoard.idOrganization].boards.unshift(
        currentBoard,
      );
    } else {
      return (organizations[currentBoard.idOrganization] = {
        boards: [currentBoard],
        displayName: ModelCache.get(
          'Organization',
          currentBoard.idOrganization,
        )?.get('displayName'),
      });
    }
  }

  getOpenBoardsByOrg(editable: boolean, currentBoard: Board): Board[] {
    let idOrg;
    const organizations = {};
    const me = Auth.me();

    for (const board of Array.from(this.boardList.models)) {
      // Do this properly with board.editable when we get memberships working better
      if (board.isOpen()) {
        const workspace = board.getOrganization();
        const isPaidWorkspaceAdmin =
          workspace?.hasPaidProduct() && workspace?.isAdmin(me);
        if (editable && board.isObserver(me) && !isPaidWorkspaceAdmin) {
          continue;
        }
        const boardData = board.toJSON();

        // It's possible to be on a board that you can see the
        // idOrganization for even though you couldn't see the team.
        idOrg = workspace != null ? boardData.idOrganization : '';

        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        if (organizations[idOrg] == null) {
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          organizations[idOrg] = {
            boards: [],
            displayName:
              idOrg === ''
                ? l('member boards.boards')
                : ModelCache.get('Organization', idOrg)?.get('displayName'),
          };
        }

        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        organizations[idOrg].boards.push(boardData);
      }
    }

    if (currentBoard) {
      this.addCurrentBoardToOrgs(currentBoard, organizations);
    }

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const idOrgsSorted = _.sortBy(_.keys(organizations), function (idOrg) {
      if (idOrg === '') {
        return '';
      } else {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        return organizations[idOrg].displayName;
      }
    });

    return (() => {
      const result = [];
      for (idOrg of Array.from(idOrgsSorted)) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        result.push(organizations[idOrg]);
      }
      return result;
    })();
  }

  getOpenBoardsInEnterpriseByOrg(
    editable: boolean,
    idEnterprise: string,
    currentBoard: Board,
  ): unknown {
    let idOrg;
    const organizations = {};
    const me = Auth.me();

    for (const board of [...Array.from(this.boardList.models), currentBoard]) {
      // Do this properly with board.editable when we get memberships working better
      if (board?.isOpen?.()) {
        if (editable && board.isObserver(me)) {
          continue;
        }
        const boardData = board.toJSON();

        const enterprise = board.getEnterprise();
        if (!enterprise || enterprise.id !== idEnterprise) {
          continue;
        }

        // It's possible to be on a board that you can see the
        // idOrganization for even though you couldn't see the team.
        const org = board.getOrganization();
        idOrg =
          (org != null ? org.get('idEnterprise') : undefined) === idEnterprise
            ? boardData.idOrganization
            : '';

        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        if (organizations[idOrg] == null) {
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          organizations[idOrg] = {
            boards: [],
            displayName:
              idOrg === ''
                ? l('member boards.boards')
                : ModelCache.get('Organization', idOrg)?.get('displayName'),
          };
        }

        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        organizations[idOrg].boards.push(boardData);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const idOrgsSorted = _.sortBy(_.keys(organizations), function (idOrg) {
      if (idOrg === '') {
        return '';
      } else {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        return organizations[idOrg].displayName;
      }
    });

    return (() => {
      const result = [];
      for (idOrg of Array.from(idOrgsSorted)) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        result.push(organizations[idOrg]);
      }
      return result;
    })();
  }

  getSortedOrgs(): Organization[] {
    return (
      // @ts-expect-error
      _.clone(this.organizationList.models)
        // When a user is added to a team, the "sort" operation fails. This is because we're partially updating the state
        // so we end up receiving a team that doesn't yet have a displayName. The root cause should be solved, but by
        // filtering upfront this mitigates the customer impact for now.
        // https://trello.atlassian.net/browse/TRELP-2711
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((a: any) => a.get('displayName') !== undefined)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .sort((a: any, b: any) =>
          a.get('displayName').localeCompare(b.get('displayName')),
        )
    );
  }

  /**
   * Check premium features list for a given feature
   */
  isFeatureEnabled(feature: PremiumFeature) {
    return (this.get('premiumFeatures') || []).includes(feature);
  }

  isInAnyPremiumOrganization() {
    // @ts-expect-error
    return this.organizationList.any(
      (org: Organization) => org.hasPaidProduct() && !org.isStandard(),
    );
  }

  isInAnyStandardOrganization() {
    // @ts-expect-error
    return this.organizationList.any((org: Organization) => org.isStandard());
  }

  hasMemberOrOrgAccount() {
    // @ts-expect-error
    return this.organizationList.any((org: Organization) =>
      org.hasPaidProduct(),
    );
  }

  allCustomEmoji(): Record<string, string> {
    const allEmoji: Record<string, string> = {};
    for (const emoji of Array.from(this.customEmojiList.models)) {
      allEmoji[emoji.get('name')] = emoji.get('url');
    }

    return allEmoji;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toJSON(opts?: any) {
    if (opts == null) {
      opts = {};
    }
    const data = super.toJSON(...arguments);
    if (opts.hasPassword) {
      // @ts-expect-error
      data.hasPassword = Array.from(data.loginTypes).includes('password');
    }

    // @ts-expect-error
    data.viewTitle = this.getMemberViewTitle();

    return this.handleNonPublicFields(data);
  }

  editing(msg: Message) {
    if (msg == null) {
      msg = {};
    }
    if (_.isEqual(msg, this.lastMessage)) {
      return;
    }

    this.lastMessage = msg;

    clearTimeout(this.clearLastTimeout);

    this.clearLastTimeout = this.setTimeout(() => {
      this.lastMessage = null;
    }, EDITING_AUTO_CLEAR_MS / 2);

    if (Auth.isLoggedIn()) {
      return ApiAjax({
        url: `${this.urlRoot}/${this.id}/editing`,
        type: 'post',
        background: true,
        data: _.clone(msg),
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeMembershipConfirmationKey(model: any) {
    const isOrg = model.typeName === 'Organization';
    if (Auth.isMe(this)) {
      if (isOrg) {
        return 'leave org';
      } else {
        return 'leave board';
      }
    } else {
      if (isOrg) {
        return 'remove member from org';
      } else if (model.isDeactivated(this)) {
        return 'remove deactivated member from board';
      } else {
        return 'remove member from board';
      }
    }
  }

  getMobileTempPassword(next: (password: string) => void) {
    ApiAjax({
      url: '/1/members/me/loginToken',
      type: 'post',
      data: {
        mode: 'password',
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      success(data: any) {
        return next(data.password);
      },
    });
  }

  maxFileSize(board: Board | null) {
    if (board?.isFeatureEnabled('largeAttachments')) {
      return 250 * 1024 * 1024;
    } else {
      return 10 * 1024 * 1024;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  canUploadAttachment(file: any, board: Board) {
    return file.size < this.maxFileSize(board);
  }

  accountNewerThan(date: Date) {
    return Util.idToDate(this.id) > date;
  }

  isNewMember() {
    return differenceInCalendarDays(new Date(), Util.idToDate(this.id)) < 7;
  }

  getShowDetails() {
    let left;
    return (left = TrelloStorage.get('showDetails')) != null ? left : false;
  }

  setShowDetails(value: boolean | number | object | string) {
    return TrelloStorage.set('showDetails', value);
  }

  getEnterprise() {
    return ModelCache.get('Enterprise', this.get('idEnterprise'));
  }

  // For managed and licensed members of an enterprise, teamless (personal)
  // boards may be restricted to certain visibilities.
  allowedTeamlessBoardVisibilities() {
    const visibilities = ['private', 'public'];
    if (this.isPaidManagedEntMember()) {
      const enterprise = this.getEnterprise();
      if (enterprise) {
        return visibilities.filter((vis) =>
          enterprise.canSetTeamlessBoardVisibility(vis),
        );
      }
    }
    return visibilities;
  }

  missedTransferDate() {
    return this.get('missedTransferDate');
  }

  // Get the number of power-ups a user is allowed to turn on for a board
  // All members and orgs should be have the "plugins" feature string,
  // effectively giving everyone unlimited Power-Ups everywhere
  getPowerUpsLimit() {
    return Infinity;
  }

  isPaidManagedEntMember() {
    return isPaidManagedEnterpriseMember({
      confirmed: this.get('confirmed'),
      idEnterprise: this.get('idEnterprise'),
      enterpriseLicenses: this.get('enterpriseLicenses'),
    });
  }

  isManagedEntMemberOf(idEnterprise: string) {
    return (
      this.get('confirmed') &&
      this.get('idEnterprise') &&
      this.get('idEnterprise') === idEnterprise
    );
  }

  isEnterpriseAdmin() {
    return this.get('confirmed') && this.get('idEnterprisesAdmin')?.length > 0;
  }

  isImplicitEnterpriseAdmin() {
    return (
      this.get('confirmed') &&
      this.get('idEnterprisesImplicitAdmin')?.length > 0
    );
  }

  isImplicitEnterpriseAdminOf(enterprise: { id: string }) {
    return (
      this.isImplicitEnterpriseAdmin() &&
      this.get('idEnterprisesImplicitAdmin').indexOf(enterprise.id) >= 0
    );
  }

  isEnterpriseAdminOf(enterprise: { id: string }) {
    return (
      this.isEnterpriseAdmin() &&
      this.get('idEnterprisesAdmin').indexOf(enterprise.id) >= 0
    );
  }

  isSSOOnly() {
    let enterprise;
    const idEnterprise = this.get('idEnterprise');

    if (
      idEnterprise &&
      (enterprise = ModelCache.get('Enterprise', idEnterprise)) != null
    ) {
      return enterprise.get('prefs').ssoOnly;
    } else {
      return false;
    }
  }

  shouldShowMarketingOptIn() {
    // Show marketing opt in survey if the account is confirmed, more than
    // 3 days old, and hasn't previously set marketingOptIn

    return (
      this.get('confirmed') &&
      // @ts-expect-error TS(2362): The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
      new Date() - Util.idToDate(this.id) > Util.getMs({ days: 3 }) &&
      !this.get('marketingOptIn')?.date
    );
  }

  setMarketingOptIn(optedIn: boolean, prompt: string) {
    // @ts-expect-error
    return this.update(
      {
        'marketingOptIn/optedIn': optedIn,
        'marketingOptIn/displayText': prompt,
      },
      function () {},
    );
  }

  setPluginData(idPlugin: string, visibility: string, data: string) {
    return this.pluginDataList.upsert(idPlugin, visibility, data);
  }

  setPluginDataByKey(
    idPlugin: string,
    visibility: string,
    key: string,
    val: boolean | string,
  ) {
    return this.pluginDataList.setPluginDataByKey(
      idPlugin,
      visibility,
      key,
      val,
    );
  }

  getPluginData(idPlugin: string) {
    return this.pluginDataList.dataForPlugin(idPlugin);
  }

  getPluginDataByKey(
    idPlugin: string,
    visibility: string,
    key: string,
    defaultVal: boolean | string,
  ) {
    return this.pluginDataList.getPluginDataByKey(
      idPlugin,
      visibility,
      key,
      defaultVal,
    );
  }

  clearPluginData(idPlugin: string, visibility = 'private') {
    const data = this.pluginDataList.for(idPlugin, visibility);
    if (data) {
      data.destroy();
    }
  }

  snoopPluginData(idPlugin: string) {
    return this.pluginDataList.snoopDataForPlugin(idPlugin);
  }

  fetchEnterpriseUserType(enterpriseId: string) {
    return ModelLoader.loadMemberEnterpriseUserType(
      enterpriseId,
      this.get('id'),
    );
  }

  fetchEnterpriseActive(enterpriseId: string) {
    return ModelLoader.loadMemberEnterpriseActive(enterpriseId, this.get('id'));
  }

  shouldShowNoticeOfTosChange() {
    // Show notice of ToS change if the user's account was created before
    // November 1, 2018 and the user has not already dismissed the message by
    // clicking "I Agree"
    const messagesDismissed = this.get('messagesDismissed') || [];
    return (
      new Date(2018, 10, 1) > Util.idToDate(this.id) &&
      !_.contains(
        _.pluck(messagesDismissed, 'name'),
        '1-nov-2018-tos-change-accepted',
      )
    );
  }

  agreeToAndDismissTosChange() {
    return this.recordDismissed('1-nov-2018-tos-change-accepted');
  }

  // Privacy
  loadNonPublicFields() {
    if (!this.loadingNonPublicFields) {
      this.loadingNonPublicFields = true;
      ModelLoader.loadMemberNonPublicFields(this.get('id'))
        .then(() => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return this.nonPublicFields.forEach((field: any) => {
            return this.trigger(`change:${field}`);
          });
        })
        .finally(() => {
          return (this.loadingNonPublicFields = false);
        });
    }
  }

  nonPublicAvailableChanged() {
    const nonPublicAvailable = this.get('nonPublicAvailable');
    const nonPublic = this.get(this.nonPublicKey);

    // We have received a hint that there's a change in non public fields so
    // let's fetch them to get the latest, but only if we don't have any already
    if (nonPublicAvailable && nonPublic == null) {
      this.loadNonPublicFields();

      // The hint is false, this means non public field information is no longer
      // available, we need to clear any data on this member model to clear any
      // cached sensitive information.
    } else if (!nonPublicAvailable) {
      // @ts-expect-error
      this.unset(this.nonPublicKey);
    }
  }

  nonPublicModifiedChanged() {
    const nonPublicModified = this.get('nonPublicModified');

    // We have received a hint that there's a change in non public fields so
    // let's fetch them to get the latest regardless of what we already have
    if (nonPublicModified) {
      this.loadNonPublicFields();

      // It's important to unset nonPublicModified so that it will cause
      // a re-trigger of the change event again, even if it stays as true
      // @ts-expect-error
      this.unset('nonPublicModified', { silent: true });
    }
  }

  // Override the get method on the model.
  // Return the nonPublic version of the attribute if it exists.

  get<TKey extends keyof MemberAttributes>(
    attr: TKey,
    isOverrideEnabled = true,
  ): MemberAttributes[TKey] {
    if (isOverrideEnabled && this.nonPublicFields.includes(attr)) {
      const nonPublicValues = super.get(this.nonPublicKey) || {};
      if (Object.prototype.hasOwnProperty.call(nonPublicValues, attr)) {
        return nonPublicValues[attr];
      }
    }

    return super.get(attr);
  }

  // Take a data model and replace its fields with the nonPublic
  // equivalent, the nonPublic fields will either be looked for on the
  // data provided, or strictly in the nonPublicFields array passed in as
  // the third argument.
  handleNonPublicFields(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
    fields: string[] = [],
    nonPublicFields = [],
  ) {
    if (fields.length === 0) {
      fields = this.nonPublicFields;
    }

    if (
      nonPublicFields.length === 0 &&
      Object.prototype.hasOwnProperty.call(data, this.nonPublicKey)
    ) {
      nonPublicFields = data[this.nonPublicKey];
    }

    fields.forEach(function (field) {
      if (Object.prototype.hasOwnProperty.call(nonPublicFields, field)) {
        // @ts-expect-error
        return (data[field] = nonPublicFields[field]);
      }
    });

    return data;
  }

  canCreateBoardIn(org: Organization) {
    return (
      !org ||
      !this.isPaidManagedEntMember() ||
      (org != null ? org.belongsToRealEnterprise() : undefined)
    );
  }

  isEnterpriseMemberOnNonEnterpriseTeam() {
    return (
      this.isPaidManagedEntMember() &&
      // @ts-expect-error
      this.organizationList.models.some(
        (org: Organization) =>
          !org.isEnterprise() || !org.belongsToRealEnterprise(),
      )
    );
  }

  getMaxPaidStatus() {
    if (this.enterpriseList != null ? this.enterpriseList.length : undefined) {
      return 'enterprise';
    } else if (this.isInAnyPremiumOrganization()) {
      return 'bc';
    } else if (this.isInAnyStandardOrganization()) {
      return 'standard';
    } else {
      return 'free';
    }
  }

  getEmailDomain() {
    return getEmailDomain(this.get('email'));
  }

  getBestOrganization() {
    const me = Auth.me();

    // First look by free boards remaining
    const bestOrg =
      me.organizationList != null
        ? // @ts-expect-error
          me.organizationList.models

            .filter(
              (org: Organization) => org.getFreeBoardsRemaining() !== null,
            )
            .sort(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (a: any, b: any) =>
                a.getFreeBoardsRemaining() - b.getFreeBoardsRemaining(),
            )[0]
        : undefined;

    if (bestOrg != null) {
      return bestOrg;
    }

    // Use number of boards per org as backup b/c limits can be null
    const nextBestOrg =
      me.organizationList != null
        ? // @ts-expect-error
          me.organizationList.models.sort(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (a: any, b: any) =>
              b.get('boardList')?.length - a.get('boardList')?.length,
          )[0]
        : undefined;

    if (nextBestOrg != null) {
      return nextBestOrg;
    }

    // @ts-expect-error
    return me.organizationList.models[0] || null;
  }
}
Member.initClass();

export { Member };
