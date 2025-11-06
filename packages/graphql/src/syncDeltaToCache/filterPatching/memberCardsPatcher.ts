import type { Card, Member } from '../../generated';
import type { TypedPartialWithID } from '../../types';
import { GeneralizedFilterPatcher } from './generalizedFilterPatcher';
import type { MemberCardsPatcherQuery } from './MemberCardsPatcherQuery.generated';
import { MemberCardsPatcherDocument } from './MemberCardsPatcherQuery.generated';

export const memberCardsPatcher = new GeneralizedFilterPatcher<
  TypedPartialWithID<Card, 'Card'>,
  Member,
  MemberCardsPatcherQuery,
  string
>({
  parentTypeName: 'Member',
  modelTypeName: 'Card',
  filters: {
    open: {
      dataKey: 'cardsOpen',
      // single relations are not used right now
      addSingleRelationWhen: () => false,
      removeSingleRelationWhen: () => false,
      addMultiRelationWhen: (card, idMember, memberIds, previousMemberIds) =>
        !card.closed ||
        (memberIds.includes(idMember) && !previousMemberIds.includes(idMember)),
      removeMultiRelationWhen: (card, idMember, memberIds, previousMemberIds) =>
        !!card.closed ||
        (previousMemberIds.includes(idMember) && !memberIds.includes(idMember)),
    },
    closed: {
      dataKey: 'cardsClosed',
      // single relations are not used right now
      addSingleRelationWhen: () => false,
      removeSingleRelationWhen: () => false,
      addMultiRelationWhen: (card, idMember, memberIds, previousMemberIds) =>
        !!card.closed && memberIds.includes(idMember),
      removeMultiRelationWhen: (card, idMember, memberIds, previousMemberIds) =>
        !card.closed ||
        (!memberIds.includes(idMember) && previousMemberIds.includes(idMember)),
    },
    visible: {
      dataKey: 'cardsVisible',
      // single relations are not used right now
      addSingleRelationWhen: () => false,
      removeSingleRelationWhen: () => false,
      addMultiRelationWhen: (card, idMember, memberIds, previousMemberIds) =>
        !card.closed || memberIds.includes(idMember),
      removeMultiRelationWhen: (card, idMember, memberIds, previousMemberIds) =>
        !!card.closed || !memberIds.includes(idMember),
    },
    all: {
      dataKey: 'cards',
      // single relations are not used right now
      addSingleRelationWhen: () => false,
      removeSingleRelationWhen: () => false,
      addMultiRelationWhen: (card, id, memberIds, previousMemberIds) =>
        memberIds.includes(id) && !previousMemberIds.includes(id),
      removeMultiRelationWhen: (card, id, memberIds, previousMemberIds) =>
        !memberIds.includes(id) && previousMemberIds.includes(id),
    },
  },
  query: MemberCardsPatcherDocument,
});
