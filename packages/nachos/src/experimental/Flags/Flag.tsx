import cx from 'classnames';
import type { MouseEventHandler } from 'react';
import { useCallback, useEffect, useRef } from 'react';

import CloseIcon from '@atlaskit/icon/core/cross';
import { intl } from '@trello/i18n';
import { Tooltip } from '@trello/nachos/tooltip';

import { FlagActions } from './FlagActions';
import { useFlagGroup } from './FlagGroup';
import type { ActionsType, FlagProps } from './types';

import * as styles from './Flag.module.less';

function noop() {}
const emptyActions: ActionsType = [];

export const Flag = (props: FlagProps) => {
  const {
    actions = emptyActions,
    icon,
    title,
    truncateDescription,
    description,
    isUndismissable,
    onManualDismiss = noop,
    onMouseOver,
    onFocus = noop,
    onMouseOut,
    onBlur = noop,
    testId,
    id,
    seed,
    shouldFocusDismissButton = false,
  } = props;

  const dismissButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (shouldFocusDismissButton && dismissButtonRef.current) {
      dismissButtonRef.current.focus();
    }
  }, [shouldFocusDismissButton]);

  const { onDismissed = noop, dismissAllowed } = useFlagGroup();
  const isDismissAllowed = !isUndismissable && dismissAllowed(id, seed);

  const renderDismissButton = () => {
    // Ensure onDismissed is defined and isDismissAllowed is true to render
    // the dismiss button
    if (!isDismissAllowed) {
      return null;
    }

    return (
      <Tooltip
        isScreenReaderAnnouncementDisabled={true}
        content={intl.formatMessage({
          id: 'templates.nachos.dismiss-flag',
          defaultMessage: 'Dismiss flag',
          description: 'Dismiss flag',
        })}
      >
        <button
          className={styles.dismissButton}
          onClick={() => {
            if (isDismissAllowed) {
              onDismissed({ id, seed, dismissedVia: 'click' });
              onManualDismiss(id, seed);
            }
          }}
          data-testid={testId && `${testId}-dismiss`}
          type="button"
          ref={dismissButtonRef}
        >
          <CloseIcon label="" size="small" />
        </button>
      </Tooltip>
    );
  };

  // We prevent default on mouse down to avoid focus ring when the flag is clicked,
  // while still allowing it to be focused with the keyboard.
  const handleMouseDown: MouseEventHandler<HTMLElement> = useCallback((e) => {
    e.preventDefault();
  }, []);

  const autoDismissProps = {
    onMouseOver,
    onFocus,
    onMouseOut,
    onBlur,
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      className={styles.flag}
      role="alert"
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      onMouseDown={handleMouseDown}
      data-testid={testId}
      {...autoDismissProps}
    >
      <div className={styles.header}>
        <span className={styles.icon}>{icon}</span>
        <span className={styles.title}>{title}</span>
        {renderDismissButton()}
      </div>
      <div
        className={description ? styles.descriptionExpander : styles.expander}
      >
        {description && (
          <div
            className={cx(styles.description, {
              [styles.truncateDescription]: truncateDescription,
            })}
            data-testid={testId && `${testId}-description`}
          >
            {description}
          </div>
        )}
        <FlagActions actions={actions} testId={testId} />
      </div>
    </div>
  );
};
