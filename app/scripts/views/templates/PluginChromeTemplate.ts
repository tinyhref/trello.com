/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { sandboxParams } from 'app/scripts/data/plugin-iframe-sandbox';
import { teacupWithHelpers } from 'app/scripts/views/internal/teacupWithHelpers';

const t = teacupWithHelpers('plugin_chrome');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PluginChromeTemplate = t.renderable(function (content: any) {
  let { accentColor } = content;
  const { url, height, fullscreen, popoverIsVisible } = content;
  if (content.type !== 'iframe') {
    return;
  }
  if (accentColor == null || !/^#[a-fA-F0-9]{6}$/.test(accentColor)) {
    accentColor = '#EDEFF0';
  }

  return t.div(
    {
      class: t.classify({
        'plugin-chrome-content': true,
        'js-plugin-iframe-container': true,
        'plugin-iframe-container-pop-over-shown': popoverIsVisible,
      }),
    },
    function () {
      t.iframe('.plugin-iframe', {
        allow: 'microphone; camera',
        sandbox: sandboxParams,
        src: url,
        style: t.stylify({ height: !fullscreen ? `${height}px` : undefined }),
      });
      return t.div('.plugin-iframe-popover-overlay');
    },
  );
});
