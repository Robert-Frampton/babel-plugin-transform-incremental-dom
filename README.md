# babel-plugin-incremental-dom [![Build Status](https://travis-ci.org/jridgewell/babel-plugin-incremental-dom.svg?branch=master)](https://travis-ci.org/jridgewell/babel-plugin-incremental-dom)

Turn JSX into [Incremental DOM](http://google.github.io/incremental-dom/).

## Example

**In**

```javascript
export default function render(data) {
    var header = data.conditional ? <div /> : null;
    var collection = data.items.map((item) => {
        return <li key={item.id} class={item.className}>{item.name}</li>;
    });

    return <div id="container">
        {header}
        <ul>{collection}</ul>
        <p {...data.props}>Some features</p>
    </div>;
}
```

**Out** (default, unoptimized options)

```javascript
export default function render(data) {
    var header = data.conditional ? _jsxWrapper(function () {
        return elementVoid("div");
    }) : null;
    var collection = data.items.map(function (item) {
        return _jsxWrapper(function (_item$id, _item$className, _item$name) {
            elementOpen("li", _item$id, ["key", _item$id], "class", _item$className);

            _renderArbitrary(_item$name);

            return elementClose("li");
        }, [item.id, item.className, item.name]);
    });

    elementOpen("div", null, ["id", "container"]);

    _renderArbitrary(header);

    elementOpen("ul");

    _renderArbitrary(collection);

    elementClose("ul");
    elementOpenStart("p");

    _forOwn(data.props, _attr);

    elementOpenEnd("p");
    text("Some features");
    elementClose("p");
    return elementClose("div");
}

var _jsxWrapper = function _jsxWrapper(func, args) {
    var wrapper = args ? function wrapper() {
        return func.apply(this, args);
    } : func;
    wrapper.__jsxDOMWrapper = true;
    return wrapper;
};

var _attr = function _attr(value, name) {
    attr(name, value);
};

var _hasOwn = Object.prototype.hasOwnProperty;

var _forOwn = function _forOwn(object, iterator) {
    for (var prop in object) {
        if (_hasOwn.call(object, prop)) iterator(object[prop], prop);
    }
};

var _renderArbitrary = function _renderArbitrary(child) {
    var type = typeof child;

    if (type === "number" || type === "string" || child && child instanceof String) {
        text(child);
    } else if (type === "function" && child.__jsxDOMWrapper) {
        child();
    } else if (Array.isArray(child)) {
        child.forEach(_renderArbitrary);
    } else {
        _forOwn(child, _renderArbitrary);
    }
};
```

## Installation

```sh
$ npm install babel-plugin-incremental-dom
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "presets": ["es2015"],
  "plugins": ["incremental-dom"]
}
```

Any of the [configuration options](#options) may also be passed.

### Via CLI

```sh
$ babel --plugins incremental-dom script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  "presets": ["es2015"],
  "plugins": ["incremental-dom"],
});
```

Any of the [configuration options](#options) may also be passed.

### Options

#### Require Statics Key

Incremental DOM [recommends](http://google.github.io/incremental-dom/#rendering-dom/statics-array)
only using static attribute arrays when a `key` is specified. For that
reason this plugin will automatically generate a UUID key if there is
not one and there are static attributes.

Alternatively, you may disable the automatic generation. In this case,
static attributes will be deoptimized into the dynamic attributes list.

```js
// Disabled (default)
var _statics = ["key", "key", "href", "http://key/specified"];
var _statics2 = ["key", "8ad02822-f391-48fb-a277-8065f7f92a99", "href", "http://example.com"];
var _statics3 = ["key", "adbe4414-e6ad-41c0-aae2-1ca578653119", "href", "http://other.com"];

function render() {
  elementVoid("a", "key", _statics);
  if (condition)
    elementVoid("a", "8ad02822-f391-48fb-a277-8065f7f92a99", _statics2);
  } else {
    elementVoid("a", "adbe4414-e6ad-41c0-aae2-1ca578653119", _statics3);
  }
}
```

```js
// Enabled
var _statics = ["key", "key", "href", "http://key/specified"];

function render(condition) {
  elementVoid("a", "key", _statics);
  if (condition)
    elementVoid("a", null, null, "href", "http://example.com");
  } else {
    elementVoid("a", null, null, "href", "http://other.com");
  }
}
```

To do this, simply add the `requireStaticsKey` option to the Incremental DOM
plugin:

```json
{
  "plugins": [[
    "incremental-dom", {
      "requireStaticsKey": true
    }
  ]]
}
```

#### Namspaced Attributes

Incremental DOM supports a few Attribute Namespaces, but those are
foreign to JSX. You can enabled them with the `namespaceAttributes`
option. Note that this does not enable Namespaced Elements.

```js
// Enabled
function render() {
    return elementVoid("a", null, ["xml:static", true], "xlink:href", "https");
}
```

To do this, simply add the `namespaceAttributes` option to the
Incremental DOM plugin:

```json
{
  "plugins": [[
    "incremental-dom", {
      "namespaceAttributes": true
    }
  ]]
}
```

#### Inline JSX Expressions

You may enable the experimental `inlineExpressions` option to attempt to
inline any variables declared outside the root JSX element. This can
save you from allocating needless closure wrappers around elements that
are only referenced inside the root element.


```js
// Disabled (default)
function render() {
  var header = _jsxWrapper(function () {
    return elementVoid("header");
  });
  elementOpen("body");

  _renderArbitrary(header);

  return elementClose("body");
}
```

```js
// Enabled
function render() {
  elementOpen("body");
  elementVoid("header");
  return elementClose("body");
}
```

To do this, simply add the `inlineExpressions` option to the Incremental DOM
plugin:

```json
{
  "plugins": [[
    "incremental-dom", {
      "inlineExpressions": true
    }
  ]]
}
```

#### Fast Root

You may enable the experimental `fastRoot` option so that JSX tags
inside the root element are never wrapped inside a closure. For code
with array maps, this should significantly decrease memory usage and
increase speed.


```js
// Disabled (default)
function render() {
  elementOpen("ul");

  _renderArbitrary(items.map(function (item) {
    return _jsxWrapper(function (_item$name) {
      elementOpen("li");

      _renderArbitrary(_item$name);

      return elementClose("li");
    }, [item.name]);
  }));

  return elementClose("ul");
}
```

```js
// Enabled
function render() {
  elementOpen("ul");

  items.map(function (item) {
    elementOpen("li");

    _renderArbitrary(item.name);

    return elementClose("li");
  });

  return elementClose("ul");
}
```

To do this, simply add the `fastRoot` option to the Incremental DOM
plugin:

```json
{
  "plugins": [[
    "incremental-dom", {
      "fastRoot": true
    }
  ]]
}
```


Alternatively, you may enable and disable this with inline comments:

```jsx
function render() {
    /**
     * Enable for this tree
     * @incremental-dom enable-fastRoot
     */
    return <div>{
      items.map(function(item) {
        return <li>{item.name}</li>;
      })
    }</div>;
}

/**
 * Enable for everything under this function
 * @incremental-dom enable-fastRoot
 */
function render() {
    /**
     * Disable fastroot for this tree
     * @incremental-dom disable-fastRoot
     */
    return <div>{
      items.map(function(item) {
        return <li>{item.name}</li>;
      })
    }</div>;
}
```

#### Components

You may enable the experimental `components` option so that JSX tags
that start with an upper case letter are passed as a reference to
incremental DOM calls, instead of as a string. This can be useful when
your code implements components through these kind of calls, though
that's not done by incremental DOM automatically. Note that this will
break unless you have code to handle it.


```js
// Disabled (default)
function render() {
  elementVoid("MyComponent");
}
```

```js
// Enabled
function render() {
  elementVoid(MyComponent);
}
```

To do this, simply add the `components` option to the Incremental DOM
plugin:

```json
{
  "plugins": [[
    "incremental-dom", {
      "components": true
    }
  ]]
}
```

#### Function Prefix

By deafult, `babel-plugin-incremental-dom` directly calls Incremental
DOM functions:

```js
// Disabled (default)
function render() {
  elementOpen("div");
  elementClose("div");
}
```

If you are instead including Incremental DOM via a browser script, it
may be easier to reference the functions from the `IncrementalDOM`
object:

```js
// Enabled with `IncrementalDOM`
function render() {
  IncrementalDOM.elementOpen("div");
  IncrementalDOM.elementClose("div");
}
```

To do this, simply add the `prefix` option to the Incremental DOM
plugin:

```json
{
  "plugins": [[
    "incremental-dom", {
      "prefix": "IncrementalDOM"
    }
  ]]
}
```

#### Runtime

By deafult, `babel-plugin-incremental-dom` injects several helpers into
each file as needed. When transforming multiple files with JSX, you can
avoid this helper duplication by specifying a runtime library to use
instead.

The runtime's required functions are:

- `attr`

  Not to be confused with IncrementalDOM's own `#attr` function, the
  runtime's `attr` must take in a `value` and `attrName` and call
  IncrementalDOM's `#attr`. Basically, it flip flops its parameters so
  that `IncrementalDOM#attr` can be used in a `Array#forEach` like
  method signature.

  ```js
  runtime.attr = function(value, attrName) {
    IncrementalDOM.attr(attrName, value);
  };
  ```

- `forOwn`

  No surprises here, this iterates over every enumerable-own property of
  `object`, calling `iterator` with the property's value and name.

  ```js
  runtime.forOwn = function(object, iterator) {
    var hasOwn = Object.prototype.hasOwnProperty;
    for (var prop in object) {
      if (hasOwn.call(object, prop)) {
        iterator(object[prop], prop);
      }
    }
  };
  ```

- `jsxWrapper`

  To prevent iDOM's incremental nature from screwing up our beautiful
  JSX syntax, certain elements must be wrapped in a function closure
  that will be later evaluated. That closure will be passed into
  `jsxWrapper`, along with an array of any (if any) arguments
  needed to render the contained JSX element.

  Note it is not `jsxWrapper`'s responsibility to create the JSX
  closure, merely to help identify the passed in closure later. Here, we
  set the `__jsxDOMWrapper` property of the returned closure.

  ```js
  runtime.jsxWrapper = function(elementClosure, args) {
    var wrapper = args ? function() {
      return elementClosure.apply(this, args);
    } : jsxClosure;
    wrapper.__jsxDOMWrapper = true;
    return wrapper;
  }
  ```

- `renderArbitrary`

  To render child elements correctly, we'll need to be able to identify
  them. `renderArbitrary` receives a `child`, and must call the
  appropriate action. For string and numbers, that's to call
  `IncrementalDOM#text`. For wrapped JSX Closures, that's to invoke the
  closure. For arrays, that's to render every element. And for objects,
  that's to render every property.

  Note that we identify JSX Closures by the `__jsxDOMWrapper` property
  we set inside the `jsxWrapper` runtime function.

  ```js
  runtime.renderArbitrary = function _renderArbitrary(child) {
    var type = typeof child;
    if (type === "number" || (type === string || type === 'object' && child instanceof String)) {
      text(child);
    } else if (type === "function" && child.__jsxDOMWrapper) {
      child();
    } else if (Array.isArray(child)) {
      child.forEach(_renderArbitrary);
    } else if (type === 'object' && String(child) === '[object Object]') {
      runtime.forOwn(child, _renderArbitrary);
    }
  }
  ```

To do this, simply add the `runtime` option to the Incremental DOM
plugin:

```json
{
  "plugins": [[
    "incremental-dom", {
      "runtime": "iDOMHelpers"
    }
  ]]
}
```
