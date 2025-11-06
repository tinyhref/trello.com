import { useCallback, useState, type FunctionComponent } from 'react';

import fallbackFavicon from './faviconFallback.png';

import * as styles from './CardFrontExternalLinkFavicon.module.less';

const isValidImageUrl = (capturedUrl: string) =>
  /\.(jpg|jpeg|png|gif|webp|svg|ico|bmp)(\?.*)?$/i.test(capturedUrl) ||
  /^data:image\/(jpg|jpeg|png|gif|webp|svg\+xml|x-icon|bmp);(base64,|charset=[\w-]+;base64,|[^,]+,)/i.test(
    capturedUrl,
  );

const parseAndValidateFaviconUrl = (
  capturedUrl: string,
): string | undefined => {
  if (isValidImageUrl(capturedUrl)) {
    // Handle data URIs
    if (capturedUrl.startsWith('data:')) {
      return capturedUrl;
    }

    // Handle regular URLs
    try {
      const urlObj = new URL(capturedUrl);

      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return undefined;
      }

      return urlObj.toString();
    } catch (error) {
      console.warn('Failed to parse favicon URL:', capturedUrl, error);
    }
  }
  return undefined;
};

export interface CardFrontExternalLinkFaviconProps {
  faviconUrl?: string;
}

export const CardFrontExternalLinkFavicon: FunctionComponent<
  CardFrontExternalLinkFaviconProps
> = ({ faviconUrl }) => {
  const [hasError, setHasError] = useState(false);

  const validatedFaviconUrl = faviconUrl
    ? parseAndValidateFaviconUrl(faviconUrl)
    : null;

  const isUsingFallback = !validatedFaviconUrl || hasError;

  const onError = useCallback(() => {
    setHasError(true);
  }, []);

  return (
    <img
      src={isUsingFallback ? fallbackFavicon : validatedFaviconUrl}
      alt=""
      className={styles.favicon}
      referrerPolicy="no-referrer"
      onError={onError}
      data-testid={
        isUsingFallback
          ? 'external-link-favicon-fallback'
          : 'external-link-favicon'
      }
    />
  );
};
