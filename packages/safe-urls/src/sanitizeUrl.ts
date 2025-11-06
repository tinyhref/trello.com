import { isSafeURLSearchParams } from './SafeUrlSearchParams';
import { sanitizeUnsafeData } from './sanitizeUnsafeData';
import type { SafeUrl, UnsafeData } from './SanitizeUrl.types';
import { UnsafeDataValidationError } from './UnsafeDataErrors';
const isUrlSearchParams = (
  value: UnsafeData | URLSearchParams,
): value is URLSearchParams => {
  return value instanceof URLSearchParams;
};

/**
 * Template literal tag function for handling unsafe data inputs with type validation. Use this when you need to work
 * with potentially unsafe values in a type-safe way, for example, when building REST URLs with user input.
 *
 * {@inheritDoc DataTypes}
 *
 * @param strings - The array of string literals from the template.
 * @param unsafeData - Array of {@link UnsafeData} objects containing values and their expected types. This array can contain a mix of both types.
 * @returns The processed template string with validated unsafe data as a {@link SafeUrl} object, which is immutable and cannot be modified, but can otherwise be used like a normal string.
 *
 * @example
 * ```ts
 * const currentBoard = "5a97df6a3724239813d0f607a";
 *
 * // Unsafe/vulnerable method of building a URL
 * const unsafeRestUrl = `/1/board/${currentUser}/accessRequests`
 *
 * // Safe method of building a URL
 * const safeRestUrl = sanitizeUrl`/1/board/${{ value: currentBoard, type: "boardId" }}/accessRequests`
 * ```
 *
 * @throws Throws an `UnsafeDataValidationError` when one of the unsafe data components does not match the expected format
 * @throws Throws an `UnsafeDataTypeNotFoundError` when one of the unsafe data components references a type that does not exist
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates | Tagged Literal Template Functions (MDN)}
 */
export const sanitizeUrl = (
  strings: TemplateStringsArray,
  ...unsafeData: (UnsafeData | URLSearchParams)[]
): SafeUrl => {
  let outputStr = '';
  for (let i = 0; i < strings.length; i++) {
    outputStr += strings[i];

    if (unsafeData.length - 1 >= i) {
      const unsafeDataItem = unsafeData[i];

      if (isUrlSearchParams(unsafeDataItem)) {
        if (isSafeURLSearchParams(unsafeDataItem)) {
          outputStr += unsafeDataItem.toString(); // URLSearchParams toString will encode the values for us
        } else {
          outputStr += unsafeDataItem.toString(); // URLSearchParams toString will encode the values for us
        }
      } else {
        try {
          outputStr += sanitizeUnsafeData(unsafeDataItem);
        } catch (e: unknown) {
          if (e instanceof UnsafeDataValidationError) {
            // Capture the validation error and rethrow it with the context of the template string
            const contextualError = new UnsafeDataValidationError(e.badData, {
              source: `sanitizeUrl (parameter ${i})`,
              strings,
              unsafeData,
            });
            // Explicitly log error to the console, since Apollo captures and reformats resolver errors
            console.error(contextualError);
            throw contextualError;
          } else {
            // If the error is not an instance of UnsafeDataValidationError, rethrow it
            throw e;
          }
        }
      }
    }
  }
  return outputStr as unknown as SafeUrl;
};
