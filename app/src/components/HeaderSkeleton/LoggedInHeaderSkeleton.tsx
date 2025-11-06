import type { FunctionComponent } from 'react';

import { token } from '@trello/theme';

import { SkeletonComponent } from './SkeletonComponent';
import { TrelloLogo } from './TrelloLogo';

interface LoggedInHeaderSkeletonProps {
  backgroundColor?: string;
}

export const LoggedInHeaderSkeleton: FunctionComponent<
  LoggedInHeaderSkeletonProps
> = ({ backgroundColor: bgColor }) => {
  const defaultBackgroundColor = token('elevation.surface', '#FFFFFF');
  const backgroundColor = bgColor ?? defaultBackgroundColor;

  const skeletonStyles = `
    .header-skeleton-container {
      height: 32px;
      padding: var(--ds-space-100, 8px);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--ds-space-100, 8px);
    }
    .header-skeleton-left-section {
      display: flex;
      flex: 0 0 auto;
      align-items: center;
      gap: 12px;
      padding: 0 4px;
    }
    .header-skeleton-center-section {
      display: flex;
      flex: 1 0 auto;
      margin: var(--ds-space-0, 0) var(--ds-space-050, 4px);
      gap: var(--ds-space-100, 8px);
      justify-content: center;
    }
    .header-skeleton-search-bar {
      border: 1px solid var(--ds-border, #E1E4E8);
      height: 30px;
      flex: 1 1 auto;
      min-width: 110px;
      max-width: 780px;
      border-radius: var(--ds-radius-small, 3px);
    }
    .header-skeleton-right-section {
      display: flex;
      flex: 0 0 auto;
      gap: var(--ds-space-150, 12px);
      padding-right: var(--ds-space-050, 4px);
    }

    @media only screen and (max-width: 1280px) {
      .header-skeleton-left-section {
        flex: 0 0 60px;
        overflow: hidden;
      }
      .header-skeleton-center-section {
        justify-content: flex-end;
      }
      .header-skeleton-left-section svg {
        flex: 0 0 70px;
      }
    }
    @media only screen and (max-width: 790px) {
      .header-skeleton-center-section {
        justify-content: center;
      }
      .header-skeleton-search-bar {
        flex: 0 0 32px;
        background-color: var(--ds-skeleton, #091E420F);
        border: none;
        min-width: 32px;
        padding: 1px;
      }
    }
    @media only screen and (max-width: 450px) {
      .header-skeleton-right-section > div:not(:first-child) {
        display: none;
      }
    }
  `;

  return (
    <div
      id="header"
      data-testid="logged-in-skeleton-header"
      style={{
        minHeight: 48,
        maxHeight: 48,
        backgroundColor,
      }}
    >
      <style>{skeletonStyles}</style>
      <div className="header-skeleton-container">
        <div className="header-skeleton-left-section">
          <SkeletonComponent height={24} width={24} />
          <TrelloLogo />
        </div>
        <div className="header-skeleton-center-section">
          <div className="header-skeleton-search-bar" />
          <SkeletonComponent width={70} />
        </div>
        <div className="header-skeleton-right-section">
          <SkeletonComponent height={24} width={24} />
          <SkeletonComponent height={24} width={24} />
          <SkeletonComponent height={24} width={24} />
          <SkeletonComponent height={24} width={24} circle />
        </div>
      </div>
    </div>
  );
};
