'use strict';

const assert = require('assert');

const test = require('ava');

const { JSDOM } = require("jsdom");

const requireFromIndex = require('../utils/require-from-index');

const defaultFormatterMacro = require('./default-formatter.macro');
const customFormatterDataMacro = require('./custom-formatter-data.macro');

const testDom = new JSDOM(`<!DOCTYPE html>
	<header></header>
	<body>
		<h1 class="test">Hello world</h1>
		<h2>Hello world</h2>
		<h1>Hello world</h1>
		<div class="test"></div>
		<a class="test"></a>
		<span></span>
	</body>
</html>`);

global.window = testDom.window;

test('Usage with a NodeList', defaultFormatterMacro, {
	input: testDom.window.document.querySelectorAll('span'),
	expectedResult: '(object: NodeList => [ (object: HTMLSpanElement => <span>) ])'
});

test.todo('Usage with a NodeList - other tests')