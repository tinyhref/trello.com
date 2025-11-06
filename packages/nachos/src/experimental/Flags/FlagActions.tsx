// Lifted directly from @atlaskit/flag.

import { Button } from '@trello/nachos/button';

import type { ActionsType, ActionType } from './types';

import * as styles from './Flag.module.less';

interface Props {
  actions: ActionsType;
  testId?: string;
}

const defaultActions: ActionsType = [];

export const FlagActions = (props: Props) => {
  const { actions = defaultActions, testId } = props;
  if (!actions.length) {
    return null;
  }

  const isLink = (action: ActionType): boolean => action.type === 'link';

  const renderSeparator = (index: number) => {
    if (index === 0) {
      return null;
    }
    return (
      <div className={styles.actionSeparator} key={index + 0.5}>
        {isLink(actions[index - 1]) && isLink(actions[index]) ? '·' : ''}
      </div>
    );
  };

  return (
    <div className={styles.actions} data-testid={testId && `${testId}-actions`}>
      {actions.map((action, index) => [
        renderSeparator(index),
        isLink(action) ? (
          <a
            className={styles.actionLink}
            onClick={action.onClick}
            href={action.href}
            target={action.target}
            key={action.content?.toString()}
          >
            {action.content}
          </a>
        ) : (
          <Button onClick={action.onClick} key={action.content?.toString()}>
            {action.content}
          </Button>
        ),
      ])}
    </div>
  );
};
