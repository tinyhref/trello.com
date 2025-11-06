import type { FunctionComponent } from 'react';
import { useMemo } from 'react';

import { useMemberId } from '@trello/authentication';
import { canEdit } from '@trello/business-logic/board';
import { intl } from '@trello/i18n';
import type { GlyphProps } from '@trello/nachos/icon';
import { CalendarIcon } from '@trello/nachos/icons/calendar';
import { DashboardIcon } from '@trello/nachos/icons/dashboard';
import { ListIcon } from '@trello/nachos/icons/list';
import { LocationIcon } from '@trello/nachos/icons/location';
import { TableIcon } from '@trello/nachos/icons/table';
import { TimelineIcon } from '@trello/nachos/icons/timeline';
import {
  getTestId,
  type TestId,
  type ViewSwitcherTestIds,
} from '@trello/test-ids';

import type { ViewType } from 'app/src/components/ViewsGenerics';
import { useCurrentView } from './useCurrentView';
import { useViewSwitcherBoardFragment } from './ViewSwitcherBoardFragment.generated';
import type { ViewSwitcherBoardFragment } from './ViewSwitcherBoardFragment.generated';
import { useViewSwitcherBoardOrganizationFragment } from './ViewSwitcherBoardOrganizationFragment.generated';
import { ViewSwitcherButtons } from './ViewSwitcherButtons';
import { useViewSwitcherMemberFragment } from './ViewSwitcherMemberFragment.generated';

import * as styles from './ViewSwitcher.module.less';

export type SwitcherView = Pick<
  NonNullable<
    NonNullable<ViewSwitcherBoardFragment>['prefs']
  >['switcherViews'][0],
  'enabled' | 'viewType'
>;

export type SwitcherViewViewType = SwitcherView['viewType'];
export interface ViewOption {
  name: SwitcherViewViewType;
  localizedName: string;
  icon: FunctionComponent<GlyphProps>;
  testId: TestId;
}

export const ViewTypesMapping: Record<ViewType, SwitcherViewViewType> = {
  board: 'Board',
  table: 'Table',
  calendar: 'Calendar',
  map: 'Map',
  dashboard: 'Dashboard',
  timeline: 'Timeline',
};

export const viewOptions: {
  [key in SwitcherViewViewType]: ViewOption;
} = {
  Board: {
    name: ViewTypesMapping['board'],
    localizedName: intl.formatMessage({
      id: 'templates.view_switcher.Board',
      defaultMessage: 'Board',
      description: 'Switch to Board view.',
    }),
    icon: ListIcon,
    testId: getTestId<ViewSwitcherTestIds>('view-switcher-button-board'),
  },
  Table: {
    name: ViewTypesMapping['table'],
    localizedName: intl.formatMessage({
      id: 'templates.view_switcher.Table',
      defaultMessage: 'Table',
      description: 'Switch between different table views in the interface.',
    }),
    icon: TableIcon,
    testId: getTestId<ViewSwitcherTestIds>('view-switcher-button-table'),
  },
  Calendar: {
    name: ViewTypesMapping['calendar'],
    localizedName: intl.formatMessage({
      id: 'templates.view_switcher.Calendar',
      defaultMessage: 'Calendar',
      description:
        'Switch between different calendar views and modes seamlessly.',
    }),
    icon: CalendarIcon,
    testId: getTestId<ViewSwitcherTestIds>('view-switcher-button-calendar'),
  },
  Timeline: {
    name: ViewTypesMapping['timeline'],
    localizedName: intl.formatMessage({
      id: 'templates.view_switcher.Timeline',
      defaultMessage: 'Timeline',
      description: 'Switch between timeline views in an interface.',
    }),
    icon: TimelineIcon,
    testId: getTestId<ViewSwitcherTestIds>('view-switcher-button-timeline'),
  },
  Dashboard: {
    name: ViewTypesMapping['dashboard'],
    localizedName: intl.formatMessage({
      id: 'templates.view_switcher.Dashboard',
      defaultMessage: 'Dashboard',
      description:
        'Switch between dashboard views with the view switcher feature.',
    }),
    icon: DashboardIcon,
    testId: getTestId<ViewSwitcherTestIds>('view-switcher-button-dashboard'),
  },
  Map: {
    name: ViewTypesMapping['map'],
    localizedName: intl.formatMessage({
      id: 'templates.view_switcher.Map',
      defaultMessage: 'Map',
      description:
        'Switch between different map views using the view switcher.',
    }),
    icon: LocationIcon,
    testId: getTestId<ViewSwitcherTestIds>('view-switcher-button-map'),
  },
};

export interface ViewSwitcherProps {
  idBoard: string;
  isCollapsed?: boolean;
}

export const ViewSwitcher: FunctionComponent<ViewSwitcherProps> = ({
  idBoard,
  isCollapsed,
}) => {
  const memberId = useMemberId();
  const currentView = useCurrentView();

  const currentViewBoardPrefs = currentView
    ? ViewTypesMapping[currentView]
    : null;

  const { data: member, complete: memberComplete } =
    useViewSwitcherMemberFragment({
      from: {
        id: memberId,
      },
    });

  const { data: board, complete: boardComplete } = useViewSwitcherBoardFragment(
    {
      from: {
        id: idBoard,
      },
    },
  );

  const { data: boardOrg } = useViewSwitcherBoardOrganizationFragment({
    from: {
      id: idBoard,
    },
  });

  const organization = boardOrg?.organization || null;

  const loading = !boardComplete || !memberComplete;

  const hasViewsFeature = useMemo(
    () => board?.premiumFeatures?.includes('views') ?? false,
    [board?.premiumFeatures],
  );

  const memberCanEditBoard = Boolean(
    board &&
      member &&
      organization &&
      canEdit(member, board, organization, null),
  );

  const defaultSwitcherViews: SwitcherView[] = [
    'board',
    'table',
    'calendar',
    'timeline',
    'dashboard',
    'map',
  ].map((viewType) => ({
    enabled: viewType === 'board',
    viewType: ViewTypesMapping[viewType as ViewType],
  }));

  const switcherViews = useMemo(() => {
    if (hasViewsFeature && board?.prefs?.switcherViews) {
      return board?.prefs?.switcherViews;
    } else {
      return defaultSwitcherViews;
    }
  }, [hasViewsFeature, board?.prefs?.switcherViews, defaultSwitcherViews]);

  const analyticsContainers = useMemo(() => {
    return {
      board: {
        id: idBoard,
      },
      organization: {
        id: board?.idOrganization,
      },
      workspace: {
        id: board?.idOrganization,
      },
      enterprise: {
        id: board?.idEnterprise,
      },
    };
  }, [board?.idEnterprise, board?.idOrganization, idBoard]);

  const switcherButtons = useMemo(
    () => (
      <ViewSwitcherButtons
        switcherViews={switcherViews}
        viewOptions={viewOptions}
        currentView={currentViewBoardPrefs}
        hasViewsFeature={hasViewsFeature}
        memberCanEditBoard={memberCanEditBoard}
        idBoard={idBoard}
        analyticsContainers={analyticsContainers}
        isCollapsed={isCollapsed}
      />
    ),
    [
      analyticsContainers,
      currentViewBoardPrefs,
      hasViewsFeature,
      idBoard,
      memberCanEditBoard,
      switcherViews,
      isCollapsed,
    ],
  );

  if (loading) {
    return null;
  }

  return <div className={styles.viewSwitcherContainer}>{switcherButtons}</div>;
};
