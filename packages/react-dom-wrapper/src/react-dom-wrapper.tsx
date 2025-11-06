import type { ReactElement } from 'react';
import { StrictMode } from 'react';
// eslint-disable-next-line no-restricted-imports
import ReactDOM from 'react-dom';

/**
 * Use localStorage switch to flip which React rendering
 * mode to use.
 */
export const render = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: TPLAT-7303 Create more specific type
  Component: ReactElement<any>,
  element: DocumentFragment | Element,
  callback?: () => undefined | void,
) => {
  /**
   * Render the component tree wrapped in <StrictMode> so that
   * React prints any usages of deprecated APIs to the console
   * when in dev mode
   */
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.DISABLE_STRICT_MODE !== 'true'
  ) {
    // eslint-disable-next-line @eslint-react/dom/no-render-return-value, @eslint-react/dom/no-render -- Slated for removal with FY26Q1 modernizations
    return ReactDOM.render(
      <StrictMode>{Component}</StrictMode>,
      element,
      callback,
    );
  }
  /**
   * Render in regular mode
   */
  // eslint-disable-next-line @eslint-react/dom/no-render-return-value, @eslint-react/dom/no-render -- Slated for removal with FY26Q1 modernizations
  return ReactDOM.render(Component, element, callback);
};

export const unmountComponentAtNode = (
  element: DocumentFragment | Element,
): boolean => {
  return ReactDOM.unmountComponentAtNode(element);
};
