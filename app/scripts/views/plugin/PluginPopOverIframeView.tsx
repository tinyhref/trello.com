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
import { sandboxParams } from 'app/scripts/data/plugin-iframe-sandbox';
import { teacupWithHelpers } from 'app/scripts/views/internal/teacupWithHelpers';
import { VIGOR } from 'app/scripts/views/internal/View';
import { PopOver } from 'app/scripts/views/lib/PopOver';
import { PluginView } from 'app/scripts/views/plugin/PluginView';

const t = teacupWithHelpers();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const template = t.renderable(function (content: any) {
  if (content == null) {
    content = {};
  }
  const { url, height } = content;
  t.iframe('.plugin-iframe', {
    allow: 'microphone; camera',
    sandbox: sandboxParams,
    src: url,
    style: height ? `height:${height}px;` : undefined,
  });
});

interface PluginPopOverIFrameView {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDone: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  title: any;
}

class PluginPopOverIFrameView extends PluginView {
  vigor = VIGOR.NONE;
  static initClass() {
    // @ts-expect-error TS(2339): Property 'keepInDOM' does not exist on type 'Plugi... Remove this comment to see the full error message
    this.prototype.keepInDOM = true;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialize({ title, content, callback }: any) {
    this.title = title;
    this.content = content;
    this.onDone = callback;
    return this.retain(this.onDone);
  }

  getViewTitle() {
    return this.title;
  }

  renderOnce() {
    this.$el.html(template(this.content));

    // @ts-expect-error TS(2555): Expected at least 2 arguments, but got 1.
    this.initIFrames(this.model);

    return this;
  }

  // @ts-expect-error TS(2425): Class 'PluginView' defines instance member propert... Remove this comment to see the full error message
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleIFrameMessage(iframe: any, message: any) {
    switch (message) {
      case 'done':
        if (this.onDone != null) {
          return this.onDone({ el: iframe });
        } else {
          PopOver.hide();
          return;
        }
      default:
    }
  }
}
PluginPopOverIFrameView.initClass();
export { PluginPopOverIFrameView };
