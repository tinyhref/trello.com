import { getAccessibleProducts } from '@trello/cross-flow';

export interface Site {
  cloudId: string;
  cloudUrl: string;
  displayName: string;
}

export const getUserSites = async (): Promise<Site[]> => {
  // getAccessibleProducts uses a route on the API Gateway
  // which cannot handle the scale of Trello.
  // When we open this open to external users we will need
  // to create our own API to get the sites.
  const { products } = await getAccessibleProducts();

  return Array.from(
    products
      .reduce((uniqueSites, { productDisplayName, workspaces }) => {
        // Filter out products that are not Jira or Confluence
        if (!['jira-software', 'confluence'].includes(productDisplayName)) {
          return uniqueSites;
        }

        // Add each workspace to the list of sites
        workspaces.forEach(({ cloudId, cloudUrl, workspaceDisplayName }) => {
          const siteKey = `${cloudId}|${cloudUrl}|${workspaceDisplayName}`;
          // Only add the site if it doesn't already exist - there can be duplicates
          if (!uniqueSites.has(siteKey)) {
            uniqueSites.set(siteKey, {
              cloudId: cloudId ?? '',
              cloudUrl: cloudUrl ?? '',
              displayName: workspaceDisplayName,
            });
          }
        });

        return uniqueSites;
      }, new Map<string, Site>())
      .values(),
  );
};
