import { isShortLink } from '@trello/id-cache';

import type {
  CardFilterCriteria,
  UrlParams,
} from 'app/src/components/ViewFilters/filters/ViewFilter';
import { SerializableViewFilter } from 'app/src/components/ViewFilters/filters/ViewFilter';

const shortLinksFromUrlParams = (idBoards?: string | null) => {
  return idBoards?.split(',').filter(isShortLink) ?? [];
};

type BoardIdOrShortLink = { id: string } | { shortLink: string };

export interface BoardIdAndShortLink {
  id: string;
  shortLink: string;
}

export class BoardsFilter extends SerializableViewFilter {
  public readonly filterType = 'boards' as const;
  public readonly idBoards: BoardIdOrShortLink[] = [];

  constructor(idBoards: BoardIdOrShortLink[] = []) {
    super();
    this.idBoards = idBoards;
  }

  filterLength(): number {
    return this.getBoardShortLinksOrIds().length;
  }

  isEmpty(): boolean {
    return this.filterLength() === 0;
  }

  private disableBoard(
    boards: BoardIdOrShortLink[],
    { id, shortLink }: BoardIdAndShortLink,
  ): BoardIdOrShortLink[] {
    return boards.filter(
      (board) =>
        !('shortLink' in board && board.shortLink === shortLink) &&
        !('id' in board && board.id === id),
    );
  }

  /**
   * Enforce that any UI calling toggle includes both the id and shortLink so
   * that it can be serialized to either a View or UrlParams
   */
  public toggle(board: BoardIdAndShortLink) {
    const newBoards = this.isEnabled(board)
      ? this.disableBoard(this.idBoards, board)
      : [...this.idBoards, board];
    return new BoardsFilter(newBoards);
  }

  public enable(...boards: BoardIdAndShortLink[]) {
    const copy = new BoardsFilter(this.idBoards);
    boards.forEach((board) => {
      if (!copy.isEnabled(board)) {
        copy.idBoards.push(board);
      }
    });
    return copy;
  }

  public disable(...boards: BoardIdAndShortLink[]) {
    let newBoards = this.idBoards;
    boards.forEach((board) => {
      newBoards = this.disableBoard(newBoards, board);
    });
    return new BoardsFilter(newBoards);
  }

  /**
   * Return either shortLinks or Ids, since we may have only one or the other
   * after deserializing from a View or UrlParams. (Most call sites will just
   * pass this result into a graphql query, which will accept shortLinks or ids)
   */
  getBoardShortLinksOrIds(): string[] {
    return this.idBoards.map((board) => {
      if ('shortLink' in board) {
        return board.shortLink;
      } else {
        return board.id;
      }
    });
  }

  isEnabled({ id, shortLink }: Partial<BoardIdAndShortLink>): boolean {
    return !!this.getBoardShortLinksOrIds().find(
      (shortLinkOrId) => id === shortLinkOrId || shortLink === shortLinkOrId,
    );
  }

  toUrlParams(): {
    idBoards: string | null;
  } {
    return {
      // URL params incorrectly refer to shortLinks as ids
      idBoards:
        this.idBoards
          .filter(
            (board): board is { shortLink: string } => 'shortLink' in board,
          )
          .map((board) => board.shortLink)
          .join(',') || null,
    };
  }

  static fromUrlParams(urlParams: UrlParams): BoardsFilter {
    return new BoardsFilter(
      shortLinksFromUrlParams(urlParams.idBoards).map((shortLink) => ({
        shortLink,
      })),
    );
  }

  toCardFilterCriteria() {
    return {
      idBoards: this.idBoards
        .filter((board): board is { id: string } => 'id' in board)
        .map((board) => board.id),
    };
  }

  static fromCardFilterCriteria(
    cardFilterCriteria: CardFilterCriteria,
  ): BoardsFilter {
    return new BoardsFilter(
      (cardFilterCriteria.idBoards || []).map((id) => ({ id })),
    );
  }
}
