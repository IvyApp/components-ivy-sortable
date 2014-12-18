(function() {;
var define, requireModule, require, requirejs;

(function() {

  var _isArray;
  if (!Array.isArray) {
    _isArray = function (x) {
      return Object.prototype.toString.call(x) === "[object Array]";
    };
  } else {
    _isArray = Array.isArray;
  }
  
  var registry = {}, seen = {}, state = {};
  var FAILED = false;

  define = function(name, deps, callback) {
  
    if (!_isArray(deps)) {
      callback = deps;
      deps     =  [];
    }
  
    registry[name] = {
      deps: deps,
      callback: callback
    };
  };

  function reify(deps, name, seen) {
    var length = deps.length;
    var reified = new Array(length);
    var dep;
    var exports;

    for (var i = 0, l = length; i < l; i++) {
      dep = deps[i];
      if (dep === 'exports') {
        exports = reified[i] = seen;
      } else {
        reified[i] = require(resolve(dep, name));
      }
    }

    return {
      deps: reified,
      exports: exports
    };
  }

  requirejs = require = requireModule = function(name) {
    if (state[name] !== FAILED &&
        seen.hasOwnProperty(name)) {
      return seen[name];
    }

    if (!registry[name]) {
      throw new Error('Could not find module ' + name);
    }

    var mod = registry[name];
    var reified;
    var module;
    var loaded = false;

    seen[name] = { }; // placeholder for run-time cycles

    try {
      reified = reify(mod.deps, name, seen[name]);
      module = mod.callback.apply(this, reified.deps);
      loaded = true;
    } finally {
      if (!loaded) {
        state[name] = FAILED;
      }
    }

    return reified.exports ? seen[name] : (seen[name] = module);
  };

  function resolve(child, name) {
    if (child.charAt(0) !== '.') { return child; }

    var parts = child.split('/');
    var nameParts = name.split('/');
    var parentBase;

    if (nameParts.length === 1) {
      parentBase = nameParts;
    } else {
      parentBase = nameParts.slice(0, -1);
    }

    for (var i = 0, l = parts.length; i < l; i++) {
      var part = parts[i];

      if (part === '..') { parentBase.pop(); }
      else if (part === '.') { continue; }
      else { parentBase.push(part); }
    }

    return parentBase.join('/');
  }

  requirejs.entries = requirejs._eak_seen = registry;
  requirejs.clear = function(){
    requirejs.entries = requirejs._eak_seen = registry = {};
    seen = state = {};
  };
})();

;define("ivy-sortable/helpers/ivy-sortable", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

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
;define("ivy-sortable/index", 
  ["ivy-sortable/views/ivy-sortable","ivy-sortable/helpers/ivy-sortable","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var IvySortableView = __dependency1__["default"];
    var ivySortableHelper = __dependency2__["default"];

    __exports__.IvySortableView = IvySortableView;
    __exports__.ivySortableHelper = ivySortableHelper;
  });
;define("ivy-sortable/views/ivy-sortable", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.CollectionView.extend(Ember.TargetActionSupport, {
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
  });
;/* global define, require */
define('ivy-sortable-shim', ['exports'], function(__exports__) {
  'use strict';
  __exports__['default'] = function(container) {
    container.register('helper:ivy-sortable', require('ivy-sortable/helpers/ivy-sortable')['default']);
    container.register('view:ivy-sortable', require('ivy-sortable/views/ivy-sortable')['default']);
  };
});
;/* global define, require, window */
var addonName = 'ivy-sortable';

define('ember', ['exports'], function(__exports__) {
  __exports__['default'] = window.Ember;
});

var index = addonName + '/index';
define(addonName, ['exports'], function(__exports__) {
  var library = require(index);
  Object.keys(library).forEach(function(key) {
    __exports__[key] = library[key];
  });
});

// Glue library to a global var
window.IvySortable = require(index);

// Register library items in the container
var shim = addonName + '-shim';
window.Ember.Application.initializer({
  name: shim,

  initialize: function(container) {
    require(shim)['default'](container);
  }
});
})();