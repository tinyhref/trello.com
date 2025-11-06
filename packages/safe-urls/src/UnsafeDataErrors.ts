import type { UnsafeData } from './SanitizeUrl.types';

export interface UnsafeDataValidationContext {
  source: string;
  strings: TemplateStringsArray;
  unsafeData: (UnsafeData | URLSearchParams)[];
}

/**
 * An error that is thrown when a {@link UnsafeData} fails to validate, indicating that the value is not in the
 * expected format.
 */
export class UnsafeDataValidationError extends Error {
  public badData: UnsafeData;

  constructor(param: UnsafeData, context?: UnsafeDataValidationContext) {
    let message = `Failed to validate data of type "${
      param.type
    }". (Received: "${param.value.toString()}")`;
    if (context) {
      message += `\n\nContext: ${context.source}\n`;
      message += UnsafeDataValidationError.getContextString(param, context);
    }
    super(message);
    this.name = 'UnsafeDataValidationError';
    this.badData = param;
  }

  private static getContextString(
    param: UnsafeData,
    context: UnsafeDataValidationContext,
  ) {
    const dataIndex = context.unsafeData.findIndex((data) => data === param);
    let contextString = '';
    let highlightStartIndex = -1;
    let highlightLength = -1;
    for (let i = 0; i < context.strings.length; i++) {
      contextString += context.strings[i];
      if (
        context.unsafeData[i] !== undefined &&
        Object.prototype.hasOwnProperty.call(context.unsafeData[i], 'type')
      ) {
        if (i === dataIndex) {
          const badValidationPart = `{"${
            (context.unsafeData[i] as UnsafeData).value
          }": ${(context.unsafeData[i] as UnsafeData).type} (error)}`;
          highlightStartIndex = contextString.length + 0;
          highlightLength = badValidationPart.length + 0;
          contextString += badValidationPart;
        } else if (i > dataIndex) {
          contextString += `{"${
            (context.unsafeData[i] as UnsafeData).value
          }": ${
            (context.unsafeData[i] as UnsafeData).type
          } (not yet validated)}`;
        } else {
          contextString += `{"${
            (context.unsafeData[i] as UnsafeData).value
          }": ${(context.unsafeData[i] as UnsafeData).type}}`;
        }
      }
    }
    return (
      contextString +
      '\n' +
      ' '.repeat(highlightStartIndex) +
      '^'.repeat(highlightLength) +
      ' '.repeat(contextString.length - (highlightStartIndex + highlightLength))
    );
  }
}

/**
 * An error that is thrown when a {@link UnsafeData} references a type that does not exist. Valid types are
 * defined in `DataTypes`.
 */
export class UnsafeDataTypeNotFoundError extends Error {
  constructor(param: UnsafeData) {
    const message = `Could not find parser for data of type "${param.type}".`;
    super(message);
    this.name = 'UnsafeDataTypeNotFoundError';
  }
}
