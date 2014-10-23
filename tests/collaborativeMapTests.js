
window.testSuite.load(new TestingClass('Collaborative Map', 'collaborativeMapTests.js')
	.reset({
		run: function () {
			testDocument1.map.set('key1', 1);
			testDocument1.map.set('key2', 2);
		},
		assert: function () {
			return testDocument1.map.get('key1') == 1 &&
				testDocument2.map.get('key1') == 1;
		}
	})
	.test({
		description: 'clear()',
		run: function () {
			testDocument1.map.clear();
		},
		assert: function () {
			return testDocument1.map.isEmpty() == true &&
				testDocument2.map.isEmpty() == true &&
				testDocument1.map.values().length == 0 &&
				testDocument2.map.values().length == 0;
		}
	})
	.test({
		description: 'delete()',
		run: function () {
			testDocument1.map.delete('key2');
		},
		assert: function () {
			return testDocument1.map.values().length == 1 &&
				testDocument2.map.values().length == 1 &&
				testDocument1.map.has('key1') &&
				testDocument2.map.has('key1');
		}
	})
	.test({
		description: 'get()',
		run: function () {
		},
		assert: function () {
			return testDocument1.map.get('key1') == 1 &&
				testDocument2.map.get('key1') == 1;
		}
	})
	.test({
		description: 'has()',
		run: function () {

		},
		assert: function () {
			return testDocument1.map.has('key1') == true &&
				testDocument2.map.has('key1') == true;
		}
	})
	.test({
		description: 'isEmpty()',
		run: function () {
			testDocument1.map.clear();
		},
		assert: function () {
			return testDocument1.map.isEmpty() == true &&
				testDocument2.map.isEmpty() == true;
		}
	})
	.test({
		description: 'items()',
		run: function () {

		},
		assert: function () {
			var items = testDocument1.map.items();
			var items2 = testDocument2.map.items();

			return 	items[0] instanceof Array &&
					items[1] instanceof Array &&
					items2[0] instanceof Array &&
					items2[1] instanceof Array &&
					(items.toString() == 'key2,2,key1,1' || items.toString() == 'key1,1,key2,2') &&
					(items2.toString() == 'key2,2,key1,1' || items2.toString() == 'key1,1,key2,2');
		}
	})
	.test({
		description: 'keys()',
		run: function () {

		},
		assert: function () {
			var key1 = testDocument1.map.keys().toString();
			var key2 = testDocument2.map.keys().toString();
			return (key1 == 'key2,key1' || key1 == 'key1,key2') &&
				(key2 == 'key2,key1' || key2 == 'key1,key2')
		}
	})
	.test({
		description: 'set()',
		run: function () {
			testDocument1.map.set('key2', 3);
		},
		assert: function () {
			return testDocument1.map.get('key2') == 3 &&
				testDocument2.map.get('key2') == 3;
		}
	})
	.test({
		description: 'values()',
		run: function () {
		},
		assert: function () {
				values1 = testDocument1.map.values().toString();
				values2 = testDocument2.map.values().toString()
			return (values1 == '2,1' || values1 == '1,2') &&
				(values2 == '2,1' || values2 == '1,2');
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
