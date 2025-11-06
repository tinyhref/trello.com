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
import { environment, firstPartyPluginsOrg, pluginCiOrg } from '@trello/config';
import { makeErrorEnum } from '@trello/error-handling';

import { Plugin } from 'app/scripts/models/Plugin';
import { PluginHandlers } from 'app/scripts/views/internal/plugins/PluginHandlers';
import { PluginIO } from 'app/scripts/views/internal/plugins/PluginIo';

// eslint-disable-next-line @trello/enforce-variable-case
const PluginIOCacheError = makeErrorEnum('PluginCache', ['InvalidArgument']);

interface PluginIOCache {
  pluginFromId: {
    [id: string]: PluginIO;
  };
}

class PluginIOCache {
  static initClass() {
    // @ts-expect-error TS(2339): Property 'Error' does not exist on type 'PluginIOC... Remove this comment to see the full error message
    this.prototype.Error = PluginIOCacheError;
  }

  constructor() {
    this.pluginFromId = {};
  }

  get(plugin: Plugin) {
    let existingPlugin;
    if (!(plugin instanceof Plugin)) {
      throw PluginIOCacheError.InvalidArgument('expected a plugin');
    }

    const { id } = plugin;
    if ((existingPlugin = this.fromId(id)) != null) {
      return existingPlugin;
    }

    const iframeConnectorUrl = plugin.get('iframeConnectorUrl') ?? '';
    let iframeConnectorHost = '';
    try {
      iframeConnectorHost = new URL(iframeConnectorUrl).host;
    } catch (err) {
      // unable to parse connector url, odd
    }

    const idOrganizationOwner = plugin.get('idOrganizationOwner');
    const ownedByTrello = [firstPartyPluginsOrg, pluginCiOrg].includes(
      idOrganizationOwner,
    );
    const isDevPluginOnAtlasTunnel =
      environment !== 'prod' &&
      iframeConnectorHost.endsWith('.public.atlastunnel.com');

    const allowedOrigins = [
      '*.trello.services',
      'app.butlerfortrello.com',
      'butlerfortrello.com',
      'trellegi.services.atlassian.com',
      'trellegi.stg.services.atlassian.com',
      // This is Slack integration https://bitbucket.org/atlassian/trello-slack/src/main/power-up/
      'trello-slack.services.atlassian.com',
      'trello-slack.stg.services.atlassian.com',
    ].filter(Boolean);

    if (environment !== 'prod') {
      allowedOrigins.push('*.public.atlastunnel.com');
    }

    const isOnAllowedOrigin =
      iframeConnectorUrl.startsWith('https://') &&
      allowedOrigins.some((hostTest) =>
        hostTest.startsWith('*.')
          ? iframeConnectorHost.endsWith(hostTest.substring(1))
          : iframeConnectorHost === hostTest,
      );

    // Only in the dev environment is the first party plugins org 000000000000000000000000
    // checking this lets us capture localhost dev usage but also ngrok usage
    const isDevPluginsOrg = /^0{24}$/.test(firstPartyPluginsOrg);

    const canUseRestrictedHandlers =
      (ownedByTrello || isDevPluginOnAtlasTunnel) &&
      (isOnAllowedOrigin || isDevPluginsOrg);

    const io = new PluginIO(
      plugin,
      PluginHandlers({
        idPlugin: id,
        allowRestricted: canUseRestrictedHandlers,
      }),
    );

    this.pluginFromId[id] = io;
    return io;
  }

  fromId(id: string) {
    return this.pluginFromId[id];
  }

  drop(idPlugin: string) {
    let plugin;
    if ((plugin = this.pluginFromId[idPlugin]) != null) {
      delete this.pluginFromId[idPlugin];
      return plugin.drop();
    }
  }
}

PluginIOCache.initClass();

const pluginIOCache = new PluginIOCache();

export { pluginIOCache };
