var fs = require('fs');

var TaskpaperDocument = require('taskpaper-document');

var fileContents = fs.readFileSync('./assets/example.taskpaper');

var doc = TaskpaperDocument.from(fileContents);

doc.serialize();
