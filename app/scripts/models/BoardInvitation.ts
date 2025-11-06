import { Invitation } from 'app/scripts/models/Invitation';

class BoardInvitation extends Invitation {
  static initClass() {
    this.prototype.typeName = 'BoardInvitation';
  }
}
BoardInvitation.initClass();

export { BoardInvitation };
