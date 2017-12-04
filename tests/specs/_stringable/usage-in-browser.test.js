'use strict';

const assert = require('assert');

const test = require('ava');

const { JSDOM } = require("jsdom");

const requireFromIndex = require('../../utils/require-from-index');

const defaultFormatterMacro = require('./default-formatter.macro');
const customFormatterDataMacro = require('./custom-formatter-data.macro');

const testDom = new JSDOM(`<!DOCTYPE html>
	<header></header>
	<body>
		<div class="one-one"></div>
		<h1 class="test">Hello world</h1>
		<div class="one-two" title="Jo"></div>
		<h2>Hello world</h2>
		<div class="two-one"></div>
		<h1>Hello world</h1>
		<div class="test"></div>
		<a class="test"><input class="two-one"/></a>
		<p class="text"></p>
		<span></span>
		<select></select>
		<select type="text" class="hello"></select>
		<h6></h6>
		<div class="two-two" type="text"></div>
		<title class="two-two" title="name"></title>
		<h4>Hello</h4>
		<textarea></textarea>
		<div class="multiple-attributes" data-rocket enabled data-name=false title="john" data-age=5><h4>World</h4></div>
		<textarea type='text'></textarea>
	</body>
</html>`);

global.window = testDom.window;

/*---------------------------*/

test('Usage with no Node', defaultFormatterMacro, {
	input: testDom.window.document.querySelector('div.no-node-robot'),
	expectedResult: `(object => null)`
});

test('Usage with a Node without attribute', defaultFormatterMacro, {
	input: testDom.window.document.querySelector('h6'),
	expectedResult: '(object: HTMLHeadingElement => <h6>)'
});
test('Usage with a Node without attribute', customFormatterDataMacro, {
	input: testDom.window.document.querySelector('h6'),
	defaultFormatterExpectedResult: '(object: HTMLHeadingElement => <h6>)',
	expectedData: {
		type: 'object',
		stringifiedValue: '[object HTMLHeadingElement]',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'HTMLHeadingElement',
		keys: [],
		functionName: null,
		isAsync: false,
		isGenerator: false,
		isClass: false
	}
});

test('Usage with a Node with one attribute', defaultFormatterMacro, {
	input: testDom.window.document.querySelector('p.text'),
	expectedResult: `(object: HTMLParagraphElement => <p class: (string => 'text') >)`
});
test('Usage with a Node with one attribute', customFormatterDataMacro, {
	input: testDom.window.document.querySelector('p.text'),
	defaultFormatterExpectedResult: `(object: HTMLParagraphElement => <p class: (string => 'text') >)`,
	expectedData: {
		type: 'object',
		stringifiedValue: '[object HTMLParagraphElement]',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'HTMLParagraphElement',
		keys: ['class'],
		functionName: null,
		isAsync: false,
		isGenerator: false,
		isClass: false
	}
});

test('Usage with a Node with attributes', defaultFormatterMacro, {
	input: testDom.window.document.querySelector('div.multiple-attributes'),
	expectedResult: [
		'(object: HTMLDivElement => <div',
		`  class: (string => 'multiple-attributes'),`,
		`  data-rocket: (string => ''),`,
		`  enabled: (string => ''),`,
		`  data-name: (string => 'false'),`,
		`  title: (string => 'john'),`,
		`  data-age: (string => '5')`,
		'>)'
	].join('\n')
});
test('Usage with a Node with attributes', customFormatterDataMacro, {
	input: testDom.window.document.querySelector('div.multiple-attributes'),
	defaultFormatterExpectedResult: [
		'(object: HTMLDivElement => <div',
		`  class: (string => 'multiple-attributes'),`,
		`  data-rocket: (string => ''),`,
		`  enabled: (string => ''),`,
		`  data-name: (string => 'false'),`,
		`  title: (string => 'john'),`,
		`  data-age: (string => '5')`,
		'>)'
	].join('\n'),
	expectedData: {
		type: 'object',
		stringifiedValue: '[object HTMLDivElement]',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'HTMLDivElement',
		keys: ['class', 'data-rocket', 'enabled', 'data-name', 'title', 'data-age'],
		functionName: null,
		isAsync: false,
		isGenerator: false,
		isClass: false
	}
});

test('Usage with an empty NodeList', defaultFormatterMacro, {
	input: testDom.window.document.querySelectorAll('div.no-node-robot'),
	expectedResult: `(object: NodeList => [])`
});
test('Usage with an empty NodeList', customFormatterDataMacro, {
	input: testDom.window.document.querySelectorAll('div.no-node-robot'),
	defaultFormatterExpectedResult: `(object: NodeList => [])`,
	expectedData: {
		type: 'object',
		stringifiedValue: '[object NodeList]',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'NodeList',
		keys: [],
		functionName: null,
		isAsync: false,
		isGenerator: false,
		isClass: false
	}
});

test('Usage with a NodeList containing one attributeless Node instance', defaultFormatterMacro, {
	input: testDom.window.document.querySelectorAll('span'),
	expectedResult: '(object: NodeList => [ (object: HTMLSpanElement => <span>) ])'
});

test('Usage with a NodeList containing two attributeless Node instances', defaultFormatterMacro, {
	input: testDom.window.document.querySelectorAll('h4'),
	expectedResult: [
		`(object: NodeList => [`,
		`  (object: HTMLHeadingElement => <h4>),`,
		`  (object: HTMLHeadingElement => <h4>)`,
		`])`
	].join('\n')
});

test('Usage with a NodeList containing one attributeful Node instance - 1 attribute', defaultFormatterMacro, {
	input: testDom.window.document.querySelectorAll('.one-one'),
	expectedResult: `(object: NodeList => [ (object: HTMLDivElement => <div class: (string => 'one-one') >) ])`
});

test('Usage with a NodeList containing two attributeful Node instances - 1 attribute', defaultFormatterMacro, {
	input: testDom.window.document.querySelectorAll('.two-one'),
	expectedResult: [
		`(object: NodeList => [`,
		`  (object: HTMLDivElement => <div class: (string => 'two-one') >),`,
		`  (object: HTMLInputElement => <input class: (string => 'two-one') >)`,
		`])`
	].join('\n')
});

test('Usage with a NodeList containing one attributeless and one attributeful Node instances - 1 attribute', defaultFormatterMacro, {
	input: testDom.window.document.querySelectorAll('textarea'),
	expectedResult: [
		`(object: NodeList => [`,
		`  (object: HTMLTextAreaElement => <textarea>),`,
		`  (object: HTMLTextAreaElement => <textarea type: (string => 'text') >)`,
		`])`
	].join('\n')
});

test('Usage with a NodeList containing one attributeful Node instance - 2 attributes', defaultFormatterMacro, {
	input: testDom.window.document.querySelectorAll('.one-two'),
	expectedResult: [
		`(object: NodeList => [ (object: HTMLDivElement => <div`,
		`  class: (string => 'one-two'),`,
		`  title: (string => 'Jo')`,
		`>) ])`
	].join('\n')
});

test('Usage with a NodeList containing two attributeful Node instances - 2 attributes', defaultFormatterMacro, {
	input: testDom.window.document.querySelectorAll('.two-two'),
	expectedResult: [
		`(object: NodeList => [`,
		`  (object: HTMLDivElement => <div`,
		`    class: (string => 'two-two'),`,
		`    type: (string => 'text')`,
		`  >),`,
		`  (object: HTMLTitleElement => <title`,
		`    class: (string => 'two-two'),`,
		`    title: (string => 'name')`,
		`  >)`,
		`])`
	].join('\n')
});

test('Usage with a NodeList containing one attributeless and one attributeful Node instances - 2 attributes', defaultFormatterMacro, {
	input: testDom.window.document.querySelectorAll('select'),
	expectedResult: [
		`(object: NodeList => [`,
		`  (object: HTMLSelectElement => <select>),`,
		`  (object: HTMLSelectElement => <select`,
		`    type: (string => 'text'),`,
		`    class: (string => 'hello')`,
		`  >)`,
		`])`
	].join('\n')
});

test('Usage with a NodeList containing one attributeless and one attributeful Node instances - 2 attributes', customFormatterDataMacro, {
	input: testDom.window.document.querySelectorAll('select'),
	defaultFormatterExpectedResult: [
		`(object: NodeList => [`,
		`  (object: HTMLSelectElement => <select>),`,
		`  (object: HTMLSelectElement => <select`,
		`    type: (string => 'text'),`,
		`    class: (string => 'hello')`,
		`  >)`,
		`])`
	].join('\n'),
	expectedData: {
		type: 'object',
		stringifiedValue: '[object NodeList]',
		isInteger: false,
		isFloat: false,
		simpleQuoteString: null,
		doubleQuoteString: null,
		constructorName: 'NodeList',
		keys: ['0', '1'],
		functionName: null,
		isAsync: false,
		isGenerator: false,
		isClass: false
	}
});