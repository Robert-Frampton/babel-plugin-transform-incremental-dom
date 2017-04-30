var _hasOwn = Object.prototype.hasOwnProperty;

var _forOwn = function _forOwn(object, iterator) {
  for (var prop in object) {
    if (_hasOwn.call(object, prop)) iterator(object[prop], prop);
  }
};

var _renderArbitrary = function _renderArbitrary(child) {
  var type = typeof child;

  if (type === "number" || type === "string" || type === "object" && child instanceof String) {
    text(child);
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

function render() {
  elementOpen("ul");

  _renderArbitrary(true && files.map(function (file) {
    return elementVoid("span");
  }));

  _renderArbitrary(true ? files.map(function (file) {
    return elementVoid("span");
  }) : 1);

  1;

  _renderArbitrary(true ? files.map(function (file) {
    return elementVoid("span");
  }) : 1);

  _renderArbitrary(true && (1, files.map(function (file) {
    return elementVoid("span");
  })));

  _renderArbitrary(true ? true && files.map(function (file) {
    return elementVoid("span");
  }) : 1);

  return elementClose("ul");
}
