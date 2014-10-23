
window.ProgressBubbles = function (testCount) {
  this.testCount = testCount;
  this.setup();
}

ProgressBubbles.prototype = {

  width: 150,
  height: 150,

  setup: function () {
    this.radius = Math.min(this.width, this.height) / 2;
    this.arc = d3.svg.arc()
      .outerRadius(this.radius - 5)
      .innerRadius(this.radius - 15);
    this.el = document.createElement('div');
    this.el.className = 'progress-bubbles';
    this.create();
  },

  create: function () {
    var that = this;
    this.svg = d3.select(this.el).append('svg')
        .attr('width', this.width)
        .attr('height', this.height)
      .append("g")
        .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");

    this.pie = d3.layout.pie()
      .sort(function(a, b) {
        return a.order > b.order;
      })
      .value(function(d) {
        return d.tests;
      });

    this.setData();

    this.g = this.svg.selectAll('path')
        .data(this.pieData, function (d) { return d.data.description })
      .enter().append('path')
        .attr('d', function(d) {
          return that.arc(d)
        })
        .style('fill', function (d) {
          return d.data.color;
        });

    this.update();

  },

  update: function () {
    var that = this;

    this.g = this.svg.selectAll('path')
        .data(this.pieData, function (d) { return d.data.description });

    // Update
    this.g
      .attr('d', function(d) {
        return that.arc(d)
      })
      .style('opacity', 1);

    // Enter
    this.g.enter().append('path')
        .attr('d', function(d) {
          return that.arc(d)
        })
        .style('fill', function (d) {
          return d.data.color;
        })
        .style('opacity', 0);
  },

  updateTestCount: function (testCount) {
    this.testCount = testCount;
    this.setData();
    this.update();
  },

  addData: function (success) {
    this.data[2].tests--;
    if(success){
      this.data[0].tests++;
    } else {
      this.data[1].tests++;
    }
    this.pieData = this.pie(this.data);
    this.update();
  },

  setData: function () {
    this.data = [{
      tests: 0,
      description: 'success',
      color: 'green',
      order: 1
    },{
      tests: 0,
      description: 'failed',
      color: 'red',
      order: 2
    },{
      tests: this.testCount,
      description: 'pending',
      color: '#A89E16',
      order: 3
    }]
    this.pieData = this.pie(this.data);
  },
}
