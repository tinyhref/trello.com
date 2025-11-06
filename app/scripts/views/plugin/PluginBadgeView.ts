/* eslint-disable
    eqeqeq,
*/
// This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import _ from 'underscore';

import { IconQuietColor } from '@trello/nachos/tokens';

import { teacupWithHelpers } from 'app/scripts/views/internal/teacupWithHelpers';
import { PluginView } from 'app/scripts/views/plugin/PluginView';

const t = teacupWithHelpers();

interface PluginBadge {
  icon?: string;
  text?: string;
  color?: string;
  monochrome?: boolean;
}

const template = t.renderable(function ({
  icon,
  text,
  iconColor,
  iconColorClass,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) {
  if (icon != null) {
    t.span(`.badge-icon.icon-sm.plugin-icon.plugin-badge${iconColorClass}`, {
      style: t.stylify({
        'background-image': t.urlify(
          t.addRecolorParam(icon, `?color=${iconColor}`),
        ),
      }),
    });
  }
  if (text) {
    return t.span('.badge-text', () => t.text(text));
  }
});

const colorClasses = {
  blue: 'plugin-color-blue',
  green: 'plugin-color-green',
  orange: 'plugin-color-orange',
  red: 'plugin-color-red',
  yellow: 'plugin-color-yellow',
  purple: 'plugin-color-purple',
  pink: 'plugin-color-pink',
  sky: 'plugin-color-sky',
  lime: 'plugin-color-lime',
  'light-gray': 'plugin-color-light-gray',
};

const allColorClasses = _.values(colorClasses).join(' ');

// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getColorClass = (color: any) => colorClasses[color];

interface PluginBadgeView {
  pluginBadge: PluginBadge;
}

class PluginBadgeView extends PluginView {
  static initClass() {
    this.prototype.tagName = 'div';
    // @ts-expect-error TS(2322): Type 'string' is not assignable to type '() => str... Remove this comment to see the full error message
    this.prototype.className = 'badge';
  }

  initialize({ pluginBadge }: { pluginBadge: PluginBadge }) {
    this.pluginBadge = pluginBadge;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderBadge(badge: any) {
    this.$el.html(template(badge));
    return this.$el;
  }

  render() {
    const badge = this.pluginBadge;
    const colorClass = getColorClass(badge.color);
    const useWhite = colorClass != null && badge.color !== 'light-gray';
    const iconColor = useWhite ? 'fff' : IconQuietColor.substr(1).toLowerCase();
    let iconColorClass = useWhite ? '.mod-invert' : '.mod-quiet';
    if (badge.monochrome === false) {
      iconColorClass = '.mod-reset';
    }

    // eslint-disable-next-line @trello/enforce-variable-case
    const $badge = this.renderBadge({
      ...badge,
      iconColor,
      iconColorClass,
    });
    // Remove any old colors
    $badge.removeClass(allColorClasses);
    if (colorClass != null) {
      $badge.addClass(colorClass);
    }

    return this;
  }

  // to avoid needing to remove and create brand new views
  // when updating a badge from cache, we allow it to be updated
  // in place and re-rendered
  updateBadge(badge: PluginBadge) {
    if (!_.isEqual(this.pluginBadge, badge)) {
      this.pluginBadge = badge;
      // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
      return this.render(badge);
    }
  }
}
PluginBadgeView.initClass();

export { PluginBadgeView };
