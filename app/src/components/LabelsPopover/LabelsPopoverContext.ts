import type { Dispatch, RefObject, SetStateAction } from 'react';
import { createContext } from 'react';

import type { SourceType } from '@trello/analytics-types';
import type { CardLabelType } from '@trello/labels';
import type { UsePopoverResult } from '@trello/nachos/popover';

import type { BoardMenuScreenType } from 'app/src/components/BoardMenuPopover/BoardMenuScreen';
import type { AddToCardMenuScreenType } from 'app/src/components/CardBackAddToCardMenu/Screens';
import { noop } from 'app/src/noop';
import type { LabelsPopoverScreenType } from './LabelsPopoverScreen';

export interface LabelsPopoverContextValue
  extends Pick<UsePopoverResult, 'hide' | 'pop'> {
  source: SourceType;

  idBoard: string;
  idOrganization: string;
  idCard: string | null;
  idList: string | null;

  /**
   * Whether the current member has edit permissions. By and large, the labels
   * popover can't be triggered in the first place if the member cannot edit the
   * current board, but in some cases, like the board menu, we need a disabled
   * state.
   */
  isEditable: boolean;

  /**
   * Whether the popover is being rendered in the redesigned cardback's AddToCardMenu.
   * Used to determine the correct popover screen to push when the user interacts with
   * the popover.
   */
  isOnAddToCardPopover?: boolean;

  /**
   * Whether the popover is being rendered in the board sidebar redesigned menu. This is
   * used to determine the correct screen to push when the user interacts with
   * the popover.
   */
  isSourceSidebarMenu?: boolean;

  /**
   * labelsOnBoard represents the superset of all labels that are available on
   * the given board. Used primarily to populate the list of labels.
   */
  labelsOnBoard: CardLabelType[];
  /**
   * labelsSelectedOnCard represents the subset of selected labels on a card.
   */
  labelsSelectedOnCard: CardLabelType[];

  labelsLimitPerBoard:
    | {
        disableAt: number;
        status: 'disabled' | 'maxExceeded' | 'ok' | 'warn';
      }
    | undefined;

  /**
   * Edit and delete screens need shared context on a currently selected label.
   * @default null
   */
  currentLabel: CardLabelType | null;
  setCurrentLabel: Dispatch<SetStateAction<CardLabelType | null>>;

  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;

  shouldSetFocusOnCreateNewLabelButton: boolean;
  setShouldSetFocusOnCreateNewLabelButton: Dispatch<SetStateAction<boolean>>;

  /**
   * By default, selecting a label fires a mutation to add the label to a given
   * card. However, in some cases, we have to override that functionality. For
   * example, when selecting a label via the card composer, we want to add the
   * label to the card that's currently being composed, before it exists.
   * @default undefined
   */
  onLabelSelected?: (
    label: CardLabelType,
    action: 'deselect' | 'select',
  ) => void;
  /**
   * Optional callback to be executed upon label deletion. In some cases, the
   * cache won't be updated properly, so we need to manually trigger a refetch.
   * This happens notably in the workspace table view, where the cache is
   * complicated by the multi-board view API.
   */
  onLabelDeleted?: () => void;

  /**
   * Wrapped `push` handler. We need the clicked element ref to be defined for
   * the BoardSidebarLabelsScreen, where the popover needs a triggerRef to open.
   */
  push: (
    screen:
      | AddToCardMenuScreenType
      | BoardMenuScreenType
      | LabelsPopoverScreenType,
    prevScreenTrigger?: RefObject<HTMLElement> | (() => HTMLElement | null),
  ) => void;
}

export const defaultLabelsPopoverContextValue: LabelsPopoverContextValue = {
  source: 'labelsInlineDialog',

  idBoard: '',
  idOrganization: '',
  idCard: null,
  idList: null,

  isEditable: false,
  isSourceSidebarMenu: false,
  isOnAddToCardPopover: false,

  labelsOnBoard: [],
  labelsSelectedOnCard: [],
  labelsLimitPerBoard: undefined,

  currentLabel: null,
  setCurrentLabel: noop,

  searchQuery: '',
  setSearchQuery: noop,
  shouldSetFocusOnCreateNewLabelButton: false,
  setShouldSetFocusOnCreateNewLabelButton: noop,

  onLabelSelected: undefined,
  onLabelDeleted: undefined,

  push: noop,
  pop: noop,
  hide: noop,
};

/**
 * React Context used within the Labels Popover to manage internal state.
 * Reads from LabelsPopoverState, usePopover, and board and card queries for all
 * data required to render children.
 */
export const LabelsPopoverContext = createContext<LabelsPopoverContextValue>(
  defaultLabelsPopoverContextValue,
);
