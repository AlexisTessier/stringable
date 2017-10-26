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
		'defaultFormatter',
		'doubleQuoteStringified',
		'isFloat',
		'isInteger',
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
		doubleQuoteStringified: `"42 Literal string value 42"`
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
		doubleQuoteStringified: `43`
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
		doubleQuoteStringified: `3`
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
		doubleQuoteStringified: `8`
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
		doubleQuoteStringified: `47.8`
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
		doubleQuoteStringified: `0.8`
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
		doubleQuoteStringified: `0`
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
		doubleQuoteStringified: `0`
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
		doubleQuoteStringified: `0`
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
		doubleQuoteStringified: `23.9913428839644`
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
		doubleQuoteStringified: `true`
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
		doubleQuoteStringified: `false`
	}
});

/*- literal array -*/

test.todo('usage with literal Array');
test.todo('usage with literal Array - custom formatter');

/*- literal object -*/

test.todo('usage with literal Object');
test.todo('usage with literal Object - custom formatter');

/*- literal regexp -*/

test.todo('usage with literal RegExp');
test.todo('usage with literal RegExp - custom formatter');

/*- literal function -*/

test.todo('usage with literal function');
test.todo('usage with literal function - custom formatter');

test.todo('usage with literal arrow function');
test.todo('usage with literal arrow function - custom formatter');

test.todo('usage with literal async function');
test.todo('usage with literal async function - custom formatter');

test.todo('usage with literal async arrow function');
test.todo('usage with literal async arrow function - custom formatter');

test.todo('usage with literal generator function');
test.todo('usage with literal generator function - custom formatter');

/*- literal falsy values -*/

test.todo('usage with literal null');
test.todo('usage with literal null - custom formatter');

test.todo('usage with literal undefined');
test.todo('usage with literal undefined - custom formatter');

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

/*- Object array -*/

test.todo('usage with instance of Array');
test.todo('usage with instance of Array - custom formatter');

/*- Object -*/

test.todo('usage with instance of Object');
test.todo('usage with instance of Object - custom formatter');

test.todo('usage with instance of custom class');
test.todo('usage with instance of custom class - custom formatter');

/*- Object RegExp -*/

test.todo('usage with instance of RegExp');
test.todo('usage with instance of RegExp - custom formatter');

/*- Object function -*/

test.todo('usage with instance of Function');
test.todo('usage with instance of Function - custom formatter');

/*- Object symbol -*/

test.todo('usage with instance of Symbol');
test.todo('usage with instance of Symbol - custom formatter');

/*- errors handling -*/

test.todo('usage with no parameters - throws error');