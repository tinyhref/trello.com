import { createContext } from 'use-context-selector';

export type PluginCapability =
  | 'attachment-sections'
  | 'attachment-thumbnail'
  | 'authorization-status'
  | 'board-buttons'
  | 'board-views'
  | 'card-back-section'
  | 'card-badges'
  | 'card-buttons'
  | 'card-detail-badges'
  | 'card-from-url'
  | 'format-url'
  | 'list-actions'
  | 'list-sorters'
  | 'on-disable'
  | 'on-enable'
  | 'remove-data'
  | 'save-attachment'
  | 'show-authorization'
  | 'show-settings';

export interface BoardPluginsContextValue {
  /**
   * Set of capabilities supported across all plugins enabled on the board.
   */
  capabilities: Set<PluginCapability>;
  /**
   * Set of ids of all plugins enabled on the board
   */
  enabledPlugins: Set<string>;
  /**
   * Mapping of plugin ids to set of capabilities,
   */
  pluginCapabilitiesById: Record<string, Set<PluginCapability>>;
}

export const emptyBoardPluginsContext: BoardPluginsContextValue = {
  capabilities: new Set(),
  enabledPlugins: new Set(),
  pluginCapabilitiesById: {},
};

export const BoardPluginsContext = createContext<BoardPluginsContextValue>(
  emptyBoardPluginsContext,
);
