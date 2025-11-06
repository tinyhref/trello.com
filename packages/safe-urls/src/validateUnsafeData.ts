import {
  isStringUnionUnsafeData,
  type DataTypes,
  type TypedUnsafeData,
  type UnsafeData,
} from './SanitizeUrl.types';
import { UnsafeDataTypeNotFoundError } from './UnsafeDataErrors';

const isAri = (value: string): boolean => {
  const ariPrefixFormat = /^ari(?:::?[a-z]*)*\//i;
  return ariPrefixFormat.test(value);
};

/**
 * A function that validates a {@link UnsafeData} and returns a validated string or undefined if the validation fails.
 */
type DataValidator = (param: UnsafeData) => boolean;

type IntermediateDataTypes =
  | 'aaid'
  | 'epochTimestamp'
  | 'hex'
  | 'legacyMemberId'
  | 'shortLinkId'
  | 'uuid';

/**
 * A map of valid data types to their corresponding {@link DataValidator} functions.
 */
const dataTypeValidators = {
  hex: (param: UnsafeData): boolean => {
    const value = param.value.toString().toLowerCase();
    const hexIdFormat = /^[0-9a-f]{6,}$/i;
    return hexIdFormat.test(value);
  },
  shortLinkId: (param: UnsafeData): boolean => {
    const value = param.value.toString().toLowerCase();
    const shortlinkIdFormat = /^[0-9a-z]{8}$/i;
    return shortlinkIdFormat.test(value);
  },
  aaid: (param: UnsafeData): boolean => {
    const value = param.value.toString().toLowerCase();
    const aaidFormat = /^[0-9a-f:-]{1,128}$/i; // https://hello.atlassian.net/wiki/x/DnQJQw

    return (
      (isAri(value) && aaidFormat.test(value.split('/')[1].trim())) ||
      aaidFormat.test(value)
    );
  },
  aiUseCase: (param: UnsafeData): boolean => {
    return param.value.toString().toLowerCase() === 'ai-retry';
  },
  legacyMemberId: (param: UnsafeData): boolean => {
    const isHexId = dataTypeValidators['hex'](param);
    if (isHexId) {
      return true;
    } else {
      const value = param.value.toString().toLowerCase();
      return value === 'me';
    }
  },
  applicationId: (param: UnsafeData): boolean => {
    return dataTypeValidators['hex'](param);
  },
  attachmentId: (param: UnsafeData): boolean => {
    return dataTypeValidators['hex'](param);
  },
  boardId: (param: UnsafeData): boolean => {
    return (
      dataTypeValidators['hex'](param) ||
      dataTypeValidators['shortLinkId'](param)
    );
  },
  //Supports epoch timestamps in second, millisecond, and microsecond precision
  epochTimestamp: (param: UnsafeData): boolean => {
    return /^\d{10,16}$/gim.test(param.value.toString());
  },
  boardPref: (param: UnsafeData): boolean => {
    switch (param.value) {
      case 'aiBrowserExtensionEnabled':
      case 'aiEmailEnabled':
      case 'calendarKey':
      case 'emailKey':
      case 'emailPosition':
      case 'fullEmail':
      case 'idEmailList':
      case 'showCompactMirrorCards':
      case 'showSidebar':
        return true;
      default:
        return false;
    }
  },
  cardId: (param: UnsafeData): boolean => {
    return (
      dataTypeValidators['hex'](param) ||
      dataTypeValidators['shortLinkId'](param)
    );
  },
  stringUnion: (param: UnsafeData): boolean => {
    if (isStringUnionUnsafeData(param)) {
      const { value, allowedValues, isCaseSensitive } = param;
      const valueString = value.toString();
      if (isCaseSensitive) {
        return allowedValues.includes(valueString);
      } else {
        return allowedValues
          .map((allowedValue) => allowedValue.toLowerCase())
          .includes(valueString.toLowerCase());
      }
    } else {
      return false;
    }
  },
  memberId: (param: UnsafeData): boolean => {
    return (
      dataTypeValidators['legacyMemberId'](param) ||
      dataTypeValidators['aaid'](param)
    );
  },
  otherId: (param: UnsafeData): boolean => {
    return (
      dataTypeValidators['hex'](param) ||
      dataTypeValidators['uuid'](param) ||
      dataTypeValidators['shortLinkId'](param)
    );
  },
  pluginId: (param: UnsafeData): boolean => {
    return dataTypeValidators['hex'](param);
  },
  workspaceId: (param: UnsafeData): boolean => {
    return (
      dataTypeValidators['hex'](param) || dataTypeValidators['aaid'](param)
    );
  },
  enterpriseId: (param: UnsafeData): boolean => {
    return dataTypeValidators['hex'](param);
  },
  organizationId: (param: UnsafeData): boolean => {
    const organizationIdFormat = /^[[a-zA-Z0-9-]+$/i;
    return organizationIdFormat.test(param.value.toString());
  },
  modelType: (param: UnsafeData): boolean => {
    return dataTypeValidators['stringUnion']({
      value: param.value,
      type: 'stringUnion',
      allowedValues: ['board', 'organization', 'card'],
      isCaseSensitive: true,
    });
  },
  // Butler button IDs are in the format of {memberId that created the button}-{epoch at time of button creation}
  butlerButtonId: (param: UnsafeData): boolean => {
    if (!param.value.toString().includes('-')) return false;
    const [memberId, epoch] = param.value.toString().split('-');
    return (
      dataTypeValidators['memberId']({
        value: memberId,
        type: param.type,
      } as TypedUnsafeData) &&
      dataTypeValidators['epochTimestamp']({
        value: epoch,
        type: param.type,
      } as TypedUnsafeData)
    );
  },
  actionId: (param: UnsafeData): boolean => {
    return dataTypeValidators['hex'](param);
  },
  reactionId: (param: UnsafeData): boolean => {
    return dataTypeValidators['hex'](param);
  },
  username: (param: UnsafeData): boolean => {
    return (
      typeof param.value === 'string' &&
      param.value.length > 0 &&
      !param.value.includes('/')
    );
  },
  enterpriseName: (param: UnsafeData): boolean => {
    return (
      typeof param.value === 'string' &&
      param.value.length > 0 &&
      !param.value.includes('/')
    );
  },
  listId: (param: UnsafeData): boolean => {
    return dataTypeValidators['hex'](param);
  },
  signature: (param: UnsafeData): boolean => {
    const signatureFormat = /^[0-9a-fA-F]{32}$/;
    return signatureFormat.test(param.value.toString());
  },
  number: (param: UnsafeData): boolean => {
    return /^\d{1,10}$/gim.test(param.value.toString());
  },
  upNextId: (param: UnsafeData): boolean => {
    const parts = param.value.toString().split(':');
    if (parts.length !== 2) return false;
    return (
      ['DueSoon', 'Action'].includes(parts[0]) &&
      dataTypeValidators['hex']({
        type: 'actionId',
        value: parts[1],
      })
    );
  },
  uuid: (param: UnsafeData): boolean => {
    const value = param.value.toString().toLowerCase();
    const uuidFormat =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidFormat.test(value);
  },
} satisfies Record<DataTypes | IntermediateDataTypes, DataValidator>;

/**
 * Validates the format of {@link UnsafeData} objects with type validation. Use this when you need to work
 * with potentially unsafe values in a type-safe way, for example, when building REST URLs with user input.
 *
 * {@inheritDoc DataTypes}
 *
 * @param unsafeData - The {@link UnsafeData} to validate.
 * @returns True if the incoming data is valid, false otherwise.
 *
 * @example
 * ```ts
 * const isDataValid = validateUnsafeData({ value: "5a97df6a3724239813d0f607a", type: "boardId" });
 * ```
 *
 * @throws Throws an {@link UnsafeDataTypeNotFoundError} when one of the unsafe data components references a type that does not exist
 *
 * @see {@link sanitizeUrl} The template literal tag function for building strings with unsafe data inputs.
 */
export const validateUnsafeData = (unsafeData: UnsafeData): boolean => {
  if (Object.keys(dataTypeValidators).includes(unsafeData.type)) {
    return dataTypeValidators[unsafeData.type](unsafeData);
  } else {
    throw new UnsafeDataTypeNotFoundError(unsafeData);
  }
};
