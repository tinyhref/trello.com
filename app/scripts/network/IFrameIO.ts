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
// eslint-disable-next-line no-restricted-imports
import Bluebird from 'bluebird';
import _ from 'underscore';
// eslint-disable-next-line no-restricted-imports
import parseURL from 'url-parse';
import Visibility from 'visibilityjs';

// @ts-expect-error TS(7016): Could not find a declaration file for module '@atl... Remove this comment to see the full error message
import PostMessageIO from '@atlassian/trello-post-message-io';
import { clientVersion } from '@trello/config';
import { makeErrorEnum } from '@trello/error-handling';
import { currentLocale } from '@trello/locale';

import { currentModelManager } from 'app/scripts/controller/currentModelManager';
import { sandboxParams } from 'app/scripts/data/plugin-iframe-sandbox';
import { Auth } from 'app/scripts/db/Auth';
import { sendPluginTrackEvent } from 'app/scripts/lib/plugins/plugin-behavioral-analytics';
import { isValidUrlForIframe } from 'app/scripts/lib/plugins/pluginValidators';

let INITIALIZE_TIMEOUT = 30000; // gives us 30 seconds to load the index iframe for a Power-Up

/* eslint-disable-next-line @trello/enforce-variable-case */
const IFrameIOError = makeErrorEnum('IFrameIO', [
  'Invalid',
  'NotHandled',
  'Timeout',
]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let host: any = null;
const getHost = function () {
  if (host == null) {
    const id = 'iframe-io-host';
    host = document.createElement('div');
    host.id = id;
    const body = document.getElementsByTagName('body')[0];
    if (!body) {
      throw Error('no body to host iframes');
    }
    body.appendChild(host);
  }
  return host;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IFrameIO {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Error: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _iframeEl: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _io: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  declaredCapabilities: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handlers: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  id: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  implementedCapabilities: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  url: any;
}

export class IFrameIO {
  static initClass() {
    // @ts-expect-error TS(2339): Property 'Error' does not exist on type 'typeof IF... Remove this comment to see the full error message
    this.Error = IFrameIOError;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(url: any, handlers: any, id: any, declaredCapabilities: any) {
    this.url = url;
    this.handlers = handlers;
    this.id = id;
    this.declaredCapabilities = declaredCapabilities;
  }

  _getIO() {
    const startTime = performance?.now?.() || Date.now();
    let iframeLoaded = false;
    let initializeCalled = false;
    let iframeLoadTime = 0;
    let initializeStartTime = 0;
    let visibilityOnLoad = false;
    let visibilityOnInitialize = false;
    if (Visibility.hidden()) {
      INITIALIZE_TIMEOUT = 60000;
    }
    return (
      this._io ??
      (this._io = new Bluebird((resolve) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let io: any;
        if (!isValidUrlForIframe(this.url)) {
          throw IFrameIOError.Invalid(
            `Provided iframe source not valid: ${this.url}`,
          );
        }

        const iframe = document.createElement('iframe');
        iframe.sandbox = sandboxParams;
        iframe.onload = function () {
          iframeLoaded = true;
          const loadTime = performance?.now?.() || Date.now();
          visibilityOnLoad = !Visibility.hidden();
          return (iframeLoadTime = Math.ceil(loadTime - startTime));
        };
        iframe.src = this.url;
        // see: https://sites.google.com/a/chromium.org/dev/Home/chromium-security/deprecating-permissions-in-cross-origin-iframes
        iframe.allow = 'microphone; camera';
        this._iframeEl = iframe;

        getHost().appendChild(iframe);

        const secret = PostMessageIO.randomId(64);
        this.implementedCapabilities = [];

        return (io = new PostMessageIO({
          Promise: Bluebird,
          local: window,
          remote: iframe.contentWindow,
          targetOrigin: parseURL(this.url).set('pathname', '').href,
          secret,
          handlers: {
            ...this.handlers,

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            initialize: (t: any, implementedCapabilities: any) => {
              initializeCalled = true;
              initializeStartTime = performance?.now?.() || Date.now();
              visibilityOnInitialize = !Visibility.hidden();
              this.implementedCapabilities = implementedCapabilities;
              const nonImplemented = _.difference(
                // suppress "not implemented warning" about deprecated card-cover capability
                _.without(this.declaredCapabilities, 'card-cover'),
                implementedCapabilities,
              );
              if (nonImplemented.length > 0) {
                if (typeof console !== 'undefined' && console !== null) {
                  console.warn(
                    `Power-Up ${this.id} declares capabilities that are not implemented`,
                    nonImplemented,
                  );
                }
              }
              const nonDeclared = _.difference(
                implementedCapabilities,
                this.declaredCapabilities,
              );
              if (nonDeclared.length > 0) {
                if (typeof console !== 'undefined' && console !== null) {
                  console.warn(
                    `Power-Up ${this.id} implements capabilities that haven't been enabled`,
                    nonDeclared,
                  );
                }
              }
              return {
                locale: currentLocale,
                member: Auth.myId(),
                secret,
                version: /^build-\d+$/.test(clientVersion)
                  ? clientVersion
                  : 'unknown',
              };
            },

            ready: () => {
              const endTime = performance?.now?.() || Date.now();
              resolve(io);
              return sendPluginTrackEvent({
                idPlugin: this.id,
                // @ts-expect-error TS(2322): Type 'string | undefined' is not assignable to typ... Remove this comment to see the full error message
                idBoard: currentModelManager.getCurrentBoard()?.get('id'),
                event: {
                  action: 'initialized',
                  actionSubject: 'powerUp',
                  source: 'iframeIO',
                  attributes: {
                    elapsedMs: Math.ceil(endTime - startTime),
                    iframeLoadMs: iframeLoadTime,
                    initializeMs:
                      initializeStartTime !== 0
                        ? Math.ceil(initializeStartTime - iframeLoadTime)
                        : 0,
                    declaredCapabilities: this.declaredCapabilities.sort(),
                    implementedCapabilities:
                      this.implementedCapabilities.sort(),
                    wasLoaded: iframeLoaded,
                    wasInitialized: initializeCalled,
                    loadVisibility: visibilityOnLoad,
                    initVisibility: visibilityOnInitialize,
                  },
                },
              });
            },
          },
        }));
      })
        .timeout(INITIALIZE_TIMEOUT)
        .catch(Bluebird.TimeoutError, () => {
          const endTime = performance?.now?.() || Date.now();
          sendPluginTrackEvent({
            idPlugin: this.id,
            // @ts-expect-error TS(2322): Type 'string | undefined' is not assignable to typ... Remove this comment to see the full error message
            idBoard: currentModelManager.getCurrentBoard()?.get('id'),
            event: {
              action: 'timedOut',
              actionSubject: 'powerUp',
              source: 'iframeIO',
              attributes: {
                elapsedMs: Math.ceil(endTime - startTime),
                iframeLoadMs: iframeLoadTime,
                initializeMs:
                  initializeStartTime !== 0
                    ? Math.ceil(initializeStartTime - iframeLoadTime)
                    : 0,
                declaredCapabilities: this.declaredCapabilities.sort(),
                wasLoaded: iframeLoaded,
                wasInitialized: initializeCalled,
                loadVisibility: visibilityOnLoad,
                initVisibility: visibilityOnInitialize,
              },
            },
          });
          if (
            typeof console !== 'undefined' && console !== null
              ? console.error
              : undefined
          ) {
            console.error(
              `Error, timeout while initializing index iframe for ${this.url}. Timeout=${INITIALIZE_TIMEOUT}ms`,
            );
          }
          throw IFrameIOError.Timeout(
            `unable to initialize iframe-io in ${INITIALIZE_TIMEOUT}ms`,
          );
        }))
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request(command: any, options: any, timeout: any) {
    return (
      this._getIO()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then(function (io: any) {
          const startTime = Date.now();
          return io
            .request(command, options)
            .timeout(timeout)
            .catch(Bluebird.TimeoutError, function () {
              if (console?.error) {
                console.error(
                  `IFrameIO request timed out. Command=${command}, Plugin=${
                    options?.context?.plugin
                  }, Elapsed=${Date.now() - startTime}`,
                );
              }
              throw IFrameIOError.Timeout(
                `${command} did not complete in ${timeout}ms`,
              );
            });
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch(function (err: any) {
          throw IFrameIOError.NotHandled(
            `Request to run '${command}' failed due to error: '${err.message}'`,
          );
        })
    );
  }

  drop() {
    return this._iframeEl?.parentNode.removeChild(this._iframeEl);
  }
}
IFrameIO.initClass();
