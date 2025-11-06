// This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import _ from 'underscore';

import { teacupWithHelpers } from 'app/scripts/views/internal/teacupWithHelpers';
import { PopOver } from 'app/scripts/views/lib/PopOver';
import { PluginView } from 'app/scripts/views/plugin/PluginView';

const t = teacupWithHelpers('plugin_popover');

const template = t.renderable(function ({
  message,
  confirmText,
  confirmStyle,
  cancelText,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) {
  t.p(() => t.text(message));

  t.input('.js-confirm.full', {
    type: 'submit',
    class:
      confirmStyle === 'danger'
        ? 'nch-button nch-button--danger'
        : 'nch-button nch-button--primary',
    value: confirmText,
  });

  if (cancelText) {
    return t.input('.js-cancel.full', {
      type: 'submit',
      value: cancelText,
    });
  }
});

interface PluginPopOverConfirmView {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  title: any;
}

class PluginPopOverConfirmView extends PluginView {
  static initClass() {
    // @ts-expect-error TS(2339): Property 'keepInDOM' does not exist on type 'Plugi... Remove this comment to see the full error message
    this.prototype.keepInDOM = true;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialize({ title, content }: any) {
    this.title = title;
    this.content = content;
    return this.retain(this.content);
  }

  getViewTitle() {
    return this.title;
  }

  events() {
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      'click a[href]'(e: any) {
        return PopOver.hide();
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      'click .js-confirm': (e: any) => {
        if (_.isFunction(this.content.onConfirm)) {
          return (
            this.content
              .onConfirm({ el: e.currentTarget })
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .catch((err: any) =>
                typeof console !== 'undefined' && console !== null
                  ? console.warn(
                      `Error running Power-Up onConfirm function: ${err.message}`,
                    )
                  : undefined,
              )
          );
        } else {
          return PopOver.popView();
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      'click .js-cancel'(e: any): any {
        // @ts-expect-error TS(2339): Property 'content' does not exist on type '{ 'clic... Remove this comment to see the full error message
        if (_.isFunction(this.content.onCancel)) {
          return (
            // @ts-expect-error TS(2339): Property 'content' does not exist on type '{ 'clic... Remove this comment to see the full error message
            this.content
              .onCancel({ el: e.currentTarget })
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .catch((err: any) =>
                typeof console !== 'undefined' && console !== null
                  ? console.warn(
                      `Error running Power-Up onCancel function: ${err.message}`,
                    )
                  : undefined,
              )
          );
        } else {
          return PopOver.popView();
        }
      },
    };
  }

  renderOnce() {
    this.$el.html(template(this.content));

    return this;
  }
}
PluginPopOverConfirmView.initClass();
export { PluginPopOverConfirmView };
