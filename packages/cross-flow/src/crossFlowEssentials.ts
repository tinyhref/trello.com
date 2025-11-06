import type { TargetType } from '@atlassiansox/cross-flow-support';
import { Targets } from '@atlassiansox/cross-flow-support';
import { wacUrl } from '@trello/config';
import type { PIIString } from '@trello/privacy';
import { dangerouslyConvertPrivacyString } from '@trello/privacy';

type UtmParams = {
  campaign: UtmCampaign;
};

export const UtmCampaigns = {
  ATLASSIAN_SWITCHER: 'atlassian_switcher',
  PRODUCT_STORE: 'product_store',
  CROSSFLOW_ESSENTIALS: 'cross_flow_essentials_v2',
  TOUCHPOINTS_JSW_BOARD: 'trello_jsw_touchpoints_board',
  TOUCHPOINTS_JSW_POWERUPS: 'trello_jsw_touchpoints_powerups',
  TOUCHPOINTS_JSW_SWITCHER: 'trello_jsw_touchpoints_switcher',
  TOUCHPOINTS_CONFLUENCE_SWITCHER: 'trello_confluence_touchpoints_switcher',
  TOUCHPOINTS_CONFLUENCE_POWERUPS: 'trello_confluence_touchpoints_powerups',
} as const;
type UtmCampaign = (typeof UtmCampaigns)[keyof typeof UtmCampaigns];

export const AUTO_OPEN_CFFE_STORAGE_KEY = 'autoOpenCFFE';

const getUtmQueryParams = ({ campaign }: UtmParams) =>
  `utm_source=trello&utm_medium=in_product_ad&utm_campaign=${campaign}`;

export const setLocationToWacSoftware = (params: UtmParams): void => {
  const utmQueryParams = getUtmQueryParams(params);
  window.open(`${wacUrl}/software?${utmQueryParams}`, '_blank');
};

export const setLocationToTryProduct = (
  productKey: TargetType,
  utmParams: UtmParams,
): void => {
  const utmQueryParams = getUtmQueryParams(utmParams);

  if (productKey === Targets.OPSGENIE) {
    window.open(`${wacUrl}/software/opsgenie/try?${utmQueryParams}`, '_blank');
    return;
  }
  const bundles: Record<string, string> = {
    [Targets.JIRA_SOFTWARE]: 'jira-software',
    [Targets.JIRA_SERVICE_DESK]: 'jira-service-desk',
    [Targets.CONFLUENCE]: 'confluence',
  };
  const bundleKey = bundles[productKey];
  if (bundleKey) {
    window.open(
      `${wacUrl}/try/cloud/signup?bundle=${bundleKey}&edition=free&${utmQueryParams}`,
      '_blank',
    );
  } else {
    setLocationToWacSoftware(utmParams);
  }
};

export const getSuggestedSiteNames = (
  enterprises: {
    displayName: string;
    id: string;
  }[],
  teams: {
    displayName: string;
    idEnterprise?: string | null;
  }[],
  user?: {
    fullName?: PIIString;
  },
) => {
  const suggestedNames = [];

  function addToNamesArray(value: string) {
    if (suggestedNames.length < 5) {
      suggestedNames.push(value);
    }
  }

  for (const enterprise of enterprises) {
    if (suggestedNames.length === 5) {
      break;
    }

    suggestedNames.push(enterprise.displayName); // Add enterprise names

    const enterpriseTeams = teams.filter(
      (team) => team.idEnterprise === enterprise.id,
    );
    enterpriseTeams.forEach((team) => {
      addToNamesArray(`${enterprise.displayName}-${team.displayName}`); // Add enterprise-teamname names
    });
    enterpriseTeams.forEach((team) => {
      addToNamesArray(team.displayName);
    }); // Add team names that belong to the enterprise
  }

  teams.forEach((team) => {
    if (!team.idEnterprise) {
      addToNamesArray(team.displayName); // Add teams that don't belong to enterprise
    }
  });

  if (user?.fullName) {
    addToNamesArray(dangerouslyConvertPrivacyString(user.fullName)); // add user name
  }

  return suggestedNames;
};

export const getCrossFlowEssentialsV2Props = (flag: string) => {
  switch (flag) {
    case 'variation-free':
      return { isCrossFlowV2Enabled: true, edition: 'free' };
    case 'variation-standard':
      return { isCrossFlowV2Enabled: true, edition: 'standard' };
    default:
      return { isCrossFlowV2Enabled: false };
  }
};
