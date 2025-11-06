import type { ApolloError } from '@apollo/client';
import type {
  AnchorHTMLAttributes,
  MouseEvent as ReactMouseEvent,
} from 'react';
import { createContext } from 'react';

// eslint-disable-next-line no-restricted-imports
import type { PremiumFeatures } from '@trello/graphql/generated';
import type { Organization } from '@trello/model-types';

import type { MultiBoardViewProviderBoardsQuery } from './MultiBoardViewProviderBoardsQuery.generated';
import type { MultiBoardViewProviderCardsQuery } from './MultiBoardViewProviderCardsQuery.generated';
import type { SingleBoardDataQuery } from './SingleBoardDataQuery.generated';

type SingleBoardQueryCard = NonNullable<
  SingleBoardDataQuery['board']
>['cards'][number];
type MultiBoardQueryCard = NonNullable<
  MultiBoardViewProviderCardsQuery['organization']
>['cards']['cards'][number];

/**
 * Represents the type of cards provided by a `BoardViewContext`.
 *
 * This is constructed as the union type of the cards query for single-board
 * views data and the cards query for multi-board views data.
 */
export type ViewCard = (MultiBoardQueryCard | SingleBoardQueryCard) & {
  badges?: SingleBoardQueryCard['badges'];
  checklists?: SingleBoardQueryCard['checklists'];
  mirrorSourceId?: string | null;
};

export type CardWithChecklistDefined = ViewCard & {
  checklists: NonNullable<
    SingleBoardDataQuery['board']
  >['cards'][number]['checklists'];
};

export type Checklist = CardWithChecklistDefined['checklists'][number];

export type ChecklistItem = Checklist['checkItems'][number];

export type SingleBoardViewBoard = Omit<
  NonNullable<SingleBoardDataQuery['board']>,
  'cards'
>;

export type MultiBoardViewBoard = NonNullable<
  MultiBoardViewProviderBoardsQuery['organization']
>['boards'][number];

/**
 * This type includes all fields that are selected in the single-board *and*
 * multi-board queries.
 */
export type ViewBoard = MultiBoardViewBoard | SingleBoardViewBoard;

interface BoardsDataBase {
  /**
   * If `boardsDataContextType` is not defined on the BoardsData object, this
   * will fall back to the union type.
   */
  boards?: ViewBoard[];
  isLoading: boolean;
  error?: ApolloError;
  /**
   * Used to assist syncing between Apollo and Model Cache
   * Do not use unless necessary
   */
  dangerous_refetch: () => void;
}

interface BoardsDataSingleBoard extends BoardsDataBase {
  boardsDataContextType?: 'board';
  /**
   * Should be an singleton array for single-board views, or an array of all
   * boards for multi-board views.
   */
  boards?: SingleBoardViewBoard[];
}

interface BoardsDataMultiBoard extends BoardsDataBase {
  boardsDataContextType?: 'workspace';
  boards?: MultiBoardViewBoard[];
}

/**
 * Board and card data provided to "views" by the Trello Views Architecture.
 * This is the set of shared data that views (both single- and multi-board)
 * consume.
 */
export interface BoardViewContextValue {
  /**
   * Which kind of context this is, can be used to do things conditionally in a
   * consumer based on whether it is single- or multi-board.
   */
  contextType: 'board' | 'workspace';
  boardsData: BoardsDataMultiBoard | BoardsDataSingleBoard;
  cardsData: {
    cards: ViewCard[];
    error?: ApolloError;

    /** Should reflect the Apollo loading state of the query for cards data. */
    isLoading: boolean;

    /**
     * Should be true if a query for cards is being run initial, but false if
     * the query is being re-run due to variables changes, such as filters
     * changing.
     */
    isLoadingInitial: boolean;
    loadMore: () => void;
    /**
     * Allows calendar view to load more cards as a user navigates beyond the currently
     * loaded date range
     */
    setVisibleDateRange?: (dateRane: [Date, Date]) => void;
    canLoadMore: boolean;
    isLoadingMore: boolean;
    total: number;
  };
  organizationData?: {
    error?: ApolloError;
    organization?: {
      id: string;
      name: string;
      offering: string;
      premiumFeatures: PremiumFeatures[];
      billableMemberCount?: number | null;
      teamType?: string | null;
      enterprise?: {
        id?: string;
        idAdmins?: string[];
      };
      credits?: Pick<
        Organization['credits'][number],
        'count' | 'id' | 'type'
      >[];
      paidAccount?: {
        trialExpiration?: string | null;
      } | null;
    };
    isLoading: boolean;
  };
  checklistItemData?: {
    checklistItems: {
      item: ChecklistItem;
      checklist: Checklist;
      card: ViewCard;
    }[];
  };
  navigateToCard: (cardUrl: string) => void;
  getRelativePosition: (idList: string, idCard?: string) => number | undefined;
  onNewCardCreated?: ({ idCard }: { idCard: string }) => void;
  /**
   * Returns props for an anchor tag which will either open the card link in a
   * new tab or open the card back, depending on which view provider the
   * function is called in.
   */
  getLinkToCardProps: ({
    idCard,
    cardUrl,
    onClick,
  }: {
    idCard?: string;
    cardUrl?: string;
    onClick?: (e: ReactMouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  }) => Partial<AnchorHTMLAttributes<HTMLAnchorElement>>;
  idBoard?: string;
  idOrg?: string;
  canEditBoard: (idBoard: string) => boolean;
  isDateBasedView?: boolean;
  showCloseButton?: boolean;
  defaultZoom?: string;
}

export function boardViewContextEmptyValue(): BoardViewContextValue {
  return {
    contextType: 'workspace',
    boardsData: {
      boardsDataContextType: 'workspace',
      boards: undefined,
      isLoading: false,
      error: undefined,
      dangerous_refetch: () => {},
    },
    cardsData: {
      cards: [],
      isLoading: false,
      isLoadingInitial: false,
      loadMore: () => {},
      canLoadMore: false,
      isLoadingMore: false,
      total: 0,
    },
    navigateToCard: () => {},
    getLinkToCardProps: ({ idCard, cardUrl, onClick }) => {
      return {
        href: cardUrl,
        onClick: (e: ReactMouseEvent<HTMLAnchorElement, MouseEvent>) => {
          onClick?.(e);
        },
      };
    },
    canEditBoard: (idBoard: string) => false,
    getRelativePosition: (idList: string, idCard?: string) => undefined,
    isDateBasedView: false,
    showCloseButton: false,
    defaultZoom: undefined,
  };
}

export const BoardViewContext = createContext<BoardViewContextValue>(
  boardViewContextEmptyValue(),
);
