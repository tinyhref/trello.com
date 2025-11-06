import type { FunctionComponent, PropsWithChildren, ReactNode } from 'react';
import { createContext, useContext, useLayoutEffect } from 'react';

import type { PopoverSize } from './Popover.types';

interface PopoverContextValue {
  /**
   * A function that sets the title for the Popover (rendered in PopoverHeader)
   */
  setScreenTitle: (screenTitle?: ReactNode) => void;
  /**
   * A function that sets the size of the Popover, changes the width of the
   * popover container
   */
  setScreenSize: (screenSize?: PopoverSize) => void;
  /**
   * A function that determines whether or not the Popover will have horizontal
   * padding (rendered within PopoverContent)
   */
  setScreenNoHorizontalPadding: (noHorizontalPadding?: boolean) => void;
  /**
   * Sets the prop for testing id (placed as the data attribute `data-testid`)
   * @internal for usage with smoketest suites
   */
  setScreenTestId: (testId?: string) => void;
  /**
   * A function that sets the noVerticalPadding of the Popover (rendered within PopoverContent)
   */
  setScreenNoVerticalPadding: (noVerticalPadding?: boolean) => void;
  /**
   * A function that sets hideHeader of the Popover
   */
  setHideHeader: (hideHeader?: boolean) => void;
  /**
   * A number representing the current screen that is rendered within the
   * Popover. This number will typically come from an enum-like object in order to
   * differentiate each screen as unique, such as:
   * ```
   * const Screen = {
   *  ScreenA: 0,
   *  ScreenB: 1,
   * } as const;
   * ```
   * @default 0
   */
  currentScreen?: number;
  /**
   * The first focusable element in the header
   */
  firstFocusableRef?: React.RefObject<HTMLButtonElement>;
  /**
   * Ref to the element that triggered the previous screen.
   * Allows us to return focus to the trigger element when the user
   * navigates back out of that screen.
   */
  prevScreenTrigger?: HTMLElement | React.RefObject<HTMLElement> | null;
}

interface PopoverScreenProps {
  /**
   * The value that will help keep track of the current index of the screen
   * we're showing in the Popover
   */
  id: number;
  /**
   * The content to display in the title container of the Popover
   * @default undefined
   */
  title?: ReactNode;
  /**
   * Determines the width of the Popover component. If none is provided, Popover
   * will fallback to `'medium'`
   * @default 'medium'
   */
  size?: PopoverSize;
  /**
   * Removes the default horizontal padding from the popover content.
   * This is useful when you want your content to extend all the way
   * to the edge of the popover.
   * @default false
   */
  noHorizontalPadding?: boolean;
  /**
   * Removes the default vertical padding from the popover content.
   * This is useful when you want your content to extend all the way
   * to the edge of the popover.
   * @default false
   */
  noVerticalPadding?: boolean;
  /**
   * Removes the header element from the popover component.
   * This is useful for when you want a title on an initial screen, but some sub-screens
   * are also styled to go all the way to the edges and implemet their own back and
   * close controls
   */
  hideHeader?: boolean;
  /**
   * A string that gets placed as a data attribute (data-testid) so that our
   * smoketest can properly target and test the component
   * @default undefined
   */
  testId?: string;
  /**
   * Optional ref to an input element that should receive focus
   * when this screen becomes active, taking priority over the first focusable element.
   *
   * IMPORTANT: For accessibility, only use this when the input is the first element
   * in the popover with no other content above it that would be skipped over.
   * If there's content above the input, focus should go to the first focusable element
   * instead to ensure proper reading order.
   * @default undefined
   */
  inputRef?: React.RefObject<HTMLElement>;
}

export const PopoverContext = createContext<PopoverContextValue>({
  setScreenTitle: () => {},
  setScreenSize: () => {},
  setScreenNoHorizontalPadding: () => {},
  setScreenNoVerticalPadding: () => {},
  setScreenTestId: () => {},
  setHideHeader: () => {},
  currentScreen: undefined,
  firstFocusableRef: undefined,
  prevScreenTrigger: undefined,
});

/**
 * A component that acts as a wrapper to manage multi-screen popovers. This
 * effectively determines which bit of content to show in the PopoverContent
 * area amongst the multiple screens that are available. Order is managed with
 * usePopover hook.
 */
export const PopoverScreen: FunctionComponent<
  PropsWithChildren<PopoverScreenProps>
> = ({
  id,
  children,
  title,
  size,
  noHorizontalPadding,
  noVerticalPadding,
  hideHeader,
  testId,
  inputRef,
}) => {
  const {
    currentScreen,
    setScreenTitle,
    setScreenSize,
    setScreenNoHorizontalPadding,
    setScreenNoVerticalPadding,
    setScreenTestId,
    setHideHeader,
    firstFocusableRef,
    prevScreenTrigger,
  } = useContext(PopoverContext);

  // Update the title of the Popover, based on the title prop of the selected
  // PopoverScreen
  useLayoutEffect(() => {
    if (currentScreen === id) {
      setScreenTitle(title);
    }
  }, [currentScreen, id, title, setScreenTitle]);

  // Update whether the header is shown, based on the hideHeader prop of the
  // selected PopoverScreen
  useLayoutEffect(() => {
    if (currentScreen === id) {
      if (hideHeader) {
        setHideHeader(true);
      } else {
        setHideHeader(false);
      }
    }
  }, [currentScreen, id, title, hideHeader, setHideHeader]);

  // Update the size of the Popover, based on the size prop of the selected
  // PopoverScreen
  useLayoutEffect(() => {
    if (currentScreen === id) {
      setScreenSize(size);
    }
  }, [currentScreen, id, size, setScreenSize]);

  // Update the noHorizontalPadding of the popover, based on the noHorizontalPadding prop of the selected
  // PopoverScreen
  useLayoutEffect(() => {
    if (currentScreen === id) {
      setScreenNoHorizontalPadding(noHorizontalPadding);
    }
  }, [currentScreen, id, noHorizontalPadding, setScreenNoHorizontalPadding]);

  // Update the noVerticalPadding of the popover, based on the noVerticalPadding prop of the selected
  // PopoverScreen
  useLayoutEffect(() => {
    if (currentScreen === id) {
      setScreenNoVerticalPadding(noVerticalPadding);
    }
  }, [currentScreen, id, noVerticalPadding, setScreenNoVerticalPadding]);

  // Update the test id of the popover, based on the testId prop of the selected PopoverScreen
  useLayoutEffect(() => {
    if (currentScreen === id) {
      setScreenTestId(testId);
    }
  }, [currentScreen, id, testId, setScreenTestId]);

  // Focus the header when screen changes
  useLayoutEffect(() => {
    if (currentScreen === id) {
      const timeoutId = setTimeout(() => {
        if (prevScreenTrigger) {
          if (
            typeof prevScreenTrigger === 'object' &&
            'current' in prevScreenTrigger &&
            prevScreenTrigger.current
          ) {
            prevScreenTrigger.current.focus();
          } else if (
            typeof prevScreenTrigger === 'object' &&
            prevScreenTrigger !== null &&
            'focus' in prevScreenTrigger
          ) {
            // It's a DOM element with focus method
            prevScreenTrigger.focus();
          }
          return;
        }

        // If inputRef is provided, should prioritize it over the first focusable element
        if (inputRef?.current) {
          inputRef.current.focus();
          return;
        }

        if (firstFocusableRef?.current) {
          firstFocusableRef.current.focus();
          return;
        }
      }, 0);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [currentScreen, id, firstFocusableRef, prevScreenTrigger, inputRef]);

  if (currentScreen !== id) {
    return null;
  }

  return <>{children}</>;
};
