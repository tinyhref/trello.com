import type { FunctionComponent, MouseEventHandler, RefObject } from 'react';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import { intl } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import { useSharedState } from '@trello/shared-state';

import type { BackgroundItemState } from 'app/src/components/CreateBoardPopover/createMenuState';
import { createMenuState } from 'app/src/components/CreateBoardPopover/createMenuState';
import { BackgroundPopoverItem } from './BackgroundPopoverItem';
import {
  getMappedBackgroundColorPickerComponents,
  getMappedBackgroundPhotoPickerComponents,
  getShiftedBackgroundItem,
} from './Helpers';

import * as styles from './BackgroundPickerPopover.module.less';

const BACKGROUND_PICKER_PHOTOS_ITEMS_LENGTH = 6;
const BACKGROUND_PICKER_COLORS_ITEMS_LENGTH = 6;

interface BackgroundPickerProps {
  onSeeMorePhotos: () => void;
  onSeeMoreColors: () => void;
  seeMorePhotosButtonRef: RefObject<HTMLButtonElement>;
  seeMoreColorsButtonRef: RefObject<HTMLButtonElement>;
}

export const BackgroundPickerPopover: FunctionComponent<
  BackgroundPickerProps
> = ({
  onSeeMorePhotos,
  onSeeMoreColors,
  seeMorePhotosButtonRef,
  seeMoreColorsButtonRef,
}) => {
  const [menuState, setMenuState] = useSharedState(createMenuState);
  const { photos, background } = menuState;
  const selectedItem = background.selected.id
    ? background.selected
    : background.preSelected;
  const shiftedItem = background.shifted;
  const setBackground = useCallback(
    (data: BackgroundItemState) => () => {
      setMenuState({
        ...menuState,
        background: {
          ...menuState.background,
          selected: data,
          shifted: data,
        },
      });
    },
    [menuState, setMenuState],
  );

  // get the photos for the default background picker
  const defaultPhotos = getMappedBackgroundPhotoPickerComponents(
    BACKGROUND_PICKER_PHOTOS_ITEMS_LENGTH,
    BackgroundPopoverItem,
    photos,
    selectedItem,
    setBackground,
  );

  // get the colors for the default background picker
  const defaultColors = getMappedBackgroundColorPickerComponents(
    BACKGROUND_PICKER_COLORS_ITEMS_LENGTH,
    BackgroundPopoverItem,
    selectedItem,
    setBackground,
  );

  /**
   * If the user has selected a color or a photo with an index greater than the number
   * of colors/photos we display in the create board menu, we need to shift the selected
   * color or photo BackgroundItem component onto the array.
   */
  const [shiftedDefaultColorItem, shiftedDefaultPhotoItem] =
    getShiftedBackgroundItem(
      BACKGROUND_PICKER_PHOTOS_ITEMS_LENGTH,
      BACKGROUND_PICKER_COLORS_ITEMS_LENGTH,
      BackgroundPopoverItem,
      photos,
      selectedItem,
      setBackground,
      shiftedItem,
    );
  /**
   * If we have an item that we need to move to the front of the array, replace the first
   * photo with the selected item and render the rest normally.
   */
  const defaultPhotoItems = [
    ...(!shiftedDefaultPhotoItem
      ? defaultPhotos
      : [shiftedDefaultPhotoItem, ...defaultPhotos.slice(1)]),
  ];

  const defaultColorItems = [
    ...(!shiftedDefaultColorItem
      ? defaultColors
      : [shiftedDefaultColorItem, ...defaultColors.slice(1)]),
  ];

  const unshiftBackground = useCallback(() => {
    setMenuState({
      ...menuState,
      background: {
        ...menuState.background,
        shifted: {
          id: null,
          type: null,
        },
      },
    });
  }, [menuState, setMenuState]);
  const resetShiftedItem = useCallback(() => {
    if (shiftedItem.id !== selectedItem.id) {
      unshiftBackground();
    }
  }, [shiftedItem.id, selectedItem.id, unshiftBackground]);

  const onClickSeeMorePhotos: MouseEventHandler = useCallback(
    (e) => {
      onSeeMorePhotos();
      resetShiftedItem();
    },
    [onSeeMorePhotos, resetShiftedItem],
  );

  const onClickSeeMoreColors: MouseEventHandler = useCallback(
    (e) => {
      onSeeMoreColors();
      resetShiftedItem();
    },
    [onSeeMoreColors, resetShiftedItem],
  );

  return (
    <>
      <section>
        <header className={styles.backgroundChooserHeader}>
          <h3
            className={styles.backgroundChooserHeading}
            id="background-photo-chooser-header"
          >
            <FormattedMessage
              id="templates.create_board.photos"
              defaultMessage="Photos"
              description="Label for the photos section in the background picker"
            />
          </h3>
          <Button
            className="bottomPadding"
            onClick={onClickSeeMorePhotos}
            aria-label={intl.formatMessage({
              id: 'templates.create_board.more-photos',
              defaultMessage: 'More photos',
              description: 'Button label for the more photos button',
            })}
            ref={seeMorePhotosButtonRef}
          >
            <FormattedMessage
              id="templates.create_board.view-more"
              defaultMessage="View more"
              description="Label for the view more button in the background picker"
            />
          </Button>
        </header>
        <div
          role="radiogroup"
          aria-labelledby="background-photo-chooser-header"
        >
          <ul className={styles.backgroundGrid}>{defaultPhotoItems}</ul>
        </div>
      </section>
      <section>
        <header className={styles.backgroundChooserHeader}>
          <h3
            className={styles.backgroundChooserHeading}
            id="background-color-chooser-header"
          >
            <FormattedMessage
              id="templates.create_board.colors"
              defaultMessage="Colors"
              description="Label for the colors section in the background picker"
            />
          </h3>
          <Button
            className="bottomPadding"
            onClick={onClickSeeMoreColors}
            aria-label={intl.formatMessage({
              id: 'templates.create_board.more-colors',
              defaultMessage: 'More colors',
              description: 'Button label for the more colors button',
            })}
            ref={seeMoreColorsButtonRef}
          >
            <FormattedMessage
              id="templates.create_board.view-more"
              defaultMessage="View more"
              description="Label for the view more button in the background picker"
            />
          </Button>
        </header>
        <div
          role="radiogroup"
          aria-labelledby="background-color-chooser-header"
        >
          <ul className={styles.backgroundGrid}>{defaultColorItems}</ul>
        </div>
      </section>
    </>
  );
};
