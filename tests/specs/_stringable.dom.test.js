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

/*---------------------------*/

test.todo('Usage with a Node without attribute')
test.todo('Usage with a Node with one attribute')
test.todo('Usage with a Node with attributes')

test.todo('Usage with an empty NodeList')
test('Usage with a NodeList containing one attributeless Node instance', defaultFormatterMacro, {
	input: testDom.window.document.querySelectorAll('span'),
	expectedResult: '(object: NodeList => [ (object: HTMLSpanElement => <span>) ])'
});
test.todo('Usage with a NodeList containing two attributeless Node instances');
test.todo('Usage with a NodeList containing one attributeful Node instance - 1 attribute');
test.todo('Usage with a NodeList containing two attributeful Node instances - 1 attribute');
test.todo('Usage with a NodeList containing one attributeless and one attributeful Node instances - 1 attribute');
test.todo('Usage with a NodeList containing one attributeful Node instance - 2 attributes');
test.todo('Usage with a NodeList containing two attributeful Node instances - 2 attributes');
test.todo('Usage with a NodeList containing one attributeless and one attributeful Node instances - 2 attributes');