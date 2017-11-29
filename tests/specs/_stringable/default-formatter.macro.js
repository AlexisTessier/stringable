'use strict';

const assert = require('assert');

const requireFromIndex = require('../../utils/require-from-index');

function defaultFormatterMacro(t, {input, expectedResult}) {
	assert(typeof expectedResult === 'string');

	const stringable = requireFromIndex('sources/stringable');

	const result = stringable(input);

	t.is(typeof result, 'string');
	t.is(result, expectedResult);
}

defaultFormatterMacro.title = providedTitle => providedTitle;

module.exports = defaultFormatterMacro;