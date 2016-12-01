var _jsxWrapper = function _jsxWrapper(func, args) {
  var wrapper = args ? function wrapper() {
    return func.apply(this, args);
  } : func;
  wrapper.__jsxDOMWrapper = true;
  return wrapper;
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
  } else if (type === "function" && child.__jsxDOMWrapper) {
    child();
  } else if (Array.isArray(child)) {
    child.forEach(_renderArbitrary);
  } else if (type === "object" && String(child) === "[object Object]") {
    _forOwn(child, _renderArbitrary);
  }
};

var _wrapper = function _wrapper(_deferred, _args, _b, _deferred2, _args2, _b2) {
  elementOpen("div");

  _renderArbitrary(_b == 1 ? _deferred(_args[0]) : _deferred(_args[0], _args[1]));

  _renderArbitrary(_b2 == 1 ? _deferred2(_args2[0]) : _deferred2(_args2[0], _args2[1]));

  return elementClose("div");
};

function render() {
  var _b = 0,
      _b2 = 0;

  var div = _jsxWrapper(_wrapper, [true ? (_b = 1, fn) : (_b = 2, fn2), _b == 0 ? null : _b == 1 ? [a++] : [b++, c++], _b, fn(i++) ? (_b2 = 1, fn) : (_b2 = 2, fn2), _b2 == 0 ? null : _b2 == 1 ? [a++] : [b++, c++], _b2]);
  elementOpen("root");

  _renderArbitrary(div);

  return elementClose("root");
}