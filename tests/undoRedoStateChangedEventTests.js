
window.testSuite.load(new TestingClass('Undo Redo State Changed Event','undoRedoStateChangedEventTests.js')
	.reset({
		run: function () {
			if(this.testDocument3){
				this.testDocument3.doc.close();
				this.testDocument3 = null;
			}
			var that = this;
			function handleErrors () {}

		    function initModel(model) {}

		    function onFileLoaded(doc) {
		    	that.testDocument3 = new TestDocument('gamma');
		    	that.testDocument3.onFileLoaded(doc);
		    }

			gapi.drive.realtime.load(window.fileId, onFileLoaded, initModel, handleErrors);
		},
		assert: function () {
			return !!this.testDocument3;
		}
	})
	.test({
		precondition: {
			run: function () {
				var that = this;
				this.alphaEvents = [];
				this.alpha_callback = function (evt) {
					that.alphaEvents.push(evt);
				};
				this.testDocument3.model.addEventListener(gapi.drive.realtime.EventType.UNDO_REDO_STATE_CHANGED, this.alpha_callback);
				this.testDocument3.string.setText('undo-redo tests');
				this.testDocument3.model.undo();
			},
			assert: function () {
				return this.alphaEvents.length == 2
			}
		},
		description: 'canRedo',
		run: function () {},
		assert: function () {
			return typeof this.alphaEvents[0].canRedo === 'boolean' &&
				typeof this.alphaEvents[1].canRedo === 'boolean';
		}
	})
	.test({
		description: 'canUndo',
		run: function () {},
		assert: function () {
			return typeof this.alphaEvents[0].canRedo === 'boolean' &&
				typeof this.alphaEvents[1].canRedo === 'boolean';
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