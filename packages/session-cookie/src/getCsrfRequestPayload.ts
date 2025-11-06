import { getDsc } from './dsc';

/**
 * Returns an object containing a token, the Double Submit Cookie, that should
 * be included in request bodies.
 * This token is used to help prevent Cross-Site Request Forgery (XSRF).
 *
 * {@link https://hello.atlassian.net/wiki/spaces/SLAND/pages/2543163860/Security+XSRF+CSRF+Prevention}
 *
 * @param options.fallbackValue Set fallback value if cookie is empty or does not exists
 */
export function getCsrfRequestPayload(options?: { fallbackValue?: '' }): {
  dsc: string;
};
export function getCsrfRequestPayload(options?: {
  fallbackValue?: '' | null;
}): { dsc?: string | null | undefined } {
  return {
    dsc: getDsc() || options?.fallbackValue,
  };
}
