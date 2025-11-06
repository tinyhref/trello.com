/**
 * Some browsers restrict embedded, cross-origin content from accessing first-party
 * storage (e.g. cookies)
 * If the current context does not have storage access, this method can be used
 * to request access via the Storage Access API.
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Storage_Access_API}
 *
 * Note (04/2023): Safari has particular expectations as to how we interact
 * with the Storage Access API
 * {@link https://webkit.org/blog/11545/updates-to-the-storage-access-api/}
 */
export async function requestStorageAccess(
  onRequestRejected?: (error: unknown) => void,
): Promise<void> {
  try {
    await document.requestStorageAccess();
  } catch (error) {
    if (onRequestRejected) {
      onRequestRejected(error);
    }
  }
}
