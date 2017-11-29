'use strict';

const test = require('ava');

const fs = require('fs');
const path = require('path');

const pathFromIndex = require('../utils/path-from-index');
const requireFromIndex = require('../utils/require-from-index');

function featureHasTestFileMacro(t, testFilename) {
	t.plan(1);

	return new Promise(resolve => {
		fs.access(path.join(__dirname, '_stringable', `${testFilename}.test.js`), err => {
			if (err) {t.fail(`The feature should be tested in a specific file. "${testFilename}" wasn't found (${err.message})`);}
			t.pass();
			resolve();
		});
	});
}

featureHasTestFileMacro.title = providedTitle => (
	`Feature has a test file - ${providedTitle}`
);

/*-------------------------------------------*/

test('Type and API', t => {
	const stringable = requireFromIndex('sources/stringable');
	const stringableFromIndex = requireFromIndex('index');

	t.is(stringableFromIndex, stringable);
	t.is(typeof stringable, 'function');
});

/*-------------------------------------------*/

test('Usage in node', featureHasTestFileMacro, 'usage-in-node');
test('Usage in browser', featureHasTestFileMacro, 'usage-in-browser');