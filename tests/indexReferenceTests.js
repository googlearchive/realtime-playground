
window.testSuite.load(new TestingClass('IndexReference', 'indexReferenceTests.js')
	.reset({
		run: function () {
			testDocument1.list.clear();
			testDocument1.list.pushAll(['a','b','c','d']);
		},
		assert: function () {
			return testDocument1.list.length == 4 &&
				testDocument2.list.length == 4 &&
				testDocument1.list.asArray().toString() == 'a,b,c,d' &&
				testDocument2.list.asArray().toString() == 'a,b,c,d';
		}
	})
	.test({
		description: 'CollaborativeList.registerReference() - canBeDeleted false',
		run: function () {
			this.indexReference = testDocument1.list.registerReference(3, false);
			testDocument2.list.removeRange(2,4);
		},
		assert: function () {
			return this.indexReference.index == 2 &&
				this.indexReference.canBeDeleted == false;
		}
	})
	.test({
		description: 'CollaborativeList.registerReference() - canBeDeleted true',
		run: function () {
			this.indexReference = testDocument1.list.registerReference(3, true);
			testDocument2.list.removeRange(2,4);
		},
		assert: function () {
			return this.indexReference.index == -1 &&
				this.indexReference.canBeDeleted == true;
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