import { addMinutes } from 'date-fns';
import { useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';

import { Analytics } from '@trello/atlassian-analytics';
import { getScreenFromUrl } from '@trello/marketing-screens';
import { showFlag } from '@trello/nachos/experimental-flags';
import { useSharedState } from '@trello/shared-state';
import { TrelloStorage } from '@trello/storage';

import type { FormattedNotification } from 'app/src/components/NotificationsMenu';
import { notificationsState } from 'app/src/components/NotificationsMenu';
import { useSetReadNotificationsMutation } from './SetReadNotificationsMutation.generated';

// eslint-disable-next-line @trello/assets-alongside-implementation
import tacoIcon from 'resources/images/invite-acceptance/tacoIcon.svg';

const commonFlagAttributes = {
  isAutoDismiss: true,
  msTimeout: 8000,
  image: { src: tacoIcon },
};

type ModelType = 'board' | 'organization';

interface AcceptedInvites {
  organization?: {
    [key: string]: FormattedNotification[];
  };
  board?: {
    [key: string]: FormattedNotification[];
  };
}

interface InvitationCounter {
  organization: number;
  board: number;
}

interface FlaggedInvitesById {
  [key: string]: number;
}

const INVITE_ACCEPTANCE_STORAGE_KEY = 'recentlyFlaggedInvites';
const DATE_LAST_VIEWED_NOTIFICATIONS = 'dateLastViewedNotifications';
const THROTTLE_BY_MINUTES = 10;

export const InviteAcceptance = () => {
  const [setReadNotifications] = useSetReadNotificationsMutation();
  const [sharedState] = useSharedState(notificationsState);
  const intl = useIntl();

  useEffect(() => {
    Analytics.sendTrackEvent({
      action: 'loaded',
      actionSubject: 'feature',
      actionSubjectId: 'inviteAcceptanceManager',
      source: getScreenFromUrl(),
    });
  }, []);

  // calling this function returns a function that then sends the analytics event
  // this allows us to easily provide an inline function for `onClick` that doesn't trip the arrow function eslint rule while also supporting parameters
  const createSendLinkClickedEventCallback = useCallback(
    ({ modelType, idModel }: { modelType: ModelType; idModel: string }) =>
      () => {
        const eventDetails: {
          linkName: 'boardLink' | 'membersTab';
          source:
            | 'memberJoinedBoardInlineDialog'
            | 'memberJoinedWorkspaceInlineDialog';
          attributes: { idBoard?: string; workspaceId?: string };
        } =
          modelType === 'board'
            ? {
                linkName: 'boardLink',
                source: 'memberJoinedBoardInlineDialog',
                attributes: {
                  idBoard: idModel,
                },
              }
            : {
                linkName: 'membersTab',
                source: 'memberJoinedWorkspaceInlineDialog',
                attributes: {
                  workspaceId: idModel,
                },
              };
        Analytics.sendClickedLinkEvent(eventDetails);
      },
    [],
  );

  useEffect(() => {
    // a user can load an infinite number of notifications via the infinite scroller notification panel
    // those notifications get added to sharedState
    // To be performance conscious we shouldn't run .filter() on a huge list, so we'll cap it to the first 10
    const cappedNotifications = sharedState?.notificationGroups?.slice(0, 10);
    const unreadMemberJoinedNotificationGroups = cappedNotifications.filter(
      (notificationGroup) =>
        // these notification types are only ever a group of 1, so we can safely look at index 0
        (notificationGroup.notifications[0]?.type === 'memberJoinedBoard' ||
          notificationGroup.notifications[0]?.type ===
            'memberJoinedWorkspace') &&
        notificationGroup.notifications[0]?.unread,
    );

    if (!unreadMemberJoinedNotificationGroups.length) {
      return;
    }

    const notificationIds: string[] = [];
    const nowDate = new Date();
    const unreadInvitesByType: AcceptedInvites = {};
    const numInvitations: InvitationCounter = { board: 0, organization: 0 };
    // used to track last time we showed a flag for a specific model
    let recentlyFlaggedInvites: FlaggedInvitesById | null = TrelloStorage.get(
      INVITE_ACCEPTANCE_STORAGE_KEY,
    );
    // this piece handles a couple things
    // 1 - makes sure we don't show flags if the notification causing the flag was recently viewed in the notifications panel
    // 2 - makes sure we don't show flags if an eligible notification is manually marked as unread
    const dateLastViewedNotifications =
      TrelloStorage.get(DATE_LAST_VIEWED_NOTIFICATIONS) || 0;

    // verify we are working with an object
    if (!recentlyFlaggedInvites || typeof recentlyFlaggedInvites !== 'object') {
      recentlyFlaggedInvites = {};
    } else {
      // if we are working with an object, remove ids for models that haven't been flagged recently
      for (const idModel in recentlyFlaggedInvites) {
        const lastViewedModel = new Date(recentlyFlaggedInvites[idModel]);
        if (addMinutes(lastViewedModel, THROTTLE_BY_MINUTES) < nowDate) {
          delete recentlyFlaggedInvites[idModel];
        }
      }
    }

    unreadMemberJoinedNotificationGroups.forEach((notificationGroup) => {
      // we previously filtered for our specific notification types which are only ever in a group of 1, so we can safely only look at index 0
      const notification = notificationGroup.notifications[0];
      const modelType = notification.data?.invitation?.modelType as
        | 'board'
        | 'organization';
      const idModel = notification.data?.invitation?.idModel;
      if (!modelType || !idModel) {
        // notification missing important data. Ignore it
        return;
      }
      // check if we've recently shown a flag for the same idModel as this notification
      if (recentlyFlaggedInvites?.[idModel]) {
        // ignore this notification if we've seen one recently
        // No need for date comparison here since obsolete ones are removed after pulling from local storage
        return;
      }

      // handle edge case where a notification could be manually marked unread while viewing the notification panel
      // if you're viewing the notification panel, its safe to say you've seen the notification and don't need a flag
      const notificationTimestamp = notification.date
        ? new Date(notification.date).getTime()
        : null;
      if (
        dateLastViewedNotifications &&
        notificationTimestamp &&
        dateLastViewedNotifications >= notificationTimestamp
      ) {
        // Notification is old so we don't care
        return;
      }

      if (unreadInvitesByType[modelType]) {
        // Store unread notification
        if (unreadInvitesByType[modelType]![idModel]) {
          unreadInvitesByType[modelType]![idModel].push(notification);
        } else {
          unreadInvitesByType[modelType]![idModel] = [notification];
        }
      } else {
        unreadInvitesByType[modelType] = {
          [String(idModel)]: [notification],
        };
      }
      notificationIds.push(notification.id);
      numInvitations[modelType]++;
    });

    // go through unread notifications and consolidate into flags
    for (const modelType in unreadInvitesByType) {
      const notificationsByModelType =
        unreadInvitesByType[modelType as ModelType];
      for (const idModel in notificationsByModelType) {
        recentlyFlaggedInvites[idModel] = nowDate.valueOf();
      }
      const notificationsByModelTypeEntries = Object.entries(
        // have to use `as object` since typescript looks at the `AcceptedInvites` type and sees both high level keys could technically be undefined
        notificationsByModelType as object,
      );
      // regardless of what scenario we end up in (multiple users accepting invites, single user, multiple models, etc.)
      // we will always need data on at least one notification. And in each case, we can safely grab from the first notification
      const firstNotification = notificationsByModelTypeEntries[0][1][0];
      const flagId =
        modelType === 'board' ? 'memberJoinedBoard' : 'memberJoinedWorkspace';

      // If we have invites for multiple boards/workspaces
      if (notificationsByModelTypeEntries.length > 1) {
        // get a unique list of all invited member IDs
        const invitedIds: string[] = [];
        notificationsByModelTypeEntries.forEach((modelNotificationEntry) => {
          modelNotificationEntry[1].forEach(
            (notification: FormattedNotification) => {
              if (notification.idMemberCreator) {
                invitedIds.push(notification.idMemberCreator);
              }
            },
          );
        });
        const uniqueInvitedIds = [...new Set(invitedIds)];
        // single invitee joins multiple boards/workspaces
        if (uniqueInvitedIds.length === 1) {
          if (modelType === 'board') {
            showFlag({
              id: flagId,
              seed: firstNotification.data.invitation.idModel,
              title: intl.formatMessage(
                {
                  id: 'templates.invite_acceptance.flag-titles.member-joined-multiple-boards',
                  defaultMessage: '{member} joined your boards',
                  description:
                    'Title shown when a member joins multiple boards',
                },
                { member: firstNotification.memberCreator?.fullName },
              ),
              description: intl.formatMessage({
                id: 'templates.invite_acceptance.flag-descriptions.single-user-joined-multiple-models',
                defaultMessage:
                  "Add them to specific cards so they'll know which boards to start in.",
                description:
                  'Description shown when a member joins multiple boards',
              }),
              ...commonFlagAttributes,
            });
          } else {
            showFlag({
              id: flagId,
              seed: firstNotification.data.invitation.idModel,
              title: intl.formatMessage(
                {
                  id: 'templates.invite_acceptance.flag-titles.member-joined-multiple-workspaces',
                  defaultMessage: '{member} joined your Workspaces',
                  description:
                    'Title shown when a member joins multiple workspaces',
                },
                { member: firstNotification.memberCreator?.fullName },
              ),
              description: intl.formatMessage({
                id: 'templates.invite_acceptance.flag-descriptions.single-user-joined-multiple-models',
                defaultMessage:
                  "Add them to specific cards so they'll know which boards to start in.",
                description:
                  'Description shown when a member joins multiple workspaces',
              }),
              ...commonFlagAttributes,
            });
          }
        } else {
          // multiple invitees join multiple boards/workspaces
          if (modelType === 'board') {
            showFlag({
              id: flagId,
              seed: firstNotification.data.invitation.idModel,
              title: intl.formatMessage({
                id: 'templates.invite_acceptance.flag-titles.new-members-joined-multiple-boards',
                defaultMessage: 'New teammates joined your boards',
                description:
                  'Title shown when multiple members join multiple boards',
              }),
              description: intl.formatMessage({
                id: 'templates.invite_acceptance.flag-descriptions.multiple-users-joined-multiple-models',
                defaultMessage:
                  "Add them to specific cards so they'll know which boards to start in.",
                description:
                  'Description shown when multiple members join multiple boards',
              }),
              ...commonFlagAttributes,
            });
          } else {
            showFlag({
              id: flagId,
              seed: firstNotification.data.invitation.idModel,
              title: intl.formatMessage({
                id: 'templates.invite_acceptance.flag-titles.new-members-joined-multiple-workspaces',
                defaultMessage: 'New members joined your Workspaces',
                description:
                  'Title shown when multiple members join multiple workspaces',
              }),
              description: intl.formatMessage({
                id: 'templates.invite_acceptance.flag-descriptions.multiple-users-joined-multiple-models',
                defaultMessage:
                  "Add them to specific cards so they'll know which boards to start in.",
                description:
                  'Description shown when multiple members join multiple workspaces',
              }),
              ...commonFlagAttributes,
            });
          }
        }
      } else {
        const idModel: string = notificationsByModelTypeEntries[0][0];
        // multiple people joined a single board/workspace
        if (notificationsByModelType![idModel].length > 1) {
          if (modelType === 'board') {
            showFlag({
              id: flagId,
              seed: firstNotification.data.invitation.idModel,
              title: intl.formatMessage(
                {
                  id: 'templates.invite_acceptance.flag-titles.new-members-joined-board',
                  defaultMessage: 'New teammates joined "{boardName}"',
                  description:
                    'Title shown when multiple members join a single board',
                },
                { boardName: firstNotification.data?.board?.name },
              ),
              description: intl.formatMessage({
                id: 'templates.invite_acceptance.flag-descriptions.multiple-users-joined-single-board',
                defaultMessage:
                  "Add them to a card so they'll know where to get started.",
                description:
                  'Description shown when multiple members join a single board',
              }),
              actions: [
                {
                  href: `/b/${firstNotification.data?.board?.shortLink}`,
                  onClick: createSendLinkClickedEventCallback({
                    // modelType is derived from an object key. Both keys on the object are marked optional so typescript requires we be explicit
                    modelType: modelType as ModelType,
                    idModel,
                  }),
                  content: intl.formatMessage({
                    id: 'templates.invite_acceptance.cta.go-to-board',
                    defaultMessage: 'Go to board',
                    description:
                      'CTA shown when multiple members join a single board',
                  }),
                  type: 'link',
                },
              ],
              ...commonFlagAttributes,
            });
          } else {
            showFlag({
              id: flagId,
              seed: firstNotification.data.invitation.idModel,
              title: intl.formatMessage(
                {
                  id: 'templates.invite_acceptance.flag-titles.new-members-joined-workspace',
                  defaultMessage: 'New members joined "{workspaceName}"',
                  description:
                    'Title shown when multiple members join a single workspace',
                },
                {
                  workspaceName: firstNotification.data?.organization?.name,
                },
              ),
              description: intl.formatMessage({
                id: 'templates.invite_acceptance.flag-descriptions.multiple-users-joined-single-workspace',
                defaultMessage:
                  "Add them to a card so they'll know which board to get started in.",
                description:
                  'Description shown when multiple members join a single workspace',
              }),
              actions: [
                {
                  href: `/w/${firstNotification.data?.organization?.id}/members`,
                  onClick: createSendLinkClickedEventCallback({
                    modelType: modelType as ModelType,
                    idModel,
                  }),
                  content: intl.formatMessage({
                    id: 'templates.invite_acceptance.cta.go-to-workspace',
                    defaultMessage: 'Go to Workspace',
                    description:
                      'CTA shown when multiple members join a single workspace',
                  }),
                  type: 'link',
                },
              ],
              ...commonFlagAttributes,
            });
          }
        } else {
          // single person joined single board/workspace
          if (modelType === 'board') {
            showFlag({
              id: flagId,
              seed: firstNotification.data.invitation.idModel,
              title: intl.formatMessage(
                {
                  id: 'templates.invite_acceptance.flag-titles.member-joined-board',
                  defaultMessage: '{member} joined "{boardName}"',
                  description:
                    'Title shown when a single member joins a single board',
                },
                {
                  member: firstNotification.memberCreator?.fullName,
                  boardName: firstNotification.data?.board?.name,
                },
              ),
              description: intl.formatMessage({
                id: 'templates.invite_acceptance.flag-descriptions.single-user-joined-board',
                defaultMessage:
                  "Add them to a card so they'll know where to get started.",
                description:
                  'Description shown when a single member joins a single board',
              }),
              actions: [
                {
                  href: `/b/${firstNotification.data?.board?.shortLink}`,
                  onClick: createSendLinkClickedEventCallback({
                    // modelType is derived from an object key. Both keys on the object are marked optional so typescript requires we be explicit
                    modelType: modelType as ModelType,
                    idModel,
                  }),
                  content: intl.formatMessage({
                    id: 'templates.invite_acceptance.cta.go-to-board',
                    defaultMessage: 'Go to board',
                    description:
                      'CTA shown when a single member joins a single board',
                  }),
                  type: 'link',
                },
              ],
              ...commonFlagAttributes,
            });
          } else {
            showFlag({
              id: flagId,
              seed: firstNotification.data.invitation.idModel,
              title: intl.formatMessage(
                {
                  id: 'templates.invite_acceptance.flag-titles.member-joined-workspace',
                  defaultMessage:
                    '{member} is now a member of "{workspaceName}"',
                  description:
                    'Title shown when a single member joins a single workspace',
                },
                {
                  member: firstNotification.memberCreator?.fullName,
                  workspaceName: firstNotification.data?.organization?.name,
                },
              ),
              description: intl.formatMessage({
                id: 'templates.invite_acceptance.flag-descriptions.single-user-joined-workspace',
                defaultMessage:
                  "Add them to a card so they'll know which board to get started in.",
                description:
                  'Description shown when a single member joins a single workspace',
              }),
              actions: [
                {
                  href: `/w/${firstNotification.data?.organization?.id}/members`,
                  onClick: createSendLinkClickedEventCallback({
                    modelType: modelType as ModelType,
                    idModel,
                  }),
                  content: intl.formatMessage({
                    id: 'templates.invite_acceptance.cta.go-to-workspace',
                    defaultMessage: 'Go to Workspace',
                    description:
                      'CTA shown when a single member joins a single workspace',
                  }),
                  type: 'link',
                },
              ],
              ...commonFlagAttributes,
            });
          }
        }
      }

      // track flag displaying
      Analytics.sendScreenEvent({
        name:
          modelType === 'board'
            ? 'memberJoinedBoardInlineDialog'
            : 'memberJoinedWorkspaceInlineDialog',
        attributes: {
          numInvitations: numInvitations[modelType as ModelType],
        },
      });
    }
    // Track last viewed date for each idModel we are flagging on
    TrelloStorage.set(INVITE_ACCEPTANCE_STORAGE_KEY, recentlyFlaggedInvites);

    if (notificationIds.length) {
      const taskName = 'edit-notification/read';
      const source = 'inviteAcceptanceManager';
      const traceId = Analytics.startTask({ taskName, source });
      setReadNotifications({ variables: { ids: notificationIds } })
        .then(({ data }) => {
          if (data?.setNotificationsRead?.success) {
            Analytics.taskSucceeded({ taskName, source, traceId });
          } else {
            Analytics.taskFailed({
              taskName,
              source,
              traceId,
              error: new Error('Failed to set read status'),
            });
          }
        })
        .catch((error) => {
          Analytics.taskFailed({ error, taskName, source, traceId });
        });
    }
  }, [
    createSendLinkClickedEventCallback,
    setReadNotifications,
    sharedState?.notificationGroups,
    intl,
  ]);

  return null;
};
