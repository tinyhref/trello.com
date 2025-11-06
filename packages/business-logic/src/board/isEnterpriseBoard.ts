import { Entitlements } from '@trello/entitlements';
import type { Board, TrelloBoard } from '@trello/model-types';

/**
 * We consider it to be an enterprise board if one of the
 * following is true:
   - it has an `idEnterprise` set
   - it belongs to an organization that belongs to an
 * enterprise. We also check if it's a real enterprise,
 * because we still have BCPO teams in the enterprises collection
 * @returns Boolean
 */
const _isEnterpriseBoard = ({
  boardEnterpriseId,
  organizationEnterpriseId,
  organizationOffering,
}: {
  boardEnterpriseId?: string | null;
  organizationEnterpriseId?: string | null;
  organizationOffering?: string | null;
}): boolean => {
  if (!organizationEnterpriseId) {
    return false;
  }

  if (!boardEnterpriseId) {
    return false;
  }

  return Entitlements.isEnterprise(organizationOffering);
};

export const isEnterpriseBoard = (board: {
  idEnterprise?: string | null;
  organization?:
    | (Pick<Board['organization'], 'id' | 'offering'> & {
        idEnterprise?: string | null;
      })
    | null;
}): boolean => {
  return _isEnterpriseBoard({
    boardEnterpriseId: board.idEnterprise,
    organizationEnterpriseId: board.organization?.idEnterprise,
    organizationOffering: board.organization?.offering,
  });
};

export const isEnterpriseTrelloBoard = (board: {
  enterprise?: Pick<TrelloBoard['enterprise'], 'id'> | null;
  workspace?:
    | (Pick<TrelloBoard['workspace'], 'id'> & {
        offering?: string | null;
      } & {
        enterprise?: Pick<TrelloBoard['workspace']['enterprise'], 'id'> | null;
      })
    | null;
}): boolean => {
  return _isEnterpriseBoard({
    boardEnterpriseId: board.enterprise?.id,
    organizationEnterpriseId: board.workspace?.enterprise?.id,
    organizationOffering: board.workspace?.offering,
  });
};
