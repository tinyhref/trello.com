import type { FunctionComponent, PropsWithChildren } from 'react';
import { useCallback } from 'react';

import { createGetSuggestedSiteNamesPlugin } from '@atlassiansox/cross-flow-plugins';
import TrelloCrossFlowProvider from '@atlassiansox/cross-flow-support/trello';
import { getApiGatewayUrl } from '@trello/api-gateway';
import { getAnalyticsClientMemberIdProxy } from '@trello/atlassian-analytics';
import { environment } from '@trello/config';
import { ErrorBoundary } from '@trello/error-boundaries';
import { sendErrorEvent } from '@trello/error-reporting';
import { currentLocale } from '@trello/locale';
import { EMPTY_PII_STRING } from '@trello/privacy';

import { getSuggestedSiteNames } from './crossFlowEssentials';
import { useCrossFlowProviderQuery } from './CrossFlowProviderQuery.generated';

export const CrossFlowProvider: FunctionComponent<
  PropsWithChildren<object>
> = ({ children }) => {
  const { data } = useCrossFlowProviderQuery({
    variables: { memberId: 'me' },
    waitOn: ['MemberHeader'],
  });

  const me = data?.member;
  const ent = me?.enterprises ?? [];
  const teams = me?.organizations ?? [];

  const member = {
    id: me?.id || '',
    idPremOrgsAdmin: me?.idPremOrgsAdmin || [],
    fullName: me?.fullName || EMPTY_PII_STRING,
    enterprises: ent,
  };

  const env = environment === 'prod' ? 'production' : 'staging';

  // Remove the trailing slash from the base url if present
  const edgePrefix = getApiGatewayUrl().replace(/\/gateway\/api$/, '');

  const suggestedSiteNamesPlugin = createGetSuggestedSiteNamesPlugin(async () =>
    getSuggestedSiteNames(ent, teams, member),
  );

  const onError = useCallback((err: Error) => {
    sendErrorEvent(err, {
      tags: {
        ownershipArea: 'trello-web-eng',
      },
      extraData: {
        component: 'CrossFlowProvider',
      },
    });
  }, []);

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-web-eng',
        feature: 'Cross Flow Provider',
      }}
      sendCrashEvent={false}
    >
      <TrelloCrossFlowProvider
        // @ts-expect-error
        analyticsClient={getAnalyticsClientMemberIdProxy()}
        locale={currentLocale}
        edgePrefix={edgePrefix}
        isAaMastered={true}
        env={env}
        plugins={[suggestedSiteNamesPlugin]}
        onError={onError}
      >
        {children}
      </TrelloCrossFlowProvider>
    </ErrorBoundary>
  );
};
