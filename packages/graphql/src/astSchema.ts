import type { DocumentNode } from 'graphql';
import { buildASTSchema } from 'graphql/utilities';

import schema from './schema';

export const astSchema = buildASTSchema(schema as DocumentNode, {
  assumeValidSDL: true,
});
