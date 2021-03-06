'use strict';

const _global = require("global");

const escapeQuotes = require('escape-quotes');
const repeatString = require('repeat-string');

const msg = require('@alexistessier/msg');

const nl = `\n`;
const comma = ',';
const tab = `  `;

const _NodeList = _global.NodeList || null;
const _Node = _global.Node || null;

const plainObjectKeys = getObjectKeys({});

/**
 * @private
 *
 * @description List the keys of an object.
 *
 * @param {object|NodeList|Node} obj The object with the keys to list (including keys from parent prototypes).
 * @param {string[]} keysFilter The keys to exclude from final result.
 *
 * @return {string[]} An array containing the keys of the object, or the attributes names of the Node.
 */
function getObjectKeys(obj, keysFilter = []) {
	let keys = [];

	if (obj instanceof Array || (_NodeList && obj instanceof _NodeList)) {
		keys = Object.keys(obj);
	}
	else if (_Node && obj instanceof _Node) {
		keys = obj.getAttributeNames();
	}
	else{
		do {
			keys.push(
				...Object.getOwnPropertyNames(obj),
				...Object.getOwnPropertySymbols(obj)
			);
			obj = Object.getPrototypeOf(obj);
		} while (obj);
	}

	const uniqCache = [];
	return keys.filter(k => {
		const show = (
			!keysFilter.includes(k) &&
			!uniqCache.includes(k)
		);

		uniqCache.push(k);

		return show;
	});
}

/**
 * @private
 *
 * @description Used in defaultFormatter. Complete the formating of an object property prefixing with a setter or getter marker.
 *
 * @param {object} obj The object containing the property.
 * @param {string} property The formatted property name to complete.
 * @param {string} val The formatted property to complete.
 *
 * @return {string} The complete version of formatted property.
 */
function getterOrSetterMarker(obj, property, val) {
	if (_Node && obj instanceof _Node) {
		return val;
	}

	let descriptor = Object.getOwnPropertyDescriptor(obj, property);
	if (descriptor === undefined) {
		return getterOrSetterMarker(Object.getPrototypeOf(obj), property, val)
	}

	const hasGetter = typeof descriptor.get === 'function';
	const hasSetter = typeof descriptor.set === 'function';

	if (hasGetter && hasSetter) {
		return val;
	}

	if (hasGetter) {
		return `getter${val}`;
	}

	if (hasSetter) {
		return 'setter';
	}

	return val;
}

/**
 * @private
 *
 * @description A formatter which only return the raw data. Used in the defaultFormatter.
 *
 * @param {object} data The data object sent to the formatter.
 *
 * @return {object} The same data object as input, without any transformation.
 */
function noFormatter(data) {
	return data;
}

/**
 * @description The function you get when requiring the stringable module. Formats a value.
 *
 * @param {any} value The value to format.
 * @param {function(data: object): string} formatter The formatter to use in order to format the value. To create a custom one, look at the defaultFormatter documentation to see which data it will receive.
 *
 * @return {string} The value formatted using the formatter.
 */
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
	let isClass = false;
	if (type === 'function') {
		functionName = value.name;
		stringifiedValue = `${value}`;

		isAsync = stringifiedValue.indexOf(`async`) === 0;
		isGenerator = stringifiedValue.indexOf(`function*`) === 0;

		if (functionName.trim().length === 0) {
			functionName = null;
		}

		isClass = stringifiedValue.indexOf(`class`) === 0;
	}

	if (type === 'object' && !(value instanceof Object) && value !== null && value !== undefined) {
		stringifiedValue = '[object]';
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
		stringifiedValue = value instanceof Array
			? `${value.map(v => typeof v === 'symbol' ? v.toString() : v)}`
			: `${value}`;
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
		keys = getObjectKeys(value, plainObjectKeys);
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
		isGenerator,
		isClass
	});
}

/**
 * @description Can't be required directly. The formatter used by default when using stringable. It formats a value from data provided by stringable.
 *
 * @param {object} data The data object sent to the formatter.
 * @param {any} data.value The value to format.
 * @param {string} data.type The value type from typeof operator.
 * @param {string} data.stringifiedValue A default and not optimal stringified version of the value.
 * @param {boolean} data.isInteger true if the value is an integer, else false.
 * @param {boolean} data.isFloat true if the value is a float, else false.
 * @param {string} data.simpleQuoteString If value is a string, this will be a representation of the string quotted with simple quotes.
 * @param {string} data.doubleQuoteString If value is a string, this will be a representation of the string quotted with double quotes.
 * @param {function} data.defaultFormatter The default formatter used by stringable.
 * @param {string} data.constructorName The name of the value constructor.
 * @param {string[]} data.keys The list of the value properties (or attributes names of the value is a DOM Node)
 * @param {string} data.functionName The name of the function is the value is a function.
 * @param {boolean} data.isAsync true if the value is an async function, else false.
 * @param {boolean} data.isGenerator true if the value is a generator function (using the syntax function*), else false.
 * @param {boolean} data.isClass true if the value is an es class, else false.
 *
 * @param {Array} parents Used internally. An array containing the owners objects of the value (if value is a property).
 * @param {number} deepness Used internally. The displayed nesting indentation level.
 * @param {boolean} useNestTab Used internally. If the nesting indentation must be used at this level.
 *
 * @return {string} The formatted value as a string.
 */
function defaultFormatter({
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
	isGenerator,
	isClass
}, parents = [], deepness = 0, useNestTab = true) {
	const isCircular = parents.findIndex(v => Object.is(v, value)) >= 0;
	const rootTab = repeatString(tab, deepness);
	const displayedTab = useNestTab ? rootTab : '';

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
		case 'object':
			typeComplement = (value instanceof Error && value.constructor !== Error)
				? `: Error${typeComplement}`
				: typeComplement;
			break;

		case 'number':
			typeComplement += isInteger ? ': integer' : (isFloat ? ': float' : '');
			break;

		case 'function':
			typeComplement += isAsync ? ': async' : '';
			typeComplement += isGenerator ? ': generator' : '';
			typeComplement += isClass ? ': class' : '';
			break;

		default:
			break;
	}

	if (isCircular) {
		return `${displayedTab}(${type}${typeComplement}: circular)`;
	}

	let nestedDiplay = null;
	if (keys) {
		const manyElements = keys.length > 1;
		const bracesInnerSpace = manyElements ? nl : repeatString(' ', keys.length);
		const bracesBeforeClose = bracesInnerSpace + (manyElements ? rootTab : '');

		function renderNestedValue(val, showKeys, isNode) {
			const tagName = isNode ? val.tagName.toLowerCase() : null;

			const nestedParents = [...parents, value];
			const nestedDeepness = deepness + (manyElements ? 1 : 0);

			return showKeys
				? `${tagName || ''}${bracesInnerSpace}${keys
					.map(key => ({
						key,
						value: isNode ? val.getAttribute(key) : val[key]
					}))
					.map(el => Object.assign(el, {
						useShortKey: typeof el.key === 'string' || el.key instanceof String,
						keyData: stringable(el.key, noFormatter),
						valueData: stringable(el.value, noFormatter)
					}))
					.map(el => Object.assign(el, {
						k: defaultFormatter(el.keyData, nestedParents, nestedDeepness, manyElements),
						v: defaultFormatter(el.valueData, nestedParents, nestedDeepness, false)
					}))
					.map(el => Object.assign(el, {
						k: (()=>{
							if (!el.useShortKey) {return el.k};
							const numberOfTab = (el.k.length - el.k.trim().length) / tab.length;

							return repeatString(tab, numberOfTab)+el.key;
						})()
					}))
					.map(el => `${el.k}: ${getterOrSetterMarker(value, el.key, el.v)}`)
					.join(comma+nl)
				}${bracesBeforeClose}`
				: `${bracesInnerSpace}${keys
					.map(key => val[key])
					.map(el => stringable(el, noFormatter))
					.map(data => defaultFormatter(data, nestedParents, nestedDeepness, manyElements))
					.join(comma+nl)
				}${bracesBeforeClose}`;
		}

		if (value instanceof Array || (_NodeList && value instanceof _NodeList)) {
			nestedDiplay = `[${renderNestedValue(value, false, false)}]`;
		}
		else if(_Node && value instanceof _Node) {
			nestedDiplay = `<${renderNestedValue(value, true, true)}>`;
		}
		else {
			nestedDiplay = `{${renderNestedValue(value, true, false)}}`;
		}
	}

	let displayedValue = displayValue ? ` => ${nestedDiplay || functionName || simpleQuoteString || stringifiedValue}` : '';
	if (value instanceof Error) {
		displayedValue = value.message ? ` => ${value.message}` : '';
	}
	return `${displayedTab}(${type}${typeComplement}${displayedValue})`;
}

module.exports = stringable;