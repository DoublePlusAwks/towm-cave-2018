/*
    ./client/index.js
    which is the webpack entry file
*/
import $ from "jquery";

import Runner from './Runner';

const runner = new Runner();
runner.run();
console.log(runner);
var obj = {a: 123, b: "4 5 6"};
var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(runner.amnts));

$('<a href="data:' + data + '" download="data.json">download JSON</a>').appendTo('#root');
