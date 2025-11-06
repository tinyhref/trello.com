import { useSearchParams } from '@trello/router';

import { useBoardIdFromBoardOrCardRoute } from 'app/src/components/Board/useBoardIdFromBoardOrCardRoute';
import { useTemplateBoardBannerFragment } from './TemplateBoardBannerFragment.generated';

export function useTemplateBoardBanner() {
  const boardId = useBoardIdFromBoardOrCardRoute();

  const { data: boardData } = useTemplateBoardBannerFragment({
    from: { id: boardId },
    variables: { boardId },
  });

  const searchParams = useSearchParams();
  const shouldNotShowInTemplateGallery =
    searchParams.get('isPreviewingTemplate') === 'false';

  const wouldRender =
    !!boardId &&
    boardData?.closed === false &&
    boardData?.prefs?.isTemplate === true &&
    // If the template is an iframe (for example rendered from the template gallery)
    // and parent page contains a route /templates/, along with being from a Trello origin
    // don't render TemplateBanner.
    !shouldNotShowInTemplateGallery;

  return {
    wouldRender,
  };
}
