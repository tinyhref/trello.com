/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import _ from 'underscore';

import { ModelCache } from 'app/scripts/db/ModelCache';
import { Util } from 'app/scripts/lib/util';
import type { Card } from 'app/scripts/models/Card';
import type { CheckItem } from 'app/scripts/models/CheckItem';
import type { TrelloModelAttributes } from 'app/scripts/models/internal/TrelloModel';
import { TrelloModel } from 'app/scripts/models/internal/TrelloModel';
import { ApiAjax } from 'app/scripts/network/ApiAjax';

interface ChecklistAttributes extends TrelloModelAttributes {
  typeName: 'Checklist';
  idCard: string;
  name: string;
}

class Checklist extends TrelloModel<ChecklistAttributes> {
  static initClass() {
    this.prototype.typeName = 'Checklist';

    this.lazy({
      checkItemList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          CheckItemList,
        } = require('app/scripts/models/collections/CheckItemList');
        return new CheckItemList().syncSubModels(this, 'checkItems');
      },
    });

    // @ts-expect-error
    this.prototype._debouncedRequestNewState = _.debounce(function (newState) {
      return ApiAjax({
        // @ts-expect-error
        url: `/1/checklist/${this.id}/checkItems/all`,
        type: 'put',
        retry: false,
        data: {
          state: newState,
        },
        success: () => {
          // @ts-expect-error
          return (this._originalCheckListState = null);
        },
        error: () => {
          // Reset the state if it goes wrong.
          // @ts-expect-error
          this.checkItemList.each((checkItem) => {
            return checkItem.set(
              'state',
              // @ts-expect-error
              this._originalCheckListState[checkItem.id],
            );
          });
          // @ts-expect-error
          return (this._originalCheckListState = null);
        },
      });
    }, 500);
  }
  urlRoot() {
    return '/1/checklists';
  }

  // @ts-expect-error
  sync(method, model, options) {
    if (
      method === 'create' &&
      // @ts-expect-error
      !(this.get('idBoard') != null && this.get('idCard') != null)
    ) {
      // @ts-expect-error
      this.waitForAttrs(this, ['idBoard', 'idCard'], (attrs) => {
        this.set(attrs);
        // @ts-expect-error
        Checklist.prototype.__proto__.sync.call(this, method, model, options);
      });

      // @ts-expect-error
      this.waitForId(this.getBoard(), (id) => this.set('idBoard', id));
      // @ts-expect-error
      return this.waitForId(this.getCard(), (id) => this.set('idCard', id));
    } else {
      return super.sync(...arguments);
    }
  }

  getCard(): Card {
    const card = ModelCache.get('Card', this.get('idCard'));
    // @ts-expect-error
    return card != null ? card : this.collection.sourceModel;
  }

  getBoard() {
    return this.getCard()?.getBoard();
  }

  getCheckItemCount() {
    // @ts-expect-error
    return this.checkItemList.length;
  }

  // @ts-expect-error
  getCompletedCount(card) {
    let count = 0;

    // @ts-expect-error
    this.checkItemList.each(function (checkItem) {
      if (checkItem.get('state') != null) {
        if (checkItem.get('state') === 'complete') {
          return count++;
        }
      }
    });

    return count;
  }

  getCheckItem(idCheckItem: string): CheckItem {
    // @ts-expect-error
    return this.checkItemList.get(idCheckItem);
  }

  editable() {
    return this.getBoard().editable();
  }

  // @ts-expect-error
  calcPos(index, checkItem) {
    // @ts-expect-error
    return Util.calcPos(index, this.checkItemList, checkItem);
  }

  // @ts-expect-error
  toggleCheckItemsState(newState) {
    // As the request is debounced if we got the 'original' state every function
    // call, by the time the request we actually made the original is lost, this
    // would mean the server state wouldn't reflect the local one if the request
    // fails, this is not a good user experience, so let's cache it on the first
    // request and clear it when debounced function has done it's thing
    // @ts-expect-error
    if (this._originalCheckListState == null) {
      // @ts-expect-error
      this._originalCheckListState = {};
    }
    // @ts-expect-error
    this.checkItemList.each((checkItem) => {
      // @ts-expect-error
      if (this._originalCheckListState[checkItem.id] == null) {
        // @ts-expect-error
        this._originalCheckListState[checkItem.id] = checkItem.get('state');
      }
      return checkItem.set('state', newState);
    });

    // @ts-expect-error
    return this._debouncedRequestNewState(newState);
  }
}
Checklist.initClass();

export { Checklist };
