'use strict';

function defaultFormatter({
	value,
	type,
	isInteger,
	isFloat,
	simpleQuoteStringified,
	doubleQuoteStringified
}) {
	const typeComplement = type === 'number' ? (
		isInteger ? ': Integer' : ': Float'
	) : '';

	return `(${type}${typeComplement} => ${simpleQuoteStringified})`;
}

function stringable(value, formatter = defaultFormatter) {
	let simpleQuoteStringified = `${value}`;
	let doubleQuoteStringified = `${value}`;

	const type = typeof value;

	if (type === 'string') {
		simpleQuoteStringified = `'${simpleQuoteStringified}'`;
		doubleQuoteStringified = `"${doubleQuoteStringified}"`;
	}

	let isInteger = false;
	let isFloat = false;
	if (type === 'number') {
		isInteger = parseInt(value, 10) === value;
		isFloat = !isInteger;
	}

	return formatter({
		value,
		type,
		isInteger,
		isFloat,
		simpleQuoteStringified,
		doubleQuoteStringified,
		defaultFormatter
	});
}

module.exports = stringable;