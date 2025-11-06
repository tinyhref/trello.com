import type { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';

export const MessageKeys: { [key: string]: string[] } = {
  notFound: [
    'page-not-found',
    'this-page-may-be-private-you-may-be-able-to-view-it-by-logging-in',
    'this-page-may-be-private-if-someone-gave-you-this-link-you-may-need-to-be-a-board-or-workspace-member-to-access-it',
  ],
  boardNotFound: [
    'board-not-found',
    'this-board-may-be-private-you-may-be-able-to-view-it-by-logging-in',
    'this-board-may-be-private-if-someone-gave-you-this-link-they-may-need-to-share-the-board-with-you-or-invite-you-to-their-workspace',
  ],
  notPermissionsToSeeBoard: [
    'you-dont-have-permission-to-see-this-board',
    'this-page-may-be-private-you-may-be-able-to-view-it-by-logging-in',
    'this-page-may-be-private-if-someone-gave-you-this-link-you-may-need-to-be-a-board-or-workspace-member-to-access-it',
  ],
  noPermissionToSeeSearch: [
    'looks-like-you-need-to-be-logged-into-your-trello-account-to-complete-this-search',
    'sign-up',
    'log-in',
    'learn-more-about-trello',
  ],
  cardNotFound: [
    'card-not-found',
    'this-card-may-be-on-a-private-board-you-may-be-able-to-view-it-by-logging-in',
    'this-card-may-be-on-a-private-board-if-someone-gave-you-this-link-they-may-need-to-share-the-board-with-you-or-invite-you-to-their-workspace',
  ],
  malformedUrl: [
    'malformed-url',
    'the-url-does-not-look-like-a-valid-trello-url',
    'the-url-does-not-look-like-a-valid-trello-url',
  ],
  unconfirmedOrgNotFound: [
    'please-confirm-your-email-address-to-view-this-org',
  ],
  unconfirmedBoardNotFound: [
    'please-confirm-your-email-address-to-view-this-board',
  ],
  unconfirmedEnterpriseNotFound: [
    'please-confirm-your-email-address-to-view-this-enterprise',
  ],
  serverError: ['trouble-loading-board', 'trouble-loading-trello'],
};

export const getHeaderMessage = (headerKey: string) => {
  switch (headerKey) {
    case 'page-not-found':
      return (
        <FormattedMessage
          id="templates.error.page-not-found"
          defaultMessage="Page not found."
          description="Page not found error message"
        />
      );
    case 'board-not-found':
      return (
        <FormattedMessage
          id="templates.error.board-not-found"
          defaultMessage="Board not found."
          description="Board not found error message"
        />
      );
    case 'you-dont-have-permission-to-see-this-board':
      return (
        <FormattedMessage
          id="templates.error.you-dont-have-permission-to-see-this-board"
          defaultMessage="You don't have permission to see this board"
          description="You don't have permission to see this board error message"
        />
      );
    case 'card-not-found':
      return (
        <FormattedMessage
          id="templates.error.card-not-found"
          defaultMessage="Card not found."
          description="Card not found error message"
        />
      );
    case 'malformed-url':
      return (
        <FormattedMessage
          id="templates.error.malformed-url"
          defaultMessage="Malformed URL"
          description="Malformed URL error message"
        />
      );
    case 'please-confirm-your-email-address-to-view-this-org':
      return (
        <FormattedMessage
          id="templates.error.please-confirm-your-email-address-to-view-this-org"
          defaultMessage="Please confirm your email address to view this Workspace."
          description="Please confirm your email address to view this org error message"
        />
      );
    case 'please-confirm-your-email-address-to-view-this-board':
      return (
        <FormattedMessage
          id="templates.error.please-confirm-your-email-address-to-view-this-board"
          defaultMessage="Please confirm your email address to view this board."
          description="Please confirm your email address to view this board error message"
        />
      );
    case 'please-confirm-your-email-address-to-view-this-enterprise':
      return (
        <FormattedMessage
          id="templates.error.please-confirm-your-email-address-to-view-this-enterprise"
          defaultMessage="Please confirm your email address to view this Enterprise."
          description="Please confirm your email address to view this enterprise error message"
        />
      );
    default:
      return null;
  }
};

export const getLoggedOutMessage = (
  loggedOutMessageKey: string,
  logInLink?: ReactNode,
) => {
  switch (loggedOutMessageKey) {
    case 'this-page-may-be-private-you-may-be-able-to-view-it-by-logging-in':
      return (
        <FormattedMessage
          id="templates.error.this-page-may-be-private-you-may-be-able-to-view-it-by-logging-in"
          defaultMessage="This page may be private. You may be able to view it by {logInLink}."
          description="This page may be private. You may be able to view it by logging in error message"
          values={{ logInLink }}
        />
      );
    case 'this-card-may-be-on-a-private-board-you-may-be-able-to-view-it-by-logging-in':
      return (
        <FormattedMessage
          id="templates.error.this-card-may-be-on-a-private-board-you-may-be-able-to-view-it-by-logging-in"
          defaultMessage="This card may be on a private board. You may be able to view it by {logInLink}."
          description="This card may be on a private board. You may be able to view it by logging in error message"
          values={{ logInLink }}
        />
      );
    case 'the-url-does-not-look-like-a-valid-trello-url':
      return (
        <FormattedMessage
          id="templates.error.the-url-does-not-look-like-a-valid-trello-url"
          defaultMessage="The link you entered does not look like a valid Trello link. If someone gave you this link, you may need to ask them to check that it's correct."
          description="The URL does not look like a valid Trello URL error message"
        />
      );
    default:
      return null;
  }
};

export const getLoggedInMessage = (loggedInMessageKey: string) => {
  switch (loggedInMessageKey) {
    case 'this-page-may-be-private-if-someone-gave-you-this-link-you-may-need-to-be-a-board-or-workspace-member-to-access-it':
      return (
        <FormattedMessage
          id="templates.error.this-page-may-be-private-if-someone-gave-you-this-link-you-may-need-to-be-a-board-or-workspace-member-to-access-it"
          defaultMessage="This page may be private. If someone gave you this link, you may need to be a board or Workspace member to access it."
          description="This page may be private. If someone gave you this link, you may need to be a board or workspace member to access it error message"
        />
      );
    case 'this-board-may-be-private-if-someone-gave-you-this-link-they-may-need-to-share-the-board-with-you-or-invite-you-to-their-workspace':
      return (
        <FormattedMessage
          id="templates.error.this-board-may-be-private-if-someone-gave-you-this-link-they-may-need-to-share-the-board-with-you-or-invite-you-to-their-workspace"
          defaultMessage="This board may be private. If someone gave you this link, they may need to share the board with you or invite you to their Workspace."
          description="This board may be private. If someone gave you this link, they may need to share the board with you or invite you to their Workspace error message"
        />
      );
    case 'this-card-may-be-on-a-private-board-if-someone-gave-you-this-link-they-may-need-to-share-the-board-with-you-or-invite-you-to-their-workspace':
      return (
        <FormattedMessage
          id="templates.error.this-card-may-be-on-a-private-board-if-someone-gave-you-this-link-they-may-need-to-share-the-board-with-you-or-invite-you-to-their-workspace"
          defaultMessage="This card may be on a private board. If someone gave you this link, they may need to share the board with you or invite you to their Workspace."
          description="This card may be on a private board. If someone gave you this link, they may need to share the board with you or invite you to their Workspace error message"
        />
      );
    case 'the-url-does-not-look-like-a-valid-trello-url':
      return (
        <FormattedMessage
          id="templates.error.the-url-does-not-look-like-a-valid-trello-url"
          defaultMessage="The link you entered does not look like a valid Trello link. If someone gave you this link, you may need to ask them to check that it's correct."
          description="The URL does not look like a valid Trello URL error message"
        />
      );
    default:
      return null;
  }
};

export const getServerErrorMessage = (messageKey: string) => {
  switch (messageKey) {
    case 'trouble-loading-board':
      return (
        <FormattedMessage
          id="templates.error.trouble-loading-board"
          defaultMessage="We're having trouble loading this board."
          description="Trouble loading board error message"
        />
      );
    case 'trouble-loading-trello':
      return (
        <FormattedMessage
          id="templates.error.trouble-loading-trello"
          defaultMessage="We're having trouble loading Trello."
          description="Trouble loading board error message"
        />
      );
    default:
      return null;
  }
};

export const getUnconfirmedErrorMessage = (messageKey: string) => {
  switch (messageKey) {
    case 'please-confirm-your-email-address-to-view-this-org':
      return (
        <FormattedMessage
          id="templates.error.please-confirm-your-email-address-to-view-this-org"
          defaultMessage="Please confirm your email address to view this Workspace."
          description="Please confirm your email address to view this org error message"
        />
      );
    case 'please-confirm-your-email-address-to-view-this-board':
      return (
        <FormattedMessage
          id="templates.error.please-confirm-your-email-address-to-view-this-board"
          defaultMessage="Please confirm your email address to view this board."
          description="Please confirm your email address to view this board error message"
        />
      );
    case 'please-confirm-your-email-address-to-view-this-enterprise':
      return (
        <FormattedMessage
          id="templates.error.please-confirm-your-email-address-to-view-this-enterprise"
          defaultMessage="Please confirm your email address to view this Enterprise."
          description="Please confirm your email address to view this enterprise error message"
        />
      );
    default:
      return null;
  }
};
