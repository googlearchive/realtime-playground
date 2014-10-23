window.testSuite.load(new TestingClass('Values Set Event','valuesSetEventTests.js')
	.setup({
		run: function () {
			testDocument1.list.clear();
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
		precondition: {
			run: function () {
				var that = this;
				this.alpha_callback = function (evt) {
					that.alphaEvent = evt;
				};
				this.beta_callback = function (evt) {
					that.betaEvent = evt;
				}
				testDocument1.list.addEventListener(gapi.drive.realtime.EventType.VALUES_SET, this.alpha_callback);
				testDocument2.list.addEventListener(gapi.drive.realtime.EventType.VALUES_SET, this.beta_callback);
				testDocument2.list.set(1, 'z');
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
			return typeof this.alphaEvent.type === 'string' &&
				this.alphaEvent.type === 'values_set';
		}
	})
	.test({
		description: 'index',
		run: function () {},
		assert: function () {
			return typeof this.alphaEvent.index === 'number' &&
				this.alphaEvent.index == 1;
		}
	})
	.test({
		description: 'newValues',
		run: function () {},
		assert: function () {
			return typeof this.alphaEvent.newValues === 'object' &&
				this.alphaEvent.newValues instanceof Array &&
				this.alphaEvent.newValues.toString() == 'z';
		}
	})
	.test({
		description: 'oldValues',
		run: function () {},
		assert: function () {
			return typeof this.alphaEvent.oldValues === 'object' &&
				this.alphaEvent.oldValues instanceof Array &&
				this.alphaEvent.oldValues.toString() == 'b';
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