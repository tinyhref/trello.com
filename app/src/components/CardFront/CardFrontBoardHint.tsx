import { type FunctionComponent } from 'react';

import { smallestPreview } from '@trello/image-previews';
import type { CardFrontTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { useCardFrontBoardHintFragment } from './CardFrontBoardHintFragment.generated';

import * as styles from './CardFrontBoardHint.module.less';

interface CardFrontBoardHintUnconnectedProps {
  backgroundColor?: string | null;
  backgroundUrl?: string;
}

/**
 * Expose the board hint as an unconnected component for consumers to be able to
 * reuse styles with custom images or colors; for example, for mirror cards that
 * the user does not have access to, we want to show an error color.
 */
export const CardFrontBoardHintUnconnected: FunctionComponent<
  CardFrontBoardHintUnconnectedProps
> = ({ backgroundColor, backgroundUrl }) => {
  if (backgroundUrl) {
    return (
      <img
        className={styles.boardHint}
        src={backgroundUrl}
        alt=""
        data-testid={getTestId<CardFrontTestIds>('card-front-board-hint')}
      />
    );
  }

  if (backgroundColor) {
    return (
      <div
        className={styles.boardHint}
        style={{ backgroundColor }}
        data-testid={getTestId<CardFrontTestIds>('card-front-board-hint')}
      />
    );
  }

  return null;
};

interface CardFrontBoardHintProps {
  /**
   * Because mirror cards need to disambiguate between source board ID and
   * mirror board ID, accept board ID as a prop instead of reading from context.
   */
  boardId: string;
}

export const CardFrontBoardHint: FunctionComponent<CardFrontBoardHintProps> = ({
  boardId,
}) => {
  const { data } = useCardFrontBoardHintFragment({
    from: { id: boardId },
  });

  const backgroundColor = data?.prefs?.backgroundColor;

  // some old boards have not gone through image scaling,
  // so <board response>.prefs.backgroundImageScaled === null
  const { url: backgroundUrl } = smallestPreview(
    data?.prefs?.backgroundImageScaled,
  ) ?? { url: data?.prefs?.backgroundImage || undefined };

  return (
    <CardFrontBoardHintUnconnected
      backgroundColor={backgroundColor}
      backgroundUrl={backgroundUrl}
    />
  );
};
