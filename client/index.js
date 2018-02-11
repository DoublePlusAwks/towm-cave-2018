/*
    ./client/index.js
    which is the webpack entry file
*/
import $ from "jquery";
import * as d3 from "d3";
import Runner from './Runner';

const runner = new Runner();
const sim = runner.run();
console.log(sim);
var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(runner.amnts));

$('<a href="data:' + data + '" download="data.json">download JSON</a>').appendTo('#root');
