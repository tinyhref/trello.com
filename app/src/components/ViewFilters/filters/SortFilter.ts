import type { PreferredComparator, StandardComparator } from '@trello/arrays';
import { buildComparator } from '@trello/arrays';

import type { CardFilterCriteria, SortType } from './ViewFilter';
import { SerializableViewFilter, SortFields } from './ViewFilter';

interface SortableCard {
  id: string;
  pos: number;
  idList: string;
  due?: string | null;
}
export class SortFilter extends SerializableViewFilter {
  // TODO: The sort order is not a "filter", either change naming conventions
  // or save sort order differently.
  public readonly filterType = 'sort' as const;
  public readonly sorts: SortType[];

  constructor(sorts: SortType[] = []) {
    super();
    this.sorts = sorts;
  }

  enableSorts(sortArray: SortType[]) {
    return new SortFilter([...this.sorts, ...sortArray]);
  }

  filterLength(): number {
    return this.sorts.length;
  }

  isEmpty(): boolean {
    return this.filterLength() === 0;
  }

  toUrlParams(): {
    [key: string]: string | null;
  } {
    const sortString = [...this.sorts].join(',');
    return { sort: sortString || null };
  }

  static fromUrlParams({
    sort: sortString,
  }: { [key: string]: string | null } = {}) {
    const validatedSortArray =
      sortString
        ?.split(',')
        .filter((filter) => this.isValidSortField(filter)) || [];

    return new SortFilter(validatedSortArray as SortType[]);
  }

  /**
   * Check whether a sort is enabled, regardless of its direction.
   * example:
   * sortFilter is: ['-due']
   * sortFilter.isEnabled('due') -> true
   * sortFilter.isEnabled('-due') -> true
   *
   * @param filter - string to check;
   * @returns boolean indicating whether the sort string is enabled
   */
  isEnabled(filter: string) {
    if (!SortFilter.isValidSortField(filter)) {
      return false;
    }

    const trimmedFilter =
      filter[0] === '-' ? filter.slice(1, filter.length) : filter;

    return this.sorts.find((enabledFilter) =>
      enabledFilter.includes(trimmedFilter),
    )
      ? true
      : false;
  }

  disable(filter: SortType): SortFilter {
    const trimmedFilter =
      filter[0] === '-' ? filter.slice(1, filter.length) : filter;

    const newSortFilter = this.sorts.filter(
      (enabledFilter) => !enabledFilter.includes(trimmedFilter),
    );

    return new SortFilter(newSortFilter);
  }

  enable(filter: SortType): SortFilter {
    if (!this.isEnabled(filter)) {
      return new SortFilter([...this.sorts, filter]);
    }
    return this;
  }

  toggle(filter: SortType): SortFilter {
    if (this.isEnabled(filter)) {
      return this.disable(filter);
    } else {
      return this.enable(filter);
    }
  }

  /**
   * Validate that a string conforms to a valid sortable field.
   *
   * Checks the length of the filter string and whether it exists in the VALID_FIELDS_ARRAY
   *
   * @param sortFieldString: string
   * @returns boolean
   */
  private static isValidSortField(
    sortFieldString: string,
  ): sortFieldString is SortType {
    if (!(sortFieldString?.length > 1)) {
      return false;
    }
    const sliceIndexStart = sortFieldString[0] === '-' ? 1 : 0;

    return (
      sortFieldString?.length > 1 &&
      (SortFields as readonly string[]).includes(
        sortFieldString.slice(sliceIndexStart, sortFieldString.length),
      )
    );
  }

  toCardFilterCriteria() {
    return {
      sort: [...this.sorts],
    };
  }

  static fromCardFilterCriteria(cardFilterCriteria: CardFilterCriteria) {
    const sortArray = (cardFilterCriteria.sort || []).filter((sort) =>
      this.isValidSortField(sort),
    );
    return new SortFilter(sortArray as SortType[]);
  }

  /**
   * Returns a comparator for sorting cards client-side according to the active
   * sort order. Currently getComparator only supports these sort orders:
   *  -due
   *  due
   *  list,pos
   *
   * a "list,pos" comparator is returned by default. This sorts cards similarly
   * to how they are displayed on a board.
   *
   * getComparator is only used by single-board views which load all card data
   * to the client. Multi-board views pass the sort order to the server API.
   */
  getComparator(
    lists?: { id: string; pos: number }[],
  ): StandardComparator<SortableCard> {
    const listPosById = new Map();
    for (const list of lists ?? []) {
      listPosById.set(list.id, list.pos);
    }
    const defaultComparator: StandardComparator<SortableCard> = (
      cardA,
      cardB,
    ) =>
      listPosById.get(cardA.idList) - listPosById.get(cardB.idList) ||
      cardA.pos - cardB.pos;

    if (this.isEnabled('due')) {
      const invert = this.sorts.includes('-due') ? -1 : 1;
      const preferHasDueDate: PreferredComparator<SortableCard> = ({ due }) =>
        Boolean(due);
      const compareDueDate: StandardComparator<SortableCard> = (
        { due: dueA },
        { due: dueB },
      ) => {
        if (!dueA || !dueB) {
          return 0;
        }

        return (new Date(dueA).getTime() - new Date(dueB).getTime()) * invert;
      };

      return buildComparator(
        preferHasDueDate,
        compareDueDate,
        defaultComparator,
      );
    } else {
      return defaultComparator;
    }
  }
}
