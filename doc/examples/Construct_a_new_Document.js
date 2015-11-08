var TaskpaperDocument = require('taskpaper-document');

var doc = new TaskpaperDocument();

doc.project('A little Project').chain
    .task('A first task')
    .task('A second task');

doc.serialize();

// A little Project:
//     - A first task
//     - A second task
