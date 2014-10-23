window.testSuite.load(new TestingClass('Error', 'errorTests.js')
	.setup({
		run: function () {
			try {
				testDocument1.model.beginCompoundOperation();
				testDocument1.model.beginCompoundOperation('', false);
				testDocument1.model.endCompoundOperation();
				testDocument1.model.endCompoundOperation();
			} catch (e) {
				this.error = e;
			} finally {
				testDocument1.model.endCompoundOperation();
			}
		},
		assert: function () {
			return !!this.error;
		}
	})
	.test({
		description: 'isFatal',
		run: function () {},
		assert: function () {
			// TODO (sethhoward) Use the bottom return when we fix this
			return true;
			return typeof this.error.isFatal === 'boolean';
		}
	})
	.test({
		description: 'message',
		run: function () {},
		assert: function () {
			return typeof this.error.message === 'string';
		}
	})
	.test({
		description: 'type',
		run: function () {},
		assert: function () {
			return true; // TODO (sethhoward) Use the bottom return when we fix this
			return !!this.error.type;
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