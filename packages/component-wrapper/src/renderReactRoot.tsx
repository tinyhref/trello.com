import type { ReactNode } from 'react';
import { StrictMode } from 'react';
import type { Root } from 'react-dom/client';
import { createRoot } from 'react-dom/client';

import { sendCrashEvent } from '@trello/error-reporting';
import { UFOSegment } from '@trello/ufo';

const getCurrentStack = () => {
  try {
    throw new Error('Stack trace');
  } catch (e) {
    //Explicitly ignore the error we're about to throw
    const stack = (e as Error).stack ?? '';
    const regex = /^\s*at\s([^ ]*) \(.*/gm;
    const stackTrace: string[] = [];
    let m;
    while ((m = regex.exec(stack)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      if (m.length > 1) {
        stackTrace.push(m[1]);
      }
    }
    if (stackTrace[2] !== 'tryCatcher') {
      return stackTrace[2];
    }
  }
  return 'Unknown';
};

export interface Disposer {
  (): void;
}
interface RenderResult {
  root: Root | null;
  unmount: Disposer;
}

const existingReactRoots: WeakMap<DocumentFragment | Element, Root> =
  new WeakMap();

/**
 * Wraps the provided children in React StrictMode if enabled.
 * This function allows us to conditionally apply StrictMode for incremental migration.
 * The goal is to eventually remove this function and always enable StrictMode.
 *
 * @param children - The ReactNode to be rendered.
 * @param enableStrictMode - Boolean flag to enable or disable StrictMode wrapping.
 * @returns The potentially wrapped ReactNode.
 */
const withOptionalStrictMode = (
  children: ReactNode,
  enableStrictMode: boolean,
): ReactNode => {
  return enableStrictMode && process.env.DISABLE_STRICT_MODE !== 'true' ? (
    <StrictMode>{children}</StrictMode>
  ) : (
    children
  );
};

export const renderReactRoot = (
  children: ReactNode,
  container: DocumentFragment | Element | null,
  enableStrictMode: boolean = false,
  rootName: string | null = '',
): RenderResult => {
  if (
    !container ||
    !(container instanceof Element || container instanceof DocumentFragment)
  ) {
    sendCrashEvent(
      new Error('Tried to mount component into undefined container'),
    );

    return { root: null, unmount: () => {} };
  }

  const caller = getCurrentStack();

  /*
    NOTE: This is a workaround to add more safety to the legacy backbone code by re-using existing react roots if one
    has already been created for the container— but it creates an opportunity for a memory leak if the underlying DOM
    element is discarded without the root being unmounted via the method below. The weakmap should automatically remove
    roots when the pointer for the DOM element is removed.

    This can be removed when we fully make the switch to react components from backbone views.
  */
  let root = existingReactRoots.get(container);
  if (!root) {
    root = createRoot(container);
    existingReactRoots.set(container, root);
  }

  /*
  NOTE: This component should NEVER include things like <TrelloIntlProvider> or <ApolloProvider>. DO NOT ADD THEM HERE!
  Instead, they should be added at the time `renderReactRoot` is called:
  renderReactRoot(
    <TrelloIntlProvider>
      <ApolloProvider>
        <MyCustomComponent />
      </ApolloProvider>
    </TrelloIntlProvider>,
    mountPoint
  );
  */
  root.render(
    rootName !== null ? (
      <UFOSegment
        name={`secondary-root-${rootName.length > 0 ? rootName : caller}`}
        isSecondaryRoot={true}
      >
        {withOptionalStrictMode(children, enableStrictMode)}
      </UFOSegment>
    ) : (
      withOptionalStrictMode(children, enableStrictMode)
    ),
  );

  // Overriding the unmount method to ensure it is removed from the map cache after being unmounted.
  const newRoot: Root = {
    ...root,
    unmount: () => {
      try {
        root?.unmount();
      } catch (e) {
        /*
          Swallowing this error in cases where a stale root is still in the cache, but the DOM no longer exists. This
          should be removed in a later commit with more specific error filtering.
          */
      } finally {
        existingReactRoots.delete(container);
      }
    },
  };

  return {
    root: newRoot,
    unmount: newRoot.unmount,
  };
};

/**
 * Unmounts a React component at the specified container node and cleans up the associated React root.
 * This function is provided primarily for backward compatibility and should be used with caution.
 *
 * @param container The DOM element or DocumentFragment from which to unmount the React component.
 * @returns True if the component was successfully unmounted; false otherwise.
 *
 * @deprecated This function is deprecated and only introduced for backward compatibility.
 * Please use `renderReactRoot`'s provided `unmount` function instead, which is more efficient and reliable.
 */
export const unmountComponentAtNode = (
  container: DocumentFragment | Element,
): boolean => {
  const root: Root | undefined = existingReactRoots.get(container);
  if (root) {
    root.unmount();
    existingReactRoots.delete(container);
    return true;
  }
  return false;
};

/**
 * An asynchronous wrapper around `renderReactRoot` designed to address issues with rendering React components in a
 * Backbone and jQuery environment. This function waits for the specified container to have its child elements updated
 * before resolving the promise, ensuring that certain DOM elements are present before React components are considered
 * fully rendered. This is crucial for cases where Backbone or jQuery manipulates the DOM outside of React, causing
 * rendering issues.
 *
 * @param children - The ReactNode to be rendered.
 * @param container - The DOM element or DocumentFragment in which to render the ReactNode.
 * @param enableStrictMode - Boolean flag to enable or disable StrictMode wrapping.
 * @param targetClass - The class name to look for in the added nodes to resolve the promise.
 * @returns A promise that resolves with the RenderResult when the DOM mutation is detected.
 */
export const renderReactRootAsync = (
  children: ReactNode,
  container: DocumentFragment | Element | null,
  targetClass: string,
  enableStrictMode: boolean = true,
  rootName: string | null = '',
): Promise<RenderResult> => {
  return new Promise((resolve, reject) => {
    if (!container) {
      reject(new Error('Container is null'));
      return;
    }

    const result = renderReactRoot(
      children,
      container,
      enableStrictMode,
      rootName,
    );
    if (!result.root) {
      reject(new Error('Failed to render React root'));
      return;
    }

    const observer = new MutationObserver(() => {
      // eslint-disable-next-line @trello/no-query-selector
      if (container.querySelector(`.${targetClass}`)) {
        observer.disconnect();
        resolve(result);
      }
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
    });
  });
};
