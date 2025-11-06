import { useEffect } from 'react';

import { Popover, usePopover } from '@trello/nachos/popover';
import { useSharedState } from '@trello/shared-state';
import { wait } from '@trello/time';

import { GlobalPopoverState } from './components/Plugins/PluginPopover/GlobalPopoverState';

export const GlobalPopover = () => {
  const [globalPopoverState, setGlobalPopoverState] =
    useSharedState(GlobalPopoverState);

  const { popoverProps, toggle, show, triggerRef, hide } = usePopover({
    onHide: () =>
      setGlobalPopoverState({ isOpen: false, triggerElement: null }),
  });

  useEffect(() => {
    setGlobalPopoverState({
      show,
      hide,
      toggle,
    });
  }, [show, hide, toggle, setGlobalPopoverState]);

  useEffect(() => {
    if (globalPopoverState.isOpen) {
      if (!popoverProps.isVisible) {
        triggerRef(globalPopoverState.triggerElement);
        wait(0).then(show);
      }
    } else {
      hide();
    }
  }, [
    globalPopoverState.isOpen,
    globalPopoverState.triggerElement,
    triggerRef,
    hide,
    show,
    popoverProps.isVisible,
  ]);

  return (
    <Popover {...popoverProps} title={globalPopoverState.title}>
      {globalPopoverState.reactElement}
    </Popover>
  );
};
