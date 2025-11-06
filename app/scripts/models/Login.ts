// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import type { TrelloModelAttributes } from 'app/scripts/models/internal/TrelloModel';
import { TrelloModel } from 'app/scripts/models/internal/TrelloModel';

interface LoginAttributes extends TrelloModelAttributes {
  typeName: 'Login';
}

class Login extends TrelloModel<LoginAttributes> {
  static initClass() {
    this.prototype.typeName = 'Login';
  }
}
Login.initClass();

export { Login };
