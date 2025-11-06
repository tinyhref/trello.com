import {
  useEffect,
  useMemo,
  useState,
  type ForwardRefExoticComponent,
  type PropsWithChildren,
  type ReactNode,
  type RefAttributes,
} from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';

import { Spinner } from '@trello/nachos/spinner';

export interface ThrottledInfiniteListProps<TElement> {
  loadMore?: () => void;
  hasMore: boolean;
  isLoading?: boolean;
  spinnerClassName?: string;
  ListContainer?: ForwardRefExoticComponent<
    PropsWithChildren & RefAttributes<TElement>
  >;
  renderItem: (idx: number, key: number) => ReactNode;
  itemCount: number;
  pageSize: number;
}

/**
 * Provides a list of items that are rendered in a paginated fashion. The list will
 * load a single "page" of items at a time, and only render more items when the user
 * scrolls to the bottom of the list. The component can also request more data when
 * the currently loaded data is exhausted, and `hasMore` is true, via the `loadMore`
 * callback.
 * @param loadMore (optional) A function that will be called when `hasMore` is true,
 * `itemCount` items have been rendered, and the user scrolls to the bottom of the list.
 * @param hasMore Is more data available if the user scrolls past the current
 * item count?
 * @param isLoading (optional) Is the list currently loading more items?
 * @param spinnerClassName (optional) A class name to be applied to the spinner when
 * it is showing.
 * @param ListContainer (optional) A component that will be used to wrap the list of items.
 * @param renderItem A function that will be called to render each item in the list,
 * based on the item's index.
 * @param itemCount The total number of items that can be rendered in the list, based
 * on the currently loaded data. If `hasMore` is true, the expectation is that `loadMore`
 * will increase this number after being called.
 * @param pageSize The number of items to be rendered at a time. This is the number
 * of items that will be rendered when the user scrolls to the bottom of the list,
 * and when the list initially loads.
 */
export const ThrottledInfiniteList = <TElement extends HTMLElement>({
  loadMore,
  hasMore,
  isLoading = false,
  spinnerClassName,
  ListContainer,
  renderItem,
  itemCount = 0,
  pageSize = 20,
}: ThrottledInfiniteListProps<TElement>) => {
  const [throttledElements, setThrottledElements] = useState<ReactNode[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const renderedElements = throttledElements.length - 1;

  const throttledRender = async () => {
    const elements: ReactNode[] = [];
    const startCount = Math.max(renderedElements + 1, 0);
    const desiredCount = startCount + pageSize;
    const desiredRenderableCount = Math.min(desiredCount, itemCount);
    for (let i = startCount; i < desiredRenderableCount; i++) {
      elements.push(renderItem!(i, i));
    }
    setThrottledElements((existing) => [...existing, ...elements]);
    setIsInitialized(true);
    if (desiredCount >= itemCount && hasMore) {
      await loadMore?.();
    }
  };

  const canRenderMore = hasMore || renderedElements < itemCount;

  const infiniteScrollProps = useMemo(
    () => ({
      loading: isLoading,
      hasNextPage: canRenderMore,
      onLoadMore: throttledRender,
      rootMargin: '0px 0px 300px 0px',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, hasMore, loadMore, throttledElements],
  );

  const [sentryRef, { rootRef }] = useInfiniteScroll(infiniteScrollProps);

  useEffect(() => {
    if (throttledElements.length > 0) {
      setThrottledElements([]);
      setIsInitialized(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderItem, pageSize]);

  useEffect(() => {
    if (throttledElements.length === 0 && !isInitialized) {
      throttledRender();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [throttledElements, isInitialized]);

  if (ListContainer) {
    return (
      <ListContainer ref={rootRef}>
        {throttledElements}
        {isLoading && <Spinner centered wrapperClassName={spinnerClassName} />}
        {canRenderMore && <div ref={sentryRef} />}
      </ListContainer>
    );
  } else {
    return (
      <>
        {throttledElements}
        {isLoading && <Spinner centered wrapperClassName={spinnerClassName} />}
        {canRenderMore && <div ref={sentryRef} />}
      </>
    );
  }
};
