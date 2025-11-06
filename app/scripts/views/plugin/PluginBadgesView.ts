/* eslint-disable
    eqeqeq,
*/
// This file was created by bulk-decaffeinate.
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

import { DropboxClaimedHosts, DropboxPluginId } from 'app/scripts/data/dropbox';
import { sendPluginViewedComponentEvent } from 'app/scripts/lib/plugins/plugin-behavioral-analytics';
import {
  isRenderableBadge,
  isValidBadge,
} from 'app/scripts/lib/plugins/pluginValidators';
import { serializeAttachments } from 'app/scripts/views/internal/plugins/PluginModelSerializer';
import { pluginRunner } from 'app/scripts/views/internal/plugins/PluginRunner';
import { pluginsChangedSignal as pluginChangedSignal } from 'app/scripts/views/internal/plugins/PluginsChangedSignal';
import { VIGOR } from 'app/scripts/views/internal/View';
import { PluginBadgeView } from 'app/scripts/views/plugin/PluginBadgeView';
import { PluginView } from 'app/scripts/views/plugin/PluginView';

import dropboxMark from 'resources/images/dropbox-mark.svg';

let dropboxMarkUrl: string;
// plugin validators does not appreciate relative URLs
// this is a bit of a hack for local development
// in production this will be a fully qualified url
if (!dropboxMark.startsWith('https://')) {
  dropboxMarkUrl = window.location.origin + dropboxMark;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const hostForUrl = function (url: any) {
  try {
    return new URL(url).host;
  } catch (error) {
    return url;
  }
};

const globalBadgeCache = {};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let lastIdBoard: any = null;
let trackedFrontBadges = {};

interface PluginBadgesView {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  badgeView: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debounce: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  latestRun: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setTimeout: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  waitForId: any;
}

class PluginBadgesView extends PluginView {
  vigor = VIGOR.NONE;

  static initClass() {
    this.prototype.tagName = 'span';
    this.prototype.badgeView = PluginBadgeView;
  }

  isDetailView() {
    return false;
  }

  runnerOptions() {
    return {
      command: 'card-badges',
      board: this.model.getBoard(),
      card: this.model,
      timeout: 10000,
      options: {
        attachments: serializeAttachments(this.model.attachmentList.models, [
          'id',
          'name',
          'url',
        ]),
      },
    };
  }

  _cacheKey() {
    const { command, board, card } = this.runnerOptions();
    return [command, board?.id, card?.id].join(':');
  }

  requestBadges() {
    // If we're in a background tab it's possible that by the time pluginRunner.all resolves,
    // the model will have been deleted (in which case trying to read this.model.attachmentList
    // would fail).  We wrap the callback with this.callback so it gets cancelled (i.e. becomes
    // a no-op) along with other scheduled events when the view is removed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scheduledCallback = this.callback((pluginBadges: any) => {
      const validBadges = _.filter(pluginBadges, isValidBadge);
      // as part of the dropbox partnership, we will render a Dropbox attachment count
      // even when they are not enabled
      if (
        !this.isDetailView() &&
        !this.model.getBoard()?.isPluginEnabled(DropboxPluginId)
      ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const countDropbox = this.model.attachmentList.filter((a: any) =>
          DropboxClaimedHosts.includes(hostForUrl(a.get('url'))),
        ).length;
        if (countDropbox > 0) {
          validBadges.push({
            icon: dropboxMarkUrl || dropboxMark,
            text: countDropbox,
            idPlugin: DropboxPluginId,
          });
        }
      }
      const currentRun = (this.latestRun || 0) + 1;
      this.latestRun = currentRun;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resolvedBadges: any = [];
      const isCurrent = () => {
        // avoid race conditions where we could render an old run over newer data
        return this.latestRun === currentRun;
      };
      const rerender = () => {
        if (isCurrent()) {
          this.renderResolvedBadges(resolvedBadges);
          // remove callbacks before caching badges; we can't trust the callbacks
          // to still be retained / available when we use the cached badges
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          return (globalBadgeCache[this._cacheKey()] = resolvedBadges.map((b) =>
            _.omit(b, 'callback'),
          ));
        }
      };

      return this.cancelOnRemove(
        Bluebird.map(validBadges, (pluginBadge, index) => {
          this.retain(pluginBadge);

          if (pluginBadge.dynamic != null) {
            const update = () => {
              const updater = pluginBadge
                .dynamic()
                .cancellable()
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .then((badge: any) => {
                  if (!isValidBadge(badge)) {
                    // you may return null or undefined because you want your badge to go away
                    // this will actually make sure when we re-render it will go away
                    resolvedBadges[index] = undefined;
                    rerender();
                    return;
                  }

                  resolvedBadges[index] = badge;
                  rerender();

                  if (badge.refresh && isCurrent()) {
                    let refresh = Math.max(10, badge.refresh);
                    // Add some noise (+-1sec) to refresh interval to reduce clumping
                    refresh += Math.random() * 2 - 1;
                    return this.setTimeout(update, refresh * 1000);
                  }
                })
                // @ts-expect-error TS(2339): Property 'Error' does not exist on type 'PluginRun... Remove this comment to see the full error message
                .catch(pluginRunner.Error.NotHandled, () => {
                  return null;
                });

              this.cancelOnRemove(updater);
              return updater;
            };

            return update();
          } else {
            return (resolvedBadges[index] = pluginBadge);
          }
        }),
      )
        .cancellable()
        .then(() => rerender())
        .catch(Bluebird.CancellationError, function () {});
    });

    return pluginRunner.all(this.runnerOptions()).then(scheduledCallback);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setupEventListeners(debouncedRequestBadges: any) {
    this.listenTo(
      this.model,
      'change:dateLastActivity',
      debouncedRequestBadges,
    );
    this.listenTo(
      this.model.attachmentList,
      'add remove reset change',
      debouncedRequestBadges,
    );
    this.listenTo(
      this.model.customFieldItemList,
      'add remove reset change',
      debouncedRequestBadges,
    );
  }

  renderOnce() {
    let cachedBadges;
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    if ((cachedBadges = globalBadgeCache[this._cacheKey()]) != null) {
      this.renderResolvedBadges(cachedBadges);
    }

    const idBoard = this.model.getBoard()?.id;
    if (idBoard && idBoard !== lastIdBoard) {
      // when we switch boards we should clear out tracking cache
      // that way if we go back to the old board we will track it
      lastIdBoard = idBoard;
      trackedFrontBadges = {};
    }

    this.whenIdle(`plugin_badges_render_${this.cid}`, () => {
      const options = this.runnerOptions();

      this.latestRun = 0;

      const debouncedRequestBadges = this.debounce(() => {
        return this.requestBadges();
      }, 500);

      this.setupEventListeners(debouncedRequestBadges);

      const changeSignal = pluginChangedSignal(options.board, options.card);
      this.subscribe(
        changeSignal,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        _.after(2, (pluginData: any) => debouncedRequestBadges()),
      );

      return this.waitForId(this.model, () => this.requestBadges());
    });

    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trackBadges(idPlugin: any) {
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    if (!trackedFrontBadges[idPlugin]) {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      trackedFrontBadges[idPlugin] = true;

      return sendPluginViewedComponentEvent({
        idPlugin,
        idBoard: this.model.getBoard().id,
        idCard: this.model.id,
        event: {
          componentType: 'badge',
          componentName: 'pupCardBadge',
          source: 'boardScreen',
        },
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderResolvedBadges(pluginBadges: any) {
    const isCardDetail = this.isDetailView();
    const subviews = _.filter(pluginBadges, (badge) =>
      isRenderableBadge(badge, isCardDetail),
    ).map((badge, index) => {
      // track badge views
      this.trackBadges(badge.idPlugin);

      const sv = this.subview(
        this.badgeView,
        this.model,
        { pluginBadge: badge },
        index,
      );
      // We may be re-using a badge view, so make sure to use the latest badge values
      sv.updateBadge(badge);
      return sv;
    });

    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    return this.ensureSubviews(subviews);
  }
}
PluginBadgesView.initClass();
export { PluginBadgesView };
