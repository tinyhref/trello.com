import classNames from 'classnames';
import type {
  ChangeEventHandler,
  ComponentType,
  EventHandler,
  ForwardRefRenderFunction,
  FunctionComponent,
  PropsWithChildren,
  PropsWithoutRef,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  RefAttributes,
} from 'react';
import { forwardRef } from 'react';

import { useFocusRing } from '@trello/a11y';
import { CheckIcon } from '@trello/nachos/icons/check';
import { RouterLink } from '@trello/router/router-link';
import type { TestId } from '@trello/test-ids';
import { token } from '@trello/theme';

import * as styles from './PopoverMenu.module.less';

type ForwardedComponent<T, TProps> = ComponentType<
  PropsWithoutRef<TProps> & RefAttributes<T>
>;

const forwardRefComponent = <T, TProps>(
  displayName: string,
  fn: ForwardRefRenderFunction<T, PropsWithoutRef<TProps>>,
): ForwardedComponent<T, TProps> => {
  fn.displayName = displayName;

  return forwardRef<T, TProps>(fn);
};

interface ContentProps {
  description?: ReactNode;
  rawDescription?: string;
  title?: ReactNode;
  iconBefore?: JSX.Element;
  iconAfter?: JSX.Element;
}

export interface PopoverMenuButtonProps extends ContentProps {
  onClick: EventHandler<ReactMouseEvent<HTMLButtonElement>>;
  ariaOwns?: string;
  className?: string;
  disabled?: boolean;
  testId?: TestId;
}

interface PopoverMenuRadioProps extends ContentProps {
  onChange: ChangeEventHandler<HTMLInputElement>;
  name: string;
  value: string;
  disabled?: boolean;
  defaultChecked?: boolean;
  testId?: TestId;
}

interface PopoverMenuLinkProps extends ContentProps {
  href: string;
  target?: string;
  onClick?: EventHandler<ReactMouseEvent<HTMLAnchorElement>>;
  testId?: TestId;
  className?: string;
  icon?: JSX.Element;
  external?: boolean;
  download?: string;
}

export const PopoverMenuItemSeparator: FunctionComponent<{
  fullWidth?: boolean;
  className?: string;
  ariaHidden?: boolean;
}> = ({ fullWidth, ariaHidden, className }) => (
  <li
    className={classNames(
      {
        [styles.separator]: true,
        [styles['separator--fullWidth']]: fullWidth,
      },
      className,
    )}
    aria-hidden={ariaHidden}
  ></li>
);

const PopoverMenuItemContents: FunctionComponent<
  PropsWithChildren<ContentProps>
> = ({
  children,
  description,
  rawDescription,
  title,
  iconBefore,
  iconAfter,
}) => (
  <>
    <span
      className={classNames({
        [styles.item]: true,
        [styles.withoutMargins]: !!description,
      })}
    >
      <span className={styles.title}>
        {iconBefore && <span className={styles.iconBefore}>{iconBefore}</span>}
        {title || children}
      </span>
      {iconAfter && <span className={styles.iconAfter}>{iconAfter}</span>}
    </span>
    {(description || rawDescription) && (
      <div className={styles.description}>
        {description ? description : rawDescription}
      </div>
    )}
  </>
);

export const PopoverMenuLink: FunctionComponent<
  PropsWithChildren<PopoverMenuLinkProps>
> = ({
  testId,
  href,
  target,
  className,
  onClick,
  external = false,
  download,
  ...contentProps
}) => {
  const [hasFocusRing, mouseEvents] = useFocusRing();
  const LinkComponent = external ? 'a' : RouterLink;
  const linkComponentProps = {
    href,
    onClick,
    target,
    download,
    ...(LinkComponent === RouterLink ? { testId } : { 'data-testid': testId }),
  };

  return (
    <li>
      <LinkComponent
        className={classNames(
          styles.link,
          className,
          hasFocusRing && styles.linkFocusRing,
        )}
        {...linkComponentProps}
        {...mouseEvents}
      >
        <PopoverMenuItemContents {...contentProps} />
      </LinkComponent>
    </li>
  );
};

export const PopoverMenuButton = forwardRefComponent<
  HTMLButtonElement,
  PropsWithChildren<PopoverMenuButtonProps>
>(
  'PopoverMenuButton',
  (
    {
      onClick,
      children,
      className,
      disabled,
      testId,
      title,
      description,
      rawDescription,
      iconBefore,
      iconAfter,
      ariaOwns,
      ...props
    }: PropsWithChildren<PopoverMenuButtonProps>,
    ref,
  ) => {
    const [hasFocusRing, mouseEvents] = useFocusRing();

    return (
      <li>
        <button
          className={classNames(
            styles.link,
            hasFocusRing && styles.linkFocusRing,
            className,
          )}
          disabled={disabled}
          onClick={onClick}
          data-testid={testId}
          ref={ref}
          {...props}
          {...mouseEvents}
          aria-owns={ariaOwns}
        >
          <PopoverMenuItemContents
            {...{
              title,
              description,
              rawDescription,
              iconBefore,
              iconAfter,
            }}
          >
            {children}
          </PopoverMenuItemContents>
        </button>
      </li>
    );
  },
);

export const PopoverMenuRadio = forwardRefComponent<
  HTMLLabelElement,
  PropsWithChildren<PopoverMenuRadioProps>
>(
  'PopoverMenuRadio',
  (
    {
      onChange,
      defaultChecked,
      value,
      disabled,
      testId,
      name,
      ...contentProps
    },
    ref,
  ) => (
    <li>
      <label
        className={classNames(styles.radio, disabled && styles.disabled)}
        ref={ref}
      >
        <div className={styles.checkmark}>
          <input
            type="radio"
            name={name}
            data-testid={testId}
            defaultChecked={defaultChecked}
            disabled={disabled}
            value={value}
            onChange={onChange}
            className={styles.input}
          />
          <span className={styles.icon}>
            <CheckIcon
              size="small"
              color={
                disabled
                  ? token('color.text.disabled', '#091E424F')
                  : token('color.text', '#172B4D')
              }
            />
          </span>
        </div>
        <div className={styles.content}>
          <PopoverMenuItemContents {...contentProps} />
        </div>
      </label>
    </li>
  ),
);

interface PopoverMenuProps {
  className?: string;
  testId?: TestId;
  ariaLabelledBy?: string;
  id?: string;
}

export const PopoverMenu: FunctionComponent<
  PropsWithChildren<PopoverMenuProps>
> = ({ className, children, testId, ariaLabelledBy, id }) => (
  <div id={id} className={classNames(styles.popoverMenu, className)}>
    <ul data-testid={testId} aria-labelledby={ariaLabelledBy}>
      {children}
    </ul>
  </div>
);
