var BOOLEAN_KEY = "boolean",
  BOOLEAN_VAL = true,
  DOUBLE_KEY = "double",
  DOUBLE_VAL = 3.2,
  STRING_KEY = "string",
  STRING_VAL = "\"<hi>\"";

window.testSuite.load(new TestingClass('Client Document Import Tests', 'clientDocumentImportTests.js')
  .test({
    precondition: {
      run: function () {
        window.inMemoryDocument = null;
        gapi.drive.realtime.newInMemoryDocument(function(doc){ 
          window.inMemoryDocument = doc;
        })
      },
      assert: function () {
        return !!window.inMemoryDocument;
      }
    },
    run: function () {},
    assert: function () {
      var doc = window.inMemoryDocument;
      return assertDocumentEquality(doc, gapi.drive.realtime.loadFromJson(doc.getModel().toJson()));
    }
  })
  .test({
    description: 'Importing Map of Json',
    run: function () {
      window.inMemoryDocument.getModel().getRoot().set(BOOLEAN_KEY, BOOLEAN_VAL);
      window.inMemoryDocument.getModel().getRoot().set(STRING_KEY, STRING_VAL);
      window.inMemoryDocument.getModel().getRoot().set(DOUBLE_KEY, DOUBLE_VAL);
    },
    assert: function () {
      var doc = window.inMemoryDocument;
      return assertDocumentEquality(doc, gapi.drive.realtime.loadFromJson(doc.getModel().toJson()));
    }
  })
  .test({
    description: 'Importing Cyclical Document',
    run: function () {
      var model = window.inMemoryDocument.getModel()
      var map1 = model.createMap();
      var map2 = model.createMap();
      map1.set('looseCycle', map2);
      map2.set('looseCycle', model.getRoot());
      model.getRoot().set('tightCycle', model.getRoot());
      model.getRoot().set('looseCycle', map1);
    },
    assert: function () {
      var doc = window.inMemoryDocument;
      return assertDocumentEquality(doc, gapi.drive.realtime.loadFromJson(doc.getModel().toJson()));
    }
  })
  .test({
    description: 'Importing Index References',
    run: function () {
      var model = window.inMemoryDocument.getModel();
      var list = model.createList(['1','2']);
      var ref1 = list.registerReference(0, false);
      var ref2 = list.registerReference(1, true);
      model.getRoot().set('list', list);
      model.getRoot().set('ref1', ref1);
      model.getRoot().set('ref2', ref2);
    },
    assert: function () {
      var doc = window.inMemoryDocument;
      return assertDocumentEquality(doc, gapi.drive.realtime.loadFromJson(doc.getModel().toJson()));
    }
  })
.test({
  description: 'Importing Collaborative String',
  run: function () {
    window.inMemoryDocument.getModel().getRoot().set('str', window.inMemoryDocument.getModel().createString('Hello World'));
  },
  assert: function () {
    var doc = window.inMemoryDocument;
    return assertDocumentEquality(doc, gapi.drive.realtime.loadFromJson(doc.getModel().toJson()));
  }
})
.test({
  description: 'Importing Collaborative Lists',
  run: function () {
    var model = window.inMemoryDocument.getModel();
    model.getRoot().set('list2', model.createList(['"ha"', "{\"inner\":\"testvalue\"}"]));
  },
  assert: function () {
    var doc = window.inMemoryDocument;
    return assertDocumentEquality(doc, gapi.drive.realtime.loadFromJson(doc.getModel().toJson()));
  }
})
.test({
  description: 'Invalid Json Syntax - INVALID_JSON_SYNTAX',
  run: function () {
    try {
      gapi.drive.realtime.loadFromJson(',');
    } catch (e) {
      this.error = e;
    }
  },
  assert: function () {
    return this.error.type === gapi.drive.realtime.ErrorType.INVALID_JSON_SYNTAX;
  }
})
.test({
  description: 'Invalid Root Type - UNEXPECTED_ELEMENT',
  run: function () {
    try {
      gapi.drive.realtime.loadFromJson('[1]');
    } catch (e) {
      this.error = e;
    }
  },
  assert: function () {
    return this.error.getMessage().indexOf('Expected root or collaborative object') === 0;
  }
})
.test({
  description: 'Invalid Type Key - UNEXPECTED_ELEMENT',
  run: function () {
    try {
      gapi.drive.realtime.loadFromJson("{\"data\":3}");
    } catch (e) {
      this.error = e;
    }
  },
  assert: function () {
    return this.error.getMessage().indexOf('Expected root or collaborative object') === 0;
  }
})
.test({
  description: 'Missing Property - MISSING_PROPERTY',
  run: function () {
    try {
      gapi.drive.realtime.loadFromJson("{\"data\":{\"type\": \"Map\"}}");
    } catch (e) {
      this.error = e;
    }
  },
  assert: function () {
    return this.error.type === gapi.drive.realtime.ErrorType.MISSING_PROPERTY;
  }
})
.test({
  description: 'Missing Data - UNEXPECTED_ELEMENT',
  run: function () {
    try {
      gapi.drive.realtime.loadFromJson('{}');
    } catch (e) {
      this.error = e;
    }
  },
  assert: function () {
    return this.error.getMessage().indexOf('Expected root or collaborative object') === 0;
  }
}));

function assertDocumentEquality(docA, docB) {
  return docA.getModel().toJson() === docB.getModel().toJson() &&
    docA.getModel().toJson('myApp', 10) === docB.getModel().toJson('myApp', 10);
}