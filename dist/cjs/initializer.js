"use strict";
var IvySortableView = require("./views/ivy-sortable")["default"] || require("./views/ivy-sortable");
var ivySortableHelper = require("./helpers/ivy-sortable")["default"] || require("./helpers/ivy-sortable");

exports["default"] = {
  name: 'ivy-sortable',

  initialize: function(container) {
    container.register('helper:ivy-sortable', ivySortableHelper);
    container.register('view:ivy-sortable', IvySortableView);
  }
};