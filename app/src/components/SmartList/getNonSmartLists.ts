interface ListWithOptionalType {
  type?: 'datasource' | null;
}

/**
 * Filter out smart lists on the board and just return
 * normal lists.
 *
 * @param lists Array of lists to filter
 */
export const getNonSmartLists = <TList extends ListWithOptionalType>(
  lists: Array<TList>,
) => {
  return lists.filter((list) => !list.type);
};
