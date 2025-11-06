/**
 * Extracted purely because Jest doesn't support JSDOM, so we'd like to mock it
 * in unit tests.
 */
export const setHeight = (textarea: HTMLTextAreaElement, height: number) => {
  textarea.style.height = `${height}px`;
};
