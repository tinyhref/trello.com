/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import _ from 'underscore';

import { getFeatureGateAsync } from '@trello/feature-gate-client';
// eslint-disable-next-line no-restricted-imports
import $ from '@trello/jquery';

import { PluginBoardBarView } from 'app/scripts/views/plugin/PluginBoardBarView';
import { isCardBackFocusTrapDisabledState } from 'app/src/components/CardBack/isCardBackFocusTrapDisabledState';

const DEFAULT_HEIGHT = 200;
// what percentage of board view (vertically) a board bar may consume
const MAX_PERCENTAGE = 0.6;
// space dedicated to Trello Chrome around the iframe
const CHROME_SPACE = 44;
// how much vertical space to reserve for board header and a glimpse of your lists
const MINIMUM_REMAINDER_HEIGHT = 180;

interface PluginBoardBar {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  boardBarView: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  desiredHeight: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reactContainer: any;
}

class PluginBoardBar {
  static initClass() {
    // @ts-expect-error TS(2339): Property 'boardBarView' does not exist on type 'ty... Remove this comment to see the full error message
    this.boardBarView = null;
    // @ts-expect-error TS(2339): Property 'desiredHeight' does not exist on type 't... Remove this comment to see the full error message
    this.desiredHeight = DEFAULT_HEIGHT;
    // @ts-expect-error TS(2339): Property 'reactContainer' does not exist on type 't... Remove this comment to see the full error message
    this.reactContainer = null;
  }

  _computeMaxHeight() {
    const boardHeight = $('.board-main-content').height();
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    let maxHeight = MAX_PERCENTAGE * boardHeight - CHROME_SPACE;

    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    if ((1 - MAX_PERCENTAGE) * boardHeight < MINIMUM_REMAINDER_HEIGHT) {
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      maxHeight = boardHeight - CHROME_SPACE - MINIMUM_REMAINDER_HEIGHT;
      if (maxHeight < 0) {
        maxHeight = 0;
      }
    }

    return maxHeight;
  }

  isOpen() {
    return this.boardBarView != null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  restrictHeight(userOverride: any) {
    const $boardBarIframe = $('.plugin-board-bar iframe');
    if (!$boardBarIframe.length) {
      return;
    }

    if (this.desiredHeight < 0) {
      this.desiredHeight = 0;
    }

    const maxHeight = this._computeMaxHeight();
    const actualHeight = Math.min(this.desiredHeight, maxHeight);

    // when restricting height as a result of a user resize we treat desired
    // height as the actual height to prevent oversetting the field making it
    // hard / awkward to shrink
    if (userOverride) {
      this.desiredHeight = actualHeight;
    }

    return $boardBarIframe.height(`${actualHeight}px`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  open(args: any) {
    const { model, content } = args;

    this.close();

    getFeatureGateAsync('ghost_use_react_focus_lock_pups').then(
      (isReactFocusLockPupsEnabled) => {
        if (!isReactFocusLockPupsEnabled) {
          isCardBackFocusTrapDisabledState.setValue(true);
        }
      },
    );

    this.boardBarView = new PluginBoardBarView({
      model,
      content,
      fxClose: this.close.bind(this),
      fxResize: this.incrementDesiredHeight.bind(this),
    });
    this.desiredHeight = content.height || DEFAULT_HEIGHT;

    $('.board-main-content').append(this.boardBarView.render().el);

    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    this.restrictHeight();
    $(window).on(
      'resize.plugin-board-bar',
      // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
      _.throttle(() => this.restrictHeight(), 50),
    );
  }

  close() {
    if (this.isOpen()) {
      $(window).off('resize.plugin-board-bar');
      this.boardBarView.close();
      this.boardBarView = null;
      this.desiredHeight = DEFAULT_HEIGHT;

      getFeatureGateAsync('ghost_use_react_focus_lock_pups').then(
        (isReactFocusLockPupsEnabled) => {
          if (!isReactFocusLockPupsEnabled) {
            isCardBackFocusTrapDisabledState.setValue(false);
          }
        },
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setDesiredHeight(height: any) {
    this.desiredHeight = height;
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    return this.restrictHeight();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  incrementDesiredHeight(delta: any) {
    this.desiredHeight += delta;
    return this.restrictHeight(true);
  }
}
PluginBoardBar.initClass();

const pluginBoardBar = new PluginBoardBar();
export { pluginBoardBar as PluginBoardBar };
