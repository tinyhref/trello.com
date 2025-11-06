import { createFragmentRegistry } from '@apollo/client/cache';

import { TrelloActionAttachmentEntityFieldsFragmentDoc } from './actions/TrelloActionAttachmentEntityFragment.generated';
import { TrelloActionBoardEntityFieldsFragmentDoc } from './actions/TrelloActionBoardEntityFragment.generated';
import { TrelloActionCardEntityFieldsFragmentDoc } from './actions/TrelloActionCardEntityFragment.generated';
import { TrelloActionChecklistEntityFieldsFragmentDoc } from './actions/TrelloActionChecklistEntityFragment.generated';
import { TrelloActionCommentEntityFieldsFragmentDoc } from './actions/TrelloActionCommentEntityFragment.generated';
import { TrelloActionListEntityFieldsFragmentDoc } from './actions/TrelloActionListEntityFragment.generated';
import { TrelloActionMemberEntityFieldsFragmentDoc } from './actions/TrelloActionMemberEntityFragment.generated';
import { TrelloAddAttachmentToCardActionFieldsFragmentDoc } from './actions/TrelloAddAttachmentToCardActionFragment.generated';
import { TrelloAddChecklistToCardActionFieldsFragmentDoc } from './actions/TrelloAddChecklistToCardActionFragment.generated';
import { TrelloAddMemberToCardActionFieldsFragmentDoc } from './actions/TrelloAddMemberToCardActionFragment.generated';
import { TrelloCardActionsFieldsFragmentDoc } from './actions/TrelloCardActionsFragment.generated';
import { TrelloCommentCardActionFieldsFragmentDoc } from './actions/TrelloCommentCardActionFragment.generated';
import { TrelloCopyCardActionFieldsFragmentDoc } from './actions/TrelloCopyCardActionFragment.generated';
import { TrelloCopyCommentCardActionFieldsFragmentDoc } from './actions/TrelloCopyCommentCardActionFragment.generated';
import { TrelloCopyInboxCardActionFieldsFragmentDoc } from './actions/TrelloCopyInboxCardActionFragment.generated';
import {
  TrelloCardActionDataFieldsFragmentDoc,
  TrelloCoreActionFieldsFragmentDoc,
} from './actions/TrelloCoreActionFieldsFragment.generated';
import { TrelloCreateCardActionFieldsFragmentDoc } from './actions/TrelloCreateCardActionFragment.generated';
import { TrelloCreateCardFromCheckItemActionFieldsFragmentDoc } from './actions/TrelloCreateCardFromCheckItemActionFragment.generated';
import { TrelloCreateCardFromEmailActionFieldsFragmentDoc } from './actions/TrelloCreateCardFromEmailActionFragment.generated';
import { TrelloCreateInboxCardActionFieldsFragmentDoc } from './actions/TrelloCreateInboxCardActionFragment.generated';
import { TrelloDeleteAttachmentFromCardActionFieldsFragmentDoc } from './actions/TrelloDeleteAttachmentFromCardActionFragment.generated';
import { TrelloMoveCardActionFieldsFragmentDoc } from './actions/TrelloMoveCardActionFragment.generated';
import { TrelloMoveCardToBoardActionFieldsFragmentDoc } from './actions/TrelloMoveCardToBoardActionFragment.generated';
import { TrelloMoveInboxCardToBoardActionFieldsFragmentDoc } from './actions/TrelloMoveInboxCardToBoardActionFragment.generated';
import { TrelloRemoveChecklistFromCardActionFieldsFragmentDoc } from './actions/TrelloRemoveChecklistFromCardActionFragment.generated';
import { TrelloRemoveMemberFromCardActionFieldsFragmentDoc } from './actions/TrelloRemoveMemberFromCardActionFragment.generated';
import { TrelloUpdateCardClosedActionFieldsFragmentDoc } from './actions/TrelloUpdateCardClosedActionFragment.generated';
import { TrelloUpdateCardCompleteActionFieldsFragmentDoc } from './actions/TrelloUpdateCardCompleteActionFragment.generated';
import { TrelloUpdateCardDueActionFieldsFragmentDoc } from './actions/TrelloUpdateCardDueActionFragment.generated';
import { TrelloUpdateCheckItemStateOnCardActionFieldsFragmentDoc } from './actions/TrelloUpdateCheckItemStateOnCardActionFragment.generated';
import { TrelloUpdateCustomFieldItemActionFieldsFragmentDoc } from './actions/TrelloUpdateCustomFieldItemActionFragment.generated';
import { BoardListsContextCardFragmentDoc } from './BoardListsContextCardFragment.generated';
import { BoardListsContextListFragmentDoc } from './BoardListsContextListFragment.generated';
import { CheckItemFullFragmentDoc } from './CheckItemFullFragment.generated';
import { CurrentBoardFullCardFragmentDoc } from './CurrentBoardFullCardFragment.generated';
import { CurrentBoardFullListFragmentDoc } from './CurrentBoardFullListFragment.generated';
import { EnabledCalendarsFieldsFragmentDoc } from './EnabledCalendarsFieldsFragment.generated';
import { EventsFieldsFragmentDoc } from './EventsFieldsFragment.generated';
import { PlannerCardFrontFieldsFragmentDoc } from './PlannerCardFrontFieldsFragment.generated';
import { ProviderCalendarFieldsFragmentDoc } from './ProviderCalendarFieldsFragment.generated';
import { TrelloAllCardBadgesFragmentDoc } from './TrelloAllCardBadgesFragment.generated';
import { TrelloCardUpdatedSubscriptionCardFragmentDoc } from './TrelloCardUpdatedSubscriptionCardFragment.generated';
import { TrelloMirrorCardSubscriptionCardFragmentDoc } from './TrelloMirrorCardSubscriptionCardFragment.generated';

export const fragmentRegistry = createFragmentRegistry(
  BoardListsContextCardFragmentDoc,
  BoardListsContextListFragmentDoc,
  CheckItemFullFragmentDoc,
  CurrentBoardFullCardFragmentDoc,
  CurrentBoardFullListFragmentDoc,
  EnabledCalendarsFieldsFragmentDoc,
  EventsFieldsFragmentDoc,
  PlannerCardFrontFieldsFragmentDoc,
  ProviderCalendarFieldsFragmentDoc,
  TrelloCardUpdatedSubscriptionCardFragmentDoc,
  TrelloMirrorCardSubscriptionCardFragmentDoc,
  TrelloAllCardBadgesFragmentDoc,
  // Action fragments
  TrelloActionAttachmentEntityFieldsFragmentDoc,
  TrelloActionBoardEntityFieldsFragmentDoc,
  TrelloActionCardEntityFieldsFragmentDoc,
  TrelloActionChecklistEntityFieldsFragmentDoc,
  TrelloActionCommentEntityFieldsFragmentDoc,
  TrelloActionListEntityFieldsFragmentDoc,
  TrelloActionMemberEntityFieldsFragmentDoc,
  TrelloCardActionsFieldsFragmentDoc,
  TrelloCardActionDataFieldsFragmentDoc,
  TrelloCoreActionFieldsFragmentDoc,
  TrelloAddAttachmentToCardActionFieldsFragmentDoc,
  TrelloAddChecklistToCardActionFieldsFragmentDoc,
  TrelloAddMemberToCardActionFieldsFragmentDoc,
  TrelloCommentCardActionFieldsFragmentDoc,
  TrelloCopyCardActionFieldsFragmentDoc,
  TrelloCopyCommentCardActionFieldsFragmentDoc,
  TrelloCopyInboxCardActionFieldsFragmentDoc,
  TrelloCreateCardActionFieldsFragmentDoc,
  TrelloCreateCardFromCheckItemActionFieldsFragmentDoc,
  TrelloCreateCardFromEmailActionFieldsFragmentDoc,
  TrelloCreateInboxCardActionFieldsFragmentDoc,
  TrelloDeleteAttachmentFromCardActionFieldsFragmentDoc,
  TrelloMoveCardActionFieldsFragmentDoc,
  TrelloMoveCardToBoardActionFieldsFragmentDoc,
  TrelloMoveInboxCardToBoardActionFieldsFragmentDoc,
  TrelloRemoveChecklistFromCardActionFieldsFragmentDoc,
  TrelloRemoveMemberFromCardActionFieldsFragmentDoc,
  TrelloUpdateCardClosedActionFieldsFragmentDoc,
  TrelloUpdateCardCompleteActionFieldsFragmentDoc,
  TrelloUpdateCardDueActionFieldsFragmentDoc,
  TrelloUpdateCheckItemStateOnCardActionFieldsFragmentDoc,
  TrelloUpdateCustomFieldItemActionFieldsFragmentDoc,
);
