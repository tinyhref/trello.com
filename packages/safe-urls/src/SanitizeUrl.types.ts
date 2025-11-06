import type { OpaqueString } from '@trello/utility-types';

/**
 * @remarks
 * Data types available for use with the URL sanitization template. These types ensure safe handling of dynamic input
 * when constructing REST URLs or working with potentially unsafe data.
 *
 * ### Primary types
 * These types are the most commonly used and have specific validation rules:
 * | Type              | Description                                                                                              |
 * | ----------------- | -------------------------------------------------------------------------------------------------------- |
 * | `applicationId`   | Matches any application ID string, inherits from `otherId`.                                              |
 * | `attachmentId`    | Matches any attachment ID string, inherits from `otherId`.                                               |
 * | `boardId`         | Matches any board ID string, inherits from `otherId`.                                                    |
 * | `butlerButtonId`  | Butler button IDs are in the format `{memberId}-{epoch}` where `memberId` is the creator and `epoch` is the creation time. |
 * | `cardId`          | Matches any card ID string, inherits from `otherId`.                                                     |
 * | `listId`          | Matches any list ID string, inherits from `otherId`.                                                     |
 * | `memberId`        | Matches any user ID, inherits from `otherId`, and supports ARIs or AAIDs.                                |
 * | `modelType`       | Matches specific string values like `board`, `organization`, or `card`.                                  |
 * | `pluginId`        | Matches any plugin ID string, inherits from `otherId`.                                                   |
 * | `reactionId`      | Matches any reaction ID string, inherits from `otherId`.                                                 |
 * | `signature`       | Matches any signature string (32-character hex format).                                                  |
 * | `workspaceId`     | Matches any workspace ID, inherits from `otherId`, and supports ARIs or AAIDs.                           |
 * | `organizationId`  | Matches any organization ID string, inherits from `otherId`.                                             |
 * | `username`        | Matches usernames, ensures they do not contain `/` and are valid strings.                                |
 * | `upNextId`        | Matches any up next ID string, inherits from `otherId`.                                                  |
 * | `enterpriseName`  | Matches enterprise names, ensures they do not contain `/` and are valid strings.                         |
 *
 * ### Secondary types
 * Don't use these unless nothing in the table above fits your use case.
 * | Type    | Description |
 * | -------- | ------- |
 * | `otherId` | Matches any hex value longer than 6 characters long. |
 * | `stringUnion` | Matches any string specified in the additional property `allowedValues`. Can be matched case-insensitively if `isCaseSensitive` is not provided. |
 * | `number` | Matches any number between 1 and 10 digits long. |
 */

export type DataTypes =
  | 'actionId'
  | 'aiUseCase'
  | 'applicationId'
  | 'attachmentId'
  | 'boardId'
  | 'boardPref'
  | 'butlerButtonId'
  | 'cardId'
  | 'enterpriseId'
  | 'enterpriseName'
  | 'listId'
  | 'memberId'
  | 'modelType'
  | 'number'
  | 'organizationId'
  | 'otherId'
  | 'pluginId'
  | 'reactionId'
  | 'signature'
  | 'stringUnion'
  | 'upNextId'
  | 'username'
  | 'workspaceId';

/**
 * A parameter that is passed to `sanitizeUnsafeString` that indicates that the value should be validated with the
 * appropriate validator from `dataTypeValidators`.
 */
export type TypedUnsafeData = {
  value: number | string;
  type: Exclude<DataTypes, 'stringUnion'>;
};

/**
 * A parameter that is passed to `sanitizeUnsafeString` that indicates that the value should be validated to match one of the
 * allowed values array.
 */
export interface StringUnionUnsafeData extends Omit<TypedUnsafeData, 'type'> {
  value: number | string;
  type: 'stringUnion';
  allowedValues: string[];
  isCaseSensitive?: boolean;
}

export const isStringUnionUnsafeData = (
  data: UnsafeData,
): data is StringUnionUnsafeData => {
  return data.type === 'stringUnion';
};

export type UnsafeData = StringUnionUnsafeData | TypedUnsafeData;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SafeUrl extends OpaqueString<SafeUrl, 'SafeUrl'> {}
