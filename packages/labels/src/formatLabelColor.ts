import { forNamespace } from '@trello/legacy-i18n';

const format = forNamespace('labels');

export const formatLabelColor = (
  color: string | null | undefined,
  fallback: string = '',
) => {
  switch (color) {
    case 'black':
      return format('black');
    case 'black_dark':
      return format('black_dark');
    case 'black_light':
      return format('black_light');
    case 'blue':
      return format('blue');
    case 'blue_dark':
      return format('blue_dark');
    case 'blue_light':
      return format('blue_light');
    case 'green':
      return format('green');
    case 'green_dark':
      return format('green_dark');
    case 'green_light':
      return format('green_light');
    case 'lime':
      return format('lime');
    case 'lime_dark':
      return format('lime_dark');
    case 'lime_light':
      return format('lime_light');
    case 'orange':
      return format('orange');
    case 'orange_dark':
      return format('orange_dark');
    case 'orange_light':
      return format('orange_light');
    case 'pink':
      return format('pink');
    case 'pink_dark':
      return format('pink_dark');
    case 'pink_light':
      return format('pink_light');
    case 'purple':
      return format('purple');
    case 'purple_dark':
      return format('purple_dark');
    case 'purple_light':
      return format('purple_light');
    case 'red':
      return format('red');
    case 'red_dark':
      return format('red_dark');
    case 'red_light':
      return format('red_light');
    case 'sky':
      return format('sky');
    case 'sky_dark':
      return format('sky_dark');
    case 'sky_light':
      return format('sky_light');
    case 'yellow':
      return format('yellow');
    case 'yellow_dark':
      return format('yellow_dark');
    case 'yellow_light':
      return format('yellow_light');
    default:
      return fallback;
  }
};
