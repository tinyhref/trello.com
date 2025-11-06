import { getWords } from 'app/src/satisfiesFilter';
import type { FilterableCriteriaOption } from './types';

export const getFilterableCriteriaOption = (
  words: string[] | string,
  value: string,
): FilterableCriteriaOption => {
  const strings = Array.isArray(words) ? words : [words];
  const filterableWords = strings.flatMap(getWords);
  return {
    filterableWords,
    label: filterableWords.join(' '),
    value,
  };
};
