'use strict';

const escapeQuotes = require('escape-quotes');

const msg = require('@alexistessier/msg');

const nl = `\n`
const tab = `\t`;

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
	isGenerator
}) {
	const displayValue = !(
		value === undefined
		||
		(type === 'function' && functionName === null)
	);

	let typeComplement = type === 'object' && constructorName && value.constructor !== Object ? `: ${constructorName}` : '';

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
			typeComplement += isGenerator ? ': generator' : '';
			break;

		default:
			break;
	}

	const displayedValue = displayValue ? ` => ${functionName || simpleQuoteString || stringifiedValue}` : '';
	return `(${type}${typeComplement}${displayedValue})`;
}

function repeat(chars, count) {
	let repeated = '';
	for(let i = 0; i < count;i++){
		repeated+=chars;
	}
	return repeated;
}

function stringable(value, formatter = defaultFormatter, deepness = 0) {
	if (arguments.length === 0) {
		throw new TypeError(msg(
			`You are trying to use the stringable function without any arguments.`,
			`You must provide at least one value as first parameter.`
		));
	}

	if (arguments.length > 3) {
		throw new TypeError(msg(
			`You are trying to use the stringable function with more than 3 arguments.`,
			`The stringable function only accept 3 arguments. A value to format, a formatter function and a deepness parameter.`
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
	let isGenerator = false;
	if (type === 'function') {
		functionName = value.name;
		stringifiedValue = `${value}`;

		isAsync = stringifiedValue.indexOf(`async`) === 0;
		isGenerator = stringifiedValue.indexOf(`function*`) === 0;

		if (functionName.trim().length === 0) {
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

	if (
		  stringifiedValue === null &&
		  value instanceof Object &&
		!(value instanceof Boolean) &&
		!(value instanceof Number) &&
		!(value instanceof String) &&
		!(value instanceof Function) &&
		!(value instanceof RegExp)
	) {
		const rootTab = repeat(tab, deepness);
		const nestedTab = `${rootTab}${tab}`;

		if (value instanceof Array) {
			const manyElements = value.length > 1;
			const startSpace = manyElements ? `${nl}${nestedTab}` : repeat(' ', value.length);
			const endSpace = manyElements ? nl : startSpace;

			stringifiedValue = `[${startSpace}${value
				.map(el => stringable(el, formatter, deepness+1))
				.join(`,${nl}${nestedTab}`)
			}${endSpace}${rootTab}]`;
		}
		else{
			const keys = Object.keys(value);
			const manyElements = keys.length > 1;
			const startSpace = manyElements ? `${nl}${nestedTab}` : repeat(' ', keys.length);
			const endSpace = manyElements ? nl : startSpace;

			for(const key in value){

			}
			stringifiedValue = `{${startSpace}${keys
				.map(el => ({
					key: stringable(el, formatter, deepness+1),
					value: stringable(value[el], formatter, deepness+1)
				}))
				.map(el => `[${el.key}]: ${el.value}`)
				.join(`,${nl}${nestedTab}`)
			}${endSpace}${rootTab}}`;
		}
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
		isGenerator
	});
}

module.exports = stringable;