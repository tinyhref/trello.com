// eslint-disable-next-line no-restricted-imports
import $ from '@trello/jquery';

const WINDOW_MEDIUM = { width: 750 };
const WINDOW_LARGE = { width: 900 };
const WINDOW_EXTRA_LARGE = { width: 1280 };

export const WindowSize: {
  ranCalc: boolean;
  fExtraLarge: boolean;
  fLarge: boolean;
  fMedium: boolean;
  fSmall: boolean;
  calc: () => void;
  ensureRun: () => void;
} = {
  ranCalc: false,
  fExtraLarge: false,
  fLarge: false,
  fMedium: false,
  fSmall: false,

  calc() {
    this.ranCalc = true;
    const width = $(window).width() as number;

    this.fExtraLarge = this.fLarge = this.fMedium = this.fSmall = false;

    if (width > WINDOW_EXTRA_LARGE.width) {
      this.fExtraLarge = true;
    } else if (width > WINDOW_LARGE.width) {
      this.fLarge = true;
    } else if (width > WINDOW_MEDIUM.width) {
      this.fMedium = true;
    } else {
      this.fSmall = true;
    }

    return $(this).triggerHandler('windowClassChange');
  },

  ensureRun() {
    if (!this.ranCalc) {
      return this.calc();
    }
  },
};
