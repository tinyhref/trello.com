/* eslint-disable
    eqeqeq,
    @typescript-eslint/no-use-before-define,
*/

/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

// eslint-disable-next-line no-restricted-imports
import Bluebird from 'bluebird';
import { jwtDecode } from 'jwt-decode';
import _ from 'underscore';

import { ajaxGet, ajaxPost } from '@trello/ajax';
import { Analytics } from '@trello/atlassian-analytics';
import { fireConfetti } from '@trello/confetti';
import { siteDomain } from '@trello/config';
import { dangerouslyGetFeatureGateSync } from '@trello/feature-gate-client';
import { getScreenFromUrl } from '@trello/marketing-screens';
import { dismissFlag, showFlag } from '@trello/nachos/experimental-flags';
import { navigate } from '@trello/router/navigate';
import { getRouteIdFromPathname, isCardRoute } from '@trello/router/routes';
import { getCsrfRequestPayload } from '@trello/session-cookie/csrf';

import { currentModelManager } from 'app/scripts/controller/currentModelManager';
import { getBoardUrl } from 'app/scripts/controller/urls';
import { BUTLER_POWER_UP_ID } from 'app/scripts/data/butler-id';
import { Auth } from 'app/scripts/db/Auth';
import { ModelLoader } from 'app/scripts/db/model-loader';
import { ModelCache } from 'app/scripts/db/ModelCache';
import {
  sendPluginOperationalEvent,
  sendPluginScreenEvent,
  sendPluginTrackEvent,
} from 'app/scripts/lib/plugins/plugin-behavioral-analytics';
import {
  isValidAlertDisplayType,
  isValidAlertDuration,
  isValidHeight,
  isValidPosition,
  isValidStringLength,
  isValidUrlForIframe,
} from 'app/scripts/lib/plugins/pluginValidators';
import { ninvoke } from 'app/scripts/lib/util/ninvoke';
import { ApiPromise } from 'app/scripts/network/ApiPromise';
import {
  deserialize,
  Error,
  serialize,
} from 'app/scripts/views/internal/plugins/PluginHandlerContext';
import {
  serializeBoard,
  serializeCard,
  serializeCards,
  serializeList,
  serializeLists,
  serializeMember,
  serializeOrganization,
} from 'app/scripts/views/internal/plugins/PluginModelSerializer';
import { PluginProcessCallbacks as processCallbacks } from 'app/scripts/views/internal/plugins/PluginProcessCallbacks';
import { PluginBoardBar } from 'app/scripts/views/lib/PluginBoardBar';
import { PluginModal } from 'app/scripts/views/lib/PluginModal';
import { PopOver } from 'app/scripts/views/lib/PopOver';
import { PluginPopOverConfirmView } from 'app/scripts/views/plugin/PluginPopOverConfirmView';
import { PluginPopOverDateTimeView } from 'app/scripts/views/plugin/PluginPopOverDatetimeView';
import { PluginPopOverIFrameView } from 'app/scripts/views/plugin/PluginPopOverIframeView';
import { PluginPopOverListView } from 'app/scripts/views/plugin/PluginPopOverListView';
import { isBoardRenderedSharedState } from 'app/src/components/Board/isBoardRenderedSharedState';
import { returnToBoard } from 'app/src/components/Board/returnToBoard';
import { PluginModalState } from 'app/src/components/Plugins/PluginModalState';
import { PluginPopoverScreen } from 'app/src/components/Plugins/PluginPopover/PluginPopoverScreen';
import { PluginPopoverState } from 'app/src/components/Plugins/PluginPopover/PluginPopoverState';
import { isWebClientPage } from 'app/src/isWebClientPage';
import { PluginBoardBarState } from '../../../../src/components/Plugins/PluginBoardBarState';

import defaultPowerUpIcon from 'resources/images/directory/icons/customIcon.png';

const INVALID_HEIGHT = 'Invalid height, must be a positive number';
const INVALID_URL = 'Invalid url, must be http or https';
const MISSING_BOARD = 'Invalid context, missing board';
const MISSING_CARD = 'Invalid context, missing card';
const MISSING_CONTEXT = 'Missing context, command requires context';
const MISSING_EL =
  'Invalid context, missing el (or attempt to use el after initial request)';
const MISSING_EL_POPUP =
  'Unknown element for popover. Make sure you are using the most local context (t) to the request, as well as awaiting the request to open the popover. If opening a popover relative to content in your own iframe, you may pass a mouseEvent option when calling the popup function.';
const MISSING_LIST = 'Invalid context, missing list';
const MISSING_MEMBER = 'Invalid context, missing member';
const CARD_NOT_FOUND = 'Card not found or not on current board';
const MISSING_ORG = 'Invalid context, missing organization';
const DISABLED = 'Plugin disabled on board';
const INVALID_CONTEXT = 'Invalid context, unable to deserialize';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isInPopOver = function (t: any, context: any) {
  let iframe;
  const { el } = context;

  if (el != null && (PopOver.contains(el) || PopOver.toggledBy(el))) {
    return true;
  }

  if ((iframe = iframeFromHost(t)) != null && PopOver.contains(iframe)) {
    return true;
  }

  return false;
};

const jwtCache = new Map();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let jwtCacheClearInterval: any = null;
const jwtCacheClearPeriod = 60000;
// eslint-disable-next-line @trello/enforce-variable-case
const clearJWTCache = function () {
  jwtCache.forEach(function (val, key) {
    if (val.expires < Date.now() + 60000) {
      return jwtCache.delete(key);
    }
  });
  if (jwtCache.size === 0) {
    // empty cache, pause the garbage cleaner
    clearInterval(jwtCacheClearInterval);
    return (jwtCacheClearInterval = null);
  }
};

// WARNING: The context is supplied by the power-up, and shouldn't necessarily
// be trusted.
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const PluginHandlers = function ({ idPlugin, allowRestricted }: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapHandlers = (handlers: any) =>
    _.mapObject(
      handlers,
      (fx) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function (t: any, options: any) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let context: any, deserializedContext;
          if ((context = options?.context) == null) {
            throw t.NotHandled('Missing context');
          }

          // Process any callbacks in the options we were given, since some things
          // like popups might be using them
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const runCallback = ({ command, el, options: commandOptions }: any) =>
            Bluebird.using(serialize({ el }), (callbackContext) =>
              t
                .request(command, {
                  ...commandOptions,
                  context: { ...context, ...callbackContext },
                })
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .then((response: any) => {
                  return processCallbacks(response, runCallback);
                }),
            );
          options = processCallbacks(options, runCallback);

          try {
            deserializedContext = deserialize(context, idPlugin);
          } catch (err) {
            if (err instanceof Error.PluginDisabled) {
              throw t.PluginDisabled(DISABLED);
            }
          }

          if (deserializedContext == null) {
            throw t.InvalidContext(INVALID_CONTEXT);
          }

          return fx.call(handlers, t, {
            ...options,
            context: deserializedContext,
          });
        },
    );
  const getArgs = function (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    t: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    required: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    allowAnonymous?: any,
  ) {
    let { context } = args;
    const { idCard } = args;

    if (context != null && currentModelManager.onAnyCardView()) {
      const currentCardModel = currentModelManager.currentModel.get();
      if (currentCardModel) {
        context = {
          ...context,
          card: currentCardModel,
          // @ts-expect-error TS(2339): Property 'getBoard' does not exist on type 'Backbo... Remove this comment to see the full error message
          board: currentCardModel.getBoard(),
          member: Auth.me(),
        };
      }
    }

    // anonymous requests will have null or empty contexts
    if (context == null || Object.keys(context).length === 0) {
      if (!allowAnonymous) {
        // only commands from allowlist can go forward
        throw t.NotHandled(MISSING_CONTEXT);
      }
      // @ts-expect-error TS(2339): Property 'isPluginEnabled' does not exist on type ... Remove this comment to see the full error message
      if (!currentModelManager.getCurrentBoard()?.isPluginEnabled(idPlugin)) {
        throw t.PluginDisabled(DISABLED);
      }
      context = {
        board: currentModelManager.getCurrentBoard(),
        member: Auth.me(),
      };
    }

    let { card } = context;
    const { board, el, list, member } = context;
    if (required?.board && board == null) {
      throw t.NotHandled(MISSING_BOARD);
    }
    if (required?.el && el == null) {
      throw t.NotHandled(MISSING_EL);
    }
    if (required?.list && list == null) {
      throw t.NotHandled(MISSING_LIST);
    }
    if (required?.member && member == null) {
      throw t.NotHandled(MISSING_MEMBER);
    }

    if (idCard != null) {
      if (board == null) {
        throw t.NotHandled(MISSING_BOARD);
      }
      if ((card = board.getCard(idCard)) == null) {
        throw t.NotHandled(CARD_NOT_FOUND);
      }
    }

    if (required?.card && card == null) {
      throw t.NotHandled(MISSING_CARD);
    }

    return {
      ...args,

      context: {
        ...context,
        card,
      },
    };
  };

  const handlers = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data(t: any, opts: any) {
      const { board, card } = getArgs(t, opts, { board: true }, true).context;
      const cardPluginData = card?.getPluginData(idPlugin);
      const memberPluginData = Auth.me()?.getPluginData(idPlugin);
      return {
        ...board.getPluginData(idPlugin),
        ...cardPluginData,
        ...memberPluginData,
      };
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set(t: any, opts: any) {
      const {
        context: { board, card },
        scope,
        visibility,
        data,
      } = getArgs(t, opts, { board: true }, true);

      if (!['private', 'shared'].includes(visibility)) {
        throw t.NotHandled('Invalid value for visibility');
      }
      if (!_.isString(data)) {
        throw t.NotHandled('Invalid value for data');
      }

      const target = (() => {
        switch (scope) {
          case 'card':
            return (
              card ||
              (() => {
                throw t.NotHandled(
                  'Card scope not available without card context',
                );
              })()
            );
          case 'board':
            return board;
          case 'member':
            return (
              Auth.me() ||
              (() => {
                throw t.NotHandled('No active member');
              })()
            );
          case 'organization':
            return (
              board.getOrganization() ||
              (() => {
                throw t.NotHandled(
                  'Unable to save plugin data at the organization level because the member is not in the organization',
                );
              })()
            );
          default:
            throw t.NotHandled('Invalid value for scope');
        }
      })();

      // private data can be set relative to models even if the models themselves aren't directly editable
      // for example storing a private auth token for a member on a public board they aren't a member of
      if (visibility === 'shared') {
        if ((scope === 'card' || scope === 'board') && !target?.editable()) {
          throw t.NotHandled('Scope not editable by active member');
        } else if (
          scope === 'organization' &&
          !target.hasActiveMembership(Auth.me())
        ) {
          throw t.NotHandled('Scope not editable by active member');
        }
      }

      // before we set shared plugindata do a heuristic check to determine
      // if anything sensitive might be being stored here and prevent it
      if (
        visibility === 'shared' &&
        /"(?:(?:auth|refresh)?[_-]?token|secret)":/i.test(data)
      ) {
        sendPluginOperationalEvent({
          idPlugin,
          idBoard: board.id,
          idCard: card.id,
          event: {
            action: 'rejected',
            actionSubject: 'setPluginHandler',
            source: 'lib:pluginHandlers',
          },
        });
        throw t.NotHandled(
          'Detected potential secret. You should never store secrets like tokens in shared pluginData. See: https://developers.trello.com/v1.0/reference#t-set',
        );
      }

      target.setPluginData(idPlugin, visibility, data);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigate(t: any, opts: any) {
      const { board } = getArgs(t, opts, {}).context;
      const { url } = opts;
      const trigger =
        idPlugin === BUTLER_POWER_UP_ID && typeof opts.trigger !== 'undefined'
          ? opts.trigger
          : true;
      if (
        trigger &&
        board &&
        url.match(getBoardUrl(board, 'butler')) &&
        location.pathname.match(getBoardUrl(board, 'butler'))
      ) {
        return;
      }
      if (!isValidUrlForIframe(url)) {
        throw t.NotHandled(INVALID_URL);
      }

      if (!isWebClientPage(url)) {
        throw t.NotHandled('Navigation only allowed to Trello client URLs');
      }

      const urlTarget = url
        .replace(new RegExp(`^${siteDomain}`), '')
        .replace(new RegExp(`^/(?=.)`), '');

      // location.pathname has a leading "/"; urlTarget does not
      // nothing to do if the url requested is the current url
      if (urlTarget !== location.pathname.slice(1)) {
        sendPluginOperationalEvent({
          idPlugin,
          idBoard: board.id,
          event: {
            action: 'requested',
            actionSubject: 'navigatePluginHandler',
            source: 'lib:pluginHandlers',
          },
        });

        // Enforce the board re-render to pickup new url params
        isBoardRenderedSharedState.setValue(false);

        navigate(urlTarget, { trigger });
      }
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    showCard(t: any, opts: any) {
      const { card, board } = getArgs(t, opts, { card: true }).context;
      sendPluginOperationalEvent({
        idPlugin,
        idBoard: board.id,
        idCard: card.id,
        event: {
          action: 'requested',
          actionSubject: 'showCardPluginHandler',
          source: 'lib:pluginHandlers',
        },
      });
      // to prevent the card appearing behind a modal, close that first
      PluginModal.close();
      const relativeCardUrl = new URL(card.get('url')).pathname;
      navigate(relativeCardUrl);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hideCard(t: any, opts: any) {
      getArgs(t, opts, {});
      const { board } = getArgs(t, opts, { board: true }).context;
      sendPluginOperationalEvent({
        idPlugin,
        idBoard: board.id,
        event: {
          action: 'requested',
          actionSubject: 'hideCardPluginHandler',
          source: 'lib:pluginHandlers',
        },
      });

      if (isCardRoute(getRouteIdFromPathname(window.location.pathname))) {
        returnToBoard();
      }
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    alert(t: any, opts: any) {
      const { board } = getArgs(t, opts, { board: true }).context;
      sendPluginOperationalEvent({
        idPlugin,
        idBoard: board.id,
        event: {
          action: 'requested',
          actionSubject: 'alertPluginHandler',
          source: 'lib:pluginHandlers',
        },
      });
      // required to have a message
      if (!isValidStringLength(opts?.message, 1, 140)) {
        throw t.NotHandled(
          'Invalid message. Must be string and within 140 characters',
        );
      }
      const plugin = ModelCache.get('Plugin', idPlugin);
      const identifier = `plugin-${idPlugin}`;
      // @ts-expect-error
      const pluginName = plugin.get('name');
      // @ts-expect-error
      const icon = plugin.get('icon')?.url || defaultPowerUpIcon;
      const duration = isValidAlertDuration(opts.duration) ? opts.duration : 5;
      const displayType = isValidAlertDisplayType(opts.display)
        ? opts.display
        : 'info';

      showFlag({
        // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'FlagId'.
        id: identifier,
        title: pluginName,
        description: opts.message,
        image: { src: icon, alt: `${pluginName} icon` },
        isAutoDismiss: true,
        msTimeout: duration * 1000,
      });

      sendPluginScreenEvent({
        idPlugin,
        idBoard: board.id,
        // @ts-expect-error TS(2820): Type '"pupAlertInlineDialog"' is not assignable to... Remove this comment to see the full error message
        screenName: 'pupAlertInlineDialog',
        attributes: {
          display: displayType,
        },
      });
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hideAlert(t: any, opts: any) {
      const { board } = getArgs(t, opts, { board: true }).context;
      sendPluginOperationalEvent({
        idPlugin,
        idBoard: board.id,
        event: {
          action: 'requested',
          actionSubject: 'hideAlertPluginHandler',
          source: 'lib:pluginHandlers',
        },
      });
      // @ts-expect-error TS(2322): Type '`plugin-${any}`' is not assignable to type '... Remove this comment to see the full error message
      dismissFlag({ id: `plugin-${idPlugin}` });
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    popup(t: any, opts: any) {
      const { context, title, content, callback, pos } = getArgs(t, opts, {
        board: true,
      });
      const { board, el, onOpenPluginPopup } = context;

      sendPluginOperationalEvent({
        idPlugin,
        idBoard: board.id,
        event: {
          action: 'requested',
          actionSubject: 'popupPluginHandler',
          source: 'lib:pluginHandlers',
        },
      });

      const isPluginModernized = dangerouslyGetFeatureGateSync(
        'xf_plugin_modernization_popover_views',
      );

      if (isPluginModernized) {
        const getPopoverScreen = (type: string) => {
          switch (type) {
            case 'iframe':
              return PluginPopoverScreen.Iframe;
            case 'list':
              return PluginPopoverScreen.List;
            case 'confirm':
              return PluginPopoverScreen.Confirm;
            case 'date':
            case 'datetime':
              return PluginPopoverScreen.Datetime;
            default:
              return PluginPopoverScreen.PowerUpsMenu;
          }
        };
        PluginPopoverState.value.content.push(content);
        // If the popover is already open, we just need to push the new screen
        if (PluginPopoverState.value.isOpen) {
          // If the pressed button is the same as the original trigger element
          // We should toggle the popover closed
          if (PluginPopoverState.value.triggerElement === el) {
            PluginPopoverState.value.hide();
            return;
          }
          PluginPopoverState.value.push(getPopoverScreen(content.type));
          PluginPopoverState.setValue({
            title,
            board,
          });
        } else {
          PluginPopoverState.setValue({
            triggerElement: el,
            title,
            isOpen: true,
            popoverScreen: getPopoverScreen(content.type),
            board,
          });
        }
      } else {
        const getView = function () {
          const options = { model: board, title, content, callback };
          switch (content.type) {
            case 'iframe':
              if (!isValidUrlForIframe(content.url)) {
                throw t.NotHandled(INVALID_URL);
              }
              if (content.height != null && !isValidHeight(content.height)) {
                throw t.NotHandled(INVALID_HEIGHT);
              }
              return new PluginPopOverIFrameView(options);
            case 'list':
              return new PluginPopOverListView(options);
            case 'confirm':
              return new PluginPopOverConfirmView(options);
            case 'date':
            case 'datetime':
              return new PluginPopOverDateTimeView(options);
            default:
              throw t.NotHandled('Unknown type for popup');
          }
        };

        const iframe = iframeFromHost(t);

        if (isInPopOver(t, context)) {
          PopOver.pushView({
            view: getView(),
          });
        } else if (el != null) {
          // If we're currently in a React popover context, we need to first close
          // that popover before opening a new one, as these don't layer neatly.
          // This is relevant for the ListActionsPopover today.
          onOpenPluginPopup?.();

          PopOver.toggle({
            elem: el,
            view: getView(),
          });
        } else if (pos != null && iframe && isValidPosition(pos)) {
          const iframeBoundingClientRect = iframe.getBoundingClientRect();
          PopOver.toggle({
            clientx: pos.x + iframeBoundingClientRect.left,
            clienty: pos.y + iframeBoundingClientRect.top,
            view: getView(),
          });
        } else {
          console.error(MISSING_EL_POPUP);
          throw t.NotHandled(MISSING_EL);
        }
      }

      sendPluginScreenEvent({
        idPlugin,
        idBoard: board.id,
        screenName: 'pupPopupInlineDialog',
        attributes: {
          popupType: content.search ? 'search' : content.type,
        },
      });
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    'close-popup'(t: any, opts: any) {
      const { context } = getArgs(t, opts, { board: true });
      sendPluginOperationalEvent({
        idPlugin,
        idBoard: context.board.id,
        event: {
          action: 'requested',
          actionSubject: 'closePopupPluginHandler',
          source: 'lib:pluginHandlers',
        },
      });
      const isPluginModernized = dangerouslyGetFeatureGateSync(
        'xf_plugin_modernization_popover_views',
      );
      if (isPluginModernized && PluginPopoverState.value.isOpen) {
        PluginPopoverState.value.hide();
      } else if (isInPopOver(t, context)) {
        PopOver.hide();
      } else {
        console.error(
          'Error: No popover in context. Are you using the correct t?',
        );
      }
    },

    // deprecated in favor of close-popup
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    'pop-popup'(t: any, opts: any) {
      const { context } = getArgs(t, opts, { board: true });
      sendPluginOperationalEvent({
        idPlugin,
        idBoard: context.board.id,
        event: {
          action: 'requested',
          actionSubject: 'popPopupPluginHandler',
          source: 'lib:pluginHandlers',
        },
      });
      if (isInPopOver(t, context)) {
        PopOver.popView();
      }
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    overlay(t: any, opts: any) {
      const {
        context: { board },
      } = getArgs(t, opts, { board: true });

      sendPluginOperationalEvent({
        idPlugin,
        idBoard: board.id,
        event: {
          action: 'rejected',
          actionSubject: 'overlayPluginHandler',
          source: 'lib:pluginHandlers',
        },
      });
      throw t.NotHandled('overlay is deprecated');
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    'close-overlay'(t: any, opts: any) {
      const args = getArgs(t, opts, { board: true });
      sendPluginOperationalEvent({
        idPlugin,
        idBoard: args.context.board.id,
        event: {
          action: 'requested',
          actionSubject: 'closeOverlayPluginHandler',
          source: 'lib:pluginHandlers',
        },
      });
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fireConfetti(t: any, opts: any) {
      // @ts-expect-error TS(2554): Expected 4 arguments, but got 2.
      const { pos, context } = getArgs(t, opts);
      const { el } = context;

      const confettiOptions = {
        x: 0.5,
        y: 0.2,
      };

      const iframe = iframeFromHost(t);

      if (iframe) {
        const iframeBoundingClientRect = iframe.getBoundingClientRect();
        if (pos && isValidPosition(pos)) {
          confettiOptions.x =
            (pos.x + iframeBoundingClientRect.left) /
            document.documentElement.clientWidth;
          confettiOptions.y =
            (pos.y + iframeBoundingClientRect.top) /
            document.documentElement.clientHeight;
        }
      } else if (el) {
        const elBoundingClientRect = el.getBoundingClientRect();
        confettiOptions.x =
          elBoundingClientRect.left / document.documentElement.clientWidth;
        confettiOptions.y =
          elBoundingClientRect.top / document.documentElement.clientHeight;
      }

      fireConfetti(confettiOptions);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modal(t: any, opts: any) {
      const {
        context: { board },
        content,
      } = getArgs(t, opts, { board: true });
      sendPluginOperationalEvent({
        idPlugin,
        idBoard: board.id,
        event: {
          action: 'requested',
          actionSubject: 'modalPluginHandler',
          source: 'lib:pluginHandlers',
        },
      });

      if (!isValidUrlForIframe(content.url)) {
        throw t.NotHandled(INVALID_URL);
      }

      if (content.height != null && !isValidHeight(content.height)) {
        throw t.NotHandled(INVALID_HEIGHT);
      }

      const plugin = ModelCache.get('Plugin', idPlugin);

      if (!_.isString(content.title)) {
        content.title = plugin?.get('name') || '';
      }
      content.title = content.title.trim();

      content.idPlugin = idPlugin;

      const isPluginModernized = dangerouslyGetFeatureGateSync(
        'xf_plugin_modernization_modal',
      );

      if (isPluginModernized) {
        PluginModalState.setValue({
          isOpen: true,
          url: content.url,
          accentColor: content.accentColor,
          height: content.height,
          fullscreen: content.fullscreen,
          title: content.title,
          actions: content.actions,
        });
      } else {
        PluginModal.open({ model: board, content });
      }

      sendPluginScreenEvent({
        idPlugin,
        idBoard: board.id,
        // @ts-expect-error TS(2322): Type '"pupModalModal"' is not assignable to type '... Remove this comment to see the full error message
        screenName: 'pupModalModal',
        attributes: {
          fullscreen: content.fullscreen === true,
          totalActions: content.actions ? content.actions.length : 0,
        },
      });

      return { closeListPluginActions: true };
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    'update-modal'(t: any, opts: any) {
      const { content, context } = getArgs(t, opts, { board: true });
      sendPluginOperationalEvent({
        idPlugin,
        idBoard: context.board.id,
        event: {
          action: 'requested',
          actionSubject: 'updateModalPluginHandler',
          source: 'lib:pluginHandlers',
        },
      });

      const isPluginModernized = dangerouslyGetFeatureGateSync(
        'xf_plugin_modernization_modal',
      );

      content.idPlugin = idPlugin;
      if (isPluginModernized) {
        PluginModalState.setValue({
          accentColor: content.accentColor,
          actions: content.actions,
          fullscreen: content.fullscreen,
          title: content.title,
          height: content.height,
          url: content.url,
        });
      } else {
        PluginModal.update(content);
      }
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    'close-modal'(t: any, opts: any) {
      const { board } = getArgs(t, opts, { board: true }).context;
      sendPluginOperationalEvent({
        idPlugin,
        idBoard: board.id,
        event: {
          action: 'requested',
          actionSubject: 'closeModalPluginHandler',
          source: 'lib:pluginHandlers',
        },
      });

      const isPluginModernized = dangerouslyGetFeatureGateSync(
        'xf_plugin_modernization_modal',
      );

      if (isPluginModernized) {
        PluginModalState.setValue({
          isOpen: false,
        });
        return;
      } else {
        return PluginModal.close();
      }
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    'board-bar'(t: any, opts: any) {
      const {
        context: { board },
        content,
      } = getArgs(t, opts, { board: true });
      sendPluginOperationalEvent({
        idPlugin,
        idBoard: board.id,
        event: {
          action: 'requested',
          actionSubject: 'boardBarPluginHandler',
          source: 'lib:pluginHandlers',
        },
      });

      if (!isValidUrlForIframe(content.url)) {
        throw t.NotHandled(INVALID_URL);
      }

      if (content.height != null && !isValidHeight(content.height)) {
        throw t.NotHandled(INVALID_HEIGHT);
      }

      const plugin = ModelCache.get('Plugin', idPlugin);

      if (!content.title) {
        content.title = plugin?.get('name') || '';
      }
      const isPluginBoardBarModernized = dangerouslyGetFeatureGateSync(
        'xf_plugin_modernization_board_bar',
      );
      if (isPluginBoardBarModernized) {
        PluginBoardBarState.setValue({
          isOpen: true,
          url: content.url,
          height: content.height,
          accentColor: content.accentColor,
          callback: content.callback,
          title: content.title,
          actions: content.actions,
          resizable: content.resizable,
        });
      } else {
        PluginBoardBar.open({ model: board, content });
      }

      sendPluginScreenEvent({
        idPlugin,
        idBoard: board.id,
        // @ts-expect-error TS(2322): Type '"pupBoardBarModal"' is not assignable to typ... Remove this comment to see the full error message
        screenName: 'pupBoardBarModal',
        attributes: {
          totalActions: content.actions ? content.actions.length : 0,
          resizable: content.resizable === true,
        },
      });
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    'close-board-bar'(t: any, opts: any) {
      const { board } = getArgs(t, opts, { board: true }).context;
      sendPluginOperationalEvent({
        idPlugin,
        idBoard: board.id,
        event: {
          action: 'requested',
          actionSubject: 'closeBoardBarPluginHandler',
          source: 'lib:pluginHandlers',
        },
      });
      const isPluginModernized = dangerouslyGetFeatureGateSync(
        'xf_plugin_modernization_board_bar',
      );
      if (isPluginModernized) {
        PluginBoardBarState.reset();
      } else {
        return PluginBoardBar.close();
      }
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resize(t: any, { height }: any) {
      const isPluginBoardBarModernized = dangerouslyGetFeatureGateSync(
        'xf_plugin_modernization_board_bar',
      );
      const isPluginModalModernized = dangerouslyGetFeatureGateSync(
        'xf_plugin_modernization_modal',
      );
      const isPluginPopoverModernized = dangerouslyGetFeatureGateSync(
        'xf_plugin_modernization_popover_views',
      );
      if (
        isPluginPopoverModernized &&
        PluginPopoverState.value.isOpen &&
        PluginPopoverState.value.content?.[
          PluginPopoverState.value.content.length - 1
        ]?.url
      ) {
        PluginPopoverState.setValue((prevState) => ({
          ...prevState,
          content: prevState.content.map((prevContent, index) =>
            index === prevState.content.length - 1
              ? { ...prevContent, height }
              : prevContent,
          ),
        }));
        return;
      } else if (isPluginModalModernized && PluginModalState.value.isOpen) {
        PluginModalState.setValue((prevState) => ({ ...prevState, height }));
        return;
      } else if (
        isPluginBoardBarModernized &&
        PluginBoardBarState.value.isOpen
      ) {
        PluginBoardBarState.setValue((prevState) => ({ ...prevState, height }));
        return;
      }

      if (!isValidHeight(height)) {
        throw t.NotHandled(INVALID_HEIGHT);
      }
      const iframe = iframeFromHost(t);
      if (iframe) {
        if ($(iframe).parents('.plugin-modal>.fullscreen').length) {
          console.warn(
            'Warning: Fullscreen modals cannot be resized with t.sizeTo',
          );

          return;
        }
        if (height) {
          // we want to restrict the vertical height of the board bar to 40% the height of the board
          if ($(iframe).parents('.plugin-board-bar').length) {
            PluginBoardBar.setDesiredHeight(height);
            // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
            PluginBoardBar.restrictHeight();
          } else {
            // @ts-expect-error TS(2339): Property 'style' does not exist on type 'Element'.
            iframe.style.height = `${height}px`;
          }
        }
      } else {
        throw t.NotHandled('Could not find iframe to resize');
      }
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    card(t: any, opts: any) {
      const {
        context: { card },
        fields,
      } = getArgs(t, opts, { card: true });
      return serializeCard(card, fields);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cards(t: any, opts: any) {
      const {
        context: { board },
        fields,
        options,
      } = getArgs(t, opts, { board: true }, true);
      const openCards = board.openCards();

      if (options?.filter) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filteredCards = openCards.filter((card: any) =>
          board.filter.satisfiesFilter(card),
        );

        return serializeCards(filteredCards, fields);
      }

      return serializeCards(openCards, fields);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    list(t: any, opts: any) {
      getArgs(t, opts, {});
      const { context, fields } = opts;
      return Bluebird.try(function () {
        let card, list;
        if ((list = context.list) != null) {
          return list;
        }

        if ((card = context.card) != null) {
          if ((list = card.getList()) != null) {
            return list;
          }

          // @ts-expect-error TS(2339): Property 'getCardList' does not exist on type 'Loa... Remove this comment to see the full error message
          return ModelLoader.getCardList(card.id);
        }

        return null;
      }).then(function (list) {
        if (list == null) {
          throw t.NotHandled(MISSING_LIST);
        }

        return serializeList(list, fields);
      });
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lists(t: any, opts: any) {
      const {
        context: { board },
        fields,
      } = getArgs(t, opts, { board: true }, true);
      const nonSmartLists = board.listList.models.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (list: any) => !list.get('type'),
      );
      return serializeLists(nonSmartLists, fields);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    member(t: any, opts: any) {
      const {
        context: { member },
        fields,
      } = getArgs(t, opts, { member: true }, true);
      return serializeMember(member, fields);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    board(t: any, opts: any) {
      const {
        context: { board },
        fields,
      } = getArgs(t, opts, { board: true }, true);
      return serializeBoard(board, fields);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    'attach-to-card'(t: any, opts: any) {
      const {
        context: { card, board },
        url,
        name,
        mimeType,
      } = getArgs(t, opts, { card: true, board: true });
      sendPluginOperationalEvent({
        idPlugin,
        idBoard: board.id,
        idCard: card.id,
        event: {
          action: 'requested',
          actionSubject: 'attachToCardCoverPluginHandler',
          source: 'lib:pluginHandlers',
        },
      });
      return ninvoke(card, 'uploadUrl', { url, name, mimeType })
        .then((data) => {
          const source = getScreenFromUrl();
          return sendPluginTrackEvent({
            idPlugin,
            idBoard: board.id,
            idCard: card.id,
            event: {
              action: 'created',
              actionSubject: 'attachment',
              source,
            },
          });
        })
        .return();
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    organization(t: any, opts: any) {
      const {
        context: { board },
        fields,
      } = getArgs(t, opts, { board: true }, true);
      if (board.hasOrganization() != null && board.getOrganization() != null) {
        return serializeOrganization(board.getOrganization(), fields);
      } else {
        throw t.NotHandled(MISSING_ORG);
      }
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jwt(t: any, opts: any) {
      const {
        context: { board, card },
        includeCard,
        state,
      } = getArgs(t, opts, { board: true, member: true }, true);
      if (state != null && (!_.isString(state) || state.length > 2048)) {
        throw t.NotHandled(
          'Provided state must be a string, less than 2048 characters in length',
        );
      }
      const cacheKey = [
        idPlugin,
        board.id,
        includeCard ? card?.id : '',
        state,
      ].join(':');
      const cached = jwtCache.get(cacheKey);
      if (cached != null && cached.expires > Date.now() + 60000) {
        return cached.jwt;
      }
      return ApiPromise({
        url: `/1/plugin/${idPlugin}/jwt`,
        data: {
          idBoard: board.id,
          idCard: includeCard ? card?.id : undefined,
          state: state || '',
        },
        type: 'post',
      }).then(function (resp) {
        // @ts-expect-error TS(2339): Property 'jwt' does not exist on type 'unknown'.
        const { jwt } = resp;
        const decoded = jwtDecode(jwt);
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        jwtCache.set(cacheKey, { jwt, expires: decoded.exp * 1000 });
        if (jwtCacheClearInterval == null) {
          // enable the garbage collector
          jwtCacheClearInterval = setInterval(
            clearJWTCache,
            jwtCacheClearPeriod,
          );
        }
        return jwt;
      });
    },
  };

  if (allowRestricted) {
    Object.assign(handlers, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      'request-token'(t: any, { context, name, key, scope }: any) {
        const traceId = Analytics.get128BitTraceId();
        // @ts-expect-error TS(2334): Property idBoard is missing in type...
        sendPluginOperationalEvent({
          idPlugin,
          event: {
            action: 'requested',
            actionSubject: 'requestTokenPluginHandler',
            source: 'lib:pluginHandlers',
          },
        });
        if (!key) {
          throw t.NotHandled('Missing API key');
        }
        if (!name) {
          throw t.NotHandled('Missing app name');
        }
        if (!scope) {
          throw t.NotHandled('Missing scope');
        }
        return new Bluebird(function (resolve, reject) {
          Analytics.startTask({
            taskName: 'request-token',
            traceId,
            source: 'lib:pluginHandlers',
            attributes: {
              idPlugin,
            },
          });
          const handlePost = function (data: string) {
            const token = /<pre>\s*(.+?)\s*<\/pre>/.exec(data);
            if (!token) {
              return reject(t.NotHandled('Failed to fetch token'));
            }
            return resolve(token[1]);
          };
          const handleGet = function (data: string) {
            const requestKey =
              /input type="hidden" name="requestKey" value="(.+?)"/.exec(data);
            const signature =
              /input type="hidden" name="signature" value="(.+?)"/.exec(data);
            if (!requestKey || !signature) {
              return reject(t.NotHandled('Unable to get required parameters'));
            }
            return ajaxPost(
              '/1/token/approve',
              {
                approve: 'Allow',
                requestKey: requestKey[1],
                signature: signature[1],
                ...getCsrfRequestPayload(),
              },
              handlePost,
            ).fail((err) => {
              Analytics.taskFailed({
                traceId,
                taskName: 'request-token',
                source: 'lib:pluginHandlers',
                attributes: {
                  idPlugin,
                },
                error: err,
              });
              reject(
                t.NotHandled(
                  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
                  (err && err.responseText) || 'Failed to fetch token',
                ),
              );
            });
          };
          return ajaxGet(
            `/1/authorize?expiration=never&response_type=token&name=${encodeURIComponent(
              name,
            )}&scope=${encodeURIComponent(scope)}&key=${encodeURIComponent(
              key,
            )}`,
            null,
            handleGet,
          ).fail((err) => {
            Analytics.taskFailed({
              traceId,
              taskName: 'request-token',
              source: 'lib:pluginHandlers',
              error: err,
            });
            reject(
              t.NotHandled(
                // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
                (err && err.responseText) ||
                  'Unable to get required parameters',
              ),
            );
          });
        }).then((result) => {
          Analytics.taskSucceeded({
            traceId,
            taskName: 'request-token',
            source: 'lib:pluginHandlers',
            attributes: {
              idPlugin,
            },
          });
          return result;
        });
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      'track-event'(t: any, opts: any) {
        const { event, context } = getArgs(t, opts, {}, true);
        if (!_.isObject(event) || _.isArray(event)) {
          throw t.NotHandled('Invalid event');
        }
        //Snowplow tracking removed needs migration to GAS but GAS requires registration
        sendPluginOperationalEvent({
          idPlugin,
          idBoard: context.board.id,
          event: {
            action: 'requested',
            actionSubject: 'trackEventPluginHandler',
            source: 'lib:pluginHandlers',
          },
        });
      },
    });
  }

  return mapHandlers(handlers);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iframeFromHost = function (t: any) {
  const allIframes = document.querySelectorAll('iframe.plugin-iframe');
  // @ts-expect-error TS(2339): Property 'contentWindow' does not exist on type 'E... Remove this comment to see the full error message
  return _.find(allIframes, (iframe) => iframe.contentWindow === t.source);
};

export { PluginHandlers };
