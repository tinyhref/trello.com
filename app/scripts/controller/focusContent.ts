import _ from 'underscore';

/**
 * Focus the content, so it can immediately be scrolled
 * with the arrow keys.  The tabindex is necessary
 * to make the div focusable. This causes a style recalc/reflow
 * so deferring it via setTimeout
 */
export function focusContent() {
  return _.defer(() => {
    $('#content').attr('tabindex', '-1').focus();
  });
}
