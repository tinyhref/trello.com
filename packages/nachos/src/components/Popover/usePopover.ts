import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from 'react';

import { scrollIntoViewIfNeeded } from '@trello/dom';
import { useCallbackRef } from '@trello/dom-hooks';

import type {
  HideReasonType,
  PopoverPlacementType,
  PopoverProps,
  PopoverSize,
} from './Popover.types';

interface UsePopoverArgs {
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
  initialScreen?: number;
  /**
   * The size of the Popover. Defaults to 'medium'.
   */
  size?: PopoverSize;
  /**
   * The placement of the Popover relative to its trigger or target ref.
   */
  placement?: PopoverPlacementType;
  /**
   * A callback function that fires when the Popover's state is changed from
   * not visible to visible
   */
  onShow?: () => void;
  /**
   * A callback function that fires when the Popover's state is changed from
   * visible to not visible
   */
  onHide?: (hideReason?: HideReasonType) => void;
  /**
   * A callback function that fires when the Popover goes back to the previous
   * screen
   */
  onBack?: () => void;
}

export interface UsePopoverResult<
  TElementTrigger extends HTMLElement = HTMLElement,
  TElementTarget extends HTMLElement = HTMLElement,
> {
  // Refs for consumers to set
  /**
   * React ref for the Popover trigger element.
   * The Popover will be positioned relative to this element by default,
   * unless a `targetRef` element is provided.
   * Attach this ref to the React element using the ref prop.
   * @example
   * <button ref={triggerRef} onClick={toggle}>
   *  Toggle popover
   * </button>
   */
  triggerRef: (node: TElementTrigger | null) => void;
  /**
   * React ref for the Popover positioning target element.
   * The Popover will be positioned relative to this element.
   * Attach this ref to the React element using the ref prop.
   *
   * NOTE: If this ref is not used, the Popover will be positioned relative
   * to the triggerRef element.
   * @example
   * <div ref={targetRef}>
   *  Land ho!
   * </div>
   */
  targetRef: (node: TElementTarget | null) => void;

  // Single screen
  /**
   * A function that shows the Popover when called.
   *
   * i.e. `isVisible` = `true`
   */
  show: () => void;
  /**
   * A function that hides the Popover when called
   *
   * i.e. `isVisible` = `false`
   */
  hide: () => void;
  /**
   * A function that toggles the visibility of the Popover when called
   *
   * i.e. `isVisible` = `!isVisible`
   */
  toggle: () => void;

  // Multi screen
  /**
   * Function to change the current visible screen of the Popover.
   * This will add the screen and trigger element ref to the Popover’s history,
   * which enables you to use the pop function to go back to a previous screen
   * and return focus to the appropriate trigger element.
   *
   * Accepts a screen argument, which is the id of a particular
   * PopoverScreen component instance.
   * Accepts a ref argument which is the ref to the element that is
   * calling push so that focus can be returned to it when the user
   * moves between screens.
   * @example
   *
   * const Screens {
   *  Screen1: 0,
   *  Screen2: 1,
   * } as const;
   * const { triggerRef, toggle, push, popoverProps } = usePopover({
   *  initialScreen: Screens.Screen1,
   * });
   *
   * const screenTriggerRef = useRef<HTMLButtonElement>(null)
   *
   * return (
   *  <>
   *    <button ref={triggerRef} onClick={toggle}>
   *      Toggle popover
   *    </button>
   *    <Popover {...popoverProps}>
   *      <PopoverScreen id={Screens.Screen1}>
   *        <button onClick={() => push(Screens.Screen2, screenTriggerRef)} ref={screenTriggerRef}>
   *          Push new screen
   *        </button>
   *      </PopoverScreen>
   *      <PopoverScreen id={Screens.Screen2}>
   *        <span>New screen</span>
   *      </PopoverScreen>
   *    </Popover>
   *  </>
   * );
   */
  push: (
    screen: number,
    prevScreenTrigger?: RefObject<HTMLElement> | (() => HTMLElement | null),
  ) => void;
  /**
   * Function to change the current visible screen of the Popover to
   * one previously rendered in its history.
   *
   * Accepts an optional depth argument, which determines how many
   * steps backwards in history the function should take. If no argument is
   * provided, calling `pop()` will render the previous screen. If the depth
   * exceeds the number of screens in the history of the popover, render the
   * initial screen, e.g. `pop(Infinity)`.
   * @example
   *
   * const Screens {
   *  Screen1: 0,
   *  Screen2: 1,
   * } as const;
   * const { triggerRef, toggle, pop, popoverProps } = usePopover({
   *  initialScreen: Screens.Screen2,
   * });
   *
   * return (
   *  <>
   *    <button ref={triggerRef} onClick={toggle}>
   *      Toggle popover
   *    </button>
   *    <Popover {...popoverProps}>
   *      <PopoverScreen id={Screens.Screen1}>
   *        <span>First screen/span>
   *      </PopoverScreen>
   *      <PopoverScreen id={Screens.Screen2}>
   *        <button onClick={() => pop()}>
   *          Pop to previous screen
   *        </button>
   *      </PopoverScreen>
   *    </Popover>
   *  </>
   * );
   */
  pop: (depth?: number) => void;

  /**
   * Props for Popover component. These should be provided to the Popover for
   * proper behavior regarding visibility and content.
   * @see PopoverProps
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
   *  );
   */
  popoverProps: PopoverProps<TElementTrigger, TElementTarget>;
}

export const usePrevious = <T>(value: T) => {
  const ref = useRef<T>();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]);

  // Return previous value (happens before update in useEffect above)
  return ref.current;
};

/**
 * A hook that, when called, provides relevant props to pass to the Popover
 * component, refs to pass to the trigger and/or target elements, and functions
 * for managing the Popover’s content. This is also the main handler
 * of show/hide logic of the Popover itself as well as any nested screens in the
 * Popover.
 * @see Popover
 * @see PopoverScreen
 *
 * Popovers are operated using hooks, so the props that you need can be easily
 * spread over the Popover component
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
export const usePopover = <
  TElementTrigger extends HTMLElement,
  TElementTarget extends HTMLElement = HTMLElement,
>({
  initialScreen = 0,
  size,
  placement,
  onShow,
  onHide,
  onBack,
}: UsePopoverArgs = {}): UsePopoverResult<TElementTrigger, TElementTarget> => {
  // Refs
  const [triggerElement, triggerRef] = useCallbackRef<TElementTrigger>();
  const [targetElement, targetRef] = useCallbackRef<TElementTarget>();

  // Single screen
  const [isVisible, setIsVisible] = useState(false);

  const show = useCallback(() => {
    setIsVisible(true);
  }, []);
  const hide = useCallback(() => {
    setIsVisible(false);
  }, []);
  const toggle = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);

  // Multi screen
  const [screenStack, setScreenStack] = useState([initialScreen]);
  // eslint-disable-next-line @eslint-react/naming-convention/use-state -- This state is not used, but it is needed to make the render reactive to new screen trigger refs.
  const [, setScreenTriggerRefStack] = useState<
    (
      | RefObject<HTMLElement>
      | (() => HTMLElement | RefObject<HTMLElement> | null)
    )[]
  >([]);
  const [prevScreenTrigger, setPrevScreenTrigger] = useState<
    HTMLElement | RefObject<HTMLElement> | null
  >(null);
  const currentScreen = screenStack[screenStack.length - 1];
  const push = useCallback(
    (
      screenId: number,
      screenTriggerRef?:
        | RefObject<HTMLElement>
        | (() => HTMLElement | RefObject<HTMLElement> | null),
    ) => {
      setScreenStack((prev) => [...prev, screenId]);
      if (screenTriggerRef) {
        setScreenTriggerRefStack((prev) => [...prev, screenTriggerRef]);
      }
      // User is pushing a new screen onto the stack so there is
      // no screen trigger ref to focus.
      setPrevScreenTrigger(null);
    },
    [],
  );
  const pop = useCallback(
    (depth = 1) => {
      setScreenStack((prev) => {
        // If depth exceeds screen stack length, reset the screen stack state.
        // Note: let's use prev[0] rather than `initialScreen`, in case that
        // prop has changed; this function should be true to history.
        if (depth > screenStack.length - 1) {
          return [prev[0]];
        }
        return prev.slice(0, -depth);
      });

      setScreenTriggerRefStack((prev) => {
        if (prev.length > 0) {
          const prevItem = prev[prev.length - 1];
          if (typeof prevItem === 'function') {
            requestAnimationFrame(() => {
              const prevSelectedItem = prevItem();
              if (
                typeof prevSelectedItem === 'object' &&
                prevSelectedItem !== null
              ) {
                setPrevScreenTrigger(prevSelectedItem);
              }
            });
          } else {
            setPrevScreenTrigger(prevItem);
          }
          return prev.slice(0, -depth);
        }
        setPrevScreenTrigger(null);
        return [];
      });
    },
    [screenStack.length],
  );

  // Clear the stack when hidden, and allow the initialScreen to be changed.
  useEffect(() => {
    if (!isVisible) {
      setScreenStack([initialScreen]);
      setScreenTriggerRefStack([]);
    }
  }, [
    isVisible,
    setScreenStack,
    initialScreen,
    setScreenTriggerRefStack,
    screenStack.length,
  ]);
  // Consumer lifecycle hooks
  const wasVisible = usePrevious(isVisible);
  const hideReason = useRef<HideReasonType>();

  useEffect(() => {
    if (wasVisible === true && isVisible === false) {
      onHide?.(hideReason.current);
    }
    if (wasVisible === false && isVisible === true) {
      hideReason.current = undefined;
      scrollIntoViewIfNeeded(targetElement || triggerElement);
      onShow?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, onHide, onShow, wasVisible]);

  // Probably an over-optimization, but this ensures we pass
  // stable function references through to the popover component
  const onHideHandler = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (reason: any) => {
      hideReason.current = reason;
      hide();
    },
    [hide],
  );
  const onBackHandler = useCallback(() => {
    onBack?.();
    pop();
  }, [pop, onBack]);

  const popoverProps = useMemo<PopoverProps<TElementTrigger, TElementTarget>>(
    () => ({
      isVisible,
      size,
      placement,
      onHide: onHideHandler,
      onBack: onBackHandler,
      hasBackButton: screenStack.length > 1,
      targetElement,
      triggerElement,
      currentScreen,
      prevScreenTrigger,
    }),
    [
      isVisible,
      size,
      placement,
      onHideHandler,
      onBackHandler,
      screenStack.length,
      targetElement,
      triggerElement,
      currentScreen,
      prevScreenTrigger,
    ],
  );

  return {
    targetRef,
    triggerRef,

    show,
    hide,
    toggle,
    push,
    pop,

    // These props are 'internal' the popover hook, and are
    // expected to be spread onto the <Popover> component
    popoverProps,
  };
};
