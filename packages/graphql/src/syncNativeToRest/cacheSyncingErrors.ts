import type { TargetModel } from './cacheModelTypes';

class CacheSyncingError extends Error {
  /** The native type that was being synced when the error occurred */
  readonly typeName: string;

  constructor(
    typeName: string,
    message: string,
    fieldName?: string,
    targetModel?: TargetModel,
  ) {
    const targetModelMessage = targetModel
      ? ` (${targetModel.type} ${targetModel.id})`
      : '';
    super(
      `Could not sync ${typeName}${fieldName ? `.${fieldName}` : ''} to cache: ${message}${targetModelMessage}`,
    );
    this.typeName = typeName;
  }
}

export class InvalidValueError extends CacheSyncingError {
  value: unknown;

  /**
   *
   * @param typeName The native type that was being synced when the error occurred
   * @param fieldName The field on the incoming data that was being synced when the error occurred
   * @param value The value of the incoming data that caused the error to be thrown
   * @param targetModel The non-native type that was being synced to when the error occurred
   * @param sendValueToSentry Whether or not to send the value to Sentry (don't send potential UGC or PII)
   */
  constructor(
    typeName: string,
    fieldName: string,
    value: unknown,
    targetModel: TargetModel,
    // in cases where the value is not PII/UGC, we can send it to sentry
    sendValueToSentry?: boolean,
  ) {
    super(
      typeName,
      sendValueToSentry ? `Invalid value (${value})` : 'Invalid value',
      fieldName,
      targetModel,
    );
    this.value = value;
  }
}

export class MissingIdError extends CacheSyncingError {
  constructor(typeName: string, fieldName?: string, parentModel?: TargetModel) {
    super(typeName, `Missing id and objectId fields`, fieldName, parentModel);
  }
}

export class InvalidIdError extends CacheSyncingError {
  id: unknown;

  constructor(
    typeName: string,
    id: unknown,
    fieldName?: string,
    parentModel?: TargetModel,
  ) {
    super(typeName, `Invalid objectId: ${id}`, fieldName, parentModel);
    this.id = id;
  }
}

export const wrapIdErrorInParent = (
  error: InvalidIdError | MissingIdError,
  parent: TargetModel,
  fieldName: string,
) => {
  // TODO: For consistency we should pass the native type into the new error rather than the non native type
  if (error instanceof InvalidIdError) {
    return new InvalidIdError(parent.type, error.id, fieldName, parent);
  } else if (error instanceof MissingIdError) {
    return new MissingIdError(parent.type, fieldName, parent);
  }
};
