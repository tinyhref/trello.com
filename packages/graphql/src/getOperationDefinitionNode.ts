import type { DocumentNode, OperationDefinitionNode } from 'graphql';

/**
 * Given a document node, derive the associated OperationDefinitionNode.
 * This is often used to parse the "operationName" value from a named query.
 */
export const getOperationDefinitionNode = (
  document?: DocumentNode,
): OperationDefinitionNode | undefined =>
  document?.definitions.find(
    (d) => d.kind === 'OperationDefinition',
  ) as OperationDefinitionNode;
