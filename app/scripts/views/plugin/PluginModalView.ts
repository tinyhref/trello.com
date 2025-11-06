// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { PluginChromeView } from 'app/scripts/views/plugin/PluginChromeView';

interface PluginModalView {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
}

class PluginModalView extends PluginChromeView {
  static initClass() {
    // @ts-expect-error TS(2322): Type 'string' is not assignable to type '() => str... Remove this comment to see the full error message
    this.prototype.className = 'plugin-modal';
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialize({ content }: any) {
    this.content = content;
    return this.retain(this.content);
  }
}
PluginModalView.initClass();
export { PluginModalView };
