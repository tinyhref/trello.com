// eslint-disable-next-line no-restricted-imports
import Bluebird from 'bluebird';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'prom... Remove this comment to see the full error message
import Queue from 'promise-queue';

Queue.configure(Bluebird);
