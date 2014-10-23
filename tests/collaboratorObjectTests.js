
window.testSuite.load(new TestingClass('Collaborator Object','collaboratorObjectTests.js')
	.setup({
		run: function () {
			var that = this;
			function handleErrors () {}

		    function initSecondModel(model) {}

		    function onSecondFileLoaded(doc) {
		    	that.doc = doc;
		    }
			gapi.drive.realtime.load(window.fileId, onSecondFileLoaded, initSecondModel, handleErrors);


		},
		assert: function () {
			return testDocument1.doc.getCollaborators().length == 3 &&
				testDocument2.doc.getCollaborators().length == 3;
		}
	})
	.test({
		description: 'color',
		precondition: {
			run: function () {
				var that = this;
				this.alpha_callback = function (evt) {
					that.collaborator = evt.collaborator;
				};
				testDocument1.doc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_LEFT, this.alpha_callback);
				this.doc.close();
			},
			assert: function () {
				return this.collaborator;
			}
		},
		run: function () {},
		assert: function () {
			return typeof this.collaborator.color === 'string';
		}
	})
	.test({
		description: 'displayName',
		run: function () {},
		assert: function () {
			return typeof this.collaborator.displayName === 'string';
		}
	})
	.test({
		description: 'isAnonymous',
		run: function () {},
		assert: function () {
			return typeof this.collaborator.isAnonymous === 'boolean';
		}
	})
	.test({
		description: 'isMe',
		run: function () {},
		assert: function () {
			return typeof this.collaborator.isMe === 'boolean';
		}
	})
	.test({
		description: 'photoUrl',
		run: function () {},
		assert: function () {
			return typeof this.collaborator.photoUrl === 'string';
		}
	})
	.test({
		description: 'sessionId',
		run: function () {},
		assert: function () {
			return typeof this.collaborator.sessionId === 'string';
		}
	})
	.test({
		description: 'userId',
		run: function () {},
		assert: function () {
			return typeof this.collaborator.userId === 'string';
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