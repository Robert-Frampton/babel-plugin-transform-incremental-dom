var _jsxWrapper = function _jsxWrapper(func, args) {
  return {
    __jsxDOMWrapper: true,
    func: func,
    args: args
  };
};

var _div$wrapper = function _div$wrapper() {
  return elementVoid("div");
},
    _div$wrapper2 = function _div$wrapper2() {
  return elementVoid("div");
};

function render() {
  elementOpen("div");
  1;
  true && _jsxWrapper(_div$wrapper);
  text("2");
  1;
  false && _jsxWrapper(_div$wrapper2);
  text("2");
  return elementClose("div");
}