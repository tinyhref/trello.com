/* eslint-disable unicorn/filename-case */
import type { MouseEvent as ReactMouseEvent } from 'react';

import { intl } from '@trello/i18n';

import { FileLinkComponent } from 'app/src/components/FileLinkComponent';
import { GlobalPopoverState } from 'app/src/components/Plugins/PluginPopover/GlobalPopoverState';

export const fileLinkHandler = (
  event: MouseEvent | ReactMouseEvent,
  linkElem: HTMLAnchorElement,
) => {
  event.preventDefault();

  GlobalPopoverState.setValue({
    triggerElement: linkElem,
    isOpen: true,
    title: intl.formatMessage({
      id: 'view title.open file link',
      defaultMessage: 'Open local file link',
      description: 'Open local file link text',
    }),
    reactElement: (
      <FileLinkComponent key="FileLinkComponent" url={linkElem.href} />
    ),
  });
};
