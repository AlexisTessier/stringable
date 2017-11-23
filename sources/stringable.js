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
	functionName,
	isAsync,
	isMethod,
	isArrowFunction
}) {
	if (value === undefined) {
		return '(undefined)';
	}

	if (type === 'function' && functionName === null) {
		return isArrowFunction ? '(function: arrow)' : '(function)';
	}

	let typeComplement = type === 'object' && constructorName ? `: ${constructorName}` : '';

	let _type = type;
	if (value instanceof Number) {
		_type = 'number';
	}

	switch(_type){
		case 'number':
			typeComplement += isInteger ? ': integer' : (isFloat ? ': float' : '');
			break;

		case 'function':
			typeComplement += isAsync ? ': async' : '';
			typeComplement += isMethod ? ': method' : '';
			break;

		default:
			break;
	}

	return `(${type}${typeComplement} => ${functionName || simpleQuoteString || stringifiedValue})`;
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
	let stringifiedValue = null;

	let simpleQuoteString = null;
	let doubleQuoteString = null;
	if (type === 'string' || value instanceof String) {
		simpleQuoteString = `'${escapeQuotes(value)}'`;
		doubleQuoteString = `"${escapeQuotes(value, '"')}"`;
		stringifiedValue = JSON.stringify(value);
	}

	let functionName = null;
	let isAsync = false;
	let isMethod = false;
	let isArrowFunction = false;
	if (type === 'function') {
		functionName = value.name;
		stringifiedValue = `${value}`;

		isAsync = stringifiedValue.indexOf(`async`) === 0;
		isMethod = stringifiedValue.indexOf(`${functionName}(`) === 0;
		isArrowFunction = stringifiedValue.indexOf(`(`) === 0 || stringifiedValue.split(' ')[1] === '=>';

		const useName = stringifiedValue.indexOf(`${isAsync ? 'async ' : ''}function ${functionName}`) === 0;
		if (!useName && !isMethod) {
			functionName = null;
		}
	}

	if (type === 'symbol'){
		stringifiedValue = `${value.toString()}`;
	}

	let isInteger = false;
	let isFloat = false;
	if (type === 'number' || value instanceof Number){
		const literal = value instanceof Number ? (0+value) : value;

		if(!Number.isNaN(literal) && Math.abs(literal) !== Infinity) {
			isInteger = parseInt(literal, 10) === literal;
			isFloat = !isInteger;
		}
	}

	let constructorName = null;
	if(value !== null && value !== undefined && value.constructor){
		constructorName = value.constructor.name;
	}

	if (stringifiedValue === null){
		stringifiedValue = `${value}`;
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
		functionName,
		isAsync,
		isMethod,
		isArrowFunction
	});
}

module.exports = stringable;