'use strict';

const escapeQuotes = require('escape-quotes');

const msg = require('@alexistessier/msg');

function defaultFormatter({
	value,
	type,
	stringifiedValue,
	isInteger,
	isFloat,
	simpleQuoteString,
	doubleQuoteString,
	constructorName,
	functionName
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

	return `(${type}${typeComplement} => ${simpleQuoteString})`;
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
	const stringifiedValue = JSON.stringify(value);

	let simpleQuoteString = null;
	let doubleQuoteString = null;
	if (type === 'string' || value instanceof String) {
		simpleQuoteString = `'${escapeQuotes(value)}'`;
		doubleQuoteString = `"${escapeQuotes(value, '"')}"`;
	}

	let functionName = null;
	if (type === 'function') {
		functionName = value.name;
		const signature = getFunctionSignature(value);
	}
		//simpleQuoteString = doubleQuoteString = `${functionName}(${signature}) { ... }`;
	// }
	// else if (type === 'symbol'){
	// 	//simpleQuoteString = doubleQuoteString = `${value.toString()}`;
	// }
	// else{
	// 	//simpleQuoteString = doubleQuoteString = `${value}`;
	// }

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
		stringifiedValue,
		isInteger,
		isFloat,
		simpleQuoteString,
		doubleQuoteString,
		defaultFormatter,
		constructorName,
		functionName
	});
}

module.exports = stringable;