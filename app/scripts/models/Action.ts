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
 * DS204: Change includes calls to have a more natural evaluation order
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import type { PIIString } from '@trello/privacy';

import { Auth } from 'app/scripts/db/Auth';
import { ModelCache } from 'app/scripts/db/ModelCache';
// eslint-disable-next-line no-restricted-imports -- legacy code
import { Dates } from 'app/scripts/lib/dates';
import type { ViewLimit } from 'app/scripts/lib/limits';
import { isOverLimit } from 'app/scripts/lib/limits';
import type { Attachment } from 'app/scripts/models/Attachment';
import type { Board } from 'app/scripts/models/Board';
import type { Card } from 'app/scripts/models/Card';
import { ReactionList } from 'app/scripts/models/collections/ReactionList';
import type { TrelloModelAttributes } from 'app/scripts/models/internal/TrelloModel';
import { TrelloModel } from 'app/scripts/models/internal/TrelloModel';
import type { List } from 'app/scripts/models/List';
import type { Member } from 'app/scripts/models/Member';
import { getAppCreatorModelForApplication } from 'app/src/components/NotificationsMenu/getAppCreatorModelForApplication';
import type { Checklist } from './Checklist';

interface ActionData {
  attachment?: Attachment;
  card: Card;
  board?: Board;
  list?: List;
  textData: string;
  text: string;
  entities: {
    memberCreator: {
      id?: string;
      translationKey: string;
      type: 'member' | 'text';
    };
    comment: {
      text: string;
      type: 'comment';
    };
    member?: {
      type: 'member' | 'text';
      id: string;
      text: PIIString | string;
    };
  };
  dateLastEdited: string;
}

export interface ActionAttributes extends TrelloModelAttributes {
  display: ActionData;
  data: ActionData;
  date: string;
  type: string;
  idMemberCreator: string;
  limits: ViewLimit;
}

class Action extends TrelloModel<ActionAttributes> {
  static initClass() {
    this.prototype.typeName = 'Action';
    // @ts-expect-error
    this.prototype.urlRoot = '/1/actions';
  }

  initialize() {
    // @ts-expect-error
    return (this.reactionList = new ReactionList([]).syncCache(
      ModelCache,
      [],
      // @ts-expect-error
      (reaction) => {
        return reaction.get('idModel') === this.id;
      },
    ));
  }

  getModel() {
    // @ts-expect-error
    return this.collection.options.model;
  }

  // @ts-expect-error
  triggerCacheEvents(modelCache, event) {
    for (const idModel of Array.from(this.idModels())) {
      modelCache.trigger(`${event}:${this.typeName}:${idModel}`);
    }
  }

  isCommentLike() {
    let needle;
    return (
      (needle = this.get('type')),
      ['commentCard', 'copyCommentCard'].includes(needle)
    );
  }

  isAddAttachment() {
    return this.get('type') === 'addAttachmentToCard';
  }

  isMember(member: Member) {
    return this.get('idMemberCreator') === member.id;
  }

  getDate() {
    return Dates.parse(this.get('date'));
  }

  getBoard(): Board {
    // @ts-expect-error
    return ModelCache.get('Board', this.get('data')?.board?.id);
  }

  getCard(): Card {
    // @ts-expect-error
    return ModelCache.get('Card', this.get('data')?.card?.id);
  }

  getChecklist(): Checklist {
    // @ts-expect-error
    return ModelCache.get(
      'Checklist',
      // @ts-expect-error
      this.get('data')?.checklist?.id,
    );
  }

  getAppCreator() {
    // @ts-expect-error
    const appCreator = this.get('appCreator');
    // @ts-expect-error
    if (appCreator?.id && appCreator?.name) {
      return {
        // @ts-expect-error
        id: appCreator.id,
        // @ts-expect-error
        name: appCreator.name,
        // @ts-expect-error
        ...(getAppCreatorModelForApplication(appCreator.id) || {}),
      };
      // @ts-expect-error
    } else if (this.get('data')?.creationMethod === 'ai') {
      return {
        name: 'Atlassian Intelligence',
      };
    }
  }

  editable() {
    // We can edit an action if it's a comment and it belongs to us
    let needle;
    const idMemberCreator = this.get('idMemberCreator');

    return (
      ((needle = this.get('type')), ['commentCard'].includes(needle)) &&
      Auth.isMe(idMemberCreator)
    );
  }

  deletable() {
    let board, needle;
    const idMemberCreator = this.get('idMemberCreator');

    // We can delete an action if ...

    // - It's a comment
    return (
      ((needle = this.get('type')), ['commentCard'].includes(needle)) &&
      // - It belongs to us
      (Auth.isMe(idMemberCreator) ||
        // - It's associated with a board
        ((board = this.getBoard()) != null &&
          // - We have a higher permission level than the person who created it
          board.compareMemberType(
            Auth.me(),
            ModelCache.get('Member', idMemberCreator),
            { mode: 'commentDelete' },
          ) > 0 &&
          // - We aren't trying to delete a premium organization admin's comment
          !(
            !board.isPremOrgAdmin(Auth.me()) &&
            board.isPremOrgAdmin(idMemberCreator)
          )))
    );
  }

  isPlaceholder() {
    return this.get('date') == null;
  }

  // @ts-expect-error
  includesModel(model) {
    const modelType = model.typeName.toLowerCase();
    const idModel = model.id;

    // Models that have been created locally but haven't been returned from
    // the server won't have an id yet
    if (!idModel) {
      return false;
    }

    if (modelType === 'member' && this.get('idMemberCreator') === idModel) {
      return true;
    }

    const data = this.get('data');

    // Although this isn't expressed in the API, the idModels array for these
    // actions in the DB contains both the source and destination card, which
    // means that they're returned via the API response, which means that if
    // you *don't* have this check the action paging count gets all screwy.
    if (
      this.get('type') === 'convertToCardFromCheckItem' &&
      // @ts-expect-error
      data.cardSource.id === idModel
    ) {
      return true;
    }

    return (
      // @ts-expect-error
      (data[modelType] != null ? data[modelType].id : undefined) === idModel
    );
  }

  idModels() {
    const idModels = (() => {
      let left;
      const result = [];
      const object = (left = this.get('data')) != null ? left : {};
      for (const key in object) {
        // @ts-expect-error
        const value = object[key];
        if ((value != null ? value.id : undefined) != null) {
          result.push(value.id);
        }
      }
      return result;
    })();
    const idMemberCreator = this.get('idMemberCreator');
    if (idMemberCreator != null) {
      idModels.push(idMemberCreator);
    }
    return idModels;
  }

  takingTooLong() {
    // @ts-expect-error
    this.isTakingTooLong = true;
    return this.trigger('takingTooLong');
  }

  // We are assuming here that if you can comment
  // you should also be able to react to something
  canReact() {
    const me = Auth.me();
    return this.getBoard()?.canComment(me);
  }

  isOverUniqueReactionsCapacity() {
    return isOverLimit('reactions', 'uniquePerAction', this.get('limits'));
  }

  isOverTotalReactionsCapacity() {
    return isOverLimit('reactions', 'perAction', this.get('limits'));
  }
}
Action.initClass();

export { Action };
