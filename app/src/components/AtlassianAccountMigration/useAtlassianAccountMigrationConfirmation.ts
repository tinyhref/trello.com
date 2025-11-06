import { useCallback, useEffect, useState } from 'react';

import { RequiresAaOnboardingTemplates as Templates } from '@trello/aa-migration';
import { getQueryParameter, removeQueryParameters } from '@trello/urls';

import { useAtlassianAccountMigrationQuery } from './AtlassianAccountMigrationQuery.generated';

interface Options {
  skip?: boolean;
}

export function useAtlassianAccountMigrationConfirmation({
  skip = false,
}: Options = {}) {
  // eslint-disable-next-line @eslint-react/naming-convention/use-state -- This state is not used, but it is needed to make the render reactive to confirmation overlay changes.
  const [, setShouldShowConfirmation] = useState(false);

  const dataHook = useAtlassianAccountMigrationQuery({
    variables: { memberId: 'me' },
    skip,
    waitOn: ['MemberHeader'],
  });

  const me = dataHook.data?.member;
  const template = me?.requiresAaOnboarding?.template;

  useEffect(() => {
    const shouldShowConfirmationOverlay =
      getQueryParameter('onboarding') === 'success';

    setShouldShowConfirmation(shouldShowConfirmationOverlay);
  }, []);

  const renderConfirmation = () => {
    // Never show the confirmation dialog to users who are not Aa-governed.
    if (!me?.isAaMastered) {
      return false;
    }

    if (
      template === Templates.ENTERPRISE ||
      template === Templates.DOMAIN_CLAIM ||
      template === Templates.INACTIVE
    ) {
      return true;
    }

    return false;
  };

  const dismissConfirmation = useCallback(() => {
    removeQueryParameters('onboarding');
    setShouldShowConfirmation(false);
  }, []);

  const shouldRender = renderConfirmation();

  return {
    me,
    shouldRender,
    dismissConfirmation,
  };
}
