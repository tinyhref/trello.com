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
import { differenceInCalendarDays, subMonths } from 'date-fns';
import Hearsay from 'hearsay';
import _ from 'underscore';

import { Analytics, tracingCallback } from '@trello/atlassian-analytics';
import { dontUpsell } from '@trello/browser';
import { isWorkspaceReadOnly } from '@trello/business-logic/organization';
import {
  customFieldsId as CUSTOM_FIELDS_ID,
  listLimitsPowerUpId as LIST_LIMITS_POWER_UP_ID,
  mapPowerUpId as MAP_POWER_UP_ID,
} from '@trello/config';
import { dynamicConfigClient } from '@trello/dynamic-config';
import type { PremiumFeature } from '@trello/entitlements';
import { PremiumFeatures } from '@trello/entitlements';
import { ApiError } from '@trello/error-handling';
import { sendErrorEvent } from '@trello/error-reporting';
import { client, syncDeltaToCache } from '@trello/graphql';
import { idCache, isShortId } from '@trello/id-cache';
import type { LabelColor } from '@trello/labels';
import { formatLabelColor } from '@trello/labels/formatLabelColor';
import { getScreenFromUrl } from '@trello/marketing-screens';
import { trelloBatchFetch } from '@trello/realtime-updater';

import {
  getBoardInvitationLinkUrl,
  getBoardShortUrl,
  getBoardUrl,
} from 'app/scripts/controller/urls';
import { BUTLER_POWER_UP_ID } from 'app/scripts/data/butler-id';
import { LegacyPowerUps } from 'app/scripts/data/legacy-power-ups';
import { Auth } from 'app/scripts/db/Auth';
import { ModelLoader } from 'app/scripts/db/model-loader';
import { ModelCache } from 'app/scripts/db/ModelCache';
import type { ViewLimit } from 'app/scripts/lib/limits';
import { isOverLimit } from 'app/scripts/lib/limits';
import { Util } from 'app/scripts/lib/util';
import { actionFilterFromString } from 'app/scripts/lib/util/action-filter-from-string';
import { BoardPluginList } from 'app/scripts/models/collections/BoardPluginList';
import type { ChecklistList } from 'app/scripts/models/collections/ChecklistList';
import { CustomFieldList } from 'app/scripts/models/collections/CustomFieldList';
import type { InvitationList } from 'app/scripts/models/collections/InvitationList';
import { LabelList } from 'app/scripts/models/collections/LabelList';
import type { ListList } from 'app/scripts/models/collections/ListList';
import type { MemberList } from 'app/scripts/models/collections/MemberList';
import { PluginDataList } from 'app/scripts/models/collections/PluginDataList';
import { MembershipModel } from 'app/scripts/models/internal/MembershipModel';
import type { ModelWithPersonalPreferencesAttributes } from 'app/scripts/models/internal/ModelWithPersonalPreferences';
import { ModelWithPersonalPreferences } from 'app/scripts/models/internal/ModelWithPersonalPreferences';
import { Label } from 'app/scripts/models/Label';
import type { Member } from 'app/scripts/models/Member';
import type { Organization } from 'app/scripts/models/Organization';
import { ApiAjax } from 'app/scripts/network/ApiAjax';
import { ApiPromise } from 'app/scripts/network/ApiPromise';
import Payloads from 'app/scripts/network/payloads';
import { BoardState } from 'app/scripts/view-models/BoardState';
import { CardComposer } from 'app/scripts/view-models/CardComposer';
import { CardFilter } from 'app/scripts/view-models/CardFilter';
import { ListComposer } from 'app/scripts/view-models/ListComposer';
import { BoardInviteRestrictValues } from 'app/scripts/views/organization/Constants';
import type { MembershipList } from './collections/MembershipList';
import type { BoardPlugin } from './BoardPlugin';
import type { Card } from './Card';
import type { CustomField } from './CustomField';
import type { List } from './List';

const WELCOME_BOARD_THRESHOLD = 10000;

type PermissionState =
  | 'enterprise'
  | 'inviteToken'
  | 'member'
  | 'none'
  | 'observer'
  | 'org'
  | 'public';

interface Prefs extends Record<string, unknown> {
  cardCovers?: boolean;
  background?: string;
  backgroundBrightness?: 'dark' | 'light' | 'unknown';
  backgroundColor?: string;
  backgroundTopColor?: string;
  backgroundBottomColor?: string;
  backgroundTile?: boolean;
  backgroundImage?: string;
  backgroundImageScaled?: Array<{ width: number; height: number; url: string }>;
  hideVotes?: boolean;
}

interface BoardAttributes extends ModelWithPersonalPreferencesAttributes {
  name: string;
  dateLastActivity: string;
  desc: string;
  descData: {
    emoji: {
      [key: string]: string;
    };
  };
  enterpriseOwned: boolean;
  nodeId: string;
  idMemberCreator: string;
  idOrganization: string;
  memberships: MembershipList;
  prefs: Prefs;
  structure: unknown;
  url: string;
  shortLink: string;
  shortUrl: string;
  dateLastView?: string | null;
  idEnterprise: string;
  limits: ViewLimit;
  closed: boolean;
  premiumFeatures: PremiumFeature[];
  selfJoin: boolean;
  // this is a legacy field and should be removed when fully deprecated
  powerUps: string[];
}

function compareMemberType(
  board: Board,
  memberA: Member,
  memberB: Member,
  opts: {
    mode?: 'commentDelete' | 'members' | 'standard';
  },
) {
  let hierarchy: ('admin' | 'normal' | 'observer' | 'org')[][];
  if (opts == null) {
    opts = {};
  }
  let { mode } = opts;
  if (mode == null) {
    mode = 'standard';
  }

  switch (mode) {
    case 'members':
      hierarchy = [['normal', 'admin']];
      break;
    case 'commentDelete':
      hierarchy = [['normal', 'org', 'observer'], ['admin']];
      break;
    default:
      hierarchy = [['org'], ['normal'], ['admin']];
  }

  const getHierarchyLevel = function (member: Member) {
    const memberType = board.getMemberType(member);

    // Find the index of the group that this member's memberType is in.
    // (A group may contain multiple member types, e.g. in 'members' mode)
    for (let index = 0; index < hierarchy.length; index++) {
      const group = hierarchy[index];
      if (Array.from(group).includes(memberType)) {
        return index;
      }
    }

    return -1;
  };

  // NOTE: If their memberType isn't in the list, it will be -1, which is lower than everything
  const memberALevel = getHierarchyLevel(memberA);
  const memberBLevel = getHierarchyLevel(memberB);

  if (memberALevel > memberBLevel) {
    return 1;
  } else if (memberALevel < memberBLevel) {
    return -1;
  } else {
    return 0;
  }
}

interface Board extends ModelWithPersonalPreferences<BoardAttributes> {
  typeName: 'Board';
  urlRoot: '/1/boards';
  boardPluginList: BoardPluginList;
  isCustomFieldsEnabled(): boolean;
  canVote(member: Member): boolean;
  listList: ListList;
  invitationList: InvitationList;
  checklistList: ChecklistList;
  customFieldList: CustomFieldList;
  labelList: LabelList;
  memberList: MemberList;
  adminList: MemberList;
  pluginDataList: PluginDataList;
  filter: CardFilter;
  composer: CardComposer;
  listComposer: ListComposer;
  viewState: BoardState;
  isVisibleAction(action: string): unknown;
  cacheShortLink(): unknown;
  isPending(member: Member): boolean;
  isDeactivated(member: Member): boolean;
  // @ts-expect-error TS(7010): 'close', which lacks return-type annotation, impli... Remove this comment to see the full error message
  close(
    options: { removeInspirationBoard: boolean; traceId: string },
    next: () => void,
  );
  // @ts-expect-error TS(2394): This overload signature is not compatible with its... Remove this comment to see the full error message
  reopen(): unknown;
  // @ts-expect-error TS(2394): This overload signature is not compatible with its... Remove this comment to see the full error message
  subscribe(): unknown;
  // @ts-expect-error TS(2394): This overload signature is not compatible with its... Remove this comment to see the full error message
  subscribeWithTracing(): unknown;
  isStarred(): boolean;
  isTemplate(): boolean;
  hasUnseenActivity(): boolean;
  daysUntilPluginsDisable(): unknown;
  isLessActive(): boolean;
  getAvailableRoles(): string[];
  getAnalyticsContainers(): {
    board: {
      id: string;
    };
    organization: {
      id: string | undefined;
    };
    enterprise: {
      id: string | undefined;
    };
  };
  hasObservers(): boolean;
  hasAdvancedChecklists(): boolean;
  upsellAdvancedChecklists(): boolean;
  getPermLevel(): unknown;
  getCommentPerm(): unknown;
  getInvitePerm(): unknown;
  idOrganization: string;
  name: string;
  getOrganization(): Organization | undefined;
  getUrl(): string;
  getLabels(): Label[];
  canComment(user: Member): boolean;
  organization: Organization | undefined;
  hasActiveMembership(member: Member): boolean;
  isEditableByTeamMemberAndIsNotABoardMember(): boolean;
  optimisticJoinBoard(): void;
  prefs: Prefs;
  // @ts-expect-error TS(2300): Duplicate identifier 'markAsViewed'.
  markAsViewed: () => Bluebird<unknown>;
  powerUpsCount(): number;
  canEnableAdditionalPowerUps(): boolean;
  getPaidStatus(): string;
  isButlerCore(): boolean;
  isMapCore(): boolean;
  isCustomFieldsCore(): boolean;
  editable(): boolean;
  id: string;
  nodeId: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isPremOrgAdmin(memberOrId: any): boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _actionFilter: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _isDeleting: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  api: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  availablePlugins: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callOnceAfter: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lazy: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listenTo: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  snoop: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toggle: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trigger: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  url: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  waitForAttrs: any;

  prefNames: string[];
  myPrefNames: string[];
}

class Board extends ModelWithPersonalPreferences<BoardAttributes> {
  static initClass() {
    this.prototype.typeName = 'Board';
    this.prototype.urlRoot = '/1/boards';

    this.lazy({
      boardPluginList() {
        return new BoardPluginList([], { board: this }).syncCache(
          this.modelCache,
          ['idBoard'],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (boardPlugin: any) => {
            return boardPlugin.get('idBoard') === this.id;
          },
        );
      },
      listList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const { ListList } = require('app/scripts/models/collections/ListList');
        return (
          new ListList(null, { board: this })
            .setOwner(this)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .syncCache(this.modelCache, ['idBoard', 'closed'], (list: any) => {
              return list.get('idBoard') === this.id && list.isOpen();
            })
        );
      },
      invitationList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          BoardInvitationList,
        } = require('app/scripts/models/collections/BoardInvitationList');
        return new BoardInvitationList([], {
          modelCache: this.modelCache,
          board: this,
        });
      },
      checklistList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          ChecklistList,
        } = require('app/scripts/models/collections/ChecklistList');
        return new ChecklistList([], {
          modelCache: this.modelCache,
          board: this,
        });
      },
      customFieldList() {
        return new CustomFieldList().syncCache(
          this.modelCache,
          ['idModel'],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (customField: any) => {
            return customField.get('idModel') === this.id;
          },
        );
      },
      labelList() {
        return new LabelList().syncCache(
          this.modelCache,
          ['idBoard'],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (label: any) => {
            return label.get('idBoard') === this.id;
          },
        );
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
            // Because a member could be the admin of a premium org (and thus be
            // an implicit admin of this board) but not an admin on the board, we
            // need to also check if the member is a premium org admin.  This check
            // needs to be done directly since getExplicitMemberType may return
            // that the member is an admin due to its board membership info not
            // being updated yet
            const adminMemberships = _.filter(memberships, (membership) => {
              const member = ModelCache.get('Member', membership.idMember);
              return (
                membership.memberType === 'admin' ||
                (member != null &&
                  this.getOrganization()?.isPremOrgAdmin(member))
              );
            });

            return _.pluck(adminMemberships, 'idMember');
          },
        });
      },
      pluginDataList() {
        return new PluginDataList([], {
          scopeModel: this,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }).syncCache(this.modelCache, [], (pluginData: any) => {
          return (
            pluginData.get('idModel') === this.id &&
            pluginData.get('scope') === 'board'
          );
        });
      },
      filter() {
        return new CardFilter(this, { modelCache: this.modelCache });
      },
      composer() {
        return new CardComposer(null, {
          board: this,
          modelCache: this.modelCache,
        });
      },
      listComposer() {
        return new ListComposer(this, { modelCache: this.modelCache });
      },
      viewState() {
        // @ts-expect-error TS(2351): This expression is not constructable.
        return new BoardState(null, {
          modelCache: this.modelCache,
          board: this,
        });
      },
    });

    this.prototype.prefNames = [
      'permissionLevel',
      'voting',
      'comments',
      'invitations',
      'selfJoin',
      'background',
      'cardAging',
      'calendarFeedEnabled',
      'hiddenPluginBoardButtons',
    ];
    this.prototype.myPrefNames = [
      'showSidebar',
      'showSidebarMembers',
      'showSidebarBoardActions',
      'showSidebarActivity',
      'emailKey',
      'idEmailList',
      'emailPosition',
      'calendarKey',
      'fullEmail',
    ];
  }
  initialize() {
    // @ts-expect-error TS(2339): Property 'initialize' does not exist on type 'Mode... Remove this comment to see the full error message
    super.initialize(...arguments);

    this.listenForPermChange();
    this.cacheShortLink();
    this.cacheAri();
  }

  // it is important to look for { closed: false } on
  // models that can be archived because sometimes, the
  // client receives partial data about a board, card,
  // or list that does not contain its { closed } state.
  // in those cases, our previous check -- !@get('closed')
  // -- would return undefined, which we wanted to interpret
  // as being closed but were not correctly doing so in all places.
  // explicitly checking for { closed: false } is therefore correct.
  isOpen() {
    return this.get('closed') === false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isVisibleAction(action: any) {
    if (this._actionFilter == null) {
      this._actionFilter = actionFilterFromString(Payloads.boardActions);
    }
    return this._actionFilter(action);
  }

  cacheShortLink() {
    return this.waitForAttrs(
      this,
      ['id', 'shortLink'],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ({ id, shortLink }: any) => idCache.setBoardId(shortLink, id),
    );
  }

  cacheAri() {
    return this.waitForAttrs(
      this,
      ['nodeId', 'shortLink'],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ({ nodeId, shortLink }: any) => idCache.setBoardAri(shortLink, nodeId),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hasCapacity(item: any) {
    if (item.getList != null) {
      // Card
      return (
        !isOverLimit('cards', 'totalPerBoard', this.get('limits')) &&
        !isOverLimit('cards', 'openPerBoard', this.get('limits'))
      );
    } else {
      // List
      return (
        !isOverLimit('lists', 'totalPerBoard', this.get('limits')) &&
        !isOverLimit('lists', 'openPerBoard', this.get('limits'))
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  close(opts: any, next: any) {
    const traceId = opts.traceId;

    this.update({ closed: true, traceId }, next);

    // Optimistically attempt to update free board limit
    this.getOrganization()?.incrementFreeBoardLimitCount(-1);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reopen(param: any, next: any) {
    if (param == null) {
      param = {};
    }
    const traceId = param?.traceId;

    let { newBillableGuests, keepBillableGuests } = param;
    if (newBillableGuests == null) {
      newBillableGuests = [];
    }
    if (keepBillableGuests == null) {
      keepBillableGuests = false;
    }

    // If we are keeping billable guests upon re-opening, invoke the attribute
    // specific endpoint with the keepBillableGuests param to let server know not to drop
    // them
    if (keepBillableGuests) {
      this.set('closed', false);
      this.api(
        {
          type: 'put',
          method: 'closed?value=false&keepBillableGuests=true',
          traceId,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err: any, response: any) => {
          if (next) {
            next(err, response);
          }
        },
      );
      return;
    }

    // Otherwise, if necessary, optimistically remove any billable guests
    if (newBillableGuests.length > 0) {
      this.set(
        'memberships',
        _.reject(this.get('memberships'), (membership) =>
          _.some(
            newBillableGuests,
            // @ts-expect-error TS(2339): Property 'idMember' does not exist on type 'string... Remove this comment to see the full error message
            (guest) => membership.idMember === guest.id,
          ),
        ),
      );
    }

    this.update({ closed: false, traceId }, next);

    // Optimistically attempt to update free board limit
    this.getOrganization()?.incrementFreeBoardLimitCount(-1);
  }

  // @ts-expect-error TS(2300): Duplicate identifier 'markAsViewed'.
  markAsViewed() {
    if (!Auth.isLoggedIn()) {
      return;
    }

    const dateLastView = new Date().toISOString();
    this.set(
      {
        dateLastView,
      },
      { broadcast: true },
    );
    syncDeltaToCache(client, this.typeName, {
      id: this.get('id'),
      dateLastView,
    });

    return ApiAjax({
      url: `${this.urlRoot}/${this.id}/markAsViewed`,
      type: 'post',
      background: true,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribe(subscribed: any, next: any) {
    // @ts-expect-error TS(2345): Argument of type '"subscribed"' is not assignable ... Remove this comment to see the full error message
    if (subscribed === this.get('subscribed')) {
      return;
    }
    // @ts-expect-error TS(2769): No overload matches this call.
    this.update({ subscribed }, next);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribeWithTracing(subscribed: any, tracingCallbackArgs: any) {
    const { traceId, next, ...tracingArgs } = tracingCallbackArgs;

    // @ts-expect-error TS(2769): No overload matches this call.
    this.update(
      { subscribed, traceId },
      tracingCallback({ traceId, ...tracingArgs }, next),
    );
  }

  isStarred() {
    return Auth.me().boardStarList.getBoardStar(this.id) != null;
  }

  hasUnseenActivity() {
    const dtView = this.get('dateLastView');
    const dtActivity = this.get('dateLastActivity');
    return dtView != null && dtActivity != null && dtView < dtActivity;
  }

  daysUntilPluginsDisable() {
    // @ts-expect-error TS(2345): Argument of type '"datePluginDisable"' is not assi... Remove this comment to see the full error message
    const date = this.get('datePluginDisable');
    if (date != null) {
      return differenceInCalendarDays(new Date(date as string), new Date());
    } else {
      return null;
    }
  }

  isLessActive() {
    let left;
    const dtLastActivity =
      (left = this.get('dateLastActivity')) != null
        ? new Date(left)
        : new Date(Util.idToDate(this.id));
    const sixMonthsAgo = subMonths(new Date(), 6);
    return sixMonthsAgo > dtLastActivity;
  }

  getAvailableRoles() {
    if (this.hasObservers()) {
      return ['admin', 'normal', 'observer'];
    } else {
      return ['admin', 'normal'];
    }
  }

  hasObservers() {
    return this.getOrganization()?.isFeatureEnabled('observers');
  }

  hasAdvancedChecklists() {
    return this.isFeatureEnabled(PremiumFeatures.advancedChecklists);
  }

  upsellAdvancedChecklists() {
    return this.editable() && !dontUpsell() && !this.hasAdvancedChecklists();
  }

  isFeatureEnabled(feature: PremiumFeature) {
    return this.get('premiumFeatures')?.includes(feature);
  }

  getPermLevel() {
    return this.getPref('permissionLevel');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _normalizePref(pref: any) {
    if (pref === 'none') {
      return 'disabled';
    } else {
      return pref;
    }
  }

  getCommentPerm() {
    return this._normalizePref(this.get('prefs').comments);
  }

  getInvitePerm() {
    return this._normalizePref(this.get('prefs').invitations);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toJSON(opts?: any) {
    if (opts == null) {
      opts = {};
    }
    const data = super.toJSON(...arguments);

    if (opts.org) {
      const organization = this.getOrganization();
      if (organization != null) {
        // @ts-expect-error TS(2339): Property 'hasOrg' does not exist on type 'ModelWit... Remove this comment to see the full error message
        data.hasOrg = true;
        // @ts-expect-error TS(2339): Property 'org' does not exist on type 'ModelWithPe... Remove this comment to see the full error message
        data.org = organization.toJSON({ url: true });
      }
    }

    if (opts.url) {
      if (data.url == null) {
        data.url = getBoardUrl(this);
      }
    }

    if (opts.shortUrl) {
      if (data.shortUrl == null) {
        data.shortUrl = getBoardShortUrl(this);
      }
    }

    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  calcPos(index: any, list: any) {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-shadow */
    return Util.calcPos(index, this.listList, list, (list: any) =>
      list.isOpen(),
    );
  }

  getCard(idCard: string) {
    if (isShortId(idCard)) {
      return ModelCache.findOne('Card', 'idShort', Number(idCard));
    } else {
      return ModelCache.get('Card', idCard);
    }
  }

  getList(idList: string) {
    return this.listList.get(idList);
  }

  getUrl() {
    return getBoardUrl(this);
  }

  getChecklist(idChecklist: string) {
    return ModelCache.get('Checklist', idChecklist);
  }

  getBoardInvitation(idBoardInvitation: string) {
    return this.invitationList.get(idBoardInvitation);
  }

  getCheckItem(idCheckItem: string) {
    for (const checklist of Array.from(this.checklistList.models)) {
      const checkItem = (
        checklist != null
          ? // @ts-expect-error TS(2571): Object is of type 'unknown'.
            checklist.checkItemList
          : undefined
      )?.get(idCheckItem);
      if (checkItem) {
        return checkItem;
      }
    }
  }

  isReadOnly() {
    const workspace = this.getOrganization();
    const offering = workspace?.get('offering');
    const limits = workspace?.get('limits');
    const status = limits?.orgs?.usersPerFreeOrg?.status;

    const isBoardReadOnly =
      isWorkspaceReadOnly(offering, status) || !this.isOpen();

    return isBoardReadOnly;
  }

  editable() {
    if (this.isReadOnly()) {
      return false;
    }
    const me = Auth.me();
    return me && (this.editableByMember(me) || this.isEditableByTeamMember());
  }

  isEditableByTeamMember() {
    const org = this.getOrganization();
    if (org == null) {
      return false;
    }

    const me = Auth.me();

    if (this.isObserver(me)) {
      return false;
    }

    const isOrgMember = org.isMember(me);
    return this.isPremOrgAdmin(me) || (this.allowsSelfJoin() && isOrgMember);
  }

  isMemberOfBoardOrg(member: Member) {
    const org = this.getOrganization();

    if (org == null) {
      return false;
    }

    return org.isMember(member);
  }

  isEditableByTeamMemberAndIsNotABoardMember() {
    return (
      this.isEditableByTeamMember() && this.getMembershipFor(Auth.me()) == null
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editableByMember(member: any) {
    return this.isMember(member);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isGuest(member: any) {
    let needle;
    return (
      ((needle = this.getMemberType(member)),
      ['pending', 'normal', 'admin', 'observer'].includes(needle)) &&
      this.hasOrganization() &&
      !member
        .getSortedOrgs()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .find((org: any) => org.get('id') === this.get('idOrganization'))
    );
  }

  getMembershipCount() {
    let left, left1;
    return (left =
      // @ts-expect-error TS(2345): Argument of type '"membershipCounts"' is not assig... Remove this comment to see the full error message
      (left1 = this.get('membershipCounts')?.active) != null
        ? left1
        : this.get('memberships')?.length) != null
      ? left
      : 1;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getStarCount(type: any) {
    let left;
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    return (left = this.get('starCounts')?.[type]) != null ? left : 0;
  }

  getIdTags() {
    let left;
    // @ts-expect-error TS(2345): Argument of type '"idTags"' is not assignable to p... Remove this comment to see the full error message
    return (left = this.get('idTags')) != null ? left : [];
  }

  owned() {
    const me = Auth.me();
    return me && this.ownedByMember(me);
  }

  ownedByMember(member: Member) {
    return this.getMemberType(member) === 'admin';
  }

  allowsSelfJoin() {
    // Templates can still return selfJoin: true, even though users
    // aren't allowed to self join
    return (this.getPref('selfJoin') ?? false) && !this.isTemplate();
  }

  isTemplate() {
    if (!this.getPref('isTemplate')) {
      return false;
      //  Any public boards can be templates
    } else if (this.isPublic() || this.isFeatureEnabled('privateTemplates')) {
      return true;
    }

    return false;
  }

  canAdd() {
    const org = this.getOrganization();
    if (org) {
      return org.canAddBoard(this);
    }
    const ent = this.getEnterprise();
    // @ts-expect-error
    return !ent || ent.canAddTeamlessBoard(this);
  }

  canDelete() {
    const org = this.getOrganization();
    if (org) {
      return this.owned() && (!org || org.canDeleteBoard(this));
    }
    const ent = this.getEnterprise();
    // @ts-expect-error
    return this.owned() && (!ent || ent.canDeleteTeamlessBoard(this));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  canSetVisibility(vis: any) {
    const org = this.getOrganization();
    if (org) {
      return org.canSetVisibility(vis);
    }
    const ent = this.getEnterprise();
    // @ts-expect-error
    return !ent || ent.canSetTeamlessBoardVisibility(vis);
  }

  canJoin() {
    const org = this.getOrganization();
    if (org == null && this.get('idEnterprise') == null) {
      return false;
    }

    const me = Auth.me();

    const prefs = this.get('prefs') || {};

    const isBoardEnterpriseJoinable =
      this.isEnterpriseBoard() &&
      this.allowsSelfJoin() &&
      this.get('idEnterprise') === me.get('idEnterprise') &&
      prefs.permissionLevel == 'enterprise';

    // We check for the existence of a membership; the might have a
    // memberType of admin due to being a BC admin
    if (this.getMembershipFor(me) != null || this.isObserver(me)) {
      return false;
    }

    const isOrgMember = org?.isMember(me);
    return (
      this.isPremOrgAdmin(me) ||
      (this.allowsSelfJoin() && isOrgMember) ||
      // @ts-expect-error
      (this.isEnterpriseBoard() && this.getEnterprise()?.isAdmin(me)) ||
      isBoardEnterpriseJoinable
    );
  }

  canInviteMembers() {
    let typeAllowedToInvite;

    const organization = this.getOrganization();
    const me = Auth.me();
    const isOrgMember = !!me && organization?.isMember(me);

    // if you aren't in the org, you can invite someone if the org
    // hasn't restricted invites in their settings/prefs. If they have, then canInvite will be false.
    if ((!organization || !isOrgMember) && !this.getPref('canInvite')) {
      return false;
    }

    if (this.get('prefs')?.invitations === 'admins') {
      typeAllowedToInvite = 'admin';
    } else if (this.get('prefs')?.invitations === 'members') {
      typeAllowedToInvite = 'normal';
    }

    return (
      this.getMemberType(Auth.me()) === 'admin' ||
      typeAllowedToInvite === this.getMemberType(Auth.me())
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  compareMemberType(memberA: any, memberB: any, opts: any) {
    return compareMemberType(this, memberA, memberB, opts);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isMemberPublic(member: any) {
    return this.getMemberType(member) === 'public';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isMemberOrg(member: any) {
    return this.getMemberType(member) === 'org';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isMemberObserver(member: any) {
    return this.getMemberType(member) === 'observer';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  memberMatchesSetting(member: any, setting: any) {
    switch (this.getPref(setting)) {
      case 'public':
        return Auth.isLoggedIn();
      case 'org':
        return (
          this.isMember(member) ||
          this.isMemberOrg(member) ||
          this.isMemberObserver(member)
        );
      case 'observers':
        return this.isMember(member) || this.isMemberObserver(member);
      case 'members':
        return this.isMember(member);
      case 'admins':
        return this.ownedByMember(member);
      default:
        // 'none'
        return false;
    }
  }

  isPowerUpEnabled(name: string) {
    // in some cases we don't *know* about a board's power ups, because we've
    // loaded it (for example) on the "my cards" page, and we want to keep
    // data down to minimum. But we also don't want to pretend like it's empty,
    // since that could be weirder, so we just don't have that field at all.
    // This means that we don't actually *know* if this power up is enabled, so
    // we default to false when we don't have enough information to answer.
    const powerUps = this.get('powerUps');
    return (
      (powerUps != null && Array.from(powerUps).includes(name)) ||
      (name === 'calendar' &&
        this.idPluginsEnabled().includes(LegacyPowerUps.calendar)) ||
      (name === 'cardAging' &&
        this.idPluginsEnabled().includes(LegacyPowerUps.cardAging)) ||
      (name === 'voting' &&
        this.idPluginsEnabled().includes(LegacyPowerUps.voting))
    );
  }

  isButlerCore() {
    // almost a tautology, since for Butler to be core, by definition Trello server
    // would have served us a boardPlugin record meaning it would be enabled
    return this.isPluginEnabled(BUTLER_POWER_UP_ID);
  }

  // Bloomberg has requested that the Butler dashboard only be available to
  // their Enterprise admins. This function will return whether a user can
  // access the Butler directory on a board
  canShowButlerUI() {
    if (this.isEnterpriseBoard()) {
      if (
        dynamicConfigClient
          .get('butler_ent_admin_only_allowlist')
          // @ts-expect-error TS(2345): Argument of type 'string | { [key: string]: string... Remove this comment to see the full error message
          .includes(this.get('idEnterprise'))
      ) {
        return (
          // @ts-expect-error
          this.getEnterprise().isAdmin(Auth.me()) ||
          (this.get('idOrganization') &&
            this.getOrganization()?.isAdmin(Auth.me()))
        );
      }
    }
    return true;
  }

  powerUpsCount() {
    // Things in the powerUps list are grandfathered and don't count against the limit
    return this.boardPluginList.filter((boardPlugin: BoardPlugin) => {
      if (boardPlugin.isButler()) return false;
      if (boardPlugin.isCustomFields()) return false;
      return true;
    }).length;
  }

  canEnableAdditionalPowerUps() {
    return Auth.isLoggedIn();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isPluginEnabled(idPlugin: any) {
    if (
      idPlugin === MAP_POWER_UP_ID &&
      this.isFeatureEnabled(PremiumFeatures.views)
    ) {
      return true;
    }

    return this.boardPluginList.any(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (boardPlugin: any) => boardPlugin.get('idPlugin') === idPlugin,
    );
  }

  isCustomFieldsEnabled() {
    return this.isPluginEnabled(CUSTOM_FIELDS_ID);
  }

  isListLimitsPowerUpEnabled() {
    return this.isPluginEnabled(LIST_LIMITS_POWER_UP_ID);
  }

  isMapPowerUpEnabled() {
    return this.isPluginEnabled(MAP_POWER_UP_ID);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  enablePlugin(idPlugin: any, tags = []) {
    return new Bluebird((resolve, reject) => {
      this.boardPluginList.create(
        { idPlugin },
        {
          success: resolve,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          error: (status: any, textStatus: any) => {
            return reject({ status, textStatus });
          },
        },
      );

      const idOrganization = this.get('idOrganization');
      if (idOrganization) {
        return Analytics.sendTrackEvent({
          action: 'enabled',
          actionSubject: 'powerUp',
          objectType: 'powerUp',
          objectId: idPlugin,
          containers: {
            board: {
              id: this.id,
            },
            organization: {
              id: idOrganization,
            },
          },
          source: 'createBoardModal',
          attributes: {
            isBCFeature: true,
            requiredBC: false,
            tags,
          },
        });
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  enablePluginWithTracing(idPlugin: any, tracingCallbackArgs: any) {
    const { next, traceId, attributes } = tracingCallbackArgs;

    return new Bluebird((resolve, reject) => {
      this.boardPluginList.createWithTracing(
        { idPlugin },
        {
          traceId,
          success: resolve,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          error: (_model: any, _err: any, xhrResponse: any) => {
            return reject(xhrResponse);
          },
        },
        tracingCallback(tracingCallbackArgs, next),
      );

      const idOrganization = this.get('idOrganization');
      if (idOrganization) {
        return Analytics.sendTrackEvent({
          action: 'enabled',
          actionSubject: 'powerUp',
          objectType: 'powerUp',
          objectId: idPlugin,
          containers: {
            board: {
              id: this.id,
            },
            organization: {
              id: idOrganization,
            },
          },
          source: 'createBoardModal',
          attributes: {
            isBCFeature: true,
            requiredBC: false,
            tags: attributes?.pluginTags,
            taskId: traceId,
          },
        });
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  disablePlugin(idPlugin: any) {
    const boardPlugin = this.boardPluginList.find(
      // eslint-disable-next-line @typescript-eslint/no-shadow
      (boardPlugin: BoardPlugin) => boardPlugin.get('idPlugin') === idPlugin,
    );
    return boardPlugin.destroy();
  }

  disablePluginWithTracing(idPlugin: string, tracingCallbackArgs = {}) {
    // check the legacy field "powerUps" first if that plugin is there.
    // Remove this logic after we fully remove this field.
    const legacyPowerUpsField = this.get('powerUps');
    if (legacyPowerUpsField?.length > 0) {
      for (const k in LegacyPowerUps) {
        if (idPlugin === LegacyPowerUps[k as keyof typeof LegacyPowerUps]) {
          const newPowerUps = legacyPowerUpsField.filter((val) => val !== k);
          this.set('powerUps', newPowerUps);
          this.api({ type: 'DELETE', method: `powerUps/${k}` });
        }
      }
    }

    // @ts-expect-error TS(2339): Property 'next' does not exist on type '{}'.
    const { next, traceId } = tracingCallbackArgs;
    const boardPlugin = this.boardPluginList.find(
      // eslint-disable-next-line @typescript-eslint/no-shadow
      (boardPlugin: BoardPlugin) => boardPlugin.get('idPlugin') === idPlugin,
    );
    return boardPlugin?.destroyWithTracing(
      { traceId },
      // @ts-expect-error TS(2345): Argument of type '{}' is not assignable to paramet... Remove this comment to see the full error message
      tracingCallback(tracingCallbackArgs, next),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  canVote(member: any) {
    if (this.isReadOnly()) {
      return false;
    }
    return (
      this.memberMatchesSetting(member, 'voting') ||
      (this.isEditableByTeamMember() && this.getPref('voting') !== 'disabled')
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  canComment(member: any) {
    if (this.isReadOnly()) {
      return false;
    }
    return (
      this.memberMatchesSetting(member, 'comments') ||
      (this.isEditableByTeamMember() && this.getPref('comments') !== 'disabled')
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  canInvite(member: any) {
    return this.memberMatchesSetting(member, 'invitations');
  }

  isPublic() {
    return this.getPref('permissionLevel') === 'public';
  }
  isPrivate() {
    return this.getPref('permissionLevel') === 'private';
  }

  getIdBoardMems() {
    return _.map(this.memberList.models, (member) => member.id);
  }

  getOrganization() {
    return ModelCache.get('Organization', this.get('idOrganization'));
  }

  getEnterprise() {
    if (this.get('idEnterprise')) {
      return ModelCache.get('Enterprise', this.get('idEnterprise'));
    } else {
      return this.getOrganization()?.getEnterprise();
    }
  }

  // We can't necessarily see the org
  hasOrganization() {
    return !!this.get('idOrganization');
  }

  isOrgAtOrOverFreeBoardLimit() {
    return this.getOrganization()?.isAtOrOverFreeBoardLimit() || false;
  }

  snoopOrganization() {
    return this.snoop('idOrganization').map(() => this.getOrganization());
  }

  orgMembersAvailable() {
    const organization = this.getOrganization();
    return _.chain(
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      organization.memberList.filter((member: any) => {
        // @ts-expect-error
        return !organization.isDeactivated(member);
      }),
    )
      .difference(this.memberList.models)
      .value();
  }

  optimisticJoinBoard() {
    const me = Auth.me();
    const isPremOrgAdmin = this.isPremOrgAdmin(me);

    // Fake out idBoards/idPremOrgsAdmin client-side, so we don't have to
    // wait for the response back from the server

    if (isPremOrgAdmin) {
      let left;
      me.set(
        'idPremOrgsAdmin',
        ((left = me.get('idPremOrgsAdmin')) != null ? left : []).concat(
          this.id,
        ),
      );
    }
    return me.set('idBoards', me.get('idBoards').concat(this.id));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  joinBoard(traceId: any, next: any) {
    const me = Auth.me();
    const isPremOrgAdmin = this.isPremOrgAdmin(me);
    const memberType = isPremOrgAdmin ? 'admin' : 'normal';

    this.optimisticJoinBoard();

    return this.addMember(me, traceId, memberType, next);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addMember(member: any, traceId: any, ...rest: any[]) {
    const adjustedLength = Math.max(rest.length, 1);
    // eslint-disable-next-line prefer-const
    let [memberType, invitationMessage] = Array.from(
      rest.slice(0, adjustedLength - 1),
    );
    const next = rest[adjustedLength - 1];
    if (typeof memberType === 'undefined' || memberType === null) {
      memberType = 'normal';
    }
    let { id } = member;
    const email = member.get('email');
    const data = {
      type: memberType,
      invitationMessage,
      allowBillableGuest: true,
    };

    // [TRELP-1453]
    // If we have the email use that instead of the id, this should
    // only be the case when the user has manually entered a full valid
    // email address and not searched. If we have an email we also don't
    // want to allow the server to accept an unconfirmed member directly
    // to the board this protects against a potential phishing attack
    if (email) {
      id = '';
      // @ts-expect-error TS(2339): Property 'email' does not exist on type '{ type: a... Remove this comment to see the full error message
      data.email = email;
    } else {
      // @ts-expect-error TS(2339): Property 'acceptUnconfirmed' does not exist on typ... Remove this comment to see the full error message
      data.acceptUnconfirmed = true;
    }

    return this.api(
      {
        type: 'put',
        method: `members/${id}`,
        data,
        traceId,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (err: any, response: any) => {
        let idOrganization;
        if (next) {
          next(err, response);
        }

        if (err) {
          return;
        }
        Analytics.sendTrackEvent({
          action: 'added',
          actionSubject: 'member',
          actionSubjectId: member.id,
          source: getScreenFromUrl(),
          containers: {
            board: {
              id: this.get('id'),
            },
            organization: {
              id: this.get('idOrganization'),
            },
          },
          attributes: {
            addedTo: 'board',
            confirmed: !!member.get('confirmed'),
            memberType,
            taskId: traceId,
            // add prop for Trello Invite From Slack project
            source: member.source,
          },
        });

        if (
          memberType === 'observer' &&
          (idOrganization = this.get('idOrganization')) != null
        ) {
          return Analytics.sendTrackEvent({
            action: 'added',
            actionSubject: 'observer',
            containers: {
              board: {
                id: this.id,
              },
              organization: {
                id: idOrganization,
              },
            },
            source: 'boardScreen',
            attributes: {
              isBCFeature: true,
              requiredBC: true,
              taskId: traceId,
            },
          });
        }
      },
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeMemberWithTracing(member: any, traceId: any, next: any) {
    //Optimistically remove membership
    this.set(
      'memberships',
      _.reject(
        this.get('memberships'),
        // @ts-expect-error TS(2339): Property 'idMember' does not exist on type 'string... Remove this comment to see the full error message
        (membership) => membership.idMember === member.id,
      ),
    );

    return this.memberList.removeMembershipWithTracing(
      member,
      { traceId },
      next,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeMember(member: any) {
    // @ts-expect-error TS(2339): Property 'removeMembership' does not exist on type... Remove this comment to see the full error message
    this.memberList.removeMembership(member);

    return this.set(
      'memberships',
      _.reject(
        this.get('memberships'),
        // @ts-expect-error TS(2339): Property 'idMember' does not exist on type 'string... Remove this comment to see the full error message
        (membership) => membership.idMember === member.id,
      ),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changeMemberRole(member: any, opts: any, traceId: any) {
    let idOrganization;
    if (
      (opts != null ? opts.type : undefined) === 'observer' &&
      (idOrganization = this.get('idOrganization')) != null
    ) {
      Analytics.sendTrackEvent({
        action: 'added',
        actionSubject: 'observer',
        containers: {
          board: {
            id: this.id,
          },
          organization: {
            id: idOrganization,
          },
        },
        source: 'boardScreen',
        attributes: {
          isBCFeature: true,
          requiredBC: true,
          taskId: traceId,
        },
      });
    }

    // Copied inline from MembershipModel mixin in sake of bulk decaf.
    // Is duplicated in the corresponding method of organization model
    if (opts.type != null) {
      this.setOnMembership(member, { memberType: opts.type });
    }

    return ApiPromise({
      type: 'PUT',
      url: `/1/${this.typeName.toLowerCase()}/${this.id}/members/${member.id}`,
      data: opts,
      traceId,
    }).then(() => {
      Analytics.sendTrackEvent({
        action: 'updated',
        actionSubject: 'role',
        source: 'boardScreen',
        attributes: {
          taskId: traceId,
          updatedOn: 'member',
          value: opts.type,
        },
      });
    });
  }

  getObserverList() {
    return (() => {
      const result = [];
      for (const member of Array.from(this.memberList.models)) {
        if (this.isObserver(member)) {
          result.push(member);
        }
      }
      return result;
    })();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filterLabels(term: any) {
    const labels = this.getLabels();

    if (!term) {
      return labels;
    }

    return labels?.filter((label) => {
      const name = (label?.get('name') ?? '').toLowerCase();
      const color = (label?.get('color') ?? '').toLowerCase();
      const localizedColor = formatLabelColor(color).toLowerCase();

      return (
        name.includes(term) ||
        color.startsWith(term) ||
        localizedColor.startsWith(term) ||
        // TRELP-3230
        // Labels.colors puts black as the last label with a index of 9,
        // but everywhere in hotkeys and the app refer to the black color
        // as 0 in the color list so if the color of the current label in
        // the filter is black and the term is exactly "0" then we want to
        // return the black labels
        (color === 'black' && term === '0') ||
        // eslint-disable-next-line radix
        label.get('color') === Label.colors[parseInt(term) - 1]
      );
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  labelForColor(color: any) {
    return _.chain(this.getLabels())
      .filter((label) => label.get('color') === color)
      .first()
      .value();
  }

  labelsForColors(): Partial<Record<NonNullable<LabelColor>, Label[]>> {
    return _.chain(this.getLabels())
      .groupBy((label) => label.get('color'))
      .value() as Partial<Record<NonNullable<LabelColor>, Label[]>>;
  }

  createLabel(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    name: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    color: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    traceId: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onFail: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onAbort: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: any,
  ) {
    const label = _.find(
      this.getLabels(),
      // eslint-disable-next-line @typescript-eslint/no-shadow
      (label) => label.get('name') === name && label.get('color') === color,
    );
    if (!label) {
      const createdLabel = this.labelList.createWithTracing(
        { name, color: color != null ? color : '' },
        {
          traceId,
          url: `/1/board/${this.id}/labels/`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          error: (model: any, err: any) => {
            onFail(err);
            // The label is optimistically added.
            // If the add fails, remove the label
            return this.labelList.remove(createdLabel);
          },
          success: () => {
            onSuccess();
          },
        },
      );
    } else {
      onAbort(new Error('Label already exists'));
    }
  }

  labelColors() {
    return Label.colors;
  }

  getLabels() {
    return this.labelList.models.sort(Label.compare);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _generateKey(type: any) {
    return this.api({
      type: 'post',
      method: `${type}Key/generate`,
    });
  }

  generateEmailKey() {
    return this._generateKey('email');
  }

  generateCalendarKey() {
    return this._generateKey('calendar');
  }

  openCards() {
    return _.flatten(
      Array.from(this.listList.models).map((list) => list.openCards().models),
    );
  }

  listenForPermChange() {
    if (!Auth.isLoggedIn()) {
      return; // nothing to listen for
    }

    let lastPermState = this.getViewPermState(Auth.me());
    let lastOwned = this.owned();

    const checkChange = this.callOnceAfter(() => {
      const currentPermState = this.getViewPermState(Auth.me());
      if (currentPermState !== lastPermState) {
        lastPermState = currentPermState;
        this.trigger('permChange', currentPermState);
      }

      const currentOwned = this.owned();
      if (currentOwned !== lastOwned) {
        lastOwned = currentOwned;
        this.trigger('ownedChange', currentOwned);
      }
    });

    this.listenTo(Auth.me().boardList, 'add remove reset', checkChange);
    this.listenTo(Auth.me().organizationList, 'add remove reset', checkChange);
    this.listenTo(this.memberList, 'add remove reset', checkChange);
    return this.listenTo(
      this,
      'change:memberships change:prefs.permissionLevel',
      checkChange,
    );
  }

  getViewPermState(member: Member): PermissionState {
    let needle;
    if (this.isObserver(member)) {
      return 'observer';
    } else if (
      ((needle = this.getMemberType(member)),
      ['normal', 'admin'].includes(needle))
    ) {
      return 'member';
    } else if (Util.hasValidInviteTokenFor(this, member)) {
      return 'inviteToken';
    } else if (
      this.getOrganization()?.isMember(member) &&
      this.getPref('permissionLevel') === 'org'
    ) {
      return 'org';
    } else if (this.getPref('permissionLevel') === 'public') {
      return 'public';
    } else if (
      // @ts-expect-error
      this.getEnterprise()?.canViewEnterpriseVisibleBoard(member) &&
      this.getPref('permissionLevel') === 'enterprise'
    ) {
      return 'enterprise';
    } else {
      return 'none';
    }
  }

  dataForLabel(label: Label) {
    return label.toJSON();
  }

  isViewableBy(member: Member) {
    return this.getViewPermState(member) !== 'none';
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-shadow */
  toggleTag(idTag: string, traceId: any, tracingCallback: any) {
    let needle;
    return this.toggle(
      'idTags',
      idTag,
      // @ts-expect-error TS(2769): No overload matches this call.
      ((needle = idTag), !Array.from(this.getIdTags()).includes(needle)),
      { traceId },
      tracingCallback,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setPluginData(idPlugin: string, visibility: any, data: any) {
    return this.pluginDataList.upsert(idPlugin, visibility, data);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setPluginDataByKey(idPlugin: string, visibility: any, key: any, val: any) {
    return this.pluginDataList.setPluginDataByKey(
      idPlugin,
      visibility,
      key,
      val,
    );
  }

  getPluginData(idPlugin: string) {
    return {
      ...this.getOrganization()?.getPluginData(idPlugin),
      ...this.pluginDataList.dataForPlugin(idPlugin),
    };
  }

  getPluginDataByKey(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    idPlugin: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visibility: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    key: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultVal: any,
  ) {
    return this.pluginDataList.getPluginDataByKey(
      idPlugin,
      visibility,
      key,
      defaultVal,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  snoopPluginData(idPlugin: any) {
    const orgPluginData = this.snoopOrganization()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map(function (org: any) {
        if (org != null) {
          return org.snoopPluginData(idPlugin);
        } else {
          return Hearsay.const(null);
        }
      })
      .latest();

    const boardPluginData = this.pluginDataList.snoopDataForPlugin(idPlugin);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Hearsay.combine(orgPluginData, boardPluginData).map((entries: any) =>
      Object.assign({}, ...(entries || [])),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clearPluginData(idPlugin: any, visibility = 'private') {
    const data = this.pluginDataList.for(idPlugin, visibility);
    if (data) {
      data.destroy();
    }
  }

  idPluginsEnabled() {
    return this.boardPluginList.pluck('idPlugin') as string[];
  }

  snoopIdPluginsEnabled(): string[][] {
    return Hearsay.combine(this.boardPluginList.snoop()).map(function (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...args: any[]
    ) {
      const [boardPluginList] = Array.from(args[0]);
      // @ts-expect-error TS(2571): Object is of type 'unknown'.
      return boardPluginList.pluck('idPlugin');
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  invitationUrl(secret: any) {
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    return getBoardInvitationLinkUrl(secret);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startDelete(traceId: any, next: any) {
    this._isDeleting = true;
    this.trigger('deleting');

    // This *starts* the delete, but it may take a while for it to actually
    // be deleted
    return ApiPromise({
      method: 'delete',
      url: this.url(),
      traceId,
    })
      .then(() => {
        return new Bluebird((resolve) => {
          const checkBoard = () => {
            return ApiPromise({
              url: this.url(),
              fields: '',
              traceId,
            })
              .then(() => {
                return window.setTimeout(checkBoard, 500);
              })
              .catch(ApiError.NotFound, () => {
                return resolve();
              });
          };

          return checkBoard();
        });
      })
      .then((response) => {
        next(null, response);
        return ModelCache.remove(this);
      })
      .catch((err) => {
        next(err);
      })
      .return();
  }

  isDeleting() {
    return this._isDeleting;
  }

  getBoardList() {
    const me = Auth.me();
    return me?.boardList.toJSON();
  }

  getCurrentBoard() {
    const boards = this.getBoardList();
    const boardIdx = boards?.findIndex(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (board: any) => board.id === `${this.id}`,
    );
    return boards[boardIdx];
  }

  isBcBoard() {
    const currentBoard = this.getCurrentBoard();
    return currentBoard?.premiumFeatures.includes('isBc');
  }

  isPremiumBoard() {
    const currentBoard = this.getCurrentBoard();
    return currentBoard?.premiumFeatures.includes('isPremium');
  }

  isStandardBoard() {
    const currentBoard = this.getCurrentBoard();
    // BC premium features also contain 'isStandard' so this checks if it's just Standard
    return (
      !currentBoard?.premiumFeatures.includes('isBc') &&
      currentBoard?.premiumFeatures.includes('isStandard')
    );
  }

  isOrgBoard() {
    // We consider it to be an org board if it belongs to an organization that
    // the member is part of
    let needle;
    const idOrg = this.getOrganization()?.id;
    return (
      idOrg != null &&
      ((needle = idOrg),
      Array.from(Auth.me().get('idOrganizations')).includes(needle))
    );
  }

  isEnterpriseBoard() {
    // We consider it to be an enterprise board if one of the
    //# following is true:
    // - it has an `idEnterprise` set
    // - it belongs to an organization that belongs to an
    //# enterprise. We also check if it's a real enterprise,
    //# because we still have BCPO teams in the enterprises collection :/

    const org = this.getOrganization();

    // this.get('idEnterprise') is getting the idEnterprise directly on the board in this context.
    // The previous conditional was only looking at that property if no org were returned.
    // But in cases of a guest, an org with minimal details gets returned so it was skipped even though the board itself had a valid idEnterprise
    if (this.get('idEnterprise') && org?.belongsToRealEnterprise()) {
      return true;
    }

    return org
      ? org.isEnterprise() && org.belongsToRealEnterprise()
      : !!this.get('idEnterprise');
  }

  isWelcomeBoard() {
    // creationMethod will always be demo for welcome boards
    // NOTE: we still use the old logic w/ threshold bc older welcome boards
    // don't have the creationMethod set
    let middle;
    return (
      // @ts-expect-error TS(2345): Argument of type '"creationMethod"' is not assigna... Remove this comment to see the full error message
      this.get('creationMethod') === 'demo' ||
      (0 <=
        // @ts-expect-error TS(2362): The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
        (middle = Util.idToDate(this.get('id')) - Util.idToDate(Auth.myId())) &&
        middle < WELCOME_BOARD_THRESHOLD)
    );
  }

  isFirstOwnedBoard() {
    // Use a tighter threshold for boards created shortly after account creation,
    // including the skipBoardsPage board
    const welcomeBoardThreshold = 1000;
    // This is not quite the same as the check done in create board component
    // or view, but should be good enough for new users without waiting on
    // Auth.me().boardList being completely loaded since we have all the idBoards
    // that a member is on, including the current board.
    const me = Auth.me();
    const idBoards = me.get('idBoards');
    const nonInvitedOrWelcomeBoardIds = _.filter(
      idBoards,
      (idBoard) =>
        // Boards created after member was created
        !me.accountNewerThan(Util.idToDate(idBoard)) &&
        // Non-welcome boards
        // @ts-expect-error TS(2362): The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
        Util.idToDate(idBoard) - Util.idToDate(Auth.myId()) >
          welcomeBoardThreshold,
    );
    return nonInvitedOrWelcomeBoardIds.length === 1;
  }

  loadPlugins() {
    this.availablePlugins = ModelLoader.loadBoardPlugins(
      this.id,
      Auth.me()?.getLocale(),
    );

    if (this.isButlerCore()) {
      this.availablePlugins = this.availablePlugins.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (plugin: any) => plugin.id !== BUTLER_POWER_UP_ID,
      );
    }

    return this.availablePlugins;
  }

  isMapCore() {
    return this.isFeatureEnabled(PremiumFeatures.views);
  }

  isCustomFieldsCore() {
    return this.isFeatureEnabled(PremiumFeatures.paidCorePlugins);
  }

  getAvailablePlugins() {
    return this.availablePlugins != null
      ? this.availablePlugins
      : (this.availablePlugins = this.loadPlugins());
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hasCustomField(type: any, name: any, isSuggestedField = false) {
    return this.customFieldList.some(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (cf: any) =>
        cf.get('type') === type &&
        cf.get('name') === name &&
        (!isSuggestedField || cf.get('isSuggestedField')),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCustomField(type: any, name: any, isSuggestedField = false) {
    return this.customFieldList.find(
      (cf: CustomField) =>
        cf.get('type') === type &&
        cf.get('name') === name &&
        (!isSuggestedField || cf.get('isSuggestedField')),
    );
  }

  getAttachmentRestrictions() {
    if (this.getEnterprise() != null) {
      // @ts-expect-error
      return this.getEnterprise().getOrganizationPref('attachmentRestrictions');
    } else {
      return this.getOrganization()?.getPref('attachmentRestrictions');
    }
  }

  getRestrictedAttachmentTypes() {
    if (this.getEnterprise() != null) {
      // @ts-expect-error
      return this.getEnterprise().getRestrictedAttachmentTypes();
    } else {
      return this.getOrganization()?.getRestrictedAttachmentTypes();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attachmentTypeRestricted(attachmentType: any) {
    return (
      // @ts-expect-error
      this.getEnterprise()?.attachmentTypeRestricted(attachmentType) ||
      this.getOrganization()?.attachmentTypeRestricted(attachmentType)
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attachmentUrlRestricted(url: any) {
    return (
      // @ts-expect-error
      this.getEnterprise()?.attachmentUrlRestricted(url) ||
      this.getOrganization()?.attachmentUrlRestricted(url)
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  canRemoveMember(member: any) {
    return (
      this.getMembershipFor(member) &&
      (!this.ownedByMember(member) ||
        (this.ownedByMember(member) && this.adminList.length > 1))
    );
  }

  async getNewBillableGuests() {
    if (!Auth.isLoggedIn()) {
      return Bluebird.resolve([]);
    }

    const org = this.getOrganization();
    if (org?.isPremiumPO()) {
      try {
        const result = {};
        const responses = await trelloBatchFetch(
          [
            `/1/organizations/${org.id}/newBillableGuests/${this.id}`,
            `/1/organizations/${org.id}?fields=availableLicenseCount`,
          ],
          {
            operationName: 'getNewBillableGuests',
          },
        );

        for (const [, , response] of responses) {
          if (!response) {
            continue;
          }

          // @ts-expect-error TS(2571): Object is of type 'unknown'.
          if (!response.newBillableGuests) {
            // @ts-expect-error TS(2339): Property 'newBillableGuests' does not exist on typ... Remove this comment to see the full error message
            result.newBillableGuests = response;
          } else {
            // @ts-expect-error TS(2339): Property 'availableLicenseCount' does not exist on... Remove this comment to see the full error message
            result.availableLicenseCount =
              // @ts-expect-error TS(2571): Object is of type 'unknown'.
              response.availableLicenseCount === null
                ? Infinity
                : // @ts-expect-error TS(2571): Object is of type 'unknown'.
                  response.availableLicenseCount;
          }
        }

        return result;
      } catch (error) {
        sendErrorEvent(error, {
          tags: {
            ownershipArea: 'trello-platform',
            // @ts-expect-error TS(2322): Type '"getNewBillableGuests"' is not assignable to... Remove this comment to see the full error message
            feature: 'getNewBillableGuests',
          },
        });
        return [];
      }
    } else {
      const hasBillableGuestsFeature =
        org != null ? org.isFeatureEnabled('multiBoardGuests') : undefined;

      if (hasBillableGuestsFeature) {
        return ApiPromise({
          // @ts-expect-error
          url: `/1/organizations/${org.id}/newBillableGuests/${this.id}`,
          type: 'get',
          background: true,
        }).then((response) => ({
          newBillableGuests: response,
          availableLicenseCount: Infinity,
        }));
      } else {
        return Bluebird.resolve({
          newBillableGuests: [],
          availableLicenseCount: Infinity,
        });
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  shouldRenderPluginSuggestionSection(idPlugin: any) {
    if (!this.editable()) {
      return false;
    }
    if (this.isPluginEnabled(idPlugin)) {
      return false;
    }
    if (
      this.isEnterpriseBoard() &&
      // @ts-expect-error
      !this.getEnterprise()?.isPluginAllowed(idPlugin)
    ) {
      return false;
    }

    return !this.getPluginDataByKey(
      idPlugin,
      'private',
      'dismissedSection',
      false,
    );
  }

  getPaidStatus() {
    if (this.isEnterpriseBoard()) {
      return 'enterprise';
    } else if (this.getOrganization()?.isPremium()) {
      return 'bc';
    } else if (this.getOrganization()?.isStandard()) {
      return 'standard';
    } else {
      return 'free';
    }
  }

  countDueDates(): number {
    return this.listList.reduce(
      (acc: number, list: List) =>
        acc +
        list.openCards().filter((card: Card) => card.get('due') != null).length,
      0,
    );
  }

  hasInvitationRestrictions() {
    const org = this.getOrganization();
    const enterprise = this.getEnterprise();

    if (org) {
      return (
        org.onlyOrgMembers() ||
        org.onlyManagedMembers() ||
        org.onlyOrgOrManagedMembers()
      );
    } else if (enterprise) {
      return (
        // @ts-expect-error
        enterprise.onlyLicensedMembers() ||
        // @ts-expect-error
        enterprise.onlyManagedMembers() ||
        // @ts-expect-error
        enterprise.onlyLicensedOrManagedMembers()
      );
    }

    return false;
  }

  getInviteURLParams() {
    const org = this.getOrganization();
    const enterprise = this.getEnterprise();

    if (org) {
      switch (org.getPref('boardInviteRestrict')) {
        case BoardInviteRestrictValues.ORG:
          return { onlyOrgMembers: true };
        case BoardInviteRestrictValues.MANAGED:
          return { onlyManagedMembers: true };
        case BoardInviteRestrictValues.ORG_OR_MANAGED:
          return { onlyOrgOrManagedMembers: true };
        default:
      }
    } else if (enterprise) {
      // @ts-expect-error
      switch (enterprise.getPref('personalBoardInviteRestrict')) {
        case BoardInviteRestrictValues.LICENSED:
          return { idEnterprise: enterprise.id, onlyLicensedMembers: true };
        case BoardInviteRestrictValues.MANAGED:
          return { idEnterprise: enterprise.id, onlyManagedMembers: true };
        case BoardInviteRestrictValues.LICENSED_OR_MANAGED:
          return {
            idEnterprise: enterprise.id,
            onlyLicensedOrManagedMembers: true,
          };
        default:
      }
    }

    return {};
  }

  getAnalyticsContainers() {
    return {
      board: { id: this.id },
      organization: {
        id: this.get('idOrganization') || undefined,
      },
      enterprise: {
        id: this.get('idEnterprise') || undefined,
      },
    };
  }

  orderedVisibleAdmins() {
    return MembershipModel.orderedVisibleAdmins.call(this);
  }
  orderedVisibleMembers() {
    return MembershipModel.orderedVisibleMembers.call(this);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getMemberType(member: Member, opts?: any) {
    return MembershipModel.getMemberType.call(this, member, opts);
  }
  _refreshMemberships() {
    return MembershipModel._refreshMemberships.call(this);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _getMembershipFor(member: any) {
    return MembershipModel._getMembershipFor.call(this, member);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getMembershipFor(member: any) {
    return MembershipModel.getMembershipFor.call(this, member);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hasActiveMembership(member: any) {
    return MembershipModel.hasActiveMembership.call(this, member);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isMember(member: any) {
    return MembershipModel.isMember.call(this, member);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isPending(member: any) {
    return MembershipModel.isPending.call(this, member);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isDeactivated(member: any) {
    return MembershipModel.isDeactivated.call(this, member);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isUnconfirmed(member: any) {
    return MembershipModel.isUnconfirmed.call(this, member);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isObserver(member: any) {
    return MembershipModel.isObserver.call(this, member);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isPremOrgAdmin(memberOrId: any) {
    return MembershipModel.isPremOrgAdmin.call(this, memberOrId);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getExplicitMemberType(member: any) {
    return MembershipModel.getExplicitMemberType.call(this, member);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  canSeeDeactivated(member: any) {
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
  setOnMembership(member: any, attrs: any) {
    return MembershipModel.setOnMembership.call(this, member, attrs);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addMemberRole(opts: any) {
    return MembershipModel.addMemberRole.call(this, opts);
  }
}
Board.initClass();

export { Board };
