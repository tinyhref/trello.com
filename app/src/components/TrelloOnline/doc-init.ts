/* eslint-disable @trello/export-matches-filename */

import _ from 'underscore';

import { asString as osAndBrowserVersionString } from '@trello/browser';
// eslint-disable-next-line no-restricted-imports
import $ from '@trello/jquery';
import { getKey, Key } from '@trello/keybindings';

import { Auth } from 'app/scripts/db/Auth';
import { ApiAjax } from 'app/scripts/network/ApiAjax';
import { Alerts } from 'app/scripts/views/lib/Alerts';
import { Layout } from 'app/scripts/views/lib/Layout';
import { PopOver } from 'app/scripts/views/lib/PopOver';
import { globalClickHandler } from 'app/src/globalClickHandler';

export const domReady = () => {
  // eslint-disable-next-line @trello/enforce-variable-case
  const $document = $(document);

  $('meta[name=apple-itunes-app]').attr(
    'content',
    `app-id=461504587, app-argument=${location.href}`,
  );

  $('#trello-root').addClass(osAndBrowserVersionString);

  let docMouseDownTarget: Document | null = null;

  // this is to prevent chrome's errant clicks from deselecting text (Trelp-977)
  $document.on('mousedown', function (e) {
    docMouseDownTarget = e.target;
  });

  $document.on(
    'click',
    '.js-resend-confirmation-email',
    _.throttle(() => {
      return ApiAjax({
        type: 'POST',
        url: '/resendValidate',
        data: {
          email: Auth.me().get('email'),
        },
        success() {
          return Alerts.flash('email sent', 'confirm', 'email');
        },
      });
    }, 60000),
  );

  $document.on('click', function (e) {
    if ($(e.target).closest('.js-react-root').length) {
      return;
    }

    // if targets don't match, this is a chrome bugged click (Trelp-977)
    const isRealClick = docMouseDownTarget === e.target;
    docMouseDownTarget = null;

    // quick editor clicks are handled on the quick-card-editor itself, so
    // if quick editor exists, it's open, and we need to ignore it
    const isQuickEditOpen = $('.quick-card-editor').length > 0;

    if (!isQuickEditOpen || isRealClick) {
      return globalClickHandler(e);
    }
  });

  // Close all on esc

  $document.on('keyup', function (e) {
    // @ts-expect-error TS(2345): Argument of type 'KeyUpEvent<Document, undefined,' ... Remove this comment to see the full error message
    const key = getKey(e);
    if (key === Key.Escape) {
      e.preventDefault();

      if (Layout.isEditing()) {
        return Layout.cancelEdits();
      } else if ($('.new-comment').hasClass('focus')) {
        return $('.new-comment').removeClass('focus').find('textarea').blur();
      } else {
        $('input').blur();

        return $('textarea').blur();
      }
    }
  });

  // Disallow dragging of anything that isn't a .ui-draggable,
  // so we don't accidentally trigger our drag/drop handlers
  $document.on('dragstart', (e) => {
    return (
      $(e.target).closest('.ui-draggable, .js-draggable, [draggable="true"]')
        .length > 0
    );
  });
};

export const initializeLayers = () => {
  PopOver.init();
  window.onpageshow = function (event) {
    if (event.persisted) {
      window.location.reload();
    }
  };
};
