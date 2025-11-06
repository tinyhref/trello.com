import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import type { DateRangePickerTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { CardDateRangePickerProps } from './CardDateRangePicker';
import { DateRangePickerSkeleton } from './DateRangePickerSkeleton';

export const LazyCardDateRangePicker: FunctionComponent<
  CardDateRangePickerProps
> = ({
  due,
  start,
  disableStartDate,
  dueReminder,
  idCard,
  idBoard,
  idOrg,
  hidePopover,
  initialChoice,
  recurrenceRule,
  dateClosed,
}) => {
  const CardDateRangePicker = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "card-date-range-picker" */ './CardDateRangePicker'
      ),
    { namedImport: 'CardDateRangePicker' },
  );
  return (
    <div data-testid={getTestId<DateRangePickerTestIds>('date-range-picker')}>
      <ChunkLoadErrorBoundary fallback={null}>
        <Suspense
          fallback={
            <DateRangePickerSkeleton disableStartDate={disableStartDate} />
          }
        >
          <CardDateRangePicker
            due={due}
            start={start}
            disableStartDate={disableStartDate}
            dueReminder={dueReminder}
            idCard={idCard}
            idBoard={idBoard}
            idOrg={idOrg}
            hidePopover={hidePopover}
            initialChoice={initialChoice}
            recurrenceRule={recurrenceRule}
            dateClosed={dateClosed}
          />
        </Suspense>
      </ChunkLoadErrorBoundary>
    </div>
  );
};
