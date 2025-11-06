import cx from 'classnames';
import type {
  ComponentProps,
  FunctionComponent,
  MouseEvent,
  PropsWithChildren,
} from 'react';
import { useEffect, useRef } from 'react';

import { mergeRefs } from '@trello/dom-hooks';
import { Tooltip } from '@trello/nachos/tooltip';
import { useSharedState } from '@trello/shared-state';
import type { LabelsPopoverTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import type { CardLabelType } from './CardLabel.types';
import { flattenLabelColor } from './flattenLabelColor';
import { formatLabelTooltip } from './formatLabelTooltip';
import { showLabelsState } from './showLabelsState';

import * as styles from './CompactCardLabel.module.less';

export interface CompactCardLabelProps {
  label: CardLabelType;
  className?: string;
  dataTestClass?: string;
  /**
   * Whether or not the label can be collapsed. In collapsed mode, the label
   * name is hidden. This is controlled by `showLabelsState`, which listens to
   * a localStorage entry called `labelState`, and also has a :global CSS class
   * parallel in `.body-card-label-text-on` and `-off `. Set this to `false` to
   * opt out of the global behavior and force the label's text to always show.
   * @default true
   */
  isCollapsible?: boolean;
  /**
   * Whether or not to enable hover states for the label output. Adding an
   * `onClick` handler will have the same output, but this is a fallback in case
   * hover colors are desired without any click interactions.
   * @default false
   */
  isHoverable?: boolean;
  /**
   * If onClick is defined, the label is rendered as a <button> element.
   */
  onClick?: (e: MouseEvent) => void;
  /**
   * Optional tabIndex prop. Set this to -1 to disable keyboard interaction.
   * @default 0
   */
  tabIndex?: HTMLSpanElement['tabIndex'];
  /**
   * Overrides the tooltip content.
   */
  tooltipContent?: ComponentProps<typeof Tooltip>['content'];
}

export const CompactCardLabel: FunctionComponent<
  PropsWithChildren<CompactCardLabelProps>
> = ({
  label,
  className: propsClassName,
  dataTestClass,
  isCollapsible = true,
  isHoverable,
  tabIndex = 0,
  tooltipContent,
  onClick,
}) => {
  const [{ showText }] = useSharedState(showLabelsState);
  const isCollapsed = isCollapsible && !showText;

  const ref = useRef<HTMLSpanElement | null>(null);

  /**
   * Label width is determined by content size, so we set max- and min-width.
   * However, animations are stilted if a max-width is not explicitly set,
   * which causes jumpiness when collapsing. This effect runs on expanded labels
   * to tell the CSS animation what the computed maximum width of the label is.
   */
  useEffect(() => {
    if (!ref.current || isCollapsed) {
      return;
    }
    const offsetWidth = ref.current.offsetWidth;
    const expandedMaxWidth = offsetWidth ? `${offsetWidth}px` : 'auto';
    requestAnimationFrame(() => {
      ref.current?.style.setProperty('--expanded-max-width', expandedMaxWidth);
    });
  }, [isCollapsed, label.name]);

  const className = cx(
    styles.compactLabel,
    label.color ? styles[label.color] : styles.colorless,
    isCollapsed && styles['compactLabel--collapsed'],
    (onClick || isHoverable) && styles['compactLabel--hoverable'],
    label.color && `color-blind-pattern-${flattenLabelColor(label.color)}`,
    propsClassName,
  );
  const formattedTooltip = formatLabelTooltip(label);

  return (
    <Tooltip
      content={tooltipContent ?? formattedTooltip}
      hideTooltipOnMouseDown={true}
    >
      {({ ref: tooltipRef, ...tooltipProps }) => {
        const mergedRefs = mergeRefs<HTMLSpanElement>(ref, tooltipRef);
        return (
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions
          <span
            {...tooltipProps}
            className={className}
            onClick={onClick}
            ref={mergedRefs}
            tabIndex={tabIndex}
            aria-label={
              typeof tooltipContent === 'string'
                ? tooltipContent
                : formattedTooltip
            }
            data-color={label.color}
            data-expanded={!isCollapsed}
            data-test-class={dataTestClass}
            data-testid={getTestId<LabelsPopoverTestIds>('compact-card-label')}
          >
            {label.name}
          </span>
        );
      }}
    </Tooltip>
  );
};
