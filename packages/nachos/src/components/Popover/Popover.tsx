import cx from 'classnames';
import type {
  FunctionComponent,
  KeyboardEventHandler,
  PropsWithChildren,
  ReactNode,
  Ref,
} from 'react';
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import FocusLock, { useFocusScope } from 'react-focus-lock';
import { useIntl } from 'react-intl';

import Icon from '@atlaskit/icon';
import type { Modifier } from '@atlaskit/popper';
import { Popper } from '@atlaskit/popper';
import Portal from '@atlaskit/portal';
import { useFocusRing } from '@trello/a11y';
import { useCallbackRef } from '@trello/dom-hooks';
import { Key, Scope, useShortcut } from '@trello/keybindings';
import {
  ELEVATION_ATTR,
  useClickOutsideHandler,
  useCurrentElevation,
} from '@trello/layer-manager';
import { POPOVER_BOUNDARY_ELEMENT_ID } from '@trello/nachos/popover-boundary';
import {
  ComponentAppearanceStatic,
  GLOBAL_NAMESPACE_PREFIX,
  ComponentSizeL as LARGE,
  ComponentSizeM as MEDIUM,
  PopoverClassnameBackButton,
  PopoverClassnameBase,
  PopoverClassnameCloseButton,
  PopoverClassnameContent,
  PopoverClassnameHeader,
  PopoverClassnameIconButton,
  PopoverClassnameTitle,
  PopoverContentDefaultPadding,
  PopoverLargeWidth,
  PopoverMediumWidth,
  PopoverPopperDefaultPaddingUnit,
  PopoverPortalDefaultZIndex,
  PopoverSmallWidth,
  PopoverXlargeWidth,
  ComponentSizeS as SMALL,
  ComponentSizeXl as XLARGE,
} from '@trello/nachos/tokens';
import { useLocation } from '@trello/router';

import type {
  HideReasonType,
  PopoverPlacementType,
  PopoverProps,
  PopoverSize,
} from './Popover.types';
import { HideReason, PopoverPlacement } from './Popover.types';
import { PopoverContext } from './PopoverScreen';

import * as styles from './Popover.module.less';

let schedulePopperUpdate: (() => void) | undefined;

export const PopoverClasses = {
  POPOVER: `${GLOBAL_NAMESPACE_PREFIX}${PopoverClassnameBase}`,
  HEADER: `${GLOBAL_NAMESPACE_PREFIX}${PopoverClassnameBase}__${PopoverClassnameHeader}`,
  TITLE: `${GLOBAL_NAMESPACE_PREFIX}${PopoverClassnameBase}__${PopoverClassnameTitle}`,
  ICON_BUTTON: `${GLOBAL_NAMESPACE_PREFIX}${PopoverClassnameBase}__${PopoverClassnameIconButton}`,
  CLOSE_BUTTON: `${GLOBAL_NAMESPACE_PREFIX}${PopoverClassnameBase}__${PopoverClassnameCloseButton}`,
  BACK_BUTTON: `${GLOBAL_NAMESPACE_PREFIX}${PopoverClassnameBase}__${PopoverClassnameBackButton}`,
  CONTENT: `${GLOBAL_NAMESPACE_PREFIX}${PopoverClassnameBase}__${PopoverClassnameContent}`,
  STATIC: `${GLOBAL_NAMESPACE_PREFIX}${PopoverClassnameBase}--${ComponentAppearanceStatic}`,
};

const popoverSizeValues = {
  [SMALL]: PopoverSmallWidth,
  [MEDIUM]: PopoverMediumWidth,
  [LARGE]: PopoverLargeWidth,
  [XLARGE]: PopoverXlargeWidth,
};

interface PopoverHeaderProps {
  /**
   * React node(s) to render inside the Popover header
   */
  children: ReactNode;
  /**
   * Determines whether or not the Popover should render a "Back" button. This
   * back button allows navigation between PopoverScreens (multi-screen
   * popovers)
   * @default false
   */
  hasBackButton?: boolean;
  /**
   * Set to true to enable styling to accommodate multiline titles
   * @default undefined
   */
  UNSAFE_multilineTitle?: boolean;
  /**
   * A callback function that fires when the "back" button in the Popover is
   * clicked
   * @type { function }
   * @default undefined
   */
  onBack?: () => void;
  /**
   * A callback function that fires when the Popover's state is changed from
   * visible to not visible
   */
  onHide: (reason: HideReasonType) => void;
  /*
   * ID of the element that labels the popover header
   * @default undefined
   */
  id?: string;
  /**
   * Ref to the first focusable element in the header
   */
  firstFocusableRef?: React.RefObject<HTMLButtonElement>;
  /**
   * Ref to the element that triggered the previous screen.
   * Allows us to return focus to the trigger element when the user
   * navigates back out of that screen.
   */
  prevScreenTrigger?: HTMLElement | React.RefObject<HTMLElement> | null;
}
interface PopoverContentProps {
  /**
   * React node(s) to render inside the Popover content area (below the header,
   * where the Popover Screens are shown)
   */
  children: ReactNode;
  /**
   * A number (measured in pixels) to limit the max height of the
   * content of the Popover.
   * This number is dynamically calculated in useResizeHandler
   * and depends on the header height (trello only), viewport height, and some
   * spacing values (e.g. padding)
   * @default 0
   */
  maxHeight?: number;
  /**
   * Removes the default horizontal padding from the popover content.
   * This is useful when you want your content to extend all the way
   * to the edge of the popover.
   * @default false
   */
  noHorizontalPadding?: boolean;
  /**
   * Removes the default top padding from the popover content. This is
   * automatically placed when there is a title in the Popover Header.
   * @default false
   */
  noTopPadding?: boolean;
  /**
   * Removes the default bottom padding from the popover content.
   * @default false
   */
  noBottomPadding?: boolean;
}

interface PopoverWrapperProps {
  /**
   * React node(s) to render inside the Popover wrapper
   */
  children: ReactNode;
  /**
   * Indicates whether to use FocusScope to trap focus within the popover while
   * it's open.
   * @default undefined
   */
  trapFocus?: boolean;
  /**
   * Indicates whether to enable up/down arrow key navigation within the popover.
   *
   * @default undefined
   */
  enableArrowKeyNavigation?: boolean;
}

/**
 * Attach a window click handler to close the Popover whenever you click outside
 * of its boundaries
 */
const useOutsideClickHandler = ({
  containerElement,
  triggerElement,
  onHide,
  isVisible,
}: {
  containerElement: HTMLElement | null;
  triggerElement: HTMLElement | null;
  onHide: (reason: HideReasonType) => void;
  isVisible: boolean;
}) => {
  const clickHandler = useCallback(
    (event: MouseEvent) => {
      if (event.defaultPrevented) {
        return;
      }

      // Exit if we're clicking on the trigger, letting it handle toggling
      // the open state
      if (triggerElement?.contains(event.target as Node)) {
        return;
      }

      // Finally, if our popover is visible, call our onHide callback
      if (isVisible) {
        onHide(HideReason.CLICK_OUTSIDE);
      }
    },
    [isVisible, onHide, triggerElement],
  );

  useClickOutsideHandler({
    element: containerElement,
    handleClickOutside: clickHandler,
    skip: !isVisible,
  });
};

/**
 * Attach window resize listener to update the max height of the Popover
 * content, ensuring that the height of the Popover is never greater than the
 * height of the viewport
 */
const useResizeHandler = ({
  isVisible,
  containerElement,
  contentElement,
  headerElement,
  anchorElement,
  dontOverlapAnchorElement,
}: {
  isVisible: boolean;
  containerElement: HTMLElement | null;
  contentElement: HTMLElement | null;
  headerElement: HTMLElement | null;
  anchorElement: HTMLElement | null;
  dontOverlapAnchorElement?: boolean;
}) => {
  const [contentMaxHeight, setContentMaxHeight] = useState<number>();
  const [forcedPlacement, setForcedPlacement] = useState<
    PopoverPlacementType | undefined
  >(dontOverlapAnchorElement ? PopoverPlacement.BOTTOM_START : undefined);

  const resizeHandler = useCallback(() => {
    if (!containerElement || !contentElement) {
      return;
    }

    // Use the #content div as our viewport if it exists, otherwise default
    // to the whole document
    const viewportElement =
      document.getElementById(POPOVER_BOUNDARY_ELEMENT_ID) ||
      document.documentElement;
    const viewportHeight = viewportElement.clientHeight;

    const containerHeight = containerElement.getBoundingClientRect().height;
    const contentHeight = contentElement.getBoundingClientRect().height;
    const internalPadding = headerElement
      ? parseInt(PopoverContentDefaultPadding, 10)
      : parseInt(PopoverContentDefaultPadding, 10) * 2;

    let availableHeight =
      viewportHeight - // Without dontOverlapAnchorElement, the popover may take up full viewport.
      PopoverPopperDefaultPaddingUnit * 2; // This is the padding _external_ to popper, 1 for each edge of viewport

    if (dontOverlapAnchorElement && anchorElement) {
      const availableHeightAboveAnchor =
        anchorElement.getBoundingClientRect().top -
        viewportElement.getBoundingClientRect().top - // anchorElement's `bottom` includes the height of the Trello header, but viewportElement starts beneath the header
        PopoverPopperDefaultPaddingUnit * 3; // 2 units between anchorElement and popover, 1 unit for one edge of viewport

      const availableHeightBelowAnchor =
        viewportHeight -
        (anchorElement.getBoundingClientRect().bottom -
          viewportElement.getBoundingClientRect().top) - // anchorElement's `top` includes the height of the Trello header, but viewportElement starts beneath the header
        PopoverPopperDefaultPaddingUnit * 3; // 2 units between anchorElement and popover, 1 unit for one edge of viewport

      if (
        containerHeight <= availableHeightBelowAnchor ||
        availableHeightBelowAnchor >= availableHeightAboveAnchor
      ) {
        availableHeight = Math.min(availableHeight, availableHeightBelowAnchor);
        setForcedPlacement(PopoverPlacement.BOTTOM_START);
      } else {
        availableHeight = Math.min(availableHeight, availableHeightAboveAnchor);
        setForcedPlacement(PopoverPlacement.TOP_START);
      }
    }

    // Calculate space taken up by the popover header and padding, that will not be included in the content maxHeight
    const extraPixels = containerHeight - contentHeight + internalPadding; // This is the padding _internal_ to the popover's content

    const newContentMaxHeight = availableHeight - extraPixels;

    // Paranoid check for a negative max height. This would only occur if the
    // header alone was somehow bigger than the entire viewport
    if (newContentMaxHeight > 0) {
      // Ensure that the new maxHeight value changed by at least 1.0px before
      // setting it. Setting the maxHeight state will cause a re-render which
      // will cause the MutationObserver to run this function again. In some
      // rare cases, users were experiencing an infinite loop here due to the
      // maxHeight changing by a small amount with each subsequent calculation.
      // https://trello.atlassian.net/browse/TRELP-5024
      // eslint-disable-next-line @typescript-eslint/no-shadow
      setContentMaxHeight((contentMaxHeight) =>
        contentMaxHeight &&
        Math.abs(newContentMaxHeight - contentMaxHeight) < 1.0
          ? contentMaxHeight
          : newContentMaxHeight,
      );
    } else {
      setContentMaxHeight(0);
    }
  }, [
    containerElement,
    contentElement,
    headerElement,
    dontOverlapAnchorElement,
    anchorElement,
  ]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      resizeHandler();
      schedulePopperUpdate?.();
    });

    if (isVisible) {
      resizeHandler();

      window.addEventListener('resize', resizeHandler);

      if (contentElement) {
        observer.observe(contentElement, {
          childList: true,
          subtree: true,
          attributes: true,
        });
      }
    }

    return () => {
      window.removeEventListener('resize', resizeHandler);
      observer.disconnect();
    };
  }, [isVisible, contentElement, resizeHandler]);

  return { contentMaxHeight, forcedPlacement };
};

const useEscapeHandler = ({
  isVisible,
  hasBackButton,
  onBack,
  onHide,
}: {
  isVisible: boolean;
  hasBackButton?: boolean;
  onBack?: () => void;
  onHide: (reason: HideReasonType) => void;
}) => {
  // Handle escape keypress to either pop or hide
  const escapeHandler = useCallback(() => {
    if (hasBackButton && onBack) {
      onBack();
    } else {
      onHide(HideReason.ESCAPE_HANDLER);
    }
  }, [hasBackButton, onBack, onHide]);

  useShortcut(escapeHandler, {
    scope: Scope.Popover,
    key: Key.Escape,
    enabled: isVisible,
  });
};

const useSwitchFocusOnUpDown = () => {
  const focusScope = useFocusScope();

  const onKeyDown: KeyboardEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      // Check if the focused element is a select component
      const activeElement = document.activeElement;
      const isSelectFocused = activeElement?.closest('[role="combobox"]');

      if (isSelectFocused) {
        return;
      }

      switch (e.key) {
        case Key.ArrowDown:
          e.preventDefault();
          focusScope.focusNext({ onlyTabbable: true, cycle: true });
          break;

        case Key.ArrowUp:
          e.preventDefault();
          focusScope.focusPrev({ onlyTabbable: true, cycle: true });
          break;
        default:
          break;
      }
    },
    [focusScope],
  );

  return onKeyDown;
};

/**
 * Poll the current url to detect navigation if the popover is currently visible,
 * and hide the popover if it occurs. This _could_ be replaced with a mechanism
 * that 'hijacks' history.pushState and history.replaceState if we wanted to make
 * this generic, or we expected _many_ popovers to somehow be visible at the same
 * time.
 */
const useNavigationHandler = ({
  isVisible,
  onHide,
}: {
  isVisible: boolean;
  onHide: (reason: HideReasonType) => void;
}) => {
  const prevUrlRef = useRef<{
    origin: string;
    pathname: string;
  }>();

  const stillVisibleRef = useRef(false);

  const { origin, pathname } = useLocation();

  useEffect(() => {
    const prevUrl = prevUrlRef.current;
    const url = {
      origin,
      pathname,
    };

    prevUrlRef.current = url;
    const urlChanged =
      prevUrl !== undefined &&
      `${prevUrl.origin}${prevUrl.pathname}` !== `${url.origin}${url.pathname}`;

    // We should close the popover if it is still visible and the URL changes (excluding any query parameters)
    if (stillVisibleRef.current === true && urlChanged) {
      onHide(HideReason.NAVIGATION);
    }

    stillVisibleRef.current = isVisible;
  }, [origin, pathname, isVisible, onHide]);
};

/**
 * SVG glyph for usage with "Back" icon in Popover Header
 */
const backGlyph = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.29289 11.2929L14.364 4.22185C14.7545 3.83132 15.3876 3.83132 15.7782 4.22185C16.1687 4.61237 16.1687 5.24554 15.7782 5.63606L9.41421 12L15.7782 18.364C16.1687 18.7545 16.1687 19.3877 15.7782 19.7782C15.3877 20.1687 14.7545 20.1687 14.364 19.7782L7.29289 12.7071C6.90237 12.3166 6.90237 11.6834 7.29289 11.2929Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * SVG glyph for usage with "Close" icon in Popover Header
 */
const closeGlyph = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12Z"
      fill="currentColor"
    />
  </svg>
);

const PreviousScreenButton = forwardRef<
  HTMLButtonElement,
  { onBack?: () => void }
>(({ onBack }, ref) => {
  const [hasFocusRing, mouseEvents] = useFocusRing();
  const intl = useIntl();

  return (
    <button
      {...mouseEvents}
      ref={ref}
      aria-label={intl.formatMessage({
        id: 'templates.nachos_popover.return-to-previous-screen',
        defaultMessage: 'Return to previous screen',
        description: 'Return to previous screen icon label',
      })}
      className={cx(
        styles[PopoverClasses.ICON_BUTTON],
        styles[PopoverClasses.BACK_BUTTON],
        hasFocusRing && styles.hasFocusRing,
      )}
      onClick={onBack}
    >
      <Icon glyph={backGlyph} label="" size="small" />
    </button>
  );
});

const CloseButton = forwardRef<
  HTMLButtonElement,
  { onClose?: () => void; UNSAFE_multilineTitle?: boolean }
>(({ onClose, UNSAFE_multilineTitle }, ref) => {
  const [hasFocusRing, mouseEvents] = useFocusRing();
  const intl = useIntl();

  return (
    <button
      {...mouseEvents}
      ref={ref}
      aria-label={intl.formatMessage({
        id: 'templates.nachos_popover.close-popover',
        defaultMessage: 'Close popover',
        description: 'Close popover icon label',
      })}
      className={cx(
        styles[PopoverClasses.ICON_BUTTON],
        styles[PopoverClasses.CLOSE_BUTTON],
        hasFocusRing && styles.hasFocusRing,
        UNSAFE_multilineTitle && styles.UNSAFE_multilineTitle,
      )}
      onClick={onClose}
    >
      <Icon glyph={closeGlyph} label="" size="small" />
    </button>
  );
});

/**
 * A component that appears at the top of a rendered Popover. It includes the
 * title, close button, and back button (if there are multiple screens)
 */
export const PopoverHeader = forwardRef<HTMLElement, PopoverHeaderProps>(
  (
    {
      children,
      hasBackButton,
      onBack,
      onHide,
      UNSAFE_multilineTitle,
      id,
      firstFocusableRef,
      prevScreenTrigger,
    },
    ref,
  ) => {
    const onClose = useCallback(() => {
      onHide(HideReason.CLICK_CLOSE_BUTTON);
    }, [onHide]);

    return (
      <header
        className={cx(
          styles[PopoverClasses.HEADER],
          UNSAFE_multilineTitle && styles.UNSAFE_multilineTitle,
        )}
        ref={ref}
      >
        <h2
          className={cx(
            styles[PopoverClasses.TITLE],
            UNSAFE_multilineTitle && styles.UNSAFE_multilineTitle,
          )}
          title={typeof children === 'string' ? children : undefined}
          id={id}
        >
          {children}
        </h2>
        {hasBackButton ? (
          <PreviousScreenButton onBack={onBack} ref={firstFocusableRef} />
        ) : null}
        <CloseButton
          onClose={onClose}
          UNSAFE_multilineTitle={UNSAFE_multilineTitle}
          ref={hasBackButton ? undefined : firstFocusableRef}
        />
      </header>
    );
  },
);

export const PopoverWrapper = forwardRef<HTMLDivElement, PopoverWrapperProps>(
  ({ children, trapFocus, enableArrowKeyNavigation }, ref) => {
    const onKeyDown = useSwitchFocusOnUpDown();

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        ref={ref}
        onKeyDown={
          trapFocus && enableArrowKeyNavigation ? onKeyDown : undefined
        }
      >
        {children}
      </div>
    );
  },
);

export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  (
    { children, maxHeight, noHorizontalPadding, noTopPadding, noBottomPadding },
    ref,
  ) => {
    return (
      // This isn't ideal but is temporary.  Needed so that once you arrow from
      // the trigger element (button) & the focus is sent here as part of
      // the current custom focus management solution in Nachos Popover,
      // that you can continue to arrow down to the next interactive element.
      // We should eventually remove the custom focus management & replace
      // completely with react-aria focus management.
      <div
        tabIndex={-1}
        className={cx(styles[PopoverClasses.CONTENT], {
          [styles.noHorizontalPadding]: noHorizontalPadding,
          [styles.noTopPadding]: noTopPadding,
          [styles.noBottomPadding]: noBottomPadding,
        })}
        ref={ref}
        style={{ maxHeight }}
      >
        {children}
      </div>
    );
  },
);

/**
 * A component that renders some content in a floating container within a
 * React Portal, typically triggered by a different element.
 * It has the ability to account for multiple screens of
 * content using hooks and context.
 * @see PopoverScreen
 * @see usePopover
 *
 * The visual state of the Popover (including it's visibility and screen
 * management) is handled via the `usePopover` hook, which should be used
 * in conjunction with the Popover component.
 * @example
 * const { triggerRef, toggle, hide, popoverProps } = usePopover();
 *
 * return (
 *  <>
 *    <button ref={triggerRef} onClick={toggle}>
 *      Toggle popover
 *    </button>
 *    <Popover {...popoverProps}>
 *      <button onClick={hide}>Hide popover</button>
 *    </Popover>
 *  </>
 * );
 */
export const Popover: FunctionComponent<PropsWithChildren<PopoverProps>> = ({
  placement,
  size,
  title,
  UNSAFE_multilineTitle,
  noHorizontalPadding,
  noVerticalPadding,
  dontOverlapAnchorElement,
  testId,
  id,
  enableArrowKeyNavigation,
  labelledBy,
  role = 'dialog',
  isVisible,
  isModal = false,
  triggerElement,
  targetElement,
  onHide,
  hasBackButton,
  onBack,
  currentScreen,
  prevScreenTrigger,

  children,
  dangerous_elevation,
  dangerous_className,
  dangerous_width,
  dangerous_disableAutoFocus,
  dangerous_disableFocusTrapping,
  dangerous_offset,
}) => {
  const [screenTitle, setScreenTitle] = useState<ReactNode | undefined>(
    undefined,
  );
  const [screenSize, setScreenSize] = useState<PopoverSize | undefined>(
    undefined,
  );
  const [hideHeader, setHideHeader] = useState<boolean | undefined>(false);

  const [screenNoHorizontalPadding, setScreenNoHorizontalPadding] = useState<
    boolean | undefined
  >(undefined);
  const [screenNoVerticalPadding, setScreenNoVerticalPadding] = useState<
    boolean | undefined
  >(undefined);
  const [screenTestId, setScreenTestId] = useState<string | undefined>(
    undefined,
  );

  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const [headerElement, headerRef] = useCallbackRef<HTMLElement>();
  const [contentElement, contentRef] = useCallbackRef<HTMLDivElement>();
  const [containerElement, containerRef] = useCallbackRef<HTMLElement>();

  // We have to use a callback wrapper to wire up the containerRef _and_ to
  // let popper know about it with it's 'ref' render prop
  const containerRefCallback = useCallback(
    <T extends HTMLElement>(node: T | null, popperRefCallback: Ref<T>) => {
      containerRef(node);
      if (typeof popperRefCallback === 'function') {
        popperRefCallback(node);
      }
    },
    [containerRef],
  );

  // Determine whether to anchor the Popover to the trigger or the target.
  // If no target ref was provided, we assume the trigger is the anchor
  const anchorElement = targetElement ? targetElement : triggerElement;

  // Defensively ensure that if the state is saying we are visible, but we have no
  // anchor, call our onHide callback (we won't be able to mount anywhere so we
  // should let our parent know we were hidden to keep their state in sync)
  // This situation only arises when a consumer is managing multiple nested popovers
  // from within the same component (i.e they are invoking the usePopover hook multiple
  // times for nested popovers). In the following scenario:
  // 1. User opens root popover
  // 2. User opens nested popover
  // 3. User clicks outside the root popover
  // 4. Nested popover is _unmounted_ (not hidden)
  // 5. User opens the root popover again
  // 6. The nested popover still has isVisible as true, but no target element to be mounted on
  useEffect(() => {
    if (!anchorElement && isVisible) {
      onHide(HideReason.NO_ANCHOR_ELEMENT);
    }
  }, [anchorElement, isVisible, onHide]);

  let currentElevation = useCurrentElevation(anchorElement, {
    skip: dangerous_elevation !== undefined,
  });

  if (dangerous_elevation !== undefined) {
    currentElevation = dangerous_elevation;
  }

  const nextElevation = currentElevation + 1;

  useOutsideClickHandler({
    containerElement,
    triggerElement,
    onHide,
    isVisible,
  });
  const { contentMaxHeight, forcedPlacement } = useResizeHandler({
    isVisible,
    containerElement,
    contentElement,
    headerElement,
    anchorElement,
    dontOverlapAnchorElement,
  });
  useEscapeHandler({ isVisible, hasBackButton, onBack, onHide });
  useNavigationHandler({
    isVisible,
    onHide,
  });

  if (!isVisible || !anchorElement) {
    return null;
  }

  // Fall-back to the 'title' and 'size' props for the Popover if none were
  // provided to the PopoverScreen
  const actualTitle = screenTitle ?? title;
  const actualSize =
    dangerous_width ?? popoverSizeValues[screenSize ?? size ?? MEDIUM];
  const actualNoHorizontalPadding =
    screenNoHorizontalPadding ?? noHorizontalPadding;
  const actualNoVerticalPadding = screenNoVerticalPadding ?? noVerticalPadding;
  const actualTestId = screenTestId ?? testId;
  const nestedContext = {
    currentScreen,
    setScreenTitle,
    setScreenSize,
    setScreenTestId,
    setScreenNoHorizontalPadding,
    setScreenNoVerticalPadding,
    setHideHeader,
    firstFocusableRef,
    prevScreenTrigger,
  };

  const boundary =
    document.getElementById(POPOVER_BOUNDARY_ELEMENT_ID) || undefined;

  // For arrow key navigation to work there must be a `FocusScope`
  // so set `dangerous_disableFocusTrapping` to false if it has been set to true
  if (enableArrowKeyNavigation && dangerous_disableFocusTrapping) {
    dangerous_disableFocusTrapping = false;
  }

  const POPPER_MODIFIERS: Array<
    Modifier<'computeStyles' | 'flip' | 'preventOverflow'>
  > = [
    {
      name: 'computeStyles',
      options: {
        // Uncommenting the line below will disable gpuAcceleration which
        // fixes the 'blurriness' of popover content on different zoom levels
        // in chrome
        gpuAcceleration: false,
      },
    },
    {
      name: 'flip',
      // Don't auto-flip the popover if dontOverlapAnchorElement is manually
      // picking the placement.
      enabled: !forcedPlacement,
    },
    {
      name: 'preventOverflow',
      options: {
        boundary,
        altAxis: true,
        padding: PopoverPopperDefaultPaddingUnit,
      },
    },
  ];

  return (
    <Popper
      referenceElement={anchorElement}
      placement={forcedPlacement || placement || PopoverPlacement.BOTTOM_START}
      modifiers={POPPER_MODIFIERS}
      offset={dangerous_offset}
    >
      {({ ref, style, update }) => {
        schedulePopperUpdate = update;

        const popoverContent = (
          <section
            className={cx(
              styles[PopoverClasses.POPOVER],
              dangerous_className,
              // This is silly, but we want to 'opt out' of the global click handler
              // logic. Specifically for trying to handle SPA transitions on raw <a>
              // tags. Any 'new' links should be using RouterLink.
              'js-react-root',
            )}
            ref={(node) => containerRefCallback(node, ref)}
            data-testid={actualTestId}
            style={{
              ...style,
              width: actualSize,
            }}
            id={id}
            {...{ [ELEVATION_ATTR]: nextElevation }}
            role={role}
            aria-modal={isModal ? 'true' : undefined}
            aria-labelledby={labelledBy}
          >
            <PopoverContext.Provider value={nestedContext}>
              <FocusLock
                returnFocus={true}
                disabled={dangerous_disableFocusTrapping}
              >
                <PopoverWrapper
                  trapFocus={!dangerous_disableFocusTrapping}
                  enableArrowKeyNavigation={enableArrowKeyNavigation}
                >
                  {actualTitle && !hideHeader ? (
                    <PopoverHeader
                      hasBackButton={hasBackButton}
                      onBack={onBack}
                      onHide={onHide}
                      ref={headerRef}
                      firstFocusableRef={firstFocusableRef}
                      UNSAFE_multilineTitle={UNSAFE_multilineTitle}
                      id={labelledBy}
                    >
                      {actualTitle}
                    </PopoverHeader>
                  ) : null}
                  <PopoverContent
                    noHorizontalPadding={actualNoHorizontalPadding}
                    noTopPadding={actualNoVerticalPadding || !!actualTitle}
                    noBottomPadding={actualNoVerticalPadding}
                    ref={contentRef}
                    maxHeight={contentMaxHeight}
                  >
                    {children}
                  </PopoverContent>
                </PopoverWrapper>
              </FocusLock>
            </PopoverContext.Provider>
          </section>
        );

        return (
          <Portal zIndex={PopoverPortalDefaultZIndex}>{popoverContent}</Portal>
        );
      }}
    </Popper>
  );
};
