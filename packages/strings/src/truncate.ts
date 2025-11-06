interface TruncateOptions {
  ellipsis?: string;
  /**
   * In order to avoid truncating Unicode characters outside of the
   * Basic Multilingual Plane, we need to split the string into code points,
   * which combine things like emojis into a single code point.
   * @default false
   */
  splitByCodePoint?: boolean;
}

export const truncate = (
  text: string,
  maxLength: number,
  { ellipsis = '…', splitByCodePoint = false }: TruncateOptions = {},
) => {
  if (text.length > maxLength) {
    const truncateIndices = [0, maxLength - ellipsis.length + 1] as const;
    const truncatedText = splitByCodePoint
      ? [...text].slice(...truncateIndices).join('')
      : text.substr(...truncateIndices);
    return truncatedText.replace(/\s+\S*$/, '') + ellipsis;
  }

  return text;
};
