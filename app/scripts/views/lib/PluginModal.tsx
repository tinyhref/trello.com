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
import { getFeatureGateAsync } from '@trello/feature-gate-client';
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
  getHighestVisibleElevation,
  registerClickOutsideHandler,
  unregisterClickOutsideHandler,
} from '@trello/layer-manager';

import { PopOver } from 'app/scripts/views/lib/PopOver';
import { PluginModalView } from 'app/scripts/views/plugin/PluginModalView';
import { isCardBackFocusTrapDisabledState } from 'app/src/components/CardBack/isCardBackFocusTrapDisabledState';

interface PluginModal {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modalView: any;
}

class PluginModal {
  constructor() {
    this.modalView = null;
    this.onShortcut = this.onShortcut.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  onShortcut() {
    this.close();
  }

  handleClickOutside() {
    return this.close();
  }

  isOpen() {
    return this.modalView != null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update(content: any) {
    if (this.modalView == null) {
      if (typeof console !== 'undefined' && console !== null) {
        console.warn('Warning: No modal open');
      }
      return;
    } else if (content.idPlugin !== this.modalView.content.idPlugin) {
      if (typeof console !== 'undefined' && console !== null) {
        console.warn('Can not update modal you did not open');
      }
      return;
    }
    return this.modalView.update(content);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  open(args: any) {
    const { model, content } = args;

    PopOver.hide();

    this.close();

    getFeatureGateAsync('ghost_use_react_focus_lock_pups').then(
      (isReactFocusLockPupsEnabled) => {
        if (!isReactFocusLockPupsEnabled) {
          isCardBackFocusTrapDisabledState.setValue(true);
        }
      },
    );

    this.modalView = new PluginModalView({
      model,
      content,
      fxClose: this.close.bind(this),
    });

    $('.pop-over').before(this.modalView.render().el);

    registerShortcut(this.onShortcut, {
      scope: Scope.Dialog,
      key: Key.Escape,
    });

    // Register an 'outside click' handler that takes elevations into account and increment the elevation
    // of the modal
    const $chromeContent = $('.js-plugin-chrome-content');
    const elevation = getHighestVisibleElevation() + 1;
    $chromeContent.attr(ELEVATION_ATTR, elevation);
    registerClickOutsideHandler($chromeContent[0], this.handleClickOutside);
  }

  close() {
    if (this.isOpen()) {
      unregisterShortcut(this.onShortcut);

      // Unregister the click outside handler and clear the elevation attribute
      const $chromeContent = $('.js-plugin-chrome-content');
      $chromeContent.removeAttr(ELEVATION_ATTR);
      unregisterClickOutsideHandler($chromeContent[0], this.handleClickOutside);

      this.modalView.close();
      this.modalView = null;

      getFeatureGateAsync('ghost_use_react_focus_lock_pups').then(
        (isReactFocusLockPupsEnabled) => {
          if (!isReactFocusLockPupsEnabled) {
            isCardBackFocusTrapDisabledState.setValue(false);
          }
        },
      );
    }
  }
}

const pluginModal = new PluginModal();
export { pluginModal as PluginModal };
