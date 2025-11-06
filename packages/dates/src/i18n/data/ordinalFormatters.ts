type OrdinalFormatter = (num: number) => string;

const englishOrdinalFormatter = (num: number) => {
  let suffix = 'th';
  const moduloTen = num % 10;
  const moduleHundred = num % 100;
  if (moduloTen === 1 && moduleHundred !== 11) {
    suffix = 'st';
  } else if (moduloTen === 2 && moduleHundred !== 12) {
    suffix = 'nd';
  }
  if (moduloTen === 3 && moduleHundred !== 13) {
    suffix = 'rd';
  }
  return `${num}${suffix}`;
};

export const defaultOrdinalFormatter = (num: number) => `${num}.`;
export const ordinalFormatters: Record<string, OrdinalFormatter> = {
  cs: defaultOrdinalFormatter,
  de: defaultOrdinalFormatter,
  'en-AU': englishOrdinalFormatter,
  'en-GB': englishOrdinalFormatter,
  'en-US': englishOrdinalFormatter,
  es: (num) => `${num}º`,
  fi: defaultOrdinalFormatter,
  fr: (num) => `${num}${num === 1 ? 'er' : ''}`,
  'fr-CA': (num) => `${num}${num === 1 ? 'er' : ''}`,
  hu: defaultOrdinalFormatter,
  it: (num) => `${num}º`,
  ja: (num) => `${num}`,
  nb: defaultOrdinalFormatter,
  nl: (num) => `${num}${num === 1 || num === 8 || num >= 20 ? 'ste' : 'de'}`,
  pl: defaultOrdinalFormatter,
  'pt-BR': (num) => `${num}º`,
  ru: (num) => `${num}-го`,
  sv: (num) => {
    const b = num % 10;
    const output =
      ~~((num % 100) / 10) === 1
        ? 'e'
        : b === 1
          ? 'a'
          : b === 2
            ? 'a'
            : b === 3
              ? 'e'
              : 'e';

    return `${num}${output}`;
  },
  th: (num) => `${num}`,
  tr: (num) => {
    const suffixes: Record<number, string> = {
      1: "'inci",
      5: "'inci",
      8: "'inci",
      70: "'inci",
      80: "'inci",
      2: "'nci",
      7: "'nci",
      20: "'nci",
      50: "'nci",
      3: "'üncü",
      4: "'üncü",
      100: "'üncü",
      6: "'ncı",
      9: "'uncu",
      10: "'uncu",
      30: "'uncu",
      60: "'ıncı",
      90: "'ıncı",
    };
    const a = num % 10;
    const b = (num % 100) - a;
    const c = num >= 100 ? 100 : 0;

    return `${num}${suffixes[a] ?? suffixes[b] ?? suffixes[c]}`;
  },
  uk: (num) => `${num}-го`,
  vi: (num) => `${num}`,
  'zh-Hans': (num) => `${num}日`,
  'zh-Hant': (num) => `${num}日`,
};
