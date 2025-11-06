import { currentLocale } from '@trello/locale';

import { amPatterns, pmPatterns } from './data/dayPartPatterns';

/**
 * Given a time string and optionally a base date, and locale override, this function parses the input
 * into a data object with that time set on the base date.
 * @param timeString - The time string to parse
 * @param baseDate - The base date to set the time on (default is now)
 * @param locale - The locale to use for parsing (default is the user's current locale)
 * @returns A Date object if the string can be parsed, otherwise undefined
 */
export const parseLocalizedTime = (
  timeString: string,
  baseDate = new Date(),
  locale = currentLocale,
): Date | undefined => {
  // Clone the base date
  const parsedDate = new Date(baseDate);

  // Pull out just the numeric portion of the time string
  const numericPortionMatch = timeString.match(/(\d+[:.]?\d*)/);

  // If there's no numeric portion, return undefined
  if (!numericPortionMatch) {
    return;
  }
  const numericPortion = numericPortionMatch[1];

  // Regex to extract the hour and minute from the numeric portion.
  // Supports:
  // - 24-hour time (0-23)
  // - 12-hour time with AM/PM
  // - Optional colon or period separator
  const timeRegex = /^(2[0-3]|1[0-9]|0?[0-9]|[1-9])[:.]?([0-5][0-9])?$/i;

  // Get the numeric portions of the time
  const match = numericPortion.match(timeRegex);
  if (!match) {
    return;
  }
  let hour = parseInt(match[1], 10);

  // Determine if we need to adjust the hours for PM or midnight
  if (hour < 12 && pmPatterns[locale]?.test(timeString)) {
    hour += 12;
  } else if (hour === 12 && amPatterns[locale]?.test(timeString)) {
    hour = 0;
  }

  // If no minutes were specified, default to 0
  let minute = 0;
  if (match[2]) {
    minute = parseInt(match[2], 10);
  }

  // Apply time to the base date
  parsedDate.setHours(hour, minute, 0, 0);
  return parsedDate;
};
