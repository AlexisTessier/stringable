'use strict';

const test = require('ava');

const msg = require('@alexistessier/msg');

const requireFromIndex = require('../../utils/require-from-index');

const defaultFormatterMacro = require('./default-formatter.macro');
const customFormatterDataMacro = require('./custom-formatter-data.macro');

const asyncSupport = process.version.indexOf('v8') === 0;

/*- literal string -*/

test('usage with literal string', defaultFormatterMacro, {
	input: `42 Literal string value 42`,
	expectedResult: `(string => '42 Literal string value 42')`
});

test('usage with literal string', customFormatterDataMacro, {
	input: `42 Literal string value 42`,
	defaultFormatterExpectedResult: `(string => '42 Literal string value 42')`,
	expectedData: {
		type: 'string',
		stringifiedValue: `"42 Literal string value 42"`,
		isInteger: false,
		isFloat: false,
		simpleQuoteString: `'42 Literal string value 42'`,
		doubleQuoteString: `"42 Literal string value 42"`,
		constructorName: 'String',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal empty string', defaultFormatterMacro, {
	input: ``,
	expectedResult: `(string => '')`
});

test('usage with literal empty string', customFormatterDataMacro, {
	input: ``,
	defaultFormatterExpectedResult: `(string => '')`,
	expectedData: {
		type: 'string',
		stringifiedValue: '""',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: `''`,
		doubleQuoteString: `""`,
		constructorName: 'String',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal blank string', defaultFormatterMacro, {
	input: `	 `,
	expectedResult: `(string => '	 ')`
});

test('usage with literal blank string', customFormatterDataMacro, {
	input: ` 	  `,
	defaultFormatterExpectedResult: `(string => ' 	  ')`,
	expectedData: {
		type: 'string',
		stringifiedValue: `" \\t  "`,
		isInteger: false,
		isFloat: false,
		simpleQuoteString: `' 	  '`,
		doubleQuoteString: `" 	  "`,
		constructorName: 'String',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal string containing simple quotes', defaultFormatterMacro, {
	input: `42 'quoted string' valu'e`,
	expectedResult: `(string => '42 \\'quoted string\\' valu\\'e')`
});

test('usage with literal string containing simple quotes', customFormatterDataMacro, {
	input: `42 'quoted string' value`,
	defaultFormatterExpectedResult: `(string => '42 \\'quoted string\\' value')`,
	expectedData: {
		type: 'string',
		stringifiedValue: `"42 'quoted string' value"`,
		isInteger: false,
		isFloat: false,
		simpleQuoteString: `'42 \\'quoted string\\' value'`,
		doubleQuoteString: `"42 'quoted string' value"`,
		constructorName: 'String',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal string containing double quotes', defaultFormatterMacro, {
	input: `42 "quoted string" valu"e`,
	expectedResult: `(string => '42 "quoted string" valu"e')`
});

test('usage with literal string containing double quotes', customFormatterDataMacro, {
	input: `42 "quoted string" value`,
	defaultFormatterExpectedResult: `(string => '42 "quoted string" value')`,
	expectedData: {
		type: 'string',
		stringifiedValue: `"42 \\"quoted string\\" value"`,
		isInteger: false,
		isFloat: false,
		simpleQuoteString: `'42 "quoted string" value'`,
		doubleQuoteString: `"42 \\"quoted string\\" value"`,
		constructorName: 'String',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

/*- literal number -*/

test('usage with literal Integer', defaultFormatterMacro, {
	input: 42,
	expectedResult: `(number: integer => 42)`
});
test('usage with literal Integer', customFormatterDataMacro, {
	input: 43,
	defaultFormatterExpectedResult: `(number: integer => 43)`,
	expectedData: {
		type: 'number',
		stringifiedValue: '43',
		isInteger: true,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal negative Integer', defaultFormatterMacro, {
	input: -27,
	expectedResult: `(number: integer => -27)`
});
test('usage with literal negative Integer', customFormatterDataMacro, {
	input: -43,
	defaultFormatterExpectedResult: `(number: integer => -43)`,
	expectedData: {
		type: 'number',
		stringifiedValue: '-43',
		isInteger: true,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal positive Integer', defaultFormatterMacro, {
	input: +2,
	expectedResult: `(number: integer => 2)`
});
test('usage with literal positive Integer', customFormatterDataMacro, {
	input: +38,
	defaultFormatterExpectedResult: `(number: integer => 38)`,
	expectedData: {
		type: 'number',
		stringifiedValue: '38',
		isInteger: true,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal Float without decimal', defaultFormatterMacro, {
	input: 30.,
	expectedResult: `(number: integer => 30)`
});

test('usage with literal Float without decimal', customFormatterDataMacro, {
	input: 3.,
	defaultFormatterExpectedResult: `(number: integer => 3)`,
	expectedData: {
		type: 'number',
		stringifiedValue: '3',
		isInteger: true,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal Float with only zero decimal', defaultFormatterMacro, {
	input: 21.00000,
	expectedResult: `(number: integer => 21)`
});

test('usage with literal Float with only zero decimal', customFormatterDataMacro, {
	input: 8.0000,
	defaultFormatterExpectedResult: `(number: integer => 8)`,
	expectedData: {
		type: 'number',
		stringifiedValue: '8',
		isInteger: true,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal Float', defaultFormatterMacro, {
	input: 30.9,
	expectedResult: `(number: float => 30.9)`
});
test('usage with literal Float', customFormatterDataMacro, {
	input: 47.8,
	defaultFormatterExpectedResult: `(number: float => 47.8)`,
	expectedData: {
		type: 'number',
		stringifiedValue: '47.8',
		isInteger: false,
		isFloat: true,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal negative Float', defaultFormatterMacro, {
	input: -33.2,
	expectedResult: `(number: float => -33.2)`
});
test('usage with literal negative Float', customFormatterDataMacro, {
	input: -75.873,
	defaultFormatterExpectedResult: `(number: float => -75.873)`,
	expectedData: {
		type: 'number',
		stringifiedValue: '-75.873',
		isInteger: false,
		isFloat: true,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal positive Float', defaultFormatterMacro, {
	input: +33.2,
	expectedResult: `(number: float => 33.2)`
});
test('usage with literal positive Float', customFormatterDataMacro, {
	input: +75.873,
	defaultFormatterExpectedResult: `(number: float => 75.873)`,
	expectedData: {
		type: 'number',
		stringifiedValue: '75.873',
		isInteger: false,
		isFloat: true,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal Float without unit', defaultFormatterMacro, {
	input: .2,
	expectedResult: `(number: float => 0.2)`
});

test('usage with literal Float without unit', customFormatterDataMacro, {
	input: .8,
	defaultFormatterExpectedResult: `(number: float => 0.8)`,
	expectedData: {
		type: 'number',
		stringifiedValue: '0.8',
		isInteger: false,
		isFloat: true,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal Float without unit and zero as decimal', defaultFormatterMacro, {
	input: .0,
	expectedResult: `(number: integer => 0)`
});

test('usage with literal Float without unit and zero as decimal', customFormatterDataMacro, {
	input: .0,
	defaultFormatterExpectedResult: `(number: integer => 0)`,
	expectedData: {
		type: 'number',
		stringifiedValue: '0',
		isInteger: true,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal Float without unit and lot of zero as decimal', defaultFormatterMacro, {
	input: .000000,
	expectedResult: `(number: integer => 0)`
});

test('usage with literal Float without unit and lot of zero as decimal', customFormatterDataMacro, {
	input: .000000,
	defaultFormatterExpectedResult: `(number: integer => 0)`,
	expectedData: {
		type: 'number',
		stringifiedValue: '0',
		isInteger: true,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal Float with unit and lot of zero as unit and decimal', defaultFormatterMacro, {
	input: 0.000000,
	expectedResult: `(number: integer => 0)`
});

test('usage with literal Float with unit and lot of zero as unit and decimal', customFormatterDataMacro, {
	input: 0.000000,
	defaultFormatterExpectedResult: `(number: integer => 0)`,
	expectedData: {
		type: 'number',
		stringifiedValue: '0',
		isInteger: true,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal Float with lot of decimal', defaultFormatterMacro, {
	input: 23.99834,
	expectedResult: `(number: float => 23.99834)`
});

test('usage with literal Float with lot of decimal', customFormatterDataMacro, {
	input: 23.9913428839644,
	defaultFormatterExpectedResult: `(number: float => 23.9913428839644)`,
	expectedData: {
		type: 'number',
		stringifiedValue: '23.9913428839644',
		isInteger: false,
		isFloat: true,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal NaN', defaultFormatterMacro, {
	input: NaN,
	expectedResult: `(number => NaN)`
});

test('usage with literal NaN', customFormatterDataMacro, {
	input: NaN,
	defaultFormatterExpectedResult: `(number => NaN)`,
	expectedData: {
		type: 'number',
		stringifiedValue: 'NaN',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with computed NaN', defaultFormatterMacro, {
	input: 0/0,
	expectedResult: `(number => NaN)`
});

test('usage with computed NaN', customFormatterDataMacro, {
	input: 0/0,
	defaultFormatterExpectedResult: `(number => NaN)`,
	expectedData: {
		type: 'number',
		stringifiedValue: 'NaN',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal Infinity', defaultFormatterMacro, {
	input: Infinity,
	expectedResult: `(number => Infinity)`
});

test('usage with literal Infinity', customFormatterDataMacro, {
	input: Infinity,
	defaultFormatterExpectedResult: `(number => Infinity)`,
	expectedData: {
		type: 'number',
		stringifiedValue: 'Infinity',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with computed Infinity', defaultFormatterMacro, {
	input: 1/0,
	expectedResult: `(number => Infinity)`
});

test('usage with computed Infinity', customFormatterDataMacro, {
	input: 2/0,
	defaultFormatterExpectedResult: `(number => Infinity)`,
	expectedData: {
		type: 'number',
		stringifiedValue: 'Infinity',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal negative Infinity', defaultFormatterMacro, {
	input: -Infinity,
	expectedResult: `(number => -Infinity)`
});

test('usage with literal negative Infinity', customFormatterDataMacro, {
	input: -Infinity,
	defaultFormatterExpectedResult: `(number => -Infinity)`,
	expectedData: {
		type: 'number',
		stringifiedValue: '-Infinity',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with computed negative Infinity', defaultFormatterMacro, {
	input: -1/0,
	expectedResult: `(number => -Infinity)`
});

test('usage with computed negative Infinity', customFormatterDataMacro, {
	input: -4/0,
	defaultFormatterExpectedResult: `(number => -Infinity)`,
	expectedData: {
		type: 'number',
		stringifiedValue: '-Infinity',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

/*- literal boolean -*/

test('usage with literal boolean true', defaultFormatterMacro, {
	input: true,
	expectedResult: `(boolean => true)`
});

test('usage with literal boolean true', customFormatterDataMacro, {
	input: true,
	defaultFormatterExpectedResult: `(boolean => true)`,
	expectedData: {
		type: 'boolean',
		stringifiedValue: 'true',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Boolean',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal boolean true', defaultFormatterMacro, {
	input: false,
	expectedResult: `(boolean => false)`
});

test('usage with literal boolean true', customFormatterDataMacro, {
	input: false,
	defaultFormatterExpectedResult: `(boolean => false)`,
	expectedData: {
		type: 'boolean',
		stringifiedValue: 'false',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Boolean',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

/*- literal regexp -*/

test('usage with literal empty RegExp', defaultFormatterMacro, {
	input: /$^/,
	expectedResult: `(object: RegExp => /$^/)`
});
test('usage with literal empty RegExp', customFormatterDataMacro, {
	input: /$^/,
	defaultFormatterExpectedResult: `(object: RegExp => /$^/)`,
	expectedData: {
		type: 'object',
		stringifiedValue: '/$^/',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: `RegExp`,
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal not empty RegExp', defaultFormatterMacro, {
	input: /regex\.content/,
	expectedResult: `(object: RegExp => /regex\\.content/)`
});
test('usage with literal not empty RegExp', customFormatterDataMacro, {
	input: /regex\.content-test/,
	defaultFormatterExpectedResult: `(object: RegExp => /regex\\.content-test/)`,
	expectedData: {
		type: 'object',
		stringifiedValue: '/regex\\.content-test/',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: `RegExp`,
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

/*- literal function -*/

test('usage with literal named function without parameters', defaultFormatterMacro, {
	input: function funcNameTest() {
		const t = 42;
		return t;
	},
	expectedResult: `(function => funcNameTest)`
});
test('usage with literal named function without parameters', customFormatterDataMacro, {
	input: function funcNameTestFormatter() {
		const t = 45;
		return t+42;
	},
	defaultFormatterExpectedResult: `(function => funcNameTestFormatter)`,
	expectedData: {
		type: 'function',
		stringifiedValue: `function funcNameTestFormatter() {
		const t = 45;
		return t + 42;
	}`,
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: `Function`,
		keys: null,
		functionName: 'funcNameTestFormatter',
		isAsync: false,
		isGenerator: false
	}
});

function funcNameTestFromOutside() {
	const t = 42;
	return t;
}

test('usage with literal named function without parameters from outside', defaultFormatterMacro, {
	input: funcNameTestFromOutside,
	expectedResult: `(function => funcNameTestFromOutside)`
});

test('usage with literal named function with one parameter', defaultFormatterMacro, {
	input: function funcNameTestParamOne(arg) {
		const t = 42;
		return t+arg;
	},
	expectedResult: `(function => funcNameTestParamOne)`
});
test('usage with literal named function with one parameter', customFormatterDataMacro, {
	input: function funcNameTestFormatter(arg) {
		const t = 15;
		return arg+t+42;
	},
	defaultFormatterExpectedResult: `(function => funcNameTestFormatter)`,
	expectedData: {
		type: 'function',
		stringifiedValue: `function funcNameTestFormatter(arg) {
		const t = 15;
		return arg + t + 42;
	}`,
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: `Function`,
		keys: null,
		functionName: 'funcNameTestFormatter',
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal named function with one parameter and default value', defaultFormatterMacro, {
	input: function funcNameTestParamOne(arg = 'default value') {
		const t = '42';
		return t+arg;
	},
	expectedResult: `(function => funcNameTestParamOne)`
});

test('usage with literal named function with multiple parameters', defaultFormatterMacro, {
	input: function funcNameTestOther(argOne, param, otherParam) {
		const t = 42;
		return t;
	},
	expectedResult: `(function => funcNameTestOther)`
});

test('usage with literal named function with multiple parameters and default values', defaultFormatterMacro, {
	input: function funcNameTestComplex(defArg = 37, argObj = {
		name(){return t+12},
		objKey: 'object value'
	}, { inner = 8, a = 'test'} = {a: 8}, ...restParams) {
		const t = 42;
		return t;
	},
	expectedResult: `(function => funcNameTestComplex)`
});
test('usage with literal named function with multiple parameters and default values', customFormatterDataMacro, {
	input: function funcNameTestComplex(argOne, argObj = {
		name(){return t+12},
		objKey: 'object value'
	}, { inner = 8, a = 'test'} = {a: 8}, ...restParams) {
		const t = 42;
		return t;
	},
	defaultFormatterExpectedResult: `(function => funcNameTestComplex)`,
	expectedData: {
		type: 'function',
		stringifiedValue: `function funcNameTestComplex(argOne, argObj = {
		name() {
			return t + 12;
		},
		objKey: 'object value'
	}, { inner = 8, a = 'test' } = { a: 8 }, ...restParams) {
		const t = 42;
		return t;
	}`,
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: `Function`,
		keys: null,
		functionName: 'funcNameTestComplex',
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal anonymous function', defaultFormatterMacro, {
	// eslint-disable-next-line func-names
	input: function () {
		const t = 44;
		return t*t;
	},
	expectedResult: `(function => input)`
});
test('usage with literal anonymous function', customFormatterDataMacro, {
	// eslint-disable-next-line func-names
	input: function () {
		const t = 48;
		return t*t;
	},
	defaultFormatterExpectedResult: `(function => input)`,
	expectedData: {
		type: 'function',
		stringifiedValue: `function () {
		const t = 48;
		return t * t;
	}`,
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: `Function`,
		keys: null,
		functionName: 'input',
		isAsync: false,
		isGenerator: false
	}
});

// eslint-disable-next-line func-names
const anonymousFunctionFromOutside = () => function () {
	const t = 44;
	return t*t;
}

test('usage with literal anonymous function from outside', defaultFormatterMacro, {
	// eslint-disable-next-line func-names
	input: anonymousFunctionFromOutside(),
	expectedResult: `(function)`
});
test('usage with literal anonymous function from outside', customFormatterDataMacro, {
	// eslint-disable-next-line func-names
	input: anonymousFunctionFromOutside(),
	defaultFormatterExpectedResult: `(function)`,
	expectedData: {
		type: 'function',
		stringifiedValue: `function () {
	const t = 44;
	return t * t;
}`,
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: `Function`,
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal method', defaultFormatterMacro, {
	input(){
		const t = 44;
		return t*t;
	},
	expectedResult: `(function => input)`
});
test('usage with literal method', customFormatterDataMacro, {
	input(){
		const t = 49;
		return t*t;
	},
	defaultFormatterExpectedResult: `(function => input)`,
	expectedData: {
		type: 'function',
		stringifiedValue: `input() {
		const t = 49;
		return t * t;
	}`,
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: `Function`,
		keys: null,
		functionName: 'input',
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal computed name method', defaultFormatterMacro, {
	// eslint-disable-next-line no-useless-computed-key
	['input'](){
		const t = 44;
		return t*t;
	},
	expectedResult: `(function => input)`
});
test('usage with literal computed name method', customFormatterDataMacro, {
	// eslint-disable-next-line no-useless-computed-key
	['input'](){
		const t = 49;
		return t*t;
	},
	defaultFormatterExpectedResult: `(function => input)`,
	expectedData: {
		type: 'function',
		stringifiedValue: `() {
		const t = 49;
		return t * t;
	}`,
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: `Function`,
		keys: null,
		functionName: 'input',
		isAsync: false,
		isGenerator: false
	}
});

const emptyNameMethodContainer = {
	// eslint-disable-next-line no-useless-computed-key
	[' 	  '](){
		return 'yo';
	}
}

test('usage with empty computed name method', defaultFormatterMacro, {
	input: emptyNameMethodContainer[' 	  '],
	expectedResult: `(function)`
});
test('usage with empty computed name method', customFormatterDataMacro, {
	// eslint-disable-next-line no-useless-computed-key
	['input']: emptyNameMethodContainer[' 	  '],
	defaultFormatterExpectedResult: `(function)`,
	expectedData: {
		type: 'function',
		stringifiedValue: `() {
		return 'yo';
	}`,
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: `Function`,
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal arrow function', defaultFormatterMacro, {
	input: () => {
		const t = 44;
		return t*t;
	},
	expectedResult: `(function => input)`
});
test('usage with literal arrow function', customFormatterDataMacro, {
	input: () => {
		const t = 44;
		return t*t;
	},
	defaultFormatterExpectedResult: `(function => input)`,
	expectedData: {
		type: 'function',
		stringifiedValue: `() => {
		const t = 44;
		return t * t;
	}`,
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: `Function`,
		keys: null,
		functionName: 'input',
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal arrow function with parameters', defaultFormatterMacro, {
	input: (argOne = 43) => {
		const t = 44;
		return t*t;
	},
	expectedResult: `(function => input)`
});
test('usage with literal arrow function with parameters', customFormatterDataMacro, {
	input: (argOne = 43) => {
		const t = 44;
		return t*t;
	},
	defaultFormatterExpectedResult: `(function => input)`,
	expectedData: {
		type: 'function',
		stringifiedValue: `(argOne = 43) => {
		const t = 44;
		return t * t;
	}`,
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: `Function`,
		keys: null,
		functionName: 'input',
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal arrow function with one parameter without braces', defaultFormatterMacro, {
	input: argOne => {
		const t = 44;
		return t*t;
	},
	expectedResult: `(function => input)`
});
test('usage with literal arrow function with one parameter without braces', customFormatterDataMacro, {
	input: argOne => {
		const t = 44;
		return t*t;
	},
	defaultFormatterExpectedResult: `(function => input)`,
	expectedData: {
		type: 'function',
		stringifiedValue: `argOne => {
		const t = 44;
		return t * t;
	}`,
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: `Function`,
		keys: null,
		functionName: 'input',
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal arrow function with one parameter without braces nor spaces', defaultFormatterMacro, {
	input: argOne=>{
		const t = 44;
		return t*t;
	},
	expectedResult: `(function => input)`
});
test('usage with literal arrow function with one parameter without braces nor spaces', customFormatterDataMacro, {
	input: argOne=>{
		const t = 44;
		return t*t;
	},
	defaultFormatterExpectedResult: `(function => input)`,
	expectedData: {
		type: 'function',
		stringifiedValue: `argOne => {
		const t = 44;
		return t * t;
	}`,
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: `Function`,
		keys: null,
		functionName: 'input',
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal async function', defaultFormatterMacro, {
	input: async function anAsyncFunctionTest(){
		const t = 44;
		await 5;
		return t*t;
	},
	expectedResult: asyncSupport
		? `(function: async => anAsyncFunctionTest)`
		: `(function => anAsyncFunctionTest)`
});

async function anAsyncFunctionTest(){
	const t = 44;
	await 5;
	return t*t;
}
test('usage with literal async function', customFormatterDataMacro, {
	input: anAsyncFunctionTest,
	defaultFormatterExpectedResult: asyncSupport
		? `(function: async => anAsyncFunctionTest)`
		: `(function => anAsyncFunctionTest)`,
	expectedData: {
		type: 'function',
		stringifiedValue: `${anAsyncFunctionTest}`,
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: asyncSupport ? `AsyncFunction` : `Function`,
		keys: null,
		functionName: 'anAsyncFunctionTest',
		isAsync: asyncSupport ? true : false,
		isGenerator: false
	}
});

test('usage with literal async function with one parameter', defaultFormatterMacro, {
	input: async function anAsyncFunctionTest3(argOneT){
		const t = 44;
		await 5;
		return t*t+argOneT;
	},
	expectedResult: asyncSupport
		? `(function: async => anAsyncFunctionTest3)`
		: `(function => anAsyncFunctionTest3)`
});

test('usage with literal async function with parameters and default', defaultFormatterMacro, {
	input: async function anAsyncFunctionTestWithParams(argOne, argTwo = 78){
		const t = 44;
		await 9;
		return t*t+argOne*argTwo;
	},
	expectedResult: asyncSupport
		? `(function: async => anAsyncFunctionTestWithParams)`
		: `(function => anAsyncFunctionTestWithParams)`
});

test('usage with literal async anonymous function', defaultFormatterMacro, {
	// eslint-disable-next-line func-names
	input: async function(){
		const t = 44;
		await 5;
		return t*t;
	},
	expectedResult: asyncSupport
		? `(function: async => input)`
		: `(function => input)`
});

test('usage with literal async arrow function', defaultFormatterMacro, {
	input: async () => {
		const t = 44;
		await 5;
		return t*t;
	},
	expectedResult: asyncSupport
		? `(function: async => input)`
		: `(function => input)`
});

test('usage with literal async method function', defaultFormatterMacro, {
	async input(){
		const t = 44;
		await 5;
		return t*t;
	},
	expectedResult: asyncSupport
		? `(function: async => input)`
		: `(function => input)`
});

test('usage with literal async method function and computed name', defaultFormatterMacro, {
	// eslint-disable-next-line no-useless-computed-key
	async ['input'](){
		const t = 44;
		await 5;
		return t*t;
	},
	expectedResult: asyncSupport
		? `(function: async => input)`
		: `(function => input)`
});

function* aGenerator(){
	return 'hello';
}
test('usage with literal generator function', defaultFormatterMacro, {
	input: aGenerator,
	expectedResult: '(function: generator => aGenerator)'
});
test('usage with literal generator function', customFormatterDataMacro, {
	input: aGenerator,
	defaultFormatterExpectedResult: '(function: generator => aGenerator)',
	expectedData: {
		type: 'function',
		stringifiedValue: `${aGenerator}`,
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: `GeneratorFunction`,
		keys: null,
		functionName: 'aGenerator',
		isAsync: false,
		isGenerator: true
	}
});

test('usage with literal generator anonymous function (object key as name)', defaultFormatterMacro, {
	// eslint-disable-next-line func-names
	input: function* (){
		return 'hello';
	},
	expectedResult: '(function: generator => input)'
});
test('usage with literal generator anonymous function (object key as name)', customFormatterDataMacro, {
	// eslint-disable-next-line func-names
	input: function* (){
		return 'hello';
	},
	defaultFormatterExpectedResult: '(function: generator => input)',
	expectedData: {
		type: 'function',
		stringifiedValue: `function* () {\n\t\treturn 'hello';\n\t}`,
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: `GeneratorFunction`,
		keys: null,
		functionName: 'input',
		isAsync: false,
		isGenerator: true
	}
});

// eslint-disable-next-line func-names
const anonymousGenerator = () => function* (){
	return 'hello';
}
test('usage with literal generator anonymous function', defaultFormatterMacro, {
	input: anonymousGenerator(),
	expectedResult: '(function: generator)'
});
test('usage with literal generator anonymous function', customFormatterDataMacro, {
	input: anonymousGenerator(),
	defaultFormatterExpectedResult: '(function: generator)',
	expectedData: {
		type: 'function',
		stringifiedValue: `function* () {\n\treturn 'hello';\n}`,
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: `GeneratorFunction`,
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: true
	}
});

/*- literal falsy values -*/

test('usage with literal null', defaultFormatterMacro, {
	input: null,
	expectedResult: `(object => null)`
});
test('usage with literal null', customFormatterDataMacro, {
	input: null,
	defaultFormatterExpectedResult: `(object => null)`,
	expectedData: {
		type: 'object',
		stringifiedValue: 'null',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: null,
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal undefined', defaultFormatterMacro, {
	input: undefined,
	expectedResult: `(undefined)`
});
test('usage with literal undefined', customFormatterDataMacro, {
	input: undefined,
	defaultFormatterExpectedResult: `(undefined)`,
	expectedData: {
		type: 'undefined',
		stringifiedValue: 'undefined',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: null,
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

/*- Object string -*/

test('usage with instance of String', defaultFormatterMacro, {
	input: new String('a string from object'),
	expectedResult: `(object: String => 'a string from object')`
});
test('usage with instance of String', customFormatterDataMacro, {
	input: new String('	a string from object with custom formatter '),
	defaultFormatterExpectedResult: `(object: String => '	a string from object with custom formatter ')`,
	expectedData: {
		type: 'object',
		stringifiedValue: '"\\ta string from object with custom formatter "',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: `'	a string from object with custom formatter '`,
		doubleQuoteString: `"	a string from object with custom formatter "`,
		constructorName: 'String',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with instance of empty String', defaultFormatterMacro, {
	input: new String(''),
	expectedResult: `(object: String => '')`
});
test('usage with instance of empty String', customFormatterDataMacro, {
	input: new String(''),
	defaultFormatterExpectedResult: `(object: String => '')`,
	expectedData: {
		type: 'object',
		stringifiedValue: '""',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: `''`,
		doubleQuoteString: `""`,
		constructorName: 'String',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with instance of blank String', defaultFormatterMacro, {
	input: new String(' 	'),
	expectedResult: `(object: String => ' 	')`
});
test('usage with instance of blank String', customFormatterDataMacro, {
	input: new String('	  '),
	defaultFormatterExpectedResult: `(object: String => '	  ')`,
	expectedData: {
		type: 'object',
		stringifiedValue: '"\\t  "',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: `'	  '`,
		doubleQuoteString: `"	  "`,
		constructorName: 'String',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

/*- Object number -*/

test('usage with instance of Number', defaultFormatterMacro, {
	input: new Number(),
	expectedResult: `(object: Number: integer => 0)`
});
test('usage with instance of Number', customFormatterDataMacro, {
	input: new Number(NaN),
	defaultFormatterExpectedResult: `(object: Number => NaN)`,
	expectedData: {
		type: 'object',
		stringifiedValue: 'NaN',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with instance of Number (integer)', defaultFormatterMacro, {
	input: new Number(89),
	expectedResult: `(object: Number: integer => 89)`
});
test('usage with instance of Number (integer)', customFormatterDataMacro, {
	input: new Number(89),
	defaultFormatterExpectedResult: `(object: Number: integer => 89)`,
	expectedData: {
		type: 'object',
		stringifiedValue: '89',
		isInteger: true,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with instance of Number (float)', defaultFormatterMacro, {
	input: new Number(42.765),
	expectedResult: `(object: Number: float => 42.765)`
});
test('usage with instance of Number (float)', customFormatterDataMacro, {
	input: new Number(46.871030),
	defaultFormatterExpectedResult: `(object: Number: float => 46.87103)`,
	expectedData: {
		type: 'object',
		stringifiedValue: '46.87103',
		isInteger: false,
		isFloat: true,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Number',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

/*- Object boolean -*/

test('usage with instance of true Boolean', defaultFormatterMacro, {
	input: new Boolean(true),
	expectedResult: `(object: Boolean => true)`
});
test('usage with instance of true Boolean', customFormatterDataMacro, {
	input: new Boolean(true),
	defaultFormatterExpectedResult: `(object: Boolean => true)`,
	expectedData: {
		type: 'object',
		stringifiedValue: 'true',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Boolean',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with instance of false Boolean', defaultFormatterMacro, {
	input: new Boolean(false),
	expectedResult: `(object: Boolean => false)`
});
test('usage with instance of false Boolean', customFormatterDataMacro, {
	input: new Boolean(false),
	defaultFormatterExpectedResult: `(object: Boolean => false)`,
	expectedData: {
		type: 'object',
		stringifiedValue: 'false',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Boolean',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

/*- Object RegExp -*/

test('usage with instance of RegExp', defaultFormatterMacro, {
	input: new RegExp('$^'),
	expectedResult: `(object: RegExp => /$^/)`
});
test('usage with instance of RegExp', customFormatterDataMacro, {
	input: new RegExp('$^'),
	defaultFormatterExpectedResult: `(object: RegExp => /$^/)`,
	expectedData: {
		type: 'object',
		stringifiedValue: '/$^/',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'RegExp',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

/*- Object function -*/

test('usage with instance of Function', defaultFormatterMacro, {
	input: new Function('argOne', 'return argOne'),
	expectedResult: `(function => anonymous)`
});
test('usage with instance of Function', customFormatterDataMacro, {
	input: new Function('argOne', 'return argOne'),
	defaultFormatterExpectedResult: `(function => anonymous)`,
	expectedData: {
		type: 'function',
		// eslint-disable-next-line no-useless-escape
		stringifiedValue: `function anonymous(argOne\n/*${asyncSupport ? '\`\`' : ''}*/) {
return argOne
}`,
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Function',
		keys: null,
		functionName: 'anonymous',
		isAsync: false,
		isGenerator: false
	}
});

/*- Object symbol -*/

test('usage with instance of empty Symbol', defaultFormatterMacro, {
	input: Symbol(),
	expectedResult: `(symbol => Symbol())`
});
test('usage with instance of empty Symbol', customFormatterDataMacro, {
	input: Symbol(),
	defaultFormatterExpectedResult: `(symbol => Symbol())`,
	expectedData: {
		type: 'symbol',
		stringifiedValue: 'Symbol()',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Symbol',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with instance of Symbol', defaultFormatterMacro, {
	input: Symbol('symbol value'),
	expectedResult: `(symbol => Symbol(symbol value))`
});
test('usage with instance of empty Symbol', customFormatterDataMacro, {
	input: Symbol('other symbol value'),
	defaultFormatterExpectedResult: `(symbol => Symbol(other symbol value))`,
	expectedData: {
		type: 'symbol',
		stringifiedValue: 'Symbol(other symbol value)',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Symbol',
		keys: null,
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});


/*- literal array -*/

test('usage with literal empty Array', defaultFormatterMacro, {
	input: [],
	expectedResult: `(object: Array => [])`
});
test('usage with literal empty Array', customFormatterDataMacro, {
	input: [],
	defaultFormatterExpectedResult: `(object: Array => [])`,
	expectedData: {
		type: 'object',
		stringifiedValue: '',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Array',
		keys: [],
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal Array containing literal string', defaultFormatterMacro, {
	input: ['a string'],
	expectedResult: `(object: Array => [ (string => 'a string') ])`
});
test('usage with literal Array containing literal string', customFormatterDataMacro, {
	input: ['a string'],
	defaultFormatterExpectedResult: `(object: Array => [ (string => 'a string') ])`,
	expectedData: {
		type: 'object',
		stringifiedValue: 'a string',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Array',
		keys: ['0'],
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal Array containing literal strings', defaultFormatterMacro, {
	input: ['a string test', 'an other string'],
	expectedResult: `(object: Array => [\n  (string => 'a string test'),\n  (string => 'an other string')\n])`
});
test('usage with literal Array containing literal strings', customFormatterDataMacro, {
	input: ['a string test', 'an other string'],
	defaultFormatterExpectedResult: `(object: Array => [\n  (string => 'a string test'),\n  (string => 'an other string')\n])`,
	expectedData: {
		type: 'object',
		stringifiedValue: 'a string test,an other string',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Array',
		keys: ['0', '1'],
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal Array containing literal nested Array', defaultFormatterMacro, {
	input: [2, [3, 4], 'string'],
	expectedResult: [
		`(object: Array => [`,
		`\n  (number: integer => 2),`,
		`\n  (object: Array => [`,
		`\n    (number: integer => 3),`,
		`\n    (number: integer => 4)`,
		`\n  ]),`,
		`\n  (string => 'string')`,
		`\n])`
	].join('')
});
test('usage with literal Array containing literal strings', customFormatterDataMacro, {
	input: [92, [3, 8, 'hay'], 'string'],
	defaultFormatterExpectedResult: [
		`(object: Array => [`,
		`\n  (number: integer => 92),`,
		`\n  (object: Array => [`,
		`\n    (number: integer => 3),`,
		`\n    (number: integer => 8),`,
		`\n    (string => 'hay')`,
		`\n  ]),`,
		`\n  (string => 'string')`,
		`\n])`
	].join(''),
	expectedData: {
		type: 'object',
		stringifiedValue: '92,3,8,hay,string',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Array',
		keys: ['0', '1', '2'],
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

const literalArrayContainingNestedObject = [2, 'string', { key: 'value', func(){ return 5; }, ob: {obdeepkey: [42, false]}}];
const literalArrayContainingNestedObjectResult = [
	`(object: Array => [`,
	`\n  (number: integer => 2),`,
	`\n  (string => 'string'),`,
	`\n  (object => {`,
	`\n    [string => 'key']: (string => 'value'),`,
	`\n    [string => 'func']: (function => func),`,
	`\n    [string => 'ob']: (object => { [string => 'obdeepkey']: (object: Array => [`,
	`\n      (number: integer => 42),`,
	`\n      (boolean => false)`,
	`\n    ]) })`,
	`\n  })`,
	`\n])`
].join('');

test('usage with literal Array containing literal nested object', defaultFormatterMacro, {
	input: literalArrayContainingNestedObject,
	expectedResult: literalArrayContainingNestedObjectResult
});
test('usage with literal Array containing literal strings', customFormatterDataMacro, {
	input: literalArrayContainingNestedObject,
	defaultFormatterExpectedResult: literalArrayContainingNestedObjectResult,
	expectedData: {
		type: 'object',
		stringifiedValue: '2,string,[object Object]',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Array',
		keys: ['0', '1', '2'],
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

const circularArray = [
	42, [3], 'hay'
];
circularArray[1].push(circularArray);

test('usage with literal Array containing circular references', defaultFormatterMacro, {
	input: [2, circularArray],
	expectedResult: [
		`(object: Array => [`,
		`\n  (number: integer => 2),`,
		`\n  (object: Array => [`,
		`\n    (number: integer => 42),`,
		`\n    (object: Array => [`,
		`\n      (number: integer => 3),`,
		`\n      (object: Array: Circular)`,
		`\n    ]),`,
		`\n    (string => 'hay')`,
		`\n  ])`,
		`\n])`
	].join('')
});
test.todo('usage with literal Array containing circular references - custom formatter');

const circularArrayA = ['test', 41];
const circularArrayB = [circularArrayA, 42];
circularArrayA.push(circularArrayB);

test('usage with literal Array containing circular references - other pattern', defaultFormatterMacro, {
	input: [circularArrayA, circularArrayB],
	expectedResult: [
		`(object: Array => [`,
		`\n  (object: Array => [`,
		`\n    (string => 'test'),`,
		`\n    (number: integer => 41),`,
		`\n    (object: Array => [`,
		`\n      (object: Array: Circular),`,
		`\n      (number: integer => 42)`,
		`\n    ])`,
		`\n  ]),`,
		`\n  (object: Array => [`,
		`\n    (object: Array => [`,
		`\n      (string => 'test'),`,
		`\n      (number: integer => 41),`,
		`\n      (object: Array: Circular)`,
		`\n    ]),`,
		`\n    (number: integer => 42)`,
		`\n  ])`,
		`\n])`
	].join('')
});
test.todo('usage with literal Array containing circular references - other pattern - custom formatter');

/*- literal object -*/

test('usage with literal empty Object', defaultFormatterMacro, {
	input: {},
	expectedResult: `(object => {})`
});
test('usage with literal empty Object', customFormatterDataMacro, {
	input: {},
	defaultFormatterExpectedResult: `(object => {})`,
	expectedData: {
		type: 'object',
		stringifiedValue: '[object Object]',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Object',
		keys: [],
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal Object containing string as value', defaultFormatterMacro, {
	input: {keyName: 'key value string'},
	expectedResult: `(object => { [string => 'keyName']: (string => 'key value string') })`
});
test('usage with literal Object containing string as value', customFormatterDataMacro, {
	input: {keyName2: 'key val string'},
	defaultFormatterExpectedResult: `(object => { [string => 'keyName2']: (string => 'key val string') })`,
	expectedData: {
		type: 'object',
		stringifiedValue: '[object Object]',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Object',
		keys: ['keyName2'],
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

test('usage with literal Object containing strings as value', defaultFormatterMacro, {
	input: {key2: 'value string', 'key value test': 'test value as string'},
	expectedResult: `(object => {\n  [string => 'key2']: (string => 'value string'),\n  [string => 'key value test']: (string => 'test value as string')\n})`
});
test.todo('usage with literal Object containing strings as value - custom formatter');

test('usage with literal Object containing numbers as key', defaultFormatterMacro, {
	input: {
		5.9: 'hello',
		4: 2,
		42: function response(){return;}
	},
	expectedResult: [
		`(object => {`,
		`\n  [string => '4']: (number: integer => 2),`,
		`\n  [string => '42']: (function => response),`,
		`\n  [string => '5.9']: (string => 'hello')`,
		`\n})`
	].join('')
});
test.todo('usage with literal Object containing numbers as key - custom formatter');

test('usage with literal Object containing computed key', defaultFormatterMacro, {
	input: {
		name: 'Will',
		[{test: 'last name'}]: 'Smith',
		// eslint-disable-next-line no-useless-computed-key
		['age']: `Don't know`
	},
	expectedResult: [
		`(object => {`,
		`\n  [string => 'name']: (string => 'Will'),`,
		`\n  [string => '[object Object]']: (string => 'Smith'),`,
		`\n  [string => 'age']: (string => 'Don\\'t know')`,
		`\n})`
	].join('')
});
test.todo('usage with literal Object containing computed key - custom formatter');

test('usage with literal Object containing Symbol as key', defaultFormatterMacro, {
	input: {
		name: 'Will Smith',
		[Symbol()]: 76293,
		[Symbol('Phone number')]: 'XXXX-XXX'
	},
	expectedResult: [
		`(object => {`,
		`\n  [string => 'name']: (string => 'Will Smith'),`,
		`\n  [symbol => Symbol()]: (number: integer => 76293),`,
		`\n  [symbol => Symbol(Phone number)]: (string => 'XXXX-XXX')`,
		`\n})`
	].join('')
});
test.todo('usage with literal Object containing Symbol as key - custom formatter');

test('usage with literal Object containing get properties', defaultFormatterMacro, {
	input: {
		test: 2,
		get name(){return 'dora'}
	},
	expectedResult: [
		`(object => {`,
		`\n  [string => 'test']: (number: integer => 2),`,
		`\n  [string => 'name']: getter(string => 'dora')`,
		`\n})`
	].join('')
});
test.todo('usage with literal Object containing get properties - custom formatter');

test('usage with literal Object containing set properties', defaultFormatterMacro, {
	input: {
		test: 2,
		set name(val){Object.keys(val)}
	},
	expectedResult: [
		`(object => {`,
		`\n  [string => 'test']: (number: integer => 2),`,
		`\n  [string => 'name']: setter`,
		`\n})`
	].join('')
});
test.todo('usage with literal Object containing set properties - custom formatter');

test.skip('usage with literal Object containing nested object', defaultFormatterMacro, {
	input: {},
	expectedResult: `(object => {})`
});
test.todo('usage with literal Object containing nested object - custom formatter');

test.skip('usage with literal Object containing nested arrays', defaultFormatterMacro, {
	input: {},
	expectedResult: `(object => {})`
});
test.todo('usage with literal Object containing nested arrays - custom formatter');

test.skip('usage with literal Object containing nested object and circular reference', defaultFormatterMacro, {
	input: {},
	expectedResult: `(object => {})`
});
test.todo('usage with literal Object containing nested object and circular reference - custom formatter');

test.skip('usage with literal Object containing nested object and circular reference - other pattern', defaultFormatterMacro, {
	input: {},
	expectedResult: `(object => {})`
});
test.todo('usage with literal Object containing nested object and circular reference - other pattern - custom formatter');
/*- Object array -*/

test('usage with instance of Array', defaultFormatterMacro, {
	input: new Array('value', 43, 'test'),
	expectedResult: [
		`(object: Array => [`,
		`\n  (string => 'value'),`,
		`\n  (number: integer => 43),`,
		`\n  (string => 'test')`,
		`\n])`
	].join('')
});
test('usage with instance of Array - custom formatter', customFormatterDataMacro, {
	input: new Array('value', 43, true, null),
	defaultFormatterExpectedResult: [
		`(object: Array => [`,
		`\n  (string => 'value'),`,
		`\n  (number: integer => 43),`,
		`\n  (boolean => true),`,
		`\n  (object => null)`,
		`\n])`
	].join(''),
	expectedData: {
		type: 'object',
		stringifiedValue: 'value,43,true,',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'Array',
		keys: ['0', '1', '2', '3'],
		functionName: null,
		isAsync: false,
		isGenerator: false
	}
});

/*- Object -*/

test.todo('usage with instance of Object');
test.todo('usage with instance of Object - custom formatter');

test.todo('usage with instance of custom class');
test.todo('usage with instance of custom class - custom formatter');

/*- complex tests -*/

test.todo('usage with a very complex object containing lot of nested arrays and object with some circular references');

/*- errors handling -*/

test('usage with no parameters - throws error', t => {
	const stringable = requireFromIndex('sources/stringable');

	const noParametersError = t.throws(() => {
		stringable();
	});

	t.true(noParametersError instanceof TypeError);
	t.is(noParametersError.message, msg(
		`You are trying to use the stringable function without any arguments.`,
		`You must provide at least one value as first parameter.`
	));
});

test('usage with unused parameters - throws error', t => {
	const stringable = requireFromIndex('sources/stringable');

	const tooManyParametersError = t.throws(() => {
		stringable('value', ()=>{return;}, 'unexpected value');
	});

	t.true(tooManyParametersError instanceof TypeError);
	t.is(tooManyParametersError.message, msg(
		`You are trying to use the stringable function with more than 2 arguments.`,
		`The stringable function only accept 2 arguments. A value to format and a formatter function.`
	));
});

function unvalidFormatterErrorMacro(t, unvalidFormatter) {
	const stringable = requireFromIndex('sources/stringable');

	const unvalidFormatterError = t.throws(() => {
		stringable('value', unvalidFormatter);
	});

	t.true(unvalidFormatterError instanceof TypeError);
	t.is(unvalidFormatterError.message, msg(
		`${stringable(unvalidFormatter)} is not a valid stringable formatter.`,
		`The stringable formatter argument passed as the second parameter must be a function.`
	));
}

unvalidFormatterErrorMacro.title = providedTitle => (
	`usage with unvalid formatter - throws error - ${providedTitle}`
);

test('number', unvalidFormatterErrorMacro, 46);
test('null', unvalidFormatterErrorMacro, null);
test('true', unvalidFormatterErrorMacro, true);
test('false', unvalidFormatterErrorMacro, false);
test('symbol', unvalidFormatterErrorMacro, Symbol());
test('object', unvalidFormatterErrorMacro, {});
test('array', unvalidFormatterErrorMacro, []);
test('string', unvalidFormatterErrorMacro, 'a string');