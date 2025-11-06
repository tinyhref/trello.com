/* eslint-disable formatjs/enforce-description */
import type { ChangeEvent, FunctionComponent } from 'react';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import { Analytics } from '@trello/atlassian-analytics';
import { localizeErrorCode } from '@trello/legacy-i18n';
import { getScreenFromUrl } from '@trello/marketing-screens';
import { Checkbox } from '@trello/nachos/checkbox';
import type { PurchaseFormIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import * as styles from './TermsOfService.module.less';

interface TermsOfServiceProps {
  isDisabled?: boolean;
  isInvalid?: boolean;
  isChecked?: boolean;
  onChange: (checked: boolean) => void;
}

export const TermsOfService: FunctionComponent<TermsOfServiceProps> = ({
  isDisabled,
  isInvalid,
  isChecked = false,
  onChange,
}) => {
  const changeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.checked);
    },
    [onChange],
  );

  const onClickTermsOfService = useCallback(() => {
    Analytics.sendClickedLinkEvent({
      linkName: 'termsOfServiceLink',
      source: getScreenFromUrl(),
    });
  }, []);

  const onClickPrivacyPolicy = useCallback(() => {
    Analytics.sendClickedLinkEvent({
      linkName: 'privacyPolicyLink',
      source: getScreenFromUrl(),
    });
  }, []);

  return (
    <div data-testid={getTestId<PurchaseFormIds>('terms-of-service')}>
      <Checkbox
        isDisabled={isDisabled}
        isInvalid={isInvalid}
        isChecked={isChecked}
        onChange={changeHandler}
        name="tos"
        tabIndex={0}
        label={
          <span className={styles.tosLabel}>
            <FormattedMessage
              id="templates.credit_card.i-agree-to-the-cloud-terms-of-service-and-acknowledge-privacy-policy"
              defaultMessage="I agree to the {cloudTermsOfService} and acknowledge the {privacyPolicy}."
              values={{
                cloudTermsOfService: (
                  <a
                    href="https://trello.com/legal"
                    target="_blank"
                    rel="popup"
                    title="Cloud Terms of Service"
                    key="cloud-terms-of-service"
                    onClick={onClickTermsOfService}
                  >
                    <FormattedMessage
                      id="templates.credit_card.cloud-terms-of-service"
                      defaultMessage="Cloud Terms of Service"
                    />
                  </a>
                ),
                privacyPolicy: (
                  <a
                    href="https://trello.com/privacy"
                    target="_blank"
                    rel="popup"
                    title="Privacy Policy"
                    key="privacy-policy"
                    onClick={onClickPrivacyPolicy}
                  >
                    <FormattedMessage
                      id="templates.credit_card.privacy-policy"
                      defaultMessage="Privacy Policy"
                    />
                  </a>
                ),
              }}
            />
          </span>
        }
      />
      {isInvalid && (
        <div
          className={styles.error}
          data-testid={getTestId<PurchaseFormIds>(
            'terms-of-service-validation-error',
          )}
        >
          {localizeErrorCode('paidAccount', 'BILLING_INVALID_TOS')}
        </div>
      )}
    </div>
  );
};
