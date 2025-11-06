import { formatLabelColor, sortLabels } from '@trello/labels';

import { getWords } from 'app/src/satisfiesFilter';
import { getFilterableCriteriaOption } from './getFilterableCriteriaOption';
import type {
  FilterCriteriaSourceBoard,
  LabelFilterCriteriaOption,
} from './types';

export const getUniqueLabels = (
  boards: FilterCriteriaSourceBoard[],
): LabelFilterCriteriaOption[] => {
  const labels: LabelFilterCriteriaOption[] = [];
  const labelsMap = new Map<string | null, Set<string>>();
  // Store tokenized output for each color, e.g. "green", to be searchable.
  const tokenizedLabelColors: Record<string, string[]> = {};

  boards.forEach((board) => {
    board.labels?.forEach((label) => {
      const color = label.color ?? null;
      const colorSet = labelsMap.get(color);
      // We've seen this label on a different board, skip it.
      if (colorSet?.has(label.name)) {
        return;
      }

      if (color && typeof tokenizedLabelColors[color] === 'undefined') {
        tokenizedLabelColors[color] = getWords(formatLabelColor(color));
      }

      if (!colorSet) {
        labelsMap.set(color, new Set<string>([label.name]));
      } else if (!colorSet.has(label.name)) {
        colorSet.add(label.name);
      }
      labels.push({
        ...label,
        ...getFilterableCriteriaOption(
          [label.name, ...(color ? tokenizedLabelColors[color] : [])],
          label.id,
        ),
      });
    });
  });

  return sortLabels(labels);
};
