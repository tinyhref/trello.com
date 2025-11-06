export const PluginPopoverScreen = {
  PowerUpsMenu: 0,
  Confirm: 1,
  Datetime: 2,
  List: 3,
  Iframe: 4,
};

export type PluginPopoverScreenType =
  (typeof PluginPopoverScreen)[keyof typeof PluginPopoverScreen];
