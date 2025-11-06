export const nullOrBool = (input: unknown): input is boolean | null => {
  return typeof input === 'boolean' || input === null;
};

export const nullOrString = (input: unknown): input is string | null => {
  return typeof input === 'string' || input === null;
};

export const nullOrNumber = (input: unknown): input is number | null => {
  return typeof input === 'number' || input === null;
};

export const isBool = (input: unknown): input is boolean => {
  return typeof input === 'boolean';
};

export const isNumber = (input: unknown): input is number => {
  return typeof input === 'number';
};

export const isString = (input: unknown): input is string => {
  return typeof input === 'string';
};

export const isEnumString = (
  input: unknown,
  validValues: readonly string[],
) => {
  return typeof input === 'string' && validValues.includes(input);
};

// stole this from app/scripts/controller/currentModelManager
const VALID_ID_REGEX = /^[a-f0-9]{24}$/;
export const isObjectId = (input: unknown): input is string =>
  typeof input === 'string' && VALID_ID_REGEX.test(input);

/**
 * Checks that the input is an object (in the way we normally think of objects)
 * i.e., not an array, not null, but {}
 */
export const isObject = (val: unknown): val is object => {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
};
