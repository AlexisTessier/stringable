'use strict';

const assert = require('assert');

const test = require('ava');

const randomstring = require(`randomstring`);

const msg = require('@alexistessier/msg');

const requireFromIndex = require('../utils/require-from-index');

const asyncSupport = process.version.indexOf('v8') === 0;

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
		'defaultFormatter',
		'value',
		'type',
		'stringifiedValue',
		'isInteger',
		'isFloat',
		'simpleQuoteString',
		'doubleQuoteString',
		'constructorName',
		'functionName',
		'isAsync',
		'isMethod',
		'isArrowFunction'
	];

	const testDataKeys = customFormatterDataKeys.filter(key => ![
		'defaultFormatter', 'value'
	].includes(key));

	t.plan(7+testDataKeys.length);

	t.deepEqual(Object.keys(expectedData), testDataKeys);

	const randomResult = randomstring.generate();

	const result = stringable(input, data => {
		t.is(typeof data, 'object');
		t.deepEqual(Object.keys(data).sort(), customFormatterDataKeys.sort());

		t.is(typeof data.defaultFormatter, 'function');
		t.is(data.defaultFormatter(data), defaultFormatterExpectedResult);

		t.is(data.value, input);

		t.is(data.type, expectedData.type);
		t.is(data.stringifiedValue, expectedData.stringifiedValue);
		t.is(data.isInteger, expectedData.isInteger);
		t.is(data.isFloat, expectedData.isFloat);
		t.is(data.simpleQuoteString, expectedData.simpleQuoteString);
		t.is(data.doubleQuoteString, expectedData.doubleQuoteString);
		t.is(data.constructorName, expectedData.constructorName);
		t.is(data.functionName, expectedData.functionName);
		t.is(data.isAsync, expectedData.isAsync);
		t.is(data.isMethod, expectedData.isMethod);
		t.is(data.isArrowFunction, expectedData.isArrowFunction);

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
		stringifiedValue: `"42 Literal string value 42"`,
		isInteger: false,
		isFloat: false,
		simpleQuoteString: `'42 Literal string value 42'`,
		doubleQuoteString: `"42 Literal string value 42"`,
		constructorName: 'String',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
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
		stringifiedValue: '""',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: `''`,
		doubleQuoteString: `""`,
		constructorName: 'String',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
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
		stringifiedValue: `" \\t  "`,
		isInteger: false,
		isFloat: false,
		simpleQuoteString: `' 	  '`,
		doubleQuoteString: `" 	  "`,
		constructorName: 'String',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
	}
});

test('usage with literal string containing simple quotes', defaultFormatterMacro, {
	input: `42 'quoted string' valu'e`,
	expectedResult: `(string => '42 \\'quoted string\\' valu\\'e')`
});

test('usage with literal string containing simple quotes', customFormatterDataMacro, {
	input: `42 'quoted string' value`,
	defaultFormatterExpectedResult: `(string => '42 \\'quoted string\\' value')`,
	expectedData: {
		type: 'string',
		stringifiedValue: `"42 'quoted string' value"`,
		isInteger: false,
		isFloat: false,
		simpleQuoteString: `'42 \\'quoted string\\' value'`,
		doubleQuoteString: `"42 'quoted string' value"`,
		constructorName: 'String',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
	}
});

test('usage with literal string containing double quotes', defaultFormatterMacro, {
	input: `42 "quoted string" valu"e`,
	expectedResult: `(string => '42 "quoted string" valu"e')`
});

test('usage with literal string containing double quotes', customFormatterDataMacro, {
	input: `42 "quoted string" value`,
	defaultFormatterExpectedResult: `(string => '42 "quoted string" value')`,
	expectedData: {
		type: 'string',
		stringifiedValue: `"42 \\"quoted string\\" value"`,
		isInteger: false,
		isFloat: false,
		simpleQuoteString: `'42 "quoted string" value'`,
		doubleQuoteString: `"42 \\"quoted string\\" value"`,
		constructorName: 'String',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
	}
});

/*- literal number -*/

test('usage with literal Integer', defaultFormatterMacro, {
	input: 42,
	expectedResult: `(number: integer => 42)`
});
test('usage with literal Integer', customFormatterDataMacro, {
	input: 43,
	defaultFormatterExpectedResult: `(number: integer => 43)`,
	expectedData: {
		type: 'number',
		stringifiedValue: '43',
		isInteger: true,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
	}
});

test('usage with literal negative Integer', defaultFormatterMacro, {
	input: -27,
	expectedResult: `(number: integer => -27)`
});
test('usage with literal negative Integer', customFormatterDataMacro, {
	input: -43,
	defaultFormatterExpectedResult: `(number: integer => -43)`,
	expectedData: {
		type: 'number',
		stringifiedValue: '-43',
		isInteger: true,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
	}
});

test('usage with literal positive Integer', defaultFormatterMacro, {
	input: +2,
	expectedResult: `(number: integer => 2)`
});
test('usage with literal positive Integer', customFormatterDataMacro, {
	input: +38,
	defaultFormatterExpectedResult: `(number: integer => 38)`,
	expectedData: {
		type: 'number',
		stringifiedValue: '38',
		isInteger: true,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
	}
});

test('usage with literal Float without decimal', defaultFormatterMacro, {
	input: 30.,
	expectedResult: `(number: integer => 30)`
});

test('usage with literal Float without decimal', customFormatterDataMacro, {
	input: 3.,
	defaultFormatterExpectedResult: `(number: integer => 3)`,
	expectedData: {
		type: 'number',
		stringifiedValue: '3',
		isInteger: true,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
	}
});

test('usage with literal Float with only zero decimal', defaultFormatterMacro, {
	input: 21.00000,
	expectedResult: `(number: integer => 21)`
});

test('usage with literal Float with only zero decimal', customFormatterDataMacro, {
	input: 8.0000,
	defaultFormatterExpectedResult: `(number: integer => 8)`,
	expectedData: {
		type: 'number',
		stringifiedValue: '8',
		isInteger: true,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
	}
});

test('usage with literal Float', defaultFormatterMacro, {
	input: 30.9,
	expectedResult: `(number: float => 30.9)`
});
test('usage with literal Float', customFormatterDataMacro, {
	input: 47.8,
	defaultFormatterExpectedResult: `(number: float => 47.8)`,
	expectedData: {
		type: 'number',
		stringifiedValue: '47.8',
		isInteger: false,
		isFloat: true,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
	}
});

test('usage with literal negative Float', defaultFormatterMacro, {
	input: -33.2,
	expectedResult: `(number: float => -33.2)`
});
test('usage with literal negative Float', customFormatterDataMacro, {
	input: -75.873,
	defaultFormatterExpectedResult: `(number: float => -75.873)`,
	expectedData: {
		type: 'number',
		stringifiedValue: '-75.873',
		isInteger: false,
		isFloat: true,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
	}
});

test('usage with literal positive Float', defaultFormatterMacro, {
	input: +33.2,
	expectedResult: `(number: float => 33.2)`
});
test('usage with literal positive Float', customFormatterDataMacro, {
	input: +75.873,
	defaultFormatterExpectedResult: `(number: float => 75.873)`,
	expectedData: {
		type: 'number',
		stringifiedValue: '75.873',
		isInteger: false,
		isFloat: true,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
	}
});

test('usage with literal Float without unit', defaultFormatterMacro, {
	input: .2,
	expectedResult: `(number: float => 0.2)`
});

test('usage with literal Float without unit', customFormatterDataMacro, {
	input: .8,
	defaultFormatterExpectedResult: `(number: float => 0.8)`,
	expectedData: {
		type: 'number',
		stringifiedValue: '0.8',
		isInteger: false,
		isFloat: true,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
	}
});

test('usage with literal Float without unit and zero as decimal', defaultFormatterMacro, {
	input: .0,
	expectedResult: `(number: integer => 0)`
});

test('usage with literal Float without unit and zero as decimal', customFormatterDataMacro, {
	input: .0,
	defaultFormatterExpectedResult: `(number: integer => 0)`,
	expectedData: {
		type: 'number',
		stringifiedValue: '0',
		isInteger: true,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
	}
});

test('usage with literal Float without unit and lot of zero as decimal', defaultFormatterMacro, {
	input: .000000,
	expectedResult: `(number: integer => 0)`
});

test('usage with literal Float without unit and lot of zero as decimal', customFormatterDataMacro, {
	input: .000000,
	defaultFormatterExpectedResult: `(number: integer => 0)`,
	expectedData: {
		type: 'number',
		stringifiedValue: '0',
		isInteger: true,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
	}
});

test('usage with literal Float with unit and lot of zero as unit and decimal', defaultFormatterMacro, {
	input: 0.000000,
	expectedResult: `(number: integer => 0)`
});

test('usage with literal Float with unit and lot of zero as unit and decimal', customFormatterDataMacro, {
	input: 0.000000,
	defaultFormatterExpectedResult: `(number: integer => 0)`,
	expectedData: {
		type: 'number',
		stringifiedValue: '0',
		isInteger: true,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
	}
});

test('usage with literal Float with lot of decimal', defaultFormatterMacro, {
	input: 23.99834,
	expectedResult: `(number: float => 23.99834)`
});

test('usage with literal Float with lot of decimal', customFormatterDataMacro, {
	input: 23.9913428839644,
	defaultFormatterExpectedResult: `(number: float => 23.9913428839644)`,
	expectedData: {
		type: 'number',
		stringifiedValue: '23.9913428839644',
		isInteger: false,
		isFloat: true,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
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
		stringifiedValue: 'NaN',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
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
		stringifiedValue: 'NaN',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
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
		stringifiedValue: 'Infinity',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
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
		stringifiedValue: 'Infinity',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
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
		stringifiedValue: '-Infinity',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
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
		stringifiedValue: '-Infinity',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
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
		stringifiedValue: 'true',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Boolean',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
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
		stringifiedValue: 'false',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Boolean',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
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
		stringifiedValue: '/$^/',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: `RegExp`,
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
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
		stringifiedValue: '/regex\\.content-test/',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: `RegExp`,
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
	}
});

/*- literal function -*/

test('usage with literal named function without parameters', defaultFormatterMacro, {
	input: function funcNameTest() {
		const t = 42;
		return t;
	},
	expectedResult: `(function => funcNameTest)`
});
test('usage with literal named function without parameters', customFormatterDataMacro, {
	input: function funcNameTestFormatter() {
		const t = 45;
		return t+42;
	},
	defaultFormatterExpectedResult: `(function => funcNameTestFormatter)`,
	expectedData: {
		type: 'function',
		stringifiedValue: `function funcNameTestFormatter() {
		const t = 45;
		return t + 42;
	}`,
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: `Function`,
		functionName: 'funcNameTestFormatter',
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
	}
});

test('usage with literal named function with one parameter', defaultFormatterMacro, {
	input: function funcNameTestParamOne(arg) {
		const t = 42;
		return t+arg;
	},
	expectedResult: `(function => funcNameTestParamOne)`
});
test('usage with literal named function with one parameter', customFormatterDataMacro, {
	input: function funcNameTestFormatter(arg) {
		const t = 15;
		return arg+t+42;
	},
	defaultFormatterExpectedResult: `(function => funcNameTestFormatter)`,
	expectedData: {
		type: 'function',
		stringifiedValue: `function funcNameTestFormatter(arg) {
		const t = 15;
		return arg + t + 42;
	}`,
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: `Function`,
		functionName: 'funcNameTestFormatter',
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
	}
});

test('usage with literal named function with one parameter and default value', defaultFormatterMacro, {
	input: function funcNameTestParamOne(arg = 'default value') {
		const t = '42';
		return t+arg;
	},
	expectedResult: `(function => funcNameTestParamOne)`
});

test('usage with literal named function with multiple parameters', defaultFormatterMacro, {
	input: function funcNameTestOther(argOne, param, otherParam) {
		const t = 42;
		return t;
	},
	expectedResult: `(function => funcNameTestOther)`
});

test('usage with literal named function with multiple parameters and default values', defaultFormatterMacro, {
	input: function funcNameTestComplex(defArg = 37, argObj = {
		name(){return t+12},
		objKey: 'object value'
	}, { inner = 8, a = 'test'} = {a: 8}, ...restParams) {
		const t = 42;
		return t;
	},
	expectedResult: `(function => funcNameTestComplex)`
});
test('usage with literal named function with multiple parameters and default values', customFormatterDataMacro, {
	input: function funcNameTestComplex(argOne, argObj = {
		name(){return t+12},
		objKey: 'object value'
	}, { inner = 8, a = 'test'} = {a: 8}, ...restParams) {
		const t = 42;
		return t;
	},
	defaultFormatterExpectedResult: `(function => funcNameTestComplex)`,
	expectedData: {
		type: 'function',
		stringifiedValue: `function funcNameTestComplex(argOne, argObj = {
		name() {
			return t + 12;
		},
		objKey: 'object value'
	}, { inner = 8, a = 'test' } = { a: 8 }, ...restParams) {
		const t = 42;
		return t;
	}`,
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: `Function`,
		functionName: 'funcNameTestComplex',
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
	}
});

test('usage with literal anonymous function', defaultFormatterMacro, {
	// eslint-disable-next-line func-names
	input: function () {
		const t = 44;
		return t*t;
	},
	expectedResult: `(function)`
});
test('usage with literal anonymous function', customFormatterDataMacro, {
	// eslint-disable-next-line func-names
	input: function () {
		const t = 48;
		return t*t;
	},
	defaultFormatterExpectedResult: `(function)`,
	expectedData: {
		type: 'function',
		stringifiedValue: `function () {
		const t = 48;
		return t * t;
	}`,
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: `Function`,
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
	}
});

test('usage with literal method', defaultFormatterMacro, {
	input(){
		const t = 44;
		return t*t;
	},
	expectedResult: `(function: method => input)`
});
test('usage with literal method', customFormatterDataMacro, {
	input(){
		const t = 49;
		return t*t;
	},
	defaultFormatterExpectedResult: `(function: method => input)`,
	expectedData: {
		type: 'function',
		stringifiedValue: `input() {
		const t = 49;
		return t * t;
	}`,
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: `Function`,
		functionName: 'input',
		isAsync: false,
		isMethod: true,
		isArrowFunction: false
	}
});

test('usage with literal arrow function', defaultFormatterMacro, {
	input: () => {
		const t = 44;
		return t*t;
	},
	expectedResult: `(function: arrow)`
});
test('usage with literal arrow function', customFormatterDataMacro, {
	input: () => {
		const t = 44;
		return t*t;
	},
	defaultFormatterExpectedResult: `(function: arrow)`,
	expectedData: {
		type: 'function',
		stringifiedValue: `() => {
		const t = 44;
		return t * t;
	}`,
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: `Function`,
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: true
	}
});

test('usage with literal arrow function with parameters', defaultFormatterMacro, {
	input: (argOne = 43) => {
		const t = 44;
		return t*t;
	},
	expectedResult: `(function: arrow)`
});
test('usage with literal arrow function with parameters', customFormatterDataMacro, {
	input: (argOne = 43) => {
		const t = 44;
		return t*t;
	},
	defaultFormatterExpectedResult: `(function: arrow)`,
	expectedData: {
		type: 'function',
		stringifiedValue: `(argOne = 43) => {
		const t = 44;
		return t * t;
	}`,
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: `Function`,
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: true
	}
});

test('usage with literal arrow function with one parameter without braces', defaultFormatterMacro, {
	input: argOne => {
		const t = 44;
		return t*t;
	},
	expectedResult: `(function: arrow)`
});
test.todo('usage with literal arrow function with parameters - custom formatter');

test('usage with literal arrow function with one parameter without braces nor spaces', defaultFormatterMacro, {
	input: argOne=>{
		const t = 44;
		return t*t;
	},
	expectedResult: `(function: arrow)`
});
test.todo('usage with literal arrow function with parameters - custom formatter');

test('usage with literal async function', defaultFormatterMacro, {
	input: async function anAsyncFunctionTest(){
		const t = 44;
		await 5;
		return t*t;
	},
	expectedResult: asyncSupport
		? `(function: async => anAsyncFunctionTest)`
		: `(function => anAsyncFunctionTest)`
});
test.todo('usage with literal async function - custom formatter');

test('usage with literal async function with one parameter', defaultFormatterMacro, {
	input: async function anAsyncFunctionTest3(argOneT){
		const t = 44;
		await 5;
		return t*t+argOneT;
	},
	expectedResult: asyncSupport
		? `(function: async => anAsyncFunctionTest3)`
		: `(function => anAsyncFunctionTest3)`
});
test.todo('usage with literal async function - custom formatter');

test('usage with literal async function with parameters and default', defaultFormatterMacro, {
	input: async function anAsyncFunctionTestWithParams(argOne, argTwo = 78){
		const t = 44;
		await 9;
		return t*t+argOne*argTwo;
	},
	expectedResult: asyncSupport
		? `(function: async => anAsyncFunctionTestWithParams)`
		: `(function => anAsyncFunctionTestWithParams)`
});
test.todo('usage with literal async function - custom formatter');

test('usage with literal async anonymous function', defaultFormatterMacro, {
	input: async function(){
		const t = 44;
		await 5;
		return t*t;
	},
	expectedResult: `(function: async)`
});
test.todo('usage with literal async anonymous function - custom formatter');

test('usage with literal async arrow function', defaultFormatterMacro, {
	input: async () => {
		const t = 44;
		await 5;
		return t*t;
	},
	expectedResult: `(function: async: arrow)`
});
test.todo('usage with literal async arrow function - custom formatter');

test('usage with literal async method function', defaultFormatterMacro, {
	async input(){
		const t = 44;
		await 5;
		return t*t;
	},
	expectedResult: `(function: async: method => input)`
});
test.todo('usage with literal async method function - custom formatter');

test('usage with literal async method function and computed name', defaultFormatterMacro, {
	async ['input'](){
		const t = 44;
		await 5;
		return t*t;
	},
	expectedResult: `(function: async: method => input)`
});
test.todo('usage with literal async method function and computed name - custom formatter');

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
		stringifiedValue: 'null',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: null,
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
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
		stringifiedValue: 'undefined',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: null,
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
	}
});

/*- Object string -*/

test('usage with instance of String', defaultFormatterMacro, {
	input: new String('a string from object'),
	expectedResult: `(object: String => 'a string from object')`
});
test('usage with instance of String', customFormatterDataMacro, {
	input: new String('	a string from object with custom formatter '),
	defaultFormatterExpectedResult: `(object: String => '	a string from object with custom formatter ')`,
	expectedData: {
		type: 'object',
		stringifiedValue: '"\\ta string from object with custom formatter "',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: `'	a string from object with custom formatter '`,
		doubleQuoteString: `"	a string from object with custom formatter "`,
		constructorName: 'String',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
	}
});

test('usage with instance of empty String', defaultFormatterMacro, {
	input: new String(''),
	expectedResult: `(object: String => '')`
});
test('usage with instance of empty String', customFormatterDataMacro, {
	input: new String(''),
	defaultFormatterExpectedResult: `(object: String => '')`,
	expectedData: {
		type: 'object',
		stringifiedValue: '""',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: `''`,
		doubleQuoteString: `""`,
		constructorName: 'String',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
	}
});

test('usage with instance of blank String', defaultFormatterMacro, {
	input: new String(' 	'),
	expectedResult: `(object: String => ' 	')`
});
test('usage with instance of blank String', customFormatterDataMacro, {
	input: new String('	  '),
	defaultFormatterExpectedResult: `(object: String => '	  ')`,
	expectedData: {
		type: 'object',
		stringifiedValue: '"\\t  "',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: `'	  '`,
		doubleQuoteString: `"	  "`,
		constructorName: 'String',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
	}
});

/*- Object number -*/

test('usage with instance of Number', defaultFormatterMacro, {
	input: new Number(),
	expectedResult: `(object: Number: integer => 0)`
});
test('usage with instance of Number', customFormatterDataMacro, {
	input: new Number(NaN),
	defaultFormatterExpectedResult: `(object: Number => NaN)`,
	expectedData: {
		type: 'object',
		stringifiedValue: 'NaN',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
	}
});

test('usage with instance of Number (integer)', defaultFormatterMacro, {
	input: new Number(89),
	expectedResult: `(object: Number: integer => 89)`
});
test('usage with instance of Number (integer)', customFormatterDataMacro, {
	input: new Number(89),
	defaultFormatterExpectedResult: `(object: Number: integer => 89)`,
	expectedData: {
		type: 'object',
		stringifiedValue: '89',
		isInteger: true,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
	}
});

test('usage with instance of Number (float)', defaultFormatterMacro, {
	input: new Number(42.765),
	expectedResult: `(object: Number: float => 42.765)`
});
test('usage with instance of Number (float)', customFormatterDataMacro, {
	input: new Number(46.871030),
	defaultFormatterExpectedResult: `(object: Number: float => 46.87103)`,
	expectedData: {
		type: 'object',
		stringifiedValue: '46.87103',
		isInteger: false,
		isFloat: true,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
	}
});

/*- Object boolean -*/

test('usage with instance of true Boolean', defaultFormatterMacro, {
	input: new Boolean(true),
	expectedResult: `(object: Boolean => true)`
});
test('usage with instance of true Boolean', customFormatterDataMacro, {
	input: new Boolean(true),
	defaultFormatterExpectedResult: `(object: Boolean => true)`,
	expectedData: {
		type: 'object',
		stringifiedValue: 'true',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Boolean',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
	}
});

test('usage with instance of false Boolean', defaultFormatterMacro, {
	input: new Boolean(false),
	expectedResult: `(object: Boolean => false)`
});
test('usage with instance of false Boolean', customFormatterDataMacro, {
	input: new Boolean(false),
	defaultFormatterExpectedResult: `(object: Boolean => false)`,
	expectedData: {
		type: 'object',
		stringifiedValue: 'false',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Boolean',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
	}
});

/*- Object RegExp -*/

test.todo('usage with instance of RegExp');
test.todo('usage with instance of RegExp - custom formatter');

/*- Object function -*/

test.todo('usage with instance of Function');
test.todo('usage with instance of Function - custom formatter');

/*- Object symbol -*/

test('usage with instance of empty Symbol', defaultFormatterMacro, {
	input: Symbol(),
	expectedResult: `(symbol => Symbol())`
});
test('usage with instance of empty Symbol', customFormatterDataMacro, {
	input: Symbol(),
	defaultFormatterExpectedResult: `(symbol => Symbol())`,
	expectedData: {
		type: 'symbol',
		stringifiedValue: 'Symbol()',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Symbol',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
	}
});

test('usage with instance of Symbol', defaultFormatterMacro, {
	input: Symbol('symbol value'),
	expectedResult: `(symbol => Symbol(symbol value))`
});
test('usage with instance of empty Symbol', customFormatterDataMacro, {
	input: Symbol('other symbol value'),
	defaultFormatterExpectedResult: `(symbol => Symbol(other symbol value))`,
	expectedData: {
		type: 'symbol',
		stringifiedValue: 'Symbol(other symbol value)',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Symbol',
		functionName: null,
		isAsync: false,
		isMethod: false,
		isArrowFunction: false
	}
});


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

test('usage with no parameters - throws error', t => {
	const stringable = requireFromIndex('sources/stringable');

	const noParametersError = t.throws(() => {
		stringable();
	});

	t.true(noParametersError instanceof TypeError);
	t.is(noParametersError.message, msg(
		`You are trying to use the stringable function without any arguments.`,
		`You must provide at least one value as first parameter.`
	));
});

test('usage with unused parameters - throws error', t => {
	const stringable = requireFromIndex('sources/stringable');

	const tooManyParametersError = t.throws(() => {
		stringable('value', ()=>{return;}, 'unexpected value');
	});

	t.true(tooManyParametersError instanceof TypeError);
	t.is(tooManyParametersError.message, msg(
		`You are trying to use the stringable function with more than 2 arguments.`,
		`The stringable function only accept 2 arguments. A value to format and a formatter function.`
	));
});

function unvalidFormatterErrorMacro(t, unvalidFormatter) {
	const stringable = requireFromIndex('sources/stringable');

	const unvalidFormatterError = t.throws(() => {
		stringable('value', unvalidFormatter);
	});

	t.true(unvalidFormatterError instanceof TypeError);
	t.is(unvalidFormatterError.message, msg(
		`${stringable(unvalidFormatter)} is not a valid stringable formatter.`,
		`The stringable formatter argument passed as the second parameter must be a function.`
	));
}

unvalidFormatterErrorMacro.title = providedTitle => (
	`usage with unvalid formatter - throws error - ${providedTitle}`
);

test('number', unvalidFormatterErrorMacro, 46);
test('null', unvalidFormatterErrorMacro, null);
test('true', unvalidFormatterErrorMacro, true);
test('false', unvalidFormatterErrorMacro, false);
test('symbol', unvalidFormatterErrorMacro, Symbol());
test('object', unvalidFormatterErrorMacro, {});
test('array', unvalidFormatterErrorMacro, []);
test('string', unvalidFormatterErrorMacro, 'a string');