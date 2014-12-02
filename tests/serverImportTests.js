
window.testSuite.load(new TestingClass('Document Sharing', 'documentSharing.js')
  .test({
    description: 'Transition In-Memory to Collaborative Document',
    run: function () {

    },
    assert: function () {
      
    }
  })
  .test({
    description: 'Open Shared Document',
    run: function () {
     
    },
    assert: function () {
    
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