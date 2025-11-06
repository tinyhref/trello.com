import CalendarIcon from '@atlaskit/icon/core/calendar';
import CalendarPlusIcon from '@atlaskit/icon/core/calendar-plus';
import InboxIcon from '@atlaskit/icon/core/inbox';
import PaintBucketIcon from '@atlaskit/icon/core/paint-bucket';
import ShrinkHorizontalIcon from '@atlaskit/icon/core/shrink-horizontal';
import { intl } from '@trello/i18n';
import { localizeCount } from '@trello/legacy-i18n';
import { asNumber } from '@trello/legacy-i18n/formatters';
import { AddIcon } from '@trello/nachos/icons/add';
import { AddMemberIcon } from '@trello/nachos/icons/add-member';
import { AdminChevronIcon } from '@trello/nachos/icons/admin-chevron';
import { AtlassianIntelligenceIcon } from '@trello/nachos/icons/atlassian-intelligence';
import { AttachmentIcon } from '@trello/nachos/icons/attachment';
import { BoardIcon } from '@trello/nachos/icons/board';
import { BoardCollectionIcon } from '@trello/nachos/icons/board-collection';
import { ButlerBotIcon } from '@trello/nachos/icons/butler-bot';
import { CardIcon } from '@trello/nachos/icons/card';
import { ChecklistIcon } from '@trello/nachos/icons/checklist';
import { CustomFieldIcon } from '@trello/nachos/icons/custom-field';
import { DashboardIcon } from '@trello/nachos/icons/dashboard';
import { HeartIcon } from '@trello/nachos/icons/heart';
import { ImageIcon } from '@trello/nachos/icons/image';
import { LocationIcon } from '@trello/nachos/icons/location';
import { OrganizationIcon } from '@trello/nachos/icons/organization';
import { OrganizationVisibleIcon } from '@trello/nachos/icons/organization-visible';
import { PowerUpIcon } from '@trello/nachos/icons/power-up';
import { PrivateIcon } from '@trello/nachos/icons/private';
import { PublicIcon } from '@trello/nachos/icons/public';
import { SearchIcon } from '@trello/nachos/icons/search';
import { ShareIcon } from '@trello/nachos/icons/share';
import { SparkleIcon } from '@trello/nachos/icons/sparkle';
import { StickerIcon } from '@trello/nachos/icons/sticker';
import { SubscribeIcon } from '@trello/nachos/icons/subscribe';
import { TableIcon } from '@trello/nachos/icons/table';
import { TemplateBoardIcon } from '@trello/nachos/icons/template-board';
import { TimelineIcon } from '@trello/nachos/icons/timeline';
import { formatCharEntityRef } from '@trello/strings';

import type { FeatureItem, FeatureKeysStrings } from './getFeatures';
import { getPersonalProductivityIntlObject } from './getPersonalProductivityIntlObject';

const formatFeatureTooltips = (key: FeatureKeysStrings) => {
  const intlConfig = getPersonalProductivityIntlObject(
    'feature-tooltips-personal-productivity',
    key,
  );

  if (!intlConfig) {
    return '';
  }

  return formatCharEntityRef(intl.formatMessage(intlConfig));
};

const formatFeatureList = (key: FeatureKeysStrings) => {
  const intlConfig = getPersonalProductivityIntlObject(
    'feature-list-personal-productivity',
    key,
  );

  if (!intlConfig) {
    return '';
  }

  return formatCharEntityRef(intl.formatMessage(intlConfig));
};

const unlimitedString = intl.formatMessage({
  id: 'templates.billing_page_one.unlimited',
  defaultMessage: 'Unlimited',
  description: 'Unlimited',
});

export const personalProductivityFeatures: FeatureItem[] = [
  {
    key: 'unlimited-cards',
    featureName: formatFeatureList('unlimited-cards'),
    featureIcon: CardIcon,
    free: {
      check: true,
    },
    standard: {
      check: true,
    },
    business: {
      check: true,
    },
    enterprise: {
      check: true,
    },
  },
  {
    key: 'quick-capture',
    featureName: formatFeatureList('quick-capture'),
    featureIcon: AddIcon,
    free: {
      check: true,
    },
    standard: {
      check: true,
    },
    business: {
      check: true,
    },
    enterprise: {
      check: true,
    },
    toolTipTxt: formatFeatureTooltips('quick-capture'),
  },
  {
    key: 'inbox',
    featureName: formatFeatureList('inbox'),
    featureIcon: InboxIcon,
    free: {
      check: true,
    },
    standard: {
      check: true,
    },
    business: {
      check: true,
    },
    enterprise: {
      check: true,
    },
    toolTipTxt: formatFeatureTooltips('inbox'),
  },
  {
    key: 'planner',
    featureName: formatFeatureList('planner'),
    featureIcon: CalendarIcon,
    free: {
      check: true,
    },
    standard: {
      check: true,
    },
    business: {
      check: true,
    },
    enterprise: {
      check: true,
    },
    toolTipTxt: formatFeatureTooltips('planner'),
  },
  {
    key: 'advanced-planner',
    featureName: formatFeatureList('advanced-planner'),
    featureIcon: CalendarPlusIcon,
    free: {
      check: false,
    },
    standard: {
      check: true,
    },
    business: {
      check: true,
    },
    enterprise: {
      check: true,
    },
    toolTipTxt: formatFeatureTooltips('advanced-planner'),
  },
  {
    key: 'card-mirroring',
    featureName: formatFeatureList('card-mirroring'),
    featureIcon: CardIcon,
    free: {
      check: false,
    },
    standard: {
      check: true,
    },
    business: {
      check: true,
    },
    enterprise: {
      check: true,
    },
    toolTipTxt: formatFeatureTooltips('card-mirroring'),
  },
  {
    key: 'collapsible-lists',
    featureName: formatFeatureList('collapsible-lists'),
    featureIcon: ShrinkHorizontalIcon,
    free: {
      check: false,
    },
    standard: {
      check: true,
    },
    business: {
      check: true,
    },
    enterprise: {
      check: true,
    },
    toolTipTxt: formatFeatureTooltips('collapsible-lists'),
  },
  {
    key: 'list-colors',
    featureName: formatFeatureList('list-colors'),
    featureIcon: PaintBucketIcon,
    free: {
      check: false,
    },
    standard: {
      check: true,
    },
    business: {
      check: true,
    },
    enterprise: {
      check: true,
    },
    toolTipTxt: formatFeatureTooltips('list-colors'),
  },
  {
    key: 'atlassian-intelligence',
    featureName: formatFeatureList('atlassian-intelligence'),
    featureIcon: AtlassianIntelligenceIcon,
    free: {
      check: false,
    },
    standard: {
      check: false,
    },
    business: {
      check: true,
    },
    enterprise: {
      check: true,
    },
    toolTipTxt: formatFeatureTooltips('atlassian-intelligence'),
  },

  {
    key: 'unlimited-powerups',
    featureName: formatFeatureList('unlimited-powerups'),
    featureIcon: PowerUpIcon,
    free: {
      check: true,
    },
    standard: {
      check: true,
    },
    business: {
      check: true,
    },
    enterprise: {
      check: true,
    },
    toolTipTxt: formatFeatureTooltips('unlimited-powerups'),
  },
  {
    key: 'collaborators',
    featureName: formatFeatureList('collaborators'),
    featureIcon: OrganizationIcon,
    free: {
      text: asNumber(10),
    },
    standard: {
      text: unlimitedString,
    },
    business: {
      text: unlimitedString,
    },
    enterprise: {
      text: unlimitedString,
    },
    toolTipTxt: formatFeatureTooltips('collaborators'),
  },
  {
    key: 'boards',
    featureName: formatFeatureList('boards'),
    featureIcon: BoardIcon,
    free: {
      text: asNumber(10),
      check: false,
    },
    standard: {
      standaloneText: intl.formatMessage({
        id: 'templates.billing_page_one.feature-list.boards',
        defaultMessage: 'Unlimited boards',
        description: 'Unlimited boards',
      }),
      text: unlimitedString,
      check: false,
    },
    business: {
      standaloneText: intl.formatMessage({
        id: 'templates.billing_page_one.feature-list.boards',
        defaultMessage: 'Unlimited boards',
        description: 'Unlimited boards',
      }),
      text: unlimitedString,
      check: false,
    },
    enterprise: {
      text: unlimitedString,
      check: false,
    },
    toolTipTxt: formatFeatureTooltips('boards'),
  },

  {
    key: 'automation-1',
    featureName: formatFeatureList('automation-1'),
    featureIcon: ButlerBotIcon,
    free: {
      text: localizeCount('workspace automation runs', 250),
      check: false,
      toolTipTxt: formatFeatureTooltips('automation-definition'),
    },
    standard: {
      standaloneText: localizeCount(
        'workspace-automation-runs-per-month',
        1000,
      ),
      text: localizeCount('workspace automation runs', 1000),
      check: false,
      toolTipTxt: formatFeatureTooltips('automation-definition'),
    },
    business: {
      standaloneText: intl.formatMessage({
        id: 'templates.billing_page_one.billing-feature-list.unlimited-workspace-automation-runs',
        defaultMessage: 'Unlimited Workspace automation runs',
        description: 'Unlimited workspace automation runs',
      }),
      text: intl.formatMessage({
        id: 'templates.billing_page_one.billing-feature-list.unlimited-workspace-automation-runs',
        defaultMessage: 'Unlimited Workspace automation runs',
        description: 'Unlimited workspace automation runs',
      }),
      check: false,
      toolTipTxt: formatFeatureTooltips('automation-definition'),
    },
    enterprise: {
      text: intl.formatMessage({
        id: 'templates.billing_page_one.billing-feature-list.unlimited-workspace-automation-runs',
        defaultMessage: 'Unlimited Workspace automation runs',
        description: 'Unlimited workspace automation runs',
      }),
      check: false,
      toolTipTxt: formatFeatureTooltips('automation-definition'),
    },
    toolTipTxt: formatFeatureTooltips('automation-1'),
  },
  {
    key: 'file-attachments',
    featureName: formatFeatureList('file-attachments'),
    featureIcon: AttachmentIcon,
    free: {
      text: localizeCount('per file', 10),
      check: false,
    },
    standard: {
      standaloneText: localizeCount('file attachments', 250),
      text: localizeCount('per file', 250),
      check: false,
    },
    business: {
      text: localizeCount('per file', 250),
      check: false,
    },
    enterprise: {
      text: localizeCount('per file', 250),
      check: false,
    },
  },
  {
    key: 'data-exports', // data exports
    featureName: formatFeatureList('data-exports'),
    featureIcon: ShareIcon,
    free: {
      check: false,
      text: intl.formatMessage({
        id: 'templates.billing_page_one.json-only',
        defaultMessage: 'JSON format only',
        description: 'JSON only',
      }),
    },
    standard: {
      check: false,
      text: intl.formatMessage({
        id: 'templates.billing_page_one.json-only',
        defaultMessage: 'JSON format only',
        description: 'JSON only',
      }),
    },
    business: {
      check: false,
      text: intl.formatMessage({
        id: 'templates.billing_page_one.json-and-csv',
        defaultMessage: 'JSON and CSV formats',
        description: 'JSON and CSV',
      }),
      standaloneText: intl.formatMessage({
        id: 'templates.billing_page_one.csv-data-export',
        defaultMessage: 'CSV data export',
        description: 'CSV data export',
      }),
    },
    enterprise: {
      check: false,
      text: intl.formatMessage({
        id: 'templates.billing_page_one.json-and-csv',
        defaultMessage: 'JSON and CSV formats',
        description: 'JSON and CSV',
      }),
      standaloneText: intl.formatMessage({
        id: 'templates.billing_page_one.csv-data-export',
        defaultMessage: 'CSV data export',
        description: 'CSV data export',
      }),
    },
    toolTipTxt: formatFeatureTooltips('data-exports'),
  },
  {
    key: 'custom-backgrounds',
    featureName: formatFeatureList('custom-backgrounds'),
    featureIcon: ImageIcon,
    free: {
      check: true,
    },
    standard: {
      check: true,
    },
    business: {
      check: true,
    },
    enterprise: {
      check: true,
    },
    toolTipTxt: formatFeatureTooltips('custom-backgrounds'),
  },
  {
    key: 'stickers-emojis',
    featureName: formatFeatureList('stickers-emojis'),
    featureIcon: StickerIcon,
    free: {
      check: true,
    },
    standard: {
      check: true,
    },
    business: {
      check: true,
    },
    enterprise: {
      check: true,
    },
    toolTipTxt: formatFeatureTooltips('stickers-emojis'),
  },
  {
    key: 'advanced-checklists',
    featureName: formatFeatureList('advanced-checklists'),
    featureIcon: ChecklistIcon,
    free: {
      check: false,
    },
    standard: {
      check: true,
    },
    business: {
      check: true,
    },
    enterprise: {
      check: true,
    },
    toolTipTxt: formatFeatureTooltips('advanced-checklists'),
  },
  {
    key: 'saved-searches',
    featureName: formatFeatureList('saved-searches'),
    featureIcon: SearchIcon,
    free: {
      check: false,
    },
    standard: {
      check: true,
    },
    business: {
      check: true,
    },
    enterprise: {
      check: true,
    },
    toolTipTxt: formatFeatureTooltips('saved-searches'),
  },
  {
    key: 'custom-fields',
    featureName: formatFeatureList('custom-fields'),
    featureIcon: CustomFieldIcon,
    free: {
      check: false,
    },
    standard: {
      check: true,
    },
    business: {
      check: true,
    },
    enterprise: {
      check: true,
    },
    toolTipTxt: formatFeatureTooltips('custom-fields'),
  },
  {
    key: 'jira-lists',
    featureName: formatFeatureList('jira-lists'),
    featureIcon: BoardIcon,
    free: {
      check: true,
    },
    standard: {
      check: true,
    },
    business: {
      check: true,
    },
    enterprise: {
      check: true,
    },
    toolTipTxt: formatFeatureTooltips('jira-lists'),
  },
  {
    key: 'admin-security-features',
    featureName: formatFeatureList('admin-security-features'),
    featureIcon: AdminChevronIcon,
    free: {
      check: false,
    },
    standard: {
      check: false,
    },
    business: {
      check: true,
    },
    enterprise: {
      check: true,
    },
    toolTipTxt: formatFeatureTooltips('admin-security-features'),
  },
  {
    key: 'board-collections',
    featureName: formatFeatureList('board-collections'),
    featureIcon: TemplateBoardIcon,
    free: {
      check: false,
    },
    standard: {
      check: false,
    },
    business: {
      check: true,
    },
    enterprise: {
      check: true,
    },
    toolTipTxt: formatFeatureTooltips('board-collections'),
  },
  {
    key: 'table',
    featureName: formatFeatureList('table'),
    featureIcon: TableIcon,
    free: {
      check: false,
    },
    standard: {
      check: false,
    },
    business: {
      check: true,
    },
    enterprise: {
      check: true,
    },
    toolTipTxt: formatFeatureTooltips('table'),
  },
  {
    key: 'timeline',
    featureName: formatFeatureList('timeline'),
    featureIcon: TimelineIcon,
    free: {
      check: false,
    },
    standard: {
      check: false,
    },
    business: {
      check: true,
    },
    enterprise: {
      check: true,
    },
    toolTipTxt: formatFeatureTooltips('timeline'),
  },
  {
    key: 'dashboard',
    featureName: formatFeatureList('dashboard'),
    featureIcon: DashboardIcon,
    free: {
      check: false,
    },
    standard: {
      check: false,
    },
    business: {
      check: true,
    },
    enterprise: {
      check: true,
    },
    toolTipTxt: formatFeatureTooltips('dashboard'),
  },
  {
    key: 'map',
    featureName: formatFeatureList('map'),
    featureIcon: LocationIcon,
    free: {
      check: false,
    },
    standard: {
      check: false,
    },
    business: {
      check: true,
    },
    enterprise: {
      check: true,
    },
    toolTipTxt: formatFeatureTooltips('map'),
  },
  {
    key: 'workspace-board-templates',
    featureName: formatFeatureList('workspace-board-templates'),
    featureIcon: BoardCollectionIcon,
    free: {
      check: false,
    },
    standard: {
      check: false,
    },
    business: {
      check: true,
    },
    enterprise: {
      check: true,
    },
    toolTipTxt: formatFeatureTooltips('workspace-board-templates'),
  },
  {
    key: 'observers',
    featureName: formatFeatureList('observers'),
    featureIcon: SubscribeIcon,
    free: {
      check: false,
    },
    standard: {
      check: false,
    },
    business: {
      check: true,
    },
    enterprise: {
      check: true,
    },
    toolTipTxt: formatFeatureTooltips('observers'),
  },
  {
    key: 'priority-support',
    featureName: formatFeatureList('priority-support'),
    featureIcon: HeartIcon,
    free: {
      check: false,
    },
    standard: {
      check: false,
    },
    business: {
      check: true,
    },
    enterprise: {
      check: true,
    },
    toolTipTxt: formatFeatureTooltips('priority-support'),
  },
  {
    key: 'unlimited-workspaces',
    featureName: formatFeatureList('unlimited-workspaces'),
    featureIcon: SparkleIcon,
    free: {
      check: false,
    },
    standard: {
      check: false,
    },
    business: {
      check: false,
    },
    enterprise: {
      check: true,
    },
    toolTipTxt: formatFeatureTooltips('unlimited-workspaces'),
  },
  {
    key: 'powerup-administration',
    featureName: formatFeatureList('powerup-administration'),
    featureIcon: PowerUpIcon,
    free: {
      check: false,
    },
    standard: {
      check: false,
    },
    business: {
      check: false,
    },
    enterprise: {
      check: true,
    },
    toolTipTxt: formatFeatureTooltips('powerup-administration'),
  },
  {
    key: 'saml-sso',
    featureName: formatFeatureList('saml-sso'),
    featureIcon: AddMemberIcon,
    free: {
      check: false,
      text: intl.formatMessage({
        id: 'templates.billing_page_one.available',
        defaultMessage: 'Available',
        description: 'Available',
      }),
    },
    standard: {
      check: false,
      text: intl.formatMessage({
        id: 'templates.billing_page_one.available',
        defaultMessage: 'Available',
        description: 'Available',
      }),
    },
    business: {
      check: false,
      text: intl.formatMessage({
        id: 'templates.billing_page_one.available',
        defaultMessage: 'Available',
        description: 'Available',
      }),
    },
    enterprise: {
      check: true,
    },
    toolTipTxt: formatFeatureTooltips('saml-sso'),
  },
  {
    key: 'attachment-restrictions',
    featureName: formatFeatureList('attachment-restrictions'),
    featureIcon: AttachmentIcon,
    free: {
      check: false,
    },
    standard: {
      check: false,
    },
    business: {
      check: false,
    },
    enterprise: {
      check: true,
    },
    toolTipTxt: formatFeatureTooltips('attachment-restrictions'),
  },
  {
    key: 'organization-wide permissions',
    featureName: formatFeatureList('organization-wide permissions'),
    featureIcon: PrivateIcon,
    free: {
      check: false,
    },
    standard: {
      check: false,
    },
    business: {
      check: false,
    },
    enterprise: {
      check: true,
    },
    toolTipTxt: formatFeatureTooltips('organization-wide permissions'),
  },
  {
    key: 'organization-visible-boards',
    featureName: formatFeatureList('organization-visible-boards'),
    featureIcon: OrganizationVisibleIcon,
    free: {
      check: false,
    },
    standard: {
      check: false,
    },
    business: {
      check: false,
    },
    enterprise: {
      check: true,
    },
    toolTipTxt: formatFeatureTooltips('organization-visible-boards'),
  },
  {
    key: 'public-board-management',
    featureName: formatFeatureList('public-board-management'),
    featureIcon: PublicIcon,
    free: {
      check: false,
    },
    standard: {
      check: false,
    },
    business: {
      check: false,
    },
    enterprise: {
      check: true,
    },
    toolTipTxt: formatFeatureTooltips('public-board-management'),
  },
];

export const getPersonalProductivityFeatures = () =>
  personalProductivityFeatures;
