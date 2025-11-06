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
// eslint-disable-next-line no-restricted-imports
import Bluebird from 'bluebird';
import _ from 'underscore';

import { ApiError } from '@trello/error-handling';
import { TrelloStorage } from '@trello/storage';

import { Auth } from 'app/scripts/db/Auth';
import { ModelLoader } from 'app/scripts/db/model-loader';
import { ApiPromise } from 'app/scripts/network/ApiPromise';

const AUTOJOIN_QUEUE_KEY = 'autoJoinQueue';
const ANY_MEMBER = 'any';

// Handle joining board/team invitation links after
// a user confirms their email address
class JoinOnConfirm {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _runOnce: any;
  getQueue() {
    let left;
    return (left = TrelloStorage.get(AUTOJOIN_QUEUE_KEY)) != null ? left : [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setQueue(queue: any) {
    return TrelloStorage.set(AUTOJOIN_QUEUE_KEY, queue);
  }

  clearQueue() {
    return TrelloStorage.unset(AUTOJOIN_QUEUE_KEY);
  }

  _idMember() {
    if (Auth.isLoggedIn()) {
      return Auth.myId();
    } else {
      return ANY_MEMBER;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _entryForUrl(apiUrl: any) {
    return {
      url: apiUrl,
      idMember: this._idMember(),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _matchesMember(id: any) {
    let needle;
    return (needle = id), [ANY_MEMBER, Auth.myId()].includes(needle);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  add(apiUrl: any) {
    const queue = this.getQueue();
    if (
      _.any(
        queue,
        (entry) => entry.url === apiUrl && this._matchesMember(entry.id),
      )
    ) {
      return;
    }

    return this.setQueue([...Array.from(queue), this._entryForUrl(apiUrl)]);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inQueue(apiUrl: any) {
    return _.any(this.getQueue(), (entry) => {
      return entry.url === apiUrl && this._matchesMember(entry.idMember);
    });
  }

  autoJoin() {
    const queue = this.getQueue();
    if (queue.length === 0 || !Auth.isLoggedIn()) {
      return Bluebird.resolve(false);
    }

    return this._runOnce != null
      ? this._runOnce
      : (this._runOnce = ModelLoader.await('headerData').then(() => {
          if (!Auth.me().get('confirmed')) {
            return false;
          }

          return Bluebird.map(queue, (entry) => {
            // @ts-expect-error TS(2339): Property 'url' does not exist on type 'unknown'.
            const { url, idMember } = entry;
            if (this._matchesMember(idMember)) {
              return ApiPromise({
                method: 'post',
                url,
              })
                .then(() => null)
                .catch(ApiError, () => null);
            } else {
              return entry;
            }
          }).then((remainingEntries) => {
            remainingEntries = _.compact(remainingEntries);

            if (remainingEntries.length === 0) {
              this.clearQueue();
            } else {
              this.setQueue(remainingEntries);
            }

            // Return true if we joined anything
            return remainingEntries.length < queue.length;
          });
        }));
  }
}

const joinOnConfirm = new JoinOnConfirm();
export { joinOnConfirm as JoinOnConfirm };
