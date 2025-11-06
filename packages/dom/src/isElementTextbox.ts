const TEXTBOX_TAGS = ['INPUT', 'TEXTAREA'];

export const isElementTextbox = (element: Element | null): boolean => {
  if (!element) {
    return false;
  }

  if (TEXTBOX_TAGS.includes(element.tagName)) {
    return true;
  }

  return !!element.closest('[contenteditable]');
};
