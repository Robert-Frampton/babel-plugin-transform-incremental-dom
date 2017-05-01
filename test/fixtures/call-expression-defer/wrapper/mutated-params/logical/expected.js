var _jsxWrapper = function _jsxWrapper(func, args) {
  return {
    __jsxDOMWrapper: true,
    func: func,
    args: args
  };
};

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

var _div$wrapper = function _div$wrapper(_deferred, _b, _args, _deferred2, _b2, _args2) {
  elementOpen("div");

  _renderArbitrary(_b == 0 ? _deferred : _deferred(_args));

  _renderArbitrary(_b2 == 0 ? _deferred2 : _deferred2(_args2));

  return elementClose("div");
};

function render() {
  var _b = 0,
      _b2 = 0;

  var div = _jsxWrapper(_div$wrapper, [true && (_b = 1, fn), _b, _b == 1 ? i++ : null, true || (_b2 = 1, fn), _b2, _b2 == 1 ? i++ : null]);
  elementOpen("root");

  _renderArbitrary(div);

  return elementClose("root");
}