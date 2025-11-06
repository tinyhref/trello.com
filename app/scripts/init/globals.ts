// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { Auth } from 'app/scripts/db/Auth';

// @ts-expect-error TS(2339): Property 'getAuthorization' does not exist on type... Remove this comment to see the full error message
window.getAuthorization = () => ({ type: 'cookie', token: Auth.myToken() });
