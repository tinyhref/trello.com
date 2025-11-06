import cx from 'classnames';
import FocusLock from 'react-focus-lock';

import { getTestId, type ColorPaletteTestIds } from '@trello/test-ids';

import { ColorTile } from './ColorTile';
import { type Color } from './formatColor';

import * as styles from './ColorPalette.module.less';

interface ColorPaletteProps<T> {
  onClick: (color: T) => void;
  colorOptions: T[];
  selectedColor: T | null;
  isSourceSidebarMenu?: boolean;
  ariaLabelledBy?: string;
}

export const ColorPalette = <T extends Color>({
  onClick,
  colorOptions,
  selectedColor,
  isSourceSidebarMenu,
  ariaLabelledBy,
}: ColorPaletteProps<T>) => {
  return (
    <div
      data-testid={getTestId<ColorPaletteTestIds>('color-palette')}
      role="radiogroup"
      aria-labelledby={ariaLabelledBy}
    >
      {/* The default display: block from FocusLock would break the color palette style, so display: contents is used to correct the layout. */}
      <FocusLock className={styles.focusLock} disabled={true}>
        <ul
          className={cx(styles.palette, {
            [styles.noHorizontalMargin]: isSourceSidebarMenu,
          })}
        >
          {colorOptions.map((color) => (
            <ColorTile
              key={color}
              color={color}
              onClick={onClick}
              isSelected={selectedColor === color}
            />
          ))}
        </ul>
      </FocusLock>
    </div>
  );
};
