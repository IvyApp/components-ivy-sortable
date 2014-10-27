define(
  ["./views/ivy-sortable","./helpers/ivy-sortable","./initializer","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var IvySortableView = __dependency1__["default"] || __dependency1__;
    var ivySortableHelper = __dependency2__["default"] || __dependency2__;
    var initializer = __dependency3__["default"] || __dependency3__;

    __exports__.IvySortableView = IvySortableView;
    __exports__.initializer = initializer;
    __exports__.ivySortableHelper = ivySortableHelper;
  });