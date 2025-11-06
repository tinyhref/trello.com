// clone of jquery.contains
export const contains = <TElement extends Element>(
  el: TElement,
  child: TElement,
): boolean => {
  return el !== child && el?.contains(child);
};
