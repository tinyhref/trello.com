import { ApolloLink } from '@apollo/client';

import {
  getServerGateOverridesHeaderValue,
  SERVER_GATE_OVERRIDES_HEADER,
} from '@trello/server-gate-overrides';

export const serverGateOverridesLink = () =>
  new ApolloLink((operation, forward) => {
    const gateOverrides = getServerGateOverridesHeaderValue();
    if (gateOverrides) {
      operation.setContext({
        headers: {
          [SERVER_GATE_OVERRIDES_HEADER]: gateOverrides,
        },
      });
    }
    return forward(operation);
  });
