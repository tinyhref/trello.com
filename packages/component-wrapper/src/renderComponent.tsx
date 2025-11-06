import type { ReactNode } from 'react';

import { sendCrashEvent } from '@trello/error-reporting';
import ReactDOM from '@trello/react-dom-wrapper';

import { ComponentWrapper } from './ComponentWrapper';

export interface Disposer {
  (): void;
}

/**
 * @deprecated The `renderComponent` API renders in React 17 mode, which is no longer supported. Use `renderReactRoot` instead to render in React 18 mode.
 */
export const renderComponent = (
  children: ReactNode,
  container: DocumentFragment | Element | null,
): Disposer => {
  if (
    !container ||
    !(container instanceof Element || container instanceof DocumentFragment)
  ) {
    sendCrashEvent(
      new Error('Tried to mount component into undefined container'),
    );

    return () => {};
  }

  // eslint-disable-next-line @eslint-react/dom/no-render
  ReactDOM.render(<ComponentWrapper>{children}</ComponentWrapper>, container);

  return () => ReactDOM.unmountComponentAtNode(container);
};
