// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { teacupWithHelpers } from 'app/scripts/views/internal/teacupWithHelpers';

const t = teacupWithHelpers('plugin_chrome');

export const PluginChromeWrapperTemplate = t.renderable(function ({
  fullscreen,
  resizable,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) {
  if (resizable) {
    return t.div(
      '.js-plugin-chrome-content.plugin-chrome-wrapper.u-relative',
      () =>
        t.div('.js-resize-board-bar.resize-handle-wrapper', () =>
          t.div('.board-bar-resize-handle'),
        ),
    );
  } else if (fullscreen) {
    return t.div('.js-plugin-chrome-content.plugin-chrome-wrapper.fullscreen');
  } else {
    return t.div('.js-plugin-chrome-content.plugin-chrome-wrapper');
  }
});
