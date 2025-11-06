export const JiraTemplates = {
  ProjectManagement:
    'com.atlassian.jira-core-project-templates:jira-core-simplified-project-management',
  Scrum: 'com.pyxis.greenhopper.jira:gh-simplified-agility-scrum',
  WebDesignProcess:
    'com.atlassian.jira-core-project-templates:jira-work-management-web-design-process',
  BugTracking: 'com.pyxis.greenhopper.jira:gh-simplified-basic',
  Recruitment:
    'com.atlassian.jira-core-project-templates:jira-core-simplified-recruitment',
  Kanban: 'com.pyxis.greenhopper.jira:gh-simplified-agility-kanban',
  SalesPipeline:
    'com.atlassian.jira-core-project-templates:jira-work-management-sales-pipeline',
  NewEmployeeOnboarding:
    'com.atlassian.jira-core-project-templates:jira-work-management-employee-onboarding',
  ContentManagement:
    'com.atlassian.jira-core-project-templates:jira-core-simplified-content-management',
  Procurement:
    'com.atlassian.jira-core-project-templates:jira-core-simplified-procurement',
  PerformanceReview:
    'com.atlassian.jira-core-project-templates:jira-work-management-performance-review',
  GoToMarket:
    'com.atlassian.jira-core-project-templates:jira-work-management-go-to-market',
  BudgetCreation:
    'com.atlassian.jira-core-project-templates:jira-work-management-budget-creation',
  DocumentApproval:
    'com.atlassian.jira-core-project-templates:jira-core-simplified-document-approval',
  EventPlanning:
    'com.atlassian.jira-core-project-templates:jira-work-management-event-planning',
} as const;

export type JiraTemplateIdType =
  (typeof JiraTemplates)[keyof typeof JiraTemplates];
