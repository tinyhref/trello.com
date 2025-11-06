/*!
 * jQuery UI Unique ID 1.13.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * Trello patch notes:
 * - Last sync with https://github.com/jquery/jquery-ui/blob/main/ui/unique-id.js on Jan 25, 2022
 */

//>>label: uniqueId
//>>group: Core
//>>description: Functions to generate and remove uniqueId's
//>>docs: http://api.jqueryui.com/uniqueId/

(function (factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery', './version'], factory);
  } else {
    // Browser globals
    factory(jQuery);
  }
})(function ($) {
  'use strict';

  return $.fn.extend({
    uniqueId: (function () {
      var uuid = 0;

      return function () {
        return this.each(function () {
          if (!this.id) {
            this.id = 'ui-id-' + ++uuid;
          }
        });
      };
    })(),

    removeUniqueId: function () {
      return this.each(function () {
        if (/^ui-id-\d+$/.test(this.id)) {
          $(this).removeAttr('id');
        }
      });
    },
  });
});
