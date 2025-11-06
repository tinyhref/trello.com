/**
 * Extracts query parameters from the current browser URL.
 * @returns An object containing all query parameters as key-value pairs, or undefined if no parameters exist or an error occurs.
 * */
export const getQueryParamsFromBillingUrl = ():
  | Record<string, string>
  | undefined => {
  try {
    const search = window.location.search || '';
    const urlParams = new URLSearchParams(search);
    const params: Record<string, string> = {};

    for (const [key, value] of urlParams.entries()) {
      params[key] = value;
    }

    return Object.keys(params).length > 0 ? params : undefined;
  } catch (error) {
    return undefined;
  }
};
