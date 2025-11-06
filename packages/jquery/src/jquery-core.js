// eslint-disable-next-line no-restricted-imports
import $ from 'jquery';

import { throttleOnAnimationFrame } from '@trello/time';

import { addAutosizePlugin } from './jquery.autosize.ts';

$.extend({ throttleOnAnimationFrame });

addAutosizePlugin($);

window.jQuery = $;
window.$ = $;

export default $;
