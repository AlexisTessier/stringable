'use strict';

const msg = require('@alexistessier/msg');

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
	return func.toString().match(/function\s.*?\(([^)]*)\)/)[1];
}

function stringable(value, formatter = defaultFormatter) {
	if (arguments.length === 0) {
		throw new TypeError(msg(
			`You are trying to use the stringable function without any arguments.`,
			`You must provide at least one value as first parameter.`
		));
	}

	if (arguments.length > 2) {
		throw new TypeError(msg(
			`You are trying to use the stringable function with more than 2 arguments.`,
			`The stringable function only accept 2 arguments. A value to format and a formatter function.`
		));
	}

	if (typeof formatter !== 'function') {
		throw new TypeError(msg(
			`${stringable(formatter)} is not a valid stringable formatter.`,
			`The stringable formatter argument passed as the second parameter must be a function.`
		));
	}

	const type = typeof value;

	let simpleQuoteStringified = ``;
	let doubleQuoteStringified = ``;

	let name = null;
	if (type === 'function') {
		name = value.name;
		const signature = getFunctionSignature(value);

		simpleQuoteStringified = doubleQuoteStringified = `${name}(${signature}) { ... }`;
	}
	else if (type === 'symbol'){
		simpleQuoteStringified = doubleQuoteStringified = `${value.toString()}`;
	}
	else{
		simpleQuoteStringified = doubleQuoteStringified = `${value}`;
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

	if (type === 'string' || value instanceof String) {
		simpleQuoteStringified = `'${simpleQuoteStringified}'`;
		doubleQuoteStringified = `"${doubleQuoteStringified}"`;
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