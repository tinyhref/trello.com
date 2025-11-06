import type { FunctionComponent, PropsWithChildren } from 'react';
import { RawIntlProvider } from 'react-intl';

import { intlCache } from './intlCache';

export const TrelloIntlProvider: FunctionComponent<
  PropsWithChildren<unknown>
> = ({ children }) => {
  return <RawIntlProvider value={intlCache}>{children}</RawIntlProvider>;
};
