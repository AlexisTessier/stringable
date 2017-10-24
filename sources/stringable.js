'use strict';

function defaultFormater({
	value,
	type,
	isInteger,
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

	let isInteger = false;
	if (type === 'number') {
		isInteger = parseInt(value, 10) === value;
	}

	return formatter({
		value,
		type,
		isInteger,
		simpleQuoteStringified,
		doubleQuoteStringified,
		defaultFormater
	});
}

module.exports = stringable;