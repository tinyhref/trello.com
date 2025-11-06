import { addDays, subDays } from 'date-fns';

import type { FilterMode } from 'app/src/components/ViewFilters/types';

const dueMap = {
  day: 1,
  week: 7,
  month: 28,
};

const activityMap = {
  week: 7,
  twoWeeks: 14,
  fourWeeks: 28,
  month: 29,
};

export const ID_NONE = 'none';
// Value used to filter for cards with no labels; maps to a translation.
export const NO_LABELS = 'no labels';

export interface Filterable {
  idMembers: string[];
  idLabels: string[];
  due: Date | null;
  complete: boolean;
  words: string[];
  dateLastActivity: Date | string | null;
}

export interface Filter {
  idMembers?: string[];
  idLabels?: string[];
  mode?: FilterMode;
  due?: keyof typeof dueMap | 'notdue'; ////This "notdue" logic is here to support backwards compatability with certain url forms
  overdue?: boolean;
  dueComplete?: boolean;
  title?: string;
  notDue?: boolean;
  dateLastActivity?: keyof typeof activityMap;
}

// Treat all whitespace an punctuation as word separators, except...
// # (for searches like #123)
// % (for searches like 100%)
// ' (for searches like can't)
// - (for searches like RMK-123)
// . and @ (for searches like taco@trello.com)
export const reWordSeparators = /[\s!"$&()*+,/:;<=>?[\\\]^_`{|}~]/;

export function getWords(s: string | undefined): string[] {
  return s
    ? s
        .toLowerCase()
        .split(reWordSeparators)
        .filter((word) => word)
    : [];
}

/**
 * Compare a given word against a set of filterable words. For example, the word
 * "super" should match a card named "Superman" and cards labeled "superhero".
 * Breaks the given word into tokens and returns a function that returns true
 * if the tokens match anything in the filterableWords input. Note that this
 * returns void if the initial word cannot be tokenized; this is meaningfully
 * not a noop in order to indicate that there isn't a need to run the filter.
 */
export function getSatisfiesWordFilter(
  word: string,
): (filterableWords: string[]) => boolean {
  // Want to match at least one word from our search
  const searchWords = getWords(word);

  if (searchWords.length === 0) {
    return () => true;
  }

  // If the query starts and ends with " force it to match ALL words in the query rather than any
  if (word[0] === '"' && word[word.length - 1] === '"') {
    return (filterableWords: string[]) => {
      const actualWordsSet = new Set(filterableWords);
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const matchesAllWords = searchWords.every((word) =>
        actualWordsSet.has(word),
      );
      return !!matchesAllWords;
    };
  }

  const endsWithPartialWord = !reWordSeparators.test(word[word.length - 1]);

  const completeWords = endsWithPartialWord
    ? searchWords.slice(0, searchWords.length - 1)
    : searchWords;
  const partialWord = endsWithPartialWord
    ? searchWords[searchWords.length - 1]
    : undefined;

  return (filterableWords: string[]) => {
    const actualWordsSet = new Set(filterableWords);
    const matchesAnyWord =
      // eslint-disable-next-line @typescript-eslint/no-shadow
      completeWords.some((word) => actualWordsSet.has(word)) ||
      (partialWord &&
        // eslint-disable-next-line @typescript-eslint/no-shadow
        filterableWords.some((word) => word.startsWith(partialWord)));
    return !!matchesAnyWord;
  };
}

export function satisfiesFilter(
  filterable: Filterable,
  filter: Filter,
): boolean {
  const matchesLabelsAndMembers = [
    { required: filter.idLabels, actual: filterable.idLabels || [] },
    { required: filter.idMembers, actual: filterable.idMembers || [] },
  ].every(({ required, actual }) => {
    if (!required || required.length === 0) {
      return true;
    }

    const effective = actual.length === 0 ? [ID_NONE] : actual;

    if (filter.mode === 'and') {
      // Account for no labels/members if they are the only active filters
      if (required.length === 1 && required[0] === ID_NONE) {
        return actual.length === 0;
      }

      // We need all of the required values
      const actualSet = new Set(actual);
      return required.every((value) => actualSet.has(value));
    } else {
      // We need at least one of the required values
      const requiredSet = new Set(required);
      return effective.some((value) => requiredSet.has(value));
    }
  });

  if (!matchesLabelsAndMembers) {
    return false;
  }

  if (filter.title) {
    if (!getSatisfiesWordFilter(filter.title)(filterable.words)) {
      return false;
    }
  }

  const isAnd = filter.mode === 'and';
  const dueChecks = [];
  const activityChecks: Array<boolean> = [];

  if (filter.dueComplete !== undefined)
    dueChecks.push(filter.dueComplete === filterable.complete);
  //This "notdue" logic is here to support backwards compatibility with certain url forms
  if (filter.notDue || filter.due === 'notdue')
    dueChecks.push(filterable.due === null);

  if (filter.due && filter.due !== 'notdue') {
    if (!filterable.due) {
      dueChecks.push(false);
    } else {
      const maxDate = addDays(new Date(), dueMap[filter.due]);
      const cardDue = filterable.due;
      const failsDateCheck = filter.overdue
        ? cardDue > maxDate || filterable.complete
        : !(new Date() < cardDue && cardDue < maxDate);
      dueChecks.push(!failsDateCheck);
    }
  }

  if (filter.dateLastActivity) {
    if (!filterable.dateLastActivity) {
      activityChecks.push(false);
    } else {
      const cardDateLastActivity = new Date(filterable.dateLastActivity);

      let failsDateCheck;
      let minDate;
      const maxDate = new Date();

      switch (filter.dateLastActivity) {
        case 'week':
          minDate = subDays(new Date(), activityMap['week']);
          failsDateCheck = !(
            minDate < cardDateLastActivity && cardDateLastActivity < maxDate
          );
          break;
        case 'twoWeeks':
          minDate = subDays(new Date(), activityMap['twoWeeks']);
          failsDateCheck = !(
            minDate < cardDateLastActivity && cardDateLastActivity < maxDate
          );
          break;
        case 'fourWeeks':
          minDate = subDays(new Date(), activityMap['fourWeeks']);
          failsDateCheck = !(
            minDate < cardDateLastActivity && cardDateLastActivity < maxDate
          );
          break;
        case 'month':
          minDate = subDays(new Date(), activityMap['fourWeeks']);
          failsDateCheck = !(cardDateLastActivity < minDate);
          break;
        default:
      }
      activityChecks.push(!failsDateCheck);
    }
  }

  if (filter.overdue)
    dueChecks.push(
      filterable.due && !filterable.complete && filterable.due < new Date(),
    );

  const matchesDueFilter =
    dueChecks.length === 0 || isAnd
      ? dueChecks.every(Boolean)
      : dueChecks.some(Boolean);

  if (!matchesDueFilter) {
    return false;
  }

  const matchesActivityFilter =
    activityChecks.length === 0
      ? activityChecks.every(Boolean)
      : activityChecks.some(Boolean);
  if (!matchesActivityFilter) {
    return false;
  }

  return true;
}
