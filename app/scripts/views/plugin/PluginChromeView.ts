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

import _ from 'underscore';

// eslint-disable-next-line no-restricted-imports
import $ from '@trello/jquery';

import { PopOver } from 'app/scripts/views/lib/PopOver';
import { PluginView } from 'app/scripts/views/plugin/PluginView';
import { PluginChromeHeaderTemplate } from 'app/scripts/views/templates/PluginChromeHeaderTemplate';
import { PluginChromeTemplate } from 'app/scripts/views/templates/PluginChromeTemplate';
import { PluginChromeWrapperTemplate } from 'app/scripts/views/templates/PluginChromeWrapperTemplate';

interface PluginChromeHeaderView {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pluginChromeView: any;
}

class PluginChromeHeaderView extends PluginView {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialize({ pluginChromeView }: any) {
    this.pluginChromeView = pluginChromeView;
  }

  events() {
    return { 'click a[data-index].plugin-chrome-header-action': 'clickAction' };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clickAction(e: any) {
    // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    const index = parseInt($(e.currentTarget, this.$el).attr('data-index'), 10);
    const action = this.pluginChromeView.content.actions[index];
    action?.callback?.({ el: e.currentTarget });
  }

  render() {
    this.$el.html(PluginChromeHeaderTemplate(this.pluginChromeView.content));
    return this;
  }
}

export interface PluginChromeView {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $wrapper: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headerView: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isRemoved: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stopResizing: any;
}

export class PluginChromeView extends PluginView {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialize({ content }: any) {
    this.content = content;
    this.retain(this.content);
    return (this.stopResizing = this.stopResizing.bind(this));
  }

  events() {
    return {
      'click .js-close-plugin-chrome': 'clickClose',
      'mousedown .js-resize-board-bar': 'initResize',
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clickClose(e: any) {
    return typeof this.options.fxClose === 'function'
      ? this.options.fxClose()
      : undefined;
  }

  renderOnce() {
    this.headerView = this.subview(PluginChromeHeaderView, this.model, {
      pluginChromeView: this,
    });
    this.$el.html(
      PluginChromeWrapperTemplate({
        fullscreen: this.content.fullscreen,
        resizable: this.content.resizable,
      }),
    );
    this.$wrapper = $('.js-plugin-chrome-content', this.$el);
    this.appendSubview(this.headerView, this.$wrapper);
    this.$wrapper.append(
      PluginChromeTemplate({
        ...this.content,
        popoverIsVisible: PopOver.isVisible,
      }),
    );
    // @ts-expect-error TS(2555): Expected at least 2 arguments, but got 1.
    this.initIFrames(this.model);
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update(options: any) {
    options = _.pick(options, 'actions', 'fullscreen', 'accentColor', 'title');
    Object.assign(this.content, options);
    if (options.fullscreen) {
      this.$wrapper.addClass('fullscreen');
    } else if (options.fullscreen === false) {
      this.$wrapper.removeClass('fullscreen');
    }
    if (options.actions != null) {
      this.retain(this.content.actions);
    }
    this.headerView.render();
    return this;
  }

  close() {
    if (typeof this.content.callback === 'function') {
      this.content.callback();
    }
    this.isRemoved = true;
    return this.remove();
  }

  initResize() {
    if (!_.isFunction(this.options.fxResize)) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resize = (e: any) => {
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      const offset = $('.js-resize-board-bar', this.$el).offset().top;
      const delta = offset - e.clientY;
      return typeof this.options.fxResize === 'function'
        ? this.options.fxResize(delta)
        : undefined;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stopResizing = (e: any) => {
      window.removeEventListener('mousemove', resize);
      return window.removeEventListener('mouseup', stopResizing);
    };

    window.addEventListener('mousemove', resize);
    return window.addEventListener('mouseup', stopResizing);
  }
}
