import type { BoardViews } from '@trello/router/routes';

import { activeBoardPageState } from './activeBoardPageState';

export function isShowingBoardViewSection(view: BoardViews['view'] | string) {
  return activeBoardPageState.value.view === view;
}

export function showingPupDirectory() {
  return isShowingBoardViewSection('power-ups');
}

export function showingCalendar() {
  return isShowingBoardViewSection('calendar-view');
}

export function showingMap() {
  return isShowingBoardViewSection('map');
}

export function showingAutomaticReports() {
  return (
    isShowingBoardViewSection('butler') && isShowingBoardViewSection('reports')
  );
}

export function isShowingBoardViewThatHasCards() {
  return (
    isShowingBoardViewSection('timeline') ||
    isShowingBoardViewSection('calendar-view') ||
    isShowingBoardViewSection('table') ||
    isShowingBoardViewSection('reports')
  );
}
