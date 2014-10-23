window.testSuite.load(new TestingClass('Document Save State Change Event', 'documentSaveStateChangedEventTests.js')
	.setup({
		run: function () {
			var that = this;
			this.alpha_callback = function (evt) {
				that.event = evt;
			};
			testDocument1.doc.addEventListener(gapi.drive.realtime.EventType.DOCUMENT_SAVE_STATE_CHANGED, this.alpha_callback);
			testDocument1.string.setText('My Change');
		},
		assert: function () {
			return !!this.event;
		}
	})
	.test({
		description: 'isPending',
		run: function () {},
		assert: function () {
			return typeof this.event.isPending === 'boolean';
		}
	})
	.test({
		description: 'isSaving',
		run: function () {},
		assert: function () {
			return typeof this.event.isSaving === 'boolean';
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