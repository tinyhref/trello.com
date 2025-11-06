import memoizeOne from 'memoize-one';

import { getPreloadsFromPath } from './getPreloadsFromPath';

// for now, we want to get the initial preloads upon rendering and not on transition
const pathnameOnLoad = window?.location?.pathname;
const searchOnLoad = window?.location?.search;
const cookiesOnLoad = window?.document?.cookie;

// Note that we use memoization here because this function gets used a lot in the useQuickload hook.
// By memoizing it, we save lots of computation for regexp's and other internal checks within this function.
export const getPreloadsFromInitialPath = memoizeOne(() =>
  getPreloadsFromPath(pathnameOnLoad, searchOnLoad, cookiesOnLoad),
);
