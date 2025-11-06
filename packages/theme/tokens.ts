/**
 * This file is manually generated today, designed to map custom Trello tokens
 * from the ADS syntax's names to CSS variables. Unlike ADS tokens, custom
 * Trello tokens will be prefixed with `trello.` to prevent possible collisions.
 */

export const trelloTokens = {
  'trello.color.background.list': '--tr-background-list',
  'trello.color.icon.star': '--tr-icon-star',
} as const;

export interface TrelloCSSTokenMap {
  'trello.color.background.list': 'var(--tr-background-list)';
  'trello.color.icon.star': 'var(--tr-icon-star)';
}
