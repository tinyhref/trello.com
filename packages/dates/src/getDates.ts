import { differenceInDays, isSameDay } from 'date-fns';

export const isDateToday = (date: Date) => isSameDay(date, Date.now());

export const idToDate = (id?: string): Date =>
  new Date(1000 * parseInt(id ? id.substr(0, 8) : '', 16));

export const getElapsedDaysFromId = (id: string): number => {
  const then = idToDate(id);
  const now = Date.now();

  return differenceInDays(now, then);
};

export const dateToId = (date: Date) =>
  Math.floor(date.getTime() / 1000).toString(16) + '0000000000000000';

export const getDateWithAddedHours = (date: Date | string, hours: number) => {
  const currentDate = new Date(date);
  currentDate.setHours(currentDate.getHours() + hours);
  return currentDate;
};

export const getDateWithAddedDays = (date: Date | string, days: number) => {
  const currentDate = new Date(date);
  currentDate.setDate(currentDate.getDate() + days);
  return currentDate;
};

export const getDateWithAddedWeeks = (date: Date | string, weeks: number) => {
  const currentDate = new Date(date);
  currentDate.setDate(currentDate.getDate() + weeks * 7);
  return currentDate;
};

export const getDateWithAddedMonths = (date: Date | string, months: number) => {
  const currentDate = new Date(date);
  currentDate.setMonth(currentDate.getMonth() + months);
  return currentDate;
};
