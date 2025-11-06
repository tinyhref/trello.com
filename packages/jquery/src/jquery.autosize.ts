// Adapted from Autosize v1.18.18
// license: MIT
// http://www.jacklmoore.com/autosize
interface AutosizeOptions {
  append: string;
  resizeDelay: number;
  placeholder: boolean;
}

const defaults: AutosizeOptions = {
  append: '\n',
  resizeDelay: 10,
  placeholder: true,
};

// line-height is conditionally included because IE7/IE8/old Opera do not return the correct value.
const typographyStyles = [
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'letter-spacing',
  'text-transform',
  'word-spacing',
  'text-indent',
  'white-space',
];

export const addAutosizePlugin = ($: JQueryStatic) => {
  // to keep track which textarea is being mirrored when adjust() is called.
  let mirrored: HTMLTextAreaElement | null;

  // the mirror element, which is used to calculate what size the mirrored element should be.
  const mirror = document.createElement('textarea');
  mirror.setAttribute('tabindex', '-1');
  mirror.dataset.autosize = 'true';

  // border:0 is unnecessary, but avoids a bug in Firefox on OSX
  mirror.style.cssText =
    'position:absolute; top:-999px; left:0; right:auto; bottom:auto; border:0; padding: 0; box-sizing:content-box; word-wrap:break-word; height:0 !important; min-height:0 !important; overflow:hidden; transition:none;';

  // test that line-height can be accurately copied.
  mirror.style.lineHeight = '99px';
  if (mirror.style.lineHeight === '99px') {
    typographyStyles.push('line-height');
  }
  mirror.style.lineHeight = '';

  $.fn.extend({
    autosize(this: JQuery, options: AutosizeOptions) {
      if (this.length <= 0) {
        // no objects in query
        return this;
      }

      options = { ...defaults, ...options };

      if (mirror.parentNode !== document.body) {
        document.body.append(mirror);
      }

      return this.each(function () {
        const ta = this as HTMLTextAreaElement;
        const taStyle = window.getComputedStyle(ta);
        const originalStyles: { [key: string]: string } = {
          height: ta.style.height,
          overflow: ta.style.overflow,
          overflowY: ta.style.overflowY,
          wordWrap: ta.style.wordWrap,
          resize: ta.style.resize,
        };
        let maxHeight: number;
        let boxHeightOffset = 0;
        let windowResizeTimeout: number;
        let clientWidth = ta.clientWidth; // used for window resize events
        const innerHeight =
          ta.clientHeight -
          parseFloat(taStyle.paddingTop) -
          parseFloat(taStyle.paddingBottom);

        if (ta.dataset.autosize === 'true') {
          // exit if autosize has already been applied, or if the textarea is the mirror element.
          return;
        }
        ta.dataset.autosize = 'true';

        if (taStyle.boxSizing === 'border-box') {
          boxHeightOffset = ta.offsetHeight - innerHeight;
        }

        // IE8 and lower return 'auto', which parses to NaN, if no min-height is set.
        const minHeight = Math.max(
          parseFloat(taStyle.minHeight) - boxHeightOffset || 0,
          innerHeight,
        );

        ta.style.overflow = 'hidden';
        ta.style.overflowY = 'hidden';
        ta.style.wordWrap = 'break-word'; // horizontal overflow is hidden, so break-word is necessary for handling words longer than the textarea width

        if (taStyle.resize === 'vertical') {
          ta.style.resize = 'none';
        } else if (taStyle.resize === 'both') {
          ta.style.resize = 'horizontal';
        }

        // getComputedStyle is preferred here because it preserves sub-pixel values, while jQuery's .width() rounds to an integer.
        function setWidth() {
          // eslint-disable-next-line @typescript-eslint/no-shadow
          const taStyle = window.getComputedStyle(ta);
          let widthDelta = 0;

          if (taStyle.boxSizing === 'border-box') {
            widthDelta =
              parseFloat(taStyle.paddingLeft) +
              parseFloat(taStyle.paddingRight) +
              parseFloat(taStyle.borderLeftWidth) +
              parseFloat(taStyle.borderRightWidth);
          }

          const width = parseFloat(taStyle.width) - widthDelta;
          mirror.style.width = Math.max(width, 0) + 'px';
        }

        function initMirror() {
          // eslint-disable-next-line @typescript-eslint/no-shadow
          const taStyle = window.getComputedStyle(ta);

          mirrored = ta;
          maxHeight = parseFloat(taStyle.maxHeight) || 0; // maxHeight is sometimes 'none'

          // mirror is a duplicate textarea located off-screen that
          // is automatically updated to contain the same text as the
          // original textarea.  mirror always has a height of 0.
          // This gives a cross-browser supported way getting the actual
          // height of the text, through the scrollTop property.
          typographyStyles.forEach((val) => {
            mirror.style.setProperty(val, taStyle.getPropertyValue(val));
          });

          mirror.setAttribute('wrap', ta.getAttribute('wrap') || '');

          setWidth();

          // Chrome-specific fix:
          // When the textarea y-overflow is hidden, Chrome doesn't reflow the text to account for the space
          // made available by removing the scrollbar. This workaround triggers the reflow for Chrome.
          // @ts-expect-error
          if (window.chrome) {
            const width = ta.style.width;
            ta.style.width = '0px';
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            ta.offsetWidth; // called to trigger the reflow
            ta.style.width = width;
          }
        }

        // Using mainly bare JS in this function because it is going
        // to fire very often while typing, and needs to very efficient.
        function adjust() {
          if (mirrored !== ta) {
            initMirror();
          } else {
            setWidth();
          }

          if (!ta.value && options.placeholder) {
            // If the textarea is empty, copy the placeholder text into
            // the mirror control and use that for sizing so that we
            // don't end up with placeholder getting trimmed.
            mirror.value = ta.getAttribute('placeholder') || '';
          } else {
            mirror.value = ta.value;
          }

          mirror.value += options.append || '';
          mirror.style.overflowY = ta.style.overflowY;
          const originalHeight = parseFloat(ta.style.height) || 0;

          mirror.scrollTop = 9e4;

          // Using scrollTop rather than scrollHeight because scrollHeight is non-standard and includes padding.
          let height = mirror.scrollTop;

          if (maxHeight && height > maxHeight) {
            ta.style.overflowY = 'scroll';
            height = maxHeight;
          } else {
            ta.style.overflowY = 'hidden';
            if (height < minHeight) {
              height = minHeight;
            }
          }

          height += boxHeightOffset;

          if (Math.abs(originalHeight - height) > 1 / 100) {
            ta.style.height = height + 'px';
          }
        }

        function onWindowResize() {
          clearTimeout(windowResizeTimeout);
          windowResizeTimeout = window.setTimeout(function () {
            const newWidth = ta.clientWidth;

            if (newWidth !== clientWidth) {
              clientWidth = newWidth;
              adjust();
            }
          }, options.resizeDelay);
        }

        function onAutosizeDestroy() {
          mirrored = null;
          clearTimeout(windowResizeTimeout);

          window.removeEventListener('resize', onWindowResize);

          ta.removeEventListener('input', adjust);

          // jquery needed here in order to support current manual triggering
          $(ta).off('autosize.resize', adjust);
          $(ta).off('autosize.destroy', onAutosizeDestroy);

          // reset to original styles
          for (const key in originalStyles) {
            ta.style.setProperty(key, originalStyles[key]);
          }

          // remove autosized indicator
          ta.dataset.autosize = undefined;
        }

        ta.addEventListener('input', adjust);
        window.addEventListener('resize', onWindowResize);

        // Event for manual triggering if needed.
        // Should only be needed when the value of the textarea is changed through JavaScript rather than user input.
        // jquery needed here in order to support current manual triggering
        $(ta).on('autosize.resize', adjust);
        $(ta).on('autosize.destroy', onAutosizeDestroy);

        // Call adjust in case the textarea already contains text.
        adjust();
      });
    },
  });
};
