/* eslint-disable eqeqeq */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// eslint-disable-next-line no-restricted-imports
import Bluebird from 'bluebird';
import _ from 'underscore';

import Backbone from '@trello/backbone';
import { ApiError } from '@trello/error-handling';
import type { DocumentNode } from '@trello/graphql';
import { client, syncDeltaToCache } from '@trello/graphql';
import { isShortLink } from '@trello/id-cache';

import type { Action } from 'app/scripts/models/Action';
import type { Board } from 'app/scripts/models/Board';
import type { BoardPlugin } from 'app/scripts/models/BoardPlugin';
import type { Card } from 'app/scripts/models/Card';
import type { Checklist } from 'app/scripts/models/Checklist';
import type { CustomField } from 'app/scripts/models/CustomField';
import type { CustomFieldItem } from 'app/scripts/models/CustomFieldItem';
import type { Enterprise } from 'app/scripts/models/Enterprise';
import type {
  TrelloModel,
  TrelloModelAttributes,
} from 'app/scripts/models/internal/TrelloModel';
import type { Label } from 'app/scripts/models/Label';
import type { List } from 'app/scripts/models/List';
import type { Member } from 'app/scripts/models/Member';
import type { Organization } from 'app/scripts/models/Organization';
import type { PendingOrganization } from 'app/scripts/models/PendingOrganization';
import type { Plugin } from 'app/scripts/models/Plugin';
import type { PluginData } from 'app/scripts/models/PluginData';
import type { Reaction } from 'app/scripts/models/Reaction';
import type { MappingRules } from './db.types';
import { modelFactory } from './modelFactory';
import { ModelName } from './ModelName';

const collections = {
  Action: {
    type: ModelName.ACTION,
    test: (s: string) => s === 'actions',
  },
  Highlights: {
    type: ModelName.ACTION,
    test: (s: string) => s === 'highlights',
  },
  UpNext: {
    type: ModelName.ACTION,
    test: (s: string) => s === 'upnext',
  },
  Card: {
    type: ModelName.CARD,
    test(s: string) {
      return /^card($|s)/.test(s);
    },
  },
  Checklist: {
    type: ModelName.CHECKLIST,
    test: (s: string) => s === 'checklists',
  },
  CustomField: {
    type: ModelName.CUSTOM_FIELD,
    test: (s: string) => s === 'customFields',
  },
  CustomFieldItem: {
    type: ModelName.CUSTOM_FIELD_ITEM,
    test: (s: string) => s === 'customFieldItems',
  },
  Board: {
    type: ModelName.BOARD,
    test(s: string) {
      return /^board($|s)/.test(s) && !['boardsCount'].includes(s);
    },
  },
  BoardPlugin: {
    type: ModelName.BOARD_PLUGIN,
    test: (s: string) => s === 'boardPlugins',
  },
  Collaborator: {
    type: ModelName.MEMBER,
    test: (s: string) => s === 'collaborators',
    shouldPreserve: true,
  },
  Enterprise: {
    type: ModelName.ENTERPRISE,
    shouldPreserve: true,
    test(s: string) {
      return /^enterprise($|s)/.test(s);
    },
  },
  Label: {
    type: ModelName.LABEL,
    test: (s: string) => s === 'labels',
  },
  List: {
    type: ModelName.LIST,
    test(s: string) {
      return /^lists?$/.test(s);
    },
  },
  PendingOrganization: {
    type: ModelName.PENDING_ORGANIZATION,
    test(s: string) {
      return /^pendingOrganization/.test(s);
    },
  },
  Member: {
    type: ModelName.MEMBER,
    test(s: string) {
      return (
        /^member/.test(s) &&
        ![
          'memberships',
          'membersCount',
          'memberType',
          'membershipCount',
          'membershipCounts',
          'memberEmail',
        ].includes(s)
      );
    },
  },
  Organization: {
    type: ModelName.ORGANIZATION,
    test(s: string) {
      return /^organization/.test(s) && !['organizationPrefs'].includes(s);
    },
  },
  Plugin: {
    type: ModelName.PLUGIN,
    test(s: string) {
      return /^plugins?$/.test(s);
    },
  },
  PluginData: {
    type: ModelName.PLUGIN_DATA,
    test: (s: string) => s === 'pluginData',
  },
  Reaction: {
    type: ModelName.REACTION,
    test: (s: string) => s === 'reactions',
  },
};

type CollectionName = keyof typeof collections;
type TypeName = TrelloModelAttributes['typeName'];
type StatsRecord = Partial<Record<TypeName | 'TOTAL', number>>;
interface CacheStats {
  read: StatsRecord;
  read_expensive: StatsRecord;
  write: StatsRecord;
  delete: StatsRecord;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ModelCache extends Backbone.EventsMixin {}

class ModelCache {
  #INITIAL_CACHE: Partial<
    Record<CollectionName | TypeName, Record<string, unknown>>
  > = (Object.keys(collections) as Array<CollectionName>).reduce(
    (acc, key) => (acc[key] = {}),
    {} as Partial<Record<CollectionName | TypeName, Record<string, unknown>>>,
  );
  #cache: Partial<Record<TypeName, Record<string, unknown>>> = {
    ...this.#INITIAL_CACHE,
  };
  _locked: number[] = [];
  _lockIndex = 0;
  _deltaQueue: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modelOrType: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delta: any;
    mappingRules: MappingRules;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    source: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    next: (err: any, result?: unknown) => void; // Will be passed from ninvoke
  }[] = [];
  uniqueId = _.uniqueId('mc');

  bootstrapCache() {
    this.#cache = { ...this.#INITIAL_CACHE };
  }

  extract = () => this.#cache;

  stats: CacheStats = { read: {}, read_expensive: {}, write: {}, delete: {} };
  #logStat = (
    action: keyof CacheStats,
    typeName: TypeName,
    increment: number = 1,
  ) => {
    const currentStat = this.stats[action][typeName] ?? 0;
    const currentTotal = this.stats[action]['TOTAL'] ?? 0;
    this.stats[action][typeName] = currentStat + increment;
    this.stats[action]['TOTAL'] = currentTotal + increment;
  };

  #read = (typeName: TypeName, id: string) => {
    this.#logStat('read', typeName);
    return this.#cache[typeName]?.[id];
  };

  #readAllByType = (typeName: TypeName) => {
    const result = this.#cache[typeName];
    // This will require to extract the entire cache from Apollo
    // Followed by requesting every entity separately
    // That is why we are incrementing the stats by number of items
    // Ideally we'd like to avoid operations like this
    this.#logStat('read_expensive', typeName, Object.keys(result ?? {}).length);
    return result;
  };

  #write = (typeName: TypeName, id: string, model: unknown) => {
    if (this.#cache[typeName] === undefined) {
      this.#cache[typeName] = { [id]: model };
    } else {
      this.#cache[typeName]![id] = model;
    }
    this.#logStat('write', typeName);
  };

  #delete = (typeName: TypeName, id: string) => {
    delete this.#cache[typeName]?.[id];
    this.#logStat('delete', typeName);
  };

  get(type: 'Action', id: string | undefined): Action | undefined;
  get(type: 'Action', id: string[] | undefined): Action[] | undefined;
  get(type: 'Board', id: string | undefined): Board | undefined;
  get(type: 'Board', id: string[] | undefined): Board[] | undefined;
  get(type: 'BoardPlugin', id: string | undefined): BoardPlugin | undefined;
  get(type: 'BoardPlugin', id: string[] | undefined): BoardPlugin[] | undefined;
  get(type: 'Card', id: string | undefined): Card | undefined;
  get(type: 'Card', id: string[] | undefined): Card[] | undefined;
  get(type: 'Checklist', id: string | undefined): Checklist | undefined;
  get(type: 'Checklist', id: string[] | undefined): Checklist[] | undefined;
  get(type: 'CustomField', id: string | undefined): CustomField | undefined;
  get(type: 'CustomField', id: string[] | undefined): CustomField[] | undefined;
  get(
    type: 'CustomFieldItem',
    id: string | undefined,
  ): CustomFieldItem | undefined;
  get(
    type: 'CustomFieldItem',
    id: string[] | undefined,
  ): CustomFieldItem[] | undefined;
  get(type: 'Enterprise', id: string | undefined): Enterprise | undefined;
  get(type: 'Enterprise', id: string[] | undefined): Enterprise[] | undefined;
  get(type: 'Label', id: string | undefined): Label | undefined;
  get(type: 'Label', id: string[] | undefined): Label[] | undefined;
  get(type: 'List', id: string | undefined): List | undefined;
  get(type: 'List', id: string[] | undefined): List[] | undefined;
  get(type: 'Member', id: string | undefined): Member | undefined;
  get(type: 'Member', id: string[] | undefined): Member[] | undefined;
  get(type: 'Organization', id: string | undefined): Organization | undefined;
  get(
    type: 'Organization',
    id: string[] | undefined,
  ): Organization[] | undefined;
  get(
    type: 'PendingOrganization',
    id: string | undefined,
  ): PendingOrganization | undefined;
  get(
    type: 'PendingOrganization',
    id: string[] | undefined,
  ): PendingOrganization[] | undefined;
  get(type: 'Plugin', id: string | undefined): Plugin | undefined;
  get(type: 'Plugin', id: string[] | undefined): Plugin[] | undefined;
  get(type: 'PluginData', id: string | undefined): PluginData | undefined;
  get(type: 'PluginData', id: string[] | undefined): PluginData[] | undefined;
  get(type: 'Reaction', id: string | undefined): Reaction | undefined;
  get(type: 'Reaction', id: string[] | undefined): Reaction[] | undefined;
  get<TKey extends TrelloModelAttributes, T extends TrelloModel<TKey>>(
    typeOrTypeName: TKey['typeName'],
    idOrIds: string[] | string | undefined,
  ): (T | undefined)[] | T | undefined {
    if (idOrIds === undefined) {
      return undefined;
    }
    if (Array.isArray(idOrIds)) {
      // @ts-expect-error
      return idOrIds.map((id) => this.get(typeOrTypeName, id));
    }
    const typeName: TypeName =
      typeof typeOrTypeName === 'string'
        ? typeOrTypeName
        : // @ts-expect-error
          typeOrTypeName.prototype.typeName;

    if (isShortLink(idOrIds)) {
      // @ts-expect-error
      return this.findOne(typeName, 'shortLink', idOrIds);
    }

    return this.#read(typeName, idOrIds) as T;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getOrLoad({ type, id, payload, loader }: any) {
    const existing = this.get(type, id);
    const hasRequiredFields =
      existing != null &&
      payload.query.fields
        .split(',')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .every((field: any) =>
          Object.prototype.hasOwnProperty.call(existing.attributes, field),
        );

    if (hasRequiredFields) {
      return existing;
    } else {
      return loader(id).catch(ApiError, () => null);
    }
  }

  find(type: 'Card', filter?: (card: Card) => boolean): Card[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  find(modelType: any, ...args: any[]) {
    if (args.length === 1) {
      const [predicate] = Array.from(args);
      return _.filter(this.all(modelType), predicate);
    } else {
      const [attr, value] = Array.from(args);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return this.find(modelType, (entry: any) => entry.get(attr) === value);
    }
  }

  findOne(
    type: 'Member',
    predicateOrAttr: unknown,
    value?: unknown,
  ): Member | undefined;
  findOne(
    type: 'Board',
    predicateOrAttr: unknown,
    value?: unknown,
  ): Board | undefined;
  findOne(
    type: 'Enterprise',
    predicateOrAttr: unknown,
    value?: unknown,
  ): Enterprise | undefined;
  findOne(
    type: 'Organization',
    predicateOrAttr: unknown,
    value?: unknown,
  ): Organization | undefined;
  findOne(
    type: 'List',
    predicateOrAttr: unknown,
    value?: unknown,
  ): List | undefined;
  findOne(
    type: 'Card',
    predicateOrAttr: unknown,
    value?: unknown,
  ): Card | undefined;
  findOne(
    modelType: TrelloModelAttributes['typeName'],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    predicateOrAttr: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
  ) {
    const predicate =
      typeof predicateOrAttr === 'function'
        ? predicateOrAttr
        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (model: any) => model.get(predicateOrAttr) === value;

    const cache = this.#readAllByType(modelType);
    for (const id in cache) {
      const model = this.#read(modelType, id);
      if (predicate(model)) {
        return model;
      }
    }

    return undefined;
  }

  some(
    type: 'Member' | 'Organization',
    attribute: string,
    search: string,
  ): boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  some(...args: any[]) {
    // @ts-expect-error TS(2556): A spread argument must either have a tuple type or... Remove this comment to see the full error message
    return this.findOne(...args) !== undefined;
  }

  waitFor(
    type: 'Card',
    id: string | null,
    callback: (err: Error | null, card: Card) => void,
  ): void;
  waitFor(
    type: 'Member',
    id: string | null,
    callback: (err: Error | null, member: Member) => void,
  ): void;
  waitFor(
    type: 'Label',
    id: string | null,
    callback: (err: Error | null, label: Label) => void,
  ): void;
  waitFor(
    type: 'List',
    id: string | null,
    callback: (err: Error | null, list: List) => void,
  ): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  waitFor(modelType: any, id: any, next: any): any {
    const model = this.get(modelType, id);
    if (model != null) {
      return next(null, model);
    } else {
      // We can wait for the model to show up
      return this.once(`add:${modelType}:${id}`, () => {
        return this.waitFor(modelType, id, next);
      });
    }
  }

  all(type: 'Board'): Board[];
  all(type: 'Action'): Action[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  all(typeOrTypeName: any) {
    if (!_.isString(typeOrTypeName)) {
      typeOrTypeName = typeOrTypeName.prototype.typeName;
    }
    return _.values(this.#readAllByType(typeOrTypeName));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  add(model: any, param?: { source?: string }): unknown {
    // Do nothing if the model is already in the model cache
    if (param == null) {
      param = {};
    }
    const { source } = param;
    if (model.id && this.get(model.typeName, model.id) != null) {
      return;
    }

    // Do nothing if we aren't caching this kind of model
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    if (collections[model.typeName] == null) {
      return;
    }

    const hashId = model.id ? model.id : model.cid;
    this.#write(model.typeName, hashId, model);

    // I don't know why this is here. It was here before.
    // I can't see how it does anything. I'm scared to take
    // it out. But we should eventually.
    this.stopListening(model);

    this.listenTo(model, 'change', this.onModelChange);
    this.listenTo(model, 'destroy', this.remove);

    // Send model add events after we've hooked up our own listeners, in case
    // something changes a model in reaction to it being added (e.g. auto
    // marking notifications as read if you're looking at a card)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.waitForId(model, (id: any) => {
      this.#delete(model.typeName, model.cid);
      this.#write(model.typeName, id, model);
      if (source != null) {
        this.trigger(`${source}:add:${model.typeName}`, model);
      } else {
        // Sync new models to the Apollo Cache once they have an id
        syncDeltaToCache(client, model.typeName, model.toJSON());
      }

      this.trigger(`add:${model.typeName}:${id}`, model);
      return typeof model.triggerCacheEvents === 'function'
        ? model.triggerCacheEvents(this, 'add', model)
        : undefined;
    });

    this.trigger(`add:${model.typeName}`, model);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onModelChange(model: any, param: any) {
    if (param == null) {
      param = {};
    }
    const { source } = param;
    if (typeof model.triggerCacheEvents === 'function') {
      model.triggerCacheEvents(this, 'change', model);
    }
    this.trigger(`change:${model.typeName}`, model);
    if (source != null) {
      this.trigger(`${source}:change:${model.typeName}`, model);
    }
    const object = model.changedAttributes();
    for (const attr in object) {
      this.trigger(`change:${model.typeName}:${attr}`, model);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  remove(model: any, param?: { source?: string }) {
    if (param == null) {
      param = {};
    }
    const { source } = param;
    if (model == null) {
      return;
    }

    if (model.typeName === ModelName.CARD) {
      for (const action of Array.from(model.actionList.models)) {
        this.remove(action, { source });
      }
    }

    this.#delete(model.typeName, model.id);
    this.#delete(model.typeName, model.cid);

    this.trigger(`remove:${model.typeName}`, model);
    if (source != null) {
      this.trigger(`${source}:remove:${model.typeName}`, model);
    }
    if (model.id != null) {
      this.trigger(`remove:${model.typeName}:${model.id}`, model);
    }
    if (typeof model.triggerCacheEvents === 'function') {
      model.triggerCacheEvents(this, 'remove', model);
    }
    this.stopListening(model);
    model.trigger('destroy');
    return model.destructor();
  }

  _collectionSpec = _.memoize(function (key: string) {
    for (const name in collections) {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      const { test, shouldPreserve } = collections[name];
      if (test(key)) {
        return { name, shouldPreserve };
      }
    }
  });

  /*
  Take the response to an API call, and add to (or update) our cache
  The response to an API call might look like this:

  {
    name: "Some board"
    desc: "Some desc"
    cards: [
      { name: "Card 1" }
      { name: "Card 2" }
    ]
    actions: [ ... ]
  }

  model can be either the type of a model (e.g. Board) or an actual model
  (the second case is important if you know that the data is meant to
  update a model that was created, but doesn't have an id yet)
  */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _update(modelOrType: any, data: any, mappingRules: any, { source }: any) {
    // Sanity check to ensure that we have data to indeed update.
    if (!data) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let key, fn: any, delta: any;
    if (mappingRules == null) {
      mappingRules = {};
    }
    if (_.isArray(data)) {
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-shadow */
      return data.map((delta: any): any => {
        return this._update(modelOrType, delta, mappingRules, { source });
      });
    } else if (data.deleted) {
      this.remove(this.get(modelOrType, data.id), { source });
      return;
    }

    const setData = _.clone(data);

    const mappers = (() => {
      const result = [];
      for (key in mappingRules) {
        fn = mappingRules[key];
        if (key in setData) {
          delta = setData[key];
          delete setData[key];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          result.push((model: any) => fn(delta, model));
        }
      }
      return result;
    })();

    for (key in data) {
      const spec = this._collectionSpec(key);
      const value = data[key];
      if (spec != null) {
        this._update(spec.name, value, mappingRules, { source });
        if (!spec.shouldPreserve) {
          delete setData[key];
        }
      }
    }

    // At this point, we should have only model attributes left; we need to
    // either create a new model, or update an existing one

    const existingModel = _.isString(modelOrType)
      ? // @ts-expect-error
        this.get(modelOrType, data.id)
      : modelOrType;

    if (existingModel != null) {
      if (existingModel.get('dateLastUpdated') && setData.dateLastUpdated) {
        // There is a race condition between updates being applied based on
        // websocket deltas, API responses and local optimistic updates.
        // This is intended to, on models that support it, only apply _newer_
        // updates to the model, and discard any update deltas with stale data.
        //
        // +-------------------------------------------------------+
        // |                                                       |
        // |      Client                                   Server  |
        // |                                                       |
        // |                                                 +     |
        // |  1. Change +----------------------------------> |     |
        // |            ^----------------------------------+ ++    |
        // |                         200 OK                  ||    |
        // |  2. Change +----------------------------------> ||    |
        // |            ^----------------------------------+ ||    |
        // |                         200 OK                  ||    |
        // |            <-------------------------------------+    |
        // |                      Websocket Delta            |     |
        // |                                                 |     |
        // |  3. Change +----------------------------------> |     |
        // |            ^----------------------------------+ |     |
        // |                  412 Precondition Failed        |     |
        // |                                                 |     |
        // |                                                 +     |
        // |                                                       |
        // +-------------------------------------------------------+
        //
        // The above diagram shows the websocket delta for the 1st change being
        // applied to the local model cache state, when the model cache already
        // contains more up-to-date information (2nd change). This condition
        // discards the updates from the websocket delta shown above, and
        // allows the 3rd change to successfully complete, instead of failing
        // the update.
        if (existingModel.get('dateLastUpdated') > setData.dateLastUpdated) {
          return existingModel;
        }
      }
      existingModel.set(setData);
      // eslint-disable-next-line @typescript-eslint/no-shadow
      mappers.forEach((fn) => fn(existingModel));
      return existingModel;
    }

    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const typeInfo = collections[modelOrType];
    if (!typeInfo) {
      return data;
    }

    // The TrelloModel constructor adds itself to the cache for us
    const newModel = new (modelFactory.getModelClass(typeInfo.type))(setData, {
      modelCache: this,
      source,
    });
    // eslint-disable-next-line @typescript-eslint/no-shadow
    mappers.forEach((fn) => fn(newModel));
    return newModel;
  }

  lock(msg: string) {
    const lockIndex = this._lockIndex++;
    this._locked.push(lockIndex);
    return lockIndex;
  }

  locked() {
    return !_.isEmpty(this._locked);
  }

  unlock(lockIndex: number) {
    if (Array.from(this._locked).includes(lockIndex)) {
      this._locked = _.without(this._locked, lockIndex);
      if (!this.locked()) {
        // If anything was waiting on the lock, process it now
        this.processDeltas();
      }
      return true;
    } else {
      return false;
    }
  }

  getLock() {
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    return Bluebird.resolve(this.lock()).disposer((index) => {
      this.unlock(index);
    });
  }

  _enqueueDelta(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    source: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modelOrType: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delta: any,
    mappingRules = {},
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { query, document, skipSyncingToApollo = false }: any = {},
    next = () => {},
  ) {
    if (_.isFunction(mappingRules)) {
      // @ts-expect-error TS(2322): Type 'Function' is not assignable to type '() => v... Remove this comment to see the full error message
      next = mappingRules;
      mappingRules = {};
    }

    const modelName = _.isString(modelOrType)
      ? modelOrType
      : modelOrType.typeName;

    // we can skip syncing to apollo if provided by enqueueDelta options
    // this usually happens if QuickLoad data was already synced to the cache
    // and we want to avoid doing it twice
    if (!skipSyncingToApollo) {
      if (Array.isArray(delta)) {
        delta.forEach((deltaItem) =>
          syncDeltaToCache(client, modelName, deltaItem, {
            fromQuery: query,
            fromDocument: document,
          }),
        );
      } else {
        syncDeltaToCache(client, modelName, delta, {
          fromQuery: query,
          fromDocument: document,
        });
      }
    }

    if (this.locked()) {
      this._deltaQueue.push({ modelOrType, delta, mappingRules, source, next });
    } else {
      // @ts-expect-error TS(2554): Expected 0 arguments, but got 2.
      next(null, this._update(modelOrType, delta, mappingRules, { source }));
    }
  }

  enqueueRealtimeDelta(modelOrType: string, delta: unknown) {
    this._enqueueDelta('realtimeUpdate', modelOrType, delta);
  }

  enqueueDelta(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modelOrType: any | string,
    delta: unknown,
    mappingRules: MappingRules = {},
    syncingOptions: {
      document?: DocumentNode | null;
      query?: object;
      skipSyncingToApollo?: boolean;
    } = {},
    next: () => unknown = () => {},
  ) {
    this._enqueueDelta(
      'ajax',
      modelOrType,
      delta,
      mappingRules,
      syncingOptions,
      next,
    );
  }

  processDeltas() {
    let delta, mappingRules, modelOrType, next, source;
    const queue = this._deltaQueue;
    this._deltaQueue = [];

    // First, see if we've got any updates that are for models, where the id wasn't
    // set; these always need to go first (to prevent duplicate models being created
    // in cases where we couldn't find the existing model because the id wasn't set
    // yet)
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-shadow */
    const updateSetsId = (modelOrType: any) =>
      !_.isString(modelOrType) && modelOrType.id == null;

    for ({ modelOrType, delta, mappingRules, source, next } of Array.from(
      queue,
    )) {
      if (updateSetsId(modelOrType)) {
        next(null, this._update(modelOrType, delta, mappingRules, { source }));
      }
    }

    // Now, do the rest of the updates, in the order that they came in
    return (() => {
      const result = [];
      for ({ modelOrType, delta, mappingRules, source, next } of queue) {
        if (!updateSetsId(modelOrType)) {
          result.push(
            next(
              null,
              this._update(modelOrType, delta, mappingRules, { source }),
            ),
          );
        }
      }
      return result;
    })();
  }
}

_.extend(ModelCache.prototype, Backbone.Events);

// @ts-expect-error TS(2339): Property 'ModelCache' does not exist on type 'Wind... Remove this comment to see the full error message
const modelCache = (window.ModelCache = new ModelCache());
export { modelCache as ModelCache };
