/**
 * Gets the config for the intl object for a given feature category and key in the personal productivity context
 * @param categoryKey - The category key, whether for tooltips or list
 * @param featureKey - The specific feature key (e.g. 'collaborators', 'boards')
 * @returns The config for the intl object
 */
export const getPersonalProductivityIntlObject = (
  categoryKey: string,
  featureKey: string,
) => {
  if (categoryKey === 'feature-tooltips-personal-productivity') {
    switch (featureKey) {
      case 'collaborators':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.collaborators',
          defaultMessage:
            'Collaborators include members, guests, and pending invitations.',
          description:
            'Collaborators include members, guests, and pending invitations.',
        };
      case 'boards':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.boards',
          defaultMessage:
            'Organize and manage your projects within your Workspace.',
          description:
            'Organize and manage your projects within your Workspace.',
        };
      case 'unlimited-powerups':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.unlimited-powerups',
          defaultMessage:
            'Add board features and connect to apps you already use like Google Drive, Slack, and more.',
          description:
            'Add board features and connect to apps you already use like Google Drive, Slack, and more.',
        };
      case 'automation-1':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.automation-1',
          defaultMessage:
            'Create powerful board automations and actions for your Workspace, with no coding required.',
          description:
            'Create powerful board automations and actions for your Workspace, with no coding required.',
        };
      case 'automation-definition':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.automation-definition',
          defaultMessage:
            'An automation run” is anytime a card button, board button, rule, or other automation takes place. For example, each time a card button is pressed, it’s one automation run.',
          description:
            'An automation run” is anytime a card button, board button, rule, or other automation takes place. For example, each time a card button is pressed, it’s one automation run.',
        };
      case 'custom-backgrounds':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.custom-backgrounds',
          defaultMessage:
            'Upload the perfect backgrounds from your computer or phone for your boards.',
          description:
            'Upload the perfect backgrounds from your computer or phone for your boards.',
        };
      case 'stickers-emojis':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.stickers-emojis',
          defaultMessage:
            'Add flair to your cards with super awesome sticker packs.',
          description:
            'Add flair to your cards with super awesome sticker packs.',
        };
      case 'saved-searches':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.saved-searches',
          defaultMessage:
            'Save your most frequently used searches for easy access.',
          description:
            'Save your most frequently used searches for easy access.',
        };
      case 'custom-fields':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.custom-fields',
          defaultMessage:
            'Add custom dropdowns, checkboxes, and more to your cards',
          description:
            'Add custom dropdowns, checkboxes, and more to your cards',
        };
      case 'data-exports':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.data-exports',
          defaultMessage: 'Export board data.',
          description: 'Export board data.',
        };
      case 'dashboard':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.dashboard',
          defaultMessage:
            'Dig into the data with tiles to see workload, timing, and more about your Workspace.',
          description:
            'Dig into the data with tiles to see workload, timing, and more about your Workspace.',
        };
      case 'timeline':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.timeline',
          defaultMessage:
            'Visually plan time and workload, similar to a Gantt chart.',
          description:
            'Visually plan time and workload, similar to a Gantt chart.',
        };
      case 'table':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.table',
          defaultMessage:
            'Display cards as rows and columns, like a spreadsheet.',
          description: 'Display cards as rows and columns, like a spreadsheet.',
        };
      case 'map':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.map',
          defaultMessage: 'See all card locations on a map.',
          description: 'See all card locations on a map.',
        };
      case 'advanced-checklists':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.advanced-checklists',
          defaultMessage:
            'Add due dates and assign collaborators to individual checklist items.',
          description:
            'Add due dates and assign collaborators to individual checklist items.',
        };
      case 'workspace-board-templates':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.workspace-board-templates',
          defaultMessage:
            'Create and save custom board templates for your Workspace to use.',
          description:
            'Create and save custom board templates for your Workspace to use.',
        };
      case 'board-collections':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.board-collections',
          defaultMessage:
            'Easily group boards together whether by Workspace, department, or major project.',
          description:
            'Easily group boards together whether by Workspace, department, or major project.',
        };
      case 'observers':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.observers',
          defaultMessage: 'Limit certain people’s actions on your boards.',
          description: 'Limit certain people’s actions on your boards.',
        };
      case 'admin-security-features':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.admin-security-features',
          defaultMessage:
            'Enable two-factor authentication, advanced admin permissions, domain-restricted invites, deactivate members, and Google apps sign-on.',
          description:
            'Enable two-factor authentication, advanced admin permissions, domain-restricted invites, deactivate members, and Google apps sign-on.',
        };
      case 'priority-support':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.priority-support',
          defaultMessage:
            'Get your questions answered within one business day, guaranteed.',
          description:
            'Get your questions answered within one business day, guaranteed.',
        };
      case 'unlimited-workspaces':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.unlimited-workspaces',
          defaultMessage:
            'With Enterprise, your organization can have multiple Workspaces—all with the features of Premium.',
          description:
            'With Enterprise, your organization can have multiple Workspaces—all with the features of Premium.',
        };
      case 'powerup-administration':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.powerup-administration',
          defaultMessage: 'Control which Power-Ups can be added to boards.',
          description: 'Control which Power-Ups can be added to boards.',
        };
      case 'saml-sso':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.saml-sso',
          defaultMessage:
            'Enterprise organizations can set up more admin features with Atlassian Access.',
          description:
            'Enterprise organizations can set up more admin features with Atlassian Access.',
        };
      case 'attachment-restrictions':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.attachment-restrictions',
          defaultMessage:
            'Restrict attachment sources across all Workspaces on the Enterprise.',
          description:
            'Restrict attachment sources across all Workspaces on the Enterprise.',
        };
      case 'organization-wide permissions':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.organization-wide permissions',
          defaultMessage:
            'Enforce settings across all Workspaces under the Enterprise.',
          description:
            'Enforce settings across all Workspaces under the Enterprise.',
        };
      case 'organization-visible-boards':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.organization-visible-boards',
          defaultMessage:
            'Create boards that are visible to all members of the Enterprise.',
          description:
            'Create boards that are visible to all members of the Enterprise.',
        };
      case 'public-board-management':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.public-board-management',
          defaultMessage:
            'View and change visibility of all public boards within the Enterprise.',
          description:
            'View and change visibility of all public boards within the Enterprise.',
        };
      case 'quick-capture':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.quick-capture',
          defaultMessage:
            'Capture to-dos, notes, and messages, from email and Slack instantly.',
          description:
            'Capture to-dos, notes, and messages, from email and Slack instantly.',
        };
      case 'quick-capture-teams':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.quick-capture-teams',
          defaultMessage:
            'Capture to-dos, notes, and messages from email, Slack, and Microsoft Teams instantly.',
          description:
            'Capture to-dos, notes, and messages from email, Slack, and Microsoft Teams instantly.',
        };
      case 'quick-capture-with-ai-summaries':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.quick-capture-with-ai-summaries',
          defaultMessage:
            'AI turns messages from email, Slack, and Microsoft Teams into Trello cards with summaries, due dates, and checklist items.',
          description:
            'AI turns messages from email, Slack, and Microsoft Teams into Trello cards with summaries, due dates, and checklist items.',
        };
      case 'inbox':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.inbox',
          defaultMessage: 'Capture everything, organize when you’re ready.',
          description: 'Capture everything, organize when you’re ready.',
        };
      case 'planner':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.planner',
          defaultMessage:
            'View your scheduled cards on a calendar and synchronize events from your favorite tools.',
          description:
            'View your scheduled cards on a calendar and synchronize events from your favorite tools.',
        };
      case 'advanced-planner':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.advanced-planner',
          defaultMessage:
            'Drag and drop cards on a calendar to block any available time. Sync with more events in your favorite tools. ',
          description:
            'Drag and drop cards on a calendar to block any available time. Sync with more events in your favorite tools.',
        };
      case 'card-mirroring':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.card-mirroring',
          defaultMessage: 'View or edit cards from multiple boards.',
          description: 'View or edit cards from multiple boards.',
        };
      case 'collapsible-lists':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.collapsible-lists',
          defaultMessage: 'Collapse and expand lists.',
          description: 'Collapse and expand lists.',
        };
      case 'list-colors':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.list-colors',
          defaultMessage:
            'Choose different colors for each list in your board.',
          description: 'Choose different colors for each list in your board.',
        };
      case 'atlassian-intelligence':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.atlassian-intelligence',
          defaultMessage:
            'Let AI handle summaries, due dates, descriptions, checklists, and more.',
          description:
            'Let AI handle summaries, due dates, descriptions, checklists, and more.',
        };
      case 'jira-lists':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.jira-lists',
          defaultMessage: 'Manage your Jira tasks in Trello.',
          description: 'Manage your Jira tasks in Trello.',
        };
      case 'unlimited-cards-with-ai':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.unlimited-cards-with-ai',
          defaultMessage:
            'Use AI-powered writing and edits for your card descriptions and comments.',
          description:
            'Use AI-powered writing and edits for your card descriptions and comments.',
        };
      case 'workspace-level-templates':
        return {
          id: 'templates.billing_page_one.feature-tooltips-personal-productivity.workspace-level-templates',
          defaultMessage:
            'Create private and Workspace visible templates, just for you and other workspace members.',
          description:
            'Create private and Workspace visible templates, just for you and other workspace members.',
        };
      default:
        return null;
    }
  } else if (categoryKey === 'feature-list-personal-productivity') {
    switch (featureKey) {
      case 'collaborators':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.collaborators',
          defaultMessage: 'Collaborators',
          description: 'Collaborators',
        };
      case 'boards':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.boards',
          defaultMessage: 'Boards',
          description: 'Boards',
        };
      case 'unlimited-powerups':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.unlimited-powerups',
          defaultMessage: 'Unlimited Power-Ups',
          description: 'Unlimited Power-Ups',
        };
      case 'automation-1':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.automation-1',
          defaultMessage: 'Automation',
          description: 'Automation',
        };
      case 'file-attachments':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.file-attachments',
          defaultMessage: 'File attachments',
          description: 'File attachments',
        };
      case 'custom-backgrounds':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.custom-backgrounds',
          defaultMessage: 'Custom backgrounds',
          description: 'Custom backgrounds',
        };
      case 'stickers-emojis':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.stickers-emojis',
          defaultMessage: 'Custom stickers and emojis',
          description: 'Custom stickers and emojis',
        };
      case 'advanced-checklists':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.advanced-checklists',
          defaultMessage: 'Advanced checklists',
          description: 'Advanced checklists',
        };
      case 'saved-searches':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.saved-searches',
          defaultMessage: 'Saved searches',
          description: 'Saved searches',
        };
      case 'custom-fields':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.custom-fields',
          defaultMessage: 'Custom fields',
          description: 'Custom fields',
        };
      case 'admin-security-features':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.admin-security-features',
          defaultMessage: 'Admin and security features',
          description: 'Admin and security features',
        };
      case 'board-collections':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.board-collections',
          defaultMessage: 'Board collections',
          description: 'Board collections',
        };
      case 'data-exports':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.data-exports',
          defaultMessage: 'Data exports',
          description: 'Data exports',
        };
      case 'table':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.table',
          defaultMessage: 'Table view',
          description: 'Table view',
        };
      case 'timeline':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.timeline',
          defaultMessage: 'Timeline view',
          description: 'Timeline view',
        };
      case 'dashboard':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.dashboard',
          defaultMessage: 'Dashboard view',
          description: 'Dashboard view',
        };
      case 'map':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.map',
          defaultMessage: 'Map view',
          description: 'Map view',
        };
      case 'workspace-board-templates':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.workspace-board-templates',
          defaultMessage: 'Workspace board templates',
          description: 'Workspace board templates',
        };
      case 'workspace-views':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.workspace-views',
          defaultMessage: 'Workspace views',
          description: 'Workspace views',
        };
      case 'observers':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.observers',
          defaultMessage: 'Observers',
          description: 'Observers',
        };
      case 'priority-support':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.priority-support',
          defaultMessage: 'Priority support',
          description: 'Priority support',
        };
      case 'unlimited-workspaces':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.unlimited-workspaces',
          defaultMessage: 'Unlimited Workspaces',
          description: 'Unlimited Workspaces',
        };
      case 'powerup-administration':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.powerup-administration',
          defaultMessage: 'Power-Up administration',
          description: 'Power-Up administration',
        };
      case 'saml-sso':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.saml-sso',
          defaultMessage: 'SAML SSO and user provisioning',
          description: 'SAML SSO and user provisioning',
        };
      case 'attachment-restrictions':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.attachment-restrictions',
          defaultMessage: 'Attachment restrictions',
          description: 'Attachment restrictions',
        };
      case 'organization-wide permissions':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.organization-wide permissions',
          defaultMessage: 'Organization-wide permissions',
          description: 'Organization-wide permissions',
        };
      case 'organization-visible-boards':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.organization-visible-boards',
          defaultMessage: 'Organization visible boards',
          description: 'Organization visible boards',
        };
      case 'public-board-management':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.public-board-management',
          defaultMessage: 'Public board management',
          description: 'Public board management',
        };
      case 'unlimited-cards':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.unlimited-cards',
          defaultMessage: 'Unlimited cards',
          description: 'Unlimited cards',
        };
      case 'unlimited-cards-with-ai':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.unlimited-cards-with-ai',
          defaultMessage: 'Unlimited cards with AI',
          description: 'Unlimited cards with AI',
        };
      case 'quick-capture':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.quick-capture',
          defaultMessage: 'Quick capture',
          description: 'Quick capture',
        };
      case 'quick-capture-with-ai-summaries':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.quick-capture-with-ai-summaries',
          defaultMessage: 'Quick capture with AI summaries',
          description: 'Quick capture with AI summaries',
        };

      case 'inbox':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.inbox',
          defaultMessage: 'Inbox',
          description: 'Inbox',
        };
      case 'planner':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.planner',
          defaultMessage: 'Planner (view-only)',
          description: 'Planner (view-only)',
        };
      case 'advanced-planner':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.advanced-planner',
          defaultMessage: 'Planner (full access)',
          description: 'Planner (full access)',
        };
      case 'card-mirroring':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.card-mirroring',
          defaultMessage: 'Card mirroring',
          description: 'Card mirroring',
        };
      case 'collapsible-lists':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.collapsible-lists',
          defaultMessage: 'Collapsible lists',
          description: 'Collapsible lists',
        };
      case 'list-colors':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.list-colors',
          defaultMessage: 'List colors',
          description: 'List colors',
        };
      case 'atlassian-intelligence':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.ai',
          defaultMessage: 'AI',
          description: 'AI',
        };
      case 'jira-lists':
        return {
          id: 'templates.billing_page_one.feature-list-personal-productivity.jira-lists',
          defaultMessage: 'Jira lists',
          description: 'Jira lists',
        };
      default:
        return null;
    }
  } else {
    return null;
  }
};
