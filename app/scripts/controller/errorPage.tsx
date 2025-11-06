import { renderTopLevelComponent } from 'app/scripts/controller/renderTopLevelComponent';
import type { ErrorProps } from 'app/src/components/Error/Error.types';
import { LazyError } from 'app/src/components/Error/LazyError';

export function errorPage({
  errorType = 'notFound',
  reason = undefined,
}: ErrorProps) {
  return renderTopLevelComponent(
    <LazyError errorType={errorType} reason={reason} />,
  );
}
