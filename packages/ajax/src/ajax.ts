// eslint-disable-next-line no-restricted-imports
import type { AjaxSettings, DoneCallback, PlainObject } from '@trello/jquery';
// eslint-disable-next-line no-restricted-imports
import $ from '@trello/jquery';

/** @deprecated this is the old way, do something new */
export const ajaxGet = (
  url: string,
  data: PlainObject | string | null,
  success: DoneCallback,
): JQuery.jqXHR<unknown> => {
  if (data === null) {
    return $.get(url, success);
  }

  return $.get(url, data, success);
};

/** @deprecated this is the old way, do something new */
export const ajaxPost = (
  url: string,
  data: PlainObject | string,
  success: DoneCallback,
): JQuery.jqXHR<unknown> => {
  return $.post(url, data, success);
};

/** @deprecated this is the old way, do something new */
export const ajax = (settings: AjaxSettings): JQuery.jqXHR<unknown> => {
  return $.ajax(settings);
};
