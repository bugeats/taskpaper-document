module.exports = Lexer;

function Lexer(str) {
    this.input = Lexer.sanitize(str);
    this.tokens = [];
    this.indentStack = [];
    this.ended = false;
    this.colPattern = /^\n([\t]*)/;
    this.colMatch = /\t{1}/g;
    this.colChar = '\t';
}

Lexer.sanitize = function (str) {
    // convert any buffer to string
    if (typeof Buffer !== 'undefined' && Buffer.isBuffer(str)) {
        str = str.toString();
    }
    str = str
        .replace(/^\uFEFF/, '') // strip any UTF-8 BOM
        .replace(/\r\n|\r/g, '\n'); // strip out Windows dumbness
    return str;
};

Lexer.prototype = {

    detectColChar: function () {
        if (this.input.match(/\n\t/)) {
            // tabs
            return;
        }
        if (this.input.match(/\n {4}/)) {
            // 4x spaces
            this.colPattern = /^\n(( {4})*)/;
            this.colMatch = / {4}/g;
            this.colChar = '    ';
            return;
        }
        if (this.input.match(/\n {2}/)) {
            // 2x spaces
            this.colPattern = /^\n(( {2})*)/;
            this.colMatch = / {2}/g;
            this.colChar = '  ';
            return;
        }
    },

    getTokens: function () {
        this.detectColChar();
        this.pushToken('DOC_START', null, {
            colChar: this.colChar
        });
        while (!this.ended) {
            this.advance();
        }
        return JSON.parse(JSON.stringify(this.tokens));
    },

    advance: function () {
        return this.blank()
            || this.indent()
            || this.end()
            || this.project()
            || this.item()
            || this.note()
            || this.fail();
    },

    fail: function () {
        var location = '"' + this.input.substr(0, 80) + '"';
        throw new Error('Lexer failed at: ' + location);
    },

    pushToken: function (type, val, extra) {
        var token = (val === undefined || val === null) ?
            { type: type } :
            { type: type, val: val };
        Object.assign(token, extra);
        this.tokens.push(token);
    },

    // attempt to consume the given pattern
    capture: function (pattern, patternGroupIndex, fn) {
        var captured = pattern.exec(this.input);
        if (captured) {
            // consume the only the specified group
            this.input = this.input.substr(captured[patternGroupIndex].length);
            fn.call(this, captured);
            return true;
        }
        return false;
    },

    unwindIndentStack: function () {
        var p = this.indentStack.pop();
        while (p) {
            this.pushToken('DEDENT');
            p = this.indentStack.pop();
        }
    },

    lineExtract: function (line) {
        var self = this;
        var matchTag = /@[^\s\n\t]*\([^\)]+\)|@[^\s\n\t]*/;
        // TODO proper url regex
        var matchUrl = /http[^ ]+/;
        chopLineByPattern(line, matchTag, function (tag) {
            self.pushToken('TEXT', tag, {
                tag: tag.replace(/^@/, '')
            });
        }, function (text) {
            chopLineByPattern(text, matchUrl, function (url) {
                self.pushToken('TEXT', url, {
                    url: url
                });
            }, function (text) {
                self.pushToken('TEXT', text);
            });
        });
    },

    // ----

    blank: function () {
        return this.capture(/^\n(\n)/, 1, function (cap) {
            this.unwindIndentStack();
            this.pushToken('BLANK');
        });
    },

    indent: function () {
        return this.capture(this.colPattern, 0, function (cap) {
            var indents = cap[1].match(this.colMatch) || [];
            var delta = indents.length - this.indentStack.length;
            if (delta > 0) {
                for (var i = 0; i < delta; i++) {
                    this.pushToken('INDENT');
                    this.indentStack.push(indents.pop());
                }
            } else if (delta < 0) {
                for (var i = 0; i > delta; i--) {
                    this.pushToken('DEDENT');
                    this.indentStack.pop();
                }
            }
        });
    },

    end: function () {
        if (this.input.length) return false;
        this.unwindIndentStack(); // implicit
        this.pushToken('DOC_END');
        this.ended = true;
        return true;
    },

    item: function () {
        return this.capture(/^([-]+[\s]*([^\n]+))(\n|$)/, 1, function (cap) {
            this.pushToken('ITEM_START');
            this.lineExtract(cap[2]);
            this.pushToken('ITEM_END');
        });
    },

    project: function () {
        return this.capture(/^(([^\n\t]+):)(\n|$)/, 1, function (cap) {
            this.pushToken('PROJECT_START');
            this.lineExtract(cap[2]);
            this.pushToken('PROJECT_END');
        });
    },

    note: function () {
        return this.capture(/^(([^\n]+))(\n|$)/, 1, function (cap) {
            this.pushToken('NOTE_START');
            this.lineExtract(cap[2]);
            this.pushToken('NOTE_END');
        });
    }

};

// -----------------------------------------------------------------------------

// crawl the given string, calling back pattern matches and misses
function chopLineByPattern(str, regex, onMatch, onMiss) {
    while (str) {
        var match = regex.exec(str);
        if (match && match.index) {
            var text = str.substr(0, match.index);
            onMiss(text);
            str = str.substr(match.index);
        } else if (match) {
            var tag = str.substr(0, match[0].length);
            onMatch(tag);
            str = str.substr(match[0].length);
        } else {
            onMiss(str);
            str = null;
        }
    }
}

