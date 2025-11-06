/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import _ from 'underscore';

// eslint-disable-next-line no-restricted-imports
import $ from '@trello/jquery';

import { trelloClipboard } from 'app/scripts/lib/trello-clipboard';
import type { Card } from 'app/scripts/models/Card';
import { TrelloModel } from 'app/scripts/models/internal/TrelloModel';
import type { List } from 'app/scripts/models/List';

export interface BoardState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $el: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _selectedCard: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _selectedList: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  board: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listenTo: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stopListening: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trigger: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  waitForAttr: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  waitForId: any;
}

// TODO: This is a weird model that does not persist, and probably should
// not exist, at least not as an actual model.
// See https://trello.com/c/mvr7u2zf
// @ts-expect-error TS(2314): Generic type 'TrelloModel<T>' requires 1 type argu... Remove this comment to see the full error message
export class BoardState extends TrelloModel {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sync(method: any, model: any, options: any) {
    throw new Error('BoardState is a special weird non-persistent thing');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialize(data: any, options: any) {
    super.initialize(...arguments);
    ({ board: this.board } = options);

    return this.set('listComposerOpen', false);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectCard(card: any) {
    this._selectedList = null;
    if (card === this._selectedCard) {
      return;
    }

    if (this._selectedCard) {
      this.stopListening(this._selectedCard, 'change:closed');
    }

    this._selectedCard = card;

    if (this._selectedCard != null) {
      this.listenTo(this._selectedCard, 'change:closed', () => {
        return this.selectCardAfter(this._selectedCard);
      });

      this.waitForId(this._selectedCard, () => {
        // We may have created additional cards between the original selectCard
        // and now, so make sure we haven't selected something else
        if (this._selectedCard === card) {
          return trelloClipboard.set(card.getFullUrl());
        }
      });
    }

    this.trigger('active-card-changed');
  }

  selectList(list: List | null) {
    return (this._selectedList = list);
  }

  isCardSelected(card: Card) {
    return card != null && card === this._selectedCard;
  }

  clearSelectedCard() {
    return this.selectCard(null);
  }

  getCard() {
    return this._selectedCard;
  }

  getList() {
    const card = this.getCard();
    if (card != null) {
      return card.getList();
    } else {
      return this._selectedList;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectCardAfter(card: any) {
    const list = card.getList();
    const visibleCards =
      list != null
        ? /* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-shadow */
          list.cardList.filter((card: any) =>
            this.board.filter.satisfiesFilter(card),
          )
        : undefined;

    const nextCard = (() => {
      if (list == null || visibleCards.length === 0) {
        return null;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const comesAfter = (masterCard: any) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (otherCard: any) =>
            otherCard !== masterCard &&
            otherCard.get('pos') >= masterCard.get('pos');
        };

        return _.find(visibleCards, comesAfter(card));
      }
    })();

    return this.selectCard(nextCard != null ? nextCard : _.last(visibleCards));
  }

  openListComposer() {
    return this.set('listComposerOpen', true);
  }

  closeListComposer() {
    $('.js-open-add-list', this.$el).removeAttr('tabindex');
    return this.set('listComposerOpen', false);
  }
}
