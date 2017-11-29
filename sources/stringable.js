'use strict';

const _global = require("global");

const escapeQuotes = require('escape-quotes');
const msg = require('@alexistessier/msg');

const nl = `\n`;
const comma = ',';
const tab = `  `;

const _NodeList = _global.NodeList || null;

function noFormatter(data) {
	return data;
}

function defaultFormatter({
	value,
	type,
	stringifiedValue,
	isInteger,
	isFloat,
	simpleQuoteString,
	doubleQuoteString,
	constructorName,
	keys,
	functionName,
	isAsync,
	isGenerator
}, parents = []) {
	const isCircular = parents.findIndex(v => Object.is(v, value)) >= 0;
	const deepness = parents.length;
	const rootTab = repeat(tab, deepness);

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

	if (isCircular) {
		return `${rootTab}(${type}${typeComplement}: Circular)`;
	}

	let nestedDiplay = null;
	if (keys) {
		const manyElements = keys.length > 1;
		const bracesInnerSpace = manyElements ? nl : repeat(' ', keys.length);
		const bracesBeforeClose = bracesInnerSpace + (manyElements ? rootTab : '');

		function renderNestedValue(val, showKeys) {
			return showKeys
			? `${bracesInnerSpace}${keys
				.map(key => ({k: key, v: val[key]}))
				.map(el => ({k: stringable(el.k, noFormatter), v: stringable(el.v, noFormatter)}))
				.map(data => ({k: defaultFormatter(data.k, manyElements ? [...parents, value] : []), v: defaultFormatter(data.v, [])}))
				.map(f => `${f.k.replace('(','[').replace(/\)$/,']')}: ${f.v}`)
				.join(comma+nl)
			}${bracesBeforeClose}`
			: `${bracesInnerSpace}${keys
				.map(key => val[key])
				.map(el => stringable(el, noFormatter))
				.map(data => defaultFormatter(data, manyElements ? [...parents, value] : []))
				.join(comma+nl)
			}${bracesBeforeClose}`;
		}

		if (value instanceof Array || (_NodeList && value instanceof _NodeList)) {
			nestedDiplay = `[${renderNestedValue(value, false)}]`;
		}
		else {
			nestedDiplay = `{${renderNestedValue(value, true)}}`;
		}
	}

	const displayedValue = displayValue ? ` => ${nestedDiplay || functionName || simpleQuoteString || stringifiedValue}` : '';
	return `${rootTab}(${type}${typeComplement}${displayedValue})`;
}

function repeat(chars, count) {
	let repeated = '';
	for(let i = 0; i < count;i++){
		repeated+=chars;
	}
	return repeated;
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

	if (stringifiedValue === null){
		stringifiedValue = `${value}`;
	}

	let keys = null;
	if (
		  value instanceof Object &&
		!(value instanceof Boolean) &&
		!(value instanceof Number) &&
		!(value instanceof String) &&
		!(value instanceof RegExp) &&
		!(value instanceof Function)
	) {
		keys = Object.keys(value);
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
		keys,
		functionName,
		isAsync,
		isGenerator
	});
}

module.exports = stringable;