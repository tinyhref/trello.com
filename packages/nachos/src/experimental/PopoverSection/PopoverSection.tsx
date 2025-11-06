import cx from 'classnames';
import type { FunctionComponent, PropsWithChildren, ReactNode } from 'react';
import { useEffect, useRef } from 'react';

import { Button } from '@trello/nachos/button';
import { UpIcon } from '@trello/nachos/icons/up';
import { PopoverSectionClassnameAnimating } from '@trello/nachos/tokens';
import type { TestId } from '@trello/test-ids';

import * as styles from './PopoverSection.module.less';

export interface PopoverSectionProps {
  title: ReactNode;
  /**
   * Whether the section can be collapsed. If this is true, a collapse chevron
   * is rendered to the side of the header.
   *
   * For convenience, see {@link usePersistentCollapsiblePopoverSection}.
   * @default false
   */
  isCollapsible?: boolean;
  /**
   * Whether the section is collapsed.
   * @default false
   */
  isCollapsed?: boolean;
  onToggleCollapsed?: () => void;
  testId?: TestId;
  iconBefore?: JSX.Element;
}

/**
 * EXPERIMENTAL: Our popovers often have a specific style of headers, but we
 * haven't codified this style in a reusable way. This component implements
 * a section of a popover with a header and content.
 *
 * Because Popover and PopoverMenu have conflicting opinions regarding padding,
 * and because PopoverMenu is an unordered list element (meaning it only wants
 * list items as direct descendants), this should be rendered _between_ the two:
 *
 * @example
 * <Popover>
 *   <PopoverSection title="My section">
 *     <PopoverMenu>
 *       <PopoverMenuButton>Click me</PopoverMenuButton>
 *     </PopoverMenu>
 *   </PopoverSection>
 * </Popover>
 */
export const PopoverSection: FunctionComponent<
  PropsWithChildren<PopoverSectionProps>
> = ({
  children,
  title,
  isCollapsible,
  isCollapsed,
  onToggleCollapsed,
  testId,
  iconBefore,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const previousHeight = useRef<number | null>(null);
  const isInitialLoad = useRef(true);

  // Store the previous height of the content so we can animate it
  if (contentRef.current) {
    previousHeight.current = contentRef.current.clientHeight;
  }

  // In order to animate the height collapse / expand, we need to temporarily
  // set a fixed height on the content element. This effect will run whenever
  // the `isCollapsed` prop changes, and will animate the height change.
  // After the transition, we remove the added styles.
  // We're also adding an `animating` class temporarily so that parent
  // components can adjust styling while the animation is in progress.
  useEffect(() => {
    const element = contentRef.current;

    // Skip the animation if the section is not collapsible, if the element
    // hasn't been attached to the ref yet, or if it's the initial load.
    if (!isCollapsible || !element) {
      return;
    } else if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    const duration = 200;
    const height = element.clientHeight;
    element.style.height = `${previousHeight.current}px`;
    element.classList.add(PopoverSectionClassnameAnimating);

    let timeoutId: ReturnType<typeof setTimeout>;
    const frameId = requestAnimationFrame(() => {
      element.style.height = `${height}px`;
      element.style.overflow = 'hidden';
      element.style.transition = `height ${duration}ms ease-out`;
      element.style.visibility = 'visible';
      timeoutId = setTimeout(() => {
        element.style.removeProperty('height');
        element.style.removeProperty('overflow');
        element.style.removeProperty('transition');
        element.style.removeProperty('visibility');
        element.classList.remove(PopoverSectionClassnameAnimating);
      }, duration);
    });

    return () => {
      cancelAnimationFrame(frameId);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isCollapsed, isCollapsible]);

  return (
    <section>
      {isCollapsible ? (
        <h3 className={styles.buttonContainer}>
          <Button
            appearance="subtle"
            className={styles.button}
            size="fullwidth"
            iconBefore={iconBefore}
            iconAfter={
              <UpIcon
                label=""
                size="small"
                dangerous_className={cx(styles.icon, {
                  [styles.collapsed]: isCollapsed,
                })}
              />
            }
            onClick={onToggleCollapsed}
            aria-expanded={!isCollapsed}
          >
            {title}
          </Button>
        </h3>
      ) : (
        <h3 className={styles.title}>{title}</h3>
      )}

      <div
        className={cx(styles.content, {
          [styles.collapsed]: isCollapsible && isCollapsed,
        })}
        ref={contentRef}
        data-testid={testId}
      >
        {children}
      </div>
    </section>
  );
};
