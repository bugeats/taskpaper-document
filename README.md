# taskpaper-document

A robust [Taskpaper](https://www.taskpaper.com/) parser, builder, and serializer with no external dependencies.

Written in pure ES5.  Works in node > `0.10.x` and as a browser bundle.

A project design goal is to always have input perfectly match serialized output, even for fuzzy or non-Taskpaper documents.


## Installation

    npm install taskpaper-document


### Example: Construct a new Document

```javascript
var TaskpaperDocument = require('taskpaper-document');

var doc = new TaskpaperDocument();

doc.project('A little Project').chain
    .task('A first task')
    .task('A second task');

doc.serialize();

// A little Project:
//     - A first task
//     - A second task

```


### Example: Parse an Existing Document

```javascript
var fs = require('fs');

var TaskpaperDocument = require('taskpaper-document');

var fileContents = fs.readFileSync('./assets/example.taskpaper');

var doc = TaskpaperDocument.from(fileContents);

doc.serialize();

```


## Contributing

Tests are written in [tape](https://github.com/substack/tape). Run tests with:

    npm test

All patches must pass the rules found in `eslintrc.js`.  Manually lint via:

    npm run lint

