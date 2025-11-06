/* eslint-disable
    eqeqeq,
    no-empty,
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

import Backbone from '@trello/backbone';
// eslint-disable-next-line no-restricted-imports
import $ from '@trello/jquery';
import { getKey, Key } from '@trello/keybindings';
import { TrelloStorage } from '@trello/storage';

import { Auth } from 'app/scripts/db/Auth';
import { dataUriToBlob } from 'app/scripts/lib/util/url/data-uri-to-blob';
import { getTypes } from 'app/scripts/views/internal/data-transfer/Normalize';
import { Alerts } from 'app/scripts/views/lib/Alerts';

const selectElementContents = function (el: HTMLElement | null) {
  if (!el) {
    return;
  }

  const selection = window.getSelection();

  if (!selection) {
    return;
  }

  const range = document.createRange();
  range.selectNodeContents(el);

  selection.removeAllRanges();
  selection.addRange(range);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const showClipboardAlert = function (eventType: any) {
  Alerts.show('card-copied-to-clipboard', 'info', 'trello-clipboard', 5000);

  const me = Auth.me();
  // Only show the instructional alert if they haven't completed a copy/move via pasting.
  if (me && !me.isDismissed(`pasteAlert-${eventType}Card`)) {
    // Set a timeout to let the initial Flag resolve animations first.
    setTimeout(() => {
      Alerts.show(
        `paste-to-${eventType}`,
        'info',
        'trello-clipboard-paste',
        5000,
      );
    }, 2000);
  }
};

class TrelloClipboard {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clearCutTimeout: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isPaused: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pasteImageTimeout: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trigger: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  constructor() {
    this.value = '';
    this.isPaused = false;

    $(document).on('keydown', (e) => {
      if (this.isPaused) return;
      // @ts-expect-error TS(2345): Argument of type 'KeyDownEvent<Document, undefined... Remove this comment to see the full error message
      const key = getKey(e);

      // Only do this if there's something to be put on the clipboard, and it
      // looks like they're starting a copy shortcut
      if (!this.value || !(e.ctrlKey || e.metaKey)) {
        return;
      }

      if ($(e.target).is('#clipboard')) {
        if (key === Key.c) {
          // If a new copy happens, they haven't cut anymore
          this.clearCut();

          showClipboardAlert('copy');
        }
        return;
      }

      if ($(e.target).is('input:visible,textarea:visible')) {
        return;
      }

      // Abort if it looks like they've selected some text (maybe they're trying
      // to copy out a bit of the description or something)
      if (
        (typeof window.getSelection === 'function'
          ? window.getSelection()
          : undefined
        )?.toString()
      ) {
        return;
      }

      if (
        // @ts-expect-error TS(2339): Property 'selection' does not exist on type 'Docum... Remove this comment to see the full error message
        document.selection != null
          ? // @ts-expect-error TS(2339): Property 'selection' does not exist on type 'Docum... Remove this comment to see the full error message
            document.selection.createRange().text
          : undefined
      ) {
        return;
      }

      return _.defer(() => {
        // eslint-disable-next-line @trello/enforce-variable-case
        const $clipboardContainer = $('#clipboard-container');
        $clipboardContainer.empty().show();
        $('<div id="clipboard" contenteditable="true"></div>')
          .text(this.value)
          .appendTo($clipboardContainer)
          .focus()
          .select();
        return selectElementContents(document.getElementById('clipboard'));
      });
    });

    $(document).on('keyup', (e) => {
      if (this.isPaused) return;
      if (this.isClipboard(e.target)) {
        const newValue = $('#clipboard').text();
        if (newValue === '') {
          // They must have used the cut shortcut
          this.setCut(this.value);
          showClipboardAlert('move');
        }
      }

      return this.checkForPastedImage();
    });

    $(document).on('paste', (e) => {
      if (this.isPaused) return;
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      if (!_.isEmpty(getTypes(e.originalEvent.clipboardData))) {
        this.cancelPasteImage();
      }
      // If they pasted something, they aren't cutting anymore ... but let
      // all the other paste handlers run first, so they can check isCut()
      return (this.clearCutTimeout = setTimeout(
        this.clearCut.bind(this),
        1000,
      ));
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set(value: any) {
    this.value = value;
    // eslint-disable-next-line @trello/enforce-variable-case
    const $clipboard = $('#clipboard');
    if ($clipboard.length) {
      $clipboard.text(this.value).focus().select();
      return selectElementContents(document.getElementById('clipboard'));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setCut(value: any) {
    try {
      if (this.clearCutTimeout != null) {
        clearTimeout(this.clearCutTimeout);
        this.clearCutTimeout = null;
      }
      TrelloStorage.set('cut', value);
    } catch (error) {}
  }

  getCut() {
    try {
      return TrelloStorage.get('cut');
    } catch (error) {}
    return null;
  }

  clearCut() {
    try {
      TrelloStorage.unset('cut');
      this.clearCutTimeout = null;
    } catch (error) {}
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isCut(value: any) {
    return value === this.getCut();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isClipboard(element: any) {
    return element.id === 'clipboard';
  }

  clear() {
    return $('#clipboard-container').empty().hide();
  }

  checkForPastedImage() {
    clearTimeout(this.pasteImageTimeout);

    // We have to yield so the image actually shows up in the clipboard
    return (this.pasteImageTimeout = setTimeout(() => {
      // eslint-disable-next-line @trello/enforce-variable-case
      const $pastedImage = $('#clipboard-container').find('img');
      this.clear();
      if ($pastedImage.length > 0) {
        const src = $pastedImage.attr('src');
        // Firefox helpfully uses data: URIs that we can work with, unlike
        // Safari which is currently using useless the "fake-webkit-url"
        // protocol
        // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
        if (/^data:/.test(src)) {
          this.trigger('pasteImage', dataUriToBlob(src));
          return;
        }
      }
    }, 1));
  }

  cancelPasteImage() {
    clearTimeout(this.pasteImageTimeout);
    return this.clear();
  }

  pauseShortcuts() {
    this.isPaused = true;
  }

  resumeShortcuts() {
    this.isPaused = false;
  }
}

_.extend(TrelloClipboard.prototype, Backbone.Events);

export const trelloClipboard = new TrelloClipboard();
