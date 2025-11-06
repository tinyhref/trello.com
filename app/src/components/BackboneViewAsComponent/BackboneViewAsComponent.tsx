import { useEffect, useRef, useState } from 'react';

import type { View, ViewOptions } from 'app/scripts/views/internal/View';

interface ViewConstructable<
  TModel,
  TOptions extends ViewOptions,
  TView extends View<TModel, TOptions>,
> {
  new (options: TOptions): TView;
}

export type OnViewRenderedType<
  TOptions extends ViewOptions,
  TModel,
  TView extends View<TModel, TOptions>,
> = (
  view: InstanceType<ViewConstructable<TModel, TOptions, TView>>,
  ref: HTMLElement,
) => void;

export const BackboneViewAsComponent = <
  TModel,
  TOptions extends ViewOptions,
  TView extends View<TModel, TOptions>,
>({
  viewId,
  View,
  onViewRendered,
  model,
  options,
  className,
  testId,
}: {
  /**
   * A unique identifier for the view. If the id changes, the view will be
   * removed and re-rendered.
   */
  viewId?: string;
  View: ViewConstructable<TModel, TOptions, TView>;
  onViewRendered?: (
    view: InstanceType<ViewConstructable<TModel, TOptions, TView>>,
    ref: HTMLElement,
  ) => void;
  model: TModel;
  options: TOptions;
  className?: string;
  testId?: string;
}) => {
  const domRef = useRef<HTMLDivElement | null>(null);
  const [viewIdState, setViewIdState] = useState<string | null>(null);
  const viewIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (viewId && viewId !== viewIdRef.current) {
      if (viewIdRef.current !== null) {
        setViewIdState(viewId);
      }
      viewIdRef.current = viewId;
    }
  }, [viewId]);

  useEffect(() => {
    if (!domRef.current) {
      return;
    }

    const view = new View({ ...options, model });

    view.render();

    domRef.current.append(view.el);

    if (onViewRendered) {
      onViewRendered(view, domRef.current);
    }

    return () => {
      view.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domRef, viewIdState]);

  return <div className={className} ref={domRef} data-testid={testId} />;
};
