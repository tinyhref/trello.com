import type { TrelloWindow } from '@trello/window-types';

import type { AllSubstitutions } from './babble';
import { forNamespace } from './forNamespace';

declare const window: TrelloWindow;

const formatCounts = forNamespace('counts');

/** @deprecated please use `react-intl` instead */
export const localizeCount = (
  name: string,
  count: number | string = 0,
  substitutions: AllSubstitutions = {},
) => {
  const { counting } = window.__locale;

  return formatCounts([name, counting(count)], {
    count: `${count}`,
    ...substitutions,
  });
};
