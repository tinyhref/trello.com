import cx from 'classnames';
import type { CSSProperties, FunctionComponent, ReactNode } from 'react';
import { isValidElement } from 'react';

import {
  ComponentAppearanceStatic,
  ComponentStateSelected,
  GLOBAL_NAMESPACE_PREFIX,
  ListClassnameBase,
  ListClassnameCell,
  ListClassnameContent,
  ListClassnameImage,
  ListClassnameItem,
  ListClassnameLabel,
  ListClassnameMeta,
} from '@trello/nachos/tokens';

import * as styles from './List.module.less';

interface ItemObject {
  id: string;
  label: string;
  image?: ReactNode | string;
  meta?: ReactNode | string;
  isSelected?: boolean;
}
type ItemsType = ItemObject[];

export const ListClasses = {
  LIST: `${GLOBAL_NAMESPACE_PREFIX}${ListClassnameBase}`,
  ITEM: `${GLOBAL_NAMESPACE_PREFIX}${ListClassnameBase}__${ListClassnameItem}`,
  CELL: {
    BASE: `${GLOBAL_NAMESPACE_PREFIX}${ListClassnameBase}__${ListClassnameCell}`,
    IMAGE: `${GLOBAL_NAMESPACE_PREFIX}${ListClassnameBase}__${ListClassnameCell}-${ListClassnameImage}`,
    SELECTED: `${GLOBAL_NAMESPACE_PREFIX}${ListClassnameBase}__${ListClassnameCell}--${ComponentStateSelected}`,
    META: {
      BASE: `${GLOBAL_NAMESPACE_PREFIX}${ListClassnameBase}__${ListClassnameCell}-${ListClassnameMeta}`,
      SELECTED: `${GLOBAL_NAMESPACE_PREFIX}${ListClassnameBase}__${ListClassnameCell}-${ListClassnameMeta}--${ComponentStateSelected}`,
    },
    LABEL: `${GLOBAL_NAMESPACE_PREFIX}${ListClassnameBase}__${ListClassnameCell}-${ListClassnameLabel}`,
    CONTENT: `${GLOBAL_NAMESPACE_PREFIX}${ListClassnameBase}__${ListClassnameCell}-${ListClassnameContent}`,
  },
  // For usage with static selects
  // includes styles for indicator
  STATIC: `${GLOBAL_NAMESPACE_PREFIX}${ListClassnameBase}--${ComponentAppearanceStatic}`,
};

export interface ListProps {
  className?: string;
  style?: CSSProperties;
  /**
   * An array of strings or objects that will be rendered as list items
   **/
  items: ItemsType;
}

export const ListCell: FunctionComponent<Omit<ItemObject, 'id'>> = (props) => {
  const { meta, image, label, isSelected } = props;
  let optionsImage = null;
  if (image) {
    if (typeof image === 'string') {
      optionsImage = (
        <img
          className={styles[ListClasses.CELL.IMAGE]}
          alt={label}
          src={image}
        />
      );
    }

    if (isValidElement(image)) {
      optionsImage = (
        <div className={styles[ListClasses.CELL.IMAGE]}>{image}</div>
      );
    }
  }

  const baseClassname = cx({
    [styles[ListClasses.CELL.BASE]]: true,
    [styles[ListClasses.CELL.SELECTED]]: isSelected,
  });

  const metaClassname = cx({
    [styles[ListClasses.CELL.META.BASE]]: true,
    [styles[ListClasses.CELL.META.SELECTED]]: isSelected,
  });

  return (
    <li className={baseClassname}>
      {optionsImage && optionsImage}
      <div className={styles[ListClasses.CELL.CONTENT]}>
        <div className={styles[ListClasses.CELL.LABEL]}>{label}</div>
        {meta && <div className={metaClassname}>{meta}</div>}
      </div>
    </li>
  );
};

export const List: FunctionComponent<ListProps> = (props) => {
  const { items, className, ...rest } = props;
  const listClassName = cx([styles[ListClasses.LIST]], className);

  return (
    <>
      {items.length && (
        <ul className={listClassName} {...rest}>
          {items.map((item) => (
            <ListCell key={item.id} {...item} />
          ))}
        </ul>
      )}
    </>
  );
};
