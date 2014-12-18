!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),(f.ivy||(f.ivy={})).sortable=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

exports["default"] = function(path, options) {
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
},{}],2:[function(_dereq_,module,exports){
"use strict";
var IvySortableView = _dereq_("./views/ivy-sortable")["default"] || _dereq_("./views/ivy-sortable");
var ivySortableHelper = _dereq_("./helpers/ivy-sortable")["default"] || _dereq_("./helpers/ivy-sortable");

exports["default"] = {
  name: 'ivy-sortable',

  initialize: function(container) {
    container.register('helper:ivy-sortable', ivySortableHelper);
    container.register('view:ivy-sortable', IvySortableView);
  }
};
},{"./helpers/ivy-sortable":1,"./views/ivy-sortable":4}],3:[function(_dereq_,module,exports){
"use strict";
var IvySortableView = _dereq_("./views/ivy-sortable")["default"] || _dereq_("./views/ivy-sortable");
var ivySortableHelper = _dereq_("./helpers/ivy-sortable")["default"] || _dereq_("./helpers/ivy-sortable");
var initializer = _dereq_("./initializer")["default"] || _dereq_("./initializer");

exports.IvySortableView = IvySortableView;
exports.initializer = initializer;
exports.ivySortableHelper = ivySortableHelper;
},{"./helpers/ivy-sortable":1,"./initializer":2,"./views/ivy-sortable":4}],4:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

exports["default"] = Ember.CollectionView.extend(Ember.TargetActionSupport, {
  disabled: false,

  tagName: 'ul',

  destroySortable: Ember.on('willDestroyElement', function() {
    this.removeObserver('disabled', this, this._disabledDidChange);

    this.$().sortable('destroy');
  }),

  initSortable: Ember.on('didInsertElement', function() {
    var opts = {};

    Ember.EnumerableUtils.forEach(['start', 'update'], function(callback) {
      opts[callback] = Ember.run.bind(this, callback);
    }, this);

    this.$().sortable(opts);

    this.addObserver('disabled', this, this._disabledDidChange);
    this._disabledDidChange();
  }),

  move: function(oldIndex, newIndex) {
    var content = this.get('content');

    if (content) {
      var item = content.objectAt(oldIndex);

      this._disableArrayObservers(content, function() {
        content.removeAt(oldIndex);
        content.insertAt(newIndex, item);
      });

      this.sendAction('moved', item, oldIndex, newIndex);
    }
  },

  /**
   * Copied from `Ember.Component`. Read the `sendAction` documentation there
   * for more information.
   *
   * @method sendAction
   */
  sendAction: function(action) {
    var actionName;
    var contexts = Array.prototype.slice.call(arguments, 1);

    if (action === undefined) {
      actionName = this.get('action');
      Ember.assert('The default action was triggered on the component ' + this.toString() +
                   ', but the action name (' + actionName + ') was not a string.',
                   Ember.isNone(actionName) || typeof actionName === 'string');
    } else {
      actionName = this.get(action);
      Ember.assert('The ' + action + ' action was triggered on the component ' +
                   this.toString() + ', but the action name (' + actionName +
                   ') was not a string.',
                   Ember.isNone(actionName) || typeof actionName === 'string');
    }

    // If no action name for that action could be found, just abort.
    if (actionName === undefined) { return; }

    this.triggerAction({
      action: actionName,
      actionContext: contexts
    });
  },

  start: function(event, ui) {
    ui.item.data('oldIndex', ui.item.index());
  },

  targetObject: Ember.computed(function() {
    var parentView = this.get('_parentView');
    return parentView ? parentView.get('controller') : null;
  }).property('_parentView'),

  update: function(event, ui) {
    var oldIndex = ui.item.data('oldIndex');
    var newIndex = ui.item.index();

    this.move(oldIndex, newIndex);
  },

  _disableArrayObservers: function(content, callback) {
    content.removeArrayObserver(this);
    try {
      callback.call(this);
    } finally {
      content.addArrayObserver(this);
    }
  },

  _disabledDidChange: function() {
    this.$().sortable(this.get('disabled') ? 'disable' : 'enable');
  }
});
},{}]},{},[3])
(3)
});