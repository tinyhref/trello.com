import type {
  ApolloCache,
  DocumentNode,
  NormalizedCacheObject,
} from '@apollo/client';

import type {
  Board,
  Card,
  CheckItem,
  Checklist,
  Label,
  List,
  Maybe,
  Member,
  Organization,
} from '../../generated';
import { firstLetterToLower } from '../../stringOperations';
import type { SupportedModelTypes, TypedPartialWithID } from '../../types';
import { muteMissingFieldErrors } from './muteMissingFieldErrors';

type Model = TypedPartialWithID<
  Board | Card | CheckItem | Checklist | Label | List | Member | Organization,
  SupportedModelTypes
>;

export class GeneralizedFilterPatcher<
  TCurrentModel extends Model,
  TParentModel extends Model,
  TQueryType extends { __typename: 'Query' } & {
    [K in Lowercase<TParentModel['__typename']>]?: Maybe<
      {
        __typename: TParentModel['__typename'];
        id: Pick<TParentModel, 'id'> | string;
      } & {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        [K in `${Lowercase<TCurrentModel['__typename']>}s`]: Array<
          { __typename: TCurrentModel['__typename'] } & Pick<
            TCurrentModel,
            'id'
          >
        >;
      }
    >;
  },
  TRelatedId extends string,
> {
  private readonly parentModelName: Lowercase<TParentModel['__typename']>;
  private readonly modelTypeName: TCurrentModel['__typename'];
  private readonly parentTypeName: TParentModel['__typename'];
  private readonly query: DocumentNode;
  private readonly filters: {
    [filter: string]: {
      dataKey: string;
      canSyncWithEmptyData?: boolean;
      addSingleRelationWhen: (
        model: TCurrentModel,
        parentId: TRelatedId,
        previousRelatedId?: TRelatedId | null,
      ) => boolean;
      removeSingleRelationWhen: (
        model: TCurrentModel,
        parentId: TRelatedId,
        previousRelatedId?: TRelatedId | null,
      ) => boolean;
      addMultiRelationWhen: (
        model: TCurrentModel,
        id: TRelatedId,
        relatedIds: TRelatedId[],
        previousRelatedIds: TRelatedId[],
      ) => boolean;
      removeMultiRelationWhen: (
        model: TCurrentModel,
        id: TRelatedId,
        relatedIds: TRelatedId[],
        previousRelatedIds: TRelatedId[],
      ) => boolean;
    };
  };

  constructor({
    parentTypeName,
    modelTypeName,
    query,
    filters,
  }: {
    parentTypeName: TParentModel['__typename'];
    modelTypeName: TCurrentModel['__typename'];
    query: DocumentNode;
    filters: {
      [filter: string]: {
        dataKey: string;
        canSyncWithEmptyData?: boolean;
        addSingleRelationWhen: (
          model: TCurrentModel,
          parentId: TRelatedId,
          previousRelatedId?: TRelatedId | null,
        ) => boolean;
        removeSingleRelationWhen: (
          model: TCurrentModel,
          parentId: TRelatedId,
          previousRelatedId?: TRelatedId | null,
        ) => boolean;
        addMultiRelationWhen: (
          model: TCurrentModel,
          id: TRelatedId,
          relatedIds: TRelatedId[],
          previousRelatedIds: TRelatedId[],
        ) => boolean;
        removeMultiRelationWhen: (
          model: TCurrentModel,
          id: TRelatedId,
          relatedIds: TRelatedId[],
          previousRelatedIds: TRelatedId[],
        ) => boolean;
      };
    };
  }) {
    this.query = query;

    this.parentTypeName = parentTypeName;
    this.modelTypeName = modelTypeName;
    this.parentModelName = firstLetterToLower(parentTypeName) as Lowercase<
      TParentModel['__typename']
    >;

    this.filters = filters;
  }

  public handleSingleRelationDelta(
    cache: ApolloCache<NormalizedCacheObject>,
    delta: TCurrentModel,
    relatedId?: TRelatedId | null,
    previousRelatedId?: TRelatedId | null,
  ) {
    if (!relatedId) {
      return;
    }

    if (!delta.id) {
      return;
    }

    const currentData = this.readQuery(cache, relatedId);

    if (!currentData) {
      return;
    }

    const result: {
      [k: string]: { id: string; __typename: string }[];
    } = {};

    for (const filter of Object.keys(this.filters)) {
      const filterSetting = this.filters[filter];
      const existingModels = currentData[
        filterSetting.dataKey as keyof typeof currentData
      ] as { id: string; __typename: string }[] | null | undefined;

      // in the case that there aren't existing models, that means that
      // no one has queried this resource with this filter. If we were to
      // add the delta to the list, we'd be incorrectly populating the cache
      // with a single item. Some resources, such as checklists and check-items
      // will send deltas that contain all of the items, so we can sync those, while
      // others we can not.
      if (filterSetting.canSyncWithEmptyData !== true && !existingModels) {
        continue;
      }

      if (
        filterSetting.addSingleRelationWhen(delta, relatedId, previousRelatedId)
      ) {
        result[filterSetting.dataKey] = (existingModels || [])
          .filter(({ id }) => id !== delta.id)
          .concat({
            id: delta.id,
            __typename: this.modelTypeName,
          });
      }

      if (
        filterSetting.removeSingleRelationWhen(
          delta,
          relatedId,
          previousRelatedId,
        )
      ) {
        result[filterSetting.dataKey] =
          (existingModels || []).filter(({ id }) => id !== delta.id) || [];
      }
    }

    this.writeModels(cache, relatedId, result);
  }

  public handleMultiRelationDelta(
    cache: ApolloCache<NormalizedCacheObject>,
    delta: TCurrentModel,
    relatedIds: TRelatedId[] | null,
    previousRelatedIds?: TRelatedId[] | null,
  ) {
    if (!delta.id) {
      return;
    }

    if (!Array.isArray(relatedIds)) {
      return;
    }

    if (!Array.isArray(previousRelatedIds)) {
      return;
    }

    const allIds: TRelatedId[] = Array.from(
      new Set(relatedIds.concat(previousRelatedIds)),
    ) as TRelatedId[];

    for (const id of allIds) {
      const currentData = this.readQuery(cache, id as unknown as TRelatedId);

      if (!currentData) {
        continue;
      }

      const result: {
        [k: string]: { id: string; __typename: string }[];
      } = {};

      for (const filter of Object.keys(this.filters)) {
        const filterSetting = this.filters[filter];
        const existingModels = (currentData[
          filterSetting.dataKey as keyof typeof currentData
        ] || []) as { id: string; __typename: string }[];

        if (
          filterSetting.addMultiRelationWhen(
            delta,
            id,
            relatedIds,
            previousRelatedIds,
          )
        ) {
          result[filterSetting.dataKey] = existingModels
            // eslint-disable-next-line @typescript-eslint/no-shadow
            .filter(({ id }) => id !== delta.id)
            .concat({
              id: delta.id,
              __typename: this.modelTypeName,
            });
        }

        if (
          filterSetting.removeMultiRelationWhen(
            delta,
            id,
            relatedIds,
            previousRelatedIds,
          )
        ) {
          result[filterSetting.dataKey] = existingModels.filter(
            // eslint-disable-next-line @typescript-eslint/no-shadow
            ({ id }) => id !== delta.id,
          );
        }
      }

      this.writeModels(cache, id, result);
    }
  }

  protected readQuery(
    cache: ApolloCache<NormalizedCacheObject>,
    parentId: TRelatedId,
  ) {
    const data = cache.readQuery<TQueryType>({
      query: this.query,
      returnPartialData: true,
      variables: {
        parentId,
      },
    });

    return data?.[this.parentModelName as keyof typeof data];
  }

  protected writeModels(
    cache: ApolloCache<NormalizedCacheObject>,
    parentId: TRelatedId,
    result: {
      [k: string]: { id: string; __typename: string }[];
    },
  ) {
    const unmuteMissingFieldErrors = muteMissingFieldErrors();

    cache.writeQuery({
      query: this.query,
      data: {
        __typename: 'Query',
        [`${this.parentModelName}`]: {
          id: parentId,
          __typename: this.parentTypeName,
          ...result,
        },
      },
      variables: {
        parentId,
      },
      broadcast: false,
    });

    unmuteMissingFieldErrors();
  }
}
