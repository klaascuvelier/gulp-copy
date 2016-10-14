[![npm version](https://badge.fury.io/js/gulp-copy.svg)](https://badge.fury.io/js/gulp-copy)

# gulp-copy

Copy source files to new destination and use that destination as new source (for further piping).
Automatically creates needed folders before proceeding. Ability to remove 'prefixes' from path.

## Usage
```
// gulpfile.js

var gulpCopy = require('gulp-copy');
var otherGulpFunction = require('gulp-other-function');
var sourceFiles = [ 'source1/*', 'source2/*.txt' ];
var destination = 'dest/';

return gulp
    .src(sourceFiles)
    .pipe(gulpCopy(outputPath, options))
    .pipe(otherGulpFunction())
    .dest(destination);
```

### Options

prefix: integer, defining how many parts of the path (separated by /) should be removed from the original path

## Updates

See [changelog](CHANGELOG.md) for all updates.
