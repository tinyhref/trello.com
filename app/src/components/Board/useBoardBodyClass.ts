import { useEffect } from 'react';

const BOARD_BODY_CLASSNAME = 'body-board-view';

export function useBoardBodyClass({ removeIf }: { removeIf?: () => boolean }) {
  useEffect(() => {
    const rootElement = document.getElementById('trello-root');

    if (!rootElement) {
      throw new Error('Could not find element with ID "trello-root".');
    }

    if (removeIf?.() === true) {
      rootElement.classList.remove(BOARD_BODY_CLASSNAME);
    } else {
      rootElement.classList.add(BOARD_BODY_CLASSNAME);
    }
    return () => {
      rootElement?.classList.remove(BOARD_BODY_CLASSNAME);
    };
  }, [removeIf]);
}
