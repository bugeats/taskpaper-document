var nodes = require('../nodes');
var Lexer = require('../lexer');

module.exports = Parser;

function Parser(str) {
    this.str = str;
    this.lexer = new Lexer(str);
    this.root = new nodes.Root();
    this.parentNode = this.root;
    this.currentNode = this.root;
    this.currentNode.parentNode = this.root;
    this.column = 0;
}

// -----------------------------------------------------------------------------

Parser.prototype = {

    getNodes: function () {
        var self = this;
        var tokens = this.lexer.getTokens();

        tokens.forEach(function (token) {
            if ('DOC_START' === token.type) {
                self.root.setMetaProp('colChar', token.colChar);
                return;
            }
            if ('PROJECT_START' === token.type) {
                self.push(new nodes.Project);
                return;
            }
            if ('ITEM_START' === token.type) {
                self.push(new nodes.Item);
                return;
            }
            if ('NOTE_START' === token.type) {
                self.push(new nodes.Note);
                return;
            }
            if ('INDENT' === token.type) {
                self.column++;
                self.parentNode = self.currentNode;
                return;
            }
            if ('DEDENT' === token.type) {
                self.column--;
                self.pop();
                return;
            }
            if (/PROJECT_END|ITEM_END|NOTE_END/.test(token.type)) {
                self.parentNode.pushChild(self.currentNode);
                return;
            }
            if ('TEXT' === token.type) {
                self.currentNode.pushChild(new nodes.Text(token.val));
                if (token.tag) {
                    self.currentNode.pushTag(token.tag);
                }
                return;
            }
            if ('BLANK' === token.type) {
                self.currentNode.pushChild(new nodes.Text('\n'));
                return;
            }
        });

        return this.root;
    },

    push: function (node) {
        this.currentNode = node;
        this.currentNode.parentNode = this.parentNode;
    },

    pop: function () {
        this.currentNode = this.currentNode.parentNode;
        this.parentNode = this.currentNode.parentNode;
    }
};

