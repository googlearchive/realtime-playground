
window.testSuite.load(new TestingClass('Custom Objects','customObjectTests.js')
  .reset({
    run: function () {
      testDocument1.string.setText('hello world');
    },
    assert: function () {
      // Do not start any tests until this passes
      return testDocument1.string.getText() == 'hello world' &&
        testDocument2.string.getText() == 'hello world';
    }
  })
  .test({
    description: 'registerType()',
    run: function () {

    },
    assert: function () {
      return true;
    }
  })
  .test({
    description: 'collaborativeField',
    run: function () {
      
      
    },
    assert: function () {
      return true;
    }
  })
  .test({
    description: 'setInitializer()',
    run: function () {
      
    },
    assert: function () {
      return true;
    }
  })
  .test({
    description: 'Create Custom Object',
    run: function () {
      
    },
    assert: function () {
      return !!testDocument1.doc.getModel().getRoot().get('custom') &&
        !!testDocument2.doc.getModel().getRoot().get('custom');
    }
  })
  .test({
    description: 'getModel()',
    run: function () {},
    assert: function () {
      return gapi.drive.realtime.custom.getModel(testDocument1.doc.getModel().getRoot().get('custom')) === testDocument1.doc.getModel();
    }
  })
  .test({
    description: 'isCustomObject()',
    run: function () {
          
    },
    assert: function () {
      return gapi.drive.realtime.custom.isCustomObject(null) === false &&
        gapi.drive.realtime.custom.isCustomObject(0) === false &&
        gapi.drive.realtime.custom.isCustomObject('hi') === false &&
        gapi.drive.realtime.custom.isCustomObject(undefined) === false &&
        gapi.drive.realtime.custom.isCustomObject(testDocument1.doc.getModel()) === false &&
        gapi.drive.realtime.custom.isCustomObject(testDocument1.doc.getModel().getRoot().get('list')) === false &&
        gapi.drive.realtime.custom.isCustomObject(testDocument1.doc.getModel().getRoot().get('string')) === false &&
        gapi.drive.realtime.custom.isCustomObject(testDocument1.doc.getModel().getRoot().get('custom')) === true;
    }
  })
  .test({
    description: 'setOnLoaded()',
    run: function () {
      
    },
    assert: function () {
      return gapi.drive.realtime.custom.setOnLoaded instanceof Function;
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
