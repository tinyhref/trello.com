/* eslint-disable formatjs/enforce-description */
import type { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import { CheckIcon } from '@trello/nachos/icons/check';
import { Tooltip, TooltipPrimitiveLight } from '@trello/nachos/tooltip';
import { token } from '@trello/theme';

import * as styles from './PlanComparisonCell.module.less';

interface OwnProps {
  isChecked?: boolean;
  text?: string;
  toolTipTxt?: string;
  featureName: string;
}

export const setAutomationText = (text?: string, toolTipTxt?: string) => (
  <span className={styles.cellText}>
    <Tooltip tag="span" component={TooltipPrimitiveLight} content={toolTipTxt}>
      <span className={styles.underlineAuto}>{text}</span>
    </Tooltip>{' '}
    <FormattedMessage
      id="templates.billing_page_one.per-month"
      defaultMessage="per month"
    />
  </span>
);

export const PlanComparisonCell: FunctionComponent<OwnProps> = ({
  isChecked,
  text,
  toolTipTxt,
  featureName,
}) => {
  const isAutomation = featureName === 'Automation';
  const formattedText = isAutomation
    ? setAutomationText(text, toolTipTxt)
    : text;
  return (
    <td
      className={styles.featureCell}
      key={`${featureName}-{text}-{isChecked}`}
    >
      {isChecked ? (
        <>
          <CheckIcon color={token('color.icon.accent.green', '#22A06B')} />
          <br />
        </>
      ) : null}
      <span>{formattedText}</span>
    </td>
  );
};
