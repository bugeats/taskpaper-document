var test = require('tape');
var fs = require('fs');

var TaskpaperDocument = require('../');

var fixtureBuf = fs.readFileSync(__dirname + '/../test/assets/giant.taskpaper');

// var times = 2000;
var times = 1;

console.time(times + 'x parse');
for (var i = 0; i < times; i++) {
    TaskpaperDocument.parse(fixtureBuf);
}
console.timeEnd(times + 'x parse');

