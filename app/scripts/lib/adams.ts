/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// @ts-expect-error TS(7016): Could not find a declaration file for module 'prot... Remove this comment to see the full error message
import protoExtend from 'proto-extend';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'teac... Remove this comment to see the full error message
import teacup from 'teacup';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let scopes: any = null;
// @ts-expect-error TS(6133): 'registeredPartials' is declared but its value is ... Remove this comment to see the full error message
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let registeredPartials = null;

// _.result, but adams doesn't
// want to depend on underscore.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const force = function (valOrFunction: any) {
  if (typeof valOrFunction === 'function') {
    return valOrFunction();
  } else {
    return valOrFunction;
  }
};

// Returns an object of { val: answer } if
// the keyPath resolves; returns an empty
// object otherwise.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lookupScope = function (keyPath: any, scope: any) {
  if (keyPath === '.') {
    return { val: scope };
  }

  // This can happen within the body of a loop
  if (typeof scope !== 'object' || scope === null) {
    return {};
  }

  let target = scope;
  for (const key of Array.from(keyPath.split('.'))) {
    // @ts-expect-error TS(2571): Object is of type 'unknown'.
    if (!(key in target)) {
      return {};
    }
    // @ts-expect-error TS(2538): Type 'unknown' cannot be used as an index type.
    target = target[key];
  }

  return { val: target };
};

const methods = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mustacheRender(body: any, data: any, partials: any) {
    if (partials == null) {
      partials = {};
    }
    if (scopes != null) {
      throw new Error('Cannot nest calls to mustacheRender');
    }
    return teacup.render(function () {
      registeredPartials = partials;
      scopes = [data];
      try {
        body();
      } finally {
        scopes = null;

        registeredPartials = null;
      }
    });
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mustacheVar(name: any) {
    if (scopes == null) {
      throw new Error(
        'Attempt to render a mustache template outside of a mustacheRender',
      );
    }
    for (let i = scopes.length - 1; i >= 0; i--) {
      const scope = scopes[i];
      const result = lookupScope(name, scope);
      if (Object.prototype.hasOwnProperty.call(result, 'val')) {
        return force(result.val);
      }
    }
    return '';
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mustachePartial(template: any) {
    if (typeof template !== 'function') {
      throw new Error(
        `When calling mustachePartial you must pass a template as a function. We saw ${template}`,
      );
    }
    return template();
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mustacheBlock(varName: any, body: any) {
    const value = this.mustacheVar(varName);

    if (!value) {
      return '';
    }

    let returnValue = undefined;
    if (Array.isArray(value)) {
      for (const obj of Array.from(value)) {
        scopes.push(obj);
        body();
        scopes.pop();
      }
    } else if (typeof value === 'object') {
      scopes.push(value);
      returnValue = body();
      scopes.pop();
    } else {
      returnValue = body();
    }
    return returnValue;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mustacheBlockInverted(varName: any, body: any) {
    const value = this.mustacheVar(varName);

    if (value) {
      return '';
    }
    return body();
  },
};

export const adams = protoExtend(teacup, methods);
