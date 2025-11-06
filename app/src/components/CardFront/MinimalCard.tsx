import type { FunctionComponent } from 'react';

import { CardFrontName } from './CardFrontName';

import * as styles from './MinimalCard.module.less';

interface MinimalCardProps {
  name?: string;
  url?: string;
}

/**
 * Embedded representation of the MinimalCard component. Designed to be used for
 * internal use within the CardFront component, where containing styles and data
 * are already available.
 */
export const MinimalCard: FunctionComponent<MinimalCardProps> = ({
  name,
  url,
}) => <CardFrontName name={name} url={url} className={styles.minimalCard} />;
