import type {
  StripeElementClasses,
  StripeElementStyle,
} from '@stripe/stripe-js';
import cx from 'classnames';

import { getTokenValue } from '@trello/theme';

// eslint-disable-next-line @trello/less-matches-component
import * as styles from './getDefaultIframeOptions.module.less';

/**
 * Returns theming values for stripe iframe input
 * integration to align their appearance with ADS
 * text fields
 */
export const getDefaultIframeOptions = ({
  isDisabled = false,
}: {
  isDisabled?: boolean;
}) => {
  const classes: StripeElementClasses = {
    base: cx(styles.input, {
      [styles.input_disabled]: isDisabled,
    }),
    focus: styles.input_focus,
    invalid: styles.input_invalid,
  };

  const style: StripeElementStyle = {
    base: {
      fontSize: '14px',
      color: isDisabled
        ? getTokenValue('color.text.disabled', '#091E424F')
        : getTokenValue('color.text', '#172B4D'),
      '::placeholder': {
        color: getTokenValue('color.text.subtlest', '#626F86'),
      },
    },
    invalid: {
      color: isDisabled
        ? getTokenValue('color.text.disabled', '#091E424F')
        : getTokenValue('color.text', '#172B4D'),
    },
  };

  return {
    classes,
    style,
  };
};
