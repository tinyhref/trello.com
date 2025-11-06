import type { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import { Banner } from 'app/src/components/Banner';

export const SomethingsWrongBanner: FunctionComponent = () => {
  return (
    <Banner>
      <div style={{ textAlign: 'center' }}>
        <strong>
          <FormattedMessage
            id="somethings wrong.currently-experiencing-issues"
            defaultMessage="We are currently experiencing some issues. We hope to have everything back to normal shortly."
            description="A message in a banner to inform the user that Trello is experiencing issues."
          />
        </strong>
        &nbsp;
        <a href="http://status.trello.com" target="_blank">
          https://status.trello.com
        </a>
      </div>
    </Banner>
  );
};
