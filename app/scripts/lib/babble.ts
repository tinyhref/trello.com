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
// @ts-expect-error TS(7016): Could not find a declaration file for module 'matc... Remove this comment to see the full error message
import pattern from 'matchbook';

import { assert } from '@trello/error-handling';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lookupString = function (strings: any, keyPath: any) {
  const val = strings[keyPath.join('.')];
  if (val == null) {
    return undefined;
  }
  assert(
    typeof val === 'string',
    `key ${keyPath.join('.')} did not resolve to a string`,
  );
  return val;
};

class Hole {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  key: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(key: any) {
    this.key = key;
  }
}

class Literal {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(value: any) {
    this.value = value;
  }
}

// Does not currently allow literal curly braces to appear in templates.
// Doing that requires escaping which requires lookbehind *or* reversing +
// lookahead and I'm not gonna do that right now so screw it.
const parseFormatString = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formatString: any, // capturing matches in split tested in
) =>
  // FF 34, Chrome 39, Safari 8, IE 10
  formatString
    .split(/(\{[^{}]+\})/)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map(function (group: any) {
      if (group.length === 0) {
        return null;
      }
      if (group[0] === '{') {
        return new Hole(group.substr(1, group.length - 2));
      } else {
        return new Literal(group);
      }
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((val: any) => Boolean(val));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const normalizeKeyPath = (keyPath: any) => {
  if (typeof keyPath === 'string') {
    return keyPath.split('.');
  } else if (Array.isArray(keyPath)) {
    return keyPath;
  }
  return undefined;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const lookup = function (strings: any, keyPath: any, visitor: any) {
  keyPath = normalizeKeyPath(keyPath);
  const formatString = lookupString(strings, keyPath);
  if (formatString == null) {
    return undefined;
  }
  return parseFormatString(formatString);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const map = (coll: any, fn: any) => coll.map((val: any) => fn(val));

export const makeVisitor =
  (
    onLiteral: (...args: unknown[]) => unknown,
    onHole: (...args: unknown[]) => unknown,
  ) =>
  (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    holesAndLiterals: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ) =>
    map(
      holesAndLiterals,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pattern(function (match: any) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        match([Hole], ({ key }: any) => onHole(key, ...Array.from(args)));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return match([Literal], ({ value }: any) =>
          onLiteral(value, ...Array.from(args)),
        );
      }),
    );

export const visit = function (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  strings: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keyPath: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  visitor: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
) {
  // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
  const holesAndLiterals = lookup(strings, keyPath);
  if (holesAndLiterals == null) {
    return undefined;
  }
  return visitor(holesAndLiterals, ...Array.from(args));
};
