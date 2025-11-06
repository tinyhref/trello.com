import type { QueryOptions } from '@apollo/client';
import type { LazyExoticComponent } from 'react';
import { useEffect, useRef, useState } from 'react';

import { client, getOperationDefinitionNode } from '@trello/graphql';
import { addIdleTask, clearIdleTask } from '@trello/idle-task-scheduler';
import type {
  AnyComponent,
  NamedImportFactory,
  UseLazyComponentOptions,
} from '@trello/use-lazy-component';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { FeatureName } from './FeatureName';
import { useIsRecentlyUsedFeature } from './useIsRecentlyUsedFeature';

type RequiredProperty<TType, TProp extends keyof TType> = TType &
  Required<Pick<TType, TProp>>;

// Delay to defer any preloads to take place only after the critical path.
// This value loosely corresponds to the P95 readyForUser event.
const DEFAULT_PRELOAD_DELAY_MS = 4000;

interface Props<TComponent extends AnyComponent, TNamedImport extends string> {
  featureName: FeatureName;
  /** Import factory and options for the useLazyComponent call. */
  useLazyComponentArgs: [
    NamedImportFactory<TComponent, TNamedImport>,
    RequiredProperty<
      UseLazyComponentOptions<TComponent, TNamedImport>,
      'namedImport'
    >,
  ];
  /** Optional GraphQL query to preload. */
  preloadQueryOptions?: QueryOptions;
  /**
   * Optional callback to execute when the preload takes effect.
   * An example use case for this might be in case the preload doesn't use a
   * single GraphQL query directly, and needs to execute custom logic instead.
   */
  onPreloadedCallback?: () => void;
  /** Disables the preloader. */
  skipPreload?: boolean;
}

export const useRecentlyUsedFeaturePreloader = <
  TComponent extends AnyComponent,
  TNamedImport extends string,
>({
  featureName,
  useLazyComponentArgs: [componentImportFactory, componentOptions],
  preloadQueryOptions,
  onPreloadedCallback,
  skipPreload = false,
}: Props<TComponent, TNamedImport>): [
  component: LazyExoticComponent<TComponent>,
  trackFeatureUsage: () => void,
] => {
  const [preload, setPreload] = useState(false);
  const { isRecentlyUsedFeature, trackFeatureUsage } =
    useIsRecentlyUsedFeature(featureName);

  const idleTaskRef = useRef<number>();
  useEffect(() => {
    const shouldPreload = isRecentlyUsedFeature && !skipPreload;
    if (shouldPreload) {
      idleTaskRef.current = addIdleTask(
        () => setPreload(true),
        DEFAULT_PRELOAD_DELAY_MS,
      );
    }

    return () => clearIdleTask(idleTaskRef.current);
    // Only evaluate the preloader on mount!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const component = useLazyComponent<TComponent, TNamedImport>(
    componentImportFactory,
    { ...componentOptions, preload: componentOptions.preload || preload },
  );

  useEffect(() => {
    if (!preload) {
      return;
    }
    if (preloadQueryOptions) {
      const document = preloadQueryOptions.query;
      const operationName = getOperationDefinitionNode(document)?.name?.value;
      client.query({
        ...preloadQueryOptions,
        context: { document, operationName },
      });
    }
    onPreloadedCallback?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preload]);

  return [component, trackFeatureUsage];
};
