import classNames from 'classnames';
import type { ChangeEvent, FunctionComponent } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDebouncedCallback } from 'use-debounce';

import { waitForImageLoad } from '@trello/image-previews';
import { InfiniteList } from '@trello/infinite-list';
import { SearchIcon } from '@trello/nachos/icons/search';
import { Textfield } from '@trello/nachos/textfield';
import { useSharedState } from '@trello/shared-state';
import type { Photo } from '@trello/unsplash';
import { unsplashClient } from '@trello/unsplash';

import { createMenuState } from 'app/src/components/CreateBoardPopover/createMenuState';
import { BackgroundPopoverItem } from './BackgroundPopoverItem';

// eslint-disable-next-line @trello/less-matches-component
import * as styles from './BackgroundPickerPopover.module.less';

/**
 * Breaks an array into chunks of a specific size
 *
 * chunk([1, 2, 3, 4, 5, 6, 7], 3) -> [[1, 2, 3], [4, 5, 6], [7]]
 */
function chunkPhotos(array: Photo[], size: number) {
  if (!array.length || size < 1) {
    return [];
  }
  const result = new Array(Math.ceil(array.length / size));
  for (let idx = 0; idx < result.length; idx++) {
    result[idx] = array.slice(idx * size, idx * size + size);
  }

  return result;
}

const loadMorePhotos = (query = '', page = 1) => {
  // Either use the search API or the latest top picks based
  // on whether a query was provided

  // Do not assume a trimmed string is being provided
  const sanitizedQuery = query.trim();

  const unsplashPromise = sanitizedQuery
    ? unsplashClient.search({ query: sanitizedQuery, page })
    : unsplashClient.getDefaultCollection({ page });

  return unsplashPromise.then(({ response }) => {
    const photos: Photo[] = response?.results || [];
    const total = response?.total || 0;

    return Promise.all(
      photos.map((photo) => waitForImageLoad(photo.urls.small)),
    ).then(() => ({ photos, total }));
  });
};

export const BackgroundPopoverPhotos: FunctionComponent = () => {
  const [currentPhotosPage, setCurrentPhotosPage] = useState(0);
  const [hasMorePhotos, setHasMorePhotos] = useState(true);
  const [menuState, setMenuState] = useSharedState(createMenuState);
  const {
    currentPhotosQuery,
    photos,
    isLoadingPhotos,
    background,
    totalPhotos,
  } = menuState;
  const selectedItem = background.selected.id
    ? background.selected
    : background.preSelected;
  const setBackground = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data: any) => {
      return () => {
        setMenuState({
          ...menuState,
          background: {
            ...menuState.background,
            selected: data,
            shifted: data,
          },
        });
      };
    },
    [menuState, setMenuState],
  );
  const loadMore = useCallback(
    async (query: string) => {
      setMenuState((state) => ({
        ...state,
        isLoadingPhotos: true,
      }));

      try {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const { photos, total } = await loadMorePhotos(
          query,
          currentPhotosPage + 1,
        );
        setHasMorePhotos(menuState.photos.length < total);

        // filter out photos which might already have loaded
        const newPhotos = (photos || []).filter(
          (photo) =>
            !menuState.photos.find((existing) => existing.id === photo.id),
        );
        const combinedPhotos = [...menuState.photos, ...newPhotos];
        setMenuState((state) => ({
          ...state,
          photos: combinedPhotos,
          totalPhotos: total,
          isLoadingPhotos: false,
        }));
      } catch (err) {
        setMenuState({
          ...menuState,
          photos: [],
          totalPhotos: 0,
          isLoadingPhotos: false,
        });
      }
      setCurrentPhotosPage(currentPhotosPage + 1);
    },
    [menuState, setMenuState, currentPhotosPage],
  );
  const debouncedLoadMore = useDebouncedCallback(loadMore, 500);

  const [rows, setRows] = useState<Photo[][]>([]);
  const [query, setQuery] = useState(currentPhotosQuery);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const intl = useIntl();

  // Update status message when results change
  useEffect(() => {
    if (totalPhotos > 0 && !isLoadingPhotos) {
      const message = intl.formatMessage(
        {
          id: 'templates.background_photos.results-count',
          defaultMessage:
            '{count, plural, =1 {# result found} other {# results found}}',
          description:
            'Message showing the number of photos found in search results',
        },
        { count: totalPhotos },
      );
      setStatusMessage(message);
    } else if (!hasMorePhotos && !isLoadingPhotos && rows.length === 0) {
      const message = intl.formatMessage({
        id: 'templates.background_photos.no-results',
        defaultMessage:
          "Sorry, your search didn't return any results. Please try again!",
        description:
          'Message shown when a user searches for photos and no results are found',
      });
      setStatusMessage(message);
    } else {
      setStatusMessage('');
    }
  }, [isLoadingPhotos, totalPhotos, hasMorePhotos, rows.length, query, intl]);

  useEffect(() => {
    // If we are loading more photos, but we don't have enough
    // to populate a full row, we want to trim extraneous photos
    // so we can maintain 3 items per row, until the final page
    // of results come in (which may be less than 3)
    const photosToTrim = isLoadingPhotos ? photos.length % 2 : 0;
    const photosToKeep = photos.slice(0, photos.length - photosToTrim);
    setRows(chunkPhotos(photosToKeep, 2));
  }, [photos, isLoadingPhotos]);

  const onQueryChanged = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const query = e.target.value;
      setQuery(query);
      //Reset the list of photos before loading more
      const { selected, preSelected } = menuState.background;
      const photosToKeep = menuState.photos.filter(
        (photo) =>
          photo.id === selected.id ||
          (photo.id === preSelected.id && selected.id === null),
      );
      setMenuState((state) => ({
        ...state,
        photos: photosToKeep,
        totalPhotos: 0,
        currentPhotosQuery: query,
        isLoadingPhotos: true,
      }));
      setCurrentPhotosPage(0);
      debouncedLoadMore(query);
    },
    [menuState.background, menuState.photos, setMenuState, debouncedLoadMore],
  );

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const getPhotoComponents = (photos: Photo[]) => {
    return photos.map(({ id, urls, user, alt_description }: Photo) => {
      return (
        <BackgroundPopoverItem
          key={`unsplash-${id}`}
          image={urls.small}
          user={user}
          title={
            alt_description ??
            intl.formatMessage({
              id: 'templates.create_board.custom_image',
              defaultMessage: 'Custom image',
              description: 'Title for a custom image',
            })
          }
          selected={selectedItem.type === 'unsplash' && selectedItem.id === id}
          onSelect={setBackground({ type: 'unsplash', id })}
          isPhoto
        />
      );
    });
  };

  const getPlaceholderImages = (row: number) => {
    return [1, 2, 3].map((item) => (
      <div
        key={`placeholder-${row}-${item}`}
        className={styles.backgroundGridItem}
      >
        <div className={classNames(styles.backgroundGridTrigger)} />
      </div>
    ));
  };

  const renderVirtualizedContent = (index: number, key: number) => {
    return (
      <div className={styles.itemRow} key={key}>
        {rows.length
          ? getPhotoComponents(rows[index])
          : getPlaceholderImages(index)}
      </div>
    );
  };

  return (
    <div className={styles.photosWrapper}>
      <div className={styles.searchWrapper}>
        <Textfield
          iconBefore={<SearchIcon size="small" />}
          className={styles.searchInput}
          placeholder={intl.formatMessage({
            id: 'templates.background_photos.photos',
            defaultMessage: 'Photos',
            description:
              'Placeholder text for the search input in the background picker',
          })}
          aria-label={intl.formatMessage({
            id: 'templates.background_photos.search-photos',
            defaultMessage: 'Search photos',
            description:
              'Aria label for the search input in the background picker',
          })}
          value={query}
          onChange={onQueryChanged}
        />
      </div>

      <div
        aria-live="polite"
        aria-atomic="true"
        role="status"
        className={totalPhotos > 0 ? styles.hidden : ''}
      >
        {statusMessage}
      </div>

      <InfiniteList
        loadMore={() => loadMore(query)}
        hasMore={!isLoadingPhotos && hasMorePhotos}
        isLoading={isLoadingPhotos}
      >
        <div
          role="radiogroup"
          aria-label={intl.formatMessage({
            id: 'templates.background_photos.photos',
            defaultMessage: 'Photos',
            description:
              'Placeholder text for the search input in the background picker',
          })}
        >
          <ul>
            {rows.map((_, index) => renderVirtualizedContent(index, index))}
          </ul>
        </div>
      </InfiniteList>
    </div>
  );
};
