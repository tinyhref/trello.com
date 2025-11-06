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
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import _ from 'underscore';

// eslint-disable-next-line no-restricted-imports
import $ from '@trello/jquery';
import { TrelloStorage } from '@trello/storage';

import { TrelloModel } from 'app/scripts/models/internal/TrelloModel';

export interface LocalStorageModel {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _onRemoteStorageBound: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _onStorageLocalBound: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetch: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  id: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onStorage: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  save: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set: any;
}

// @ts-expect-error TS(2314): Generic type 'TrelloModel<T>' requires 1 type argu... Remove this comment to see the full error message
export class LocalStorageModel extends TrelloModel {
  constructor() {
    super(...arguments);
    this._onStorageLocalBound = this._onStorage.bind(this);
    TrelloStorage.listen(this._onStorageLocalBound);
  }

  destructor() {
    this.disableTabSync();
    return TrelloStorage.unlisten(this._onStorageLocalBound);
  }

  // call enableTabSync to update one tab when local storage is updated in another
  enableTabSync() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this._onRemoteStorageBound = (e: any) => this._onStorage(e.originalEvent);
    return $(window).on('storage', this._onRemoteStorageBound);
  }

  disableTabSync() {
    if (this._onRemoteStorageBound != null) {
      return $(window).off('storage', this._onRemoteStorageBound);
    }
  }

  default() {
    return {};
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _onStorage(storageData: any) {
    if (
      (storageData != null ? storageData.key : undefined) === this.id &&
      storageData.oldValue !== storageData.newValue
    ) {
      // We don't want to do a full fetch, because that will reset the keys
      // that aren't synced to localStorage
      this.set(this.syncedKeysFromLocalStorage());
      return typeof this.onStorage === 'function'
        ? this.onStorage(storageData)
        : undefined;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sync(method: any, model: any, options: any) {
    let json, defaultValues;
    const { success } = options;
    switch (method) {
      case 'create':
        /* jshint -W027 */
        throw Error('not implemented');
      case 'read':
        json = model.syncedKeysFromLocalStorage();
        _.defaults(json, this.default());
        return typeof success === 'function'
          ? success(model, json, options)
          : undefined;
      case 'update':
        json = model.toJSON();
        defaultValues = this.default();

        delete json.id;
        for (const key in json) {
          const value = json[key];
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          if (_.isEqual(value, defaultValues[key])) {
            delete json[key];
          }
        }

        if (_.isEmpty(json)) {
          TrelloStorage.unset(model.id);
        } else {
          TrelloStorage.set(model.id, json);
        }
        return typeof success === 'function'
          ? success(model, model.toJSON(), options)
          : undefined;
      case 'delete':
        TrelloStorage.unset(model.id);
        return typeof success === 'function'
          ? success(model, null, options)
          : undefined;
      default:
    }
  }

  syncedKeysFromLocalStorage() {
    let left;
    const json = {
      ...this.default(),
      ...((left = TrelloStorage.get(this.id)) != null ? left : {}),
    };
    return _.pick(json, this.syncedKeys);
  }

  syncedKeys() {
    return true;
  }

  toJSON() {
    return _.pick(this.attributes, this.syncedKeys);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _persistUpdate(params: any, next: any) {
    TrelloStorage.set(this.id, {
      ...(TrelloStorage.get(this.id) ?? this.default()),
      ...params,
    });
    return typeof next === 'function' ? next(null, this.toJSON()) : undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toggle(attr: any, value: any) {
    if (this.inSet(attr, value)) {
      this.pull(attr, value);
      return false;
    } else {
      this.addToSet(attr, value);
      return true;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inSet(attr: any, value: any) {
    let left, needle;
    return (
      (needle = value),
      Array.from((left = this.get(attr)) != null ? left : []).includes(needle)
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addToSet(attr: any, value: any) {
    let left;
    return this.save(
      attr,
      ((left = this.get(attr)) != null ? left : []).concat(value),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pull(attr: any, value: any) {
    let left;
    return this.save(
      attr,
      _.without((left = this.get(attr)) != null ? left : [], value),
    );
  }
}
