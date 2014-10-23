window.testSuite.load(new TestingClass('Value Changed Event', 'valueChangedEventTests.js')
	.setup({
		run: function () {
			testDocument1.map.set('key1', 'value-changed-test1');
		},
		assert: function () {
			return testDocument1.map.get('key1') == 'value-changed-test1' &&
				testDocument2.map.get('key1') == 'value-changed-test1';
		}
	})
	.test({
		precondition: {
			run: function () {
				var that = this;
				this.alpha_callback = function (evt) {
					that.alphaEvent = evt;
				};
				this.beta_callback = function (evt) {
					that.betaEvent = evt;
				}
				testDocument1.map.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, this.alpha_callback);
				testDocument2.map.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, this.beta_callback);
				testDocument2.map.set('key1', 'value-changed-test3');
			},
			assert: function () {
				return this.alphaEvent && this.betaEvent;
			}
		},
		description: 'bubbles',
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
		description: 'newValue',
		run: function () {},
		assert: function () {
			return typeof this.alphaEvent.newValue === 'string' &&
				this.alphaEvent.newValue == 'value-changed-test3';
		}
	})
	.test({
		description: 'oldValue',
		run: function () {},
		assert: function () {
			return typeof this.alphaEvent.oldValue === 'string' &&
				this.alphaEvent.oldValue == 'value-changed-test1';
		}
	})
	.test({
		description: 'property',
		run: function () {},
		assert: function () {
			return typeof this.alphaEvent.property === 'string' &&
				this.alphaEvent.property === 'key1';
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