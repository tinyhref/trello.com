export const DRAG_SCROLL_ENABLED_ATTRIBUTE = 'data-drag-scroll-enabled';
export const DRAG_SCROLL_DISABLED_ATTRIBUTE = 'data-drag-scroll-disabled';

interface DragScrollOptions {
  // ignores the event handler if true is returned
  fxIgnore: (e: MouseEvent) => boolean;
}

const enableDragScroll = (
  domElement: HTMLElement,
  options: DragScrollOptions,
): (() => void) => {
  if (domElement.getAttribute(DRAG_SCROLL_ENABLED_ATTRIBUTE) !== null) {
    return () => {};
  }

  const offset = { x: 0, y: 0 };
  const startPos = { x: 0, y: 0 };

  const onMouseMove = (e: MouseEvent) => {
    domElement.scrollLeft = offset.x + startPos.x - e.clientX;
    domElement.scrollTop = offset.y + startPos.y - e.clientY;

    return false;
  };

  const onMouseUp = (e: MouseEvent) => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    return false;
  };

  const onMouseDown = (e: MouseEvent) => {
    if (e.button !== 0 || options?.fxIgnore(e)) return;

    startPos.x = e.clientX;
    startPos.y = e.clientY;
    offset.x = domElement.scrollLeft;
    offset.y = domElement.scrollTop;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return false;
  };

  domElement.setAttribute(DRAG_SCROLL_ENABLED_ATTRIBUTE, 'true');
  domElement.addEventListener('mousedown', onMouseDown);

  return () => {
    domElement.removeEventListener('mousedown', onMouseDown);
    domElement.removeAttribute(DRAG_SCROLL_ENABLED_ATTRIBUTE);
  };
};

export { enableDragScroll };
