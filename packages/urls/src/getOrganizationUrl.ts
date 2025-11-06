import type { Organization } from '@trello/model-types';
import type { PIIString } from '@trello/privacy';

interface LegacyOrganization {
  get: (key: 'name') => string;
}
type OrganizationUnion =
  | LegacyOrganization
  | Pick<Organization, 'name'>
  | PIIString
  | string
  | undefined;

const getOrganizationName = (organization: OrganizationUnion) => {
  if (!organization || typeof organization === 'string') {
    return organization || '';
  } else if (typeof (organization as LegacyOrganization)?.get === 'function') {
    return (organization as LegacyOrganization).get('name') ?? '';
  } else if (Object.prototype.hasOwnProperty.call(organization, 'name')) {
    return (organization as Organization).name ?? '';
  }
  return '';
};

export const getOrganizationUrl = (organization: OrganizationUnion) =>
  organization ? `/w/${getOrganizationName(organization)}` : '';

export const getOrganizationAccountUrl = (organization: OrganizationUnion) =>
  `${getOrganizationUrl(organization)}/account`;

export const getOrganizationBillingUrl = (
  organization: OrganizationUnion,
  options?: { returnUrl?: string; selected?: string },
) => {
  const url = `${getOrganizationUrl(organization)}/billing`;

  const search = new URLSearchParams(options).toString();
  return search ? `${url}?${search}` : url;
};

export const getOrganizationExportUrl = (organization: OrganizationUnion) =>
  `${getOrganizationUrl(organization)}/export`;

export const getOrganizationMembersUrl = (organization: OrganizationUnion) =>
  `${getOrganizationUrl(organization)}/members`;

export const getOrganizationFreeTrialUrl = (organization: OrganizationUnion) =>
  `${getOrganizationUrl(organization)}/free-trial`;

export const getOrganizationHomeUrl = (organization: OrganizationUnion) =>
  `${getOrganizationUrl(organization)}/home`;

export const getOrganizationReportsUrl = (organization: OrganizationUnion) =>
  `${getOrganizationUrl(organization)}/reports`;

export const getOrganizationGuestUrl = (organization: OrganizationUnion) =>
  `${getOrganizationUrl(organization)}/members/guests`;

export const getOrganizationRequestUrl = (organization: OrganizationUnion) =>
  `${getOrganizationUrl(organization)}/members/requests`;

export const getOrganizationPowerUpsUrl = (organization: OrganizationUnion) =>
  `${getOrganizationUrl(organization)}/power-ups`;

export const getOrganizationTablesUrl = (organization: OrganizationUnion) =>
  `${getOrganizationUrl(organization)}/tables`;

export const getWorkspaceDefaultCustomViewUrl = (
  organization: OrganizationUnion,
) => `${getOrganizationUrl(organization)}/views/table`;

export const getWorkspaceDefaultCustomCalendarViewUrl = (
  organization: OrganizationUnion,
  params: string = '',
) => `${getOrganizationUrl(organization)}/views/calendar${params}`;

export const getWorkspaceCustomTableViewUrl = (
  organization: OrganizationUnion,
  params = '?populate=',
) => `${getOrganizationUrl(organization)}/views/table${params}`;
