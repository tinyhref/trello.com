import type { FunctionComponent, PropsWithChildren } from 'react';
import { createContext, useContext } from 'react';

import { useBoardPremiumFeaturesFragment } from './BoardPremiumFeaturesFragment.generated';

const BoardPremiumFeaturesContext = createContext<string[] | null>(null);

interface BoardPremiumFeaturesProviderProps {
  boardId: string | null | undefined;
}

export const BoardPremiumFeaturesProvider: FunctionComponent<
  PropsWithChildren<BoardPremiumFeaturesProviderProps>
> = ({ boardId = '', children }) => {
  const { data } = useBoardPremiumFeaturesFragment({
    from: { id: boardId },
  });

  return (
    <BoardPremiumFeaturesContext.Provider value={data?.premiumFeatures || []}>
      {children}
    </BoardPremiumFeaturesContext.Provider>
  );
};

export const useIsBoardPremiumFeatureEnabled = (feature: string) => {
  const premiumFeatures = useContext(BoardPremiumFeaturesContext);

  if (premiumFeatures === null) {
    throw new Error(
      'Could not find board premium features in the React context. Did you forget to wrap the root component in a <BoardPremiumFeaturesProvider>?',
    );
  }

  return premiumFeatures.includes(feature);
};
