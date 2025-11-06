import { BoardInvitation } from 'app/scripts/models/BoardInvitation';
import { InvitationList } from 'app/scripts/models/collections/InvitationList';

class BoardInvitationList extends InvitationList {
  // @ts-expect-error
  public model: typeof BoardInvitation;

  static initClass() {
    this.prototype.model = BoardInvitation;
  }
}
BoardInvitationList.initClass();

export { BoardInvitationList };
