import type { FunctionComponent } from 'react';

import { isMemberLoggedIn } from '@trello/authentication';

import { LoggedInHeaderSkeleton } from './LoggedInHeaderSkeleton';
import { LoggedOutHeaderSkeleton } from './LoggedOutHeaderSkeleton';

interface HeaderSkeletonProps {
  backgroundColor?: string;
}

export const HeaderSkeleton: FunctionComponent<HeaderSkeletonProps> = ({
  backgroundColor,
}) => {
  if (isMemberLoggedIn()) {
    return <LoggedInHeaderSkeleton backgroundColor={backgroundColor} />;
  }

  return <LoggedOutHeaderSkeleton />;
};
