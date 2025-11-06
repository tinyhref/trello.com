import { useIntl, type IntlShape } from 'react-intl';

import CalendarIcon from '@atlaskit/icon/core/calendar';
import CalendarPlusIcon from '@atlaskit/icon/core/calendar-plus';
import InboxIcon from '@atlaskit/icon/core/inbox';
import PaintBucketIcon from '@atlaskit/icon/core/paint-bucket';
import ShrinkHorizontalIcon from '@atlaskit/icon/core/shrink-horizontal';
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

const formatFeatureTooltips = (key: FeatureKeysStrings, intl: IntlShape) => {
  const intlConfig = getPersonalProductivityIntlObject(
    'feature-tooltips-personal-productivity',
    key,
  );

  if (!intlConfig) {
    return '';
  }

  return formatCharEntityRef(intl.formatMessage(intlConfig));
};

const formatFeatureList = (key: FeatureKeysStrings, intl: IntlShape) => {
  const intlConfig = getPersonalProductivityIntlObject(
    'feature-list-personal-productivity',
    key,
  );

  if (!intlConfig) {
    return '';
  }

  return formatCharEntityRef(intl.formatMessage(intlConfig));
};

export const refreshFeatures = (intl: IntlShape): FeatureItem[] => {
  const unlimitedString = intl.formatMessage({
    id: 'templates.billing_page_one.unlimited',
    defaultMessage: 'Unlimited',
    description: 'Unlimited',
  });

  return [
    {
      key: 'unlimited-cards',
      featureName: formatFeatureList('unlimited-cards', intl),
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
      key: 'inbox',
      featureName: formatFeatureList('inbox', intl),
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
      toolTipTxt: formatFeatureTooltips('inbox', intl),
    },
    {
      key: 'quick-capture',
      featureName: formatFeatureList('quick-capture', intl),
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
      toolTipTxt: formatFeatureTooltips('quick-capture-teams', intl),
    },
    {
      key: 'quick-capture-with-ai-summaries',
      featureName: formatFeatureList('quick-capture-with-ai-summaries', intl),
      featureIcon: AtlassianIntelligenceIcon,
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
      toolTipTxt: formatFeatureTooltips(
        'quick-capture-with-ai-summaries',
        intl,
      ),
    },
    {
      key: 'boards',
      featureName: formatFeatureList('boards', intl),
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
      toolTipTxt: formatFeatureTooltips('boards', intl),
    },
    {
      key: 'collaborators',
      featureName: formatFeatureList('collaborators', intl),
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
      toolTipTxt: formatFeatureTooltips('collaborators', intl),
    },
    {
      key: 'planner',
      featureName: formatFeatureList('planner', intl),
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
      toolTipTxt: formatFeatureTooltips('planner', intl),
    },
    {
      key: 'advanced-planner',
      featureName: formatFeatureList('advanced-planner', intl),
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
      toolTipTxt: formatFeatureTooltips('advanced-planner', intl),
    },
    {
      key: 'collapsible-lists',
      featureName: formatFeatureList('collapsible-lists', intl),
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
      toolTipTxt: formatFeatureTooltips('collapsible-lists', intl),
    },
    {
      key: 'list-colors',
      featureName: formatFeatureList('list-colors', intl),
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
      toolTipTxt: formatFeatureTooltips('list-colors', intl),
    },
    {
      key: 'custom-fields',
      featureName: formatFeatureList('custom-fields', intl),
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
      toolTipTxt: formatFeatureTooltips('custom-fields', intl),
    },
    {
      key: 'advanced-checklists',
      featureName: formatFeatureList('advanced-checklists', intl),
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
      toolTipTxt: formatFeatureTooltips('advanced-checklists', intl),
    },
    {
      key: 'automation-1',
      featureName: formatFeatureList('automation-1', intl),
      featureIcon: ButlerBotIcon,
      free: {
        text: localizeCount('workspace automation runs', 250),
        check: false,
        toolTipTxt: formatFeatureTooltips('automation-definition', intl),
      },
      standard: {
        standaloneText: localizeCount(
          'workspace-automation-runs-per-month',
          1000,
        ),
        text: localizeCount('workspace automation runs', 1000),
        check: false,
        toolTipTxt: formatFeatureTooltips('automation-definition', intl),
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
        toolTipTxt: formatFeatureTooltips('automation-definition', intl),
      },
      enterprise: {
        text: intl.formatMessage({
          id: 'templates.billing_page_one.billing-feature-list.unlimited-workspace-automation-runs',
          defaultMessage: 'Unlimited Workspace automation runs',
          description: 'Unlimited workspace automation runs',
        }),
        check: false,
        toolTipTxt: formatFeatureTooltips('automation-definition', intl),
      },
      toolTipTxt: formatFeatureTooltips('automation-1', intl),
    },
    {
      key: 'card-mirroring',
      featureName: formatFeatureList('card-mirroring', intl),
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
      toolTipTxt: formatFeatureTooltips('card-mirroring', intl),
    },
    {
      key: 'data-exports', // data exports
      featureName: formatFeatureList('data-exports', intl),
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
      toolTipTxt: formatFeatureTooltips('data-exports', intl),
    },
    {
      key: 'workspace-board-templates',
      featureName: formatFeatureList('workspace-board-templates', intl),
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
      toolTipTxt: formatFeatureTooltips('workspace-board-templates', intl),
    },
    {
      key: 'workspace-views',
      featureName: formatFeatureList('workspace-views', intl),
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
      toolTipTxt: formatFeatureTooltips('workspace-views', intl),
    },
    {
      key: 'observers',
      featureName: formatFeatureList('observers', intl),
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
      toolTipTxt: formatFeatureTooltips('observers', intl),
    },
    {
      key: 'board-collections',
      featureName: formatFeatureList('board-collections', intl),
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
      toolTipTxt: formatFeatureTooltips('board-collections', intl),
    },
    {
      key: 'unlimited-powerups',
      featureName: formatFeatureList('unlimited-powerups', intl),
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
      toolTipTxt: formatFeatureTooltips('unlimited-powerups', intl),
    },
    {
      key: 'file-attachments',
      featureName: formatFeatureList('file-attachments', intl),
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
      key: 'custom-backgrounds',
      featureName: formatFeatureList('custom-backgrounds', intl),
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
      toolTipTxt: formatFeatureTooltips('custom-backgrounds', intl),
    },
    {
      key: 'stickers-emojis',
      featureName: formatFeatureList('stickers-emojis', intl),
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
      toolTipTxt: formatFeatureTooltips('stickers-emojis', intl),
    },
    {
      key: 'saved-searches',
      featureName: formatFeatureList('saved-searches', intl),
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
      toolTipTxt: formatFeatureTooltips('saved-searches', intl),
    },
    {
      key: 'unlimited-cards-with-ai',
      featureName: formatFeatureList('unlimited-cards-with-ai', intl),
      featureIcon: AtlassianIntelligenceIcon,
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
      toolTipTxt: formatFeatureTooltips('unlimited-cards-with-ai', intl),
    },
    {
      key: 'jira-lists',
      featureName: formatFeatureList('jira-lists', intl),
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
      toolTipTxt: formatFeatureTooltips('jira-lists', intl),
    },
    {
      key: 'table',
      featureName: formatFeatureList('table', intl),
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
      toolTipTxt: formatFeatureTooltips('table', intl),
    },
    {
      key: 'timeline',
      featureName: formatFeatureList('timeline', intl),
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
      toolTipTxt: formatFeatureTooltips('timeline', intl),
    },
    {
      key: 'dashboard',
      featureName: formatFeatureList('dashboard', intl),
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
      toolTipTxt: formatFeatureTooltips('dashboard', intl),
    },
    {
      key: 'map',
      featureName: formatFeatureList('map', intl),
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
      toolTipTxt: formatFeatureTooltips('map', intl),
    },
    {
      key: 'unlimited-workspaces',
      featureName: formatFeatureList('unlimited-workspaces', intl),
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
      toolTipTxt: formatFeatureTooltips('unlimited-workspaces', intl),
    },
    {
      key: 'powerup-administration',
      featureName: formatFeatureList('powerup-administration', intl),
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
      toolTipTxt: formatFeatureTooltips('powerup-administration', intl),
    },
    {
      key: 'attachment-restrictions',
      featureName: formatFeatureList('attachment-restrictions', intl),
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
      toolTipTxt: formatFeatureTooltips('attachment-restrictions', intl),
    },
    {
      key: 'organization-wide permissions',
      featureName: formatFeatureList('organization-wide permissions', intl),
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
      toolTipTxt: formatFeatureTooltips('organization-wide permissions', intl),
    },
    {
      key: 'organization-visible-boards',
      featureName: formatFeatureList('organization-visible-boards', intl),
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
      toolTipTxt: formatFeatureTooltips('organization-visible-boards', intl),
    },
    {
      key: 'public-board-management',
      featureName: formatFeatureList('public-board-management', intl),
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
      toolTipTxt: formatFeatureTooltips('public-board-management', intl),
    },
    {
      key: 'admin-security-features',
      featureName: formatFeatureList('admin-security-features', intl),
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
      toolTipTxt: formatFeatureTooltips('admin-security-features', intl),
    },
    {
      key: 'priority-support',
      featureName: formatFeatureList('priority-support', intl),
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
      toolTipTxt: formatFeatureTooltips('priority-support', intl),
    },
    {
      key: 'saml-sso',
      featureName: formatFeatureList('saml-sso', intl),
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
      toolTipTxt: formatFeatureTooltips('saml-sso', intl),
    },
  ];
};

export const useMonetizationMessagingRefreshFeatures = () => {
  const intl = useIntl();
  return refreshFeatures(intl);
};
