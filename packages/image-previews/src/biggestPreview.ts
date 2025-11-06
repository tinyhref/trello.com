import type { Preview } from './imagePreview.types';
import { preferScaledPreviews } from './preferScaledPreviews';

export function biggestPreview(
  previews: Preview[] | null = [],
  originalImageUrl?: string | null, // passing this url will exclude that from preview selection
) {
  if (!previews || previews.length === 0) {
    return null;
  }

  if (originalImageUrl) {
    previews = previews.filter((preview) => preview.url !== originalImageUrl);
  }

  return preferScaledPreviews(previews).sort(
    (a, b) => Math.min(b.width, b.height) - Math.min(a.width, a.height),
  )[0];
}
