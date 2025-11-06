// eslint-disable-next-line no-restricted-imports
import Bluebird from 'bluebird';
import type { PropsWithChildren, ReactElement } from 'react';

import { ComponentWrapper, renderReactRoot } from '@trello/component-wrapper';

import { ModelLoader } from 'app/scripts/db/model-loader';
import { getSpinner } from 'app/src/getSpinner';

/**
 * Renders a top-level component, suitable for rendering an entire page of
 * React content from a Controller method.
 *
 * - Any previous top-level view (either React or Backbone) will be safely
 *   disposed of first.
 * - You can provide an optional `loader` Promise that will cause the spinner
 *   to continue showing while any async tasks (data fetching, etc.) are
 *   completed.
 *
 * @param component The React component to be rendered
 * @param loader An optional Promise to wait for while showing the spinner
 * @returns A promise that resolves after the component has been rendered
 *
 * @example
 * import { renderTopLevelComponent } from 'app/scripts/controller/renderTopLevelComponent'
 * // Add a route handler
 * routes: [
 *   '/some-path', 'someRouteHandler'
 * ],
 *
 * someRouteHandler() {
 *   // Render a top-level React tree!
 *   renderTopLevelComponent(<SomeComponent />);
 *
 *   // If you need to show the spinner while some additional work happens,
 *   // pass a Promise that resolves when the async work is done
 *   renderTopLevelComponent(<SomeComponent />, new Promise((resolve, reject) => {
 *     // Let's pretend this is data fetching
 *     setTimeout(resolve, 2000);
 *   });
 * }
 */
export const renderTopLevelComponent = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: TPLAT-7303 Create more specific type
  component: ReactElement<PropsWithChildren<any>>,
  loader = Bluebird.resolve(),
) => {
  return new Bluebird((resolve, reject) => {
    Bluebird.using(getSpinner(), () => {
      return Bluebird.all([ModelLoader.await('headerData'), loader])
        .catch(reject)
        .then(() => {
          try {
            renderReactRoot(
              <ComponentWrapper>{component}</ComponentWrapper>,
              document.getElementById('content'),
              false,
              'top-level-component',
            );
          } catch (e) {
            return reject(e);
          }
          resolve();
        });
    });
  });
};
