import cx from 'classnames';
import type { TextareaHTMLAttributes } from 'react';
import { cloneElement, forwardRef } from 'react';

import type { TestId } from '@trello/test-ids';
import { token } from '@trello/theme';

import { makeComponentClasses } from '../makeComponentClasses';

import * as styles from './Textfield.module.less';

type TextfieldAppearance =
  | 'borderless' // input has no border when idle or hovered, but shows the default border when focused
  | 'default'
  | 'subtle'; // input appears without border, bg, etc. but still functional

type TextfieldType = 'number' | 'text';

export interface TextfieldProps
  extends Omit<
    TextareaHTMLAttributes<HTMLInputElement>,
    'disabled' | 'invalid' | 'label' | 'readonly' | 'required'
  > {
  /**
   * A string of classnames to be applied
   *
   * @default ''
   **/
  className?: string;
  /**
   * Determines the appearance of the text field
   * @default default
   */
  appearance?: TextfieldAppearance;
  /**
   * The width of the textfield.
   * @default null
   */
  width?: number | string;
  /**
   * Sets the field as uneditable, with a changed hover state.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Sets styling to indicate that the input is invalid
   * @default false
   */
  isInvalid?: boolean;
  /**
   * If true, prevents the value of the input from being edited.
   * @default false
   */
  isReadOnly?: boolean;
  /**
   * Set required for form that the field is part of.
   * @default false
   */
  isRequired?: boolean;
  /**
   * Icon rendered at the end of the input (inside textfield).
   * @default null
   */
  iconAfter?: JSX.Element;
  /**
   * Icon rendered at the beginning of the input (inside textfield).
   * @default null
   */
  iconBefore?: JSX.Element;
  /**
   * A string or component that describes the input rendered inside a <label> tag
   * @default null
   */
  label?: JSX.Element | string | null;
  /**
   * A number that sets the lower limit of a number type textfield
   * @default null
   */
  min?: number;
  /**
   * A string that appears inside input if no text is there
   * @default null
   */
  placeholder?: string;
  /**
   * A string to help identify the component during integration tests.
   */
  testId?: TestId;
  /**
   * The HTML input type for this field
   * @default 'text'
   */
  type?: TextfieldType;
  /**
   * Affects the height of the input control. This prop is intended to mirror
   * the spacing prop of the Select control, which itself mirrors the prop with
   * the same name in AKSelect: https://atlassian.design/components/select/code
   * @default default
   */
  spacing?: 'compact' | 'default';
}

export const Textfield = forwardRef<HTMLInputElement, TextfieldProps>(
  (props: TextfieldProps, ref) => {
    const {
      appearance,
      className,
      label: labelContent,
      iconAfter,
      iconBefore,
      id,
      isDisabled,
      isInvalid,
      isRequired,
      isReadOnly,
      min,
      placeholder,
      width,
      testId,
      type = 'text',
      spacing = 'default',
      ...htmlProps
    } = props;

    const { componentCx: textfieldCx } = makeComponentClasses(
      Textfield.displayName!,
    );

    const hasIcon = iconAfter || iconBefore;

    let inputComponent = (
      <input
        className={cx(
          textfieldCx('input'),
          styles[textfieldCx('input')],
          styles[textfieldCx('input', appearance)],
          {
            [styles[textfieldCx('input', spacing)]]: spacing !== 'default',
            [styles[textfieldCx('input', 'invalid')]]: isInvalid,
            [styles[textfieldCx('input', 'withIconBefore')]]: iconBefore,
            [styles[textfieldCx('input', 'withIconAfter')]]: iconAfter,
          },
        )}
        type={type}
        id={id}
        ref={ref}
        min={min}
        disabled={isDisabled}
        required={isRequired}
        placeholder={placeholder}
        readOnly={isReadOnly}
        data-testid={testId}
        aria-invalid={isInvalid}
        aria-required={isRequired}
        aria-placeholder={placeholder}
        {...htmlProps}
      />
    );

    if (hasIcon) {
      const defaultIconColor = token(
        'color.text.accent.gray.bolder',
        '#091E42',
      );
      inputComponent = (
        <div className={styles[textfieldCx('iconContainer')]}>
          {iconBefore &&
            // eslint-disable-next-line @eslint-react/no-clone-element
            cloneElement(iconBefore, {
              color: iconBefore.props.color || defaultIconColor,
              dangerous_className: cx(
                styles[textfieldCx('icon', 'before')],
                iconBefore.props.dangerous_className,
              ),
            })}
          {inputComponent}
          {iconAfter &&
            // eslint-disable-next-line @eslint-react/no-clone-element
            cloneElement(iconAfter, {
              color: iconAfter.props.color || defaultIconColor,
              dangerous_className: cx(
                styles[textfieldCx('icon', 'after')],
                iconAfter.props.dangerous_className,
              ),
            })}
        </div>
      );
    }

    const inputWithLabel: JSX.Element | null | undefined = (
      <label className={cx(styles[textfieldCx('label')])} htmlFor={id}>
        <div>
          {labelContent}

          {isRequired && typeof labelContent === 'string' && (
            <span className={cx(styles[textfieldCx('requiredMarker')])}>*</span>
          )}
        </div>

        {inputComponent}
      </label>
    );

    const extraProps: { style?: { maxWidth?: number | string } } = {};

    if (width) {
      extraProps.style = {
        maxWidth: width,
      };
    }

    return (
      <div className={cx(styles[textfieldCx()], className)} {...extraProps}>
        {labelContent ? inputWithLabel : inputComponent}
      </div>
    );
  },
);
Textfield.displayName = 'Textfield';
