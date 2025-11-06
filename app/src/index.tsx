// Ensure that dynamically loaded modules use the CSP nonce by assigning
// the generated nonce to the __webpack_nonce__ global before other imports.
import './bootstrap-nonce';
// Polyfills
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'intersection-observer';
import 'whatwg-fetch';
import 'core-js/full/array/flat-map'; // https://babeljs.io/docs/en/v7-migration#remove-proposal-polyfills-in-babel-polyfill-https-githubcom-babel-babel-issues-8416
import '@trello/history-events';

import { hasResizeObserver, StubResizeObserver } from '@trello/browser';
import { startSession } from '@trello/error-reporting';
import type { TrelloWindow } from '@trello/window-types';

import { initializeModelFactory } from 'app/scripts/db/initializeModelFactory';
import { initializeSentry } from './initializeSentry';

declare const window: TrelloWindow;

if (process.env.NODE_ENV === 'production') {
  initializeSentry();
}
startSession();

// Install the window.onerror trap as early as possible, as this is what
// propagates to the crash reporting
import 'app/scripts/init/error-logger';

// Model registration - by registering the model classes in a factory it allows us to avoid circular dependencies. It is
// important that this happens early, but after error reporting is setup.
initializeModelFactory();

import 'app/scripts/init';
// Extend jQuery with the format and formatHtml methods
import 'app/scripts/lib/jquery-localize';

import {
  initializeStaleEventTimer,
  sendReloadedToUpdateEvent,
} from '@trello/client-updater';
import { renderReactRoot } from '@trello/component-wrapper';
import { Cookies } from '@trello/cookies';
import { TrelloStorage } from '@trello/storage';

import { handleStorageError } from 'app/scripts/init/handleStorageError';
import { App } from 'app/src/components/App';
import { generateSupportDebugData } from 'app/src/generateSupportDebugData';
import { registerLegacyRouterMiddleware } from './registerLegacyRouterMiddleware';
import { initializeUFOWrapper } from '@trello/ufo';
import { getRouteFromPathname, routerState } from '@trello/router';
import { injectArbitraryPlatformGateOverrides } from '@trello/feature-gate-client';

async function _startTrello() {
  registerLegacyRouterMiddleware();

  if (!hasResizeObserver()) {
    // @ts-expect-error
    // Stub ResizeObserver when it isn't available to avoid throwing exceptions in old browsers.
    // Users in this scenario will see the "unsupported browser" banner.
    window.ResizeObserver = StubResizeObserver;
  }

  window.__TRELLO_SUPPORT = generateSupportDebugData;

  TrelloStorage.addErrorListener(handleStorageError);

  // We'll no longer be setting the locale at build time, so set the lang global attribute
  // dynamically at runtime.
  document.documentElement.setAttribute('lang', window.locale);

  // Add a top-level class that enables some new styles (defined at the end of "app/stylesheets/core.less") to highlight
  // potentially unsafe bidi characters
  document.body.classList.add('feplat3731');
  Cookies.initialize();

  // Initialize UFOv2, and setup a listener to trigger UFO route changes
  const triggerUfoRouteChange = initializeUFOWrapper(
    getRouteFromPathname(window.location.pathname).id,
  );
  routerState.subscribe((state) => {
    if (state.id) {
      triggerUfoRouteChange(state.id);
    }
  });

  // Initialize platform-level feature gate override manager
  injectArbitraryPlatformGateOverrides();

  renderReactRoot(
    <App />,
    document.getElementById('chrome-container')!,
    false,
    null,
  );

  // If we are loading now as the result of a reload to pick up a new version,
  // send an operational event
  sendReloadedToUpdateEvent();

  // set up the timer that will send an event after 96 hours without a reload
  initializeStaleEventTimer();
}

export const startTrello = (window.startTrello = _startTrello);
