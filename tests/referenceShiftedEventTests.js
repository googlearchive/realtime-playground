
window.testSuite.load(new TestingClass('Reference Shifted Events', 'referenceShiftedEventTests.js')
	.setup({
		run: function () {
			testDocument1.list.clear();
			testDocument1.list.pushAll(['h','i','j','k']);
		},
		assert: function () {
			return testDocument1.list.length == 4 &&
				testDocument2.list.length == 4 &&
				testDocument1.list.asArray().toString() == 'h,i,j,k' &&
				testDocument2.list.asArray().toString() == 'h,i,j,k';
		}
	})
	.test({
		description: 'bubbles',
		precondition: {
			run: function () {
				var that = this;
				this.alpha_callback = function (evt) {
					that.alphaEvent = evt;
				}
				this.beta_callback = function (evt) {
					that.betaEvent = evt;
				}
				this.indexReference = testDocument1.list.registerReference(3, false);
				this.indexReference2 = testDocument2.list.registerReference(3, false);
				this.indexReference.addEventListener(gapi.drive.realtime.EventType.REFERENCE_SHIFTED, this.alpha_callback);
				this.indexReference2.addEventListener(gapi.drive.realtime.EventType.REFERENCE_SHIFTED, this.beta_callback);
				testDocument2.list.insertAll(0,['x','y']);
			},
			assert: function () {
				return this.alphaEvent && this.betaEvent;
			}
		},
		run: function () {},
		assert: function () {
			return typeof this.alphaEvent.bubbles === 'boolean';
		}
	})
	.test({
		description: 'isLocal - false',
		run: function () {},
		assert: function () {
			return typeof this.alphaEvent.isLocal === 'boolean' &&
				this.alphaEvent.isLocal === false;
		}
	})
	.test({
		description: 'isLocal - true',
		run: function () {},
		assert: function () {
			return typeof this.betaEvent.isLocal === 'boolean' &&
				this.betaEvent.isLocal === true;
		}
	})
	.test({
		description: 'sessionId',
		run: function () {},
		assert: function () {
			return typeof this.alphaEvent.sessionId === 'string';
		}
	})
	.test({
		description: 'userId',
		run: function () {},
		assert: function () {
			return typeof this.alphaEvent.userId === 'string';
		}
	})
	.test({
		description: 'type',
		run: function () {},
		assert: function () {
			return typeof this.alphaEvent.type === 'string';
		}
	})
	.test({
		description: 'newIndex',
		run: function () {},
		assert: function () {
			return typeof this.alphaEvent.newIndex === 'number';
		}
	})
	.test({
		description: 'newObjectId',
		run: function () {},
		assert: function () {
			return typeof this.alphaEvent.newObject === 'object';
		}
	})
	.test({
		description: 'oldIndex',
		run: function () {},
		assert: function () {
			return typeof this.alphaEvent.oldIndex === 'number';
		}
	})
	.test({
		description: 'oldObjectId',
		run: function () {},
		assert: function () {
			return typeof this.alphaEvent.oldObject === 'object';
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