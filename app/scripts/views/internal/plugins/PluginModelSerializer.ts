/* eslint-disable @typescript-eslint/no-use-before-define */

/*
 * decaffeinate suggestions:
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import _ from 'underscore';

import { makeErrorEnum } from '@trello/error-handling';

// eslint-disable-next-line @trello/enforce-variable-case
const PluginModelSerializerError = makeErrorEnum('PluginModelSerializer', [
  'InvalidField',
]);

/* eslint-disable-next-line @trello/enforce-variable-case, @typescript-eslint/no-explicit-any */
const readJSONFields = function (json: any, allowedFields: any, fields: any) {
  if (_.isEqual(['all'], _.values(fields))) {
    fields = allowedFields;
  }

  if (_.any(fields, (field) => !allowedFields.includes(field))) {
    throw PluginModelSerializerError.InvalidField();
  }

  return _.pick(json, fields);
};

const readModelFields = function (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  allowedFields: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getters?: any,
) {
  if (!getters) {
    getters = {};
  }
  if (_.isEqual(['all'], _.values(fields))) {
    fields = allowedFields;
  }

  return _.chain(fields)
    .map(function (field) {
      if (!allowedFields.includes(field)) {
        throw PluginModelSerializerError.InvalidField();
      }

      const value = getters[field]?.(model, field) ?? model.get(field);

      return [field, value];
    })
    .object()
    .value();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serializePreview = function (preview: any, fields: any) {
  if (!fields) {
    fields = ['bytes', 'height', 'scaled', 'url', 'width'];
  }
  return readJSONFields(
    preview,
    ['bytes', 'height', 'scaled', 'url', 'width'],
    fields,
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serializePreviews = (previews: any, fields?: any) =>
  previews.map(_.partial(serializePreview, _, fields));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serializeAttachment = function (attachment: any, fields?: any) {
  if (!fields) {
    fields = ['all'];
  }
  const allowed = [
    'date',
    'edgeColor',
    'id',
    'idMember',
    'name',
    'previews',
    'url',
  ];
  return readModelFields(attachment, allowed, fields, {
    previews() {
      // We load the previews asynchronously, so we might not have them yet
      return serializePreviews(attachment.get('previews') ?? []);
    },
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serializeAttachments = (attachments: any, fields?: any) =>
  attachments.map(_.partial(serializeAttachment, _, fields));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serializeBoard = function (board: any, fields?: any) {
  if (!fields) {
    fields = ['id', 'name'];
  }
  const allowed = [
    'customFields',
    'dateLastActivity',
    'id',
    'idOrganization',
    'labels',
    'members',
    'memberships',
    'name',
    'shortLink',
    'url',
    'paidStatus',
  ];
  return readModelFields(board, allowed, fields, {
    customFields() {
      // confirm custom fields Power-Up is enabled on board
      if (board.isCustomFieldsEnabled()) {
        return serializeCustomFields(board.customFieldList);
      } else {
        return [];
      }
    },
    labels() {
      return serializeLabels(board.labelList, ['all']);
    },
    members() {
      return serializeMembers(board.memberList, [
        'id',
        'fullName',
        'username',
        'initials',
        'avatar',
      ]);
    },
    memberships() {
      return serializeMemberships(board.get('memberships'), ['all']);
    },
    paidStatus() {
      return board.getPaidStatus();
    },
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serializeOrganization = function (organization: any, fields: any) {
  if (!fields) {
    fields = ['id'];
  }
  return readModelFields(organization, ['id', 'name', 'paidStatus'], fields, {
    paidStatus() {
      return organization.getPaidStatus();
    },
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serializeCard = function (card: any, fields: any) {
  if (!fields) {
    fields = ['id', 'name'];
  }
  const allowed = [
    'address',
    'attachments',
    'badges',
    'checklists',
    'closed',
    'coordinates',
    'cover',
    'customFieldItems',
    'dateLastActivity',
    'desc',
    'due',
    'dueComplete',
    'id',
    'idList',
    'idShort',
    'labels',
    'locationName',
    'members',
    'name',
    'pos',
    'shortLink',
    'start',
    'staticMapUrl',
    'url',
  ];

  return readModelFields(card, allowed, fields, {
    attachments() {
      return serializeAttachments(card.attachmentList);
    },

    cover() {
      const idAttachmentCover = card.get('idAttachmentCover');
      const cover = card.attachmentList.get(idAttachmentCover);
      if (idAttachmentCover && cover) {
        return serializeAttachment(cover);
      }

      return null;
    },

    customFieldItems() {
      if (card.getBoard().isCustomFieldsEnabled()) {
        return serializeCustomFieldItems(card.customFieldItemList);
      } else {
        return [];
      }
    },

    labels() {
      return serializeLabels(card.labelList);
    },

    members() {
      return serializeMembers(card.memberList, ['all']);
    },

    checklists() {
      return serializeChecklists(card.checklistList.models);
    },
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serializeCards = function (cards: any, fields: any) {
  // filter cards down to only those that have an ID
  // i.e. we want to ignore optimistically created cards that don't
  // exist for sure yet
  if (!fields) {
    fields = ['id', 'name'];
  }
  return _.filter(cards, (card) => card.get('id')).map(
    _.partial(serializeCard, _, fields),
  );
};

const serializeCustomFieldOption = function (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customFieldOption: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: any,
) {
  if (!fields) {
    fields = ['all'];
  }
  return readModelFields(
    customFieldOption,
    ['id', 'color', 'value', 'pos'],
    fields,
  );
};

const serializeCustomFieldOptions = function (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customFieldOptions: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields?: any,
) {
  if (!fields) {
    fields = ['all'];
  }
  return customFieldOptions.map(
    _.partial(serializeCustomFieldOption, _, fields),
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serializeCustomField = function (customField: any, fields: any) {
  if (!fields) {
    fields = ['id', 'name', 'type'];
  }
  const allowed = ['id', 'fieldGroup', 'name', 'pos', 'type', 'display'];
  if (customField.isList()) {
    return readModelFields(customField, allowed.concat(['options']), fields, {
      options() {
        return serializeCustomFieldOptions(customField.optionList);
      },
    });
  } else {
    return readModelFields(customField, allowed, _.without(fields, 'options'));
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serializeCustomFields = function (customFields: any, fields?: any) {
  if (!fields) {
    fields = ['all'];
  }
  return customFields.map(_.partial(serializeCustomField, _, fields));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serializeCustomFieldItem = function (customFieldItem: any, fields: any) {
  if (!fields) {
    fields = ['all'];
  }
  if (customFieldItem.getType() === 'list') {
    return readModelFields(
      customFieldItem,
      ['id', 'idCustomField', 'idValue'],
      _.without(fields, 'value'),
    );
  } else {
    return readModelFields(
      customFieldItem,
      ['id', 'idCustomField', 'value'],
      _.without(fields, 'idValue'),
    );
  }
};

const serializeCustomFieldItems = function (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customFieldItems: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields?: any,
) {
  if (!fields) {
    fields = ['all'];
  }
  const nonEmptyItems = _.filter(customFieldItems.models, (i) => !i.isEmpty());
  return nonEmptyItems.map(_.partial(serializeCustomFieldItem, _, fields));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serializeLabel = function (label: any, fields: any) {
  if (!fields) {
    fields = ['id', 'name', 'color'];
  }
  return readModelFields(label, ['id', 'name', 'color'], fields);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serializeLabels = (labels: any, fields?: any) =>
  labels.map(_.partial(serializeLabel, _, fields));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serializeList = function (list: any, fields?: any) {
  if (!fields) {
    fields = ['id', 'name'];
  }
  return readModelFields(list, ['id', 'name', 'cards'], fields, {
    cards() {
      return serializeCards(list.cardList.models, ['all']);
    },
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serializeLists = function (lists: any, fields?: any) {
  if (!fields) {
    fields = ['id', 'name'];
  }
  return lists.map(_.partial(serializeList, _, fields));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serializeMember = function (member: any, fields?: any) {
  if (!fields) {
    fields = ['id', 'fullName', 'username'];
  }
  return readModelFields(
    member,
    ['id', 'fullName', 'username', 'initials', 'avatar', 'paidStatus'],
    fields,
    {
      fullName() {
        return member.get('fullName', false);
      },

      initials() {
        return member.get('initials', false);
      },

      avatar() {
        const avatarUrl = member.get('avatarUrl', false);
        if (avatarUrl) {
          return [avatarUrl, '170.png'].join('/');
        }
        return null;
      },

      paidStatus() {
        return member.getMaxPaidStatus();
      },
    },
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serializeMembers = (members: any, fields?: any) =>
  members.map(_.partial(serializeMember, _, fields));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serializeMembership = function (membership: any, fields?: any) {
  if (!fields) {
    fields = ['idMember', 'memberType'];
  }
  return readJSONFields(
    membership,
    ['deactivated', 'id', 'idMember', 'memberType', 'unconfirmed'],
    fields,
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serializeMemberships = (memberships: any, fields?: any) =>
  memberships.map(_.partial(serializeMembership, _, fields));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serializeChecklists = (checklists: any) => {
  const allowedFields = [
    'id',
    'idBoard',
    'idCard',
    'name',
    'checkItems',
    'pos',
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return checklists.map((model: any) =>
    readModelFields(model, allowedFields, ['all']),
  );
};

export {
  serializeAttachment,
  serializeAttachments,
  serializeBoard,
  serializeCard,
  serializeCards,
  serializeChecklists,
  serializeList,
  serializeLists,
  serializeMember,
  serializeOrganization,
};
