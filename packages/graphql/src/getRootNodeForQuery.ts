import type { FieldNode, OperationDefinitionNode } from 'graphql';

export const getRootNodeForQuery = (operationNode: OperationDefinitionNode) => {
  return (operationNode?.selectionSet.selections[0] as FieldNode).name.value;
};
