import type { ReactNode } from 'react';
import { isValidElement } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { getScreenFromUrl } from '@trello/marketing-screens';
import { safe } from '@trello/strings';

import type {
  AllSubstitutions,
  AllSubstitutionValues,
  ReactSubstitutions,
  Strings,
  StringSubstitutions,
} from './babble';
import { makeVisitor, StringNotFoundAtPathError, visit } from './babble';

function isReactSubstitutions(
  substitutions?: AllSubstitutions,
): substitutions is ReactSubstitutions {
  return (
    !!substitutions &&
    Object.keys(substitutions).some((key) => isValidElement(substitutions[key]))
  );
}

class SubstitutionNotFound extends Error {}

const visitor = makeVisitor(
  (literal) => literal.value,
  (hole, substitutions, shouldEscapeStrings, canOmitSubstitutions) => {
    const key = hole.key;
    if (
      !canOmitSubstitutions &&
      (!substitutions ||
        !Object.prototype.hasOwnProperty.call(substitutions, key))
    ) {
      throw new SubstitutionNotFound(
        `Tried to substitute ${key} but it wasn't provided`,
      );
    }
    const value = (substitutions?.[key] ?? '') as ReactNode | string;

    if (typeof value === 'string' && shouldEscapeStrings) {
      return safe(value);
    } else {
      return value;
    }
  },
);

export function makeFormat(
  namespace: string[] = [],
  getStrings: () => Strings,
  fileName: string,
  shouldEscapeStrings: boolean = true,
  returnBlankForMissingStrings: boolean = false,
  canOmitSubstitutions: boolean = false,
) {
  /** @deprecated please use `react-intl` instead */
  function format(
    keyPath: string[] | string,
    substitutions?: StringSubstitutions,
  ): string;
  /** @deprecated please use `react-intl` instead */
  function format(
    keyPath: string[] | string,
    substitutions: ReactSubstitutions,
  ): AllSubstitutionValues[];
  /** @deprecated please use `react-intl` instead */
  function format(
    keyPath: string[] | string,
    substitutions?: AllSubstitutions,
  ): AllSubstitutionValues[] | string {
    const path = Array.isArray(keyPath)
      ? [...namespace, ...keyPath]
      : [...namespace, keyPath];

    try {
      const visited = visit(
        getStrings(),
        path,
        visitor,
        substitutions,
        shouldEscapeStrings,
        canOmitSubstitutions,
      );
      if (isReactSubstitutions(substitutions)) {
        return Array.isArray(visited) ? visited : [];
      } else {
        return Array.isArray(visited) ? visited.join('') : '';
      }
    } catch (e) {
      const printablePath = safe(path.join('.'));
      if (e instanceof StringNotFoundAtPathError) {
        if (returnBlankForMissingStrings) {
          return '';
        }
        Analytics.sendOperationalEvent({
          action: 'errored',
          actionSubject: 'stringNotFoundAtPathError',
          source: getScreenFromUrl(),
          attributes: { printablePath },
        });
        console.error(
          `Unable to find localized string at path: ${printablePath}, check ${fileName}`,
        );
      } else if (e instanceof SubstitutionNotFound) {
        Analytics.sendOperationalEvent({
          action: 'errored',
          actionSubject: 'substitutionNotFoundError',
          source: getScreenFromUrl(),
          attributes: { printablePath },
        });
        console.error(
          `Substitution missing when building localized string at path ${printablePath}, ${e.message}`,
        );
      } else {
        Analytics.sendOperationalEvent({
          action: 'errored',
          actionSubject: 'unknownLocalizationError',
          source: getScreenFromUrl(),
          attributes: { printablePath },
        });
        console.error(
          `Unknown error thrown while attempting to localize string: ${e}`,
        );
      }

      return [printablePath];
    }
  }

  return format;
}
