import type { Board } from '@trello/model-types';

/**
 * Checks whether a given plugin is active on the board
 * @param idPlugin the plugin you want to check
 * @param board
 * @returns True if active, False is not.
 */
export const isPluginEnabled = (
  idPlugin: string,
  {
    boardPlugins,
  }: {
    boardPlugins: Pick<Board['boardPlugins'][number], 'idPlugin'>[];
  },
) => {
  return boardPlugins.some((plugin) => plugin.idPlugin === idPlugin);
};
