import {
  useCallback,
  type FunctionComponent,
  type MouseEventHandler,
} from 'react';
import { FormattedMessage } from 'react-intl';

import Lozenge from '@atlaskit/lozenge';
import { Analytics } from '@trello/atlassian-analytics';
import { CardIcon } from '@trello/nachos/icons/card';
import { usePopover } from '@trello/nachos/popover';
import { useNewFeature } from '@trello/new-feature';
import type { QuickCardEditorTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { LazyMirrorCardPopover } from 'app/src/components/MirrorCardPopover';
import { QuickCardEditorButton } from './QuickCardEditorButton';

import * as styles from './MirrorCardButton.module.less';

export const MirrorCardButton: FunctionComponent<{ onClose: () => void }> = ({
  onClose,
}) => {
  const {
    isNewFeature: isNewMirrorCardFeature,
    acknowledgeNewFeature: acknowledgeMirrorCardFeature,
  } = useNewFeature('trello-mirror-card');

  const { popoverProps, hide, toggle, triggerRef } = usePopover();

  const handleOnClick = useCallback<MouseEventHandler>(() => {
    toggle();
    acknowledgeMirrorCardFeature({ source: 'quickCardEditorInlineDialog' });

    if (!popoverProps.isVisible) {
      Analytics.sendClickedButtonEvent({
        buttonName: 'mirrorCardButton',
        source: 'quickCardEditorInlineDialog',
      });
    }
  }, [acknowledgeMirrorCardFeature, popoverProps.isVisible, toggle]);

  return (
    <>
      <QuickCardEditorButton
        icon={<CardIcon size="small" />}
        testId={getTestId<QuickCardEditorTestIds>('mirror-new-button')}
        onClick={handleOnClick}
        ref={triggerRef}
        isSelected={popoverProps.isVisible}
      >
        <FormattedMessage
          id="templates.quick_card_editor.mirror"
          defaultMessage="Mirror"
          description="Quick card editor Mirror button"
        />
        {isNewMirrorCardFeature && (
          <span className={styles.newTag}>
            <Lozenge appearance="new" isBold>
              <FormattedMessage
                id="templates.quick_card_editor.new"
                defaultMessage="NEW"
                description="NEW tag"
              />
            </Lozenge>
          </span>
        )}
      </QuickCardEditorButton>
      {popoverProps.isVisible && (
        <LazyMirrorCardPopover
          popoverProps={popoverProps}
          hide={hide}
          onClose={onClose}
        />
      )}
    </>
  );
};
