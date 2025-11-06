import type { FunctionComponent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { checkUserNeedsSyncUnblocked } from '@trello/aa-migration';
import type { EventAttributes, SourceType } from '@trello/analytics-types';
import { formatContainers } from '@trello/atlassian-analytics';
import {
  avatarsFromAvatarUrl,
  getNonPublicIfAvailable,
} from '@trello/business-logic/member';
import {
  dangerouslyConvertPrivacyString,
  EMPTY_PII_STRING,
} from '@trello/privacy';

import { AtlassianAccountMigrationConfirmationDialog } from './AtlassianAccountMigrationConfirmationDialog';
import { useAtlassianAccountMigrationConfirmation } from './useAtlassianAccountMigrationConfirmation';

interface MigrationAnalyticsContext extends EventAttributes {
  organizationId?: string | null;
  totalEmailAddresses?: number;
  totalClaimableEmailAddresses?: number;
  isProfileSyncUnblocked?: boolean | null;
  isSsoEnforced?: boolean | null;
}

export interface AtlassianAccountMigrationConfirmationProps {
  forceShow?: boolean;
  wasInactiveMigration: boolean;
  wasEnterpriseMigration: boolean;
}

const getAnalyticsSource = (
  wasInactiveMigration: boolean,
  wasEnterpriseMigration: boolean,
): SourceType => {
  if (wasInactiveMigration) return 'aaInactiveMigrationConfirmationScreen';
  if (wasEnterpriseMigration) return 'aaEnterpriseMigrationConfirmationScreen';
  return 'unknown';
};

export const AtlassianAccountMigrationConfirmationOverlay: FunctionComponent<
  AtlassianAccountMigrationConfirmationProps
> = ({ forceShow, wasInactiveMigration, wasEnterpriseMigration }) => {
  const analyticsContext: MigrationAnalyticsContext = useMemo(() => {
    return {
      organizationId: null,
      isProfileSyncUnblocked: null,
      isSsoEnforced: null,
    };
  }, []);

  const [enterpriseName, setEnterpriseName] = useState('');
  const [isSsoEnforced, setIsSsoEnforced] = useState(false);

  const { me, shouldRender, dismissConfirmation } =
    useAtlassianAccountMigrationConfirmation();

  const analyticsSource = getAnalyticsSource(
    wasInactiveMigration,
    wasEnterpriseMigration,
  );

  const atlassianProfileName =
    me?.requiresAaOnboarding?.profile?.fullName ??
    getNonPublicIfAvailable(me ?? {}, 'fullName');

  // Fallback to showing the Trello avatar just in case we don't
  // get an avatarUrl back for the Aa profile
  const trelloAvatarUrl =
    dangerouslyConvertPrivacyString(
      getNonPublicIfAvailable(me ?? {}, 'avatarUrl'),
    ) ?? '';
  const fallbackAvatarUrl = avatarsFromAvatarUrl(trelloAvatarUrl)[170];

  const atlassianProfileAvatar =
    me?.requiresAaOnboarding?.profile?.avatarUrl ?? fallbackAvatarUrl;

  const logins = useMemo(() => {
    return [...(me?.logins || [])];
  }, [me?.logins]);

  const enterprise = useMemo(() => {
    return me?.enterprises?.find((ent) => {
      return ent.id === me.idEnterprise;
    });
  }, [me?.idEnterprise, me?.enterprises]);

  const analyticsContainers = useMemo(() => {
    return formatContainers({
      idEnterprise: me?.idEnterprise,
    });
  }, [me?.idEnterprise]);

  useEffect(() => {
    const aaBlockSyncUntil = me?.aaBlockSyncUntil;
    const needsSyncUnblocked = checkUserNeedsSyncUnblocked(aaBlockSyncUntil);
    const profileSyncUnblocked = !!aaBlockSyncUntil && !needsSyncUnblocked;
    analyticsContext.isProfileSyncUnblocked = profileSyncUnblocked;

    if (enterprise) {
      const ssoOnly = !!enterprise.prefs?.ssoOnly;
      setEnterpriseName(enterprise.displayName);
      setIsSsoEnforced(ssoOnly);

      analyticsContext.isSsoEnforced = ssoOnly;
      analyticsContext.organizationId = enterprise.id;
    }

    if (logins) {
      analyticsContext.totalEmailAddresses = logins.length;
      analyticsContext.totalClaimableEmailAddresses = logins.filter(
        (l) => l.claimable,
      ).length;
    }
  }, [analyticsContext, me?.aaBlockSyncUntil, enterprise, logins]);

  const onDismiss = useCallback(() => {
    dismissConfirmation();
  }, [dismissConfirmation]);

  if (!shouldRender && !forceShow) {
    return null;
  }

  return (
    <AtlassianAccountMigrationConfirmationDialog
      id={me?.id || ''}
      atlassianProfileName={atlassianProfileName || EMPTY_PII_STRING}
      atlassianProfileEmail={me?.email || EMPTY_PII_STRING}
      atlassianProfileAvatar={atlassianProfileAvatar || ''}
      enterpriseName={enterpriseName}
      isSsoEnforced={isSsoEnforced}
      wasInactiveMigration={wasInactiveMigration}
      wasEnterpriseMigration={wasEnterpriseMigration}
      onDismiss={onDismiss}
      analyticsSource={analyticsSource}
      analyticsContext={analyticsContext}
      analyticsContainers={analyticsContainers}
    />
  );
};
