import { siteDomain } from '@trello/config';
// eslint-disable-next-line no-restricted-imports
import $ from '@trello/jquery';

import { Layout } from 'app/scripts/views/lib/Layout';
import { PopOver } from 'app/scripts/views/lib/PopOver';
import { fileLinkHandler } from 'app/src/fileLinkHandler';
import { isModifierKeyPressed } from 'app/src/isModifierKeyPressed';
import { trelloLinkHandler } from 'app/src/trelloLinkHandler';

export const handleLinkClick = (e: MouseEvent, elem: HTMLAnchorElement) => {
  const nonLinks = ['', '#', 'http://', 'http://#'];
  const href = elem.getAttribute('href');

  if (!href || nonLinks.includes(href)) {
    e?.preventDefault();
  } else if (href.startsWith('file://')) {
    fileLinkHandler(e, elem);
  } else if (href.startsWith('/') || href.startsWith(siteDomain + '/')) {
    trelloLinkHandler(e, elem);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const globalClickHandler = (e: any) => {
  // eslint-disable-next-line @trello/enforce-variable-case
  const $target = $(e.target);

  // This does a blanket selections for any classic fields using
  // 'editable-view.js' that are currently editing (as well as some other
  // selectors). We should aim to move this logic closer to the components that
  // need it (or into the editable-view).
  //
  // The giant if/else-if statement that used to live here would implicitly
  // ignore the Layout.isEditing() check for any clicks inside popovers. Removing
  // this check today causes any popovers that use the selectors checked for in
  // Layout.isEditing() to break (an example of this is the custom fields popover
  // that allows you to customize the options in a 'dropdown' custom field, where
  // you can no longer change the name of the option due to it being immediately
  // canceled without this check).
  //
  // Removal tracked in: FEPLAT-505

  if (e.target instanceof Element) {
    const clickInPopover =
      PopOver.isVisible && e.target.closest('.pop-over') !== null;

    // This checks to see if the click event originated within an AtlasKit Editor
    // popup component (eg, text formatting dropdown) and if so, bypasses the
    // cancelEdits call.
    const clickInEditorPopup = e.target.closest('[data-editor-popup]') !== null;

    // This checks to see if the click event originated within the Editor AI prompt
    // content area and if so, bypasses the cancelEdits call.
    const clickInEditorAIScreen = e.target.closest('.ai-modal-screen') !== null;

    // This checks to see if the click event originated within a AtlasKit Portal container.
    // I.e. When there is a smart card in the description editor and a user clicks the preview button.
    // We don't want to close the editor or the card back during clicks in this portal.
    const clickInAtlassianPortal =
      e.target.closest('.atlaskit-portal-container') !== null;

    if (
      !clickInPopover &&
      !clickInEditorPopup &&
      !clickInEditorAIScreen &&
      !clickInAtlassianPortal &&
      Layout.isEditing()
    ) {
      Layout.cancelEdits();
    }
  }

  // eslint-disable-next-line @trello/enforce-variable-case
  const $a = $target.closest('a');
  // If it's not a link or they're trying to do some fancy click (that opens in
  // a new tab, etc) don't try to subvert it
  if ($a.length && !isModifierKeyPressed(e)) {
    handleLinkClick(e, $a[0]);
  }
};
