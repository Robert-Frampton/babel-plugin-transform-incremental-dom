var _incrementalDom = require("incremental-dom");

var _hasOwn = Object.prototype.hasOwnProperty;

var _forOwn = function _forOwn(object, iterator) {
  for (var prop in object) {
    if (_hasOwn.call(object, prop)) iterator(object[prop], prop);
  }
};

var _renderArbitrary = function _renderArbitrary(child) {
  var type = typeof child;

  if (type === "number" || type === "string" || type === "object" && child instanceof String) {
    (0, _incrementalDom.text)(child);
  } else if (Array.isArray(child)) {
    child.forEach(_renderArbitrary);
  } else if (type === "object") {
    if (child.__jsxDOMWrapper) {
      var func = child.func,
          args = child.args;

      if (args) {
        func.apply(this, args);
      } else {
        func();
      }
    } else if (String(child) === "[object Object]") {
      _forOwn(child, _renderArbitrary);
    }
  }
};

var _jsxWrapper = function _jsxWrapper(func, args) {
  return {
    __jsxDOMWrapper: true,
    func: func,
    args: args
  };
};

var _li$wrapper = function _li$wrapper() {
  (0, _incrementalDom.elementOpen)("li");
  (0, _incrementalDom.text)("x.text");
  return (0, _incrementalDom.elementClose)("li");
};

var todoItems = items.map(function (x) {
  return _jsxWrapper(_li$wrapper);
});

(0, _incrementalDom.patch)(container, function () {
  (0, _incrementalDom.elementOpen)("div");

  _renderArbitrary(todoItems);

  return (0, _incrementalDom.elementClose)("div");
});