/* eslint-disable
    eqeqeq,
*/

/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { deepReplace } from 'app/scripts/lib/util/deep-replace';
import { PluginOptions as pluginOptions } from 'app/scripts/views/internal/plugins/PluginOptions';

/* eslint-disable-next-line @trello/enforce-variable-case, @typescript-eslint/no-explicit-any */
const PluginProcessCallbacks = (fromPlugin: any, runCommand: any) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deepReplace(fromPlugin, function (value: any) {
    let ref;
    if (value != null && (ref = value._callback) != null) {
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-shadow */
      const actionFx = (ref: any, action: any) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function (runOptions: any) {
          if (runOptions == null) {
            runOptions = {};
          }
          return runCommand({
            ...runOptions,
            command: 'callback',

            options: {
              action,
              callback: ref,
              options: pluginOptions(runOptions.options),
            },
          });
        };
      const fx = actionFx(ref, 'run');
      // @ts-expect-error TS(2339): Property 'retain' does not exist on type '(runOpti... Remove this comment to see the full error message
      fx.retain = actionFx(ref, 'retain');
      // @ts-expect-error TS(2339): Property 'release' does not exist on type '(runOpt... Remove this comment to see the full error message
      fx.release = actionFx(ref, 'release');
      return fx;
    }
  });

export { PluginProcessCallbacks };
