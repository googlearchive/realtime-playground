TestingClass = function (description, fileName) {
	this.title = description;
	this.el = this.createHTML(this.el);
	this.el.querySelector('.test-class-description').textContent = description;
	this.el.querySelector('.test-class-description').addEventListener('click', function () {
		var url = window.location.origin + '/test?testPath=' + fileName;
		var serverUrl = util.getParam('serverUrl');
		if(serverUrl){
			url += '&serverUrl=' + serverUrl;
		}
    window.open(url, '_blank');
	});
	this.tests = [];
	this.completedEl = this.el.querySelector('.completed');
	this.failedEl = this.el.querySelector('.failed');
	this.succeededEl = this.el.querySelector('.succeeded');
	this.continueExecution = this.continueExecution.bind(this);
	return this;
}

TestingClass.prototype = {

	testTimeout: 20000,

	retryInterval: 10,

	el: '<div class="test-class"><h2 class="test-class-description"></h2><div class="stats"><span class="completed"></span><span class="failed"></span><span class="succeeded"></span></div><div class="tests"></div></div>',

	testEl: '<div class="test slide-hidden">' +
							'<span class="description"><%= description %></span>' +
							'<div class="test-result">' +
								'<span class="result pending">pending</span>' +
							'</div>' +
							'<div class="code">' +
								'<pre>' +
									'<code class="javascript"></code>' +
								'</pre>' +
							'</div>' +
						'</div>',

	test: function (test, index) {
		var el = this.createHTML(this.testEl);
		el.querySelector('.description').textContent = test.description;
		el.querySelector('.javascript').textContent = '// Test\n' + test.run.toString() + '\n\n\n' + '// Assertion\n' + test.assert.toString();
		test.selector = el;

		var highlighted = false;
		el.querySelector('.description').addEventListener('click', function () {
			if(!highlighted){
				highlighted = true;
				hljs.highlightBlock(el.querySelector('pre code'));
			}
			el.classList.toggle('slide-hidden');
		});
		this.el.querySelector('.tests').appendChild(el);
		this.tests.push(test);

		return this;
	},

	reset: function (hash) {
		hash.isReset = true;
		hash.description = "Reset Test";
		this.resetTest = hash;
		return this;
	},

	setup: function (hash) {
		hash.isSetup = true;
		hash.description = "Setup Test";
		this.setupTest = hash;
		return this;
	},

	teardown: function (hash) {
		hash.isTeardown = true;
		hash.description = "Teardown Test";
		this.teardownTest = hash;
		return this;
	},

	execute: function (lib) {
		var that = this;
		this.completedTestCount = 0;
		this.successfulTests = 0;
		this.failedTests = 0;
		this.testIndex = -1;
		this.updateUI();
		this.lib = lib;
		if(this.setupTest && this.resetTest){
			this.runNonNormalTest(this.setupTest, function () {
				that.runNonNormalTest(that.resetTest, that.continueExecution);
			});
		} else if (this.setupTest) {
			this.runNonNormalTest(this.setupTest, this.continueExecution);
		} else if (this.resetTest) {
			this.runNonNormalTest(this.resetTest, this.continueExecution);
		} else {
			this.continueExecution();
		}
	},

	continueExecution: function () {
		var that = this;
		this.testIndex++;
		var test = this.tests[this.testIndex];
		var success = false;

		if(test.precondition){
			test.precondition.description = "Precondition for " + test.description;

			if(test.precondition instanceof Array){

				function runPrecondition (array) {
					if(!array.length){
						test.precondition = null; // Completed the precondition
						that.testIndex--;
						that.continueExecution();
					} else {
						that.runNonNormalTest(array[0], function (success) {
							if(!success) {
								throw test.description + ' failed; cannot continue';			
							} else {
								array.shift();
								runPrecondition(array);
							}
						});
					}
				}
				// We have multiple ordered preconditions to fill before executing the test.
				runPrecondition(test.precondition);

				return;
			}
			
			// We need to wait for this condition to exist before proceeding
			this.runNonNormalTest(test.precondition, function (success) {
				if(!success){
					throw test.description + ' failed; cannot continue';
				} else {
					test.precondition = null; // Completed the precondition
					that.testIndex--;
					that.continueExecution();
				}
			});
			return;
		}

		test.start = new Date().getTime();
		test.end = test.start + (test.assertFor ? test.assertFor : this.testTimeout);
		test.run.call(this);

		var callback = function (success) {
			var endTime = new Date().getTime();
			if(test.isSetup && !success){
				throw "Pretest failed, cannot continue";
				return;
			}
			var resultEl = test.selector.querySelector('.result');
			resultEl.textContent = endTime - test.start + 'ms - ' + (success ? 'passed' : 'failed');
			resultEl.classList.remove('pending');
			resultEl.classList.add((success ? 'passed' : 'failed'));
			that.lib.testCompleted(success);
			that.tallyTest(success);
		}
		that.attemptAssert(test, callback);
	},

	runNonNormalTest: function (test, callback) {
		test.start = new Date().getTime();
		test.end = test.start + (test.assertFor ? test.assertFor : this.testTimeout);
		test.run.call(this);
		this.attemptAssert(test, callback);
	},

	attemptAssert: function (test, callback) {
		var that = this;
		if(!test.assert){
			if(test.isSetup || test.isTeardown){
				callback();
				return;
			} else {
				throw "Test must have an assert function to evaluate test truth";
			}
		}
		var success;
		try {
			success = test.assert.call(this);
		} catch (e) {
			success = false;
		}
		var that = this;
		if(success || (new Date() > test.end)){
			if(test.assertFor){
				if(!success){
					callback(success);
					return;
				} else if (new Date() > test.end) {
					callback(success);
					return;
				}
			} else if(!test.isSetup && !test.isTeardown){
				callback(success);
				return;
			} else if ((test.isSetup && test.assert) || (test.isTeardown && test.assert)){
				callback(success);
				return;
			}
		}

		setTimeout(function () {
			that.attemptAssert(test, callback);
		}, this.retryInterval);
	},

	tallyTest: function (success) {
		this.completedTestCount++;
		if(success){
			this.successfulTests++;
		} else {
			this.failedTests++;
		}
		this.updateUI();
		if (this.completedTestCount == this.getTestCount()){
			// All done
			if(this.teardownTest){
				this.runNonNormalTest(this.teardownTest, this.lib.testClassCompleted);
			} else {
				this.lib.testClassCompleted();
			}
			return;
		}
		if(this.resetTest){
			this.runNonNormalTest(this.resetTest, this.continueExecution);
		} else {
			this.continueExecution();
		}
	},

	updateUI: function () {
		this.completedEl.textContent = 'Completed Tests: '+ this.completedTestCount + '/' + this.getTestCount();
		this.succeededEl.textContent = 'Succeeded: ' + this.successfulTests;
		this.failedEl.textContent = 'Failed: ' + this.failedTests;
	},

	getTestCount: function () {
		return this.tests.length;
	},

	createHTML: function (html) {
		var div = document.createElement('div');
		div.innerHTML = html;
		return div.children[0];
	}
}
