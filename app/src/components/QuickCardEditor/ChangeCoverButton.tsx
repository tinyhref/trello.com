import type { FunctionComponent } from 'react';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import { CardCoverIcon } from '@trello/nachos/icons/card-cover';
import { usePopover } from '@trello/nachos/popover';
import type { QuickCardEditorTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { CardCoverPopover } from 'app/src/components/CardBackSidebar/CardCoverPopover';
import { QuickCardEditorButton } from './QuickCardEditorButton';

export const Screens = {
  AddCover: 0,
  SelectCover: 1,
} as const;

export const ChangeCoverButton: FunctionComponent = () => {
  const { toggle, popoverProps, push, triggerRef, pop } =
    usePopover<HTMLButtonElement>({ initialScreen: Screens.SelectCover });

  const onClick = useCallback(() => {
    toggle();
  }, [toggle]);

  return (
    <>
      <QuickCardEditorButton
        icon={<CardCoverIcon size="small" />}
        onClick={onClick}
        testId={getTestId<QuickCardEditorTestIds>(
          'quick-card-editor-change-cover',
        )}
        ref={triggerRef}
        isSelected={popoverProps.isVisible}
      >
        <FormattedMessage
          id="templates.quick_card_editor.change-cover"
          defaultMessage="Change cover"
          description="Quick card editor Change cover button"
        />
      </QuickCardEditorButton>
      <CardCoverPopover pop={pop} popoverProps={popoverProps} push={push} />
    </>
  );
};
