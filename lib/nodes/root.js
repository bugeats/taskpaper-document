var Node = require('./node');

module.exports = Node.make(Root);

function Root() {
    Node.apply(this, arguments);
}

Root.prototype.toData = function () {
    return {
        ROOT: true
    };
};
