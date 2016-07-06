'use strict';

var through = require('through2');
var path = require('path');
var fs = require('fs');
var PluginError = require('gulp-util').PluginError;

/**
 * gulp copy method
 * @param {string} destination
 * @param {object} opts
 * @returns {object}
 */
function gulpCopy (destination, opts)
{
    // Make sure a destination was verified
    if (typeof destination !== 'string') {
        throw new PluginError('gulp-copy', 'No valid destination specified');
    }

    // Default options
    if (opts === undefined) {
        opts = opts || {};
    }
    else if (typeof opts !== 'object' || opts === null) {
        throw new PluginError('gulp-copy', 'No valid options specified');
    }

    var throughOptions = { objectMode: true };

    return through(throughOptions, transform);

    /**
     * Transform method, copies the file to its new destination
     * @param {object} file
     * @param {string} encoding
     * @param {function} cb
     */
    function transform(file, encoding, cb)
    {
        var rel = null;
        var fileDestination = null;
        var self = this;

        if (file.isStream()) {
            return cb(new PluginError('gulp-copy', 'Streaming not supported'));
        }

        if (!file.isNull()) {
            rel = path.relative(file.cwd, file.path).replace(/\\/g, '/');

            // Strip path prefixes
            if (opts.prefix) {
                var p = opts.prefix;
                while (p-- > 0) {
                    rel = rel.substring(rel.indexOf('/') + 1);
                }
            }

            fileDestination = destination + '/' + rel;

            // Make sure destination exists
            if (!fs.existsSync(fileDestination)) {
                createDestination(fileDestination.substr(0, fileDestination.lastIndexOf('/')));
            }

            // Copy the file
            copyFile(file.path, fileDestination, function (error) {
                if (error) {
                    throw new PluginError('gulp-copy', 'Could not copy file <' +  file.path + '>: ' + error.message);
                }

                // Update path for file so this path is used later on
                file.path = fileDestination;
                cb(null, file);
            });
        }
        else {
            cb(null, file);
        }
    }

    function createDestination(destination)
    {
        var folders = destination.split('/'),
            path = [],
            l = folders.length,
            i = 0;

        for (; i < l; i++) {
            path.push(folders[i]);

            if (folders[i] !== "" && !fs.existsSync(path.join('/'))) {
                try {
                    fs.mkdirSync(path.join('/'));
                } catch (error) {
                    throw new PluginError('gulp-copy', 'Could not create destination <' +  destination + '>: ' + error.message);
                }
            }
        }
    }

    function copyFile (source, target, cb)
    {
        var cbCalled = false,
            rd = fs.createReadStream(source),
            wr;

        rd.on("error", function(err) {
            done(err);
        });


        wr = fs.createWriteStream(target);

        wr.on("error", function(err) {
            done(err);
        });

        wr.on("close", function(ex) {
            done();
        });

        rd.pipe(wr);

        function done(err)
        {
            if (!cbCalled) {
                cb(err);
                cbCalled = true;
            }
        }
    }

}

module.exports = gulpCopy;