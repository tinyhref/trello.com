import {
  useMemo,
  type ForwardRefExoticComponent,
  type PropsWithChildren,
  type RefAttributes,
} from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';

import { Spinner } from '@trello/nachos/spinner';

interface InfiniteListProps<TElement> {
  loadMore: () => void;
  hasMore: boolean;
  isLoading?: boolean;
  spinnerClassName?: string;
  ListContainer?: ForwardRefExoticComponent<
    PropsWithChildren & RefAttributes<TElement>
  >;
}

/**
 * Provides a list of items that automatically loads more data as the user scrolls
 * to the bottom of the list.
 * @param loadMore A function that will be called when `hasMore` is true, and the
 * user scrolls to the bottom of the list.
 * @param hasMore Is more data available if the user scrolls past the currently
 * rendered items?
 * @param isLoading (optional) Is the list currently loading more items?
 * @param spinnerClassName (optional) A class name to be applied to the spinner
 * when it is showing.
 * @param ListContainer (optional) A component that will be used to wrap the list
 * of items.
 * @param children The items to be rendered in the list.
 */
export const InfiniteList = <TElement extends HTMLElement>({
  loadMore,
  hasMore,
  isLoading = false,
  spinnerClassName,
  ListContainer,
  children,
}: PropsWithChildren<InfiniteListProps<TElement>>) => {
  const infiniteScrollProps = useMemo(
    () => ({
      loading: isLoading,
      hasNextPage: hasMore,
      onLoadMore: loadMore,
      rootMargin: '0px 0px 300px 0px',
    }),
    [isLoading, hasMore, loadMore],
  );
  const [sentryRef, { rootRef }] = useInfiniteScroll(infiniteScrollProps);

  if (ListContainer) {
    return (
      <ListContainer ref={rootRef}>
        {children}
        {isLoading && <Spinner centered wrapperClassName={spinnerClassName} />}
        {hasMore && <div ref={sentryRef} />}
      </ListContainer>
    );
  }

  return (
    <>
      {children}
      {isLoading && <Spinner centered wrapperClassName={spinnerClassName} />}
      {hasMore && <div ref={sentryRef} />}
    </>
  );
};
