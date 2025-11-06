export const TEST_ID_ATTR = 'data-testid';
export const TEST_ID_SELECTOR = `[${TEST_ID_ATTR}]`;

export type ListTestIds =
  | 'list-actions-add-card-button'
  | 'list-actions-archive-list-button'
  | 'list-actions-copy-list-button'
  | 'list-actions-copy-list-popover'
  | 'list-actions-move-all-cards-button'
  | 'list-actions-move-list-button'
  | 'list-actions-move-list-popover'
  | 'list-actions-popover-skeleton'
  | 'list-actions-popover'
  | 'list-actions-smart-list-popover'
  | 'list-actions-watch-list-button'
  | 'list-add-card-button'
  | 'list-card-composer-add-card-button'
  | 'list-card-composer-cancel-button'
  | 'list-card-composer-textarea'
  | 'list-card-composer'
  | 'list-card-drop-preview'
  | 'list-card-gap'
  | 'list-card-wrapper'
  | 'list-card'
  | 'list-cards-top-buffer'
  | 'list-cards'
  | 'list-collapse-button'
  | 'list-color-picker-skeleton'
  | 'list-column'
  | 'list-composer-add-list-button'
  | 'list-composer-button-container'
  | 'list-composer-button'
  | 'list-composer-cancel-button'
  | 'list-composer'
  | 'list-drop-preview'
  | 'list-edit-menu-button'
  | 'list-footer'
  | 'list-header'
  | 'list-hover-gap'
  | 'list-limits-badge'
  | 'list-name-input'
  | 'list-name-textarea'
  | 'list-name'
  | 'list-pinned-card-divider'
  | 'list-wrapper'
  | 'list'
  | 'lists'
  | 'smart-list-actions-popover'
  | 'smart-list-card'
  | 'smart-list-cards'
  | 'smart-list-header'
  | 'smart-list-sync-button';

export type BoardTestIds =
  | 'board-butler-view'
  | 'board-canvas'
  | 'board-limits-warning-close-button'
  | 'board-loading-skeleton'
  | 'board-view'
  | 'legacy-board-view'
  | 'panel-nav-board-button';

export type HeaderTestIds =
  | 'account-theme-switcher-button'
  | 'account-theme-switcher-popover'
  | 'account-theme-switcher-spotlight'
  | 'atlassian-app-switcher'
  | 'authenticated-header'
  | 'header-boards-menu-search'
  | 'header-container'
  | 'header-create-board-button'
  | 'header-create-board-from-template-button'
  | 'header-create-enterprise-team-button'
  | 'header-create-menu-button'
  | 'header-create-menu-popover'
  | 'header-create-team-button'
  | 'header-create-workspace-overlay'
  | 'header-create-workspace-view-button'
  | 'header-enterprise-dashboard-button'
  | 'header-feedback-button'
  | 'header-home-button'
  | 'header-info-button'
  | 'header-info-menu'
  | 'header-internal-tools-button'
  | 'header-internal-tools-personal-prod-toggle'
  | 'header-internal-tools-popover'
  | 'header-member-menu-avatar'
  | 'header-member-menu-button'
  | 'header-member-menu-popover'
  | 'header-notifications-button'
  | 'header-notifications-email-frequency'
  | 'header-notifications-popover'
  | 'header-overflow-menu-button'
  | 'header-overflow-menu-popover'
  | 'header-search-button'
  | 'header-search-close'
  | 'header-search-input'
  | 'header-search-popover'
  | 'header-search-tips'
  | 'logged-out-header-menu-button'
  | 'logged-out-header-narrow-tab'
  | 'logged-out-header-narrow-tabs'
  | 'logged-out-header-narrow'
  | 'logged-out-header-wide-tab'
  | 'logged-out-header-wide-tabs'
  | 'logged-out-header-wide'
  | 'premium-trial-header-button-days-left'
  | 'team25-header-logo-glyph-and-text'
  | 'team25-header-logo-glyph'
  | 'team25-header-logo';

export type AccountMenuTestIds =
  | 'account-create-workspace'
  | 'account-menu-account-section'
  | 'account-menu-activity'
  | 'account-menu-billing'
  | 'account-menu-cards'
  | 'account-menu-enterprise-workspace-creation-button'
  | 'account-menu-help-section'
  | 'account-menu-help'
  | 'account-menu-logout-section'
  | 'account-menu-logout'
  | 'account-menu-profile'
  | 'account-menu-settings'
  | 'account-menu-shortcuts'
  | 'account-menu-trello-section'
  | 'account-menu-workspace-creation-button'
  | 'account-menu-workspace-creation-section'
  | 'account-menu'
  | 'manage-account-link'
  | 'switch-accounts-link';

export type CreateBoardTestIds =
  | 'background-picker-color'
  | 'background-picker-image'
  | 'create-board-bg-item-blue'
  | 'create-board-from-template'
  | 'create-board-select-visibility'
  | 'create-board-submit-button'
  | 'create-board-tile'
  | 'create-board-title-input'
  | 'create-from-template-button';

export type HomeTestIds =
  | 'home-boards-list-team-views-custom-view-button'
  | 'home-boards-list-team-views-header-button'
  | 'home-card-title'
  | 'home-dismiss-orientation-card-'
  | 'home-dismiss-orientation-card-highlight'
  | 'home-dismiss-orientation-card-up-next'
  | 'home-free-team-getting-started-tab'
  | 'home-highlights-list'
  | 'home-highlights-section-header'
  | 'home-left-sidebar'
  | 'home-link'
  | 'home-loading-skeleton'
  | 'home-navigation-create-team-button'
  | 'home-recently-viewed-boards-container'
  | 'home-right-sidebar'
  | 'home-starred-boards-container'
  | 'home-team-billing-tab'
  | 'home-team-boards-tab'
  | 'home-team-collections-tab'
  | 'home-team-getting-started-tab'
  | 'home-team-highlights-tab'
  | 'home-team-members-tab'
  | 'home-team-reports-tab'
  | 'home-team-settings-tab'
  | 'home-team-tab-name'
  | 'home-team-tab-section-'
  | 'home-team-tables-tab'
  | 'home-team-views-tab'
  | 'home-tile-'
  | 'home-tile-secondary-button-'
  | 'home-up-next-actions-menu'
  | 'home-up-next-item'
  | 'home-up-next-list'
  | 'home-up-next-section-header'
  | 'home-up-next-show-more-button'
  | 'templates';

export type BadgesTestIds =
  | 'badge-atlassian-intelligence'
  | 'badge-card-archived'
  | 'badge-card-comments'
  | 'badge-card-description'
  | 'badge-card-location'
  | 'badge-card-notifications-count'
  | 'badge-card-planner-discovery'
  | 'badge-card-subscribed'
  | 'badge-card-template'
  | 'badge-card-trello-attachments-count'
  | 'badge-card-votes-count'
  | 'badge-custom-field'
  | 'badge-due-date-completed'
  | 'badge-due-date-not-completed'
  | 'badge-external-source'
  | 'card-attachments-count'
  | 'card-malicious-attachments-count'
  | 'checklist-badge'
  | 'checklist-item-due-date-badge'
  | 'labs-lozenge';

export type CanonicalCard =
  | 'badge-card-subscribed'
  | 'cards-board-name'
  | 'cards-list-name'
  | 'comment-dismiss-button'
  | 'overflow-details-button';

export type CardFrontTestIds =
  | 'board-card'
  | 'card-front-badges'
  | 'card-front-board-chip'
  | 'card-front-board-hint'
  | 'card-front-cover'
  | 'card-front-member'
  | 'card-front-template-badge'
  | 'card-front-unlink-button'
  | 'card-name'
  | 'full-cover-card'
  | 'link-card'
  | 'loading-card'
  | 'minimal-card'
  | 'mirror-card-member'
  | 'mirror-card'
  | 'planner-discovery-card'
  | 'quick-card-editor-button'
  | 'separator-card'
  | 'sticker-fancy-peel'
  | 'sticker'
  | 'trello-card';

export type CookiesConsentTestIds =
  | 'cookies-consent-banner'
  | 'cookies-preference-modal';

export type NotificationSettingsTestIds =
  | 'email-notifications-header'
  | 'info-paragraph';

export type NotificationTestIds =
  | 'comment-container'
  | 'filter-by-unread'
  | 'mark-all-read-button'
  | 'notification-hide-archive'
  | 'notification-reaction-'
  | 'notification-toggle-archive'
  | 'notifications-empty-state-hidden'
  | 'notifications-empty-state'
  | 'read-notification'
  | 'toggle-read-button'
  | 'toggle-unread-button'
  | 'unread-notification'
  | 'view-all';

export type PowerUpTestIds =
  | 'board-icon'
  | 'board-pup-directory-search'
  | 'disable-powerup-button'
  | 'disable-powerup-link'
  | 'enabled-powerups-count'
  | 'enabled-powerups-link'
  | 'loading-atom'
  | 'loading-description-atom'
  | 'loading-featured-atom'
  | 'pup-add-button-link'
  | 'pup-add-button'
  | 'pup-add-to-board-button'
  | 'pup-badges'
  | 'pup-banner-header'
  | 'pup-banner-paragraph'
  | 'pup-banner'
  | 'pup-board-selector'
  | 'pup-directory-loading'
  | 'pup-directory'
  | 'pup-enable-page-pending-state'
  | 'pup-go-to-board-button'
  | 'pup-large-icon'
  | 'pup-list'
  | 'pup-made-by'
  | 'pup-settings-button'
  | 'pup-success-heading'
  | 'pup-tile'
  | 'trello-powerups-link';

export type NavigationTestIds = 'nav-search-input';

export type NewUserOnboardingTestIds =
  | 'new-user-onboarding-card-composer-textarea'
  | 'new-user-onboarding-card-container'
  | 'new-user-onboarding-confetti-taco-container'
  | 'new-user-onboarding-container'
  | 'new-user-onboarding-done-arrow'
  | 'new-user-onboarding-header-logo'
  | 'new-user-onboarding-header-moonshot-logo'
  | 'new-user-onboarding-header'
  | 'new-user-onboarding-inbox'
  | 'new-user-onboarding-list-container'
  | 'new-user-onboarding-radio-unchecked-icon'
  | 'new-user-onboarding-screen-button-loading'
  | 'new-user-onboarding-screen-description'
  | 'new-user-onboarding-screen-title'
  | 'new-user-onboarding-speech-bubble-container'
  | 'new-user-onboarding-speech-bubble'
  | 'new-user-onboarding-success-icon'
  | 'new-user-onboarding-tongue-taco-container'
  | 'progress-indicator-pill-selected'
  | 'progress-indicator-pill'
  | 'progress-indicator';

export type MemberBoardsTestIds = 'create-workspace-overlay';

export type TeamTestIds =
  | 'add-members-input'
  | 'choose-a-collection'
  | 'collection-button'
  | 'collection-delete-button'
  | 'collection-edit-button'
  | 'collection-list'
  | 'collection-name-input'
  | 'collection-name-save-button'
  | 'create-collection-button'
  | 'create-collection-link'
  | 'header-create-team-name-input'
  | 'header-create-team-submit-button'
  | 'header-create-team-type-input-other'
  | 'header-create-team-type-input'
  | 'show-later-button'
  | 'team-invite-error-link'
  | 'team-invite-submit-button'
  | 'team-invitee-learn-more-link'
  | 'team-invitee-option-icon'
  | 'team-invitee-option'
  | 'team-members-link'
  | 'tooltip-content-found-in-google'
  | 'tooltip-content-found-in-microsoft'
  | 'tooltip-content-found-in-slack'
  | 'workspace-member-item'
  | 'workspace-member-list';

export type TeamTestClasses = 'add-collection-button';

export type CreateFirstBoardIds =
  | 'invite-back-button'
  | 'invite-next-button'
  | 'invite-skip-button'
  | 'name-board-back-button'
  | 'name-board-input'
  | 'name-board-next'
  | 'name-board-skip-button'
  | 'name-cards-back-button'
  | 'name-cards-input-1'
  | 'name-cards-input-2'
  | 'name-cards-next'
  | 'name-cards-skip-button'
  | 'name-lists-back-button'
  | 'name-lists-input-1'
  | 'name-lists-input-2'
  | 'name-lists-input-3'
  | 'name-lists-next'
  | 'name-lists-skip-button'
  | 'welcome-skip-button';

export type OnboardingIds = 'email-verification-display' | 'trial-extension';

export type BoardTileTestIds =
  | 'board-tile-background'
  | 'board-tile-container'
  | 'board-tile-link'
  | 'board-tile-name';

export type PopoverTestIds =
  | 'legacy-popover-close'
  | 'popover-confirm-button'
  | 'popover-confirm';

export type MoonshotTestIds =
  | 'moonshot-billing-skip-cta'
  | 'moonshot-box'
  | 'moonshot-continue-button'
  | 'moonshot-create-team-input'
  | 'moonshot-create-workspace-input'
  | 'moonshot-dismiss-button'
  | 'moonshot-get-standard-button'
  | 'moonshot-start-free-account'
  | 'moonshot-success-button'
  | 'moonshot-team-name-error'
  | 'moonshot-team-type-error'
  | 'moonshot-team-type-error'
  | 'moonshot-team-type-select'
  | 'moonshot-try-bc-free-trial'
  | 'moonshot-welcome-heading';

export type SlackCodesTestIds = 'slack-codes-promo-code-billing-field';

export type CardBackTestIds =
  | 'attachment-links-list'
  | 'attachment-thumbnail-name'
  | 'card-back-action-container'
  | 'card-back-action-copy-button'
  | 'card-back-action'
  | 'card-back-actions-button'
  | 'card-back-activity-button'
  | 'card-back-activity-loading'
  | 'card-back-activity'
  | 'card-back-add-to-card-button'
  | 'card-back-ai-in-progress-banner'
  | 'card-back-archive-banner'
  | 'card-back-archive-button'
  | 'card-back-attachment-button'
  | 'card-back-attachment-feedback-button'
  | 'card-back-change-location-option'
  | 'card-back-checklist-button'
  | 'card-back-comment-editor-container'
  | 'card-back-comment-save-button'
  | 'card-back-convert-template-to-card-button'
  | 'card-back-copy-card-button'
  | 'card-back-cover-button'
  | 'card-back-custom-field-badge'
  | 'card-back-custom-fields-button'
  | 'card-back-delete-card-button'
  | 'card-back-description-button'
  | 'card-back-footer-ai-acknowledment'
  | 'card-back-footer-ai-error'
  | 'card-back-footer-bad-response-button'
  | 'card-back-footer-disclaimer-ai'
  | 'card-back-footer-feedback-ai'
  | 'card-back-footer-good-response-button'
  | 'card-back-footer-retry-ai'
  | 'card-back-header'
  | 'card-back-labels-button'
  | 'card-back-labels-container'
  | 'card-back-loading'
  | 'card-back-location-details'
  | 'card-back-location-external-link-button'
  | 'card-back-location-footer'
  | 'card-back-location-menu-button'
  | 'card-back-location-menu-popover'
  | 'card-back-location-option'
  | 'card-back-make-template-button'
  | 'card-back-member-avatar'
  | 'card-back-members-button'
  | 'card-back-mirror-card-button'
  | 'card-back-mirror-card-loading'
  | 'card-back-move-card-button'
  | 'card-back-name'
  | 'card-back-new-comment-input-skeleton'
  | 'card-back-panel'
  | 'card-back-plugin-section-iframe'
  | 'card-back-share-button'
  | 'card-back-sidebar-location-button'
  | 'card-back-sticker'
  | 'card-back-sticky-header'
  | 'card-back-subscribed-button'
  | 'card-back-subscribed-icon'
  | 'card-back-title-input'
  | 'card-back-unarchive-card-button'
  | 'card-back-vote-button-check-icon'
  | 'card-back-vote-button'
  | 'card-cover'
  | 'comment-attachment-button'
  | 'confirm-delete-link-attachment'
  | 'delete-link-attachment'
  | 'edit-link-attachment'
  | 'hide-details-button'
  | 'link-attachment-actions'
  | 'link-text'
  | 'plugin-button-loading'
  | 'show-details-button'
  | 'trello-card-back-attachment-button'
  | 'unsaved-changes-lozenge';

export type CardTestIds =
  | 'card-done-state-auto-archive'
  | 'card-done-state-completion-button'
  | 'card-done-state-read-only'
  | 'card-done-state'
  | 'stickers-container'
  | 'unarchive-card-button';

export type ActionTestIds = 'app-creator-icon';

export type DescriptionTestIds =
  | 'description-button'
  | 'description-cancel-button'
  | 'description-content-area'
  | 'description-content-placeholder'
  | 'description-edit-button'
  | 'description-save-button'
  | 'unsaved-changes-lozenge';

export type BoardHeaderTestIds =
  | 'board-facepile-member'
  | 'board-facepile-popover-member'
  | 'board-facepile-show-more'
  | 'board-name-container'
  | 'board-name-display'
  | 'board-name-input'
  | 'board-share-button-icon'
  | 'board-share-button'
  | 'board-visibility-dropdown-'
  | 'board-visibility-option-'
  | 'board-watching-icon'
  | 'calendar-power-up'
  | 'change-team-select-label'
  | 'team-table-view-option'
  | 'template-badge'
  | 'view-switcher-button-icon'
  | 'view-switcher-button-more'
  | 'view-switcher-button-text'
  | 'view-switcher-header-button-board'
  | 'view-switcher-header-button-calendar'
  | 'view-switcher-header-button-dashboard'
  | 'view-switcher-header-button-map'
  | 'view-switcher-header-button-table'
  | 'view-switcher-header-button-timeline';

export type ViewSwitcherTestIds =
  | 'view-switcher-button-board'
  | 'view-switcher-button-calendar'
  | 'view-switcher-button-dashboard'
  | 'view-switcher-button-icon'
  | 'view-switcher-button-map'
  | 'view-switcher-button-more'
  | 'view-switcher-button-table'
  | 'view-switcher-button-text'
  | 'view-switcher-button-timeline';

export type BoardBackgroundTileTestIds =
  | 'board-background-color-section'
  | 'board-background-photo-section'
  | 'board-background-select-color-'
  | 'board-background-select-gradient-'
  | 'board-background-select-photo-'
  | 'custom-background-delete-button-confirm'
  | 'custom-background-delete-button'
  | 'custom-background-option-cover'
  | 'custom-background-option-dark'
  | 'custom-background-option-light'
  | 'custom-background-option-popover'
  | 'custom-background-option-tile'
  | 'custom-background-thumbnail-options'
  | 'custom-background-thumbnail'
  | 'custom-background-uploader'
  | 'unread-activity';

export type InboxBoardBackgroundTileTestIds =
  | 'inbox-board-background-color-section'
  | 'inbox-board-background-photo-section'
  | 'inbox-board-background-select-color-'
  | 'inbox-board-background-select-gradient-'
  | 'inbox-board-background-select-photo-'
  | 'inbox-custom-background-delete-button-confirm'
  | 'inbox-custom-background-delete-button'
  | 'inbox-custom-background-option-cover'
  | 'inbox-custom-background-option-dark'
  | 'inbox-custom-background-option-light'
  | 'inbox-custom-background-option-popover'
  | 'inbox-custom-background-option-tile'
  | 'inbox-custom-background-thumbnail-options'
  | 'inbox-custom-background-thumbnail'
  | 'inbox-custom-background-uploader'
  | 'inbox-unread-activity';

export type EnterpriseDashboardTestIds =
  | 'atlassian-intelligence'
  | 'auto-join-checkbox'
  | 'board-details-activity-section'
  | 'board-details-popover'
  | 'board-details-section-activity-date'
  | 'board-details-section-description'
  | 'board-details-section'
  | 'board-thumbnail'
  | 'bulk-action-accept'
  | 'bulk-action-decline'
  | 'bulk-action-generic'
  | 'change-default-workspace'
  | 'dashboard-list-item'
  | 'deactivate-popup-button'
  | 'default-enterprise-workspace'
  | 'default-workspace-popover'
  | 'enable-ai-toggle'
  | 'loading-spinner'
  | 'member-count'
  | 'member-filters'
  | 'new-billable-member-list'
  | 'new-billable-members'
  | 'pending-team-item-approve-button'
  | 'pending-team-item-decline-button'
  | 'pending-team-item-overlay-approve-button'
  | 'pending-team-item-overlay-decline-button'
  | 'pending-team-item-restricted-member-deactivated-badge'
  | 'pending-team-item-restricted-member'
  | 'pending-team-item'
  | 'power-ups-completed-banner'
  | 'power-ups-in-progress-banner'
  | 'public-board-empty-state'
  | 'restricted-member-list'
  | 'restricted-members'
  | 'search-close-icon'
  | 'sort-option-button'
  | 'sort-option-selected-marker'
  | 'tab-header-title'
  | 'visibility-change-popover-organization'
  | 'visibility-change-popover-private'
  | 'visibility-change-popover-success'
  | 'visibility-change-popover-workspace'
  | 'visibility-change-popover';

export type EnterpriseDashboardSideBarTestIds =
  | 'about-atlassian-admin-button'
  | 'admin-insights-external-link'
  | 'atlassian-admin-header'
  | 'board-guests-button'
  | 'board-guests-opt-in-button'
  | 'deactivate-members-button'
  | 'directory-external-link'
  | 'enterprise-members-button'
  | 'enterprise-public-boards-button'
  | 'enterprise-workspaces'
  | 'managed-members-button'
  | 'seat-automation-button'
  | 'sso-button'
  | 'sso-external-link';

export type OrganizationViewTestIds =
  | 'business-class-text'
  | 'enterprise-text'
  | 'private-board'
  | 'standard-text'
  | 'workspace-display-name';

export type PurchaseFormIds =
  | '__privateStripeFrame'
  | 'ads-credit-card-grid'
  | 'confirm-email-message'
  | 'credit-card-confirmation'
  | 'credit-card-country-label'
  | 'credit-card-country-validation-error'
  | 'credit-card-country'
  | 'credit-card-cvv-validation-error'
  | 'credit-card-cvv'
  | 'credit-card-expiration-validation-error'
  | 'credit-card-expiration'
  | 'credit-card-form'
  | 'credit-card-number-validation-error'
  | 'credit-card-number'
  | 'credit-card-state-tax-id-summary'
  | 'credit-card-state-tax-id-validation-error'
  | 'credit-card-state-tax-id'
  | 'credit-card-tax-id-label'
  | 'credit-card-tax-id-summary'
  | 'credit-card-tax-id-validation-error'
  | 'credit-card-tax-id'
  | 'credit-card-update-popover'
  | 'credit-card-update-submit-button'
  | 'credit-card-zip-code-validation-error'
  | 'credit-card-zip-code'
  | 'purchase-form-annual-button-selected'
  | 'purchase-form-annual-button'
  | 'purchase-form-confirm-payment'
  | 'purchase-form-monthly-button-selected'
  | 'purchase-form-monthly-button'
  | 'purchase-form-submit-authorization-error'
  | 'purchase-form-submit-button'
  | 'purchase-form-submit-error'
  | 'purchase-form-summary-bill-date'
  | 'purchase-form-summary-discount-value'
  | 'purchase-form-summary-discount'
  | 'purchase-form-summary-free-trial-discount'
  | 'purchase-form-summary-license'
  | 'purchase-form-summary-pending-invitations'
  | 'purchase-form-summary-pending-price'
  | 'purchase-form-summary-subtotal'
  | 'purchase-form-summary-tax-amount'
  | 'purchase-form-summary-tax-error'
  | 'purchase-form-summary-tax-region'
  | 'purchase-form-summary-total'
  | 'purchase-form-summary'
  | 'purchase-form'
  | 'stripe-challenge-frame'
  | 'terms-of-service-validation-error'
  | 'terms-of-service'
  | 'test-source-authorize-3ds'
  | 'test-source-fail-3ds';

export type BillingIds =
  | 'auto-renew-popover'
  | 'billing-additional-info'
  | 'billing-auto-renewal-section'
  | 'billing-cancel-account-button'
  | 'billing-cancel-active-boards-list'
  | 'billing-cancel-apply-discount-button'
  | 'billing-cancel-auto-renewal-button'
  | 'billing-cancel-auto-renewal-link'
  | 'billing-cancel-discount-applied'
  | 'billing-cancel-discount-dismiss-button'
  | 'billing-cancel-feature-list'
  | 'billing-cancel-give-feedback'
  | 'billing-cancel-keep-account-button'
  | 'billing-cancel-keep-trial-button'
  | 'billing-cancel-no-thanks-button'
  | 'billing-cancel-survey'
  | 'billing-cancel-switch-free-button'
  | 'billing-cancel-team-boards-button'
  | 'billing-cancel-trial-button'
  | 'billing-cancelled'
  | 'billing-change-contact-submit-button'
  | 'billing-change-contact'
  | 'billing-change-credit-card'
  | 'billing-change-invoice-details-submit-button'
  | 'billing-change-invoice-details'
  | 'billing-contact-email'
  | 'billing-contact-info'
  | 'billing-contact-language'
  | 'billing-contact-name'
  | 'billing-contact-popup'
  | 'billing-contact'
  | 'billing-credit-card-last4'
  | 'billing-details'
  | 'billing-explore-plans-button'
  | 'billing-history-statement'
  | 'billing-invoice-details-additional-text'
  | 'billing-invoice-details-popup'
  | 'billing-keep-auto-renewal-button'
  | 'billing-keep-auto-renewal-link'
  | 'billing-next-charge-amount'
  | 'billing-next-charge-date'
  | 'billing-next-charge'
  | 'billing-payment-method'
  | 'billing-purchase-during-trial-plan-chooser-premium'
  | 'billing-purchase-during-trial-plan-chooser-standard'
  | 'billing-section'
  | 'billing-standing-message'
  | 'billing-status-banner'
  | 'billing-subscription-cancelled'
  | 'billing-subscription-keep-premium'
  | 'billing-subscription-renew'
  | 'billing-switch-to-annual-confirm'
  | 'billing-switch-to-annual'
  | 'billing-tax-exemption'
  | 'contact-sales-button'
  | 'get-standard'
  | 'invoice-details'
  | 'plan-comparison-cell-enterprise'
  | 'plan-comparison-cell-free'
  | 'plan-comparison-cell-premium'
  | 'plan-comparison-cell-standard'
  | 'premium-standard-upgrade-prompt'
  | 'sunset-gold-header'
  | 'sunset-gold-text'
  | 'switch-to-standard-button'
  | 'upgrade-banner-button'
  | 'upgrade-banner-popover'
  | 'upgrade-team-bc-button'
  | 'upgrade-team-button'
  | 'upgrade-team-standard-button';

export type SelectTestClasses =
  | 'board-thumbnail'
  | 'board-tile-background'
  | 'board-tile';

export type FreeTrialTestIds =
  | 'active-free-trial-banner'
  | 'add-payment-method-button'
  | 'banner-add-payment-button'
  | 'expired-free-trial-banner'
  | 'explore-plans-button'
  | 'free-trial-summary-item'
  | 'have-bc-plan-selection'
  | 'learn-more-about-bc-button'
  | 'learn-more-banner-link'
  | 'plan-selection-overlay-close'
  | 'standard-learn-more-about-premium-button'
  | 'standard-start-premium-free-trial-button'
  | 'start-free-trial-button'
  | 'try-bc-plan-selection';

export type UpgradePromptTestIds =
  | 'attachment-size-limit-upgrade-prompt'
  | 'board-limit-upgrade-tile'
  | 'board-template-with-upgrade-pill'
  | 'card-back-pups-upgrade-pill'
  | 'card-back-upgrade-pill'
  | 'collections-upgrade-pill'
  | 'collections-upgrade-prompt'
  | 'create-board-upgrade-prompt'
  | 'invite-upgrade-prompt'
  | 'org-member-restricted-permission'
  | 'plan-selection'
  | 'print-and-export-upgrade-pill'
  | 'print-and-export-upgrade-prompt'
  | 'pups-upgrade-prompt'
  | 'team-boards-header-upgrade-button'
  | 'team-boards-page-upgrade-prompt'
  | 'team-home-sidebar-upgrade-prompt'
  | 'team-members-page-upgrade-prompt'
  | 'team-permissions-upgrade-prompt'
  | 'templates-upgrade-pill';

export type ChecklistTestIds =
  | 'check-item-add-button'
  | 'check-item-assigned-badge'
  | 'check-item-container'
  | 'check-item-convert-button'
  | 'check-item-delete-button'
  | 'check-item-edit-container'
  | 'check-item-edit-due-button'
  | 'check-item-edit-due-control-button'
  | 'check-item-edit-member-button'
  | 'check-item-edit-save-button'
  | 'check-item-hover-buttons'
  | 'check-item-member-avatar'
  | 'check-item-name-input'
  | 'check-item-name'
  | 'check-item-overflow-menu-button'
  | 'check-item-remove-date-button'
  | 'check-item-remove-member-button'
  | 'check-item-set-due-button'
  | 'check-item-set-member-button'
  | 'checklist-add-button'
  | 'checklist-container'
  | 'checklist-delete-button'
  | 'checklist-edit-name-input'
  | 'checklist-item-upsell-popover'
  | 'checklist-items'
  | 'checklist-plan-selection-overlay'
  | 'checklist-progress-percentage'
  | 'checklist-section'
  | 'checklist-title-container'
  | 'checklist-title'
  | 'your-items-checkbox-checked'
  | 'your-items-checkbox-unchecked'
  | 'your-items-checklist-item-container'
  | 'your-items-show-more';

export type ChooseMemberTestIds = 'choose-member-item-add-member-button';

export type ProfileTestIds =
  | 'profile-activity-tab'
  | 'profile-cards-tab'
  | 'profile-form'
  | 'profile-settings-tab'
  | 'profile-tab-container'
  | 'profile-username-tab';

export type ProfileCardTestIds =
  | 'profile-card-avatar'
  | 'profile-card-username'
  | 'profile-card-wrapper'
  | 'profile-link'
  | 'remove-from-card';

export type BCTeamOnboardingTestIds =
  | 'bc-team-onboarding-checkitem-1'
  | 'bc-team-onboarding-checkitem-2'
  | 'bc-team-onboarding-checkitem-3'
  | 'bc-team-onboarding-checkitem-4'
  | 'bc-team-onboarding-checkitem-5'
  | 'bc-team-onboarding-checkitem-6'
  | 'bc-team-onboarding-invite-member-button';

export type BoardReportsViewTestIds =
  | 'bar-chart-configure'
  | 'cards-per-due-date-bar-chart'
  | 'cards-per-due-date-bar-chart'
  | 'cards-per-due-date-empty-state'
  | 'cards-per-label-empty-state'
  | 'cards-per-list-bar-chart'
  | 'cards-per-list-empty-state'
  | 'close-button'
  | 'dashboard-wrapper'
  | 'line-chart-configure'
  | 'pie-chart-configure'
  | 'tile-menu-button';

export type TableTestIds =
  | 'empty-state'
  | 'table-add-card-button-container'
  | 'table-add-card-button'
  | 'table-body'
  | 'table-member-avatar'
  | 'table-member-read-only-popover-avatar'
  | 'table-skeleton'
  | 'table-spinner';

export type WorkspaceViewTestIds =
  | 'no-boards-selected'
  | 'view-name-input'
  | 'workspace-view-name';

export type TableTestClasses =
  | 'card-date-range-picker'
  | 'due-date-cell'
  | 'due-date-checkbox-checked'
  | 'due-date-checkbox-unchecked'
  | 'header-cell-filter-active'
  | 'label-badge'
  | 'red-label-badge'
  | 'table-member-avatar'
  | 'table-member-cell'
  | 'table-row';

export type CalendarViewTestIds =
  | 'advanced-checklist-checkbox'
  | 'background-cell-wrapper'
  | 'calendar-board-hint'
  | 'calendar-event-member-avatar'
  | 'calendar-event'
  | 'calendar-wrapper'
  | 'current-time-dot'
  | 'current-time-line'
  | 'show-more-button'
  | 'week-view-event'
  | 'week-view-placeholder';

export type TimelineTestIds =
  | 'item-container'
  | 'item-detail'
  | 'mirror-card-board-chip'
  | 'mirror-card-board-hint'
  | 'mirror-card-board-icon'
  | 'mirror-card-board-name'
  | 'timeline-add-card'
  | 'timeline-board-hint'
  | 'timeline-facepile-member-avatar'
  | 'timeline-member-avatar'
  | 'timeline-wrapper';

export type ViewHeaderTestIds =
  | 'close-button'
  | 'next-button'
  | 'previous-button'
  | 'settings-button'
  | 'today-button';

export type WorkspaceSwitcherTestIds =
  | 'create-team-full-button'
  | 'create-team-plus-button'
  | 'current-workspaces-list-section-header'
  | 'enterprise-workspace-list'
  | 'guest-workspaces-list-section-header'
  | 'member-workspaces-list-section-header'
  | 'personal-workspace-list-item'
  | 'personal-workspace-list'
  | 'spinner'
  | 'workspace-boards-list-section'
  | 'workspace-list-item'
  | 'workspace-list'
  | 'workspace-switcher-popover-tile'
  | 'workspace-switcher-popover'
  | 'workspace-switcher-single'
  | 'workspace-switcher';

export type YourCardsTestIds =
  | 'board-tile'
  | 'calendar-icon'
  | 'completed-clock-icon'
  | 'due-soon-clock-icon'
  | 'due-soon-clock-icon'
  | 'standard-clock-icon'
  | 'your-card-label-placeholder'
  | 'your-card-label-wrapper'
  | 'your-cards-board-sort-option'
  | 'your-cards-board-star-button'
  | 'your-cards-card-item-link'
  | 'your-cards-card-item'
  | 'your-cards-cards-list'
  | 'your-cards-cards-view'
  | 'your-cards-due-date-badge'
  | 'your-cards-due-date-sort-option'
  | 'your-cards-empty-due-date-cell'
  | 'your-cards-list-name-wrapper'
  | 'your-cards-loading-spinner'
  | 'your-cards-show-more-button'
  | 'your-items-checkbox-checked'
  | 'your-items-checkbox-unchecked';

export type RecentlyViewedBoardsMenuTestIds =
  | 'recently-viewed-boards-menu-popover-board-tile'
  | 'recently-viewed-boards-menu-popover'
  | 'recently-viewed-boards-menu';

export type StarredBoardsMenuTestIds =
  | 'starred-boards-menu-popover-board-title'
  | 'starred-boards-menu-popover'
  | 'starred-boards-menu';

export type BoardSwitcherTestIds =
  | 'board-switcher-expand-section'
  | 'board-switcher-recent-boards'
  | 'board-switcher-search-field'
  | 'board-switcher-search-results'
  | 'board-switcher-starred-boards'
  | 'board-switcher-workspace-tabs'
  | 'board-switcher'
  | 'panel-nav-board-switcher-button'
  | 'starred-boards-board-title'
  | 'workspace-tab-lock-icon'
  | 'workspace-view-tile';

export type StarredBoardsListTestIds =
  | 'starred-boards-list-item-skeleton'
  | 'starred-boards-list-page';

export type TemplatesMenuTestIds = 'templates-menu';

export type WorkspaceNavigationTestIds =
  | 'add-members-button'
  | 'add-members-internal-button'
  | 'admin-settings-dropdown-button'
  | 'all-boards-list'
  | 'board-recent-activity-indicator'
  | 'board-star'
  | 'boards-list-empty-state'
  | 'boards-list-show-more-button'
  | 'collapsible-list-items'
  | 'collapsible-list'
  | 'create-team-full-button'
  | 'create-workspace-view-button'
  | 'current-workspace-expanded'
  | 'current-workspace-loading-spinner'
  | 'guest-workspace-request-invite'
  | 'inbox-button'
  | 'no-relationship-message'
  | 'open-billing-link'
  | 'open-boards-link'
  | 'open-exports-link'
  | 'open-members-link'
  | 'open-powerups-link'
  | 'open-settings-link'
  | 'plan-type'
  | 'popover-billing'
  | 'popover-close-board-confirm'
  | 'popover-exports'
  | 'popover-invite-members-button'
  | 'popover-pups'
  | 'popover-settings-button'
  | 'popover-upgrade'
  | 'popover-view-members-button'
  | 'rovo-island'
  | 'starred-list-empty-state'
  | 'top-templates-list'
  | 'trello-logo-image'
  | 'upgrade-prompt-button'
  | 'views-list-show-more-button'
  | 'views-list'
  | 'workspace-boards-and-views-lists'
  | 'workspace-detail-name'
  | 'workspace-detail'
  | 'workspace-logo'
  | 'workspace-nav-views-list-item'
  | 'workspace-navigation-collapse-button'
  | 'workspace-navigation-collapsed-container'
  | 'workspace-navigation-collapsed-spinner'
  | 'workspace-navigation-collapsed'
  | 'workspace-navigation-expand-button'
  | 'workspace-navigation-expanded-container'
  | 'workspace-navigation-expanded-error'
  | 'workspace-navigation-expanded-spinner'
  | 'workspace-navigation-expanded'
  | 'workspace-navigation-forward-chevron'
  | 'workspace-navigation-inbox-switcher'
  | 'workspace-navigation-loading-spinner'
  | 'workspace-navigation-nav'
  | 'workspace-sidebar-button';

export type CloseBoardTestIds =
  | 'close-board-big-message'
  | 'close-board-delete-board-button'
  | 'close-board-delete-board-confirm-button'
  | 'close-board-free-trial-instructions'
  | 'close-board-member-avatar'
  | 'no-boards-to-reopen';

export type DeleteWorkspaceTestIds =
  | 'delete-workspace-button'
  | 'delete-workspace-cancel-subscription-message'
  | 'delete-workspace-confirm-button'
  | 'delete-workspace-confirm-field'
  | 'delete-workspace-contact-sales-message';

export type EditorTestIds =
  | 'ak-editor-main-toolbar'
  | 'ak-editor-toolbar-button-redo'
  | 'ak-editor-toolbar-button-undo'
  | 'editor-insert-attachment-file-input'
  | 'editor-loading-spinner';

export type WorkspaceChooserTestIds =
  | 'workspace-chooser-popover-select'
  | 'workspace-chooser-reopen-button'
  | 'workspace-chooser-trigger-button';

export type DateRangePickerTestIds =
  | 'card-back-due-date-button'
  | 'date-picker-form'
  | 'date-range-picker-skeleton'
  | 'date-range-picker-with-ads'
  | 'date-range-picker'
  | 'due-date-badge-checkbox'
  | 'due-date-badge-with-date-range-picker'
  | 'due-date-field'
  | 'due-reminder-select'
  | 'due-time-field'
  | 'recurrence-select'
  | 'recurring-new-pill'
  | 'remove-date-button'
  | 'save-date-button'
  | 'start-date-badge-with-date-range-picker'
  | 'start-date-field'
  | 'toggle-start-date-button';

export type DateParserTestIds = 'due-date' | 'relevant-text' | 'start-date';

export type CardTemplateTestIds =
  | 'card-template-link-component'
  | 'card-template-list-button'
  | 'card-title-textarea'
  | 'create-card-from-template-banner-button'
  | 'create-card-from-template-button'
  | 'create-card-from-template-error'
  | 'create-new-template-card-button'
  | 'create-template-button-from-card-composer'
  | 'create-template-card-composer'
  | 'new-template-card-submit-button'
  | 'template-card-back-banner'
  | 'TemplateCardIcon';

export type TemplatesTestIds =
  | 'convert-board-to-template'
  | 'explore-more-templates'
  | 'related-templates-container'
  | 'templates-container'
  | 'templates-gallery-content-error'
  | 'templates-power-ups-container'
  | 'templates-tile-container';

export type TemplatePickerContainerTestIds =
  | 'template-picker-container-inner-wrapper'
  | 'template-picker-container-spinner-wrapper';

export type ShortcutsPageTestIds = 'shortcuts-container' | 'shortcuts-toggle';

export type OpenSourceAttributionsTestIds =
  'open-source-attributions-container';

export type ViewSuggestionTestIds =
  | 'calendar-suggestion-upsell'
  | 'timeline-suggestion-upsell';

export type RequestAccessWhenBlockedTestIds =
  | 'request-access-button'
  | 'request-access-login-button'
  | 'request-access-member-avatar'
  | 'request-access-signup-button'
  | 'request-access-switch-account-button';

export type RovoTestIds = 'rovo-card-count-indicator' | 'site-picker-dropdown';

export type FilterPopoverTestIds =
  | 'all-boards-select'
  | 'board-collection-selector-placeholder-title'
  | 'board-select-option'
  | 'filter-popover-button-filter-count'
  | 'filter-popover-button-x'
  | 'filter-popover-button'
  | 'filter-popover-contents'
  | 'recent-boards-select'
  | 'reset-filter-button'
  | 'save-as-new-view-button'
  | 'save-filter-button';

export type AppManagementTestIds =
  | 'allowed-origin'
  | 'checkbox-manage:member:trello'
  | 'checkbox-read:board:trello'
  | 'checkbox-read:enterprise:trello'
  | 'checkbox-read:member:trello'
  | 'checkbox-read:organization:trello'
  | 'checkbox-write:board:trello'
  | 'checkbox-write:enterprise:trello'
  | 'checkbox-write:member:trello'
  | 'checkbox-write:organization:trello'
  | 'copy-button-auth-url'
  | 'copy-button-client-id'
  | 'copy-button-secret'
  | 'oauth2-callback-url'
  | 'power-up-appkey-page-spinner'
  | 'power-up-basic-information-author-field'
  | 'power-up-basic-information-connectorUrl-field'
  | 'power-up-basic-information-email-field'
  | 'power-up-basic-information-icon-field'
  | 'power-up-basic-information-support-contact-field'
  | 'power-up-capabilities-claims-trello-toggle'
  | 'power-up-collaborators-page-member-item'
  | 'power-up-collaborators-page-spinner'
  | 'power-up-existing-api-key-invalid'
  | 'power-up-generate-api-key-page';

export type WorkspacePowerUps =
  | 'bulk-disable-link'
  | 'bulk-enable-link'
  | 'confirm-disable-button'
  | 'empty-state'
  | 'enabled-board-item'
  | 'enabled-power-up-item'
  | 'power-up-external-link'
  | 'workspace-power-ups-page-spinner';

export type BoardInviteModalTestIds =
  | 'board-invite-link-copy-button'
  | 'board-invite-link-create-button'
  | 'board-invite-link-no-access-option'
  | 'board-invite-link-normal-option'
  | 'board-invite-link-observer-option'
  | 'board-invite-link-select-menu'
  | 'board-invite-modal-close-button'
  | 'board-invite-type-selector-dropdown'
  | 'board-permission-selector-dropdown'
  | 'board-permission-selector'
  | 'board-share-link-label'
  | 'confirm-remove-deactivated-member-button'
  | 'custom-invitation-message-input'
  | 'delete-request-item-button'
  | 'member-list-item-avatar'
  | 'member-list-item-full-name'
  | 'member-list-item-username'
  | 'member-list-item-workspace-role'
  | 'member-multi-select-autocomplete'
  | 'member-type-select'
  | 'multi-board-guest-autocomplete-alert'
  | 'remove-deactivated-member-button'
  | 'remove-member-select-option'
  | 'request-permission-selector-info-icon'
  | 'request-permission-selector'
  | 'upgrade-prompt-pill';

export type BoardMenuTestIds =
  | 'about-this-board-button-header'
  | 'about-this-board-button-summary'
  | 'board-menu-close-button'
  | 'board-menu-container'
  | 'board-menu-copy-button'
  | 'board-menu-current-panel'
  | 'board-menu-custom-fields-button'
  | 'board-menu-custom-fields-popover'
  | 'board-menu-popover'
  | 'board-menu-settings-button'
  | 'butler-board-button'
  | 'change-background-button-preview'
  | 'close-board-confirm-button'
  | 'commenting-permissions-popover'
  | 'create-board-copy-button'
  | 'enterprise-visibility-button'
  | 'invitations-permissions-popover'
  | 'make-template-button'
  | 'org-visibility-button'
  | 'power-ups-button'
  | 'private-visibility-button'
  | 'public-visibility-button'
  | 'stickers-button'
  | 'voting-permissions-popover'
  | 'watch-board-button'
  | 'watching-board-check-icon';

export type BoardMenuSettingsTestIds =
  | 'add-remove-members-item'
  | 'change-workspace-clickable'
  | 'change-workspace-header'
  | 'change-workspace-select-menu'
  | 'change-workspace-submit-button'
  | 'change-workspace'
  | 'collections-header'
  | 'collections-text'
  | 'collections-upgrade-prompt'
  | 'commenting-item'
  | 'complete-status-header'
  | 'cover-header'
  | 'cover-item'
  | 'edit-and-join-setting-subtext'
  | 'edit-collections-subtext'
  | 'permissions-header'
  | 'voting-item'
  | 'workspace-editing-item';

export type AttachmentsTestIds =
  | 'attachment-drop-preview'
  | 'attachment-list'
  | 'attachment-thumbnail'
  | 'audio-viewer'
  | 'close-attachment-viewer'
  | 'delete-attachment'
  | 'email-viewer'
  | 'file-attachments'
  | 'go-to-next-attachment'
  | 'go-to-prev-attachment'
  | 'image-viewer'
  | 'make-cover'
  | 'no-preview-viewer'
  | 'pdf-renderer-controls'
  | 'pdf-renderer-loading'
  | 'pdf-renderer-viewer-container'
  | 'pdf-viewer'
  | 'remove-cover'
  | 'text-viewer'
  | 'thumbnail-iframe'
  | 'video-viewer';

export type AttachmentRestrictionsTestIds =
  | 'allowed-attachment-types'
  | 'attachment-restrictions-allowed-item'
  | 'attachment-restrictions-allowed'
  | 'attachment-restrictions-change-button'
  | 'attachment-restrictions-item-box'
  | 'attachment-restrictions-item-computer'
  | 'attachment-restrictions-item-description-box'
  | 'attachment-restrictions-item-description-computer'
  | 'attachment-restrictions-item-description-dropbox'
  | 'attachment-restrictions-item-description-google-drive'
  | 'attachment-restrictions-item-description-link'
  | 'attachment-restrictions-item-description-onedrive'
  | 'attachment-restrictions-item-description-trello'
  | 'attachment-restrictions-item-dropbox'
  | 'attachment-restrictions-item-google-drive'
  | 'attachment-restrictions-item-label-box'
  | 'attachment-restrictions-item-label-computer'
  | 'attachment-restrictions-item-label-dropbox'
  | 'attachment-restrictions-item-label-google-drive'
  | 'attachment-restrictions-item-label-link'
  | 'attachment-restrictions-item-label-onedrive'
  | 'attachment-restrictions-item-label-trello'
  | 'attachment-restrictions-item-link-box'
  | 'attachment-restrictions-item-link-computer'
  | 'attachment-restrictions-item-link-dropbox'
  | 'attachment-restrictions-item-link-google-drive'
  | 'attachment-restrictions-item-link-link'
  | 'attachment-restrictions-item-link-onedrive'
  | 'attachment-restrictions-item-link-trello'
  | 'attachment-restrictions-item-link'
  | 'attachment-restrictions-item-onedrive'
  | 'attachment-restrictions-item-trello'
  | 'attachment-restrictions-popover'
  | 'attachment-restrictions-prohibited-item'
  | 'attachment-restrictions-prohibited'
  | 'attachment-type-box'
  | 'attachment-type-computer'
  | 'attachment-type-dropbox'
  | 'attachment-type-google-drive'
  | 'attachment-type-link'
  | 'attachment-type-onedrive'
  | 'attachment-type-option-box'
  | 'attachment-type-option-computer'
  | 'attachment-type-option-dropbox'
  | 'attachment-type-option-google-drive'
  | 'attachment-type-option-link'
  | 'attachment-type-option-onedrive'
  | 'attachment-type-option-trello'
  | 'attachment-type-trello'
  | 'change-attachment-restriction-btn'
  | 'prohibited-attachment-types';

export type CrossProductSearchTestIds =
  | 'cross-product-search-atlassian-account-login'
  | 'cross-product-search-inline-onboarding-wrapper'
  | 'cross-product-search-input-skeleton'
  | 'cross-product-search-result'
  | 'jira-tab-mock-input'
  | 'search-dialog-advanced-search-link'
  | 'search-dialog-dialog-wrapper';

export type AdvancedSearchTestIds =
  | 'advanced-search-board-last-update-time'
  | 'advanced-search-board-result-item'
  | 'advanced-search-board-search-filter'
  | 'advanced-search-board-star-button'
  | 'advanced-search-board-star-wrapper'
  | 'advanced-search-card-result-item'
  | 'advanced-search-card-result-loading-spinner'
  | 'advanced-search-card-result-show-more-button'
  | 'advanced-search-clear-search-button'
  | 'advanced-search-filter-component'
  | 'advanced-search-filters-layout'
  | 'advanced-search-include-card-description'
  | 'advanced-search-input'
  | 'advanced-search-is-open'
  | 'advanced-search-last-updated-cards-filter'
  | 'advanced-search-operators-dialog-button'
  | 'advanced-search-result-item-description'
  | 'advanced-search-save-search-button'
  | 'advanced-search-saved-search-container'
  | 'advanced-search-saved-search-link'
  | 'advanced-search-sort-card-results-filter'
  | 'advanced-search-starred-boards-filter'
  | 'delete-saved-search-button';

export type LabelsPopoverTestIds =
  | 'card-label'
  | 'compact-card-label'
  | 'labels-popover-create-label-screen'
  | 'labels-popover-delete-label-screen'
  | 'labels-popover-edit-label-screen'
  | 'labels-popover-labels-screen'
  | 'labels-popover-palette-swatch'
  | 'labels-popover-suggested-labels'
  | 'labels-popover';

export type QrCodeTestIds = 'qr-code-spinner';

export type WorkspaceInviteModalTestIds =
  | 'ws-invite-link-copy-button'
  | 'ws-invite-link-create-button'
  | 'ws-invite-modal-close-button'
  | 'ws-share-link-label';

export type WorkspaceRequestAccessTestIds =
  | 'ws-join-request-approve-button'
  | 'ws-join-request-delete-button'
  | 'ws-join-request-item'
  | 'ws-join-request-limit'
  | 'ws-join-request-list';

export type WorkspaceSettingsOrganizationTestIds =
  | 'admin-only-warning'
  | 'board-deletion-enterprise-change-button'
  | 'board-deletion-enterprise'
  | 'board-deletion-org-change-button'
  | 'board-deletion-org'
  | 'board-deletion-private-change-button'
  | 'board-deletion-private'
  | 'board-deletion-public-change-button'
  | 'board-deletion-public'
  | 'board-deletion-restriction-details-'
  | 'board-invite-restriction-change-button'
  | 'board-visibility-enterprise-change-button'
  | 'board-visibility-enterprise'
  | 'board-visibility-org-change-button'
  | 'board-visibility-org'
  | 'board-visibility-private-change-button'
  | 'board-visibility-private'
  | 'board-visibility-public-change-button'
  | 'board-visibility-public'
  | 'enterprise-hint'
  | 'member-invite-restriction-change-button'
  | 'org-invite-restrict-domain-list-item'
  | 'org-invite-restrict-domain-list'
  | 'org-invite-restrict-enterprise'
  | 'org-invite-restrict'
  | 'organization-restriction-level-'
  | 'organization-visibility-level-enterprise'
  | 'organization-visibility-level-org'
  | 'organization-visibility-level-private'
  | 'organization-visibility-level-public'
  | 'slack-link-restriction-change-button'
  | 'slack-team-self-join'
  | 'upgrade-button'
  | 'visibility-name-'
  | 'workspace-settings-invitation-restrictions-popover'
  | 'workspace-settings-section'
  | 'workspace-settings-visibility-button'
  | 'workspace-settings-visibility-popover-content'
  | 'ws-premium-settings'
  | 'ws-premium-upsell'
  | 'ws-visibility-details';

export type NachosTestIds =
  | 'clickable-checkbox'
  | 'CopyIcon'
  | 'DownIcon'
  | 'nachos-button-link'
  | 'nachos-button'
  | 'nachos-checkbox'
  | 'nachos-popover'
  | 'nachos-textfield'
  | 'SubscribeIcon'
  | 'UpIcon';

export type CustomFieldsIds =
  | 'color-options-'
  | 'create-custom-field-button'
  | 'custom-field-date-field'
  | 'custom-field-date-picker-calendar'
  | 'custom-field-drag-handle'
  | 'custom-field-dropdown-add-button'
  | 'custom-field-dropdown-color-'
  | 'custom-field-dropdown-option'
  | 'custom-field-title'
  | 'custom-fields-number-placeholder'
  | 'custom-fields-section'
  | 'custom-fields-text-placeholder'
  | 'delete-button'
  | 'new-custom-field-button'
  | 'suggested-field-add-button'
  | 'upgrade-prompt';

export type InvitationLinkPageIds =
  | 'email-input'
  | 'invitation-link-page-member-avatar'
  | 'join-button'
  | 'login-button'
  | 'signup-button'
  | 'submit-email-input';

export type JoinBoardModalTestIds =
  | 'join-board-modal-cta'
  | 'join-board-modal-date-last-active'
  | 'join-board-modal-overlay';

export type AboutThisBoardModalTestIds =
  | 'about-this-board-modal-cta-button'
  | 'about-this-board-modal-header';

export type ConfirmEmailBannerTestIds = 'confirm-email-banner';

export type ConfirmEmailModalTestIds =
  | 'confirm-email-modal-overlay'
  | 'date-last-active';

export type HydraChooserTestIds =
  | 'hydra-chooser-head-select'
  | 'hydra-chooser-version-select';

export type CreateTeamVisibilityTestIds = 'create-team-visibility-select-text';

export type EnterpriseMembersTabTestIds =
  | 'atlassian-logo'
  | 'changes-in-deactivation-banner'
  | 'directory-link'
  | 'export-and-search-container'
  | 'show-all-btn'
  | 'subtitle';

export type EnterpriseAdditionProgressBarTestIds =
  | 'complete-banner'
  | 'failureSection'
  | 'incomplete-banner'
  | 'num-licenses-section'
  | 'progress-bar';

export type EnterpriseAdditionFailuresTestIds =
  | 'expandButton'
  | 'failureList'
  | 'select';

export type MemberCardsTableTestIds =
  | 'member-cards-table-member-avatar'
  | 'member-cards-table';

export type ButlerTestIds =
  | 'butler-command-editor-add-due-date-action-editor-date-type'
  | 'butler-command-editor-add-due-date-action-editor-date'
  | 'butler-command-editor-add-due-date-action-editor-time-frame'
  | 'butler-command-editor-card-into-list-trigger-editor-list'
  | 'butler-command-editor-certain-days-trigger-editor-day'
  | 'butler-command-editor-copy-card-action-editor-board'
  | 'butler-command-editor-copy-card-action-editor-list'
  | 'butler-command-editor-copy-card-action-editor-position'
  | 'butler-command-editor-label-selector'
  | 'butler-command-editor-mark-card-complete-action-editor'
  | 'butler-command-editor-mark-due-date-complete-action-editor'
  | 'butler-command-editor-move-card-action-editor-board'
  | 'butler-command-editor-move-card-action-editor-list'
  | 'butler-command-editor-move-card-action-editor-position'
  | 'butler-command-editor-remove-action-button'
  | 'butler-command-editor-remove-from-card-action-field'
  | 'butler-command-editor-sort-list-action-editor-direction'
  | 'butler-command-editor-sort-list-action-editor-field'
  | 'butler-command-editor-sort-list-action-editor-title';

export type SavedViewVisibilityButtonTestIds =
  | 'change-saved-view-visibility-button'
  | 'saved-view-private-visibility-button'
  | 'saved-view-workspace-visibility-button';

export type NotificationAppCreatorTestIds =
  | 'app-creator-icon'
  | 'app-creator-name';

export type MoveCardPopoverTestIds =
  | 'move-card-popover-move-button'
  | 'move-card-popover-select-board-destination'
  | 'move-card-popover-select-list-destination'
  | 'move-card-popover-select-position';

export type QuickCardEditorTestIds =
  | 'mirror-new-button'
  | 'mirror-upgrade-button'
  | 'quick-card-editor-add-card-to-planner'
  | 'quick-card-editor-archive'
  | 'quick-card-editor-buttons'
  | 'quick-card-editor-card-front'
  | 'quick-card-editor-card-title'
  | 'quick-card-editor-change-cover'
  | 'quick-card-editor-change-members'
  | 'quick-card-editor-container'
  | 'quick-card-editor-convert-role'
  | 'quick-card-editor-copy-link-icon'
  | 'quick-card-editor-copy-link'
  | 'quick-card-editor-copy'
  | 'quick-card-editor-delete'
  | 'quick-card-editor-edit-dates'
  | 'quick-card-editor-edit-labels'
  | 'quick-card-editor-move'
  | 'quick-card-editor-open-card'
  | 'quick-card-editor-overlay'
  | 'sticker-move-button'
  | 'sticker-remove-button';

export type EmojiTestIds = 'emoji-mart-picker-spinner' | 'emoji-mart-picker';

export type CardShareMenuTestIds =
  | 'card-share-menu-date'
  | 'card-share-menu-email'
  | 'card-share-menu-embed-link'
  | 'card-share-menu-export-json'
  | 'card-share-menu-id-short'
  | 'card-share-menu-print-model'
  | 'card-share-menu-qr-code'
  | 'card-share-menu-short-url'
  | 'card-share-menu';

export type CardCopyMenuTestIds =
  | 'card-copy-submit-button'
  | 'card-copy-textarea';

export type AtlassianIntelligenceAdminControl =
  | 'activate-ai-button'
  | 'atlassian-intelligence-dialog'
  | 'atlassian-intelligence-section'
  | 'enable-ai-toggle'
  | 'enterprise-settings-button'
  | 'needs-to-agree'
  | 'only-enterprise-admins-hint'
  | 'opt-out-section-message'
  | 'opt-out-success-section-message'
  | 'tos-checkbox';

export type WorkspaceSelectorTestIds =
  | 'trial-eligible-workspace-list'
  | 'upgrade-eligible-workspace-list'
  | 'workspace-list';

export type DiscoveryAdsIds =
  | 'ad-container'
  | 'ad-header'
  | 'dismiss-button'
  | 'feedback-container'
  | 'get-started-button'
  | 'project-management-tool-survey'
  | 'thank-you-container'
  | 'try-it-free-button'
  | 'workspace-nav-spotlight-button';

export type JiraTemplatesIds =
  | 'template-picker-dismiss-button'
  | 'template-picker-jira-template';

export type AccountTransferRequiredTestIds = 'account-transfer-required-banner';

export type StickerPickerTestIds =
  | 'sticker-picker-confirm-delete-sticker-button'
  | 'sticker-picker-custom-stickers'
  | 'sticker-picker-pete-sticker-pack'
  | 'sticker-picker-standard-sticker-pack'
  | 'sticker-picker-taco-sticker-pack';

export type EmailToBoardTestIds =
  | 'email-to-board-ai-toggle'
  | 'email-to-board-button-skeleton'
  | 'email-to-board-dismiss-button'
  | 'email-to-board-list-select'
  | 'email-to-board-menu-button'
  | 'email-to-board-new-pill'
  | 'email-to-board-popover'
  | 'email-to-board-position-select'
  | 'email-to-board-powerup-configure-button'
  | 'email-to-board-spotlight'
  | 'email-to-board-try-it-button';

export type GraphqlExperimentsTestIds =
  | 'graphql-experiments-num-cards-input'
  | 'graphql-experiments-pollute-cache-button'
  | 'graphql-experiments';

export type AIOptOutTestIds =
  | 'accuracy-or-reliability'
  | 'ai-sucks'
  | 'feedback-dialog'
  | 'lack-of-control'
  | 'skip-button'
  | 'still-evaluating'
  | 'submit-button'
  | 'wary-of-costs'
  | 'wary-of-sharing';

export type JiraInviteModalTestIds = 'jira-invite-modal-member-name';

export type OrganizationExportViewTestIds =
  | 'create-new-export-button'
  | 'include-attachments-checkbox';

export type AgendaViewTestIds = 'agenda-view';

export type PlannerTestIds =
  | 'associated-cards-expand-button'
  | 'calendar-color-icon'
  | 'calendar-toggle'
  | 'custom-view'
  | 'date-header-content'
  | 'date-navigation-button'
  | 'date-range-button-next'
  | 'date-range-button-prev'
  | 'day-view-launch-background-dark'
  | 'day-view-launch-background-light'
  | 'event-date-selection-button'
  | 'event-detail-associated-card'
  | 'event-detail-popover'
  | 'event-preview-associated-card'
  | 'event-preview'
  | 'event-time-end-time-button'
  | 'event-time-start-time-button'
  | 'event-unlink-card-button'
  | 'focus-time-delete-button'
  | 'focus-time-popover'
  | 'google-meet-icon'
  | 'launch-banner-graphic-dark'
  | 'launch-banner-graphic-light'
  | 'launch-banner-header-byline'
  | 'loading-panel'
  | 'microsoft-teams-icon'
  | 'open-calendar-button'
  | 'panel-nav-planner-button'
  | 'planner-calendar-list-wrapper'
  | 'planner-error-screen-skeleton'
  | 'planner-event-card-drop-preview'
  | 'planner-header-skeleton'
  | 'planner-launch-screen-skeleton-day'
  | 'planner-launch-screen-skeleton'
  | 'planner-skeleton-day'
  | 'planner-skeleton'
  | 'planner'
  | 'settings-button'
  | 'settings-popover-skeleton-menu-item'
  | 'single-card-event-detail-card-cover'
  | 'status-error-icon'
  | 'stub-planner'
  | 'sync-icon'
  | 'temporary-event-preview'
  | 'three-day-view-launch-background-dark'
  | 'three-day-view-launch-background-light'
  | 'today-button'
  | 'upsell-icon'
  | 'video-icon'
  | 'week-view-launch-background-dark'
  | 'week-view-launch-background-light'
  | 'zoom-icon';

export type InboxTestIds =
  | 'add-from-email-button'
  | 'add-from-ms-teams-button'
  | 'add-from-slack-button'
  | 'add-from-webpages-button'
  | 'archive-completed-cards-button'
  | 'connect-chrome-icon'
  | 'email-to-inbox-copy-button'
  | 'get-chrome-extension-button'
  | 'inbox-active-filters'
  | 'inbox-add-card-button'
  | 'inbox-card-composer-add-card-button'
  | 'inbox-card-composer-cancel-button'
  | 'inbox-card-composer-textarea'
  | 'inbox-change-background-button'
  | 'inbox-container'
  | 'inbox-filter-button'
  | 'inbox-filter-complete'
  | 'inbox-filter-created-last-month'
  | 'inbox-filter-created-last-two-weeks'
  | 'inbox-filter-created-last-week'
  | 'inbox-filter-due-next-day'
  | 'inbox-filter-due-next-month'
  | 'inbox-filter-due-next-week'
  | 'inbox-filter-incomplete'
  | 'inbox-filter-keyword'
  | 'inbox-filter-no-due-date'
  | 'inbox-filter-overdue'
  | 'inbox-filter-popover'
  | 'inbox-header'
  | 'inbox-hero'
  | 'inbox-launch-screen'
  | 'inbox-list-card'
  | 'inbox-list-cards'
  | 'inbox-menu-ai-toggle'
  | 'inbox-menu-button'
  | 'inbox-menu-change-background-button-preview'
  | 'inbox-menu-popover-list'
  | 'inbox-menu-settings-button'
  | 'inbox-quick-capture-discovery-button-container'
  | 'inbox-quick-capture-discovery-chrome-button'
  | 'inbox-quick-capture-discovery-expand-button'
  | 'inbox-quick-capture-discovery-expandable-panel'
  | 'inbox-quick-capture-discovery-info-panel-expandable'
  | 'inbox-quick-capture-discovery-info-panel-footer'
  | 'inbox-quick-capture-discovery-info-panel'
  | 'panel-nav-inbox-button'
  | 'show-more-options-button'
  | 'sort-button'
  | 'trello-inbox-container'
  | 'view-archived-cards-button';

export type SplitScreenTestIds = 'resize-divider' | 'split-screen-panel';

export type SmartLinkTestIds =
  | 'smart-links-container-layered-link'
  | 'smart-links-container';

export type AllDayEventsSectionTestIds = 'all-day-events-section';

export type ColorPaletteTestIds =
  | 'color-palette'
  | 'color-tile'
  | 'tile-container';

export type PostOfficeConfigurationTestIds =
  | 'post-office-configuration-local'
  | 'post-office-configuration-production'
  | 'post-office-configuration-staging'
  | 'post-office-configuration-test-server'
  | 'post-office-configuration-test';

export type GlobalBannersTestIds = 'banner' | 'banners';

export type PPOnboardingModalTestIds =
  | 'first-screen-progress-indicator'
  | 'fourth-screen-progress-indicator'
  | 'pp-onboarding-modal-close-button'
  | 'second-screen-progress-indicator'
  | 'third-screen-progress-indicator';

export type GAModalTestIds = 'ga-modal-close-button';

export type BoardLimitErrorTestIds = 'BoardLimitError';

export type EnterpriseAuditLogTestIds =
  | 'audit-log-container'
  | 'export-google-sheets-btn';

export type MapViewTestIds = 'map-view-wrapper';

export type PluginTestIds = 'plugin-modal';

export type InternalToolsTestIds =
  | 'floating-internal-tools-button'
  | 'ssr-rendering-error-banner';

export type AutomationDashboardTestIds =
  | 'automation-dashboard'
  | 'automation-library-disable-all-button'
  | 'automation-library-enable-all-button'
  | 'automation-library-import-button'
  | 'automation-library-rename-button';

export type TestId =
  | AboutThisBoardModalTestIds
  | AccountMenuTestIds
  | AccountTransferRequiredTestIds
  | AdvancedSearchTestIds
  | AgendaViewTestIds
  | AIOptOutTestIds
  | AllDayEventsSectionTestIds
  | AppManagementTestIds
  | AtlassianIntelligenceAdminControl
  | AttachmentRestrictionsTestIds
  | AttachmentsTestIds
  | AutomationDashboardTestIds
  | BadgesTestIds
  | BCTeamOnboardingTestIds
  | BillingIds
  | BoardBackgroundTileTestIds
  | BoardHeaderTestIds
  | BoardInviteModalTestIds
  | BoardLimitErrorTestIds
  | BoardMenuSettingsTestIds
  | BoardMenuTestIds
  | BoardReportsViewTestIds
  | BoardSwitcherTestIds
  | BoardTestIds
  | BoardTileTestIds
  | ButlerTestIds
  | CalendarViewTestIds
  | CanonicalCard
  | CardBackTestIds
  | CardCopyMenuTestIds
  | CardFrontTestIds
  | CardShareMenuTestIds
  | CardTemplateTestIds
  | CardTestIds
  | ChecklistTestIds
  | ChooseMemberTestIds
  | CloseBoardTestIds
  | ColorPaletteTestIds
  | ConfirmEmailBannerTestIds
  | ConfirmEmailModalTestIds
  | CookiesConsentTestIds
  | CreateBoardTestIds
  | CreateFirstBoardIds
  | CreateTeamVisibilityTestIds
  | CrossProductSearchTestIds
  | CustomFieldsIds
  | DateParserTestIds
  | DateRangePickerTestIds
  | DeleteWorkspaceTestIds
  | DescriptionTestIds
  | DiscoveryAdsIds
  | EditorTestIds
  | EmailToBoardTestIds
  | EmojiTestIds
  | EnterpriseAdditionFailuresTestIds
  | EnterpriseAdditionProgressBarTestIds
  | EnterpriseAuditLogTestIds
  | EnterpriseDashboardSideBarTestIds
  | EnterpriseDashboardTestIds
  | EnterpriseMembersTabTestIds
  | FilterPopoverTestIds
  | FreeTrialTestIds
  | GAModalTestIds
  | GlobalBannersTestIds
  | GraphqlExperimentsTestIds
  | HeaderTestIds
  | HomeTestIds
  | HydraChooserTestIds
  | InboxBoardBackgroundTileTestIds
  | InboxTestIds
  | InternalToolsTestIds
  | InvitationLinkPageIds
  | JiraInviteModalTestIds
  | JiraTemplatesIds
  | JoinBoardModalTestIds
  | LabelsPopoverTestIds
  | ListTestIds
  | MapViewTestIds
  | MemberBoardsTestIds
  | MemberCardsTableTestIds
  | MoonshotTestIds
  | MoveCardPopoverTestIds
  | NachosTestIds
  | NavigationTestIds
  | NewUserOnboardingTestIds
  | NotificationAppCreatorTestIds
  | NotificationSettingsTestIds
  | NotificationTestIds
  | OnboardingIds
  | OpenSourceAttributionsTestIds
  | OrganizationExportViewTestIds
  | OrganizationViewTestIds
  | PlannerTestIds
  | PluginTestIds
  | PopoverTestIds
  | PostOfficeConfigurationTestIds
  | PowerUpTestIds
  | PPOnboardingModalTestIds
  | ProfileCardTestIds
  | ProfileTestIds
  | PurchaseFormIds
  | QrCodeTestIds
  | QuickCardEditorTestIds
  | RecentlyViewedBoardsMenuTestIds
  | RequestAccessWhenBlockedTestIds
  | RovoTestIds
  | SavedViewVisibilityButtonTestIds
  | ShortcutsPageTestIds
  | SlackCodesTestIds
  | SmartLinkTestIds
  | SplitScreenTestIds
  | StarredBoardsListTestIds
  | StarredBoardsMenuTestIds
  | StickerPickerTestIds
  | TableTestIds
  | TeamTestIds
  | TemplatePickerContainerTestIds
  | TemplatesMenuTestIds
  | TemplatesTestIds
  | TestClass
  | TimelineTestIds
  | UpgradePromptTestIds
  | ViewHeaderTestIds
  | ViewSuggestionTestIds
  | ViewSwitcherTestIds
  | WorkspaceChooserTestIds
  | WorkspaceInviteModalTestIds
  | WorkspaceNavigationTestIds
  | WorkspacePowerUps
  | WorkspaceRequestAccessTestIds
  | WorkspaceSelectorTestIds
  | WorkspaceSettingsOrganizationTestIds
  | WorkspaceSwitcherTestIds
  | WorkspaceViewTestIds
  | YourCardsTestIds;

export type TestClass = SelectTestClasses | TableTestClasses | TeamTestClasses;
