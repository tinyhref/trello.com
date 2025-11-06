import type { TrelloWindow } from '@trello/window-types';

import type { Options } from './i18n.types';
import { makeFormat } from './makeFormat';

declare const window: TrelloWindow;

/** @deprecated please use `react-intl` instead */
export const forEntities = (
  namespace: string,
  { shouldEscapeStrings = true }: Options = {},
) =>
  makeFormat(
    [namespace],
    () => window.__locale,
    `en.json in ${namespace}`,
    shouldEscapeStrings,
  );
