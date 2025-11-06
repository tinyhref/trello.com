import type { UnsafeData } from './SanitizeUrl.types';
import { UnsafeDataValidationError } from './UnsafeDataErrors';
import { validateUnsafeData } from './validateUnsafeData';

/**
 * Sanitizes unsafe data by first validating the data against its type, and then encoding it for use in a URL.
 *
 * {@inheritDoc DataTypes}
 *
 * @param unsafeData - The unsafe data to sanitize.
 * @returns a sanitized string.  If the data is invalid, an error is thrown.
 * @throws Throws an {@link UnsafeDataValidationError} when the data is invalid.
 */
export const sanitizeUnsafeData = (unsafeData: UnsafeData): string => {
  if (validateUnsafeData(unsafeData)) {
    return encodeURIComponent(unsafeData.value.toString());
  } else {
    throw new UnsafeDataValidationError(unsafeData);
  }
};
