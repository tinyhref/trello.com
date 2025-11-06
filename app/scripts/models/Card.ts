/* eslint-disable
    @typescript-eslint/no-this-alias,
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
 * DS202: Simplify dynamic range loops
 * DS204: Change includes calls to have a more natural evaluation order
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

// eslint-disable-next-line no-restricted-imports
import Bluebird from 'bluebird';
import { addSeconds } from 'date-fns';
import _ from 'underscore';

import type { HistoryAction, HistoryContext } from '@trello/action-history';
import { ActionHistory } from '@trello/action-history';
import { Analytics } from '@trello/atlassian-analytics';
import { fireConfetti, shouldFireConfetti } from '@trello/confetti';
import { siteDomain } from '@trello/config';
import { getApiError, parseXHRError } from '@trello/error-handling';
import { sendNetworkErrorEvent } from '@trello/error-reporting';
import { idCache } from '@trello/id-cache';
// eslint-disable-next-line no-restricted-imports -- legacy code
import $ from '@trello/jquery';
import type { LabelColor } from '@trello/labels';
import { getScreenFromUrl } from '@trello/marketing-screens';
import { getCsrfRequestPayload } from '@trello/session-cookie/csrf';

import { getCardUrl } from 'app/scripts/controller/urls';
import { Auth } from 'app/scripts/db/Auth';
import { ModelCache } from 'app/scripts/db/ModelCache';
// eslint-disable-next-line no-restricted-imports -- legacy code
import { Dates } from 'app/scripts/lib/dates';
import type { ViewLimit } from 'app/scripts/lib/limits';
import { isOverLimit } from 'app/scripts/lib/limits';
import { Util } from 'app/scripts/lib/util';
import { actionFilterFromString } from 'app/scripts/lib/util/action-filter-from-string';
import { ninvoke } from 'app/scripts/lib/util/ninvoke';
import { Action } from 'app/scripts/models/Action';
import type { Board } from 'app/scripts/models/Board';
import { AttachmentList } from 'app/scripts/models/collections/AttachmentList';
import { CustomFieldItemList } from 'app/scripts/models/collections/CustomFieldItemList';
import { LabelList } from 'app/scripts/models/collections/LabelList';
import type { MemberList } from 'app/scripts/models/collections/MemberList';
import { PluginDataList } from 'app/scripts/models/collections/PluginDataList';
import { StickerList } from 'app/scripts/models/collections/StickerList';
import { LabelsHelper } from 'app/scripts/models/internal/LabelsHelper';
import type { TrelloModelAttributes } from 'app/scripts/models/internal/TrelloModel';
import { TrelloModel } from 'app/scripts/models/internal/TrelloModel';
import type { Label } from 'app/scripts/models/Label';
import { List } from 'app/scripts/models/List';
import { ApiAjax } from 'app/scripts/network/ApiAjax';
import Payloads from 'app/scripts/network/payloads';
import { MemberState } from 'app/scripts/view-models/MemberState';
import { AttachmentLimitExceededError as LimitExceeded } from 'app/scripts/views/attachment/AttachmentLimitExceededError';
import { AttachmentTypeRestrictedError as TypeRestricted } from 'app/scripts/views/attachment/AttachmentTypeRestrictedError';
import type { ActionList } from './collections/ActionList';
import type { ChecklistList } from './collections/ChecklistList';

export interface CardAttributes extends TrelloModelAttributes {
  attachments: unknown;
  dueComplete: boolean;
  cover: {
    size: string;
    brightness: string;
    color: string;
    idAttachment: string;
    idUploadedBackground: string;
    idPlugin: string;
  };
  cardRole: 'board' | 'link' | 'mirror' | 'separator';
  subscribed: boolean;
  idAttachmentCover: string;
  closed: boolean;
  desc: string;
  dateLastActivity?: Date | null | undefined;
  start: Date | null | undefined;
  due: Date | null | undefined;
  dueReminder: number;
  name: string;
  isTemplate: boolean;
  idList: string;
  idBoard: string;
  shortLink: string;
  idShort: number;
  idLabels: string[];
  idMembers: string[];
  url: string;
  creationMethodError?: string;
  badges: {
    votes?: number;
    viewingMemberVoted?: boolean;
    checkItemsEarliestDue?: string;
    subscribed?: boolean;
    lastUpdatedByAi?: boolean;
  };
  limits: ViewLimit;
}

interface Card extends TrelloModel<CardAttributes> {
  typename: 'Card';
  urlRoot: '/1/cards';
  customFieldItemList: CustomFieldItemList;
  labelList: LabelList;
  memberEditingList: MemberList;
  memberList: MemberList;
  memberVotedList: MemberList;
  checklistList: ChecklistList;
  stickerList: StickerList;
  attachmentList: AttachmentList;
  actionList: ActionList;
  pluginDataList: PluginDataList;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _actionFilter: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _editingTimeout: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _lockQueue: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  collection: any;
}

const EDITING_AUTO_CLEAR_MS = 10000;

class Card extends TrelloModel<CardAttributes> {
  constructor(attr?: Partial<CardAttributes>) {
    super(...arguments);
    this.editable = this.editable.bind(this);
    this.isObserver = this.isObserver.bind(this);
    this.isOnBoardTemplate = this.isOnBoardTemplate.bind(this);
    this._lockQueue = {};
  }

  static initClass() {
    this.prototype.typeName = 'Card';
    this.prototype.urlRoot = '/1/cards';

    this.lazy({
      memberList(this: Card) {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          MemberList,
        } = require('app/scripts/models/collections/MemberList');
        return new MemberList().syncModel(this, 'idMembers');
      },
      labelList(this: Card) {
        return (
          new LabelList()
            .syncModel(this, 'idLabels')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .syncCache(this.modelCache, [], (label: any) => {
              let left, needle;
              return (
                (needle = label.id),
                Array.from(
                  (left = this.get('idLabels')) != null ? left : [],
                ).includes(needle)
              );
            })
        );
      },
      memberVotedList(this: Card) {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          MemberList,
        } = require('app/scripts/models/collections/MemberList');
        return new MemberList().syncModel(this, 'idMembersVoted');
      },
      checklistList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          ChecklistList,
        } = require('app/scripts/models/collections/ChecklistList');
        return new ChecklistList().syncCache(
          this.modelCache,
          ['idCard'],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (checklist: any) => {
            return checklist.get('idCard') === this.id;
          },
        );
      },
      attachmentList() {
        return new AttachmentList().syncSubModels(this, 'attachments');
      },
      actionList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          ActionList,
        } = require('app/scripts/models/collections/ActionList');
        return new ActionList().syncCache(
          this.modelCache,
          [],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (action: any) => {
            const type = action.get('type');
            const isComment = ['commentCard', 'copyCommentCard'].includes(type);
            const idBoard = action.get('data').board?.id;
            const isSameBoard = idBoard === this.get('idBoard');
            return action.includesModel(this) && (isComment || isSameBoard);
          },
        );
      },
      stickerList() {
        return new StickerList(this.get('stickers'), {
          card: this,
          modelCache: this.modelCache,
        }).syncSubModels(this, 'stickers');
      },
      customFieldItemList() {
        return new CustomFieldItemList().syncCache(
          this.modelCache,
          [],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (cfi: any) => {
            return (
              cfi.get('idModel') === this.id && cfi.get('modelType') === 'card'
            );
          },
        );
      },
      pluginDataList() {
        return new PluginDataList([], {
          scopeModel: this,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }).syncCache(this.modelCache, [], (pluginData: any) => {
          return (
            pluginData.get('idModel') === this.id &&
            pluginData.get('scope') === 'card'
          );
        });
      },
      memberEditingList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          MemberList,
        } = require('app/scripts/models/collections/MemberList');
        return new MemberList();
      },
    });
  }

  initialize() {
    this.listenTo(this, 'change:id change:idBoard', () => {
      return this.actionList.sync();
    });

    this.triggerSubpropertyChangesOn('badges');
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
      this._actionFilter = actionFilterFromString(Payloads.cardActions);
    }
    return this._actionFilter(action);
  }

  cacheShortLink() {
    return this.waitForAttrs(
      this,
      ['id', 'shortLink'],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ({ id, shortLink }: any) => idCache.setCardId(shortLink, id),
    );
  }

  cacheAri() {
    return this.waitForAttrs(
      this,
      ['nodeId', 'shortLink'],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ({ nodeId, shortLink }: any) => idCache.setCardAri(shortLink, nodeId),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateEditing(member: any) {
    if (this._editingTimeout == null) {
      this._editingTimeout = {};
    }

    // This is a no-op if member is already in the list
    this.memberEditingList.add(member);

    if (this._editingTimeout[member.id] != null) {
      clearTimeout(this._editingTimeout[member.id]);
      delete this._editingTimeout[member.id];
    }

    return (this._editingTimeout[member.id] = this.setTimeout(() => {
      return this.memberEditingList.remove(member);
    }, EDITING_AUTO_CLEAR_MS));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sync(method: any, model: any, options: any) {
    if (
      method === 'create' &&
      !(this.get('idBoard') != null && this.get('idList') != null)
    ) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.waitForAttrs(this, ['idBoard', 'idList'], (attrs: any) => {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        this.set(attrs);
        // @ts-expect-error TS(2339): Property '__proto__' does not exist on type 'Card'... Remove this comment to see the full error message
        Card.prototype.__proto__.sync.call(this, method, model, options);
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.waitForId(this.getBoard(), (id: any) => this.set('idBoard', id));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return this.waitForId(this.getList(), (id: any) =>
        this.set('idList', id),
      );
    } else {
      return super.sync(...arguments);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set(key: any, options: any) {
    if (key != null ? key.labels : undefined) {
      key.labels = Array.from(key.labels).map((label) =>
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        label.color != null ? label.color : label,
      );
    }

    if (key != null ? key.badges : undefined) {
      key.badges = {
        ...this.get('badges'),
        ...key.badges,
      };
    }

    // @ts-expect-error
    return super.set(...arguments);
  }

  moveToList(listDest: List, index: number, keyboardMove = false, source = '') {
    const card = this;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.waitForId(listDest, (idList: any) => {
      let composerIndex;
      const newPos = listDest.calcPos(index, card);
      const { composer } = listDest.getBoard();

      if (
        // @ts-expect-error
        newPos === card.get('pos') &&
        card.get('idList') === idList &&
        card.isOpen()
      ) {
        // if we were not removing the card from the archive,
        // handle if we were just swapping the card with the composer
        composerIndex = composer.get('index');
        if (composerIndex === index) {
          composer.set('index', composerIndex + 1);
        } else if (composerIndex === index + 1) {
          composer.set('index', composerIndex - 1);
        }

        return;
      }

      const sourceIdList = card.get('idList');
      const sourceIndex = card.getIndexInList();

      const idBoard = listDest.getBoard().id;

      const delta = {
        pos: newPos,
        idList,
        idBoard,
        closed: false,
      };

      for (const key in delta) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        const value = delta[key];
        // @ts-expect-error
        if (card.get(key) === value) {
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          delete delta[key];
        }
      }

      if (keyboardMove) {
        setTimeout(() => {
          card.trigger('keyboardMove');
          if (shouldFireConfetti(listDest.get('name'))) {
            const listEle = $('.js-current-list');
            if (listEle.length === 1) {
              // @ts-expect-error TS(2339): Property 'left' does not exist on type 'Coordinate... Remove this comment to see the full error message
              const { left, top } = listEle.offset();
              fireConfetti({
                x: left / window.innerWidth,
                y: top / window.innerHeight,
              });
            }
          }
        });
      }

      const taskName = delta.idList ? 'edit-card/idList' : 'edit-card/pos';

      const traceId = Analytics.startTask({
        taskName,
        // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'SourceTyp... Remove this comment to see the full error message
        source: source || getScreenFromUrl(),
      });

      const cardsInTargetList = listDest.openCards().length;

      this.recordAction({
        type: 'move',
        idBoard,
        idList,
        position: (() => {
          switch (index) {
            case 0:
              if (cardsInTargetList > 0) {
                return 'top';
              } else {
                return index;
              }
            case cardsInTargetList:
              if (cardsInTargetList > 1) {
                return 'bottom';
              } else {
                return index;
              }
            case 1:
              if (cardsInTargetList > 1) {
                return 1;
              } else {
                return index;
              }
            default:
              return index;
          }
        })(),
        fromPosition: sourceIndex,
      });

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      delta['traceId'] = traceId;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      card.update(delta, (err: any, data: any) => {
        if (err) {
          throw Analytics.taskFailed({
            taskName,
            traceId,
            // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'SourceTyp... Remove this comment to see the full error message
            source: source || getScreenFromUrl(),
            error: err,
          });
        } else {
          Analytics.sendUpdatedCardFieldEvent({
            field: delta.idList ? 'idList' : 'pos',
            source: getScreenFromUrl(),
            containers: {
              card: { id: data.id },
              board: { id: data.idBoard },
              list: { id: data.idList },
            },
            attributes: {
              taskId: traceId,
            },
          });
          Analytics.taskSucceeded({
            taskName,
            traceId,
            // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'SourceTyp... Remove this comment to see the full error message
            source: source || getScreenFromUrl(),
          });
        }
      });

      if (composer != null ? composer.get('vis') : undefined) {
        composerIndex = composer.get('index');

        if (
          composer.get('list').id === idList &&
          composer.get('index') >= index
        ) {
          // if we moved a card to above the composer, increment the position
          // note: we have no way to differentiate between moving a card to just
          // above/just below the composer, so assume above
          composerIndex++;
        }

        if (
          composer.get('list').id === sourceIdList &&
          composer.get('index') > sourceIndex
        ) {
          composerIndex--;
        }

        return composer.set('index', composerIndex);
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  moveToNextList(position: any, callback?: any) {
    const listList = this.getBoard().listList.models;
    const indexCurrentList = _.indexOf(listList, this.getList());
    if (indexCurrentList < listList.length - 1) {
      this.moveToList(
        listList[indexCurrentList + 1],
        position === 'top' ? 0 : 1e9,
        true,
      );
      if (callback) {
        callback();
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  moveToPrevList(position: any, callback?: any) {
    const listList = this.getBoard().listList.models;
    const indexCurrentList = _.indexOf(listList, this.getList());
    if (indexCurrentList > 0) {
      this.moveToList(
        listList[indexCurrentList - 1],
        position === 'top' ? 0 : 1e9,
        true,
      );
      if (callback) {
        callback();
      }
    }
  }

  toggleMemberWithTracing(
    idMember: string,
    opts: { traceId: string; isMember?: boolean | null },
    next: (err: Error | null, result: unknown) => void,
  ) {
    const { traceId } = opts;
    let { isMember } = opts;

    if (typeof isMember === 'undefined' || isMember === null) {
      isMember = !this.hasMember(idMember);
    }
    const isMe = Auth.isMe(idMember);

    if (isMember && isMe) {
      this.set('subscribed', true);
    }

    this.recordAction({
      type: isMe
        ? isMember
          ? 'join'
          : 'leave'
        : isMember
          ? 'add-member'
          : 'remove-member',

      idMember,
    });

    return this.toggle('idMembers', idMember, isMember, { traceId }, next);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addMemberWithTracing(idMember: string, traceId: string, next: any) {
    return this.toggleMemberWithTracing(
      idMember,
      { isMember: true, traceId },
      next,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeMemberWithTracing(idMember: string, traceId: string, next: any) {
    return this.toggleMemberWithTracing(
      idMember,
      { isMember: false, traceId },
      next,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toggleMember(idMember: any, ...rest: any[]) {
    const adjustedLength = Math.max(rest.length, 1),
      next = rest[adjustedLength - 1];
    let [isMember] = Array.from(rest.slice(0, adjustedLength - 1));
    if (typeof isMember === 'undefined' || isMember === null) {
      isMember = !this.hasMember(idMember);
    }
    const isMe = Auth.isMe(idMember);

    if (isMember && isMe) {
      this.set('subscribed', true);
    }

    this.recordAction({
      type: isMe
        ? isMember
          ? 'join'
          : 'leave'
        : isMember
          ? 'add-member'
          : 'remove-member',

      idMember,
    });

    // @ts-expect-error
    return this.toggle('idMembers', idMember, isMember, next);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addMember(idMember: any, next: any) {
    return this.toggleMember(idMember, true, next);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeMember(idMember: any, next: any) {
    return this.toggleMember(idMember, false, next);
  }

  hasMember(idMember: string) {
    return !!this.memberList.get(idMember);
  }

  getIdCardMems() {
    return _.map(this.memberList.models, (member) => member.id);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hasChecklist(idChecklist: any) {
    return this.checklistList.get(idChecklist);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  close(traceId: string, next: (err: any, card: any) => void) {
    this.recordAction({ type: 'archive' });
    this.update({ closed: true, traceId }, next);
  }

  reopen(traceId: string, next: () => void) {
    const list = this.getList();

    if (list != null) {
      this.recordAction({ type: 'unarchive' });
      this.update(
        {
          closed: false,
          traceId,
        },
        next,
      );
    }
  }

  getBoard(): Board {
    let left;
    if (this.modelCache == null) {
      // Not sure when a card loses its reference to the model cache, but since
      // this is the old architecture, it's not worth it to look too hard into
      // it. Since there's only one ModelCache in the entire app, we can just
      // require it again.
      //
      // @ts-expect-error
      this.modelCache = ModelCache;
    }

    return (left = ModelCache.get('Board', this.get('idBoard'))) != null
      ? left
      : this.getList()?.getBoard();
  }

  getIndexInList(): number {
    const list = this.getList();
    // It's possible that the list won't exist if we've only ever loaded the
    // card model
    if (list != null) {
      return _.indexOf(list.cardList.models, this);
    } else {
      return -1;
    }
  }

  getList(): List {
    let left;
    return (left = ModelCache.get('List', this.get('idList'))) != null
      ? left
      : this.collection != null
        ? this.collection.owner
        : // @ts-expect-error Type 'undefined' is not assignable to type 'List'.ts(2322)
          undefined;
  }

  getUrl(): string | null {
    return getCardUrl(this);
  }

  getFullUrl(): string {
    const cardRole = this.getCardRole();

    if (cardRole === 'link') {
      return this.get('name');
    }

    return `${siteDomain}${this.getUrl()}`;
  }

  getCardRole(): 'board' | 'link' | 'separator' | null {
    const cardRole = this.get('cardRole');

    if (cardRole === 'mirror') {
      return null;
    }

    return cardRole;
  }

  getStartDate(): Date | null {
    const badges = this.get('badges');
    // @ts-expect-error
    return badges?.start ? new Date(badges.start) : null;
  }

  getDueDate(): Date | null {
    const badges = this.get('badges');
    // @ts-expect-error
    return badges?.due ? new Date(badges.due) : null;
  }

  setDueDate(dueDate: Date, next: () => void): void {
    // @ts-expect-error
    this.update(dueDate, next);
  }

  editable(): boolean {
    return this.getBoard()?.editable();
  }

  isObserver(): boolean {
    const me = Auth.me();
    return this.getBoard()?.isObserver(me);
  }

  isOnBoardTemplate(): boolean {
    return this.getBoard()?.isTemplate();
  }

  canAttach(): boolean {
    return (
      this.editable() &&
      !isOverLimit('attachments', 'perCard', this.get('limits')) &&
      !isOverLimit('attachments', 'perBoard', this.getBoard()?.get('limits'))
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attachmentTypeRestricted(attachmentType: any) {
    return this.getBoard()?.attachmentTypeRestricted(attachmentType);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attachmentUrlRestricted(url: any) {
    return this.getBoard()?.attachmentUrlRestricted(url);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  canDropAttachment(eventType: any) {
    return (
      (eventType === 'dd-enter:files' &&
        !this.attachmentTypeRestricted('computer')) ||
      (eventType === 'dd-enter:url' && !this.attachmentTypeRestricted('link'))
    );
  }

  // we always want this to be "the latest comment",
  // but we have to deal with our clock being out of
  // sync with the server, and our "now" actually
  // being "before" an existing comment.
  dateForNewComment() {
    if (this.actionList.length === 0) {
      return new Date();
    } else {
      const latestAction = this.actionList.sort().first();
      const afterLatest = addSeconds(latestAction.getDate(), 1);
      return _.max([new Date(), afterLatest]);
    }
  }

  addComment(
    comment: string,
    traceId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tracingCallback: any,
  ) {
    const card = this;

    if (comment !== '') {
      return new Bluebird((resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return this.waitForId(card, (idCard: any) => {
          const board = card.getBoard();
          const actionPlaceholder = new Action(
            {
              type: 'commentCard',
              // @ts-expect-error
              date: this.dateForNewComment(),
              data: {
                text: comment,
                card: {
                  id: card.id,
                  // @ts-expect-error
                  name: card.get('name'),
                },
                // @ts-expect-error
                board: {
                  id: board.id,
                  name: board.get('name'),
                },
                // @ts-expect-error
                textData: {
                  emoji: Auth.me().allCustomEmoji(),
                },
              },
              idMemberCreator: Auth.myId(),
              display: {
                translationKey: 'action_comment_on_card',
                entities: {
                  card: {
                    hideIfContext: true,
                    id: card.id,
                    isContext: false,
                    // @ts-expect-error TS(2339): Property 'shortLink' does not exist on type 'Card'... Remove this comment to see the full error message
                    shortLink: card.shortLink,
                    text: comment,
                    type: 'card',
                  },
                  comment: {
                    text: comment,
                    type: 'comment',
                  },
                  contextOn: {
                    hideIfContext: true,
                    idContext: card.id,
                    translationKey: 'action_on',
                    type: 'translatable',
                  },
                  memberCreator: {
                    id: Auth.myId(),
                    // @ts-expect-error
                    isContext: false,
                    text: Auth.me().get('fullName'),
                    type: 'member',
                    username: { text: Auth.me().get('fullName') },
                  },
                },
              },
            },
            { modelCache: this.modelCache },
          );

          const timeout = this.setTimeout(
            () => actionPlaceholder.takingTooLong(),
            2000,
          );

          const url = `/1/cards/${card.id}/actions/comments`;

          return ApiAjax({
            url,
            type: 'post',
            data: {
              text: comment,
            },
            dataType: 'json',
            traceId,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            error: (xhr: any) => {
              clearTimeout(timeout);
              const errorMessage = parseXHRError(xhr);
              // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
              const error = getApiError(xhr.status, errorMessage);
              sendNetworkErrorEvent({
                status: xhr.status,
                response: error.toString(),
                url,
              });
              tracingCallback(error);
              return reject(xhr);
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            success: (resp: any) => {
              resolve(actionPlaceholder);
              tracingCallback(null, resp);
              clearTimeout(timeout);
              // @ts-expect-error TS(2551): Property 'isTakingTooLong' does not exist on type ... Remove this comment to see the full error message
              actionPlaceholder.isTakingTooLong = false;
              return ModelCache.enqueueDelta(actionPlaceholder, resp);
            },
          });
        });
      });
    }

    return Bluebird.resolve();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changeDueDateMaintainTime(targetDate: Date, traceId: string, next: any) {
    const left = this.get('due');
    let oldDateData: Date;
    if (left != null) {
      oldDateData = new Date(left);
    } else {
      oldDateData = new Date();
      oldDateData.setHours(12, 0, 0, 0);
    }
    const newDate = Dates.getDateWithSpecificTime(oldDateData, targetDate);
    return this.setDueDate(
      {
        // @ts-expect-error
        due: newDate.getTime(),
        dueReminder: this.get('dueReminder') || -1,
        traceId,
      },
      next,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  waitForLock(name: any, next: any) {
    const fxReleaseLock = ((_this) => () => {
      let fx;
      if (_.isEmpty(_this._lockQueue[name])) {
        return delete _this._lockQueue[name];
      } else {
        fx = _this._lockQueue[name].shift();
        return fx(fxReleaseLock);
      }
    })(this);
    if (this._lockQueue[name] != null) {
      return this._lockQueue[name].push(next);
    } else {
      this._lockQueue[name] = [];
      return next(fxReleaseLock);
    }
  }

  vote(voteVal: boolean) {
    if (!this.getBoard().canVote(Auth.me())) {
      return;
    }

    // We have to do this locking business so we don't get the client state out of sync with the server
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.waitForLock('vote', (next: any) => {
      let left;
      if (voteVal === this.voted()) {
        return next();
      }

      const traceId = Analytics.startTask({
        taskName: 'edit-card/membersVoted',
        source: getScreenFromUrl(),
      });

      // Unfortunately we have to mess with the badges to make sure
      // the vote takes effect immediately on the client side
      const badges = (left = _.clone(this.get('badges'))) != null ? left : {};

      if (voteVal) {
        // @ts-expect-error
        badges.votes++;
        badges.viewingMemberVoted = true;
      } else {
        // @ts-expect-error
        badges.votes--;
        badges.viewingMemberVoted = false;
      }
      this.set('badges', badges);

      this.toggle(
        'idMembersVoted',
        Auth.myId(),
        voteVal,
        { collectionName: 'membersVoted', traceId },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error: any, result: any) => {
          if (error) {
            next(error, result);
            Analytics.taskFailed({
              taskName: 'edit-card/membersVoted',
              source: getScreenFromUrl(),
              traceId,
              error,
            });
          } else {
            next(error, result);
            Analytics.taskSucceeded({
              taskName: 'edit-card/membersVoted',
              source: getScreenFromUrl(),
              traceId,
            });
          }
        },
      );
    });
  }

  voted(): boolean {
    let left;
    return (left = this.get('badges')?.viewingMemberVoted) != null
      ? left
      : false;
  }

  hasStickers() {
    return this.stickerList.length > 0;
  }

  hasCover() {
    const cover = this.get('cover');
    if (cover == null) {
      return false;
    }

    const {
      color,
      idAttachment,
      idUploadedBackground,
      idPlugin,
      // @ts-expect-error
      scaled,
    } = cover;
    return (
      color != null ||
      ((idAttachment != null ||
        idUploadedBackground != null ||
        idPlugin != null) &&
        scaled != null)
    );
  }

  hasAttachmentCover() {
    return (
      this.get('idAttachmentCover') != null ||
      this.get('cover')?.idAttachment != null
    );
  }

  getAllAgingClasses() {
    return 'aging-level-0 aging-level-1 aging-level-2 aging-level-3 aging-pirate aging-regular';
  }

  getAgingData() {
    const board = this.getBoard();
    // @ts-expect-error TS(2363): The right-hand side of an arithmetic operation mus... Remove this comment to see the full error message
    const timeInactive = Date.now() - new Date(this.get('dateLastActivity'));

    const data = {
      level: (() => {
        switch (false) {
          case !(timeInactive < Util.getMs({ days: 7 })):
            return 0;
          case !(timeInactive < Util.getMs({ days: 14 })):
            return 1;
          case !(timeInactive < Util.getMs({ days: 28 })):
            return 2;
          default:
            return 3;
        }
      })(),
      mode: board.get('prefs').cardAging,
    };

    // @ts-expect-error TS(2339): Property 'agingClassesToAdd' does not exist on typ... Remove this comment to see the full error message
    data.agingClassesToAdd = `aging-level-${data.level} aging-${data.mode}`;
    if (/64$/.test(this.id)) {
      // @ts-expect-error TS(2339): Property 'agingClassesToAdd' does not exist on typ... Remove this comment to see the full error message
      data.agingClassesToAdd += ' aging-treasure';
    }

    return data;
  }

  toggleVote() {
    this.vote(!this.voted());
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribe(subscribed: any, next: any) {
    if (subscribed === this.get('subscribed')) {
      return;
    }

    const badges = this.get('badges') || {};
    badges.subscribed = subscribed;

    this.update({ subscribed }, next);
  }

  subscribeWithTracing(
    subscribed: boolean,
    traceId: string,
    next: (
      err: Error | null,
      result: {
        id: string;
        idList: string;
        idBoard: string;
      },
    ) => void,
  ) {
    if (subscribed === this.get('subscribed')) {
      return;
    }

    const badges = this.get('badges') || {};
    badges.subscribed = subscribed;

    this.update({ subscribed, traceId }, next);
  }

  isSubscribed() {
    return _.some([
      this.get('subscribed'),
      this.get('badges')?.subscribed,
      // @ts-expect-error
      this.getBoard()?.get('subscribed'),
      this.getList()?.get('subscribed'),
    ]);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCheckItem(idCheckItem: any) {
    for (
      let i = 0, end = this.checklistList.length - 1, asc = 0 <= end;
      asc ? i <= end : i >= end;
      asc ? i++ : i--
    ) {
      const checklist = this.checklistList.at(i);
      const checkItem = (
        checklist != null
          ? // @ts-expect-error
            checklist.checkItemList
          : undefined
      )?.get(idCheckItem);
      if (checkItem) {
        return checkItem;
      }
    }

    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toJSON(opts?: any) {
    if (opts == null) {
      opts = {};
    }
    // @ts-expect-error
    const data = super.toJSON(...arguments);

    if (opts.url) {
      // @ts-expect-error
      data.url = getCardUrl(this);
    }

    return data;
  }

  upload(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    file: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    name: any,
    { traceId = null, numOfFiles = 1, fileIdx = 0 },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    next: any,
  ) {
    let idOrganization;
    const fd = new FormData();

    const { dsc } = getCsrfRequestPayload();
    fd.append('dsc', dsc);
    fd.append('numOfFiles', numOfFiles.toString());
    fd.append('fileIdx', fileIdx.toString());
    if (name != null) {
      fd.append('file', file, name);
    } else {
      // Firefox 22 will call the file "undefined" if you have an undefined
      // value as the 3rd parameter
      fd.append('file', file);
    }

    const url = `/1/cards/${this.id}/attachments`;

    ApiAjax({
      traceId,
      url,
      data: fd,
      type: 'post',
      processData: false,
      contentType: false,
      retry: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: (xhr: any, textStatus: any, error: any, fxDefault: any) => {
        const { status, responseJSON } = xhr;
        if (
          this._isTooManyAttachments(
            status,
            responseJSON != null ? responseJSON.error : undefined,
          )
        ) {
          return next(LimitExceeded());
        } else if (
          this._isAttachmentTypeRestricted(
            status,
            responseJSON != null ? responseJSON.error : undefined,
          )
        ) {
          return next(TypeRestricted());
        } else if ([0, 413].includes(status)) {
          const errorMessage = parseXHRError(xhr);
          // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
          const apiError = getApiError(status, errorMessage);
          sendNetworkErrorEvent({
            status,
            response: apiError.toString(),
            url,
          });
          return next(apiError);
        } else {
          // Default is to retry
          return fxDefault();
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      success: (attachment: any) => {
        let left;
        this.set('attachments', [
          attachment,
          // @ts-expect-error
          ...Array.from((left = this.get('attachments')) != null ? left : []),
        ]);

        return next(null, attachment);
      },
      timeout: Util.getMs({ hours: 6 }),
    }); // Gold lets you upload 250MB attachments

    if ((idOrganization = this.getBoard()?.get('idOrganization')) != null) {
      if ((file != null ? file.size : undefined) >= 10 * 1024 * 1024) {
        return Analytics.sendTrackEvent({
          action: 'uploaded',
          actionSubject: 'attachment',
          containers: {
            card: {
              id: this.id,
            },
            list: {
              id: this.get('idList'),
            },
            board: {
              id: this.get('idBoard'),
            },
            organization: {
              id: idOrganization,
            },
          },
          source: 'boardScreen',
          attributes: {
            isBCFeature: true,
            requiredBC: true,
          },
        });
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  uploadUrl(data: any, next: any) {
    if (next == null) {
      next = function () {};
    }
    if (_.isString(data)) {
      data = { url: data };
    }

    return ApiAjax({
      url: `/1/cards/${this.id}/attachments`,
      type: 'post',
      data,
      error: (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { status, responseJSON }: any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        textStatus: any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error: any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fxDefault: any,
      ) => {
        if (
          this._isTooManyAttachments(
            status,
            responseJSON != null ? responseJSON.error : undefined,
          )
        ) {
          return next(LimitExceeded());
        } else if (
          this._isAttachmentTypeRestricted(
            status,
            responseJSON != null ? responseJSON.error : undefined,
          )
        ) {
          return next(TypeRestricted());
        } else {
          return next(textStatus);
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      success: (attachment: any) => {
        let left;
        this.set('attachments', [
          attachment,
          // @ts-expect-error
          ...Array.from((left = this.get('attachments')) != null ? left : []),
        ]);
        return next(null, attachment);
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeCover(attachment: any, traceId: any, next: any) {
    return this.update({ idAttachmentCover: '', traceId }, next);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  makeCover(attachment: any, traceId: any, next: any) {
    return this.update({ idAttachmentCover: attachment.id, traceId }, next);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  calcChecklistPos(index: any, checklist: any) {
    return Util.calcPos(index, this.checklistList, checklist);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  calcAttachmentPos(index: any, attachment: any) {
    // if one `pos` is null, they all are!
    // TODO gerard remove this code after the server backfills attachment positions
    if (attachment.get('pos') === null) {
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-shadow */
      this.attachmentList.models.forEach(function (attachment: any, i: any) {
        const pos = (i + 1) * 16384;
        return attachment.update('pos', pos);
      });
    }

    // We need to do this since the server considers higher positions to be
    // more recent by default. Since we sort from most recent to least recent
    // by default, that means we're sorting from higher `pos` to lower `pos`.
    // Thus, our position calculation needs to be reversed
    const reversedIndex = this.attachmentList.length - index - 1;
    return Util.calcPos(reversedIndex, this.attachmentList, attachment);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _isTooManyAttachments(status: any, error: any) {
    return (
      status === 403 &&
      (error === 'CARD_TOO_MANY_ATTACHMENTS' ||
        error === 'BOARD_TOO_MANY_ATTACHMENTS')
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _isAttachmentTypeRestricted(status: any, error: any) {
    return status === 403 && error === 'CARD_ATTACHMENT_TYPE_RESTRICTED';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _neighbor(delta: any) {
    const cards = this.getList().openCards();
    const { filter } = this.getBoard();
    let cardIndex = cards.indexOf(this);
    if (cardIndex >= 0) {
      cardIndex += delta;
      while (
        cards.at(cardIndex) != null &&
        !filter.satisfiesFilter(cards.at(cardIndex))
      ) {
        cardIndex += delta;
      }

      return cards.at(cardIndex);
    } else {
      return null;
    }
  }

  prevCard() {
    return this._neighbor(-1);
  }

  nextCard() {
    return this._neighbor(1);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  copyTo({ name, idList, pos, keepFromSource, traceId }: any) {
    if (name == null) {
      name = this.get('name');
    }

    return List.load(idList, Payloads.listMinimal, this.modelCache).then(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (list: any) => {
        return ninvoke(
          list.cardList,
          'createWithTracing',
          { name, pos },
          {
            traceId,
            createData: {
              idCardSource: this.id,
              keepFromSource,
            },
          },
        );
      },
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setPluginData(idPlugin: any, visibility: any, data: any) {
    return this.pluginDataList.upsert(idPlugin, visibility, data);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setPluginDataByKey(idPlugin: any, visibility: any, key: any, val: any) {
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
    return this.pluginDataList.snoopDataForPlugin(idPlugin);
  }

  getAgeMs() {
    if (this.id) {
      // @ts-expect-error TS(2363): The right-hand side of an arithmetic operation mus... Remove this comment to see the full error message
      return Date.now() - new Date(Util.idToDate(this.id));
    } else {
      return 0;
    }
  }

  getIdMemberCreator() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createAction = this.actionList.find(function (action: any) {
      let needle;
      return (
        (needle = action.get('type')),
        ['createCard', 'copyCard'].includes(needle)
      );
    });

    return createAction != null
      ? createAction.get('idMemberCreator')
      : undefined;
  }

  getDates() {
    if (!this.getBoard().isCustomFieldsEnabled()) {
      return [];
    }
    return this.customFieldItemList.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (cfi: any) =>
        cfi.getCustomField()?.get('type') === 'date' && !cfi.isEmpty(),
    );
  }

  shouldSuggestDescription() {
    // Determine if the user probably wants to edit the description of the card
    // We guess they'd want that if it's a card that they created recently and
    // there isn't any discussion on it yet
    const memberId = Auth.myId();

    return (
      !this.get('desc') &&
      this.editable() &&
      this.getAgeMs() < Util.getMs({ minutes: 5 }) &&
      // @ts-expect-error
      !(this.get('badges')?.comments > 0) &&
      (this.actionList.length === 0 || this.getIdMemberCreator() === memberId)
    );
  }

  isVisible() {
    return this.isOpen() && this.getList()?.isOpen();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCustomFieldItem(idCustomField: any) {
    return this.customFieldItemList.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (cfi: any) => cfi.get('idCustomField') === idCustomField,
    );
  }

  recordAction(action: HistoryAction) {
    ActionHistory.append(action, this.actionContext());
  }

  actionContext(): HistoryContext {
    return {
      idCard: this.get('id'),
      idList: this.get('idList'),
      idBoard: this.get('idBoard'),
      idLabels: this.get('idLabels'),
      idMembers: this.get('idMembers'),
    };
  }

  markAssociatedNotificationsRead() {
    if (!Auth.isLoggedIn()) {
      return;
    }
    return ApiAjax({
      url: `${this.urlRoot}/${this.id}/markAssociatedNotificationsRead`,
      type: 'post',
      background: true,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isValidSuggestion(suggestion: any) {
    let allLabels, label, targetList, otherMember, checklist;
    if (MemberState.get('showSuggestions') === false) {
      return false;
    }

    if (!Auth.isLoggedIn()) {
      return false;
    }

    const board = this.getBoard();
    const me = Auth.me();

    if (!board.hasActiveMembership(me)) {
      return false;
    }

    switch (suggestion.type) {
      case 'join':
        return !this.hasMember(me.id) && board.memberList.length > 1;

      case 'add-label':
        allLabels = board.labelList;
        label = allLabels.get(suggestion.idLabel);
        return label && !this.hasLabel(label);

      case 'move':
        targetList = board.listList.get(suggestion.idList);
        return (
          targetList != null &&
          !targetList.get('closed') &&
          suggestion.idList !== this.get('idList')
        );

      case 'add-member':
        otherMember = ModelCache.get('Member', suggestion.idMember);
        return (
          otherMember != null &&
          !this.hasMember(otherMember.id) &&
          board.hasActiveMembership(otherMember)
        );

      case 'add-checklist':
        checklist = ModelCache.get('Checklist', suggestion.idChecklistSource);
        return (
          checklist != null &&
          // @ts-expect-error
          checklist.get('idBoard') === this.get('idBoard') &&
          !this.checklistList.any(
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-shadow */
            (checklist: any) => checklist.get('name') === suggestion.name,
          )
        );

      default:
        return false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deleteWithTracing(traceId: any, next: any) {
    this.recordAction({ type: 'delete' });
    this.destroyWithTracing({ traceId }, next);
  }

  delete() {
    this.recordAction({ type: 'delete' });
    this.destroy();
  }

  trackProperty() {
    return [
      `[Template:${this.get('isTemplate')}]`,
      `[Closed:${this.get('closed')}]`,
    ].join(' ');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeLocation(traceId: any, next: any) {
    // @ts-expect-error
    return this.update(
      {
        traceId,
        coordinates: null,
        locationName: null,
        address: null,
        staticMapUrl: null,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (err: any, response: any) => next(err, response),
    );
  }

  getAnalyticsContainers() {
    const board = this.getBoard();
    return {
      card: { id: this.id },
      list: { id: this.get('idList') },
      board: { id: this.get('idBoard') },
      organization: {
        id: board != null ? board.get('idOrganization') : undefined,
      },
      enterprise: {
        id: board != null ? board.get('idEnterprise') : undefined,
      },
    };
  }

  // LabelsHelper mapping
  getLabels(): Label[] {
    return LabelsHelper.getLabels.call(this);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataForLabel(label: any) {
    return LabelsHelper.dataForLabel.call(this, label);
  }
  toggleLabelColor(color: LabelColor) {
    return LabelsHelper.toggleLabelColor.call(this, color);
  }
  hasLabel(label: Label | LabelColor): boolean {
    return LabelsHelper.hasLabel.call(this, label);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toggleLabel(label: Label, toggleOn?: boolean, next?: any) {
    return LabelsHelper.toggleLabel.call(this, label, toggleOn, next);
  }
}

Card.initClass();

export { Card };
