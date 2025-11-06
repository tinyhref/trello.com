import cx from 'classnames';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { useCallback, useRef } from 'react';
import { useFocusScope } from 'react-focus-lock';

import { getKey, Key } from '@trello/keybindings';
import { Button } from '@trello/nachos/button';
import { Tooltip } from '@trello/nachos/tooltip';
import type { ColorPaletteTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { formatColor, type Color } from './formatColor';

import * as styles from './ColorTile.module.less';

const NUM_COLUMNS = 5;

interface ColorTileProps<T> {
  color: T;
  onClick: (color: T) => void;
  isSelected: boolean;
}

const flattenColor = (color: string): Color => color.split('_')[0] as Color;

export const ColorTile = <T extends Color>({
  color,
  onClick,
  isSelected,
}: ColorTileProps<T>) => {
  const onClickTooltipRef =
    useRef<(e: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void>();

  const onClickTile = useCallback(
    (e: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
      onClick(color);
      onClickTooltipRef.current?.(e);
    },
    [color, onClick],
  );

  const focusScope = useFocusScope();

  const onKeyDown = useCallback(
    (e: Parameters<typeof getKey>[0]) => {
      switch (getKey(e)) {
        case Key.Enter:
        case Key.LineFeed:
        case Key.Space:
          onClick(color);
          break;

        case Key.ArrowLeft:
          focusScope.focusPrev();
          break;
        case Key.ArrowRight:
          focusScope.focusNext();
          break;

        case Key.ArrowUp: {
          Array(NUM_COLUMNS)
            .fill(0)
            .forEach(() => focusScope.focusPrev());
          break;
        }
        case Key.ArrowDown: {
          Array(NUM_COLUMNS)
            .fill(0)
            .forEach(() => focusScope.focusNext());
          break;
        }

        default:
          return;
      }
    },
    [focusScope, onClick, color],
  );

  const formattedColor = formatColor(color);
  const colorBlindColor = flattenColor(color);

  return (
    <li
      className={cx(
        styles.tileContainer,
        isSelected && styles[`tileContainer--selected`],
      )}
      data-testid={getTestId<ColorPaletteTestIds>('tile-container')}
    >
      <Tooltip content={formattedColor} hideTooltipOnClick={true}>
        {({ onClick: onClickTooltip, ...tooltipProps }) => {
          onClickTooltipRef.current = onClickTooltip;
          return (
            <Button
              className={cx(
                styles.tile,
                styles[`${color}`],
                `color-blind-pattern-${colorBlindColor}`,
              )}
              onClick={onClickTile}
              onKeyDown={onKeyDown}
              aria-label={formattedColor}
              {...tooltipProps}
              data-testid={`${getTestId<ColorPaletteTestIds>(
                'color-tile',
              )}-${color}`}
              aria-checked={isSelected}
              role="radio"
            />
          );
        }}
      </Tooltip>
    </li>
  );
};
