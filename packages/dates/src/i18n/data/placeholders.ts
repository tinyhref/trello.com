/**
 * Placeholders for date formats, by locale.
 */
export const datePlaceholders: Record<string, string> = {
  cs: 'D. M. RRRR',
  de: 'T.M.JJJJ',
  'en-AU': 'D/M/YYYY',
  'en-GB': 'D/M/YYYY',
  'en-US': 'M/D/YYYY',
  es: 'D/M/AAAA',
  fi: 'P.K.VVVV',
  fr: 'J/M/AAAA',
  'fr-CA': 'M/J/AAAA',
  hu: 'ÉÉÉÉ. H. N.',
  it: 'G/M/AAAA',
  ja: '年/月/日',
  nb: 'D.M.ÅÅÅÅ',
  nl: 'D-M-JJJJ',
  pl: 'D.M.RRRR',
  pt: 'D/M/AAAA',
  'pt-BR': 'D/M/AAAA',
  ru: 'Д.М.ГГГГ',
  sv: 'ÅÅÅÅ-M-D',
  th: 'ว/ด/ปปปป',
  tr: 'G.A.YYYY',
  uk: 'Д.М.РРРР',
  vi: 'N/T/NNNN',
  zh: 'YYYY-MM-DD', // TODO https://trello.atlassian.net/browse/PANO-2026
  'zh-Hans': 'YYYY/M/D',
  'zh-Hant': 'YYYY年M月D日', // TODO https://trello.atlassian.net/browse/PANO-2026
};
export const defaultDatePlaceholder = 'M/D/YYYY';

/**
 * Placeholders for time formats, by locale.
 */
export const timePlaceholders: Record<string, string> = {
  cs: 'H:mm',
  de: 'H:mm', // 'h:mm' or 'S:mm'? TODO https://trello.atlassian.net/browse/PANO-2026
  'en-AU': 'H:mm',
  'en-GB': 'H:mm',
  'en-US': 'h:mm a',
  es: 'H:mm',
  fi: 'T.mm',
  fr: 'H:mm',
  'fr-CA': 'h:mm a',
  hu: 'Ó:pp',
  it: 'H:mm',
  ja: '午:前', // '午:前', or 'H:mm'? TODO https://trello.atlassian.net/browse/PANO-2026
  nb: 'T:mm',
  nl: 'U:mm',
  pl: 'G:mm',
  pt: 'H:mm',
  'pt-BR': 'H:mm',
  ru: 'Ч:мм',
  sv: 'H:mm', // 'H:mm', or 'T:mm'? TODO https://trello.atlassian.net/browse/PANO-2026
  th: 'H นาฬิกา m นาที', // 'นาฬิกา นาที'? TODO https://trello.atlassian.net/browse/PANO-2026
  tr: 'S:dd',
  uk: 'Г:хв',
  vi: 'G:pp',
  zh: 'Ah点mm分', // TODO https://trello.atlassian.net/browse/PANO-2026
  'zh-Hans': 'Ah点mm分', // TODO https://trello.atlassian.net/browse/PANO-2026
  'zh-Hant': 'Ah點mm分', // TODO https://trello.atlassian.net/browse/PANO-2026
};
export const defaultTimePlaceholder = 'h:mm a';
