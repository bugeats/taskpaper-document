module.exports = Node;

function Node(value) {
    this.value = null;
    this.id = generateId();
    this.children = [];
    this.tags = [];
    this.meta = {};
    if (value) {
        this.value = value;
    }
}

// -----------------------------------------------------------------------------

// create a new subclass
Node.make = function (fn) {
    fn.prototype = Object.create(Node.prototype);
    fn.prototype.constructor = fn;
    fn.prototype.type = fn.prototype.constructor.name;
    return fn;
};

// -----------------------------------------------------------------------------

Node.prototype.type = 'Node';

Node.prototype.setMetaProp = function (prop, val) {
    this.meta[prop] = val;
};

Node.prototype.getMetaProp = function (prop) {
    return this.meta[prop];
};

// true if this node matches type
Node.prototype.is = function (type, fn) {
    if (type instanceof Array) {
        for (var i = 0; i < type.length; i++) {
            if (type[i] === this.type) {
                if (fn) fn();
                return true;
            }
        }
    } else {
        if (type === this.type) {
            if (fn) fn();
            return true;
        }
    }
    return false;
};

Node.prototype.pushChild = function (child) {
    if (!(child instanceof Node)) {
        throw new TypeError('Node#pushChild invalid child');
    }
    this.children.push(child);
    return this;
};

Node.prototype.pushTag = function (tag) {
    this.tags.push(tag);
    return this;
};

// return any properties unique to this node
Node.prototype.toData = function () {
    return {};
};

// return readable representation of the raw parse tree
Node.prototype.dump = function () {
    var data = {
        type: this.type + ' (' + this.id + ')'
    };
    if (this.value) {
        data.value = this.value;
    }
    if (this.tags.length) {
        data.tags = this.tags;
    }
    if (this.children.length) {
        data.children = this.children.map(function (child) {
            return child.dump();
        });
    }
    return data;
};

// return data used by JSON.stringify()
Node.prototype.toJSON = function () {
    var data = {};

    if (this.tags.length) {
        data.tags = this.tags;
    }

    Object.assign(data, this.toData());

    var childData = this.children.reduce(function (prev, child) {
        if (child.is('Project')) {
            prev['projects'] = prev['projects'] || [];
            prev['projects'].push(child.toJSON());
        }
        if (child.is('Item')) {
            prev['items'] = prev['items'] || [];
            prev['items'].push(child.toJSON());
        }
        if (child.is('Note')) {
            prev['notes'] = prev['notes'] || [];
            prev['notes'].push(child.toJSON());
        }
        if (child.is('Text')) {
            prev['text'] = prev['text'] || '';
            prev['text'] += child.value;
        }
        return prev;
    }, {});

    return Object.assign(data, childData);
};

// convert back to Taskpaper format
Node.prototype.serialize = function (options) {
    var opts = Object.assign({
        indent: 0,
        colChar: this.getMetaProp('colChar') || '\t'
    }, options);

    var text = '';
    var line = '';

    for (var i = 1; i < opts.indent; i++) {
        text += opts.colChar;
    }

    if (this.is('Item')) {
        text += '- ';
    }

    // recurse children
    this.children.forEach(function (child) {
        if (child.is('Text')) {
            text += child.value;
        }
        if (child.is(['Project', 'Item', 'Note'])) {
            line += child.serialize(Object.assign({}, opts, {
                indent: opts.indent + 1
            }));
        }
    });

    if (this.is('Project')) {
        text += ':\n';
    }

    if (this.is(['Item', 'Note'])) {
        text += '\n';
    }

    return text + line;
};

// -----------------------------------------------------------------------------

function generateId() {
    // TODO I don't actually understand this
    return 'xxxxxx'.replace(/[x]/g, function (c) {
        var r = ((new Date().getTime()) + Math.random() * 36) % 36 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(36);
    });
}
