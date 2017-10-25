'use strict';

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
	const stringable = requireFromIndex('sources/stringable');

	const result = stringable(input);

	t.is(typeof result, 'string');
	t.is(result, expectedResult)
}

defaultFormatterMacro.title = providedTitle => providedTitle;

function customFormatterDataMacro(t, input, defaultFormatterExpectedResult, expectedData) {
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

	t.plan(5+(testDataKeys.length*2));

	testDataKeys.forEach(key => {
		t.true(key in expectedData, `expectedData test missing for key ${key}`);
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

		t.is(typeof data.defaultFormater, 'function');
		t.is(data.defaultFormater(data), defaultFormatterExpectedResult);

		return randomResult;
	});

	t.is(result, randomResult);
}

customFormatterDataMacro.title = providedTitle => (
	`${providedTitle} - custom formatter`
);

/*-------------------*/

test.only('usage with literal string', defaultFormatterMacro, {
	input: `42 Literal string value 42`,
	expectedResult: `(string => '42 Literal string value 42')`
});

/*- literal string -*/

test('usage with literal string', t => {
	const stringable = requireFromIndex('sources/stringable');

	const literal = '42 Literal string value 42';

	const result = stringable(literal);

	t.is(typeof result, 'string');
	t.is(result, `(string => '42 Literal string value 42')`)
});

test('usage with literal string - custom formatter', t => {
	const stringable = requireFromIndex('sources/stringable');

	const literal = '42 Literal string value 42';

	t.plan(10);

	const result = stringable(literal, data => {
		t.is(typeof data, 'object');
		t.deepEqual(Object.keys(data).sort(), [
			'defaultFormater',
			'doubleQuoteStringified',
			'isInteger',
			'simpleQuoteStringified',
			'type',
			'value'
		]);

		t.is(data.value, literal);
		t.is(data.type, 'string');
		t.is(data.isInteger, false);
		t.is(data.simpleQuoteStringified, `'42 Literal string value 42'`);
		t.is(data.doubleQuoteStringified, `"42 Literal string value 42"`);

		t.is(typeof data.defaultFormater, 'function');
		t.is(data.defaultFormater(data), `(string => '42 Literal string value 42')`);

		return 'formated literal string';
	});

	t.is(result, 'formated literal string');
});

/*- literal number -*/

test('usage with literal number', t => {
	const stringable = requireFromIndex('sources/stringable');

	const literal = 42;

	const result = stringable(literal);

	t.is(typeof result, 'string');
	t.is(result, `(number => 42)`);
});

test('usage with literal number - custom formatter', t => {
	const stringable = requireFromIndex('sources/stringable');

	const literal = 43;

	t.plan(10);

	const result = stringable(literal, data => {
		t.is(typeof data, 'object');
		t.deepEqual(Object.keys(data).sort(), [
			'defaultFormater',
			'doubleQuoteStringified',
			'isInteger',
			'simpleQuoteStringified',
			'type',
			'value'
		]);

		t.is(data.value, literal);
		t.is(data.type, 'number');
		t.is(data.isInteger, true);
		t.is(data.simpleQuoteStringified, `43`);
		t.is(data.doubleQuoteStringified, `43`);

		t.is(typeof data.defaultFormater, 'function');

		t.is(data.defaultFormater(data), '(number => 43)');

		return 'formated literal number';
	});

	t.is(result, 'formated literal number');
});

test('usage with literal Integer', t => {
	const stringable = requireFromIndex('sources/stringable');

	const literal = 30;

	const result = stringable(literal);

	t.is(typeof result, 'string');
	t.is(result, `(number => 30)`);
});

test('usage with literal Integer - custom formatter', t => {
	const stringable = requireFromIndex('sources/stringable');

	const literal = 26;

	t.plan(10);

	const result = stringable(literal, data => {
		t.is(typeof data, 'object');
		t.deepEqual(Object.keys(data).sort(), [
			'defaultFormater',
			'doubleQuoteStringified',
			'isInteger',
			'simpleQuoteStringified',
			'type',
			'value'
		]);

		t.is(data.value, literal);
		t.is(data.type, 'number');
		t.is(data.isInteger, true);
		t.is(data.simpleQuoteStringified, `26`);
		t.is(data.doubleQuoteStringified, `26`);

		t.is(typeof data.defaultFormater, 'function');

		t.is(data.defaultFormater(data), '(number => 26)');

		return 'formated literal integer';
	});

	t.is(result, 'formated literal integer');
});

test('usage with literal Float without decimal', t => {
	const stringable = requireFromIndex('sources/stringable');

	const literal = 30.;

	const result = stringable(literal);

	t.is(typeof result, 'string');
	t.is(result, `(number => 30)`);
});

test('usage with literal Float without decimal - custom formatter', t => {
	const stringable = requireFromIndex('sources/stringable');

	const literal = 3.;

	t.plan(10);

	const result = stringable(literal, data => {
		t.is(typeof data, 'object');
		t.deepEqual(Object.keys(data).sort(), [
			'defaultFormater',
			'doubleQuoteStringified',
			'isInteger',
			'simpleQuoteStringified',
			'type',
			'value'
		]);

		t.is(data.value, literal);
		t.is(data.type, 'number');
		t.is(data.isInteger, true);
		t.is(data.simpleQuoteStringified, `3`);
		t.is(data.doubleQuoteStringified, `3`);

		t.is(typeof data.defaultFormater, 'function');

		t.is(data.defaultFormater(data), '(number => 3)');

		return 'formated literal float without decimal';
	});

	t.is(result, 'formated literal float without decimal');
});

test('usage with literal Float', t => {
	const stringable = requireFromIndex('sources/stringable');

	const literal = 30.9;

	const result = stringable(literal);

	t.is(typeof result, 'string');
	t.is(result, `(number: float => 30.9)`);
});

test('usage with literal Float - custom formatter', t => {
	const stringable = requireFromIndex('sources/stringable');

	const literal = 47.8;

	t.plan(11);

	const result = stringable(literal, data => {
		t.is(typeof data, 'object');
		//t.deepEqual(Object.keys(data).sort(), customFormaterDataKeys);

		t.is(data.value, literal);
		t.is(data.type, 'number');
		t.is(data.isFloat, true);
		t.is(data.isInteger, false);
		t.is(data.simpleQuoteStringified, `47.8`);
		t.is(data.doubleQuoteStringified, `47.8`);

		t.is(typeof data.defaultFormater, 'function');

		t.is(data.defaultFormater(data), '(number: float => 47.8)');

		return 'formated literal float';
	});

	t.is(result, 'formated literal float');
});

test('usage with literal Float without unit', t => {
	const stringable = requireFromIndex('sources/stringable');

	const literal = .2;

	const result = stringable(literal);

	t.is(typeof result, 'string');
	t.is(result, `(number => 0.2)`);
});

test.todo('usage with literal Float without unit - custom formatter');

test('usage with literal Float with lot of decimal', t => {
	const stringable = requireFromIndex('sources/stringable');

	const literal = 23.99834;

	const result = stringable(literal);

	t.is(typeof result, 'string');
	t.is(result, `(number => 23.99834)`);
});

test.todo('usage with literal Float with lot of decimal - custom formatter');

/*- literal boolean -*/

test('usage with literal boolean true', t => {
	const stringable = requireFromIndex('sources/stringable');

	const literal = true;

	const result = stringable(literal);

	t.is(typeof result, 'string');
	t.is(result, `(boolean => true)`)
});

test('usage with literal boolean true - custom formatter', t => {
	const stringable = requireFromIndex('sources/stringable');

	const literal = true;

	t.plan(10);

	const result = stringable(literal, data => {
		t.is(typeof data, 'object');
		t.deepEqual(Object.keys(data).sort(), [
			'defaultFormater',
			'doubleQuoteStringified',
			'isInteger',
			'simpleQuoteStringified',
			'type',
			'value'
		]);

		t.is(data.value, literal);
		t.is(data.type, 'boolean');
		t.is(data.isInteger, false);
		t.is(data.simpleQuoteStringified, `true`);
		t.is(data.doubleQuoteStringified, `true`);

		t.is(typeof data.defaultFormater, 'function');

		t.is(data.defaultFormater(data), '(boolean => true)');

		return 'formated literal true boolean';
	});

	t.is(result, 'formated literal true boolean');
});

test('usage with literal boolean false', t => {
	const stringable = requireFromIndex('sources/stringable');

	const literal = false;

	const result = stringable(literal);

	t.is(typeof result, 'string');
	t.is(result, `(boolean => false)`)
});

test('usage with literal boolean false - custom formatter', t => {
	const stringable = requireFromIndex('sources/stringable');

	const literal = false;

	t.plan(10);

	const result = stringable(literal, data => {
		t.is(typeof data, 'object');
		t.deepEqual(Object.keys(data).sort(), [
			'defaultFormater',
			'doubleQuoteStringified',
			'isInteger',
			'simpleQuoteStringified',
			'type',
			'value'
		]);

		t.is(data.value, literal);
		t.is(data.type, 'boolean');
		t.is(data.isInteger, false);
		t.is(data.simpleQuoteStringified, `false`);
		t.is(data.doubleQuoteStringified, `false`);

		t.is(typeof data.defaultFormater, 'function');

		t.is(data.defaultFormater(data), '(boolean => false)');

		return 'formated literal false boolean';
	});

	t.is(result, 'formated literal false boolean');
});

/*- literal array -*/

test.todo('usage with literal Array');
test.todo('usage with literal Array - custom formatter');

test.todo('usage with literal Object');
test.todo('usage with literal Object - custom formatter');

test.todo('usage with literal RegExp');
test.todo('usage with literal RegExp - custom formatter');

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

test.todo('usage with literal null');
test.todo('usage with literal null - custom formatter');

test.todo('usage with literal undefined');
test.todo('usage with literal undefined - custom formatter');

/*- ----- -*/

test.todo('usage with instance of String');
test.todo('usage with instance of String - custom formatter');

test.todo('usage with instance of Number');
test.todo('usage with instance of Number - custom formatter');

test.todo('usage with instance of Boolean');
test.todo('usage with instance of Boolean - custom formatter');

test.todo('usage with instance of Array');
test.todo('usage with instance of Array - custom formatter');

test.todo('usage with instance of Number (integer)');
test.todo('usage with instance of Number (integer) - custom formatter');

test.todo('usage with instance of Number (float)');
test.todo('usage with instance of Number (float) - custom formatter');

test.todo('usage with instance of Object');
test.todo('usage with instance of Object - custom formatter');

test.todo('usage with instance of custom class');
test.todo('usage with instance of custom class - custom formatter');

test.todo('usage with instance of RegExp');
test.todo('usage with instance of RegExp - custom formatter');

test.todo('usage with instance of Function');
test.todo('usage with instance of Function - custom formatter');

test.todo('usage with instance of Symbol');
test.todo('usage with instance of Symbol - custom formatter');

/*- ----- -*/

test.todo('usage with no parameters - throws error');