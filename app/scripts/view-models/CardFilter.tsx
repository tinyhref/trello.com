/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS201: Simplify complex destructure assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

import _ from 'underscore';

import { intl } from '@trello/i18n';
import { dismissFlag, showFlag } from '@trello/nachos/experimental-flags';
import { FilterIcon } from '@trello/nachos/icons/filter';
import { urlDecode } from '@trello/urls';

import { Auth } from 'app/scripts/db/Auth';
import { l } from 'app/scripts/lib/localize';
import { Util } from 'app/scripts/lib/util';
import type { Card } from 'app/scripts/models/Card';
import { Label } from 'app/scripts/models/Label';
import type { Member } from 'app/scripts/models/Member';
import { LocalStorageModel } from 'app/scripts/view-models/internal/LocalStorageModel';
import {
  getWords,
  ID_NONE,
  NO_LABELS,
  satisfiesFilter,
} from 'app/src/satisfiesFilter';
import type { FilterMode } from '../../src/components/ViewFilters/types';

// Sort members alphabetically, with a special member first
function sortMembers(members: Member[], first: Member) {
  const isFirst = (memberLikeThing: Member) =>
    memberLikeThing === first || memberLikeThing.id === first.get('id');
  members.sort(function (memA, memB) {
    const aFirst = isFirst(memA);
    const bFirst = isFirst(memB);
    if (aFirst && !bFirst) {
      return -1;
    } else if (!aFirst && bFirst) {
      return 1;
    } else if (memA.fullName < memB.fullName) {
      return -1;
    } else if (memA.fullName > memB.fullName) {
      return 1;
    } else {
      return 0;
    }
  });
  return members;
}

export interface CardFilter {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  board: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debounce: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dueMap: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activityMap: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listenTo: any;
  modeMap: Record<string, FilterMode>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  newCardsWithoutIds: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  viewFiltersContext: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  waitForId: any;
}

export class CardFilter extends LocalStorageModel {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(board: any, options: any) {
    // @ts-expect-error TS(2554): Expected 0 arguments, but got 2.
    super(null, options);
    this.board = board;

    this.waitForId(this.board, (boardId: string) => {
      const memberId = Auth.myId();
      this.set({ id: `boardCardFilterSettings-${boardId}-${memberId}` });
      this.fetch();
      return this._resetNewCards();
    });

    this.dueMap = {
      notdue: 0, //This is here to support backwards compatibility with certain url forms
      day: 1,
      week: 7,
      month: 28,
      overdue: 0,
      complete: 0,
      incomplete: 0,
    };

    this.activityMap = {
      week: 7,
      twoWeeks: 14,
      fourWeeks: 28,
      month: 29,
    };

    this.modeMap = {
      or: 'or',
      and: 'and',
    };

    this.newCardsWithoutIds = [];

    this.listenTo(
      this,
      'change:title change:idLabels change:idMembers change:dateLastActivity change:due change:overdue change:notDue change:dueComplete change:mode change:autoCollapse',
      this.debounce(this._resetNewCards),
    );
  }

  default() {
    return {
      idMembers: [],
      idLabels: [],
      title: undefined,
      dateLastActivity: undefined,
      due: undefined,
      dueComplete: undefined,
      overdue: undefined,
      notDue: undefined,
      limitMembers: true,
      limitLabels: true,
      newCards: [],
      mode: 'or',
      autoCollapse: undefined,
    };
  }

  clear() {
    return this.save(this.default());
  }

  getBoard() {
    return this.board;
  }

  _resetNewCards() {
    this.newCardsWithoutIds = [];
    return this.save('newCards', []);
  }

  toggleQuietMode() {
    const memberId = Auth.myId();
    if (memberId == null) {
      return;
    }

    // Quiet Mode is the defaults, except that idMembers is set to you only
    const quietState = this.default();
    // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'never'.
    quietState.idMembers = [memberId];

    let isInQuietMode = true;
    for (const key in quietState) {
      // We don't have to worry about array ordering; all the arrays we're checking are
      // empty or contain one element
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      const value = quietState[key];
      if (isInQuietMode) {
        isInQuietMode = _.isEqual(this.get(key), value);
      }
    }

    if (isInQuietMode) {
      return this.clear();
    } else {
      this.save(quietState);
      if (this.isFiltering()) {
        showFlag({
          appearance: 'warning',
          title: intl.formatMessage({
            id: 'templates.shortcuts.q-shortcut-flag-description',
            defaultMessage:
              'Filters applied: only showing cards you are a member of.',
            description: 'Shows only cards where you are a member.',
          }),
          icon: <FilterIcon />,
          id: 'board-filters',
          isAutoDismiss: true,
          actions: [
            {
              content: intl.formatMessage({
                id: 'templates.shortcuts.clear-filters',
                defaultMessage: 'Clear filters',
                description: 'Button to reset or remove all applied filters.',
              }),
              onClick: () => {
                this.clear();
                dismissFlag({ id: 'board-filters' });
              },
              type: 'link',
            },
          ],
        });
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toggleIdLabel(idLabel: any) {
    return this.toggle('idLabels', idLabel);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toggleMember(idMember: any) {
    return this.toggle('idMembers', idMember);
  }

  addIdLabel(idLabel: string) {
    return this.addToSet('idLabels', idLabel);
  }

  addIdMember(idMember: string) {
    return this.addToSet('idMembers', idMember);
  }

  isFiltering() {
    return _.some([
      !_.isEmpty(this.get('idMembers')),
      !_.isEmpty(this.get('idLabels')),
      this.get('title')?.trim(),
      this.get('due') != null,
      this.get('dateLastActivity') != null,
      this.get('dueComplete') != null,
      this.get('overdue') != null,
      this.get('notDue') != null,
    ]);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  checkItemSatisfiesFilter(checkItem: any) {
    const card = checkItem.getCard();

    return satisfiesFilter(
      {
        idMembers: [checkItem.get('idMember')],
        idLabels: card.get('idLabels'),
        due: checkItem.get('due') ? new Date(checkItem.get('due')) : null,
        dateLastActivity: checkItem.get('dateLastActivity')
          ? new Date(checkItem.get('dateLastActivity'))
          : null,
        complete: checkItem.get('state') === 'complete',
        words: getWords(checkItem.get('name')),
      },
      this.toJSON(),
    );
  }
  satisfiesFilter(card: Card) {
    // Default to using the old imported satisfiesFilter logic until the logic behind this ff has been thoroughly tested
    let left, needle;
    if (card == null) {
      return false;
    }

    // cards in the archive are using CardView, so they could be filtered.
    // We want to always show them.
    if (card.get('closed')) {
      return true;
    }

    if (
      ((needle = card.id),
      Array.from((left = this.get('newCards')) != null ? left : []).includes(
        needle,
      )) ||
      Array.from(this.newCardsWithoutIds).includes(card)
    ) {
      return true;
    }

    const due = card.get('due');
    const dateLastActivity = card.get('dateLastActivity');
    return satisfiesFilter(
      {
        idMembers: card.get('idMembers'),
        idLabels: card.get('idLabels'),
        due: due ? new Date(due) : null,
        dateLastActivity: dateLastActivity ? new Date(dateLastActivity) : null,
        complete: card.get('dueComplete'),
        // @ts-expect-error Type 'unknown[]' is not assignable to type 'string[]'. ts(2322)
        words: _.chain([
          getWords(card.get('name')),
          getWords(card.get('idShort')?.toString()),
          card.getBoard().isCustomFieldsEnabled()
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              card.customFieldItemList.map((cfi: any) =>
                cfi.getFilterableWords(getWords),
              )
            : undefined,
        ])
          .compact()
          .flatten()
          .value(),
      },
      this.toJSON(),
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addNewCard(card: any) {
    this.newCardsWithoutIds.push(card);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.waitForId(card, (idCard: any) => {
      this.newCardsWithoutIds = _.without(this.newCardsWithoutIds, card);
      return this.addToSet('newCards', idCard);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isDueOptionActive(value: any) {
    switch (value) {
      case 'complete':
        return this.get('dueComplete') === true;
      case 'incomplete':
        return this.get('dueComplete') === false;
      case 'overdue':
        return this.get('overdue') === true;
      case 'notDue':
        return this.get('notDue') === true;
      default:
        return this.get('due') === value;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isActivityOptionActive(value: any) {
    return this.get('dateLastActivity') === value;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toJSON(param?: any) {
    if (param == null) {
      param = {};
    }
    const { board, expanded } = param;
    // @ts-expect-error TS(2556): A spread argument must either have a tuple type or... Remove this comment to see the full error message
    const json = super.toJSON(...arguments);

    if (board) {
      json.board = this.board.toJSON();
    }

    if (expanded) {
      let left, needle, needle1;
      const search = (left = this.get('title')) != null ? left : '';
      // for members, filter on @username and username
      const memberRe = new RegExp(
        `^${Util.escapeForRegex(search.replace(/^@/, ''))}`,
        'i',
      );
      const labelRe = new RegExp(`^${Util.escapeForRegex(search)}`, 'i');

      json.labels = _.chain(this.board.getLabels())
        .filter(
          (label) =>
            labelRe.test(label.get('color')) || labelRe.test(label.get('name')),
        )
        // @ts-expect-error TS(2345): Argument of type '(a: Label, b: Label) => number' ... Remove this comment to see the full error message
        .sort(Label.compare)
        .map((label) => {
          // eslint-disable-next-line @typescript-eslint/no-shadow
          let needle;
          return {
            ...label.toJSON(),
            isActive:
              ((needle = label.id),
              Array.from(this.get('idLabels')).includes(needle)),
          };
        })
        .unshift({
          id: ID_NONE,
          name: l(['filtering', NO_LABELS]),
          isActive:
            ((needle = ID_NONE),
            Array.from(this.get('idLabels')).includes(needle)),
        })
        .value();

      json.members = this.board.memberList
        .chain()
        .filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (member: any) =>
            (search === 'me' && Auth.isMe(member)) ||
            _.any(Util.getMemNameArray(member), (name) => memberRe.test(name)),
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((member: any) => {
          // eslint-disable-next-line @typescript-eslint/no-shadow
          let needle1;
          return {
            ...member.toJSON(),
            isActive:
              ((needle1 = member.id),
              Array.from(this.get('idMembers')).includes(needle1)),
          };
        })
        .value();

      json.members = sortMembers(json.members, Auth.me());
      json.members.unshift({
        id: ID_NONE,
        fullName: l(['filtering', 'no members']),
        initials: '?',
        isActive:
          ((needle1 = ID_NONE),
          Array.from(this.get('idMembers')).includes(needle1)),
      });

      json.activityOptions = _.keys(this.activityMap).map((time) => {
        return {
          time,
          desc: l(['activity filter', time]),
          isActive: this.isActivityOptionActive(time),
        };
      });

      json.dueOptions = _.keys(this.dueMap).map((time) => {
        return {
          time,
          desc: l(['due date filter', time]),
          isActive: this.isDueOptionActive(time),
        };
      });

      json.modes = _.keys(this.modeMap).map((mode) => {
        return {
          mode,
          desc: l(['filter mode', mode]),
          isActive: mode === this.get('mode'),
        };
      });
    }

    return json;
  }

  toQueryString() {
    if (this.isFiltering()) {
      let due, overdue, title, notDue, dateLastActivity;
      const filters = [];

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-shadow */
      const formatTitle = (title: any) =>
        title != null ? title.replace(/%/g, '%25') : undefined;

      if ((title = formatTitle(this.get('title')))) {
        filters.push(title);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.get('idLabels').forEach((idLabel: any) => {
        if (idLabel === ID_NONE) {
          return filters.push(`label:${idLabel}`);
        } else {
          const label = this.board.modelCache.get('Label', idLabel);
          if (label) {
            let name;
            if ((name = label.get('name'))) {
              return filters.push(`label:${encodeURIComponent(name)}`);
            } else {
              return filters.push(`label:${label.get('color')}`);
            }
          }
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.get('idMembers').forEach((idMember: any) => {
        if (idMember === ID_NONE) {
          return filters.push(`member:${idMember}`);
        } else {
          const member = this.board.modelCache.get('Member', idMember);
          if (member) {
            return filters.push(`member:${member.get('username')}`);
          }
        }
      });

      if ((dateLastActivity = this.get('dateLastActivity'))) {
        filters.push(`dateLastActivity:${dateLastActivity}`);
      }

      if ((due = this.get('due'))) {
        filters.push(`due:${due}`);
      }

      if ((overdue = this.get('overdue'))) {
        filters.push(`overdue:${overdue}`);
      }

      if ((notDue = this.get('notDue'))) {
        filters.push(`notDue:${notDue}`);
      }

      const dueComplete = this.get('dueComplete');

      if (typeof dueComplete === 'boolean') {
        filters.push(`dueComplete:${dueComplete}`);
      }

      if (this.get('mode') === 'and') {
        filters.push('mode:and');
      }

      if (this.get('autoCollapse')) {
        filters.push('autoCollapse:true');
      }

      // With filtering in the header, remove menu query arg since we don't want the menu to open anymore
      const queryObj = { filter: filters.join(',') };

      return (
        '?' +
        _.chain(queryObj)
          .pairs()
          .map(function (...args) {
            const [key, value] = Array.from(args[0]);
            return [key, value].join('=');
          })
          .join('&')
          .value()
      );
    } else {
      return '';
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fromQueryString(filter: any) {
    if (!filter) {
      return;
    }

    const idMembers = [];
    const idLabels = [];
    let dateLastActivity = undefined;
    let due = undefined;
    let overdue = undefined;
    let notDue = undefined;
    let dueComplete = undefined;
    let title = undefined;
    let autoCollapse = undefined;

    return (() => {
      const result = [];
      for (const entry of Array.from(filter.split(','))) {
        let needle, mode;
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        const [type, rawValue] = Array.from(entry.split(':'));
        // @ts-expect-error
        const value = rawValue ? urlDecode(rawValue) : '';

        switch (type) {
          case 'member':
            if (value === ID_NONE) {
              idMembers.push(value);
            } else {
              const member = this.board.modelCache.findOne(
                'Member',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (mem: any) => mem.get('username') === value,
              );

              if (member != null) {
                idMembers.push(member.id);
              }
            }
            break;

          case 'label':
            if (value === ID_NONE) {
              idLabels.push(value);
            } else {
              const label = this.board.labelList.find(
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-shadow */
                (label: any) =>
                  label
                    .get('name')
                    .toLowerCase()
                    .indexOf(value.toLowerCase()) === 0 ||
                  (label.get('name') === '' && label.get('color') === value),
              );

              if (label != null) {
                idLabels.push(label.id);
              }
            }
            break;

          case 'due': {
            if (
              ((needle = value),
              Array.from(_.keys(this.dueMap)).includes(needle))
            ) {
              due = value;
            }

            break;
          }

          case 'dateLastActivity': {
            if (
              ((needle = value),
              Array.from(_.keys(this.activityMap)).includes(needle))
            ) {
              dateLastActivity = value;
            }

            break;
          }

          case 'overdue': {
            if (value === 'true') {
              overdue = value;
            }
            break;
          }

          case 'notDue': {
            if (value === 'true') {
              notDue = value;
            }
            break;
          }

          case 'dueComplete': {
            if (value === 'true') {
              dueComplete = true;
            } else if (value === 'false') {
              dueComplete = false;
            }
            break;
          }

          case 'mode':
            if (value === 'and') {
              mode = 'and';
            }
            break;

          case 'autoCollapse':
            autoCollapse = value === 'true';
            break;

          default:
            // @ts-expect-error TS(2345): Argument of type 'unknown' is not assignable to pa... Remove this comment to see the full error message
            title = urlDecode(entry);
        }

        result.push(
          this.set({
            idMembers,
            idLabels,
            dateLastActivity,
            due,
            overdue,
            notDue,
            dueComplete,
            title,
            mode,
            autoCollapse,
          }),
        );
      }
      return result;
    })();
  }
}
