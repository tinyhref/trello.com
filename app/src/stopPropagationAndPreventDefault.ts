import type {
  FormEvent,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
} from 'react';

export function stopPropagationAndPreventDefault(
  e:
    | Event
    | FormEvent
    | JQuery.TriggeredEvent
    | ReactKeyboardEvent
    | ReactMouseEvent,
) {
  e?.stopPropagation();
  e?.preventDefault();
}
