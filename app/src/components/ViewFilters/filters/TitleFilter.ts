import type { FilterableCard } from 'app/src/components/ViewFilters/types';
import { getWords, reWordSeparators } from 'app/src/satisfiesFilter';
import type { CardFilterCriteria } from './ViewFilter';
import { SerializableViewFilter } from './ViewFilter';

export class TitleFilter extends SerializableViewFilter {
  public readonly filterType = 'title' as const;
  public readonly title: string;

  constructor(value?: string) {
    super();
    this.title = value || '';
  }

  filterLength(): number {
    return this.title === '' ? 0 : 1;
  }

  isEmpty(): boolean {
    return this.filterLength() === 0;
  }

  getTitle() {
    return this.title;
  }

  setTitle(value: string | null) {
    return new TitleFilter(value ?? undefined);
  }

  clear() {
    this.setTitle('');
  }

  toUrlParams(): {
    title: string | null;
  } {
    return { title: this.title || null };
  }

  satisfiesTitleFilter(filterableWords: FilterableCard['words']): boolean {
    // Want to match at least one word from our search
    const searchWords = getWords(this.title);

    if (searchWords.length > 0) {
      const actualWordsSet = new Set(filterableWords);

      if (this.title[0] === '"' && this.title[this.title.length - 1] === '"') {
        const matchesAllWords = searchWords.every((word) =>
          actualWordsSet.has(word),
        );
        return !!matchesAllWords;
      }

      const endsWithPartialWord = !reWordSeparators.test(
        this.title[this.title.length - 1],
      );

      const completeWords = endsWithPartialWord
        ? searchWords.slice(0, searchWords.length - 1)
        : searchWords;

      const partialWord = endsWithPartialWord
        ? searchWords[searchWords.length - 1]
        : undefined;

      const matchesAnyWord =
        completeWords.some((word) => actualWordsSet.has(word)) ||
        (partialWord &&
          filterableWords.some((word) => word?.startsWith(partialWord)));

      return !!matchesAnyWord;
    }

    return true;
  }

  static fromUrlParams({
    title,
  }: {
    [key: string]: string | null;
  }): TitleFilter {
    return new TitleFilter(title ?? undefined);
  }

  toCardFilterCriteria() {
    return {};
  }

  static fromCardFilterCriteria(view: CardFilterCriteria) {
    return new TitleFilter();
  }

  serializeToBackboneFilter() {
    return { title: this.title };
  }
}
