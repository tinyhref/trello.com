import type { FunctionComponent } from 'react';

import { Tooltip, TooltipPrimitiveLight } from '@trello/nachos/tooltip';
import { token } from '@trello/theme';

import type { FeatureItem } from './getFeatures';
import { PlanComparisonCell } from './PlanComparisonCell';

import * as styles from './PlanComparisonRow.module.less';

interface OwnProps {
  featureItem: FeatureItem;
}

export const PlanComparisonRow: FunctionComponent<OwnProps> = ({
  featureItem: {
    key,
    featureName,
    featureIcon: FeatureIcon,
    free: { text: freeText, check: freeCheck, toolTipTxt: freeToolTipTxt },
    standard: {
      text: standardText,
      check: standardCheck,
      toolTipTxt: staToolTipTxt,
    },
    business: { text: bcText, check: bcCheck, toolTipTxt: bcToolTipTxt },
    enterprise: {
      text: enterpriseText,
      check: enterpriseCheck,
      toolTipTxt: enterpriseToolTipTxt,
    },
    toolTipTxt,
  },
}) => {
  return (
    <tr className={styles.row} key={key}>
      <td className={styles.featureContent}>
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
      </td>
      <PlanComparisonCell
        isChecked={freeCheck}
        text={freeText}
        featureName={featureName}
        toolTipTxt={freeToolTipTxt}
      />
      <PlanComparisonCell
        isChecked={standardCheck}
        text={standardText}
        featureName={featureName}
        toolTipTxt={staToolTipTxt}
      />
      <PlanComparisonCell
        isChecked={bcCheck}
        text={bcText}
        featureName={featureName}
        toolTipTxt={bcToolTipTxt}
      />
      <PlanComparisonCell
        isChecked={enterpriseCheck}
        text={enterpriseText}
        featureName={featureName}
        toolTipTxt={enterpriseToolTipTxt}
      />
    </tr>
  );
};
