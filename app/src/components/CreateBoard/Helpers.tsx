/* eslint-disable @trello/export-matches-filename */
import type { ComponentType } from 'react';
import { FormattedMessage, type IntlShape } from 'react-intl';

import { ColorBackgrounds, GradientBackgrounds } from '@trello/boards';
import { intl as intlModule } from '@trello/i18n';
import type { CreateBoardTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';
import { getGlobalTheme } from '@trello/theme';
import type { Photo } from '@trello/unsplash';

import type { BackgroundItemState } from 'app/src/components/CreateBoardPopover/createMenuState';
import type { BackgroundItemProps } from './BackgroundItem';

/**
 *  Determines how many photos to show depending on whether or not we have photos loaded
 */
const getPhotosIndexRange = (
  photosLength: number,
  totalItemLength: number,
): number => {
  return Math.min(photosLength, totalItemLength);
};

/**
 *  Returns the title for a board background
 */
export const getBoardBackgroundString = (
  backgroundId: string,
  intl: IntlShape,
): string => {
  switch (backgroundId) {
    case 'blue':
      return intl.formatMessage({
        id: 'templates.board_backgrounds.blue',
        defaultMessage: 'Blue',
        description: 'Title for the blue background',
      });
    case 'orange':
      return intl.formatMessage({
        id: 'templates.board_backgrounds.orange',
        defaultMessage: 'Orange',
        description: 'Title for the orange background',
      });
    case 'green':
      return intl.formatMessage({
        id: 'templates.board_backgrounds.green',
        defaultMessage: 'Green',
        description: 'Title for the green background',
      });
    case 'red':
      return intl.formatMessage({
        id: 'templates.board_backgrounds.red',
        defaultMessage: 'Red',
        description: 'Title for the red background',
      });
    case 'purple':
      return intl.formatMessage({
        id: 'templates.board_backgrounds.purple',
        defaultMessage: 'Purple',
        description: 'Title for the purple background',
      });
    case 'pink':
      return intl.formatMessage({
        id: 'templates.board_backgrounds.pink',
        defaultMessage: 'Pink',
        description: 'Title for the pink background',
      });
    case 'lime':
      return intl.formatMessage({
        id: 'templates.board_backgrounds.lime',
        defaultMessage: 'Lime',
        description: 'Title for the lime background',
      });
    case 'sky':
      return intl.formatMessage({
        id: 'templates.board_backgrounds.sky',
        defaultMessage: 'Sky',
        description: 'Title for the sky background',
      });
    case 'grey':
      return intl.formatMessage({
        id: 'templates.board_backgrounds.grey',
        defaultMessage: 'Gray',
        description: 'Title for the gray background',
      });
    case 'gradient-bubble':
      return intl.formatMessage({
        id: 'templates.board_backgrounds.light-blue-gradient',
        defaultMessage: 'Light blue gradient',
        description: 'Title for the light blue gradient background',
      });
    case 'gradient-snow':
      return intl.formatMessage({
        id: 'templates.board_backgrounds.blue-gradient',
        defaultMessage: 'Blue gradient',
        description: 'Title for the blue gradient background',
      });
    case 'gradient-ocean':
      return intl.formatMessage({
        id: 'templates.board_backgrounds.dark-blue-gradient',
        defaultMessage: 'Dark blue gradient',
        description: 'Title for the dark blue background',
      });
    case 'gradient-crystal':
      return intl.formatMessage({
        id: 'templates.board_backgrounds.dark-purple-gradient',
        defaultMessage: 'Dark purple gradient',
        description: 'Title for the dark purple background',
      });
    case 'gradient-rainbow':
      return intl.formatMessage({
        id: 'templates.board_backgrounds.purple-gradient',
        defaultMessage: 'Purple gradient',
        description: 'Title for the purple gradient background',
      });
    case 'gradient-peach':
      return intl.formatMessage({
        id: 'templates.board_backgrounds.orange-gradient',
        defaultMessage: 'Orange gradient',
        description: 'Title for the orange gradient background',
      });
    case 'gradient-flower':
      return intl.formatMessage({
        id: 'templates.board_backgrounds.pink-gradient',
        defaultMessage: 'Pink gradient',
        description: 'Title for the pink gradient background',
      });
    case 'gradient-earth':
      return intl.formatMessage({
        id: 'templates.board_backgrounds.green-gradient',
        defaultMessage: 'Green gradient',
        description: 'Title for the green gradient background',
      });
    case 'gradient-alien':
      return intl.formatMessage({
        id: 'templates.board_backgrounds.gray-gradient',
        defaultMessage: 'Gray gradient',
        description: 'Title for the gray gradient background',
      });
    case 'gradient-volcano':
      return intl.formatMessage({
        id: 'templates.board_backgrounds.red-gradient',
        defaultMessage: 'Red gradient',
        description: 'Title for the red gradient background',
      });
    default:
      return '';
  }
};

/**
 *  Returns the subtext for a board visibility
 */
export const getBoardMenuVisSubtext = (
  id: string,
  { orgName, enterpriseName }: { orgName?: string; enterpriseName?: string },
) => {
  switch (id) {
    case 'private-board-without-organization':
      return (
        <FormattedMessage
          id="templates.board_menu_vis.private-board-without-organization"
          defaultMessage="Only board members can see and edit this board."
          description="Board menu visibility for private board without organization"
        />
      );
    case 'org-board-without-organization':
      return (
        <FormattedMessage
          id="templates.board_menu_vis.org-board-without-organization"
          defaultMessage="All members of the Workspace can see and edit this board. The board must be added to a Workspace to enable this."
          description="Board menu visibility for org board without organization"
        />
      );
    case 'org-board-with-organization':
      return (
        <FormattedMessage
          id="templates.board_menu_vis.org-board-with-organization"
          defaultMessage="All members of the {orgName} Workspace can see and edit this board."
          description="Board menu visibility for org board with organization"
          values={{ orgName }}
        />
      );
    case 'org-board-with-enterprise':
      return (
        <FormattedMessage
          id="templates.board_menu_vis.org-board-with-enterprise"
          defaultMessage="All members of the {orgName} Workspace can see and edit this board."
          description="Board menu visibility for org board with enterprise"
          values={{ orgName }}
        />
      );
    case 'org-board-with-super-admins':
      return (
        <FormattedMessage
          id="templates.board_menu_vis.org-board-with-super-admins"
          defaultMessage="All members of the {orgName} Workspace can see and edit this board."
          description="Board menu visibility for org board with super admins"
          values={{ orgName }}
        />
      );
    case 'enterprise-board-without-organization':
      return (
        <FormattedMessage
          id="templates.board_menu_vis.enterprise-board-without-organization"
          defaultMessage="All members of the organization can see this board. The board must be added to an enterprise Workspace to enable this."
          description="Board menu visibility for enterprise board without organization"
        />
      );
    case 'enterprise-board-with-organization':
      return (
        <FormattedMessage
          id="templates.board_menu_vis.enterprise-board-with-organization"
          defaultMessage="All members of the organization can see this board. The board must be added to an enterprise Workspace to enable this."
          description="Board menu visibility for enterprise board with organization"
        />
      );
    case 'enterprise-board-with-enterprise':
      return (
        <FormattedMessage
          id="templates.board_menu_vis.enterprise-board-with-enterprise"
          defaultMessage="Anyone at {enterpriseName} can see this board. Only board members and Workspace admins can edit."
          description="Board menu visibility for enterprise board with enterprise"
          values={{ enterpriseName }}
        />
      );
    case 'enterprise-board-with-super-admins':
      return (
        <FormattedMessage
          id="templates.board_menu_vis.enterprise-board-with-super-admins"
          defaultMessage="All members of the organization can see this board. The board must be added to an enterprise Workspace to enable this."
          description="Board menu visibility for enterprise board with super admins"
        />
      );
    case 'public-board-without-organization':
      return (
        <FormattedMessage
          id="templates.board_menu_vis.public-board-without-organization"
          defaultMessage="Anyone on the internet can see this board. Only board members can edit."
          description="Board menu visibility for public board without organization"
        />
      );
    case 'public-board-with-organization':
      return (
        <FormattedMessage
          id="templates.board_menu_vis.public-board-with-organization"
          defaultMessage="Anyone on the internet can see this board. Only board members can edit."
          description="Board menu visibility for public board with organization"
        />
      );
    case 'public-board-with-enterprise':
      return (
        <FormattedMessage
          id="templates.board_menu_vis.public-board-with-enterprise"
          defaultMessage="Anyone on the internet can see this board. Only board members can edit."
          description="Board menu visibility for public board with enterprise"
        />
      );
    case 'public-board-with-super-admins':
      return (
        <FormattedMessage
          id="templates.board_menu_vis.public-board-with-super-admins"
          defaultMessage="Anyone on the internet can see this board. Only board members can edit."
          description="Board menu visibility for public board with super admins"
        />
      );
    case 'private-board-with-organization':
      return (
        <FormattedMessage
          id="templates.board_menu_vis.private-board-with-organization"
          defaultMessage="Only board members can see this board. Workspace admins can close the board or remove members."
          description="Board menu visibility for private board with organization"
        />
      );
    case 'private-board-with-enterprise':
      return (
        <FormattedMessage
          id="templates.board_menu_vis.private-board-with-enterprise"
          defaultMessage="Board members and {orgName} Workspace admins can see and edit this board."
          description="Board menu visibility for private board with enterprise"
          values={{ orgName }}
        />
      );
    case 'private-board-with-super-admins':
      return (
        <FormattedMessage
          id="templates.board_menu_vis.private-board-with-super-admins"
          defaultMessage="Board members and {orgName} Workspace admins can see and edit this board."
          description="Board menu visibility for private board with super admins"
          values={{ orgName }}
        />
      );
    case 'illegal-visibility-create':
      return (
        <FormattedMessage
          id="templates.board_menu_vis.illegal-visibility-create"
          defaultMessage="You cannot create a board with this visibility due to a restriction created by a Workspace admin."
          description="Message shown when trying to create a board with an illegal visibility"
        />
      );
    case 'illegal-visibility-create-teamless':
      return (
        <FormattedMessage
          id="templates.board_menu_vis.illegal-visibility-create-teamless"
          defaultMessage="You cannot create a board with this visibility due to a restriction created by an enterprise admin."
          description="Message shown when trying to create a teamless board with an illegal visibility"
        />
      );
    default:
      return null;
  }
};

/**
 *  Returns the label for a board visibility
 */
export const getBoardMenuVisLabel = (vis: string, intl: IntlShape) => {
  switch (vis) {
    case 'public':
      return intl.formatMessage({
        id: 'templates.board_menu_vis.public',
        defaultMessage: 'Public',
        description: 'Board menu visibility for public',
      });
    case 'private':
      return intl.formatMessage({
        id: 'templates.board_menu_vis.private',
        defaultMessage: 'Private',
        description: 'Board menu visibility for private',
      });
    case 'org':
      return intl.formatMessage({
        id: 'templates.board_menu_vis.org',
        defaultMessage: 'Workspace',
        description: 'Board menu visibility for org',
      });
    case 'enterprise':
      return intl.formatMessage({
        id: 'templates.board_menu_vis.enterprise',
        defaultMessage: 'Organization',
        description: 'Board menu visibility for enterprise',
      });
    default:
      return '';
  }
};

/**
 *  Returns an array of photo BackgroundItem or BackgroundPopoverItem components
 */
export const getMappedBackgroundPhotoPickerComponents = (
  totalLength: number,
  Component: ComponentType<BackgroundItemProps>,
  photos: Photo[],
  selectedItem: BackgroundItemState,
  onSelect: (data: BackgroundItemState) => () => void,
) => {
  const photosIndexRange = getPhotosIndexRange(photos.length, totalLength);

  const photosMap = photos
    .slice(0, photosIndexRange)
    .map(({ id, urls, user, alt_description }: Photo) => {
      if (!urls) {
        return null;
      }

      const altText =
        alt_description ??
        intlModule.formatMessage({
          id: 'templates.create_board.custom_image',
          defaultMessage: 'Custom image',
          description: 'Title for a custom image',
        });

      return (
        <Component
          testId={getTestId<CreateBoardTestIds>('background-picker-image')}
          key={`unsplash-${id}`}
          image={urls.small}
          user={user}
          title={altText}
          selected={selectedItem.type === 'unsplash' && selectedItem.id === id}
          onSelect={onSelect({ type: 'unsplash', id })}
          isPhoto
        />
      );
    });

  return photosMap;
};

/**
 *  Returns an array of color BackgroundItem or BackgroundPopoverItem components
 */
export const getMappedBackgroundColorPickerComponents = (
  totalLength: number,
  Component: ComponentType<BackgroundItemProps>,
  selectedItem: BackgroundItemState,
  onSelect: (data: BackgroundItemState) => () => void,
) => {
  const { effectiveColorMode } = getGlobalTheme();
  const isDarkMode = effectiveColorMode === 'dark';

  const gradients = Object.values(GradientBackgrounds);
  const gradientsMap = gradients.slice(0, totalLength).map((metadata) => {
    const image =
      isDarkMode && 'darkFullSizeUrl' in metadata
        ? metadata.darkFullSizeUrl
        : metadata.fullSizeUrl;

    return (
      <Component
        testId={getTestId<CreateBoardTestIds>('background-picker-color')}
        key={`gradient-${metadata.id}`}
        title={getBoardBackgroundString(metadata.id, intlModule)}
        color={metadata.color}
        image={image}
        selected={
          selectedItem.type === metadata.type && selectedItem.id === metadata.id
        }
        onSelect={onSelect({ type: 'gradient', id: metadata.id })}
      />
    );
  });

  return gradientsMap;
};

/**
 * Returns an array of color and photo BackgroundItem component. Either or both can be null
 * which means there is no shifted background. We need a shifted background if the
 * selection has an index number high enough that it would not ordinarily be shown in
 * the default group of background items. If there's no shifted background, returns early.
 */
export const getShiftedBackgroundItem = (
  totalLengthPhotos: number,
  totalLengthColors: number,
  Component: ComponentType<BackgroundItemProps>,
  photos: Photo[],
  selectedItem: BackgroundItemState,
  onSelect: (data: BackgroundItemState) => () => void,
  shiftedItem: BackgroundItemState,
) => {
  const { id, type } = shiftedItem;

  if (!id) {
    return [null, null];
  }

  const { effectiveColorMode } = getGlobalTheme();
  const isDarkMode = effectiveColorMode === 'dark';

  const photosIndexRange = getPhotosIndexRange(
    photos.length,
    totalLengthPhotos,
  );
  const gradientIds = Object.keys(GradientBackgrounds);

  let colorComponent = null;
  let photoComponent = null;

  if (type === 'default') {
    const shiftedColor = ColorBackgrounds[id];
    const { color } = shiftedColor;

    colorComponent = (
      <Component
        testId={getTestId<CreateBoardTestIds>('background-picker-color')}
        key={`color-${id}`}
        title={getBoardBackgroundString(id, intlModule)}
        color={color}
        selected={selectedItem.id === id}
        onSelect={onSelect({ type, id })}
      />
    );
  } else if (type === 'gradient') {
    const shiftedGradient = GradientBackgrounds[id];
    const shiftedGradientIndex = gradientIds.indexOf(id);
    const fullSizeUrl =
      isDarkMode && 'darkFullSizeUrl' in shiftedGradient
        ? shiftedGradient.darkFullSizeUrl
        : shiftedGradient.fullSizeUrl;

    if (shiftedGradientIndex >= totalLengthColors) {
      colorComponent = (
        <Component
          testId={getTestId<CreateBoardTestIds>('background-picker-color')}
          key={`gradient-${id}`}
          title={getBoardBackgroundString(id, intlModule)}
          color={shiftedGradient.color}
          image={fullSizeUrl}
          selected={selectedItem.id === id}
          onSelect={onSelect({ type, id })}
        />
      );
    }
  } else if (type === 'unsplash') {
    const shiftedPhotoIndex = photos.findIndex((photo) => id === photo.id);
    const shiftedPhoto = photos[shiftedPhotoIndex];
    const { urls, user } = shiftedPhoto || {};

    if (!urls) {
      return [null, null];
    }

    if (shiftedPhotoIndex >= photosIndexRange) {
      photoComponent = (
        <Component
          testId={getTestId<CreateBoardTestIds>('background-picker-image')}
          key={`unsplash-${id}`}
          image={urls.small}
          user={user}
          selected={selectedItem.id === id}
          onSelect={onSelect({ type, id })}
          isPhoto
        />
      );
    }
  }

  return [colorComponent, photoComponent];
};
