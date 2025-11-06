import cx from 'classnames';
import type {
  FunctionComponent,
  KeyboardEvent,
  PropsWithChildren,
  SyntheticEvent,
} from 'react';
import { useCallback, useRef } from 'react';

import { mergeRefs } from '@trello/dom-hooks';
import { isSubmitEvent } from '@trello/keybindings';
import { Tooltip } from '@trello/nachos/tooltip';
import type { LabelsPopoverTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import type { CardLabelType } from './CardLabel.types';
import { flattenLabelColor } from './flattenLabelColor';
import { formatLabelTooltip } from './formatLabelTooltip';

import * as styles from './CardLabel.module.less';

export interface CardLabelProps {
  label: CardLabelType;
  className?: string;
  /**
   * If onClick is defined, the label is rendered as a <button> element.
   */
  onClick?: (e: SyntheticEvent) => void;
  /**
   * Optional override for onKeyDown event handler. By default, submit keypress
   * events trigger the associated onClick prop.
   */
  onKeyDown?: (e: KeyboardEvent<HTMLSpanElement>) => void;
  /**
   * Whether or not to enable hover states for the label output. Adding an
   * `onClick` handler will have the same output, but this is a fallback in case
   * hover colors are desired without any click interactions.
   * @default false
   */
  isHoverable?: boolean;
  /**
   * Whether or not the label should stretch to take up the whole width of its
   * parent container.
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Optional tabIndex prop. Set this to -1 to disable keyboard interaction.
   * @default 0
   */
  tabIndex?: number;
}

/**
 * Pass-through component that renders the old Label component by default,
 * and a redesign otherwise.
 */
export const CardLabel: FunctionComponent<
  PropsWithChildren<CardLabelProps>
> = ({
  label,
  children,
  className: propsClassName,
  isHoverable,
  fullWidth,
  tabIndex = 0,
  onClick,
  onKeyDown,
}) => {
  const ref = useRef<HTMLSpanElement | null>(null);

  const submitOnKeyDown = useCallback(
    (e: KeyboardEvent<HTMLSpanElement>) => {
      if (isSubmitEvent(e)) {
        onClick?.(e);
      }
    },
    [onClick],
  );

  const className = cx(
    styles.label,
    label.color ? styles[label.color] : styles.colorless,
    fullWidth && styles['label--fullwidth'],
    (onClick || isHoverable) && styles['label--hoverable'],
    label.color && `color-blind-pattern-${flattenLabelColor(label.color)}`,
    propsClassName,
  );
  const tooltip = formatLabelTooltip(label);

  return (
    <Tooltip content={tooltip} hideTooltipOnMouseDown={true}>
      {({ ref: tooltipRef, ...tooltipProps }) => {
        const mergedRefs = mergeRefs<HTMLSpanElement>(ref, tooltipRef);

        return (
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions
          <span
            {...tooltipProps}
            className={className}
            onClick={onClick}
            onKeyDown={onKeyDown || submitOnKeyDown}
            ref={mergedRefs}
            tabIndex={tabIndex}
            aria-label={tooltip}
            data-color={label.color}
            data-testid={getTestId<LabelsPopoverTestIds>('card-label')}
          >
            {label.name}
            {children}
          </span>
        );
      }}
    </Tooltip>
  );
};
