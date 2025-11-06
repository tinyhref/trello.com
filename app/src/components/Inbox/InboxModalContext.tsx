import {
  useCallback,
  useMemo,
  useState,
  type FunctionComponent,
  type PropsWithChildren,
} from 'react';
import { createContext } from 'use-context-selector';

type ModalId = 'archived-cards' | 'free-trial' | 'plan-selection';

/**
 * Context used to manage the visibility of modals in the inbox
 */
export const InboxModalContext = createContext<{
  modalId: ModalId | null;
  showModal: (modalId: ModalId) => void;
  hideModal: () => void;
}>({ modalId: null, showModal: () => {}, hideModal: () => {} });

export const InboxModalContextProvider: FunctionComponent<
  PropsWithChildren
> = ({ children }) => {
  const [modalId, setModalId] = useState<ModalId | null>(null);
  const showModal = useCallback((id: ModalId) => setModalId(id), [setModalId]);
  const hideModal = useCallback(() => setModalId(null), [setModalId]);

  const context = useMemo(
    () => ({
      modalId,
      showModal,
      hideModal,
    }),
    [modalId, showModal, hideModal],
  );

  return (
    <InboxModalContext.Provider value={context}>
      {children}
    </InboxModalContext.Provider>
  );
};
