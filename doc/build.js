#!/usr/bin/env node

var Handlebars = require('handlebars');
var fs = require('fs');
var path = require('path');

// -----------------------------------------------------------------------------

doBuildReadme();
process.stdout.write('DONE\n');

// -----------------------------------------------------------------------------

// Write root README.md from README.md.hbs template
function doBuildReadme() {
    process.stdout.write('Building README.md\n');
    var readmeBuf = fs.readFileSync(__dirname + '/README.md.hbs');
    var readmeTemplate = Handlebars.compile(readmeBuf.toString());
    // Collect all example files as `[{ title: '', 'content: '' }, ...]`
    var examples = fs.readdirSync(__dirname + '/examples')
        // match only js files
        .filter(function (filePath) {
            return filePath.match(/\.js$/);
        })
        // convert file paths into template objects
        .reduce(function (list, filePath) {
            var mtch = filePath.match(/^(.*)\.js$/);
            if (mtch && mtch[1]) {
                list.push({
                    // title is extracted from file name
                    title: mtch[1].replace(/_/g, ' '),
                    // read file contents into buffer
                    content: fs.readFileSync(path.resolve(__dirname + '/examples', filePath))
                });
            }
            return list;
        }, []);

    var readmeBuilt = readmeTemplate({
        examples: examples
    });

    fs.writeFileSync(__dirname + '/../README.md', readmeBuilt);
}
