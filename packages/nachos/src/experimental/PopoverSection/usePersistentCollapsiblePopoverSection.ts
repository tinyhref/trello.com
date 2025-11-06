import { useCallback } from 'react';

import {
  PersistentSharedState,
  useSharedStateSelector,
} from '@trello/shared-state';

import type { PopoverSectionProps } from './PopoverSection';

type CollapsiblePopoverSectionId =
  | 'listActionsPopoverAutomations'
  | 'listActionsPopoverColorPicker'
  | 'listActionsPopoverPlugins';

type CollapsedPopoverSectionIds = Partial<
  Record<CollapsiblePopoverSectionId, boolean>
>;

export const collapsedPopoverSectionIds =
  new PersistentSharedState<CollapsedPopoverSectionIds>(
    {},
    { storageKey: 'collapsed-popover-section-ids' },
  );

export const usePersistentCollapsiblePopoverSection = (
  popoverSectionId: CollapsiblePopoverSectionId,
): Pick<
  PopoverSectionProps,
  'isCollapsed' | 'isCollapsible' | 'onToggleCollapsed'
> => {
  const isCollapsed = useSharedStateSelector(
    collapsedPopoverSectionIds,
    useCallback((ids) => Boolean(ids[popoverSectionId]), [popoverSectionId]),
  );

  const onToggleCollapsed = useCallback(() => {
    collapsedPopoverSectionIds.setValue((value) => ({
      ...value,
      [popoverSectionId]: !value[popoverSectionId],
    }));
  }, [popoverSectionId]);

  return {
    isCollapsible: true,
    isCollapsed,
    onToggleCollapsed,
  };
};
