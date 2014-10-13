define(
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;

    __exports__["default"] = function(path, options) {
      var ctx, helperName = 'ivy-sortable';

      if (arguments.length === 1) {
        options = path;
        path = 'this';
      } else {
        helperName += ' ' + path;
      }

      options.hash.contentBinding = path;

      // can't rely on this default behavior when use strict
      ctx = this || window;

      options.helperName = options.helperName || helperName;

      return Ember.Handlebars.helpers.collection.call(ctx, 'ivy-sortable', options);
    }
  });