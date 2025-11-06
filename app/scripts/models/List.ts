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
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import _ from 'underscore';

import { truncate } from '@trello/strings';

import { ModelCache } from 'app/scripts/db/ModelCache';
import { isOverLimit } from 'app/scripts/lib/limits';
import { Util } from 'app/scripts/lib/util';
import { containsUrl } from 'app/scripts/lib/util/url/contains-url';
import type { Board } from 'app/scripts/models/Board';
import type { Card } from 'app/scripts/models/Card';
import type { CardList } from 'app/scripts/models/collections/CardList';
import type { TrelloModelAttributes } from 'app/scripts/models/internal/TrelloModel';
import { TrelloModel } from 'app/scripts/models/internal/TrelloModel';
import { fileUploadOptions } from 'app/scripts/network/fileUploadOptions';
import type { ListColor } from 'app/src/components/ListColorPicker';

export interface ListAttributes extends TrelloModelAttributes {
  name: string;
  color?: ListColor;
  idBoard: string;
  closed: boolean;
  subscribed: boolean;
  pos: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  softLimit: any;
}
interface List extends TrelloModel<ListAttributes> {
  typename: 'List';
  urlRoot: '/1/lists';
  cardList: CardList;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  collection: any;
}

class List extends TrelloModel<ListAttributes> {
  static initClass() {
    this.prototype.typeName = 'List';
    this.prototype.urlRoot = '/1/lists';

    this.lazy({
      cardList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const { CardList } = require('app/scripts/models/collections/CardList');
        return new CardList(null, { list: this })
          .setOwner(this)
          .syncCache(this.modelCache, ['idList', 'closed'], (card: Card) => {
            return this.id && card.get('idList') === this.id && card.isOpen();
          });
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sync(method: any, model: any, options: any) {
    if (method === 'create' && this.get('idBoard') == null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.waitForAttrs(this, ['idBoard'], (attrs: any) => {
        this.set(attrs);
        // @ts-expect-error
        List.prototype.__proto__.sync.call(this, method, model, options);
      });

      // @ts-expect-error
      return this.waitForId(this.getBoard(), (id) => this.set('idBoard', id));
    } else {
      return super.sync(...arguments);
    }
  }

  subscribe(
    subscribed: boolean,
    next: () => void,
    { traceId }: { traceId?: string } = {},
  ) {
    if (subscribed === this.get('subscribed')) {
      return;
    }
    this.update({ subscribed, traceId }, next);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  move(index: any) {
    this.update({ pos: this.getBoard().calcPos(index, this) });
    this.collection.sort({ silent: true });
  }

  close(opts?: { traceId?: string }, next?: () => void) {
    // @ts-expect-error
    this.update({ closed: true, traceId: opts?.traceId ?? null }, next);
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

  reopen() {
    this.update({
      closed: false,
      pos: this.getBoard().calcPos(this.collection.length, this),
    });
  }

  onChange() {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  calcPos(index: any, card: any, includeCard?: any) {
    return Util.calcPos(index, this.cardList, card, null, includeCard);
  }

  bottomCardPos(): number {
    // The cards are sorted by pos, so the next pos is the one right after
    let lastCard;
    if ((lastCard = this.cardList.last()) != null) {
      // @ts-expect-error
      return lastCard.get('pos') + Util.spacing;
    } else {
      return Util.spacing;
    }
  }

  getBoard(): Board {
    let left;
    return (left = ModelCache.get('Board', this.get('idBoard'))) != null
      ? left
      : this.collection != null
        ? this.collection.owner
        : // @ts-expect-error Type 'undefined' is not assignable to type 'Board'.ts(2322)
          undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectCardInList(index: any): void {
    const selectCard = this.openCards().at(index);

    if (selectCard != null) {
      this.getBoard().viewState.selectCard(selectCard);
    }
  }

  selectFirstCardInList(): void {
    return this.selectCardInList(0);
  }

  editable() {
    return this.getBoard().editable();
  }

  isTemplate(): boolean {
    return this.getBoard().isTemplate();
  }

  getIndexInList(): number {
    return _.indexOf(this.getBoard().listList.models, this);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hasCapacity(item: any) {
    const list =
      typeof item.getList === 'function' ? item.getList() : undefined;
    if (list != null) {
      return (
        !isOverLimit('cards', 'openPerList', list.get('limits')) &&
        !isOverLimit('cards', 'totalPerList', list.get('limits')) &&
        (typeof item.getBoard === 'function'
          ? item.getBoard().hasCapacity(item)
          : undefined)
      );
    }
    return false;
  }

  openCards() {
    return this.cardList;
  }

  uploadUrl(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    url: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cardData: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    placeholderText: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    traceId: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    next: any,
  ) {
    // Because we have no idea what to call the card that we're creating, but
    // there's a good chance that the server will be able to get a name based
    // on what's at the URL, we're going to have the local card model called
    // something like "Loading from imdb.com…" and then get a better name back
    // from the server
    //
    // We have to specify the local attributes separately from what we send to
    // the server, so we can have a temporary name for the card without sending
    // it to the server
    if (next == null) {
      next = function () {};
    }

    return this.cardList.createWithTracing(
      {
        name: placeholderText,
        pos: this.bottomCardPos(),
        ...cardData,
      },
      {
        traceId,
        // @ts-expect-error
        createData: {
          urlSource: url,
          // explicitly include the name here, even if it's undefined, so we
          // override whatever is being used as a placeholder
          name: cardData != null ? cardData.name : undefined,
        },
      },
      next,
    );
  }

  // Given some arbitrary text, convert it to a name (and possible description)
  _processText(text: string) {
    // Get an appropriate name/description for an arbitrary blob of text
    let desc, name;
    if (/[\r\n]/.test(text)) {
      // If the text contains a newline, then use the first line as the name
      const matches = new RegExp(/^\s*([^\r\n]+)/).exec(text);
      // Protect against passing text that only contains newlines.
      const firstLine = matches?.[1] || '';

      name = truncate(firstLine, 256);
      desc = text;
    } else {
      name = truncate(text, 256);
      // If the name got clipped or contains a URL (which wouldn't be clickable)
      // then also put the text into the description
      if (name !== text || containsUrl(text)) {
        desc = text;
      } else {
        desc = '';
      }
    }

    return { name, desc };
  }

  uploadText(text: string, traceId: string, next: () => void) {
    if (next == null) {
      next = function () {};
    }
    // If uploaded text is empty or only contains newlines, we don't create a card.
    if (!text || !/[^\r\n]+/.test(text)) {
      return next();
    }

    const { name, desc } = this._processText(text);

    return this.cardList.createWithTracing(
      {
        name,
        desc,
        pos: this.bottomCardPos(),
      },
      { traceId },
      next,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  upload(file: any, name: any, traceId: any, next: any) {
    if (next == null) {
      next = function () {};
    }
    const localData = {
      name,
      idList: this.id,
      pos: this.bottomCardPos(),
    };

    const fileOptions = fileUploadOptions({
      ...localData,
      fileSource: [file, name],
    });

    const options = _.assign(fileOptions, { traceId });

    return this.cardList.createWithTracing(localData, options, next);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSoftLimit(softLimit: any) {
    this.update({ softLimit });
  }
}
List.initClass();

export { List };
