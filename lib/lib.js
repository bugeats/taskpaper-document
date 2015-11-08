var Lexer = require('./lexer');
var Parser = require('./parser');
var nodes = require('./nodes');

module.exports = {

    Lexer: Lexer,
    Parser: Parser,
    nodes: nodes,

    lex: function (str) {
        return (new Lexer(str)).getTokens();
    },

    parse: function (str) {
        return (new Parser(str)).getNodes();
    }
};
