var Node = require('./node');

module.exports = Node.make(Note);

function Note() {
    Node.apply(this, arguments);
}
