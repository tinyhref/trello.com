import type { TrelloWindow } from '@trello/window-types';

import type { Options } from './i18n.types';
import { makeFormat } from './makeFormat';

declare const window: TrelloWindow;

/** @deprecated please use `react-intl` instead */
export const forNamespace = (
  ns: string[] | string = [],
  {
    shouldEscapeStrings = true,
    returnBlankForMissingStrings = false,
    canOmitSubstitutions = false,
  }: Options = {},
) =>
  makeFormat(
    Array.isArray(ns) ? ns : [ns],
    () => window.__locale,
    'en.json in strings files',
    shouldEscapeStrings,
    returnBlankForMissingStrings,
    canOmitSubstitutions,
  );
