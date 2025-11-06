import { useCallback } from 'react';
import { useContextSelector } from 'use-context-selector';

import type {
  BoardPluginsContextValue,
  PluginCapability,
} from './BoardPluginsContext';
import { BoardPluginsContext } from './BoardPluginsContext';

/**
 * Access the BoardPluginsContext with a context selector to access a specific
 * nested value. This allows consumers to only subscribe to updates on the
 * selected value.
 *
 * @example
 * // Only subscribe to cards associated with the given list ID:
 * const canEditBoard = useBoardListsContext(
 *   useCallback((value) => value.canEditBoard, []),
 * );
 */
export const useBoardPluginsContext = <T>(
  selector: (value: BoardPluginsContextValue) => T,
) => useContextSelector(BoardPluginsContext, selector);

export const useIsPluginEnabled = (pluginId: string) =>
  useContextSelector(
    BoardPluginsContext,
    useCallback((value) => value.enabledPlugins.has(pluginId), [pluginId]),
  );

/**
 * Determine if any Plugins on the board declare a specific Plugin capability
 */
export const useHasPluginCapability = (capability: PluginCapability) =>
  useContextSelector(
    BoardPluginsContext,
    useCallback((value) => value.capabilities.has(capability), [capability]),
  );
