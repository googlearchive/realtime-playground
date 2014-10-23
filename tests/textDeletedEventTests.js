window.testSuite.load(new TestingClass('Text Deleted Event', 'textDeletedEventTests.js')
	.setup({
		run: function () {
			testDocument2.string.setText('text-deleted-event-tests');
		},
		assert: function () {
			return testDocument1.string.getText() == 'text-deleted-event-tests' &&
				testDocument2.string.getText() == 'text-deleted-event-tests';
		}
	})
	.test({
		precondition: {
			run: function () {
				var that = this;
				this.alphaEvents = [];
				this.betaEvents = [];
				this.alpha_callback = function (evt) {
					that.alphaEvent = evt;
					that.alphaEvents.push(evt);
				};
				this.beta_callback = function (evt) {
					that.betaEvent = evt;
					that.betaEvents.push(evt);
				}
				testDocument1.string.addEventListener(gapi.drive.realtime.EventType.TEXT_DELETED, this.alpha_callback);
				testDocument2.string.addEventListener(gapi.drive.realtime.EventType.TEXT_DELETED, this.beta_callback);
				testDocument2.string.removeRange(2,3);
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
		description: 'index',
		run: function () {},
		assert: function () {
			return typeof this.alphaEvent.index === 'number' &&
				this.alphaEvent.index == 2;
		}
	})
	.test({
		description: 'text',
		run: function () {},
		assert: function () {
			return typeof this.alphaEvent.text === 'string' &&
				this.alphaEvent.text == 'x';
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