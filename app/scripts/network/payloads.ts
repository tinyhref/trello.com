import _ from 'underscore';

import type { MappingRules } from 'app/scripts/db/db.types';
import { valueUnion } from 'app/scripts/network/valueUnion';

interface Model {
  id: string;
  set: (property: string, value: unknown) => void;
  get: (property: string) => unknown;
}

export const orgBoardsMapping = function (
  deltaBoards: [{ id: string }],
  model: Model,
) {
  const idBoards = _.pluck(deltaBoards, 'id');
  return model.set('idBoards', idBoards);
};

export const attachmentsUnion = function (
  deltaAttachments: { id: number | string }[],
  model: Model,
) {
  const currentAttachments =
    (model.get('attachments') as { id: number | string }[]) ?? [];
  const newAttachments = valueUnion(
    ({ id }: { id: number | string | null }) => id ?? '',
    currentAttachments,
    deltaAttachments,
  );
  return model.set('attachments', newAttachments);
};

export const membershipUnion = function (
  deltaMemberships: { id: number | string }[],
  model: Model,
) {
  const currentMemberships =
    (model.get('memberships') as { id: number | string }[]) ?? [];
  const newMemberships = valueUnion(
    ({ id }: { id: number | string }) => id,
    currentMemberships,
    deltaMemberships,
  );
  return model.set('memberships', newMemberships);
};

export interface PayloadQuery {
  query: object;
  operationName?: `payload:${keyof typeof Payloads}`;
  mappingRules?: MappingRules;
}

const boardFieldsMinimal = [
  'name',
  'closed',
  'dateLastActivity',
  'dateLastView',
  'datePluginDisable',
  'enterpriseOwned',
  'idOrganization',
  'nodeId',
  'prefs',
  'premiumFeatures',
  'shortLink',
  'shortUrl',
  'url',
  'creationMethod',
  'idEnterprise',
].join(',');

// Used for extremely large board fetches
// dateLastView is not on the board schema which forces us to read from the views collection
// omitting for perf reasons
const boardFieldsExtraMinimal = [
  'name',
  'closed',
  'dateLastActivity',
  'datePluginDisable',
  'enterpriseOwned',
  'idOrganization',
  'prefs',
  'premiumFeatures',
  'shortLink',
  'shortUrl',
  'url',
  'creationMethod',
  'idEnterprise',
].join(',');

const boardFieldsFull = [
  boardFieldsMinimal,
  'desc',
  'descData',
  'idTags',
  'labelNames',
  'limits',
  'memberships',
  'powerUps',
  'subscribed',
  'templateGallery',
].join(',');

const memberFields = [
  'activityBlocked',
  'avatarUrl',
  'bio',
  'bioData',
  'confirmed',
  'fullName',
  'idEnterprise',
  'idMemberReferrer',
  'initials',
  'memberType',
  'nonPublic',
  'nonPublicAvailable',
  'url',
  'username',
].join(',');

const memberFieldsAndPremOrgsAdmin = [memberFields, 'idPremOrgsAdmin'].join(
  ',',
);

const organizationFieldsMinimal = [
  'id',
  'name',
  'displayName',
  'offering',
  'products',
  'prefs',
  'premiumFeatures',
  'logoHash',
  'idEnterprise',
  'limits',
  'credits',
].join(',');

const organizationFieldsMinimalMemberships = [
  organizationFieldsMinimal,
  'memberships',
].join(',');

const cardFieldsBulk = [
  'badges',
  'cardRole',
  'closed',
  'dateLastActivity',
  'desc',
  'descData',
  'due',
  'dueComplete',
  'dueReminder',
  'idAttachmentCover',
  'idList',
  'idBoard',
  'idMembers',
  'idShort',
  'idLabels',
  'limits',
  'name',
  'pos',
  'pinned',
  'shortUrl',
  'shortLink',
  'subscribed',
  'url',
  'locationName',
  'address',
  'coordinates',
  'cover',
  'isTemplate',
  'start',
].join(',');

const boardFieldsInOrganization = [boardFieldsMinimal, 'idTags'].join(',');
const boardFieldsInLargeOrganization = [boardFieldsExtraMinimal, 'idTags'].join(
  ',',
);

const organizationBoardsFields = [
  organizationFieldsMinimalMemberships,
  'desc',
  'descData',
  'website',
  'billableCollaboratorCount',
].join(',');

const paidAccountFieldsMinimal = [
  'products',
  'standing',
  'billingDates',
  'expirationDates',
  'needsCreditCardUpdate',
  'dateFirstSubscription',
  'scheduledChange',
  'trialExpiration',
  'datePendingDisabled',
];

const paidAccountFieldsAll = [
  ...paidAccountFieldsMinimal,
  'invoiceDetails',
  'canRenew',
  'contactLocale',
  'contactEmail',
  'contactFullName',
  'cardLast4',
  'cardType',
  'ixSubscriber',
  'zip',
  'country',
  'taxId',
  'stateTaxId',
  'trialType',
  'previousSubscription',
  'paidProduct',
  'productOverride',
].join(',');

const currentBoardMinimal = {
  fields: boardFieldsFull,
  lists: 'open',
  list_fields:
    'name,closed,idBoard,pos,status,subscribed,limits,creationMethod,softLimit',
  cards: 'visible',
  card_fields: [cardFieldsBulk, 'labels'].join(','),
  card_attachments: 'cover',
  card_attachment_fields:
    'bytes,date,edgeColor,idMember,isUpload,mimeType,name,url',
  card_stickers: true,
  enterprise: true,
  enterprise_fields: 'displayName',
  members: 'all',
  member_fields: memberFieldsAndPremOrgsAdmin,
  memberships_orgMemberType: true,
  organization: true,
  organization_fields:
    'name,displayName,desc,descData,url,website,prefs,memberships,logoHash,offering,products,limits,idEnterprise,premiumFeatures',
  organization_tags: true,
  organization_enterprise: true,
  organization_pluginData: true,
  myPrefs: true,
  pluginData: true,
  boardPlugins: true,
};

const organizationBoardsPage = {
  boards: 'open',
  board_fields: boardFieldsInOrganization,
  board_starCounts: 'organization',
  board_membershipCounts: 'active',
  fields: organizationBoardsFields,
  paidAccount: true,
  paidAccount_fields: paidAccountFieldsAll,
  enterprise: true,
  memberships: 'active',
  members: 'all',
  tags: true,
};

const boardMinimalForDisplayCard = {
  lists: 'open',
  list_fields:
    'name,closed,idBoard,pos,status,subscribed,limits,creationMethod,softLimit',
  enterprise: true,
  enterprise_fields: 'displayName',
  members: 'all',
  member_fields: memberFields,
  memberships_orgMemberType: true,
  organization: true,
  organization_fields:
    'name,displayName,desc,descData,url,website,prefs,memberships,logoHash,offering,products,limits,idEnterprise',
  organization_tags: true,
  organization_enterprise: true,
  organization_disable_mock: true,
  myPrefs: true,
  fields: boardFieldsFull,
  labels: 'all',
  labels_limit: 1000,
};

const MINIMAL_MEMBERSHIPS = ['name', 'closed', 'memberships'].join(',');

// eslint-disable-next-line @trello/enforce-variable-case
const DefaultBoardFields = [
  'name',
  'desc',
  'descData',
  'closed',
  'idOrganization',
  'pinned',
  'url',
  'shortUrl',
  'prefs',
  'labelNames',
];

const cardActions = [
  'addAttachmentToCard',
  'addChecklistToCard',
  'addMemberToCard',
  'commentCard',
  'copyCommentCard',
  'convertToCardFromCheckItem',
  'createCard',
  'copyCard',
  'deleteAttachmentFromCard',
  'emailCard',
  'moveCardFromBoard',
  'moveCardToBoard',
  'removeChecklistFromCard',
  'removeMemberFromCard',
  'updateCard:idList',
  'updateCard:closed',
  'updateCard:due',
  'updateCard:dueComplete',
  'updateCheckItemStateOnCard',
  'updateCustomFieldItem',
].join(',');

const boardActions = [
  cardActions,
  'addMemberToBoard',
  'addToOrganizationBoard',
  'copyBoard',
  'createBoard',
  'createCustomField',
  'createList',
  'deleteCard',
  'deleteCustomField',
  'deleteList',
  'disablePlugin',
  'disablePowerUp',
  'enablePlugin',
  'enablePowerUp',
  'makeAdminOfBoard',
  'makeNormalMemberOfBoard',
  'makeObserverOfBoard',
  'moveListFromBoard',
  'moveListToBoard',
  'removeDeprecatedPlugin',
  'removeFromOrganizationBoard',
  'unconfirmedBoardInvitation',
  'unconfirmedOrganizationInvitation',
  'updateBoard',
  'updateCustomField',
  'updateList:closed',
].join(',');

// eslint-disable-next-line @trello/enforce-variable-case
const Payloads: {
  action: PayloadQuery;
  archivedLists: PayloadQuery;
  archivedListsAndCards: PayloadQuery;
  boardAttachment: PayloadQuery;
  boardCompleter: PayloadQuery;
  boardMinimal: PayloadQuery;
  cardAttachment: PayloadQuery;
  cardCompleter: PayloadQuery;
  cardCopy: PayloadQuery;
  cardDetails: PayloadQuery;
  cardMinimal: PayloadQuery;
  cardVoters: PayloadQuery;
  cardsAndListsMinimal: PayloadQuery;
  customFields: PayloadQuery;
  idCard: PayloadQuery;
  listMinimal: PayloadQuery;
  listsMinimal: PayloadQuery;
  memberActions: string;
  memberOrganizationDeactivatedMembers: PayloadQuery;
  orgMemberCards: PayloadQuery;
  organization: PayloadQuery;
  organizationFieldsMaximumAndAvailableLicenseCount: PayloadQuery;
  organizationFieldsMinimalWithAvailableLicenseCount: PayloadQuery;
  organizationMembers: PayloadQuery;
  organizationMembersBoards: PayloadQuery;
  organizationMembersCollaborators: PayloadQuery;
  organizationMembersMinimal: PayloadQuery;
  organizationMembersWithAvailableLicenseCount: PayloadQuery;
  organizationMinimal: PayloadQuery;
  organizationMinimalWithoutBoards: PayloadQuery;
  organizations: PayloadQuery;
  organizationsMinimal: PayloadQuery;
  listCards: PayloadQuery;
  enterprise: PayloadQuery;
  enterpriseMemberFields: string;
  enterpriseOrganizationFields: string;
  memberFields: string;
  organizationFieldsMinimal: string;
  paidAccountFieldsMinimal: string;
  cardActions: string;
  boardActions: string;
  organizationCredits: PayloadQuery;
  currentBoardMinimal: PayloadQuery;
  organizationBoardsPage: PayloadQuery;
  boardMinimalForDisplayCard: PayloadQuery;
  pendingOrganizations: { mappingRules: MappingRules };
  workspaceBoardsPage: PayloadQuery;
  card: PayloadQuery;
} = {
  memberFields,
  organizationFieldsMinimal,
  paidAccountFieldsMinimal: paidAccountFieldsMinimal.join(','),
  cardActions,
  boardActions,
  currentBoardMinimal: {
    query: currentBoardMinimal,
    operationName: 'payload:currentBoardMinimal',
    mappingRules: { attachments: attachmentsUnion },
  },
  organizationBoardsPage: {
    query: organizationBoardsPage,
    operationName: 'payload:organizationBoardsPage',
    mappingRules: { boards: orgBoardsMapping },
  },
  boardMinimalForDisplayCard: {
    query: boardMinimalForDisplayCard,
    operationName: 'payload:boardMinimalForDisplayCard',
  },
  memberActions: [boardActions, 'updateMember'].join(','),
  boardAttachment: {
    query: {
      structure: 'all',
      structure_limit: 5,
      fields: 'name,prefs,shortLink,url',
    },
    operationName: 'payload:boardAttachment',
  },
  enterpriseMemberFields: [
    'active',
    'activityBlocked',
    'avatarUrl',
    'confirmed',
    'enterpriseActiveOrgCount',
    'enterpriseDeactivatedOrgCount',
    'fullName',
    'initials',
    'memberType',
    'nonPublic',
    'roles',
    'userType',
    'username',
    'memberEmail',
    'dateLastAccessed',
  ].join(','),
  enterprise: {
    query: {
      fields:
        'displayName,name,prefs,offering,premiumFeatures,products,organizationPrefs,pluginWhitelistingEnabled,idPluginsAllowed,idp,logoHash,domains,isAtlassianOrg,atlOrgId,accessEnabled,additionToEnterpriseBatches,datePendingTrueUp,dateLastSelfServeAttempt,enterpriseARI',
    },
    operationName: 'payload:enterprise',
  },
  enterpriseOrganizationFields: [
    'name',
    'displayName',
    'logoHash',
    'memberships',
  ].join(','),
  boardMinimal: {
    query: {
      fields: boardFieldsMinimal,
      organization: true,
      organization_fields: organizationFieldsMinimal,
      myPermLevel: true,
      memberships: 'me',
    },
    operationName: 'payload:boardMinimal',
    mappingRules: {
      memberships: membershipUnion,
    },
  },
  boardCompleter: {
    query: {
      fields: 'closed,idOrganization,name,url',
    },
    operationName: 'payload:boardCompleter',
  },
  cardDetails: {
    query: {
      actions: cardActions,
      actions_display: true,
      action_memberCreator_fields: memberFieldsAndPremOrgsAdmin,
      action_reactions: true,
      members: true,
      member_fields: memberFields,
      attachments: true,
      fields: 'email',
      checklists: 'all',
      checklist_fields: 'all',
      list: true,
      pluginData: true,
      customFieldItems: true,
    },
    operationName: 'payload:cardDetails',
  },
  cardAttachment: {
    query: {
      board: true,
      members: true,
      member_fields: memberFields,
      attachments: true,
      fields: 'all',
      checklists: 'all',
      list: true,
      pluginData: true,
      customFields: true,
      customFieldItems: true,
    },
    operationName: 'payload:cardAttachment',
  },
  cardMinimal: {
    query: {
      fields: cardFieldsBulk,
    },
    operationName: 'payload:cardMinimal',
  },
  cardCompleter: {
    query: {
      fields: 'closed,idBoard,name,url',
      board: true,
      board_fields: 'name',
    },
    operationName: 'payload:cardCompleter',
  },
  cardVoters: {
    query: {
      fields: 'idMembersVoted',
      membersVoted: true,
    },
    operationName: 'payload:cardVoters',
  },
  cardCopy: {
    query: {
      members: true,
      member_fields: memberFields,
      attachments: true,
      stickers: true,
      fields: 'name',
      checklists: 'all',
    },
    operationName: 'payload:cardCopy',
  },
  customFields: {
    query: {
      fields: '',
      customFields: true,
      cards: 'visible',
      card_customFieldItems: true,
      card_fields: '',
    },
    operationName: 'payload:customFields',
  },
  orgMemberCards: {
    query: {
      board: true,
      list: true,
      fields:
        'badges,closed,dateLastActivity,due,dueComplete,idAttachmentCover,idList,idBoard,idMembers,idShort,labels,name,url',
      attachments: 'true',
      members: 'true',
      stickers: 'all',
      member_fields: memberFields,
      board_fields: MINIMAL_MEMBERSHIPS,
    },
    operationName: 'payload:orgMemberCards',
  },
  organization: {
    query: {
      enterprise: true,
      fields: 'all',
      members: 'all',
      member_fields: memberFields,
      paidAccount: true,
      paidAccount_fields: paidAccountFieldsAll,
    },
    operationName: 'payload:organization',
    mappingRules: {
      boards: orgBoardsMapping,
    },
  },
  organizationMembers: {
    query: {
      fields: [organizationBoardsFields, 'memberships'].join(','),
      members: 'all',
      member_fields: memberFields,
      member_activity: true,
      paidAccount: true,
      paidAccount_fields: paidAccountFieldsMinimal,
      enterprise: true,
      tags: true,
      accessRequests: true,
    },
    operationName: 'payload:organizationMembers',
  },
  organizationMembersWithAvailableLicenseCount: {
    query: {
      fields: [organizationBoardsFields, 'availableLicenseCount'].join(','),
      members: 'all',
      member_fields: memberFields,
      tags: true,
    },
    operationName: 'payload:organizationMembersWithAvailableLicenseCount',
  },
  organizationMembersBoards: {
    query: {
      fields: '',
      boards: 'open',
      board_fields: [MINIMAL_MEMBERSHIPS, 'idOrganization', 'prefs'].join(','),
    },
    operationName: 'payload:organizationMembersBoards',
    mappingRules: {
      boards: orgBoardsMapping,
    },
  },
  organizationMembersCollaborators: {
    query: {
      fields: '',
      collaborators: true,
    },
    operationName: 'payload:organizationMembersCollaborators',
  },
  organizationMembersMinimal: {
    query: {
      members: 'all',
      fields: [organizationFieldsMinimal, 'memberships'],
    },
    operationName: 'payload:organizationMembersMinimal',
  },
  organizationFieldsMinimalWithAvailableLicenseCount: {
    query: {
      members: 'all',
      fields: [
        [organizationFieldsMinimal, 'memberships'],
        'availableLicenseCount',
      ],
    },
    operationName: 'payload:organizationFieldsMinimalWithAvailableLicenseCount',
  },
  organizationFieldsMaximumAndAvailableLicenseCount: {
    query: {
      fields: ['availableLicenseCount', 'maximumLicenseCount'],
    },
    operationName: 'payload:organizationFieldsMaximumAndAvailableLicenseCount',
  },
  organizationMinimal: {
    query: {
      fields: 'all',
      tags: true,
    },
    operationName: 'payload:organizationMinimal',
  },
  organizationMinimalWithoutBoards: {
    query: {
      fields: organizationFieldsMinimalMemberships,
    },
    operationName: 'payload:organizationMinimalWithoutBoards',
  },
  organizations: {
    query: {
      organizations: 'all',
      organization_paidAccount: true,
      organization_paidAccount_fields: paidAccountFieldsMinimal,
    },
    operationName: 'payload:organizations',
  },
  organizationsMinimal: {
    query: {
      organizations: 'all',
      organization_fields: 'offering,products,memberships',
      fields: '',
    },
    operationName: 'payload:organizationsMinimal',
  },
  organizationCredits: {
    query: {
      credits: 'all',
      fields: 'id',
    },
    operationName: 'payload:organizationCredits',
  },
  idCard: {
    query: {
      fields: '',
      checkItemStates: false,
    },
    operationName: 'payload:idCard',
  },
  cardsAndListsMinimal: {
    query: {
      lists: 'open',
      list_fields: 'name,pos,idBoard,closed,limits,status',
      cards: 'visible',
      card_fields: 'idList,idBoard,pos,pinned,closed',
      fields: [...Array.from(DefaultBoardFields), 'limits'].join(','),
    },
    operationName: 'payload:cardsAndListsMinimal',
  },
  listsMinimal: {
    query: {
      lists: 'open',
      list_fields: 'name,pos,idBoard,closed,status',
      fields: 'limits',
    },
    operationName: 'payload:listsMinimal',
  },
  listMinimal: {
    query: {
      fields: 'name,pos,idBoard,closed,status',
    },
    operationName: 'payload:listMinimal',
  },
  archivedLists: {
    query: {
      fields: 'id',
      lists: 'closed',
      list_fields: 'name,pos,idBoard,closed,status',
    },
    operationName: 'payload:archivedLists',
  },
  archivedListsAndCards: {
    query: {
      lists: 'closed',
      list_fields: 'name,pos,idBoard,closed,status',
      cards: 'open',
      card_fields: 'idList,idBoard,badges,pos,closed',
    },
    operationName: 'payload:archivedListsAndCards',
  },
  listCards: {
    query: {
      cards: 'open',
      card_fields: 'idList,idBoard,badges,pos,pinned,closed,name',
    },
    operationName: 'payload:listCards',
  },
  action: {
    query: {
      display: true,
      memberCreator: true,
    },
    operationName: 'payload:action',
  },
  memberOrganizationDeactivatedMembers: {
    query: {
      fields: organizationFieldsMinimal,
      memberships: 'deactivated',
    },
    operationName: 'payload:memberOrganizationDeactivatedMembers',
    mappingRules: {
      memberships: membershipUnion,
    },
  },
  pendingOrganizations: {
    mappingRules: {
      // The `memberRequestor` field gets detected by ModelCache
      // as a nested Member model, and will be removed from the
      // returned models. This mapping rule is in place to just stick that
      // field back on the models.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      memberRequestor(memberRequestor: any, model: Model) {
        return model.set('memberRequestor', memberRequestor);
      },
    },
  },
  workspaceBoardsPage: {
    query: {
      boards: 'open',
      board_fields: boardFieldsInLargeOrganization,
      fields: organizationBoardsFields,
      paidAccount: true,
      paidAccount_fields: paidAccountFieldsMinimal,
      enterprise: true,
      tags: true,
      memberships: 'active',
      billableCollaboratorCount: true,
    },
    operationName: 'payload:workspaceBoardsPage',
    mappingRules: { boards: orgBoardsMapping },
  },
  card: {
    query: {
      fields:
        'id,badges,closed,dueComplete,dateLastActivity,desc,descData,due,dueReminder,email,idBoard,idChecklists,idList,idMembers,idMembersVoted,idShort,idAttachmentCover,labels,idLabels,manualCoverAttachment,name,pos,shortLink,shortUrl,start,subscribed,url,cover,isTemplate,cardRole',
      stickers: true,
      sticker_fields: 'id,top,left,zIndex,rotate,image,imageUrl,imageScaled',
      attachments: true,
      attachment_fields:
        'id,bytes,date,edgeColor,fileName,idMember,isUpload,mimeType,name,pos,previews,url',
      customFieldItems: true,
      pluginData: true,
    },
    operationName: 'payload:card',
  },
};

export default Payloads;
