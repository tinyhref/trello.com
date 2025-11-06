import { useEffect, type FunctionComponent } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { getScreenFromUrl } from '@trello/marketing-screens';

import { OfferingLozenge } from 'app/src/components/OfferingLozenge';
import { useHasReverseTrialExperience } from './useHasReverseTrialExperience';

interface PremiumLozengeProps {
  className?: string;
  featureHighlighted?: string;
}

export interface MaybePremiumLozengeProps extends PremiumLozengeProps {
  onRender?: (willRender: boolean) => void;
}

export const PremiumLozenge: FunctionComponent<PremiumLozengeProps> = ({
  className,
  featureHighlighted,
}) => {
  useEffect(() => {
    if (featureHighlighted) {
      Analytics.sendOperationalEvent({
        action: 'rendered',
        actionSubject: 'reverseTrialPremiumLozenge',
        source: getScreenFromUrl(),
        attributes: {
          featureHighlighted,
        },
      });
    }
  }, [featureHighlighted]);
  return <OfferingLozenge offering="trello.premium" className={className} />;
};

export const MaybePremiumLozenge: FunctionComponent<
  MaybePremiumLozengeProps
> = ({ onRender, ...args }) => {
  const hasReverseTrialExperience = useHasReverseTrialExperience();

  useEffect(() => {
    onRender?.(hasReverseTrialExperience);
  }, [onRender, hasReverseTrialExperience]);

  return hasReverseTrialExperience ? <PremiumLozenge {...args} /> : null;
};
