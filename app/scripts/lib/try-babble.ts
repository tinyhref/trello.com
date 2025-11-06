import _ from 'underscore';

import { assert } from '@trello/error-handling';

import { makeVisitor, visit } from './babble';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let visitor: any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function tryBabble(keyPath: any, args = {}, options = {}) {
  if (!visitor) {
    visitor = makeVisitor(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (o: any) => o,
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-shadow */
      function (key: any, substitutions: any, options = {}) {
        assert(
          Object.prototype.hasOwnProperty.call(substitutions, key),
          `Error translating: '${key}' was not found in the provided substitutions ${JSON.stringify(
            Object.keys(substitutions),
          )}`,
        );

        const value = substitutions[key];

        assert(
          typeof value === 'string',
          "I don't know how to convert values into strings. Please use a localized conversion function and pass me the string result.",
        );

        // @ts-expect-error TS(2339): Property 'raw' does not exist on type '{}'.
        if (options.raw) {
          return value;
        }

        return _.escape(value);
      },
    );
  }

  // @ts-expect-error TS(2339): Property '__locale' does not exist on type 'Window... Remove this comment to see the full error message
  return visit(window.__locale, keyPath, visitor, args, options)?.join('');
}
