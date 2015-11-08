var test = require('tape');
var fs = require('fs');

var TaskpaperDocument = require('../');

var fixtureBuf = fs.readFileSync(__dirname + '/../test/assets/full.taskpaper');

test('TaskpaperDocument libary root functions', function (t) {
    t.plan(4);
    t.ok(TaskpaperDocument.lex(fixtureBuf),              'lex() reads a Buffer ok');
    t.ok(TaskpaperDocument.lex(fixtureBuf.toString()),   'lex() reads a String ok');
    t.ok(TaskpaperDocument.parse(fixtureBuf),            'parse() reads a Buffer ok');
    t.ok(TaskpaperDocument.parse(fixtureBuf.toString()), 'parse() reads a String ok');
});
