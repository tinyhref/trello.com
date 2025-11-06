import type { FunctionComponent } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';

import * as styles from './SavePercentageTag.module.less';

interface OwnProps {
  percentage: number;
}

export const SavePercentageTag: FunctionComponent<OwnProps> = ({
  percentage,
}) => {
  return (
    <div className={styles.tag}>
      <FormattedMessage
        id="templates.billing_page_one.discount-percent"
        defaultMessage="SAVE {discountPercent}"
        description="Tag showing the percentage savings when choosing annual billing"
        values={{
          discountPercent: (
            <FormattedNumber
              value={percentage / 100}
              style="percent"
              maximumFractionDigits={0}
            />
          ),
        }}
      />
    </div>
  );
};
