import { useEffect, useState } from 'react';

import type { AtlassianAccountMigrationStageType as StageType } from '@trello/aa-migration';
import {
  AtlassianAccountMigrationStage as Stage,
  RequiresAaOnboardingTemplates as Templates,
} from '@trello/aa-migration';

import { useAtlassianAccountMigrationStageQuery } from './AtlassianAccountMigrationStageQuery.generated';

interface Options {
  skip?: boolean;
}

export function useAtlassianAccountMigrationStage({
  skip = false,
}: Options = {}) {
  const [stage, setStage] = useState<StageType | null>(null);

  const { data } = useAtlassianAccountMigrationStageQuery({
    skip,
    variables: { memberId: 'me' },
    waitOn: ['MemberHeader'],
  });

  const me = data?.member;

  const { template } = me?.requiresAaOnboarding || {};

  useEffect(() => {
    if (!me) {
      return;
    }

    if (!me.confirmed) {
      setStage(Stage.confirmEmail);
    } else if (me.isAaMastered) {
      switch (template) {
        case Templates.ENTERPRISE:
          setStage(Stage.enterpriseMigration);
          break;
        case Templates.INACTIVE:
          setStage(Stage.inactiveMigration);
          break;
        case Templates.NEWLY_MANAGED:
          setStage(Stage.newlyManaged);
          break;
        default:
          setStage(Stage.done);
      }
    } else {
      setStage(Stage.done);
    }
  }, [me, me?.confirmed, me?.isAaMastered, template]);

  return { stage, me };
}
