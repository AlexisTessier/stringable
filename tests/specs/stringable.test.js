const test = require('ava');

const requireFromIndex = require('../utils/require-from-index');

test('Type and API', t => {
	const stringable = requireFromIndex('sources/stringable');
	const stringableFromIndex = requireFromIndex('index');

	t.is(stringableFromIndex, stringable);
	t.is(typeof stringable, 'function');
});

/*- Literal string -*/

test('usage with literal string', t => {
	const stringable = requireFromIndex('sources/stringable');

	const literal = '42 Literal string value 42';

	const result = stringable(literal);

	t.is(typeof result, 'string');
	t.is(result, `(string => '42 Literal string value 42')`)
});

test('usage with literal string - custom formatter', t => {
	const stringable = requireFromIndex('sources/stringable');

	const literal = '42 Literal string value 42';

	t.plan(6);

	const result = stringable(literal, data => {
		t.is(typeof data, 'object');
		t.is(data.value, literal);
		t.is(data.type, 'string');
		t.is(typeof data.defaultFormater, 'function');

		t.is(data.defaultFormater(data), '(string => \'42 Literal string value 42\')');

		return 'formated literal string';
	});

	t.is(result, 'formated literal string');
});

/*- Literal number -*/

test('usage with literal number', t => {
	const stringable = requireFromIndex('sources/stringable');

	const literal = 42;

	const result = stringable(literal);

	t.is(typeof result, 'string');
	t.is(result, `(number => 42)`)
});

test.todo('usage with literal number - custom formatter');

/*- ----- -*/

test.todo('usage with literal boolean true');
test.todo('usage with literal boolean true - custom formatter');

test.todo('usage with literal boolean false');
test.todo('usage with literal boolean false - custom formatter');

test.todo('usage with literal Array');
test.todo('usage with literal Array - custom formatter');

test.todo('usage with literal Integer');
test.todo('usage with literal Integer - custom formatter');

test.todo('usage with literal Float');
test.todo('usage with literal Float - custom formatter');

test.todo('usage with literal Object');
test.todo('usage with literal Object - custom formatter');

test.todo('usage with literal RegExp');
test.todo('usage with literal RegExp - custom formatter');

test.todo('usage with literal function');
test.todo('usage with literal function - custom formatter');

test.todo('usage with literal arrow function');
test.todo('usage with literal arrow function - custom formatter');

test.todo('usage with literal async function');
test.todo('usage with literal async function - custom formatter');

test.todo('usage with literal async arrow function');
test.todo('usage with literal async arrow function - custom formatter');

test.todo('usage with literal generator function');
test.todo('usage with literal generator function - custom formatter');

test.todo('usage with literal null');
test.todo('usage with literal null - custom formatter');

test.todo('usage with literal undefined');
test.todo('usage with literal undefined - custom formatter');

/*- ----- -*/

test.todo('usage with instance of String');
test.todo('usage with instance of String - custom formatter');

test.todo('usage with instance of Number');
test.todo('usage with instance of Number - custom formatter');

test.todo('usage with instance of Boolean');
test.todo('usage with instance of Boolean - custom formatter');

test.todo('usage with instance of Array');
test.todo('usage with instance of Array - custom formatter');

test.todo('usage with instance of Number (integer)');
test.todo('usage with instance of Number (integer) - custom formatter');

test.todo('usage with instance of Number (float)');
test.todo('usage with instance of Number (float) - custom formatter');

test.todo('usage with instance of Object');
test.todo('usage with instance of Object - custom formatter');

test.todo('usage with instance of custom class');
test.todo('usage with instance of custom class - custom formatter');

test.todo('usage with instance of RegExp');
test.todo('usage with instance of RegExp - custom formatter');

test.todo('usage with instance of Function');
test.todo('usage with instance of Function - custom formatter');

test.todo('usage with instance of Symbol');
test.todo('usage with instance of Symbol - custom formatter');

/*- ----- -*/

test.todo('usage with no parameters - throws error');