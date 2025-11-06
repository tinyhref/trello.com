/* eslint-disable formatjs/enforce-description */
import type { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import { CheckIcon } from '@trello/nachos/icons/check';
import { Tooltip, TooltipPrimitiveLight } from '@trello/nachos/tooltip';
import { token } from '@trello/theme';

import type { FeatureItem, FeatureKeysStrings } from './getFeatures';
import { setAutomationText } from './PlanComparisonCell';

import * as styles from './FeatureCards.module.less';

interface OwnProps extends Omit<FeatureItem, 'key'> {
  cardKey: FeatureKeysStrings;
}

export const FeatureCards: FunctionComponent<OwnProps> = ({
  featureName,
  featureIcon: FeatureIcon,
  free,
  standard,
  business,
  enterprise,
  toolTipTxt,
  cardKey,
}) => {
  const isAutomation = featureName === 'Automation';
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const formattedText = (text?: string, toolTipTxt?: string) => {
    return isAutomation ? setAutomationText(text, toolTipTxt) : text;
  };
  return (
    <section className={styles.card} key={cardKey}>
      <div className={styles.feature}>
        <FeatureIcon label="" color={token('color.icon.subtle', '#626F86')} />
        {toolTipTxt ? (
          <Tooltip
            tag="span"
            component={TooltipPrimitiveLight}
            content={toolTipTxt}
          >
            <p className={styles.featureName}>{featureName}</p>
          </Tooltip>
        ) : (
          <p className={styles.featureNameNoTooltip}>{featureName}</p>
        )}
      </div>
      <div className={styles.plan} key="free">
        <span>
          <FormattedMessage
            id="templates.billing_page_one.free-name"
            defaultMessage="Free"
          />
        </span>
        {free.text ? (
          formattedText(free.text, free.toolTipTxt)
        ) : free.check ? (
          <CheckIcon color={token('color.icon.accent.green', '#22A06B')} />
        ) : null}
      </div>
      <div className={styles.plan} key="standard">
        <span>
          <FormattedMessage
            id="templates.billing_page_one.standard-name"
            defaultMessage="Standard"
          />
        </span>
        {standard.text ? (
          formattedText(standard.text, standard.toolTipTxt)
        ) : standard.check ? (
          <CheckIcon color={token('color.icon.accent.green', '#22A06B')} />
        ) : null}
      </div>
      <div className={styles.plan} key="business">
        <span>
          <FormattedMessage
            id="templates.billing_page_one.business-class-name"
            defaultMessage="Premium"
          />
        </span>
        {business.text ? (
          formattedText(business.text, business.toolTipTxt)
        ) : business.check ? (
          <CheckIcon color={token('color.icon.accent.green', '#22A06B')} />
        ) : null}
      </div>{' '}
      <div className={styles.plan} key="enterprise">
        <span>
          <FormattedMessage
            id="templates.billing_page_one.enterprise-name"
            defaultMessage="Enterprise"
          />
        </span>
        {enterprise.text ? (
          formattedText(enterprise.text, enterprise.toolTipTxt)
        ) : enterprise.check ? (
          <CheckIcon color={token('color.icon.accent.green', '#22A06B')} />
        ) : null}
      </div>
    </section>
  );
};
