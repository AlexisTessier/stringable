'use strict';

const assert = require('assert');

const randomstring = require(`randomstring`);

const requireFromIndex = require('../../utils/require-from-index');

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
		'keys',
		'functionName',
		'isAsync',
		'isGenerator',
		'isClass'
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
		t.deepEqual(data.keys, expectedData.keys);
		t.is(data.functionName, expectedData.functionName);
		t.is(data.isAsync, expectedData.isAsync);
		t.is(data.isGenerator, expectedData.isGenerator);
		t.is(data.isClass, expectedData.isClass);

		return randomResult;
	});

	t.is(result, randomResult);
}

customFormatterDataMacro.title = providedTitle => (
	`${providedTitle} - custom formatter`
);

module.exports = customFormatterDataMacro;