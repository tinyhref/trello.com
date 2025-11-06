import type { AriaRole, ReactNode } from 'react';

import type {
  ComponentSizeL,
  ComponentSizeM,
  ComponentSizeS,
  ComponentSizeXl,
} from '@trello/nachos/tokens';

export type PopoverSize =
  | typeof ComponentSizeL
  | typeof ComponentSizeM
  | typeof ComponentSizeS
  | typeof ComponentSizeXl;

export const PopoverPlacement = {
  AUTO_START: 'auto-start',
  AUTO: 'auto',
  AUTO_END: 'auto-end',
  TOP_START: 'top-start',
  TOP: 'top',
  TOP_END: 'top-end',
  RIGHT_START: 'right-start',
  RIGHT: 'right',
  RIGHT_END: 'right-end',
  BOTTOM_START: 'bottom-start',
  BOTTOM: 'bottom',
  BOTTOM_END: 'bottom-end',
  LEFT_START: 'left-start',
  LEFT: 'left',
  LEFT_END: 'left-end',
} as const;
export type PopoverPlacementType =
  (typeof PopoverPlacement)[keyof typeof PopoverPlacement];

export const HideReason = {
  CLICK_OUTSIDE: 'click outside the popover',
  NO_ANCHOR_ELEMENT:
    'popover was rendered with isVisible = true, but no anchor element to render on',
  ESCAPE_HANDLER: 'escape keypress handler',
  CLICK_CLOSE_BUTTON: 'click on the close button',
  NAVIGATION: 'browser navigation event',
} as const;
export type HideReasonType = (typeof HideReason)[keyof typeof HideReason];

export interface PopoverProps<
  TElementTrigger = HTMLElement,
  TElementTarget = HTMLElement,
> {
  // Public API
  /**
   * Determines the position of where the Popover will open relative to its
   * trigger element
   * @default 'bottom-start'
   */
  placement?: PopoverPlacementType;
  /**
   * The relative width of the Popover component, eventually
   * converted into pixel measurements. If none is provided, Popover
   * will fallback to `'medium'`.
   * @default 'medium'
   */
  size?: PopoverSize;
  /**
   * The content to display in the title container of the Popover
   * @default undefined
   */
  title?: ReactNode;

  /**
   * Set to true to enable styling to accomodate multiline titles
   * @default undefined
   */
  UNSAFE_multilineTitle?: boolean;

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
   * Prevents the popover from expanding over of the anchorElement. This can be
   * useful when keeping the anchorElement visible is more important than
   * increasing the maxHeight of the popover.
   *
   * @default undefined
   */
  dontOverlapAnchorElement?: boolean;
  /**
   * A string that gets placed as a data attribute (data-testid) onto the
   * Portal rendered inside Popover so that our
   * smoketest can properly target and test the component
   * @default undefined
   */
  testId?: string;

  /**
   * Set an id attribute on the root container element of the Popover.
   * Useful for accessibility associations (e.g. aria-owns / aria-controls).
   * @default undefined
   */
  id?: string;

  /**
   * Indicates whether to enable up/down arrow key navigation within the popover.
   *
   * @default undefined
   */
  enableArrowKeyNavigation?: boolean;

  /**
   * The ARIA role of the popover.
   * @default 'dialog'
   */
  role?: AriaRole;

  /**
   * ID of the element that labels the popover header
   * @default undefined
   */
  labelledBy?: string;

  /**
   * Indicates whether the popover is modal.
   * @default false
   */
  isModal?: boolean;

  // Provided by the hook
  /**
   * Indicates whether or not the Popover is currently visible
   */
  isVisible: boolean;
  /**
   * The element that will toggle the visibility of the popover.
   * Toggling visibility is usually achieved by interacting with the
   * trigger element by mouse.
   */
  triggerElement: TElementTrigger | null;
  /**
   * The element that the Popover will position itself relative to. If no target
   * element is provided, the trigger element is used.
   */
  targetElement: TElementTarget | null;
  /**
   * A callback function that fires when the Popover's state is changed from
   * visible to not visible
   */
  onHide: (reason: HideReasonType) => void;
  /**
   * Indicates whether or not the Popover should render a "Back" button. This
   * back button allows navigation between PopoverScreens (multi-screen
   * popovers)
   * @default false
   */
  hasBackButton?: boolean;
  /**
   * A callback function that fires when the "back" button in the Popover is
   * clicked
   * @default undefined
   */
  onBack?: () => void;
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
   * The element that triggered the previous screen on multiscreen
   * popovers.
   * Allows us to return focus to the trigger element when the user
   * navigates back out of that screen.
   */
  prevScreenTrigger?: HTMLElement | React.RefObject<HTMLElement> | null;

  // Escape hatches

  /**
   * ⚠️ DO NOT USE THIS PROP UNLESS YOU REALLY REALLY HAVE TO.
   *
   * This allows you to manually set the elevation of the popover, instead of
   * relying on automatic functionality. The only reason to do this is when your
   * popover controls when to show and hide itself, and does not contain an
   * attached trigger element at all times (ie, can be multiple trigger elements.)
   */
  dangerous_elevation?: number;

  /**
   * ⚠️ DO NOT USE THIS PROP UNLESS YOU REALLY REALLY HAVE TO.
   *
   * Places a class name on the Popover (more specifically, the direct
   * descendant of the React Portal that renders the Popover).
   *
   * Please refrain from using this unless absolutely necessary.
   * @default undefined
   */
  dangerous_className?: string;

  /**
   * ⚠️ DO NOT USE THIS PROP UNLESS YOU REALLY REALLY HAVE TO.
   *
   * Overrides the 'size' prop with a custom pixel width. Useful
   * for legacy popovers that are designed to a very specific size (eg. EmojiPicker)
   *
   * Please refrain from using this unless absolutely necessary.
   * @default undefined
   */
  dangerous_width?: number;

  /**
   * ⚠️ DO NOT USE THIS PROP UNLESS YOU REALLY REALLY HAVE TO.
   *
   * Disables any auto focusing behavior of the Popover. By default the content of the Popover
   * will be focused when it is shown, and the trigger element will be focused when it is hidden
   *
   * Please refrain from using this unless absolutely necessary.
   * @default undefined
   */
  dangerous_disableAutoFocus?: boolean;

  /**
   * ⚠️ DO NOT USE THIS PROP UNLESS YOU REALLY REALLY HAVE TO.
   *
   * Disables focus trapping behavior of the Popover. By default the Popover
   * traps focus when it is opened so that the user can continue to tab through
   * the popover items until it is closed.
   *
   * Please refrain from using this unless absolutely necessary.
   * @default undefined
   */
  dangerous_disableFocusTrapping?: boolean;

  /**
   * ⚠️ DO NOT USE THIS PROP UNLESS YOU REALLY REALLY HAVE TO.
   *
   * Sets the offset prop for the Popper component, which determines the distance
   * away from the reference element the Popover will be rendered.
   *
   * Please refrain from using this unless absolutely necessary.
   * @default undefined
   */
  dangerous_offset?: [number | null | undefined, number | null | undefined];
}
