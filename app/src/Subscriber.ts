/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import _ from 'underscore';

import { isMemberLoggedIn } from '@trello/authentication';
import Backbone from '@trello/backbone';
import { hasValidInvitationLinkForModel } from '@trello/invitation-links';
import { hasValidInviteTokenForModel } from '@trello/invitation-tokens';
import type {
  BoardSubscription,
  EnterpriseSubscription,
  MemberSubscription,
  OrganizationSubscription,
  RealtimeUpdaterClient,
  Subscription,
} from '@trello/realtime-updater';
import { subscriptionManager } from '@trello/realtime-updater';

import { Auth } from 'app/scripts/db/Auth';
import type { Board as BoardModel } from 'app/scripts/models/Board';
import { Board } from 'app/scripts/models/Board';
import { Card } from 'app/scripts/models/Card';
import { Enterprise } from 'app/scripts/models/Enterprise';
import { Organization } from 'app/scripts/models/Organization';

type SubscriptionMap = Record<string, Pick<Subscription, 'modelType' | 'tags'>>;

const setEqual = (a: string[], b: string[]) =>
  a.length === b.length && b.length === _.union(a, b).length;

class BoundedUniqueQueue<TContent> {
  maxLength: number;
  contents: TContent[];

  constructor(maxLength: number) {
    this.maxLength = maxLength;
    this.contents = [];
  }

  pushift(x: TContent) {
    this.contents = _.without(this.contents, x);
    this.contents.push(x);

    if (this.contents.length > this.maxLength) {
      return this.contents.shift();
    } else {
      return null;
    }
  }

  remove(x: TContent) {
    return (this.contents = _.without(this.contents, x));
  }

  map(f: (entry: TContent) => Subscription[]) {
    return this.contents.map(f);
  }
}

const getMySubscriptions = function (): Subscription[] {
  if (isMemberLoggedIn()) {
    return [
      {
        modelType: 'Member',
        idModel: Auth.myId(),
        tags: ['updates'],
      },
    ];
  } else {
    return [];
  }
};

const getEnterpriseSubscriptions = (
  enterprise: Enterprise,
): EnterpriseSubscription[] => {
  return [
    {
      modelType: 'Enterprise' as const,
      idModel: enterprise.id,
      tags: ['allActions', 'updates'],
    },
  ];
};

const getOrgSubscriptions = (org: Organization): OrganizationSubscription[] => [
  {
    modelType: 'Organization' as const,
    idModel: org.id,
    tags: ['allActions', 'updates'],
  },
];

const getBoardSubscriptions = function (board: BoardModel) {
  const me = Auth.me();
  const hasValidInviteToken = hasValidInviteTokenForModel({
    id: board.id,
    members:
      board.memberList?.models?.map((member) => ({
        id: member.id,
        memberType: member.get('memberType'),
      })) || [],
  });
  const hasValidInviteLink = hasValidInvitationLinkForModel(
    'board',
    { id: board.id, shortLink: board.get('shortLink') },
    board.getViewPermState(me),
  );
  if (hasValidInviteToken || hasValidInviteLink) return [];

  const org = board.getOrganization();
  const orgSubscriptions = org ? getOrgSubscriptions(org) : [];

  const enterprise = board.getEnterprise();

  const enterpriseSubscriptions = enterprise
    ? getEnterpriseSubscriptions(enterprise as Enterprise)
    : [];
  return <
    (BoardSubscription | EnterpriseSubscription | OrganizationSubscription)[]
  >[
    {
      modelType: 'Board' as const,
      idModel: board.id,
      tags: ['clientActions', 'updates'],
    },
    ...orgSubscriptions,
    ...enterpriseSubscriptions,
  ];
};

const getCardSubscriptions = (card: Card): Subscription[] => [
  {
    modelType: 'Board',
    idModel: card.get('idBoard'),
    tags: ['clientActions', 'updates'],
  },
];

type BackboneEvents = typeof Backbone.Events;
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Subscriber extends BackboneEvents {}

class Subscriber {
  #realtimeUpdaterClient: RealtimeUpdaterClient;

  constructor(realtimeUpdaterClient: RealtimeUpdaterClient) {
    this.#realtimeUpdaterClient = realtimeUpdaterClient;
  }
  static initClass() {
    _.extend(this.prototype, Backbone.Events);
  }

  boards = new BoundedUniqueQueue<BoardModel>(5);
  orgs = new BoundedUniqueQueue<Organization>(1);
  cards = new BoundedUniqueQueue<Card>(1);
  enterprise = new BoundedUniqueQueue<Enterprise>(1);

  custom = new Set<Subscription>();

  addModel(model: BoardModel | Card | Enterprise | Organization) {
    this.waitForId(model, () => {
      if (model instanceof Board) {
        this.syncBoard(model as BoardModel);
      }

      if (model instanceof Organization) {
        this.syncOrg(model);
      }

      if (model instanceof Card) {
        this.syncCard(model);
      }

      if (model instanceof Enterprise) {
        this.syncEnterprise(model);
      }

      return this.ensureSubscriptions();
    });
  }

  addSubscription(
    entry:
      | BoardSubscription
      | EnterpriseSubscription
      | MemberSubscription
      | OrganizationSubscription,
  ) {
    this.custom.add(entry);
    this.ensureSubscriptions();

    return () => {
      this.custom.delete(entry);
      return this.ensureSubscriptions();
    };
  }

  removeModel(model: BoardModel | Card | Enterprise | Organization) {
    if (model instanceof Board) {
      this.boards.remove(model as BoardModel);
    }

    if (model instanceof Organization) {
      this.orgs.remove(model);
    }

    if (model instanceof Card) {
      this.cards.remove(model);
    }

    if (model instanceof Enterprise) {
      this.enterprise.remove(model);
    }

    return this.ensureSubscriptions();
  }

  syncBoard(board: BoardModel) {
    let evictedBoard;
    // eslint-disable-next-line eqeqeq
    if ((evictedBoard = this.boards.pushift(board)) != null) {
      this.stopListening(evictedBoard);
    }

    this.listenTo(board, 'change:idOrganization', this.ensureSubscriptions);
    this.listenTo(board, 'destroy deleting', () => this.removeModel(board));
  }

  syncOrg(org: Organization) {
    this.orgs.pushift(org);
    this.listenTo(org, 'destroy', () => this.removeModel(org));
  }

  syncCard(card: Card) {
    this.cards.pushift(card);
    this.listenTo(card, 'change:idBoard', this.ensureSubscriptions);

    return this.listenTo(card, 'destroy deleting', () =>
      this.removeModel(card),
    );
  }

  syncEnterprise(enterprise: Enterprise) {
    this.enterprise.pushift(enterprise);
    this.listenTo(enterprise, 'destroy', () => this.removeModel(enterprise));
  }

  ensureSubscriptions() {
    let idModel, modelType, tags;

    const desiredSubscriptions: Subscription[] = _.flatten([
      getMySubscriptions(),
      this.boards.map(getBoardSubscriptions),
      this.orgs.map(getOrgSubscriptions),
      this.cards.map(getCardSubscriptions),
      this.enterprise.map(getEnterpriseSubscriptions),
      Array.from(this.custom),
    ]);
    const subscriptionMap: SubscriptionMap = {};

    for ({ modelType, idModel, tags } of Array.from(desiredSubscriptions)) {
      // eslint-disable-next-line eqeqeq
      if (subscriptionMap[idModel] == null) {
        subscriptionMap[idModel] = {
          tags: [],
          modelType,
        };
      }

      subscriptionMap[idModel].tags = _.uniq(tags ?? []);
    }

    // Unsubscribe from any models we don't care about anymore
    for (idModel in subscriptionManager.currentSubscriptions) {
      ({ modelType } = subscriptionManager.currentSubscriptions[idModel]);

      // eslint-disable-next-line eqeqeq
      if (subscriptionMap[idModel] == null) {
        this.#realtimeUpdaterClient.unsubscribe(modelType, idModel);
      }
    }

    // Unsubscribe from any models that we want to change tags on
    for (idModel in subscriptionManager.currentSubscriptions) {
      let subscribedTags;

      ({ tags: subscribedTags, modelType } =
        subscriptionManager.currentSubscriptions[idModel]);

      // eslint-disable-next-line eqeqeq
      if (subscriptionMap[idModel] != null) {
        const desiredTags = subscriptionMap[idModel].tags;

        if (!setEqual(subscribedTags, desiredTags)) {
          this.#realtimeUpdaterClient.unsubscribe(modelType, idModel);
        }
      }
    }

    // Subscribe to all models we aren't already subscribed to
    for (idModel in subscriptionMap) {
      ({ tags, modelType } = subscriptionMap[idModel]);
      // eslint-disable-next-line eqeqeq
      if (subscriptionManager.currentSubscriptions[idModel] == null) {
        this.#realtimeUpdaterClient.subscribe(modelType, idModel, tags);
      }
    }
  }
}

Subscriber.initClass();

export { Subscriber };
