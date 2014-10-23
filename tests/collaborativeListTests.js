
window.testSuite.load(new TestingClass('Collaborative List', 'collaborativeListTests.js')
	.reset({
		run: function () {
			testDocument1.list.clear();
		},
		assert: function () {
			return testDocument1.list.length == 0 &&
				testDocument2.list.length == 0;
		}
	})
	.test({
		description: 'push()',
		run: function () {
			testDocument1.list.push('a');
		},
		assert: function () {
			return testDocument1.list.length == 1 &&
				testDocument2.list.length == 1 &&
				testDocument1.list.asArray().toString() == 'a';
				testDocument2.list.asArray().toString() == 'a';
		}
	})
	.test({
		description: 'pushAll()',
		run: function () {
			testDocument1.list.pushAll(['a','b']);
		},
		assert: function () {
			return testDocument1.list.length == 2 &&
				testDocument2.list.length == 2 &&
				testDocument1.list.asArray().toString() == 'a,b';
				testDocument2.list.asArray().toString() == 'a,b';
		}
	})
	.test({
		description: 'removeValue()',
		run: function () {
			testDocument1.list.pushAll(['a','b']);
			this.wasRemoved = testDocument1.list.removeValue('a');
		},
		assert: function () {
			return testDocument1.list.length == 1 &&
				testDocument2.list.length == 1 &&
				testDocument1.list.asArray().toString() == 'b';
				testDocument2.list.asArray().toString() == 'b';
		}
	})
	.test({
		description: 'removeRange()',
		run: function () {
			testDocument1.list.pushAll(['a','b','c','d','e'])
			testDocument1.list.removeRange(2,3)
		},
		assert: function () {
			return testDocument1.list.length == 4 &&
				testDocument2.list.length == 4 &&
				testDocument1.list.asArray().toString() == 'a,b,d,e';
				testDocument2.list.asArray().toString() == 'a,b,d,e';
		}
	})
	.test({
		description: 'insert()',
		run: function () {
			testDocument1.list.push('a');
			testDocument1.list.insert(0, 'b');
		},
		assert: function () {
			return testDocument1.list.length == 2 &&
				testDocument2.list.length == 2 &&
				testDocument1.list.asArray().toString() == 'b,a';
				testDocument2.list.asArray().toString() == 'b,a';
		}
	})
	.test({
		description: 'remove()',
		run: function () {
			testDocument1.list.pushAll(['a','b','c'])
			testDocument1.list.remove(1)
		},
		assert: function () {
			return testDocument1.list.length == 2 &&
				testDocument2.list.length == 2 &&
				testDocument1.list.asArray().toString() == 'a,c';
				testDocument2.list.asArray().toString() == 'a,c';
		}
	})
	.test({
		description: 'clear()',
		precondition: {
			run: function () {
				testDocument1.list.pushAll(['a','b','c'])
			},
			assert: function () {
				return testDocument1.list.length == 3 &&
				testDocument2.list.length == 3;
			}
		},
		run: function () {
			testDocument1.list.clear();
		},
		assert: function () {
			return testDocument1.list.length == 0 &&
				testDocument2.list.length == 0;
		}
	})
	.test({
		description: 'insertAll()',
		run: function () {
			testDocument1.list.pushAll(['a','b','c']);
			testDocument1.list.insertAll(1,['d','e']);
		},
		assert: function () {
			return testDocument1.list.length == 5 &&
				testDocument2.list.length == 5 &&
				testDocument1.list.asArray().toString() == 'a,d,e,b,c';
				testDocument2.list.asArray().toString() == 'a,d,e,b,c';
		}
	})
	.test({
		description: 'get()',
		run: function () {
			testDocument1.list.pushAll(['a','b','c']);
		},
		assert: function () {
			return testDocument1.list.get(1) == 'b' &&
				testDocument2.list.get(1) == 'b';
		}
	})
	.test({
		description: 'asArray()',
		run: function () {
			testDocument1.list.pushAll(['a','b','c']);
		},
		assert: function () {
			return testDocument1.list.asArray() instanceof Array &&
				testDocument1.list.asArray().toString() == 'a,b,c';
		}
	})
	.test({
		description: 'indexOf()',
		run: function () {
			testDocument1.list.pushAll(['a','b','c']);
		},
		assert: function () {
			return testDocument1.list.indexOf('c') == 2 &&
				testDocument2.list.indexOf('c') == 2 &&
				testDocument1.list.indexOf('g') == -1;
		}
	})
	.test({
		description: 'lastIndexOf()',
		run: function () {
			testDocument1.list.pushAll(['a','b','c','b']);
		},
		assert: function () {
			return testDocument1.list.lastIndexOf('b') == 3 &&
				testDocument2.list.lastIndexOf('b') == 3 &&
				testDocument1.list.lastIndexOf('g') == -1;
		}
	})
	.test({
		description: 'move()',
		run: function () {
			testDocument1.list.pushAll(['a','b','c']);
			testDocument1.list.move(2, 0);
		},
		assert: function () {
			return testDocument1.list.asArray().toString() == 'c,a,b' &&
				testDocument2.list.asArray().toString() == 'c,a,b';
		}
	})
	.test({
		description: 'replaceRange()',
		run: function () {
			testDocument1.list.pushAll(['a','b','c','d','e']);
			testDocument1.list.replaceRange(1,['f','g']);
		},
		assert: function () {
			return testDocument1.list.asArray().toString() == 'a,f,g,d,e' &&
				testDocument2.list.asArray().toString() == 'a,f,g,d,e';
		}
	})
	.test({
		description: 'set()',
		run: function () {
			testDocument1.list.pushAll(['a','b','c']);
			testDocument1.list.set(1,'z');
		},
		assert: function () {
			return testDocument1.list.asArray().toString() == 'a,z,c' &&
				testDocument2.list.asArray().toString() == 'a,z,c';
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