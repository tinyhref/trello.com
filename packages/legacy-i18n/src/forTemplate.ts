import type { TrelloWindow } from '@trello/window-types';

import type { Options } from './i18n.types';
import { makeFormat } from './makeFormat';

declare const window: TrelloWindow;

/** @deprecated please use `react-intl` instead */
export const forTemplate = (
  namespace: string,
  {
    shouldEscapeStrings = true,
    returnBlankForMissingStrings = false,
    canOmitSubstitutions = false,
  }: Options = {},
) =>
  makeFormat(
    ['templates', namespace],
    () => window.__locale,
    'templates/en.json',
    shouldEscapeStrings,
    returnBlankForMissingStrings,
    canOmitSubstitutions,
  );
