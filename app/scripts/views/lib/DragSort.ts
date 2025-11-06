import { Analytics, tracingCallback } from '@trello/atlassian-analytics';
import { isTouch } from '@trello/browser';
import { contains } from '@trello/dom';
// eslint-disable-next-line no-restricted-imports
import $ from '@trello/jquery';
import {
  setIntervalOnAnimationFrame,
  throttle,
  throttleOnAnimationFrame,
} from '@trello/time';

import { ModelCache } from 'app/scripts/db/ModelCache';
import { PopOver } from 'app/scripts/views/lib/PopOver';
import { PostRender } from 'app/scripts/views/lib/PostRender';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pointHorizontallyInRect = ({ x }: any, { left, right }: any) =>
  left <= x && x < right;

const inset = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { top, left, bottom, right }: any,
  // @ts-expect-error TS(7006): Parameter 'horizontal' implicitly has an 'any' typ... Remove this comment to see the full error message
  horizontal,
  // @ts-expect-error TS(7006): Parameter 'vertical' implicitly has an 'any' type.
  vertical,
) => ({
  top: top + vertical,
  bottom: bottom - vertical,
  left: left + horizontal,
  right: right - horizontal,
});
const getMousePosition = (e: MouseEvent) => ({
  x: e.pageX,
  y: e.pageY,
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const concat = (...fns: any[]) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function (this: any) {
    for (const fn of fns) {
      if (fn) {
        fn.apply(this, arguments);
      }
    }
  };
/* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-shadow */
const prefix = (fn: any, prefix: any) => concat(prefix, fn);

interface DragSort {
  abort: () => void;
  sorting: boolean;
  isScrolling: boolean;
  $target: JQuery<HTMLElement> | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refreshCardSortable: ($el: any, opts: any) => void;
  refreshListCardSortable: () => void;
  refreshCalendarCardSortable: () => void;
  refreshDraggableCardMembers: (boardId: string) => void;
  refreshDraggableStickers: (boardId: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refreshIfInitialized: ($el: any) => any;
}

/* eslint-disable-next-line @trello/enforce-variable-case, @typescript-eslint/no-redeclare */
const DragSort = {} as DragSort;

DragSort.sorting = false;
DragSort.isScrolling = false;
DragSort.$target = undefined;

class DragInfo {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $helper: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $target: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _queue: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  aborted: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  boardCanvasElement: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  boardElement: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cachedHoveredList: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cancelMethod: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  commitEvent: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hasMousedLeft: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hasMousedRight: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialMousePosition: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scrollBoard: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scrollCard: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scrollLists: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scrollTimer: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stopped: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  windowOverlayElement: any;
  constructor({
    scrollBoard,
    scrollLists,
    scrollCard,
    commitEvent,
    cancelMethod,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any) {
    this.hasMousedLeft = false;
    this.hasMousedRight = false;
    this.stopped = false;
    this.aborted = false;

    this.scrollBoard = scrollBoard;
    this.scrollLists = scrollLists;
    this.scrollCard = scrollCard;
    this.commitEvent = commitEvent;
    this.cancelMethod = cancelMethod;
    this._queue = [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  start(e: MouseEvent, ui: any) {
    this.$helper = ui.helper;
    this.$target = $(e.target as HTMLElement);
    this.initialMousePosition = getMousePosition(e);
    this.scrollTimer = null;

    this.lockModelCache();
    this.startTrackingMouse();
    this.hidePopoversForSomeReason();

    this.boardElement = document.querySelector('#board');
    this.boardCanvasElement = document.querySelector('.board-canvas');
    this.windowOverlayElement = document.querySelector('.window-overlay');

    this.cachedHoveredList = this.getHoveredListForPoint(
      this.initialMousePosition,
    );
    if (this.scrollLists || this.scrollBoard || this.scrollCard) {
      this.startAutoscrolling();
    }

    DragSort.sorting = true;
    DragSort.isScrolling = false;
    DragSort.$target = this.$target;
    this.onStop(() =>
      // This fixes a timing issue where cards sometimes open after dragging.
      // If sorting is cleared too early, the card click will go through.
      // Observed in Firefox.
      // Obviously there are better ways to fix this.
      window.requestAnimationFrame(() => (DragSort.sorting = false)),
    );
  }

  lockModelCache() {
    const _lockIndex = ModelCache.lock('DragSort.startSort');
    return this.onStop(() => ModelCache.unlock(_lockIndex));
  }

  hidePopoversForSomeReason() {
    // If you're dragging a member from the "N observers" section,
    // we don't want to hide this.
    if (this.$target.closest('.pop-over').length === 0) {
      PopOver.hide();
    }
  }

  startAutoscrolling() {
    const scrollIntervalFunc = setIntervalOnAnimationFrame(
      this.autoscroll.bind(this),
      16,
    );
    return this.onStop(() => scrollIntervalFunc.clear());
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getHoveredListForPoint(point: any) {
    for (const el of document.querySelectorAll('.js-list')) {
      if (pointHorizontallyInRect(point, el.getBoundingClientRect())) {
        return (
          el.querySelector('.list-cards') ||
          el.querySelector('.js-legacy-class-for-list-scroll')
        );
      }
    }
    return null;
  }

  startTrackingMouse() {
    const updateHoveredList = throttle((point) => {
      // Because this is throttled, it's possible that it'll fire
      // after the drag has stopped. That would be madness.
      if (this.stopped) {
        return;
      }
      return (this.cachedHoveredList = this.getHoveredListForPoint(point));
    }, 100);

    const tolerance = 20;

    // this method handles autoscroll updates and
    // hovered list bounding box updates
    const throttledOnMouseMove = throttleOnAnimationFrame((e) => {
      const mousePosition = getMousePosition(e);
      if (mousePosition.x < this.initialMousePosition.x - tolerance) {
        this.hasMousedLeft = true;
      }
      if (mousePosition.x > this.initialMousePosition.x + tolerance) {
        this.hasMousedRight = true;
      }
      updateHoveredList(mousePosition);
    });

    $(document).on('mousemove.dragsort', throttledOnMouseMove);

    return this.onStop(() =>
      $(document).off('mousemove.dragsort', throttledOnMouseMove),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onStop(fn: any) {
    return this._queue.push(fn);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stop(e: any, ui: any) {
    this.stopped = true;

    for (const fn of this._queue) {
      fn.call(this);
    }
    delete this._queue;

    if (!this.aborted) {
      this.$target.trigger(this.commitEvent, ui);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scrollDeltaForOverhang(overhang: any) {
    return overhang * 0.1;
  }

  // will set isScrolling to true and set a timer to set it to false,
  // so that public consumers can see if we are autoscrolling through cards or not.
  enqueuePublicScrolling() {
    DragSort.isScrolling = true;
    clearTimeout(this.scrollTimer);
    this.scrollTimer = setTimeout(() => {
      DragSort.isScrolling = false;
    }, 50);
  }

  autoscrollBoard() {
    const { left, right } = this.$helper[0].getBoundingClientRect();
    const scrollFrame = inset(
      this.boardCanvasElement.getBoundingClientRect(),
      100,
      0,
    );

    const leftOverhang = scrollFrame.left - left;
    if (leftOverhang > 0 && this.hasMousedLeft) {
      this.boardElement.scrollLeft -= this.scrollDeltaForOverhang(leftOverhang);
    }

    const rightOverhang = right - scrollFrame.right;
    if (rightOverhang > 0 && this.hasMousedRight) {
      this.boardElement.scrollLeft +=
        this.scrollDeltaForOverhang(rightOverhang);
    }
  }

  autoscrollLists() {
    const { top, bottom } = this.$helper[0].getBoundingClientRect();
    const scrollFrame = inset(
      this.cachedHoveredList.getBoundingClientRect(),
      0,
      50,
    );

    const topOverhang = scrollFrame.top - top;
    if (topOverhang > 0) {
      this.enqueuePublicScrolling();
      this.cachedHoveredList.scrollTop -=
        this.scrollDeltaForOverhang(topOverhang);
    }

    const bottomOverhang = bottom - scrollFrame.bottom;
    if (bottomOverhang > 0) {
      this.enqueuePublicScrolling();
      this.cachedHoveredList.scrollTop +=
        this.scrollDeltaForOverhang(bottomOverhang);
    }
  }

  autoscrollCard() {
    let { bottom } = this.$helper[0].getBoundingClientRect();
    const { top } = this.$helper[0].getBoundingClientRect();

    // Some draggables, like checklists, have the potential to be really tall
    // and would be more likely to start out overhanging the bottom
    const MAX_HELPER_HEIGHT = 64;
    if (bottom - top > MAX_HELPER_HEIGHT) {
      bottom = top + MAX_HELPER_HEIGHT;
    }

    const scrollFrame = inset(
      this.windowOverlayElement.getBoundingClientRect(),
      0,
      100,
    );

    const topOverhang = scrollFrame.top - top;
    if (topOverhang > 0) {
      this.windowOverlayElement.scrollTop -=
        this.scrollDeltaForOverhang(topOverhang);
    }

    const bottomOverhang = bottom - scrollFrame.bottom;
    if (bottomOverhang > 0) {
      this.windowOverlayElement.scrollTop +=
        this.scrollDeltaForOverhang(bottomOverhang);
    }
  }

  autoscroll() {
    if (this.scrollBoard) {
      this.autoscrollBoard();
    }
    if (this.scrollLists && this.cachedHoveredList) {
      this.autoscrollLists();
    }
    if (this.scrollCard) {
      this.autoscrollCard();
    }
  }

  abort() {
    // @ts-expect-error TS(2339): Property 'ui' does not exist on type 'JQueryStatic... Remove this comment to see the full error message
    const manager = $.ui.ddmanager.current;
    this.aborted = true;
    // Work around a bug in jQueryUI Sortable
    // If the drag manager thinks that the element has switched sortable
    // containers, it will fire a receive event on the new container, even
    // though the drag has been cancelled
    if (manager) {
      manager.currentContainer = manager;
    }

    return this.$target[this.cancelMethod]('cancel');
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let currentDragInfo: any = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeOpts = function (customOpts: any, opts: any) {
  opts = {
    ...opts,
    distance: 7,
    scroll: false,
  };

  // This allows you to drag cards over the "Add a card..." button at the
  // bottom of lists (even though that isn't inside their destination).
  if (customOpts.scrollLists) {
    opts.custom = {
      refreshContainers() {
        this.containers = this.containers
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((container: any) => contains(document, container.element[0]))
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((container: any) => {
            const el = container.element.closest('.js-list')[0];
            const frame = el.getBoundingClientRect();
            for (const field of ['left', 'top', 'width', 'height']) {
              container.containerCache[field] = frame[field];
            }
            return container;
          });
      },
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  opts.start = prefix(opts.start, function (e: any, ui: any) {
    if (currentDragInfo) {
      throw new Error(
        'Attempt to start a drag event while another is in progress!',
      );
    }
    currentDragInfo = new DragInfo(customOpts);
    currentDragInfo.start(e, ui);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  opts.stop = prefix(opts.stop, function (e: any, ui: any) {
    e?.stopPropagation();
    currentDragInfo.stop(e, ui);
    currentDragInfo = null;
  });

  return opts;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const afterDragCompletes = (fn: any) => {
  if (currentDragInfo) {
    currentDragInfo.onStop(fn);
  } else {
    fn();
  }
};

const defaultCalcSize = ($item: JQuery<HTMLElement>) => ({
  width: $item.outerWidth(),
  height: $item.outerHeight(),
});

const hookSortable = function (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selector: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customOpts: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  opts: any,
) {
  if (isTouch()) {
    return;
  }
  /* eslint-disable-next-line @trello/enforce-variable-case, @typescript-eslint/no-explicit-any */
  let $elements: any = null;

  const shouldNormalizeAppendTo =
    !('helper' in opts) || opts.helper === 'original';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  opts.start = prefix(opts.start, function (e: any, ui: any) {
    if (shouldNormalizeAppendTo && 'appendTo' in opts) {
      ui.helper.appendTo(opts.appendTo);
      $elements.sortable('refreshPositions', true);
    }

    const calcSize = customOpts.calcSize || defaultCalcSize;
    const { width, height } = calcSize(ui.item);

    ui.placeholder.width(width);
    ui.placeholder.height(height);
  });

  customOpts = {
    ...customOpts,
    commitEvent: 'sortcommit',
    cancelMethod: 'sortable',
  };
  opts = normalizeOpts(customOpts, opts);

  PostRender.enqueue(() =>
    // Don't re-initialize a sortable while a drag is in progress;
    // the sortable replaces the initial placeholder with an object
    // at the start of a drag, and calling .sortable will set the
    // placeholder back to a string, causing unexpected behavior for
    // the drag in progress
    afterDragCompletes(() => {
      $elements = $(selector);
      $elements.sortable(opts);
    }),
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const hookDraggable = function (selector: any, customOpts: any, opts: any) {
  if (isTouch()) {
    return;
  }
  customOpts = {
    ...customOpts,
    commitEvent: 'dragcommit',
    cancelMethod: 'draggable',
  };
  opts = normalizeOpts(customOpts, opts);
  // @ts-expect-error TS(2339): Property 'draggable' does not exist on type 'JQuer... Remove this comment to see the full error message
  PostRender.enqueue(() => $(selector).draggable(opts));
};

DragSort.refreshCalendarCardSortable = () => {
  return hookSortable(
    '.js-calendar-sortable',
    {
      scrollBoard: false,
      scrollLists: false,
    },
    {
      connectWith: '.js-calendar-sortable',
      placeholder: 'list-card placeholder-none',
      items:
        '.list-card:not(.placeholder-none, .hide, .js-composer), .js-draggable-calendar-check-item',
      helper: 'clone',
      appendTo: '#trello-root',

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      over(e: any, ui: any) {
        return $(e.target).closest('.calendar-day').addClass('drop');
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      out(e: any, ui: any) {
        return $(e.target).closest('.calendar-day').removeClass('drop');
      },
    },
  );
};

DragSort.refreshListCardSortable = () => {
  return hookSortable(
    '.js-sortable',
    {
      scrollBoard: true,
      scrollLists: true,
    },
    {
      connectWith: '.js-sortable:not(.card-limits-full)',
      placeholder: 'list-card placeholder',
      tolerance: 'pointer',
      items:
        '.list-card:not(.placeholder, .hide, .js-composer, .js-out-of-viewport)',
      appendTo: '#trello-root',
    },
  );
};

DragSort.refreshDraggableCardMembers = (boardId: string) => {
  return hookDraggable(
    `.js-list-draggable-card-members \
.member:not(.js-member-deactivated)`,
    {
      scrollBoard: true,
      scrollLists: true,
    },
    {
      appendTo: '#trello-root',
      zIndex: 100,
      helper: 'clone',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      start(e: any, ui: any) {
        Analytics.sendUIEvent({
          action: 'dragged',
          actionSubject: 'member',
          source: 'boardScreen',
          containers: {
            board: {
              id: boardId,
            },
          },
        });

        // droppable.hoverClass in card.js is going to add an active class
        // so we don't want it to look like there are two active cards
        $('.list-card.active-card').removeClass('active-card');
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      stop(e: any, ui: any) {
        // Card member was dragged off of
        const sourceCardPath = e.target.closest('.list-card').href.split('/');
        const sourceCardShortLink = sourceCardPath[sourceCardPath.length - 2];
        const sourceCard = ModelCache.get('Card', sourceCardShortLink);
        // Remove from source card if member was not dragged onto any card or dragged onto another card
        if (
          !ui.helper.data('droppedOnCard') ||
          // @ts-expect-error TS(2532): Object is possibly 'undefined'.
          ui.helper.data('droppedOnCard').id !== sourceCard.id
        ) {
          const memberId = ui.helper.data('idmem');

          const source = 'boardScreen';
          const traceId = Analytics.startTask({
            taskName: 'edit-card/idMembers',
            source,
          });

          // @ts-expect-error TS(2532): Object is possibly 'undefined'.
          sourceCard.removeMemberWithTracing(
            memberId,
            traceId,
            tracingCallback(
              {
                taskName: 'edit-card/idMembers',
                traceId,
                source,
              },
              () => {
                Analytics.sendUpdatedCardFieldEvent({
                  field: 'idMembers',
                  source,
                  containers: {
                    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                    card: { id: sourceCard.id },
                    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                    board: { id: sourceCard.get('idBoard') },
                    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                    list: { id: sourceCard.get('idList') },
                  },
                  attributes: {
                    taskId: traceId,
                    changeType: 'remove member',
                  },
                });
              },
            ),
          );
        }
      },
    },
  );
};

DragSort.refreshDraggableStickers = (boardId: string) => {
  return hookDraggable(
    '.js-draggable-sticker:not(.disabled)',
    {
      scrollBoard: true,
      scrollLists: true,
    },
    {
      revert: 'invalid',
      revertDuration: 150,
      appendTo: '#trello-root',
      zIndex: 100,
      helper: 'clone',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      start(e: any, ui: any) {
        Analytics.sendUIEvent({
          action: 'dragged',
          actionSubject: 'sticker',
          source: 'boardScreen',
          containers: {
            board: {
              id: boardId,
            },
          },
        });
        const randomRotation = Math.random() * 20 - 10;
        ui.helper.find('.sticker-select-fixed').css({
          transform: `rotate(${randomRotation}deg)`,
          '-webkit-transform': `rotate(${randomRotation}deg)`,
        });
      },
    },
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
DragSort.refreshCardSortable = ($el: any, opts: any) => {
  return hookSortable($el, { scrollCard: true }, opts);
};

DragSort.abort = () => {
  if (!currentDragInfo) {
    throw new Error('Abort called while not dragging!');
  }
  return currentDragInfo.abort();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
DragSort.refreshIfInitialized = ($el: any) => {
  // The first drag after a card add fails in jQuery 2.0.0
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if ($el && $el.hasClass('ui-sortable')) {
    return $el.sortable('refresh');
  }
};

/** @deprecated Please do not make new uses of this component.  It's slated for removal */
export { DragSort };
