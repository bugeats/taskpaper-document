var Node = require('./node');

module.exports = Node.make(Text);

function Text() {
    Node.apply(this, arguments);
}

