/* eslint-disable
    eqeqeq,
*/

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

import { getAaId } from '@trello/authentication';
import { dontUpsell } from '@trello/browser';
import { clientVersion } from '@trello/config';
import { makeErrorEnum } from '@trello/error-handling';
import { currentLocale } from '@trello/locale';
import type { EffectiveColorMode } from '@trello/theme';
import { getGlobalTheme } from '@trello/theme';

import { BUTLER_POWER_UP_ID } from 'app/scripts/data/butler-id';
import { Auth } from 'app/scripts/db/Auth';
import { ModelLoader } from 'app/scripts/db/model-loader';
import { ModelCache } from 'app/scripts/db/ModelCache';
import { isValidUrlForImage } from 'app/scripts/lib/plugins/pluginValidators';
import type { Member } from 'app/scripts/models/Member';
import { Plugin } from 'app/scripts/models/Plugin';
import { serialize } from 'app/scripts/views/internal/plugins/PluginHandlerContext';
import { PluginIO } from 'app/scripts/views/internal/plugins/PluginIo';
import { pluginIOCache } from 'app/scripts/views/internal/plugins/PluginIoCache';
import { PluginOptions as pluginOptions } from 'app/scripts/views/internal/plugins/PluginOptions';
import { PluginProcessCallbacks as processCallbacks } from 'app/scripts/views/internal/plugins/PluginProcessCallbacks';

// eslint-disable-next-line @trello/enforce-variable-case
const PluginRunnerError = makeErrorEnum('PluginRunner', [
  'NotHandled',
  'InvalidPlugin',
  'Timeout',
]);

const DEFAULT_TIMEOUT = 5000;

const eventualEnabledPlugins = {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loadAvailablePlugins = function (idBoard: any) {
  // We might have several PluginRunners make requests at once (e.g. for badges)
  // and we don't want all of them to trigger duplicate requests to loading the
  // plugins from the server.
  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  if (eventualEnabledPlugins[idBoard] == null) {
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    eventualEnabledPlugins[idBoard] =
      ModelLoader.loadBoardEnabledPlugins(idBoard);

    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    eventualEnabledPlugins[idBoard].then(
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      () => delete eventualEnabledPlugins[idBoard],
    );
  }

  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  return eventualEnabledPlugins[idBoard];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loadPlugin = (board: any, pluginOrId: any) =>
  Bluebird.try(function () {
    let existingPlugin;
    if (pluginOrId instanceof Plugin) {
      return pluginOrId;
    }

    if (!_.isString(pluginOrId)) {
      throw PluginRunnerError.InvalidPlugin('invalid plugin specifier');
    }

    const idPlugin = pluginOrId;
    if ((existingPlugin = ModelCache.get('Plugin', idPlugin)) != null) {
      return existingPlugin;
    }

    if (board == null) {
      throw PluginRunnerError.InvalidPlugin('unable to find plugin');
    }

    return loadAvailablePlugins(board.id).then(function () {
      if ((existingPlugin = ModelCache.get('Plugin', idPlugin)) != null) {
        return existingPlugin;
      }

      throw PluginRunnerError.InvalidPlugin('plugin not available to board');
    });
  });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractPlugins = function ({ plugins, plugin, board }: any) {
  plugins =
    plugins ??
    (plugin != null ? [plugin] : undefined) ??
    board?.idPluginsEnabled() ??
    [];

  return Bluebird.map(plugins, (pluginOrId) => {
    return loadPlugin(board, pluginOrId);
  });
};

interface BaseContext {
  version: string;
  member: Member;
  permissions: {
    board: string;
    organization?: string;
  };
  locale: string;
  organization?: string;
  theme?: null;
  initialTheme?: EffectiveColorMode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractCommonContext = function (options: any) {
  let org;
  const board = options?.board;
  const baseContext: BaseContext = {
    version: /^build-\d+$/.test(clientVersion) ? clientVersion : 'unknown',
    member: Auth.me(),
    permissions: {
      board: board?.editable() ? 'write' : 'read',
    },
    locale: currentLocale,
    theme: null,
    initialTheme: getGlobalTheme().effectiveColorMode,
  };
  if (board?.hasOrganization()) {
    baseContext.organization = board.get('idOrganization');
  }
  if ((org = board?.getOrganization()) != null) {
    baseContext.permissions.organization = org?.hasActiveMembership(Auth.me())
      ? 'write'
      : 'read';
  }
  if (board?.isEnterpriseBoard() && board.getEnterprise()) {
    // @ts-expect-error TS(2339): Property 'enterprise' does not exist on type '{ ve... Remove this comment to see the full error message
    baseContext.enterprise = board.getEnterprise().id;
  }
  if (options.card != null) {
    // @ts-expect-error TS(2339): Property 'card' does not exist on type '{ board: s... Remove this comment to see the full error message
    baseContext.permissions.card = options.card.editable() ? 'write' : 'read';
  }

  const extendedContext = ['board', 'list', 'card', 'command', 'el'];
  return {
    ...baseContext,
    ..._.pick(options, extendedContext),
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractCommandOptions = ({ options }: any) => options;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const returnFirstOrError = function (responses: any, command: any) {
  if (responses.length === 0) {
    throw PluginRunnerError.NotHandled('no plugin handles this command', {
      command,
    });
  }
  return _.first(responses);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateUrls = (obj: any, idPlugin: any) =>
  _.each(obj, function (val, key) {
    if (_.isObject(val) || _.isArray(val)) {
      return validateUrls(val, idPlugin);
    } else if (key === 'url' && !isValidUrlForImage(val)) {
      console.warn(
        `Invalid URL detected in Power-Up response for: ${idPlugin}`,
      );
      throw new PluginRunnerError.NotHandled('Invalid url');
    }
  });

class PluginRunner {
  static initClass() {
    // @ts-expect-error TS(2339): Property 'Error' does not exist on type 'PluginRun... Remove this comment to see the full error message
    this.prototype.Error = PluginRunnerError;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  processCallbacks(obj: any, pluginEntry: any, baseOptions: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return processCallbacks(obj, (runOptions: any) => {
      const options = {
        ...baseOptions,
        ...runOptions,
      };
      const runAction = runOptions.options.action;
      return (
        this._run(
          [pluginEntry],
          extractCommonContext(options),
          extractCommandOptions(options),
        )
          // @ts-expect-error TS(2769): No overload matches this call.
          .then(returnFirstOrError)
          .catch(PluginRunnerError.NotHandled, function (err) {
            throw PluginRunnerError.NotHandled(
              `attempt to ${runAction} callback on plugin ${pluginEntry.plugin.id} failed`,
            );
          })
      );
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _getPluginSpecificContext(idPlugin: any, board: any) {
    switch (idPlugin) {
      case BUTLER_POWER_UP_ID:
        // Allow Butler to know if we are in a Desktop context
        // As Butler will have to hide upsells to conform to app store rules
        return {
          dontUpsell: dontUpsell(),
          canShowButlerUI: board.canShowButlerUI(),
          butlerName: 'automation',
          butlerkey: 'automation',
          colorMode: getGlobalTheme().effectiveColorMode,
          memberAaId: getAaId(),
          analyticsUserIdToAaId: true,
          showCardRole: true,
          doneStateEnabled: true,
          showMirrorAction: true,
          showFindMirror: true,
          // Deprecated FFs; to be cleaned up in Butler Client separately
          butlerBitbucketIntegration: true,
          omitCardButtons: true,
          ungatePaidCommands: true,
          automationFeedback: true,
        };
      default:
        return { plugin: idPlugin };
    }
  }

  _run(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pluginEntries: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    commonContext: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    baseCommandOptions: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    timeout?: any,
  ) {
    if (timeout == null) {
      timeout = DEFAULT_TIMEOUT;
    }
    const { command, board, card, member } = commonContext;

    return Bluebird.using(
      serialize(commonContext),
      (serializedCommonContext) => {
        // @ts-expect-error TS(2345): Argument of type '({ io }: { io: any; }) => any' i... Remove this comment to see the full error message
        return Bluebird.filter(pluginEntries, ({ io }) => io.supports(command))
          .map((pluginEntry) => {
            // @ts-expect-error TS(2339): Property 'plugin' does not exist on type 'unknown'... Remove this comment to see the full error message
            const { plugin, io } = pluginEntry;

            const pluginSpecificContext = this._getPluginSpecificContext(
              plugin.id,
              board,
            );

            const commandOptions = {
              ...baseCommandOptions,
              context: { ...serializedCommonContext, ...pluginSpecificContext },
            };

            return (
              io
                .request(command, pluginOptions(commandOptions), timeout)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .then((response: any) => {
                  validateUrls(response, plugin.id);
                  return {
                    response: this.processCallbacks(response, pluginEntry, {
                      board,
                      card,
                      member,
                    }),
                    idPlugin: plugin.id,
                  };
                })
                .catch(
                  PluginRunnerError.NotHandled,
                  PluginRunnerError.Timeout,
                  // @ts-expect-error TS(2339): Property 'Error' does not exist on type 'typeof Pl... Remove this comment to see the full error message
                  PluginIO.Error.NotHandled,
                  // @ts-expect-error TS(2339): Property 'Error' does not exist on type 'typeof Pl... Remove this comment to see the full error message
                  PluginIO.Error.Timeout,
                  () => null,
                )
            );
          })
          .filter((entry) => entry != null)
          .map(function ({ response, idPlugin }) {
            if (
              Array.isArray(response) &&
              _.compact(response).every(_.isObject)
            ) {
              return _.compact(response).map((r) => ({
                ...r,
                idPlugin,
              }));
            } else if (_.isObject(response)) {
              return {
                ...response,
                idPlugin,
              };
            } else {
              return response;
            }
          });
      },
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _runFromOptions(options: any) {
    const plugins = extractPlugins(options);
    const commonContext = extractCommonContext(options);
    const commandOptions = extractCommandOptions(options);

    return Bluebird.resolve(plugins)
      .filter((plugin) =>
        options.fxPluginFilter ? options.fxPluginFilter(plugin) : true,
      )
      .map((plugin) => ({
        plugin,
        io: pluginIOCache.get(plugin),
      }))
      .then((pluginEntries) => {
        return this._run(
          pluginEntries,
          commonContext,
          commandOptions,
          options.timeout,
        );
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  all(options: any) {
    return this._runFromOptions(options).then(_.flatten);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  one(options: any) {
    return this._runFromOptions(options).then((response) => {
      return returnFirstOrError(response, options.command);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getOrLoadPlugin(board: any, idPlugin: any) {
    return loadPlugin(board, idPlugin);
  }
}
PluginRunner.initClass();

const pluginRunner = new PluginRunner();

export { extractCommonContext, pluginRunner };
