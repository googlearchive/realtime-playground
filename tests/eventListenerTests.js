
window.testSuite.load(new TestingClass('Event Listeners', 'eventListenerTests.js')
  .reset({
    run: function () {
      // Return the document back to it's original settings for subsequent tests
      testDocument1.string.setText('');
      testDocument1.list.clear();
      testDocument1.map.set('key1', 1);
      testDocument1.map.set('key2', 2);
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
  })
  .test({
    description: 'list addEventListener() - VALUES_ADDED',
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
      testDocument1.list.addEventListener(gapi.drive.realtime.EventType.VALUES_ADDED, this.alpha_callback);
      testDocument2.list.addEventListener(gapi.drive.realtime.EventType.VALUES_ADDED, this.beta_callback);
      testDocument1.list.push('a');
    },
    assert: function () {
      return this.alphaEvents.length == 1 &&
        this.betaEvents.length == 1;
    }
  })
  .test({
    description: 'list removeEventListener() - VALUES_ADDED',
    run: function () {
      this.alphaEvents = [];
      this.betaEvents = [];
      testDocument1.list.removeEventListener(gapi.drive.realtime.EventType.VALUES_ADDED, this.alpha_callback)
      testDocument2.list.removeEventListener(gapi.drive.realtime.EventType.VALUES_ADDED, this.beta_callback)
      testDocument1.list.push('a');
    },
    assert: function () {
      return this.alphaEvents.length == 0 &&
        this.betaEvents.length == 0;
    }
  })
  .test({
    description: 'list addEventListener() - VALUES_SET',
    run: function () {
      var that = this;
      this.alphaEvents = [];
      this.betaEvents = [];
      testDocument1.list.addEventListener(gapi.drive.realtime.EventType.VALUES_SET, this.alpha_callback);
      testDocument2.list.addEventListener(gapi.drive.realtime.EventType.VALUES_SET, this.beta_callback);
      testDocument1.list.push('a');
      testDocument1.list.set(0, 'b');
    },
    assert: function () {
      return this.alphaEvents.length == 1 &&
        this.betaEvents.length == 1;
    }
  })
  .test({
    description: 'list removeEventListener() - VALUES_SET',
    run: function () {
      this.alphaEvents = [];
      this.betaEvents = [];
      testDocument1.list.removeEventListener(gapi.drive.realtime.EventType.VALUES_SET, this.alpha_callback)
      testDocument2.list.removeEventListener(gapi.drive.realtime.EventType.VALUES_SET, this.beta_callback)
      testDocument1.list.push('a');
      testDocument1.list.set(0, 'b');
    },
    assert: function () {
      return this.alphaEvents.length == 0 &&
        this.betaEvents.length == 0;
    }
  })
  .test({
    description: 'list addEventListener() - VALUES_REMOVED',
    precondition: {
      run: function () {
        testDocument1.list.push('a');
      },
      assert: function () {
        return testDocument1.list.length == 1 &&
          testDocument2.list.length == 1;
      }
    },
    run: function () {
      var that = this;
      this.alphaEvents = [];
      this.betaEvents = [];
      testDocument1.list.addEventListener(gapi.drive.realtime.EventType.VALUES_REMOVED, this.alpha_callback);
      testDocument2.list.addEventListener(gapi.drive.realtime.EventType.VALUES_REMOVED, this.beta_callback);
      testDocument1.list.remove(0);
    },
    assert: function () {
      return this.alphaEvents.length == 1 &&
        this.betaEvents.length == 1;
    }
  })
  .test({
    description: 'list removeEventListener() - VALUES_REMOVED',
    precondition: {
      run: function () {
        testDocument1.list.push('a');
      },
      assert: function () {
        return testDocument1.list.length == 1 &&
          testDocument2.list.length == 1;
      }
    },
    run: function () {
      this.alphaEvents = [];
      this.betaEvents = [];
      testDocument1.list.removeEventListener(gapi.drive.realtime.EventType.VALUES_REMOVED, this.alpha_callback)
      testDocument2.list.removeEventListener(gapi.drive.realtime.EventType.VALUES_REMOVED, this.beta_callback)
      testDocument1.list.remove(0);
    },
    assert: function () {
      return this.alphaEvents.length == 0 &&
        this.betaEvents.length == 0;
    }
  })
  .test({
    description: 'map addEventListener() - VALUE_CHANGED',
    run: function () {
      var that = this;
      this.alphaEvents = [];
      this.betaEvents = [];
      testDocument1.map.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, this.alpha_callback);
      testDocument2.map.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, this.beta_callback);
      testDocument1.map.set('key1', 'z');
    },
    assert: function () {
      return this.alphaEvents.length == 1 &&
        this.betaEvents.length == 1;
    }
  })
  .test({
    description: 'map removeEventListener() - VALUE_CHANGED',
    run: function () {
      this.alphaEvents = [];
      this.betaEvents = [];
      testDocument1.map.removeEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, this.alpha_callback)
      testDocument2.map.removeEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, this.beta_callback)
      testDocument1.map.set('key1', 'z');
    },
    assert: function () {
      return this.alphaEvents.length == 0 &&
        this.betaEvents.length == 0;
    }
  })
  .test({
    description: 'string addEventListener() - text_inserted',
    run: function () {
      var that = this;
      this.alphaEvents = [];
      this.betaEvents = [];
      testDocument1.string.addEventListener(gapi.drive.realtime.EventType.TEXT_INSERTED, this.alpha_callback);
      testDocument2.string.addEventListener(gapi.drive.realtime.EventType.TEXT_INSERTED, this.beta_callback);
      testDocument1.string.append('test');
    },
    assert: function () {
      return this.alphaEvents.length == 1 &&
        this.betaEvents.length == 1;
    }
  })
  .test({
    description: 'string removeEventListener() - text_inserted',
    run: function () {
      this.alphaEvents = [];
      this.betaEvents = [];
      testDocument1.string.removeEventListener(gapi.drive.realtime.EventType.TEXT_INSERTED, this.alpha_callback)
      testDocument2.string.removeEventListener(gapi.drive.realtime.EventType.TEXT_INSERTED, this.beta_callback)
      testDocument1.string.append('test'); // test-cat-test-test
    },
    assert: function () {
      return this.alphaEvents.length == 0 &&
        this.betaEvents.length == 0;
    }
  })
  .test({
    description: 'string addEventListener() - text_deleted',
    precondition: {
      run: function () {
        testDocument1.string.setText('hello');
      },
      assert: function () {
        return testDocument1.string.getText() == 'hello' &&
        testDocument2.string.getText() == 'hello';
      }
    },
    run: function () {
      var that = this;
      this.alphaEvents = [];
      this.betaEvents = [];
      testDocument1.string.addEventListener(gapi.drive.realtime.EventType.TEXT_DELETED, this.alpha_callback);
      testDocument2.string.addEventListener(gapi.drive.realtime.EventType.TEXT_DELETED, this.beta_callback);
      testDocument1.string.removeRange(0, 5);
    },
    assert: function () {
      return this.alphaEvents.length == 1 &&
        this.betaEvents.length == 1;
    }
  })
  .test({
    description: 'string removeEventListener() - text_deleted',
    precondition: {
      run: function () {
        testDocument1.string.setText('hello');
      },
      assert: function () {
        return testDocument1.string.getText() == 'hello' &&
        testDocument2.string.getText() == 'hello';
      }
    },
    run: function () {
      this.alphaEvents = [];
      this.betaEvents = [];
      testDocument1.string.removeEventListener(gapi.drive.realtime.EventType.TEXT_DELETED, this.alpha_callback)
      testDocument2.string.removeEventListener(gapi.drive.realtime.EventType.TEXT_DELETED, this.beta_callback)
      testDocument1.string.removeRange(0, 5);
    },
    assert: function () {
      return this.alphaEvents.length == 0 &&
        this.betaEvents.length == 0;
    }
  })
  .test({
    description: 'indexReference addEventListener() - REFERENCE_SHIFTED',
    run: function () {
      var that = this;
      this.alphaEvents = [];
      this.indexReference = testDocument1.list.registerReference(3, true);
      this.indexReference.addEventListener(gapi.drive.realtime.EventType.REFERENCE_SHIFTED, this.alpha_callback);
      testDocument2.list.insert(0,'z');
    },
    assert: function () {
      return this.alphaEvents.length == 1 &&
        this.indexReference.index == 4;
    }
  })
  .test({
    description: 'indexReference removeEventListener() - REFERENCE_SHIFTED',
    run: function () {
      this.alphaEvents = [];
      this.indexReference.removeEventListener(gapi.drive.realtime.EventType.REFERENCE_SHIFTED, this.alpha_callback)
      testDocument2.list.insert(0,'z');
      testDocument2.list.insert(0,'a');
    },
    assert: function () {
      return this.alphaEvents.length == 0 &&
        this.indexReference.index == 5;
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