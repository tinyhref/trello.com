import type { DocumentNode, OperationDefinitionNode } from 'graphql';

export const getOperationName = (query: DocumentNode) => {
  const definitionNode = query?.definitions.find(
    (d) => d.kind === 'OperationDefinition',
  ) as OperationDefinitionNode;
  const operationName = definitionNode?.name?.value as string;
  return operationName;
};
