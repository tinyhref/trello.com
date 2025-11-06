import cx from 'classnames';
import {
  memo,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { isMemberLoggedIn } from '@trello/authentication';
import {
  LazyCookiesConsentBanner,
  useCookiesConsentBanner,
} from '@trello/cookies-consent-banner';
import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { routerState, useIsActiveRoute } from '@trello/router';
import { isFullScreenWorkspaceRoute, RouteId } from '@trello/router/routes';
import { useSharedStateSelector } from '@trello/shared-state';
import { useAreMultiplePanelsOpen } from '@trello/split-screen';
import { getTestId } from '@trello/test-ids';
import type { GlobalBannersTestIds } from '@trello/test-ids';

import {
  LazyAccountTransferRequiredBanner,
  useAccountTransferRequiredBanner,
} from 'app/src/components/AccountTransferRequiredBanner';
import {
  getBrowserUnsupportedBanner,
  LazyBrowserUnsupportedBanner,
} from 'app/src/components/BrowserUnsupportedBanner';
import {
  LazyConfirmEmailBanner,
  useConfirmEmailBanner,
} from 'app/src/components/ConfirmEmailBanner';
import {
  LazyDowngradePeriodBanner,
  useDowngradePeriodBanner,
} from 'app/src/components/DowngradePeriodBanner';
import {
  LazyEnterpriseDeprovisioningBanners,
  useEnterpriseDeprovisioningBanner,
} from 'app/src/components/EnterpriseDeprovisioningBanner';
import {
  LazyEnterpriseNotificationBanners,
  useEnterpriseNotificationBanners,
} from 'app/src/components/EnterpriseNotificationBanners';
import {
  LazyFreeTrialBanner,
  useFreeTrialBanner,
} from 'app/src/components/FreeTrialBanner';
import {
  LazyOverduePaymentBanner,
  useOverduePaymentBanner,
} from 'app/src/components/OverduePaymentBanner';
import {
  LazyPersonalProductivitySurveyBanner,
  useIsEligibleForPersonalProductivitySurveyBanner,
} from 'app/src/components/PersonalProductivitySurveyBanner';
import {
  LazyPremiumPOSeatCapBanners,
  usePremiumPOSeatCapBanner,
} from 'app/src/components/PremiumPOSeatCapBanner';
import {
  LazySandboxEnterpriseBanner,
  useSandboxEnterpriseBanner,
} from 'app/src/components/SandboxEnterpriseBanner';
import { useIsSmartScheduleM2Enabled } from 'app/src/components/SmartSchedule';
import {
  SomethingsWrongBanner,
  useSomethingsWrongBanner,
} from 'app/src/components/SomethingsWrongBanner';
import { checkForGtmConsent } from 'app/src/components/TrelloOnline/useGtmSharedState';

import * as styles from './Banners.module.less';

export const Banners = memo(() => {
  const isActiveBoardRoute = useIsActiveRoute(RouteId.BOARD);
  const isActiveCardRoute = useIsActiveRoute(RouteId.CARD);
  const isBoardOrCardRouteActive = isActiveCardRoute || isActiveBoardRoute;
  const areMultiplePanelsOpen = useAreMultiplePanelsOpen();
  const [initialLoad, setInitialLoad] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  const isSmartScheduleM2Enabled = useIsSmartScheduleM2Enabled();

  const isActiveWorkspaceRoute = useSharedStateSelector(
    routerState,
    useCallback((route) => isFullScreenWorkspaceRoute(route.id), []),
  );

  useEffect(() => {
    // Avoid the transition on initial load
    if (!initialLoad) {
      ref.current?.classList.add(styles.bannersTransition);
    } else {
      setInitialLoad(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areMultiplePanelsOpen]);

  const { wouldRender: wouldRenderSomethingsWrongBanner } =
    useSomethingsWrongBanner();

  const { wouldRender: wouldRenderBrowserUnsupportedBanner } = useMemo(
    () => getBrowserUnsupportedBanner(),
    [],
  );

  const { wouldRender: wouldRenderCookiesConsentBanner } =
    useCookiesConsentBanner();

  const { wouldRender: wouldRenderConfirmEmailBanner } = useConfirmEmailBanner({
    skip: false,
  });

  const { wouldRender: wouldRenderDowngradePeriodBanner } =
    useDowngradePeriodBanner();

  const { wouldRender: wouldRenderFreeTrialBanner } = useFreeTrialBanner();

  const { wouldRender: wouldRenderSandboxEnterpriseBanner } =
    useSandboxEnterpriseBanner();

  const { wouldRender: wouldRenderAccountTransferBanner } =
    useAccountTransferRequiredBanner();

  const { wouldRender: wouldRenderOverduePaymentBanner } =
    useOverduePaymentBanner();

  const { wouldRender: wouldRenderPremiumPOSeatCapBanner } =
    usePremiumPOSeatCapBanner();

  const { wouldRender: wouldRenderEnterpriseDeprovisioningBanner } =
    useEnterpriseDeprovisioningBanner();

  const { wouldRender: wouldRenderEnterpriseNotificationBanner } =
    useEnterpriseNotificationBanners();

  const { wouldRender: wouldRenderPersonalProductivitySurveyBanner } =
    useIsEligibleForPersonalProductivitySurveyBanner();

  const banners = [];

  // Only render the cookies consent banner if the user is logged out
  if (!isMemberLoggedIn() && wouldRenderCookiesConsentBanner) {
    banners.push(
      <LazyCookiesConsentBanner
        key="cookies-consent-banner"
        onHide={checkForGtmConsent}
      />,
    );
  } else if (isMemberLoggedIn()) {
    if (wouldRenderSomethingsWrongBanner) {
      // Note: this banner should not be laze loaded because it is used to indicate an incident
      banners.push(<SomethingsWrongBanner key="somethings-wrong-banner" />);
    }

    if (wouldRenderBrowserUnsupportedBanner) {
      banners.push(
        <LazyBrowserUnsupportedBanner key="browser-unsupported-banner" />,
      );
    }

    if (wouldRenderCookiesConsentBanner) {
      // Note: this banner should not be lazily loaded because we're legally required to show it
      // This should be placed below the system banners but above all other banners
      banners.push(
        <LazyCookiesConsentBanner
          key="cookies-consent-banner"
          onHide={checkForGtmConsent}
        />,
      );
    }

    if (wouldRenderConfirmEmailBanner) {
      banners.push(<LazyConfirmEmailBanner key="confirm-email-banner" />);
    }

    /* placeholder for future EnterpriseDeprovisioningBanner
    if (wouldRenderEnterpriseDeprovisioningBanner) {
      banners.push(<EnterpriseDeprovisioningBanner key="enterprise-deprovisioning-banner" />);
    } */

    /* placeholder for future EnterpriseLicenseBanner
      if (wouldRenderEnterpriseLicenseBanner) {
        banners.push(<EnterpriseLicenseBanner key="enterprise-licence-banner" />);
      } */

    if (wouldRenderSandboxEnterpriseBanner) {
      banners.push(
        <LazySandboxEnterpriseBanner key="sandbox-enterprise-banner" />,
      );
    }

    // Enterprise Banner Group (only one of these renders)
    if (wouldRenderAccountTransferBanner) {
      banners.push(
        <LazyAccountTransferRequiredBanner key="account-transfer-required-banner" />,
      );
    } /*
    // future location for PersonalBoardsOwnershipBanner
    else if (wouldRenderPersonalBoardsOwnershipBanner) {
      banners.push(<PersonalBoardsOwnershipBanner dismissBanner={dismissBoardsOwnershipBanner} key="personal-boards-ownership-banner" />);
    } */ else if (wouldRenderOverduePaymentBanner) {
      banners.push(<LazyOverduePaymentBanner key="overdue-payment-banner" />);
    }

    if (wouldRenderPremiumPOSeatCapBanner) {
      banners.push(
        <LazyPremiumPOSeatCapBanners key="enterprise-seat-cap-banner" />,
      );
    }

    if (wouldRenderEnterpriseDeprovisioningBanner) {
      banners.push(
        <LazyEnterpriseDeprovisioningBanners key="enterprise-deprovisioning-banners" />,
      );
    }

    if (wouldRenderEnterpriseNotificationBanner) {
      banners.push(
        <LazyEnterpriseNotificationBanners key="enterprise-notification-banners" />,
      );
    }

    // DowngradePeriodBanner should be rendered in addition to other banners
    if (wouldRenderDowngradePeriodBanner) {
      banners.push(<LazyDowngradePeriodBanner key="downgrade-period-banner" />);
    }

    if (wouldRenderFreeTrialBanner) {
      banners.push(<LazyFreeTrialBanner key="free-trial-banner" />);
    }

    if (wouldRenderPersonalProductivitySurveyBanner) {
      banners.push(
        <LazyPersonalProductivitySurveyBanner key="personal-productivity-survey-banner" />,
      );
    }

    // End Workspace banners
  }

  if (banners.length === 0) {
    return null;
  }

  // Don't show banners on full-screen workspace views
  if (isActiveWorkspaceRoute) {
    return null;
  }

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-platform',
      }}
    >
      <ChunkLoadErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <div
            ref={ref}
            data-testid={getTestId<GlobalBannersTestIds>('banners')}
            className={cx({
              [styles.splitScreenBanners]:
                isBoardOrCardRouteActive && areMultiplePanelsOpen,
              [styles.adjustedSplitScreenPadding]: isSmartScheduleM2Enabled,
            })}
          >
            {banners}
          </div>
        </Suspense>
      </ChunkLoadErrorBoundary>
    </ErrorBoundary>
  );
});
