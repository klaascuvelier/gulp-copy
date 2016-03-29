var through     = require('through'),
    path        = require('path'),
    fs          = require('fs'),
    PluginError = require('gulp-util').PluginError;

module.exports = function(destination, opts) {

    if (!destination) {
        throw new PluginError('gulp-copy', 'Missing destination option for gulp-copy');
    }

    opts = opts || {};

    function copyFiles(file) {
        if (file.isNull()) return; // ignore
        if (file.isStream()) return this.emit('error', new PluginError('gulp-copy', 'Streaming not supported'));

        var rel = path.relative(file.cwd, file.path).replace(/\\/g, '/'),
            self = this,
            fileDestination;

        // Strip path prefixes
        if(opts.prefix) {
            var p = opts.prefix;
            while(p-- > 0) {
                rel = rel.substring(rel.indexOf('/') + 1);
            }
        }

        fileDestination = destination + '/' + rel;

        // Make sure destination exists
         if (!fs.existsSync(fileDestination)) {
             createDestination(fileDestination.substr(0, fileDestination.lastIndexOf('/')));
         }

        // Copy the file
        fileCount++;
        copyFile(file.path, fileDestination, function (error) {
            fileCount--;
            if (error) {
                throw new PluginError('gulp-copy', 'Could not copy file <' +  file.path + '>: ' + error.message);
            }

            // Update path for file so this path is used later on
            file.path = fileDestination;
            self.emit('data', file);
        });
    }

    var fileCount = 0; // FIXED ISSUE Last file gets lost https://github.com/klaascuvelier/gulp-copy/issues/3

    function streamEnd()
    {
        if (fileCount >0) { // Some files may be losted when emit 'end'. 
            return setTimeout(streamEnd.bind(this)); // Use process.nextTick is too fast
        }
        this.emit('end');
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

    function copyFile(source, target, cb)
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

    return through(copyFiles, streamEnd);
};
