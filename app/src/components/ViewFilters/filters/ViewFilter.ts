import type { Board } from 'app/scripts/models/Board';
import type {
  BoardsFilter,
  DueFilter,
  LabelsFilter,
  ListFilter,
  MembersFilter,
  ModeFilter,
  SortFilter,
} from 'app/src/components/ViewFilters/filters';
import type { TitleFilter } from 'app/src/components/ViewFilters/filters/TitleFilter';
import type { FilterMode } from 'app/src/components/ViewFilters/types';
import type {
  ActivityFilter,
  BoardActivityFilterString,
} from './ActivityFilter';
import type { AutoCollapseListsFilter } from './AutoCollapseListsFilter';
import type { BoardDueFilterString } from './DueFilter';

export interface UrlParams {
  [key: string]: string | null;
}

export interface AdvancedDate {
  dateType: string;
  value: number;
}

export const DateType = {
  RELATIVE: 'relative',
  ABSOLUTE: 'absolute',
} as const;

export interface DateRange {
  start?: AdvancedDate | null;
  end?: AdvancedDate | null;
  special?: 'any' | 'none' | null;
}

export const SortFields = ['due'] as const;
type ValidSortFieldsType = (typeof SortFields)[number];
export type SortType = `${'-' | ''}${ValidSortFieldsType}`;

export interface CardFilterCriteria {
  idBoards?: string[] | null;
  idLists?: string[] | null;
  idMembers?: string[] | null;
  labels?: string[] | null;
  due?: DateRange | null;
  dueComplete?: boolean | null;
  sort?: string[] | null;
  dateLastActivity?: DateRange | null;
}
export interface BackboneFilterCriteria {
  idLists?: string[] | null;
  idMembers?: string[] | null;
  idLabels?: string[] | null;
  due?: Extract<BoardDueFilterString, 'day' | 'month' | 'notdue' | 'week'>;
  overdue?: boolean;
  dueComplete?: boolean;
  title?: string;
  mode?: FilterMode;
  autoCollapse?: boolean;
  dateLastActivity?: Extract<
    BoardActivityFilterString,
    'fourWeeks' | 'month' | 'twoWeeks' | 'week'
  >;
}

/**
 * This is a union type of all Filter classes, which should all implement
 * `SerializableViewFilter`, so that interface's fields should be accessible on
 * this.
 */
type ViewFilter =
  | ActivityFilter
  | AutoCollapseListsFilter
  | BoardsFilter
  | DueFilter
  | LabelsFilter
  | ListFilter
  | MembersFilter
  | ModeFilter
  | SortFilter
  | TitleFilter;

/**
 * Implemented by Filter classes.
 */
abstract class SerializableViewFilter {
  // @ts-expect-error
  readonly filterType: ViewFilter['filterType'];

  abstract toUrlParams(): UrlParams;
  abstract toCardFilterCriteria(): CardFilterCriteria;
  serializeToBackboneFilter?(board: Board): BackboneFilterCriteria;
  abstract isEmpty(): boolean;

  /**
   * Return the length of the filter. Used for analytics and tracking purposes
   */
  abstract filterLength(): number;

  static fromUrlParams: (urlParams: UrlParams) => SerializableViewFilter;
  static fromCardFilterCriteria: (
    view: CardFilterCriteria,
  ) => SerializableViewFilter;

  // TODO ideas:
  // serializeToMBAPIparams(): {};
}

export { SerializableViewFilter, ViewFilter };
