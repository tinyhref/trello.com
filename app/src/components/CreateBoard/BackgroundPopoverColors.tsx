import classNames from 'classnames';
import type { FunctionComponent } from 'react';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';

import type { ColorBackground } from '@trello/boards';
import { ColorBackgrounds, GradientBackgrounds } from '@trello/boards';
import { useSharedState } from '@trello/shared-state';
import { useIsDarkMode } from '@trello/theme';

import type { BackgroundItemState } from 'app/src/components/CreateBoardPopover/createMenuState';
import { createMenuState } from 'app/src/components/CreateBoardPopover/createMenuState';
import { BackgroundPopoverItem } from './BackgroundPopoverItem';
import { getBoardBackgroundString } from './Helpers';

// eslint-disable-next-line @trello/less-matches-component
import * as styles from './BackgroundPickerPopover.module.less';

export const BackgroundPopoverColors: FunctionComponent = () => {
  const [menuState, setMenuState] = useSharedState(createMenuState);
  const isDarkMode = useIsDarkMode();
  const background = menuState.background;
  const selectedItem = background.selected.id
    ? background.selected
    : background.preSelected;
  const setBackground = useCallback(
    (data: BackgroundItemState) => {
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

  const intl = useIntl();

  const renderColors = () => {
    return Object.entries(ColorBackgrounds).map(
      ([id, metadata]: [string, ColorBackground]) => {
        return (
          <BackgroundPopoverItem
            key={`color-${id}`}
            title={getBoardBackgroundString(id, intl)}
            color={metadata.color}
            selected={
              selectedItem.type === metadata.type && selectedItem.id === id
            }
            onSelect={setBackground({ type: 'default', id })}
          />
        );
      },
    );
  };

  const renderGradients = () => {
    return Object.values(GradientBackgrounds).map((metadata) => {
      const image =
        isDarkMode && 'darkFullSizeUrl' in metadata
          ? metadata.darkFullSizeUrl
          : metadata.fullSizeUrl;

      return (
        <BackgroundPopoverItem
          key={`gradient-${metadata.id}`}
          title={getBoardBackgroundString(metadata.id, intl)}
          image={image}
          color={metadata.color}
          selected={
            selectedItem.type === metadata.type &&
            selectedItem.id === metadata.id
          }
          onSelect={setBackground({ type: 'gradient', id: metadata.id })}
        />
      );
    });
  };

  return (
    <div
      role="radiogroup"
      aria-label={intl.formatMessage({
        id: 'view title.change background colors',
        defaultMessage: 'Colors',
        description: 'Title for board background color picker popover screen',
      })}
    >
      <ul
        className={classNames(
          styles.backgroundChooserColors,
          styles.backgroundGrid,
        )}
      >
        {renderGradients()}
      </ul>
      <hr role="presentation" />
      <ul
        className={classNames(
          styles.backgroundChooserColors,
          styles.backgroundGrid,
        )}
      >
        {renderColors()}
      </ul>
    </div>
  );
};
