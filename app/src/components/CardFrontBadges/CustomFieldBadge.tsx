import type { FunctionComponent } from 'react';
import { useCallback } from 'react';

import { formatHumanDate } from '@trello/dates/i18n';
import { intl } from '@trello/i18n';
import { CheckCircleIcon } from '@trello/nachos/icons/check-circle';
import type { BadgesTestIds } from '@trello/test-ids';

import type { BadgeColor } from './Badge';
import { Badge } from './Badge';
import { useCustomFieldFragment } from './CustomFieldFragment.generated';

const getParsedValue = (type: string | undefined, value: Value | undefined) => {
  if (value === undefined) {
    return null;
  }

  switch (type) {
    case 'checkbox':
      return value.checked === 'true' || null;
    case 'date':
      return value.date ? formatHumanDate(new Date(value.date)) : null;
    case 'number':
      return value.number ? intl.formatNumber(parseFloat(value.number)) : null;
    case 'text':
      return value.text || null;
    default:
      return null;
  }
};

interface Value {
  checked?: string | null;
  date?: string | null;
  number?: string | null;
  text?: string | null;
}

interface CustomFieldBadgeProps {
  idCustomField: string;
  idValue?: string | null;
  value?: Value | null;
  testId?: BadgesTestIds;
}

export const CustomFieldBadge: FunctionComponent<CustomFieldBadgeProps> = ({
  idCustomField,
  idValue,
  value,
  testId,
}) => {
  const { data } = useCustomFieldFragment({
    from: { id: idCustomField },
    optimistic: true,
  });

  const getListOption = useCallback(
    (id: string | undefined) => {
      if (!id) {
        return;
      }
      return data?.options?.find((option) => {
        return option.id === id;
      });
    },
    [data?.options],
  );

  if (!data?.display?.cardFront || !data?.type) {
    return null;
  }

  const { name, type } = data;

  if (type === 'list' && idValue) {
    const selectedOption = getListOption(idValue);

    if (!selectedOption) {
      return null;
    }

    const { color, value: optValue } = selectedOption;
    const { text } = optValue;

    return (
      <Badge
        color={color as BadgeColor}
        shouldUseColorBlindPattern={true}
        testId={testId}
      >
        {name}: {text}
      </Badge>
    );
  }

  const parsedValue = getParsedValue(data?.type, value ?? undefined);

  if (parsedValue === null) {
    return null;
  }

  if (type === 'checkbox') {
    return (
      <Badge testId={testId} Icon={CheckCircleIcon}>
        {name}
      </Badge>
    );
  }

  return (
    <Badge testId={testId}>
      {name}: {parsedValue}
    </Badge>
  );
};
