/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import Hearsay from 'hearsay';
import _ from 'underscore';

import { Auth } from 'app/scripts/db/Auth';
import { debounceSignal } from 'app/scripts/lib/util/debounce-signal';
import type { Board } from 'app/scripts/models/Board';
import type { Card } from 'app/scripts/models/Card';

const signalCache: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
} = {};

function signalName(board: Board, card?: Card) {
  return card ? board.id + card.cid : board.id;
}

const _pluginsChangedSignal = function (board: Board, card?: Card) {
  const snooper = board
    .snoopIdPluginsEnabled()
    .map(function (idPlugins) {
      if (idPlugins.length === 0) {
        return Hearsay.const({});
      }

      const snoopers = idPlugins.map(function (idPlugin) {
        if (card) {
          return Hearsay.combine(
            Auth.me().snoopPluginData(idPlugin),
            board.snoopPluginData(idPlugin),
            card.snoopPluginData(idPlugin),
          );
        } else {
          return Hearsay.combine(
            Auth.me().snoopPluginData(idPlugin),
            board.snoopPluginData(idPlugin),
          );
        }
      });

      return Hearsay.combine(
        ...Array.from(snoopers || []),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ).map((latestPluginData: any) => _.object(idPlugins, latestPluginData));
    })
    // @ts-expect-error
    .latest();

  const signal = snooper.distinct(_.isEqual);

  const debouncedSignal = debounceSignal(signal, 100);

  const unuse = debouncedSignal.use();

  const stopUsing = () => {
    unuse();
    board.off('destroy', stopUsing);
    card?.off('destroy', stopUsing);
  };

  board.once('destroy', stopUsing);
  card?.once('destroy', stopUsing);

  // @ts-expect-error
  board.on();

  return debouncedSignal;
};

const pluginsChangedSignal = function (board: Board, card?: Card) {
  const name = signalName(board, card);
  if (!signalCache[name]) {
    signalCache[name] = _pluginsChangedSignal(board, card).addDisposer(() => {
      delete signalCache[name];
    });
  }
  return signalCache[name];
};

export { pluginsChangedSignal };
