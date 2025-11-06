/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import _ from 'underscore';

import { tracingCallback } from '@trello/atlassian-analytics';

import type { TrelloModelAttributes } from 'app/scripts/models/internal/TrelloModel';
import { TrelloModel } from 'app/scripts/models/internal/TrelloModel';

export interface ModelWithPreferencesAttributes extends TrelloModelAttributes {
  prefs: {
    [key: string]: unknown;
  };
}

class ModelWithPreferences<
  T extends ModelWithPreferencesAttributes,
> extends TrelloModel<T> {
  static initClass() {
    // @ts-expect-error
    this.prototype.prefNames = [];
  }

  constructor(attr?: Partial<T>) {
    super(...arguments);
    this.triggerSubpropertyChangesOn('prefs');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toJSON(opts?: any) {
    if (opts == null) {
      opts = {};
    }
    // @ts-expect-error
    const data = super.toJSON(...arguments);

    // Converts a deep object level into a flat mapping. For example:
    // prefs:
    //   foo: bar
    //   baz:
    //    aaa: 1
    //    bbb: 2
    //
    // foo = bar
    // baz_aaa = 1
    // baz_bbb = 2
    //
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getDeepPrefs: any = (
      prefList: string[],
      obj?: object,
      prefix?: string,
    ) => {
      const result = [];
      for (const preference of Array.from(prefList)) {
        const key = prefix ? `${prefix}_${preference}` : preference;
        const value =
          // @ts-expect-error
          (obj != null ? obj[preference] : undefined) != null
            ? obj != null
              ? // @ts-expect-error
                obj[preference]
              : undefined
            : this.getPref(preference);
        if (_.isObject(value) && !_.isArray(value)) {
          result.push(getDeepPrefs(_.keys(value), value, key));
        } else {
          // @ts-expect-error
          data[key] = value;
          // @ts-expect-error
          result.push((data[`${key}_${value}`] = true));
        }
      }
      return result;
    };

    if (opts.prefs) {
      // @ts-expect-error
      getDeepPrefs(this.prefNames);
    }

    return data;
  }

  getPref<TKey extends keyof T['prefs'] & string>(name: TKey) {
    return this.get('prefs')?.[name];
  }

  setPref<TKey extends keyof T['prefs']>(
    name: TKey,
    value: T['prefs'][TKey],
    next?: () => void,
  ) {
    // @ts-expect-error
    return this.update(`prefs/${name}`, value, next);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setPrefWithTracing(name: string, value: any, tracingCallbackArgs?: any) {
    const key = `prefs/${name}`;
    const { traceId, next, ...tracingArgs } = tracingCallbackArgs;
    const params = {
      traceId,
    };
    // @ts-expect-error
    params[key] = value;
    return this.update(
      // @ts-expect-error
      params,
      tracingCallback({ traceId, ...tracingArgs }, next),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set(attrs: any, options?: any): this {
    attrs = _.clone(attrs);
    if (attrs.prefs != null) {
      // Take care of some problems with the notifications; they're sending the values from the DB, which don't
      // actually match what we get from the API
      const { prefs } = attrs;
      for (const key in prefs) {
        let value = prefs[key];
        if (value === 'none') {
          value = 'disabled';
        }
        if (value === 'owners') {
          value = 'admins';
        }
        prefs[key] = value;
      }
    }

    // @ts-expect-error
    return super.set(...arguments);
  }
}
ModelWithPreferences.initClass();

export { ModelWithPreferences };
