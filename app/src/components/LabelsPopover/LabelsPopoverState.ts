import type { SourceType } from '@trello/analytics-types';
import { SharedState } from '@trello/shared-state';

import { noop } from 'app/src/noop';

export interface LabelsPopoverSharedState {
  /**
   * Whether or not the label popover is open globally.
   */
  isOpen: boolean;
  /**
   * The card in context on which the label popover was opened.
   * Used for populates selected labels and adding selected labels to the card.
   */
  idCard: string | null;
  source: SourceType;
  /**
   * The element that opened the label popover, e.g. a corresponding button.
   */
  triggerElement: HTMLElement | null;
  /**
   * If supplied, a separate element to anchor the popover to.
   */
  targetElement?: HTMLElement | null;
  /**
   * A callback that should execute when the popover next hides.
   */
  onHide?: () => void;
  /**
   * Whether to dismiss the popover upon toggling a single label.
   * @default false
   */
  hideOnSelect?: boolean;
  /**
   * Optional value with which to prefill the search input. Historically used
   * exclusively for the 0-9 keyboard shortcuts on cards, in which case the
   * search input would prepopulate with the name of the corresponding color.
   */
  initialSearchQuery?: string;
}

export const emptyLabelsPopoverState: LabelsPopoverSharedState = {
  isOpen: false,
  source: 'labelsInlineDialog',
  idCard: null,
  triggerElement: null,
  targetElement: null,
  onHide: noop,
  hideOnSelect: false,
  initialSearchQuery: '',
};

/**
 * Shared state used for managing the React LabelPopover component, which is
 * rendered once on the board view and can be triggered over any card.
 */
export const LabelsPopoverState = new SharedState<LabelsPopoverSharedState>(
  emptyLabelsPopoverState,
);
