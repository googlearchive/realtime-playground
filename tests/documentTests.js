
window.testSuite.load(new TestingClass('Document', 'documentTests.js')
	.test({
		precondition: {
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
				return !!this.doc;
			}
		},
		description: 'close()',
		run: function () {
			this.doc.close();
		},
		assert: function () {
			var success = false;
			try {
				this.doc.getModel();
			} catch (e) {
				success = (e.name == 'DocumentClosedError');
			}

			return success;
		}
	})
	.test({
		description: 'getCollaborators()',
		run: function () {

		},
		assert: function () {
			return testDocument1.doc.getCollaborators().length == 2 &&
				testDocument2.doc.getCollaborators().length == 2 &&
				testDocument1.doc.getCollaborators()[0].displayName &&
				testDocument2.doc.getCollaborators()[1].displayName;
		}
	})
	.test({
		description: 'getModel()',
		run: function () {
		},
		assert: function () {
			var m1 = testDocument1.doc.getModel();
			var m2 = testDocument2.doc.getModel();

			return m1.createMap && m2.createMap;
		}
	})
	.test({
		description: 'addEventListener() - collaborator_left',
		precondition: {
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
		},
		run: function () {
			var that = this;
			this.alphaEvents = [];
			this.betaEvents = [];
			this.alpha_callback = function (evt) {
				that.alphaEvents.push(evt);
			};
			this.beta_callback = function (evt) {
				that.betaEvents.push(evt);
			}
			testDocument1.doc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_LEFT, this.alpha_callback);
			testDocument2.doc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_LEFT, this.beta_callback);
			this.doc.close();
		},
		assert: function () {
			return this.alphaEvents.length == 1 &&
				this.betaEvents.length == 1;
		}
	})
	.test({
		description: 'removeEventListener() - collaborator_left',
		precondition: {
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
		},
		assertFor: 2000,
		run: function () {
			this.alphaEvents = [];
			this.betaEvents = [];
			testDocument1.doc.removeEventListener(gapi.drive.realtime.EventType.COLLABORATOR_LEFT, this.alpha_callback);
			testDocument2.doc.removeEventListener(gapi.drive.realtime.EventType.COLLABORATOR_LEFT, this.beta_callback);
			this.doc.close();
		},
		assert: function () {
			return this.alphaEvents.length == 0 &&
				this.betaEvents.length == 0;
		}
	})
	.test({
		description: 'addEventListener() - collaborator_joined',
		precondition: {
			run: function () {
			},
			assert: function () {
				return testDocument1.doc.getCollaborators().length == 2 &&
					testDocument2.doc.getCollaborators().length == 2;
			}
		},
		run: function () {
			var that = this;
			function handleErrors () {}
		    function initSecondModel(model) {}
		    function onSecondFileLoaded(doc) {
		    	that.doc = doc;
		    }
			this.alphaEvents = [];
			this.betaEvents = [];
			this.alpha_callback = function (evt) {
				that.alphaEvents.push(evt);
			};
			this.beta_callback = function (evt) {
				that.betaEvents.push(evt);
			}
			testDocument1.doc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_JOINED, this.alpha_callback);
			testDocument2.doc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_JOINED, this.beta_callback);
			gapi.drive.realtime.load(window.fileId, onSecondFileLoaded, initSecondModel, handleErrors);
		},
		assert: function () {
			return this.alphaEvents.length == 1 &&
				this.betaEvents.length == 1;
		}
	})
	.test({
		precondition: {
			run: function () {
				this.doc.close();
			},
			assert: function () {
				return testDocument1.doc.getCollaborators().length == 2 &&
					testDocument2.doc.getCollaborators().length == 2;
			}
		},
		description: 'removeEventListener() - collaborator_joined',
		assertFor: 2000,
		run: function () {
			var that = this;
			function handleErrors () {}
		    function initSecondModel(model) {}
		    function onSecondFileLoaded(doc) {
		    	that.doc = doc;
		    }
			this.alphaEvents = [];
			this.betaEvents = [];
			testDocument1.doc.removeEventListener(gapi.drive.realtime.EventType.COLLABORATOR_JOINED, this.alpha_callback)
			testDocument2.doc.removeEventListener(gapi.drive.realtime.EventType.COLLABORATOR_JOINED, this.beta_callback)
			gapi.drive.realtime.load(window.fileId, onSecondFileLoaded, initSecondModel, handleErrors);
		},
		assert: function () {
			return this.alphaEvents.length == 0 &&
				this.betaEvents.length == 0;
		}
	})
	.test({
		description: 'addEventListener() - document_save_state_changed',
		precondition: {
			run: function () {
				this.doc.close();
			},
			assert: function () {
				return testDocument1.doc.getCollaborators().length == 2 &&
					testDocument2.doc.getCollaborators().length == 2;
			}
		},
		run: function () {
			var that = this;
			this.alphaEvents = [];
			this.betaEvents = [];
			this.alpha_callback = function (evt) {
				that.alphaEvents.push(evt);
			};
			testDocument1.doc.addEventListener(gapi.drive.realtime.EventType.DOCUMENT_SAVE_STATE_CHANGED, this.alpha_callback);
			testDocument1.string.setText('test');
		},
		assert: function () {
			return this.alphaEvents.length == 3;
		}
	})
	.test({
		description: 'removeEventListener() - document_save_state_changed',
		assertFor: 2000,
		run: function () {
			this.alphaEvents = [];
			this.betaEvents = [];
			testDocument1.string.removeEventListener(gapi.drive.realtime.EventType.DOCUMENT_SAVE_STATE_CHANGED, this.alpha_callback)
			testDocument1.string.setText('test');
		},
		assert: function () {
			return this.alphaEvents.length == 0;
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