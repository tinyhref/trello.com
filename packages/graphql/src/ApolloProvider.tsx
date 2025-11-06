import type { FunctionComponent, PropsWithChildren } from 'react';
import { ApolloProvider as AP } from '@apollo/client';

import { client } from './client';

export const ApolloProvider: FunctionComponent<PropsWithChildren<unknown>> = ({
  children,
}) => <AP client={client}>{children}</AP>;
