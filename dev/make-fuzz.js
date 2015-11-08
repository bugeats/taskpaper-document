
var delims = [
    '\n',
    '\t',
    '-',
    '- ',
    '\n- ',
    ':',
    ':\n',
    '  ',
    '\n\n',
    '@',
];

var chars = 'abcdefghijklmnopqrstuvwxyz';

times(200, function (n) {
    var indent = Array(rand(8)).join(' ');
    process.stdout.write(indent);
    process.stdout.write(randomDelim());
    times(5, function (p) {
        process.stdout.write(randomWord());
        process.stdout.write(' ');
    });
    process.stdout.write(randomDelim());

});

// -----------------------------------------------------------------------------

function rand(n) {
    return parseInt(Math.random() * n);
}

function randomWord() {
    var word = '';
    times(rand(8), function () {
        word = word + randomChar();
    });
    return word
}

function randomChar() {
    return chars[rand(chars.length)];
}

function randomDelim() {
    return delims[rand(delims.length)];
}

function times(n, fn) {
    for (var i = 1; i <= n; i++) {
        fn(i);
    }
}
