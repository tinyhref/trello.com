import type { FunctionComponent } from 'react';

import { PlanSummary } from './PlanSummary';
import type { PlanSummaryCalculationProps } from './usePlanSummaryCalculation';
import { usePlanSummaryCalculation } from './usePlanSummaryCalculation';

export const PlanSummaryConnected: FunctionComponent<
  PlanSummaryCalculationProps
> = (props) => {
  const data = usePlanSummaryCalculation(props);
  return <PlanSummary {...data} />;
};
