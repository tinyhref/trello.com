/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

// eslint-disable-next-line no-restricted-imports
import Bluebird from 'bluebird';
import Hearsay from 'hearsay';
import _ from 'underscore';

// eslint-disable-next-line no-restricted-imports
import $ from '@trello/jquery';
import { GlobalThemeObserver } from '@trello/theme';

import { pluginsChangedSignal } from 'app/scripts/views/internal/plugins/PluginsChangedSignal';
import type { ViewOptions } from 'app/scripts/views/internal/View';
import { View } from 'app/scripts/views/internal/View';

interface PluginView {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _eventListeners: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _pendingPromises: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _retained: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: any;
  globalThemeObserver: GlobalThemeObserver;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleIFrameMessage: any;
}

export const TRELLO_THEME_CHANGE_EVENT = 'TRELLO-THEME-CHANGE';

class PluginView extends View implements PluginView {
  static initClass() {
    this.prototype.handleIFrameMessage = null;
  }

  constructor(options?: ViewOptions) {
    super(...arguments);
    this._retained = this._retained || [];
    this._pendingPromises = this._pendingPromises || [];
    this._eventListeners = this._eventListeners || [];

    this.globalThemeObserver = new GlobalThemeObserver(
      ({ effectiveColorMode }) => {
        const iframes = this.$el.find(
          'iframe.plugin-iframe',
        ) as JQuery<HTMLIFrameElement>;

        _.each(iframes, (iframe) => {
          iframe.contentWindow?.postMessage(
            {
              type: TRELLO_THEME_CHANGE_EVENT,
              theme: effectiveColorMode,
            },
            '*',
          );
        });
      },
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _retainCallback(callback: any) {
    this._retained = this._retained || [];
    if (callback != null && this._retained != null) {
      callback.retain().catch(
        (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          err: any, // this can fail for a lot of legitimate reasons due to the async nature
        ) =>
          // of Power-Ups so just print a warning
          console?.warn(err.message),
      );
      this._retained.push(callback);
    }
    return callback;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  retain(obj: any) {
    if (_.isFunction(obj)) {
      this._retainCallback(obj);
    } else if (_.isArray(obj)) {
      obj.forEach((item) => {
        return this.retain(item);
      });
    } else if (_.isObject(obj)) {
      this.retain(_.values(obj));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cancelOnRemove(promise: any) {
    this._pendingPromises = this._pendingPromises || [];
    promise.cancellable();

    if (this._pendingPromises != null) {
      // You have to set the catch for CancellationError *before* adding this
      // promise to @_pendingPromises, or else when you cancel it in `remove`
      // the exception bubbles up to a parent promise (_promise0) and still
      // shows in the console and in our logs (I didn't figure out why that is,
      // looked like a bug in Bluebird).
      promise
        .then(() => {
          return (this._pendingPromises = _.without(
            this._pendingPromises,
            promise,
          ));
        })
        .catch(Bluebird.CancellationError, function () {});
      this._pendingPromises.push(promise);
    } else {
      promise.catch(Bluebird.CancellationError, function () {}).cancel();
    }
    return promise;
  }

  remove(...args: unknown[]) {
    super.remove(...arguments);
    this._retained = this._retained || [];
    this._pendingPromises = this._pendingPromises || [];
    this._eventListeners = this._eventListeners || [];

    for (const promise of Array.from(this._pendingPromises)) {
      // @ts-expect-error TS(2571): Object is of type 'unknown'.
      promise.cancel();
    }
    delete this._pendingPromises;

    // @ts-expect-error TS(2339): Property 'target' does not exist on type 'unknown'... Remove this comment to see the full error message
    for (const { target, type, callback } of Array.from(this._eventListeners)) {
      target.removeEventListener(type, callback);
    }
    delete this._eventListeners;

    // Remove these last, since it's possible that a promise or a callback
    // will try to use them
    for (const retained of Array.from(this._retained)) {
      // @ts-expect-error TS(2571): Object is of type 'unknown'.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      retained.release().catch(function (err: any) {});
    } // noop, we don't care if this fails
    delete this._retained;

    this.globalThemeObserver?.unsubscribe();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addEventListener(target: any, type: any, callback: any) {
    this._eventListeners = this._eventListeners || [];
    target.addEventListener(type, callback);
    return this._eventListeners.push({ target, type, callback });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initIFrames(board: any, card: any, ...changedSignals: any[]) {
    const iframes = this.$el.find(
      'iframe.plugin-iframe',
    ) as JQuery<HTMLIFrameElement>;

    const combinedSignal = Hearsay.combine(
      ...Array.from(
        changedSignals.concat(pluginsChangedSignal(board, card)) || [],
      ),
    );

    _.each(iframes, (iframe) => {
      let loaded = false;

      const rerender = () => {
        if (loaded) {
          iframe.contentWindow?.postMessage('render', '*');
        }
      };

      this.subscribe(combinedSignal, rerender);

      // eslint-disable-next-line @trello/enforce-variable-case
      const $iframe = $(iframe);
      $iframe.addClass('iframe-loading').one(
        'load',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.callback((e: any) => {
          $iframe.removeClass('iframe-loading');

          loaded = true;

          rerender();

          if (this.handleIFrameMessage != null) {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-shadow */
            this.addEventListener(window, 'message', (e: any) => {
              if (e.source === iframe.contentWindow) {
                this.handleIFrameMessage(iframe, e.data);
              }
            });
          }
        }),
      );
    });
  }
}

PluginView.initClass();
export { PluginView };
