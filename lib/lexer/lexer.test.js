var Lexer = require('./lexer');
var test = require('tape');

assertTokens(
    'basic project',
    [
        'Project One:',
        '\t- task one',
        '\t- task two'
    ], [
        { type: 'DOC_START', colChar: '\t' },
        'PROJECT_START',
        { type: 'TEXT', val: 'Project One' },
        'PROJECT_END',
        'INDENT',
        'ITEM_START',
        { type: 'TEXT', val: 'task one' },
        'ITEM_END',
        'ITEM_START',
        { type: 'TEXT', val: 'task two' },
        'ITEM_END',
        'DEDENT',
        'DOC_END'
    ]
);

assertTokens(
    'basic project with spaces',
    [
        'Project One:',
        '    - task one',
        '    - task two'
    ], [
        { type: 'DOC_START', colChar: '    ' },
        'PROJECT_START',
        { type: 'TEXT', val: 'Project One' },
        'PROJECT_END',
        'INDENT',
        'ITEM_START',
        { type: 'TEXT', val: 'task one' },
        'ITEM_END',
        'ITEM_START',
        { type: 'TEXT', val: 'task two' },
        'ITEM_END',
        'DEDENT',
        'DOC_END'
    ]
);

assertTokens(
    'note tags',
    [
        '@tag1 at the start with @tag2(sub something) here'
    ], [
        { type: 'DOC_START', colChar: '\t' },
        'NOTE_START',
        { type: 'TEXT', val: '@tag1', tag: 'tag1' },
        { type: 'TEXT', val: ' at the start with ' },
        { type: 'TEXT', val: '@tag2(sub something)', tag: 'tag2(sub something)' },
        { type: 'TEXT', val: ' here' },
        'NOTE_END',
        'DOC_END'
    ]
);

assertTokens(
    'note urls',
    [
        'a link here: http://example.com/?alpha=beta ok?'
    ], [
        { type: 'DOC_START', colChar: '\t' },
        'NOTE_START',
        { type: 'TEXT', val: 'a link here: ' },
        { type: 'TEXT', val: 'http://example.com/?alpha=beta', url: 'http://example.com/?alpha=beta' },
        { type: 'TEXT', val: ' ok?' },
        'NOTE_END',
        'DOC_END'
    ]
);

// ----


assertTokens(
    'crazy indenting',
    [
        'one two',
        '\t\t\t\t\t\t\t\tthree four',
        '\t\t\t\tfive six',
        '\t\t\t\t\t\tseven eight'
    ], [
        { type: 'DOC_START', colChar: '\t' },
        'NOTE_START',
        { type: 'TEXT', val: 'one two' },
        'NOTE_END',
        'INDENT', 'INDENT', 'INDENT', 'INDENT', 'INDENT', 'INDENT', 'INDENT', 'INDENT',
        'NOTE_START',
        { type: 'TEXT', val: 'three four' },
        'NOTE_END',
        'DEDENT', 'DEDENT', 'DEDENT', 'DEDENT',
        'NOTE_START',
        { type: 'TEXT', val: 'five six' },
        'NOTE_END',
        'INDENT', 'INDENT',
        'NOTE_START',
        { type: 'TEXT', val: 'seven eight' },
        'NOTE_END',
        'DEDENT', 'DEDENT', 'DEDENT', 'DEDENT', 'DEDENT', 'DEDENT',
        'DOC_END'
    ]
);

assertTokens(
    'parallel projects',
    [
        'Project One:',
        'Project Two:',
        '\tProject Three:',
        '\tProject Four:'
    ], [
        { type: 'DOC_START', colChar: '\t' },
        'PROJECT_START',
        { type: 'TEXT', val: 'Project One' },
        'PROJECT_END',
        'PROJECT_START',
        { type: 'TEXT', val: 'Project Two' },
        'PROJECT_END',
        'INDENT',
        'PROJECT_START',
        { type: 'TEXT', val: 'Project Three' },
        'PROJECT_END',
        'PROJECT_START',
        { type: 'TEXT', val: 'Project Four' },
        'PROJECT_END',
        'DEDENT',
        'DOC_END'
    ]
);

assertTokens(
    'blank lines',
    [
        'one two',
        '\tthree four',
        '',
        '',
        '',
        'five six'
    ], [
        { type: 'DOC_START', colChar: '\t' },
        'NOTE_START',
        { type: 'TEXT', val: 'one two' },
        'NOTE_END',
        'INDENT',
        'NOTE_START',
        { type: 'TEXT', val: 'three four' },
        'NOTE_END',
        'DEDENT',
        'BLANK', 'BLANK', 'BLANK',
        'NOTE_START',
        { type: 'TEXT', val: 'five six' },
        'NOTE_END',
        'DOC_END'
    ]
);

assertTokens(
    'DEDENT from root',
    [
        'Project One:',
        '\tProject Two:',
        'Project Three:'
    ], [
        { type: 'DOC_START', colChar: '\t' },
        'PROJECT_START',
        { type: 'TEXT', val: 'Project One' },
        'PROJECT_END',
        'INDENT',
        'PROJECT_START',
        { type: 'TEXT', val: 'Project Two' },
        'PROJECT_END',
        'DEDENT',
        'PROJECT_START',
        { type: 'TEXT', val: 'Project Three' },
        'PROJECT_END',
        'DOC_END'
    ]
);

// -----------------------------------------------------------------------------

function assertTokens(testDesc, lines, seq) {
    var str = lines.join('\n');
    test('Lexer tokens: ' + testDesc, function (t) {
        t.plan(1);
        var tokens = (new Lexer(str)).getTokens();
        var expected = seq.map(function (t) {
            return (typeof t === 'string') ? { type: t } : t;
        });
        t.deepEqual(tokens, expected, 'token sequence');
    });
}

