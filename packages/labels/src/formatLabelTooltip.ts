import { forTemplate } from '@trello/legacy-i18n';
import { truncate } from '@trello/strings';

import type { CardLabelType } from './CardLabel.types';
import { formatLabelColor } from './formatLabelColor';

const format = forTemplate('label_tooltip', { shouldEscapeStrings: false });

export const formatLabelTooltip = (label: CardLabelType) =>
  format('tooltip', {
    color: formatLabelColor(label.color, format('none')),
    title: label.name
      ? format('title', {
          title: truncate(label.name, 256, { splitByCodePoint: true }),
        })
      : format('none'),
  });
