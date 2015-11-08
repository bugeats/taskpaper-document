var Node = require('./node');

module.exports = Node.make(Project);

function Project() {
    Node.apply(this, arguments);
}

