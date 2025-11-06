/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import _ from 'underscore';

import type { ModelWithPreferencesAttributes } from 'app/scripts/models/internal/ModelWithPreferences';
import { ModelWithPreferences } from 'app/scripts/models/internal/ModelWithPreferences';

export interface ModelWithPersonalPreferencesAttributes
  extends ModelWithPreferencesAttributes {
  myPrefs: {
    [key: string]: string;
  };
}

class ModelWithPersonalPreferences<
  T extends ModelWithPersonalPreferencesAttributes,
> extends ModelWithPreferences<T> {
  static initClass() {
    // @ts-expect-error
    this.prototype.myPrefNames = [];
    // @ts-expect-error
    this.prototype.myPrefDefaults = {};
  }

  constructor(attr?: Partial<T>) {
    super(...arguments);
    this.triggerSubpropertyChangesOn('myPrefs');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toJSON(opts?: any) {
    if (opts == null) {
      opts = {};
    }
    const data = super.toJSON(...arguments);

    if (opts.prefs) {
      // @ts-expect-error
      for (const preference of Array.from(this.myPrefNames)) {
        // @ts-expect-error
        const value = this.getPref(preference);
        // @ts-expect-error
        data[preference] = value;
        // @ts-expect-error
        data[`${preference}_${value}`] = true;
      }
    }

    return data;
  }

  getPref<TKey extends keyof T['myPrefs'] & string>(name: TKey) {
    // @ts-expect-error
    if (Array.from(this.myPrefNames).includes(name)) {
      let left;
      return (left = this.get('myPrefs')?.[name]) != null
        ? left
        : // @ts-expect-error
          this.myPrefDefaults[name];
    } else {
      // @ts-expect-error
      return super.getPref(...arguments);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setPref(name: any, value: any, next?: any) {
    // @ts-expect-error
    if (Array.from(this.myPrefNames).includes(name)) {
      return this.setMyPref(name, value, next);
    } else {
      // @ts-expect-error
      return super.setPref(...arguments);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setMyPref(name: keyof T['myPrefs'], value: any, next: any) {
    this.api(
      {
        type: 'put',
        method: `myPrefs/${String(name)}`,
        data: { value },
      },
      next,
    );

    const myPrefs = _.clone(this.get('myPrefs'));
    myPrefs[name] = value;
    return this.set({ myPrefs });
  }
}
ModelWithPersonalPreferences.initClass();

export { ModelWithPersonalPreferences };
