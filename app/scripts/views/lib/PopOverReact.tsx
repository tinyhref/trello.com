// eslint-disable-next-line no-restricted-imports
import Bluebird from 'bluebird';
import {
  cloneElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type FunctionComponent,
  type ReactElement,
  type ReactNode,
} from 'react';
import _ from 'underscore';

import { intl } from '@trello/i18n';
import type { PopoverTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

interface PopOverReactProps {
  children: ReactNode;
  hideHeader?: boolean;
  onBack?: (() => void) | null;
  onClose: () => void;
  getViewTitle?: () => Promise<string> | string;
  hasSafeViewTitle?: boolean;
}

export const PopOverReact: FunctionComponent<PopOverReactProps> = ({
  children,
  hideHeader,
  onBack,
  onClose,
  getViewTitle,
  hasSafeViewTitle,
}) => {
  const [title, setTitle] = useState('');
  const titlePromiseRef = useRef<Bluebird<string> | null>(null);
  const isMountedRef = useRef(true);

  const updateTitle = useCallback(
    async (titleGetter?: () => Promise<string> | string) => {
      // popover doesn't have a title
      if (!titleGetter) {
        return;
      }

      try {
        const newTitle = titleGetter();

        // If the title is the same, don't update
        if (newTitle === title) {
          return;
        }

        // Cancel existing promise if any
        if (titlePromiseRef.current) {
          titlePromiseRef.current.cancel();
        }

        // Create a new cancellable promise
        titlePromiseRef.current = Bluebird.resolve(newTitle)
          // @ts-expect-error TS(2339): Property 'cancellable' does not exist on type 'Blu... Remove this comment to see the full error message
          .cancellable()
          .then((resolvedTitle = '') => {
            if (isMountedRef.current) {
              setTitle(resolvedTitle);
            }
          })
          .catch(Bluebird.CancellationError, () => {
            // Handle cancellation silently
          });
      } catch (error) {
        // Handle synchronous errors
        console.error('Error getting title:', error);
      }
    },
    [title],
  );

  useEffect(() => {
    isMountedRef.current = true;
    updateTitle(getViewTitle);

    return () => {
      isMountedRef.current = false;
      if (titlePromiseRef.current) {
        titlePromiseRef.current.cancel();
      }
    };
  }, [updateTitle, getViewTitle]);

  // Helper function to add classes to children (preserving original behavior)
  const addClass = (addedClasses: string, classNames?: string) =>
    _.chain(classNames ? classNames.split(' ') : [])
      .union(addedClasses.split(' '))
      .value()
      .join(' ');

  const addClassesToReactElement = (
    classNames: string,
    reactElement: ReactElement,
  ) =>
    // eslint-disable-next-line @eslint-react/no-clone-element -- This component is slated for removal in Q2 as part of Backbone removal
    cloneElement(reactElement, {
      className: addClass(classNames, reactElement.props.classNames),
    });

  // Process children to add classes (preserving original behavior)
  // Convert children to array manually to avoid React.Children.toArray
  const childrenArray: ReactElement[] = Array.isArray(children)
    ? children
    : [children];
  const processedChildren = _.chain(childrenArray)
    .initial()
    .map((el) => addClassesToReactElement('js-popover-pushed hide', el))
    .value()
    .concat(_.last(childrenArray) || []);

  return (
    <div className={!onBack ? 'no-back' : ''}>
      {!hideHeader && (
        <div className="pop-over-header js-pop-over-header">
          {onBack && (
            <a
              aria-label={intl.formatMessage({
                id: 'templates.popover_common.back',
                defaultMessage: 'Back',
                description: 'Label for back button in a dialog',
              })}
              className="pop-over-header-back-btn icon-sm icon-back is-shown"
              onClick={onBack}
              href="#"
            />
          )}

          <h3 className="pop-over-header-title">
            {hasSafeViewTitle ? (
              // eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml
              <span dangerouslySetInnerHTML={{ __html: title }} />
            ) : (
              title
            )}
          </h3>

          <a
            aria-label={intl.formatMessage({
              id: 'templates.popover_common.close',
              defaultMessage: 'Close',
              description: 'Label for close button in a dialog',
            })}
            className="pop-over-header-close-btn icon-sm icon-close"
            onClick={onClose}
            href="#"
            data-testid={getTestId<PopoverTestIds>('legacy-popover-close')}
          />
        </div>
      )}

      <div className="pop-over-content js-pop-over-content u-fancy-scrollbar js-tab-parent">
        {processedChildren}
      </div>
    </div>
  );
};

PopOverReact.displayName = 'Popover';
