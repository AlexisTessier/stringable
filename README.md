# Stringable

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

![Branch : master](https://img.shields.io/badge/Branch-master-blue.svg)
[![version](https://img.shields.io/badge/version-0.2.3-blue.svg)](https://github.com/AlexisTessier/stringable#readme)
[![npm version](https://badge.fury.io/js/stringable.svg)](https://badge.fury.io/js/stringable)

[![Build Status](https://travis-ci.org/AlexisTessier/stringable.svg?branch=master)](https://travis-ci.org/AlexisTessier/stringable)
[![Coverage Status](https://coveralls.io/repos/AlexisTessier/stringable/badge.svg?branch=master&service=github)](https://coveralls.io/github/AlexisTessier/stringable?branch=master)

[![Dependency Status](https://david-dm.org/AlexisTessier/stringable.svg)](https://david-dm.org/AlexisTessier/stringable)
[![devDependency Status](https://david-dm.org/AlexisTessier/stringable/dev-status.svg)](https://david-dm.org/AlexisTessier/stringable#info=devDependencies)

Stringify any values to got something which render well in a log

-   [Introduction](#introduction)
-   [Documentation](#documentation)
-   [License](#license)

## Introduction

### Why ?

You need to format as string a value that you ignore the type. However, in JS, some value doesn't have nice stringified version, and even sometimes, trying to stringify a value can throw an error. For example, if you try to stringify a Symbol using a string template like that:

```javascript
const aSymbol = Symbol('a'); console.log(`${aSymbol}`);
```

You will get an error like: "Cannot convert a Symbol value to a string". To avoid issues like this one, Stringable converts any value in a string which aims to be readable, verbose, and useful in dev mode.

### How to install ?

    npm i stringable

### How to use ?

```javascript
const stringable = require('stringable');

const loggableObject = stringable({ firstName: 'Will', lastName: 'Wheeler', age: 13 });

console.log(loggableObject);
// (object => {
//   firstName: (string => 'Will'),
//   lastName: (string => 'Wheeler'),
//   age: (number: integer => 13)
// })
```

This is a basic example. You can use stringable with any value like functions, array, Symbols and even Node instance from the DOM API. Some value however, maybe worth to have a better and/or more specific formatted version. Don't hesitate to open issues.

Eventually, if you don't like the default formatting of some values, you can create a variant of stringable passing a custom formatter function to it (see the documentation below). The formatter will receive some data about the value to format and just have to return the formated value as a string.

## Documentation

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

-   [stringable](#stringable)
-   [defaultFormatter](#defaultformatter)

### stringable

The function you get when requiring the stringable module. Formats a value.

**Parameters**

-   `value` **any** The value to format.
-   `formatter` **function (data: [object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)): [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The formatter to use in order to format the value. To create a custom one, look at the defaultFormatter documentation to see which data it will receive. (optional, default `defaultFormatter`)

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The value formatted using the formatter.

### defaultFormatter

Can't be required directly. The formatter used by default when using stringable. It formats a value from data provided by stringable.

**Parameters**

-   `data` **[object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** The data object sent to the formatter.
    -   `data.value` **any** The value to format.
    -   `data.type` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The value type from typeof operator.
    -   `data.stringifiedValue` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** A default and not optimal stringified version of the value.
    -   `data.isInteger` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** true if the value is an integer, else false.
    -   `data.isFloat` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** true if the value is a float, else false.
    -   `data.simpleQuoteString` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** If value is a string, this will be a representation of the string quotted with simple quotes.
    -   `data.doubleQuoteString` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** If value is a string, this will be a representation of the string quotted with double quotes.
    -   `data.defaultFormatter` **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** The default formatter used by stringable.
    -   `data.constructorName` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The name of the value constructor.
    -   `data.keys` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** The list of the value properties (or attributes names of the value is a DOM Node)
    -   `data.functionName` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The name of the function is the value is a function.
    -   `data.isAsync` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** true if the value is an async function, else false.
    -   `data.isGenerator` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** true if the value is a generator function (using the syntax function\*), else false.
    -   `data.isClass` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** true if the value is an es class, else false.
-   `parents` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)** Used internally. An array containing the owners objects of the value (if value is a property). (optional, default `[]`)
-   `deepness` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** Used internally. The displayed nesting indentation level. (optional, default `0`)
-   `useNestTab` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Used internally. If the nesting indentation must be used at this level. (optional, default `true`)

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The formatted value as a string.

## License

stringable is released under [MIT](http://opensource.org/licenses/MIT). 
Copyright (c) 2017-present [Alexis Tessier](https://github.com/AlexisTessier)
