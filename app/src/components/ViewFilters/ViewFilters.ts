import _ from 'underscore';

import { client } from '@trello/graphql';
import { dangerouslyConvertPrivacyString } from '@trello/privacy';
import type { RouteContext } from '@trello/router/legacy-router';

import { LegacyPowerUps } from 'app/scripts/data/legacy-power-ups';
import { MirrorBoardCardAgingPrefsFragmentDoc } from 'app/src/components/MirrorCard/MirrorBoardCardAgingPrefsFragment.generated';
import { getWords } from 'app/src/satisfiesFilter';
import type { CardFilterCriteria, ViewFilter } from './filters/ViewFilter';
import { CustomFieldItem } from './CustomFieldItem';
import { FilterableCardFragmentDoc } from './FilterableCardFragment.generated';
import type { UrlParams } from './filters';
import {
  ActivityFilter,
  AutoCollapseListsFilter,
  BoardsFilter,
  CompleteFilter,
  DueFilter,
  LabelsFilter,
  ListFilter,
  MembersFilter,
  ModeFilter,
  SortFilter,
  TitleFilter,
} from './filters';
import { toQueryStringWithDecodedFilterParams } from './toQueryStringWithDecodedFilterParams';
import type {
  Card,
  ChecklistItem,
  CustomField,
  CustomFieldItem as CustomFieldItemType,
  FilterableCard,
  FilterableCardWithCustomFields,
} from './types';

type FilterableChecklistItem = ChecklistItem & Pick<Card, 'labels'>;
export interface ViewFiltersParams {
  boards?: BoardsFilter;
  due?: DueFilter;
  labels?: LabelsFilter;
  list?: ListFilter;
  members?: MembersFilter;
  mode?: ModeFilter;
  sort?: SortFilter;
  title?: TitleFilter;
  dateLastActivity?: ActivityFilter;
  autoCollapse?: AutoCollapseListsFilter;
}

interface Plugin {
  id: string;
  idPlugin: string;
}

// Utility for aggregation convenience functions.
// FilterMode isn't countable, so it is excluded from aggregated totals.
const COUNTABLE_VIEW_FILTER_PARAMS: Array<
  Exclude<keyof ViewFiltersParams, 'mode'>
> = [
  'boards',
  'due',
  'labels',
  'list',
  'members',
  'sort',
  'title',
  'dateLastActivity',
];
export type CountableViewFilterParams = typeof COUNTABLE_VIEW_FILTER_PARAMS;

export class ViewFilters {
  public readonly boards: BoardsFilter;
  public readonly due: DueFilter;
  public readonly dateLastActivity: ActivityFilter;
  public readonly labels: LabelsFilter;
  public readonly list: ListFilter;
  public readonly members: MembersFilter;
  public readonly mode: ModeFilter;
  public readonly autoCollapse: AutoCollapseListsFilter;
  // @ts-expect-error
  public readonly calendarDateRange: `${string}...${string}`;
  public readonly sort: SortFilter;
  public readonly title: TitleFilter;

  constructor(params: ViewFiltersParams = {}) {
    this.boards = params.boards || new BoardsFilter();
    this.due = params.due || new DueFilter();
    this.dateLastActivity = params.dateLastActivity || new ActivityFilter();
    this.labels = params.labels || new LabelsFilter();
    this.list = params.list || new ListFilter();
    this.members = params.members || new MembersFilter();
    this.mode = params.mode || new ModeFilter();
    this.sort = params.sort || new SortFilter();
    this.title = params.title || new TitleFilter();
    this.autoCollapse = params.autoCollapse || new AutoCollapseListsFilter();
  }

  setFilter(filter: ViewFilter): ViewFilters {
    if (typeof filter === 'number') {
      return new ViewFilters({ mode: filter });
    }

    switch (filter.filterType) {
      case 'boards':
        return new ViewFilters({ ...this, boards: filter });
      case 'due':
        return new ViewFilters({ ...this, due: filter });
      case 'dateLastActivity':
        return new ViewFilters({ ...this, dateLastActivity: filter });
      case 'labels':
        return new ViewFilters({ ...this, labels: filter });
      case 'list':
        return new ViewFilters({ ...this, list: filter });
      case 'members':
        return new ViewFilters({ ...this, members: filter });
      case 'sort':
        return new ViewFilters({ ...this, sort: filter });
      case 'title':
        return new ViewFilters({ ...this, title: filter });
      case 'autoCollapse':
        return new ViewFilters({ ...this, autoCollapse: filter });
      default:
        return new ViewFilters();
    }
  }

  clearFilters(
    skip: (keyof ViewFiltersParams)[] = ['boards', 'sort'],
  ): ViewFilters {
    return new ViewFilters(
      Object.fromEntries(skip.map((key) => [key, this[key]])),
    );
  }

  /**
   * Convenience function to determine whether filters are active.
   * `skip` params can be configured to omit certain filters from the check,
   * e.g. a value of ['boards'] checks whether non-boards filters are active.
   */
  isFiltering(skip: CountableViewFilterParams = []): boolean {
    const skipSet = new Set(skip);
    return COUNTABLE_VIEW_FILTER_PARAMS.some(
      (key) => !skipSet.has(key) && !this[key].isEmpty(),
    );
  }

  /**
   * Convenience function to count the total number of active filters.
   * `skip` params can be configured to omit certain filters from the check,
   * e.g. a value of ['boards'] excludes boards from the count.
   */
  totalFilterLength(skip: CountableViewFilterParams = []): number {
    const skipSet = new Set(skip);
    return COUNTABLE_VIEW_FILTER_PARAMS.reduce((acc, key) => {
      if (!skipSet.has(key)) {
        acc += this[key].filterLength();
      }
      return acc;
    }, 0);
  }

  satisfiesFilter(filterable: FilterableCard): boolean {
    const isAnd = this.mode.getMode() === 'and';

    if (!this.labels.satisfiesLabelsFilter(filterable.labels, isAnd)) {
      return false;
    }

    if (!this.members.satisfiesMembersFilter(filterable.idMembers, isAnd)) {
      return false;
    }

    if (
      !this.due.satisfiesDueFilter({
        due: filterable.due,
        complete: filterable.complete,
        isAnd,
      })
    ) {
      return false;
    }

    if (
      !this.dateLastActivity.satisfiesActivityFilter({
        dateLastActivity: filterable.dateLastActivity,
      })
    ) {
      return false;
    }

    if (!this.title.satisfiesTitleFilter(filterable.words)) {
      return false;
    }

    return true;
  }

  checkAdvancedChecklistItem({
    name,
    state,
    due,
    idMember,
    labels,
  }: FilterableChecklistItem): boolean {
    const filterableChecklistItem = {
      idMembers: idMember ? [idMember] : [],
      // eslint-disable-next-line @typescript-eslint/no-shadow
      labels: labels?.map(({ color, name }) => ({ color, name })),
      due: due ? new Date(due) : null,
      complete:
        state === 'complete'
          ? CompleteFilter.Complete
          : CompleteFilter.Incomplete,
      words: getWords(dangerouslyConvertPrivacyString(name)),
    };

    return this.satisfiesFilter(filterableChecklistItem);
  }

  updateMirrorCardWithMostRecentActivity(
    sourceCard: FilterableCardWithCustomFields,
    mirrorCard: FilterableCardWithCustomFields,
    idBoard: string,
  ): FilterableCardWithCustomFields {
    const board = client.readFragment({
      id: `Board:${idBoard}`,
      fragment: MirrorBoardCardAgingPrefsFragmentDoc,
    });

    if (!board) {
      return sourceCard;
    }

    const isCardAgingEnabled =
      board.boardPlugins?.some(
        (plugin: Plugin) => plugin.idPlugin === LegacyPowerUps.cardAging,
      ) || board.powerUps?.some((powerUp: string) => powerUp === 'cardAging');

    if (!isCardAgingEnabled) {
      return sourceCard;
    }

    // Picking the most recent dateLastActivity
    let dateLastActivity = sourceCard.dateLastActivity;
    if (mirrorCard?.dateLastActivity && sourceCard?.dateLastActivity) {
      const mirrorInactive =
        Date.now() - new Date(mirrorCard.dateLastActivity).getTime();
      const sourceInactive =
        Date.now() - new Date(sourceCard.dateLastActivity).getTime();
      dateLastActivity =
        mirrorInactive < sourceInactive
          ? mirrorCard.dateLastActivity
          : sourceCard.dateLastActivity;
    } else if (mirrorCard?.dateLastActivity) {
      dateLastActivity = mirrorCard.dateLastActivity;
    }

    return {
      ...sourceCard,
      dateLastActivity,
    };
  }

  checkFilterableCard(
    idBoard: string,
    card: FilterableCardWithCustomFields,
    customFields: CustomField[],
    isCustomFieldsEnabled: boolean,
  ): boolean {
    const { customFieldItems, cardRole, mirrorSourceId } = card;
    const filterableCustomFieldWords = customFieldItems?.map(
      (customFieldItem) => {
        const filterableCustomFieldItem = new CustomFieldItem(
          customFieldItem as unknown as CustomFieldItemType,
        );

        const mappedCustomField =
          filterableCustomFieldItem.getCustomField(customFields);

        if (!mappedCustomField) {
          return undefined;
        }

        return filterableCustomFieldItem.getFilterableWords(mappedCustomField);
      },
    );

    let cardData: FilterableCardWithCustomFields = card;
    if (cardRole === 'mirror') {
      const sourceCard = client.readFragment({
        id: `Card:${mirrorSourceId}`,
        fragment: FilterableCardFragmentDoc,
      });

      if (!sourceCard) {
        return false;
      }

      const updatedCardData = this.updateMirrorCardWithMostRecentActivity(
        sourceCard,
        card,
        idBoard,
      );
      cardData = updatedCardData;
    }

    const {
      idMembers,
      labels,
      due,
      dueComplete,
      name,
      idShort,
      dateLastActivity,
    } = cardData;

    const filterableCard = {
      idMembers,
      labels: labels?.map(({ color, name: labelName }) => ({
        color,
        name: labelName,
      })),
      due: due ? new Date(due) : null,
      dateLastActivity: dateLastActivity ? new Date(dateLastActivity) : '',
      complete: dueComplete
        ? CompleteFilter.Complete
        : CompleteFilter.Incomplete,
      words: _.chain([
        getWords(name),
        getWords(idShort?.toString()),
        isCustomFieldsEnabled ? filterableCustomFieldWords : undefined,
      ])
        .compact()
        .flatten()
        .value(),
    };
    return this.satisfiesFilter(filterableCard);
  }

  toQueryParams(): UrlParams {
    if (this.isFiltering()) {
      const queryParams: UrlParams = {};

      const { labels } = this.labels.toUrlParams();
      const { idMembers } = this.members.toUrlParams();
      const { due, dueComplete } = this.due.toUrlParams();
      const { dateLastActivity } = this.dateLastActivity.toUrlParams();
      const { title } = this.title.toUrlParams();
      const { idBoards } = this.boards.toUrlParams();
      const { mode } = this.mode.toUrlParams();
      const { idLists } = this.list.toUrlParams();
      const { sort } = this.sort.toUrlParams();
      const { autoCollapse } = this.autoCollapse.toUrlParams();

      if (idBoards) {
        queryParams.idBoards = idBoards;
      }
      if (labels) {
        queryParams.labels = labels;
      }
      if (idMembers) {
        queryParams.idMembers = idMembers;
      }
      if (dateLastActivity) {
        queryParams.dateLastActivity = dateLastActivity;
      }
      if (due) {
        queryParams.due = due;
      }
      if (dueComplete) {
        queryParams.dueComplete = dueComplete;
      }
      if (title) {
        queryParams.title = title;
      }
      if (mode) {
        queryParams.mode = mode;
      }
      if (idLists) {
        queryParams.idLists = idLists;
      }
      if (sort) {
        queryParams.sort = sort;
      }
      if (autoCollapse) {
        queryParams.autoCollapse = autoCollapse;
      }

      return queryParams;
    }

    return {};
  }

  static fromQueryParams(urlParams: UrlParams) {
    const viewsFilter: ViewFilters = new ViewFilters({
      boards: BoardsFilter.fromUrlParams(urlParams),
      due: DueFilter.fromUrlParams(urlParams),
      dateLastActivity: ActivityFilter.fromUrlParams(urlParams),
      labels: LabelsFilter.fromUrlParams(urlParams),
      list: ListFilter.fromUrlParams(urlParams),
      members: MembersFilter.fromUrlParams(urlParams),
      sort: SortFilter.fromUrlParams(urlParams),
      mode: ModeFilter.fromUrlParams(urlParams),
      title: TitleFilter.fromUrlParams(urlParams),
      autoCollapse: AutoCollapseListsFilter.fromUrlParams(urlParams),
    });
    return viewsFilter;
  }

  static fromSavedView(cardFilterCriteria: CardFilterCriteria): ViewFilters {
    const viewFilters: ViewFilters = new ViewFilters({
      boards: BoardsFilter.fromCardFilterCriteria(cardFilterCriteria),
      dateLastActivity:
        ActivityFilter.fromCardFilterCriteria(cardFilterCriteria),
      due: DueFilter.fromCardFilterCriteria(cardFilterCriteria),
      labels: LabelsFilter.fromCardFilterCriteria(cardFilterCriteria),
      list: ListFilter.fromCardFilterCriteria(cardFilterCriteria),
      members: MembersFilter.fromCardFilterCriteria(cardFilterCriteria),
      sort: SortFilter.fromCardFilterCriteria(cardFilterCriteria),
      title: TitleFilter.fromCardFilterCriteria(cardFilterCriteria),
    });
    return viewFilters;
  }

  toCardFilterCriteria(idBoards?: Array<string>): CardFilterCriteria {
    const cardFilters: CardFilterCriteria = {};

    const { idLists } = this.list.toCardFilterCriteria();
    const { idMembers } = this.members.toCardFilterCriteria();
    const { dateLastActivity } = this.dateLastActivity.toCardFilterCriteria();
    const { labels } = this.labels.toCardFilterCriteria();
    const { due, dueComplete } = this.due.toCardFilterCriteria();
    const { sort } = this.sort.toCardFilterCriteria();

    if (idBoards) {
      cardFilters.idBoards = idBoards;
    }
    if (idLists) {
      cardFilters.idLists = idLists;
    }
    if (idMembers) {
      cardFilters.idMembers = idMembers;
    }
    if (dateLastActivity) {
      cardFilters.dateLastActivity = dateLastActivity;
    }
    if (labels) {
      cardFilters.labels = labels;
    }
    if (due) {
      cardFilters.due = due;
    }
    if (dueComplete !== null) {
      cardFilters.dueComplete = dueComplete;
    }
    if (sort) {
      cardFilters.sort = sort;
    }

    return cardFilters;
  }

  static constructNewUrl = function (
    routeContext: RouteContext,
  ): ((viewFilters: ViewFilters) => URL) | undefined {
    if (!routeContext.url) {
      return undefined;
    }

    // This will keep populate as a param but remove all other params.
    let search = '';
    if (routeContext.url.searchParams.has('populate')) {
      search = `?${new URLSearchParams({ populate: '' }).toString()}`;
    }

    const newUrl = new URL(
      routeContext.url.origin + routeContext.url.pathname + search,
    );

    return function constructUrlFilterParams(viewFilters: ViewFilters) {
      const newUrlParams = {
        ...viewFilters.toQueryParams(),
      };

      for (const [key, value] of Object.entries(newUrlParams)) {
        if (value) {
          newUrl.searchParams.set(key, value);
        }
      }

      // Hack: The URL api auto-encodes commas and colons, but we want to use "invalid" urls
      // with `,` and `:` characters in them.
      const queryString = toQueryStringWithDecodedFilterParams(
        newUrl.searchParams,
      );
      newUrl.search = queryString.length ? `?${queryString}` : '';
      return newUrl;
    };
  };
}
