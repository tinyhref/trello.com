import { subDays } from 'date-fns';

import type { ActivityFilterCriteriaOption } from 'app/src/components/FilterPopover/FilterCriteriaOptions';
import type { FilterableCard } from 'app/src/components/ViewFilters/types';
import type { BackboneFilterCriteria, CardFilterCriteria } from './ViewFilter';
import { DateType, SerializableViewFilter } from './ViewFilter';

export const DAY_MILLIS = 86400000;

export const ActivityRangeFilter = {
  Null: 0,
  WeekAgo: 7,
  TwoWeeksAgo: 14,
  FourWeeksAgo: 28,
  MonthAgo: 29,
} as const;
export type ActivityFilterValue =
  (typeof ActivityRangeFilter)[keyof typeof ActivityRangeFilter];

export const ACTIVITY_FILTER_OPTIONS = [
  'week',
  'twoWeeks',
  'fourWeeks',
  'month',
] as const;

export type BoardActivityFilterString =
  | (typeof ACTIVITY_FILTER_OPTIONS)[number]
  | null;

interface ActivityFilterParameters {
  range?: ActivityFilterValue;
}

export class ActivityFilter extends SerializableViewFilter {
  public readonly filterType = 'dateLastActivity' as const;

  public readonly range: ActivityFilterValue;

  constructor({
    range = ActivityRangeFilter.Null,
  }: ActivityFilterParameters = {}) {
    super();
    this.range = range;
  }

  filterLength(): number {
    return this.range === ActivityRangeFilter.Null ? 0 : 1;
  }

  isEmpty(): boolean {
    return this.range === ActivityRangeFilter.Null;
  }

  setActivityRangeFilter(range: ActivityFilterValue) {
    return new ActivityFilter({ ...this, range });
  }

  getMinActivity() {
    return this.range === ActivityRangeFilter.MonthAgo
      ? subDays(new Date(), ActivityRangeFilter.FourWeeksAgo).toISOString()
      : new Date().toISOString();
  }

  getMaxActivity() {
    return !(
      [
        ActivityRangeFilter.MonthAgo,
        ActivityRangeFilter.Null,
      ] as ActivityFilterValue[]
    ).includes(this.range)
      ? subDays(new Date(), this.range).toISOString()
      : null;
  }

  satisfiesActivityFilter({
    dateLastActivity,
  }: {
    dateLastActivity: FilterableCard['dateLastActivity'];
  }): boolean {
    if (this.isEmpty()) {
      return true;
    }

    const checks = [];

    if (this.range !== ActivityRangeFilter.Null && dateLastActivity) {
      const cardActivityDate = new Date(dateLastActivity);
      let failsDateCheck;
      let maxDate;
      let minDate;
      if (this.range !== ActivityRangeFilter.MonthAgo) {
        maxDate = new Date();
        minDate = subDays(new Date(), this.range);
        failsDateCheck = !(
          minDate < cardActivityDate && cardActivityDate < maxDate
        );
      } else {
        minDate = subDays(new Date(), this.range);
        failsDateCheck = !(cardActivityDate < minDate);
      }
      checks.push(!failsDateCheck);
    }
    return checks.some(Boolean);
  }

  toUrlParams(): {
    dateLastActivity: string | null;
  } {
    const rangeString = (() => {
      switch (this.range) {
        case ActivityRangeFilter.WeekAgo:
          return 'week';
        case ActivityRangeFilter.TwoWeeksAgo:
          return 'twoWeeks';
        case ActivityRangeFilter.FourWeeksAgo:
          return 'fourWeeks';
        case ActivityRangeFilter.MonthAgo:
          return 'month';
        case ActivityRangeFilter.Null:
        default:
          return null;
      }
    })();

    const activityArray = [rangeString].filter((s) => s !== null);
    const dateLastActivity = activityArray.join(',') || null;

    return {
      dateLastActivity,
    };
  }

  static fromBoardString(
    boardString: BoardActivityFilterString,
  ): ActivityFilter {
    let rangeFilter: ActivityFilterValue = ActivityRangeFilter.Null;
    switch (boardString) {
      case 'week':
        rangeFilter = ActivityRangeFilter.WeekAgo;
        break;
      case 'twoWeeks':
        rangeFilter = ActivityRangeFilter.TwoWeeksAgo;
        break;
      case 'fourWeeks':
        rangeFilter = ActivityRangeFilter.FourWeeksAgo;
        break;
      case 'month':
        rangeFilter = ActivityRangeFilter.MonthAgo;
        break;
      default:
        break;
    }

    return new ActivityFilter({ range: rangeFilter });
  }

  static fromUrlParams({ dateLastActivity }: { [key: string]: string | null }) {
    const [first] = dateLastActivity?.split(',') || [];
    const rangeString = first;

    let rangeFilter: ActivityFilterValue = ActivityRangeFilter.Null;

    switch (rangeString) {
      case 'week':
        rangeFilter = ActivityRangeFilter.WeekAgo;
        break;
      case 'twoWeeks':
        rangeFilter = ActivityRangeFilter.TwoWeeksAgo;
        break;
      case 'fourWeeks':
        rangeFilter = ActivityRangeFilter.FourWeeksAgo;
        break;
      case 'month':
        rangeFilter = ActivityRangeFilter.MonthAgo;
        break;
      default:
        rangeFilter = ActivityRangeFilter.Null;
        break;
    }

    return new ActivityFilter({
      range: rangeFilter,
    });
  }

  toCardFilterCriteria() {
    const rangeFilter = this.range;
    let start,
      end = null;

    if (
      (
        [
          ActivityRangeFilter.WeekAgo,
          ActivityRangeFilter.TwoWeeksAgo,
          ActivityRangeFilter.FourWeeksAgo,
          ActivityRangeFilter.MonthAgo,
        ] as ActivityFilterValue[]
      ).includes(rangeFilter)
    ) {
      start = { dateType: DateType.RELATIVE, value: 0 };
      end = { dateType: DateType.RELATIVE, value: rangeFilter };
    }

    const dateLastActivity =
      start || end
        ? {
            start,
            end,
          }
        : null;

    return {
      dateLastActivity,
    };
  }

  static fromCardFilterCriteria(cardFilterCriteria: CardFilterCriteria) {
    let rangeFilter: ActivityFilterValue = ActivityRangeFilter.Null;
    switch (cardFilterCriteria.dateLastActivity?.end?.value) {
      case ActivityRangeFilter.WeekAgo:
        rangeFilter = ActivityRangeFilter.WeekAgo;
        break;
      case ActivityRangeFilter.TwoWeeksAgo:
        rangeFilter = ActivityRangeFilter.TwoWeeksAgo;
        break;
      case ActivityRangeFilter.FourWeeksAgo:
        rangeFilter = ActivityRangeFilter.FourWeeksAgo;
        break;
      case ActivityRangeFilter.MonthAgo:
        rangeFilter = ActivityRangeFilter.MonthAgo;
        break;
      default:
        rangeFilter = ActivityRangeFilter.Null;
        break;
    }

    return new ActivityFilter({
      range: rangeFilter,
    });
  }

  serializeToBackboneFilter() {
    const rangeFilter = this.range;

    let dateLastActivity: BackboneFilterCriteria['dateLastActivity'];

    switch (rangeFilter) {
      case ActivityRangeFilter.WeekAgo:
        dateLastActivity = 'week';
        break;
      case ActivityRangeFilter.TwoWeeksAgo:
        dateLastActivity = 'twoWeeks';
        break;
      case ActivityRangeFilter.FourWeeksAgo:
        dateLastActivity = 'fourWeeks';
        break;
      case ActivityRangeFilter.MonthAgo:
        dateLastActivity = 'month';
        break;
      default:
        break;
    }

    return {
      dateLastActivity,
    };
  }

  /**
   * Parse ActivityFilter into valid MBAPI query parameters
   *
   * dateLastActivity will be of the form 2021-07-26T20:24:00.182Z...2021-08-01T20:24:00.182Z
   * where up to two ISOStrings are separated by ...
   *
   * @returns {dateLastActivity: string}
   */
  toMbapiFormat(): { dateLastActivity: string } {
    const startOfRange = this.getMinActivity();
    const endOfRange = this.getMaxActivity();
    const dateLastActivity =
      startOfRange || endOfRange ? `${startOfRange || ''}...${endOfRange}` : '';
    return { dateLastActivity };
  }

  // These are functions used by the board filtering, which uses different url parameter formatting and
  // mutates the legacy board filter backbone model. If we deprecate the board filtering in favor of
  // view filtering, we can delete these functions
  isActivityOptionActive(value: ActivityFilterCriteriaOption['value']) {
    switch (value) {
      case 'week':
        return this.range === ActivityRangeFilter.WeekAgo;
      case 'twoWeeks':
        return this.range === ActivityRangeFilter.TwoWeeksAgo;
      case 'fourWeeks':
        return this.range === ActivityRangeFilter.FourWeeksAgo;
      case 'month':
        return this.range === ActivityRangeFilter.MonthAgo;
      default:
        return false;
    }
  }
}
