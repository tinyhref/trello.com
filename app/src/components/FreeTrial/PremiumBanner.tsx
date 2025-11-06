import classnames from 'classnames';
import { useEffect, type FunctionComponent, type ReactNode } from 'react';

import { PremiumLozenge } from './PremiumLozenge';
import { useHasReverseTrialExperience } from './useHasReverseTrialExperience';

import * as styles from './PremiumBanner.module.less';

export interface PremiumBannerProps {
  title: ReactNode;
  description: ReactNode;
  className?: string;
}

export interface MaybePremiumBannerProps extends PremiumBannerProps {
  onRender?: (willRender: boolean) => void;
}

export const PremiumBanner: FunctionComponent<PremiumBannerProps> = ({
  title,
  description,
  className,
}) => {
  return (
    <div className={classnames(styles.PremiumBanner, className)}>
      <PremiumLozenge />
      <div className={styles.title}>{title}</div>
      <div className={styles.description}>{description}</div>
    </div>
  );
};

export const MaybePremiumBanner: FunctionComponent<MaybePremiumBannerProps> = ({
  onRender,
  ...args
}) => {
  const hasReverseTrialExperience = useHasReverseTrialExperience();

  useEffect(() => {
    onRender?.(hasReverseTrialExperience);
  }, [onRender, hasReverseTrialExperience]);

  return hasReverseTrialExperience ? <PremiumBanner {...args} /> : null;
};
