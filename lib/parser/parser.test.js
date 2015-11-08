var test = require('tape');
var fs = require('fs');

var Parser = require('./parser');

var fixtureStr = fs.readFileSync(__dirname + '/../../test/assets/full.taskpaper').toString();

test('parser smoketest', function (t) {
    t.plan(1);
    var nodes = (new Parser(fixtureStr)).getNodes();
    t.ok(nodes);
});

