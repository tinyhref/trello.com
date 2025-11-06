import type { RelativeFormatConfig } from '../relativeFormatConfig';

const createHoursFunction = (str: string) => {
  return (date: Date) => `${str}о${date.getHours() === 11 ? 'б' : ''} __TIME__`;
};

export const uk = {
  today: createHoursFunction('Сьогодні '),
  yesterday: createHoursFunction('Вчора '),
  tomorrow: createHoursFunction('Завтра '),
  lastWeek: (date) => {
    switch (date.getDay()) {
      case 1:
      case 2:
      case 4:
        return createHoursFunction('Минулого __WEEKDAY__ ')(date);
      default:
        return createHoursFunction('Минулої __WEEKDAY__ ')(date);
    }
  },
  nextWeek: createHoursFunction('__WEEKDAY__ '),
  sameYear: createHoursFunction('__DATE_NO_YEAR__ '),
  else: createHoursFunction('__DATE_WITH_YEAR__ '),
} satisfies RelativeFormatConfig;

export const ukWithoutTime = {
  today: 'Сьогодні',
  yesterday: 'Вчора',
  tomorrow: 'Завтра',
  lastWeek: (date) => {
    switch (date.getDay()) {
      case 1:
      case 2:
      case 4:
        return 'Минулого __WEEKDAY__ ';
      default:
        return 'Минулої __WEEKDAY__';
    }
  },
  nextWeek: '__WEEKDAY__',
  sameYear: '__DATE_NO_YEAR__',
  else: '__DATE_WITH_YEAR__',
} satisfies RelativeFormatConfig;
