import type { FunctionComponent } from 'react';
import { useEffect } from 'react';
import { IntlProvider } from 'react-intl';

import { PreferenceModal } from '@atlassian/browser-storage-controls';
import { Analytics } from '@trello/atlassian-analytics';
import { ErrorBoundary } from '@trello/error-boundaries';
import { currentLocale } from '@trello/locale';
import { getScreenFromUrl } from '@trello/marketing-screens';
import type { CookiesConsentTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

export interface CookiesPreferenceModalProps {
  onClose: () => void;
}

export const CookiesPreferenceModal: FunctionComponent<
  CookiesPreferenceModalProps
> = ({ onClose }) => {
  const locale = currentLocale;

  useEffect(() => {
    {
      Analytics.sendOperationalEvent({
        action: 'rendered',
        actionSubject: 'modal',
        actionSubjectId: 'cookiesPreferenceModal',
        source: getScreenFromUrl(),
      });
    }
  });

  return (
    <ErrorBoundary>
      <div
        data-testid={getTestId<CookiesConsentTestIds>(
          'cookies-preference-modal',
        )}
      >
        <IntlProvider locale={locale}>
          <PreferenceModal onClose={onClose} />
        </IntlProvider>
      </div>
    </ErrorBoundary>
  );
};
