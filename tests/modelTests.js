
window.testSuite.load(new TestingClass('Model', 'modelTests.js')
	.reset({
		run: function () {
			if(this.testDocument3){
				this.testDocument3.doc.close();
				this.testDocument3 = null;
			}
			var that = this;

	    function onFileLoaded(doc) {
	    	that.testDocument3 = new TestDocument('gamma');
	    	that.testDocument3.onFileLoaded(doc);
	    }

			gapi.drive.realtime.load(window.fileId, onFileLoaded, function init() {}, function handleErrors () {});
			// Return the document back to it's original settings for subsequent tests
			testDocument1.string.setText('');
			testDocument1.list.clear();
			testDocument1.map.set('key1', 1);
			testDocument1.map.set('key2', 2);
		},
		assert: function () {
			return !!this.testDocument3 &&
				!this.testDocument3.model.canUndo &&
				testDocument1.string.getText() == '' &&
				testDocument1.list.asArray().length == 0 &&
				testDocument1.map.get('key1') == 1 &&
				testDocument1.map.get('key2') == 2 &&
				testDocument2.string.getText() == '' &&
				testDocument2.list.asArray().length == 0 &&
				testDocument2.map.get('key1') == 1 &&
				testDocument2.map.get('key2') == 2 &&
				this.testDocument3.string.getText() == '' &&
				this.testDocument3.list.asArray().length == 0 &&
				this.testDocument3.map.get('key1') == 1 &&
				this.testDocument3.map.get('key2') == 2;
		}
	})
	.test({
		description: 'Compound Operation',
		run: function () {
			this.testDocument3.model.beginCompoundOperation();
				this.testDocument3.string.setText('a');
				this.testDocument3.string.append('b');
			this.testDocument3.model.endCompoundOperation();
		},
		assert: function () {
			return testDocument1.string.getText() == 'ab' &&
				testDocument2.string.getText() == 'ab' &&
				this.testDocument3.string.getText() == 'ab' &&
				this.testDocument3.model.canUndo;
		}
	})
	.test({
		description: 'Compound Operations - Nested compound operation',
		run: function () {
			this.testDocument3.model.beginCompoundOperation();
				this.testDocument3.string.setText('c');
				this.testDocument3.model.beginCompoundOperation();
					this.testDocument3.string.append('d');
				this.testDocument3.model.endCompoundOperation();
				this.testDocument3.string.append('e');
			this.testDocument3.model.endCompoundOperation();
		},
		assert: function () {
			return testDocument1.string.getText() == 'cde' &&
				testDocument2.string.getText() == 'cde' &&
				this.testDocument3.string.getText() == 'cde' &&
				this.testDocument3.model.canUndo;
		}
	})
	.test({
		description: 'Compound Operations - Non undoable',
		run: function () {
			this.testDocument3.model.beginCompoundOperation('1', false);
				this.testDocument3.string.setText('f');
				this.testDocument3.model.beginCompoundOperation();
					this.testDocument3.string.append('g');
				this.testDocument3.model.endCompoundOperation();
				this.testDocument3.string.append('h');
			this.testDocument3.model.endCompoundOperation();
		},
		assert: function () {
			return testDocument1.string.getText() == 'fgh' &&
				testDocument2.string.getText() == 'fgh' &&
				this.testDocument3.string.getText() == 'fgh' &&
				this.testDocument3.model.canUndo == false;
		}
	})
	// .test({
	// 	description: 'Compound Operations - Nested non undoable compound operation',
	// 	run: function () {
	// 		try {
	// 			this.testDocument3.model.beginCompoundOperation();
	// 				this.testDocument3.string.setText('i');
	// 				this.testDocument3.model.beginCompoundOperation('1', false);
	// 					this.testDocument3.string.append('j');
	// 				this.testDocument3.model.endCompoundOperation();
	// 				this.testDocument3.string.append('k');
	// 			this.testDocument3.model.endCompoundOperation();
	// 		} catch (e) {
	// 			this.errorMessage = e.message;
	// 		}
	// 	},
	// 	assert: function () {
	// 		return this.errorMessage == 'A non-undoable compound operation cannot be nested in an undoable compound operation';
	// 	}
	// })
	// .test({
	// 	description: 'Compound Operations - nested undo call',
	// 	run: function () {
	// 		try {
	// 			this.testDocument3.string.setText('l');
	// 			this.testDocument3.model.beginCompoundOperation();
	// 				this.testDocument3.model.undo();
	// 			this.testDocument3.model.endCompoundOperation();
	// 		} catch (e) {
	// 			this.errorMessage = e.message;
	// 		}
	// 	},
	// 	assert: function () {
	// 		return true;
	// 		return this.errorMessage == 'A non-undoable compound operation cannot be nested in an undoable compound operation';
	// 	}
	// })
	// .test({
	// 	description: 'Compound Operations - nested redo call',
	// 	run: function () {
	// 		try {
	// 			this.testDocument3.string.setText('m');
	// 			this.testDocument3.model.undo();
	// 			this.testDocument3.model.beginCompoundOperation();
	// 				this.testDocument3.model.redo();
	// 			this.testDocument3.model.endCompoundOperation();
	// 		} catch (e) {
	// 			this.errorMessage = e.message;
	// 		}
	// 	},
	// 	assert: function () {
	// 		return true;
	// 		return this.errorMessage == 'Some future error message';
	// 	}
	// })
	.test({
		description: 'Compound Operations - events',
		run: function () {
			var that = this;
			this.gamma_callback = function (evt) {
				that.gammaEvent = evt;
			}
			this.testDocument3.string.addEventListener(gapi.drive.realtime.EventType.TEXT_INSERTED, this.gamma_callback);
			this.testDocument3.model.beginCompoundOperation();
				this.testDocument3.string.setText('n');
			this.testDocument3.model.endCompoundOperation();
		},
		assert: function () {
			return this.gammaEvent.type == 'text_inserted' &&
				this.gammaEvent.text == 'n' &&
				testDocument1.string.getText() == 'n' &&
				testDocument2.string.getText() == 'n' &&
				this.testDocument3.string.getText() == 'n';
		}
	})
	.test({
		description: 'Compound Operations - compound operation names in events',
		run: function () {
			var that = this;
			this.gammaEvents = [];
			this.gamma_callback = function (evt) {
				that.gammaEvents.push(evt)
			}
			this.testDocument3.string.addEventListener(gapi.drive.realtime.EventType.TEXT_INSERTED, this.gamma_callback);
			this.testDocument3.model.beginCompoundOperation('outter');
				this.testDocument3.string.setText('o');
				this.testDocument3.model.beginCompoundOperation('inner');
					this.testDocument3.string.append('p');
				this.testDocument3.model.endCompoundOperation();
			this.testDocument3.model.endCompoundOperation();
		},
		assert: function () {
			return this.gammaEvents.length == 2 &&
				this.gammaEvents[0].compoundOperationNames[0] == 'outter' &&
				this.gammaEvents[0].type == 'text_inserted' &&
				this.gammaEvents[0].text == 'o' &&
				this.gammaEvents[1].compoundOperationNames[0] == 'outter' &&
				this.gammaEvents[1].compoundOperationNames[1] == 'inner' &&
				this.gammaEvents[1].type == 'text_inserted' &&
				this.gammaEvents[1].text == 'p' &&
				testDocument1.string.getText() == 'op' &&
				testDocument2.string.getText() == 'op' &&
				this.testDocument3.string.getText() == 'op';
		}
	})
	.test({
		description: 'create()',
		run: function () {

		},
		assert: function () {
			return true
		}
	})
	.test({
		description: 'createList()',
		run: function () {
			this.list = this.testDocument3.model.createList(['a','b','c']);
		},
		assert: function () {
			return this.list.asArray().length == 3 &&
				this.list.asArray().toString() == 'a,b,c';
		}
	})
	.test({
		description: 'createMap()',
		run: function () {
			this.map = this.testDocument3.model.createMap({"Key1":"1", "Key2":"2"})
		},
		assert: function () {
			return this.map.has('Key1') &&
				this.map.has('Key2') &&
				this.map.get('Key1') == '1' &&
				this.map.get('Key2') == '2';
		}
	})
	.test({
		description: 'createString()',
		run: function () {
			this.string = this.testDocument3.model.createString('test');
			this.string.append('s');
		},
		assert: function () {
			return this.string.getText() == 'tests';
		}
	})
	.test({
		description: 'getRoot()',
		run: function () {
			this.root = this.testDocument3.model.getRoot();
		},
		assert: function () {
			return this.root &&
				this.root.get &&
				this.root.has;
		}
	})
	.test({
		description: 'undo()',
		precondition: {
			run: function () {
				this.testDocument3.string.setText('a');
				this.testDocument3.string.setText('z');
			},
			assert: function () {
				return this.testDocument3.string.getText() == 'z' &&
					testDocument1.string.getText() == 'z' &&
					testDocument2.string.getText() == 'z';
			}
		},
		run: function () {
			this.testDocument3.model.undo();
		},
		assert: function () {
			return this.testDocument3.string.getText() == 'a' &&
				testDocument2.string.getText() == 'a' &&
				testDocument1.string.getText() == 'a';
		}
	})
	.test({
		description: 'redo()',
		precondition: [{
				run: function () {
					this.testDocument3.string.setText('x');
					this.testDocument3.string.append('y');
					this.testDocument3.string.append('z');	
				},
				assert: function () {
					return this.testDocument3.string.getText() == 'xyz' &&
						testDocument1.string.getText() == 'xyz' &&
						testDocument2.string.getText() == 'xyz';
				}
			},{
				run: function () {
					this.testDocument3.model.undo();
				},
				assert: function () {
					return this.testDocument3.string.getText() == 'xy' &&
						testDocument1.string.getText() == 'xy' &&
						testDocument2.string.getText() == 'xy';
				}
			}
		],
		run: function () {
			this.testDocument3.model.redo();
		},
		assert: function () {
			return this.testDocument3.string.getText() == 'xyz' &&
				testDocument2.string.getText() == 'xyz' &&
				testDocument1.string.getText() == 'xyz';
		}
	})
	.test({
		description: 'undo() - list move',
		precondition: {
			run: function () {
				this.testDocument3.list.pushAll(['a','b', 'c']);
				this.testDocument3.list.move(2, 0); // c a b
				this.testDocument3.list.move(1, 0); // a c b

			},
			assert: function () {
				var list1 = this.testDocument3.list.asArray();
				var list2 = testDocument2.list.asArray();
				var list3 = testDocument1.list.asArray();
				return list1[0] == 'a' && list1[1] == 'c' && list1[2] == 'b' &&
					list2[0] == 'a' && list2[1] == 'c' && list2[2] == 'b' &&
					list3[0] == 'a' && list3[1] == 'c' && list3[2] == 'b';
			}
		},
		run: function () {
			this.testDocument3.model.undo();
		},
		assert: function () {
			var list1 = this.testDocument3.list.asArray();
			var list2 = testDocument2.list.asArray();
			var list3 = testDocument1.list.asArray();
			return list1[0] == 'c' && list1[1] == 'a' && list1[2] == 'b' &&
					list2[0] == 'c' && list2[1] == 'a' && list2[2] == 'b' &&
					list3[0] == 'c' && list3[1] == 'a' && list3[2] == 'b';
		}
	})
	.test({
		description: 'addEventListener() - UNDO_REDO_STATE_CHANGED',
		run: function () {
			var that = this;
			this.alphaEvents = [];
			this.alpha_callback = function (evt) {
				that.alphaEvents.push(evt);
			};
			this.testDocument3.model.addEventListener(gapi.drive.realtime.EventType.UNDO_REDO_STATE_CHANGED, this.alpha_callback);
			this.testDocument3.string.setText('my-text');
			this.testDocument3.model.undo();
		},
		assert: function () {
			return this.alphaEvents.length == 2 &&
				this.alphaEvents[0].type == 'undo_redo_state_changed' &&
				this.alphaEvents[1].type == 'undo_redo_state_changed' &&
				this.alphaEvents[0].canRedo == false &&
				this.alphaEvents[0].canUndo == true &&
				this.alphaEvents[1].canRedo == true &&
				this.alphaEvents[1].canUndo == false;
		}
	})
	.test({
		description: 'removeEventListener() - UNDO_REDO_STATE_CHANGED',
		run: function () {
			var that = this;
			this.alphaEvents = [];
			this.alpha_callback = function (evt) {
				that.alphaEvents.push(evt);
			};
			this.testDocument3.model.addEventListener(gapi.drive.realtime.EventType.UNDO_REDO_STATE_CHANGED, this.alpha_callback);
			this.testDocument3.string.setText('my-other-text');
			this.testDocument3.model.removeEventListener(gapi.drive.realtime.EventType.UNDO_REDO_STATE_CHANGED, this.alpha_callback)
			this.testDocument3.model.undo();
		},
		assert: function () {
			return this.alphaEvents.length == 1 &&
				this.alphaEvents[0].type == 'undo_redo_state_changed' &&
				this.alphaEvents[0].canRedo == false &&
				this.alphaEvents[0].canUndo == true;
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