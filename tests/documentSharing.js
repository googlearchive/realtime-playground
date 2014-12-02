
window.testSuite.load(new TestingClass('Document Sharing', 'documentSharing.js')
  .test({
    description: 'Share a document',
    run: function () {
      var that = this;
      var request = gapi.client.drive.permissions.insert({
        'fileId': window.fileId,
        'resource': {
          'value': 'drivemobiletest@gmail.com',
          'type': 'user',
          'role': 'writer'
        }
      });

      request.execute(function(resp){
        that.resp = resp;
      })
    },
    assert: function () {
      if(this.resp){
        return (this.resp.role == 'writer' || this.resp.role == 'owner') &&
          this.resp.emailAddress == 'drivemobiletest@gmail.com' &&
          this.resp.kind == 'drive#permission';
      } else {
        return false;
      }
    }
  })
  .test({
    description: 'Open Shared Document',
    run: function () {
      var that = this;
      this.isLoaded = false;
      util.load(fileId, function (doc) {
        if(doc.getModel){  // Check to make sure this is a real Document not something else
          that.isLoaded = true;
          doc.close();
        }
      }, function () {
        console.log('Sharing went wrong...');
      });
    },
    assert: function () {
      return this.isLoaded;
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