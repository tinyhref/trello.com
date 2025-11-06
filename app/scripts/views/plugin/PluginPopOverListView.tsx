/* eslint-disable
    eqeqeq,
*/
// This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

// eslint-disable-next-line no-restricted-imports
import Bluebird from 'bluebird';
import _ from 'underscore';

// eslint-disable-next-line no-restricted-imports
import $ from '@trello/jquery';
import type { KeyString } from '@trello/keybindings';
import { getKey, Key } from '@trello/keybindings';
import { buildFuzzyMatcher } from '@trello/strings';

import { isValidUrlForIframe } from 'app/scripts/lib/plugins/pluginValidators';
import { Util } from 'app/scripts/lib/util';
import { debounceSignal } from 'app/scripts/lib/util/debounce-signal';
import { teacupWithHelpers } from 'app/scripts/views/internal/teacupWithHelpers';
import { PopOver } from 'app/scripts/views/lib/PopOver';
import { PluginView } from 'app/scripts/views/plugin/PluginView';
import { stopPropagationAndPreventDefault } from 'app/src/stopPropagationAndPreventDefault';

const t = teacupWithHelpers('plugin_popover');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const outerTemplate = t.renderable(function (content: any) {
  if (content == null) {
    content = {};
  }
  const { showSearch, search } = content;

  if (search && showSearch) {
    t.input('.js-search.js-autofocus', {
      type: 'text',
      placeholder: search.placeholder,
    });
  }

  t.div('.js-results');
});

const resultsTemplate = t.renderable(function ({
  search,
  noSearchResults,
  items,
  selectedIndex,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) {
  if (noSearchResults) {
    t.p('.empty.plugin-pop-over-search-empty', function () {
      if (search.empty) {
        t.text(search.empty);
      } else {
        t.format('no results');
      }
    });
  }

  t.ul('.pop-over-list.js-list.navigable', function () {
    // @ts-expect-error TS(2339): Property 'text' does not exist on type 'unknown'.
    for (const { text, index, callback, url } of Array.from(items)) {
      const selected = index === selectedIndex;
      t.li({ class: t.classify({ selected }) }, function () {
        const linkOpts = (() => {
          if (callback != null) {
            return { 'data-index': index };
          } else if (url != null && isValidUrlForIframe(url)) {
            return {
              href: url,
              rel: 'noreferrer nofollow noopener',
              target: url,
            };
          }
        })();

        t.a(linkOpts, function () {
          t.text(text);
        });
      });
    }
  });
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const searchingTemplate = t.renderable(function (param: any) {
  if (param == null) {
    param = {};
  }
  const { search } = param;
  return t.p('.quiet.plugin-pop-over-search-searching', function () {
    if (search?.searching) {
      t.text(search.searching);
    } else {
      t.format('searching');
    }
  });
});

interface PluginPopOverListView {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $el: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _outstandingSearch: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchText: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  title: any;
}

class PluginPopOverListView extends PluginView {
  static initClass() {
    // @ts-expect-error TS(2339): Property 'keepInDOM' does not exist on type 'Plugi... Remove this comment to see the full error message
    this.prototype.keepInDOM = true;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialize({ title, content }: any) {
    this.title = title;
    this.content = content;
    this.retain(this.content);

    return (this.searchText = this.slot(''));
  }

  getViewTitle() {
    return this.title;
  }

  events() {
    return {
      // @ts-expect-error TS(7023): ''click a[data-index]'' implicitly has return type... Remove this comment to see the full error message
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      'click a[data-index]'(e: any) {
        let item;
        // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
        const index = parseInt($(e.currentTarget).attr('data-index'), 10);
        // @ts-expect-error TS(2339): Property 'content' does not exist on type '{ 'clic... Remove this comment to see the full error message
        if (_.isFunction(this.content.items)) {
          // @ts-expect-error TS(2339): Property 'content' does not exist on type '{ 'clic... Remove this comment to see the full error message
          item = this.content.searchResults[index];
        } else {
          // @ts-expect-error TS(2339): Property 'content' does not exist on type '{ 'clic... Remove this comment to see the full error message
          item = this.content.items[index];
        }
        return item.callback({
          el: e.currentTarget,
        });
      },

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      'click a[href]'(e: any) {
        return PopOver.hide();
      },

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      'input .js-search'(e: any): any {
        // @ts-expect-error TS(2339): Property 'searchText' does not exist on type '{ 'c... Remove this comment to see the full error message
        return this.searchText.set($(e.currentTarget).val());
      },

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      'mouseenter li'(e: any): any {
        return Util.selectMenuItem(
          // @ts-expect-error TS(2339): Property '$el' does not exist on type '{ 'click a[... Remove this comment to see the full error message
          $('.js-list', this.$el),
          'li',
          $(e.currentTarget),
        );
      },

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      keydown(e: any) {
        const key = getKey(e);
        // @ts-expect-error TS(2339): Property '$el' does not exist on type '{ 'click a[... Remove this comment to see the full error message
        const $list = $('.js-list', this.$el);

        if (([Key.ArrowUp, Key.ArrowDown] as KeyString[]).includes(key)) {
          stopPropagationAndPreventDefault(e);
          Util.navMenuList($list, 'li', key);
        } else if (([Key.Enter, Key.Tab] as KeyString[]).includes(key)) {
          stopPropagationAndPreventDefault(e);
          $list.find('li.selected a').click();
        }
      },
    };
  }

  renderOnce() {
    const isDynamicSearch = _.isFunction(this.content.items);

    this.$el.html(
      outerTemplate({
        search: this.content.search,
        showSearch:
          this.content.search &&
          (isDynamicSearch ||
            this.content.items.length > this.content.search.count),
      }),
    );

    const $results = this.$el.find('.js-results');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getItems = (searchText: any) => {
      return Bluebird.try(() => {
        if (isDynamicSearch) {
          return this.content.items({
            options: {
              search: searchText,
            },
          });
        } else {
          let { items } = this.content;
          // @ts-expect-error TS(7006): Parameter 'item' implicitly has an 'any' type.
          items = items.map((item, index) => ({
            ...item,
            index,
          }));

          if (this.content.search) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let limit: any;
            if (searchText) {
              const satisfiesFilter = buildFuzzyMatcher(searchText);
              items = items.filter(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ({ text, alwaysVisible }: any) =>
                  alwaysVisible || satisfiesFilter(text),
              );
            }

            if ((limit = this.content.search?.count) != null) {
              let filterCount = 0;
              items = _.filter(items, function (item, index) {
                if (item.alwaysVisible) {
                  return true;
                } else if (filterCount < limit) {
                  filterCount++;
                  return true;
                } else {
                  return false;
                }
              });
            }
          }

          return items;
        }
      }).then((items) => {
        if (isDynamicSearch) {
          // @ts-expect-error TS(7006): Parameter 'item' implicitly has an 'any' type.
          this.content.searchResults = items.map((item, index) => ({
            ...item,
            index,
          }));
          this.retain(this.content.searchResults);
          return this.content.searchResults;
        } else {
          return items;
        }
      });
    };

    if (this.content.search) {
      let debounceDelay = 300;
      if (
        _.isFinite(this.content.search.debounce) &&
        this.content.search.debounce > debounceDelay
      ) {
        // only allow the debounce to be increased, not decreased
        debounceDelay = this.content.search.debounce;
      }
      const debouncedSearch = debounceSignal(this.searchText, debounceDelay);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.subscribe(debouncedSearch, (searchText: any) => {
        $results.html(searchingTemplate({ search: this.content.search }));

        if (this._outstandingSearch != null) {
          // we have an outstanding search request that we should cancel
          this._outstandingSearch.cancel();
        }

        // @ts-expect-error TS(2339): Property 'cancellable' does not exist on type 'Blu... Remove this comment to see the full error message
        this._outstandingSearch = getItems(searchText).cancellable();

        return (
          this._outstandingSearch
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .then((items: any) => {
              this._outstandingSearch = null;
              const noSearchResults = !_.any(
                items,
                ({ alwaysVisible }) => !alwaysVisible,
              );
              const selectedIndex = items[0]?.index ?? -1;
              return $results.html(
                resultsTemplate({
                  search: this.content.search,
                  noSearchResults,
                  items,
                  selectedIndex,
                }),
              );
            })
            .catch(Bluebird.CancellationError, () => {
              // Expected if another search is started before this one finishes
            })
        );
      });
    } else {
      $results.html(searchingTemplate());

      // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
      getItems().then((allItems) =>
        $results.html(resultsTemplate({ items: allItems, selectedIndex: 0 })),
      );
    }

    return this;
  }
}
PluginPopOverListView.initClass();
export { PluginPopOverListView };
