import type { MouseEventHandler } from 'react';
import { useEffect } from 'react';

import { Focusable } from '@atlaskit/primitives/compiled';
import { Analytics } from '@trello/atlassian-analytics';

import { noop } from 'app/src/noop';
import {
  DeprecatedEditCardButton,
  getDeprecatedEditCardButton,
} from './DeprecatedEditCardButton';

import * as styles from './SeparatorCard.module.less';

interface SeparatorCardPropTypes {
  deprecated_openEditor?: MouseEventHandler<HTMLButtonElement>;
  deprecated_isEditable?: boolean;
  analyticsContainers: Parameters<
    typeof Analytics.sendViewedComponentEvent
  >[0]['containers'];
}

export const SeparatorCard = ({
  deprecated_openEditor = noop,
  deprecated_isEditable = false,
  analyticsContainers,
}: SeparatorCardPropTypes) => {
  const { shouldShowEditCardButton } = getDeprecatedEditCardButton();

  useEffect(() => {
    Analytics.sendViewedComponentEvent({
      componentType: 'card',
      componentName: 'separatorCard',
      source: 'cardView',
      containers: analyticsContainers,
    });
  }, [analyticsContainers]);

  return (
    <Focusable
      as="div"
      role="button"
      aria-label="Separator Card"
      tabIndex={0}
      xcss={styles.separatorCardFront}
    >
      <DeprecatedEditCardButton
        onClick={deprecated_openEditor}
        shouldShow={deprecated_isEditable && shouldShowEditCardButton}
      />
    </Focusable>
  );
};
