var Node = require('./node');

module.exports = Node.make(Item);

function Item() {
    Node.apply(this, arguments);
}
