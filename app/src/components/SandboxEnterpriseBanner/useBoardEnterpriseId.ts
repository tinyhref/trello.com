import { useBoardIdFromBoardOrCardRoute } from 'app/src/components/Board/useBoardIdFromBoardOrCardRoute';
import { useSandboxBoardEnterpriseFragment } from './SandboxBoardEnterpriseFragment.generated';

export const useBoardEnterpriseId = () => {
  const idBoard = useBoardIdFromBoardOrCardRoute() || '';

  const { data } = useSandboxBoardEnterpriseFragment({
    from: { id: idBoard },
  });

  const boardEnterpriseId = data?.enterprise?.id ?? '';
  return boardEnterpriseId;
};
