import { currentLocale } from '@trello/locale';

/* eslint-disable-next-line @trello/enforce-variable-case, @typescript-eslint/no-explicit-any */
const PluginOptions = (baseOptions: any) => ({
  ...baseOptions,
  locale: currentLocale,
});

export { PluginOptions };
