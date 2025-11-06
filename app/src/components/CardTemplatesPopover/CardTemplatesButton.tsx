import type { FunctionComponent, MouseEventHandler } from 'react';
import { useCallback, useRef } from 'react';
import { FormattedMessage } from 'react-intl';

import { mergeRefs } from '@trello/dom-hooks';
import { intl } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import { TemplateCardIcon } from '@trello/nachos/icons/template-card';
import { Popover, usePopover } from '@trello/nachos/popover';
import { Tooltip } from '@trello/nachos/tooltip';
import type { CardTemplateTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import type { CreateCardFromTemplateMutationResult } from './CreateCardFromTemplateMutation.generated';
import { LazyCardTemplatesPopover } from './LazyCardTemplatesPopover';

import * as styles from './CardTemplatesButton.module.less';

type CopyCard = NonNullable<
  NonNullable<CreateCardFromTemplateMutationResult['data']>['copyCard']
>;

export interface CardTemplatesButtonProps {
  idList: string;
  onCardCreated: (card: CopyCard) => void;
}

const Screen = {
  CardTemplates: 0,
  CreateCardFromTemplate: 1,
  ConfirmDelete: 2,
} as const;

export const CardTemplatesButton: FunctionComponent<
  CardTemplatesButtonProps
> = ({ idList, onCardCreated }) => {
  const { toggle, hide, triggerRef, popoverProps, push, pop } =
    usePopover<HTMLButtonElement>({
      initialScreen: Screen.CardTemplates,
    });

  const onClickTooltipRef = useRef<MouseEventHandler<HTMLButtonElement> | null>(
    null,
  );

  const onClickButton = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (event) => {
      toggle();
      onClickTooltipRef.current?.(event);
    },
    [toggle],
  );

  return (
    <>
      <Tooltip
        content={
          <FormattedMessage
            id="templates.list.create-from-template"
            defaultMessage="Create from template…"
            description="Tooltip for button that toggles the card templates popover"
          />
        }
        delay={100}
        hideTooltipOnMouseDown
      >
        {({ onClick: onClickTooltip, ref: tooltipRef, ...tooltipProps }) => {
          onClickTooltipRef.current = onClickTooltip;
          const mergedRefs = mergeRefs(triggerRef, tooltipRef);
          return (
            <Button
              appearance="subtle"
              iconBefore={
                <TemplateCardIcon color="currentColor" size="small" />
              }
              className={styles.cardTemplateButton}
              data-testid={getTestId<CardTemplateTestIds>(
                'card-template-list-button',
              )}
              ref={mergedRefs as (node: HTMLButtonElement | null) => void}
              onClick={onClickButton}
              aria-label={intl.formatMessage({
                id: 'templates.list.create-from-template',
                defaultMessage: 'Create from template…',
                description:
                  'Aria-label for button that toggles the card templates popover',
              })}
              {...tooltipProps}
            />
          );
        }}
      </Tooltip>
      <Popover {...popoverProps} dangerous_className={styles.popover}>
        <LazyCardTemplatesPopover
          idList={idList}
          hide={hide}
          push={push}
          pop={pop}
          onCardCreated={onCardCreated}
        />
      </Popover>
    </>
  );
};
