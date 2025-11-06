export const calendarOverrides: Record<
  string,
  Intl.DateTimeFormatOptions['calendar']
> = {
  th: 'gregory',
};

export const defaultCalendar: Intl.DateTimeFormatOptions['calendar'] =
  'gregory';
