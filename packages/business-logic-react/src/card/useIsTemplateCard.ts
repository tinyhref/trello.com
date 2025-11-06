import { useIsTemplateCardFragment } from './IsTemplateCardFragment.generated';
export const useIsTemplateCard = (cardId: string) => {
  const { data } = useIsTemplateCardFragment({ from: { id: cardId } });

  return Boolean(data?.isTemplate);
};
