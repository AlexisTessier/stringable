'use strict';

function defaultFormater({
	value,
	type,
	simpleQuoteStringified,
	doubleQuoteStringified
}) {
	return `(${type} => ${simpleQuoteStringified})`;
}

function stringable(value, formatter = defaultFormater) {
	let simpleQuoteStringified = `${value}`;
	let doubleQuoteStringified = `${value}`;

	const type = typeof value;

	if (type === 'string') {
		simpleQuoteStringified = `'${simpleQuoteStringified}'`;
		doubleQuoteStringified = `"${doubleQuoteStringified}"`;
	}

	return formatter({
		value,
		type,
		simpleQuoteStringified,
		doubleQuoteStringified,
		defaultFormater
	});
}

module.exports = stringable;