// This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import _ from 'underscore';

import { token } from '@trello/theme';

import {
  isValidUrlForIframe,
  isValidUrlForImage,
} from 'app/scripts/lib/plugins/pluginValidators';
import { teacupWithHelpers } from 'app/scripts/views/internal/teacupWithHelpers';

const t = teacupWithHelpers('plugin_chrome');

// based on https://stackoverflow.com/a/3943023
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shouldUseLightText = function (color: any) {
  const [cR, cG, cB] = Array.from(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    color.match(/[0-9a-f]{2}/gi).map(function (hex: any) {
      const component = parseInt(hex, 16) / 255;
      if (component <= 0.03928) {
        return component / 12.92;
      } else {
        return Math.pow((component + 0.055) / 1.055, 2.4);
      }
    }),
  );

  // @ts-expect-error
  const luminance = 0.2126 * cR + 0.7152 * cG + 0.0722 * cB;
  return luminance <= 0.4623475;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderAction = function (action: any) {
  const clickable =
    _.isFunction(action.callback) || isValidUrlForIframe(action.url);
  const target = isValidUrlForIframe(action.url) ? action.url : '#';
  const anchorProps = {
    class: t.classify({ inactive: !clickable }),
    'data-index': action.index,
    href: target,
    rel: 'noreferrer nofollow noopener',
    target,
    title: action.alt,
  };
  return t.a('.plugin-chrome-header-action', anchorProps, () =>
    t.img('.plugin-action-icon', { height: '16', src: action.icon }),
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PluginChromeHeaderTemplate = t.renderable(function (content: any) {
  let { accentColor } = content;
  const { title, actions } = content;
  if (content.type !== 'iframe') {
    return;
  }

  // if no accentColor was provided by the developer, we default to the global color theme
  // and let the design tokens do their work. If an accent color was provided,
  // we override other colors based on the provided accent color and ignore the global theme.
  let useLightOverride = false;
  let useDarkOverride = false;
  if (!accentColor || !/^#[a-fA-F0-9]{6}$/.test(accentColor)) {
    accentColor = token('color.background.accent.gray.subtlest', '#F1F2F4');
  } else {
    if (shouldUseLightText(accentColor)) {
      useLightOverride = true;
    } else {
      useDarkOverride = true;
    }
  }

  const validActions = _.chain(actions)
    .filter((a) => isValidUrlForImage(a.icon))
    .map((a) => ({ ...a, index: actions.indexOf(a) }))
    .groupBy('position')
    .value();

  let leftActions = validActions.left?.slice(0, 3) || [];
  const rightActions = validActions.right?.slice(0, 1) || [];

  if (rightActions.length === 1) {
    leftActions = leftActions.slice(0, 2);
  }

  return t.div(
    '.plugin-chrome-header',
    { style: `background-color: ${accentColor};` },
    function () {
      t.div('.plugin-chrome-header-left-actions', () =>
        leftActions.map(renderAction),
      );
      t.span(
        '.plugin-chrome-title',
        {
          class: t.classify({
            light: useLightOverride,
            dark: useDarkOverride,
          }),
        },
        () => t.text(title),
      );
      return t.div('.plugin-chrome-header-right-actions', function () {
        rightActions.map(renderAction);
        return t.a(
          '.plugin-chrome-close-button.icon-lg.icon-close.js-close-plugin-chrome',
          {
            class: t.classify({
              light: useLightOverride,
              dark: useDarkOverride,
            }),
            href: '#',
          },
        );
      });
    },
  );
});
