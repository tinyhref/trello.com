/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS203: Remove `|| {}` from converted for-own loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// @ts-expect-error TS(7016): Could not find a declaration file for module 'prot... Remove this comment to see the full error message
import protoExtend from 'proto-extend';
import _ from 'underscore';

import { normalizeKeyPath } from 'app/scripts/lib/babble';
import { l } from 'app/scripts/lib/localize';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const stringifyValues = (obj: any) =>
  _.object(
    (() => {
      const result = [];
      for (const key of Object.keys(obj || {})) {
        const value = obj[key] ?? '';
        result.push([key, value.toString()]);
      }
      return result;
    })(),
  );
const methods = {
  format() {
    // @ts-expect-error TS(2339): Property 'raw' does not exist on type '{ format():... Remove this comment to see the full error message
    // eslint-disable-next-line prefer-spread
    this.raw(this.l.apply(this, arguments));
  },

  // For use in cases where the <span> added by @raw won't work, e.g. inside
  // an option.  Note that any HTML in the translation is going to be escaped.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formatText(): any {
    // @ts-expect-error TS(2339): Property 'text' does not exist on type '{ format()... Remove this comment to see the full error message
    // eslint-disable-next-line prefer-spread
    return this.text(this.l.apply(this, arguments));
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  classify(hash: any) {
    return (() => {
      const result = [];
      for (const key in hash) {
        const value = hash[key];
        if (value) {
          result.push(key);
        }
      }
      return result;
    })().join(' ');
  },

  urlify(url: string) {
    url = url
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)');
    return `url('${url}')`;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stylify(hash: any) {
    return (() => {
      const result = [];
      for (const key in hash) {
        const value = hash[key];
        if (value) {
          result.push(`${key}: ${value};`);
        }
      }
      return result;
    })().join('');
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addRecolorParam(url: any, param: any) {
    // only add the parameter if it's not a data url, because adding the
    // parameter to a data url will break the url. A data url can't respond to the
    // param anyway, of course
    if (/^data:/.test(url)) {
      return url;
    } else {
      return url + param;
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  optionSelected(selected: any, props: any, body: any): any {
    if (selected) {
      props = {
        selected: 'selected',
        ...props,
      };
    }
    // @ts-expect-error TS(2339): Property 'option' does not exist on type '{ format... Remove this comment to see the full error message
    return this.option(props, body);
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  check(val: any, key: any) {
    // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
    this.format(key);
    // @ts-expect-error TS(2339): Property 'text' does not exist on type '{ format()... Remove this comment to see the full error message
    this.text(' ');
    if (val) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      this.icon('check');
      // @ts-expect-error TS(2339): Property 'text' does not exist on type '{ format()... Remove this comment to see the full error message
      this.text(' ');
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon(name: any, textKey: any, properties: any) {
    if (properties == null) {
      properties = {};
    }
    if (typeof textKey === 'object') {
      properties = textKey;
      textKey = undefined;
    }
    const additionalClasses = properties.class != null ? properties.class : '';
    const props = {
      ...properties,
      class: `icon-sm icon-${name} ${additionalClasses}`.trim(),
    };
    // @ts-expect-error TS(2339): Property 'span' does not exist on type '{ format()... Remove this comment to see the full error message
    this.span(props);
    if (textKey != null) {
      // @ts-expect-error TS(2339): Property 'raw' does not exist on type '{ format():... Remove this comment to see the full error message
      this.raw('&nbsp;');
      // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
      this.format(textKey);
    }
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function templateHelpers(t: any) {
  const base = protoExtend(t, methods);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (name?: any) =>
    protoExtend(base, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      l(key: any, args: any, options: any) {
        key = normalizeKeyPath(key);
        return l(
          ['templates', name, ...Array.from(key)],
          stringifyValues(args),
          options,
        );
      },
    });
}
