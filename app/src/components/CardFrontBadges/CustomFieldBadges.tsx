import type { FunctionComponent } from 'react';
import { useContext, useMemo } from 'react';

import { useBoardId, useCardId } from '@trello/id-context';
import type { BadgesTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { CardFrontContext } from 'app/src/components/CardFront/CardFrontContext';
import { useMirrorCardSourceBoardInfoQuery } from 'app/src/components/MirrorCard/MirrorCardSourceBoardInfoQuery.generated';
import { CustomFieldBadge } from './CustomFieldBadge';
import type { CustomFieldItemsFragment } from './CustomFieldItemsFragment.generated';
import { useCustomFieldItemsFragment } from './CustomFieldItemsFragment.generated';
import { useCustomFieldsFragment } from './CustomFieldsFragment.generated';

type CustomFieldItem = NonNullable<
  NonNullable<CustomFieldItemsFragment>['customFieldItems'][number]
>;

export const CustomFieldBadges: FunctionComponent = () => {
  const boardId = useBoardId();
  const cardId = useCardId();

  const { data: boardData } = useCustomFieldsFragment({
    from: { id: boardId },
    optimistic: true,
  });

  const { data: cardData } = useCustomFieldItemsFragment({
    from: { id: cardId },
    optimistic: true,
    returnPartialData: true,
  });

  const customFieldItems = cardData?.customFieldItems;

  const { cardType } = useContext(CardFrontContext);
  const isMirrorCard = cardType === 'mirror';
  const sourceBoardId = cardData?.board?.id ?? '';
  const shouldSkipSourceBoardQuery =
    !isMirrorCard || !sourceBoardId || customFieldItems?.length === 0;

  // Temporarily fetch source board data here until we are
  // loading mirror card data via QuickLoad, so we can
  // display custom fields for mirror card fronts.
  const { data: sourceBoardData } = useMirrorCardSourceBoardInfoQuery({
    variables: { id: sourceBoardId },
    skip: shouldSkipSourceBoardQuery,
    waitOn: [],
  });

  const customFields = isMirrorCard
    ? sourceBoardData?.board?.customFields
    : boardData?.customFields;

  // Map the customFieldItem objects set on the card to an object keyed by
  // the id of the customField object set on the board.
  const customFieldItemMap = useMemo(() => {
    return customFieldItems?.reduce(
      (acc, item) => {
        acc[item.idCustomField] = item;
        return acc;
      },
      {} as { [key: string]: CustomFieldItem },
    );
  }, [customFieldItems]);

  // This filters and sorts the customField objects set on the board to figure
  // out which badges are eligible to display and in what order. It then maps
  // those customField objects to the matching customFieldItem object which is
  // set on the card.
  const badges = useMemo(() => {
    if (!customFields?.length || !customFieldItemMap) {
      return [];
    }

    return customFields
      .filter(
        (field) => field.display.cardFront && customFieldItemMap?.[field.id],
      )
      .sort((a, b) => (a.pos < b.pos ? -1 : 1))
      .map((item) => customFieldItemMap?.[item.id]);
  }, [customFields, customFieldItemMap]);

  if (!badges.length) {
    return null;
  }

  return (
    <>
      {badges?.map((item) => {
        return (
          <CustomFieldBadge
            key={item.id}
            idCustomField={item.idCustomField}
            idValue={item.idValue}
            value={item.value}
            testId={getTestId<BadgesTestIds>('badge-custom-field')}
          />
        );
      })}
    </>
  );
};
