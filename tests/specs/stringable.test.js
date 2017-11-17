'use strict';

const assert = require('assert');

const test = require('ava');

const randomstring = require("randomstring");

const requireFromIndex = require('../utils/require-from-index');

test('Type and API', t => {
	const stringable = requireFromIndex('sources/stringable');
	const stringableFromIndex = requireFromIndex('index');

	t.is(stringableFromIndex, stringable);
	t.is(typeof stringable, 'function');
});

function defaultFormatterMacro(t, {input, expectedResult}) {
	assert(typeof expectedResult === 'string');

	const stringable = requireFromIndex('sources/stringable');

	const result = stringable(input);

	t.is(typeof result, 'string');
	t.is(result, expectedResult)
}

defaultFormatterMacro.title = providedTitle => providedTitle;

function customFormatterDataMacro(t, {input, defaultFormatterExpectedResult, expectedData}) {
	assert(typeof defaultFormatterExpectedResult === 'string');
	assert(typeof expectedData === 'object');

	const stringable = requireFromIndex('sources/stringable');

	const customFormatterDataKeys = [
		'constructorName',
		'defaultFormatter',
		'doubleQuoteStringified',
		'isFloat',
		'isInteger',
		'name',
		'simpleQuoteStringified',
		'type',
		'value'
	];

	const testDataKeys = customFormatterDataKeys.filter(key => ![
		'defaultFormatter', 'value'
	].includes(key));

	t.plan(6+(testDataKeys.length*3));

	testDataKeys.forEach(key => {
		t.true(key in expectedData, `expectedData test missing for key ${key}`);
	});

	Object.keys(expectedData).forEach(key => {
		t.true(testDataKeys.includes(key), `expectedData provides unexpected key ${key}`);
	});

	const randomResult = randomstring.generate();

	const result = stringable(input, data => {
		t.is(typeof data, 'object');
		t.deepEqual(Object.keys(data).sort(), customFormatterDataKeys.sort());

		t.is(data.value, input);
		t.is(data.type, expectedData.type);
		t.is(data.isInteger, expectedData.isInteger);
		t.is(data.isFloat, expectedData.isFloat);
		t.is(data.simpleQuoteStringified, expectedData.simpleQuoteStringified);
		t.is(data.doubleQuoteStringified, expectedData.doubleQuoteStringified);
		t.is(data.constructorName, expectedData.constructorName);
		t.is(data.name, expectedData.name);

		t.is(typeof data.defaultFormatter, 'function');
		t.is(data.defaultFormatter(data), defaultFormatterExpectedResult);

		return randomResult;
	});

	t.is(result, randomResult);
}

customFormatterDataMacro.title = providedTitle => (
	`${providedTitle} - custom formatter`
);

/*-------------------*/



/*- literal string -*/

test('usage with literal string', defaultFormatterMacro, {
	input: `42 Literal string value 42`,
	expectedResult: `(string => '42 Literal string value 42')`
});

test('usage with literal string', customFormatterDataMacro, {
	input: `42 Literal string value 42`,
	defaultFormatterExpectedResult: `(string => '42 Literal string value 42')`,
	expectedData: {
		type: 'string',
		isInteger: false,
		isFloat: false,
		simpleQuoteStringified: `'42 Literal string value 42'`,
		doubleQuoteStringified: `"42 Literal string value 42"`,
		constructorName: 'String',
		name: null
	}
});

test('usage with literal empty string', defaultFormatterMacro, {
	input: ``,
	expectedResult: `(string => '')`
});

test('usage with literal empty string', customFormatterDataMacro, {
	input: ``,
	defaultFormatterExpectedResult: `(string => '')`,
	expectedData: {
		type: 'string',
		isInteger: false,
		isFloat: false,
		simpleQuoteStringified: `''`,
		doubleQuoteStringified: `""`,
		constructorName: 'String',
		name: null
	}
});

test('usage with literal blank string', defaultFormatterMacro, {
	input: `	 `,
	expectedResult: `(string => '	 ')`
});

test('usage with literal blank string', customFormatterDataMacro, {
	input: ` 	  `,
	defaultFormatterExpectedResult: `(string => ' 	  ')`,
	expectedData: {
		type: 'string',
		isInteger: false,
		isFloat: false,
		simpleQuoteStringified: `' 	  '`,
		doubleQuoteStringified: `" 	  "`,
		constructorName: 'String',
		name: null
	}
});

/*- literal number -*/

test('usage with literal Integer', defaultFormatterMacro, {
	input: 42,
	expectedResult: `(number: Integer => 42)`
});

test('usage with literal Integer', customFormatterDataMacro, {
	input: 43,
	defaultFormatterExpectedResult: `(number: Integer => 43)`,
	expectedData: {
		type: 'number',
		isInteger: true,
		isFloat: false,
		simpleQuoteStringified: `43`,
		doubleQuoteStringified: `43`,
		constructorName: 'Number',
		name: null
	}
});

test('usage with literal Float without decimal', defaultFormatterMacro, {
	input: 30.,
	expectedResult: `(number: Integer => 30)`
});

test('usage with literal Float without decimal', customFormatterDataMacro, {
	input: 3.,
	defaultFormatterExpectedResult: `(number: Integer => 3)`,
	expectedData: {
		type: 'number',
		isInteger: true,
		isFloat: false,
		simpleQuoteStringified: `3`,
		doubleQuoteStringified: `3`,
		constructorName: 'Number',
		name: null
	}
});

test('usage with literal Float with only zero decimal', defaultFormatterMacro, {
	input: 21.00000,
	expectedResult: `(number: Integer => 21)`
});

test('usage with literal Float with only zero decimal', customFormatterDataMacro, {
	input: 8.0000,
	defaultFormatterExpectedResult: `(number: Integer => 8)`,
	expectedData: {
		type: 'number',
		isInteger: true,
		isFloat: false,
		simpleQuoteStringified: `8`,
		doubleQuoteStringified: `8`,
		constructorName: 'Number',
		name: null
	}
});

test('usage with literal Float', defaultFormatterMacro, {
	input: 30.9,
	expectedResult: `(number: Float => 30.9)`
});

test('usage with literal Float', customFormatterDataMacro, {
	input: 47.8,
	defaultFormatterExpectedResult: `(number: Float => 47.8)`,
	expectedData: {
		type: 'number',
		isInteger: false,
		isFloat: true,
		simpleQuoteStringified: `47.8`,
		doubleQuoteStringified: `47.8`,
		constructorName: 'Number',
		name: null
	}
});

test('usage with literal Float without unit', defaultFormatterMacro, {
	input: .2,
	expectedResult: `(number: Float => 0.2)`
});

test('usage with literal Float without unit', customFormatterDataMacro, {
	input: .8,
	defaultFormatterExpectedResult: `(number: Float => 0.8)`,
	expectedData: {
		type: 'number',
		isInteger: false,
		isFloat: true,
		simpleQuoteStringified: `0.8`,
		doubleQuoteStringified: `0.8`,
		constructorName: 'Number',
		name: null
	}
});

test('usage with literal Float without unit and zero as decimal', defaultFormatterMacro, {
	input: .0,
	expectedResult: `(number: Integer => 0)`
});

test('usage with literal Float without unit and zero as decimal', customFormatterDataMacro, {
	input: .0,
	defaultFormatterExpectedResult: `(number: Integer => 0)`,
	expectedData: {
		type: 'number',
		isInteger: true,
		isFloat: false,
		simpleQuoteStringified: `0`,
		doubleQuoteStringified: `0`,
		constructorName: 'Number',
		name: null
	}
});

test('usage with literal Float without unit and lot of zero as decimal', defaultFormatterMacro, {
	input: .000000,
	expectedResult: `(number: Integer => 0)`
});

test('usage with literal Float without unit and lot of zero as decimal', customFormatterDataMacro, {
	input: .000000,
	defaultFormatterExpectedResult: `(number: Integer => 0)`,
	expectedData: {
		type: 'number',
		isInteger: true,
		isFloat: false,
		simpleQuoteStringified: `0`,
		doubleQuoteStringified: `0`,
		constructorName: 'Number',
		name: null
	}
});

test('usage with literal Float without unit and lot of zero as unit and decimal', defaultFormatterMacro, {
	input: 0.000000,
	expectedResult: `(number: Integer => 0)`
});

test('usage with literal Float without unit and lot of zero as unit and decimal', customFormatterDataMacro, {
	input: 0.000000,
	defaultFormatterExpectedResult: `(number: Integer => 0)`,
	expectedData: {
		type: 'number',
		isInteger: true,
		isFloat: false,
		simpleQuoteStringified: `0`,
		doubleQuoteStringified: `0`,
		constructorName: 'Number',
		name: null
	}
});

test('usage with literal Float with lot of decimal', defaultFormatterMacro, {
	input: 23.99834,
	expectedResult: `(number: Float => 23.99834)`
});

test('usage with literal Float with lot of decimal', customFormatterDataMacro, {
	input: 23.9913428839644,
	defaultFormatterExpectedResult: `(number: Float => 23.9913428839644)`,
	expectedData: {
		type: 'number',
		isInteger: false,
		isFloat: true,
		simpleQuoteStringified: `23.9913428839644`,
		doubleQuoteStringified: `23.9913428839644`,
		constructorName: 'Number',
		name: null
	}
});

test('usage with literal NaN', defaultFormatterMacro, {
	input: NaN,
	expectedResult: `(number => NaN)`
});

test('usage with literal NaN', customFormatterDataMacro, {
	input: NaN,
	defaultFormatterExpectedResult: `(number => NaN)`,
	expectedData: {
		type: 'number',
		isInteger: false,
		isFloat: false,
		simpleQuoteStringified: `NaN`,
		doubleQuoteStringified: `NaN`,
		constructorName: 'Number',
		name: null
	}
});

test('usage with computed NaN', defaultFormatterMacro, {
	input: 0/0,
	expectedResult: `(number => NaN)`
});

test('usage with computed NaN', customFormatterDataMacro, {
	input: 0/0,
	defaultFormatterExpectedResult: `(number => NaN)`,
	expectedData: {
		type: 'number',
		isInteger: false,
		isFloat: false,
		simpleQuoteStringified: `NaN`,
		doubleQuoteStringified: `NaN`,
		constructorName: 'Number',
		name: null
	}
});

test('usage with literal Infinity', defaultFormatterMacro, {
	input: Infinity,
	expectedResult: `(number => Infinity)`
});

test('usage with literal Infinity', customFormatterDataMacro, {
	input: Infinity,
	defaultFormatterExpectedResult: `(number => Infinity)`,
	expectedData: {
		type: 'number',
		isInteger: false,
		isFloat: false,
		simpleQuoteStringified: `Infinity`,
		doubleQuoteStringified: `Infinity`,
		constructorName: 'Number',
		name: null
	}
});

test('usage with computed Infinity', defaultFormatterMacro, {
	input: 1/0,
	expectedResult: `(number => Infinity)`
});

test('usage with computed Infinity', customFormatterDataMacro, {
	input: 2/0,
	defaultFormatterExpectedResult: `(number => Infinity)`,
	expectedData: {
		type: 'number',
		isInteger: false,
		isFloat: false,
		simpleQuoteStringified: `Infinity`,
		doubleQuoteStringified: `Infinity`,
		constructorName: 'Number',
		name: null
	}
});

test('usage with literal negative Infinity', defaultFormatterMacro, {
	input: -Infinity,
	expectedResult: `(number => -Infinity)`
});

test('usage with literal negative Infinity', customFormatterDataMacro, {
	input: -Infinity,
	defaultFormatterExpectedResult: `(number => -Infinity)`,
	expectedData: {
		type: 'number',
		isInteger: false,
		isFloat: false,
		simpleQuoteStringified: `-Infinity`,
		doubleQuoteStringified: `-Infinity`,
		constructorName: 'Number',
		name: null
	}
});

test('usage with computed negative Infinity', defaultFormatterMacro, {
	input: -1/0,
	expectedResult: `(number => -Infinity)`
});

test('usage with computed negative Infinity', customFormatterDataMacro, {
	input: -4/0,
	defaultFormatterExpectedResult: `(number => -Infinity)`,
	expectedData: {
		type: 'number',
		isInteger: false,
		isFloat: false,
		simpleQuoteStringified: `-Infinity`,
		doubleQuoteStringified: `-Infinity`,
		constructorName: 'Number',
		name: null
	}
});

/*- literal boolean -*/

test('usage with literal boolean true', defaultFormatterMacro, {
	input: true,
	expectedResult: `(boolean => true)`
});

test('usage with literal boolean true', customFormatterDataMacro, {
	input: true,
	defaultFormatterExpectedResult: `(boolean => true)`,
	expectedData: {
		type: 'boolean',
		isInteger: false,
		isFloat: false,
		simpleQuoteStringified: `true`,
		doubleQuoteStringified: `true`,
		constructorName: 'Boolean',
		name: null
	}
});

test('usage with literal boolean true', defaultFormatterMacro, {
	input: false,
	expectedResult: `(boolean => false)`
});

test('usage with literal boolean true', customFormatterDataMacro, {
	input: false,
	defaultFormatterExpectedResult: `(boolean => false)`,
	expectedData: {
		type: 'boolean',
		isInteger: false,
		isFloat: false,
		simpleQuoteStringified: `false`,
		doubleQuoteStringified: `false`,
		constructorName: 'Boolean',
		name: null
	}
});

/*- literal regexp -*/

test('usage with literal empty RegExp', defaultFormatterMacro, {
	input: /$^/,
	expectedResult: `(object: RegExp => /$^/)`
});
test('usage with literal empty RegExp', customFormatterDataMacro, {
	input: /$^/,
	defaultFormatterExpectedResult: `(object: RegExp => /$^/)`,
	expectedData: {
		type: 'object',
		isInteger: false,
		isFloat: false,
		simpleQuoteStringified: `/$^/`,
		doubleQuoteStringified: `/$^/`,
		constructorName: `RegExp`,
		name: null
	}
});

test('usage with literal not empty RegExp', defaultFormatterMacro, {
	input: /regex\.content/,
	expectedResult: `(object: RegExp => /regex\\.content/)`
});
test('usage with literal not empty RegExp', customFormatterDataMacro, {
	input: /regex\.content-test/,
	defaultFormatterExpectedResult: `(object: RegExp => /regex\\.content-test/)`,
	expectedData: {
		type: 'object',
		isInteger: false,
		isFloat: false,
		simpleQuoteStringified: `/regex\\.content-test/`,
		doubleQuoteStringified: `/regex\\.content-test/`,
		constructorName: `RegExp`,
		name: null
	}
});

/*- literal function -*/

test('usage with literal named function without parameters', defaultFormatterMacro, {
	input: function funcNameTest() {
		const t = 42;
		return t;
	},
	expectedResult: `(function => funcNameTest() { ... })`
});
test('usage with literal named function without parameters', customFormatterDataMacro, {
	input: function funcNameTestFormatter() {
		const t = 45;
		return t+42;
	},
	defaultFormatterExpectedResult: `(function => funcNameTestFormatter() { ... })`,
	expectedData: {
		type: 'function',
		isInteger: false,
		isFloat: false,
		simpleQuoteStringified: `funcNameTestFormatter() { ... }`,
		doubleQuoteStringified: `funcNameTestFormatter() { ... }`,
		constructorName: `Function`,
		name: 'funcNameTestFormatter'
	}
});

test('usage with literal named function with one parameter', defaultFormatterMacro, {
	input: function funcNameTestParamOne(arg) {
		const t = 42;
		return t+arg;
	},
	expectedResult: `(function => funcNameTestParamOne(arg) { ... })`
});
test('usage with literal named function with one parameter', customFormatterDataMacro, {
	input: function funcNameTestFormatter(arg) {
		const t = 15;
		return arg+t+42;
	},
	defaultFormatterExpectedResult: `(function => funcNameTestFormatter(arg) { ... })`,
	expectedData: {
		type: 'function',
		isInteger: false,
		isFloat: false,
		simpleQuoteStringified: `funcNameTestFormatter(arg) { ... }`,
		doubleQuoteStringified: `funcNameTestFormatter(arg) { ... }`,
		constructorName: `Function`,
		name: 'funcNameTestFormatter'
	}
});

test.skip('usage with literal named function with one parameter and default value', defaultFormatterMacro, {
	input: function funcNameTestParamOne(arg) {
		const t = 42;
		return t+arg;
	},
	expectedResult: `(function => funcNameTestParamOne(arg) { ... })`
});
test.skip('usage with literal named function with one parameter and default value', customFormatterDataMacro, {
	input: function funcNameTestFormatter() {
		const t = 45;
		return t+42;
	},
	defaultFormatterExpectedResult: `(function => funcNameTestFormatter() { ... })`,
	expectedData: {
		type: 'function',
		isInteger: false,
		isFloat: false,
		simpleQuoteStringified: `funcNameTestFormatter() { ... }`,
		doubleQuoteStringified: `funcNameTestFormatter() { ... }`,
		constructorName: `Function`,
		name: 'funcNameTestFormatter'
	}
});

test.skip('usage with literal named function with parameters', defaultFormatterMacro, {
	input: function funcNameTest() {
		const t = 42;
		return t;
	},
	expectedResult: `(function => funcNameTest() { ... })`
});
test.skip('usage with literal named function with parameters', customFormatterDataMacro, {
	input: function funcNameTestFormatter() {
		const t = 45;
		return t+42;
	},
	defaultFormatterExpectedResult: `(function => funcNameTestFormatter() { ... })`,
	expectedData: {
		type: 'function',
		isInteger: false,
		isFloat: false,
		simpleQuoteStringified: `funcNameTestFormatter() { ... }`,
		doubleQuoteStringified: `funcNameTestFormatter() { ... }`,
		constructorName: `Function`,
		name: 'funcNameTestFormatter'
	}
});

test.skip('usage with literal named function with parameters and default values', defaultFormatterMacro, {
	input: function funcNameTest() {
		const t = 42;
		return t;
	},
	expectedResult: `(function => funcNameTest() { ... })`
});
test.skip('usage with literal named function with parameters and default values', customFormatterDataMacro, {
	input: function funcNameTestFormatter() {
		const t = 45;
		return t+42;
	},
	defaultFormatterExpectedResult: `(function => funcNameTestFormatter() { ... })`,
	expectedData: {
		type: 'function',
		isInteger: false,
		isFloat: false,
		simpleQuoteStringified: `funcNameTestFormatter() { ... }`,
		doubleQuoteStringified: `funcNameTestFormatter() { ... }`,
		constructorName: `Function`,
		name: 'funcNameTestFormatter'
	}
});

test.skip('usage with literal anonymous function', defaultFormatterMacro, {
	input: function funcNameTest2() {
		const t = 44;
		return t*t;
	},
	expectedResult: `(object: RegExp => /regex\\.content/)`
});
test.todo('usage with literal anonymous function - custom formatter');

test.todo('usage with literal arrow function');
test.todo('usage with literal arrow function - custom formatter');

test.todo('usage with literal async function');
test.todo('usage with literal async function - custom formatter');

test.todo('usage with literal async arrow function');
test.todo('usage with literal async arrow function - custom formatter');

test.todo('usage with literal generator function');
test.todo('usage with literal generator function - custom formatter');

test.todo('FOR FUNCTION TYPE, ADD THE WITH AND WITHOUT PARAMETERS VARIANTS');

/*- literal falsy values -*/

test('usage with literal null', defaultFormatterMacro, {
	input: null,
	expectedResult: `(object => null)`
});
test('usage with literal null', customFormatterDataMacro, {
	input: null,
	defaultFormatterExpectedResult: `(object => null)`,
	expectedData: {
		type: 'object',
		isInteger: false,
		isFloat: false,
		simpleQuoteStringified: `null`,
		doubleQuoteStringified: `null`,
		constructorName: null,
		name: null
	}
});

test('usage with literal undefined', defaultFormatterMacro, {
	input: undefined,
	expectedResult: `(undefined)`
});
test('usage with literal undefined', customFormatterDataMacro, {
	input: undefined,
	defaultFormatterExpectedResult: `(undefined)`,
	expectedData: {
		type: 'undefined',
		isInteger: false,
		isFloat: false,
		simpleQuoteStringified: `undefined`,
		doubleQuoteStringified: `undefined`,
		constructorName: null,
		name: null
	}
});

/*- Object string -*/

test.todo('usage with instance of String');
test.todo('usage with instance of String - custom formatter');

/*- Object number -*/

test.todo('usage with instance of Number');
test.todo('usage with instance of Number - custom formatter');

test.todo('usage with instance of Number (integer)');
test.todo('usage with instance of Number (integer) - custom formatter');

test.todo('usage with instance of Number (float)');
test.todo('usage with instance of Number (float) - custom formatter');

/*- Object boolean -*/

test.todo('usage with instance of Boolean');
test.todo('usage with instance of Boolean - custom formatter');

/*- Object RegExp -*/

test.todo('usage with instance of RegExp');
test.todo('usage with instance of RegExp - custom formatter');

/*- Object function -*/

test.todo('usage with instance of Function');
test.todo('usage with instance of Function - custom formatter');

/*- Object symbol -*/

test.todo('usage with instance of Symbol');
test.todo('usage with instance of Symbol - custom formatter');

/*- literal array -*/

test.todo('usage with literal empty Array');
test.todo('usage with literal empty Array - custom formatter');

test.todo('usage with literal Array containing literal string');
test.todo('usage with literal Array containing literal string - custom formatter');

test.todo('usage with literal Array containing literal strings');
test.todo('usage with literal Array containing literal strings - custom formatter');

test.todo('usage with literal Array containing literal number');
test.todo('usage with literal Array containing literal number - custom formatter');

test.todo('usage with literal Array containing literal numbers');
test.todo('usage with literal Array containing literal numbers - custom formatter');

test.todo('usage with literal Array containing literal boolean true');
test.todo('usage with literal Array containing literal booleans true - custom formatter');

test.todo('usage with literal Array containing literal boolean false');
test.todo('usage with literal Array containing literal booleans false - custom formatter');

test.todo('LIST ALL ARRAY POSSIBLE CONTENT');

test.todo('usage with literal Array containing various type of content');
test.todo('usage with literal Array containing various type of content- custom formatter');

/*- literal object -*/

test.todo('usage with literal Object');
test.todo('usage with literal Object - custom formatter');

/*- Object array -*/

test.todo('usage with instance of Array');
test.todo('usage with instance of Array - custom formatter');

/*- Object -*/

test.todo('usage with instance of Object');
test.todo('usage with instance of Object - custom formatter');

test.todo('usage with instance of custom class');
test.todo('usage with instance of custom class - custom formatter');

/*- errors handling -*/

test.todo('usage with no parameters - throws error');