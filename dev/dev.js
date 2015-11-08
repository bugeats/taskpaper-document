var lodash = require('lodash');
var fs = require('fs');

var TaskpaperDocument = require('../index');

var parse = TaskpaperDocument.parse;
var lex = TaskpaperDocument.lex;

// var fixtureStr = fs.readFileSync(__dirname + '/../test/assets/full.taskpaper').toString();
var fixtureStr = fs.readFileSync(__dirname + '/../test/assets/fuzz1.txt').toString();
// var fixtureStr = fixtureStr.replace(/\n$/, '');


// devLexer();
// devAST();
// devJSON();
devSerialize();

// ----

function devSerialize() {
    var root = parse(fixtureStr);
    console.log(root.serialize({
        colChar: '    '
    }));
}

function devAST() {
    var root = parse(fixtureStr);
    console.log(JSON.stringify(root.dump(), null, 4));
}

function devJSON() {
    var root = parse(fixtureStr);
    console.log(JSON.stringify(root, null, 2));
}

function devLexer() {
    var tokens = lex(fixtureStr);
    tokens.forEach(function (token) {
        var val = '';
        if (!lodash.isEmpty(token.val)) {
            val = JSON.stringify(token.val || '');
        }
        console.log(lodash.padEnd(token.type, 16, ' ') + val);
    });
}

