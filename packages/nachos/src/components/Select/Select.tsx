import cx from 'classnames';
import type { PropsWithChildren, ReactNode } from 'react';
import { useCallback, useMemo, useRef } from 'react';

import type { OptionProps, SelectProps } from '@atlaskit/select';
import AtlaskitSelect, { components } from '@atlaskit/select';
import { useCallbackRef } from '@trello/dom-hooks';
import { ELEVATION_ATTR, useCurrentElevation } from '@trello/layer-manager';
import type { TestId } from '@trello/test-ids';
import { TEST_ID_ATTR } from '@trello/test-ids';

import { ListCell } from '../List';

import * as styles from './Select.module.less';

interface OptionObject<TValue = number | string, TLabel = string> {
  value: TValue;
  label: TLabel;
  testId?: TestId;
  image?: ReactNode | string;
  meta?: ReactNode | string;
  isDisabled?: boolean;
}

const Option = <
  TCustomOptionProps extends OptionObject<
    TCustomOptionProps['value'],
    TCustomOptionProps['label']
  > = { label: string; value: string },
  TIsMulti extends boolean = false,
>(
  props: OptionProps<TCustomOptionProps, TIsMulti>,
) => {
  const {
    isSelected,
    isDisabled,
    data: { label, meta, image, testId },
  } = props;

  const optionClassNames = cx({
    [styles.option]: true,
    [styles.disabled]: isDisabled,
    [styles.noPadding]: meta || image,
  });

  return (
    <div {...{ [TEST_ID_ATTR]: testId }}>
      <components.Option
        // eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides
        className={optionClassNames}
        {...props}
      >
        {!meta && !image ? (
          <li>{label as string}</li>
        ) : (
          <ListCell
            label={label as string}
            meta={meta}
            image={image}
            isSelected={isSelected}
          />
        )}
      </components.Option>
    </div>
  );
};

const Menu: typeof components.Menu = (props) => {
  // Here we pluck the menuElevation off the selectProps, so we can increment
  // the elevation of the menu relative to the select control
  const menuElevation = props?.selectProps?.menuElevation ?? 0;
  return (
    <ul {...{ [ELEVATION_ATTR]: menuElevation }} className={styles.menu}>
      <components.Menu {...props} />
    </ul>
  );
};

const Control: typeof components.Control = (props) => {
  // in order to make the data-testid attribute available for testing,
  // we pass the value to <Select /> then pass the value from selectProps (from
  // @atlaskit/select)
  const testId = props?.selectProps?.testId ?? null;

  return (
    <div {...{ [TEST_ID_ATTR]: testId }}>
      <components.Control
        // eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides
        className={styles.control}
        {...props}
      />
    </div>
  );
};

export function Select<
  TCustomSelectProps extends OptionObject<
    TCustomSelectProps['value'],
    TCustomSelectProps['label']
  > = { label: string; value: string },
  TIsMulti extends boolean = false,
>({
  className,
  containerClassName,
  defaultValue,
  value,
  options,
  testId,
  isSearchable = false,
  scrollIntoViewSelectedOption = true,
  // since we have some complex layer management with the react select
  // and popovers, setting this to the default prop prevents the select
  // menu from automatically pushing down the viewport
  // when the window is too small
  menuPosition = 'fixed',
  components: componentsFromProps,
  ...props
}: PropsWithChildren<SelectProps<TCustomSelectProps, TIsMulti>>) {
  const selectRef =
    useRef<typeof AtlaskitSelect<TCustomSelectProps, TIsMulti>>(null);

  // Calculate the elevation of the menu, based on the elevation of the select
  // control
  const [selectWrapper, selectWrapperRef] = useCallbackRef<HTMLDivElement>();
  const currentElevation = useCurrentElevation(selectWrapper);
  const menuElevation = currentElevation + 1;

  // if options are an array of strings,
  // map strings to objects
  // @ts-expect-error
  const mappedOptions: TCustomSelectProps[] = useMemo(() => {
    if (!options) {
      return [];
    }

    return options.map((val) => {
      if (typeof val === 'string') {
        return {
          value: val,
          label: val,
        };
      }
      return val;
    });
  }, [options]);

  let selectVal = value;
  // if value is a string, map string to object
  if (typeof value === 'string') {
    selectVal = {
      // @ts-expect-error
      value,
      label: value,
    };
  }

  let selectDefaultVal = defaultValue;
  // if value is a string, map string to object
  if (typeof defaultValue === 'string') {
    selectDefaultVal = {
      // @ts-expect-error
      value: defaultValue,
      label: defaultValue,
    };
  }

  const filterOption = useCallback(
    (option: OptionObject, inputValue: string) => {
      const input = inputValue ? inputValue.toLowerCase() : '';
      if (option.label.toLowerCase().includes(input)) {
        return true;
      }

      // Check if the search string matches a group label.
      const matchedGroups =
        mappedOptions?.filter((group) =>
          (group.label as string)?.toLowerCase().includes(input),
        ) ?? [];

      // If the search string matched the label for any groups, we need to
      // iterate over those groups and see if the current option is in the
      // group and if so, return true so it will be in the filtered list.
      for (const matchedGroup of matchedGroups) {
        // Note: The `options` prop doesn't appear to be typed correctly to
        // handle groups of options.
        // @ts-expect-error
        const match = matchedGroup.options?.find(
          (opt: OptionObject) => opt.value === option.value,
        );
        if (match) {
          return true;
        }
      }

      return false;
    },
    [mappedOptions],
  );

  return (
    <div ref={selectWrapperRef} className={containerClassName}>
      <AtlaskitSelect<TCustomSelectProps, TIsMulti>
        ref={selectRef}
        value={selectVal}
        defaultValue={selectDefaultVal}
        options={mappedOptions}
        isOptionDisabled={(option) => !!option.isDisabled}
        menuPortalTarget={document.body}
        menuPosition={menuPosition}
        isSearchable={isSearchable}
        components={{
          Control,
          Menu,
          Option,
          ...componentsFromProps,
        }}
        testId={testId}
        // Forward the menuElevation on as a prop, this will be accessed
        // by the Menu component in order to set the data-elevation attribute
        menuElevation={menuElevation}
        filterOption={isSearchable ? filterOption : undefined}
        // eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides
        className={className}
        {...props}
      />
    </div>
  );
}
