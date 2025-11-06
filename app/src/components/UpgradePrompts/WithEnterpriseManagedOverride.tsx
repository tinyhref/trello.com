import type { FunctionComponent, PropsWithChildren } from 'react';

import { useMemberId } from '@trello/authentication';
import { isLicensedManaged } from '@trello/enterprise';
import { ApolloProvider } from '@trello/graphql';
import { intl } from '@trello/i18n';

import { useWithEnterpriseManagedOverrideEnterpriseFragment } from './WithEnterpriseManagedOverrideFragment.generated';

export const BaseWithEnterpriseManagedOverride: FunctionComponent<
  PropsWithChildren
> = ({ children }) => {
  const { data } = useWithEnterpriseManagedOverrideEnterpriseFragment({
    from: {
      id: useMemberId(),
    },
  });

  const isLicensedAndManagedByEnterprise = isLicensedManaged(
    data?.idEnterprise ?? '',
    data?.enterprises ?? [],
    data?.enterpriseLicenses ?? [],
  );

  if (isLicensedAndManagedByEnterprise) {
    return intl.formatMessage({
      id: 'templates.request_workspace_upgrade.request-upgrade',
      defaultMessage: 'Request upgrade',
      description:
        'Copy for a CTA to request the workspace to be added to the enterprise',
    });
  }

  return children;
};

/**
 * This component is meant to wrap the copy of all the CTA's triggering an
 * upgrade prompt in order to account for the copy changes required for
 * enterprise managed members.
 *
 * If the member is not enterprised managed, the component will fallback to
 * rendering the copy that has been passed as the children prop.
 *
 * If you need to test a component that consumes this component, you can easily modify
 * the behavior of this component by mocking the `isLicensedManaged` function.
 *
 * If you need to test this component while also needing to mock a separate
 * export from the `app/src/components/UpgradePrompts` module, you don't need to
 * worry about overriding the mock for this component. The module already
 * handles this for you.
 */
export const WithEnterpriseManagedOverride: FunctionComponent<
  PropsWithChildren
> = ({ children, ...props }) => (
  <ApolloProvider>
    <BaseWithEnterpriseManagedOverride {...props}>
      {children}
    </BaseWithEnterpriseManagedOverride>
  </ApolloProvider>
);
