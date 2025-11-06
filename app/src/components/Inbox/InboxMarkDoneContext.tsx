import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

interface InboxMarkDoneContextValue {
  hasMarkedDone: boolean;
  setHasMarkedDone: (hasMarkedDone: boolean) => void;
}

export const InboxMarkDoneContext = createContext<InboxMarkDoneContextValue>({
  hasMarkedDone: false,
  setHasMarkedDone: () => {},
});

/**
 * Provider component that manages the state of whether a user has recently marked a card as done.
 * This state is used to determine when to show relevant spotlight messages in the inbox.
 *
 * @param props.children - Child components that will have access to the inbox mark done context
 */
export const InboxMarkDoneProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [hasMarkedDone, setHasMarkedDone] = useState(false);
  const value = useMemo(
    () => ({ hasMarkedDone, setHasMarkedDone }),
    [hasMarkedDone, setHasMarkedDone],
  );

  return (
    <InboxMarkDoneContext.Provider value={value}>
      {children}
    </InboxMarkDoneContext.Provider>
  );
};

/**
 * Hook to access the inbox mark done context.
 * Use this hook to check if a user has recently marked a card as done and to update that state.
 *
 * @returns {InboxMarkDoneContextValue} Object containing hasMarkedDone state and setter function
 * @example
 * ```tsx
 * const { hasMarkedDone, setHasMarkedDone } = useInboxMarkDone();
 * ```
 */
export const useInboxMarkDone = () => {
  return useContext(InboxMarkDoneContext);
};
