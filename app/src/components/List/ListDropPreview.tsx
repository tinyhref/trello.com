import type { FunctionComponent } from 'react';
import { useCallback } from 'react';

import { useSharedStateSelector } from '@trello/shared-state';
import type { ListTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { listDragAndDropState } from './listDragAndDropState';

import * as styles from './ListDropPreview.module.less';

export const ListDropPreview: FunctionComponent = () => {
  const [previewWidth, previewHeight] = useSharedStateSelector(
    listDragAndDropState,
    useCallback((state) => [state.previewWidth, state.previewHeight], []),
  );

  return (
    <div
      className={styles.dropPreview}
      style={{ width: previewWidth, height: previewHeight }}
      data-testid={getTestId<ListTestIds>('list-drop-preview')}
    />
  );
};
