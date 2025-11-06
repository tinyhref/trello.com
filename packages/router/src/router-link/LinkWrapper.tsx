import type { FunctionComponent } from 'react';

import type { TestId } from '@trello/test-ids';

import type { RouterLinkProps } from './RouterLink';

export const LinkWrapper: FunctionComponent<RouterLinkProps> = ({
  children,
  href,
  ...props
}) => {
  let pathname: string;
  try {
    pathname = new URL(href || '').pathname;
  } catch (e) {
    pathname = href || '';
  }

  const expandedProps: RouterLinkProps & { 'data-testid'?: TestId } = {
    ...props,
  };
  expandedProps['data-testid'] = props.testId;
  delete expandedProps.testId;

  return (
    <a href={pathname} {...expandedProps}>
      {children}
    </a>
  );
};
