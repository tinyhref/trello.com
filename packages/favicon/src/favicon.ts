// eslint-disable-next-line no-restricted-imports
import Bluebird from 'bluebird';
import { debounce } from 'underscore';

import { supportsDynamicFavicon } from '@trello/browser';

import { drawFavicon } from './drawFavicon';

interface FaviconSettings {
  url?: string | null;
  color?: string;
  bottomColor?: string;
  topColor?: string;
  hasNotifications?: boolean;
  tiled?: boolean;
}

export const FavIcon = new (class {
  settings: FaviconSettings;
  constructor() {
    this.settings = {
      color: '#0055CC',
      hasNotifications: false,
    };
    this._update = debounce(this._update, 100).bind(this);
  }

  _update() {
    if (!supportsDynamicFavicon()) {
      return;
    }

    return Bluebird.try(() => {
      if (this.settings.url) {
        return new Bluebird((resolve, reject) => {
          const img = document.createElement('img');
          img.setAttribute('crossorigin', 'anonymous');
          img.onload = () => resolve(img);
          img.onerror = (err) => reject(err);
          img.src = `${this.settings.url}?favicon`;
          return img;
        });
      }
    })
      .then((img) => {
        const href = drawFavicon(img as HTMLImageElement, this.settings);
        document.getElementById('favicon')?.remove();

        const link = document.createElement('link');

        link.setAttribute('id', 'favicon');
        link.setAttribute('rel', 'icon');
        link.setAttribute('type', 'image/png');
        link.setAttribute('sizes', '64x64');
        link.setAttribute('href', href);

        document.head.appendChild(link);
      })
      .catch(function () {});
  }

  setNotifications(hasNotifications: boolean) {
    this.settings.hasNotifications = hasNotifications;

    return this._update();
  }

  setBackground({ url, tiled, color, topColor, bottomColor }: FaviconSettings) {
    this.settings.url = url;
    this.settings.tiled = tiled;
    this.settings.color = color;
    this.settings.topColor = topColor;
    this.settings.bottomColor = bottomColor;

    return this._update();
  }

  resetBackground() {
    this.settings.url = undefined;
    this.settings.tiled = undefined;
    this.settings.color = undefined;
    this.settings.topColor = undefined;
    this.settings.bottomColor = undefined;

    return this._update();
  }
})();
