import { useEffect, useState } from 'react';

import {
  AtlassianAccountMigrationStage as Stages,
  forceEnterpriseMigrationQuery,
  forceInactiveMigrationQuery,
} from '@trello/aa-migration';
import { isMemberLoggedIn } from '@trello/authentication';

import { useAtlassianAccountMigrationConfirmation } from 'app/src/components/AtlassianAccountMigration';
import { useAtlassianManagedAccountOverlay } from 'app/src/components/AtlassianManagedAccount';
import { useAtlassianAccountMigrationStage } from './useAtlassianAccountMigrationStage';

type Stage = (typeof Stages)[keyof typeof Stages];

export const useAtlassianAccountMigrationStageOverlays = () => {
  const { stage, me } = useAtlassianAccountMigrationStage({
    skip: !isMemberLoggedIn(),
  });
  const [forceStage, setForceStage] = useState<Stage | null>(null);
  const [shouldRenderOverlay, setShouldRenderOverlay] = useState(false);

  const effectiveStage = forceStage || stage;

  const isNewlyManagedStage = effectiveStage === Stages.newlyManaged;

  const isMigrationStage =
    effectiveStage === Stages.enterpriseMigration ||
    effectiveStage === Stages.inactiveMigration;

  const { shouldRender: shouldRenderManagedAccountOverlay } =
    useAtlassianManagedAccountOverlay({
      skip: !isNewlyManagedStage,
    });

  const { shouldRender: shouldRenderAtlassianAccountMigrationConfirmation } =
    useAtlassianAccountMigrationConfirmation({
      skip: !isMigrationStage,
    });

  useEffect(() => {
    switch (effectiveStage) {
      case Stages.newlyManaged:
        setShouldRenderOverlay(shouldRenderManagedAccountOverlay);
        break;
      case Stages.enterpriseMigration:
      case Stages.inactiveMigration:
        setShouldRenderOverlay(
          shouldRenderAtlassianAccountMigrationConfirmation,
        );
        break;
      default:
        setShouldRenderOverlay(false);
    }
  }, [
    effectiveStage,
    shouldRenderAtlassianAccountMigrationConfirmation,
    shouldRenderManagedAccountOverlay,
  ]);

  // If forcing open a banner with a query parameter, override actual stage.
  useEffect(() => {
    const query = window.location.search;
    if (forceEnterpriseMigrationQuery.test(query)) {
      setForceStage(Stages.enterpriseMigration);
    } else if (forceInactiveMigrationQuery.test(query)) {
      setForceStage(Stages.inactiveMigration);
    }
  }, [me]);

  return {
    me,
    stage: effectiveStage,
    forceStage,
    shouldRenderOverlay,
  };
};
