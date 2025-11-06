import type { FunctionComponent } from 'react';

import { useCardId } from '@trello/id-context';

import type { Card } from 'app/scripts/models/Card';
import { PluginBadgesView } from 'app/scripts/views/plugin/PluginBadgesView';
import { BackboneViewAsComponent } from 'app/src/components/BackboneViewAsComponent';
import { useHasPluginCapability } from 'app/src/components/BoardPluginsContext';
import { useLegacyCardModel } from 'app/src/components/CardBack/useLegacyCardModel';

import * as styles from './PluginBadges.module.less';

export const PluginBadges: FunctionComponent = () => {
  const cardId = useCardId();
  const cardModel = useLegacyCardModel(cardId);

  const canHavePluginBadges = useHasPluginCapability('card-badges');

  if (!cardModel || !canHavePluginBadges) {
    return null;
  }

  return (
    <BackboneViewAsComponent<
      Card,
      PluginBadgesView['options'],
      PluginBadgesView
    >
      View={PluginBadgesView}
      model={cardModel}
      options={{}}
      className={styles.pluginBadgesView}
    />
  );
};
