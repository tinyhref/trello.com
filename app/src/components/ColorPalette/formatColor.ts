import { intl } from '@trello/i18n';
import { forNamespace } from '@trello/legacy-i18n';
import { getGlobalTheme } from '@trello/theme';

// For now we have to use the legacy label translations because
// translations are handled on the server side
const format = forNamespace('labels');

export type Color =
  | 'black_dark'
  | 'black_light'
  | 'black'
  | 'blue_dark'
  | 'blue_light'
  | 'blue'
  | 'gray'
  | 'green_dark'
  | 'green_light'
  | 'green'
  | 'lime_dark'
  | 'lime_light'
  | 'lime'
  | 'magenta_dark'
  | 'magenta_light'
  | 'magenta'
  | 'orange_dark'
  | 'orange_light'
  | 'orange'
  | 'pink_dark'
  | 'pink_light'
  | 'pink'
  | 'purple_dark'
  | 'purple_light'
  | 'purple'
  | 'red_dark'
  | 'red_light'
  | 'red'
  | 'sky_dark'
  | 'sky_light'
  | 'sky'
  | 'teal_dark'
  | 'teal_light'
  | 'teal'
  | 'yellow_dark'
  | 'yellow_light'
  | 'yellow';

export const formatColor = (color: Color) => {
  switch (color) {
    case 'blue':
      return intl.formatMessage({
        id: 'templates.list_color_picker.blue',
        defaultMessage: 'blue',
        description: 'blue',
      });
    case 'blue_light':
      return format('blue_light');
    case 'blue_dark':
      return format('blue_dark');
    case 'green':
      return intl.formatMessage({
        id: 'templates.list_color_picker.green',
        defaultMessage: 'green',
        description: 'green',
      });
    case 'green_light':
      return format('green_light');
    case 'green_dark':
      return format('green_dark');
    case 'lime':
      return intl.formatMessage({
        id: 'templates.list_color_picker.lime',
        defaultMessage: 'lime',
        description: 'lime',
      });
    case 'lime_light':
      return format('lime_light');
    case 'lime_dark':
      return format('lime_dark');
    case 'orange':
      return intl.formatMessage({
        id: 'templates.list_color_picker.orange',
        defaultMessage: 'orange',
        description: 'orange',
      });
    case 'orange_light':
      return format('orange_light');
    case 'orange_dark':
      return format('orange_dark');
    case 'pink':
      return format('pink');
    case 'magenta':
      return intl.formatMessage({
        id: 'templates.list_color_picker.magenta',
        defaultMessage: 'magenta',
        description: 'magenta',
      });
    case 'pink_light':
      return format('pink_light');
    case 'pink_dark':
      return format('pink_dark');
    case 'purple':
      return intl.formatMessage({
        id: 'templates.list_color_picker.purple',
        defaultMessage: 'purple',
        description: 'purple',
      });
    case 'purple_light':
      return format('purple_light');
    case 'purple_dark':
      return format('purple_dark');
    case 'red':
      return intl.formatMessage({
        id: 'templates.list_color_picker.red',
        defaultMessage: 'red',
        description: 'red',
      });
    case 'red_light':
      return format('red_light');
    case 'red_dark':
      return format('red_dark');
    case 'sky':
      return format('sky');
    case 'teal':
      return intl.formatMessage({
        id: 'templates.list_color_picker.teal',
        defaultMessage: 'teal',
        description: 'teal',
      });
    case 'sky_light':
      return format('sky_light');
    case 'sky_dark':
      return format('sky_dark');
    case 'yellow':
      return intl.formatMessage({
        id: 'templates.list_color_picker.yellow',
        defaultMessage: 'yellow',
        description: 'yellow',
      });
    case 'yellow_light':
      return format('yellow_light');
    case 'yellow_dark':
      return format('yellow_dark');
    case 'black':
      return format('black');
    case 'black_light':
      return format('black_light');
    case 'black_dark':
      return format('black_dark');
    case 'gray': {
      const { effectiveColorMode } = getGlobalTheme();
      return effectiveColorMode === 'dark'
        ? intl.formatMessage({
            id: 'templates.list_color_picker.default_dark_mode_color',
            defaultMessage: 'black (default)',
            description: 'description of the default list color in dark mode',
          })
        : intl.formatMessage({
            id: 'templates.list_color_picker.default_light_mode_color',
            defaultMessage: 'gray (default)',
            description: 'description of the default list color in light mode',
          });
    }
    default:
      return '';
  }
};
