import classNames from 'classnames';
import type { FunctionComponent } from 'react';
import { useCallback, useRef } from 'react';

import { intl } from '@trello/i18n';
import { wait } from '@trello/time';

import * as styles from './FileLinkComponent.module.less';

interface FileLinkComponentProps {
  url: string;
}

export const FileLinkComponent: FunctionComponent<FileLinkComponentProps> = ({
  url,
}) => {
  const inputEl = useRef<HTMLInputElement>(null);

  // Automatically select the text in the input when the user clicks into it
  // but we need to defer the select call due to default browser behavior.
  const onClick = useCallback(async () => {
    await wait(0);
    inputEl.current?.select();
  }, []);

  return (
    <div>
      <p>
        {intl.formatMessage({
          id: 'templates.file_link_handler.browsers-prevent-file-links',
          defaultMessage:
            'You can view this link by pasting the URL into a new tab',
          description:
            'Text displayed to instruct users on how to view the file link',
        })}
        <input
          type="text"
          ref={inputEl}
          value={url}
          readOnly={true}
          className={classNames(styles.input, 'js-autofocus')}
          onClick={onClick}
        />
      </p>
    </div>
  );
};
