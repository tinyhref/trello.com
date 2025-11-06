/* eslint-disable
    eqeqeq,
*/

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
import _ from 'underscore';
import Visibility from 'visibilityjs';

import { makeErrorEnum } from '@trello/error-handling';

import { sendPluginOperationalEvent } from 'app/scripts/lib/plugins/plugin-behavioral-analytics';
import { isValidUrlForImage } from 'app/scripts/lib/plugins/pluginValidators';
import type { Plugin } from 'app/scripts/models/Plugin';
import { IFrameIO } from 'app/scripts/network/IFrameIO';

// eslint-disable-next-line @trello/enforce-variable-case
const PluginIOError = makeErrorEnum('Plugin', ['NotHandled', 'Timeout']);

interface PluginIO {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Error: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _io: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  capabilities: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handlers: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  id: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  iframeConnectorUrl: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listing: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  moderatedState: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  name: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public: any;
}

class PluginIO {
  static initClass() {
    // @ts-expect-error TS(2339): Property 'Error' does not exist on type 'typeof Pl... Remove this comment to see the full error message
    this.Error = PluginIOError;
  }

  constructor(plugin: Plugin, handlers: object) {
    this.handlers = handlers;
    this.id = plugin.id;
    // special-case the callback capability since it is implemented by Trello
    // on behalf of all Power-Ups in power-up.js
    this.capabilities = _.union(plugin.get('capabilities'), ['callback']);
    this.iframeConnectorUrl = plugin.get('iframeConnectorUrl');
    this.icon = plugin.get('icon');
    this.listing = plugin.get('listing');
    this.name = plugin.get('name');
    this.moderatedState = plugin.get('moderatedState');
    this.public = plugin.get('public');
  }

  getName() {
    return this.listing?.name || this.name;
  }
  getDescription() {
    return this.listing?.description || '';
  }
  getOverview() {
    return this.listing?.overview || '';
  }
  getIconUrl() {
    const iconUrl = this.icon?.url;
    if (isValidUrlForImage(iconUrl)) {
      return iconUrl;
    } else {
      return null;
    }
  }

  _getIo() {
    if (this.moderatedState === 'moderated') {
      throw new Error(
        `Power-Up '${this.getName()}' (id: ${this.id}) is moderated`,
      );
    }

    return (
      this._io ??
      (this._io = new IFrameIO(
        this.iframeConnectorUrl,
        this.handlers,
        this.id,
        this.capabilities,
      ))
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request(command: any, options: any, timeout: any) {
    if (this.moderatedState === 'moderated') {
      throw new Error(
        `Power-Up '${this.getName()}' (id: ${this.id}) is moderated`,
      );
    }

    if (command === 'card-cover') {
      sendPluginOperationalEvent({
        idPlugin: this.id,
        idBoard: '',
        event: {
          action: 'requested',
          actionSubject: 'pluginCommand',
          actionSubjectId: 'run-pluginCommand/card-cover',
          source: 'lib:pluginIO',
        },
      });
    }

    return new Bluebird(function (resolve) {
      // we only want to make a request to a Power-Up when the board is in the foreground tab
      // otherwise our communication with it is slowed so drastically by the browser that
      // we are highly prone to timing out. Also updating the information you aren't looking
      // at isn't terribly useful, so we'll just wait for you to be looking.
      return Visibility.onVisible(resolve);
    }).then(() => {
      return (
        this._getIo()
          .request(command, options, timeout)
          // @ts-expect-error TS(2339): Property 'Error' does not exist on type 'typeof IF... Remove this comment to see the full error message
          .catch(IFrameIO.Error.NotHandled, function () {
            throw PluginIOError.NotHandled();
          })
          // @ts-expect-error TS(2339): Property 'Error' does not exist on type 'typeof IF... Remove this comment to see the full error message
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .catch(IFrameIO.Error.Timeout, function (err: any) {
            throw PluginIOError.Timeout(err.message);
          })
      );
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supports(command: any) {
    if (this.moderatedState === 'moderated') {
      console.warn(`Warning: Power-Up '${this.getName()}' (id: ${
        this.id
      }) is moderated. \
Capability '${command}' was denied.`);

      return false;
    }

    return (
      _.isArray(this.capabilities) != null &&
      Array.from(this.capabilities).includes(command)
    );
  }

  drop() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this._getIo().then((io: any) => io?.drop());
  }
}

PluginIO.initClass();
export { PluginIO };
