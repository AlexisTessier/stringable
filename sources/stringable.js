'use strict';

function defaultFormatter({
	value,
	type,
	isInteger,
	isFloat,
	simpleQuoteStringified,
	doubleQuoteStringified,
	constructorName
}) {
	if (value === undefined) {
		return '(undefined)';
	}

	let typeComplement = type === 'object' && constructorName ? `: ${constructorName}` : '';

	switch(type){
		case 'number':
			typeComplement += isInteger ? ': Integer' : (isFloat ? ': Float' : '');
			break;

		default:
			break;
	}

	return `(${type}${typeComplement} => ${simpleQuoteStringified})`;
}

// This function is inspired from a promisify util
// https://github.com/nodegit/promisify-node/blob/368682489bb630977f6732c7df95562f6afa7102/utils/args.js
// Some magic happens in it so may be a source of errors
function getFunctionSignature(func) {
	return func.toString().match(/function\s.*?\(([^)]*)\)/)[1].replace(/\s+/mg, '')
}

function stringable(value, formatter = defaultFormatter) {
	const type = typeof value;

	let simpleQuoteStringified = ``;
	let doubleQuoteStringified = ``;

	let name = null;
	if (type === 'function') {
		name = value.name;
		const signature = getFunctionSignature(value);

		simpleQuoteStringified = doubleQuoteStringified = `${name}(${signature}) { ... }`;
	}
	else{
		simpleQuoteStringified = doubleQuoteStringified = `${value}`;
	}

	if (type === 'string') {
		simpleQuoteStringified = `'${simpleQuoteStringified}'`;
		doubleQuoteStringified = `"${doubleQuoteStringified}"`;
	}

	let isInteger = false;
	let isFloat = false;
	if (type === 'number' && !Number.isNaN(value) && Math.abs(value) !== Infinity) {
		isInteger = parseInt(value, 10) === value;
		isFloat = !isInteger;
	}

	let constructorName = null;
	if(value !== null && value !== undefined && value.constructor){
		constructorName = value.constructor.name;
	}

	return formatter({
		value,
		type,
		isInteger,
		isFloat,
		simpleQuoteStringified,
		doubleQuoteStringified,
		defaultFormatter,
		constructorName,
		name
	});
}

module.exports = stringable;