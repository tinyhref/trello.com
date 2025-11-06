import { InMemoryCache } from '@apollo/client';

import { fragmentRegistry } from './fragments/fragmentRegistry';
import possibleTypesMap from './possibleTypes.generated.json';
import { typePolicies } from './typePolicies';

export const cache = new InMemoryCache({
  /**
   * This defines the supertype/subtype mappings in the schema.
   * For example, TrelloCardActions is a union that can be
   * any of the types listed below.
   *
   * https://www.apollographql.com/docs/react/data/fragments#defining-possibletypes-manually
   * https://the-guild.dev/graphql/codegen/plugins/other/fragment-matcher
   */
  possibleTypes: possibleTypesMap.possibleTypes,
  typePolicies,
  fragments: fragmentRegistry,
});
