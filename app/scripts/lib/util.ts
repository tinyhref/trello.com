/* eslint-disable eqeqeq, @trello/disallow-filenames */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS203: Remove `|| {}` from converted for-own loops
 * DS204: Change includes calls to have a more natural evaluation order
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import _ from 'underscore';

import { Cookies } from '@trello/cookies';
import {
  biggestPreview,
  previewBetween,
  smallestPreview,
  smallestPreviewBetween,
  smallestPreviewBiggerThan,
} from '@trello/image-previews';
// eslint-disable-next-line no-restricted-imports
import $ from '@trello/jquery';
import { Key } from '@trello/keybindings';
import { getCsrfRequestPayload } from '@trello/session-cookie/csrf';

import type { Member } from '../models/Member';

function isTextElement(el: Element) {
  // Because input[type=text] and input[type=submit] are both instances of
  // HTMLInputElement, the spec requires that accessing the properties of
  // non-text type inputs throw an exception, and provides no way to detect
  // whether the element is actually textual. We attempt to short-circuit
  // for common known types, but to support new input types being added or
  // unknown types falling back to text input, the final word is hacky
  // exception testing.
  // See http://www.w3.org/TR/html5/forms.html#textFieldSelection

  if (el instanceof HTMLTextAreaElement) {
    return true;
  }

  if (!(el instanceof HTMLInputElement)) {
    return false;
  }

  if (['text', 'email', 'password', 'search'].includes(el.type)) {
    return true;
  }

  if (['submit', 'reset', 'button', 'checkbox'].includes(el.type)) {
    return false;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    el.selectionStart;
    return true;
  } catch (error) {
    return false;
  }
}

// Find the word from the previous word break up until the cursor
function getWordFromIndex(val = '', idx: number) {
  // get the most recent word break
  let start = Math.max(
    val.lastIndexOf('\n', idx - 1),
    val.lastIndexOf(' ', idx - 1),
  );
  start += 1;

  // trim obvious punctuation from the start of the word
  // handle : specially since it can be used for emoji, but we don't want it
  // to interfere with @mentions (e.g. cc:@someone)
  while (/[()[\]/\\;"'&]|:@/.test(val[start])) {
    start++;
  }

  const end = idx;

  const length = end - start;
  const str = val.slice(start, end);

  return {
    start,
    end,
    length,
    str,
  };
}

function isInPosition(
  index: number,
  allItems: { id: string }[],
  item: { id: string },
) {
  if ((item != null ? item.id : undefined) == null) {
    return false;
  }
  const itemAtPosition = allItems[index];
  return (itemAtPosition != null ? itemAtPosition.id : undefined) === item.id;
}

function makeHttp(url: string) {
  if (!url) {
    return '';
  }
  url = url.replace(/^[a-z]*:\/*/i, '');
  return `http://${url}`;
}

function getProtocol(url: string) {
  let left;
  if (!url) {
    return '';
  }
  return (left = new RegExp(`^([a-z]+):`, 'i').exec(url)?.[1]) != null
    ? left
    : '';
}

function _pad(str: string, len: number, padChr: string, leftPad: boolean) {
  // Pad doesn't make much sense on non-strings, does it?
  if (padChr == null) {
    padChr = ' ';
  }
  str = str.toString();

  if (str.length > len) {
    return str.substr(0, len);
  } else {
    const amtPadding = len - str.length;
    const padding = padChr.repeat(amtPadding);

    if (leftPad) {
      return padding + str;
    } else {
      return str + padding;
    }
  }
}

export const Util = {
  spacing: 16384, // 2^14

  pluralize(val: string) {
    return `${val}s`;
  },

  fileExt(val: string) {
    let left;

    return (left = /\.([a-z0-9]+)$/i.exec(val)?.[1]?.toLowerCase()) != null
      ? left
      : null;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  traverse(obj: any, path: string[] | string) {
    if (_.isEmpty(path) || !obj) {
      return obj;
    }

    if (_.isArray(path)) {
      for (const key of Array.from(path)) {
        obj = obj[key];
        if (!obj) {
          break;
        }
      }

      return obj;
    } else {
      return obj[path];
    }
  },

  // via http://simonwillison.net/2006/Jan/20/escape/
  escapeForRegex(text: string) {
    return text != null
      ? text.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, '\\$&')
      : undefined;
  },

  /**
   * @deprecated in favor of `getMilliseconds()` from `@trello/time`
   */
  getMs({
    days,
    hours,
    minutes,
    seconds,
    ms,
    years,
    months,
    weeks,
  }: {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    ms?: number;
    years?: number;
    months?: number;
    weeks?: number;
  }) {
    if (days == null) {
      days = 0;
    }
    if (hours == null) {
      hours = 0;
    }
    if (minutes == null) {
      minutes = 0;
    }
    if (seconds == null) {
      seconds = 0;
    }
    if (ms == null) {
      ms = 0;
    }

    if (years) {
      days += years * 365;
    }
    if (months) {
      days += months * 30;
    }
    if (weeks) {
      days += weeks * 7;
    }

    hours += days * 24;
    minutes += hours * 60;
    seconds += minutes * 60;

    ms += seconds * 1000;
    return ms;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dateAfter(args: any) {
    const date =
      (args != null ? args.date : undefined) != null
        ? args != null
          ? args.date
          : undefined
        : new Date();
    return new Date(date.getTime() + Util.getMs(args));
  },

  idToDate(id: string) {
    return new Date(
      // @ts-expect-error
      1000 * parseInt(id != null ? id.substr(0, 8) : undefined, 16),
    );
  },

  smallestPreviewBiggerThan,
  previewBetween,
  smallestPreviewBetween,
  biggestPreview,
  smallestPreview,

  checkEmail(email: string, additionalChars?: string) {
    if (additionalChars == null) {
      additionalChars = '';
    }
    return new RegExp(
      `\
^\
[^"@\\s\\[\\]\\(\\),:;<>\\\\]+\
@\
[-a-z0-9\\.${additionalChars}]+\
\\.\
[a-z${additionalChars}]+\
$\
`,
      'i',
    ).test(email);
  },

  rpad(str: string, len: number, padChr: string) {
    return _pad(str, len, padChr, false);
  },

  lpad(str: string, len: number, padChr: string) {
    return _pad(str, len, padChr, true);
  },

  sanitizeWebAddress(url: string) {
    let needle;
    if (((needle = getProtocol(url)), !['http', 'https'].includes(needle))) {
      return makeHttp(url);
    } else {
      return url;
    }
  },

  calcPos(
    index: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    allItems: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    item?: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fxFilter?: ((model: any) => boolean) | null,
    includeItem?: boolean,
  ) {
    const indexStep = 65536; // 2^16
    const items = allItems.select(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (c: any) =>
        (!(item != null && item.id === c.id) || includeItem) &&
        (!fxFilter || fxFilter(c)),
    );

    // if the item is in position no point in moving it around
    if (isInPosition(index, items, item)) {
      return item.pos != null ? item.pos : item.get('pos');
    }

    const indexBounded = Math.min(Math.max(index, 0), items.length);

    const itemPrev = items[indexBounded - 1];
    const itemNext = items[indexBounded];

    const posItemCurr = (item != null ? item.get('pos') : undefined) || -1;

    const posItemPrev = itemPrev != null ? itemPrev.get('pos') : -1;
    const posItemNext = itemNext != null ? itemNext.get('pos') : -1;

    if (posItemNext === -1) {
      // Ensure that the new pos comes after the prev card pos
      if (item && posItemCurr > posItemPrev) {
        // it's already after so no need to update
        return posItemCurr;
      } else {
        // bump it one past the last item
        return posItemPrev + indexStep;
      }
    } else {
      if (item && posItemCurr > posItemPrev && posItemCurr < posItemNext) {
        return posItemCurr;
      } else if (posItemPrev >= 0) {
        return (posItemNext + posItemPrev) / 2;
      } else {
        // halve the pos of the top item
        return posItemNext / 2;
      }
    }
  },

  navMenuList(parentEl: JQuery, item: string, key: string) {
    let elem, nextEl, prevEl;
    const items = parentEl.find(item);

    const selectedEl = items.filter('.selected').first()[0];
    const sIndex = _.indexOf(items, selectedEl);

    const firstEl = items[0];
    const lastEl = items[items.length - 1];

    if (sIndex - 1 < 0) {
      prevEl = lastEl;
    } else {
      prevEl = items[sIndex - 1];
    }

    if (sIndex + 1 > items.length) {
      nextEl = firstEl;
    } else {
      nextEl = items[sIndex + 1];
    }

    if (key === Key.ArrowDown) {
      elem = nextEl;
    }

    if (key === Key.ArrowUp) {
      elem = prevEl;
    }

    // @ts-expect-error
    return Util.selectMenuItem(parentEl, item, elem);
  },

  selectMenuItem(parentEl: JQuery, items: string, elem: HTMLElement | JQuery) {
    parentEl.find(items).removeClass('selected');
    return $(elem).addClass('selected');
  },

  insertSelection(
    textarea: JQuery | JQueryStatic,
    newtext: string,
    start?: number,
    end?: number,
  ) {
    let after, before, separator;
    textarea = Util.getElem(textarea);
    // eslint-disable-next-line @trello/enforce-variable-case
    const $textarea = $(textarea);
    const val = $textarea.val();

    if (start != null || end != null) {
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      before = val.substring(0, start);
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      after = val.substring(end);
      // @ts-expect-error
      Util.setCaretPosition(textarea, start + `${newtext}`.length);
    } else {
      before = val;
      after = '';
    }

    if (/\S$/.test(before)) {
      separator = ' ';
    } else {
      separator = '';
    }

    $textarea.val(before + separator + newtext + after);
    Util.setCaretPosition(
      textarea,
      before.length + separator.length + newtext.length,
    );

    $textarea.focus();
    return $textarea.trigger('mutated');
  },

  getWordFromCaret(textarea: HTMLElement | JQuery | JQueryStatic) {
    textarea = Util.getElem(textarea);

    const val = $(textarea).val();
    const idx = Util.getCaretPosition(textarea);

    // @ts-expect-error TS(2345): Argument of type 'string | number | string[] | und... Remove this comment to see the full error message
    return getWordFromIndex(val, idx);
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCaretPosition(textarea: any) {
    let caretPos;
    textarea = Util.getElem(textarea);

    if (textarea?.selectionStart != null) {
      caretPos = textarea.selectionStart;
      // @ts-expect-error TS(2769): No overload matches this call.
    } else if (Array.from(document).includes('selection')) {
      //IE support
      textarea.focus();
      // @ts-expect-error TS(2339): Property 'selection' does not exist on type 'Docum... Remove this comment to see the full error message
      const selection = document.selection.createRange();
      // @ts-expect-error TS(2339): Property 'selection' does not exist on type 'Docum... Remove this comment to see the full error message
      const selectionLength = document.selection.createRange().text.length;
      selection.moveStart('character', -textarea.value.length);
      caretPos = selection.text.length - selectionLength;
    }

    return caretPos;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setCaretPosition(ctrl: any, pos: any) {
    ctrl = Util.getElem(ctrl);

    if (ctrl.setSelectionRange) {
      ctrl.focus();
      return ctrl.setSelectionRange(pos, pos);
    } else if (ctrl.createTextRange) {
      const range = ctrl.createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      return range.select();
    }
  },

  setCaretAtEnd(input: Element | JQuery<HTMLElement> | null) {
    if (input) {
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      const end = $(input).val().length;
      return Util.setCaretPosition(input, end);
    }
  },

  getMemNameArray(mem: Member) {
    return (
      _.chain(['username', 'fullName', 'initials', 'email'])
        // @ts-expect-error
        .map((attr) => mem.get(attr)?.toLowerCase().split(/\s+/))
        .compact()
        .flatten()
        .value()
    );
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getMemNameArrayFromId(modelCache: any, id: string) {
    let mem;
    if ((mem = modelCache.get('Member', id)) != null) {
      return Util.getMemNameArray(mem);
    } else {
      return [];
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validFileSize(file: any, limit?: number) {
    if (limit == null) {
      limit = 10 * 1024 * 1024;
    }
    return (file != null ? file.size : undefined) < limit;
  },

  /**
   * Submits a file upload form
   *
   * @param _token @deprecated Token value is now retrieved via getCsrfRequestPayload
   * @param input
   * @param next
   */
  uploadFile(
    _token: string | null,
    input: JQuery,
    next: (error?: string) => void,
  ) {
    const name = _.uniqueId('iframe');

    const elIframe = $('<iframe>')
      .attr('name', name)
      .css('display', 'none')
      .appendTo('body')
      .on('load', function (e) {
        let response;
        _.defer(() => elIframe.remove());
        try {
          response = elIframe.contents().text();
        } catch (error) {
          // If we're in IE and the response is anything other than 200, the iframe
          // ends up in a different security domain and we can't read its contents
          return next('File too large');
        }
        if (/File too large/i.test(response)) {
          return next(response);
        } else {
          return next();
        }
      });

    const { dsc } = getCsrfRequestPayload();
    if (dsc) {
      input
        .closest('form')
        .attr('target', name)
        .find('input[name=dsc]')
        .val(dsc)
        .end();
    }
    input.closest('form').submit();

    return _.defer(() => input.val(''));
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hasValidInviteTokenFor(model: any, member?: Member) {
    const inviteToken = Util.inviteTokenFor(model.id);
    if (inviteToken == null) {
      return false;
    }

    if (
      member?.isLoggedIn() &&
      member.get('id') !== inviteToken.split('-')[0]
    ) {
      return false;
    }

    const ghostMember = model.modelCache.get(
      'Member',
      inviteToken.split('-')[0],
    );
    if (ghostMember == null) {
      return false;
    }
    if (model.getMemberType(ghostMember) === 'pending') {
      return true;
    }

    return model.isMember(ghostMember) && model.get('memberType') === 'ghost';
  },

  inviteTokenFor(idModel: string) {
    return Cookies.get(`invite-token-${idModel}`);
  },

  // Normalize an input parameter to
  getElem(jqOrElem: HTMLElement | JQuery | JQueryStatic) {
    if (jqOrElem instanceof $) {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      return jqOrElem[0];
    } else {
      return jqOrElem;
    }
  },

  // A polyfill for getting transforms objects. It's not possible to get
  // individual parts of a transform like scale, rotate, translate, etc. so we
  // have to get the whole transform matrix then get individual parts.
  getElemTransformMatrix(elem: JQuery) {
    const matrix =
      elem.css('-webkit-transform') ||
      elem.css('-moz-transform') ||
      elem.css('-ms-transform') ||
      elem.css('-o-transform') ||
      elem.css('transform');

    // JavaScript returns a "none" string if there is not transform... so
    // let's return null instead so we can check for existence later.
    if (matrix !== 'none') {
      return matrix;
    } else {
      return null;
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getMatrixDegrees(matrix: any) {
    const values = matrix.split('(')[1].split(')')[0].split(',');
    const [a, b] = values;
    return Math.round(Math.atan2(b, a) * (180 / Math.PI));
  },

  // This seems to only be used by StickerView and StickerEditView and should probably be moved out of this file.
  getDegrees(y: number, x: number) {
    return Math.round(Math.atan2(y, x) * (180 / Math.PI));
  },

  // Help the Garbage Collector out by detaching everything from the object
  // We wait a bit (for all the callbacks, etc to fire) to avoid any issues
  // with callbacks that might be firing at the same time as our transition
  _runShredders() {
    // @ts-expect-error TS(2339): Property '_shredders' does not exist on type '{ sp... Remove this comment to see the full error message
    const shredders = Util._shredders;
    const now = new Date();
    // @ts-expect-error TS(2339): Property '_shredders' does not exist on type '{ sp... Remove this comment to see the full error message
    Util._shredders = [];
    for (const entry of Array.from(shredders)) {
      // @ts-expect-error TS(2571): Object is of type 'unknown'.
      if (now > entry.time) {
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        entry.fn();
      } else {
        // @ts-expect-error TS(2339): Property '_shredders' does not exist on type '{ sp... Remove this comment to see the full error message
        Util._shredders.push(entry);
      }
    }

    // @ts-expect-error TS(2339): Property '_shredTimeout' does not exist on type '{... Remove this comment to see the full error message
    Util._shredTimeout = null;
    return Util._startShredTimer();
  },

  _startShredTimer() {
    // @ts-expect-error TS(2339): Property '_shredTimeout' does not exist on type '{... Remove this comment to see the full error message
    if (!Util._shredTimeout && Util._shredders.length > 0) {
      // @ts-expect-error TS(2339): Property '_shredTimeout' does not exist on type '{... Remove this comment to see the full error message
      return Util._shredTimeout != null
        ? // @ts-expect-error TS(2339): Property '_shredTimeout' does not exist on type '{... Remove this comment to see the full error message
          Util._shredTimeout
        : // @ts-expect-error TS(2339): Property '_shredTimeout' does not exist on type '{... Remove this comment to see the full error message
          (Util._shredTimeout = setTimeout(
            Util._runShredders,
            Util.getMs({ seconds: 3 }),
          ));
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  shred(obj: any) {
    // @ts-expect-error TS(2339): Property '_shredders' does not exist on type '{ sp... Remove this comment to see the full error message
    if (Util._shredders == null) {
      // @ts-expect-error TS(2339): Property '_shredders' does not exist on type '{ sp... Remove this comment to see the full error message
      Util._shredders = [];
    }
    // @ts-expect-error TS(2339): Property '_shredders' does not exist on type '{ sp... Remove this comment to see the full error message
    Util._shredders.push({
      time: Util.dateAfter({ seconds: 20 }),
      fn: () => {
        return (() => {
          const result = [];
          for (const key of Object.keys(obj || {})) {
            result.push(delete obj[key]);
          }
          return result;
        })();
      },
    });

    return Util._startShredTimer();
  },

  relativeUrl(url: string) {
    return url.replace(new RegExp(`^[a-z]+://[^/]+`), '');
  },

  // This seems to only be used by CardDetailViewChecklist and should probably be moved out of this file.
  withoutAlteringSelection(body: () => void) {
    const { activeElement } = document;
    // @ts-expect-error TS(2769): No overload matches this call.
    // eslint-disable-next-line @trello/enforce-variable-case
    const $activeElement = $(activeElement);
    // @ts-expect-error TS(2339): Property 'is' does not exist on type 'JQueryStatic... Remove this comment to see the full error message
    const focused = $activeElement.is(':focus');
    if (activeElement != null && isTextElement(activeElement)) {
      let direction, end, start, startCompatibility;
      // @ts-expect-error TS(2339): Property 'selectionStart' does not exist on type '... Remove this comment to see the full error message
      if (activeElement.selectionStart) {
        // @ts-expect-error TS(2339): Property 'selectionStart' does not exist on type '... Remove this comment to see the full error message
        start = activeElement.selectionStart;
        // @ts-expect-error TS(2339): Property 'selectionEnd' does not exist on type 'El... Remove this comment to see the full error message
        end = activeElement.selectionEnd;
        // @ts-expect-error TS(2339): Property 'selectionDirection' does not exist on ty... Remove this comment to see the full error message
        direction = activeElement.selectionDirection;
      } else {
        startCompatibility = Util.getCaretPosition(activeElement);
      }
      body();
      if (start) {
        // @ts-expect-error TS(2339): Property 'setSelectionRange' does not exist on typ... Remove this comment to see the full error message
        activeElement.setSelectionRange(start, end, direction);
      } else if (startCompatibility) {
        Util.setCaretPosition(activeElement, startCompatibility);
      }

      if (focused) {
        // @ts-expect-error TS(2339): Property 'focus' does not exist on type 'JQuerySta... Remove this comment to see the full error message
        $activeElement.focus();
      }
    } else {
      body();
    }
  },
};
