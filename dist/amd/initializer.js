define(
  ["./views/ivy-sortable","./helpers/ivy-sortable","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var IvySortableView = __dependency1__["default"] || __dependency1__;
    var ivySortableHelper = __dependency2__["default"] || __dependency2__;

    __exports__["default"] = {
      name: 'ivy-sortable',

      initialize: function(container) {
        container.register('helper:ivy-sortable', ivySortableHelper);
        container.register('view:ivy-sortable', IvySortableView);
      }
    };
  });