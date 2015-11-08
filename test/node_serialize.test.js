var test = require('tape');
var fs = require('fs');

var Parser = require('../lib/parser');

assertSerialized('simple thing with tabs', [
    'Project One:',
    '\t- Task One',
    '\t- Task Two',
    ''
]);

assertSerialized('simple thing with 2x col spaces', [
    'Project One:',
    '  - Task One',
    '  - Task Two',
    ''
]);

assertSerialized('simple thing with 4x col spaces', [
    'Project One:',
    '    - Task One',
    '    - Task Two',
    ''
]);

assertSerialized('simple thing with 5x col spaces', [
    'Project One:',
    '     - Task One',
    '     - Task Two',
    ''
]);

assertSerialized('deeply nested projects', [
    'Project One:',
    '\tProject Two:',
    '\t\tProject Three:',
    '\t\tProject Four:',
    ''
]);

// TODO make this work
// assertSerialized('blank items', [
//     '- item one',
//     '-',
//     '- item two',
//     ''
// ]);

// -----------------------------------------------------------------------------

function assertSerialized(desc, lines) {
    test('Serialize: ' + desc, function (t) {
        t.plan(1);
        var str = lines.join('\n');
        var nodes = (new Parser(str)).getNodes();
        t.equal(nodes.serialize(), str);
    });
}
