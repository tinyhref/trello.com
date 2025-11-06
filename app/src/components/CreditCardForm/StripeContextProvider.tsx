import { Elements } from '@stripe/react-stripe-js';
import type { StripeElementLocale } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js/pure';
import type { FunctionComponent, PropsWithChildren } from 'react';

import { stripeApiKey } from '@trello/config';
import { currentLocale } from '@trello/locale';

loadStripe.setLoadParameters({ advancedFraudSignals: false });

const stripePromise = loadStripe(stripeApiKey);

export const StripeContextProvider: FunctionComponent<
  PropsWithChildren<unknown>
> = ({ children }) => {
  return (
    <Elements
      stripe={stripePromise}
      options={{ locale: currentLocale as StripeElementLocale }}
    >
      {children}
    </Elements>
  );
};
