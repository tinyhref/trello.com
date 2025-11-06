import { useEffect, useState, type FunctionComponent } from 'react';
import { useNavigate, useLocation as useRRLocation } from 'react-router';

import { useRouteId, useLocation as useTrelloLocation } from '@trello/router';
import { isRouteModernized } from '@trello/router/migration';
import { token } from '@trello/theme';

import { PageError } from '../components/PageError';

let lastRedirect = 0;

const NoModernizedRoot = () => {
  const { pathname: trelloPathname } = useTrelloLocation();
  const { pathname: reactRouterPathname } = useRRLocation();
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (trelloPathname !== reactRouterPathname) {
      console.warn(
        `Correcting path mismatch in CatchAllMigrationRoute (${trelloPathname} !== ${reactRouterPathname})`,
      );
      // 500ms debounce on corrective redirects
      if (Date.now() - lastRedirect > 500) {
        lastRedirect = Date.now();
        navigate(trelloPathname, { replace: true });
      } else {
        setShowError(true);
      }
    }
  }, [reactRouterPathname, trelloPathname, navigate]);

  if (showError) {
    return (
      <>
        <PageError />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Route{' '}
          <pre
            style={{
              display: 'inline-block',
              marginBlock: '0',
              marginInline: token('space.100', '8px'),
            }}
          >
            {reactRouterPathname}
          </pre>{' '}
          could not be found.
        </div>
      </>
    );
  } else {
    return null;
  }
};

export const CatchAllMigrationRoute: FunctionComponent = () => {
  const routeId = useRouteId();
  const isModernized = isRouteModernized(routeId);

  if (isModernized) {
    return <NoModernizedRoot />;
  } else {
    return null;
  }
};
