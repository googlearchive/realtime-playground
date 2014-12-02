FunctionalTesting = function (title) {
	this.testsCompleted = 0;
	this.successfulTests = 0;
	this.failedTests = 0;
	this.testsEl = this.createHTML(this.testsContainer);
	this.el = this.createHTML(this.container);
	this.el.appendChild(this.testsEl);
	this.headerEl = this.el.querySelector('.header');
	this.headerEl.querySelector('.title').textContent = title;
	this.completedEl = this.headerEl.querySelector('.completed');
	this.failedEl = this.headerEl.querySelector('.failed');
	this.succeededEl = this.headerEl.querySelector('.succeeded');
	this.testClassCompleted = this.testClassCompleted.bind(this);

}

FunctionalTesting.prototype = {

	container: 	'<div class="testing-container">' +
								'<div class="header">' +
									'<div class="left">' +
										'<div class="title"></div>' +
										'<paper-spinner class="loader"></paper-spinner>' +
										'<div class="totalResults">' +
											'<span class="completed"></span><span class="failed"></span><span class="succeeded"></span>' +
										'</div>' +
									'</div>' +
									'<div class="right hidden"></div>' +
								'</div>' +
							'</div>',

	testsContainer: 	'<div class="tests"></div>',

	passedClassName: 'passed',

	failedClassName: 'failed',

	totalTests: 0,

	testingClasses: [],

	load: function (testingClass) {
		this.testingClasses.push(testingClass);
		this.totalTests += testingClass.getTestCount();
		this.updateUI();
	},

	execute: function () {
		this.index = -1;
		var that = this;
		this.testingClasses.sort(function(a,b){
			if(a.title == b.title){
				return 0;
			} else if(a.title < b.title){
				return -1;
			} else {
				return 1;
			}
		});
		this.testingClasses.forEach(function(testingClass){
			that.testsEl.appendChild(testingClass.el);
		});
		this.headerEl.querySelector('.right').classList.remove('hidden');
		this.headerEl.querySelector('.loader').classList.add('hidden');
		this.next();
	},

	next: function () {
		this.index++;
		if(this.testingClasses[this.index]){
			this.testingClasses[this.index].execute(this);
		}
	},

	testCompleted: function (success) {
		this.testsCompleted++;
		if(success){
			this.successfulTests++;
		} else {
			this.failedTests++;
		}
		this.updateUI();
	},

	testClassCompleted: function () {
		this.next();
	},

	updateUI: function () {
		this.completedEl.textContent = 'Total Tests: ' + this.testsCompleted + '/' + this.totalTests;
		this.failedEl.textContent = 'Failed: ' + this.failedTests;
		this.succeededEl.textContent = 'Succeeded: ' + this.successfulTests;
		if (this.failedTests) {
			this.el.classList.add('failed');
			document.head.querySelector('title').textContent = 'FAILURE';
		} else if (this.totalTests == this.successfulTests){
			this.el.classList.add('success');
			document.head.querySelector('title').textContent = 'Success';
		}
	},

	createHTML: function (html) {
		var div = document.createElement('div');
		div.innerHTML = html;
		return div.children[0];
	}
}
