import { useFocusRing } from '@react-aria/focus';
import classNames from 'classnames';
import type {
  FocusEventHandler,
  HTMLAttributes,
  MouseEventHandler,
  MouseEvent as ReactMouseEvent,
  ReactNode,
} from 'react';
import { Children, cloneElement, forwardRef, useCallback } from 'react';

import Spinner from '@atlaskit/spinner';
import { IconDarkColor } from '@trello/nachos/tokens';
import { navigate } from '@trello/router/navigate';
import { navigationState } from '@trello/router/router-link';
import type { TestId } from '@trello/test-ids';
import { token } from '@trello/theme';

import { makeComponentClasses } from '../makeComponentClasses';

import * as styles from './Button.module.less';

const toCamelCase = (str: string) =>
  str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());

type ButtonAppearances =
  | 'danger'
  | 'default'
  | 'discovery'
  // deprecated
  | 'icon'
  | 'link'
  | 'primary'
  | 'subtle-link'
  | 'subtle';

export interface ButtonProps extends HTMLAttributes<HTMLElement> {
  /** The visible appearance of a button.
   *
   * @default 'default'
   */
  appearance?: ButtonAppearances;
  /** A string of classnames to be applied
   *
   */
  className?: string;
  /**
   * The content of the button.
   * @default null
   */
  children?: ReactNode;
  /** A function to fire when the element is clicked
   *
   */
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  /** An icon to render after the button content
   *
   */
  iconAfter?: JSX.Element;
  /** An icon to render before the button content.
   * If this prop is provided with no other children, the
   * icon will be styled as if it is a square "Icon Button"
   *
   */
  iconBefore?: JSX.Element;
  /**
   * If `true`, the loading state is activated. This renders a Spinner component inside the button.
   * Click events to the button are disabled at this time, but the button does
   * not appear disabled. Since the button's width may change when the spinner is
   * rendered, it is recommended to add a `min-width` property to
   * prevent drastic changes in appearance.
   * @default false
   */
  isLoading?: boolean;
  /**
   * If `true`, the button will be disabled.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * If `true`, the button will have active styling.
   * @default false
   */
  isSelected?: boolean;
  /**
   * This name attribute is needed separately since we are generalizing this component to support both anchor and button elements
   */
  name?: string;
  type?: 'button' | 'reset' | 'submit';
  /**
   * If `true`, the button will take up the full width of its container.
   * @default false
   */
  shouldFitContainer?: boolean;
  /**
   * The size of the button.
   * @default '"default"'
   */
  size?: 'default' | 'fullwidth' | 'wide';
  /**
   * A string to help identify the component during integration tests.
   */
  testId?: TestId;
  /**
   * A string that, when supplied, will be used as the `href` attribute for an `a` tag
   */
  href?: string;
  /**
   * If true, the link will trigger client-side navigation
   */
  isRouterLink?: boolean;
  /**
   * If supplied, this will be used for the `target` attribute of the `a` tag
   */
  linkTarget?: '_blank' | '_parent' | '_self' | '_top';
  /**
   * If supplied, this will be used for the `rel` attribute of the `a` tag
   */
  linkRel?: string;
  /**
   * Used to specify that the target will be downloaded when a user clicks on the link
   */
  download?: string;
}

export const Button = forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  ButtonProps
>(
  (
    {
      children,
      onClick,
      onKeyUp,
      className,
      appearance = 'default',
      size = 'default',
      testId,
      iconAfter,
      iconBefore,
      isLoading,
      isDisabled,
      isSelected,
      shouldFitContainer,
      // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button
      // the default behavior is actually "submit", but we are retaining this
      // behavior from the previous component. This is something to revisit if
      // we want this component to be analogous to the native html <button>
      // AtlasKit Button also has similar behavior
      type = 'button',
      onFocus,
      onBlur,
      href,
      isRouterLink,
      linkTarget,
      linkRel,
      download,
      ...additionalAttrs
    },
    ref,
  ) => {
    const { isFocusVisible, focusProps } = useFocusRing();

    const hasColoredBackground =
      appearance === 'primary' || appearance === 'danger';

    const focusHandler: FocusEventHandler<HTMLElement> = useCallback(
      (e) => {
        focusProps.onFocus?.(e);
        onFocus?.(e);
      },
      [focusProps, onFocus],
    );

    const blurHandler: FocusEventHandler<HTMLElement> = useCallback(
      (e) => {
        focusProps.onBlur?.(e);
        onBlur?.(e);
      },
      [focusProps, onBlur],
    );

    const linkClickHandler: MouseEventHandler<HTMLAnchorElement> = useCallback(
      (e) => {
        if (isDisabled) {
          e.preventDefault();
          return;
        }
        if (isRouterLink && href) {
          // If the Cmd or Control key is pressed during the click, or in safari, this is
          // a middle-click, honor the event and bypass the router
          const isMetaClick =
            e.ctrlKey || e.metaKey || (e.button && e.button !== 0);
          // If the target is set to a new window, honor the event and bypass the
          // router
          const isTargetBlank = linkTarget === '_blank';

          onClick?.(e as ReactMouseEvent<HTMLAnchorElement>);

          if (!e.defaultPrevented && !isMetaClick && !isTargetBlank) {
            e.preventDefault();
            // We only update navigation state if there is a URL and the URL is
            // different to the current location. If we update navigation state and
            // the destination is the same, then the loading icon in the header will
            // begin spinning and never stop.
            const relativeLink = href?.replace(window.location.origin, '');
            const isDifferentUrl =
              relativeLink !==
              window.location.href.replace(window.location.origin, '');
            if (relativeLink && isDifferentUrl) {
              navigationState.setValue({
                isNavigating: true,
              });
            }

            try {
              navigate(relativeLink, {
                trigger: true,
              });
            } catch (err) {
              // can't pushState an external link, so it's easier to let it fail and use window.location
              window.location.href = href as string;
            }
          }
          return;
        }
        onClick?.(e);
      },
      [isDisabled, isRouterLink, href, onClick, linkTarget],
    );

    if (shouldFitContainer) {
      size = 'fullwidth';
    }

    let buttonContent = children;

    // if the button has children but they are conditionally rendered (boolean && <Component />)
    // children can be an array of [false, false] effectively meaning the Button has no children
    // eslint-disable-next-line @eslint-react/no-children-to-array
    const hasContent = !!Children.toArray(children).length;

    if (iconAfter || iconBefore) {
      const defaultIconColor = token(
        'color.text.accent.gray.bolder',
        IconDarkColor,
      );
      buttonContent = (
        <>
          {iconBefore &&
            // eslint-disable-next-line @eslint-react/no-clone-element
            cloneElement(iconBefore, {
              color: iconBefore.props.color || defaultIconColor,
              ...(typeof iconBefore.type !== 'string'
                ? {
                    dangerous_className: classNames(
                      {
                        [styles.iconOnly]: !hasContent,
                        [styles.iconBefore]: hasContent,
                      },
                      iconBefore.props.dangerous_className,
                    ),
                  }
                : {
                    className: classNames(
                      {
                        [styles.iconOnly]: !hasContent,
                        [styles.iconBefore]: hasContent,
                      },
                      iconBefore.props.className,
                    ),
                  }),
            })}
          {children}
          {iconAfter &&
            // eslint-disable-next-line @eslint-react/no-clone-element
            cloneElement(iconAfter, {
              color: iconAfter.props.color || defaultIconColor,
              ...(typeof iconAfter.type !== 'string'
                ? {
                    dangerous_className: classNames(
                      styles.iconAfter,
                      iconAfter.props.dangerous_className,
                    ),
                  }
                : {
                    className: classNames(
                      styles.iconAfter,
                      iconAfter.props.className,
                    ),
                  }),
            })}
        </>
      );
    }

    const { componentCx: buttonCx } = makeComponentClasses(Button.displayName!);

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={linkTarget}
          rel={linkRel}
          download={download}
          className={classNames(
            className,
            styles[buttonCx()],
            styles[buttonCx('', toCamelCase(appearance))],
            styles[buttonCx('', size)],
            {
              [styles[buttonCx('', 'loading')]]: isLoading,
              [styles[buttonCx('', 'disabled')]]: isDisabled,
              [styles[buttonCx('', 'selected')]]: isSelected,
              [styles[buttonCx('iconButton')]]: iconBefore && !children,
              [styles.focusVisible]: isFocusVisible,
              // Due to TRELP ticket (https://trello.atlassian.net/browse/TRELP-4685)
              // this css class serves as a flag to separate react component less logic from exported general styles
              [styles[buttonCx('isReactButtonComponent')]]: true,
            },
          )}
          onClick={linkClickHandler}
          type={type}
          onFocus={focusHandler}
          onBlur={blurHandler}
          data-testid={testId}
          {...additionalAttrs}
        >
          {isLoading ? (
            <Spinner appearance={hasColoredBackground ? 'invert' : 'inherit'} />
          ) : (
            buttonContent
          )}
        </a>
      );
    }
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        disabled={isDisabled}
        className={classNames(
          className,
          styles[buttonCx()],
          styles[buttonCx('', toCamelCase(appearance))],
          styles[buttonCx('', size)],
          {
            [styles[buttonCx('', 'loading')]]: isLoading,
            [styles[buttonCx('', 'disabled')]]: isDisabled,
            [styles[buttonCx('', 'selected')]]: isSelected,
            [styles[buttonCx('iconButton')]]: iconBefore && !children,
            [styles.focusVisible]: isFocusVisible,
            // Due to TRELP ticket (https://trello.atlassian.net/browse/TRELP-4685)
            // this css class serves as a flag to separate react component less logic from exported general styles
            [styles[buttonCx('isReactButtonComponent')]]: true,
          },
        )}
        onClick={onClick}
        type={type}
        onFocus={focusHandler}
        onBlur={blurHandler}
        data-testid={testId}
        {...additionalAttrs}
      >
        {isLoading ? (
          <Spinner
            appearance={
              isDisabled
                ? 'inherit'
                : hasColoredBackground
                  ? 'invert'
                  : 'inherit'
            }
          />
        ) : (
          buttonContent
        )}
      </button>
    );
  },
);
Button.displayName = 'Button';
