import { clientVersion } from '@trello/config';
// eslint-disable-next-line no-restricted-imports
import $ from '@trello/jquery';

$(document).ajaxSend(function (e, xhr, settings) {
  // We only want to set this header on local requests, otherwise we'll break
  // things like loading off domain plugins
  if (settings.url && settings.url.indexOf('/') === 0) {
    xhr.setRequestHeader('X-Trello-Client-Version', clientVersion);
  }
});
