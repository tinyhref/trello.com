import type { FunctionComponent } from 'react';
import { useCallback, useEffect } from 'react';
import { IntlProvider } from 'react-intl';

import { ConsentBanner } from '@atlassian/browser-storage-controls';
import { Analytics } from '@trello/atlassian-analytics';
import { ErrorBoundary } from '@trello/error-boundaries';
import { currentLocale } from '@trello/locale';
import { getScreenFromUrl } from '@trello/marketing-screens';
import type { CookiesConsentTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { useCookiesConsentBanner } from './useCookiesConsentBanner';

import * as styles from './CookiesConsentBanner.module.less';

export interface CookiesConsentBannerProps {
  onHide: () => void;
}

export const CookiesConsentBanner: FunctionComponent<
  CookiesConsentBannerProps
> = ({ onHide }) => {
  const locale = currentLocale;

  const { wouldRender: shouldRenderConsentBanner, checkCookies } =
    useCookiesConsentBanner();
  useEffect(() => {
    if (shouldRenderConsentBanner) {
      Analytics.sendOperationalEvent({
        action: 'rendered',
        actionSubject: 'banner',
        actionSubjectId: 'cookiesConsentBanner',
        source: getScreenFromUrl(),
      });
    }
  }, [shouldRenderConsentBanner]);

  const onHideBanner = useCallback(async () => {
    // rerender the banner after the cookie is set
    // ensuring that the banner is hidden
    await checkCookies();
    onHide();
  }, [checkCookies, onHide]);

  if (!shouldRenderConsentBanner) {
    return null;
  }
  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-graphql-data',
        feature: 'Cookie Consent Banner',
      }}
    >
      <IntlProvider locale={locale}>
        <div
          className={styles.banner}
          data-testid={getTestId<CookiesConsentTestIds>(
            'cookies-consent-banner',
          )}
        >
          <ConsentBanner onHide={onHideBanner} product={'Trello'} />
        </div>
      </IntlProvider>
    </ErrorBoundary>
  );
};
