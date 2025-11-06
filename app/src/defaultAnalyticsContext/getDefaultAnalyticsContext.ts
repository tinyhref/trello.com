import type { Login } from '@trello/business-logic/member';
import {
  getAccountType,
  getMaxPaidStatus,
} from '@trello/business-logic/member';
import { getPaidStatus } from '@trello/business-logic/organization';
import { getElapsedDaysFromId } from '@trello/dates';

// Contextual data types
export interface Member {
  id: string;
  logins: Login[];
  organizations: MemberOrganization[] | null;
}

export interface Organization {
  billableMemberCount?: number | null;
  id: string;
  offering: string;
  teamType?: string | null;
}

export interface Workspace {
  billableMemberCount?: number | null;
  id: string;
  offering: string;
  teamType?: string | null;
}
interface MemberOrganization {
  offering: string;
}

// Contextual default attribute types
interface DefaultMemberAttributes {
  accountType: 'business' | 'personal';
  maxPaidStatus: 'bc' | 'enterprise' | 'free' | 'standard';
}

interface DefaultOrgAttributes {
  billableMemberCount: number | null | undefined;
  paidStatus: 'bc' | 'enterprise' | 'free' | 'standard';
  teamAgeInDays: number;
  teamType: string | null | undefined;
}
interface DefaultWorkspaceAttributes {
  billableMemberCount: number | null | undefined;
  paidStatus: 'bc' | 'enterprise' | 'free' | 'standard';
  teamAgeInDays: number;
  teamType: string | null | undefined;
}
export interface DefaultAnalyticsContext {
  member?: DefaultMemberAttributes;
  organization?: DefaultOrgAttributes;
  workspace?: DefaultWorkspaceAttributes;
}

const getDefaultMemberAttributes = ({
  logins,
  organizations,
}: Member): DefaultMemberAttributes => {
  const accountType = getAccountType(logins);
  const maxPaidStatus = getMaxPaidStatus(organizations ?? []);

  return {
    accountType,
    maxPaidStatus,
  };
};

const getDefaultOrgAttributes = ({
  billableMemberCount,
  id,
  offering,
  teamType,
}: Organization): DefaultOrgAttributes => {
  const paidStatus = getPaidStatus(offering);
  const teamAgeInDays = getElapsedDaysFromId(id);

  return {
    billableMemberCount,
    paidStatus,
    teamAgeInDays,
    teamType,
  };
};

const getDefaultWorkspaceAttributes = ({
  billableMemberCount,
  id,
  offering,
  teamType,
}: Workspace): DefaultWorkspaceAttributes => {
  const paidStatus = getPaidStatus(offering);
  const teamAgeInDays = getElapsedDaysFromId(id);

  return {
    billableMemberCount,
    paidStatus,
    teamAgeInDays,
    teamType,
  };
};

export const getDefaultAnalyticsContext = ({
  member,
  organization,
  workspace,
}: {
  member?: Member | null;
  organization?: Organization | null;
  workspace?: Workspace | null;
}): DefaultAnalyticsContext => {
  const defaultAnalyticsContext: DefaultAnalyticsContext = {};

  if (member)
    defaultAnalyticsContext.member = getDefaultMemberAttributes(member);
  if (organization)
    defaultAnalyticsContext.organization =
      getDefaultOrgAttributes(organization);
  if (workspace)
    defaultAnalyticsContext.workspace =
      getDefaultWorkspaceAttributes(workspace);
  return defaultAnalyticsContext;
};
