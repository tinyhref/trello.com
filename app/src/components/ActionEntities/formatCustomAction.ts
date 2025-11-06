import type {
  AllSubstitutions,
  AllSubstitutionValues,
  ReactSubstitutions,
  StringSubstitutions,
} from '@trello/legacy-i18n';
import { makeFormat } from '@trello/legacy-i18n';

import { getStrings } from './customActions';

export function formatCustomAction(
  keyPath: string[] | string,
  substitutions?: StringSubstitutions,
): string;
export function formatCustomAction(
  keyPath: string[] | string,
  substitutions: ReactSubstitutions,
): AllSubstitutionValues[];
export function formatCustomAction(
  keyPath: string[] | string,
  substitutions: AllSubstitutions = {},
): AllSubstitutionValues[] | string {
  const format = makeFormat([], getStrings, '/1/customActionTypes');
  return format(keyPath, substitutions);
}
