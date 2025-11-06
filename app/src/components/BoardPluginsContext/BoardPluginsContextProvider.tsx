import type { FunctionComponent, PropsWithChildren } from 'react';
import { useEffect, useRef } from 'react';
import { useImmer } from 'use-immer';

import { useBoardId } from '@trello/id-context';

import type {
  BoardPluginsContextValue,
  PluginCapability,
} from './BoardPluginsContext';
import {
  BoardPluginsContext,
  emptyBoardPluginsContext,
} from './BoardPluginsContext';
import { useBoardPluginsContextQuery } from './BoardPluginsContextQuery.generated';

export const BoardPluginsContextProvider: FunctionComponent<
  PropsWithChildren<unknown>
> = ({ children }) => {
  const boardId = useBoardId();
  const [value, setValue] = useImmer<BoardPluginsContextValue>(
    emptyBoardPluginsContext,
  );

  // eslint-disable-next-line @trello/no-apollo-refetch
  const { data, loading, refetch } = useBoardPluginsContextQuery({
    variables: { boardId },
    waitOn: ['None'],
    fetchPolicy: 'cache-first',
  });
  const plugins = data?.board?.plugins;
  const boardPlugins = data?.board?.boardPlugins;

  useEffect(() => {
    const capabilities = new Set<PluginCapability>(
      plugins?.flatMap((plugin) => plugin.capabilities) as PluginCapability[],
    );

    const enabledPlugins = new Set(
      boardPlugins?.map((plugin) => plugin.idPlugin),
    );

    const pluginsArray = plugins || [];
    const pluginCapabilitiesById = pluginsArray.reduce(
      (acc, plugin) => {
        // If plugin is not enabled on this board, ignore it
        if (!enabledPlugins.has(plugin.id)) {
          return acc;
        }
        const pluginCapabilities = new Set<PluginCapability>(
          plugin.capabilities as PluginCapability[],
        );
        acc[plugin.id] = pluginCapabilities;
        return acc;
      },
      {} as Record<string, Set<PluginCapability>>,
    );

    setValue({
      capabilities,
      enabledPlugins,
      pluginCapabilitiesById,
    });
  }, [plugins, boardPlugins, setValue]);

  // we need an up to date data.plugins value to keep track of the current
  // Power-Up capabilities. But plugins(filter:enabled) query is not supported with real time updates.
  // https://hello.atlassian.net/wiki/spaces/TRELLOFE/pages/1225107180/Trello+Front+End+GraphQL+support+matrix+for+real-time+updates+of+filtered+list
  // So instead, we refetch it, but only on useEffects after
  // the initial query is done loading.
  const allowRefetch = useRef(false);
  useEffect(() => {
    if (!loading && !allowRefetch.current) {
      allowRefetch.current = true;
    } else if (allowRefetch.current) {
      refetch();
    }
  }, [boardPlugins, loading, refetch]);

  return (
    <BoardPluginsContext.Provider value={value}>
      {children}
    </BoardPluginsContext.Provider>
  );
};
