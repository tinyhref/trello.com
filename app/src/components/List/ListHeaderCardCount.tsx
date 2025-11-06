import type { FunctionComponent } from 'react';
import { useCallback } from 'react';

import { localizeCount } from '@trello/legacy-i18n';
import { useSharedStateSelector } from '@trello/shared-state';

import { viewFiltersContextSharedState } from 'app/src/components/ViewFilters/viewFiltersContextSharedState';
import type { ListContextValue } from './ListContext';
import { useIsListCollapsed, useListContext } from './useListContext';

import * as styles from './ListHeaderCardCount.module.less';

export const ListHeaderCardCount: FunctionComponent = () => {
  const isFiltering = useSharedStateSelector(
    viewFiltersContextSharedState,
    useCallback(({ viewFilters }) => viewFilters.filters.isFiltering(), []),
  );
  const isListCollapsed = useIsListCollapsed();

  const getVisibleCardCountCallback = useCallback(
    (value: ListContextValue) => value.visibleCardIds.length,
    [],
  );
  const numCards = useListContext(getVisibleCardCountCallback);

  const shouldRender = isFiltering || isListCollapsed;

  if (!shouldRender) {
    return null;
  }

  if (isListCollapsed) {
    return <p className={styles.collapsedCardCount}>{numCards}</p>;
  }

  return (
    <p className={styles.filteredCardCount}>
      {localizeCount('filtered cards', numCards)}
    </p>
  );
};
