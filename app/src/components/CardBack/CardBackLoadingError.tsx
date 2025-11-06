import type { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import { Button } from '@trello/nachos/button';
import { DialogCloseButton } from '@trello/nachos/dialog';

import * as styles from './CardBackLoadingError.module.less';

// eslint-disable-next-line @trello/assets-alongside-implementation
import tacoSleepSvg from 'resources/images/taco-sleep.svg';

interface CardBackLoadingErrorProps {
  onClose?: () => void;
}

const reloadPage = () => window.location.reload();

export const CardBackLoadingError: FunctionComponent<
  CardBackLoadingErrorProps
> = ({ onClose }) => {
  return (
    <div className={styles.errorMessage}>
      <DialogCloseButton
        onClick={() => onClose?.()}
        className={styles.closeButton}
      />
      <div>
        <img alt="Taco" src={tacoSleepSvg} />
        <h4>
          <FormattedMessage
            id="templates.error.card-detail-loading-error"
            defaultMessage="The card could not be loaded at this time."
            description="Error message when a card fails to load"
          />
        </h4>
        <p>
          <FormattedMessage
            id="templates.error.reload-call-to-action"
            defaultMessage="You may want to try reloading this page."
            description="Retry message when a card fails to load"
          />
        </p>
        <Button appearance="primary" onClick={reloadPage}>
          <FormattedMessage
            id="templates.connect_failed.reload-page"
            defaultMessage="Reload page"
            description="Reload page"
          />
        </Button>
      </div>
    </div>
  );
};
