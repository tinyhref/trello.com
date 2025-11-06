/* eslint-disable unicorn/filename-case */
import AutomationIcon from '@atlaskit/icon/core/automation';
import LockLockedIcon from '@atlaskit/icon/core/lock-locked';
import { intl } from '@trello/i18n';
import { AdminChevronIcon } from '@trello/nachos/icons/admin-chevron';
import { AtlassianIntelligenceIcon } from '@trello/nachos/icons/atlassian-intelligence';
import { AttachmentIcon } from '@trello/nachos/icons/attachment';
import { BoardIcon } from '@trello/nachos/icons/board';
import { ButlerBotIcon } from '@trello/nachos/icons/butler-bot';
import { CalendarIcon } from '@trello/nachos/icons/calendar';
import { CardIcon } from '@trello/nachos/icons/card';
import { ChecklistIcon } from '@trello/nachos/icons/checklist';
import { CollectionIcon } from '@trello/nachos/icons/collection';
import { CustomFieldIcon } from '@trello/nachos/icons/custom-field';
import { DownloadIcon } from '@trello/nachos/icons/download';
import { HeartIcon } from '@trello/nachos/icons/heart';
import { ListIcon } from '@trello/nachos/icons/list';
import { OrganizationVisibleIcon } from '@trello/nachos/icons/organization-visible';
import { SearchIcon } from '@trello/nachos/icons/search';
import { ShareIcon } from '@trello/nachos/icons/share';
import { TableIcon } from '@trello/nachos/icons/table';
import { ViewDashboardIcon } from '@trello/nachos/icons/view-dashboard';
import { ViewTableIcon } from '@trello/nachos/icons/view-table';
import { ViewTimelineIcon } from '@trello/nachos/icons/view-timeline';

export interface PlanFeature {
  icon: JSX.Element;
  feature: string;
  tooltip?: string;
}

export interface PlanFeatures {
  standard: PlanFeature[];
  standardPersonalProductivity: PlanFeature[];
  premium: PlanFeature[];
  premiumPersonalProductivity: PlanFeature[];
}

export const data: PlanFeatures = {
  standard: [
    {
      icon: <OrganizationVisibleIcon />,
      feature: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-standard.unlimited-collaborators',
        defaultMessage: 'Unlimited collaborators',
        description: 'unlimited collaborators',
      }),
    },
    {
      icon: <BoardIcon />,
      feature: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-standard.unlimited-boards',
        defaultMessage: 'Unlimited boards',
        description: 'unlimited boards',
      }),
    },
    {
      icon: <ChecklistIcon />,
      feature: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-standard.advanced-checklists',
        defaultMessage: 'Advanced checklists',
        description: 'advanced checlists',
      }),
      tooltip: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-standard.advanced-checklists-tooltip',
        defaultMessage:
          'Add dates and assign members with advanced checklists.',
        description: 'advanced checlists tooltip message',
      }),
    },
    {
      icon: <ListIcon />,
      feature: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-standard.collapsible-lists-and-list-colors',
        defaultMessage: 'Collapsible lists and list colors',
        description: 'collapsible list and colors',
      }),
    },
    {
      icon: <ButlerBotIcon />,
      feature: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-standard.more-automations',
        defaultMessage: 'More automations',
        description: 'More automations',
      }),
      tooltip: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-standard.more-automations-tooltip',
        defaultMessage: 'Get 1,000 command runs per month.',
        description: 'More automations tooltip message',
      }),
    },
    {
      icon: <AttachmentIcon />,
      feature: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-standard.file-attachments',
        defaultMessage: '250MB file attachments',
        description: '250mb file attachments',
      }),
    },
    {
      icon: <SearchIcon />,
      feature: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-standard.saved-searches',
        defaultMessage: 'Saved searches',
        description: 'Saved searches',
      }),
      tooltip: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-standard.saved-searches-tooltip',
        defaultMessage:
          'Save your most frequently used searches for easy access.',
        description: 'Saved searches tooltip message',
      }),
    },
    {
      icon: <CustomFieldIcon />,
      feature: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-standard.custom-fields',
        defaultMessage: 'Custom fields',
        description: 'custom fields',
      }),
      tooltip: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-standard.custom-fields-tooltip',
        defaultMessage:
          'Add custom dropdowns, checkboxes, and more to your cards.',
        description: 'custom fields tooltip message',
      }),
    },
  ],
  standardPersonalProductivity: [
    {
      icon: <BoardIcon />,
      feature: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-standard.unlimited-boards',
        defaultMessage: 'Unlimited boards',
        description: 'unlimited boards',
      }),
    },
    {
      icon: <CalendarIcon />,
      feature: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-standard.planner-full-access',
        defaultMessage: 'Planner (full access)',
        description: 'planner full access',
      }),
      tooltip: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-standard.planner-full-access-tooltip',
        defaultMessage:
          'Drag and drop cards on a calendar to block any available time. Sync with more events in your favorite tools.',
        description: 'planner full access tooltip message',
      }),
    },
    {
      icon: <ListIcon />,
      feature: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-standard.collapsible-lists-and-list-colors',
        defaultMessage: 'Collapsible lists and list colors',
        description: 'collapsible list and colors',
      }),
      tooltip: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-standard.collapsible-lists-tooltip',
        defaultMessage:
          'Collapse and expand lists. Choose different colors for each list in your board.',
        description: 'collapsible list and colors tooltip message',
      }),
    },
    {
      icon: <ChecklistIcon />,
      feature: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-standard.advanced-checklists',
        defaultMessage: 'Advanced checklists',
        description: 'advanced checlists',
      }),
      tooltip: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-standard.advanced-checklists-tooltip',
        defaultMessage:
          'Add dates and assign members with advanced checklists.',
        description: 'advanced checlists tooltip message',
      }),
    },
    {
      icon: <CustomFieldIcon />,
      feature: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-standard.custom-fields',
        defaultMessage: 'Custom fields',
        description: 'custom fields',
      }),
      tooltip: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-standard.custom-fields-tooltip',
        defaultMessage:
          'Add custom dropdowns, checkboxes, and more to your cards.',
        description: 'custom fields tooltip message',
      }),
    },
    {
      icon: <CardIcon />,
      feature: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-standard.card-mirroring',
        defaultMessage: 'Card mirroring',
        description: 'card mirroring',
      }),
      tooltip: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-standard.card-mirroring-tooltip',
        defaultMessage: 'View or edit cards from multiple boards.',
        description: 'card mirroring tooltip message',
      }),
    },
    {
      icon: <AtlassianIntelligenceIcon />,
      feature: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-standard.quick-capture-with-ai',
        defaultMessage: 'Quick capture with AI summaries',
        description: 'quick capture with ai summaries',
      }),
      tooltip: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-standard.quick-capture-with-ai-tooltip',
        defaultMessage:
          'AI turns messages from email, Slack, and Microsoft Teams into Trello cards with summaries, due dates, and checklist items.',
        description: 'quick capture with ai summaries tooltip message',
      }),
    },
    {
      icon: <AutomationIcon label="" />,
      feature: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-standard.automation',
        defaultMessage: 'Automation (1k runs/month)',
        description: 'Automation (1k runs/month)',
      }),
      tooltip: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-standard.more-automations-tooltip',
        defaultMessage: 'Get 1,000 command runs per month.',
        description: 'More automations tooltip message',
      }),
    },
  ],
  premium: [
    {
      icon: <ButlerBotIcon />,
      feature: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-premium.unlimited-automations',
        defaultMessage: 'Unlimited automations',
        description: 'unlimited automations',
      }),
      tooltip: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-premium.unlimited-automations-tooltip',
        defaultMessage:
          'Create powerful board automations and actions for your Workspace, with no coding required.',
        description: 'unlimited automations tooltip message',
      }),
    },
    {
      icon: <CollectionIcon />,
      feature: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-premium.board-collections',
        defaultMessage: 'Board collections',
        description: 'board collections',
      }),
      tooltip: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-premium.board-collections-tooltip',
        defaultMessage:
          'Easily group boards together whether by team, department, or major project.',
        description: 'board collections tooltip message',
      }),
    },
    {
      icon: <AdminChevronIcon />,
      feature: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-premium.admin-and-security-features',
        defaultMessage: 'Admin and security features',
        description: 'Admin and security features',
      }),
      tooltip: intl.formatMessage({
        id: 'templates.billing_page_one.feature-tooltips-repackaging-gtm.admin-security-features',
        defaultMessage:
          'Enable two-factor authentication, advanced admin permissions, domain-restricted invites, deactivate members, and Google apps sign-on.',
        description: 'Admin and security features tooltip message',
      }),
    },
    {
      icon: <DownloadIcon />,
      feature: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-premium.data-export',
        defaultMessage: 'Data export',
        description: 'data export',
      }),
      tooltip: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-premium.csv-data-export-tooltip',
        defaultMessage: 'Export board data.',
        description: 'csv data export tooltip message',
      }),
    },
    {
      icon: <ViewTableIcon />,
      feature: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-premium.table-view',
        defaultMessage: 'Table view',
        description: 'table view',
      }),
      tooltip: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-premium.table-view-tooltip',
        defaultMessage:
          'Display cards as rows and columns, like a spreadsheet.',
        description: 'table view tooltip message',
      }),
    },
    {
      icon: <ViewTimelineIcon />,
      feature: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-premium.timeline-view',
        defaultMessage: 'Timeline view',
        description: 'timeline view',
      }),
      tooltip: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-premium.timeline-view-tooltip',
        defaultMessage:
          'Visually plan time and workload, similar to a Gantt chart.',
        description: 'timeline view tooltip message',
      }),
    },
    {
      icon: <ViewDashboardIcon />,
      feature: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-premium.dashboard-view',
        defaultMessage: 'Dashboard view',
        description: 'dashboard view',
      }),
      tooltip: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-premium.dashboard-view-tooltip',
        defaultMessage:
          'Dig into the data with tiles to see workload, timing, and more about your workspace.',
        description: 'dashboard view tooltip message',
      }),
    },
    {
      icon: <HeartIcon />,
      feature: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-premium.priority-support',
        defaultMessage: 'Priority support',
        description: 'priority support',
      }),
      tooltip: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-premium.priority-support-tooltip',
        defaultMessage:
          'Get your questions answered within one business day, guaranteed.',
        description: 'priority support tooltip',
      }),
    },
  ],
  premiumPersonalProductivity: [
    {
      icon: <AutomationIcon label="" />,
      feature: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-premium.unlimited-automations',
        defaultMessage: 'Unlimited automations',
        description: 'unlimited automations',
      }),
      tooltip: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-premium.unlimited-automations-tooltip',
        defaultMessage:
          'Create powerful board automations and actions for your Workspace, with no coding required.',
        description: 'unlimited automations tooltip message',
      }),
    },
    {
      icon: <AtlassianIntelligenceIcon />,
      feature: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-premium.unlimited-cards-with-ai',
        defaultMessage: 'Unlimited cards with AI',
        description: 'unlimited cards with ai',
      }),
      tooltip: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-premium.unlimited-cards-with-ai-tooltip',
        defaultMessage:
          'Use AI-powered writing and edits for your card descriptions and comments.',
        description: 'unlimited cards with ai tooltip message',
      }),
    },
    {
      icon: <ShareIcon />,
      feature: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-premium.data-export',
        defaultMessage: 'Data export',
        description: 'data export',
      }),
      tooltip: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-premium.csv-data-export-tooltip',
        defaultMessage: 'Export board data.',
        description: 'data export tooltip message',
      }),
    },
    {
      icon: <AutomationIcon label="" />,
      feature: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-premium.workspace-level-templates',
        defaultMessage: 'Workspace-level templates',
        description: 'workspace-level templates',
      }),
      tooltip: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-premium.workspace-level-templates-tooltip',
        defaultMessage:
          'Create private and Workspace visible templates, just for you and other workspace members.',
        description: 'workspace-level templates tooltip message',
      }),
    },
    {
      icon: <TableIcon />,
      feature: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-premium.views',
        defaultMessage: 'Views: Timeline, Table, Dashboard, and Map',
        description: 'views: timeline, table, dashboard, and map',
      }),
      tooltip: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-premium.views-tooltip',
        defaultMessage:
          'Easily switch between views to see your data in different ways.',
        description: 'views tooltip message',
      }),
    },
    {
      icon: <CollectionIcon />,
      feature: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-premium.collections',
        defaultMessage: 'Collections',
        description: 'collections',
      }),
      tooltip: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-premium.collections-tooltip',
        defaultMessage:
          'Easily group boards together whether by team, department, or major project.',
        description: 'collections tooltip message',
      }),
    },
    {
      icon: <LockLockedIcon label="" />,
      feature: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-premium.security-features',
        defaultMessage: 'Admin and security features',
        description: 'admin and security features',
      }),
    },
    {
      icon: <HeartIcon />,
      feature: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-premium.priority-support',
        defaultMessage: 'Priority support',
        description: 'priority support',
      }),
      tooltip: intl.formatMessage({
        id: 'templates.end_of_trial_friction.plan-selection-modal-premium.priority-support-tooltip',
        defaultMessage:
          'Get your questions answered within one business day, guaranteed.',
        description: 'priority support tooltip',
      }),
    },
  ],
};
