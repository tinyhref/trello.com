const DYNAMIC_TOKEN_NOT_FOUND_CSS_VAR = '--dynamic-token-not-found';

// Map dynamic token names to CSS property name syntax.
export const DynamicTokenMap = {
  'dynamic.background': '--dynamic-background',
  'dynamic.background.transparent': '--dynamic-background-transparent',
  'dynamic.button': '--dynamic-button',
  'dynamic.button.hovered': '--dynamic-button-hovered',
  'dynamic.button.pressed': '--dynamic-button-pressed',
  'dynamic.button.pressed.hovered': '--dynamic-button-pressed-hovered',
  'dynamic.button.pressed.text': '--dynamic-button-pressed-text',
  'dynamic.button.highlighted': '--dynamic-button-highlighted',
  'dynamic.button.highlighted.text': '--dynamic-button-highlighted-text',
  'dynamic.button.highlighted.hovered': '--dynamic-button-highlighted-hovered',
  'dynamic.button.primary': '--dynamic-button-primary',
  'dynamic.button.primary.text': '--dynamic-button-primary-text',
  'dynamic.button.primary.hovered': '--dynamic-button-primary-hovered',
  'dynamic.button.primary.pressed': '--dynamic-button-primary-pressed',
  'dynamic.navitem': '--dynamic-nav-item',
  'dynamic.navitem.interactable': '--dynamic-nav-item-interactable',
  'dynamic.navitem.interactable.pressed':
    '--dynamic-nav-item-interactable-pressed',
  'dynamic.navitem.interactable.hovered':
    '--dynamic-nav-item-interactable-hovered',
  'dynamic.navitem.hovered': '--dynamic-nav-item-hovered',
  'dynamic.navitem.pressed': '--dynamic-nav-item-pressed',
  'dynamic.icon': '--dynamic-icon',
  'dynamic.star': '--dynamic-star',
  'dynamic.text': '--dynamic-text',
  'dynamic.text.transparent': '--dynamic-text-transparent',
  'dynamic.logo.filter': '--dynamic-logo-filter',
} as const;

// Kept in sync with the above in order to enable `dynamicToken`.
export interface DynamicCSSTokenMap {
  'dynamic.background': 'var(--dynamic-background)';
  'dynamic.background.transparent': 'var(--dynamic-background-transparent)';
  'dynamic.button': 'var(--dynamic-button)';
  'dynamic.button.hovered': 'var(--dynamic-button-hovered)';
  'dynamic.button.pressed': 'var(--dynamic-button-pressed)';
  'dynamic.button.highlighted': 'var(--dynamic-button-highlighted)';
  'dynamic.button.highlighted.text': 'var(--dynamic-button-highlighted-text)';
  'dynamic.button.highlighted.hovered': 'var(--dynamic-button-highlighted-hovered)';
  'dynamic.button.primary': 'var(--dynamic-button-primary)';
  'dynamic.button.primary.text': 'var(--dynamic-button-primary-text)';
  'dynamic.button.primary.hovered': 'var(--dynamic-button-primary-hovered)';
  'dynamic.button.primary.pressed': 'var(--dynamic-button-primary-pressed)';
  'dynamic.navitem.interactable': 'var(--dynamic-nav-item-interactable)';
  'dynamic.navitem.interactable.pressed': 'var(--dynamic-nav-item-interactable-pressed)';
  'dynamic.navitem.hovered': 'var(--dynamic-nav-item-hovered)';
  'dynamic.navitem.pressed': 'var(--dynamic-nav-item-pressed)';
  'dynamic.icon': 'var(--dynamic-icon)';
  'dynamic.star': 'var(--dynamic-star)';
  'dynamic.text': 'var(--dynamic-text)';
  'dynamic.text.transparent': 'var(--dynamic-text-transparent)';
  'dynamic.logo.filter': 'var(--dynamic-logo-filter)';
}

/**
 * Takes a dot-separated dynamic token name and an optional fallback, and
 * returns the CSS custom property for the corresponding dynamic token.
 * Dynamic equivalent of `token` in `@trello/theme`.
 */
export function dynamicToken<T extends keyof DynamicCSSTokenMap>(
  path: T,
  fallback?: string,
): DynamicCSSTokenMap[T] {
  let token:
    | (typeof DynamicTokenMap)[T]
    | typeof DYNAMIC_TOKEN_NOT_FOUND_CSS_VAR = DynamicTokenMap[path];

  if (!token) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`Unknown dynamic token name at path: ${path}`);
    }
    token = DYNAMIC_TOKEN_NOT_FOUND_CSS_VAR;
  }

  const tokenCall = fallback ? `var(${token}, ${fallback})` : `var(${token})`;
  return tokenCall as DynamicCSSTokenMap[T];
}
