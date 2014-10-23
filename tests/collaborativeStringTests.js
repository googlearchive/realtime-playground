
window.testSuite.load(new TestingClass('Collaborative String','collaborativeStringTests.js')
	.reset({
		run: function () {
			testDocument1.string.setText('hello world');
		},
		assert: function () {
			// Do not start any tests until this passes
			return testDocument1.string.getText() == 'hello world' &&
				testDocument2.string.getText() == 'hello world';
		}
	})
	.test({
		description: 'toString()',
		run: function () {

		},
		assert: function () {
			return testDocument1.string.toString() == 'hello world' &&
				testDocument2.string.toString() == 'hello world';
		}
	})
	.test({
		description: 'getText()',
		run: function () {},
		assert: function () {
			return testDocument1.string.getText() == 'hello world' &&
				testDocument2.string.getText() == 'hello world';
		}
	})
	.test({
		description: 'setText()',
		run: function () {
			testDocument1.string.setText('dog');
		},
		assert: function () {
			return testDocument1.string.getText() == 'dog' &&
				testDocument2.string.getText() == 'dog';
		}
	})
	.test({
		description: 'append()',
		run: function () {
			testDocument1.string.append('-append');
		},
		assert: function () {
			return testDocument1.string.getText() == 'hello world-append' &&
				testDocument2.string.getText() == 'hello world-append';
		}
	})
	.test({
		description: 'insertString()',
		run: function () {
			testDocument1
			testDocument1.string.insertString(1, '-test-')
		},
		assert: function () {
			return testDocument1.string.getText() == 'h-test-ello world' &&
				testDocument2.string.getText() == 'h-test-ello world';
		}
	})
	.test({
		description: 'removeRange()',
		run: function () {
			testDocument1.string.removeRange(1,5);
		},
		assert: function () {
			return testDocument1.string.getText() == 'h world' &&
				testDocument2.string.getText() == 'h world';
		}
	})
	.teardown({
		run: function () {
			// Return the document back to it's original settings for subsequent tests
			testDocument1.string.setText('');
			testDocument1.list.clear();
			testDocument1.map.set('key1', 1);
			testDocument1.map.set('key2', 2);
			testDocument3 = null;
		},
		assert: function () {
			return testDocument1.string.getText() == '' &&
				testDocument1.list.asArray().length == 0 &&
				testDocument1.map.get('key1') == 1 &&
				testDocument1.map.get('key2') == 2 &&
				testDocument2.string.getText() == '' &&
				testDocument2.list.asArray().length == 0 &&
				testDocument2.map.get('key1') == 1 &&
				testDocument2.map.get('key2') == 2;
		}
	}));
