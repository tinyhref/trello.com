import { memo, Suspense } from 'react';

import { isMemberLoggedIn } from '@trello/authentication';
import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';

import {
  LazyClosedBoardBanner,
  useClosedBoardBanner,
} from 'app/src/components/ClosedBoardBanner';
import {
  LazyExportToJwmBanner,
  useExportToJwmBanner,
} from 'app/src/components/ExportToJwmBanner';
import {
  LazyLoggedInPublicBoardBanner,
  useLoggedInPublicBoardBanner,
} from 'app/src/components/LoggedInPublicBoardBanner';
import {
  LazyTemplateBoardBanner,
  useTemplateBoardBanner,
} from 'app/src/components/TemplateBoardBanner';
import {
  LazyWorkspaceUserLimitBoardBanner,
  useWorkspaceUserLimitBoardBanner,
} from 'app/src/components/WorkspaceUserLimitBoardBanner';

export const BoardBanners = memo(() => {
  const { wouldRender: wouldRenderWorkspaceUserLimitBoardBanner } =
    useWorkspaceUserLimitBoardBanner();

  const { wouldRender: wouldRenderExportToJwmBanner } = useExportToJwmBanner();

  const { wouldRender: wouldRenderLoggedInPublicBoardBanner } =
    useLoggedInPublicBoardBanner();

  const { wouldRender: wouldRenderTemplateBoardBanner } =
    useTemplateBoardBanner();

  const { wouldRender: wouldRenderClosedBoardBanner } = useClosedBoardBanner();

  const banners = [];

  if (!isMemberLoggedIn()) {
    return null;
  }

  if (wouldRenderWorkspaceUserLimitBoardBanner) {
    banners.push(
      <LazyWorkspaceUserLimitBoardBanner key="workspace-user-limit-board-banner" />,
    );
  }

  if (wouldRenderClosedBoardBanner) {
    banners.push(<LazyClosedBoardBanner key="closed-board-banner" />);
  } else {
    if (wouldRenderTemplateBoardBanner) {
      banners.push(<LazyTemplateBoardBanner key="template-board-banner" />);
    }

    if (wouldRenderLoggedInPublicBoardBanner) {
      banners.push(
        <LazyLoggedInPublicBoardBanner key="logged-in-public-board-banner" />,
      );
    }
  }

  if (wouldRenderExportToJwmBanner) {
    banners.push(<LazyExportToJwmBanner key="export-to-jwm-banner" />);
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-web-eng',
      }}
    >
      <ChunkLoadErrorBoundary fallback={null}>
        <Suspense fallback={null}>{banners}</Suspense>
      </ChunkLoadErrorBoundary>
    </ErrorBoundary>
  );
});
