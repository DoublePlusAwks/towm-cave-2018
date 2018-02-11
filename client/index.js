/*
    ./client/index.js
    which is the webpack entry file
*/
import $ from "jquery";
import * as d3 from "d3";
import Runner from './Runner';

const runner = new Runner('CEREAL');
const sim = runner.run();
console.log(runner);
console.log(sim);
var d = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(runner.amnts));

$('<a href="data:' + d + '" download="data.json">download JSON</a>').appendTo('#root');

var div = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

for (let sinkKey of Object.keys(sim)) {
  let m = 2;
  const sum = (arr) => arr.reduce((sum, x) => sum + x);
  let costs = Object.values(sim[sinkKey].costs);
  let times = Object.values(sim[sinkKey].times);
  let sumCosts = sum(costs);
  let sumTimes = sum(times);
  if (sumCosts == 0 || sumTimes == 0) {
    continue;
  }
  let n = costs.length;
  let data = [
    costs.map(e => e / sum(costs) * n),
    times.map(e => e / sum(times) * n)
  ];

  var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var y = d3.scaleLinear()
    .domain([0, n])
    .rangeRound([height, 0])
		.nice();

  var x = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.05)
    .align(0.1)
    .domain(d3.range(m));

  var z = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  d3.select("body").append("h1").html(sinkKey)

  var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g").selectAll("g")
  	.data(d3.stack().keys(d3.range(n))(data))
    .enter().append("g")
    .style("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
    .attr("x", function(d, i) { return x(i); })
    .attr("y", function(d) { return y(d[1]); })
    .attr("height", function(d) { return y(d[0]) - y(d[1]); })
    .attr("width", x.bandwidth())
    .on("mouseover", function(d) {
       div.transition()
         .duration(200)
         .style("opacity", .9);
       div.html("Hi" + "<br/>" + d.close)
         .style("left", (d3.event.pageX) + "px")
         .style("top", (d3.event.pageY - 28) + "px");
       })
     .on("mouseout", function(d) {
       div.transition()
         .duration(500)
         .style("opacity", 0);
       });;
}
