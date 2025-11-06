import type { LabelsPopoverSharedState } from './LabelsPopoverState';
import {
  emptyLabelsPopoverState,
  LabelsPopoverState,
} from './LabelsPopoverState';

interface ToggleLabelPopoverProps
  extends Omit<
    LabelsPopoverSharedState,
    'idCard' | 'isOpen' | 'triggerElement'
  > {
  idCard: NonNullable<LabelsPopoverSharedState['idCard']>;
  triggerElement: NonNullable<LabelsPopoverSharedState['triggerElement']>;
}

/**
 * Because the label popover can be opened from disparate entry points, we need
 * this layer of additional logic to determine whether the toggle event is
 * meant to reopen the popover elsewhere, or close it.
 *
 * For example, if the label popover is open on a label in the card back, and
 * the user clicks the Add Label button on the righthand side of the card back,
 * the label popover should reopen on the button, instead of closing. After
 * that, if the user clicks on the same button, the popover should close.
 */
const shouldToggleClosed = (
  state: LabelsPopoverSharedState,
  props: ToggleLabelPopoverProps,
) => {
  if (!state.isOpen) {
    return false;
  }
  if (!props.triggerElement.isEqualNode(state.triggerElement)) {
    return false;
  }
  if (
    (props.targetElement || state.targetElement) &&
    !props.targetElement?.isEqualNode(state.targetElement ?? null)
  ) {
    return false;
  }
  if (props.idCard !== state.idCard) {
    return false;
  }
  return true;
};

/**
 * Centralized function to open the Labels Popover from anywhere.
 *
 * @example
 * import { toggleLabelsPopover } from 'app/src/components/LabelsPopover';
 *
 * const addLabelButtonRef = useRef<HTMLButtonElement>(null);
 * const onClickAddLabelButton = useCallback(() => {
 *   if (addLabelButtonRef.current) {
 *     toggleLabelsPopover({
 *       idCard,
 *       triggerElement: addLabelButtonRef.current,
 *     });
 *   }
 * }, [idCard]);
 *
 * return (
 *   <Button ref={addLabelButtonRef} onClick={onClickAddLabelButton}>
 *     {format('add-label')}
 *   </Button>
 * );
 */
export const toggleLabelsPopover = (props: ToggleLabelPopoverProps) => {
  LabelsPopoverState.setValue((state) => {
    if (shouldToggleClosed(state, props)) {
      return emptyLabelsPopoverState;
    }
    return {
      ...emptyLabelsPopoverState,
      ...props,
      isOpen: true,
    };
  });
};
