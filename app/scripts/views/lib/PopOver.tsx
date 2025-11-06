/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS202: Simplify dynamic range loops
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { isValidElement } from 'react';
import FocusLock from 'react-focus-lock';
import _ from 'underscore';

import { isTouch } from '@trello/browser';
import { renderReactRoot } from '@trello/component-wrapper';
import { shouldHandleWindowsFrame } from '@trello/desktop';
import { contains } from '@trello/dom';
// eslint-disable-next-line no-restricted-imports
import $ from '@trello/jquery';
import {
  Key,
  registerShortcut,
  Scope,
  unregisterShortcut,
} from '@trello/keybindings';
import {
  ELEVATION_ATTR,
  getElevation,
  getHighestVisibleElevation,
  registerClickOutsideHandler,
  unregisterClickOutsideHandler,
} from '@trello/layer-manager';

import { ReactWrapper } from 'app/scripts/lib/react/backbone-view-wrapper';
import { WindowSize } from 'app/scripts/lib/window-size';
import { View } from 'app/scripts/views/internal/View';
import { Layout } from 'app/scripts/views/lib/Layout';
import { PopOverReact } from './PopOverReact';

let HEADER_HEIGHT = 44;
const DESKTOP_OFFSET = 32;

if (shouldHandleWindowsFrame()) {
  HEADER_HEIGHT = HEADER_HEIGHT + DESKTOP_OFFSET;
}

class PopOver {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $body: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $popOver: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  argsStack: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  displayType: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fnOnHide: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hardToClose: any;
  isVisible: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reactRoot: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  position: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  positionInterval: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  view: any;

  constructor() {
    this.$body = null;
    this.$popOver = null;
    this.fnOnHide = null;

    this.onShortcut = this.onShortcut.bind(this);
    this.argsStack = [];
    this.position = {};
    this.isVisible = false;
    this.hardToClose = false;
    this.displayType = '';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onShortcut(event: any) {
    this.popView();
    // we assume popovers are always the topmost item, so if we close them on Esc
    // it is safe to stop the event from bubbling, this was added specifically to
    // handle the case where a Power-Up has a modal up, and a popover is opened above it
    event.stopImmediatePropagation();
  }

  init() {
    this.$body = $('body');
    this.$popOver = $('.pop-over');

    // Popover Events
    return (this.handleClickOutside = this.handleClickOutside.bind(this));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleClickOutside(e: any) {
    // We aren't interested in this event if the popover is not visible
    if (!this.isVisible) {
      return;
    }

    // Determine whether the click outside was actually on one of the popover triggers,
    // in which case we should ignore it and let the trigger handle toggling
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wasTriggerClick = this.argsStack.some(function (args: any) {
      if (!args.elem) {
        return false;
      }
      const element = $(args.elem)[0];

      return element != null ? element.contains(e.target) : undefined;
    });

    if (wasTriggerClick) {
      return;
    }

    return this.hide();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contains(el: any) {
    return contains(this.$popOver[0], el);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toggledBy(el: any) {
    return _.any(this.argsStack, (arg) => arg.elem === el);
  }

  // Make sure the popover is still visible when the window is resized
  onWindowResize() {
    if (!this.isVisible) {
      return;
    }

    return this.load(this.argsStack.pop());
  }

  getWindowHeight() {
    let windowHeight = $(window).height();
    if (shouldHandleWindowsFrame()) {
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      windowHeight = windowHeight - 32;
    }
    return windowHeight;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resetTopWhenBeyondBottom(po_top: any, po_bottom: any, po_height: any) {
    let _po_top = po_top;
    const windowHeight = this.getWindowHeight();
    if (WindowSize.fLarge || WindowSize.fExtraLarge) {
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      const s_height = windowHeight + $(window).scrollTop();
      if (po_bottom > s_height) {
        _po_top = s_height - po_height - 8;
      }
      if (po_height > s_height - HEADER_HEIGHT) {
        _po_top = HEADER_HEIGHT;
      }
    }

    return _po_top;
  }

  // Return the new position of the popover
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  calcPos(args: any) {
    let el_left, el_top, top;
    const windowWidth = $(window).width();
    const windowHeight = this.getWindowHeight();

    if (args.maxWidth != null) {
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      if (args.maxWidth > windowWidth) {
        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        this.$popOver.width(windowWidth - 16);
      } else {
        this.$popOver.width(args.maxWidth);
      }
    } else {
      this.$popOver.width('');
    }

    const max_right = windowWidth;
    const w_height = windowHeight;
    const po_width = this.$popOver.outerWidth();

    const elementIsVisible = args.elem != null && $(args.elem).is(':visible');

    if (elementIsVisible) {
      if (args.top != null) {
        ({ top } = args);
      } else if (args.elem != null) {
        // would be in a pretty bad state if this were false…
        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        top = $(args.elem).outerHeight() + 6;
      } else {
        top = 35; // an arbitrary default… could break w/o it.
      }

      if (args.alignRight) {
        el_left =
          // @ts-expect-error TS(2532): Object is possibly 'undefined'.
          $(args.elem).offset().left + $(args.elem).outerWidth() - po_width;
      } else {
        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        el_left = $(args.elem).offset().left;
      }
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      el_top = $(args.elem).offset().top + top;

      // if desktop and windows account for the frame height
      if (shouldHandleWindowsFrame()) {
        el_top = el_top - 32;
      }
    } else if (args.clientx != null && args.clienty != null) {
      el_left = args.clientx;
      el_top = args.clienty;
    }

    // magic number alert! 68 is the height of the global header and a little
    // extra padding for the bottom. we don't want to pop over to overflow past
    // the bottom of the screen.
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    let poMaxHeight = w_height - 68;
    if (!args.hideHeader) {
      poMaxHeight -= this.$popOver.find('.js-pop-over-header').outerHeight();
    }

    // if there is no hook element or it's hidden, don't bother try to position anything
    // prevents wacky jump when trying to change label names and some otherview pops.
    // if we are clicking the board to add a list (clientx, clienty), DO show the board
    if (
      !(args.clientx != null && args.clienty != null) &&
      (!elementIsVisible ||
        !_.include(
          [
            'block',
            'inline-block',
            'inline',
            'table-cell',
            'flex',
            'inline-flex',
          ],
          $(args != null ? args.elem : undefined).css('display'),
        ))
    ) {
      return;
    }

    // TOP

    // ensure that the top of the element is visible
    let po_top = el_top > 0 ? el_top : 5;
    const po_height = this.$popOver.outerHeight();

    let po_bottom = po_top + po_height;
    po_top = this.resetTopWhenBeyondBottom(po_top, po_bottom, po_height);

    // LEFT

    let po_left = el_left > 0 ? el_left : 5;
    const el_right = po_left + po_width + 16;

    // we want to ensure the right corner is on the screen
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    if (el_right > max_right) {
      // move the element back onto the screen
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      po_left = max_right - (po_width + 5);
    }

    // make sure the original args.elem is not overlaid
    if (args.elem) {
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      let elemTop = $(args.elem).offset().top;
      if (shouldHandleWindowsFrame()) {
        elemTop = elemTop - DESKTOP_OFFSET;
      }

      if (
        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        po_top <= elemTop + $(args.elem).outerHeight() &&
        po_bottom >= elemTop
      ) {
        // reposition the popup above the target element
        po_top = elemTop - po_height - 6; // 6 is the same padding used above
        // ensure that the top of the popup is top above the screen
        if (po_top < HEADER_HEIGHT) {
          po_top = HEADER_HEIGHT;
          po_bottom = po_top + po_height;
        } else {
          po_bottom = po_top + po_height;
          po_top = this.resetTopWhenBeyondBottom(po_top, po_bottom, po_height);
        }
      }
    }

    return {
      left: po_left,
      top: po_top,
      contentHeight: poMaxHeight,
    };
  }

  // Loads the supplied view into $po and sets all the applicable class fields
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  load(args: any) {
    // We have to set PopOver.view. Hopefully some day we won't have to do this,
    // but for now the rest of the app assumes we're wont to do it.
    this.view = args.view;
    this.hardToClose = args.hardToClose;
    // Add special CSS classes for special types of popovers
    this.displayType = args.displayType;
    this.$popOver.addClass(this.displayType);

    //
    // React!
    //

    if (!isValidElement(args.reactElement)) {
      throw new Error('PopOver args.reactElement has to be a react element');
    }

    const children = (() => {
      if (_.last(this.argsStack)?.keepInDOM) {
        const oldChildren = _.chain(this.argsStack)
          // eslint-disable-next-line @typescript-eslint/no-shadow
          .filter((args) => args.keepInDOM)
          .pluck('reactElement')
          .value();
        return oldChildren.concat(args.reactElement);
      } else {
        return [args.reactElement];
      }
    })();

    const props = {
      onBack: this.argsStack.length > 0 ? () => this.popView() : null,
      onClose: () => this.hide(),
      getViewTitle: args.getViewTitle,
      hasSafeViewTitle: args.hasSafeViewTitle,
      hideHeader: args.hideHeader,
    };

    this.reactRoot = renderReactRoot(
      <FocusLock returnFocus={true}>
        <PopOverReact {...props}>{children}</PopOverReact>
      </FocusLock>,
      this.$popOver[0],
      false,
      'focus-lock-popover-react',
    );

    const show = () => {
      // Position the popover. We do this here because we need to render it first to calculate its position.
      let left;

      this.position =
        (left = this.calcPos(args)) != null ? left : this.position;

      this.$popOver.css({
        left: this.position.left,
        top: this.position.top,
      });

      this.$popOver.find('.js-pop-over-content').css({
        maxHeight: this.position.contentHeight,
      });

      this.$popOver.addClass('is-shown');
      return this.$popOver.trigger('is-shown');
    };

    if (args.showImmediately) {
      show();
    } else {
      _.defer(show);
    }

    return this.argsStack.push(args);
  }

  // We have legacy code that puts some properties on the view, but now we expect these properties on args.
  // If there are conflicts, args takes precedence.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extractViewArgs(args: any) {
    // If there's a react element already, then it's using the new style
    if (args.reactElement != null) {
      return args;
    }

    // Sometimes we just get a view
    if (args.view == null) {
      args = { view: args };
    }

    // If you pass a view class, instantiate it here
    if (_.isFunction(args.view)) {
      args.view = new args.view(args.options != null ? args.options : {});
    }

    // Now we have the view, check that it's a backbone view
    if (!(args.view instanceof View)) {
      throw new Error('PopOver args.view has to be a backbone instance');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const extractViewFunction = function (view: any, name: any) {
      if (_.isFunction(view[name])) {
        return () => view[name]();
      }
    };

    args.reactElement = <ReactWrapper key={args.view.cid} view={args.view} />;

    return {
      maxWidth: args.view.maxWidth,
      displayType: args.view.displayType,
      keepInDOM: args.view.keepInDOM,
      hideHeader: args.view.hideHeader,
      getViewTitle: extractViewFunction(args.view, 'getViewTitle'),
      hasSafeViewTitle: args.view.hasSafeViewTitle,
      willBePushedDown: extractViewFunction(args.view, 'willBePushedDown'),
      willBePopped: extractViewFunction(args.view, 'willBePopped'),
      ...args,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  show(args: any) {
    // reset
    if (!args.keepEdits) {
      Layout.cancelEdits(args.elActive);
    }

    // Calculate the data-elevation attribute on the popover for interop with @trello/layer-manager
    // If we aren't positioning our popover relative to some element, just increment the highest
    // visible elevation. If we _are_ positioning relative to some element, increment its elevation
    // instead.
    // We want to calculate this _before_ reseting the popover to ensure that 'nested' Popovers that are shown
    // via a Popover.toggle() (NOT a pushView) continue to incement their elevation based on their anchoring
    // element (which may itself be inside a Popover)
    const targetDomNode = args.elem && $(args.elem)[0];
    const elevation = targetDomNode
      ? getElevation(targetDomNode) + 1
      : getHighestVisibleElevation() + 1;

    this.reset();

    // Add the elevation attribute as data-elevation
    this.$popOver.attr(ELEVATION_ATTR, elevation);

    this.load(this.extractViewArgs(args));

    _.defer(() => {
      if (this.$popOver.find('.js-autofocus').length > 0) {
        if (
          isTouch() &&
          this.$popOver
            .find('.js-autofocus:first')
            .hasClass('js-no-touch-autofocus')
        ) {
          return;
        }
        return this.$popOver.find('.js-autofocus:first').focus().select();
      }
    });

    this.isVisible = true;
    if (typeof args.shown === 'function') {
      args.shown(this.$popOver);
    }
    this.fnOnHide = args.hidden;

    this.positionInterval = setInterval(this.checkPosition.bind(this), 150);

    registerShortcut(this.onShortcut, {
      scope: Scope.Popover,
      key: Key.Escape,
    });

    // Register an 'outside click' handler that takes elevations into account
    registerClickOutsideHandler(this.$popOver[0], this.handleClickOutside);

    // Adds an overlay on top of Power-Up iframes so that click events are captured
    // to ensure that Popovers are closed when clicking outside of the popover.
    $('.js-plugin-iframe-container').addClass(
      'plugin-iframe-container-pop-over-shown',
    );
  }

  // We don't really know what's going on in the popover; it might re-render and
  // get bigger than it is right now.  The simplest thing we can do is
  // periodically check and see if we've expanded beyond the bottom of the screen
  // and if so, move the popover up until everything is visible again
  // Also, they might have scrolled and made the popover go of the screen
  checkPosition() {
    if (!this.isVisible) {
      clearInterval(this.positionInterval);
      return;
    }

    const popoverTop = this.$popOver.offset().top;
    const windowScrollTop = $(window).scrollTop();
    if (popoverTop === windowScrollTop) {
      // We can't move the dialog up anymore; don't even bother
      return;
    }

    const windowHeight = this.getWindowHeight();
    const popoverHeight = this.$popOver.outerHeight();

    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    if (popoverTop < windowScrollTop && popoverHeight <= windowHeight) {
      // They've scrolled down, keep the popover in view
      this.$popOver.css({ top: windowScrollTop });
      return;
    }

    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    if (popoverTop + popoverHeight > windowScrollTop + windowHeight) {
      // The popover is extending beyond the bottom of the screen
      const newTop =
        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        windowScrollTop + Math.max(0, windowHeight - popoverHeight);
      if (newTop !== popoverTop) {
        return this.$popOver.css({
          top: newTop,
        });
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pushView(args: any) {
    this.clearDisplayTypes();

    const oldArgs = _.last(this.argsStack);
    oldArgs?.willBePushedDown?.();

    this.load(this.extractViewArgs(args));

    if (this.$popOver.find('.js-autofocus').length > 0) {
      if (
        isTouch() &&
        this.$popOver
          .find('.js-autofocus:first')
          .hasClass('js-no-touch-autofocus')
      ) {
        return;
      }
      return setTimeout(() => {
        return this.$popOver.find('.js-autofocus:first').focus().select();
      }, 10);
    }
  }

  popView(depth = 1) {
    this.clearDisplayTypes();

    for (
      let i = 0, end = depth, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      const oldArgs = _.last(this.argsStack);
      oldArgs?.willBePopped?.();
      (oldArgs != null
        ? oldArgs.reactElement.props
        : undefined
      )?.view?.remove();

      this.argsStack.pop();

      if (_.last(this.argsStack) == null) {
        this.hide();
        return;
      }
    }

    // reload view without rerendering so we don't lose any in-progress input
    const args = this.argsStack.pop();
    args?.willBePushedUp?.();
    this.load(args);

    // wait to focus input because it stops the animation if we
    // focus while animating
    if (this.$popOver.find('.js-autofocus').length > 0) {
      if (
        isTouch() &&
        this.$popOver
          .find('.js-autofocus:first')
          .hasClass('js-no-touch-autofocus')
      ) {
        return;
      }
      return setTimeout(() => {
        return this.$popOver.find('.js-autofocus:first').focus().select();
      }, 10);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toggle(args: any) {
    // We want to hide when we're triggered on the same element. However,
    // the elem argument can either be a jQuery selection or a normal DOM
    // element, so we normalize here.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isSameElement = (e1: any, e2: any) =>
      e1 && e2 && $(e1)[0] === $(e2)[0];

    if (
      _.last(this.argsStack) &&
      isSameElement(_.last(this.argsStack).elem, args.elem)
    ) {
      return this.hide();
    } else {
      return this.show(args);
    }
  }

  hide() {
    clearInterval(this.positionInterval);

    this.$popOver.removeClass('is-shown');

    const lastArgStack = _.last(this.argsStack);

    this.$body.trigger('popover-hide', {
      elem: lastArgStack != null ? lastArgStack.elem : undefined,
    });

    this.reset();

    if ((lastArgStack != null ? lastArgStack.onClose : undefined) != null) {
      lastArgStack.onClose();
    }

    // Removes the overlay on top of Power-Up iframes so that they are clickable again.
    return $('.js-plugin-iframe-container').removeClass(
      'plugin-iframe-container-pop-over-shown',
    );
  }

  reset() {
    this.clearDisplayTypes();

    for (let i = this.argsStack.length - 1; i >= 0; i--) {
      const args = this.argsStack[i];
      if (typeof args.willBePopped === 'function') {
        args.willBePopped();
      }
      (args.reactElement.props != null
        ? args.reactElement.props.view
        : undefined
      )?.remove();
    }

    unregisterShortcut(this.onShortcut);
    this.$popOver.removeAttr(ELEVATION_ATTR);
    unregisterClickOutsideHandler(this.$popOver[0], this.handleClickOutside);

    // Other views reference PopOver.view.
    this.view = null;

    this.argsStack = [];
    this.isVisible = false;
    this.hardToClose = false;
    if (this.reactRoot?.unmount) {
      this.reactRoot.unmount();
    }
    this.reactRoot = null;
    if (typeof this.fnOnHide === 'function') {
      this.fnOnHide(this.$popOver);
    }

    return (this.fnOnHide = null);
  }

  clearDisplayTypes() {
    const classes = [
      'mod-mini-profile',
      'mod-avdetail',
      'mod-search-over',
      'mod-no-header',
      'mod-reaction-selector',
      this.displayType,
    ];
    return this.$popOver.removeClass(classes.join(' '));
  }

  clearStack() {
    return (this.argsStack = []);
  }
}

/** @deprecated Please do not make new uses of this component.  It's slated for removal */
const popOver = new PopOver();

export { popOver as PopOver };
